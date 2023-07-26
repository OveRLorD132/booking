import server from "../../app.js";
import { Server } from "socket.io";

import sessionSetup from "../authentication/session-setup.js";

import conversations from "./conversations.js";

import connection from "./connection.js";

import notifications from "./notifications.js";

export default function socketConnect() {
    let io = new Server(server);
    io.use((socket, next) => sessionSetup(socket.request, {}, next))
    io.on('connection', (socket) => {
        conversations(socket, io);
        connection(socket, io);
        notifications(socket, io);
    })
};


