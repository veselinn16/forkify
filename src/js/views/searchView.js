import { elements } from './base'

// Get value of search field input
export const getInput = () => elements.searchInput.value;

// Clears input after displaying result in UI
export const clearInput = () => {
    elements.searchInput.value = '';
};

// Clear recipes section
export const clearResults = () => {
    elements.searchResultList.innerHTML = '';
    elements.searchResultsPages.innerHTML = '';
};

export const highlightSelected = id => {
    // first remove if there is any recipe selected previously
    const resultsArr = Array.from(document.querySelectorAll('.results__link'));
    resultsArr.forEach(el => {
        el.classList.remove('results__link--active');
    })
    // Select recipe based on css attribute
    document.querySelector(`.results__link[href="#${id}"]`).classList.add('results__link--active');
};

// Shorten the names of the recipes if they are above 17 chars long
export const limitRecipeTitle = (title, limit = 17) => {
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
};

// Create a button for the pagination in the recipes tab
// type = "prev" or "next"
const createButton = (page, type) => `
    <button class="btn-inline results__btn--${type}" data-goto="${type === 'next' ? page + 1 : page - 1}">
        <span>Page ${type === 'next' ? page + 1 : page - 1}</span>    
        <svg class="search__icon">
            <use href="img/icons.svg#icon-triangle-${type === 'next' ? 'right' : 'left'}"></use>
        </svg>        
    </button>
`;

const renderButtons = (page, numResults, resPerPage) => {
    const pages = Math.ceil(numResults / resPerPage);
    let button;

    if(page === 1 && pages > 1) {
        // only a button for next page
        button = createButton(page, 'next');
    } else if(page < pages) {
        // display both buttons
        button = `
            ${createButton(page, 'prev')}
            ${createButton(page, 'next')}
        `;
    } else if(page === pages && pages > 1){
        // only a button for previous page
        button = createButton(page, 'prev');
    }

    elements.searchResultsPages.insertAdjacentHTML('afterbegin', button);
};

export const displayResults = (recipes, page = 1, resPerPage = 10) => {
    // Display results of current page
    const start = (page - 1) * resPerPage;
    const end = page * resPerPage;

    recipes.slice(start, end).forEach(displayRecipe);

    // Display pagination results
    renderButtons(page, recipes.length, resPerPage);
};