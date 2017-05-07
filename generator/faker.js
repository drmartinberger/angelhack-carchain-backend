class Faker {
    constructor() {
        this.lat = 48.14483530;
        this.lon = 11.55800670;
    }

    randomInt (low, high) {
        return Math.floor(Math.random() * (high - low) + low);
    }

    getAsset() {
        this.lat += this.randomInt(10,50)/1000;
        this.lon += this.randomInt(10,50)/1000;

        return {
            speed: this.randomInt(30, 50),
            acceleration: this.randomInt(20, 70),
            lat: this.lat,
            lon: this.lon
        } 
    } 

}

module.exports = new Faker();
