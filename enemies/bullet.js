class Bullet {
	constructor(game, x, y, speedX, speedY, combatType) {
		super(game, x, y);

		this.timer = 0;
		this.combatType = combatType;
		this.speedX = speedX;
		this.speedY = speedY;
	}

	updatePosition() {
		this.x += this.spdX;
		this.y += this.spdY;

		if (this.x < 0 || this.x > this.game.camera.mapWidth) {
			this.spdX = -self.spdX;
		}
		if (this.y < 0 || this.y > this.game.camera.mapHeight) {
			this.spdY = -this.spdY;
		}
	}
}