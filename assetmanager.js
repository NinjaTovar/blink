/** AssetManager object. Handles asset downloads and importing */
class AssetManager {
    /**
     * Creates an asset manager object with empty fields for handling incoming 
     * assets.
     * 
     * @constructor 
     */
    constructor() {
        this.successCount = 0;
        this.errorCount = 0;
        this.cache = [];
        this.downloadQueue = [];
    }

    // Methods

    /**
     * 
     * @param {any} path
     */
    queueDownload(path) {
        console.log('Queueing ' + path);
        this.downloadQueue.push(path);
    }

    /** */
    isDone() {
        return this.downloadQueue.length === this.successCount + this.errorCount;
    }

    /**
     * 
     * @param {any} callback
     */
    downloadAll(callback) {
        for (let i = 0; i < this.downloadQueue.length; i++) {
            let img = new Image();
            let self = this;

            let path = this.downloadQueue[i];
            console.log(path);

            img.addEventListener('load', function () {
                console.log('Loaded ' + this.src);
                self.successCount++;
                if (self.isDone()) {
                    callback();
                }
            });

            img.addEventListener('error', function () {
                console.error('Error loading ' + this.src);
                self.errorCount++;
                if (self.isDone()) {
                    callback();
                }
            });

            img.src = path;
            this.cache[path] = img;
        }
    }

    /**
     * 
     * @param {any} path
     */
    getAsset(path) {
        return this.cache[path];
    }
}