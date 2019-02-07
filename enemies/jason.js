class Jason
{
    constructor(game)
    {
        this.animation = new Animation(AM.getAsset("./img/enemies/jason.png"), 346, 346, 1, 0.20, 1, true, .4);
        this.x = 400;
        this.y = 310;
        this.speed = 100;
        this.game = game;
        this.ctx = game.ctx;
        this.facingRight = true;
    }
    draw(ctx)
    {
        this.animation.drawFrame(this.game.clockTick, ctx, this.x, this.y);
    }

    update()
    {
        if (this.x < 200) this.facingRight = true;;
        if (this.x > 800) this.facingRight = false;;
        if (this.facingRight)
        {
            this.x += this.game.clockTick * this.speed;
        } else
        {
            this.x -= this.game.clockTick * this.speed;

        }
    }
}