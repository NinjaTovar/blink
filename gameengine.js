/** 
 * GameEngine is the... game engine of the game world. Acts as the interface between
 * a user and the game world.
 */
class GameEngine
{
    /** 
     *  Initializes fields for the GameEngine. This includes creating an array for the
     *  potential entities that will get loaded into the world, and declaring a game 
     *  context that will eventually get intialized.
     *  
     *  @constructor
     */
    constructor()
    {
        this.entities = [];
        this.ctx = null;
        this.surfaceWidth = null;
        this.surfaceHeight = null;
        this.drawAroundHitBox = false;
        this.devModeStopTime = false;
    }

    /**
     * Initializes the game worlds event listeners and functions for controlling 
     * animation.
     * 
     * @param {any} ctx A reference to the game context.
     */
    init(bottomProjectionContext, middleProjectionContext, gameCtx)
    {
        // initialize game world features. Context, timer, canvas width and height, etc.
        //this.overlayCtx = overlayProjectionContext;
        this.ctx = gameCtx;
        this.middleProjectionCtx = middleProjectionContext;
        this.bottomProjectionCtx = bottomProjectionContext;
        this.surfaceWidth = this.ctx.canvas.width;
        this.surfaceHeight = this.ctx.canvas.height;
        this.timer = new Timer();

        // create a special effects handler
        this.specialEffects = new SpecialEffects(this.bottomProjectionCtx, this.middleProjectionCtx, this.ctx);

        // fields related to Blinks interaction with the game
        this.blinkTimer = new Timer();
        this.timeIsRewinding = false;
        this.timeIsStopped = false;
        this.timeIsSlowed = false;
        this.timeIsSped = false;

        // Set listeners
        this.initializeEventListeners();


        this.declareAndAddAssetsToEntitiesArray();

        console.log('game initialized');
    }

    declareAndAddAssetsToEntitiesArray()
    {
        // Declare Blink
        var blink = new Blink(this);

        // Create and add camera entity when the gameEngine gets initialized
        this.camera = new Camera(blink, this.ctx, 200, 400, this.surfaceWidth, this.surfaceHeight);
        this.addEntity(this.camera);

        // Add background
        this.addEntity(new Background(this));


        // Add Blink
        this.addEntity(blink);

        // Add enemies those little bastards----------------------------------------------

        // Add random number of violator up to 2
        for (var i = 0; i < Randomizer.returnRandomIntBetweenThese(1, 2); i++)
        {
            this.addEntity(new Violator(this, Randomizer.returnRandomIntBetweenThese(500, 3000),
                300, 2.5, Randomizer.returnRandomDirection()));
        }
        // Add random number of mummies up to 4
        for (var i = 0; i < Randomizer.returnRandomIntBetweenThese(1, 5); i++)
        {
            this.addEntity(new Mummy(this, Randomizer.returnRandomInt(this.surfaceWidth),
                440, 2.5, Randomizer.returnRandomDirection()));
        }
        // Add random number of bugs up to 2
        for (var i = 0; i < Randomizer.returnRandomIntBetweenThese(1, 3); i++)
        {
            this.addEntity(new Bug(this, Randomizer.returnRandomInt(this.surfaceWidth),
                440, 2.5, Randomizer.returnRandomDirection()));
        }
        // Add random number of flies up to 5
        for (var i = 0; i < Randomizer.returnRandomIntBetweenThese(2, 5); i++)
        {
            this.addEntity(new FlyMutant(this, Randomizer.returnRandomInt(this.surfaceWidth),
                Randomizer.returnRandomInt(400), Randomizer.returnRandomFloat(.4, 1), Randomizer.returnRandomDirection()));
        }
        // Add random number of metroid up to 3
        for (var i = 0; i < Randomizer.returnRandomIntBetweenThese(1, 4); i++)
        {
            this.addEntity(new Metroid(this, Randomizer.returnRandomIntBetweenThese(500, 3000),
                140, Randomizer.returnRandomFloat(2, 4), Randomizer.returnRandomDirection()));
        }
        // Adding Necroman
        this.addEntity(new Necroman(this, 4200, 140, 5.5));
    }

