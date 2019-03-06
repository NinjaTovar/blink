/*
 * FlyMutant object. This class handles loading the necessary assets as well as defines
 * the update and draw function.
 *
 * Single constructor takes in the game context as its parameter. (There is no default)
 */
class Vegeta extends Entity {
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
  constructor(game, startX, startY, size) {
    super(game, startX, startY);
    this.standingAnimation = new Animation(
      AM.getAsset("./img/vegeta.png"),
      90, // frame width
      90, // frame height
      2, // sheet width
      0.5, // frame duration
      2, // frames in animation
      true, // to loop or not to loop
      size // scale in relation to original image
    );

    this.messageAnimation = new Animation(
      AM.getAsset("./img/startMessage.png"),
      531, // frame width
      225, // frame height
      4, // sheet width
      0.1, // frame duration
      36, // frames in animation
      false, // to loop or not to loop
      0.4 // scale in relation to original image
    );

    this.messageStill = new Animation(
      AM.getAsset("./img/messageStill.png"),
      531, // frame width
      225, // frame height
      1, // sheet width
      0.5, // frame duration
      1, // frames in animation
      true, // to loop or not to loop
      0.4 // scale in relation to original image
    );

    this.x = startX;
    this.y = startY;
    this.speed = 300;
    this.game = game;
    this.ctx = game.ctx;

    // this will be used for rewind
    this.myPath = [];
    this.myPath.push(0);
    this.shouldRewind = false;
    this.resetPath = false;

    // debug tool
    this.drawAroundHitBox = false;
    this.frameWidth = 90;
    this.frameHeight = 90;
    this.size = size;
    this.blinkTouchedMe = false;
  }

  // Methods

  /**
   * Draw takes in the game context and uses that to define what update does.
   *
   * @param {any} ctx  A reference to the Game Context.
   */
  draw(ctx) {
    console.log(this.messageAnimation.elapsedTime);
    // debug tool
    if (this.drawAroundHitBox) {
      //   this.drawAroundBox();
      //this.ctx.clearRect(this.x, this.y, this.frameWidth * this.size, this.frameHeight * this.size);
    }

    if (this.blinkTouchedMe) {
      this.messageAnimation.drawFrame(
        this.game.clockTick,
        ctx,
        this.x + 45,
        this.y - 50
      );
    }

    if (this.messageAnimation.elapsedTime > 3.6) {
      this.messageStill.drawFrame(
        this.game.clockTick,
        ctx,
        this.x + 40,
        this.y - 55
      );
    }

    this.standingAnimation.drawFrame(this.game.clockTick, ctx, this.x, this.y);
  }

  /** Update handles updating the objects world state. */
  update() {
    if (this.messageAnimation.elapsedTime > 7) {
      this.isDead = true;
    }
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

    this.boundX = this.x + 50;
    this.boundY = this.y + 30;
  }

  // Helper booleans for state
  willRewind() {
    return this.myPath.length > 0 && this.shouldRewind;
  }
}
