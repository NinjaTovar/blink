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
        this.walkLeftAnimation = new Animation
            (
            AM.getAsset('./img/enemies/mummy/Mummy_WalkLeft.png'), // load sprite asset
            36,     // frame width
            45,     // frame height
            5,      // sheet width
            0.2,    // frame duration
            17,     // frames in animation
            true,   // to loop or not to loop
            1.5     // scale in relation to original image
            );
        this.walkRightAnimation = new Animation
            (
            AM.getAsset('./img/enemies/mummy/Mummy_WalkRight.png'),
            36,      // frame width
            45,      // frame height
            5,       // sheet width
            0.2,     // frame duration
            17,      // frames in animation
            true,    // to loop or not to loop
            1.5      // scale in relation to original image
        );



        // Initial world states
        this.x = 200;
        this.y = 185;
        this.speed = 30;
        this.game = game;
        this.ctx = game.ctx;
        this.isHeadingRight = true;

        // this will be used for rewind
        this.myPath = [];
        this.myPath.push(this.x);
        this.shouldRewind = false;
    }

    // Methods

    /**
     * Draw takes in the game context and uses that to define what update does.
     * 
     * @param {any} ctx  A reference to the Game Context.
     */
    draw(ctx)
    {
        // If field "isHeadingRight" is true, play walk right animation
        if (this.isHeadingRight && !this.willRewind())
        {
            this.walkRightAnimation.drawFrame(this.game.clockTick, ctx, this.x, this.y)
        }
        // If field "isHeadingRight" is false, play fly right animation
        else if (!this.isHeadingRight && !this.willRewind())
        {
            this.walkLeftAnimation.drawFrame(this.game.clockTick, ctx, this.x, this.y)
        }

        // If affected by time spell
        if (this.isHeadingRight && this.willRewind())
        {
            this.walkRightAnimation.drawFrame(this.game.clockTick, ctx, this.myPath.pop(),
                this.y);

            this.myPath.shift();

            if (this.myPath.length == 1)
            {
                this.x = this.myPath.pop();
                this.shouldRewind = false;
            }
        }
        if (!this.isHeadingRight && this.willRewind())
        {
            this.walkLeftAnimation.drawFrame(this.game.clockTick, ctx, this.myPath.pop(),
                this.y);      

            this.myPath.shift();

            if (this.myPath.length == 1)
            {
                this.x = this.myPath.pop();
                this.shouldRewind = false;
            }
        }        
    }

    /** Update handles updating the objects world state. */
    update()
    {      
        // If not under rewind spell
        if (!this.shouldRewind)
        {
            // save current x coordinates if difference from previous coordinate is at 
            // least one third pixel
            if (Math.abs(((Math.abs(this.x) - (Math.abs(this.myPath[this.myPath.length - 1]))))) > .3)
            {
                this.myPath.push(this.x);
            }
        }

        if (this.isHeadingRight)
        {
            this.x += this.game.clockTick * this.speed;
            if (this.x > 470) this.isHeadingRight = false;
        } else
        {
            this.x -= this.game.clockTick * this.speed;
            if (this.x < 200) this.isHeadingRight = true;
        }



    }

    // Helper booleans for state
    willRewind()
    {
        return ((this.myPath.length > 0) && this.shouldRewind);
    }
}

