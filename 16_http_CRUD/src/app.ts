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
	id?: string;
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
	protected restaurants_categories_url: string;
	protected catKiller/*Show*/: DeleteClient<Category>;

	constructor(url: string, restaurants_url: string, restaurants_categories_url: string) {
		this.catKiller = new DeleteClient<Category>(url);
		this.restaurants_url = restaurants_url;
		this.restaurants_categories_url = restaurants_categories_url;
	}

	public async execute(): Promise<void> {
		const category = await this.catKiller.execute();
		if(!category)
			return;
			
		const restaurants = await new ReadClient<Restaurant[]>(this.restaurants_url).execute();
		if(!restaurants)
			return;

		for (let rest of restaurants) {
			let catID = rest.categoryIds.filter((id: string) => id != category.id);
			rest.categoryIds = catID;
			await new UpdateClient<Restaurant>(`${this.restaurants_url}/${rest.id}`, rest).execute();
		}

		const restCategories = await new ReadClient<RestaurantCategory[]>(this.restaurants_categories_url).execute();
		if(!restCategories)
			return;

		for(const restCat of restCategories){
			if(restCat.categoryId != null && restCat.restaurantId != null)
				continue;

			await new DeleteClient<RestaurantCategory>(`${this.restaurants_categories_url}/${restCat.id}`).execute();
		}
	}
}


class ModifyCategory {
	protected restaurants_url: string;
	protected restaurants_categories_url: string;
	protected catUpdater: UpdateClient<Category>;

	constructor(url: string, data : Category, restaurants_url: string, restaurants_categories_url: string) {
		this.catUpdater = new UpdateClient<Category>(url, data);
		this.restaurants_url = restaurants_url;
		this.restaurants_categories_url = restaurants_categories_url;
	}

	public async execute(): Promise<void> {
		const category = await this.catUpdater.execute();
		if(!category)
			return;
		
		let restaurants = await new ReadClient<Restaurant[]>(this.restaurants_url).execute();
		if(!restaurants)
			return;

		for (let rest of restaurants) {
			if(category.restaurantIds.indexOf(rest.id) < 0) {
				rest.categoryIds = rest.categoryIds.filter((id: string) => id != category.id);
				await new UpdateClient<Restaurant>(`${this.restaurants_url}/${rest.id}`, rest).execute();
			}
		}

		const restCategories = await new ReadClient<RestaurantCategory[]>(this.restaurants_categories_url).execute();
		if(!restCategories)
			return;

		for(const restCat of restCategories) {
			if(restCat.categoryId != null && restCat.restaurantId != null)
				continue;

			await new DeleteClient<RestaurantCategory>(`${this.restaurants_categories_url}/${restCat.id}`).execute();
		}

		for(const rest of restaurants) {
			let out = restCategories.find((restCat) => restCat.restaurantId == rest.id && restCat.categoryId == category.id);
			if(out == undefined) {
				const data: RestaurantCategory = {
					categoryId: category.id,
					restaurantId: rest.id
				};

				await new CreateClient<RestaurantCategory>(this.restaurants_categories_url, data).execute();
			}
		}
	}
}


class DeleteRestaurant {
	protected category_url: string;
	protected restaurants_categories_url: string;
	protected restKiller: DeleteClient<Restaurant>;

	constructor(url: string, category_url: string, restaurants_categories_url: string) {
		this.restKiller = new DeleteClient<Restaurant>(url);
		this.category_url = category_url;
		this.restaurants_categories_url = restaurants_categories_url;
	}

