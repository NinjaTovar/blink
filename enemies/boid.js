class Boid extends Actor {
	constructor(game, x, y, atkSpd) {
		super(game, x, y, atkSpd);
		this.frameWidth = 42;
		this.frameHeight = 42;
		this.super_update = this.update();
		this.damage = 1;
		this.animation = new Animation(
			AM.getAsset("./img/enemies/mummy/mummyDying.png",
				42,
				42,
				4,
				.4,
				16,
				true,
				1));
	}

	update() {
		this.super_update;
		this.updateAim();
		this.updatePosition();
		this.boundX = this.x;
		this.boundY = this.y;
		this.updateMyHitBoxes();
	}

	draw(ctx) {
		// debug tool
		if (this.drawAroundHitBox) {
			this.drawAroundBox();
			//this.ctx.clearRect(this.x, this.y, this.frameWidth * this.size, this.frameHeight * this.size);
			this.animation.drawFrame(
				this.game.clockTick,
				ctx,
				this.x,
				this.y
			);
		}


	}

	updateAim() {
		var diffX = this.game.blink.x - this.x;
		var diffY = this.game.blink.y - this.y;

		this.aimAngle = Math.atan2(diffY, diffX) / Math.PI * 180
	}

	updatePosition() {
		var diffX = this.game.blink.x - this.x;
		var diffY = this.game.blink.y - this.y;

		if (diffX > 0)
			this.x += 2;
		else
			this.x -= 2;

		if (diffY > 0)
			this.y += 2;
		else
			this.y -= 2;
	}
	updateMyHitBoxes() {
		this.hitB.width = this.frameWidth;
		this.hitB.height = this.frameHeight;
		this.hitB.boundX = this.boundX + 15;
		this.hitB.boundY = this.boundY;
		this.hitB.width = this.frameWidth;
		this.hitB.height = this.frameHeight;
		this.hitB.boundX = this.boundX + 24;
		this.hitB.boundY = this.boundY;

	}
}