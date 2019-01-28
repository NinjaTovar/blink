/*
 * Mummy object. This class handles loading the necessary assets as well as defines
 * the update and draw function.
 *
 * Single constructor takes in the game context as its parameter. (There is no default) 
 */
class Mummy
{
    /**
     * Single constructor for Mummy. Loads assets and sets intial parameters including
     * the speed, starting x/y position, jump height, etc.
     * 
     * @constructor
     * @param {any} game A reference to the game engine.
     */
    constructor(game)
    {
        this.walkRightAnimation = new Animation
            (AM.getAsset('./img/Mummy_WalkRight.png'), 36, 45, 5, 0.2, 17, true, 1.5);
        this.walkLeftAnimation = new Animation
            (AM.getAsset("./img/Mummy_WalkLeft.png"), 36, 45, 5, 0.2, 17, true, 1.5);
        this.x = 400;
        this.y = 185;
        this.speed = 30;
        this.game = game;
        this.ctx = game.ctx;
        this.isLeft = true;
    }

    // Methods

    /**
     * Draw
     * 
     * Draw takes in the game context and uses that to define what update does.
     * 
     * @param {any} ctx  A reference to the Game Context.
     */
    draw(ctx)
    {
        if (!this.isLeft)
        {
            this.walkRightAnimation.drawFrame(this.game.clockTick, ctx, this.x, this.y)
        } else
        {
            this.walkLeftAnimation.drawFrame(this.game.clockTick, ctx, this.x, this.y)
        }
    }

    /** Update handles updating the objects world state. */
    update()
    {
        if (this.isLeft)
        {
            this.x -= this.game.clockTick * this.speed;
            if (this.x < 400) this.isLeft = false;
        } else
        {
            this.x += this.game.clockTick * this.speed;
            if (this.x > 800) this.isLeft = true;
        }

    }
}

