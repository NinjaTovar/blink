/*
 * Single constructor takes in the game context as its parameter. (There is no default)
 */
class Waveattack extends Entity {
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
    this.waveAttackFaceRight = new Animation(
      AM.getAsset("./img/WaveAttack/WaveAttack_FaceLeft.png"), // load sprite asset
      136, // frame width
      220, // frame height
      1, // sheet width
      0.5, // frame duration
      1, // frames in animation
      true, // to loop or not to loop
      size // scale in relation to original image
    );

    this.waveAttackFaceLeft = new Animation(
      AM.getAsset("./img/WaveAttack/WaveAttack_FaceRight.png"), // load sprite asset
      136, // frame width
      220, // frame height
      1, // sheet width
      0.5, // frame duration
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

    // debug tool
    this.drawAroundHitBox = false;
    this.frameWidth = 136;
    this.frameHeight = 220;
    this.size = size;
  }

  /**
   * Draw takes in the game context and uses that to define what update does.
   *
   * @param {any} ctx  A reference to the Game Context.
   */
  draw(ctx) {
    // debug tool
    if (this.drawAroundHitBox) {
      this.drawAroundBox();
    }
  }

  /** Update handles updating the objects world state. */
  subClassUpdate() {
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

  handleCollison(other, type) {}
}
