export default class Search {
    constructor(query) {
        this.query = query;
    }
    async getResults() {
        const apiKey = 'd931a4c4e9d93ce0870315fb7968261e';
        try{
            const result = await fetch(`https://www.food2fork.com/api/search?key=${apiKey}&q=${this.query}`)
            const data = await result.json();
            this.result = data.recipes
        } catch(err) {
            console.log(err)
        }
    }
}