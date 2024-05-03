window.onload = () => {
	new FormHandler();
};

interface AutoCompletionResult {
	name: string;
	longitude: number;
	latitude: number;
};

interface AutoCompletionResponse {
	elements: AutoCompletionResult[];
};


class FormHandler
{
	search_res: HTMLDivElement;
	city_input: HTMLInputElement;
	locations: AutoCompletionResult[];

	constructor()
	{
		this.locations = [];

		this.city_input = document.getElementById("search") as HTMLInputElement;
		this.search_res = document.getElementById("search-reco") as HTMLDivElement;

		this.city_input.addEventListener("input", this.handleLocationInputEvent.bind(this));
		this.clearSearchResults();
	}

	async fetchLocations(input: string): Promise<AutoCompletionResponse> {
		const uri = `http://localhost:5055/?text=${input}`;
		const req = await fetch(uri);
		return req.json();
	}

	async retrieveLocations() {
		this.locations = (await this.fetchLocations(this.city_input.value)).elements;
	}

	clearSearchResults() {
		this.locations = [];
		this.search_res.style.visibility = "hidden";
		this.search_res.textContent = "";
		while(this.search_res.children.length > 0)
			this.search_res.removeChild(this.search_res.children[0]);
	}

	noCityFound() {
		this.clearSearchResults();
		this.search_res.textContent = "Aucune ville trouvée";
		this.search_res.style.visibility = "visible";
	}

	handleLocationInputEvent(ev) {
		if(this.city_input.value.length == 0) {
			this.clearSearchResults();
			return;
		}
		this.search_res.textContent = "";
		this.retrieveLocations().then(() => {
			if(this.locations.length == 0)
				return this.noCityFound();

			
			for(let i = 0; i < this.locations.length; i ++) {
				const loc = this.locations[i];
	
				const elt : HTMLDivElement = document.createElement("div");
				elt.id = "reco-"+i;
				elt.className = "search-reco-data";
				elt.textContent = loc.name;
	
				this.search_res.appendChild(elt);
			}
			this.search_res.style.visibility = "visible";

		}).catch(this.noCityFound.bind(this));
	}

	clearOutput() {}

	//https://data.culture.gouv.fr/api/explore/v2.1/catalog/datasets/festivals-global-festivals-_-pl/records?where=within_distance(geocodage_xy%2C%20geom%27POINT({lon}%20{lat})%27%2C%20{radius}km)&limit=20
}