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
            AM.getAsset('./img/blink/Crono_Stand_FaceLeft.png'),
            14,      // frame width
            34,      // frame height
            3,       // sheet width
            0.8,     // frame duration
            3,       // frames in animation
            true,    // to loop or not to loop
            1.8      // scale in relation to original image
            );
        this.standRightAnimation = new Animation
            (
            AM.getAsset('./img/blink/Crono_Stand_FaceRight.png'),
            14,     // frame width
            34,     // frame height
            3,      // sheet width
            0.8,    // frame duration
            3,      // frames in animation
            true,   // to loop or not to loop
            1.8     // scale in relation to original image
        );
        this.runFaceLeftAnimation = new Animation
            (
            AM.getAsset('./img/blink/Crono_Run_FaceLeft.png'),
            22,     // frame width
            34,     // frame height
            3,      // sheet width
            0.1,    // frame duration
            6,      // frames in animation
            true,   // to loop or not to loop
            1.8     // scale in relation to original image
            );
        this.runFaceRightAnimation = new Animation
            (
            AM.getAsset('./img/blink/Crono_Run_FaceRight.png'),
            22,     // frame width
            34,     // frame height
            3,      // sheet width
            0.1,    // frame duration
            6,      // frames in animation
            true,   // to loop or not to loop
            1.8     // scale in relation to original image
            );

        this.slashFaceLeft = new Animation
            (
            AM.getAsset('./img/blink/Crono_DoubleSlash_FaceLeft.png'),
            31,     // frame width
            48,     // frame height
            3,      // sheet width
            0.13,   // frame duration
            5,      // frames in animation
            true,   // to loop or not to loop
            1.8     // scale in relation to original image
            );
        this.slashFaceRight = new Animation
            (
            AM.getAsset('./img/blink/Crono_DoubleSlash_FaceRight.png'),
            31,     // frame width
            48,     // frame height
            3,      // sheet width
            0.13,   // frame duration
            5,      // frames in animation
            true,   // to loop or not to loop
            1.8     // scale in relation to original image
        );
        this.jumpFaceLeftAnimation = new Animation
            (
            AM.getAsset('./img/blink/Crono_Jump_FaceLeft.png'),
            39,     // frame width
            34,     // frame height
            3,      // sheet width
            0.1,    // frame duration
            8,      // frames in animation
            true,   // to loop or not to loop
            1.8     // scale in relation to original image
            );
        this.jumpFaceRightAnimation = new Animation
            (
            AM.getAsset('./img/blink/Crono_Jump_FaceRight.png'),
            39,     // frame width
            34,     // frame height
            3,      // sheet width
            0.1,    // frame duration
            8,      // frames in animation
            true,   // to loop or not to loop
            1.8     // scale in relation to original image
            );


        // Set initial values for Blinks world state
        this.x = 50;
        this.y = 200;
        this.lastY = this.y;
        this.groundLevel = this.y;
        this.speed = 150;
        this.game = game;
        this.ctx = game.ctx;
        this.jumpHeight = 200;

        // key listener states
        this.moving = false;
        this.basicAttack = false;
        this.facingRight = true;
        this.running = false;
        this.jumping = false;
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
        // if standing still
        if (!this.moving && !this.basicAttack && !this.jumping)
        {
            // face right or left depending on last state
            if (this.facingRight)
            {
                this.standRightAnimation.drawFrame(this.game.clockTick, ctx,
                    this.x, this.y);
            }
            else if (!this.facingRight)
            {
                this.standLeftAnimation.drawFrame(this.game.clockTick, ctx,
                    this.x, this.y);
            }

        }

        // JUMPING
        // if facing left and jumping, jump facing left animation
        else if (!this.facingRight && this.jumping)
        {
            this.jumpFaceLeftAnimation.drawFrame(
                this.game.clockTick,
                ctx,
                this.x,
                this.y
            );
        }
        // if facing right and jumping, jump facing right animation
        else if (this.facingRight && this.jumping)
        {
            this.jumpFaceRightAnimation.drawFrame(
                this.game.clockTick,
                ctx,
                this.x,
                this.y
            );
        }

        // RUNNING
        // if facing left and moving, run left animation
        else if (!this.facingRight && this.moving && !this.jumping)
        {
            this.runFaceLeftAnimation.drawFrame(
                this.game.clockTick, ctx, this.x, this.y);
        }
        // if facing right and moving, run right animation
        else if (this.facingRight && this.moving && !this.jumping)
        {
            this.runFaceRightAnimation.drawFrame(
                this.game.clockTick, ctx, this.x, this.y);
        }

        // ATTACKING
        // if facing left and basic attacking, attack left animation
        else if (!this.facingRight && this.basicAttack)
        {
            this.y = 185;
            this.slashFaceLeft.drawFrame(
                this.game.clockTick,
                ctx,
                this.x,
                this.y
            );
        }
        // if facing right and moving, attack right animation
        else if (this.facingRight && this.basicAttack)
        {
            this.y = 185;
            this.slashFaceRight.drawFrame(
                this.game.clockTick,
                ctx,
                this.x,
                this.y
            );
        }

        // If not jumping, make sure Blink is on the ground level
        if (!this.jumping)
        {
            // bring him down to earth if neccessary
            this.y = this.groundLevel;
        }
    }

    /** Update handles updating the objects world state. */
    update()
    {
        // what is this?
        this.base = 200;

        // update state based on gameengine key listener update
        this.moving = this.game.moving;
        this.basicAttack = this.game.basicAttack;
        this.jumping = this.game.jumping;
        this.facingRight = this.game.facingRight;

        if (this.jumping)
        {
            if (this.jumpFaceRightAnimation.elapsedTime > 0.7 ||
                this.jumpFaceLeftAnimation.elapsedTime > 0.7)
            {
                console.log('WHIP IT');
                this.game.jumping = false;
                this.jumping = false;
                this.jumpFaceRightAnimation.elapsedTime = 0;
                this.jumpFaceLeftAnimation.elapsedTime = 0;
            }
        }

        if (!this.facingRight && this.moving)
        {
            this.x -= this.game.clockTick * this.speed;
        }
        if (this.facingRight && this.moving)
        {
            this.x += this.game.clockTick * this.speed;
        }

        // Manage jumps using the animation classes timer. Need both left/right animation.
        // If facing right and jumping
        if (this.jumping && this.facingRight)
        {
            var height = 0;
            var duration = this.jumpFaceRightAnimation.elapsedTime + this.game.clockTick;
            if (duration > this.jumpFaceRightAnimation.totalTime / 2)
                duration = this.jumpFaceRightAnimation.totalTime - duration;
            duration = duration / this.jumpFaceRightAnimation.totalTime;

            // quadratic jump
            height = (2 * duration - 2 * duration * duration) * this.jumpHeight;
            this.y = this.base - height;

            if (this.moving)
            {
                this.x += this.game.clockTick * this.speed;
            }
        }
        // If facing left and jumping
        else if (this.jumping && !this.facingRight)
        {
            var height = 0;
            var duration = this.jumpFaceLeftAnimation.elapsedTime + this.game.clockTick;
            if (duration > this.jumpFaceLeftAnimation.totalTime / 2)
                duration = this.jumpFaceLeftAnimation.totalTime - duration;
            duration = duration / this.jumpFaceLeftAnimation.totalTime;

            // quadratic jump
            height = (2 * duration - 2 * duration * duration) * this.jumpHeight;
            this.y = this.base - height;

            if (this.moving)
            {
                this.x -= this.game.clockTick * this.speed;
            }
        }

        // TODO - on finish of camera rework this
        // keep in bounds of canvas until camera class is functional
        if (this.x > 770)
        {
            this.x = 770;
            this.moving = false;
        }
        else if (this.x < 0)
        {
            this.x = 0;
            this.moving = false;
        }
    }
}
