/*
 * Mummy object. This class handles loading the necessary assets as well as defines
 * the update and draw function.
 *
 * Single constructor takes in the game context as its parameter. (There is no default)
 */
class Soldier extends Entity
{
    /**
     * Single constructor for Soldier. Loads assets and sets intial parameters including
     * the speed, starting x/y position, etc.
     *
     * @constructor
     * @param {any} game A reference to the game engine.
     * @param {any} startX Starting x position of the Soldier being constructed.
     * @param {any} startY Starting x position of the Soldier being constructed.
     * @param {any} size Size of scale for character.
     */
    constructor(game, startX, startY, size, isHeadingRight)
    {
        super(game, startX, startY);
        this.shootFaceLeftAnimation = new Animation(
            AM.getAsset("./img/enemies/soldier/SoldierShooting_FaceLeft.png"), // load sprite asset
            195, // frame width
            70, // frame height
            2, // sheet width
            0.8, // frame duration
            2, // frames in animation
            true, // to loop or not to loop
            size // scale in relation to original image
        );

        this.shootFaceRightAnimation = new Animation(
            AM.getAsset("./img/enemies/soldier/SoldierShooting_FaceRight.png"), // load sprite asset
            195, // frame width
            70, // frame height
            2, // sheet width
            0.8, // frame duration
            2, // frames in animation
            true, // to loop or not to loop
            size // scale in relation to original image
        );

        this.walkRightAnimation = new Animation(
            AM.getAsset("./img/enemies/soldier/SoldierWalking_FaceRight.png"), // load sprite asset
            195, // frame width
            70, // frame height
            2, // sheet width
            0.4, // frame duration
            2, // frames in animation
            true, // to loop or not to loop
            size // scale in relation to original image
        );

        this.walkLeftAnimation = new Animation(
            AM.getAsset("./img/enemies/soldier/SoldierWalking_FaceLeft.png"), // load sprite asset
            195, // frame width
            70, // frame height
            2, // sheet width
            0.4, // frame duration
            2, // frames in animation
            true, // to loop or not to loop
            size // scale in relation to original image
        );

        this.hitFaceLeftAnimation = new Animation(
            AM.getAsset("./img/enemies/soldier/SoldierHit_FaceLeft.png"), // load sprite asset
            390, // frame width
            70, // frame height
            1, // sheet width
            0.8, // frame duration
            1, // frames in animation
            true, // to loop or not to loop
            size // scale in relation to original image
        );

        this.hitFaceRightAnimation = new Animation(
            AM.getAsset("./img/enemies/soldier/SoldierHit_FaceRight.png"), // load sprite asset
            390, // frame width
            70, // frame height
            1, // sheet width
            0.8, // frame duration
            1, // frames in animation
            true, // to loop or not to loop
            size // scale in relation to original image
        );

        // Initial world states
        this.x = startX;
        this.y = startY;
        this.speed = 250;
        this.game = game;
        this.ctx = game.ctx;
        this.isHeadingRight = isHeadingRight;
        this.shouldShoot = false;

        // debug tool
        this.drawAroundHitBox = false;
        this.frameWidth = 50;
        this.frameHeight = 100;
        this.size = size;
    }

    /**
     * Draw takes in the game context and uses that to define what update does.
     *
     * @param {any} ctx  A reference to the Game Context.
     */
    draw(ctx)
    {
        // debug tool
        if (this.drawAroundHitBox)
        {
            this.drawAroundBox();
        }


        if (!this.willRewind())
        {
            if (this.shouldShoot)
            {
                if (this.isHeadingRight)
                {
                    this.shootFaceRightAnimation.drawFrame(
                        this.game.clockTick,
                        ctx,
                        this.x,
                        this.y
                    );
                } else
                {
                    this.shootFaceLeftAnimation.drawFrame(
                        this.game.clockTick,
                        ctx,
                        this.x,
                        this.y
                    );
                }
            } else
            {
                if (this.isHeadingRight)
                {
                    this.walkRightAnimation.drawFrame(
                        this.game.clockTick,
                        ctx,
                        this.x,
                        this.y
                    );
                } else
                {
                    this.walkLeftAnimation.drawFrame(
                        this.game.clockTick,
                        ctx,
                        this.x,
                        this.y
                    );
                }
            }
        } else
        {
            this.x = this.x = this.myPath.pop();
            if (this.shouldShoot)
            {
                if (this.isHeadingRight)
                {
                    this.shootFaceRightAnimation.drawFrame(
                        this.game.clockTick,
                        ctx,
                        this.x,
                        this.y
                    );
                } else
                {
                    this.shootFaceLeftAnimation.drawFrame(
                        this.game.clockTick,
                        ctx,
                        this.x,
                        this.y
                    );
                }
            } else
            {
                if (this.isHeadingRight)
                {
                    this.walkRightAnimation.drawFrame(
                        this.game.clockTick,
                        ctx,
                        this.x,
                        this.y
                    );
                } else
                {
                    this.walkLeftAnimation.drawFrame(
                        this.game.clockTick,
                        ctx,
                        this.x,
                        this.y
                    );
                }
            }
        }
    }

    /** Update handles updating the objects world state. */
    subClassUpdate()
    {
        this.boundX = this.x + 160;
        if (!this.isHeadingRight)
        {
            this.boundX = this.x + 170;
        }
        this.boundY = this.y;
        this.updateMyHitBoxes();
        if (this.gettingHit)
        {
            console.log("Yo");
            this.gettingHit = false;
            return;
        }
        if (
            (Math.abs(this.x - this.game.blink.x) <= 200 && !this.isHeadingRight) ||
            (Math.abs(this.x - this.game.blink.x) <= 500 && this.isHeadingRight)
        )
        {
            this.shouldShoot = true;
        } else
        {
            this.shouldShoot = false;
        }

        if (this.shouldShoot)
        {
            this.handleShooting();
        }

        if (this.game.blink.x - this.frameWidth > this.x + +this.frameWidth + 100)
        {
            this.isHeadingRight = true;
        } else
        {
            this.isHeadingRight = false;
        }

        if (!this.shouldShoot && Math.abs(this.y - this.game.blink.y) < 90)
        {
            if (this.isHeadingRight)
            {
                this.x += this.game.clockTick * this.speed;
            } else
            {
                this.x -= this.game.clockTick * this.speed;
            }
        } else
        {
            if (this.isHeadingRight)
            {
                this.walkRightAnimation.elapsedTime = 0;
            } else
            {
                this.walkLeftAnimation.elapsedTime = 0.5;
            }
        }
    }

    handleShooting()
    {
        if (this.isHeadingRight)
        {
            if (
                this.shootFaceRightAnimation.elapsedTime < 0.48 &&
                this.shootFaceRightAnimation.elapsedTime > 0.45
            )
            {
                let b = new Bullet(
                    this.game,
                    this.x + 215,
                    this.y + 12,
                    1,
                    true,
                    "Orange"
                );
                this.game.addEntity(b);
            }
        } else
        {
            if (
                this.shootFaceLeftAnimation.elapsedTime < 0.48 &&
                this.shootFaceLeftAnimation.elapsedTime > 0.45
            )
            {
                let b = new Bullet(
                    this.game,
                    this.x + 115,
                    this.y + 15,
                    1,
                    false,
                    "Orange"
                );
                this.game.addEntity(b);
            }
        }
    }
}
