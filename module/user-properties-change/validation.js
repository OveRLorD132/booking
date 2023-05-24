function validateUsername(username) {
  if(!username) return;
  if(username.length < 8) throw new Error('Username must be at least 8 symbols.');
  if(username.length > 20) throw new Error('Your username is too long.');
  return;
}

function validateFirstName(first_name) {
  if(!first_name) return;
  if(first_name.length >= 100) throw new Error('Your name is too long.');
  return;
}

function validateLastName(last_name) {
  if(!last_name) return;
  if(last_name.length >= 100) throw new Error('Your name is too long.');
  return;
}

function validateGender(gender) {
  if(!gender) return;
  if(gender.toLowerCase() !== 'male' || gender.toLowerCase() !== 'female') throw new Error('Invalid gender.')
}

function validateEmail(email) {
  if(!email) return;
  if(!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) throw new Error('Invalid email format.');
  if(email.length > 50) throw new Error('Email is too long.');
  return;
}

function validatePhoneNumber(number) {
  if(!number) return;
  if(!/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/.test(number)) throw new Error('Invalid phone number format.');
  return;
}

function validateCountry(country) {
  if(!country) return;
  if(country.length >= 200) throw new Error(`Country name is too long.`);
  return;
}
 
export default { 
  validateUsername, 
  validateFirstName, 
  validateLastName, 
  validateGender, 
  validateEmail, 
  validatePhoneNumber,
  validateCountry
};