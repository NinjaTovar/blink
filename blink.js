/*
 * Blink object. This class handles loading the necessary assets as well as defines
 * the update and draw function.
 *
 * Single constructor takes in the game context as its parameter.
 *
 */
class Blink extends Entity {
    /**
     * Single constructor for blink. Loads assets and sets intial parameters including
     * the speed, starting x/y position, jump height, etc.
     *
     * @constructor
     * @param {any} game A reference to the game engine.
     */
    constructor(game) {
        super(game, 50, 450);
        this.canBeatBoss = false;

        // Way at bottom to clean up class constructor. There 's a ton!
        this.loadAllBlinksAssets();

        // Play unsheath sword animation to start
        this.unsheathSword = true;
        this.unsheathSwordStandStill = false;

        // Set initial values for Blinks world state
        this.x = 100;
        this.y = -100;
        this.startingX = this.x;
        this.startingY = this.y;
        this.groundLevel = this.y;
        this.startingGroundLevel = 300;
        this.minX = 2000;
        this.maxX = 0;
        this.platformY = null;
        this.lastY = this.y;
        this.speed = 275;
        this.game = game;
        this.ctx = game.ctx;
        this.gotHit = false;
        this.health = 1000;
        this.energy = 1000;
        this.falling = false;
        this.myPlatforms = [];
        this.level = 1;

        // What are these and what do they do?
        this.attackBox = new Hitbox(
            game,
            this.boundX + 10,
            this.boundY + 10,
            20,
            20,
            "attack"
        );
        this.platformBox = new Hitbox(
            game,
            this.boundX + 10,
            this.boundY + 10,
            60,
            60,
            "platform"
        );

        // Initialize a jump timer. These fields are mostly if not all used in the
        // "handleWhatToDoWhenJumping()" function
        this.jumpHeight = 500;
        this.totalTimeForJump = 0.96;
        this.jumpTimer = new Timer();
        this.elapsedJumpTime = 0;
        this.jumpSlashSoundPlayed = false;

        // key listener states
        this.moving = false;
        this.basicAttack = false;
        this.facingRight = true;
        this.jumping = false;
        this.stopTime = false;
        this.rewindTime = false;
        this.slowTime = false;
        this.speedTime = false;
        this.levelStarted = false;
        this.dontRestartLevel = false;

        // Music and Sounds
        this.adventureTimeTrack = document.getElementById("adventureTimeTrack");
        this.sandsOfTimeTrack = document.getElementById("sandsOfTimeTrack");
        this.heroOfTimeTrack = document.getElementById("heroOfTimeTrack");
        this.mysteriousTrack = document.getElementById("mysteriousTrack");
        this.questionsTrack = document.getElementById("questionsTrack");
        this.slowSoundEffect = document.getElementById("slowTime");
        this.speedSoundEffect = document.getElementById("speedTime");
        this.rewindSoundEffect = document.getElementById("rewindTime");
        this.stopSoundEffect = document.getElementById("stopTime");
        this.specialRefillSoundEffect = document.getElementById("specialRefill");
        this.slashSoundEffect = document.getElementById("slash");
        this.dashSlashSoundEffect = document.getElementById("dashSlash");
        this.jumpSoundEffect = document.getElementById("jump");
        this.jumpLandingSoundEffect = document.getElementById("jumpLanding");
        this.damageSoundEffects = [
            document.getElementById("damage1"),
            document.getElementById("damage2"),
            document.getElementById("damage3")
        ];
        this.damageSoundEffect = null;
        this.changeMusic = document.getElementById("changeMusic");
        this.stopMusic = document.getElementById("stopMusic");
        this.lastSongPlayed;
        this.beginMusic = true;
        this.userWantsNoMusic = false;

        // turn it down man that stuff is aggressive
        this.adventureTimeTrack.volume = 0.3;
        this.sandsOfTimeTrack.volume = 0.8;
        this.heroOfTimeTrack.volume = 0.4;
        this.mysteriousTrack.volume = 0.4;
        this.questionsTrack.volume = 0.4;
        this.slashSoundEffect.volume = 0.35;
        this.jumpSoundEffect.volume = 0.5;
        this.jumpLandingSoundEffect.volume = 0.3;

        // Developer debug tools
        this.godMode = false;
        this.speedUpMovement = false;
        this.outlineHitBox = false;
        this.stopEnemies = false;

        // Debug tools and collision detection fields
        this.frameWidth = 35;
        this.frameHeight = 80;
        this.size = 3;
        this.drawAroundHitBox = false;
        this.originalSpeed = this.speed;
        this.wallCollision = false;
        this.xBeforeCollision = this.x;

        // Load states of HTML page debug buttons
        this.godModeButton = document.getElementById("godMode");
        this.speedUpButton = document.getElementById("speedUp");
        this.outlineHitBoxButton = document.getElementById("outlineHitBox");
        this.stopEnemiesButton = document.getElementById("stopEnemies");

        // LEVEL MANAGER
        this.levelOneButton = document.getElementById("levelOne");
        this.levelTwoButton = document.getElementById("levelTwo");
        this.levelThreeButton = document.getElementById("levelThree");
        this.levelFourButton = document.getElementById("levelFour");

        // Set up all html elements to listeners with actions
        this.handleButtonListeners();
    }

