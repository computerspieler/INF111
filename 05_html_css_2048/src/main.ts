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

function haut(): void
{
	console.log("haut");
	score += 1;
	updateScore();
}

function bas(): void
{
	console.log("bas");
	score += 1;
	updateScore();
}

function gauche(): void
{
	console.log("gauche");
	score += 1;
	updateScore();
}

function droite(): void
{
	console.log("droite");
	score += 1;
	updateScore();
}

function getCell(i: number, j: number): HTMLTableCellElement | undefined
{
	const table: HTMLTableElement = document.getElementById("game") as HTMLTableElement;

	if(i < 0 || j < 0)
		return undefined;
	
	if(i >= table.rows.length)
		return undefined;

	if(j >= table.rows[i].cells.length)
		return undefined;
	
	return table.rows[i].cells[j];
}

function setValue(i: number, j: number, value: number): boolean
{
	const table: HTMLTableElement = document.getElementById("game") as HTMLTableElement;

	if(i < 0 || j < 0)
		return false;
	
	if(i >= table.rows.length)
		return false;

	if(j >= table.rows[i].cells.length)
		return false;

	if(isNaN(value))
		table.rows[i].cells[j].textContent = "*";
	else
		table.rows[i].cells[j].textContent = value.toString();
	return true;

}

function getValue(i: number, j: number): number
{
	const cell = getCell(i, j);
	if(cell === undefined)
		return NaN;

	return Number(cell.textContent);
}

function isEmpty(i: number, j: number): boolean
{
	const cell = getCell(i, j);
	if(cell === undefined)
		return false;
	return isNaN(Number(cell.textContent));
}

function newGame(): void
{
	const table: HTMLTableElement = document.getElementById("game") as HTMLTableElement;
	const height = table.rows.length;
	const width = table.rows[0].cells.length;

	// On nettoie le terrain de jeu
	for(let i = 0; i < height; i ++)
		for(let j = 0; j < width; j ++)
			setValue(i, j, NaN);

	// On initialise la valeur des cases
	const v1 = Math.random() >= 0.85 ? 4 : 2;
	const v2 = Math.random() >= 0.86 ? 4 : 2;

	// On initialise la position des cases
	const x1 = Math.floor(Math.random() * width);
	const y1 = Math.floor(Math.random() * height);
	
	let x2 : number = x1;
	let y2 : number = y1;

	while(x2 == x1 && y2 == y2) {
		x2 = Math.floor(Math.random() * width);
		y2 = Math.floor(Math.random() * height);
	}

	setValue(y1, x1, v1);
	setValue(y2, x2, v2);
}

function moveRight(i: number): boolean
{
	const table = document.getElementById("game") as HTMLTableElement;
	const height = table.rows.length;
	const width = table.rows[0].cells.length;
	
	if(i < 0 || i > height)
		return false;

	let output = false;
	
	for(let j = 0; j < width - 1; j ++) {
		if(isEmpty(i, j+1) && !isEmpty(i, j)) {
			output = true;
			setValue(i, j+1, getValue(i, j));
			setValue(i, j, NaN);
		}
	}

	if(!output)
		return false;

	moveRight(i);
	return true;
}

function moveLeft(i: number): boolean
{
	const table = document.getElementById("game") as HTMLTableElement;
	const height = table.rows.length;
	const width = table.rows[0].cells.length;
	
	if(i < 0 || i > height)
		return false;

	let output = false;
	
	for(let j = width - 1; j > 0; j --) {
		if(isEmpty(i, j-1) && !isEmpty(i, j)) {
			output = true;
			setValue(i, j-1, getValue(i, j));
			setValue(i, j, NaN);
		}
	}

	if(!output)
		return false;
	
	moveLeft(i);
	return true;
}

function moveUp(j: number): boolean
{
	const table = document.getElementById("game") as HTMLTableElement;
	const height = table.rows.length;
	const width = table.rows[0].cells.length;
	
	if(j < 0 || j > width)
		return false;

	let output = false;
	
	for(let i = height - 1; i > 0; i --) {
		if(isEmpty(i-1, j) && !isEmpty(i, j)) {
			output = true;
			setValue(i-1, j, getValue(i, j));
			setValue(i, j, NaN);
		}
	}

	if(!output)
		return false;
	moveUp(j);
	return true;
}

