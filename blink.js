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
        this.spellFaceLeft = new Animation
            (
            AM.getAsset('./img/blink/Crono_Spell_FaceLeft.png'),
            21,     // frame width
            39,     // frame height
            2,      // sheet width
            0.4,    // frame duration
            3,      // frames in animation
            true,   // to loop or not to loop
            1.8     // scale in relation to original image
            );
        this.spellFaceRight = new Animation
            (
            AM.getAsset('./img/blink/Crono_Spell_FaceRight.png'),
            21,     // frame width
            39,     // frame height
            2,      // sheet width
            0.4,    // frame duration
            3,      // frames in animation
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
        this.stopTime = false;
        this.rewindTime = false;
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
        if (this.isStandingStill())
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
        else if (this.jumping)
        {
            // if facing left and jumping, jump facing left animation
            if (!this.facingRight)
            {
                this.jumpFaceLeftAnimation.drawFrame(
                    this.game.clockTick,
                    ctx,
                    this.x,
                    this.y
                );   
            }
            // if facing right and jumping, jump facing right animation
            else if (this.facingRight)
            {
                this.jumpFaceRightAnimation.drawFrame(
                    this.game.clockTick,
                    ctx,
                    this.x,
                    this.y
                );
            }
        }

        // RUNNING
        else if (this.isRunning())
        {
            // if facing left and moving, run left animation
            if (!this.facingRight)
            {
                this.runFaceLeftAnimation.drawFrame(
                    this.game.clockTick, ctx, this.x, this.y);
            }
            // if facing right and moving, run right animation
            else if (this.moving && !this.jumping)
            {
                this.runFaceRightAnimation.drawFrame(
                    this.game.clockTick, ctx, this.x, this.y);
            }
        }

        // ATTACKING
        // if facing left and basic attacking, attack left animation
        else if (this.basicAttack)
        {
            if (!this.facingRight)
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
        }

        // SPELLCASTING
        if (this.isSpellcasting())
        {
            var raiseUpABit = 20;

            if (this.rewindTime)
            {
                // If rewinding time
                if (!this.facingRight)
                {
                    this.spellFaceLeft.drawFrame(this.game.clockTick, ctx,
                        this.x, this.y - raiseUpABit);
                }
                else if (this.facingRight)
                {
                    this.spellFaceRight.drawFrame(this.game.clockTick, ctx,
                        this.x, this.y - raiseUpABit);
                }
            }
            // If stopping time
            else if (this.stopTime)
            {
                if (!this.facingRight)
                {
                    this.spellFaceLeft.drawFrame(this.game.clockTick, ctx,
                        this.x, this.y - raiseUpABit);
                }
                else if (this.facingRight)
                {
                    this.spellFaceRight.drawFrame(this.game.clockTick, ctx,
                        this.x, this.y - raiseUpABit);
                }
            }
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
        // update state based on gameengine key listener update
        this.moving = this.game.moving;
        this.basicAttack = this.game.basicAttack;
        this.jumping = this.game.jumping;
        this.facingRight = this.game.facingRight;
        this.stopTime = this.game.stopTime;
        this.rewindTime = this.game.rewindTime;

        // For now just freeze the timer and call alpha.
        // This will need work.
        if (this.stopTime)
        {
            this.game.stopTickLoop();
        }

        if (this.rewindTime)
        {
            this.game.allShouldRewind(true);
        }
        if (!this.rewindTime)
        {
            this.game.allShouldRewind(false);
        }

        // If jumping, use animations elasped time for setting jump to false. This is
        // currently the best way to keep the animation looking sexy.
        if (this.jumping)
        {
            if (this.jumpFaceRightAnimation.elapsedTime > 0.7 ||
                this.jumpFaceLeftAnimation.elapsedTime > 0.7)
            {
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
            this.y = this.groundLevel - height;

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
            this.y = this.groundLevel - height;

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

    /**
     * A couple quick shortcuts on the boolean evaluations for making the code cleaner.
     */

    /** This is a quick check for casting either spell as it's the same animation */
    isSpellcasting()
    {
        return ((this.rewindTime || this.stopTime) && !this.moving);
    }

    isStandingStill()
    {
        return (!this.moving && !this.basicAttack &&
            !this.jumping && !this.isSpellcasting());
    }

    isRunning()
    {
        return (this.moving && !this.jumping);
    }
}
