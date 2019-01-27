class Mummy {
	constructor(game) {
	  this.walkRightAnimation = new Animation(
		AM.getAsset('../Mummy_WalkRight.png'), 36.5, 45.2, 5, 0.09, 17, true, 2);
	  this.walkLeftAnimation = new Animation(
		AM.getAsset("../Mummy_WalkLeft.png"), 36.5, 45.2, 5, 0.1, 17, true, 2);
	  this.x = 500;
	  this.y = 410;
	  this.speed = 150;
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
