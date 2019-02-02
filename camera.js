class Camera
{
    /**
     * Camera handles managing the view position of the world in relation to Blink
     * 
     * @param {any} blink Reference to Blink
     * @param {any} ctx Object passed as reference to canvas
     * @param {any} viewWidth width dimension of the camera
     * @param {any} viewHeight width dimension of the camera
     * @param {any} worldWidth width dimensions of the entire level
     * @param {any} worldHeight height dimensions of the entire level
     */
    constructor(blink, ctx, viewWidth, viewHeight, worldWidth, worldHeight)
    {
        this.blink = blink;
        this.xPosition = blink.x;
        this.yPosition = blink.y;
        this.ctx = ctx;
        this.viewWidth = viewWidth;
        this.viewHeight = viewHeight;
        this.worldWidth = worldWidth;
        this.worldHeight = worldHeight;

        // Offset is the x and y coordinates of the center of the camera
        this.offsetX = this.viewWidth / 2;
        this.offsetY = this.viewHeight / 2;
        // this.speedX = 10;
        // this.speedY = 10;

        // debug camera tool
        this.shouldOutlineCamera = false;
    }
    draw()
    {

        this.ctx.translate(this.xPosition, 0);



        if (this.shouldOutlineCamera)
        {
            this.ctx.beginPath();
            this.ctx.strokeStyle = 'red';
            this.ctx.rect(this.offsetX, this.offsetY, this.viewWidth, this.viewHeight);
            this.ctx.stroke();
            //console.log(this.xPosition);
            //console.log(this.yPosition);
        }
    }
    update()
    {
        this.xPosition = this.offsetX - this.blink.x;
        this.yPosition = this.offsetY - this.blink.y;
    }
}