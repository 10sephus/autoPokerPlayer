const protobuf = require('protobufjs');
const WebSocket = require('ws');
// const gDataContainer = require('./classes.js');
let TableAction = require('./TableAction');
let Config = require('./Config.js');


class Bottino {
    awaitRandom = async function () {
        console.log("sleeping for " + await this.getRandomInt(this.sleepMax) + this.sleepMin);
        return await this.getRandomInt(this.sleepMax) + this.sleepMin;
    }
    constructor() {
        let config = new Config();
        this.tableAction = new TableAction();

        this.ws;
        this.mySeat;
        this.MyTable;
        this.sleepMin = config.sleepMin;
        this.sleepMax = config.sleepMax;
        this.wsServer = config.wsServer;
        this.pingTimer;
        this.wsAlive;
        this.pingStartDate;
        this.pingTime;
        this.isConnected;
        this.DataContainer;
        this.tableId;
        this.sleep(this.awaitRandom());
        this.root;
        this.justSubscribed = false;
        this.justFunding = false;
        // await sleep(this.awaitRandom());
        // await sleep(this.awaitRandom());
        // await sleep(this.awaitRandom());
        // await sleep(this.awaitRandom());
        // await sleep(this.awaitRandom());
    }
    async init(mySeat, myTable) {
        this.myTable = myTable;
        this.mySeat = mySeat;
        this.root = await protobuf.load('data.proto');
        this.ClientMessage = this.root.lookupType('shared.ClientMessage');
        this.DataContainer = this.root.lookupType('shared.DataContainer');
        this.ws1 = await this.connectToServer();
        this.tableId = "";
        this.playing = false;
        this.tableAction.ping(this.ClientMessage, this.ws1);
        this.pingTimer = setTimeout(() => { this.tableAction.ping(this.ClientMessage, this.ws1, this.pingTimer) }, 20000);

        this.ws1.onmessage = async (thisMessage) => {
            this.receiveMessage(thisMessage);
        }
        this.tableAction.TableRequest(this.ClientMessage, this.ws1);
        await this.sleep(1000);
        // this.tableAction.SubscribeTable(this.ClientMessage, this.ws1, this.tableId);
        // await this.sleep(1000);
        // this.tableAction.FundAccount(this.ClientMessage, this.ws1);
        // await this.sleep(1000);
        // this.tableAction.JoinTable(this.ClientMessage, this.ws1, this.tableId, 20000, this.mySeat);
    }
    receiveMessage = async function (thisMessage) {
        let isMyTurn = false;
        let myStack = 0;
        const obj = await this.DataContainer.decode(thisMessage.data);
        // console.log(obj);

        if (obj?.tableConfigs !== null && this.tableId == "") {
            // this.tableId = (obj.tableConfigs.rows[this.myTable]._id);
            if (obj.tableConfigs.rows.length > 1) {
                this.tableId = (obj.tableConfigs.rows[this.myTable]._id);
                // for(let counter = 0; counter < obj.tableConfigs.rows.length; counter++) {
                //     if (obj.tableConfigs.rows[counter].numPlayers<6) {
                await this.tableAction.SubscribeTable(this.ClientMessage, this.ws1, this.tableId);
                this.justSubscribed = true;
                //         this.tableId = obj.tableConfigs.rows[counter]._id;
                //         counter=9;
                //     }
                // }
                console.log(obj.tableConfigs.rows[0].numPlayers);
            }
        }
        if (obj.pong) {
            this.pingTimer = setTimeout(() => { this.tableAction.ping(this.ClientMessage, this.ws1, this.pingTimer) }, 10000);
            if (this.tableId != "") {
                this.tableAction.SitInOut(this.ClientMessage, this.ws1, this.tableId, false);
            }
        }

        // retrieves tableId first time only
        if (this.justSubscribed) {
            await this.sleep(1000);
            console.log("subscribed");
            this.tableAction.FundAccount(this.ClientMessage, this.ws1);
            this.justSubscribed = false;
            this.justFunding = true;
        }
        if ((this.justFunding)) {
            await this.sleep(1000);
            console.log("joining");
            this.tableAction.JoinTable(this.ClientMessage, this.ws1, this.tableId, 100000, this.mySeat);
            this.justFunding = false;
        }


        let tocall, raiseSize, callSize;
        for (let counter = 0; counter < obj?.tableSeatEvents?.seats.length; counter++) {
            console.log("I'm seat " + this.mySeat + " and variable to act is " + obj.tableSeatEvents?.seats[counter]?.myturn + "(seat " + obj.tableSeatEvents?.seats[counter]?.seat + ")");
            console.log("Finally: my turn is " + obj.tableSeatEvents?.seats[counter]?.myturn);
            console.log("Finally: My stack is  " + obj.tableSeatEvents?.seats[counter]?.stack);
            myStack = obj.tableSeatEvents?.seats[counter]?.stack;
            console.log("Finally: and my seat is: " + this.mySeat);
            console.log("Finally: and it should be equalt to: " + obj.tableSeatEvents?.seats[counter]?.seat);
            console.log("Finally: but let's see what computer says: : ");
            console.log(obj.tableSeatEvents?.seats[counter]?.seat.toString() === this.mySeat.toString());
            if (obj.tableSeatEvents?.seats[counter]?.myturn && obj.tableSeatEvents?.seats[counter]?.seat.toString() == this.mySeat.toString()) {
                console.log("yeyeyeye");
                isMyTurn = true;
            }
            console.log("1");
            if (isMyTurn) {
                console.log("2");
                isMyTurn = false;
                console.log(" So, being " + this.mySeat + " I'm betting because it's my turn");
                let dado = await this.getRandomInt(10);
                if (obj.game) {
                    if (obj.game?.tocall.toString() == '0' || !obj.game.hasOwnProperty("tocall")) {
                        tocall = 0;
                    } else {
                        tocall = parseInt(obj.game?.tocall.toString());
                    }
                } else {
                    tocall = 0;
                }
                let randomT = await this.awaitRandom();
                console.log("dado e': " + dado);
                if (dado < 2) { // call
                    console.log("I'm calling");
                    tocall > myStack ? tocall = myStack : tocall;
                    await this.sleep(randomT);
                    tocall == 0 ? await this.tableAction.bet(this.ClientMessage, this.ws1, this.tableId, 0) : await this.tableAction.bet(this.ClientMessage, this.ws1, this.tableId, tocall);
                } else if (dado >= 2 && dado < 9) { // fold
                    console.log("fold/checking");
                    await this.sleep(randomT);
                    tocall == 0 ? await this.tableAction.bet(this.ClientMessage, this.ws1, this.tableId, 0) : await this.tableAction.fold(this.ClientMessage, this.ws1, this.tableId);
                } else if (dado >= 9) {
                    console.log("bet or raising");
                    await this.sleep(randomT);
                    (tocall * 3 > myStack) ? raiseSize = myStack : raiseSize = tocall * 3;
                    tocall == 0 ? await this.tableAction.bet(this.ClientMessage, this.ws1, this.tableId, 3000) : await await this.tableAction.bet(this.ClientMessage, this.ws1, this.tableId, raiseSize);
                }
            }
        }
    }

