import { WebSocketServer } from "ws";
const wss = new WebSocketServer({
    port: 8080,
});
export const broadcast = (data) => {
    wss.clients.forEach((client) => {
        if (client.readyState === 1) {
            client.send(JSON.stringify(data));
        }
    });
};
//# sourceMappingURL=index.js.map