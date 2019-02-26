class Camera extends Entity {
    /**
     * Camera handles managing the view position of the world in relation to Blink
     * 
     * @param {any} blink Reference to Blink
     * @param {any} ctx Object passed as reference to canvas
     * @param {any} worldWidth width dimensions of the entire level
     * @param {any} worldHeight height dimensions of the entire level
     */
    constructor(game, x, y = 0, canvasWidth, canvasHeight, worldWidth, worldHeight) {
        super(game, x, y);
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.worldWidth = worldWidth;
        this.worldHeight = worldHeight;

        this.absOffX = 2;
        this.absOffY = 4;
        this.offX = (this.canvasWidth / this.absOffX);
        this.offY = this.canvasHeight / this.absOffY;

        this.camSpeedX = 8;
        this.camSpeedY = 8;

        this.blink = null;

    }
    follow(him) {
        this.blink = him;

    }
    draw(ctx) {

        ctx.translate(this.x, this.y);
    }
    update() {
        if (this.blink != null) {
            this.updateBounds();
            this.x = -this.blink.x + this.offX;
            this.y = -this.blink.y + this.offY;

        }
    }

    updateBounds() {
        if (!(this.offX === this.canvasWidth / this.absOffX)) {
            if (this.offX + 10 < Math.floor(this.canvasWidth / this.absOffX)) {
                this.offX += this.camSpeedX;
            } else if (this.offX - 10 > Math.floor(this.canvasWidth / this.absOffX)) {
                this.offX -= this.camSpeedX;
            } else(this.offX = this.canvasWidth / this.absOffX);
        }
        if (!(this.offY === this.canvasHeight / this.absOffY)) {
            if (this.offY + 10 < Math.floor(this.canvasHeight / this.absOffY)) {
                this.offY += this.camSpeedY;
            } else if (this.offY - 10 > Math.floor(this.canvasHeight / this.absOffY)) {
                this.offY -= this.camSpeedY;
            } else(this.offY = this.canvasHeight / this.absOffY);
        }
    }

    boundsCheck(val, min, max) {
        return Math.min(Math.max(val, min), max);
    }
}