/*
 * FlyMutant object. This class handles loading the necessary assets as well as defines
 * the update and draw function.
 *
 * Single constructor takes in the game context as its parameter. (There is no default)
 */
class Bug extends Entity {
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
    this.runLeftAnimation = new Animation(
      AM.getAsset("./img/enemies/bug/BugRun_FaceLeft.png"),
      53, // frame width
      54, // frame height
      2, // sheet width
      0.1, // frame duration
      5, // frames in animation
      true, // to loop or not to loop
      size // scale in relation to original image
    );
    this.runRightAnimation = new Animation(
      AM.getAsset("./img/enemies/bug/BugRun_FaceRight.png"),
      53, // frame width
      54, // frame height
      2, // sheet width
      0.1, // frame duration
      5, // frames in animation
      true, // to loop or not to loop
      size // scale in relation to original image
    );
    this.hitFaceLeftAnimation = new Animation(
      AM.getAsset("./img/enemies/bug/ButHit_FaceLeft.png"),
      55, // frame width
      55, // frame height
      3, // sheet width
      0.1, // frame duration
      3, // frames in animation
      true, // to loop or not to loop
      size // scale in relation to original image
    );

    this.hitFaceRightAnimation = new Animation(
      AM.getAsset("./img/enemies/bug/ButHit_FaceRight.png"),
      55, // frame width
      55, // frame height
      3, // sheet width
      0.1, // frame duration
      3, // frames in animation
      true, // to loop or not to loop
      size // scale in relation to original image
    );

    this.x = startX;
    this.y = startY;
    this.speed = 300;
    this.game = game;
    this.ctx = game.ctx;
    this.isHeadingRight = isHeadingRight;
    this.gettingHit = false;
    this.health = 400;

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
    this.myPath.push(0);
    this.shouldRewind = false;
    this.resetPath = false;

    // debug tool
    this.drawAroundHitBox = false;
    this.frameWidth = 45;
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

    if (this.gettingHit) {
      if (this.isHeadingRight) {
        this.hitFaceRightAnimation.drawFrame(
          this.game.clockTick,
          ctx,
          this.x,
          this.y
        );
      } else {
        this.hitFaceLeftAnimation.drawFrame(
          this.game.clockTick,
          ctx,
          this.x,
          this.y
        );
      }

      return;
    }

    // If field "isHeadingRight" is true, play fly right animation
    if (this.isHeadingRight && !this.willRewind()) {
      this.runRightAnimation.drawFrame(
        this.game.clockTick,
        ctx,
        this.x,
        this.y
      );
    }
    // If field "isHeadingRight" is false, play fly left animation
    else if (!this.isHeadingRight && !this.willRewind()) {
      this.runLeftAnimation.drawFrame(this.game.clockTick, ctx, this.x, this.y);
    }

    // If affected by time spell
    if (this.isHeadingRight && this.willRewind() && this.myPath.length > 1) {
      this.x = this.myPath.pop();
      this.runRightAnimation.drawFrame(
        this.game.clockTick,
        ctx,
        this.x,
        this.y
      );

      if (this.myPath.length == 1) {
        this.x = this.myPath.pop();
        this.shouldRewind = false;
      }
    }
    if (!this.isHeadingRight && this.willRewind() && this.myPath.length > 1) {
      this.x = this.myPath.pop();
      this.runLeftAnimation.drawFrame(this.game.clockTick, ctx, this.x, this.y);

      if (this.myPath.length == 1) {
        this.shouldRewind = false;
        this.game.shouldRewind = false;
      }
    }
  }

  /** Update handles updating the objects world state. */
  update() {
    this.updateMyHitBoxes();
    if (this.game.resetPaths != undefined) {
      this.resetPath = this.game.resetPaths;
    }

    // alert fly to reset the array for path variables
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

    if (this.gettingHit) {
      this.gettingHit = false;

      return;
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
  }

  // Helper booleans for state
  willRewind() {
    return this.myPath.length > 0 && this.shouldRewind;
  }

  updateMyHitBoxes() {
    if (this.isHeadingRight) {
      this.hitB.width = this.frameWidth;
      this.hitB.height = this.frameHeight;
      this.hitB.boundX = this.boundX + 40;
      this.hitB.boundY = this.boundY;
    } else {
      this.hitB.width = this.frameWidth;
      this.hitB.height = this.frameHeight;
      this.hitB.boundX = this.boundX + 24;
      this.hitB.boundY = this.boundY;
    }
  }
}
