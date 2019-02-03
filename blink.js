/*
 * Blink object. This class handles loading the necessary assets as well as defines
 * the update and draw function.
 *
 * Single constructor takes in the game context as its parameter.
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
        // Way at bottom to clean up class constructor. There 's a ton!
        this.loadAllBlinksAssets();

        // Play unsheath sword animation to start
        this.unsheathSword = true;
        this.unsheathSwordStandStill = false;

        // Set initial values for Blinks world state
        this.x = 50;
        this.y = 450;
        this.lastY = this.y;
        this.groundLevel = this.y;
        this.speed = 275;
        this.game = game;
        this.ctx = game.ctx;
        this.jumpHeight = 420;

        // key listener states
        this.moving = false;
        this.basicAttack = false;
        this.facingRight = true;
        this.running = false;
        this.jumping = false;
        this.stopTime = false;
        this.rewindTime = false;
        this.slowTime = false;
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
        // Only occurs on level start
        if (this.unsheathSword)
        {
            if (this.facingRight)
            {
                this.swordUnsheath_FaceRight.drawFrame(this.game.blinksClockTick, ctx,
                    this.x, this.y);
            }
            else
            {
                this.swordUnsheath_FaceLeft.drawFrame(this.game.blinksClockTick, ctx,
                    this.x, this.y);
            }

        }
        if (this.unsheathSwordStandStill)
        {
            if (this.facingRight)
            {
                this.atTheReady_FaceRight.drawFrame(this.game.blinksClockTick, ctx,
                    this.x, this.y);
            }
            else
            {
                this.atTheReady_FaceLeft.drawFrame(this.game.blinksClockTick, ctx,
                    this.x, this.y);
            }

        }


        // if standing still
        if (this.isStandingStill())
        {
            // face right or left depending on last state
            if (this.facingRight)
            {
                this.standRightAnimation.drawFrame(this.game.blinksClockTick, ctx,
                    this.x, this.y);
            }
            else if (!this.facingRight)
            {
                this.standLeftAnimation.drawFrame(this.game.blinksClockTick, ctx,
                    this.x, this.y);
            }
        }

        // JUMPING        
        else if (this.jumping)
        {
            if (!this.basicAttack)
            {
                // if facing left and jumping, jump facing left animation
                if (!this.facingRight)
                {
                    this.jumpFaceLeftAnimation.drawFrame(
                        this.game.blinksClockTick,
                        ctx,
                        this.x,
                        this.y
                    );
                }
                // if facing right and jumping, jump facing right animation
                else if (this.facingRight)
                {
                    this.jumpFaceRightAnimation.drawFrame(
                        this.game.blinksClockTick,
                        ctx,
                        this.x,
                        this.y
                    );
                }
            }
            else
            {
                // if facing left and jumping, jump facing left animation
                if (!this.facingRight)
                {
                    this.jumpAttackFaceLeft.drawFrame(
                        this.game.blinksClockTick,
                        ctx,
                        this.x,
                        this.y
                    );
                }
                // if facing right and jumping, jump facing right animation
                else if (this.facingRight)
                {
                    this.jumpAttackFaceRight.drawFrame(
                        this.game.blinksClockTick,
                        ctx,
                        this.x,
                        this.y
                    );
                }
            }
        }

        // RUNNING
        else if (this.isRunning())
        {
            // if facing left and moving, run left animation
            if (!this.facingRight)
            {
                this.runFaceLeftAnimation.drawFrame(
                    this.game.blinksClockTick, ctx, this.x, this.y);
            }
            // if facing right and moving, run right animation
            else if (this.moving && !this.jumping)
            {
                this.runFaceRightAnimation.drawFrame(
                    this.game.blinksClockTick, ctx, this.x, this.y);
            }
        }

        // ATTACKING
        // if facing left and basic attacking, attack left animation
        else if (this.basicAttack)
        {
            if (!this.facingRight)
            {
                // fix his attack frames that jump a bit
                this.y = this.y - 30;
                this.slashFaceLeft.drawFrame(
                    this.game.blinksClockTick,
                    ctx,
                    this.x,
                    this.y
                );
            }
            // if facing right and moving, attack right animation
            else if (this.facingRight && this.basicAttack)
            {
                // fix his attack frames that jump a bit
                this.y = this.y - 30;
                this.slashFaceRight.drawFrame(
                    this.game.blinksClockTick,
                    ctx,
                    this.x,
                    this.y
                );
            }
        }

        // SPELLCASTING
        if (this.isSpellcasting())
        {
            var raiseUpABit = 50;

            // If rewinding time
            if (!this.facingRight)
            {
                this.spellFaceLeft.drawFrame(this.game.blinksClockTick, ctx,
                    this.x, this.y - raiseUpABit);
            }
            else if (this.facingRight)
            {
                this.spellFaceRight.drawFrame(this.game.blinksClockTick, ctx,
                    this.x, this.y - raiseUpABit);
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
        this.updateBlinksStateFromKeyListeners();

        // Only happens at the beginning of the levl
        if (this.unsheathSword)
        {
            if (this.swordUnsheath_FaceRight.elapsedTime > 0.7)
            {
                this.unsheathSword = false;
                this.unsheathSwordStandStill = true;
            }
        }

        if (this.isStandingStill())
        {
            console.log(this.standLeftAnimation.elapsedTime);
            if (this.standLeftAnimation.elapsedTime > 2 ||
                this.standRightAnimation.elapsedTime > 2)
            {
                this.swordUnsheath_FaceLeft.elapsedTime = 0;
                this.swordUnsheath_FaceRight.elapsedTime = 0;
                this.standLeftAnimation.elapsedTime = 0;
                this.standRightAnimation.elapsedTime = 0;
                this.unsheathSword = true;
            }
        }

        if (this.isRunning())
        {
            this.unsheathSwordStandStill = false;
        }

        // Alert game engine to states
        // stop state update for game engine
        if (this.stopTime)
        {
            this.game.allShouldStop(true);

            this.unsheathSword = false;
            this.unsheathSwordStandStill = false;
        }
        if (!this.stopTime)
        {
            this.game.allShouldStop(false);
        }
        // rewind state update for game engine
        if (this.rewindTime)
        {
            this.game.allShouldRewind(true);

            this.unsheathSword = false;
            this.unsheathSwordStandStill = false;
        }
        if (!this.rewindTime)
        {
            this.game.allShouldRewind(false);
        }
        // rewind state update for game engine
        if (this.slowTime)
        {
            this.game.allShouldSlow(true);

            this.unsheathSword = false;
            this.unsheathSwordStandStill = false;
        }
        if (!this.slowTime)
        {
            this.game.allShouldSlow(false);
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
            this.x -= this.game.blinksClockTick * this.speed;
        }
        if (this.facingRight && this.moving)
        {
            this.x += this.game.blinksClockTick * this.speed;
        }

        // Manage jumps using the animation classes timer. Need both left/right animation.
        // If facing right and jumping
        if (this.jumping && this.facingRight)
        {
            var height = 0;
            var duration = this.jumpFaceRightAnimation.elapsedTime + this.game.blinksClockTick;
            if (duration > this.jumpFaceRightAnimation.totalTime / 2)
                duration = this.jumpFaceRightAnimation.totalTime - duration;
            duration = duration / this.jumpFaceRightAnimation.totalTime;

            // quadratic jump
            height = (2 * duration - 2 * duration * duration) * this.jumpHeight;
            this.y = this.groundLevel - height;

            if (this.moving)
            {
                this.x += this.game.blinksClockTick * this.speed;
            }
        }
        // If facing left and jumping
        else if (this.jumping && !this.facingRight)
        {
            var height = 0;
            var duration = this.jumpFaceLeftAnimation.elapsedTime + this.game.blinksClockTick;
            if (duration > this.jumpFaceLeftAnimation.totalTime / 2)
            {
                duration = this.jumpFaceLeftAnimation.totalTime - duration;
            }
            duration = duration / this.jumpFaceLeftAnimation.totalTime;

            // quadratic jump
            height = (2 * duration - 2 * duration * duration) * this.jumpHeight;
            this.y = this.groundLevel - height;

            if (this.moving)
            {
                this.x -= this.game.blinksClockTick * this.speed;
            }
        }

        // TODO - on finish of camera rework this
        // keep in bounds of canvas until camera class is functional
        if (this.x > this.ctx.canvas.width - 20)
        {
            this.x = this.ctx.canvas.width - 20;
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
        return ((this.rewindTime || this.stopTime || this.slowTime) && !this.moving &&
            !this.jumping && !this.basicAttack && !this.unsheathSword && !this.unsheathSwordStandStill);
    }

    isStandingStill()
    {
        return (!this.moving && !this.basicAttack &&
            !this.jumping && !this.isSpellcasting() && !this.unsheathSword && !this.unsheathSwordStandStill);
    }

    isRunning()
    {
        return (this.moving && !this.jumping);
    }

    /** Updates the state booleans for Blinks actions. */
    updateBlinksStateFromKeyListeners()
    {
        // update state based on gameengine key listener update
        if (this.game.slowTime !== undefined)
        {
            this.slowTime = this.game.slowTime;
        }
        if (this.game.facingRight !== undefined)
        {
            this.facingRight = this.game.facingRight;
        }
        if (this.game.moving !== undefined)
        {
            this.moving = this.game.moving;
        }
        if (this.game.basicAttack !== undefined)
        {
            this.basicAttack = this.game.basicAttack;
        }
        if (this.game.jumping !== undefined)
        {
            this.jumping = this.game.jumping;
        }
        if (this.game.stopTime !== undefined)
        {
            this.stopTime = this.game.stopTime;
        }
        if (this.game.rewindTime !== undefined)
        {
            this.rewindTime = this.game.rewindTime;
        }
    }

    /** Load all animations. */
    loadAllBlinksAssets()
    {
        // Load all assets for character first. There's quite a few.
        this.swordUnsheath_FaceLeft = new Animation
            (
            AM.getAsset('./img/blink/Crono_PullSwordOut_FaceLeft.png'),
            30,      // frame width
            32,      // frame height
            3,       // sheet width
            0.2,     // frame duration
            6,       // frames in animation
            true,    // to loop or not to loop
            3      // scale in relation to original image
            );
        this.swordUnsheath_FaceRight = new Animation
            (
            AM.getAsset('./img/blink/Crono_PullSwordOut_FaceRight.png'),
            30,      // frame width
            32,      // frame height
            3,       // sheet width
            0.2,     // frame duration
            6,       // frames in animation
            true,    // to loop or not to loop
            3      // scale in relation to original image
        );
        this.atTheReady_FaceLeft = new Animation
            (
            AM.getAsset('./img/blink/Crono_PullSwordOut_FaceLeft_Still.png'),
            30,      // frame width
            32,      // frame height
            1,       // sheet width
            0.2,     // frame duration
            1,       // frames in animation
            true,    // to loop or not to loop
            3      // scale in relation to original image
            );
        this.atTheReady_FaceRight = new Animation
            (
            AM.getAsset('./img/blink/Crono_PullSwordOut_FaceRight_Still.png'),
            30,      // frame width
            32,      // frame height
            1,       // sheet width
            0.2,     // frame duration
            1,       // frames in animation
            true,    // to loop or not to loop
            3      // scale in relation to original image
            );
        this.standLeftAnimation = new Animation
            (
            AM.getAsset('./img/blink/Crono_Stand_FaceLeft.png'),
            14,      // frame width
            34,      // frame height
            3,       // sheet width
            0.8,     // frame duration
            3,       // frames in animation
            true,    // to loop or not to loop
            3      // scale in relation to original image
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
            3    // scale in relation to original image
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
            3     // scale in relation to original image
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
            3     // scale in relation to original image
        );
        this.jumpAttackFaceLeft = new Animation
            (
            AM.getAsset('./img/blink/Crono_JumpSlash_FaceLeft.png'),
            24,     // frame width
            39,     // frame height
            1,      // sheet width
            0.5,   // frame duration
            1,      // frames in animation
            true,   // to loop or not to loop
            3     // scale in relation to original image
            );
        this.jumpAttackFaceRight = new Animation
            (
            AM.getAsset('./img/blink/Crono_JumpSlash_FaceRight.png'),
            24,     // frame width
            39,     // frame height
            1,      // sheet width
            0.5,   // frame duration
            1,      // frames in animation
            true,   // to loop or not to loop
            3     // scale in relation to original image
            );
        this.slashFaceLeft = new Animation
            (
            AM.getAsset('./img/blink/Crono_Slash_FaceLeft.png'),
            31,     // frame width
            48.3,     // frame height
            2,      // sheet width
            0.13,   // frame duration
            3,      // frames in animation
            true,   // to loop or not to loop
            3     // scale in relation to original image
            );
        this.slashFaceRight = new Animation
            (
            AM.getAsset('./img/blink/Crono_Slash_FaceRight.png'),
            31,     // frame width
            48.3,     // frame height
            2,      // sheet width
            0.13,   // frame duration
            3,      // frames in animation
            true,   // to loop or not to loop
            3     // scale in relation to original image
            );
        this.jumpFaceLeftAnimation = new Animation
            (
            AM.getAsset('./img/blink/Crono_Jump_FaceLeft.png'),
            39.2,     // frame width
            34,     // frame height
            3,      // sheet width
            0.1,    // frame duration
            8,      // frames in animation
            true,   // to loop or not to loop
            3     // scale in relation to original image
            );
        this.jumpFaceRightAnimation = new Animation
            (
            AM.getAsset('./img/blink/Crono_Jump_FaceRight.png'),
            38.78,     // frame width
            34,     // frame height
            3,      // sheet width
            0.1,    // frame duration
            8,      // frames in animation
            true,   // to loop or not to loop
            3     // scale in relation to original image
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
            3     // scale in relation to original image
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
            3    // scale in relation to original image
            );
    }
}
