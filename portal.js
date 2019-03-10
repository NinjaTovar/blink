class Portal extends Entity
{
    constructor(game, startX, startY)
    {
        super(game, startX, startY);

        this.portalAnimation = new Animation(
            AM.getAsset("./img/effects/Wormhole.png"), // load sprite asset
            61, // frame width
            60, // frameheight
            4, // sheet width
            0.2, // frame duration
            15, // frames in animation
            true, // to loop or not to loop
            3 // scale in relation to original image
        );


        this.x = startX;
        this.y = startY;
        this.frameWidth = 61 * 3;
        this.frameHeight = 60 * 3;
        this.speed = 45;
        this.game = game;
        this.ctx = game.ctx;
        this.groundLevel = this.game.blink.groundLevel;


    }

    draw(ctx)
    {
        // debug tool
        if (this.drawAroundHitBox)
        {
            this.drawAroundBox();
        }

        this.portalAnimation.drawFrame(this.game.clockTick, ctx, this.x, this.y);
    }

    subClassUpdate()
    {
        this.updateMyHitBoxes();
        this.boundX = this.x;
        this.boundY = this.y;
    }

    updateMyHitBoxes()
    {
        this.hitB.width = this.frameWidth;
        this.hitB.height = this.frameHeight;
        this.hitB.boundX = this.boundX + 15;
        this.hitB.boundY = this.boundY;
    }
}