    // ************************************   DRAW   *************************************
    /**
     * Draw takes in the game context and uses that to define what update does. Be careful
     * not to put code in draw that should go in update. They are hell of bugs to figure
     * out.
     *
     * @param {any} ctx  A reference to the Game Context.
     */
    // ************************************   DRAW   *************************************
    draw(ctx) {

        // DEBUG TOOL HIT BOX-------------------------------------------------------------
        if (this.drawAroundHitBox) {
            this.attackBox.drawHitBox();
            this.hitB.drawHitBox();
            this.platformBox.drawHitBox();
        }

        // DEATH--------------------------------------------------------------------------
        if (this.health <= 0) {
            this.dead.drawFrame(this.game.blinksClockTick, ctx, this.x, this.y + 30);
            return;
        }

        // FALLING------------------------------------------------------------------------
        if (this.falling) {
            if (this.facingRight) {
                this.fall.drawFrame(this.game.blinksClockTick, ctx, this.x, this.y);
            } else {
                this.fall.drawFrame(this.game.blinksClockTick, ctx, this.x, this.y);
            }
            return;
        }

        // GOT HIT------------------------------------------------------------------------
        if (this.gotHit) {
            if (this.facingRight) {
                this.hitFacingRight.drawFrame(
                    this.game.blinksClockTick,
                    ctx,
                    this.x,
                    this.y
                );
            } else {
                this.hitFacingLeft.drawFrame(
                    this.game.blinksClockTick,
                    ctx,
                    this.x,
                    this.y
                );
            }
            return;
        }

        // UNSHEATH SWORD-----------------------------------------------------------------
        if (this.unsheathSword) {
            // Unsheath your sword animation facing left or right
            if (this.facingRight) {
                this.swordUnsheath_FaceRight.drawFrame(
                    this.game.blinksClockTick,
                    ctx,
                    this.x,
                    this.y
                );
            } else {
                this.swordUnsheath_FaceLeft.drawFrame(
                    this.game.blinksClockTick,
                    ctx,
                    this.x,
                    this.y
                );
            }
        }
        // Once unsheath animation is done, play a still of last frame.
        if (this.unsheathSwordStandStill) {
            if (this.facingRight) {
                this.atTheReady_FaceRight.drawFrame(
                    this.game.blinksClockTick,
                    ctx,
                    this.x,
                    this.y
                );
            } else {
                this.atTheReady_FaceLeft.drawFrame(
                    this.game.blinksClockTick,
                    ctx,
                    this.x,
                    this.y
                );
            }
        }

        // STANDING-----------------------------------------------------------------------
        if (this.isStandingStill()) {
            // if standing still face right or left depending on last state
            if (this.facingRight) {
                this.standRightAnimation.drawFrame(
                    this.game.blinksClockTick,
                    ctx,
                    this.x,
                    this.y
                );
            } else if (!this.facingRight) {
                this.standLeftAnimation.drawFrame(
                    this.game.blinksClockTick,
                    ctx,
                    this.x,
                    this.y
                );
            }

            //this.frameWidth = this.standRightAnimation.frameWidth;
            //this.frameHeight = this.standRightAnimation.frameHeight;
        }
        // JUMPING------------------------------------------------------------------------
        if (this.jumping) {
            if (!this.basicAttack) {
                // If jumping and attacking, jump attack animation left or right
                if (!this.facingRight) {
                    this.jumpFaceLeftAnimation.drawFrame(
                        this.game.blinksClockTick,
                        ctx,
                        this.x,
                        this.y
                    );
                } else if (this.facingRight) {
                    this.jumpFaceRightAnimation.drawFrame(
                        this.game.blinksClockTick,
                        ctx,
                        this.x,
                        this.y
                    );
                }

                //this.frameWidth = this.jumpFaceRightAnimation.frameWidth;
                //this.frameHeight = this.jumpFaceRightAnimation.frameHeight;
            }
            // JUMP ATTACK----------------------------------------------------------------
            else {
                // if NOT attacking but jumping, play jump animation facing left/right
                if (!this.facingRight) {
                    this.jumpAttackFaceLeft.drawFrame(
                        this.game.blinksClockTick,
                        ctx,
                        this.x,
                        this.y
                    );
                } else if (this.facingRight) {
                    this.jumpAttackFaceRight.drawFrame(
                        this.game.blinksClockTick,
                        ctx,
                        this.x,
                        this.y
                    );
                }

                //this.frameWidth = this.jumpAttackFaceRight.frameWidth;
                //this.frameHeight = this.jumpAttackFaceRight.frameHeight;
            }
        }

        // ATTACKING----------------------------------------------------------------------
        if (this.basicAttack && !this.jumping) {
            if (!this.moving) {
                // basic attack left or right depending on direction
                if (!this.facingRight) {
                    this.y = this.y - 40; // fix his attack frames that jump a bit
                    this.slashFaceLeft.drawFrame(
                        this.game.blinksClockTick,
                        ctx,
                        this.x,
                        this.y
                    );
                } else if (this.facingRight) {
                    this.y = this.y - 40; // fix his attack frames that jump a bit
                    this.slashFaceRight.drawFrame(
                        this.game.blinksClockTick,
                        ctx,
                        this.x,
                        this.y
                    );
                }
            } else {
                // basic attack left or right depending on direction
                if (!this.facingRight) {
                    this.y = this.y - 40; // fix his attack frames that jump a bit
                    this.dashSlashFaceLeft.drawFrame(
                        this.game.blinksClockTick,
                        ctx,
                        this.x,
                        this.y
                    );
                } else if (this.facingRight) {
                    this.y = this.y - 40; // fix his attack frames that jump a bit
                    this.dashSlashFaceRight.drawFrame(
                        this.game.blinksClockTick,
                        ctx,
                        this.x,
                        this.y
                    );
                }
            }
        }
        // RUNNING------------------------------------------------------------------------
        if (this.isRunning()) {
            // if facing left and moving, run left animation
            if (!this.facingRight) {
                this.runFaceLeftAnimation.drawFrame(
                    this.game.blinksClockTick,
                    ctx,
                    this.x,
                    this.y
                );
            }
            // if facing right and moving, run right animation
            else if (this.moving && !this.jumping) {
                this.runFaceRightAnimation.drawFrame(
                    this.game.blinksClockTick,
                    ctx,
                    this.x,
                    this.y
                );
            }
        }
        // SPELLCASTING-------------------------------------------------------------------
        if (this.isSpellcasting()) {
            var raiseUpABit = 100;

            // If rewinding time
            if (!this.facingRight) {
                this.spellFaceLeft.drawFrame(
                    this.game.blinksClockTick,
                    ctx,
                    this.x,
                    this.y - raiseUpABit
                );
            } else if (this.facingRight) {
                this.spellFaceRight.drawFrame(
                    this.game.blinksClockTick,
                    ctx,
                    this.x,
                    this.y - raiseUpABit
                );
            }
        }
    }

