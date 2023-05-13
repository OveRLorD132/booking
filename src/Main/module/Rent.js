export default class Rent {
    constructor(obj) {
        for(let key in obj) {
            this[key] = obj[key];
        }
    }
}