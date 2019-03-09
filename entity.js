/**
 * Entity object. Handles adding 'entities' to the game world, which usually represent
 * a variety of in world objects such as characters, platforms, etc. that may be
 * interacted with both directly and indirectly.
 *
 */
class Entity {
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
  constructor(game, x, y) {
    this.game = game;
    this.ctx = this.game.ctx;
    this.x = x;
    this.y = y;
    this.boundX = this.x;
    this.boundY = this.y;
    this.damage = 5;
    this.health = 800;
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

    // this will be used for rewind
    this.myPath = [];
    this.myPath.push(this.x);
    this.myVerticalPath = [];
    this.myVerticalPath.push(this.y);
    this.shouldRewind = false;
    this.resetPath = false;

    // Enemy Sounds
    this.enemyInjuredSoundEffect = document.getElementById("enemyHurt");
  }

  /** Update handles updating the objects world state. */
  update() {
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
  draw(ctx) {
    if (this.game.showOutlines && this.radius) {
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
  rotateAndCache(image, angle) {
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
    //offscreenCtx.strokeStyle = 'red';
    //offscreenCtx.strokeRect(0,0,size,size);
    return offscreenCanvas;
  }

  // Basic collision detection to see if two entites are touching
  // using rectangles

  // debug tool, draws rectangle around entity on screen
  drawAroundBox() {
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
  handleCollison(other, type) {}

  updateMyHitBoxes() {
    this.hitB.width = this.frameWidth;
    this.hitB.height = this.frameHeight;
    this.hitB.boundX = this.boundX;
    this.hitB.boundY = this.boundY;
  }

  // Helper booleans for state
  willRewind() {
    return this.myPath.length > 0 && this.shouldRewind;
  }

  // HANDLE COLLISION RECOIL------------------------------------------------------------
  handleGettingHitByBlink() {
    if (this instanceof Bullet) {
      return;
    }
    // make enemies recoil when hit
    if (this.health > 10) {
      // If the health has changed since last check
      if (this.currentHealth !== this.health) {
        // reset this check
        this.currentHealth = this.health;

        // And recoil the enemy depending on direction facing
        if (this.game.blink.facingRight) {
          if (!(this instanceof Blink)) {
            // If dash cut move less so blink can dash through
            if (!this.game.blink.moving) {
              this.x += 15;
            } else {
              this.x += 5;
            }

            this.enemyInjuredSoundEffect.play();
          }
        } else if (!this.game.blink.facingRight) {
          if (!(this instanceof Blink)) {
            if (!this.game.blink.moving) {
              this.x -= 15;
            } else {
              this.x -= 5;
            }

            this.enemyInjuredSoundEffect.play();
          }
        }
      }
    }
  }

  // REWIND FOR ALL SUBCLASSES------------------------------------------------------
  handleRewind() {
    if (this.game.resetPaths != undefined) {
      this.resetPath = this.game.resetPaths;
    }
    if (this.resetPath) {
      this.x = this.myPath.pop();
      this.y = this.myVerticalPath.pop();

      console.log("Rewind path is reset");

      this.resetPath = false;
      this.game.resetPaths = false;
    }
    if (this.myPath.length == 1) {
      this.shouldRewind = false;
      this.game.shouldRewind = false;
    }
    // If not under rewind spell
    if (!this.shouldRewind) {
      // save current x coordinates if difference from previous coordinate is at
      // least one third pixel
      if (
        Math.abs(
          Math.abs(this.x) - Math.abs(this.myPath[this.myPath.length - 1])
        ) > 0.3
      ) {
        this.myPath.push(this.x);
        this.myVerticalPath.push(this.y);
      }
    }
  }
}
