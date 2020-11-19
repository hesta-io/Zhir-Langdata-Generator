import _ from "https://jspm.dev/lodash@4";
const inputFile = "./data/in/corpus.txt";
const outputFile = "./data/out/corpus.txt";

/* Fix line widths in words */
console.log("Fixing Word Lengths 🕒");
const inputText = await Deno.readTextFile(inputFile);
const fixed = fixLineLength(inputText);
await Deno.writeTextFile(outputFile, fixed);
console.log("Sentence length fixed out/corpus.txt ✔️");
/* --------------------------------------- */

/* Generating unigram frequnecies */
//  bellow array should be sorted also
console.log("Generating unigram frequencies 🕒");
const unigramFreqMapIndexes: string[] = [];
const unigramFreqMapValues: number[] = [];
const spacesRemoved = fixed.trim().replace(/ +/g, "").replace(/\n/g, "");
let unigramFreqString = "";
console.log(`Processing ${spacesRemoved.length} characters 🕒`);
for (let c of spacesRemoved) {
  const charIndex = unigramFreqMapIndexes.indexOf(c);
  if (charIndex < 0) {
    unigramFreqMapIndexes.push(c);
    unigramFreqMapValues.push(1);
  } else {
    unigramFreqMapValues[charIndex] += 1;
  }
}
unigramFreqMapIndexes.forEach((char) => {
  const charIndex = unigramFreqMapIndexes.indexOf(char);
  unigramFreqString += `${char} ${unigramFreqMapValues[charIndex]}\n`;
});
await Deno.writeTextFile("./data/out/corpus.unigram_freqs", unigramFreqString);
console.log("unigram frequencies saved out/corpus.unigram_freqs 🕒");

/* Generating bigram frequnecies */
console.log("Generating bigram frequencies 🕒");

let bigramFreqMap = new Map<string, number>();

for (var i = 0; i < spacesRemoved.length - 1; i++) {
  var substring = spacesRemoved.substr(i, 2);
    var current = bigramFreqMap.get(substring) ?? 0;
    bigramFreqMap.set(substring, current + 1);
}

let bigramFreqStr = "";
let sorted = [...bigramFreqMap.entries()].sort((a, b) => b[1] - a[1]); // desc!
sorted.forEach(a =>
{
  bigramFreqStr += `${a[1]} ${a[0]}\n`;
});

await Deno.writeTextFile("./data/out/corpus.bigram_freqs", bigramFreqStr);
console.log("bigram frequencies saved out/corpus.bigram_freqs 🕒");

/* --------------------------------------- */
/* Generate Wordlist */
console.log("Generating wordlist 🕒");
const words = fixed.trim().replace(/\n+/g, " ").split(" ");
const uniqWords = _.uniq(words);
let wordlistStr = "";
uniqWords.forEach((word: string) => {
  wordlistStr += word + "\n";
});
await Deno.writeTextFile("./data/out/corpus.wordlist", wordlistStr);

console.log("Wordlist saved out/corpus.wordlist 🕒");

/* --------------------------------------- */

console.log("All Done ✔️");

function fixLineLength(input: string) {
  const words = input.trim().replace(/\n/g, " ").split(" ");
  let appendedWords = 0;
  let maxSentenceInWords = 7;
  let fixed = "";
  words.forEach((word) => {
    if (appendedWords < maxSentenceInWords) {
      fixed += word + " ";
      appendedWords += 1;
    } else {
      fixed += word + " \n";
      appendedWords = 0;
      maxSentenceInWords = randomIntFromInterval(7, 15);
    }
  });
  return fixed;
}
function randomIntFromInterval(min: number, max: number) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}
