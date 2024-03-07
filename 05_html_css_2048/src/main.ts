//filename: 

/*
testBonjour();

function bonjour(): void {
    console.log("Bonjour");
}

function testBonjour(): void {
	bonjour();
}
*/

let score: number = 0;
function updateScore(): void {
	document.getElementById("score").textContent = score.toString();
}

function haut(): void {
	console.log("haut");
	score += 1;
	updateScore();
}

function bas(): void {
	console.log("bas");
	score += 1;
	updateScore();
}

function gauche(): void {
	console.log("gauche");
	score += 1;
	updateScore();
}

function droite(): void {
	console.log("droite");
	score += 1;
	updateScore();
}

document.body.addEventListener('keydown', (ev) => {
	if(ev.key == 'ArrowUp')
		haut();
	else if(ev.key == 'ArrowDown')
		bas();
	else if(ev.key == 'ArrowLeft')
		gauche();
	else if(ev.key == 'ArrowRight')
		droite();
});