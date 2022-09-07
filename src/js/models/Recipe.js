import axios from 'axios';

export default class Recipe {
  constructor(id) {
    this.id = id;
  }

  async getRecipe() {
    try {
      const res = await axios(`https://forkify-api.herokuapp.com/api/get?rId=${this.id}`);
      console.log(res);
      this.title = res.data.recipe.title;
      this.image = res.data.recipe.image_url;
      this.author = res.data.recipe.publisher;
      this.url = res.data.recipe.source_url;
      this.ingredients = res.data.recipe.ingredients;
    } catch (err) { 
        console.log(err);
        alert(`something went wrong :(`);
    }
  }

  calcTime() {
    // Assuming that we have 15 minutes for every 3 ingredients
    const numIng = this.ingredients.length;
    const periods = Math.ceil(numIng / 3);
    this.time = periods * 15; 
  }

  calcServings() {
    this.servings = 4;
  }

}