function moveDown(j: number): boolean
{
	const table = document.getElementById("game") as HTMLTableElement;
	const height = table.rows.length;
	const width = table.rows[0].cells.length;
	
	if(j < 0 || j > width)
		return false;

	let output = false;
	
	for(let i = 0; i < height - 1; i ++) {
		if(isEmpty(i+1, j) && !isEmpty(i, j)) {
			output = true;
			setValue(i+1, j, getValue(i, j));
			setValue(i, j, NaN);
		}
	}

	if(!output)
		return false;
	moveDown(j);
	return true;
}

function fusionRight(i: number): boolean
{
	const table = document.getElementById("game") as HTMLTableElement;
	const height = table.rows.length;
	const width = table.rows[0].cells.length;
	
	if(i < 0 || i > height)
		return false;

	let output = false;
	
	for(let j = width - 2; j >= 0; j --) {
		if(isEmpty(i, j+1) || isEmpty(i, j))
			continue;

		if(getValue(i, j+1) != getValue(i, j))
			continue;
		output = true;
		setValue(i, j+1, 2*getValue(i, j));
		setValue(i, j, NaN);
	}

	return output;
}

function fusionLeft(i: number): boolean
{
	const table = document.getElementById("game") as HTMLTableElement;
	const height = table.rows.length;
	const width = table.rows[0].cells.length;
	
	if(i < 0 || i > height)
		return false;

	let output = false;
	
	for(let j = 1; j < width; j ++) {
		if(isEmpty(i, j-1) || isEmpty(i, j))
			continue;

		if(getValue(i, j-1) != getValue(i, j))
			continue;

		output = true;
		setValue(i, j-1, 2*getValue(i, j));
		setValue(i, j, NaN);
	}

	return output;
}

function fusionUp(j: number): boolean
{
	const table = document.getElementById("game") as HTMLTableElement;
	const height = table.rows.length;
	const width = table.rows[0].cells.length;
	
	if(j < 0 || j > width)
		return false;

	let output = false;
	
	for(let i = 1; i < height; i ++) {
		if(isEmpty(i-1, j) || isEmpty(i, j))
			continue;

		if(getValue(i-1, j) != getValue(i, j))
			continue;

		output = true;
		setValue(i-1, j, 2*getValue(i, j));
		setValue(i, j, NaN);
	}

	return output;
}

function fusionDown(j: number): boolean
{
	const table = document.getElementById("game") as HTMLTableElement;
	const height = table.rows.length;
	const width = table.rows[0].cells.length;
	
	if(j < 0 || j > width)
		return false;

	let output = false;
	
	for(let i = height; i >= 0; i --) {
		if(isEmpty(i+1, j) || isEmpty(i, j))
			continue;

		if(getValue(i+1, j) != getValue(i, j))
			continue;

		output = true;
		setValue(i+1, j, 2*getValue(i, j));
		setValue(i, j, NaN);
	}

	return output;
}