    // **********************************   UPDATE  **************************************
    /** All changes to blinks state happen here. Draw should not handle those changes
     *  as it could potentially be a hard bug to find. */
    // **********************************   UPDATE  **************************************
    update() {
        // If not jumping, make sure Blink is on the ground level/And Or on his platform
        if (!this.jumping) {
            if (this.currentPlatform != null && this.platformY != null) {
                this.y = this.platformY;
            } else {

                // bring him down to earth if neccessary
                this.falling = true;
                this.y += this.game.blinksClockTick * this.speed * 2.5;
            }
        }

        if (this.damageSoundEffect == null || this.isStandingStill()) {
            this.damageSoundEffect = this.damageSoundEffects[
                Math.floor(Math.random() * this.damageSoundEffects.length)
            ];
        }

        if (this.myPlatforms.length > 0 && this.fellOff()) {
            console.log("Cleared myPlatforms[]");
            this.maxX = -10;
            this.minX = 20000;
            this.myPlatforms.length = 0;
            this.currentPlatform = null;
        }
        this.updateBlinksStateFromKeyListeners();

        // Now that the listeners have updated Blinks states, handle those them by
        // appropriating them to the right method calls
        this.updateMyHitBoxes();
        this.handleWhenToHoldSword();
        this.handleWhatToDoWhenSpellcasting();
        this.handleWhatToDoWhenJumping();
        this.handleWhatToDoWhenMoving();
        this.handleWhatToDoWhenAttacking();
        this.handleStartLevel();
        this.handleBlinkGettingInjured();

        // Temporary helper for keeping blinks inside boundaries of canvas
        // Probably replace when collisions/camera are finalized
        this.handleKeepingBlinkInCanvas();

        // Check if it should be in developer mode
        this.handleDeveloperTools();

        this.boundX = this.x + -5;
        this.boundY = this.y + 0;
    }

    // HANDLE LEVEL MUSIC ON START--------------------------------------------------------
    /** Handles starting music. Can't autoplay without level interaction due to Chrome's
     * aggressive rules.
     */
    handleStartLevel() {
        if (this.levelStarted && this.beginMusic) {
            this.changeMusic.click();

            this.levelStarted = false;
            this.beginMusic = false;
        }
    }

