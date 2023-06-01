import Rent from "../db/postgres/Rent.js";

let rent = new Rent();

export default async function(obj, id, doneObj) {
  for(let key in obj) {
    if(!obj[key]) delete obj[key];
  }
  if(!Object.keys(obj).length) throw new Error('Invalid input.');
  try {
    for(let key in obj) {
      if(key == 'addressLine') doneObj[key] = await rent.changeAddressLine(id, obj.addressLine);
      else doneObj[key] = await rent.changeRentProperty(key, obj[key], id)
    }
  } catch(err) {
    throw err;
  }
}