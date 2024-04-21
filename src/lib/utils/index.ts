export function generateUniqueSlug() {
  const numbers = "0123456789";
  const letters = "abcdefghijklmnopqrstuvwxyz";
  const lettersUpper = letters.toUpperCase();
  const timestamp = Date.now().toString(12).padEnd(6);

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
