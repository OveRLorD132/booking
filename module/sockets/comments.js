import CommentsRepository from "../db/postgres/comments-repository.js";

let commentsRepository = new CommentsRepository();

export default function(socket, io) {
    let room;
    socket.on('load-request', async (id) => {
        let comments = await commentsRepository.loadComments(id);
        socket.join(`rent${id}`)
        room = Array.from(socket.rooms.entries())[1][0];
        socket.emit('load-result', comments);
    })
    socket.on('add-comment', async (comment) => {
        let result = await commentsRepository.addComment(comment);
        io.to(room).emit('add-result', result)
    })
    socket.on('comment-edit', async (obj) => {
        let rating = await commentsRepository.editComment(obj);
        obj.rent_rating = rating;
        io.to(room).emit('edit-result', obj);
    })
    socket.on('comment-delete', async ({id, index, rent_id}) => {
        let rating = await commentsRepository.deleteComment(id, rent_id);
        io.to(room).emit('delete-result', {index, rating});
    })
}