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

class DeleteCategory {
	protected restaurants_url: string;
	protected catKiller/*Show*/: DeleteClient<Category>;

	constructor(url: string, restaurants_url: string) {
		this.catKiller = new DeleteClient<Category>(url);
		this.restaurants_url = restaurants_url;
	}

	public async execute(): Promise<Restaurant[] | void> {
		return this.catKiller.execute().then((category : Category) => {
			if(!category)
				return;
			
			return new ReadClient<Restaurant[]>(this.restaurants_url)
			.execute()
			.then((restaurants) => {
				if(!restaurants)
					return;

				restaurants.map((rest) => {
					let catID = rest.categoryIds.filter((id: string) => id != category.id);
					rest.categoryIds = catID;
					let updateReq = new UpdateClient<Restaurant>(`${this.restaurants_url}/${rest.id}`, rest);
					return updateReq.execute();
				});

				return restaurants;
			});
		})
		.catch(() => {
			console.log("Already deleted !");
		});
	}
}


class ModifyCategory {
	protected restaurants_url: string;
	protected catUpdater: UpdateClient<Category>;

	constructor(url: string, data : Category, restaurants_url: string) {
		this.catUpdater = new UpdateClient<Category>(url, data);
		this.restaurants_url = restaurants_url;
	}

	public async execute(): Promise<Restaurant[] | void> {
		return this.catUpdater.execute().then((category : Category) => {
			if(!category)
				return;
			
			return new ReadClient<Restaurant[]>(this.restaurants_url)
			.execute()
			.then((restaurants) => {
				if(!restaurants)
					return;

				restaurants.map((rest) => {
					if(!(rest.id in category.restaurantIds))
						rest.categoryIds = rest.categoryIds.filter((id: string) => id != category.id);
					let updateReq = new UpdateClient<Restaurant>(`${this.restaurants_url}/${rest.id}`, rest);
					return updateReq.execute();
				});

				return restaurants;
			});
		})
		.catch(() => {
			console.log("Already deleted !");
		});
	}
}


class DeleteRestaurant {
	protected category_url: string;
	protected restKiller: DeleteClient<Restaurant>;

	constructor(url: string, category_url: string) {
		this.restKiller = new DeleteClient<Restaurant>(url);
		this.category_url = category_url;
	}

	public async execute(): Promise<Category[] | void> {
		return this.restKiller.execute().then((restaurant : Restaurant) => {
			if(!restaurant)
				return;
			
			return new ReadClient<Category[]>(this.category_url)
			.execute()
			.then((categories) => {
				if(!categories)
					return;

				categories.map((cat) => {
					const restID = cat.restaurantIds.filter((id: string) => id != restaurant.id);
					cat.restaurantIds = restID;
					let updateReq = new UpdateClient<Restaurant>(`${this.category_url}/${cat.id}`, cat);
					return updateReq.execute();
				});

				return categories;
			});
		})
		.catch(() => {
			console.log("Already deleted !");
		});
	}
}


class ModifyRestaurant {
	protected category_url: string;
	protected restUpdater: UpdateClient<Restaurant>;

	constructor(url: string, data : Category, category_url: string) {
		this.restUpdater = new UpdateClient<Category>(url, data);
		this.category_url = category_url;
	}

	public async execute(): Promise<Category[] | void> {
		return this.restUpdater.execute().then((restaurant: Restaurant) => {
			if(!restaurant)
				return;
			
			return new ReadClient<Category[]>(this.category_url)
			.execute()
			.then((categories : Category[]) => {
				if(!categories)
					return;

				categories.map((category : Category) => {
					if(category.id in restaurant.categoryIds) {
						if(!(restaurant.id in category.restaurantIds))
							category.restaurantIds.push(restaurant.id);
					} else
						category.restaurantIds = category.restaurantIds.filter((id: string) => id != restaurant.id);
					
					let updateReq = new UpdateClient<Restaurant>(`${this.category_url}/${category.id}`, category);
					return updateReq.execute();
				});

				return categories;
			});
		})
		.catch(() => {
			console.log("Already deleted !");
		});
	}
}


//lecture de tous les restaurants
const restaurant_url = "http://localhost:3000/restaurants";
const category_url = "http://localhost:3000/categories";

const readClient = new ReadClient<Restaurant[]>(restaurant_url);
readClient.execute().then((restaurants) => {
	if (restaurants) {
		restaurants.forEach((restaurant) => {
			console.log(`READ id : ${restaurant.id} name : ${restaurant.name} `);
		});
	}
});

//suppression du restaurant "Le Café Rigolo"
const deleteClient = new DeleteRestaurant(`${restaurant_url}/3aa8`, category_url);
deleteClient.execute();

//création du restaurant "Le Restaurant de la Joie"
const data: Restaurant = {
	name: "Le Restaurant de la Joie",
	description: "Un restaurant où la joie est au menu",
	categoryIds: ["71b2"],
};

const createClient = new CreateClient<Restaurant>(restaurant_url, data);
createClient.execute().then((restaurant) => {
	if (restaurant) {
		console.log(`CREATE id : ${restaurant.id} name : ${restaurant.name} `);
	}
});

//modification du restaurant "Le Grill Marrant" pour le renommer "Le Grill Super Marrant"
const updatedData: Restaurant = {
	name: "Le Grill Super Marrant",
};

const updateRestaurant = new ModifyRestaurant(`${restaurant_url}/12b3`, updatedData, category_url);
updateRestaurant.execute();

const deleteCategory = new DeleteCategory(`${category_url}/71b2`, restaurant_url);
deleteCategory.execute();
