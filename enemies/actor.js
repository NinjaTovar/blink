class Actor extends Entity {
	constructor(game, x, y, atkSpd) {
		super(game, x, y);
		this.atkSpd = atkSpd;
		this.attackCounter = 0;
		this.aimAngle = 0;
	}

	update() {
		this.attackCounter += this.atkSpd;
	}

	performAttack() {
		if (this.attackCounter > 25) {
			this.attackCounter = 0;
			generateBullet(this);
		}
	}

	performSpecialAttack() {
		if (this.attackCounter > 50) {
			this.attackCounter = 0;

			generateBullet(this, this.aimAngle - 5);
			generateBullet(this, this.aimAngle);
			generateBullet(this, this.aimAngle + 5);
		}
	}

}