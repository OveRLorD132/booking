import Rent from "../db/postgres/Rent.js";

let rent = new Rent();

export default function rentAdd(socket) {
    emitList(socket);
}

async function emitList(socket) {
    try {
        let rentList = await rent.loadList();
        console.log(rentList);
        socket.emit('load-list', rentList.rows);
    } catch(err) {
        console.error(err);
    }
}