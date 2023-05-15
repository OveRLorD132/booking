import server from "../../app.js";
import { Server } from "socket.io";

import rentAdd from "./rent-add.js";

import comments from "./comments.js";

export default function socketConnect() {
    let io = new Server(server);
    console.log(io);
    io.on('connection', (socket) => {
        rentAdd(socket);
        comments(socket, io);
    })
};


