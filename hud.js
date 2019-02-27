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
		this.camera = this.game.camera;
		this.blink = this.game.blink;
		this.health = this.blink.health;
	}
	update() {
		this.health = this.blink.health;
		this.dx = -this.camera.x + 50;
		this.dy = -this.camera.y + 50;

	}
	draw(ctx) {

		ctx.beginPath();
		ctx.rect(this.dx, this.dy, 40 * (this.health / 100), 20);
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