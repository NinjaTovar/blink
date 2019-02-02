class Camera {
    /**
     * viewWidth, viewHeight - dimension of the camera
	 * xPosition, yPosition - position of camera (top left)
	 * game - gameEngine, ctx - canvas
	 * worldWidth, worldHeight - dimensions of the entire level
     */
    constructor(blink, ctx, viewWidth, viewHeight, worldWidth, worldHeight) {
        this.blink = blink;
        this.xPosition = blink.x;
        this.yPosition = blink.y;
        this.ctx = ctx;
        this.viewWidth = viewWidth;
		this.viewHeight = viewHeight;
		this.worldWidth = worldWidth;
		this.worldHeight = worldHeight;

		// Offset is the x and y coordinates of the center of the camera
		this.offsetX = this.viewWidth / 2;
		this.offsetY = this.viewHeight / 2;
		// this.speedX = 10;
		// this.speedY = 10;
    }
    draw() {
		this.ctx.translate(this.xPosition, this.yPosition);
    }
    update() {
		// console.log('xPosition: ' + this.xPosition + ' yPosition: ' + this.yPosition);

        this.xPosition = -this.blink.x + this.offsetX;
        this.yPosition = -this.blink.y + this.offsetY;
	}
}