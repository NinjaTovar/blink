/** Handles loading the static background of a level. */
class SpecialEffects {
    /**
     * Loads a static image for the background.
     * 
     * @constructor
     * @param {any} game A reference to the game engine
     */
    constructor(bottomProjectionContext, middleProjectionContext, gameCtx) {
        this.ctx = gameCtx;
        this.middleProjectionCtx = middleProjectionContext;
        this.bottomProjectionCtx = bottomProjectionContext;
    }

    /** Set's the canvas layers up for effects. */
    prepareCanvasLayersForEffects() {
        // make main game canvas transparent to show special effects layers underneath
        this.ctx.globalAlpha = .5;

        // set layers below at varying transparency for dopeness
        this.middleProjectionCtx.globalAlpha = 0.2;
        this.bottomProjectionCtx.globalAlpha = 0;
    }

    /** Helper function for rewind graphics */
    performStopTimeSpecialEffects() {
        // If Blink cast a spell, slowly fade screen transparency back
        if (this.ctx.globalAlpha < 1) {
            this.ctx.globalAlpha += .01;
            this.middleProjectionCtx.globalAlpha += .4;
            this.bottomProjectionCtx.globalAlpha += .009;

            // Draw mini circles everywhere on stop time spell
            for (var i = 0; i < 30; i++) {
                for (var j = 0; j < 80; j++) {
                    // randomize the circle color
                    this.bottomProjectionCtx.strokeStyle = 'hsl(' + 360 * Math.random() + ', 50%, 50%)';
                    this.bottomProjectionCtx.beginPath();
                    // draw circles that are multiples of the for loop iteration i/j
                    this.bottomProjectionCtx.arc(12.5 + j * 25, 12.5 + i * 25, 10, 0, Math.PI * 2, true);
                    this.bottomProjectionCtx.stroke();
                }
            }

            // Draw semi large transparent circles
            for (var k = 0; k < 30; k++) {
                this.middleProjectionCtx.fillStyle = 'hsl(' + 360 * Math.random() + ', 50%, 50%)';
                this.middleProjectionCtx.beginPath();
                this.middleProjectionCtx.arc(75 * k, 75 * k / 5, 10 + 10 * k, 0, Math.PI * 2, true);
                this.middleProjectionCtx.fill();
            }
        }
    }

    performRewindTimeSpecialEffects() {
        // If Blink cast a spell, slowly fade screen transparency back
        if (this.ctx.globalAlpha < 1) {
            this.ctx.globalAlpha += .01;
            this.middleProjectionCtx.globalAlpha += .4;
            this.bottomProjectionCtx.globalAlpha += .009;

            function getRandomInt(max) {
                return Math.floor(Math.random() * Math.floor(max));
            }

            // flash middle canvas purple and yellow
            for (var k = 0; k < 3; k++) {
                var colors = ['#9B59B6', 'yellow'];

                this.middleProjectionCtx.fillStyle = colors[getRandomInt(3)];
                this.middleProjectionCtx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
            }
        }
    }

    performSlowTimeSpecialEffects() {
        // If Blink cast a spell, slowly fade screen transparency back
        if (this.ctx.globalAlpha < 1) {
            this.ctx.globalAlpha += .01;
            this.middleProjectionCtx.globalAlpha += .4;
            this.bottomProjectionCtx.globalAlpha += .009;

            function getRandomInt(max) {
                return Math.floor(Math.random() * Math.floor(max));
            }

            for (var k = 0; k < 3; k++) {
                // bottom canvas flashes blue grey
                var colors = ['blue', 'grey'];

                this.bottomProjectionCtx.fillStyle = colors[getRandomInt(3)];
                this.bottomProjectionCtx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

                // middle canvas draws streaks width of canvas white, light blue
                var colors = ['white', '#85C1E9'];

                this.middleProjectionCtx.fillRect(
                    getRandomInt(getRandomInt(this.middleProjectionCtx.canvas.width)),
                    getRandomInt(getRandomInt(this.middleProjectionCtx.canvas.height)),
                    getRandomInt(this.middleProjectionCtx.canvas.width),
                    getRandomInt(10));
            }
        }
    }

    performSpeedTimeSpecialEffects() {
        // If Blink cast a spell, slowly fade screen transparency back
        if (this.ctx.globalAlpha < 1) {
            this.ctx.globalAlpha += .1;
            this.middleProjectionCtx.globalAlpha += .4;
            this.bottomProjectionCtx.globalAlpha += .009;

            function getRandomInt(max) {
                return Math.floor(Math.random() * Math.floor(max));
            }

            // draw random squares over canvas
            for (var k = 0; k < 3; k++) {
                this.middleProjectionCtx.fillStyle = 'hsl(' + 360 * Math.random() + ', 50%, 50%)';

                this.middleProjectionCtx.fillRect(
                    getRandomInt(getRandomInt(this.middleProjectionCtx.canvas.width)),
                    getRandomInt(getRandomInt(this.middleProjectionCtx.canvas.height)),
                    getRandomInt(100),
                    getRandomInt(100));
            }


            // Removed flashiness but may want to put it back
            //for (var k = 0; k < 3; k++)
            //{
            //    var colors = ['#28B463', '#F5EEF8'];

            //    this.middleProjectionCtx.fillStyle = colors[getRandomInt(3)];
            //    this.middleProjectionCtx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
            //}
        }
    }

    cleanupEffects() {
        // If Blink cast a spell, slowly fade screen transparency back
        if (this.ctx.globalAlpha < 1) {
            this.ctx.globalAlpha += .01;
            this.middleProjectionCtx.globalAlpha += .4;
            this.bottomProjectionCtx.globalAlpha += .009;

            if (this.ctx.globalAlpha > .94) {
                this.bottomProjectionCtx.clearRect(0, 0, this.bottomProjectionCtx.canvas.width, this.bottomProjectionCtx.canvas.height);
                this.middleProjectionCtx.clearRect(0, 0, this.middleProjectionCtx.canvas.width, this.middleProjectionCtx.canvas.height);
            }
        }
    }
}