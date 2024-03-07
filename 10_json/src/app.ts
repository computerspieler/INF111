interface IUser {
	id: number;
	name: string;
	age: number;
	scores: number[];

	getMaxScore(): number;
	getAverageScore(): number;
}

class User implements IUser {
	public id: number;
	public name: string;
	public age: number;
	public scores: number[];

	constructor(id, name, age, scores) {
		this.id = id;
		this.name = name;
		this.age = age;
		this.scores = scores;
	}

	getMaxScore(): number {
		const max = (a, b)  => a > b ? a : b;
		return this.scores.reduce((acc, x) => max(acc, x), 0);	
	}

	getAverageScore(): number {
		return this.scores.reduce((acc, x) => acc + x, 0) / this.scores.length;
	}
}

const u1: User = new User(0, "David Williams", 69, [1, 0, 3.14159]);
const u2: User = new User(-3, "Jane Doe", 24, [-1, 100, 7, 7, 7, 7, 6, 7]);
const u3: User = new User(40, "Arnold Schwarzenegger", 76, []);

const users: IUser[] = [u1, u2, u3];

function serializeUsers(users: IUser[]): string {
	return JSON.stringify(users);
}

function deserializeUsers(json: string): IUser[] {
	return JSON.parse(json) as User[];
}

console.log(users);
console.log(serializeUsers(users));

const deserialized_users = deserializeUsers(serializeUsers(users));
console.log(deserialized_users);
console.log(deserialized_users[1].name);
/*
Ça ne marchera pas car JSON va créer des interfaces IUser, et non
des objets User

console.log(deserialized_users[1].getMaxScore());
console.log(deserialized_users[1].getAverageScore());
*/
console.log(users[1].getMaxScore());
console.log(users[1].getAverageScore());