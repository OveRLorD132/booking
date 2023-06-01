export default class Comment {
    constructor(obj) {
        for(let key in obj) {
            this[key] = obj[key];
        }
    }
    emitEditing(socket, text, id, rating) {
        socket.emit('comment-edit', {text, id, rating});
    }
    editComment(text, rating) {
        this.text = text;
        this.rating = rating;
    }
    emitDeleting(socket, id, index) {
        socket.emit('comment-delete', { id, index});
    }
}