export function validateEmail(email: string) {
    const re = /^([a-z0-9]{1})([a-z0-9_.!#$%&'*+-/=?^`{|}~]{0,63})@([\da-z.-]{1,253})\.([a-z.]{2,6})$/;
    return re.test(String(email).toLowerCase());
  }

export function validatePassword(password: string) {
    const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&(){}#^.;,:"'-_+=]{8,}$/;
    return re.test(String(password));
}