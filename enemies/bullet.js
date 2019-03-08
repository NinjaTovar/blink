/*
 * Mummy object. This class handles loading the necessary assets as well as defines
 * the update and draw function.
 *
 * Single constructor takes in the game context as its parameter. (There is no default)
 */
class Bullet extends Entity {
  /**
   * Single constructor for Bullet. Loads assets and sets intial parameters including
   * the speed, starting x/y position, etc.
   *
   * @constructor
   * @param {any} game A reference to the game engine.
   * @param {any} startX Starting x position of the Bullet being constructed.
   * @param {any} startY Starting x position of the Bullet being constructed.
   * @param {any} size Size of scale for character.
   */
  constructor(game, startX, startY, size, isHeadingRight, type) {
    super(game, startX, startY);
    this.orangeBulletAnimation = new Animation(
      AM.getAsset("./img/enemies/bullets/orangeBullet.png"), // load sprite asset
      55, // frame width
      50, // frame height
      1, // sheet width
      0.2, // frame duration
      1, // frames in animation
      true, // to loop or not to loop
      size // scale in relation to original image
    );
    // Initial world states
    this.startX = startX;
    this.x = startX;
    this.y = startY;
    this.speed = 200;
    this.game = game;
    this.ctx = game.ctx;
    this.isHeadingRight = isHeadingRight;

    // this will be used for rewind
    this.myPath = [];
    this.myPath.push(this.x);
    this.shouldRewind = false;
    this.resetPath = false;

    // debug tool
    this.drawAroundHitBox = false;
    this.frameWidth = 18;
    this.frameHeight = 18;
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
    }

    this.orangeBulletAnimation.drawFrame(
      this.game.clockTick,
      ctx,
      this.x,
      this.y
    );
  }

  /** Update handles updating the objects world state. */
  update() {
    if (Math.abs(this.x - this.startX) > 300) {
      this.isDead = true;
    }
    if (this.isHeadingRight) {
      this.x += this.game.clockTick * this.speed;
    } else {
      this.x -= this.game.clockTick * this.speed;
    }

    this.boundX = this.x + 19;
    this.boundY = this.y + 21;
    if (this.isHeadingRight) {
      this.boundX = this.x + 17.5;
      this.boundY = this.y + 20;
    }
    this.updateMyHitBoxes();
  }

  handleCollison(other, type) {
    this.isDead = true;
  }
}
