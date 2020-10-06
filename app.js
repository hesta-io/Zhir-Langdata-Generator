import _ from 'https://jspm.dev/lodash@4';
import nGram from 'https://jspm.dev/n-gram@1.1.2    ';
const inputFile = "./data/in/corpse.txt";
const outputFile = "./data/out/corpse.txt";


/* Fix line widths in words */
console.log("Fixing Word Lengths 🕒");
let inputText = await Deno.readTextFile(inputFile);
const fixed = fixLineLength(inputText);
await Deno.writeTextFile(outputFile, fixed);
console.log("Sentence length fixed ./data/out/corpse.txt ✔️");
/* --------------------------------------- */

/* Generating unigram frequnecies */
console.log("Generating unigram frequencies 🕒");
const unigramFreqObject = {};
const spacesRemoved = fixed.trim().replaceAll( / +/g, "" ).replaceAll( /\n/g, "" );
let unigramFreqString = "";
console.log(`Processing ${spacesRemoved.length} characters 🕒`);
for(let c of spacesRemoved){
    if(!unigramFreqObject[c]){
        unigramFreqObject[c] = 1;
    }else{
        unigramFreqObject[c] +=1;
    }
}
const unigramFreqArray = [];
for (let key in unigramFreqObject) {
    // deno-lint-ignore no-prototype-builtins
    if (unigramFreqObject.hasOwnProperty(key)) {
        unigramFreqArray.push({
            char: key,
            freq: unigramFreqObject[key],
        })
    }
}
const sortedUnigramFreqArray = _.orderBy(unigramFreqArray, ['freq'],['desc']);
sortedUnigramFreqArray.forEach((r)=>{
    unigramFreqString+= `${r.char} ${r.freq}\n`
})
await Deno.writeTextFile("./data/out/corpse.unigram_freqs", unigramFreqString);
console.log("unigram frequencies saved out/corpse.unigram_freqs 🕒");
/* --------------------------------------- */

/* Generate Wordlist */
console.log("Generating wordlist 🕒");
const words = fixed.trim().replace( /\n+/g, " " ).split(" ");
const uniqWords = _.uniq(words);
let wordlistStr = uniqWords.join("\n");
await Deno.writeTextFile("./data/out/corpse.wordlist", wordlistStr);
console.log("Wordlist saved ./data/out/corpse.wordlist 🕒");
/* --------------------------------------- */

/* Genrate Biagrams */
console.log("Generating biagram frequencies 🕒");
const bigramFreqObject = {};
words.forEach((word)=>{
    const bigrams = nGram.bigram(word);
    bigrams.forEach((term)=>{
        if(!bigramFreqObject[term]){
            bigramFreqObject[term] = 1;
        }else{
            bigramFreqObject[term] +=1;
        }
    });
});

const bigramFreqArray = [];
for (let key in bigramFreqObject) {
    // deno-lint-ignore no-prototype-builtins
    if (bigramFreqObject.hasOwnProperty(key)) {
        bigramFreqArray.push({
            term: key,
            freq: bigramFreqObject[key],
        })
    }
}
const sortedbigramFreqArray = _.orderBy(bigramFreqArray, ['freq'],['desc']);
let bigramFreqString = "";
sortedbigramFreqArray.forEach((r)=>{
    bigramFreqString+= `${r.term} ${r.freq}\n`
})
await Deno.writeTextFile("./data/out/corpse.bigram_freqs", bigramFreqString);
console.log("biagram frequencies saved out/corpse.bigram_freqs 🕒");

/* --------------------------------------- */

console.log("All Done ✔️");

function fixLineLength(input){
    const words =  input.trim().replaceAll( /\n/g, " " ).replaceAll( / +/g, " " ).split(" ");
    let appendedWords =0;
    let maxSentenceInWords = 10;
    let fixed = "";
    let sentenceArray = [];
    words.forEach((word)=>{
        word = word.trim();
        if(appendedWords < maxSentenceInWords){
            sentenceArray.push(word)
            appendedWords += 1;
        }else{
            fixed += sentenceArray.join(" ")+"\n";
            appendedWords = 0;
            maxSentenceInWords = randomIntFromInterval(7,15);
            sentenceArray = [];
        }
    });
    return fixed;
}
function randomIntFromInterval(min, max) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min);
}
