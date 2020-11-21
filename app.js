import _ from 'https://jspm.dev/lodash@4';
import nGram from 'https://jspm.dev/n-gram@1.1.2    ';
const inputFile = "./data/in/corpus.txt";
const outputFile = "./data/out/corpus.txt";


/* Fix line widths in words */
console.log("Fixing Word Lengths 🕒");
let inputText = await Deno.readTextFile(inputFile);
const fixed = fixLineLength(inputText);
await Deno.writeTextFile(outputFile, fixed);
console.log("Sentence length fixed ./data/out/corpus.txt ✔️");
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
await Deno.writeTextFile("./data/out/corpus.unigram_freqs", unigramFreqString);
console.log("unigram frequencies saved out/corpus.unigram_freqs 🕒");
/* --------------------------------------- */


/* Genrate Biagrams */
console.log("Generating biagram frequencies 🕒");
const words = fixed.trim().replace( /\n+/g, " " ).split(" ");

const wordFreqObject = {}; // used to create wordlist
const bigramFreqObject = {};
words.forEach((word)=>{
    if(!wordFreqObject[word]){
        wordFreqObject[word] = 1;
    }else {
        wordFreqObject[word] += 1;
    }
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
await Deno.writeTextFile("./data/out/corpus.bigram_freqs", bigramFreqString);
console.log("biagram frequencies saved out/corpus.bigram_freqs 🕒");

/* --------------------------------------- */


/* Generate Wordlist */
console.log("Generating wordlist 🕒");

const wordFreqArray = [];
for (let key in wordFreqObject) {
    // deno-lint-ignore no-prototype-builtins
    if (wordFreqObject.hasOwnProperty(key)) {
        wordFreqArray.push({
            term: key,
            freq: wordFreqObject[key],
        })
    }
}
const sortedWordFreqArray = _.orderBy(wordFreqArray, ['freq'],['desc']);
let wordlistStr = sortedWordFreqArray.map(o=> o.term).filter(o => o.length >= 2).join("\n");
await Deno.writeTextFile("./data/out/corpus.wordlist", wordlistStr);
console.log("Wordlist saved ./data/out/corpus.wordlist 🕒");
/* --------------------------------------- */

console.log("All Done ✔️");

function fixLineLength(input){
    const words =  input.trim().replaceAll( /\n/g, " " ).replaceAll( / +/g, " " ).split(" ");
    let appendedWords =0;
    let maxSentenceInWords = 20;
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
            maxSentenceInWords = randomIntFromInterval(20,30);
            sentenceArray = [];
        }
    });
    return fixed;
}
function randomIntFromInterval(min, max) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min);
}