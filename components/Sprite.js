export default class Sprite {
    constructor({ position, image, frames = { max: 1 }, sprites, animate = false, animationSpeed = 1, health, opacity = 1, rotation = 0}) {
        this.position = position;
        this.image = image;
        this.frames = { ...frames, val: 0, elapsed: 0 };
        this.animate = animate;
        this.sprites = sprites;
        this.animationSpeed = animationSpeed;
        this.health = health;
        this.opacity = opacity;
        this.rotation = rotation;

        this.image.onload = () => {
            this.width = this.image.width / this.frames.max;
            this.height = this.image.height;
        }
    }

    draw(ctx) {

        ctx.save();     //Btw This and restore makes sure that global proprty does not affect everything in canvas

        ctx.globalAlpha = this.opacity;

        ctx.translate(this.position.x + this.width / 2, this.position.y + this.width /2 );
        ctx.rotate(this.rotation); //this will be 45 deg
        ctx.translate(-this.position.x - this.width / 2, -this.position.y - this.width /2 );

        ctx.drawImage(
            this.image,    //image
            this.frames.val * this.width,  //xaxis of playerimage
            0,  //yaxis of playerimage
            this.image.width / this.frames.max,  //crop width 
            this.image.height,     //crop Height
            this.position.x,  //xaxis on background
            this.position.y,
            this.image.width / this.frames.max,  //width of player image
            this.image.height  //height of player image
        );
        ctx.restore();

        if (!this.animate) return;
        if (this.frames.max > 1) { this.frames.elapsed++ }

        if (this.frames.elapsed % this.animationSpeed === 0) {
            if (this.frames.val < this.frames.max - 1) { this.frames.val++; }
            else { this.frames.val = 0; }
        }
    };

    attack({ name, damage, type }, target, enemyHealth, renderSprites, DPS, isAI) {

        if (name === 'Tackle') {

            this.position.x += 100;
            this.position.y -= 20;
            target.position.x += 10;
            target.position.y -= 5;

            let enemyHP = parseInt(enemyHealth.width.slice(0, -2));
            enemyHP -= damage;
            if(enemyHP <= 0) { enemyHP = 0; }
            enemyHealth.width = enemyHP + "px";
            target.health = enemyHP - damage;

            setTimeout(() => {
                this.position.x -= 100;
                this.position.y += 20;
                target.position.x -= 10;
                target.position.y += 5;
            }, 250);

        }
        else if (name === "Fireball") {

            const fireballImage = new Image();
            fireballImage.src = "../Image/fireball.png"

            let rotate = 1;
            if(isAI) rotate = -2.2;
            
            const fireball = new Sprite({
                position: {
                    x: this.position.x + 100,
                    y: this.position.y - 20,
                },
                image: fireballImage,
                frames: { max: 4 },
                animate: true,
                animationSpeed: 10,
                rotation:rotate
            });

            renderSprites.push(fireball);

            gsap.to(fireball.position, {
                x: target.position.x,
                y: target.position.y,
                onComplete: () => {
                    // audio.fireballHit.play()
                    gsap.to(target, {
                        opacity: 0,
                        repeat: 5,
                        yoyo: true,
                        duration: 0.08
                    });
                    renderSprites.pop();

                    let enemyHP = parseInt(enemyHealth.width.slice(0, -2));
                    enemyHP -= damage;
                    if(enemyHP <= 0) { enemyHP = 0; }
                    enemyHealth.width = enemyHP + "px";
                    target.health = enemyHP;
                    
                    let DPStime = DPS.time;
                    let DamagePerSec = setInterval(() => {
                        enemyHP = parseInt(enemyHealth.width.slice(0, -2));
                        enemyHealth.width = (enemyHP - DPS.damage) + "px";
                        target.health = enemyHP;
                        DPStime--;
                        if(!DPStime) clearInterval(DamagePerSec);
                    }, 1000);
                }
            });
        };
    };
};