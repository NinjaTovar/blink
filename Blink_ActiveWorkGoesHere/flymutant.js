/*
 * FlyMutant object. This class handles loading the necessary assets as well as defines
 * the update and draw function.
 *
 * Single constructor takes in the game context as its parameter. (There is no default) 
 */
class FlyMutant
{
    /**
     * Single constructor for Fly. Loads assets and sets intial parameters including
     * the speed, starting x/y position, etc.
     * 
     * @constructor
     * @param {any} game A reference to the game engine.
     * @param {any} startX Starting x position of the fly being constructed.
     * @param {any} startY Starting x position of the fly being constructed.
     * @param {any} size Size of scale for character.
     */
    constructor(game, startX, startY, size)
    {
        this.animation = new Animation
            (
            AM.getAsset("./img/FlyGuy_Right.png"),
            111,
            119,
            2,
            0.1,
            3,
            true,
            size
            );

        this.x = startX;
        this.y = startY;
        this.speed = 80;
        this.game = game;
        this.ctx = game.ctx;
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
        this.animation.drawFrame(this.game.clockTick, ctx, this.x, this.y);
    }

    /** Update handles updating the objects world state. */
    update()
    {
        this.x += this.game.clockTick * this.speed;
        if (this.x > 1500)
        {
            this.x = -10;
        }
    }
}
