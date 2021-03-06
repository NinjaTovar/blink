class LevelOne {
  constructor(gameEngine) {
    this.game = gameEngine;
  }

  loadLevel() {
    /**
     * These three entities must be added in this order
     */
    this.game.addEntity(this.game.camera);
    this.game.addEntity(new Background(this.game));
    this.game.addEntity(this.game.blink);
    // this.game.addEntity(new Platform(this.game, 1185, 400, 400, 100));
    this.game.addEntity(this.game.hud);

    // Manually set blinks coordinates here for now
    // this.game.blink.groundLevel = 2200;
    this.game.blink.y = 20;
    this.game.blink.x = 300;
    this.game.blink.platformY = null;
    this.game.blink.lastY = 2200;
    this.game.camera.x = 100;
    this.game.camera.y = -100;

    // Add random number of violator up to 2
    for (var i = 0; i < Randomizer.returnRandomIntBetweenThese(1, 2); i++) {
      this.game.addEntity(
        new Violator(
          this.game,
          Randomizer.returnRandomIntBetweenThese(500, 3000),
          300,
          2.5,
          Randomizer.returnRandomDirection()
        )
      );
    }
    // // Add random number of mummies up to 4
    for (var i = 0; i < Randomizer.returnRandomIntBetweenThese(3, 8); i++) {
      this.game.addEntity(
        new Mummy(
          this.game,
          Randomizer.returnRandomInt(this.game.surfaceWidth),
          440,
          2.5,
          Randomizer.returnRandomDirection()
        )
      );
    }
    // Add random number of bugs up to 2
    for (var i = 0; i < Randomizer.returnRandomIntBetweenThese(1, 3); i++) {
      this.game.addEntity(
        new Bug(
          this.game,
          Randomizer.returnRandomInt(this.game.surfaceWidth),
          440,
          2.5,
          Randomizer.returnRandomDirection()
        )
      );
    }
    // Add random number of flies up to 5
    for (var i = 0; i < Randomizer.returnRandomIntBetweenThese(2, 5); i++) {
      this.game.addEntity(
        new FlyMutant(
          this.game,
          Randomizer.returnRandomInt(this.game.surfaceWidth),
          Randomizer.returnRandomInt(400),
          Randomizer.returnRandomFloat(0.4, 1),
          Randomizer.returnRandomDirection()
        )
      );
    }
    // Add random number of metroid up to 3
    // for (var i = 0; i < Randomizer.returnRandomIntBetweenThese(1, 4); i++) {
    //   this.game.addEntity(
    //     new Metroid(
    //       this.game,
    //       Randomizer.returnRandomIntBetweenThese(500, 3000),
    //       140,
    //       Randomizer.returnRandomFloat(2, 4),
    //       Randomizer.returnRandomDirection()
    //     )
    //   );
    // }
    // Adding Necroman
    this.game.addEntity(new Necroman(this.game, 4200, 140, 5.5));
  }
}