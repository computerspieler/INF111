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

// Tests
const y = 2;
const x = 1;
const val = 10;
console.assert(isNaN(getValue(y, x)), "Data preinitalized");
setValue(y, x, val);
console.assert(getValue(y, x) == val, "Data non-modified");

console.assert(!isEmpty(y, x), "Data non-modified");
console.assert(isEmpty(y, x+1), "Invalid condition");
