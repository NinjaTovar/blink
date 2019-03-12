// A container class for all the UI elements we will display on canvas
class Hud {
    constructor(game) {
        this.game = game;
        this.camera = game.camera;
        this.healthbar = new HealthBar(game);
        this.components = [this.healthbar];


    }
    update() {
        for (var i = 0; i < this.components.length; i++) {
            this.components[i].update();
        }
    }
    draw(ctx) {
        for (var i = 0; i < this.components.length; i++) {
            this.components[i].draw(ctx);
        }
    }


}
// The class is named health bar but also does the energy bar
class HealthBar {
    constructor(game) {
        this.game = game;
        this.camera = this.game.camera;
        this.blink = this.game.blink;
        this.health = this.blink.health;
        this.energy = this.blink.energy;
        this.width = 8;
        this.height = 46;
        this.scale = 2;
        this.offsetX = 20;

    }
    update() {
        this.health = this.blink.health;
        this.energy = this.blink.energy;
        // Add update for energy here

        // Camera bounds...lots of manual touches here to keep it looking nice at level bounds.
        if (this.blink.x > 1000 && this.blink.x < this.camera.mapWidth - 1000) {
            this.dx = this.game.canvasWidth / 30 - this.camera.x;
            this.dy = this.game.canvasHeight / 30 - this.camera.y;
        } else if (this.blink.x < 1000) {
            this.dx = this.game.canvasWidth / 30;
            this.dy = this.game.canvasHeight / 30 - this.camera.y;
        } else {
            this.dx = this.camera.mapWidth - 1900; // adjust HUD placement at end of level.
            this.dy = this.game.canvasHeight / 30 - this.camera.y;
        }


    }
    // need to flip the images
    draw(ctx) {
        let health = AM.getAsset('./img/blink/healthbar.png');
        let energy = AM.getAsset('./img/blink/energy.png');
        let blinkImage = AM.getAsset('./img/blink/blinkface.png');

        // Draws Blinks Face
        ctx.drawImage(
            blinkImage,
            this.dx - 5,
            this.dy + 95,
        );

        // Draws health bar
        ctx.drawImage(
            health,
            0,
            0,
            this.width,
            this.height * (this.health / 1000),
            this.dx,
            this.dy,
            this.width * this.scale,
            this.height * (this.health / 1000) * this.scale
        );

        // Draws energy bar, blinks energy is hardcoded for now
        ctx.drawImage(
            energy,
            0,
            0,
            this.width,
            this.height * (this.energy / 1000),
            this.dx + this.offsetX,
            this.dy,
            this.width * this.scale,
            this.height * (this.energy / 1000) * this.scale
        );

    }

}