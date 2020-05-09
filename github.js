class Github{
    constructor( username = null ){
        this.url = "https://api.github.com";
        this.repos = {};
        this.user = {};
        this.username = username;
    }
    async getRepos(){
        this.repos = await fetch( this.url+"/users/"+this.username+"/repos" );
        this.repos = await this.repos.json();
    }
    async getUser(){
        this.user = await fetch( this.url+"/users/"+this.username);
        this.user = await this.user.json();
    }
}