    sleep = async function (ms) {
        return new Promise((resolve) => {
            setTimeout(resolve, ms);
        });
    }

    getRandomInt = async function (max) {
        return Math.floor(Math.random() * max);
    }
    connectToServer = async function () {
        // ws1 = new WebSocket('ws://YX1:8111/ws');
        this.ws1 = new WebSocket(this.wsServer);
        return new Promise((resolve, reject) => {
            try {
                const timer = setInterval(() => {
                    if (this.ws1.readyState === 1) {
                        clearInterval(timer)
                        this.wsAlive = false;
                        this.isConnected = true;
                        resolve(this.ws1);
                    }
                }, 10);
            } catch (e) {
                console.log("rejecting" + e);
                reject(this.ws1);
            }
        });
    }
}


// async function main() {



//     // const interval = setInterval(function() {
//     //   sendPing(ClientMessage, ws1);
//     //   SitInOut(ClientMessage, ws1, tableId, true);
//     // }, 5000);


//     await sleep(this.awaitRandom());
//     await TableRequest(ClientMessage, ws1);
//     await sleep(this.awaitRandom());
//     await SubscribeTable(ClientMessage, ws1, tableId);
//     await sleep(this.awaitRandom());
//     await FundAccount(ClientMessage, ws1);
//     await sleep(this.awaitRandom());
//     await JoinTable(ClientMessage, ws1, tableId, 20000, mySeat);
//     await sleep(this.awaitRandom());
//     await sleep(this.awaitRandom());
//     // await SitInOut(ClientMessage, ws, tableId, true);
//     // await sleep(1000);
//     // await SitInOut(ClientMessage, ws, tableId, false);
//     // await sleep(1000);
//     // await bet (ClientMessage, ws, tableId, 500);
//     // await sleep(1000);
//     // await bet (ClientMessage, ws, tableId, 333);
//     // await sleep(1000);

//     // ws.send(buf);
//     // ws.send(buf2);


//     // setTimeout(() => {
//     //   console.log("end");
//     //   ws.close();
//     // }, 3000);
//     console.log("main finish here?");
// }

module.exports = Bottino;