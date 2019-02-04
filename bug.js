/*
 * FlyMutant object. This class handles loading the necessary assets as well as defines
 * the update and draw function.
 *
 * Single constructor takes in the game context as its parameter. (There is no default) 
 */
class Bug
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
    constructor(game, startX, startY, size, isHeadingRight)
    {
        this.runLeftAnimation = new Animation
            (
            AM.getAsset('./img/enemies/bug/BugRun_FaceLeft.png'),
            53,    // frame width
            54,     // frame height
            2,      // sheet width
            0.1,    // frame duration
            5,      // frames in animation
            true,   // to loop or not to loop
            size    // scale in relation to original image
            );
        this.runRightAnimation = new Animation
            (
            AM.getAsset('./img/enemies/bug/BugRun_FaceRight.png'),
            53,    // frame width
            54,     // frame height
            2,      // sheet width
            0.1,    // frame duration
            5,      // frames in animation
            true,   // to loop or not to loop
            size    // scale in relation to original image
            );

        this.x = startX;
        this.y = startY;
        this.speed = 300;
        this.game = game;
        this.ctx = game.ctx;
        this.isHeadingRight = isHeadingRight;

        // set invisible boundaries for enemies path
        this.randomMinBoundary = Randomizer.returnRandomInt(this.ctx.canvas.width) / 2;
        this.randomMaxBoundary = Randomizer.returnRandomIntBetweenThese(this.randomMinBoundary,
            Randomizer.returnRandomInt(this.ctx.canvas.width));

        // Ensure the enemies boundaries aren't too small
        while ((this.randomMaxBoundary - this.randomMinBoundary) < 500)
        {
            this.randomMaxBoundary = Randomizer.returnRandomIntBetweenThese(this.randomMinBoundary,
                Randomizer.returnRandomInt(this.ctx.canvas.width));
        }

        // this will be used for rewind
        this.myPath = [];
        this.myPath.push(0);
        this.shouldRewind = false;
        this.resetPath = false;

        // debug tool
        this.drawAroundHitBox = false;
        this.frameWidth = 53;
        this.frameHeight = 54;
        this.size = size;
    }

    // Methods

    /**
     * Draw takes in the game context and uses that to define what update does.
     * 
     * @param {any} ctx  A reference to the Game Context.
     */
    draw(ctx)
    {
        // debug tool
        if (this.drawAroundHitBox)
        {
            this.ctx.beginPath();
            this.ctx.strokeStyle = 'white';
            this.ctx.rect(this.x, this.y, this.frameWidth * this.size, this.frameHeight * this.size);
            this.ctx.stroke();
            //this.ctx.clearRect(this.x, this.y, this.frameWidth * this.size, this.frameHeight * this.size);
        }

        // If field "isHeadingRight" is true, play fly right animation
        if ((this.isHeadingRight && !this.willRewind()))
        {
            this.runRightAnimation.drawFrame(this.game.clockTick, ctx, this.x, this.y)
        }
        // If field "isHeadingRight" is false, play fly left animation
        else if ((!this.isHeadingRight && !this.willRewind()))
        {
            this.runLeftAnimation.drawFrame(this.game.clockTick, ctx, this.x, this.y)
        }

        // If affected by time spell
        if (this.isHeadingRight && this.willRewind() && this.myPath.length > 1)
        {
            this.x = this.myPath.pop();
            this.runRightAnimation.drawFrame(this.game.clockTick, ctx, this.x,
                this.y);


            if (this.myPath.length == 1)
            {
                this.x = this.myPath.pop();
                this.shouldRewind = false;
            }
        }
        if (!this.isHeadingRight && this.willRewind() && this.myPath.length > 1)
        {
            this.x = this.myPath.pop();
            this.runLeftAnimation.drawFrame(this.game.clockTick, ctx, this.x,
                this.y);

            if (this.myPath.length == 1)
            {
                this.shouldRewind = false;
                this.game.shouldRewind = false;
            }
        }
    }



    /** Update handles updating the objects world state. */
    update()
    {
        if (this.game.resetPaths != undefined)
        {
            this.resetPath = this.game.resetPaths;
        }

        // alert fly to reset the array for path variables
        if (this.resetPath)
        {
            this.x = this.myPath.pop();

            console.log("Rewind path is reset");


            this.resetPath = false;
            this.game.resetPaths = false;
        }

        if (this.myPath.length == 1)
        {
            this.shouldRewind = false;
            this.game.shouldRewind = false;
        }

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
            if (this.x > this.randomMaxBoundary)
            {
                this.isHeadingRight = false;
            }
        }
        else if (!this.isHeadingRight)
        {
            this.x -= this.game.clockTick * this.speed;
            if (this.x < this.randomMinBoundary)
            {
                this.isHeadingRight = true;
            }
        }
    }

    // Helper booleans for state
    willRewind()
    {
        return ((this.myPath.length > 0) && this.shouldRewind);
    }
}
