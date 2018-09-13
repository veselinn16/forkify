// Global app controller
import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import Likes from './models/Likes';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likesView from './views/likesView';
import { elements, renderLoader, clearLoader } from './views/base';

// Global state of the app
// - search object
// - current recipe object
// - shopping list object
// - liked object
const state = {};
window.state = state;

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
        // Prepare UI for changes - remove old recipe & put loader
        recipeView.clearRecipe();
        renderLoader(elements.recipe);

        // Highlight selected recipe
        if(state.search) {
            searchView.highlightSelected(id);
        }

        // Create new recipe object
        state.recipe = new Recipe(id);

        try {
            // Get recipe data and parse ingredients
            await state.recipe.getRecipe();
            state.recipe.parseIngredients();

            // Calculate servings and time
            state.recipe.calcTime();
            state.recipe.calcServings();
            
            // Clear loader and render recipe
            clearLoader();
            recipeView.renderRecipe(state.recipe, state.likes.isLiked(id));
        } catch(err) {
            alert('Error processing recipe :(')
        }
    }
};

// Add same function to multiple event listeners
['hashchange', 'load'].forEach(e => window.addEventListener(e, controlRecipe));

// List Controller
const controlList = () => {
    // Create a new list if ther is none yet
    if(!state.list) state.list = new List();

    // Add each ingredient to the list & to the UI
    state.recipe.ingredients.forEach(el => {
        const item = state.list.addItem(el.count, el.unit, el.ingredient);
        listView.renderItem(item);
    });
}

// Handle delete and update list item events
elements.shopping.addEventListener('click', e => {
    const id = e.target.closest('.shopping__item').dataset.itemid;

    // Handle delete event
    if(e.target.matches('.shopping__delete, .shopping__delete *')) {
        // delete from state and UI
        state.list.deleteItem(id);
        listView.deleteItem(id);

        // handle count update
    } else if (e.target.matches('.shopping__count-value')) {
        const value = parseFloat(e.target.value, 10);
        state.list.updateCount(id, value);
    }
});

// Like Controller
const controlLike = () => {
    if(!state.likes) state.likes = new Likes();

    const currentID = state.recipe.id;
    if(!state.likes.isLiked(currentID)) {
        //user has not yet liked current recipe
        // Add like to state
        const newLike = state.likes.addLike(currentID, state.recipe.title, state.recipe.author, state.recipe.img);

        // Toggle like button
        likesView.toggleLikeButton(true);

        // Add like to UI list
        likesView.renderLike(newLike);
    } else {
        // user has liked current recipe
        // Remove like from state
        state.likes.deleteLike(currentID);
        // Toggle like button
        likesView.toggleLikeButton(false);

        // Remove like from UI
        likesView.deleteLike(currentID);
    }
    likesView.toggleLikeMenu(state.likes.getNumberLikes());
};

// Restore liked recipes on page load
window.addEventListener('load', () => {
    state.likes = new Likes();
    
    // Restore likes
    state.likes.readStorage();

    // Toggle button
    likesView.toggleLikeMenu(state.likes.getNumberLikes());

    // Render existing liked recipes
    state.likes.likes.forEach(like => likesView.renderLike(like));
});

// Handle recipe button clicks
elements.recipe.addEventListener('click', e => {
    if(e.target.matches('.btn-decrease, .btn-decrease *')) {
        if(state.recipe.servings > 1) {
            // Decrease button is clicked
            state.recipe.updateServings('decrease');
            recipeView.updateServingsIngredients(state.recipe);
        }
    } else if(e.target.matches('.btn-increase, .btn-increase *')) {
        // Increase button is clicked
        state.recipe.updateServings('increase');
        recipeView.updateServingsIngredients(state.recipe);
    } else if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
        // Add ingredients to shopping list
        controlList();
    } else if (e.target.matches('.recipe__love, .recipe__love *')) {
        // Like controller
        controlLike();
    }
});