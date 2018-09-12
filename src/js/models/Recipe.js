import { apiKey } from "../config";

export default class Recipe {
    constructor(id) {
        this.id = id;
    }

    async getRecipe() {
        try {
            const response = await fetch(`https://www.food2fork.com/api/get?key=${apiKey}&rId=${this.id}`);
            const data = await response.json();
            this.title = data.recipe.title;
            this.author = data.recipe.publisher;
            this.img = data.recipe.image_url;
            this.url = data.recipe.source_url;
            this.ingredients = data.recipe.ingredients;
        } catch(err) {
            console.log(err);
            alert('Something went wrong :(')
        }
    }

    calcTime() {
        // Assuming we need 15 min for each 3 ingredients
        const numOfIng = this.ingredients.length;
        const periods = Math.ceil(numOfIng / 3);
        this.time = periods * 15;
    }

    calcServings() {
        this.servings = 4;
    }

    parseIngredients() {
        const unitsLong = ['tablespoons', 'tablespoon', 'ounce', 'ounces', 'teaspoon', 'teaspoons'];
        const unitsShort = ['tbsp', 'tbsp', 'oz', 'oz', 'tsp', 'tsp'];
        const newIngredients = this.ingredients.map(el => {
            // If we find in the ingredients of a recipe a word from the unitsLong, array, replace it with its shorter counterpart in unitsShort array
            let ingredient = el.toLowerCase();
            unitsLong.forEach((unit, i) => {
                ingredient = ingredient.replace(unit, unitsShort[i]);
            });

            // Remove parentheses


            // Parse ingredients into count, unit and ingredient
        });
        this.ingredients = newIngredients;
    }
}