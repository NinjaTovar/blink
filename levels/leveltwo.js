class LevelTwo
{
    constructor(gameEngine)
    {
        this.game = gameEngine;
    }
    loadLevel()
    {
        // Add camera, background and then blink
        this.game.addEntity(this.game.camera);
        this.game.addEntity(new Background2(this.game));
        this.game.addEntity(this.game.blink);

        // Manually set Blink's coordinates for now
        this.game.blink.lastY = 360;
        this.game.blink.groundLevel = 360;



        this.game.addEntity(new Jason(this.game));
    }
}