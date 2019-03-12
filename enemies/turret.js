class Turret extends Actor {
	constructor(game, x, y, direction, angle) {
		super(game, x, y);
		this.scale = 2;
		this.width = 62;
		this.height = 56;
		this.direction = direction;
		this.frameWidth = (this.width - 10) * this.scale; //-12 since the hitbox was too big
		this.frameHeight = (this.height - 10) * this.scale;;
		this.damage = 5; // Attack Damage of the skull
		this.atkSpd = .20; // Bullet generation speed of skull
		this.health = 500;
		this.aimAngle = angle;
		let imgleft = AM.getAsset("./img/enemies/turret/turrentfiring.png");
		let imgright = AM.getAsset("./img/enemies/turret/turrentright.png");

		if (direction == "left") {
			this.animation = new Animation(
				imgleft,
				62,
				56,
				3,
				.1,
				11,
				true,
				this.scale);
		} else {
			this.animation = new Animation(
				imgright,
				62,
				56,
				3,
				.1,
				11,
				true,
				this.scale);
		}

	}




	update() {
		super.update();
		// this.updateAim();
		this.performAttack();
		// this.updatePosition();
		this.boundX = this.x;
		this.boundY = this.y;
		this.updateMyHitBoxes();
	}

	draw(ctx) {
		// debug tool
		if (this.drawAroundHitBox) {
			this.drawAroundBox();
		}
		this.animation.drawFrame(
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