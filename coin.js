class Coin extends Entity {
  constructor(game, startX, startY) {
    super(game, startX, startY);
    this.x = startX;
    this.y = startY;
    this.frameWidth = 10;
    this.frameHeight = 20;
    this.speed = 45;
    this.game = game;
    this.ctx = game.ctx;
    this.groundLevel = 510;
    this.keepCoinGoing = true;
    this.staionary = false;
    this.leftOrRight = Math.random() >= 0.5;

    this.coinAnimation = new Animation(
      AM.getAsset("./img/blink/Coin.png"), // load sprite asset
      60, // frame width
      70, // frameheight
      4, // sheet width
      0.2, // frame duration
      4, // frames in animation
      true, // to loop or not to loop
      0.6 // scale in relation to original image
    );
  }

  draw(ctx) {
    this.coinAnimation.drawFrame(this.game.clockTick, ctx, this.x, this.y);
  }

  update() {
    this.updateMyHitBoxes();
    this.boundX = this.x;
    this.boundY = this.y;
    if (this.y <= 425) {
      this.keepCoinGoing = false;
    }
    if (this.y >= this.groundLevel) {
      this.staionary = true;
    }

    if (!this.staionary) {
      if (this.keepCoinGoing) {
        this.y -= this.game.clockTick * this.speed;
      } else {
        this.y += this.game.clockTick * this.speed;
      }

      if (this.leftOrRight) {
        this.x -= this.game.clockTick * this.speed - 0.5;
      } else {
        this.x += this.game.clockTick * this.speed;
      }
    }
  }

  updateMyHitBoxes() {
    this.hitB.width = this.frameWidth;
    this.hitB.height = this.frameHeight;
    this.hitB.boundX = this.boundX + 15;
    this.hitB.boundY = this.boundY;
  }
}
