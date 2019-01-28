/*
 * Blink object. This class handles loading the necessary assets as well as defines
 * the update and draw function.
 *
 * Single constructor takes in the game context as its parameter. (There is no default) 
 * 
 */
class Blink
{
    /**
     * Single constructor for blink. Loads assets and sets intial parameters including
     * the speed, starting x/y position, jump height, etc.
     * 
     * @constructor
     * @param {any} game A reference to the game engine.
     */
    constructor(game)
    {
        // Load all assets for character first. There's quite a few.

        this.standLeftAnimation = new Animation
            (
            AM.getAsset("./img/Crono_Stand_FaceLeft.png"),
            14,
            34,
            3,
            0.8,
            3,
            true,
            1.8
            );
        this.standRightAnimation = new Animation
            (
            AM.getAsset("./img/Crono_Stand_FaceRight.png"),
            14,
            34,
            3,
            0.8,
            3,
            true,
            1.8
        );
        this.runFaceLeftAnimation = new Animation
            (
            AM.getAsset("./img/Crono_Run_FaceLeft.png"),
            22,
            34,
            3,
            0.1,
            6,
            true,
            1.8
            );
        this.runFaceRightAnimation = new Animation
            (
            AM.getAsset("./img/Crono_Run_FaceRight.png"),
            22,
            34,
            3,
            0.1,
            6,
            true,
            1.8
            );

        this.slashFaceLeft = new Animation
            (
            AM.getAsset("./img/Crono_DoubleSlash_FaceLeft.png"),
            31,
            48,
            3,
            0.13,
            5,
            true,
            1.8
            );
        this.slashFaceRight = new Animation
            (
            AM.getAsset("./img/Crono_DoubleSlash_FaceRight.png"),
            31,
            48,
            3,
            0.13,
            5,
            true,
            1.8
        );
        this.jumpFaceLeftAnimation = new Animation
            (
            AM.getAsset("./img/Crono_Jump_FaceLeft.png"),
            39,
            34,
            3,
            0.1,
            8,
            true,
            1.8
            );
        this.jumpFaceRightAnimation = new Animation
            (
            AM.getAsset("./img/Crono_Jump_FaceRight.png"),
            39,
            34,
            3,
            0.1,
            8,
            true,
            1.8
            );


        // Set initial values for Blinks world state!
        this.x = 50;
        this.y = 200;
        this.lastY = this.y;
        this.speed = 150;
        this.game = game;
        this.ctx = game.ctx;
        this.movingRight = false;
        this.movingLeft = false;
        this.basicAttack = false;
        this.jumpRight = false;
        this.jumpHeight = 200;
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
        if (
            !this.movingRight &&
            !this.movingLeft &&
            !this.basicAttack &&
            !this.jumpRight
        )
        {
            this.y = 200;
            this.standRightAnimation.drawFrame(this.game.clockTick, ctx, this.x, this.y);
        } else if (this.movingRight)
        {
            this.runFaceRightAnimation.drawFrame(
                this.game.clockTick,
                ctx,
                this.x,
                this.y
            );
        } else if (this.movingLeft)
        {
            this.runFaceLeftAnimation.drawFrame(this.game.clockTick, ctx, this.x, this.y);
        } else if (this.basicAttack)
        {
            this.y = 185;
            this.slashFaceRight.drawFrame(
                this.game.clockTick,
                ctx,
                this.x,
                this.y
            );
        } else if (this.jumpRight)
        {
            this.jumpFaceRightAnimation.drawFrame(
                this.game.clockTick,
                ctx,
                this.x,
                this.y
            );
        }
    }

    /** Update handles updating the objects world state. */
    update()
    {
        this.movingRight = this.game.rightArrow;
        this.movingLeft = this.game.leftArrow;
        this.basicAttack = this.game.basicAttack;
        this.jumpRight = this.game.jumpRight;
        if (this.jumpRight)
        {
            if (
                this.jumpFaceRightAnimation.elapsedTime > 0.7 ||
                (this.movingLeft || this.movingRight)
            )
            {
                console.log("WHIP IT");
                this.game.jumpRight = false;
                this.jumpRight = false;
                this.jumpFaceRightAnimation.elapsedTime = 0;
            }
        }
        this.base = 185;
        if (this.movingRight)
        {
            // this.y = 425;
            this.x += this.game.clockTick * this.speed;
        }
        if (this.movingLeft)
        {
            // this.y = 425;
            this.x -= this.game.clockTick * this.speed;
        }
        if (this.jumpRight)
        {
            var height = 0;
            var duration = this.jumpFaceRightAnimation.elapsedTime + this.game.clockTick;
            if (duration > this.jumpFaceRightAnimation.totalTime / 2)
                duration = this.jumpFaceRightAnimation.totalTime - duration;
            duration = duration / this.jumpFaceRightAnimation.totalTime;

            // quadratic jump
            height = (2 * duration - 2 * duration * duration) * this.jumpHeight;
            this.y = this.base - height;
        }

        if (this.x > 800 || this.x < 0)
        {
            this.x = 0;
        }
    }
}
