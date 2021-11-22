"use strict"
let defaultCalcPrice = () => {
    this.price *= 1.1;
}

export class Upgrade {
    constructor(name, initPrice, desc=null, onBuy=null, calcPrice=defaultCalcPrice, onCalc=null) {
        this.name = name;
        this.initPrice = initPrice;
        this.price = initPrice;
        this.amount = 0;
        this.onBuy = onBuy;
        this.calcPrice = calcPrice;
        this.onCalc = onCalc;
        this.desc = desc;
    }

    calc() {
        return this.onCalc();
    }

    buy(obj) {
        
        this.onBuy(obj);
    }
}