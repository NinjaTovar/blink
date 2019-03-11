class Clock extends Entity
{
    constructor(game, startX, startY)
    {
        super(game, startX, startY);
        this.x = startX;
        this.y = startY;
        this.frameWidth = 400;
        this.frameHeight = 400;
        this.speed = 45;
        this.game = game;
        this.ctx = game.ctx;
        this.groundLevel = this.game.blink.groundLevel;
        this.keepCoinGoing = true;
        this.staionary = false;
        this.leftOrRight = Math.random() >= 0.5;

        this.coinAnimation = new Animation(
            AM.getAsset("./img/blink/clock.png"), // load sprite asset
            400, // frame width
            400, // frameheight
            1, // sheet width
            0.2, // frame duration
            1, // frames in animation
            true, // to loop or not to loop
            0.1 // scale in relation to original image
        );
    }

    draw(ctx)
    {
        this.coinAnimation.drawFrame(this.game.clockTick, ctx, this.x, this.y);
    }

    subClassUpdate()
    {
        this.updateMyHitBoxes();
        this.boundX = this.x;
        this.boundY = this.y;
        if (this.y < this.game.blink.groundLevel)
        {
            this.keepCoinGoing = false;
        }
        if (this.y > this.game.blink.groundLevel + 70)
        {
            this.staionary = true;
        }

        if (!this.staionary)
        {
            if (this.keepCoinGoing)
            {
                this.y -= this.game.clockTick * this.speed;
            } else
            {
                this.y += this.game.clockTick * this.speed;
            }

            if (this.leftOrRight)
            {
                this.x -= this.game.clockTick * this.speed - 0.5;
            } else
            {
                this.x += this.game.clockTick * this.speed;
            }
        }
    }

    updateMyHitBoxes()
    {
        this.hitB.width = this.frameWidth;
        this.hitB.height = this.frameHeight;
        this.hitB.boundX = this.boundX + 15;
        this.hitB.boundY = this.boundY;
    }
}
