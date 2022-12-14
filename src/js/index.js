import Search from './models/Search';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likesView from './views/likesView';
import Likes from './models/Likes';
import List from './models/List';
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
      recipeView.renderRecipe(state.recipe,state.likes.isLiked(id));

    } catch (e) { 
        alert("Recipe processing error: " + e.message);
      }
  }
}

['hashchange', 'load'].forEach(element => { window.addEventListener(element,controlRecipe)});


/** 
 * LIST CONTROLLER
 */
 const controlList = () => {
  // Create a new list IF there in none yet
  if (!state.list) state.list = new List();

  // Add each ingredient to the list and UI
  state.recipe.ingredients.forEach(el => {
      const item = state.list.addItem(el.count, el.unit, el.ingredient);
      listView.renderItem(item);
  });
}

// Handle delete and update list item events
elements.shopping.addEventListener('click', e => {
  const id = e.target.closest('.shopping__item').dataset.itemid;

  // Handle the delete button
  if (e.target.matches('.shopping__delete, .shopping__delete *')) {
      // Delete from state
      state.list.deleteItem(id);

      // Delete from UI
      listView.deleteItem(id);

  // Handle the count update
  } else if (e.target.matches('.shopping__count-value')) {
      const val = parseFloat(e.target.value, 10);
      state.list.updateCount(id, val);
  }
});


/** 
 * LIKE CONTROLLER
 */


 const controlLike = () => {
  if (!state.likes) state.likes = new Likes();
  const currentID = state.recipe.id;

  // User has NOT yet liked current recipe
  if (!state.likes.isLiked(currentID)) {
      // Add like to the state
      const newLike = state.likes.addLike(
          currentID,
          state.recipe.title,
          state.recipe.author,
          state.recipe.image
      );
      // Toggle the like button
      likesView.toggleLikeBtn(true);

      // Add like to UI list
      likesView.renderLike(newLike);

  // User HAS liked current recipe
  } else {
      // Remove like from the state
      state.likes.deleteLike(currentID);

      // Toggle the like button
      likesView.toggleLikeBtn(false);

      // Remove like from UI list
      likesView.deleteLike(currentID);
  }
  likesView.toggleLikeMenu(state.likes.getNumLikes());
};

// Restore liked recipes on page load
window.addEventListener('load', () => {
  state.likes = new Likes();
  
  // Restore likes
  state.likes.readStorage();

  // Toggle like menu button
  likesView.toggleLikeMenu(state.likes.getNumLikes());

  // Render the existing likes
  state.likes.likes.forEach(like => likesView.renderLike(like));
});

// Restore liked recipes on page load
window.addEventListener('load', () => {
  state.likes = new Likes();
  
  // Restore likes
  state.likes.readStorage();

  // Toggle like menu button
  likesView.toggleLikeMenu(state.likes.getNumLikes());

  // Render the existing likes
  state.likes.likes.forEach(like => likesView.renderLike(like));
});


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


