/**
 * Level Manager class
 */

class LevelManager
{
  constructor(game, AM, ctx)
  {
    this.game = game;
    this.AM = AM; // Might need this later?
    this.ctx = ctx; // Might need this later?
    this.level = 2; // Indicates which level

    this.endOfLevelX = 3500; // Default values will be changed when maps are loaded
    this.endOfLevelY = 3500;

    // States for loading
    this.states = {
      loadNextLevel: true,
      levelLoaded: true
    };

    this.startOnFirstLevel = true;
  }

  update()
  {
    if (this.startOnFirstLevel)
    {
      console.log("loading level One!");
      let currentLevel = new LevelOne(this.game);
      currentLevel.loadLevel();
      this.startOnFirstLevel = false;
    }
    else if (this.states.loadNextLevel)
    {
      this.states.levelLoaded = false;
      // Empty entities array except LM to prepare for new level
      this.game.entities.length = 1;
      // Makes it so gameEngine doesnt update while loading new entities
      this.states.loadNextLevel = false;

      if (this.level == 1)
      {
        console.log("loading level One!");
        let currentLevel = new LevelOne(this.game);
        currentLevel.loadLevel();
      } else if (this.level == 2)
      {
        console.log("loading level Two!");
        let currentLevel = new LevelTwo(this.game);
        currentLevel.loadLevel();
      } else if (this.level == 3)
      {
        console.log("loading level Three!");
        let currentLevel = new LevelThree(this.game);
        currentLevel.loadLevel();
      } else if (this.level == 4)
      {
        console.log("loading level Four!");
        let currentLevel = new LevelFour(this.game);
        currentLevel.loadLevel();
      }
      this.states.levelLoaded = true;
    }
    else
    {

    }
    this.game.blink.level = this.level;
  }
  draw(ctx) { }
}
