globalThis.usersOnline = {};

import Conversations from "../db/postgres/Conversations.js";

let conversations = new Conversations();

export default function (socket, io) {
  socket.on("online", async () => {
    if (
      socket.request.session.passport &&
      socket.request.session.passport.user
    ) {
      usersOnline[socket.id] = socket.request.session.passport.user;
      let userConversations = await conversations.loadConversations(
        socket.request.session.passport.user
      );
      for (let conv of userConversations)
        io.to(`Conversation_${conv.id}`).emit(
          "user-online",
          socket.request.session.passport.user
        );
    }
  });
  socket.on("disconnect", async () => {
    if (
      socket.request.session.passport &&
      socket.request.session.passport.user
    ) {
      delete usersOnline[socket.id];
      let userConversations = await conversations.loadConversations(
        socket.request.session.passport.user
      );
      for (let key in usersOnline) {
        if (usersOnline[key] == socket.request.session.passport.user) return;
      }
      for (let conv of userConversations) {
        io.to(`Conversation_${conv.id}`).emit(
          "user-disconnect",
          socket.request.session.passport.user
        );
      }
    }
  });
  socket.on("is-online", (id) => {
    for (let key in usersOnline) {
      if (usersOnline[key] == id) {
        socket.emit("user-online", id);
        return;
      }
    }
    socket.emit("user-online", false);
  });
}
