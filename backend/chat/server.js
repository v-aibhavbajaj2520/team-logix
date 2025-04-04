const WebSocket = require('ws');
const server = new WebSocket.Server({ port: 4000 });


server.on('connection', socket => {
    console.log('A user connected');

    socket.on('message', message => {
        console.log('Received:', message);

        // Ensure message is parsed and broadcast as JSON
        try {
            const data = JSON.parse(message);
            const formattedMessage = JSON.stringify({ sender: data.sender, text: data.text });

            server.clients.forEach(client => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(formattedMessage);
                }
            });
        } catch (error) {
            console.error("Invalid message format:", error);
        }
    });

    socket.on('close', () => {
        console.log('A user disconnected');
    });
});

console.log("WebSocket server is running on ws://localhost:4000");
