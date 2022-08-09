class Config {
    constructor() {
        this.sleepMin = 500;
        this.sleepMax = 2000;
        // this.wsServer = "ws://YX1:8111/ws";
        // this.wsServer = "ws://localhost:8111/ws";
        //this.wsServer = "ws://pokerclient.polpoker.com/ws"
	this.wsServer = "ws://10.128.15.199:8111/ws"
        //this.wsServer = "ws://34.89.40.196/ws";
        // this.wsServer = "ws://cryptopoker.fun/ws";
        this.maxSeat = 7;
        this.sitDelay = 2000;
        // this.wsServer = "ws://cryptopoker.fun/ws";
        // this.wsServer = "ws://cryptopoker.fun//ws";
    }    
}

module.exports = Config;
