export function validateEmail(email: string) {
  console.log("Validating email: ", email);
  const re = /^([a-z0-9]{1})([a-z0-9_.!#$%&'*+-/=?^`{|}~]{0,63})@([0-9a-z.-]{1,253})\.([a-z.]{2,6})$/;
  return re.test(String(email).toLowerCase());
}

export function validatePassword(password: string) {
  console.log("Validating password: ", password);
  const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&(){}#^.;,:"'-_+=]{8,}$/;
  return re.test(String(password));
}