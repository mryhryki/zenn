import { webcrypto as crypto } from "node:crypto";

const HexCharacters = "0123456789abcdef";

export const digestSha256 = async (text: string): Promise<string> => {
  const message = new TextEncoder().encode(text);
  const hashBuf = new Uint8Array(await crypto.subtle.digest("SHA-256", message));
  return Array.from(hashBuf)
    .map((n: number): string =>
      [
        HexCharacters.at(Math.floor(n / HexCharacters.length)), //
        HexCharacters.at(n % HexCharacters.length)
      ].join("")
    )
    .join("");
};

