var Renderer = (function() {
    var obj = function(ready) {
        this.tileset = new Image();
        this.tileset.src = './tileset.png';
        this.tileset.onload = ready;

        var canvas = document.getElementById('frame');
        this.ctx = canvas.getContext('2d');
        this.ctx.imageSmoothingEnabled = false;

        this.tileSize = 32;
        this.tilesPerRow = 8;

        this.scaleFactor = 2;

        this.tileWidth = 1024 / (this.tileSize * this.scaleFactor);
        this.tileHeight = 576 / (this.tileSize * this.scaleFactor);

        this.numLayers = 2;
    };

    data = [[-1, -1, 16, 17, 17, 17, 17, 17, 18, -1, 32, 33, 33, 33, 33, 34,
             -1, -1, 24, 25, 25, 25, 25, 25, 26, 23, 40, 41, 41, 41, 41, 42,
             0, 0, 0, 0, 0, 1, 0, 0, 0, 31, 5, 4, 4, 4, 4, 4,
             0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 5, 4, 4, 4, 4, 4,
             0, 0, 0, 0, 0, 1, 0, 0, 0, -1, 5, 4, 4, 4, 4, 4,
             0, 0, 0, 0, 0, 1, 0, 0, 0, -1, 5, 4, 4, 4, 4, 4,
             0, 0, 0, 0, 0, 0, 0, 0, 0, -1, 5, 4, 4, 4, 4, 4,
             0, 0, 0, 0, 0, 0, 0, 0, 0, 23, 5, 4, 4, 4, 4, 4,
             0, 0, 0, 0, 0, 0, 0, 0, 0, 31, 5, 4, 4, 4, 4, 4],
            [343, 343, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
             351, 351, -1, 176, 177, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
             -1, -1, -1, 184, 185, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
             -1, -1, 112, 184, 185, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
             -1, -1, 112, 192, 193, 194, 194, 194, 194, -1, -1, -1, -1, -1, -1, -1,
             -1, -1, 112, 200, 201, 202, 202, 202, 202, -1, -1, -1, -1, -1, -1, -1,
             -1, -1, -1, 208, 209, 210, 210, 210, 210, -1, -1, -1, -1, -1, -1, -1,
             -1, -1, -1, 112, 112, 112, 112, 112, 112, -1, -1, -1, -1, -1, -1, -1,
             -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1]];

    obj.prototype.render = function() {
        for (var layer = 0; layer < this.numLayers; layer++) {
            for (var i = 0; i < this.tileWidth; i++) {
                for (var j = 0; j < this.tileHeight; j++) {
                    var tile = data[layer][j * this.tileWidth + i];
                    if (tile >= 0) {
                        var tileRow = ~~(tile / this.tilesPerRow);
                        var tileCol = ~~(tile % this.tilesPerRow);
                        this.ctx.drawImage(this.tileset,
                                           tileCol * this.tileSize,
                                           tileRow * this.tileSize,
                                           this.tileSize,
                                           this.tileSize,
                                           i * this.tileSize * this.scaleFactor,
                                           j * this.tileSize * this.scaleFactor,
                                           this.tileSize * this.scaleFactor,
                                           this.tileSize * this.scaleFactor);
                    }
                }
            }
        }
    };

    return obj;
})();
