import Sprite from "/components/Sprite.js";
import Attacks from "/assets/Attacks.js";
import Pokemon from "/assets/Pokemons.js";
import { TimeOutButtonZero, TimeOutButtonOne } from "/components/utils/TimeOut.js";

const canvas = document.querySelector("canvas");
let ctx = canvas.getContext('2d');

let animateBattleID;

const battleBackgroundImage = new Image();
battleBackgroundImage.src = "../Image/battleBackground.png";

const battleBackground = new Sprite({
    position: { x: 0, y: 0 },
    image: battleBackgroundImage
});

const enemyPokemon = new Sprite(Pokemon.Draggle);
const playerPokemon = new Sprite(Pokemon.Amber);

const renderSprites = [];

let Attack1 = document.getElementById("Attack1");
let Attack2 = document.getElementById("Attack2");

let enemyHealth = enemyHealthBar.style;
enemyHealth.width = enemyPokemon.health + "px";

let playerHealth = playerHealthBar.style;
playerHealth.width = playerPokemon.health + "px";

// enemy AI
let enemyAI = setInterval(() =>{
    let attackNo = Math.floor(Math.random() * 2);
    enemyPokemon.attack(
        { 
            name : Attacks[attackNo].name,
            damage : Attacks[attackNo].damage,
            type : Attacks[attackNo].type
        },
        playerPokemon,
        playerHealth,
        renderSprites,
        Attacks[attackNo].DPS,
        true
    );
}, Math.floor(Math.random() * 10000));

var DisabledAttack = [
    { name:"Fireball", yes: false },
    { name:"Tackle", yes: false}
];
let lastAtkBtnID = "";

let checkHealth = setInterval(() => {
    if(enemyPokemon.health <= 0 || playerPokemon.health <= 0){
        console.log('Defeated');
        window.cancelAnimationFrame(animateBattleID);
        clearInterval(enemyAI);
        clearInterval(checkHealth);
    }
}, 250);

function attackHandler(event, ButtonID, name, damage, type, cooldownTime, DPS) {

    if(DisabledAttack[ButtonID].name === name && DisabledAttack[ButtonID].yes) return;
    if(event.currentTarget){ lastAtkBtnID = event.currentTarget.id; }
    playerPokemon.attack(
        { name, damage, type },
        enemyPokemon,
        enemyHealth,
        renderSprites,
        DPS,
        false
    );

    DisabledAttack[ButtonID].name = name;
    DisabledAttack[ButtonID].yes = true;
    document.getElementById(lastAtkBtnID).style.color = "darkgray";

    switch (ButtonID) {
        case 0: TimeOutButtonZero(DisabledAttack, lastAtkBtnID, cooldownTime);
        break;
        case 1: TimeOutButtonOne(DisabledAttack, lastAtkBtnID, cooldownTime);
    };
}

Attack1.innerHTML = Attacks[0].name;
Attack2.innerHTML = Attacks[1].name;
Attack1.addEventListener('click', ((event) => attackHandler(event, 0, Attacks[0].name, Attacks[0].damage, Attacks[0].type, Attacks[0].cooldown, Attacks[0].DPS)));
Attack2.addEventListener('click', ((event) => attackHandler(event, 1, Attacks[1].name, Attacks[1].damage, Attacks[1].type, Attacks[1].cooldown, Attacks[1].DPS)));

export default function animateBattle() {
    animateBattleID =  window.requestAnimationFrame(animateBattle);
    // console.log('kjsad');
    battleBackground.draw(ctx);
    enemyPokemon.draw(ctx);
    playerPokemon.draw(ctx);

    renderSprites.forEach((sprite) => {
        sprite.draw(ctx);
    })
};