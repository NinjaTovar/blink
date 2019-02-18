class Platform extends Entity {
  constructor(game, x, y, width, height) {
    super(game, x, y);
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.frameWidth = width;
    this.frameHeight = height;
    this.speed = 0;
    this.game = game;
    this.myEntites = [];
    this.ctx = game.ctx;
  }

  /**
   * Draw takes in the game context and uses that to define what update does.
   *
   * @param {any} ctx  A reference to the Game Context.
   */
  draw(ctx) {
    this.ctx.beginPath();
    this.ctx.strokeStyle = "black";
    this.ctx.rect(this.x, this.y, this.width, this.height);
    this.ctx.stroke();
    this.ctx.fill();
  }

  update() {
    this.boundX = this.x;
    this.boundY = this.y;

    // check to see if any entitis are off the platform
    for (let i = 0; i < this.myEntites.length; i++) {
      if (
        this.myEntites[i].x > this.x + this.width ||
        this.myEntites[i].x < this.x
      ) {
        this.myEntites[i].y = 450;
        this.myEntites.splice(i, 1);
      }
    }
  }

  // add an entity to the platform

  addEntity(theEntity) {
    if (!this.myEntites.includes(theEntity)) {
      this.myEntites.push(theEntity);
    }
    console.log(this.myEntites);
  }

  // Returns if the given entity is on this platform
  hasMe(entity) {
    return this.myEntites.includes(entity);
  }
}
