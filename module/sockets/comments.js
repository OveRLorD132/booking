import CommentsRepository from "../db/postgres/comments-repository.js";

let commentsRepository = new CommentsRepository();

export default function(socket) {
    socket.on('load-request', async (id) => {
        let comments = await commentsRepository.loadComments(id);
        socket.emit('load-result', comments);
    })
    socket.on('add-comment', async (comment) => {
        comment = await commentsRepository.addComment(comment);
        socket.emit('comment-added', comment)
    })
}