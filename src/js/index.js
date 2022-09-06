import Search from './models/Search';
import * as searchView from './views/searchView';
import { elements , renderLoader,clearLoader } from './views/base';

/** Global state of the app
 * - Search object
 * - Current Recipe object
 * - Shopping list object
 * - liked recipes
 */

const state = {}

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

    // 4) Search for recipes
    await state.search.getResults();

    // 5) Render results on UI
    console.log(state.search.result);
    clearLoader();
    searchView.renderResults(state.search.result);
  }
}

elements.searchForm.addEventListener('submit', (e) => {
  e.preventDefault();
  constrolSearch();
});

elements.searchResPages.addEventListener('click', (e) => {
  console.log(e.target.value);
});
