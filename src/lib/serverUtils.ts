import { headers } from "next/headers";
import crypto from "node:crypto";

export function getUserIp() {
  const FALLBACK_IP_ADDRESS = "0.0.0.0";

  const forwardedFor = headers().get("x-forwarded-for");

  if (forwardedFor) {
    return forwardedFor.split(",")[0] ?? FALLBACK_IP_ADDRESS;
  }

  return headers().get("x-real-ip") ?? FALLBACK_IP_ADDRESS;
}

const algorithm = "aes-256-cbc";
const hexKey = process.env.CRYPTO_HEX_KEY;
const hexIv = process.env.CRYPTO_HEX_IV;

export function encrypt(text: string) {
  const cipher = crypto.createCipheriv(
    algorithm,
    Buffer.from(hexKey, "hex"),
    Buffer.from(hexIv, "hex"),
  );
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return encrypted.toString("hex");
}
export function decrypt(text: string) {
  const iv = Buffer.from(hexIv, "hex");
  const encryptedText = Buffer.from(text, "hex");
  const key = Buffer.from(hexKey, "hex"); // Assuming the key is stored in an environment variable
  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}
