import Sprite from "/components/Sprite.js";
import Attacks from "/assets/Attacks.js";
import Pokemon from "/assets/Pokemons.js";
import { battle, animate } from "../index.js"
import { TimeOutButtonZero, TimeOutButtonOne } from "/components/utils/TimeOut.js";

const canvas = document.querySelector("canvas");
let ctx = canvas.getContext('2d');

let animateBattleID, startFight = false;
let result = document.getElementById("result");

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

let enemyAI, checkHealth;

function endBattle() {
    battle.initiated = false;
    document.getElementById("playerBar").style.display = "none";
    document.getElementById("enemyBar").style.display = "none";
    window.cancelAnimationFrame(animateBattleID);
    audio.battle.stop();

    setTimeout(() => {
        audio.loading.play();
        canvas.style.filter = "brightness(1)";
        result.innerHTML = "";
        canvas.style.opacity = 0;
        document.getElementById("box").classList.add("loading");
    }, 2000)

    setTimeout(() => {
        audio.loading.stop();
        audio.Map.play();
        canvas.style.opacity = 1;
        document.getElementById("box").classList.remove("loading");
        animate();
    }, 4000);
};

function objectAI(){
    enemyAI = setInterval(() => {
        let attackNo = Math.floor(Math.random() * 2);
        enemyPokemon.attack(
            {
                name: Attacks[attackNo].name,
                damage: Attacks[attackNo].damage,
                type: Attacks[attackNo].type
            },
            playerPokemon,
            playerHealth,
            renderSprites,
            Attacks[attackNo].DPS,
            true
        );
    }, Math.floor(Math.random() * 10000));

    checkHealth = setInterval(() => {

        if (enemyPokemon.health <= 0) {
            audio.victory.play();
            canvas.style.filter = "brightness(0.5)";
            result.style.color = "green";
            result.innerHTML = "You won!!!";
            endBattle();
            clearInterval(enemyAI);
            clearInterval(checkHealth);
        }
        else if (playerPokemon.health <= 0) {
            canvas.style.filter = "brightness(0.5)";
            result.innerHTML = "Defeated!!!";
            result.style.color = "red";
            endBattle();
            clearInterval(enemyAI);
            clearInterval(checkHealth);
        }
        else if (enemyPokemon.health <= (Pokemon.Draggle.health * 2) / 10) { enemyHealth.backgroundColor = "red"; }
        else if (playerPokemon.health <= (Pokemon.Amber.health * 2) / 10) { playerHealth.backgroundColor = "red"; }
        else if (enemyPokemon.health <= (Pokemon.Draggle.health * 7) / 10 && enemyPokemon.health >= (Pokemon.Draggle.health * 2) / 10) { enemyHealth.backgroundColor = "yellow"; }
        else if (playerPokemon.health <= (Pokemon.Amber.health * 7) / 10 && playerPokemon.health >= (Pokemon.Amber.health * 2) / 10) { playerHealth.backgroundColor = "yellow"; }

    }, 250);
}

function startBattle() {
    playerPokemon.health = Pokemon.Amber.health;
    enemyPokemon.health = Pokemon.Draggle.health;
    enemyHealth.width = enemyPokemon.health + "px";
    playerHealth.width = playerPokemon.health + "px";
    playerHealth.backgroundColor = "limegreen";
    enemyHealth.backgroundColor = "limegreen";
    document.getElementById("playerBar").style.display = "flex";
    document.getElementById("enemyBar").style.display = "flex";
    objectAI();
}

var DisabledAttack = [
    { name: "Fireball", yes: false },
    { name: "Tackle", yes: false }
];
let lastAtkBtnID = "";

function attackHandler(event, ButtonID, name, damage, type, cooldownTime, DPS) {

    if (DisabledAttack[ButtonID].name === name && DisabledAttack[ButtonID].yes) return;
    if (event.currentTarget) { lastAtkBtnID = event.currentTarget.id; }
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

let paused = false;
// if(!paused){
//     audio.battle.play();
//     canvas.style.filter = "brightness(1)";
//     result.innerHTML = "";
//     result.style.color = "green";
//     window.requestAnimationFrame(animateBattle);
//     objectAI();
// }

window.addEventListener('keydown', (e) => {
    switch (e.key) {
        case 'Escape':
            endBattle();
            clearInterval(enemyAI);
            clearInterval(checkHealth);
            break;
        case 'p': 
            if(paused) break;
            paused = true;
            audio.battle.stop();
            canvas.style.filter = "brightness(0.5)";
            result.innerHTML = "Pause!!!";
            result.style.color = "burlywood";
            window.cancelAnimationFrame(animateBattleID);
            clearInterval(enemyAI);
            clearInterval(checkHealth);
            break;
    }
});

function animateBattle() {
    animateBattleID = window.requestAnimationFrame(animateBattle);
    battleBackground.draw(ctx);
    enemyPokemon.draw(ctx);
    playerPokemon.draw(ctx);
    renderSprites.forEach((sprite) => {
        sprite.draw(ctx);
    })
};

export { startBattle, endBattle, animateBattle };