class Mummy {
	constructor(game) {
	  this.walkRightAnimation = new Animation(
		AM.getAsset('./img/Mummy_WalkRight.png'), 36, 45, 5, 0.2, 17, true, 1.5);
	  this.walkLeftAnimation = new Animation(
		AM.getAsset("./img/Mummy_WalkLeft.png"), 36, 45, 5, 0.2, 17, true, 1.5);
	  this.x = 400;
	  this.y = 185;
	  this.speed = 30;
	  this.game = game;
    this.ctx = game.ctx;
    this.isLeft = true;
	}
	draw(ctx) {
		if (!this.isLeft) {
			this.walkRightAnimation.drawFrame(this.game.clockTick, ctx, this.x, this.y)
		} else {
			this.walkLeftAnimation.drawFrame(this.game.clockTick, ctx, this.x, this.y)
		}
	}
  
	update() {
    if (this.isLeft) {
      this.x -= this.game.clockTick * this.speed;
      if (this.x < 400) this.isLeft = false; 
    } else {
      this.x += this.game.clockTick * this.speed;
      if (this.x > 800) this.isLeft = true;
    }

	  }
  }
