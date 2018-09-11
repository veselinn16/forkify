import { apiKey } from '../config'

export default class Search {
    constructor(query) {
        this.query = query;
    }
    async getResults() {
        
        try{
            const result = await fetch(`https://www.food2fork.com/api/search?key=${apiKey}&q=${this.query}`)
            const data = await result.json();
            this.result = data.recipes
        } catch(err) {
            console.log(err)
            alert('Something went wrong :(')
        }
    }
}