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
  constructor(game, ctx, cameraX, cameraY, canvasWidth, canvasHeight) {
    this.game = game;
    this.ctx = ctx;
    this.x = cameraX;
    this.y = cameraY;
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this.endOfLevel;

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
    if (this.blink.x > 10 && this.blink.x < 2800) {
      this.endOfLevel = this.x;
      this.game.bottomProjectionCtx.translate(this.x, this.y);
      this.game.middleProjectionCtx.translate(this.x, this.y);
      this.ctx.translate(this.x, this.y);
    }
    // otherwise stay stationary
    else {
      this.ctx.translate(this.endOfLevel, 0);
    }
  }
  update() {
    if (this.blink != null) {
      this.updateBounds();
      this.x = -this.blink.x + this.offsetX;
      this.y = -this.blink.y + this.offsetY;
    }

  }
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