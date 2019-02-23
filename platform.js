// /*
//  * Platform object, basically how this works:
//  * Once blink is on top of a platform, he gets added
//  * to that instance of the platform, and stays added, until
//  * he jumps/falls off.
//  * this would work simillary for other entites.
//  *
//  */

// class Platform extends Entity {
// 	/**
// 	 * Single constructor for Platform.
// 	 *
// 	 * @constructor
// 	 * @param {any} game A reference to the game engine.
// 	 * @param {any} x Starting x position of the Platform being constructed.
// 	 * @param {any} y Starting y position of the Platform being constructed.
// 	 * @param {any} width width of the Platform.
// 	 * @param {any} height height of the Platform.
// 	 */
// 	constructor(game, x, y, width, height) {
// 		super(game, x, y);
// 		this.x = x;
// 		this.y = y;
// 		this.width = width;
// 		this.height = height;
// 		this.frameWidth = width;
// 		this.frameHeight = height;
// 		this.speed = 0;
// 		this.game = game;
// 		this.myEntites = [];
// 		this.ctx = game.ctx;
// 	}

// 	/**
// 	 * Draw takes in the game context and uses that to define what update does.
// 	 *
// 	 * @param {any} ctx  A reference to the Game Context.
// 	 */
// 	draw(ctx) {
// 		this.ctx.beginPath();
// 		this.ctx.strokeStyle = "black";
// 		this.ctx.rect(this.x, this.y, this.width, this.height);
// 		this.ctx.stroke();
// 		this.ctx.fill();
// 	}

// 	update() {
// 		this.updateMyHitBoxes();
// 		this.boundX = this.x;
// 		this.boundY = this.y;

// 		// check to see if any entites are off the platform
// 		for (let i = 0; i < this.myEntites.length; i++) {
// 			if (
// 				this.myEntites[i].x > this.x + this.width ||
// 				this.myEntites[i].x < this.x
// 			) {
// 				this.myEntites[i].y = 450;
// 				this.myEntites.splice(i, 1);
// 			}
// 		}
// 	}

// 	// add an entity to the platform

// 	addEntity(theEntity) {
// 		if (!this.myEntites.includes(theEntity)) {
// 			this.myEntites.push(theEntity);
// 		}
// 	}

// 	// Returns if the given entity is on this platform
// 	hasMe(entity) {
// 		return this.myEntites.includes(entity);
// 	}
// }