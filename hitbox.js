/*
 * Hitbox object. This class handles collison detection
 *
 * Single constructor takes in the game context as its parameter.
 */
class Hitbox {
  constructor(game, boundX, boundY, width, height, type) {
    this.game = game;
    this.ctx = game.ctx;
    this.boundX = boundX;
    this.boundY = boundY;
    this.width = width;
    this.height = height;
    this.type = type;
  }

  // If another hitbox has collided, return true, else false
  collision(other) {
    let rect1 = {
      x: this.boundX,
      y: this.boundY,
      width: this.width,
      height: this.height
    };

    let rect2 = {
      x: other.boundX,
      y: other.boundY,
      width: other.width,
      height: other.height
    };

    if (
      rect1.x < rect2.x + rect2.width &&
      rect1.x + rect1.width > rect2.x &&
      rect1.y < rect2.y + rect2.height &&
      rect1.height + rect1.y > rect2.y
    ) {
      return true;
    } else {
      return false;
    }
  }

  // draws the hitbox on canvas
  drawHitBox() {
    this.ctx.beginPath();
    this.ctx.strokeStyle = "white";
    this.ctx.rect(this.boundX, this.boundY, this.width, this.height);
    this.ctx.stroke();
  }
}
