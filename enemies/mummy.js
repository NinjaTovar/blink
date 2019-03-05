/*
 * Mummy object. This class handles loading the necessary assets as well as defines
 * the update and draw function.
 *
 * Single constructor takes in the game context as its parameter. (There is no default)
 */
class Mummy extends Entity {
  /**
   * Single constructor for Fly. Loads assets and sets intial parameters including
   * the speed, starting x/y position, etc.
   *
   * @constructor
   * @param {any} game A reference to the game engine.
   * @param {any} startX Starting x position of the fly being constructed.
   * @param {any} startY Starting x position of the fly being constructed.
   * @param {any} size Size of scale for character.
   */
  constructor(game, startX, startY, size, isHeadingRight) {
    super(game, startX, startY);
    this.walkLeftAnimation = new Animation(
      AM.getAsset("./img/enemies/mummy/Mummy_WalkLeft.png"), // load sprite asset
      36, // frame width
      45, // frame height
      5, // sheet width
      0.2, // frame duration
      17, // frames in animation
      true, // to loop or not to loop
      size // scale in relation to original image
    );
    this.walkRightAnimation = new Animation(
      AM.getAsset("./img/enemies/mummy/Mummy_WalkRight.png"),
      36, // frame width
      45, // frame height
      5, // sheet width
      0.2, // frame duration
      17, // frames in animation
      true, // to loop or not to loop
      size // scale in relation to original image
    );
    this.deathAnimation = new Animation(
      AM.getAsset("./img/enemies/mummy/mummyDying.png"),
      40, // frame width
      55, // frame height
      9, // sheet width
      0.4, // frame duration
      9, // frames in animation
      false, // to loop or not to loop
      size // scale in relation to original image
    );

    // Initial world states
    this.x = startX;
    this.y = startY;
    this.speed = 30;
    this.game = game;
    this.ctx = game.ctx;
    this.isHeadingRight = isHeadingRight;

    // set invisible boundaries for enemies path
    this.randomMinBoundary =
      Randomizer.returnRandomInt(this.ctx.canvas.width) / 2;
    this.randomMaxBoundary = Randomizer.returnRandomIntBetweenThese(
      this.randomMinBoundary,
      Randomizer.returnRandomInt(this.ctx.canvas.width)
    );

    // Ensure the enemies boundaries aren't too small
    while (this.randomMaxBoundary - this.randomMinBoundary < 500) {
      this.randomMaxBoundary = Randomizer.returnRandomIntBetweenThese(
        this.randomMinBoundary,
        Randomizer.returnRandomInt(this.ctx.canvas.width)
      );
    }

    // this will be used for rewind
    this.myPath = [];
    this.myPath.push(this.x);
    this.shouldRewind = false;
    this.resetPath = false;

    // debug tool
    this.drawAroundHitBox = false;
    this.frameWidth = 50;
    this.frameHeight = 100;
    this.size = size;
  }

  // Methods

  /**
   * Draw takes in the game context and uses that to define what update does.
   *
   * @param {any} ctx  A reference to the Game Context.
   */
  draw(ctx) {
    // debug tool
    if (this.drawAroundHitBox) {
      // this.drawAroundBox();
      //this.ctx.clearRect(this.x, this.y, this.frameWidth * this.size, this.frameHeight * this.size);
    }

    if (this.health <= 0) {
      this.deathAnimation.drawFrame(this.game.clockTick, ctx, this.x, this.y);
      return;
    }
    // If field "isHeadingRight" is true, play walk right animation
    if (this.isHeadingRight && !this.willRewind()) {
      this.walkRightAnimation.drawFrame(
        this.game.clockTick,
        ctx,
        this.x,
        this.y
      );
    }
    // If field "isHeadingRight" is false, play fly right animation
    else if (!this.isHeadingRight && !this.willRewind()) {
      this.walkLeftAnimation.drawFrame(
        this.game.clockTick,
        ctx,
        this.x,
        this.y
      );
    }

    // If affected by time spell
    if (this.isHeadingRight && this.willRewind() && this.myPath.length > 1) {
      this.x = this.myPath.pop();
      this.walkRightAnimation.drawFrame(
        this.game.clockTick,
        ctx,
        this.x,
        this.y
      );

      if (this.myPath.length == 1) {
        this.shouldRewind = false;
        this.game.shouldRewind = false;
      }
    }
    if (!this.isHeadingRight && this.willRewind() && this.myPath.length > 1) {
      this.x = this.myPath.pop();
      this.walkLeftAnimation.drawFrame(
        this.game.clockTick,
        ctx,
        this.x,
        this.y
      );

      if (this.myPath.length == 1) {
        this.shouldRewind = false;
        this.game.shouldRewind = false;
      }
    }
  }

  /** Update handles updating the objects world state. */
  update() {
    if (this.game.resetPaths != undefined) {
      this.resetPath = this.game.resetPaths;
    }

    if (this.health <= 0) {
      if (this.deathAnimation.elapsedTime > 5) {
        this.isDead = true;
      }
      return;
    }

    // alert mummy to reset the array for path variables
    if (this.resetPath) {
      this.x = this.myPath.pop();

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
      }
    }

    if (this.isHeadingRight) {
      this.x += this.game.clockTick * this.speed;
      if (this.x > this.randomMaxBoundary) {
        this.isHeadingRight = false;
      }
    } else if (!this.isHeadingRight) {
      this.x -= this.game.clockTick * this.speed;
      if (this.x < this.randomMinBoundary) {
        this.isHeadingRight = true;
      }
    }
    this.boundX = this.x;
    this.boundY = this.y;
    this.updateMyHitBoxes();
  }

  // Helper booleans for state
  willRewind() {
    return this.myPath.length > 0 && this.shouldRewind;
  }

  updateMyHitBoxes() {
    if (this.isHeadingRight) {
      this.hitB.width = this.frameWidth;
      this.hitB.height = this.frameHeight;
      this.hitB.boundX = this.boundX + 15;
      this.hitB.boundY = this.boundY;
    } else {
      this.hitB.width = this.frameWidth;
      this.hitB.height = this.frameHeight;
      this.hitB.boundX = this.boundX + 24;
      this.hitB.boundY = this.boundY;
    }
  }
}
