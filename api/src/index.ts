import { userRoutes } from "./routes/userRoutes";
import AuthorizationMiddleware from "./middlewares/authorization";

const CORSHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "*",
};

const routes: Record<string, Record<string, Function>> = {
  ...userRoutes,
};

const server = Bun.serve({
  port: process.env.API_PORT,
  async fetch(req) {
    const url = new URL(req.url);
    const pathname = url.pathname;
    const method = req.method.toUpperCase();
    console.log("Method: ", method);
    if (method == "OPTIONS") {
      return new Response("Ok", { headers: { ...CORSHeaders } });
    }
    const routeHandler = routes[pathname];
    console.log("routeHandler: ", routeHandler);

    if (routeHandler) {
      if (!["/login", "/register", "/forgot-password"].includes(pathname)) {
        const auth = AuthorizationMiddleware(req);
        if (auth?.status != 200) {
          return new Response(
            JSON.stringify({
              error: auth.message,
            }),
            {
              headers: { ...CORSHeaders },
              status: auth.status,
            },
          );
        }
      }
      if (routeHandler[method]) {
        return routeHandler[method](req);
      }
    }

    return new Response("Nada encontrado", {
      headers: {
        ...CORSHeaders,
      },
      status: 404,
    });
  },
});

console.log(`https://localhost:${server.port} is running!`);
