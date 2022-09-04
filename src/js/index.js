import Search from './models/Search';


/** Global state of the app
 * - Search object
 * - Current Recipe object
 * - Shopping list object
 * - liked recipes
 */


const state = {

}

const constrolSearch = () => {
    // 1) Get the query from view 
  const query = 'pizza';

  if(query) {
    // 2) New search object and add it to the state
    state.search = new Search(query);
    // 3) Prepare the UI for results

    // 4) Search for recipes
    state.search.getResults();

    // 5) Render results on UI


  }
  
}

document.querySelector('.search').addEventListener('submit', (e) => {
  e.preventDefault();
  constrolSearch();

})

const search = new Search('pizza');
search.getResults();
// const data = await search.getResults();
console.log(search);