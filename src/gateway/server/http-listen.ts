import type { Server as HttpServer } from "node:http";
import { GatewayLockError } from "../../infra/gateway-lock.js";

const MAX_BIND_RETRIES = 10;
const BIND_RETRY_DELAY_MS = 1000;

async function tryBind(httpServer: HttpServer, bindHost: string, port: number): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    const onError = (err: NodeJS.ErrnoException) => {
      httpServer.off("listening", onListening);
      reject(err);
    };
    const onListening = () => {
      httpServer.off("error", onError);
      resolve();
    };
    httpServer.once("error", onError);
    httpServer.once("listening", onListening);
    httpServer.listen(port, bindHost);
  });
}

export async function listenGatewayHttpServer(params: {
  httpServer: HttpServer;
  bindHost: string;
  port: number;
}) {
  const { httpServer, bindHost, port } = params;

  let lastErr: unknown;
  for (let attempt = 0; attempt < MAX_BIND_RETRIES; attempt++) {
    try {
      await tryBind(httpServer, bindHost, port);
      return; // Success
    } catch (err) {
      lastErr = err;
      const code = (err as NodeJS.ErrnoException).code;
      if (code === "EADDRINUSE" && attempt < MAX_BIND_RETRIES - 1) {
        // Port temporarily in use (e.g., cloudflared connecting before we bind)
        // Wait and retry
        await new Promise((r) => setTimeout(r, BIND_RETRY_DELAY_MS));
        continue;
      }
      break;
    }
  }

  const code = (lastErr as NodeJS.ErrnoException)?.code;
  if (code === "EADDRINUSE") {
    throw new GatewayLockError(
      `another gateway instance is already listening on ws://${bindHost}:${port}`,
      lastErr,
    );
  }
  throw new GatewayLockError(
    `failed to bind gateway socket on ws://${bindHost}:${port}: ${String(lastErr)}`,
    lastErr,
  );
}
