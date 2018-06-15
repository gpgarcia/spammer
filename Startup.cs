using System;
using System.IO;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace Chat
{
  public class Startup
  {
    // This method gets called by the runtime. Use this method to add services to the container.
    // For more information on how to configure your application, visit https://go.microsoft.com/fwlink/?LinkID=398940
    public void ConfigureServices(IServiceCollection services)
    {
      services.AddCors();
    }

    // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
    public void Configure(IApplicationBuilder app, IHostingEnvironment env)
    {
      if (env.IsDevelopment())
      {
        app.UseDeveloperExceptionPage();
      }
      var webSocketOptions = new WebSocketOptions()
      {
        KeepAliveInterval = TimeSpan.FromSeconds(120),
        ReceiveBufferSize = 4 * 1024
      };

      app.UseWebSockets(webSocketOptions);

      app.MapWhen(
        context => //context.Request.Protocol.StartsWith("ws") &&
                   context.Request.Path.ToString().EndsWith("wsEcho"),
        appBranch => {
          // ... optionally add more middleware to this branch
          appBranch.UseEchoHandler();
        });
        app.MapWhen(
        context => //context.Request.Protocol.StartsWith("ws") &&
                   context.Request.Path.ToString().EndsWith("wsChat"),
        appBranch => {
          appBranch.UseChatHandler();
        });
        app.Use(async (context, next) => 
        { 
            await next(); 
            if (context.Response.StatusCode == 404 && !Path.HasExtension(context.Request.Path.Value)) 
            { 
                context.Request.Path = "/index.html"; 
                await next(); 
            } 
        });
        app.UseDefaultFiles();
        app.UseStaticFiles();

        app.UseCors(builder =>builder.AllowAnyOrigin()
                                     .AllowAnyMethod()
                                     .AllowAnyHeader()
                                     .Build()
        );
    }
  }
}
