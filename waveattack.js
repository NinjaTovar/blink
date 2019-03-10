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
  constructor(game, startX, startY, size, isHeadingRight) {
    super(game, startX, startY);
    this.waveAttackFaceRight = new Animation(
      AM.getAsset("./img/WaveAttack/WaveAttack_FaceRight.png"), // load sprite asset
      136, // frame width
      220, // frame height
      1, // sheet width
      0.5, // frame duration
      1, // frames in animation
      true, // to loop or not to loop
      size // scale in relation to original image
    );

    this.waveAttackFaceLeft = new Animation(
      AM.getAsset("./img/WaveAttack/WaveAttack_FaceLeft.png"), // load sprite asset
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
    this.kills = [];

    // debug tool
    this.drawAroundHitBox = false;
    this.frameWidth = 20;
    this.frameHeight = 95;
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

    if (this.isHeadingRight) {
      this.waveAttackFaceRight.drawFrame(
        this.game.clockTick,
        ctx,
        this.x,
        this.y
      );
    } else {
      this.waveAttackFaceLeft.drawFrame(
        this.game.clockTick,
        ctx,
        this.x,
        this.y
      );
    }
  }

  /** Update handles updating the objects world state. */
  subClassUpdate() {
    if (Math.abs(this.startX - this.x) > 1800 || this.kills.length > 1) {
      this.isDead = true;
      this.game.blink.waveattackInstance = null;
    }
    if (this.isHeadingRight) {
      this.x += this.game.clockTick * this.speed;
    } else {
      this.x -= this.game.clockTick * this.speed;
    }

    this.boundX = this.x + 19;
    this.boundY = this.y + 20;
    if (!this.isHeadingRight) {
      this.boundX = this.x + 25;
    }
    this.updateMyHitBoxes();
  }

  handleCollison(other, type) {
    if (!this.kills.includes(other)) {
      this.kills.push(other);
    }
    other.isDead = true;
  }
}
