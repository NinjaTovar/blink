window.requestAnimFrame = (function() {
  return (
    window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function(callback, element) {
      window.setTimeout(callback, 1000 / 60);
    }
  );
})();

class GameEngine {
  constructor() {
    this.entities = [];
    this.ctx = null;
    this.surfaceWidth = null;
    this.surfaceHeight = null;
  }

  init(ctx) {
    this.ctx = ctx;
    this.surfaceWidth = this.ctx.canvas.width;
    this.surfaceHeight = this.ctx.canvas.height;
    this.timer = new Timer();
    console.log("game initialized");
    const that = this;

    this.ctx.canvas.addEventListener(
      "keydown",
      e => {
        console.log(e.key);
        switch (e.key) {
          case "ArrowRight":
            that.rightArrow = true;
            break;
          case "ArrowLeft":
            that.leftArrow = true;
            break;
          case "a":
            that.basicAttack = true;
            break;
          case "ArrowUp":
            that.jumpRight = true;
            console.log("JUMPPED");
            break;
          default:
            break;
        }
        e.preventDefault();
      },
      false
    );

    this.ctx.canvas.addEventListener(
      "keyup",
      e => {
        switch (e.key) {
          case "ArrowRight":
            that.rightArrow = false;
            break;
          case "ArrowLeft":
            that.leftArrow = false;
            break;
          case "a":
            that.basicAttack = false;
            break;
          default:
            break;
        }
        e.preventDefault();
      },
      false
    );
  }

  start() {
    console.log("starting game");
    let that = this;
    (function gameLoop() {
      that.loop();
      requestAnimationFrame(gameLoop, that.ctx.canvas);
    })();
  }

  addEntity(entity) {
    console.log("added entity");
    this.entities.push(entity);
  }

  draw() {
    this.ctx.clearRect(0, 0, this.surfaceWidth, this.surfaceHeight);
    this.ctx.save();
    for (let i = 0; i < this.entities.length; i++) {
      this.entities[i].draw(this.ctx);
    }
    this.ctx.restore();
  }

  update() {
    let entitiesCount = this.entities.length;

    for (let i = 0; i < entitiesCount; i++) {
      let entity = this.entities[i];

      entity.update();
    }
  }

  loop() {
    this.clockTick = this.timer.tick();
    this.update();
    this.draw();
  }

  /////////
  /////////
  /////////
  ///////// ADD FUNCTION HERE FOR
  ///////// CONTROLING THE ANIMATION
  /////////
  /////////
  /////////
  /////////
  /////////
}

function Timer() {
  this.gameTime = 0;
  this.maxStep = 0.05;
  this.wallLastTimestamp = 0;
}

Timer.prototype.tick = function() {
  var wallCurrent = Date.now();
  var wallDelta = (wallCurrent - this.wallLastTimestamp) / 1000;
  this.wallLastTimestamp = wallCurrent;

  var gameDelta = Math.min(wallDelta, this.maxStep);
  this.gameTime += gameDelta;
  return gameDelta;
};

class Entity {
  constructor(game, x, y) {
    this.game = game;
    this.x = x;
    this.y = y;
    this.removeFromWorld = false;
  }

  update() {}

  draw(ctx) {
    if (this.game.showOutlines && this.radius) {
      this.game.ctx.beginPath();
      this.game.ctx.strokeStyle = "green";
      this.game.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
      this.game.ctx.stroke();
      this.game.ctx.closePath();
    }
  }

  rotateAndCache(image, angle) {
    let offscreenCanvas = document.createElement("canvas");
    let size = Math.max(image.width, image.height);
    offscreenCanvas.width = size;
    offscreenCanvas.height = size;
    let offscreenCtx = offscreenCanvas.getContext("2d");
    offscreenCtx.save();
    offscreenCtx.translate(size / 2, size / 2);
    offscreenCtx.rotate(angle);
    offscreenCtx.translate(0, 0);
    offscreenCtx.drawImage(image, -(image.width / 2), -(image.height / 2));
    offscreenCtx.restore();
    //offscreenCtx.strokeStyle = "red";
    //offscreenCtx.strokeRect(0,0,size,size);
    return offscreenCanvas;
  }
}