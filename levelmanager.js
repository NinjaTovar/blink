/**
 * Level Manager class
 */


class LevelManager {
	constructor(game, AM, ctx) {
		this.game = game;
		this.AM = AM; // Might need this later?
		this.ctx = ctx;  // Might need this later?
		this.level = 1; // Indicates which level


		// States for loading
		this.states = {
			'loadNextLevel': true,
		}
	}

	update() {
		console.log('hello');
		// checks game state to see if it will load.
		if (this.states.loadNextLevel) {
			// Empty entities array to prepare for new level
			this.game.entities = [];

			if (this.level == 1) {
				console.log('loading level One!');
				let currentLevel = new LevelOne(this.game);
				this.states.loadNextLevel = false;
				currentLevel.loadLevel();
			} else if (this.level == 2) {

				console.log('loading level Two!');
				let currentLevel = new LevelTwo(this.game);
				this.states.loadNextLevel = false;
				currentLevel.loadLevel();
			}


		} else {

		}
	}
	draw(ctx) {

	}
}