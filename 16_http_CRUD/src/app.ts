interface AlloResto {
	restaurants: Restaurant[];
	categories: Category[];
	restaurantCategories: RestaurantCategory[];
}

interface Category {
	id?: string;
	name?: string;
	restaurantIds?: string[];
}

interface RestaurantCategory {
	restaurantId?: string;
	categoryId?: string;
}

interface Restaurant {
	id?: string;
	name?: string;
	description?: string;
	categoryIds?: string[];
}

//interfaces créées avec le site https://app.quicktype.io/

abstract class HttpClient<T> {
	protected url: string;
	protected options: RequestInit;

	constructor(url: string) {
		this.url = url;
		this.options = {
			headers: {
				"Content-Type": "application/json",
			},
		};
	}

	public async execute(): Promise<T | void> {
		try {
			const response = await fetch(this.url, this.options);
			if (response.ok) {
				const data: T = await response.json(); //extraction du corps de la réponse au format JSON
				return data;
			}
		} catch (error) {
			console.error("There was a problem with the fetch operation: ", error);
		}
	}
}

class CreateClient<T> extends HttpClient<T> {
	constructor(url: string, data: T) {
		super(url);
		this.options.method = "POST";
		this.options.body = JSON.stringify(data);
	}
}

class ReadClient<T> extends HttpClient<T> {
	constructor(url: string) {
		super(url);
		this.options.method = "GET";
	}
}

class UpdateClient<T> extends HttpClient<T> {
	constructor(url: string, data: T) {
		super(url);
		this.options.method = "PATCH";
		this.options.body = JSON.stringify(data);
	}
}

class DeleteClient<T> extends HttpClient<T> {
	constructor(url: string) {
		super(url);
		this.options.method = "DELETE";
	}
}

//lecture de tous les restaurants
const url = "http://localhost:3000/restaurants";

const readClient = new ReadClient<Restaurant[]>(url);
readClient.execute().then((restaurants) => {
	if (restaurants) {
		restaurants.forEach((restaurant) => {
			console.log(`READ id : ${restaurant.id} name : ${restaurant.name} `);
		});
	}
});

//suppression du restaurant "Le Café Rigolo"
const deleteClient = new DeleteClient<Restaurant>(`${url}/3aa8`);
deleteClient.execute().then((restaurant) => {
	if (restaurant) {
		console.log(`DELETE id : ${restaurant.id} name : ${restaurant.name} `);
	}
});

//création du restaurant "Le Restaurant de la Joie"
const data: Restaurant = {
	name: "Le Restaurant de la Joie",
	description: "Un restaurant où la joie est au menu",
	categoryIds: ["71b2"],
};

const createClient = new CreateClient<Restaurant>(url, data);
createClient.execute().then((restaurant) => {
	if (restaurant) {
		console.log(`CREATE id : ${restaurant.id} name : ${restaurant.name} `);
	}
});

//modification du restaurant "Le Grill Marrant" pour le renommer "Le Grill Super Marrant"
const updatedData: Restaurant = {
	name: "Le Grill Super Marrant",
};

const updateClient = new UpdateClient<Restaurant>(`${url}/12b3`, updatedData);
updateClient.execute().then((restaurant) => {
	if (restaurant) {
		console.log(`UPDATE id : ${restaurant.id} name : ${restaurant.name} `);
	}
});

/*la sortie de la console devrait être : (attention à l'order des opérations asynchrones 
qui peut varier à chaque exécution du code)

READ id : a45d name : Le Bistrot du Rire 
READ id : 12b3 name : Le Grill Marrant 
READ id : 3aa8 name : Le Café Rigolo 
READ id : 55fa name : La Crêperie Rigolote 
DELETE id : 3aa8 name : Le Café Rigolo 
UPDATE id : 12b3 name : Le Grill Super Marrant 
CREATE id : 82ef name : Le Restaurant de la Joie 
*/
