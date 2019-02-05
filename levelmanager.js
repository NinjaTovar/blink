/**
 * Level Manager class
 */

class LevelManager {
	constructor(game, AM, ctx) {
		this.game = game;
		this.AM = AM;
		this.ctx = ctx;
		this.level = 1;


		// States for loading
		this.states = {
			'loadNextLevel': true,
		}
	}

	update() {
		if (this.states.loadNextLevel) {
			// Empty entities array to prepare for new level
			// this.game.entities = [];

			if (this.level == 1) {
				console.log('loading level One!');
				let currentLevel = new LevelOne(this.game, AM, this.ctx);
				this.states.loadNextLevel = false;
				currentLevel.loadLevel();
			} else if (this.level == 2) {
				// console.log('loading level Two!');
				// let currentLevel = new LevelOne(this.game, AM, this.ctx);
				// this.states.loadNextLevel = false;
				// currentLevel.loadLevel();
			}


		} else {

		}
	}
	draw(ctx) {

	}
}