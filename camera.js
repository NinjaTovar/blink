class Camera {
    /**
     * Camera handles managing the view position of the world in relation to Blink
     * Camera now is always the size of the entire canvas
     *
     * @param {any} blink Reference to Blink
     * @param {any} ctx Object passed as reference to canvas
     * @param {any} cameraX the starting x of the camera
     * @param {any} cameraY the starting y of the camera
     * @param {any} worldWidth width of the canvas/camera
     * @param {any} worldHeight height of the canvas/camera
     */
    constructor(game, ctx, cameraX, cameraY, canvasWidth, canvasHeight) {
        this.game = game;
        this.ctx = ctx;
        this.x = cameraX;
        this.y = cameraY;
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.mapWidth = 3200; //Default map size
        this.mapHeight = 3200;
        this.endOfLevelX;
        this.endOfLevelY;

        // 2 centers it in the middle, change value to offset amount
        this.offsetwidth = 2;
        this.offsetheight = 2;

        // Offset is the x and y coordinates of the center of the camera
        this.offsetX = this.canvasWidth / this.offsetwidth;
        this.offsetY = this.canvasHeight / this.offsetheight;

        this.speedX = 5;
        this.speedY = 5;

        this.blink = null;
    }
    follow(him) {
        this.blink = him;
    }
    draw() {
        // If blink is just barely into the start of the level or
        // right before the end, translate the canvas to emulate a camera
        if (this.blink.x > 500 && this.blink.x < this.mapWidth) {
            this.endOfLevelX = this.x;
            this.endOfLevelY = this.y;
            this.ctx.translate(this.x, this.y);
        }
        // otherwise stay stationary
        else {
            this.ctx.translate(0, this.y);
        }
    }
    update() {
        if (this.blink !== null) {

            // Update the camera.x value always
            this.x = -this.blink.x + this.offsetX;

            // for the y value, update it once blink has landed in a level.
            // After that, follow Blinks y value on a small delay.
            if (this.blink.y > this.blink.startingGroundLevel) {
                if ((Math.ceil(this.y) - Math.floor(-this.blink.y + this.offsetY)) > 10) {
                    this.y -= 7;
                } else if (Math.floor(this.y) < Math.ceil(-this.blink.y + this.offsetY)) {
                    this.y += 4;
                }
            }


        }

    }

    // Not being used for now, hope to used to be able to smooth out the camera
    updateBounds() {
        if (!(this.offsetX === this.canvasWidth / this.offsetwidth)) {
            if (this.offsetX + 10 < Math.floor(this.canvasWidth / this.offsetwidth)) {
                this.offsetX += this.camSpeedX;
            } else if (this.offsetX - 10 > Math.floor(this.canvasWidth / this.offsetwidth)) {
                this.offsetX -= this.camSpeedX;
            } else(this.offsetX = this.canvasWidth / this.offsetwidth);
        }
        if (!(this.offsetY === this.canvasHeight / this.offsetheight)) {
            if (this.offsetY + 10 < Math.floor(this.canvasHeight / this.offsetheight)) {
                this.offsetY += this.camSpeedY;
            } else if (this.offsetY - 10 > Math.floor(this.canvasHeight / this.offsetheight)) {
                this.offsetY -= this.camSpeedY;
            } else(this.offsetY = this.canvasHeight / this.offsetheight);
        }
    }

}

// draw() {
//     // If blink is just barely into the start of the level or
//     // right before the end, translate the canvas to emulate a camera
//     if (this.blink.x > 400 && this.blink.x < this.mapWidth - 400 && this.blink.y > 300 && this.blink.y < this.mapHeight - 300) {
//         this.endOfLevelX = this.x;
//         this.endOfLevelY = this.y;
//         // this.game.bottomProjectionCtx.translate(this.x, this.y);
//         // this.game.middleProjectionCtx.translate(this.x, this.y);
//         this.ctx.translate(this.x, this.y);
//     }
//     // otherwise stay stationary
//     else {
//         this.ctx.translate(this.endOfLevelX, this.endOfLevelY);
//     }
// }
// update() {
//     if (this.blink != null) {
//         if (this.blink.x > 400 && this.blink.x < this.mapWidth - 400 && this.blink.y > 300 && this.blink.y < this.mapHeight - 300) {

//             this.updateBounds();
//             this.x = -this.blink.x + this.offsetX;
//             this.y = -this.blink.y + this.offsetY;
//         }
//     }
// }