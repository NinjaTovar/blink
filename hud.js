// A container class for all the UI elements we will display on canvas
class Hud {
	constructor(game) {
		this.game = game;
		this.camera = game.camera;
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

		ctx.beginPath();
		ctx.strokeStyle = 'red';
		ctx.rect(this.camera.offsetX, this.camera.offsetY, this.camera.viewWidth, this.camera.viewHeight);
		ctx.stroke();
	}


}
// The class is named health bar but also does the energy bar
class HealthBar {
	constructor(game) {
		this.game = game;
		this.camera = this.game.camera;
		this.blink = this.game.blink;
		this.health = this.blink.health;
		this.width = 8;
		this.height = 46;
		this.scale = 2;
		this.offsetX = 20;

	}
	update() {
		this.health = this.blink.health;
		// Add update for energy here
		this.dx = -this.camera.x + 50;
		this.dy = -this.camera.y + 50;

	}
	// need to flip the images
	draw(ctx) {
		let health = AM.getAsset('./img/blink/healthbar.png');
		let energy = AM.getAsset('./img/blink/energy.png');

		// Draws health bar
		ctx.drawImage(
			health,
			0,
			0,
			this.width,
			this.height * (this.health / 1000),
			this.dx,
			this.dy,
			this.width * this.scale,
			this.height * (this.health / 1000) * this.scale
		);

		// Draws energy bar, blinks energy is hardcoded for now
		ctx.drawImage(
			energy,
			0,
			0,
			this.width,
			this.height * (1000 / 1000),
			this.dx + this.offsetX,
			this.dy,
			this.width * this.scale,
			this.height * (1000 / 1000) * this.scale
		);

	}

}