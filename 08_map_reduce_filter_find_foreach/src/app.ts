const fruits: string[] = [
	"pomme", "kiwi", "banane",
	"cerise", "orange", "poire",
	"fraise", "prune", "ananas",
	"pêche"
];

const fruitsEnMajuscule: string[] =
	fruits.map((x) => x.toUpperCase());
const fruitsCommencantParP: string[] =
	fruits.filter((x) => { return x[0].toLowerCase() == 'p'; })
const fruitsDansUneChaine: string =
	fruits.reduce((acc, x) => acc.concat(x, ","), "");
const fruitAuNomLong: string =
	fruits.find((x) => x.length >= 5);

console.log("fruitsEnMajuscule: ", fruitsEnMajuscule);
console.log("fruitsCommencantParP: ", fruitsCommencantParP);
console.log("fruitsDansUneChaine: ", fruitsDansUneChaine);
console.log("fruitAuNomLong: ", fruitAuNomLong);