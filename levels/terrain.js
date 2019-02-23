class Platform extends Entity {
	constructor(game, dx, dy, tileRows, tileColumns, data, img) {
		super(game, dx, dy);
		this.x = dx;
		this.y = dy;
		this.width = 16;
		this.height = 16;
		this.frameWidth = 16;
		this.frameHeight = 16;
		this.speed = 0;
		this.myEntites = [];
		this.ctx = game.ctx;

		this.game = game;
		this.dx = dx;
		this.dy = dy;
		this.tileRows = tileRows;
		this.tileColumns = tileColumns;
		this.data = data;
		this.tile_width = 16;
		this.tile_height = 16;
		this.img = img;


		this.sy = 0;
		this.sx = 0;
		while (this.data >= this.tileColumns && this.data / this.tileColumns > 0) {
			this.sy++;
			this.data -= this.tileColumns;
		}
		this.sx = this.data;

	}


	draw(ctx) {
		ctx.drawImage(this.img,
			(this.sx * this.tile_width),
			(this.sy * this.tile_height),
			this.tile_width,
			this.tile_height,
			this.dx, this.dy,
			this.tile_width,
			this.tile_height
		);

	}

	update() {
		this.updateMyHitBoxes();
		this.boundX = this.x;
		this.boundY = this.y;

		// check to see if any entites are off the platform
		for (let i = 0; i < this.myEntites.length; i++) {
			if (
				this.myEntites[i].x > this.x + this.width ||
				this.myEntites[i].x < this.x
			) {
				this.myEntites[i].y = 450;
				this.myEntites.splice(i, 1);
			}
		}
	}
	// add an entity to the platform

	addEntity(theEntity) {
		if (!this.myEntites.includes(theEntity)) {
			this.myEntites.push(theEntity);
		}
	}

	// Returns if the given entity is on this platform
	hasMe(entity) {
		return this.myEntites.includes(entity);
	}
}