import RentRepostitory from "../db/postgres/rent-repository.js";

let rentRepository = new RentRepostitory();

export default function rentAdd(socket) {
    emitList(socket);
    socket.on('rent-add', (rent) => {
        let { price, description, adress, type, title} = rent;
        rentRepository.addRent({ price, description, adress, type, title });
        socket.emit('rent-added', { price, description, adress, type, title});
    })
}

async function emitList(socket) {
    try {
        let rentList = await rentRepository.loadList();
        console.log(rentList);
        socket.emit('load-list', rentList.rows);
    } catch(err) {
        console.error(err);
    }
}