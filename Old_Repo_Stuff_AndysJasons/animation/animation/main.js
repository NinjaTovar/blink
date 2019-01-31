var AM = new AssetManager();

class Animation {
  constructor(
    spriteSheet,
    frameWidth,
    frameHeight,
    sheetWidth,
    frameDuration,
    frames,
    loop,
    scale
  ) {
    this.spriteSheet = spriteSheet;
    this.frameWidth = frameWidth;
    this.frameDuration = frameDuration;
    this.frameHeight = frameHeight;
    this.sheetWidth = sheetWidth;
    this.frames = frames;
    this.totalTime = frameDuration * frames;
    this.elapsedTime = 0;
    this.loop = loop;
    this.scale = scale;
  }

  drawFrame(tick, ctx, x, y) {
    this.elapsedTime += tick;

    if (this.isDone()) {
      if (this.loop) {
        this.elapsedTime = 0;
      }
    }

    let frame = this.currentFrame();
    let xIndex = 0;
    let yIndex = 0;
    xIndex = frame % this.sheetWidth;
    yIndex = Math.floor(frame / this.sheetWidth);

    ctx.drawImage(
      this.spriteSheet,
      xIndex * this.frameWidth,
      yIndex * this.frameHeight, // source from sheet
      this.frameWidth,
      this.frameHeight,
      x,
      y,
      this.frameWidth * this.scale,
      this.frameHeight * this.scale
    );
  }

  currentFrame() {
    return Math.floor(this.elapsedTime / this.frameDuration);
  }

  isDone() {
    return this.elapsedTime >= this.totalTime;
  }
}

class MainGuy {
  constructor(game, spriteSheet) {
    this.animation = new Animation(spriteSheet, 45, 75, 1, 0.1, 1, true, 1);
    this.runRightAnimation = new Animation(
      AM.getAsset("./img/leftToRight.png"),
      45,
      75,
      4,
      0.09,
      4,
      true,
      1
    );
    this.runLeftAnimation = new Animation(
      AM.getAsset("./img/rightToLeft.png"),
      45,
      75,
      4,
      0.1,
      4,
      true,
      1
    );
    this.basicAttackAnimation = new Animation(
      AM.getAsset("./img/basicAttack.png"),
      38,
      40,
      5,
      0.1,
      5,
      true,
      2
    );
    this.jumpRightAnimation = new Animation(
      AM.getAsset("./img/chrono/Crono_Jump_FaceRight.png"),
      39,
      42,
      3,
      0.1,
      8,
      true,
      2
    );
    this.x = 50;
    this.y = 425;
    this.speed = 150;
    this.game = game;
    this.ctx = game.ctx;
    this.movingRight = false;
    this.movingLeft = false;
    this.basicAttack = false;
    this.jumpRight = false;
  }
  draw(ctx) {
    if (
      !this.movingRight &&
      !this.movingLeft &&
      !this.basicAttack &&
      !this.jumpRight
    ) {
      this.animation.drawFrame(this.game.clockTick, ctx, this.x, this.y);
    } else if (this.movingRight) {
      this.runRightAnimation.drawFrame(
        this.game.clockTick,
        ctx,
        this.x,
        this.y
      );
    } else if (this.movingLeft) {
      this.runLeftAnimation.drawFrame(this.game.clockTick, ctx, this.x, this.y);
    } else if (this.basicAttack) {
      this.basicAttackAnimation.drawFrame(
        this.game.clockTick,
        ctx,
        this.x,
        this.y
      );
    } else if (this.jumpRight) {
      this.jumpRightAnimation.drawFrame(
        this.game.clockTick,
        ctx,
        this.x,
        this.y
      );
    }
  }

