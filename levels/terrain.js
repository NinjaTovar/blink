class Terrain {
	constructor(game, dx, dy, tileRows, tileColumns, data, bounds = [0, 0, 0, 0]) {
		this.game = game;
		this.dx = dx;
		this.dy = dy;
		this.tileRows = tileRows;
		this.tileColumns = tileColumns;
		this.data = data;
		this.tile_width = 16;
		this.tile_height = 16;
		this.boundX = this.dx + bounds[2];
		this.boundY = this.dy + bounds[3];
		this.boundWidth = this.scale * bounds[0];
		this.boundHeight = this.scale * bounds[1];
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
		let sx = 0;
		let sy = 0;
		while (this.data / this.tileRows > 0) {
			sy++;
			this.data /= this.tileRows;
		}
		sx = this.data;
		this.game.ctx.drawImage(AM.getAsset('../img/tiles/bg3_stars.png),
				(sx * this.tile_width),
				(sy * this.tile_height),
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