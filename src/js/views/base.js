export const elements = {
    searchInput : document.querySelector('.search__field'),
    searchForm : document.querySelector('.search'),
    searchResultList: document.querySelector('.results__list'),
    searchResults: document.querySelector('.results'),
    searchResultsPages: document.querySelector('.results__pages'),
    recipe: document.querySelector('.recipe'),
    shopping: document.querySelector('.shopping__list'),
    likesMenu: document.querySelector('.likes__field')
};

// Strings for html elements, which are not in the DOM at page load
export const elementStrings = {
    loader: 'loader'
};

// Put loader in UI
export const renderLoader = parent => {
    const loader = `
        <div class="${elementStrings.loader}">
            <svg>
                <use href="img/icons.svg#icon-cw"></use>
            </svg>
        </div>
    `;

    // attatch it to parent
    parent.insertAdjacentHTML('afterbegin', loader);
};

// Remove loader from UI
export const clearLoader = () => {
    const loader = document.querySelector(`.${elementStrings.loader}`);
    (loader) && loader.parentElement.removeChild(loader)
};