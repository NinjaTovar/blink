/**
 * Entity object. Handles adding 'entities' to the game world, which usually represent
 * a variety of in world objects such as characters, platforms, etc. that may be
 * interacted with both directly and indirectly.
 *
 */
class Entity
{
    /**
     * Creates an instance of an entity and adds it to the game world.
     *
     * @constructor
     * @param {any} game A reference to the game engine.
     * @param {any} x The x coordinate for the entity to be loaded in reference to the
     *                game world.
     * @param {any} y The y coordinate for the entity to be loaded in reference to the
     *                game world.
     *
     * @param {any} removed Indicates whether the entity has been removed from world and
     *                      should be updated
     */
    constructor(game, x, y)
    {
        this.game = game;
        this.ctx = this.game.ctx;
        this.x = x;
        this.y = y;
        this.boundX = this.x;
        this.boundY = this.y;
        this.damage = 5;
        this.health = 100;
        this.currentHealth = this.health;
        this.isDead = false;
        this.hitB = new Hitbox(
            this.game,
            this.boundX,
            this.boundY,
            this.frameWidth,
            this.frameHeight,
            "damage"
        );

        // REWIND FIELDS--------------------------------
        this.myPath = [];
        this.myPath.push(this.x);
        this.myVerticalPath = [];
        this.myVerticalPath.push(this.y);
        this.shouldRewind = false;
        this.resetPath = false;

        // ENEMY SOUND EFFECTS--------------------------

        // Keeps track of playing death sound effect so it doesn't repeat on dying
        this.playedDeathSound = false;

        // Enemy Injured Sounds
        this.guyHurtSoundEffect1 = document.getElementById("guyHurt1");
        this.guyHurtSoundEffect2 = document.getElementById("guyHurt2");
        this.flyHurtSoundEffect = document.getElementById("flyHurt");
        this.mummyHurtSoundEffect = document.getElementById("mummyHurt");
        this.necromanInjuredSoundEffect = document.getElementById("necromanInjured");
        this.violatorInjured = document.getElementById("violatorInjured");
        this.guyHurtSoundEffect1.volume = .5;
        this.flyHurtSoundEffect.volume = .5;
        this.guyHurtSoundEffect2.volume = .5;
        this.mummyHurtSoundEffect.volume = .5;
        this.necromanInjuredSoundEffect.volume = .5;
        this.violatorInjured.volume = .5;

        // Enemy death sounds
        this.flyDeathSoundEffect = document.getElementById("flyDeath");
        this.necromanDeathSoundEffect = document.getElementById("necromanDeath");
        this.violatorDeathSoundEffect = document.getElementById("violatorDeath");
        this.bugDeathSoundEffect = document.getElementById("bugDeath");
        this.mummyDeathSoundEffect = document.getElementById("mummyDeath");
        this.flyDeathSoundEffect.volume = .5;
        this.necromanDeathSoundEffect.volume = .5;
        this.violatorDeathSoundEffect.volume = .5;
        this.bugDeathSoundEffect.volume = .5;
        this.mummyDeathSoundEffect.volume = .5;

        // Make an array of sounds for randomizing what an entity has for injured sound
        this.injuredSounds = [];
        this.injuredSounds.push(this.guyHurtSoundEffect1); //0
        this.injuredSounds.push(this.flyHurtSoundEffect);  //1
        this.injuredSounds.push(this.guyHurtSoundEffect2); //2
        this.injuredSounds.push(this.guyHurtSoundEffect3); //3
        this.injuredSounds.push(this.mummyHurtSoundEffect); //4
        this.injuredSounds.push(this.necromanInjuredSoundEffect); //5
        this.injuredSounds.push(this.violatorInjured);  //6
        // Make an array of sounds for randomizing what an entity has for injured sound
        this.deathSounds = [];
        this.deathSounds.push(this.flyDeathSoundEffect); //0
        this.deathSounds.push(this.necromanDeathSoundEffect); //1
        this.deathSounds.push(this.violatorDeathSoundEffect); //2
        this.deathSounds.push(this.bugDeathSoundEffect); //3
        this.deathSounds.push(this.mummyDeathSoundEffect); //4

        if (this instanceof Mummy)
        {
            this.myInjuredSound = this.injuredSounds[4];
            this.myDeathSound = this.deathSounds[4];
        }
        else if (this instanceof Soldier)
        {
            this.myInjuredSound = this.injuredSounds[0];
            this.myDeathSound = this.injuredSounds[2];
        }
        else if (this instanceof Metroid)
        {
            this.myInjuredSound = this.injuredSounds[1];
            this.myDeathSound = this.deathSounds[0];
        }
        else if (this instanceof Violator)
        {
            this.myInjuredSound = this.injuredSounds[6];
            this.myDeathSound = this.deathSounds[2];
        }
        else if (this instanceof Bug)
        {
            this.myInjuredSound = this.injuredSounds[1];
            this.myDeathSound = this.deathSounds[3];
        }
        else if (this instanceof FlyMutant)
        {
            this.myInjuredSound = this.injuredSounds[1];
            this.myDeathSound = this.deathSounds[0];
        }
        else if (this instanceof Necroman)
        {
            this.myInjuredSound = this.injuredSounds[5];
            this.myDeathSound = this.deathSounds[1];
        }
    }

