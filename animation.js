/**
 * Animation class. Defines the type of input neccessary to add a character animation.
 */
/**Animation class handles passing back animations for incoming spritesheets. */
class Animation
{
    /**
    * Single constructor takes in various information about the incoming spritesheet, as
    * well as allowing the caller to define if it loops, how fast the default framerate is,
    * and the scale of the output animation compaired to what is provided.
    * 
     * @param {any} spriteSheet The sprite sheet asset to load.
     * @param {any} frameWidth The width of the animation frame. This is defined as
     *                         image (pixel width) / (# of columns in sheet).
     * @param {any} frameHeight The height of the animation frame. This is defined as
     *                          image (pixel height) / (# of rows in sheet).
     * @param {any} sheetWidth How many columns in the sprite sheet.
     * @param {any} frameDuration How fast you want the frame rate.
     * @param {any} frames Number of drawn cells in the sprite sheet.
     * @param {any} loop Boolean for looping the animation or not.
     * @param {any} scale How much to scale the final image compared to original size.
     */
    constructor(
        spriteSheet,
        frameWidth,
        frameHeight,
        sheetWidth,
        frameDuration,
        frames,
        loop,
        scale
    )
    {

        // fields
        this.spriteSheet = spriteSheet;
        this.frameWidth = frameWidth;
        this.frameDuration = frameDuration;
        this.frameHeight = frameHeight;
        this.sheetWidth = sheetWidth;
        this.frames = frames;
        this.totalTime = frameDuration * frames;
        this.elapsedTime = 0;
        this.loop = loop;
        this.scale = scale;
        this.isDonePlaying = false;
    }

    /**
     * Handles drawing the animation with given animation fields as input.
     * 
     * @param {any} tick The game tick. Returned from the Timer class.
     * @param {any} ctx A reference to the game context.
     * @param {any} x The x coordinate in the game world to draw the animation.
     * @param {any} y The y coordinate in the game world to draw the animation.
     */
    drawFrame(tick, ctx, x, y)
    {
        this.elapsedTime += tick;

        if (this.isDone())
        {
            this.isDonePlaying = true;

            if (this.loop)
            {
                this.elapsedTime = 0;
            }
        }

        let frame = this.currentFrame();
        let xIndex = 0;
        let yIndex = 0;
        xIndex = frame % this.sheetWidth;
        yIndex = Math.floor(frame / this.sheetWidth);

        ctx.drawImage(
            this.spriteSheet,
            xIndex * this.frameWidth,
            yIndex * this.frameHeight, // source from sheet
            this.frameWidth,
            this.frameHeight,
            x,
            y,
            this.frameWidth * this.scale,
            this.frameHeight * this.scale
        );
    }

    /** 
     *  Returns a value representing the frame in the sheet to draw based on the 
     *  constructors initialized values.
     *  
     *  @returns Which frame in the spritesheet the animation is on.
     */
    currentFrame()
    {
        return Math.floor(this.elapsedTime / this.frameDuration);
    }

    /** 
     * Defines if the animation is done.
     * 
     * @returns Boolean based on if the spritesheet has played all frames it contains.
     */
    isDone()
    {
        return this.elapsedTime >= this.totalTime;
    }
}
