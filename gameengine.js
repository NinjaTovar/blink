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
    }

    /**
     * Initializes the game worlds event listeners and functions for controlling 
     * animation.
     * 
     * @param {any} ctx A reference to the game context.
     * @param {any} blink A reference to blink
     */
    init(ctx, blink)
    {
        // initialize game world features. Context, timer, canvas width and height, etc.
        this.ctx = ctx;
        this.surfaceWidth = this.ctx.canvas.width;
        this.surfaceHeight = this.ctx.canvas.height;
        this.timer = new Timer();

        // Create and add blink and camera entities when the gameEngine gets initialized
        // Not sure if this is the best way to go about it but it this for now.
        this.blink = new Blink(this);
        this.camera = new Camera(this.blink, ctx, 100, 400, 800, 800);
        this.addEntity(this.camera);
        this.addEntity(this.blink);

        console.log('game initialized');
        const that = this;

        // Event Listeners
        this.ctx.canvas.addEventListener(
            'keydown',
            e =>
            {
                console.log(e.key);
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
                    case 'a':   // a is attack
                        that.basicAttack = true;
                        break;
                    case 's':   // s is stop time spell
                        that.stopTime = true;
                        break;
                    case 'd':   // s is rewind time spell
                        that.rewindTime = true;
                        break;
                    case ' ':   // spacebar is jump
                        that.jumping = true;
                        console.log('JUMPED');
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
                    case 'a':
                        that.basicAttack = false;
                        break;
                    case 's':  
                        that.stopTime = false;
                        break;
                    case 'd':   
                        that.rewindTime = false;
                        break;
                    default:
                        break;
                }
                e.preventDefault();
            },
            false
        );
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
        this.ctx.clearRect(0, 0, this.surfaceWidth, this.surfaceHeight);
        this.ctx.save();
        for (let i = 0; i < this.entities.length; i++)
        {
            this.entities[i].draw(this.ctx);
        }
        this.ctx.restore();
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
        this.clockTick = this.timer.tick();
        this.update();
        this.draw();

        // If Blink cast a spell, slowly fade screen transparency back
        if (this.ctx.globalAlpha < 1)
        {
            this.ctx.globalAlpha += .009;
        }
    }

    // If Blink casts a spell, stop game tick for all.
    stopTickLoop()
    {
        this.clockTick = 0;
        this.ctx.globalAlpha = .3;
        console.log(this.entities);
    }

    allShouldRewind(truthOfThisStatement)
    {
        let entitiesCount = this.entities.length;

        for (let i = 0; i < entitiesCount; i++)
        {
            this.entities[i].shouldRewind = truthOfThisStatement;
        }
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