	public async execute(): Promise<void> {
		const restaurant = await this.restKiller.execute();
		if(!restaurant)
			return;
			
		const categories = await new ReadClient<Category[]>(this.category_url).execute();
		if(!categories)
			return;

		for(const cat of categories) {
			const restID = cat.restaurantIds.filter((id: string) => id != restaurant.id);
			cat.restaurantIds = restID;
			await new UpdateClient<Restaurant>(`${this.category_url}/${cat.id}`, cat).execute();
		}

		const restCategories = await new ReadClient<RestaurantCategory[]>(this.restaurants_categories_url).execute();
		if(!restCategories)
			return;

		for(const restCat of restCategories) {
			if(restCat.categoryId != null && restCat.restaurantId != null)
				continue;

			await new DeleteClient<RestaurantCategory>(`${this.restaurants_categories_url}/${restCat.id}`).execute();
		}
	}
}


class ModifyRestaurant {
	protected category_url: string;
	protected restaurants_categories_url: string;
	protected restUpdater: UpdateClient<Restaurant>;

	constructor(url: string, data : Category, category_url: string, restaurants_categories_url: string) {
		this.restUpdater = new UpdateClient<Category>(url, data);
		this.category_url = category_url;
		this.restaurants_categories_url = restaurants_categories_url;
	}

	public async execute(): Promise<void> {
		const restaurant = await this.restUpdater.execute();
		if(!restaurant)
			return;
			
		const categories = await new ReadClient<Category[]>(this.category_url).execute();
		if(!categories)
			return;

		for(const category of categories) {
			if(restaurant.categoryIds.indexOf(category.id) >= 0) {
				if(category.restaurantIds.indexOf(restaurant.id) < 0)
					category.restaurantIds.push(restaurant.id);
			} else
				category.restaurantIds = category.restaurantIds.filter((id: string) => id != restaurant.id);
			
			await new UpdateClient<Restaurant>(`${this.category_url}/${category.id}`, category).execute();
		}

		const restCategories = await new ReadClient<RestaurantCategory[]>(this.restaurants_categories_url).execute();
		if(!restCategories)
			return;

		for(const restCat of restCategories) {
			if(restCat.categoryId != null && restCat.restaurantId != null)
				continue;

			await new DeleteClient<RestaurantCategory>(`${this.restaurants_categories_url}/${restCat.id}`).execute();
		}

		for(const cat of categories) {
			let out = restCategories.find((restCat) => restCat.categoryId == cat.id && restCat.restaurantId == restaurant.id);
			if(out == undefined) {
				const data: RestaurantCategory = {
					categoryId: cat.id,
					restaurantId: restaurant.id
				};

				await new CreateClient<RestaurantCategory>(this.restaurants_categories_url, data).execute();
			}
		}
	}
}


//lecture de tous les restaurants
const restaurant_url = "http://localhost:3000/restaurants";
const category_url = "http://localhost:3000/categories";
const restaurants_categories_url = "http://localhost:3000/restaurantCategories";

const readClient = new ReadClient<Restaurant[]>(restaurant_url);
readClient.execute().then((restaurants) => {
	if (restaurants) {
		restaurants.forEach((restaurant) => {
			console.log(`READ id : ${restaurant.id} name : ${restaurant.name} `);
		});
	}
});

//création du restaurant "Le Restaurant de la Joie"
const data: Restaurant = {
	name: "Le Restaurant de la Joie",
	description: "Un restaurant où la joie est au menu",
	categoryIds: ["71b2"],
};

//modification du restaurant "Le Grill Marrant" pour le renommer "Le Grill Super Marrant"
const updatedData: Restaurant = {
	name: "Le Grill Super Marrant",
	categoryIds: [
		"34b0", "71b2"
	]
};

const createClient = new CreateClient<Restaurant>(restaurant_url, data);
createClient.execute().then(() => {
	const deleteClient = new DeleteRestaurant(`${restaurant_url}/3aa8`, category_url, restaurants_categories_url);
	deleteClient.execute().then(() => {
		const updateRestaurant = new ModifyRestaurant(`${restaurant_url}/12b3`, updatedData, category_url, restaurants_categories_url);
		updateRestaurant.execute().then(() => {
			const deleteCategory = new DeleteCategory(`${category_url}/71b2`, restaurant_url, restaurants_categories_url);
			deleteCategory.execute();
		});
	});
});