    //Handle collisons
    handleCollison(other, type) {
        if (other instanceof Vegeta || other instanceof Vegeta2) {
            other.blinkTouchedMe = true;
        }
        // console.log("Blink has collided with a " + other.constructor.name);
        if (type === "attack" && this.basicAttack && !this.gotHit) {
            other.health -= 5;
            other.gettingHit = true;
            if (other.health <= 0 && !(other instanceof Mummy)) {
                other.isDead = true;
            }

            if (Math.random() >= 0.7 && Math.random() > 0.9) {
                this.game.addEntity(
                    new Clock(this.game, other.x + Math.floor(Math.random() * 44), other.y)
                );
            }
        }
        if (other instanceof Clock && type === "damage") {
            if (this.energy < 1000) {
                this.energy += 100;
            }

            this.specialRefillSoundEffect.play();
            other.health = -1;
            other.isDead = true;
            return;
        }
        if (other instanceof Platform && type !== "attack") {
            // console.log("Collided with platform");
            // If blink is on top of the platform, make him land on it

            if (this.y < other.y - other.frameHeight) {
                if (!this.myPlatforms.includes(other)) {
                    let width = 0;
                    if (this.level == 2) {
                        width = 0;
                    } else if (this.level == 3) {
                        width = other.width;
                    }
                    if (other.x + width > this.maxX) this.maxX = other.x + width;
                    if (other.x < this.minX) this.minX = other.x;
                    this.myPlatforms.push(other);
                    this.game.jumping = false;

                    this.jumping = false;
                    this.falling = false;
                    this.elapsedJumpTime = 0;
                    this.jumpFaceRightAnimation.elapsedTime = 0;
                    this.jumpFaceLeftAnimation.elapsedTime = 0;
                }

                // other.addEntity(this); // Blink to that Platform
                this.currentPlatform = this.myPlatforms[this.myPlatforms.length - 1];

                this.platformY =
                    this.currentPlatform.y -
                    this.currentPlatform.height -
                    this.frameHeight;
                if (this.level == 3) {
                    this.platformY += 45;
                }


                this.y = this.platformY;
                this.groundLevel = this.platformY;
                this.falling = false;

                //in work wall detection
                if (this.x <= this.xBeforeCollision && this.facingRight) {
                    this.wallCollision = false;
                }
                // in work wall detection
                if (this.x >= this.xBeforeCollision && !this.facingRight) {
                    this.wallCollision = false;
                }
            } else {
                // in work wall detection
                if (!this.wallCollision && this.facingRight) {
                    this.xBeforeCollision = this.x - 10;
                    this.x = this.xBeforeCollision;
                } else if (!this.wallCollision && !this.facingRight) {
                    this.xBeforeCollision = this.x + 10;
                    this.x = this.xBeforeCollision;
                }
                this.wallCollision = true;

                console.log("Blink y less than platform or 'other' y.");

                this.jumping = false;
                this.falling = true;
                this.elapsedJumpTime = 0;
                this.jumpFaceRightAnimation.elapsedTime = 0;
                this.jumpFaceLeftAnimation.elapsedTime = 0;
            }
            // If Blink is not attacking, it means he just got hit by an Enemy .. atleast for now
            // TODO: Maybe Come back and make this cleaner so that Blink gets hit based on collison distance
        }

        if (
            type === "damage" &&
            other.health > 0 &&
            !(other instanceof Platform) &&
            !this.basicAttack &&
            !(other instanceof Vegeta || other instanceof Vegeta2)
        ) {
            this.gotHit = true;

            // Only decrease health when hit if GodMode button is not enabled
            if (!this.godMode) {
                this.health -= 2;
            }

            if (other.x > this.x) {
                // console.log("hit from the right");
                this.hitFromRight = true;
            } else {
                // console.log("hit from the Left");
                this.hitFromLeft = true;
            }
        }
    }

    // HANDLE BLINK GETTING HIT----------------------------------------------------------
    handleBlinkGettingInjured() {
        if (this.gotHit) {
            if (
                this.hitFacingLeft.elapsedTime > .34 ||
                this.hitFacingRight.elapsedTime > .34
            ) {
                this.hitFacingLeft.elapsedTime = 0;
                this.hitFacingRight.elapsedTime = 0;
                this.gotHit = false;
                this.hitFromLeft = false;
                this.hitFromRight = false;
            } else {
                this.damageSoundEffect.play();
            }
            if (this.hitFromRight) {
                this.x -= 4;
            } else {
                this.x += 4;
            }
        }
    }

    // HANDLE DEV TOOLS-------------------------------------------------------------------
    /** Update method helper to update developer modes when needed. */
    handleDeveloperTools() {
        if (this.speedUpMovement) {
            this.speed = this.originalSpeed * 5;
        }
        if (!this.speedUpMovement) {
            this.speed = this.originalSpeed;
        }
        if (this.stopEnemies) {
            this.game.devModeStopTime = true;
            this.game.allShouldStop(true);
        }
        if (!this.stopEnemies) {
            this.game.devModeStopTime = false;
        }
        if (this.outlineHitBox) {
            // this needs updating when collision detecting is in
            this.game.drawAroundSpriteSheet(true);
        }
        if (!this.outlineHitBox) {
            // this needs updating when collision detecting is in
            this.game.drawAroundSpriteSheet(false);
        }
    }

    // HANDLE UPDATE ON CANVAS BOUNDARIES-------------------------------------------------
    /** Update helper method for keeping Blink in bounds. */
    handleKeepingBlinkInCanvas() {
        // TODO - on finish of camera rework this
        // keep in bounds of canvas until camera class is functional
        if (this.x > this.game.camera.mapWidth - 100) {
            this.x = this.game.camera.mapWidth - 100;
            this.moving = false;
        } else if (this.x < 0) {
            this.x = 0;
            this.moving = false;
        }
    }

    // HANDLE UPDATE WHEN ATTACKING-------------------------------------------------------
    /** Update method helper for when attacking. */
    handleWhatToDoWhenAttacking() {
        // If attack (but not jump attacking)
        if (this.basicAttack && !this.isJumpAttacking()) {
            // play slash sounds and reset sword unsheathing animation booleans
            if (
                this.dashSlashFaceRight.currentFrame() === 1 ||
                this.dashSlashFaceRight.currentFrame() === 2 ||
                this.dashSlashFaceLeft.currentFrame() === 1 ||
                this.dashSlashFaceLeft.currentFrame() === 2
            ) {
                this.dashSlashSoundEffect.play();
            } else if (
                this.slashFaceRight.currentFrame() === 1 ||
                this.slashFaceLeft.currentFrame() === 1
            ) {
                this.slashSoundEffect.play();
            }

            this.unsheathSword = false;
            this.unsheathSwordStandStill = false;

            // If in the dash part of the attack animation, shift x position to emulate dash
            if (this.facingRight && this.dashSlashFaceRight.currentFrame() === 1) {
                this.x += 30;
            } else if (!this.facingRight && this.dashSlashFaceLeft.currentFrame() === 1) {
                this.x -= 30;
            }
        }
        if (!this.basicAttack) {
            // if not attacking, mak sure to reset the slash sound so it sounds right
            // on next attack
            this.jumpSlashSoundPlayed = false;
            this.slashSoundEffect.pause();
            this.slashSoundEffect.currentTime = 0;
            this.dashSlashSoundEffect.pause();
            this.dashSlashSoundEffect.currentTime = 0;
            this.dashSlashFaceRight.elapsedTime = 0;
            this.slashFaceLeft.elapsedTime = 0;
            this.slashFaceRight.elapsedTime = 0;
            this.slashFaceLeft.elapsedTime = 0;
        }
    }

