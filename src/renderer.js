var Renderer = (function() {
    var tileSize = 32;
    var tilesPerRow = 8;

    var scaleFactor = 2;

    var tileWidth = 1024 / (tileSize * scaleFactor);
    var tileHeight = 576 / (tileSize * scaleFactor);

    var numBgLayers = 1;
    var numFgLayers = 1;

    var obj = function(people, ready) {
        this.people = people;

        this.tileset = new Image();
        this.tileset.src = './tileset.png';
        this.tileset.onload = ready;

        var canvas = document.getElementById('frame');
        this.ctx = canvas.getContext('2d');
        this.ctx.imageSmoothingEnabled = false;
    };

    data = [[8, 16, 17, 17, 17, 17, 17, 17, 18, 6, 32, 33, 33, 33, 33, 34,
             8, 24, 25, 25, 25, 25, 25, 25, 26, 23, 40, 41, 41, 41, 41, 42,
             0, 0, 0, 0, 1, 0, 0, 0, 0, 31, 5, 4, 4, 4, 4, 4,
             0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4,
             0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4,
             0, 0, 0, 0, 0, 0, 0, 0, 0, -1, 5, 4, 4, 4, 4, 4,
             0, 0, 0, 0, 0, 0, 0, 0, 0, -1, 5, 4, 4, 4, 4, 4,
             0, 0, 0, 0, 0, 0, 0, 0, 0, -1, 5, 4, 4, 4, 4, 4,
             0, 0, 0, 0, 0, 0, 0, 0, 0, -1, 5, 4, 4, 4, 4, 4],
            [343, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
             351, -1, 176, 177, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
             -1, 112, 184, 185, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
             -1, 112, 184, 185, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
             -1, 112, 192, 193, 194, 194, 194, 194, 194, 7, -1, -1, -1, -1, -1, -1,
             -1, 112, 200, 201, 202, 202, 202, 202, 202, 15, -1, -1, -1, -1, -1, -1,
             -1, -1, 208, 209, 210, 210, 210, 210, 210, 6, -1, -1, -1, -1, -1, -1,
             -1, -1, 112, 112, 112, 112, 112, 112, 112, 23, -1, -1, -1, -1, -1, -1,
             -1, -1, -1, -1, -1, -1, -1, -1, -1, 31, -1, -1, -1, -1, -1, -1]];

    obj.prototype.renderLayer = function(layer) {
        for (var i = 0; i < tileWidth; i++) {
            for (var j = 0; j < tileHeight; j++) {
                var tile = data[layer][j * tileWidth + i];
                if (tile >= 0) {
                    var tileRow = ~~(tile / tilesPerRow);
                    var tileCol = ~~(tile % tilesPerRow);
                    this.ctx.drawImage(this.tileset,
                                       tileCol * tileSize,
                                       tileRow * tileSize,
                                       tileSize,
                                       tileSize,
                                       i * tileSize * scaleFactor,
                                       j * tileSize * scaleFactor,
                                       tileSize * scaleFactor,
                                       tileSize * scaleFactor);
                }
            }
        }
    }

    obj.prototype.render = function() {
        for (var layer = 0; layer < numBgLayers; layer++) {
            this.renderLayer(layer);
        }
        for (var i = 0; i < this.people.people.length; i++) {
            var person = this.people.people[i];
            var frame = 2 - Math.abs(person.frame - 2);
            console.log(frame);
            this.ctx.drawImage(person.sprite,
                               tileSize * frame,
                               tileSize * person.direction,
                               tileSize,
                               tileSize,
                               tileSize * 4 * scaleFactor,
                               tileSize * 3 * scaleFactor,
                               tileSize * scaleFactor,
                               tileSize * scaleFactor);
        }
        for (var layer = numBgLayers; layer < numBgLayers + numFgLayers; layer++) {
            this.renderLayer(layer);
        }
    };

    return obj;
})();