    /** Starts the game world by getting the loop and callback circle started. */
    start()
    {
        console.log('starting game');
        let that = this;
        (function gameLoop()
        {
            that.loop();
            requestAnimationFrame(gameLoop, that.ctx.canvas);
        })();
    }

    /**
     * The meat and potatoes of the game world. Adds entities to the game.
     * 
     * @param {any} entity An entity such as characters or platforms to bring into the 
     *                     world. Added to the entity[] field in the game and can
     *                     be continually referenced, as all entities have a reference
     *                     to the game.
     */
    addEntity(entity)
    {
        console.log('added entity');
        this.entities.push(entity);
    }

    /** 
     *  Calls all of the entities draw function that have been added to the engines
     *  entity[] array.
     */
    draw()
    {
        // normal draw function for each entity. We didn't make this.
        this.ctx.clearRect(0, 0, this.surfaceWidth, this.surfaceHeight);
        this.ctx.save();
        for (let i = 0; i < this.entities.length; i++)
        {
            this.entities[i].draw(this.ctx);
        }
        this.ctx.restore();

        // Trying to make a debug tool for hit boxes. In Work.
        for (let i = 0; i < this.entities.length; i++)
        {
            if (this.drawAroundHitBox)
            {
                this.entities[i].drawAroundHitBox = !this.entities[i].drawAroundHitBox;
            }
        }

    }

    /** Handles updating the entities world state. */
    update()
    {
        let entitiesCount = this.entities.length;

        for (let i = 0; i < entitiesCount; i++)
        {
            let entity = this.entities[i];

            entity.update();
        }
    }

    /** Keeps the world ticking. */
    loop()
    {
        // everyone's clock tick besides blink
        this.clockTick = this.timer.tick();

        // Blink's clock tick
        this.blinksClockTick = this.blinkTimer.tick();

        // As loop is continuously called, drive the game for all
        this.update();
        this.draw();

        // Cleanup the canvas after spells
        if (this.noSpellsAreActive() && (this.ctx.globalAlpha < 9.8))
        {
            this.specialEffects.cleanupEffects();
        }
    }

    /** Stop game tick for all but Blink. */
    stopGameTime()
    {
        this.clockTick = 0;

        this.specialEffects.prepareCanvasLayersForEffects();

        // Handle effects if Blink is casting a spell
        if (this.timeIsStopped && !this.devModeStopTime)
        {
            this.specialEffects.performStopTimeSpecialEffects();
        }
    }

    /** If Blink casts a spell, stop game tick for all and handle visuals. */
    rewindGameTime()
    {
        this.specialEffects.prepareCanvasLayersForEffects();

        if (this.timeIsRewinding)
        {
            this.specialEffects.performRewindTimeSpecialEffects();
        }
    }

    /** If Blink casts a spell, stop game tick for all and handle visuals. */
    slowGameTime()
    {
        this.clockTick = this.clockTick / 6;
        if (this.timeIsSlowed)
        {
            this.specialEffects.prepareCanvasLayersForEffects();
            this.specialEffects.performSlowTimeSpecialEffects();
        }
    }

    /** If Blink casts a spell, stop game tick for all and handle visuals. */
    speedGameTime()
    {
        this.clockTick = this.clockTick * 6;
        if (this.timeIsSped)
        {
            this.specialEffects.prepareCanvasLayersForEffects();
            this.specialEffects.performSpeedTimeSpecialEffects();
        }
    }


    /**
     * Manages calling all entities rewind functions
     * 
     * @param {any} truthOfThisStatement Alerts game Blink is trying to rewind time.
     */
    allShouldRewind(truthOfThisStatement)
    {
        // let game engine keep track of this too
        this.timeIsRewinding = truthOfThisStatement;

        if (this.timeIsRewinding)
        {
            this.rewindGameTime();
        }

        // call all entities that have a rewind capacity to do so
        let entitiesCount = this.entities.length;
        for (let i = 0; i < entitiesCount; i++)
        {
            this.entities[i].shouldRewind = truthOfThisStatement;
        }
    }

