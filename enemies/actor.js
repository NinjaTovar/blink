class Actor extends Entity {
	constructor(game, x, y) {
		super(game, x, y);
		this.attackCounter = 0;
		this.specialAttackCounter = 0;
		this.aimAngle = 0;

	}

	update() {
		this.attackCounter += this.atkSpd;
		this.specialAttackCounter += this.atkSpd;
	}

	performAttack() {

		if (this.attackCounter > 25) {
			this.attackCounter = 0;
			this.generateBullet(this);
		}
	}

	performSpecialAttack() {
		if (this.specialAttackCounter > 100) {
			this.specialAttackCounter = 0;
			console.log("special attack");
			this.generateBullet(this, this.aimAngle - 20);
			this.generateBullet(this, this.aimAngle - 10);
			this.generateBullet(this, this.aimAngle);
			this.generateBullet(this, this.aimAngle + 10);
			this.generateBullet(this, this.aimAngle + 20);

		}
	}
	generateBullet(actor, aimOverwrite) {
		//Math.random() returns a number between 0 and 1
		var x = actor.x;
		var y = actor.y;
		var angle;
		if (aimOverwrite !== undefined)
			angle = aimOverwrite;
		else angle = actor.aimAngle;

		var spdX = Math.cos(angle / 180 * Math.PI) * 5;
		var spdY = Math.sin(angle / 180 * Math.PI) * 5;
		this.game.addEntity(new Fireball(this.game, x, y, spdX, spdY));
	}
}