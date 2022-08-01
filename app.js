let Config = require('./Config.js');
let config = new Config();

const myArgs = process.argv.slice(2);
  console.log('myArgs: ', myArgs);
//   mySeat ? myArgs[1] | 3;
  myArgs[0] ? mySeat = myArgs[0] : mySeat = 3;
  myArgs[1] ? myTable = myArgs[1] : myTable = 0;
//   myTable = myArgs[0] | 0;
// myTable = 0;

const {
    mainModule
} = require('process');
let Bottino = require('./autoPlayer');

let bottino = new Array();
// let bottin1 = new Array();
// let bottin2 = new Array();


sleep = async function (ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

async function main() {
    for (seat = 0; seat < config.maxSeat; seat++) {
        // let bottino[seat] = new Bottino();
        // bottino.init();

        bottino.push(new Bottino);
        await sleep(config.sitDelay);
        bottino[seat].init(seat, myTable);
    }
    // for (seat=0;seat<8; seat++) {
    //     // let bottino[seat] = new Bottino();
    //     // bottino.init();
    //     bottin1.push(new Bottino);
    //     bottin1[seat].init(seat,1);
    // }
    // for (seat=0;seat<8; seat++) {
    //     // let bottino[seat] = new Bottino();
    //     // bottino.init();
    //     bottin2.push(new Bottino);
    //     bottin2[seat].init(seat,2);
    // }

    console.log("end");
}
main();