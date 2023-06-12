let strongPassword = /(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?=.{8,})/

let mediumPassword = /((?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{6,}))|((?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,}))/

export default function(password) {
  if(strongPassword.test(password)) return 'Strong';
  else if(mediumPassword.test(password)) return 'Medium';
  else return 'Weak';
} 