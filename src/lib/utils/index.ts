/**
 * Generates a unique string based on the current time.
 * @returns string
 */
export function generateUniqueSlug(length = 12) {
  const numbers = "0123456789";
  const letters = "abcdefghijklmnopqrstuvwxyz";
  const lettersUpper = letters.toUpperCase();
  const timestamp = Date.now()
    .toString(length)
    .padEnd(Math.round(length / 2), "1");

  const combined = [letters, lettersUpper, numbers, timestamp].join("");

  function generateRandomHex(length: number) {
    let result = "";
    const characters = combined;
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  return generateRandomHex(12);
}
