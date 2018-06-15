using System;
using System.Collections.Concurrent;
using System.IO;
using System.Net.WebSockets;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Builder;

namespace Chat
{
  public class ChatWebSocketMiddleware
  {
    private static ConcurrentDictionary<string, WebSocket> mSockets = new ConcurrentDictionary<string, WebSocket>();

    private readonly RequestDelegate mNext;

    public ChatWebSocketMiddleware(RequestDelegate next)
    {
      mNext = next;
    }

    public async Task Invoke(HttpContext context)
    {
      if (!context.WebSockets.IsWebSocketRequest)
      {
        await mNext.Invoke(context);
        return;
      }

      CancellationToken ct = context.RequestAborted;
      WebSocket currentSocket = await context.WebSockets.AcceptWebSocketAsync();
      var socketId = Guid.NewGuid().ToString();

      mSockets.TryAdd(socketId, currentSocket);

      while (true)
      {
        if (ct.IsCancellationRequested)
        {
          break;
        }

        var response = await ReceiveStringAsync(currentSocket, ct);
        if (string.IsNullOrEmpty(response))
        {
          if (currentSocket.State != WebSocketState.Open)
          {
            break;
          }

          continue;
        }

        foreach (var socket in mSockets)
        {
          if (socket.Value.State != WebSocketState.Open)
          {
            continue;
          }

          await SendStringAsync(socket.Value, response, ct);
        }
      }

      WebSocket dummy;
      mSockets.TryRemove(socketId, out dummy);

      await currentSocket.CloseAsync(WebSocketCloseStatus.NormalClosure, "Closing", ct);
      currentSocket.Dispose();
    }

    private static Task SendStringAsync(WebSocket socket, string data, CancellationToken ct = default(CancellationToken))
    {
      var buffer = Encoding.UTF8.GetBytes(data);
      var segment = new ArraySegment<byte>(buffer);
      return socket.SendAsync(segment, WebSocketMessageType.Text, true, ct);
    }

    private static async Task<string> ReceiveStringAsync(WebSocket socket, CancellationToken ct = default(CancellationToken))
    {
      var buffer = new ArraySegment<byte>(new byte[8192]);
      using (var ms = new MemoryStream())
      {
        WebSocketReceiveResult result;
        do
        {
          ct.ThrowIfCancellationRequested();

          result = await socket.ReceiveAsync(buffer, ct);
          ms.Write(buffer.Array, buffer.Offset, result.Count);
        }
        while (!result.EndOfMessage);

        ms.Seek(0, SeekOrigin.Begin);
        if (result.MessageType != WebSocketMessageType.Text)
        {
          return null;
        }

        // Encoding UTF8: https://tools.ietf.org/html/rfc6455#section-5.6
        using (var reader = new StreamReader(ms, Encoding.UTF8))
        {
          return await reader.ReadToEndAsync();
        }
      }
    }
  }
  public static class ChatHandlerExtensions
  {
    public static IApplicationBuilder UseChatHandler(this IApplicationBuilder builder)
    {
      return builder.UseMiddleware<ChatWebSocketMiddleware>();
    }
  }
}
