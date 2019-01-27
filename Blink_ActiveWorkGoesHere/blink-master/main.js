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

// AM.queueDownload("./img/backgroundTest.png");
// AM.queueDownload("./img/Crono_Stand_FaceLeft.png");
// AM.queueDownload("./img/Crono_Stand_FaceRight.png");
// AM.queueDownload("./img/Crono_Run_FaceLeft.png");
// AM.queueDownload("./img/Crono_Run_FaceRight.png");
// AM.queueDownload("./img/Crono_DoubleSlash_FaceLeft.png");
// AM.queueDownload("./img/Crono_DoubleSlash_FaceRight.png");
// AM.queueDownload("./img/Crono_Jump_FaceLeft.png");
// AM.queueDownload("./img/Crono_Jump_FaceRight.png");
class MainGuy {
  constructor(game, spriteSheet) {
    this.animation = new Animation(spriteSheet, 14, 34, 3, .8, 3, true, 1.8);
    this.runLeftAnimation = new Animation(
      AM.getAsset("./img/Crono_Run_FaceLeft.png"),
      22,
      34,
      3,
      0.1,
      6,
      true,
      1.5
    );
    this.runRightAnimation = new Animation(
      AM.getAsset("./img/Crono_Run_FaceRight.png"),
      22,
      34,
      3,
      0.1,
      6,
      true,
      1.8
    );
    this.runLeftAnimation = new Animation(
      AM.getAsset("./img/Crono_Run_FaceLeft.png"),
      22,
      34,
      3,
      0.1,
      6,
      true,
      1.8
    );
    // this.basicAttackAnimation = new Animation(
    //   AM.getAsset("./img/Crono_DoubleSlash_FaceLeft.png"),
    //   38,
    //   40,
    //   5,
    //   0.1,
    //   5,
    //   true,
    //   1.5
    // );
    this.basicAttackAnimation = new Animation(
      AM.getAsset("./img/Crono_DoubleSlash_FaceRight.png"),
      31,
      48,
      3,
      0.1,
      5,
      true,
      1.8
    );
    this.jumpRightAnimation = new Animation(
      AM.getAsset("./img/Crono_Jump_FaceRight.png"),
      39,
      34,
      3,
      0.1,
      8,
      true,
      1.8
    );
    this.x = 50;
    this.y = 200;
    this.lastY = this.y;
    this.speed = 150;
    this.game = game;
    this.ctx = game.ctx;
    this.movingRight = false;
    this.movingLeft = false;
    this.basicAttack = false;
    this.jumpRight = false;
    this.jumpHeight = 400;
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
      this.x -= 1;
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
    if (this.jumpRight)
    {
      if (this.jumpRightAnimation.elapsedTime > 1.5 || (this.movingLeft || this.movingRight))
      {
        this.game.jumpRight = false;
        this.jumpRight = false;
        this.jumpRightAnimation.elapsedTime = 0;
      }
    }
    this.base = 190;
    if (this.movingRight) {
      // this.y = 425;
      this.x += this.game.clockTick * this.speed;
    }
    if (this.movingLeft) {
      // this.y = 425;
      this.x -= this.game.clockTick * this.speed;
    }
    if (this.jumpRight) {
      var height = 0;
      var duration = this.jumpRightAnimation.elapsedTime + this.game.clockTick;
      if (duration > this.jumpRightAnimation.totalTime / 2)
        duration = this.jumpRightAnimation.totalTime - duration;
      duration = duration / this.jumpRightAnimation.totalTime;

      // quadratic jump
      height = (2 * duration - 2 * duration * duration) * this.jumpHeight;
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
      111,
      119,
      2,
      0.1,
      3,
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

AM.queueDownload("./img/Mummy_WalkLeft.png");
AM.queueDownload("./img/Mummy_WalkRight.png");
AM.queueDownload("./img/backgroundTest.png");
AM.queueDownload("./img/Crono_Stand_FaceLeft.png");
AM.queueDownload("./img/Crono_Stand_FaceRight.png");
AM.queueDownload("./img/Crono_Run_FaceLeft.png");
AM.queueDownload("./img/Crono_Run_FaceRight.png");
AM.queueDownload("./img/Crono_DoubleSlash_FaceLeft.png");
AM.queueDownload("./img/Crono_DoubleSlash_FaceRight.png");
AM.queueDownload("./img/Crono_Jump_FaceLeft.png");
AM.queueDownload("./img/Crono_Jump_FaceRight.png");

AM.queueDownload("./img/walkingEnemy.png");
AM.queueDownload("./img/FlyGuy_Right.png");


AM.downloadAll(function() {
  var canvas = document.getElementById("gameWorld");
  var ctx = canvas.getContext("2d");

  var gameEngine = new GameEngine();
  gameEngine.init(ctx);
  gameEngine.start();
  gameEngine.addEntity(
    new Background(gameEngine, AM.getAsset("./img/backgroundTest.png"))
  );

  
  // gameEngine.addEntity(
  //   new MainGuy(gameEngine, AM.getAsset("./img/Crono_Stand_FaceLeft.png"))
  // );

  gameEngine.addEntity(
    new MainGuy(gameEngine, AM.getAsset("./img/Crono_Stand_FaceRight.png"))
  );

  gameEngine.addEntity(
    new Mummy(gameEngine)
  );

  // gameEngine.addEntity(
  //   new MainGuy(gameEngine, AM.getAsset("./img/Crono_Run_FaceLeft.png"))
  // );

  // gameEngine.addEntity(
  //   new MainGuy(gameEngine, AM.getAsset("./img/Crono_Run_FaceRight.png"))
  // );

  // gameEngine.addEntity(
  //   new MainGuy(gameEngine, AM.getAsset("./img/Crono_DoubleSlash_FaceLeft.png"))
  // );

  // gameEngine.addEntity(
  //   new MainGuy(gameEngine, AM.getAsset("./img/Crono_DoubleSlash_FaceRight.png"))
  // );

  // gameEngine.addEntity(
  //   new MainGuy(gameEngine, AM.getAsset("./img/Crono_Jump_FaceLeft.png"))
  // );

  // gameEngine.addEntity(
  //   new MainGuy(gameEngine, AM.getAsset("./img/Crono_Jump_FaceRight.png"))
  // );

  gameEngine.addEntity(
    new FlyingBird(gameEngine, AM.getAsset("./img/FlyGuy_Right.png"), -5, 0, .75)
  );
  gameEngine.addEntity(
    new FlyingBird(gameEngine, AM.getAsset("./img/FlyGuy_Right.png"), -1000, 50, 0.4)
  );
  gameEngine.addEntity(
    new FlyingBird(gameEngine, AM.getAsset("./img/FlyGuy_Right.png"), -200, 20, 0.3)
  );


  console.log("All Done!");
});
