/**
 * GameEngine is the... game engine of the game world. Acts as the interface between
 * a user and the game world.
 */
class GameEngine {
  /**
   *  Initializes fields for the GameEngine. This includes creating an array for the
   *  potential entities that will get loaded into the world, and declaring a game
   *  context that will eventually get intialized.
   *
   *  @constructor
   */
  constructor() {
    this.entities = [];
    this.ctx = null;
    this.canvasWidth = null;
    this.canvasHeight = null;
    this.drawAroundHitBox = false;
    this.devModeStopTime = false;
  }

  /**
   * Initializes the game worlds event listeners and functions for controlling
   * animation.
   *
   * @param {any} ctx A reference to the game context.
   */
  init(
    bottomProjectionContext,
    middleProjectionContext,
    gameCtx,
    assetManager
  ) {
    // initialize game world features. Context, timer, canvas width and height, etc.
    //this.overlayCtx = overlayProjectionContext;
    this.ctx = gameCtx;
    this.middleProjectionCtx = middleProjectionContext;
    this.bottomProjectionCtx = bottomProjectionContext;
    this.AM = assetManager;
    this.canvasWidth = this.ctx.canvas.width;
    this.canvasHeight = this.ctx.canvas.height;
    this.timer = new Timer();

    // create a special effects handler, passing in multiple canvas' for effects
    this.specialEffects = new SpecialEffects(
      this.bottomProjectionCtx,
      this.middleProjectionCtx,
      this.ctx
    );

    // fields related to Blinks interaction with the game
    this.blinkTimer = new Timer();
    this.timeIsRewinding = false;
    this.timeIsStopped = false;
    this.timeIsSlowed = false;
    this.timeIsSped = false;

    // Set listeners
    this.initializeEventListeners();
    // Create camera as an instance field
    this.camera = new Camera(
      this,
      this.ctx,
      0,
      0,
      this.canvasWidth,
      this.canvasHeight
    );
    // Create blink as an instance field
    this.blink = new Blink(this);
    // Have to follow after the camera has been created first
    this.camera.follow(this.blink);

    // Game Hud
    this.hud = new Hud(this);

    // Initialize and add the level manager entity, all entities besides
    // itself are added by the levelManager
    this.levelManager = new LevelManager(this, this.ctx, this.AM);
    this.addEntity(this.levelManager);

    console.log("game initialized");
  }

  // Placeholder
  declareAndAddAssetsToEntitiesArray() {
    // may need this
  }

