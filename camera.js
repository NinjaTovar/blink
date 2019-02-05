class Camera {
    /**
     * Camera handles managing the view position of the world in relation to Blink
     * 
     * @param {any} blink Reference to Blink
     * @param {any} ctx Object passed as reference to canvas
     * @param {any} viewWidth width dimension of the camera
     * @param {any} viewHeight width dimension of the camera
     * @param {any} worldWidth width dimensions of the entire level
     * @param {any} worldHeight height dimensions of the entire level
     */
    constructor(ctx, viewWidth, viewHeight, worldWidth, worldHeight) {
        this.ctx = ctx;
        this.viewWidth = viewWidth;
        this.viewHeight = viewHeight;
        this.worldWidth = worldWidth;
        this.worldHeight = worldHeight;
        this.endOfLevel;

        // Offset is the x and y coordinates of the center of the camera
        this.offsetX = this.viewWidth / 2;
        this.offsetY = this.viewHeight / 2;
        // this.speedX = 10;
        // this.speedY = 10;

        // debug camera tool
        this.shouldOutlineCamera = false;
    }
    follow(him) {
        this.blink = him;
        this.xPosition = this.blink.x;
        this.yPosition = this.blink.y;
    }
    draw() {
        // If blink is just barely into the start of the level or
        // right before the end, translate the canvas to emulate a camera
        if (this.blink.x > 100 && this.blink.x < 3680) {
            this.endOfLevel = this.xPosition / 1.15;
            this.ctx.translate(this.xPosition / 1.15, 0);
        }
        // otherwise stay stationary
        else {
            this.ctx.translate(this.endOfLevel, 0);
        }

        if (this.shouldOutlineCamera) {
            this.ctx.beginPath();
            this.ctx.strokeStyle = 'red';
            this.ctx.rect(this.offsetX, this.offsetY, this.viewWidth, this.viewHeight);
            this.ctx.stroke();
            //console.log(this.xPosition);
            //console.log(this.yPosition);
        }
    }
    update() {
        this.xPosition = this.offsetX - this.blink.x;
        this.yPosition = this.offsetY - this.blink.y;
    }
}