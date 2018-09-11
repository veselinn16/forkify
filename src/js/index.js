// Global app controller
import Search from './models/Search';
import Recipe from './models/Recipe';
import * as searchView from './views/searchViews';
import { elements, renderLoader, clearLoader } from './views/base';

// Global state of the app
// - search object
// - current recipe object
// - shopping list object
// - liked object
const state = {};

// Search Controller
const controlSearch = async () => {
    // Get query from view
    const query = searchView.getInput();

    // if there is a query 
    if(query) {
        // add a new Search object to the state.search variable
        state.search = new Search(query);

        // Prepare UI for results - clear input and clear results from previous search
        searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.searchResults);

        try {
            // Search for recipes
            await state.search.getResults();

            // Display results in the UI, AFTER we receive results
            searchView.displayResults(state.search.result);

            clearLoader();
            searchView.clearInput();
        } catch (err) {
            alert('Something went wrong while searching... :(');
            clearLoader();
        }
    }
};

elements.searchForm.addEventListener('submit', e => {
    // prevent reload of page
    e.preventDefault();
    controlSearch();
});

elements.searchResults.addEventListener('click', e => {
    // get the button only, not the svg or span
    const btn = e.target.closest('.btn-inline');
    if (btn) {
        // get value of data-goto attribute
        const goToPage = parseInt(btn.dataset.goto, 10);
        searchView.clearResults();
        searchView.displayResults(state.search.result, goToPage);
    }
});

// Recipe Controller
const controlRecipe = async () => {
    // get id from URL
    const id = window.location.hash.replace('#', '');
    if(id) {
        // Prepare UI for changes

        // Create new recipe object
        state.recipe = new Recipe(id);

        try {
            // Get recipe data
            await state.recipe.getRecipe();

            // Calculate servings and time
            state.recipe.calcTime();
            state.recipe.calcServings();
            
            // Render recipe
            console.log(state.recipe);

        } catch(err) {
            alert('Error processing recipe :(')
        }
    }
};

// Add same function to multiple event listeners
['hashchange', 'load'].forEach(e => window.addEventListener(e, controlRecipe));