    // HANDLE UPDATE ON MOVING------------------------------------------------------------
    /** Update method helper for what to do when moving. */
    handleWhatToDoWhenMoving() {

        if (!this.facingRight && this.isRunning()) {
            this.x -= this.game.blinksClockTick * this.speed;
        }
        if (this.facingRight && this.isRunning()) {
            this.x += this.game.blinksClockTick * this.speed;
        }



    }

    // HANDLE UPDATE ON JUMPING-----------------------------------------------------------
    /** Update helper method for what to do when jumping. */
    handleWhatToDoWhenJumping() {
        // If jumping, use animations elasped time for setting jump to false. This is
        // currently the best way to keep the animation looking sexy.
        if (this.gotHit) return;
        if (this.jumping || this.isJumpAttacking()) {
            // put that sword away boi
            this.unsheathSword = false;

            // play jump sound
            this.jumpSoundEffect.play();

            if (this.elapsedJumpTime < 0.9) {
                this.elapsedJumpTime += this.jumpTimer.tick();

                if (!this.jumpSlashSoundPlayed && this.isJumpAttacking()) {
                    this.slashSoundEffect.play();
                    this.jumpSlashSoundPlayed = true;
                }
            } else {
                // play landing sound
                this.jumpLandingSoundEffect.play();
                this.jumpSlashSoundPlayed = false; // reset so jump attack sound can play
                this.game.jumping = false;
                this.jumping = false;
                this.elapsedJumpTime = 0;
                this.jumpFaceRightAnimation.elapsedTime = 0;
                this.jumpFaceLeftAnimation.elapsedTime = 0;
            }

            var height = 0;
            var duration = this.elapsedJumpTime + this.game.blinksClockTick;
            if (duration > this.totalTimeForJump / 2)
                duration = this.totalTimeForJump - duration;
            duration = duration / this.totalTimeForJump;

            // quadratic jump
            height = (2 * duration - 2 * duration * duration) * this.jumpHeight;

            this.y = this.platformY - height;

            // Manage both left/right jumps movement acceleration
            if (this.moving) {
                // double x speed during jump if moving
                if (this.facingRight) {
                    this.x += 2 * this.game.blinksClockTick * this.speed;
                } else if (!this.facingRight) {
                    this.x -= 2 * this.game.blinksClockTick * this.speed;
                }
            }
        }
    }

    updateMyHitBoxes() {
        this.hitB.width = this.frameWidth;
        this.hitB.height = this.frameHeight;
        this.hitB.boundX = this.boundX + 10;
        this.hitB.boundY = this.boundY;

        this.platformBox.width = 20;
        this.platformBox.height = 100;
        this.platformBox.boundX = this.boundX + 20;
        this.platformBox.boundY = this.boundY;

        if (this.jumping && this.facingRight) {
            // this.platformBox.boundX = this.boundX + 30;
        }
        if (this.facingRight) {
            this.attackBox.width = 40;
            this.attackBox.height = 90;
            this.attackBox.boundX = this.boundX + 60;
            this.attackBox.boundY = this.boundY + 10;
        } else {
            this.platformBox.boundX = this.boundX + 20;
            this.attackBox.width = 40;
            this.attackBox.height = 90;
            this.attackBox.boundX = this.boundX - 20;
            this.attackBox.boundY = this.boundY + 10;
        }
    }