    /** Update handles updating the objects world state. */
    update()
    {
        // Handle recoil when struck by Blink
        this.handleGettingHitByBlink();

        // Handle subclasses rewinding
        this.handleRewind();

        // Calls each entity subclasses update method
        this.subClassUpdate();
    }

    /**
     * Draws the entity within the game world.
     *
     * @param {any} ctx A reference to the game context.
     */
    draw(ctx)
    {
        if (this.game.showOutlines && this.radius)
        {
            this.game.ctx.beginPath();
            this.game.ctx.strokeStyle = "green";
            this.game.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
            this.game.ctx.stroke();
            this.game.ctx.closePath();
        }
    }

    /**
     *
     * @param {any} image Reference image for the canvas. (maybe ?)
     * @param {any} angle Angle for the projection of entity in the game world. (maybe ?)
     * @returns offscreenCanvas A reference to the game canvas used for projecting the
     *                          game world. (maybe ?)
     */
    rotateAndCache(image, angle)
    {
        let offscreenCanvas = document.createElement("canvas");
        let size = Math.max(image.width, image.height);
        offscreenCanvas.width = size;
        offscreenCanvas.height = size;
        let offscreenCtx = offscreenCanvas.getContext("2d");
        offscreenCtx.save();
        offscreenCtx.translate(size / 2, size / 2);
        offscreenCtx.rotate(angle);
        offscreenCtx.translate(0, 0);
        offscreenCtx.drawImage(image, -(image.width / 2), -(image.height / 2));
        offscreenCtx.restore();
        return offscreenCanvas;
    }

    // Basic collision detection to see if two entites are touching
    // using rectangles

    // debug tool, draws rectangle around entity on screen
    drawAroundBox()
    {
        this.ctx.beginPath();
        this.ctx.strokeStyle = "white";
        this.ctx.rect(
            this.hitB.boundX,
            this.hitB.boundY,
            this.hitB.width,
            this.hitB.height
        );
        this.ctx.stroke();
    }

    // Implement this method when Enity is inherited
    handleCollison(other, type) { }

    // Updates Hit Boxes
    updateMyHitBoxes()
    {
        this.hitB.width = this.frameWidth;
        this.hitB.height = this.frameHeight;
        this.hitB.boundX = this.boundX;
        this.hitB.boundY = this.boundY;
    }

    // Helper booleans for state
    willRewind()
    {
        return this.myPath.length > 0 && this.shouldRewind;
    }

    // HANDLE COLLISION RECOIL------------------------------------------------------------
    handleGettingHitByBlink()
    {
        // If one of the non-enemy entities, don't play injured sounds
        if (this instanceof Bullet || this instanceof Clock || this instanceof Vegeta ||
            this instanceof Vegeta2)
        {
            return;
        }
        // make enemies recoil when hit
        if (this.health > 10)
        {
            // If the health has changed since last check
            if (this.currentHealth !== this.health)
            {
                // reset this check
                this.currentHealth = this.health;

                // And recoil the enemy depending on direction facing
                if (this.game.blink.facingRight)
                {
                    if (!(this instanceof Blink))
                    {
                        // If dash cut move less so blink can dash through
                        if (!this.game.blink.moving)
                        {
                            this.x += 15;
                        } else
                        {
                            this.x += 5;
                        }

                        // Play this entities random injury sound
                        if (!(this instanceof Fireball))
                        {
                            this.myInjuredSound.play();
                        }

                    }
                } else if (!this.game.blink.facingRight)
                {
                    if (!(this instanceof Blink))
                    {
                        if (!this.game.blink.moving)
                        {
                            this.x -= 15;
                        } else
                        {
                            this.x -= 5;
                        }

                        // Play this entities random injury sound
                        if (!(this instanceof Fireball))
                        {
                            this.myInjuredSound.play();
                        }
                    }
                }
            }
        }
        else if (this.health < 10 && !this.playedDeathSound)
        {
            this.myDeathSound.play();
            this.playedDeathSound = true;
        }
    }

    // REWIND FOR ALL SUBCLASSES------------------------------------------------------
    handleRewind()
    {
        if (this.game.resetPaths != undefined)
        {
            this.resetPath = this.game.resetPaths;
        }
        if (this.resetPath)
        {
            this.x = this.myPath.pop();
            this.y = this.myVerticalPath.pop();

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
            if (
                Math.abs(
                    Math.abs(this.x) - Math.abs(this.myPath[this.myPath.length - 1])
                ) > 0.3
            )
            {
                this.myPath.push(this.x);
                this.myVerticalPath.push(this.y);
            }
        }
    }
}
