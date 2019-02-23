/*
 * Necroman object. This class handles loading the necessary assets as well as defines
 * the update and draw function.
 *
 * Single constructor takes in the game context as its parameter. (There is no default)
 */
class Necroman extends Entity {
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
    this.faceLeft = new Animation(
      AM.getAsset("./img/enemies/necroman/Necroman_FaceLeft.png"),
      125, // frame width
      82, // frame height
      2, // sheet width
      0.2, // frame duration
      5, // frames in animation
      true, // to loop or not to loop
      size // scale in relation to original image
    );
    this.faceRight = new Animation(
      AM.getAsset("./img/enemies/necroman/Necroman_FaceRight.png"),
      125, // frame width
      82, // frame height
      2, // sheet width
      0.2, // frame duration
      5, // frames in animation
      true, // to loop or not to loop
      size // scale in relation to original image
    );

    this.x = startX;
    this.y = startY;
    this.speed = 250;
    this.game = game;
    this.ctx = game.ctx;
    this.isHeadingRight = false;

    // this will be used for rewind
    this.myPath = [];
    this.myPath.push(this.x);
    this.shouldRewind = false;

    // debug tool
    this.drawAroundHitBox = false;
    this.frameWidth = 500;
    this.frameHeight = 400;
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
      this.drawAroundBox();
      //this.ctx.clearRect(this.x, this.y, this.frameWidth * this.size, this.frameHeight * this.size);
    }

    // If field "isHeadingRight" is true, play fly right animation
    if (this.isHeadingRight) {
      this.faceRight.drawFrame(this.game.clockTick, ctx, this.x, this.y);
    }
    // If field "isHeadingRight" is false, play fly left animation
    else if (!this.isHeadingRight) {
      this.faceLeft.drawFrame(this.game.clockTick, ctx, this.x, this.y);
    }
  }

  /** Update handles updating the objects world state. */
  update() {
    this.updateMyHitBoxes();
  }
}
