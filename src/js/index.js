import Search from './models/Search';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import { elements , renderLoader,clearLoader } from './views/base';
import Recipe from './models/Recipe';

/** Global state of the app
 * - Search object
 * - Current Recipe object
 * - Shopping list object
 * - liked recipes
 */

const state = {}

/** 
 * Search Recipes Controller
*/

const constrolSearch = async () => {

    // 1) Get the query from view 
    const query = searchView.getInput();
    // console.log(query);

  if(query) {
    
    // 2) New search object and add it to the state
    state.search = new Search(query);

    // 3) Prepare the UI for results
    searchView.clearInputs();
    searchView.clearResults();
    renderLoader(elements.searchRes);

    try {
    // 4) Search for recipes
    await state.search.getResults();
    
    // 5) Render results on UI
    searchView.renderResults(state.search.result);
    clearLoader();
    
    } catch (e) {
      alert('Recipe searching error: ' + e.message);
      clearLoader();
    }
  }
}

elements.searchForm.addEventListener('submit', (e) => {
  e.preventDefault();
  constrolSearch();
});

elements.searchResPages.addEventListener('click', (e) => {
  const btn = e.target.closest('.btn-inline');
    if(btn) {
      const goToPage = parseInt(btn.dataset.goto,10);
      searchView.clearResults();
      searchView.renderResults(state.search.result,goToPage)
      }
});


/**
 * Recipe controller 
*/
const controlRecipe = async () => {
  const id = window.location.hash.replace('#','');
  if(id) {

    // Prepare UI for changes
    recipeView.clearRecipe();
    renderLoader(elements.recipe);

    // Create new recipe object
    state.recipe = new Recipe(id);

    try {

      // Get recipe data and parse the ingredients
      await state.recipe.getRecipe();
      state.recipe.parseIngredients();

      // Highlight selected search item
      if(state.search) searchView.highlightSelected(id);

      // Calculate servings and time
      state.recipe.calcTime();
      state.recipe.calcServings();

      // Render recipe 
      clearLoader();
      console.log(`Recipe is ${state}`);
      recipeView.renderRecipe(state.recipe);

    } catch (e) { 
        alert("Recipe processing error: " + e.message);
      }
  }
}

['hashchange', 'load'].forEach(element => { window.addEventListener(element,controlRecipe)});

// Handling recipe button clicks
elements.recipe.addEventListener('click', e => {
  if (e.target.matches('.btn-decrease, .btn-decrease *')) {
      // Decrease button is clicked
      if (state.recipe.servings > 1) {
          state.recipe.updateServings('dec');
          recipeView.updateServingsIngredients(state.recipe);
      }
  } else if (e.target.matches('.btn-increase, .btn-increase *')) {
      // Increase button is clicked
      state.recipe.updateServings('inc');
      recipeView.updateServingsIngredients(state.recipe);
  } else if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
      // Add ingredients to shopping list
      controlList();
  } else if (e.target.matches('.recipe__love, .recipe__love *')) {
      // Like controller
      controlLike();
  }
});