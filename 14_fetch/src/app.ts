interface Address {
	city: string;
	postcode: string;
	street: string;
	housenumber: string;
	context: string;
	lat: number;
	lon: number;
};

class AddressService {
	async searchAddress(query: string, limit: number): Promise<Address[]> {
		const query_uri = encodeURIComponent(query);
		const response = await fetch('https://api-adresse.data.gouv.fr/search/?q=' + query_uri + "&limit=" + String(limit));
		const js = await response.json();
		return js.features.map((x) => {
			return x.properties;
		});
	}
}

let service = new AddressService();
service.searchAddress("8 bd du port", 10)
	.then(res => console.log(res))
	.catch(error => {
		console.error(error)
	});