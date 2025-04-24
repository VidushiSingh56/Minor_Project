// sha256.js
function sha256(ascii) {
    const rightRotate = (value, amount) => (value >>> amount) | (value << (32 - amount));
  
    let mathPow = Math.pow;
    let maxWord = mathPow(2, 32);
    let result = '';
  
    let words = [];
    let asciiBitLength = ascii.length * 8;
  
    let hash = [],
      k = [],
      primeCounter = 0;
  
    let isPrime = n => {
      for (let i = 2, sqrt = Math.sqrt(n); i <= sqrt; i++) if (n % i === 0) return false;
      return true;
    };
  
    let getFractionalBits = x => ((x - Math.floor(x)) * maxWord) | 0;
  
    for (let candidate = 2; primeCounter < 64; candidate++) {
      if (isPrime(candidate)) {
        if (primeCounter < 8) hash[primeCounter] = getFractionalBits(Math.pow(candidate, 1 / 2));
        k[primeCounter++] = getFractionalBits(Math.pow(candidate, 1 / 3));
      }
    }
  
    ascii += '\x80';
    while ((ascii.length % 64) - 56) ascii += '\x00';
  
    for (let i = 0; i < ascii.length; i++) {
      let j = ascii.charCodeAt(i);
      if ((i & 3) === 0) words[i >> 2] = 0;
      words[i >> 2] |= j << ((3 - (i & 3)) * 8);
    }
  
    words[words.length] = ((asciiBitLength / maxWord) | 0);
    words[words.length] = (asciiBitLength);
  
    for (let j = 0; j < words.length;) {
      let w = words.slice(j, j += 16);
      let oldHash = hash.slice(0);
  
      for (let i = 16; i < 64; i++) {
        let s0 = rightRotate(w[i - 15], 7) ^ rightRotate(w[i - 15], 18) ^ (w[i - 15] >>> 3);
        let s1 = rightRotate(w[i - 2], 17) ^ rightRotate(w[i - 2], 19) ^ (w[i - 2] >>> 10);
        w[i] = (w[i - 16] + s0 + w[i - 7] + s1) | 0;
      }
  
      let [a, b, c, d, e, f, g, h] = hash;
  
      for (let i = 0; i < 64; i++) {
        let S1 = rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25);
        let ch = (e & f) ^ (~e & g);
        let temp1 = (h + S1 + ch + k[i] + w[i]) | 0;
        let S0 = rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22);
        let maj = (a & b) ^ (a & c) ^ (b & c);
        let temp2 = (S0 + maj) | 0;
  
        [h, g, f, e, d, c, b, a] = [g, f, e, (d + temp1) | 0, c, b, a, (temp1 + temp2) | 0];
      }
  
      for (let i = 0; i < 8; i++) hash[i] = (hash[i] + arguments[i]) | 0;
    }
  
    for (let i = 0; i < 8; i++) {
      result += ('00000000' + hash[i].toString(16)).slice(-8);
    }
    return result;
  }
  
  module.exports = sha256;
  