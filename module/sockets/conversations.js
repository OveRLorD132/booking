import Conversations from "../db/postgres/Conversations.js";

let conversations = new Conversations();

import Messages from "../db/postgres/Messages.js";

export default function (socket, io) {
  socket.on("new-message", async (message) => {
    if (message.sender_id === message.receiver_id) return;
    if(message.text.length > 300) {
      socket.emit('message-error', `Message is too long`);
      return;
    }
    if (
      socket.request.session.passport &&
      socket.request.session.passport.user
    ) {
      let conversation;
      if (
        await conversations.checkConversation(
          socket.request.session.passport.user,
          message.receiver_id
        )
      ) {
        conversation = await conversations.getConversation(
          socket.request.session.passport.user,
          message.receiver_id
        );
      } else {
        conversation = await conversations.createConversation(
          socket.request.session.passport.user,
          message.receiver_id
        );
        conversation = await conversations.getConversationById(conversation);
        socket.emit("conv-check-result", conversation);
      }
      message = await Messages.prototype.addMessage(
        message.text,
        socket.request.session.passport.user,
        conversation.id
      );
      io.to(`Conversation_${conversation.id}`).emit(
        "conversation-message-input",
        message
      );
    }
  });
  socket.on("messages-load", async (conv_id) => {
    if (
      socket.request.session.passport &&
      socket.request.session.passport.user
    ) {
      let conversation = await conversations.getConversationById(conv_id);
      if (
        conversation.user1_id === socket.request.session.passport.user ||
        conversation.user2_id === socket.request.session.passport.user
      ) {
        let loadedMessages = await Messages.prototype.loadMessages(conv_id);
        let conversationRooms = Array.from(socket.rooms).filter(
          (elem) => elem !== socket.id
        );
        conversationRooms.forEach((elem) => socket.leave(elem));
        socket.join(`Conversation_${conversation.id}`);
        socket.emit("message-load-result", loadedMessages);
      }
    }
  });
  socket.on("conversation-message", async (message) => {
    if (!message) return;
    if (
      socket.request.session.passport &&
      socket.request.session.passport.user
    ) {
      let rooms = Array.from(socket.rooms).filter((elem) => elem !== socket.id);
      let conversationRoom = rooms.filter((elem) => /Conversation/.test(elem));
      let conversation_id = conversationRoom[0].replace("Conversation_", "");
      message = await Messages.prototype.addMessage(
        message,
        socket.request.session.passport.user,
        conversation_id
      );
      io.to(conversationRoom[0]).emit("conversation-message-input", message);
    }
  });
  socket.on("conv-check", async (id) => {
    if (
      socket.request.session.passport &&
      socket.request.session.passport.user
    ) {
      if (
        await conversations.checkConversation(
          id,
          socket.request.session.passport.user
        )
      ) {
        try {
          let conversation = await conversations.getConversation(
            id,
            socket.request.session.passport.user
          );
          socket.emit("conv-check-result", conversation);
        } catch (err) {
          console.error(err);
        }
      }
    }
  });
  socket.on('message-changed', async (message) => {
    if (
      socket.request.session.passport &&
      socket.request.session.passport.user
    ) {
      try {
        if(!message.text || message.text.trim() === '') {
          socket.emit('message-error', `Message mustn't be empty`);
          return;
        } if(message.text.length > 300) {
          socket.emit('message-error', `Message is too long`);
          return;
        }
        let id = await Messages.prototype.getMessage(message.id);
        if (id === socket.request.session.passport.user) {
          await Messages.prototype.editMessage(message.id, message.text)
          let rooms = Array.from(socket.rooms).filter((elem) => elem !== socket.id);
          let conversationRoom = rooms.filter((elem) => /Conversation/.test(elem));
          io.to(conversationRoom[0]).emit('message-change-result', message);
        } else return;
      } catch(err) {
        console.error(err);
      }
    }
  })
  socket.on('message-delete', async (id) => {
    if (
      socket.request.session.passport &&
      socket.request.session.passport.user
    ) {
      try {
        let user_id = await Messages.prototype.getMessage(id);
        if (user_id === socket.request.session.passport.user) {
          await Messages.prototype.deleteMessage(id);
          let rooms = Array.from(socket.rooms).filter((elem) => elem !== socket.id);
          let conversationRoom = rooms.filter((elem) => /Conversation/.test(elem));
          io.to(conversationRoom[0]).emit('message-delete-result', id);
        } else return;
      } catch(err) {
        console.error(err);
      }
    }
  })
  socket.on('conversation-name-change', async (conversation) => {
    if (
      socket.request.session.passport &&
      socket.request.session.passport.user
    ) {
      if(conversation.name && conversation.name.length > 20) return;
      let loadedConversation = await conversations.getConversationById(conversation.id);
      if(loadedConversation.user1_id !== socket.request.session.passport.user && 
        loadedConversation.user2_id !== socket.request.session.passport.user) return;
      await conversations.editConversationName(conversation.name, conversation.id);
      for(let key in usersOnline) {
        if(usersOnline[key] == loadedConversation.user1_id ||
          usersOnline[key] == loadedConversation.user2_id) io.to(key).emit('name-change-result', conversation);
      }
    }
  })
}
