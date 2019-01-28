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
        this.ctx.drawImage(AM.getAsset("./img/backgroundTest.png"), this.x, this.y);
    }

    /**  */
    update()
    {

    }



    // NOTE: BELOW WAS THE OLD CODE IN MAIN WHEN IT WAS NOT A CLASS BUT A FUNCTION
    // NOT SURE I MADE IT INTO CLASS CORRECTLY. WE WILL KNOW IF THERE IS PERFORMANCE
    // ISSUES BECAUSE THE DRAW FUNCTION IS LIKELY (UNNECCESSARILY) CALLED REPEATEDLY.

    // no inheritance
    //function Background(game, spritesheet)
    //{
    //    this.x = 0;
    //    this.y = 0;
    //    this.spritesheet = spritesheet;
    //    this.game = game;
    //    this.ctx = game.ctx;
    //}
    
    //Background.prototype.draw = function ()
    //{
    //    this.ctx.drawImage(this.spritesheet, this.x, this.y);
    //};
    
    //Background.prototype.update = function () { };
}