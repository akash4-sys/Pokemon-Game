import Sprite from "/components/Sprite.js";
import Boundary from "/components/Boundary.js";
import animateBattle from "/components/BattleAnimation.js";

const canvas = document.querySelector("canvas");
let ctx = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;

const offset = { x: 0, y: 0 };

const CollisionMap = [];
for (let i = 0; i < Collisions.length; i += 70) {
    CollisionMap.push(Collisions.slice(i, 70 + i));
}

const BattleZonesMap = [];
for (let i = 0; i < BattleZonesData.length; i += 70) {
    BattleZonesMap.push(BattleZonesData.slice(i, 70 + i));
}

const boundaries = [];
CollisionMap.forEach((row, i) => {
    row.forEach((symbol, j) => {
        if (symbol === 1025)
            boundaries.push(new Boundary({
                position: {
                    x: j * Boundary.width + offset.x,
                    y: i * Boundary.height + offset.y
                }
            }))
    })
});

const BattleZones = [];
BattleZonesMap.forEach((row, i) => {
    row.forEach((symbol, j) => {
        if (symbol === 1025)
        BattleZones.push(new Boundary({
                position: {
                    x: j * Boundary.width + offset.x,
                    y: i * Boundary.height + offset.y
                }
            }))
    })
});

const image = new Image();
image.src = "./Image/map.png";

const foregroundImage = new Image();
foregroundImage.src = "./Image/foreground.png";

const playerDownImage = new Image();
playerDownImage.src = "./Image/playerDown.png";

const playerUpImage = new Image();
playerUpImage.src = "./Image/playerUp.png";

const playerRightImage = new Image();
playerRightImage.src = "./Image/playerRight.png";

const playerLeftImage = new Image();
playerLeftImage.src = "./Image/playerLeft.png";

const background = new Sprite({
    position: {
        x: offset.x,
        y: offset.y
    },
    image: image
});

const player = new Sprite({
    position: {
        x: canvas.width / 2 - 192 / 2,  //playerDownImage width = 192
        y: canvas.height / 2 + 50
    },
    image: playerDownImage,
    frames: {
        max: 4
    },
    sprites:{
        up: playerUpImage,
        right: playerRightImage,
        left: playerLeftImage,
        down: playerDownImage
    },
    animationSpeed:10
});

const foreground = new Sprite({
    position: {
        x: offset.x,
        y: offset.y
    },
    image: foregroundImage
});

const keys = {
    w: { pressed: false, },
    a: { pressed: false, },
    s: { pressed: false, },
    d: { pressed: false, }
}

function rectangularCollision({ player, boundary }) {
    return (
        player.position.x + player.width >= boundary.position.x &&
        player.position.x <= boundary.position.x + boundary.width && 
        player.position.y <= boundary.position.y + boundary.height &&
        player.position.y + player.height >= boundary.position.y 
    )
};

function moving( { margin }, move ) {
    for(let i = 0; i < boundaries.length; i++) {
        const boundary = boundaries[i];
        if( rectangularCollision({ player, boundary : {...boundary, position : { x: boundary.position.x + margin.x, y: boundary.position.y + margin.y }} }) ){
            move = false;
            break;
        }
    };
    return move;
}

const moveables = [background, ...boundaries, foreground, ...BattleZones];
let lastKey = '';
const battle = { initiated:false };

function animate() {
    const animationId = window.requestAnimationFrame(animate);

    background.draw(ctx);
    boundaries.forEach(boundary => {
        boundary.draw(ctx);
    });

    BattleZones.forEach(battleZone => {
        battleZone.draw(ctx);
    });

    player.draw(ctx);
    foreground.draw(ctx);

    player.animate = false;

    if(battle.initiated) return;

    if(keys.w.pressed || keys.a.pressed || keys.s.pressed || keys.d.pressed ){
        for(let i = 0; i < BattleZones.length; i++) {
            const battleZone = BattleZones[i];

            const overlappingArea = (Math.min( player.position.x + player.width, battleZone.position.x + battleZone.width ) - Math.max(player.position.x, battleZone.position.x)) *
              (Math.min( player.position.y + player.height, battleZone.position.y + battleZone.height ) - Math.max(player.position.y, battleZone.position.y));

            if( rectangularCollision({ player, boundary : {...battleZone, position : { x: battleZone.position.x , y: battleZone.position.y }} }) 
                && overlappingArea > (player.width * player.height) / 2 && Math.random() < 0.1 ){

                window.cancelAnimationFrame(animationId);
                battle.initiated = true;
                canvas.style.opacity = 0;
                document.getElementById("flexbox").classList.add("loading");
                
                setTimeout(() => {
                    canvas.style.opacity = 1;
                    document.getElementById("flexbox").classList.remove("loading");
                    animateBattle(ctx);
                }, 2000);
                
                console.log('fight!!!');
                break;

            }
        };
    }

    if (keys.w.pressed && lastKey === 'w' && moving( { margin:{x:0, y:3} }, true) ) {
        moveables.forEach((moveable) => { moveable.position.y += 3 }); 
        player.animate = true;
        player.image = player.sprites.up;
    }
    else if (keys.s.pressed && lastKey === 's' && moving( { margin:{ x:0, y:-3} }, true) ) { 
        moveables.forEach((moveable) => { moveable.position.y -= 3 });
        player.animate = true;
        player.image = player.sprites.down;
    }
    else if (keys.a.pressed && lastKey === 'a' && moving( { margin:{ x:3, y:0} }, true) ) { 
        moveables.forEach((moveable) => { moveable.position.x += 3 });
        player.animate = true;
        player.image = player.sprites.left;
    }
    else if (keys.d.pressed && lastKey === 'd' && moving( { margin:{ x:-3, y:0} }, true) ) {
        moveables.forEach((moveable) => { moveable.position.x -= 3 }); 
        player.animate = true;
        player.image = player.sprites.right;
    }
    else{
        player.frames.val = 0;
        if(lastKey === 'd') { player.frames.val = 1;}
    }
}

// animate();

animateBattle();

window.addEventListener('keydown', (e) => {
    switch (e.key) {
        case 'w': case 'ArrowUp':
            keys.w.pressed = true;
            lastKey = 'w';
            break;
        case 's': case 'ArrowDown':
            keys.s.pressed = true;
            lastKey = 's';
            break;
        case 'a': case 'ArrowLeft':
            keys.a.pressed = true;
            lastKey = 'a';
            break;
        case 'd': case 'ArrowRight':
            keys.d.pressed = true;
            lastKey = 'd';
            break;
    }
});

window.addEventListener('keyup', (e) => {
    switch (e.key) {
        case 'w': case 'ArrowUp':
            keys.w.pressed = false;
            break;
        case 's': case 'ArrowDown':
            keys.s.pressed = false;
            break;
        case 'a': case 'ArrowLeft':
            keys.a.pressed = false;
            break;
        case 'd': case 'ArrowRight':
            keys.d.pressed = false;
            break;
    }
});