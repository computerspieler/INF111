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

function haut(): void {
	console.log("haut");
}

function bas(): void {
	console.log("bas");
}

function gauche(): void {
	console.log("gauche");
}

function droite(): void {
	console.log("droite");
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