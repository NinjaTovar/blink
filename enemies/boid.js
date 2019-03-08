class Boid extends Actor {
	constructor(game, x, y) {
		super(game, x, y);
		this.scale = 4;
		this.width = 42;
		this.height = 42;
		this.frameWidth = (this.width - 12) * this.scale; //-12 since the hitbox was too big
		this.frameHeight = (this.height - 12) * this.scale;;
		this.damage = 1; // Attack Damage of the skull
		this.atkSpd = .5; // Bullet generation speed of skull
		this.health = 500;
		let img = AM.getAsset("./img/enemies/skull/redskull.png");
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
		super.update();
		this.updateAim();
		this.performAttack();
		this.performSpecialAttack();
		this.updatePosition();
		this.boundX = this.x + 10;
		this.boundY = this.y + 10;
		this.updateMyHitBoxes();
	}

	draw(ctx) {
		// debug tool
		if (this.drawAroundHitBox) {
			this.drawAroundBox();
		}
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

		// -400 is so that skull doesnt collide with blink and stays top left
		// of blink
		if (diffX - 400 > 0)
			this.x += 2;
		else
			this.x -= 2;

		if (diffY - 400 > 0)
			this.y += 2;
		else
			this.y -= 2;
	}

}