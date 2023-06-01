function validateAddress(address) {
  if(!address) throw new Error(`This field mustn't be empty.`)
  if(address.length > 100) throw new Error('Address is too long.');
}

function validateDescription(description) {
  if(!description) throw new Error(`Description field mustn't be empty.`)
  if(description.length > 1000) throw new Error('Description is too long. Maximum is 1000 symbols.');
}

function validateHeader(header) {
  if(!header) throw new Error(`Header field mustn't be empty.`)
  if(header.length > 50) throw new Error('Header is too long.');
}

let typesAllowed = ['Apartments', 'House', 'Room', 'Villa', 'Penthouse', 'Duplex', 'Guesthouse'];

function validateType(type) {
  if(!type) throw new Error(`Type field mustn't be empty.`)
  if(!typesAllowed.some((allowedType) => allowedType === type)) throw new Error('Unknown type.');
}

function validatePrice(price) {
  if(!price) throw new Error(`Price field mustn't be empty.`)
  if(price.length > 50) throw new Error('Sum is too long.');
  if(!/^[0-9]+$/.test(price)) throw new Error('Invalid format.');
}

export default {
  validateAddress,
  validateDescription,
  validateHeader,
  validatePrice,
  validateType
}