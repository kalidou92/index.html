const prompt = require("prompt-sync")();

let fatigue = prompt("es-tu fatigué ? (oui / non)");
let heure = Number("quelle heure est-il ? (0-23)");
console.log("fatigue", fatigue);
console.log("heure", heure);

if(fatigue === "oui" && heure >= 22){
    console.log("tu es fatigué et il est tard va dors");
} else if(fatigue === "oui" && heure < 22){
    console.log("tu es fatigué mais il est encore tôt et repose-toi");
} else{
    console.log("tun'es pas fatigué travailler à apprendre à coder");
}