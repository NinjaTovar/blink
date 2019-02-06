class LevelTwo {
	constructor(gameEngine) {
		this.game = gameEngine;
	}
	loadLevel() {
		this.game.addEntity(this.game.camera);
		this.game.addEntity(new Background2(this.game));
		this.game.addEntity(this.game.blink);

		this.game.blink.lastY = 360;
		this.game.blink.groundLevel = 360;

	}
}