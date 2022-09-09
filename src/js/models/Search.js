import axios from 'axios';

export default class Search {

  constructor(query) {
    this.query = query;
  }

  async  getResults() {
    try {
      const results = await axios(`https://forkify-api.herokuapp.com/api/search?q=${this.query}`);
      this.result = results.data.recipes;
    }
    catch(err) {
      alert(`error in searching recipes: ${err.message}`);
    }
  }
}