function tests()
{
	const y = 2;
	const x = 1;
	const val = 10;
	console.assert(isNaN(getValue(y, x)), "Data preinitalized");
	setValue(y, x, val);
	console.assert(getValue(y, x) == val, "Data non-modified");

	console.assert(!isEmpty(y, x), "Data non-modified");
	console.assert(isEmpty(y, x+1), "Invalid condition");

	moveRight(y);
	console.assert(isNaN(getValue(y, x)), "moveRight");
	console.assert(!isNaN(getValue(y, 3)), "moveRight");

	moveLeft(y);
	console.assert(isNaN(getValue(y, 3)), "moveLeft");
	console.assert(!isNaN(getValue(y, 0)), "moveLeft");

	moveUp(0);
	console.assert(isNaN(getValue(y, 0)), "moveUp");
	console.assert(!isNaN(getValue(0, 0)), "moveUp");

	moveDown(0);
	console.assert(isNaN(getValue(0, 0)), "moveDown");
	console.assert(!isNaN(getValue(3, 0)), "moveDown");

	setValue(3, 0, NaN);
	console.assert(isNaN(getValue(3, 0)), "Data non de-initialized");

	/* Tests défi 10 */
	// Exemple 1
	setValue(0, 2, 2);
	moveRight(0);
	console.assert( isNaN(getValue(0, 0)), "exemple1_1", getValue(0, 0));
	console.assert( isNaN(getValue(0, 1)), "exemple1_2", getValue(0, 1));
	console.assert( isNaN(getValue(0, 2)), "exemple1_3", getValue(0, 2));
	console.assert(!isNaN(getValue(0, 3)), "exemple1_4", getValue(0, 3));

	// Exemple 2
	setValue(1, 0, 4);
	setValue(1, 2, 2);
	moveRight(1);
	console.assert( isNaN(getValue(1, 0)), "exemple2_1", getValue(1, 0));
	console.assert( isNaN(getValue(1, 1)), "exemple2_2", getValue(1, 1));
	console.assert(!isNaN(getValue(1, 2)), "exemple2_3", getValue(1, 2));
	console.assert(!isNaN(getValue(1, 3)), "exemple2_4", getValue(1, 3));

	// Exemple 3
	setValue(2, 0, 2);
	setValue(2, 2, 2);
	setValue(2, 3, 2);
	moveRight(2);
	console.assert( isNaN(getValue(2, 0)), "exemple3_1", getValue(2, 0));
	console.assert(!isNaN(getValue(2, 1)), "exemple3_2", getValue(2, 1));
	console.assert(!isNaN(getValue(2, 2)), "exemple3_3", getValue(2, 2));
	console.assert(!isNaN(getValue(2, 3)), "exemple3_4", getValue(2, 3));

	// Exemple 4
	setValue(3, 0, 4);
	setValue(3, 1, 2);
	setValue(3, 3, 4);
	moveRight(3);
	console.assert( isNaN(getValue(3, 0)), "exemple4_1", getValue(3, 0));
	console.assert(!isNaN(getValue(3, 1)), "exemple4_2", getValue(3, 1));
	console.assert(!isNaN(getValue(3, 2)), "exemple4_3", getValue(3, 2));
	console.assert(!isNaN(getValue(3, 3)), "exemple4_4", getValue(3, 3));

	/* Tests défi 11 */
	// Exemple 1
	setValue(0, 0, NaN);
	setValue(0, 1, NaN);
	setValue(0, 2, 2);
	setValue(0, 3, 2);
	fusionRight(0);
	console.assert( isNaN(getValue(0, 0)), "exemple5_1", getValue(0, 0));
	console.assert( isNaN(getValue(0, 1)), "exemple5_2", getValue(0, 1));
	console.assert( isNaN(getValue(0, 2)), "exemple5_3", getValue(0, 2));
	console.assert(!isNaN(getValue(0, 3)), "exemple5_4", getValue(0, 3));

	// Exemple 2
	setValue(1, 0, 4);
	setValue(1, 1, 4);
	setValue(1, 2, 2);
	setValue(1, 3, 2);
	fusionRight(1);
	console.assert( isNaN(getValue(1, 0)), "exemple6_1", getValue(1, 0));
	console.assert(!isNaN(getValue(1, 1)), "exemple6_2", getValue(1, 1));
	console.assert( isNaN(getValue(1, 2)), "exemple6_3", getValue(1, 2));
	console.assert(!isNaN(getValue(1, 3)), "exemple6_4", getValue(1, 3));

	// Exemple 3
	setValue(2, 0, NaN);
	setValue(2, 1, 2);
	setValue(2, 2, 2);
	setValue(2, 3, 2);
	fusionRight(2);
	console.assert( isNaN(getValue(2, 0)), "exemple7_1", getValue(2, 0));
	console.assert(!isNaN(getValue(2, 1)), "exemple7_2", getValue(2, 1));
	console.assert( isNaN(getValue(2, 2)), "exemple7_3", getValue(2, 2));
	console.assert(!isNaN(getValue(2, 3)), "exemple7_4", getValue(2, 3));

	// Exemple 4
	setValue(3, 0, NaN);
	setValue(3, 1, 2);
	setValue(3, 2, 2);
	setValue(3, 3, 4);
	fusionRight(3);
	console.assert( isNaN(getValue(3, 0)), "exemple8_1", getValue(3, 0));
	console.assert( isNaN(getValue(3, 1)), "exemple8_2", getValue(3, 1));
	console.assert(!isNaN(getValue(3, 2)), "exemple8_3", getValue(3, 2));
	console.assert(!isNaN(getValue(3, 3)), "exemple8_4", getValue(3, 3));	
}

document.addEventListener("DOMContentLoaded", (event) => {
	tests();
	newGame();
});

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

