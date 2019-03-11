/*
 * FlyMutant object. This class handles loading the necessary assets as well as defines
 * the update and draw function.
 *
 * Single constructor takes in the game context as its parameter. (There is no default)
 */
class Violator extends Entity
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
        super(game, startX, startY);
        this.swingRightAnimation = new Animation(
            AM.getAsset("./img/enemies/violator/ViolatorSwing_FaceRight.png"),
            122, // frame width
            103, // frame height
            3, // sheet width
            0.15, // frame duration
            12, // frames in animation
            true, // to loop or not to loop
            size // scale in relation to original image
        );
        this.swingLeftAnimation = new Animation(
            AM.getAsset("./img/enemies/violator/ViolatorSwing_FaceLeft.png"),
            122, // frame width
            103, // frame height
            3, // sheet width
            0.15, // frame duration
            12, // frames in animation
            true, // to loop or not to loop
            size // scale in relation to original image
        );
        this.hitFaceRightAnimation = new Animation(
            AM.getAsset("./img/enemies/violator/Violator_Hit_FaceRight.png"),
            122, // frame width
            103, // frame height
            3, // sheet width
            0.2, // frame duration
            3, // frames in animation
            true, // to loop or not to loop
            size // scale in relation to original image
        );

        this.hitFaceLeftAnimation = new Animation(
            AM.getAsset("./img/enemies/violator/Violator_Hit_FaceLeft.png"),
            122, // frame width
            103, // frame height
            3, // sheet width
            0.2, // frame duration
            3, // frames in animation
            true, // to loop or not to loop
            size // scale in relation to original image
        );

        this.x = startX;
        this.y = startY;
        this.speed = 300;
        this.game = game;
        this.ctx = game.ctx;
        this.isHeadingRight = false;
        this.gettingHit = false;

        // set invisible boundaries for enemies path
        this.randomMinBoundary =
            Randomizer.returnRandomInt(this.ctx.canvas.width) / 2;
        this.randomMaxBoundary = Randomizer.returnRandomIntBetweenThese(
            this.randomMinBoundary,
            Randomizer.returnRandomInt(this.ctx.canvas.width)
        );

        // Ensure the enemies boundaries aren't too small
        while (this.randomMaxBoundary - this.randomMinBoundary < 500)
        {
            this.randomMaxBoundary = Randomizer.returnRandomIntBetweenThese(
                this.randomMinBoundary,
                Randomizer.returnRandomInt(this.ctx.canvas.width)
            );
        }

        // debug tool
        this.drawAroundHitBox = false;
        this.frameWidth = 122 * size/2;
        this.frameHeight = 103 * size / 1.2;
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
            this.drawAroundBox();
        }
        if (this.gettingHit)
        {
            if (this.isHeadingRight)
            {
                this.hitFaceRightAnimation.drawFrame(
                    this.game.clockTick,
                    ctx,
                    this.x,
                    this.y
                );
            } else
            {
                this.hitFaceLeftAnimation.drawFrame(
                    this.game.clockTick,
                    ctx,
                    this.x,
                    this.y
                );
            }

            return;
        }
        // If field "isHeadingRight" is true, play fly right animation
        if (this.isHeadingRight && !this.willRewind())
        {
            this.swingRightAnimation.drawFrame(
                this.game.clockTick,
                ctx,
                this.x,
                this.y
            );
        }
        // If field "isHeadingRight" is false, play fly left animation
        else if (!this.isHeadingRight && !this.willRewind())
        {
            this.swingLeftAnimation.drawFrame(
                this.game.clockTick,
                ctx,
                this.x,
                this.y
            );
        }

        // If affected by time spell
        if (this.isHeadingRight && this.willRewind() && this.myPath.length > 1)
        {
            this.x = this.myPath.pop();
            this.swingRightAnimation.drawFrame(
                this.game.clockTick,
                ctx,
                this.x,
                this.y
            );

            if (this.myPath.length == 1)
            {
                this.x = this.myPath.pop();
                this.shouldRewind = false;
            }
        }
        if (!this.isHeadingRight && this.willRewind() && this.myPath.length > 1)
        {
            this.x = this.myPath.pop();
            this.swingLeftAnimation.drawFrame(
                this.game.clockTick,
                ctx,
                this.x,
                this.y
            );

            if (this.myPath.length == 1)
            {
                this.shouldRewind = false;
                this.game.shouldRewind = false;
            }
        }
    }

    /** Update handles updating the objects world state. */
    subClassUpdate() 
    {
        this.updateMyHitBoxes();

        this.boundX = this.x + 70;
        this.boundY = this.y + 135;

        if (this.gettingHit)
        {
            this.gettingHit = false;

            return;
        }

        this.boundX = this.x;
        this.boundY = this.y;
    }

    updateMyHitBoxes()
    {
        if (this.isHeadingRight)
        {
            this.hitB.width = this.frameWidth;
            this.hitB.height = this.frameHeight;
            this.hitB.boundX = this.boundX + 40;
            this.hitB.boundY = this.boundY;
        } else
        {
            this.hitB.width = this.frameWidth;
            this.hitB.height = this.frameHeight;
            this.hitB.boundX = this.boundX + 24;
            this.hitB.boundY = this.boundY;
        }
    }
}
