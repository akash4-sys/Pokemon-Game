const draggle = new Image();
draggle.src = "../Image/draggleSprite.png";

const amber = new Image();
amber.src = "../Image/embySprite.png";

const Pokemon = {
    Amber: {
        position: { x: 280, y: 325 },
        image: amber,
        frames: { max: 4 },
        animate: true,
        animationSpeed: 40,
        health: 300
    },
    Draggle: {
        position: { x: 800, y: 100 },
        image: draggle,
        frames: { max: 4 },
        animate: true,
        animationSpeed: 40,
        health: 300
    }
};

export default Pokemon;