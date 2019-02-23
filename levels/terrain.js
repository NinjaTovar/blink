class Terrain {
	constructor(game, dx, dy, tileRows, tileColumns, data, img, bounds = [0, 0, 0, 0]) {
		this.game = game;
		this.dx = dx;
		this.dy = dy;
		this.tileRows = tileRows;
		this.tileColumns = tileColumns;
		this.data = data;
		this.tile_width = 16;
		this.tile_height = 16;
		this.img = img;
		this.boundX = this.dx + bounds[2];
		this.boundY = this.dy + bounds[3];
		this.boundWidth = this.scale * bounds[0];
		this.boundHeight = this.scale * bounds[1];

		this.sy = 0;
		this.sx = 0;
		while (this.data >= this.tileColumns && this.data / this.tileColumns > 0) {
			this.sy++;
			this.data -= this.tileColumns;
		}
		this.sx = this.data;

	}

	drawOutline(ctx) {
		ctx.beginPath();
		ctx.strokeStyle = "green";
		ctx.rect(this.boundX, this.boundY,
			this.boundWidth, this.boundHeight);
		ctx.stroke();
		ctx.closePath();
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



		// this.drawOutline(ctx);
	}

	update() {

	}
}