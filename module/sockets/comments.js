import Comments from "../db/postgres/Comments.js";

let comments = new Comments();

export default function(socket, io) {
    let room;
    socket.on('load-request', async (id) => {
        let commentsList = await comments.loadComments(id);
        socket.join(`rent${id}`)
        room = Array.from(socket.rooms.entries())[1][0];
        socket.emit('load-result', commentsList);
    })
    socket.on('add-comment', async (comment) => {
        let result = await comments.addComment(comment);
        io.to(room).emit('add-result', result)
    })
    socket.on('comment-edit', async (obj) => {
        await comments.editComment(obj);
        io.to(room).emit('edit-result', obj);
    })
    socket.on('comment-delete', async ({id, index}) => {
        await comments.deleteComment(id);
        io.to(room).emit('delete-result', index);
    })
}