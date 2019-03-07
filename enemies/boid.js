class Boid extends Actor {
	constructor(game, x, y, atkSpd, img) {
		super(game, x, y, atkSpd);
		this.scale = 2;
		this.frameWidth = 42 * this.scale;
		this.frameHeight = 42 * this.scale;;
		this.super_update = this.update();
		this.damage = 10;
		this.health = 100;
		this.floatAnimation = new Animation(
			img,
			42,
			42,
			4,
			.4,
			16,
			true,
			this.scale);
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
		// if (this.drawAroundHitBox) {
		// 	this.drawAroundBox();
		// }
		this.floatAnimation.drawFrame(
			this.game.clockTick,
			ctx,
			this.x,
			this.y
		);

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

}