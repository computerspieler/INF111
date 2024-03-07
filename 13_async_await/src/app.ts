/* Exercice 1 */
function delay(milliseconds: number): Promise<void> {
	return new Promise<void>((resolve) => {
		setTimeout(resolve, milliseconds);
	});
}

function calculateSumAsync(a: number, b: number): Promise<number> {
	return new Promise<number>((resolve) => {
		delay(3000).then((_) => resolve(a+b));
	});
}

async function printSum(a: number, b: number): Promise<void> {
	console.log("Calcul en cours...");
	const sum = await calculateSumAsync(a, b);
	console.log("Résultat: ", sum);
}

printSum(1, 3);

/* Exercice 2 */
function verifyUser(username: string, password: string): Promise<void> {
	return new Promise<void>((resolve, reject) => {
		if(username == "user" && password == "user")
			resolve();
		else
			reject();
	});
}

verifyUser("user", "user")
	.then(() => console.log("Bienvenue !"))
	.catch(() => console.log("Je ne vous connais pas >:("));

/* Exercice 3 */
class Calculator {
	calculateSumAsync(a: number, b: number): Promise<number> {
		return new Promise<number>((resolve) => {
			delay(3000).then((_) => resolve(a+b));
		});
	}
}

async function printSum2(calc: Calculator, a: number, b: number): Promise<void> {
	console.log("Calcul en cours...");
	const sum = await calc.calculateSumAsync(a, b);
	console.log("Résultat: ", sum);
}

const calc = new Calculator();
printSum2(calc, -1, 3);

class User {
	protected valid_username: string;
	protected valid_password: string;

	constructor(valid_username, valid_password) {
		this.valid_username = valid_username;
		this.valid_password = valid_password;
	}

	verifyUser(username: string, password: string): Promise<void> {
		return new Promise<void>((resolve, reject) => {
			if(username == this.valid_username && password == this.valid_password)
				resolve();
			else
				reject();
		});
	}
}

const u: User = new User("user", "user");
u.verifyUser("david", "user")
	.then(() => console.log("Bienvenue !"))
	.catch(() => console.log("Je ne vous connais pas >:("));