  /** Starts the game world by getting the loop and callback circle started. */
  start() {
    console.log("starting game");
    let that = this;
    (function gameLoop() {
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
  addEntity(entity) {
    console.log("added entity");
    if (entity instanceof Blink) {
      this.blink = entity;
    }
    this.entities.push(entity);
  }

  /**
   *  Calls all of the entities draw function that have been added to the engines
   *  entity[] array.
   */
  draw() {
    // normal draw function for each entity. We didn't make this.
    this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
    this.ctx.save();
    for (let i = 0; i < this.entities.length; i++) {
      this.entities[i].draw(this.ctx);
    }
    this.ctx.restore();

    // Trying to make a debug tool for hit boxes. In Work.
    for (let i = 0; i < this.entities.length; i++) {
      if (this.drawAroundHitBox) {
        this.entities[i].drawAroundHitBox = !this.entities[i].drawAroundHitBox;
      }
    }
  }

  /** Handles updating the entities world state. */
  update() {
    let entitiesCount = this.entities.length;

    for (let i = 0; i < entitiesCount; i++) {
      let entity = this.entities[i];
      if (entity) {
        if (entity.isDead) {
          this.entities.splice(i, 1);
        } else if (this.levelManager.states.levelLoaded) {
          entity.update();
        }
      }
    }

    this.checkBlinksCollisons();
  }

  /** Keeps the world ticking. */
  loop() {
    // everyone's clock tick besides blink
    this.clockTick = this.timer.tick();

    // Blink's clock tick
    this.blinksClockTick = this.blinkTimer.tick();

    // As loop is continuously called, drive the game for all
    this.update();
    this.draw();

    // Cleanup the canvas after spells
    if (this.noSpellsAreActive() && this.ctx.globalAlpha < 9.8) {
      this.specialEffects.cleanupEffects();
    }
  }

  // BLINKS SPELLS ARE BEING CAST ------------------------------------------------------
  /** Stop game tick for all but Blink. */
  stopGameTime() {
    this.clockTick = 0;

    this.specialEffects.prepareCanvasLayersForEffects();

    // Handle effects if Blink is casting a spell
    if (this.timeIsStopped && !this.devModeStopTime) {
      this.specialEffects.performStopTimeSpecialEffects();
    }
  }

  /** If Blink casts a spell, stop game tick for all and handle visuals. */
  rewindGameTime() {
    this.specialEffects.prepareCanvasLayersForEffects();

    if (this.timeIsRewinding) {
      this.specialEffects.performRewindTimeSpecialEffects();
    }
  }

  /** If Blink casts a spell, stop game tick for all and handle visuals. */
  slowGameTime() {
    this.clockTick = this.clockTick / 6;
    if (this.timeIsSlowed) {
      this.specialEffects.prepareCanvasLayersForEffects();
      this.specialEffects.performSlowTimeSpecialEffects();
    }
  }

  /** If Blink casts a spell, stop game tick for all and handle visuals. */
  speedGameTime() {
    this.clockTick = this.clockTick * 6;
    if (this.timeIsSped) {
      this.specialEffects.prepareCanvasLayersForEffects();
      this.specialEffects.performSpeedTimeSpecialEffects();
    }
  }
  // END BLINK CASTING SPELLS-----------------------------------------------------------

  // BLINK UPDATING THE GAME ENGINE THAT HE IS/ISN'T CASTING A SPELL--------------------
  /**
   * Manages calling all entities rewind functions
   *
   * @param {any} truthOfThisStatement Alerts game Blink is trying to rewind time.
   */
  allShouldRewind(truthOfThisStatement) {
    // let game engine keep track of this too
    this.timeIsRewinding = truthOfThisStatement;

    if (this.timeIsRewinding) {
      this.rewindGameTime();
    }

    // call all entities that have a rewind capacity to do so
    let entitiesCount = this.entities.length;
    for (let i = 0; i < entitiesCount; i++) {
      this.entities[i].shouldRewind = truthOfThisStatement;
    }
  }

  /**
   * Manages calling all entities stop functions
   *
   * @param {any} truthOfThisStatement Alerts game Blink is trying to stop time.
   */
  allShouldStop(truthOfThisStatement) {
    // let game engine keep track of this too
    this.timeIsStopped = truthOfThisStatement;

    if (this.timeIsStopped) {
      this.stopGameTime();
    }
  }

  /**
   * Manages calling all entities slow functions
   *
   * @param {any} truthOfThisStatement Alerts game Blink is trying to stop time.
   */
  allShouldSlow(truthOfThisStatement) {
    // let game engine keep track of this too
    this.timeIsSlowed = truthOfThisStatement;

    if (this.timeIsSlowed) {
      this.slowGameTime();
    }
  }

  /**
   * Manages calling all entities slow functions
   *
   * @param {any} truthOfThisStatement Alerts game Blink is trying to stop time.
   */
  allShouldSpeed(truthOfThisStatement) {
    // let game engine keep track of this too
    this.timeIsSped = truthOfThisStatement;

    if (this.timeIsSped) {
      this.speedGameTime();
    }
  }
  // Check if Blink has run into one of the other Enemies
  checkBlinksCollisons() {
    for (let j = 0; j < this.entities.length; j++) {
      let other = this.entities[j];
      if (other instanceof Bullet && this.blink.hitB.collision(other.hitB)) {
        other.handleCollison(other, "damage");
      }
      if (
        other instanceof Platform &&
        this.blink.platformBox.collision(other.hitB)
      ) {
        this.blink.handleCollison(other, "platform");
      }
      if (
        other instanceof Entity &&
        !(other instanceof Blink) &&
        !(other instanceof Platform)
      ) {
        if (this.blink.hitB.collision(other.hitB)) {
          this.blink.handleCollison(other, "damage");
        }

        if (
          this.blink.attackBox.collision(other.hitB) &&
          !(other instanceof Platform)
        ) {
          this.blink.handleCollison(other, "attack");
        }
      }
    }
  }
  // END OF BLINK GAME UPDATES----------------------------------------------------------

  /** Developer mode tool for debugging. */
  drawAroundSpriteSheet(truthOfThisStatement) {
    this.drawAroundHitBox = truthOfThisStatement;
  }

  /** Boolean helper for evaluating game state. */
  noSpellsAreActive() {
    return !this.timeIsRewinding && !this.timeIsSlowed && !this.timeIsStopped;
  }

  /** Initializes event listeners for game. */
  initializeEventListeners() {
    // use that to refer to other classes use of these listeners
    const that = this;

    // Event Listeners
    this.ctx.canvas.addEventListener(
      "mousedown",
      e => {
        switch (e.button) {
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
      "keydown",
      e => {
        switch (e.key) {
          case "ArrowRight":
            that.moving = true;
            that.facingRight = true;
            break;
          case "ArrowLeft":
            that.moving = true;
            that.facingRight = false;
            break;
          case "A": // a is attack
          case "a": // a is attack
            that.basicAttack = true;
            break;
          case "S": // s is stop time spell
          case "s": // s is stop time spell
            that.stopTime = true;
            break;
          case "D": // d is rewind time spell
          case "d": // d is rewind time spell
            that.rewindTime = true;
            this.resetPaths = false;
            break;
          case "W": // w is slow time spell
          case "w": // w is slow time spell
            that.slowTime = true;
            break;
          case "F": // F is speed time spell
          case "f": // f is speed time spell
            that.speedTime = true;
            break;
          case " ": // spacebar is jump
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
      "keyup",
      e => {
        switch (e.key) {
          case "ArrowRight":
            that.moving = false;
            break;
          case "ArrowLeft":
            that.moving = false;
            break;
          case "A":
          case "a":
            that.basicAttack = false;
            break;
          case "S":
          case "s":
            that.stopTime = false;
            break;
          case "D":
          case "d":
            that.rewindTime = false;
            that.resetPaths = true;
            break;
          case "W":
          case "w":
            that.slowTime = false;
            break;
          case "F":
          case "f":
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
window.requestAnimFrame = (function() {
  return (
    window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function(callback, element) {
      window.setTimeout(callback, 1000 / 60);
    }
  );
})();
