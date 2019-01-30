var AM = new AssetManager();

// Queue downloading background
AM.queueDownload('./img/levels/backgroundTest.png');

// Queue downloading main character
AM.queueDownload('./img/blink/Crono_Stand_FaceLeft.png');
AM.queueDownload('./img/blink/Crono_Stand_FaceRight.png');
AM.queueDownload('./img/blink/Crono_Run_FaceLeft.png');
AM.queueDownload('./img/blink/Crono_Run_FaceRight.png');
AM.queueDownload('./img/blink/Crono_DoubleSlash_FaceLeft.png');
AM.queueDownload('./img/blink/Crono_DoubleSlash_FaceRight.png');
AM.queueDownload('./img/blink/Crono_Jump_FaceLeft.png');
AM.queueDownload('./img/blink/Crono_Jump_FaceRight.png');

// Queue downloading FlyMutant
AM.queueDownload('./img/enemies/fly/Fly_FaceLeft.png');
AM.queueDownload('./img/enemies/fly/Fly_FaceRight.png');

// Queue downloading Mummy
AM.queueDownload('./img/enemies/mummy/Mummy_WalkLeft.png');
AM.queueDownload('./img/enemies/mummy/Mummy_WalkRight.png');

// Queue downloading Necroman
AM.queueDownload('./img/enemies/necroman/Necroman_FaceLeft.png');
AM.queueDownload('./img/enemies/necroman/Necroman_FaceRight.png');

AM.downloadAll(function ()
{
    var canvas = document.getElementById('gameWorld');
    var ctx = canvas.getContext('2d');

    var gameEngine = new GameEngine();
    gameEngine.init(ctx);
    gameEngine.start();

    gameEngine.addEntity(new Background(gameEngine));

    // Add main character Blink!
    gameEngine.addEntity(new Blink(gameEngine));

    // Add enemies those little bastards
    // Adding Mummy
    gameEngine.addEntity(new Mummy(gameEngine));

    // Adding 3 various size flies
    gameEngine.addEntity(new FlyMutant(gameEngine, -5, 0, 0.75));
    gameEngine.addEntity(new FlyMutant(gameEngine, -1000, 50, 0.4));
    gameEngine.addEntity(new FlyMutant(gameEngine, -200, 20, 0.3));

    // Adding Necroman
    gameEngine.addEntity(new Necroman(gameEngine, 520, 55, 2.5));


    console.log('All Done!');
});
