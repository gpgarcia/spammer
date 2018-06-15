using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.WebSockets;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;

namespace Chat
{
  public class EchoHandlerMiddleware
  {
    //  https://docs.microsoft.com/en-us/aspnet/core/migration/http-modules?view=aspnetcore-2.0
    private readonly RequestDelegate mNext;

    public EchoHandlerMiddleware(RequestDelegate next)
    {
      mNext = next;
    }

    public async Task Invoke(HttpContext context)
    {
      if (context.WebSockets.IsWebSocketRequest)
      {
        //Handle WebSocket Requests here.
        var webSocket = await context.WebSockets.AcceptWebSocketAsync();
        await Echo(context, webSocket);
      }
    }

    private async Task Echo(HttpContext context, WebSocket webSocket)
    {
      var buffer = new byte[4 * 1024];
      var rcvSegment = new ArraySegment<byte>(buffer);
      var result = await webSocket.ReceiveAsync(rcvSegment, CancellationToken.None);
      while (!result.CloseStatus.HasValue)
      {
        var sendSegment = new ArraySegment<byte>(buffer, 0, result.Count);
        await webSocket.SendAsync(sendSegment, result.MessageType, result.EndOfMessage, CancellationToken.None);
        result = await webSocket.ReceiveAsync(rcvSegment, CancellationToken.None);
      }
      await webSocket.CloseAsync(result.CloseStatus.Value, result.CloseStatusDescription, CancellationToken.None);
    }
  }

  public static class EchoHandlerExtensions
  {
    public static IApplicationBuilder UseEchoHandler(this IApplicationBuilder builder)
    {
      return builder.UseMiddleware<EchoHandlerMiddleware>();
    }
  }
}
