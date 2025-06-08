export function generateOTP(length = 6, digitsOnly = true) {
  const digits = "0123456789";
  const alpha = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const characters = digitsOnly ? digits : digits + alpha;

  let otp = "";
  for (let i = 0; i < length; i++) {
    otp += characters[Math.floor(Math.random() * characters.length)];
  }
  return otp;
}
