class Queue<T> {
	queue: T[];
  
	constructor() {
		this.queue = [];
	}

	enqueue(element: T): void {
		this.queue.push(element);
	}
  
	dequeue(): T | undefined {
		return this.queue.shift();
	}
  
	size(): number {
		return this.queue.length;
	}
}

// Testez votre code ici
let numberQueue = new Queue<number>();
numberQueue.enqueue(1);
numberQueue.enqueue(4);
numberQueue.enqueue(-1);
numberQueue.enqueue(0);

console.log("Size: ", numberQueue.size());
while(numberQueue.size() > 0) {
	console.log(numberQueue.dequeue());
}

let stringQueue = new Queue<string>();
stringQueue.enqueue("hjfdks");
stringQueue.enqueue("Hello");
stringQueue.enqueue("Hallo");
stringQueue.enqueue("Au revoir");

console.log("Size: ", stringQueue.size());
while(stringQueue.size() > 0) {
	console.log(stringQueue.dequeue());
}

// TODO