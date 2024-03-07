const additionner = (a: number, b: number): number => { return a + b; }
const soustraire  = (a: number, b: number): number => { return a - b; }
const multiplier  = (a: number, b: number): number => { return a * b; }
const diviser     = (a: number, b: number): number => { return a / b; }

const calculatrice = (a: number, b: number, op: string): void => {
	switch(op.toLowerCase()) {
		case "additionner": console.log("La somme est: ", additionner(a, b)); break;
		case "soustraire": console.log("La différence est: ", soustraire(a, b)); break;
		case "multiplier": console.log("Le produit est: ", multiplier(a, b)); break;
		case "diviser": console.log("Le quotient est: ", diviser(a, b)); break;

		default: break;
	}
};

calculatrice(5, 3, "additionner");

let curMouseX = 0;
let curMouseY = 0;

document.addEventListener("mousemove", (ev : MouseEvent) => {
	curMouseX = ev.clientX;
	curMouseY = ev.clientY;
});

setInterval(() => {
	console.log("La souris est en position: ", curMouseX, ", ", curMouseY);
}, 1000);
