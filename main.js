var AM = new AssetManager();

// Queue downloading background
AM.queueDownload('./img/levels/trainTunnel.png');

// Queue downloading main character
AM.queueDownload('./img/blink/Crono_Stand_FaceLeft.png');
AM.queueDownload('./img/blink/Crono_Stand_FaceRight.png');
AM.queueDownload('./img/blink/Crono_Run_FaceLeft.png');
AM.queueDownload('./img/blink/Crono_Run_FaceRight.png');
AM.queueDownload('./img/blink/Crono_Slash_FaceLeft.png');
AM.queueDownload('./img/blink/Crono_Slash_FaceRight.png');
AM.queueDownload('./img/blink/Crono_Jump_FaceLeft.png');
AM.queueDownload('./img/blink/Crono_Jump_FaceRight.png');
AM.queueDownload('./img/blink/Crono_Spell_FaceLeft.png');
AM.queueDownload('./img/blink/Crono_Spell_FaceRight.png');

// Queue downloading FlyMutant
AM.queueDownload('./img/enemies/fly/Fly_FaceLeft.png');
AM.queueDownload('./img/enemies/fly/Fly_FaceRight.png');

// Queue downloading Mummy
AM.queueDownload('./img/enemies/mummy/Mummy_WalkLeft.png');
AM.queueDownload('./img/enemies/mummy/Mummy_WalkRight.png');

// Queue downloading FlyMutant
AM.queueDownload('./img/enemies/metroid/metroid.png');

// Queue downloading Necroman
AM.queueDownload('./img/enemies/necroman/Necroman_FaceLeft.png');
AM.queueDownload('./img/enemies/necroman/Necroman_FaceRight.png');


AM.downloadAll(function ()
{
    // Load game world. This is the top layer
    var canvas = document.getElementById('gameWorld');
    var gameCtx = canvas.getContext('2d');

    // Load a special effects layer. This is on bottom.
    var bottomCanvas = document.getElementById('projectionsLayerBottom');
    var bottomProjectionContext = bottomCanvas.getContext('2d');

    // Load a special effects layer. This is in the middle.
    var middleCanvas = document.getElementById('projectionsLayerMiddle');
    var middleProjectionContext = middleCanvas.getContext('2d');

    var gameEngine = new GameEngine();

    // Send canvas' to game engine
    gameEngine.init(bottomProjectionContext, middleProjectionContext, gameCtx);
    gameEngine.start();

    console.log('All Done!');
});
