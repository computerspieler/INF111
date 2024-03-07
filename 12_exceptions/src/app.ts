class Rectangle {
	longueur: number;
	largeur: number;

	constructor(longueur, largeur) {
		this.longueur = longueur;
		this.largeur = largeur;
	}

	public calculerSurface(): number {
		if(this.longueur <= 0 || this.largeur <= 0)
			throw new Error("Dimensions invalides");

		return this.largeur * this.longueur;
	}

	public essayerCalculSurface(): number | undefined {
		try {
			return this.calculerSurface();
		} catch (e) {
			console.error(e.message);
			return undefined;
		}
	}
}

const rects : Rectangle[] = [
	new Rectangle(10, 5.5),
	new Rectangle(-10, 5.5),
	new Rectangle(10, 0)
];

for(const r of rects) {
	const surface: number | undefined = r.essayerCalculSurface();
	console.log(surface);
}