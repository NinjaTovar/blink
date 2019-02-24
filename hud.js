class Hud {
	constructor(game) {
		this.game = game;
		this.healthbar = new HealthBar(game);
		this.components = [this.healthbar];
	}
	update() {
		for (var i = 0; i < this.components.length; i++) {
			this.components[i].update();
		}
	}
	draw(ctx) {
		for (var i = 0; i < this.components.length; i++) {
			this.components[i].draw(ctx);
		}
	}


}
class HealthBar {
	constructor(game) {
		this.game = game;
		this.ctx = this.game.ctx;
		this.camera = this.game.camera;
		this.blink = this.game.blink;
		this.health = this.blink.health;
	}
	update() {
		this.health = this.blink.health;
		this.dx = this.game.blink.x;

	}
	draw(ctx) {
		// ctx.fillStyle = "#FF0000";
		// ctx.fillRect(this.dx, 50, (this.health / 100) * 40, 25);

		ctx.beginPath();
		ctx.rect(this.dx, 20, 40 * (this.health / 100), 20);
		if (this.health > 630) {
			ctx.fillStyle = "green"
		} else if (this.health > 370) {
			ctx.fillStyle = "gold"
		} else if (this.health > 130) {
			ctx.fillStyle = "orange";
		} else {
			ctx.fillStyle = "red";
		}
		ctx.closePath();
		ctx.fill();

	}

}