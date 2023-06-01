import Users from "../db/postgres/Users.js";

let users = new Users();

export default async function(changeObj, id, doneObj) {
  for(let key in changeObj) {
    if(!changeObj[key]) delete changeObj[key];
  }
  if(!Object.keys(changeObj).length) throw new Error('Invalid Input');
  try {
    for(let key in changeObj) {
      await users.changeUserProperty(key, changeObj[key], id);
      doneObj[key] = changeObj[key];
    }
  } catch(err) {
    throw err;
  }
}