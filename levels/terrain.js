// /*
//  * Platform object, basically how this works:
//  * Once blink is on top of a platform, he gets added
//  * to that instance of the platform, and stays added, until
//  * he jumps/falls off.
//  * this would work simillary for other entites.
//  * Each tile is a platform entity, and every tile will always
//  * 16pixels wide and tall.
//  *
//  */
class Platform extends Entity {
  // 	/**
  // 	 * Single constructor for Platform.
  // 	 *
  // 	 * @constructor
  // 	 * @param {any} game A reference to the game engine.
  // 	 * @param {any} dx Starting x position of the Platform being constructed.
  // 	 * @param {any} dy Starting y position of the Platform being constructed.
  // 	 * @param {any} tileRows the total rows that make up the tile sprite
  // 	 * @param {any} tileColumns the total columns that make up the tile sprite
  // 	 * @param {any} data index/ID of the specific tile im tryna draw
  // 	 * @param {any} img tile sprite
  // 	 */
  constructor(game, tileSize, dx, dy, tileRows, tileColumns, data, img) {
    super(game, dx, dy);
    this.x = dx;
    this.y = dy;
    this.tileSize = tileSize;
    this.width = this.tileSize;
    this.height = this.tileSize;
    this.frameWidth = this.tileSize;
    this.frameHeight = this.tileSize;
    this.speed = 0;
    this.myEntites = [];
    this.ctx = game.ctx;

    this.game = game;
    this.dx = dx;
    this.dy = dy;
    this.tileRows = tileRows;
    this.tileColumns = tileColumns;
    this.data = data;
    this.tile_width = this.tileSize;
    this.tile_height = this.tileSize;
    this.img = img;

    // sy and sx is the sourcex and sourcey of the tile sprite
    // while loop is to calculate the x and y since the data/index is passed
    // in as a 1D array
    this.sy = 0;
    this.sx = 0;
    while (this.data >= this.tileColumns && this.data / this.tileColumns > 0) {
      this.sy++;
      this.data -= this.tileColumns;
    }
    this.sx = this.data;

  }

  draw(ctx) {
    ctx.drawImage(
      this.img,
      this.sx * this.tile_width,
      this.sy * this.tile_height,
      this.tile_width,
      this.tile_height,
      this.dx,
      this.dy,
      this.tile_width,
      this.tile_height
    );
    this.hitB.drawHitBox();
  }

  update() {
    this.updateMyHitBoxes();
    this.boundX = this.x;
    this.boundY = this.y;

    // check to see if any entites are off the platform
    for (let i = 0; i < this.myEntites.length; i++) {
      if (
        this.myEntites[i].x > this.x + this.width ||
        this.myEntites[i].x < this.x
      ) {
        // this.myEntites[i].y = 500;
        this.myEntites.splice(i, 1);
      }
    }
  }
  // add an entity to the platform

  addEntity(theEntity) {
    if (!this.myEntites.includes(theEntity)) {
      this.myEntites.push(theEntity);
    }
  }

  // Returns if the given entity is on this platform
  hasMe(entity) {
    return this.myEntites.includes(entity);
  }
}