    /**
    * Manages calling all entities stop functions
    * 
    * @param {any} truthOfThisStatement Alerts game Blink is trying to stop time.
    */
    allShouldStop(truthOfThisStatement)
    {
        // let game engine keep track of this too
        this.timeIsStopped = truthOfThisStatement;

        if (this.timeIsStopped)
        {
            this.stopGameTime();
        }
    }

    /**
    * Manages calling all entities slow functions
    * 
    * @param {any} truthOfThisStatement Alerts game Blink is trying to stop time.
    */
    allShouldSlow(truthOfThisStatement)
    {
        // let game engine keep track of this too
        this.timeIsSlowed = truthOfThisStatement;

        if (this.timeIsSlowed)
        {
            this.slowGameTime();
        }
    }

    /**
    * Manages calling all entities slow functions
    * 
    * @param {any} truthOfThisStatement Alerts game Blink is trying to stop time.
    */
    allShouldSpeed(truthOfThisStatement)
    {
        // let game engine keep track of this too
        this.timeIsSped = truthOfThisStatement;

        if (this.timeIsSped)
        {
            this.speedGameTime();
        }
    }

    /** Developer mode tool for debugging. */
    drawAroundSpriteSheet(truthOfThisStatement)
    {
        this.drawAroundHitBox = truthOfThisStatement;
    }

    /** Boolean helper for evaluating game state. */
    noSpellsAreActive()
    {
        return !this.timeIsRewinding && !this.timeIsSlowed && !this.timeIsStopped;
    }

    /** Initializes event listeners for game. */
    initializeEventListeners()
    {
        // use that to refer to other classes use of these listeners
        const that = this;

        // Event Listeners
        this.ctx.canvas.addEventListener(
            'mousedown',
            e =>
            {
                switch (e.button)
                {
                    case 0:
                        that.levelStarted = true;
                        break;
                    default:
                        break;
                }
            },
            false
        );

        // Event Listeners
        this.ctx.canvas.addEventListener(
            'keydown',
            e =>
            {
                switch (e.key)
                {
                    case 'ArrowRight':
                        that.moving = true;
                        that.facingRight = true;
                        break;
                    case 'ArrowLeft':
                        that.moving = true;
                        that.facingRight = false;
                        break;
                    case 'A':   // a is attack
                    case 'a':   // a is attack
                        that.basicAttack = true;
                        break;
                    case 'S':   // s is stop time spell
                    case 's':   // s is stop time spell
                        that.stopTime = true;
                        break;
                    case 'D':   // d is rewind time spell
                    case 'd':   // d is rewind time spell
                        that.rewindTime = true;
                        this.resetPaths = false;
                        break;
                    case 'W':   // w is slow time spell
                    case 'w':   // w is slow time spell
                        that.slowTime = true;
                        break;
                    case 'F':   // F is speed time spell
                    case 'f':   // f is speed time spell
                        that.speedTime = true;
                        break;
                    case ' ':   // spacebar is jump
                        that.jumping = true;
                        break;
                    default:
                        break;
                }
                e.preventDefault();
            },
            false
        );


        this.ctx.canvas.addEventListener(
            'keyup',
            e =>
            {
                switch (e.key)
                {
                    case 'ArrowRight':
                        that.moving = false;
                        break;
                    case 'ArrowLeft':
                        that.moving = false;
                        break;
                    case 'A':
                    case 'a':
                        that.basicAttack = false;
                        break;
                    case 'S':
                    case 's':
                        that.stopTime = false;
                        break;
                    case 'D':
                    case 'd':
                        that.rewindTime = false;
                        that.resetPaths = true;
                        break;
                    case 'W':
                    case 'w':
                        that.slowTime = false;
                        break;
                    case 'F':
                    case 'f':
                        that.speedTime = false;
                        break;
                    default:
                        break;
                }
                e.preventDefault();
            },
            false
        );
    }

}

// This helps discover what type of browser it will be communicating with
window.requestAnimFrame = (function ()
{
    return (
        window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function (callback, element)
        {
            window.setTimeout(callback, 1000 / 60);
        }
    );
})();