  update() {
    this.movingRight = this.game.rightArrow;
    this.movingLeft = this.game.leftArrow;
    this.basicAttack = this.game.basicAttack;
    this.jumpRight = this.game.jumpRight;
    if (this.movingRight) {
      this.x += this.game.clockTick * this.speed;
    } else if (this.movingLeft) {
      this.x -= this.game.clockTick * this.speed;
    } else if (this.jumpRight) {
      let height = 0;
      let duration = this.jumpRightAnimation.elapsedTime + this.game.clockTick;
      if (duration > this.jumpRightAnimation.totalTime / 2)
        duration = this.jumpAnimation.totalTime - duration;
      duration = duration / this.jumpRightAnimation.totalTime;

      // quadratic jump
      height = (4 * duration - 4 * duration * duration) * this.jumpHeight;
      this.y = this.base - height;
    }

    if (this.x > 800 || this.x < 0) {
      this.x = 0;
    }
  }
}
class BasicEnemy {
  constructor(game, spriteSheet) {
    this.animation = new Animation(spriteSheet, 40, 48, 2, 0.4, 2, true, 2);

    this.x = 1200;
    this.y = 405;
    this.speed = 110;
    this.game = game;
    this.ctx = game.ctx;
  }
  draw(ctx) {
    this.animation.drawFrame(this.game.clockTick, ctx, this.x, this.y);
  }

  update() {
    if (this.x > 710) {
      this.x -= this.game.clockTick * this.speed;
    }
  }
}

class FlyingBird {
  constructor(game, spriteSheet, startX, startY, size) {
    this.animation = new Animation(
      spriteSheet,
      195,
      126,
      5,
      0.1,
      6,
      true,
      size
    );

    this.x = startX;
    this.y = startY;
    this.speed = 80;
    this.game = game;
    this.ctx = game.ctx;
  }
  draw(ctx) {
    this.animation.drawFrame(this.game.clockTick, ctx, this.x, this.y);
  }

  update() {
    this.x += this.game.clockTick * this.speed;
    if (this.x > 1500) {
      this.x = -10;
    }
  }
}

// no inheritance
function Background(game, spritesheet) {
  this.x = 0;
  this.y = 0;
  this.spritesheet = spritesheet;
  this.game = game;
  this.ctx = game.ctx;
}

Background.prototype.draw = function() {
  this.ctx.drawImage(this.spritesheet, this.x, this.y);
};

Background.prototype.update = function() {};

AM.queueDownload("./img/chrono.png");
AM.queueDownload("./img/background.jpg");
AM.queueDownload("./img/leftToRight.png");
AM.queueDownload("./img/rightToLeft.png");
AM.queueDownload("./img/basicAttack.png");
AM.queueDownload("./img/walkingEnemy.png");
AM.queueDownload("./img/flyingBird.png");
AM.queueDownload("./img/chrono/Crono_Jump_FaceRight.png");

AM.downloadAll(function() {
  var canvas = document.getElementById("gameWorld");
  var ctx = canvas.getContext("2d");

  var gameEngine = new GameEngine();
  gameEngine.init(ctx);
  gameEngine.start();
  gameEngine.addEntity(
    new Background(gameEngine, AM.getAsset("./img/background.jpg"))
  );

  gameEngine.addEntity(
    new MainGuy(gameEngine, AM.getAsset("./img/chrono.png"))
  );

  gameEngine.addEntity(
    new MainGuy(gameEngine, AM.getAsset("./img/chrono.png"))
  );
  gameEngine.addEntity(
    new BasicEnemy(gameEngine, AM.getAsset("./img/walkingEnemy.png"))
  );

  gameEngine.addEntity(
    new FlyingBird(gameEngine, AM.getAsset("./img/flyingBird.png"), -10, 0, 0.5)
  );
  gameEngine.addEntity(
    new FlyingBird(
      gameEngine,
      AM.getAsset("./img/flyingBird.png"),
      -150,
      50,
      0.2
    )
  );

  gameEngine.addEntity(
    new FlyingBird(
      gameEngine,
      AM.getAsset("./img/flyingBird.png"),
      -150,
      50,
      0.2
    )
  );

  gameEngine.addEntity(
    new FlyingBird(
      gameEngine,
      AM.getAsset("./img/flyingBird.png"),
      -240,
      60,
      0.2
    )
  );

  gameEngine.addEntity(
    new FlyingBird(
      gameEngine,
      AM.getAsset("./img/flyingBird.png"),
      -500,
      20,
      0.2
    )
  );

  console.log("All Done!");
});
