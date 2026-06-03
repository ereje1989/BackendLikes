import { WebSocketServer } from "ws";
import type { IBroadcast } from "../types/index.js";


const wss = new WebSocketServer({
    port: 8080,
});

export const broadcast = (data: IBroadcast) => {
    wss.clients.forEach((client) => {
        if (client.readyState === 1) {
            client.send(JSON.stringify(data));
        }
    });
};
