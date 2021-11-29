"use strict";

import { Upgrade } from "../modules/upgrade.js";

let alpakkaElements = {

};

let alpakkaData = {
    alpakka: 0,
    alpakkaIncrement: 1,
};

let updateCounters = () => {
    alpakkaElements.counter.innerHTML = alpakkaData.alpakka;
    upgrades.forEach(upgrade => {
        upgrade.btn.textContent = `${upgrade.name}\t${upgrade.price.toFixed(2)}`
        upgrade.cnt.innerHTML = upgrade.amount;
    });
}

let calcAlpakkaIncrement = () => {
    
}

const upgrades = [
    new Upgrade(
                "Fele", 
                10, 
                "+1/klikk", 
                obj => { 
                    obj.amount += 1; 
                    obj.calcPrice(obj); 
                    updateCounters();
                },
                obj => {
                    obj.price = obj.initPrice * (1.5 ** obj.amount);
                },
                () => { return this.amount / 10}),
    new Upgrade("Klarinett", 100)];

let createUpgrade = (upgrade) => {
    let li = document.createElement("li");
    let div = document.createElement("div");

    let btn = document.createElement("button");
    btn.className = "btnBuy";
    btn.innerHTML = `${upgrade.name}\t${upgrade.price}`;
    btn.onclick = () => {upgrade.buy(upgrade);};
    div.appendChild(btn);
    upgrade.btn = btn;

    let cnt = document.createElement("div");
    cnt.className = "count";
    cnt.innerHTML = upgrade.amount;
    div.appendChild(cnt);
    upgrade.cnt = cnt;

    let desc = document.createElement("div");
    desc.className = "desc";
    desc.innerHTML = upgrade.desc;
    div.appendChild(desc);

    li.appendChild(div);
    return li;
}


let increaseAlpakka = () => {
    alpakkaData.alpakka += alpakkaData.alpakkaIncrement;
}

let handleAlpakkaClick = e => {
    increaseAlpakka();
    updateCounters();
}

let gameInit = e => {
    alpakkaElements.game = document.getElementById("game");
    alpakkaElements.counter = document.getElementById("counter");
    alpakkaElements.upgrades = document.getElementById("upgrades");
    alpakkaElements.btnInc = document.getElementById("inc");
    alpakkaElements.imgBtnInc = document.querySelector("#center-col img");
    alpakkaElements.btnInc.addEventListener("click", handleAlpakkaClick);
    alpakkaElements.imgBtnInc.addEventListener("click", handleAlpakkaClick);
    for (let upgrade of upgrades) {
        alpakkaElements.upgrades.appendChild(createUpgrade(upgrade));
    }
    updateCounters();
}
window.addEventListener('load', gameInit);
