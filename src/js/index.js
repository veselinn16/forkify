// Global app controller
import Search from './models/Search';
import * as searchView from './views/searchViews';
import { elements } from './views/base';

// Global state of the app
// - search object
// - current recipe object
// - shopping list object
// - liked object
const state = {};

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

        // Search for recipes
        await state.search.getResults();

        // Display results in the UI, AFTER we receive results
        searchView.displayResults(state.search.result);

        searchView.clearInput();
    }
}

elements.searchForm.addEventListener('submit', e => {
    // prevent reload of page
    e.preventDefault();
    controlSearch();
})