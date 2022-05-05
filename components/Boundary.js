export default class Boundary {
    static width = 48;
    static height = 48;

    constructor({ position }) {
        this.position = position;
        this.width = 48;    //map is in 400% zoom so tile size is also 4 times
        this.height = 48;
    }

    draw(ctx) {
        ctx.fillStyle = 'transparent';
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
    }
};