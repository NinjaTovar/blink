/** 
 * Entity object. Handles adding 'entities' to the game world, which usually represent
 * a variety of in world objects such as characters, platforms, etc. that may be 
 * interacted with both directly and indirectly.
 * 
 */
class Entity
{
    /**
     * Creates an instance of an entity and adds it to the game world.
     * 
     * @constructor
     * @param {any} game A reference to the game engine.
     * @param {any} x The x coordinate for the entity to be loaded in reference to the 
     *                game world.  
     * @param {any} y The y coordinate for the entity to be loaded in reference to the
     *                game world.
     * 
     * @param {any} removed Indicates whether the entity has been removed from world and 
     *                      should be updated
     */
    constructor(game, x, y)
    {
        this.game = game;
        this.x = x;
        this.y = y;
    }

    /** Update handles updating the objects world state. */
    update() { }

    /**
     * Draws the entity within the game world.
     * 
     * @param {any} ctx A reference to the game context.
     */
    draw(ctx)
    {
        if (this.game.showOutlines && this.radius)
        {
            this.game.ctx.beginPath();
            this.game.ctx.strokeStyle = 'green';
            this.game.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
            this.game.ctx.stroke();
            this.game.ctx.closePath();
        }
    }

    /**
     * 
     * @param {any} image Reference image for the canvas. (maybe ?)
     * @param {any} angle Angle for the projection of entity in the game world. (maybe ?)
     * @returns offscreenCanvas A reference to the game canvas used for projecting the 
     *                          game world. (maybe ?)
     */
    rotateAndCache(image, angle)
    {
        let offscreenCanvas = document.createElement('canvas');
        let size = Math.max(image.width, image.height);
        offscreenCanvas.width = size;
        offscreenCanvas.height = size;
        let offscreenCtx = offscreenCanvas.getContext('2d');
        offscreenCtx.save();
        offscreenCtx.translate(size / 2, size / 2);
        offscreenCtx.rotate(angle);
        offscreenCtx.translate(0, 0);
        offscreenCtx.drawImage(image, -(image.width / 2), -(image.height / 2));
        offscreenCtx.restore();
        //offscreenCtx.strokeStyle = 'red';
        //offscreenCtx.strokeRect(0,0,size,size);
        return offscreenCanvas;
    }
}
