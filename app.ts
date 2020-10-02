import _ from 'https://jspm.dev/lodash@4';
const inputFile = "./data/in/corpse.txt";
const outputFile = "./data/out/corpse.txt";

/* Fix line widths in words */
console.log("Fixing Word Lengths 🕒");
const inputText = await Deno.readTextFile(inputFile);
const fixed = fixLineLength(inputText);
await Deno.writeTextFile(outputFile, fixed);
console.log("Sentence length fixed out/corpse.txt ✔️");
/* --------------------------------------- */

/* Generating unigram frequnecies */
//  bellow array should be sorted also
console.log("Generating unigram frequencies 🕒");
const unigramFreqMapIndexes: string[] = [];
const unigramFreqMapValues: number[] = [];
const spacesRemoved = fixed.trim().replace( / +/g, "" ).replace( /\n/g, "" );
let unigramFreqString = "";
console.log(`Processing ${spacesRemoved.length} characters 🕒`);
for(let c of spacesRemoved){
    const charIndex = unigramFreqMapIndexes.indexOf(c);
    if( charIndex < 0){
        unigramFreqMapIndexes.push(c);
        unigramFreqMapValues.push(1);
    } else{
        unigramFreqMapValues[charIndex] += 1;
    }
}
unigramFreqMapIndexes.forEach((char)=>{
    const charIndex = unigramFreqMapIndexes.indexOf(char);
    unigramFreqString+= `${char} ${unigramFreqMapValues[charIndex]}\n`
})
await Deno.writeTextFile("./data/out/corpse.unigram_freqs", unigramFreqString);
console.log("unigram frequencies saved out/corpse.unigram_freqs 🕒");
/* --------------------------------------- */
/* Generate Wordlist */
console.log("Generating wordlist 🕒");
const words = fixed.trim().replace( /\n+/g, " " ).split(" ");
const uniqWords = _.uniq(words);
let wordlistStr = "";
uniqWords.forEach((word: string)=>{
    wordlistStr+= word+"\n";
});
await Deno.writeTextFile("./data/out/corpse.wordlist", wordlistStr);

console.log("Wordlist saved out/corpse.wordlist 🕒");

/* --------------------------------------- */

console.log("All Done ✔️");

function fixLineLength(input :string){
    const words =  input.trim().replace( /\n/g, " " ).split(" ");
    let appendedWords =0;
    let maxSentenceInWords = 7;
    let fixed = "";
    words.forEach((word)=>{
        if(appendedWords < maxSentenceInWords){
            fixed += word+" ";
            appendedWords += 1;
        }else{
            fixed += word+" \n";
            appendedWords = 0;
            maxSentenceInWords = randomIntFromInterval(7,15);
        }
    });
    return fixed;
}
function randomIntFromInterval(min :number, max :number) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min);
}
