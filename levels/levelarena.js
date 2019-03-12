class LevelArena {
	constructor(gameEngine) {
		this.game = gameEngine;
		this.tileSize;
		this.tileWidthCount;
		this.tileHeightCount;
		this.map;


	}
	loadLevel() {
		// Add camera, background and then blink
		this.game.addEntity(this.game.camera);
		this.game.addEntity(new Background5(this.game));
		this.game.addEntity(this.game.blink);
		this.loadPlatforms();
		this.game.addEntity(this.game.hud);

		// Manually set Blink's coordinates for now
		this.game.blink.groundLevel = 950;
		this.game.blink.y = 100;
		this.game.blink.x = 2400;
		this.game.blink.platformY = null;
		this.game.blink.lastY = 5000;
		this.game.camera.x = 24000;
		this.game.camera.y = -100;

		// Add enemies
		// Add random number of violator up to 2
		for (var i = 0; i < Randomizer.returnRandomIntBetweenThese(1, 2); i++) {
			this.game.addEntity(
				new Violator(
					this.game,
					Randomizer.returnRandomIntBetweenThese(500, 3000),
					this.game.blink.groundLevel - 54,
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
					Randomizer.returnRandomInt(3000),
					this.game.blink.groundLevel + 87,
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
					Randomizer.returnRandomInt(3000),
					this.game.blink.groundLevel + 65,
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
					Randomizer.returnRandomInt(3000),
					Randomizer.returnRandomInt(this.game.blink.groundLevel - 48),
					Randomizer.returnRandomFloat(0.4, 1),
					Randomizer.returnRandomDirection()
				)
			);
		}
		// Add random number of metroid up to 3
		for (var i = 0; i < Randomizer.returnRandomIntBetweenThese(1, 4); i++) {
			this.game.addEntity(
				new Metroid(
					this.game,
					Randomizer.returnRandomIntBetweenThese(0, 3000),
					this.game.blink.groundLevel - 160,
					Randomizer.returnRandomFloat(2, 4),
					Randomizer.returnRandomDirection()
				)
			);
		}
		// Adding Necroman
		this.game.addEntity(new Necroman(this.game, 2800, this.game.blink.groundLevel - 248, 5.5));


	}
	loadPlatforms() {

		let map = {
			"height": 18,
			"infinite": false,
			"layers": [{
					"id": 2,
					"image": "..\/..\/..\/TileMap\/coolbackground.png",
					"name": "Image Layer 1",
					"opacity": 1,
					"type": "imagelayer",
					"visible": true,
					"x": 0,
					"y": 0
				},
				{
					"data": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 34, 33, 33, 33, 35, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 35, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 34, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 23, 43, 43, 43, 43, 43, 22, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24],
					"height": 18,
					"id": 1,
					"name": "Tile Layer 1",
					"opacity": 1,
					"type": "tilelayer",
					"visible": true,
					"width": 75,
					"x": 0,
					"y": 0
				}
			],
			"nextlayerid": 3,
			"nextobjectid": 1,
			"orientation": "orthogonal",
			"renderorder": "right-down",
			"tiledversion": "1.2.2",
			"tileheight": 64,
			"tilesets": [{
					"firstgid": 1,
					"source": "..\/..\/..\/TileMap\/saigo_station.tsx"
				},
				{
					"firstgid": 43,
					"source": "..\/..\/..\/TileMap\/lavagif.tsx"
				}
			],
			"tilewidth": 64,
			"type": "map",
			"version": 1.2,
			"width": 75
		}

		this.tileSize = map['tileheight'];
		this.tileWidthCount = map['width'];
		this.tileHeightCount = map['height'];
		this.game.camera.mapWidth = this.tileSize * this.tileWidthCount;
		this.game.camera.mapHeight = this.tileSize * this.tileHeightCount;

		let layers = map['layers'];
		let dy = 0;
		let dx = 0;

		// Add terrain
		let data = layers[1]['data'];
		let platforms = AM.getAsset('./img/tiles/saigo_station.png');
		for (let j = 0; j < data.length; j++) {
			if (data[j] > 0)
				if (data[j] < 43) {
					this.game.addEntity(new Platform(this.game, this.tileSize,
						dx * this.tileSize, dy * this.tileSize, 7, 6, data[j] - 1, platforms));
				} else {
					this.game.addEntity(new Lava(this.game, this.tileSize,
						dx * this.tileSize, dy * this.tileSize, 7, 6, data[j] - 1));
				}

			// This calulates the maps x and y since the data is in a 1D array
			if (j % this.tileWidthCount == 0) { // map is 200 tiles wide
				dx = 0;
				dy++;
			} else {
				dx++;
			}
		}

	}
}