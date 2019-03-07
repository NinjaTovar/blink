/**
 * Level Manager class
 */

class LevelManager {
  constructor(game, AM, ctx) {
    this.game = game;
    this.AM = AM; // Might need this later?
    this.ctx = ctx; // Might need this later?
    this.level = 4; // Indicates which level
    this.currentLevel;

    this.endOfLevelX = 3500; // Default values will be changed when maps are loaded
    this.endOfLevelY = 3500;

    // States for loading
    this.states = {
      loadNextLevel: true,
      levelLoaded: true
    };
  }

  update() {
    // if (this.game.blink.x == this.endOfLevelX && this.game.blink.y == this.endOfLevelY) {
    //   this.states.loadNextLevel = true;
    // }
    // checks game state to see if it will load.
    if (this.states.loadNextLevel) {
      this.states.levelLoaded = false;
      // Empty entities array except LM to prepare for new level
      this.game.entities.length = 1;
      // Makes it so gameEngine doesnt update while loading new entities
      this.states.loadNextLevel = false;

      if (this.level == 1) {
        console.log("loading level One!");
        this.currentLevel = new LevelOne(this.game);
        this.currentLevel.loadLevel();
      } else if (this.level == 2) {
        console.log("loading level Two!");
        this.currentLevel = new LevelTwo(this.game);
        this.currentLevel.loadLevel();
      } else if (this.level == 3) {
        console.log("loading level Three!");
        this.currentLevel = new LevelThree(this.game);
        this.currentLevel.loadLevel();
      } else if (this.level == 4) {
        console.log("loading level Four!");
        this.currentLevel = new LevelFour(this.game);
        this.currentLevel.loadLevel();
      }
      this.states.levelLoaded = true;
    } else {}
  }
  draw(ctx) {}
}