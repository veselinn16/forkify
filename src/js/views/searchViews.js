import { elements } from './base'

// Get value of search field input
export const getInput = () => elements.searchInput.value;

// Clears input after displaying result in UI
export const clearInput = () => {
    elements.searchInput.value = '';
}

export const clearResults = () => {
    elements.searchResultList.innerHTML = '';
}

// Shorten the names of the recipes if they are above 17 chars long
const limitRecipeTitle = (title, limit = 17) => {
    const newTitle = [];
    if(title.length > limit) {
        title.split(' ').reduce((accumulator, current) => {
            // 'Pasta with tomato and spinach':
            // 1st iteration -> accumulator = 0; accumulator = 0 + 'Pasta'.length = 5; 5 < 17; push Pasta to newTitle; accumulator = 0 + 'Pasta'.length --> for next iteration
            // 2nd iteration -> accumulator = 5; accumulator = 5 + 'with'.length = 9; 9 < 17; push with to newTitle; accumulator = 5 + 'with'.length --> for next iteration
            if(accumulator + current.length <= limit) {
                newTitle.push(current)
            }
            return accumulator + current.length;
        }, 0);

        // return
        return `${newTitle.join(' ')} ...` 
    }
    return title
}

const displayRecipe = recipe => {
    const html = `
    <li>
        <a class="results__link" href="#${recipe.recipe_id}">
            <figure class="results__fig">
                <img src="${recipe.image_url}" alt="${recipe.title}">
            </figure>
            <div class="results__data">
                <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
                <p class="results__author">${recipe.publisher}</p>
            </div>
        </a>
    </li>
    `;
    elements.searchResultList.insertAdjacentHTML('beforeend', html);
}

export const displayResults = recipes => {
    recipes.forEach(displayRecipe);
};