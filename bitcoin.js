'use strict';
const ccxt = require ('ccxt');

const interval = 30000
const profitPrice = 500
const orderSize = 0.000001
const records = []
let orderInfo = null

const sleep = (timer) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve()
        }, timer)
    })
}

(async function () {
    const config = require("./config")
    let bitflyer = new ccxt.bitflyer(config)


    while(true){
        const ticker = await bitflyer.fetchTicker ('BTC/JPY')
        records.push(ticker.ask)
        if(records.length > 3){
            records.shift()
        }
        console.log(records)
        if(orderInfo){
            console.log("latest bid price:" + ticker.bid)
            console.log("order price:" + orderInfo.price)
            console.log("diff:" + (ticker.bid - orderInfo.price))
            if(ticker.bid - orderInfo.price > profitPrice){
                //const order = await bitflyer.createMarketSellOrder ('BTC/JPY', orderSize))
                orderInfo = null
                console.log("利確しました", order)
            }else if(ticker.bid - orderInfo.price < -profitPrice){
                //const order = await bitflyer.createMarketSellOrder ('BTC/JPY', orderSize))
                orderInfo = null
                console.log("ロスカットしました", order)
            }

        }else{
            if(records[0] < records[1] && records[1] < records[2]){
                console.log("Price high")
                //const order = await bitflyer.createMarketBuyOrder ('BTC/JPY', orderSize))
                orderInfo = {
                    order: order,
                    price: ticker.ask
                }
                console.log("買い注文しました。", orderInfo)
            }
        }
        
        await sleep(interval)
    }
    
}) ();