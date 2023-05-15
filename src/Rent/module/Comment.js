export default class Comment {
    constructor(obj) {
        for(let key in obj) {
            this[key] = obj[key];
        }
    }
    emitEditing(socket, text, id, rating, rent_id) {
        socket.emit('comment-edit', {text, id, rating, rent_id});
    }
    editComment(text, rating) {
        this.text = text;
        this.rating = rating;
    }
    emitDeleting(socket, id, index, rent_id) {
        socket.emit('comment-delete', { id, index, rent_id });
    }
}