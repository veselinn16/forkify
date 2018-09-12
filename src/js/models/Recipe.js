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
        const unitsLong = ['tablespoons', 'tablespoon', 'ounces', 'ounce', 'teaspoons', 'teaspoon'];
        const unitsShort = ['tbsp', 'tbsp', 'oz', 'oz', 'tsp', 'tsp'];
        const newIngredients = this.ingredients.map(el => {
            // If we find in the ingredients of a recipe a word from the unitsLong, array, replace it with its shorter counterpart in unitsShort array
            let ingredient = el.toLowerCase();
            unitsLong.forEach((unit, i) => {
                ingredient = ingredient.replace(unit, unitsShort[i]);
            });

            // Remove parentheses and replace them with empty space
            ingredient = ingredient.replace(/ *\([^)]*\) */g, ' ');

            // Parse ingredients into count, unit and ingredient
                // - convert ingredients string to array
            const arrIng = ingredient.split(' ');

                // - returns the index of the element when it matches the test
            const unitIndex = arrIng.findIndex(el2 => unitsShort.includes(el2));

            let objIngredient;
            if(unitIndex > -1) {
                // test is true for one or more elements
                const arrCount = arrIng.slice(0, unitIndex); // Ex.: 4 1/2 cups -> arrCount = [4, 1/2]
                
                let count;
                if(arrCount.length === 1) {
                    count = eval(arrIng[0].replace('-', '+'));
                } else {
                    count = eval(arrIng.slice(0, unitIndex).join('+'));
                }

                objIngredient = {
                    count,
                    unit: arrIng[unitIndex],
                    ingredient: arrIng.slice(unitIndex + 1).join(' ')
                };
            } else if (parseInt(arrIng[0], 10)) {
                // there is no unit found, but the 1st element is a number
                objIngredient = {
                    count: parseInt(arrIng[0], 10),
                    unit: '',
                    ingredient: arrIng.slice(1).join(' ')
                }
            } else if (unitIndex === -1) {
                // no unit was found
                objIngredient = {
                    count: 1,
                    unit: '',
                    ingredient
                }
            }
            return objIngredient;
        });
        this.ingredients = newIngredients;
    }
}