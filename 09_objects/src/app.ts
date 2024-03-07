interface IVehicule {
	drive(): void;
}

abstract class Vehicule implements IVehicule {
	speed: number;

	constructor(speed: number) {
		this.speed = speed;
	}

	abstract honk(): void;
	drive() {
		console.log('Driving at ', this.speed, ' km/h');
	}
}

class Car extends Vehicule {
	honk() {
		console.log("Beep beep!");
	}
}

class Bicycle extends Vehicule {
	honk() {
		console.log("Ring ring");
	}
}

const vehicles: IVehicule[] = [
	new Car(100), new Car(0),
	new Bicycle(350), new Bicycle(2.5), new Bicycle(-1)
];

for (let v of vehicles) {
	v.drive();
	/* On ne peut pas appeler 'honk' car ce n'est pas défini dans l'interface */
	// v.honk();
}