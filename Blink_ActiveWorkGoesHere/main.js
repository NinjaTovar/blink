var AM = new AssetManager();

// Queue downloading background
AM.queueDownload("./img/backgroundTest.png");

// Queue downloading main character
AM.queueDownload("./img/Crono_Stand_FaceLeft.png");
AM.queueDownload("./img/Crono_Stand_FaceRight.png");
AM.queueDownload("./img/Crono_Run_FaceLeft.png");
AM.queueDownload("./img/Crono_Run_FaceRight.png");
AM.queueDownload("./img/Crono_DoubleSlash_FaceLeft.png");
AM.queueDownload("./img/Crono_DoubleSlash_FaceRight.png");
AM.queueDownload("./img/Crono_Jump_FaceLeft.png");
AM.queueDownload("./img/Crono_Jump_FaceRight.png");

// Queue downloading FlyMutant
AM.queueDownload("./img/FlyGuy_Right.png");

// Queue downloading Mummy
AM.queueDownload("./img/Mummy_WalkLeft.png");
AM.queueDownload("./img/Mummy_WalkRight.png");

AM.downloadAll(function ()
{
    var canvas = document.getElementById("gameWorld");
    var ctx = canvas.getContext("2d");

    var gameEngine = new GameEngine();
    gameEngine.init(ctx);
    gameEngine.start();
    //gameEngine.addEntity(
    //    new Background(gameEngine, AM.getAsset("./img/backgroundTest.png"))
    //);

    gameEngine.addEntity(new Background(gameEngine));

    // Add main character Blink!
    gameEngine.addEntity(new Blink(gameEngine));

    // Add enemies those little bastards
    gameEngine.addEntity(new Mummy(gameEngine));

    gameEngine.addEntity(
        new FlyMutant(
            gameEngine,
            -5,
            0,
            0.75
        )
    );
    gameEngine.addEntity(
        new FlyMutant(
            gameEngine,
            -1000,
            50,
            0.4
        )
    );
    gameEngine.addEntity(
        new FlyMutant(
            gameEngine,
            -200,
            20,
            0.3
        )
    );

    console.log("All Done!");
});
