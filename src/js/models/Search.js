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
      console.log("error: " + err);
    }
  }
}