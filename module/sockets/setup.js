import server from "../../app.js";
import { Server } from "socket.io";

import rentAdd from "./rent-add.js";

import sessionSetup from "../authentication/session-setup.js";

import comments from "./comments.js";

import conversations from "./conversations.js";

import connection from "./connection.js";

export default function socketConnect() {
    let io = new Server(server);
    io.use((socket, next) => sessionSetup(socket.request, {}, next))
    io.on('connection', (socket) => {
        rentAdd(socket);
        comments(socket, io);
        conversations(socket, io);
        connection(socket, io);
    })
};


