window.onload = () => {
	new FormHandler();
};

/* Geocode */
// Volé avec fierté du site de OpenAQ
const GEOCODE_API_KEY = "ge-9a9d07c380e99828";

interface GeocodeReturn<T> {
	type: string;
	features: T[];
}

interface GeocodeGeometry {
	type: string;
	coordinates?: [number, number];
}

interface GeocodeProperties {
	name: string;			/* La ville */
	macroregion: string;	/* La région */
	region: string;			/* Le département */
	country: string;		/* Le pays */
}

interface GeocodeResult {
	geometry: GeocodeGeometry;
	properties: GeocodeProperties;
}

/* OpenAQ */
interface MeasurementDate {
	utc: string;
	local: string;
}

interface Measurement {
	date: MeasurementDate;
	unit: string;
	value: number;
	parameter: string;
}

interface OpenAQReturn<T> {
	meta?: any;
	results: T[];
}

interface Location {
	id: number;
	city: string;
	country: string;
}

class FormHandler
{
	form: HTMLFormElement;
	result: HTMLDivElement;
	city: HTMLInputElement;
	reco: HTMLElement;
	reco_body: HTMLElement;
	on_error: HTMLElement;

	locations: GeocodeResult[];
	currentLatitude: number;
	currentLongitutde: number;

	refreshTimeout;

	constructor()
	{
		this.form = document.getElementById("form") as HTMLFormElement;
		this.city = document.getElementById("city") as HTMLInputElement;
		this.result = document.getElementById("result") as HTMLDivElement;
		this.reco = document.getElementById("reco") as HTMLTableElement;
		this.reco_body = document.getElementById("reco_body") as HTMLTableElement;
		this.on_error = document.getElementById("onerror");

		this.resetOutput();
		this.clearRecommandations();

		this.form.addEventListener("submit", this.handleSubmission.bind(this));
		this.form.addEventListener("change", this.handleLocationText.bind(this));

		//this.city.addEventListener("keypress", this.handleLocationText.bind(this));
	}

	async getLocations(input: string): Promise<GeocodeReturn<GeocodeResult>> {
		const uri = `http://localhost:8088/https://api.geocode.earth/v1/autocomplete?api_key=${GEOCODE_API_KEY}&layers=coarse&text=${input}`;
		const req = await fetch(uri);
		return req.json();
	}

	clearRecommandations() {
		this.reco.style.visibility = "hidden";
		while(this.reco_body.children.length > 0)
			this.reco_body.removeChild(this.reco_body.children[0]);
	}

	clearOutput() {
		while(this.result.children.length > 0)
			this.result.removeChild(this.result.children[0]);
	}

	resetOutput() {
		// On se débarasse des anciennes recommandations & résultats
		this.result.style.visibility = "hidden";
		this.on_error.style.visibility = "hidden";

		this.clearOutput();

		this.currentLatitude = undefined;
		this.currentLongitutde = undefined;

		// Il faut aussi se débarasser du timer
		clearTimeout(this.refreshTimeout);
	}

	async handleLocationText() : Promise<void> {
		this.locations = (await this.getLocations(this.city.value)).features;

		this.clearRecommandations();
		this.resetOutput();

		this.locations = this.locations.filter((elt) => elt.geometry.type == "Point");
		if(this.locations.length == 0) {
			this.on_error.style.visibility = "visible";
			return;
		}

		for(let i = 0; i < this.locations.length; i ++) {
			let col : HTMLTableCellElement;
			let button : HTMLButtonElement;
			const elt = this.locations[i];

			const row : HTMLTableRowElement = document.createElement("tr");

			let addCol = (str) => {
				let col : HTMLTableCellElement;

				col = document.createElement("td");
				col.textContent = str;
				row.appendChild(col);
			};

			addCol(elt.properties.name);
			addCol(elt.properties.region);
			addCol(elt.properties.macroregion);
			addCol(elt.properties.country);

			col = document.createElement("td");
			button = document.createElement("button");
			button.textContent = "See measurements";
			button.type = "submit";
			button.value = i.toString();
			col.appendChild(button);
			row.appendChild(col);

			this.reco_body.appendChild(row);
		}
		this.reco.style.visibility = "visible";
	}

	async getMeasurements() : Promise<OpenAQReturn<Measurement>> {
		const uri = `http://localhost:8088/https://api.openaq.org/v2/measurements?limit=100&offset=0&sort=desc&radius=20000&order_by=datetime&coordinates=${this.currentLatitude.toFixed(4)},${this.currentLongitutde.toFixed(4)}`;
		const req = await fetch(uri);
		return req.json();
	}

	async refreshResults() : Promise<void> {
		this.getMeasurements().then((resp_val) => {
			const res = resp_val.results;
			if(res.length > 0) {
				this.clearOutput();
				for(let i = 0; i < res.length; i ++) {
					let row = document.createElement("div");
					const out_date = new Date(res[i].date.local);
					row.textContent = `[${out_date.toDateString()} ${out_date.toTimeString().split(' ')[0]}]: ${res[i].value} ${res[i].unit} de ${res[i].parameter}`;
					this.result.appendChild(row);
				}
			} else
				console.error("Too much requests ?");
	
			// On rafraichit toute les minutes à peu près
			this.refreshTimeout = setTimeout(this.refreshResults.bind(this), 60*1000);
		})
		.catch(() => {
			console.error("Unable to connect");
			this.refreshTimeout = setTimeout(this.refreshResults.bind(this), 10*1000);
		});
	}

	async handleSubmission(ev) : Promise<void> {
		ev.preventDefault();

		if(ev.submitter == null) {
			return this.handleLocationText();
		}

		this.currentLatitude = this.locations[ev.submitter.value].geometry.coordinates[1];
		this.currentLongitutde = this.locations[ev.submitter.value].geometry.coordinates[0];
		
		this.clearRecommandations();
		this.refreshResults();

		this.result.style.visibility = "visible";
	}
}