    // HANDLE UPDATE ON SPELLCASTING------------------------------------------------------
    /**
     *  Update method helper for what to do when spellcasting. Handles all music
     *  as well as alerting the gameengine, which in turn alerts all entities to call
     *  their individual responses to Blink's spell casting.
     */
    handleWhatToDoWhenSpellcasting() {
        if (this.energy > 0) {
            // STOP TIME**********************************************************************
            if (this.stopTime) {
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
            if (!this.stopTime) {
                this.game.allShouldStop(false);

                this.stopSoundEffect.pause();

                if (this.lastSongPlayed != undefined && !this.userWantsNoMusic) {
                    this.lastSongPlayed.play();
                }

                this.stopSoundEffect.currentTime = 0;
            }
            // REWIND TIME********************************************************************
            if (this.rewindTime) {
                this.game.allShouldRewind(true);

                this.unsheathSword = false;
                this.unsheathSwordStandStill = false;

                this.rewindSoundEffect.play();
            }
            if (!this.rewindTime) {
                this.game.allShouldRewind(false);

                this.rewindSoundEffect.pause();
                this.rewindSoundEffect.currentTime = 0;
            }
            // SLOW TIME**********************************************************************
            if (this.slowTime) {
                this.game.allShouldSlow(true);

                this.unsheathSword = false;
                this.unsheathSwordStandStill = false;

                this.slowSoundEffect.play();

                if (this.lastSongPlayed !== undefined) {
                    this.lastSongPlayed.playbackRate = 0.5;
                }
            }
            if (!this.slowTime) {
                this.game.allShouldSlow(false);

                this.slowSoundEffect.pause();
                this.slowSoundEffect.currentTime = 0;

                if (this.lastSongPlayed !== undefined) {
                    this.lastSongPlayed.playbackRate = 1;
                }
            }
            // SPEED TIME*****************************************************************
            if (this.speedTime) {
                this.game.allShouldSpeed(true);

                this.unsheathSword = false;
                this.unsheathSwordStandStill = false;

                this.speedSoundEffect.play();
            }
            if (!this.speedTime) {
                this.game.allShouldSpeed(false);

                this.speedSoundEffect.pause();
                this.speedSoundEffect.currentTime = 0;
            }

            // USE ENERGY FOR SPELLS******************************************************
            if (this.isSpellcasting() && this.energy > 0 && !this.godMode) {
                this.energy -= 5;
            }
        } else {
            this.game.specialEffects.cleanupEffects();
        }
    }

    // HANDLE UPDATE ON SWORD HANDLING----------------------------------------------------
    /**
     *  Update method helper for holding sword when stationary. Generally acts as a
     *  timeout function.
     */
    handleWhenToHoldSword() {
        // After the animation of unsheathing sword is done playing in ~.7 seconds,
        // switch state to false so the animation freezes on the last frame.
        if (this.unsheathSword) {
            if (
                this.swordUnsheath_FaceRight.elapsedTime > 0.7 ||
                this.swordUnsheath_FaceLeft.elapsedTime > 0.7
            ) {
                this.unsheathSword = false;
                this.unsheathSwordStandStill = true;

                //this.frameWidth = this.atTheReady_FaceRight.frameWidth;
                //this.frameHeight = this.atTheReady_FaceRight.frameHeight;
            }
        }

        // If idle for too long, take sword back out and look super badass
        if (this.isStandingStill()) {
            // If longer than two seconds, do it
            if (
                this.standLeftAnimation.elapsedTime > 2 ||
                this.standRightAnimation.elapsedTime > 2
            ) {
                this.swordUnsheath_FaceLeft.elapsedTime = 0;
                this.swordUnsheath_FaceRight.elapsedTime = 0;
                this.standLeftAnimation.elapsedTime = 0;
                this.standRightAnimation.elapsedTime = 0;
                this.unsheathSword = true;
            }
        }

        // if Blink starts moving, stop holding the sword
        if (this.isRunning() || this.jumping || this.isSpellcasting()) {
            this.unsheathSwordStandStill = false;
            this.unsheathSword = false;
        }
    }

    // HANDLE SETTING UP HTML BUTTON REFERENCES AND ACTIONS-------------------------------
    /**
     *  Set up listeners and actions for HTML buttons.
     */
    handleButtonListeners() {
        // used to pass in 'this' reference to anonymous function
        var self = this;

        // HANDLE MUSIC TRACKS************************************************************
        this.changeMusic.onclick = function () {
            // Set this to let level know music has been started somewhere
            self.beginMusic = false;
            self.userWantsNoMusic = false;

            /**
             *  Adventure song is first, but it is actually the last 'else' in this
             *  conditional list. Try and add songs to the end as you go for consistency.
             *
             *  Procedure is: Was this song played? If so, pause it, reset it's current
             *  timer so it replays from beginning next time, play the next song in the
             *  list and set it as the last song played (used during stop time power).
             */
            if (self.lastSongPlayed == self.adventureTimeTrack) {
                self.adventureTimeTrack.pause();
                self.adventureTimeTrack.currentTime = 0;

                self.sandsOfTimeTrack.play();
                self.lastSongPlayed = self.sandsOfTimeTrack;
            } else if (self.lastSongPlayed == self.sandsOfTimeTrack) {
                self.sandsOfTimeTrack.pause();
                self.sandsOfTimeTrack.currentTime = 0;

                self.heroOfTimeTrack.play();
                self.lastSongPlayed = self.heroOfTimeTrack;
            } else if (self.lastSongPlayed == self.heroOfTimeTrack) {
                self.heroOfTimeTrack.pause();
                self.heroOfTimeTrack.currentTime = 0;

                self.mysteriousTrack.play();
                self.lastSongPlayed = self.mysteriousTrack;
            } else if (self.lastSongPlayed == self.mysteriousTrack) {
                self.mysteriousTrack.pause();
                self.mysteriousTrack.currentTime = 0;

                self.questionsTrack.play();
                self.lastSongPlayed = self.questionsTrack;
            } else if (self.lastSongPlayed == self.questionsTrack) {
                self.questionsTrack.pause();
                self.questionsTrack.currentTime = 0;

                self.adventureTimeTrack.play();
                self.lastSongPlayed = self.adventureTimeTrack;
            } else {
                self.adventureTimeTrack.play();
                self.lastSongPlayed = self.adventureTimeTrack;
            }
        };
        // STOP MUSIC*********************************************************************
        this.stopMusic.onclick = function () {
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

        // HANDLE DEV BUTTONS*************************************************************
        this.godModeButton.onclick = function () {
            self.godMode = !self.godMode;
        };
        this.speedUpButton.onclick = function () {
            self.speedUpMovement = !self.speedUpMovement;
        };
        this.outlineHitBoxButton.onclick = function () {
            self.outlineHitBox = !self.outlineHitBox;
        };
        this.stopEnemiesButton.onclick = function () {
            self.stopEnemies = !self.stopEnemies;
        };

        // HANDLE LEVEL MANAGER BUTTONS***************************************************
        this.levelOneButton.onclick = function () {
            console.log("Level One clicked");
            self.game.levelManager.level = 1;
            self.game.levelManager.states.loadNextLevel = true;
        };
        this.levelTwoButton.onclick = function () {
            console.log("Level Two clicked");
            self.game.levelManager.level = 2;
            self.game.levelManager.states.loadNextLevel = true;
        };
        this.levelThreeButton.onclick = function () {
            console.log("Level Three clicked");
            self.game.levelManager.level = 3;
            self.game.levelManager.states.loadNextLevel = true;
        };
        this.levelFourButton.onclick = function () {
            console.log("Level Four clicked");
            self.game.levelManager.level = 4;
            self.game.levelManager.states.loadNextLevel = true;
        };


    }

    /**
     * Boolean evaluations for Blink's state. Necessary shortcuts as these get out of
     * control somewhat.
     */
    isSpellcasting() {
        return (
            (this.rewindTime || this.stopTime || this.slowTime || this.speedTime) &&
            !this.moving &&
            !this.jumping &&
            !this.basicAttack &&
            !this.unsheathSword &&
            !this.unsheathSwordStandStill &&
            this.energy > 0

        );
    }
    isStandingStill() {
        return (
            !this.moving &&
            !this.basicAttack &&
            !this.jumping &&
            !this.isSpellcasting() &&
            !this.unsheathSword &&
            !this.unsheathSwordStandStill &&
            !this.gotHit
        );
    }
    isRunning() {
        return (
            this.moving &&
            !this.jumping &&
            !this.basicAttack &&
            !this.isSpellcasting() &&
            !this.gotHit
        );
    }
    isJumpAttacking() {
        return this.jumping && this.basicAttack;
    }

    /**
     * Handle some random jump math.
     *
     */
    returnTheJumpTime() {
        return;
    }

    /** Updates the state booleans for Blinks actions. */
    updateBlinksStateFromKeyListeners() {
        // update state based on gameengine key listener update
        // have to check for undefined because the gameengine initially
        // tries to pass in an unitialized value, but we want Blink's constructor
        // assignments instead.
        if (this.game.slowTime !== undefined) {
            this.slowTime = this.game.slowTime;
        }
        if (this.game.facingRight !== undefined) {
            this.facingRight = this.game.facingRight;
        }
        if (this.game.moving !== undefined) {
            this.moving = this.game.moving;
        }
        if (this.game.basicAttack !== undefined) {
            this.basicAttack = this.game.basicAttack;
        }
        if (this.game.jumping !== undefined && !this.falling) {
            this.jumping = this.game.jumping;
        }
        if (this.game.stopTime !== undefined) {
            this.stopTime = this.game.stopTime;
        }
        if (this.game.rewindTime !== undefined) {
            this.rewindTime = this.game.rewindTime;
        }
        if (this.game.speedTime !== undefined) {
            this.speedTime = this.game.speedTime;
        }
        if (this.game.levelStarted !== undefined) {
            this.levelStarted = this.game.levelStarted;
        }
    }

    /** Evaluate if Blink has fallen off of a platform. */
    fellOff() {
        if (
            this.x > this.maxX ||
            this.x < this.minX - 50 ||
            this.y < this.myPlatforms[this.myPlatforms.length - 1].y - 200
        ) {
            return true;
        } else {
            return false;
        }
    }

    /** Load all animations. */
    loadAllBlinksAssets() {
        // Load all assets for character first. There's quite a few.
        this.swordUnsheath_FaceLeft = new Animation(
            AM.getAsset("./img/blink/Crono_PullSwordOut_FaceLeft.png"),
            30, // frame width
            32, // frame height
            3, // sheet width
            0.2, // frame duration
            6, // frames in animation
            true, // to loop or not to loop
            3 // scale in relation to original image
        );
        this.swordUnsheath_FaceRight = new Animation(
            AM.getAsset("./img/blink/Crono_PullSwordOut_FaceRight.png"),
            30, // frame width
            32, // frame height
            3, // sheet width
            0.2, // frame duration
            6, // frames in animation
            true, // to loop or not to loop
            3 // scale in relation to original image
        );
        this.atTheReady_FaceLeft = new Animation(
            AM.getAsset("./img/blink/Crono_PullSwordOut_FaceLeft_Still.png"),
            30, // frame width
            32, // frame height
            1, // sheet width
            0.2, // frame duration
            1, // frames in animation
            true, // to loop or not to loop
            3 // scale in relation to original image
        );
        this.atTheReady_FaceRight = new Animation(
            AM.getAsset("./img/blink/Crono_PullSwordOut_FaceRight_Still.png"),
            30, // frame width
            32, // frame height
            1, // sheet width
            0.2, // frame duration
            1, // frames in animation
            true, // to loop or not to loop
            3 // scale in relation to original image
        );
        this.standLeftAnimation = new Animation(
            AM.getAsset("./img/blink/Crono_Stand_FaceLeft.png"),
            14, // frame width
            34, // frame height
            3, // sheet width
            0.8, // frame duration
            3, // frames in animation
            true, // to loop or not to loop
            3 // scale in relation to original image
        );
        this.standRightAnimation = new Animation(
            AM.getAsset("./img/blink/Crono_Stand_FaceRight.png"),
            14, // frame width
            34, // frame height
            3, // sheet width
            0.8, // frame duration
            3, // frames in animation
            true, // to loop or not to loop
            3 // scale in relation to original image
        );
        this.runFaceLeftAnimation = new Animation(
            AM.getAsset("./img/blink/Crono_Run_FaceLeft.png"),
            22, // frame width
            34, // frame height
            3, // sheet width
            0.1, // frame duration
            6, // frames in animation
            true, // to loop or not to loop
            3 // scale in relation to original image
        );
        this.runFaceRightAnimation = new Animation(
            AM.getAsset("./img/blink/Crono_Run_FaceRight.png"),
            22, // frame width
            34, // frame height
            3, // sheet width
            0.1, // frame duration
            6, // frames in animation
            true, // to loop or not to loop
            3 // scale in relation to original image
        );
        this.jumpAttackFaceLeft = new Animation(
            AM.getAsset("./img/blink/Crono_JumpSlash_FaceLeft.png"),
            24, // frame width
            39, // frame height
            1, // sheet width
            0.9, // frame duration
            1, // frames in animation
            true, // to loop or not to loop
            3 // scale in relation to original image
        );
        this.jumpAttackFaceRight = new Animation(
            AM.getAsset("./img/blink/Crono_JumpSlash_FaceRight.png"),
            24, // frame width
            39, // frame height
            1, // sheet width
            0.9, // frame duration
            1, // frames in animation
            true, // to loop or not to loop
            3 // scale in relation to original image
        );
        this.slashFaceLeft = new Animation(
            AM.getAsset("./img/blink/Crono_Slash_FaceLeft.png"),
            30.7, // frame width
            48.2, // frame height
            2, // sheet width
            0.13, // frame duration
            3, // frames in animation
            true, // to loop or not to loop
            3 // scale in relation to original image
        );
        this.slashFaceRight = new Animation(
            AM.getAsset("./img/blink/Crono_Slash_FaceRight.png"),
            31, // frame width
            48.2, // frame height
            2, // sheet width
            0.13, // frame duration
            3, // frames in animation
            true, // to loop or not to loop
            3 // scale in relation to original image
        );
        this.dashSlashFaceLeft = new Animation(
            AM.getAsset("./img/blink/Crono_DashSlash_FaceLeft.png"),
            42.7, // frame width
            49.3, // frame height
            3, // sheet width
            0.13, // frame duration
            6, // frames in animation
            true, // to loop or not to loop
            3 // scale in relation to original image
        );
        this.dashSlashFaceRight = new Animation(
            AM.getAsset("./img/blink/Crono_DashSlash_FaceRight.png"),
            44, // frame width
            49.3, // frame height
            3, // sheet width
            0.13, // frame duration
            6, // frames in animation
            true, // to loop or not to loop
            3 // scale in relation to original image
        );
        this.jumpFaceLeftAnimation = new Animation(
            AM.getAsset("./img/blink/Crono_Jump_FaceLeft.png"),
            39, // frame width
            42, // frame height
            3, // sheet width
            0.12, // frame duration
            8, // frames in animation
            true, // to loop or not to loop
            3 // scale in relation to original image
        );
        this.jumpFaceRightAnimation = new Animation(
            AM.getAsset("./img/blink/Crono_Jump_FaceRight.png"),
            39, // frame width
            42, // frame height
            3, // sheet width
            0.12, // frame duration
            8, // frames in animation
            true, // to loop or not to loop
            3 // scale in relation to original image
        );
        this.spellFaceLeft = new Animation(
            AM.getAsset("./img/blink/Crono_Spell_FaceLeft.png"),
            21, // frame width
            39, // frame height
            2, // sheet width
            0.4, // frame duration
            3, // frames in animation
            true, // to loop or not to loop
            3 // scale in relation to original image
        );
        this.spellFaceRight = new Animation(
            AM.getAsset("./img/blink/Crono_Spell_FaceRight.png"),
            21, // frame width
            39, // frame height
            2, // sheet width
            0.4, // frame duration
            3, // frames in animation
            true, // to loop or not to loop
            3 // scale in relation to original image
        );

        this.hitFacingLeft = new Animation(
            AM.getAsset("./img/blink/Crono_Damage_FaceLeft.png"),
            30, // frame width
            39, // frame height
            6, // sheet width
            0.06, // frame duration
            6, // frames in animation
            true, // to loop or not to loop
            3 // scale in relation to original image
        );
        this.hitFacingRight = new Animation(
            AM.getAsset("./img/blink/Crono_Damage_FaceRight.png"),
            30, // frame width
            39, // frame height
            6, // sheet width
            0.06, // frame duration
            6, // frames in animation
            true, // to loop or not to loop
            3 // scale in relation to original image
        );

        this.dead = new Animation(
            AM.getAsset("./img/blink/Crono_dead.png"),
            35, // frame width
            35, // frame height
            1, // sheet width
            0.8, // frame duration
            1, // frames in animation
            true, // to loop or not to loop
            3 // scale in relation to original image
        );
        this.fallFaceRight = new Animation(
            AM.getAsset("./img/blink/Crono_Fall_FaceRight.png"),
            40, // frame width
            40, // frame height
            3, // sheet width
            0.8, // frame duration
            3, // frames in animation
            true, // to loop or not to loop
            3 // scale in relation to original image
        );
        this.fall = new Animation(
            AM.getAsset("./img/blink/Crono_Falling.png"),
            20, // frame width
            35, // frame height
            1, // sheet width
            0.8, // frame duration
            1, // frames in animation
            true, // to loop or not to loop
            3 // scale in relation to original image
        );
    }
}