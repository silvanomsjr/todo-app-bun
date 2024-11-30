import { userRoutes } from "./routes/userRoutes";
import AuthorizationMiddleware from "./middlewares/authorization";

const routes: Record<string, Record<string, Function>> = {
  ...userRoutes,
};

const server = Bun.serve({
  port: 3030,
  async fetch(req) {
    const url = new URL(req.url);
    const pathname = url.pathname;
    const method = req.method.toUpperCase();
    const routeHandler = routes[pathname];

    if (routeHandler) {
      if (!["/login", "/register"].includes(pathname)) {
        const auth = AuthorizationMiddleware(req);
        if (auth?.status != 200) {
          return new Response(
            JSON.stringify({
              error: auth.message,
            }),
            {
              status: auth.status,
            },
          );
        }
      }
      return routeHandler[method](req);
    }

    return new Response("Nada encontrado", { status: 404 });
  },
});

console.log(`https://localhost:${server.port} is running!`);
