/** Handles loading the static background of a level. */
class Background
{
    /**
     * Loads a static image for the background.
     * 
     * @constructor
     * @param {any} game A reference to the game engine
     */
    constructor(game)
    {
        this.x = 0;
        this.y = 0;
        this.game = game;
        this.ctx = game.ctx;
    }

    /**
     * 
     * @param {any} ctx A reference to the game context.
     */
    draw(ctx)
    {
        this.ctx.drawImage(AM.getAsset('./img/levels/trainTunnel.png'), this.x, this.y);
    }

    /**  */
    update()
    {   
    }
}