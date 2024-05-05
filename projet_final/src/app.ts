window.onload = () => {
	new FormHandler();
};

interface AutoCompletionResult {
	name: string;
	longitude: number;
	latitude: number;
}

interface AutoCompletionResponse {
	elements: AutoCompletionResult[];
}

interface Geocodage {
	lon: number;
	lat: number;
}

interface FestivalEntry {
	nom_du_festival: string;
	site_internet_du_festival: string;
	
	commune_principale_de_deroulement: string;
	code_postal_de_la_commune_principale_de_deroulement: string;
	departement_principal_de_deroulement: string;
	region_principale_de_deroulement: string;

	geocodage_xy: Geocodage;
}

interface FestivalResult {
	total_count: number;
	results: FestivalEntry[];
}

class FormHandler
{
	search_reco: HTMLDivElement;
	search_results: HTMLDivElement;
	city_input: HTMLInputElement;

	constructor()
	{
		this.city_input = document.getElementById("search") as HTMLInputElement;
		this.search_reco = document.getElementById("search-reco") as HTMLDivElement;
		this.search_results = document.getElementById("results-container") as HTMLDivElement;

		let search_container = document.getElementById("search-container") as HTMLDivElement;
		this.city_input.addEventListener("input", this.handleLocationInputEvent.bind(this));
		
		let body = document.getRootNode();
		body.addEventListener("click", this.clearSearchRecommandations.bind(this));
		body.addEventListener("keydown", this.clearOnKeypress.bind(this));

		this.clearSearchRecommandations();
		this.clearSearchResults();
	}

	clearOnKeypress (e) {
		if(e.key === "Escape")
			this.clearSearchRecommandations();
	}	

	async fetchLocations(input: string): Promise<AutoCompletionResponse> {
		const uri = `http://localhost:5055/?text=${input}&country=fr`;
		const req = await fetch(uri);
		return req.json();
	}

	async retrieveLocations() {
		return (await this.fetchLocations(this.city_input.value)).elements;
	}

	async retrieveFestivals(longitude, latitude, radius) : Promise<FestivalResult> {
		const uri = `http://localhost:8088/https://data.culture.gouv.fr/api/explore/v2.1/catalog/datasets/festivals-global-festivals-_-pl/records?where=within_distance(geocodage_xy%2C%20geom%27POINT(${longitude}%20${latitude})%27%2C%20${radius}km)&limit=20`;
		const req = await fetch(uri);
		return req.json();
	}

	clearSearchRecommandations() {
		this.search_reco.style.visibility = "hidden";
		this.search_reco.textContent = "";
		while(this.search_reco.children.length > 0)
			this.search_reco.removeChild(this.search_reco.children[0]);
	}

	noCityFound() {
		this.clearSearchRecommandations();
		this.search_reco.textContent = "Aucune ville trouvée";
		this.search_reco.style.visibility = "visible";
	}

	handleLocationInputEvent(ev) {
		if(this.city_input.value.length == 0) {
			this.clearSearchRecommandations();
			return;
		}
		this.search_reco.textContent = "";
		this.retrieveLocations().then((locations) => {
			if(locations.length == 0)
				return this.noCityFound();

			for(let i = 0; i < locations.length; i ++) {
				const loc = locations[i];
	
				const elt : HTMLDivElement = document.createElement("div");

				elt.id = "reco-"+i;
				elt.className = "search-reco-data";
				elt.textContent = loc.name;

				elt.addEventListener("click",
					((ev) => this.handleLocationSelectionInputEvent(ev, loc)).bind(this)
				);
				this.search_reco.appendChild(elt);
			}
			this.search_reco.style.visibility = "visible";
		}).catch(this.noCityFound.bind(this));
	}

	clearSearchResults() {
		this.search_results.textContent = "";
		while(this.search_results.children.length > 0)
			this.search_results.removeChild(this.search_results.children[0]);
	}

	noResults() {
		this.search_results.textContent = "Aucun festival trouvé";
	}

	handleLocationSelectionInputEvent(ev, location) {
		this.clearSearchRecommandations();
		this.clearSearchResults();

		/* TODO: Ajouter un slider pour le radius */
		this.retrieveFestivals(location.longitude, location.latitude, 20)
		.then((res) => {
			if(res.total_count <= 0)
				return this.noResults();
			
			const festivals = res.results;

			if(festivals.length == 0)
				return this.noResults();
			
			for(let i = 0; i < festivals.length; i ++) {
				const fest = festivals[i];
	
				const elt1 : HTMLDivElement = document.createElement("div");
				elt1.id = "result-"+i;
				elt1.className = "search-result-data";
				
				const elt = document.createElement("a");
				if(fest.site_internet_du_festival != null) {
					if(!fest.site_internet_du_festival.startsWith("http://") &&
					   !fest.site_internet_du_festival.startsWith("https://"))
					   /* TODO: Vérifier si c'est bien la bonne chose à faire */
					   elt.href = "http://" + fest.site_internet_du_festival;
					else
						elt.href = fest.site_internet_du_festival;
				}
				
				const title = document.createElement("h2");
				title.textContent = fest.nom_du_festival;
				elt.appendChild(title);

				const location = document.createElement("div");
				location.textContent = "";

				let pos_info: string[] = [];
				pos_info.push(fest.code_postal_de_la_commune_principale_de_deroulement);
				pos_info.push(fest.commune_principale_de_deroulement);
				pos_info.push(fest.departement_principal_de_deroulement);
				pos_info.push(fest.region_principale_de_deroulement);

				location.textContent = pos_info.reduce(
					(acc, val) => {
						if(val == null || val == undefined || val == "#N/A")
							return acc;

						if(acc == "") return val;
						return acc + ", " + val;
					}
					, "");
				if(location.textContent != "")
					elt.appendChild(location);

				elt1.appendChild(elt);
				this.search_results.appendChild(elt1);
			}
		}).catch(this.noResults.bind(this));
	}
}