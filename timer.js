/** Handles in game world time keeping. This allows animation and action functionality. */
class Timer
{
    /** 
     *  Initializes several fields for use in timer class, primarily tick().
     *  @constructor
     */
    constructor()
    {
        this.gameTime = 0;
        this.maxStep = 0.05;
        this.wallLastTimestamp = 0;
    }

    /**
     * Returns how long it has been since the last update 'tick'. Although time would seem
     * like a constant flow, the way the framerate is implemented, some actions occur off
     * tick which this function can help identify.
     */
    tick()
    {
        var wallCurrent = Date.now();
        var wallDelta = (wallCurrent - this.wallLastTimestamp) / 1000;
        this.wallLastTimestamp = wallCurrent;

        var gameDelta = Math.min(wallDelta, this.maxStep);
        this.gameTime += gameDelta;
        return gameDelta;
    }

    // NOTE: BELOW WAS THE OLD CODE IN GameEngine WHEN IT WAS NOT A CLASS BUT A FUNCTION

    //function Timer()
    //{
    //    this.gameTime = 0;
    //    this.maxStep = 0.05;
    //    this.wallLastTimestamp = 0;
    //}

    //Timer.prototype.tick = function ()
    //{
    //    var wallCurrent = Date.now();
    //    var wallDelta = (wallCurrent - this.wallLastTimestamp) / 1000;
    //    this.wallLastTimestamp = wallCurrent;

    //    var gameDelta = Math.min(wallDelta, this.maxStep);
    //    this.gameTime += gameDelta;
    //    return gameDelta;
    //};
}
