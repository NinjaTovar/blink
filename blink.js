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
        this.speedTime = false;
        this.levelStarted = false;
        this.dontRestartLevel = false;

        // Music and Sounds
        this.adventureTimeTrack = document.getElementById('adventureTimeTrack');
        this.sandsOfTimeTrack = document.getElementById('sandsOfTimeTrack');
        this.heroOfTimeTrack = document.getElementById('heroOfTimeTrack');
        this.mysteriousTrack = document.getElementById('mysteriousTrack');
        this.questionsTrack = document.getElementById('questionsTrack');
        this.slowSoundEffect = document.getElementById('slowTime');
        this.speedSoundEffect = document.getElementById('speedTime');
        this.rewindSoundEffect = document.getElementById('rewindTime');
        this.stopSoundEffect = document.getElementById('stopTime');
        this.slashSoundEffect = document.getElementById('slash');
        this.jumpSoundEffect = document.getElementById('jump');
        this.jumpLandingSoundEffect = document.getElementById('jumpLanding');
        this.changeMusic = document.getElementById('changeMusic');
        this.stopMusic = document.getElementById('stopMusic');
        this.lastSongPlayed;
        this.beginMusic = true;
        this.userWantsNoMusic = false;


        // turn it down man that stuff is aggressive
        this.adventureTimeTrack.volume = .3;
        this.sandsOfTimeTrack.volume = .8;
        this.heroOfTimeTrack.volume = .4;
        this.mysteriousTrack.volume = .4;
        this.questionsTrack.volume = .4;
        this.slashSoundEffect.volume = .35;
        this.jumpSoundEffect.volume = .5;
        this.jumpLandingSoundEffect.volume = .3;

        // Developer debug tools
        this.godMode = false;
        this.speedUpMovement = false;
        this.outlineHitBox = false;
        this.stopEnemies = false;

        // debug tool
        // debug tool
        this.frameWidth = 14;
        this.frameHeight = 34;
        this.size = 3;
        this.drawAroundHitBox = false;
        this.originalSpeed = this.speed;

        this.godModeButton = document.getElementById('godMode');
        this.speedUpButton = document.getElementById('speedUp');
        this.outlineHitBoxButton = document.getElementById('outlineHitBox');
        this.stopEnemiesButton = document.getElementById('stopEnemies');

        // Set up all html elements to listeners with actions
        this.handleButtonListeners();
    }

    // Methods ---------------------------------------------------------------------------

    /**
     * Draw
     * 
     * Draw takes in the game context and uses that to define what update does. Be careful
     * not to put code in draw that should go in update. They are hell of bugs to figure
     * out.
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

        // Unsheath your sword!
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
            var raiseUpABit = 100;

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

    /** All changes to blinks state happen here. Draw should not handle those changes
     *  as it could potentially be a hard bug to find. */
    update()
    {
        this.updateBlinksStateFromKeyListeners();

        // Now that the listeners have updated Blinks states, handle those them by
        // appropriating them to the right method calls
        this.handleWhenToHoldSword();
        this.handleWhatToDoWhenSpellcasting();
        this.handleWhatToDoWhenJumping();
        this.handleWhatToDoWhenMoving();
        this.handleWhatToDoWhenAttacking();
        this.handleStartLevel();

        // Temporary helper for keeping blinks inside boundaries of canvas
        // Probably replace when collisions/camera are finalized
        this.handleKeepingBlinkInCanvas();

        // Check if it should be in developer mode
        this.handleDeveloperTools();
    }

    handleStartLevel()
    {
        if (this.levelStarted && this.beginMusic)
        {
            this.changeMusic.click();

            this.levelStarted = false;
            this.beginMusic = false;
        }
    }

    /** Update method helper to update developer modes when needed. */
    handleDeveloperTools()
    {
        if (this.speedUpMovement)
        {
            this.speed = this.originalSpeed * 5;
        }
        if (!this.speedUpMovement)
        {
            this.speed = this.originalSpeed;
        }
        if (this.stopEnemies)
        {
            this.game.devModeStopTime = true;
            this.game.allShouldStop(true);
        }
        if (!this.stopEnemies)
        {
            this.game.devModeStopTime = false;
        }
        if (this.outlineHitBox)
        {
            // this needs updating when collision detecting is in
            this.game.drawAroundSpriteSheet(true);
        }
        if (!this.outlineHitBox)
        {
            // this needs updating when collision detecting is in
            this.game.drawAroundSpriteSheet(false);
        }
    }

    /** Update helper method for keeping Blink in bounds. */
    handleKeepingBlinkInCanvas()
    {
        // TODO - on finish of camera rework this
        // keep in bounds of canvas until camera class is functional
        if (this.x > this.ctx.canvas.width - 150)
        {
            this.x = this.ctx.canvas.width - 150;
            this.moving = false;
        }
        else if (this.x < 0)
        {
            this.x = 0;
            this.moving = false;
        }
    }

    /** Update method helper for when attacking. */
    handleWhatToDoWhenAttacking()
    {
        if (this.basicAttack)
        {
            this.slashSoundEffect.play();
            this.unsheathSword = false;
            this.unsheathSwordStandStill = false;
        }
    }

    /** Update method helper for what to do when moving. */
    handleWhatToDoWhenMoving()
    {
        if (!this.facingRight && this.moving)
        {
            this.x -= this.game.blinksClockTick * this.speed;
        }
        if (this.facingRight && this.moving)
        {
            this.x += this.game.blinksClockTick * this.speed;
        }
    }

    /** Update helper method for what to do when moving. */
    handleWhatToDoWhenJumping()
    {
        // If jumping, use animations elasped time for setting jump to false. This is
        // currently the best way to keep the animation looking sexy.
        if (this.jumping)
        {
            this.unsheathSword = false;

            // handle sounds
            this.jumpSoundEffect.play();

            if (this.jumpFaceRightAnimation.elapsedTime > .9 ||
                this.jumpFaceLeftAnimation.elapsedTime > .9)
            {
                this.jumpLandingSoundEffect.play();
                this.game.jumping = false;
                this.jumping = false;
                this.jumpFaceRightAnimation.elapsedTime = 0;
                this.jumpFaceLeftAnimation.elapsedTime = 0;
            }

            // Manage jumps using the animation classes timer. Need both left/right animation.
            // If facing right and jumping
            if (this.facingRight)
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
            else if (!this.facingRight)
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
        }
    }

    /** Update method helper for what to do when spellcasting. */
    handleWhatToDoWhenSpellcasting()
    {
        // Alert game engine to states
        // stop state update for game engine
        if (this.stopTime)
        {
            this.game.allShouldStop(true);

            this.unsheathSword = false;
            this.unsheathSwordStandStill = false;

            this.adventureTimeTrack.pause();
            this.sandsOfTimeTrack.pause();
            this.heroOfTimeTrack.pause();
            this.mysteriousTrack.pause();
            this.questionsTrack.pause();
            this.stopSoundEffect.play();
        }
        if (!this.stopTime)
        {
            this.game.allShouldStop(false);

            this.stopSoundEffect.pause();

            if ((this.lastSongPlayed != undefined) && !this.userWantsNoMusic)
            {
                this.lastSongPlayed.play();
            }

            this.stopSoundEffect.currentTime = 0;
        }
        // rewind state update for game engine
        if (this.rewindTime)
        {
            this.game.allShouldRewind(true);

            this.unsheathSword = false;
            this.unsheathSwordStandStill = false;

            this.rewindSoundEffect.play();
        }
        if (!this.rewindTime)
        {
            this.game.allShouldRewind(false);

            this.rewindSoundEffect.pause();
            this.rewindSoundEffect.currentTime = 0;
        }
        // slow state update for game engine
        if (this.slowTime)
        {
            this.game.allShouldSlow(true);

            this.unsheathSword = false;
            this.unsheathSwordStandStill = false;

            this.slowSoundEffect.play();
            this.adventureTimeTrack.playbackRate = .5;
        }
        if (!this.slowTime)
        {
            this.game.allShouldSlow(false);

            this.slowSoundEffect.pause();
            this.slowSoundEffect.currentTime = 0;
            this.adventureTimeTrack.playbackRate = 1;
        }
        // speed state update for game engine
        if (this.speedTime)
        {
            this.game.allShouldSpeed(true);

            this.unsheathSword = false;
            this.unsheathSwordStandStill = false;

            this.speedSoundEffect.play();
            //this.levelMusic.playbackRate = 1;
        }
        if (!this.speedTime)
        {
            this.game.allShouldSpeed(false);

            this.speedSoundEffect.pause();
            this.speedSoundEffect.currentTime = 0;
            //this.levelMusic.playbackRate = 1;
        }
    }

    /** Update method helper for holding sword when stationary. */
    handleWhenToHoldSword()
    {
        // Whip it out
        if (this.unsheathSword)
        {
            if (this.swordUnsheath_FaceRight.elapsedTime > 0.7 ||
                this.swordUnsheath_FaceLeft.elapsedTime > 0.7)
            {
                this.unsheathSword = false;
                this.unsheathSwordStandStill = true;
            }
        }

        // If standing still too long, pull out your sword!
        if (this.isStandingStill())
        {
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

        // if Blink starts moving, stop holding the sword
        if (this.isRunning() || this.jumping || this.isSpellcasting())
        {
            this.unsheathSwordStandStill = false;
            this.unsheathSword = false;
        }
    }

    /** Set up listeners and actions for HTML buttons. */
    handleButtonListeners()
    {
        // used to pass in 'this' reference to anonymous function
        var self = this;

        // Handle music buttons
        // Change Tracks
        this.changeMusic.onclick = function ()
        {
            // Set this to let level know music has been started somewhere
            self.beginMusic = false;
            self.userWantsNoMusic = false;

            // This begins at 
            if ((self.lastSongPlayed == self.adventureTimeTrack))
            {
                self.lastSongPlayed = self.sandsOfTimeTrack;
                self.sandsOfTimeTrack.play();
                self.adventureTimeTrack.pause();

                self.sandsOfTimeTrack.currentTime = 0;
            }
            else if ((self.lastSongPlayed == self.sandsOfTimeTrack))
            {
                self.lastSongPlayed = self.heroOfTimeTrack;
                self.heroOfTimeTrack.play();
                self.sandsOfTimeTrack.pause();

                self.adventureTimeTrack.currentTime = 0;
            }
            else if ((self.lastSongPlayed == self.heroOfTimeTrack))
            {
                self.lastSongPlayed = self.mysteriousTrack;
                self.mysteriousTrack.play();
                self.heroOfTimeTrack.pause();

                self.heroOfTimeTrack.currentTime = 0;

            }
            else if ((self.lastSongPlayed == self.mysteriousTrack))
            {
                self.lastSongPlayed = self.questionsTrack;
                self.questionsTrack.play();
                self.mysteriousTrack.pause();

                self.mysteriousTrack.currentTime = 0;
            }
            else if ((self.lastSongPlayed == self.questionsTrack))
            {
                self.lastSongPlayed = self.adventureTimeTrack;
                self.adventureTimeTrack.play();
                self.questionsTrack.pause();

                self.questionsTrack.currentTime = 0;
            }
            else
            {
                self.lastSongPlayed = self.adventureTimeTrack;

                self.adventureTimeTrack.play();
            }
        };
        // Stop music
        this.stopMusic.onclick = function ()
        {
            self.userWantsNoMusic = true;
            self.adventureTimeTrack.pause();
            self.sandsOfTimeTrack.pause();
            self.heroOfTimeTrack.pause();
            self.heroOfTimeTrack.pause();
            self.mysteriousTrack.pause();
            self.questionsTrack.pause();

            self.adventureTimeTrack.currentTime = 0;
            self.sandsOfTimeTrack.currentTime = 0;
            self.heroOfTimeTrack.currentTime = 0;
            self.mysteriousTrack.currentTime = 0;
            self.questionsTrack.currentTime = 0;
        };

        // Handle Developerset buttons
        this.godModeButton.onclick = function ()
        {
            self.godMode = !self.godMode;
        };
        this.speedUpButton.onclick = function ()
        {
            self.speedUpMovement = !self.speedUpMovement;
        };
        this.outlineHitBoxButton.onclick = function ()
        {
            self.outlineHitBox = !self.outlineHitBox;
        };
        this.stopEnemiesButton.onclick = function ()
        {
            self.stopEnemies = !self.stopEnemies;
        };

    }

    /**
    * A couple quick shortcuts on the boolean evaluations for making the code cleaner.
    */
    isSpellcasting()
    {
        return ((this.rewindTime || this.stopTime || this.slowTime || this.speedTime) && !this.moving &&
            !this.jumping && !this.basicAttack && !this.unsheathSword && !this.unsheathSwordStandStill);
    }
    isStandingStill()
    {
        return (!this.moving && !this.basicAttack &&
            !this.jumping && !this.isSpellcasting() && !this.unsheathSword && !this.unsheathSwordStandStill);
    }
    isRunning()
    {
        return (this.moving && !this.jumping && !this.isSpellcasting());
    }

    /** Updates the state booleans for Blinks actions. */
    updateBlinksStateFromKeyListeners()
    {
        // update state based on gameengine key listener update
        // have to check for undefined because the gameengine initially
        // tries to pass in an unitialized value, but we want Blink's constructor 
        // assigns instead.
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
        if (this.game.speedTime !== undefined)
        {
            this.speedTime = this.game.speedTime;
        }
        if (this.game.levelStarted !== undefined)
        {
            this.levelStarted = this.game.levelStarted;
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
            0.12,    // frame duration
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
            0.12,    // frame duration
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
