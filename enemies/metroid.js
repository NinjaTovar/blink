/*
 * FlyMutant object. This class handles loading the necessary assets as well as defines
 * the update and draw function.
 *
 * Single constructor takes in the game context as its parameter. (There is no default)
 */
class Metroid extends Entity
{
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
  constructor(game, startX, startY, size, isHeadingRight)
  {
    super(game, startX, startY);
    this.hover = new Animation(
      AM.getAsset("./img/enemies/metroid/metroid.png"),
      78, // frame width
      86, // frame height
      4, // sheet width
      0.1, // frame duration
      12, // frames in animation
      true, // to loop or not to loop
      size // scale in relation to original image
    );

    this.x = startX;
    this.y = startY;
    this.speed = 20;
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
    while (this.randomMaxBoundary - this.randomMinBoundary < 500)
    {
      this.randomMaxBoundary = Randomizer.returnRandomIntBetweenThese(
        this.randomMinBoundary,
        Randomizer.returnRandomInt(this.ctx.canvas.width)
      );
    }

    // debug tool
    this.drawAroundHitBox = false;
    this.frameWidth = 78;
    this.frameHeight = 86;
    this.size = size;
  }

  // Methods

  /**
   * Draw takes in the game context and uses that to define what update does.
   *
   * @param {any} ctx  A reference to the Game Context.
   */
  draw(ctx)
  {
    // debug tool
    if (this.drawAroundHitBox)
    {
      this.drawAroundBox();
      //this.ctx.clearRect(this.x, this.y, this.frameWidth * this.size, this.frameHeight * this.size);
    }

    // If field "isHeadingRight" is false, play fly left animation
    if (this.isHeadingRight && !this.willRewind())
    {
      this.hover.drawFrame(this.game.clockTick, ctx, this.x, this.y);
    }
    if (!this.isHeadingRight && !this.willRewind())
    {
      this.hover.drawFrame(this.game.clockTick, ctx, this.x, this.y);
    }

    // If affected by time spell
    if (this.isHeadingRight && this.willRewind() && this.myPath.length > 1)
    {
      this.x = this.myPath.pop();
      this.hover.drawFrame(this.game.clockTick, ctx, this.x, this.y);

      if (this.myPath.length == 1)
      {
        this.x = this.myPath.pop();
        this.shouldRewind = false;
      }
    }
    if (!this.isHeadingRight && this.willRewind() && this.myPath.length > 1)
    {
      this.x = this.myPath.pop();
      this.hover.drawFrame(this.game.clockTick, ctx, this.x, this.y);

      if (this.myPath.length == 1)
      {
        this.shouldRewind = false;
        this.game.shouldRewind = false;
      }
    }
  }

  /** Update handles updating the objects world state. */
  subClassUpdate()
  {

    if (this.isHeadingRight)
    {
      this.x += this.game.clockTick * this.speed;
      if (this.x > this.randomMaxBoundary)
      {
        this.isHeadingRight = false;
      }
    } else if (!this.isHeadingRight)
    {
      this.x -= this.game.clockTick * this.speed;
      if (this.x < this.randomMinBoundary)
      {
        this.isHeadingRight = true;
      }
    }
  }

}
