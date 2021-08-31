import http from "."

(function(ctx) {
  //make a state manager
  const stateManager = new http.StateManager(ctx, ctx.localStorage);

  //@ts-ignore
  http.createServer = function(handler: Function) {
    return stateManager.add(handler, false);
  }

  //@ts-ignore open it up
  ctx.http = http
})(window)
