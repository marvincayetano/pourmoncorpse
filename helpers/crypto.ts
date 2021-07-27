import CryptoJS from "crypto-js";

function CryptoEncrypt(password: string) {
  return CryptoJS.AES.encrypt(
    password,
    <string>process.env.CRYPTO_SECRET
  ).toString();
}

function CryptoDecrypt(password: string) {
  return CryptoJS.AES.decrypt(
    password,
    <string>process.env.CRYPTO_SECRET
  ).toString();
}

export { CryptoDecrypt, CryptoEncrypt };
