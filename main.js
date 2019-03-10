var AM = new AssetManager();

// Queue downloading background
AM.queueDownload("./img/levels/trainTunnel.png");
AM.queueDownload("./img/levels/level1background.png");
AM.queueDownload("./img/tiles/terrainsprite.png");
AM.queueDownload("./img/tiles/lavagif.png");
AM.queueDownload("./img/tiles/saigo_station.png");
AM.queueDownload("./img/levels/molten_pillar.png");
AM.queueDownload("./img/levels/pink_background.png");
AM.queueDownload("./img/tiles/terrain16.png");
AM.queueDownload("./img/levels/station.png");
AM.queueDownload("./img/levels/coolbackground.png");

// Queue downloading main character
AM.queueDownload("./img/blink/Crono_PullSwordOut_FaceLeft.png");
AM.queueDownload("./img/blink/Crono_PullSwordOut_FaceRight.png");
AM.queueDownload("./img/blink/Crono_PullSwordOut_FaceLeft_Still.png");
AM.queueDownload("./img/blink/Crono_PullSwordOut_FaceRight_Still.png");
AM.queueDownload("./img/blink/Crono_Stand_FaceLeft.png");
AM.queueDownload("./img/blink/Crono_Stand_FaceRight.png");
AM.queueDownload("./img/blink/Crono_Run_FaceLeft.png");
AM.queueDownload("./img/blink/Crono_Run_FaceRight.png");
AM.queueDownload("./img/blink/Crono_JumpSlash_FaceLeft.png");
AM.queueDownload("./img/blink/Crono_JumpSlash_FaceRight.png");
AM.queueDownload("./img/blink/Crono_Slash_FaceLeft.png");
AM.queueDownload("./img/blink/Crono_Slash_FaceRight.png");
AM.queueDownload("./img/blink/Crono_DashSlash_FaceLeft.png");
AM.queueDownload("./img/blink/Crono_DashSlash_FaceRight.png");
AM.queueDownload("./img/blink/Crono_Jump_FaceLeft.png");
AM.queueDownload("./img/blink/Crono_Jump_FaceRight.png");
AM.queueDownload("./img/blink/Crono_Spell_FaceLeft.png");
AM.queueDownload("./img/blink/Crono_Spell_FaceRight.png");
AM.queueDownload("./img/blink/Crono_Damage_FaceLeft.png");
AM.queueDownload("./img/blink/Crono_Damage_FaceRight.png");
AM.queueDownload("./img/blink/clock.png");
AM.queueDownload("./img/blink/Crono_dead.png");
AM.queueDownload("./img/blink/healthbar.png");
AM.queueDownload("./img/blink/energy.png");
AM.queueDownload("./img/blink/blinkface.png");
AM.queueDownload("./img/blink/Crono_Falling.png");
AM.queueDownload("./img/blink/Crono_Falling.png");

// Queue downloading effects
AM.queueDownload("./img/effects/Wormhole.png");

// Queue downlaoding Soldier
AM.queueDownload("./img/enemies/soldier/SoldierShooting_FaceLeft.png");
AM.queueDownload("./img/enemies/soldier/SoldierShooting_FaceRight.png");
AM.queueDownload("./img/enemies/soldier/SoldierWalking_FaceRight.png");
AM.queueDownload("./img/enemies/soldier/SoldierWalking_FaceLeft.png");
AM.queueDownload("./img/enemies/soldier/SoldierHit_FaceRight.png");
AM.queueDownload("./img/enemies/soldier/SoldierHit_FaceLeft.png");
AM.queueDownload("./img/enemies/bullets/orangeBullet.png");

// Queue downloading Bug
AM.queueDownload("./img/enemies/bug/BugRun_FaceLeft.png");
AM.queueDownload("./img/enemies/bug/BugRun_FaceRight.png");
AM.queueDownload("./img/enemies/bug/ButHit_FaceRight.png");
AM.queueDownload("./img/enemies/bug/ButHit_FaceLeft.png");

// Queue downloading FlyMutant
AM.queueDownload("./img/enemies/fly/Fly_FaceLeft.png");
AM.queueDownload("./img/enemies/fly/Fly_FaceRight.png");

// Queue downloading Mummy
AM.queueDownload("./img/enemies/mummy/Mummy_WalkLeft.png");
AM.queueDownload("./img/enemies/mummy/Mummy_WalkRight.png");
AM.queueDownload("./img/enemies/mummy/mummyDying.png");

// Queue downloading FlyMutant
AM.queueDownload("./img/enemies/metroid/metroid.png");

// Queue downloading Violator
AM.queueDownload("./img/enemies/violator/ViolatorSwing_FaceRight.png");
AM.queueDownload("./img/enemies/violator/ViolatorSwing_FaceLeft.png");
AM.queueDownload("./img/enemies/violator/Violator_Hit_FaceLeft.png");
AM.queueDownload("./img/enemies/violator/Violator_Hit_FaceRight.png");

// Queue downloading Necroman
AM.queueDownload("./img/enemies/necroman/Necroman_FaceLeft.png");
AM.queueDownload("./img/enemies/necroman/Necroman_FaceRight.png");

// Queue downlaoding Jason
AM.queueDownload("./img/enemies/jason.png");

// Queue downloading red skull
AM.queueDownload("./img/enemies/skull/redskull.png");
AM.queueDownload("./img/enemies/skull/fireball.png");

// Queue downlaoding Vegeta
AM.queueDownload("./img/vegeta.png");
AM.queueDownload("./img/startMessage.png");
AM.queueDownload("./img/messageStill.png");
AM.queueDownload("./img/message2still.png");
AM.queueDownload("./img/message2.png");

AM.downloadAll(function() {
  window.onload = function() {
    // Load game world. This is the top layer
    var canvas = document.getElementById("gameWorld");
    var gameCtx = canvas.getContext("2d");

    // Load a special effects layer. This is on bottom.
    var bottomCanvas = document.getElementById("projectionsLayerBottom");
    var bottomProjectionContext = bottomCanvas.getContext("2d");

    // Load a special effects layer. This is in the middle.
    var middleCanvas = document.getElementById("projectionsLayerMiddle");
    var middleProjectionContext = middleCanvas.getContext("2d");

    //// Load a special effects layer. This is in the middle.
    //var overlayCanvas = document.getElementById('projectionsLayerOverlayAll');
    //var overlayProjectionContext = overlayCanvas.getContext('2d');

    var gameEngine = new GameEngine();

    gameCtx.canvas.focus();

    // Send canvas' to game engine
    gameEngine.init(
      bottomProjectionContext,
      middleProjectionContext,
      gameCtx,
      AM
    );
    gameEngine.start();

    console.log("All Done!");
  };
});
