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
  if(gender !== 'Male' && gender !== 'Female' && gender !== 'Not selected') throw new Error('Invalid gender.')
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

import countriesList from './countries-list.js';

function validateCountry(country) {
  if(!country) return;
  if(country === '--Select country--') return;
  if(!countriesList.some((elem) => elem === country)) throw new Error('Invalid country.');
  return;
}

import passwordCheck from './password-check.js';

function validatePassword(password) {
  if(password.length > 20) throw new Error('Password is too long.'); 
  if(passwordCheck(passwordCheck) === 'Weak') throw new Error('Your password is too weak.')
  return;
}

function validateDescription(description) {
  if(!description) return;
  if(description.length > 250) throw new Error('Description is too long. 250 symbols is maximum.');
  return;
}

function validateBirthDate(date) {
  if(!date) return;
  if(isNaN(Date.parse(date))) throw new Error('Invalid date format');
  if(!isNaN(Date.parse(date))) date = new Date(Date.parse(date));
  if(date.getFullYear() > new Date().getFullYear()) throw new Error('Invalid birth date');
  if(date.getFullYear() === new Date().getFullYear() 
  && date.getMonth() > new Date().getMonth()) throw new Error('Invalid birth date'); 
  if(date.getFullYear() === new Date().getFullYear() && date.getMonth() === new Date().getMonth() 
  && date.getDate() > new Date().getDate()) throw new Error('Invalid birth date');
  return;
}

function validateType(type) {
  if(type !== 'Host' && type !== 'Guest') throw new Error('Invalid type');
  return;
}

export default { 
  validateUsername, 
  validateFirstName, 
  validateLastName, 
  validateGender, 
  validateEmail, 
  validatePhoneNumber,
  validateCountry,
  validatePassword,
  validateDescription,
  validateBirthDate,
  validateType
};