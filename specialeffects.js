/** Handles loading the static background of a level. */
class SpecialEffects
{
    /**
     * Loads a static image for the background.
     * 
     * @constructor
     * @param {any} game A reference to the game engine
     */
    constructor(bottomProjectionContext, middleProjectionContext, gameCtx)
    {
        this.ctx = gameCtx;
        this.middleProjectionCtx = middleProjectionContext;
        this.bottomProjectionCtx = bottomProjectionContext;
    }

    /** Set's the canvas layers up for effects. */
    prepareCanvasLayersForEffects()
    {
        // make main game canvas transparent to show special effects layers underneath
        this.ctx.globalAlpha = .5;

        // set layers below at varying transparency for dopeness
        this.middleProjectionCtx.globalAlpha = 0.2;
        this.bottomProjectionCtx.globalAlpha = 0;
    }

    /** Helper function for rewind graphics */
    performStopTimeSpecialEffects()
    {
        // If Blink cast a spell, slowly fade screen transparency back
        if (this.ctx.globalAlpha < 1)
        {
            this.ctx.globalAlpha += .01;
            this.middleProjectionCtx.globalAlpha += .4;
            this.bottomProjectionCtx.globalAlpha += .009;

            // Draw mini circles everywhere on stop time spell
            for (var i = 0; i < 30; i++)
            {
                for (var j = 0; j < 80; j++)
                {
                    // randomize the circle color
                    this.bottomProjectionCtx.strokeStyle = 'hsl(' + 360 * Math.random() + ', 50%, 50%)';
                    this.bottomProjectionCtx.beginPath();
                    // draw circles that are multiples of the for loop iteration i/j
                    this.bottomProjectionCtx.arc(12.5 + j * 25, 12.5 + i * 25, 10, 0, Math.PI * 2, true);
                    this.bottomProjectionCtx.stroke();
                }
            }

            // Draw semi large transparent circles
            for (var k = 0; k < 30; k++)
            {
                this.middleProjectionCtx.fillStyle = 'hsl(' + 360 * Math.random() + ', 50%, 50%)';
                this.middleProjectionCtx.beginPath();
                this.middleProjectionCtx.arc(75 * k, 75 * k / 5, 10 + 10 * k, 0, Math.PI * 2, true);
                this.middleProjectionCtx.fill();
            }

            if (this.ctx.globalAlpha > .96)
            {
                this.bottomProjectionCtx.clearRect(0, 0, this.game.surfaceWidth, this.game.surfaceHeight);
                this.middleProjectionCtx.clearRect(0, 0, this.game.surfaceWidth, this.game.surfaceHeight);
            }
        }
    }

    performRewindTimeSpecialEffects()
    {
        // If Blink cast a spell, slowly fade screen transparency back
        if (this.ctx.globalAlpha < 1)
        {
            this.ctx.globalAlpha += .01;
            this.middleProjectionCtx.globalAlpha += .4;
            this.bottomProjectionCtx.globalAlpha += .009;

            function getRandomInt(max)
            {
                return Math.floor(Math.random() * Math.floor(max));
            }

            for (var k = 0; k < 3; k++)
            {
                var colors = ['black', 'yellow'];

                this.middleProjectionCtx.fillStyle = colors[getRandomInt(3)];

                this.middleProjectionCtx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
            }

            if (this.ctx.globalAlpha > .96)
            {
                this.bottomProjectionCtx.clearRect(0, 0, this.game.surfaceWidth, this.game.surfaceHeight);
                this.middleProjectionCtx.clearRect(0, 0, this.game.surfaceWidth, this.game.surfaceHeight);
            }
        }
    }

    performSlowTimeSpecialEffects()
    {
        // If Blink cast a spell, slowly fade screen transparency back
        if (this.ctx.globalAlpha < 1)
        {
            this.ctx.globalAlpha += .01;
            this.middleProjectionCtx.globalAlpha += .4;
            this.bottomProjectionCtx.globalAlpha += .009;

            function getRandomInt(max)
            {
                return Math.floor(Math.random() * Math.floor(max));
            }

            for (var k = 0; k < 3; k++)
            {
                var colors = ['blue', 'black'];

                this.middleProjectionCtx.fillStyle = colors[getRandomInt(3)];

                this.middleProjectionCtx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
            }

            if (this.ctx.globalAlpha > .96)
            {
                this.bottomProjectionCtx.clearRect(0, 0, this.game.surfaceWidth, this.game.surfaceHeight);
                this.middleProjectionCtx.clearRect(0, 0, this.game.surfaceWidth, this.game.surfaceHeight);
            }
        }
    }

    cleanupEffects()
    {
        // If Blink cast a spell, slowly fade screen transparency back
        if (this.ctx.globalAlpha < 1)
        {
            this.ctx.globalAlpha += .01;
            this.middleProjectionCtx.globalAlpha += .4;
            this.bottomProjectionCtx.globalAlpha += .009;

            if (this.ctx.globalAlpha > .98)
            {
                this.bottomProjectionCtx.clearRect(0, 0, 50000, 50000);
                this.middleProjectionCtx.clearRect(0, 0, 50000, 50000);
            }
        }
    }
}