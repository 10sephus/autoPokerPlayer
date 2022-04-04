class TableAction {

    LeaveTable = async function (ClientMessage, ws, tableId) {
        console.log("ciao");
        let message = {
            "leaveTableRequest": {
                "tableId": "621fa2b5fdea6910f0c82876"
            }
        }
        let buffer = await ClientMessage.encode(message).finish();
        await ws.send(buffer);
    }
    TableRequest = async function (ClientMessage, ws) {
        let message = {
            "listTablesRequest": {},
        }
        let buffer = await ClientMessage.encode(message).finish();
        await ws.send(buffer);
    }
    SubscribeTable = async function (ClientMessage, ws, tableId) {
        let message = {
            "subscribeToTableRequest": {
                "tableId": tableId
            }
        }
        console.log("subscribing to " + tableId);
        let buffer = await ClientMessage.encode(message).finish();
        await ws.send(buffer);

    }
    JoinTable = async function (ClientMessage, ws, tableId, amount, seat) {
        let message = {
            "joinTableRequest": {
                "amount": amount,
                "seat": seat,
                "tableId": tableId
            }
        }
        let buffer = await ClientMessage.encode(message).finish();
        console.log(message);
        await ws.send(buffer);

    }
    FundAccount = async function (ClientMessage, ws) {
        let message = {
            "fundAccountRequest": {
                "currency": "usd"
            }
        }
        let buffer = await ClientMessage.encode(message).finish();
        console.log(message);
        await ws.send(buffer);

    }
    SitInOut = async function (ClientMessage, ws, tableId, sitout) {
        let message = {
            "setTableOptionRequest": {
                "tableId": tableId,
                "sitOutNextHand": sitout
            }
        }
        let buffer = await ClientMessage.encode(message).finish();
        console.log(message);
        await ws.send(buffer);
    }
    bet = async function (ClientMessage, ws, tableId, amount) {
        let message = {
            "bet": {
                "tableId": tableId,
                "amount": amount
            }
        }
        let buffer = await ClientMessage.encode(message).finish();
        console.log(message);
        await ws.send(buffer);
    }
    fold = async function (ClientMessage, ws, tableId) {
        let message = {
            "fold": {
                "tableId": tableId
            }
        }
        let buffer = await ClientMessage.encode(message).finish();
        console.log(message);
        await ws.send(buffer);
    }
    test = async function () {
        console.log("test");
    }
    ping = async function (ClientMessage, ws, pTimer) {
        let message = {
            "ping": {},
        }
        clearInterval(pTimer);
        let buffer = await ClientMessage.encode(message).finish();
        console.log(message);
        await ws.send(buffer);
    }
    
}

module.exports = TableAction;