import * as crypto from "crypto";
const hashPass = (pass: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const salt = crypto.randomBytes(15).toString("hex");
    crypto.scrypt(pass, salt, 64, (err, derivedKey) => {
      if (err) reject(err);
      resolve(salt + ":" + derivedKey.toString("hex"));
    });
  });
};

const comparePass = async (pass: string, hash: string) => {
  return new Promise((resolve, reject) => {
    const [salt, key] = hash.split(":");
    crypto.scrypt(pass, salt, 64, (err, derivedKey) => {
      if (err) reject(err);
      resolve(key === derivedKey.toString("hex"));
    });
  });
};

export { hashPass, comparePass };
