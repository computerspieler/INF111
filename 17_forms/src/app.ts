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

	locations: GeocodeResult[];

	constructor()
	{
		this.form = document.getElementById("form") as HTMLFormElement;
		this.city = document.getElementById("city") as HTMLInputElement;
		this.result = document.getElementById("result") as HTMLDivElement;
		this.reco = document.getElementById("reco") as HTMLTableElement;
		this.reco_body = document.getElementById("reco_body") as HTMLTableElement;

		this.reco.style.visibility = "hidden";

		this.form.addEventListener("submit", this.handleSubmission.bind(this));
		this.form.addEventListener("change", this.handleLocationText.bind(this));
		//this.city.addEventListener("keypress", this.handleLocationText.bind(this));
	}

	async getLocations(input: string): Promise<GeocodeReturn<GeocodeResult>> {
		const uri = `http://localhost:8088/https://api.geocode.earth/v1/autocomplete?api_key=${GEOCODE_API_KEY}&layers=coarse&text=${input}`;
		const req = await fetch(uri);
		return req.json();
	}

	clearOutput() {
		// On se débarasse des anciennes recommandations & résultats
		this.result.style.visibility = "hidden";
		this.reco.style.visibility = "hidden";

		while(this.reco_body.children.length > 0)
			this.reco_body.removeChild(this.reco_body.children[0]);
		while(this.result.children.length > 0)
			this.result.removeChild(this.result.children[0]);
	}

	async handleLocationText() : Promise<void> {
		this.locations = (await this.getLocations(this.city.value)).features;

		this.clearOutput();

		this.locations = this.locations.filter((elt) => elt.geometry.type == "Point");
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

	async getMeasurements(latitude, longitude) : Promise<OpenAQReturn<Measurement>> {
		const uri = `http://localhost:8088/https://api.openaq.org/v2/measurements?limit=100&offset=0&sort=desc&radius=20000&order_by=datetime&coordinates=${latitude},${longitude}`;
		const req = await fetch(uri);
		return req.json();
	}

	async handleSubmission(ev) : Promise<void> {
		ev.preventDefault();

		console.log(ev.submitter);
		if(ev.submitter == null) {
			return this.handleLocationText();
		}

		const resp_val = await this.getMeasurements(
			this.locations[ev.submitter.value].geometry.coordinates[1],
			this.locations[ev.submitter.value].geometry.coordinates[0]
		);
		this.reco.style.visibility = "hidden";

		const res = resp_val.results;
		this.clearOutput();
		for(let i = 0; i < res.length; i ++) {
			let row = document.createElement("div");
			row.textContent = `${res[i].date.local}: ${res[i].value} ${res[i].unit}` ;
			this.result.appendChild(row);
		}

		this.result.style.visibility = "visible";
	}
}