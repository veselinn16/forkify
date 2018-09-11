import { elements } from './base'

// Get value of search field input
export const getInput = () => elements.searchInput.value;

// clears input after displaying result in UI
export const clearInput = () => {
    elements.searchInput.value = '';
}

export const clearResults = () => {
    elements.searchResultList.innerHTML = '';
}

const displayRecipe = recipe => {
    const html = `
    <li>
        <a class="results__link" href="#${recipe.recipe_id}">
            <figure class="results__fig">
                <img src="${recipe.image_url}" alt="${recipe.title}">
            </figure>
            <div class="results__data">
                <h4 class="results__name">${recipe.title}</h4>
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