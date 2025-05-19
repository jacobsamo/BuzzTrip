import { Env } from "@/common/types";
import { DurableObject } from "cloudflare:workers";
import { Hono } from "hono";

type UserLocation = {
  lat: number;
  lng: number;
};

enum EventTypes {
  LOCATION_UPDATED = "LOCATION_UPDATED",
  USER_DISCONNECT = "USER_DISCONNECT",
  SESSION_ID = "SESSION_ID",
}

export class MapsDurableObject extends DurableObject<Env> {
  // Hono application instance for serving routes
  private app: Hono = new Hono();
  // Connection between the connected client (e.g. browser) and the current durable object (this)
  private connections = new Map<string, WebSocket>();
  // Store the user locations if the map is has been setup to share user locations
  private userLocations = new Map<string, UserLocation>(); // future

  constructor(ctx: DurableObjectState, env: Env) {
    super(ctx, env);
  }

  async webSocketMessage(ws: WebSocket, message: any) {
    try {
      const data = JSON.parse(typeof message === "string" ? message : "{}");
      const { type, lat, lng } = data;

      if (type === "LOCATION_UPDATED") {
        let senderConnectionId: string | undefined;
        for (const [id, socket] of this.connections.entries()) {
          if (socket === ws) {
            senderConnectionId = id;
            break;
          }
        }

        if (!senderConnectionId) return;

        // Update cursor position
        this.userLocations.set(senderConnectionId, { lat, lng });

        // Broadcast cursor position (existing code)
        const updateMessage = JSON.stringify({
          type: EventTypes.LOCATION_UPDATED,
          userId: senderConnectionId,
          lat,
          lng,
        });

        for (const [id, socket] of this.connections.entries()) {
          if (id !== senderConnectionId) {
            socket.send(updateMessage);
          }
        }
      }
    } catch (error) {
      console.error("Error processing WebSocket message:", error);
    }
  }

  async webSocketClose(
    ws: WebSocket,
    code: number,
    reason: string,
    wasClean: boolean
  ) {
    // Find and remove the closed connection
    let disconnectedId: string | undefined;
    for (const [id, socket] of this.connections.entries()) {
      if (socket === ws) {
        disconnectedId = id;
        // Remove the user from our connections map
        this.connections.delete(id);
        // Remove their cursor position and delete their score
        this.userLocations.delete(id);
        break;
      }
    }

    // Notify other clients about the disconnection
    if (disconnectedId) {
      const disconnectMessage = JSON.stringify({
        type: EventTypes.USER_DISCONNECT,
        userId: disconnectedId,
      });

      for (const socket of this.connections.values()) {
        socket.send(disconnectMessage);
      }
    }

    ws.close(code, "Durable Object is closing WebSocket");
  }

  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/ws") {
      const webSocketPair = new WebSocketPair();
      const [client, server] = Object.values(webSocketPair);

      const connectionId = crypto.randomUUID();
      this.connections.set(connectionId, server);
      this.ctx.acceptWebSocket(server);

      // Send the session ID to the client immediately after connection
      server.send(
        JSON.stringify({
          type: EventTypes.SESSION_ID,
          sessionId: connectionId,
        })
      );

      return new Response(null, {
        status: 101,
        webSocket: client,
      });
    }

    return this.app.fetch(request);
  }
}
