var Renderer = (function() {
    var tileSize = 32;
    var tilesPerRow = 8;

    var scaleFactor = 2;

    var tileWidth = 1024 / (tileSize * scaleFactor);
    var tileHeight = 576 / (tileSize * scaleFactor);

    var numBgLayers = 3;
    var numFgLayers = 2;

    var obj = function(canvas, people, ready) {
        this.ctx = canvas.getContext('2d');
        this.ctx.imageSmoothingEnabled = false;

        this.people = people;

        this.tileset = new Image();
        this.tileset.src = './tileset.png';
        this.tileset.onload = ready;

        this.highlightX =  -1;
        this.highlightY =  -1;
    };

    var data = [[  8,  16,  17,  17,  17,  17,  17,  17,  18,   6,  32,  33,  33,  33,  33,  34,
                   8,  24,  25,  25,  25,  25,  25,  25,  26,  23,  40,  41,  41,  41,  41,  42,
                   0,   0,   0,   0,   0,   0,   0,   0,   0,  31,   5,   4,   4,   4,   4,   4,
                   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   4,   4,   4,   4,   4,   4,
                   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   4,   4,   4,   4,   4,   4,
                   0,   0,   0,   0,   0,   0,   0,   0,   0,  -1,   5,   4,   4,   4,   4,   4,
                   0,   0,   0,   0,   0,   0,   0,   0,   0,  -1,   5,   4,   4,   4,   4,   4,
                   0,   0,   0,   0,   0,   0,   0,   0,   0,  -1,   5,   4,   4,   4,   4,   4,
                   0,   0,   0,   0,   0,   0,   0,   0,   0,  -1,   5,   4,   4,   4,   4,   4],
                [ -1,  -1,  -1,  -2,  -1, 321, 178, 186,  -1,  -1, 248, 249, 248, 249, 248, 249,
                  -1,  -1, 176, 177, 250, 251, 251, 251, 252,  -1, 256, 257, 256, 257, 256, 257,
                  -1,  -1, 184, 185, 266, 267, 267, 267, 268,  -1, 264, 265, 264, 265, 264, 265,
                  -1, 128, 184, 185,  -1,  -1,  -1,  -1,  -1,  -1,  -1,  -1,  -1,  -1,  -1,  -1,
                  -1, 128, 184, 185,  -1, 266, 267, 268,  -1,  -1,  -1,  -1,  -1,  -1,  -1,  -1,
                  -1, 128, 192, 193,  -1,  -1,  -1,  -1,  -1,  -1, 261,  -1, 258, 259, 260,  -1,
                  -1, 128, 200, 201, 202, 202, 202, 202, 202,  -1, 261,  -1, 258, 259, 260,  -1,
                  -1, 128, 208, 209, 210, 210, 210, 210, 210,  -1, 261,  -1, 266, 267, 268,  -1,
                  -1,  -1,  -1,  -1,  -1,  -1,  -1,  -1,  -1,  -1, 277,  -1,  -1,  -1,  -1,  -1],
                [ -1,  -1,  91,  -1,  -1,  -1,  -1,  -1,  -1,  -1,  -1,  -1,  -1,  -1,  -1,  -1,
                  -1,  -1,  99,  -1,  -1,  -1,  -1,  -1,  -1,  -1,  -1,  -1,  -1,  -1,  -1,  -1,
                  -1, 120,  -1,  -1,  -1,  -1,  -1,  -1,  -1,  -1,  -1,  -1,  -1,  -1,  -1,  -1,
                  -1, 120,  -1,  -1,  -1,  -1,  -1,  -1,  -1,  -1,  -1,  -1,  -1,  -1,  -1,  -1,
                  -1, 120,  -1,  -1,  -1,  -1,  -1,  -1,  -1,  -1,  -1,  -1,  -1,  -1,  -1,  -1,
                  -1, 120,  -1,  -1,  -1,  -1,  -1,  -1,  -1,  -1,  -1,  -1,  -1,  -1,  -1,  -1,
                  -1, 120,  -1,  -1,  -1,  -1,  -1,  -1,  -1,  -1,  -1,  -1,  -1,  -1,  -1,  -1,
                  -1,  -1,  -1, 120, 120, 120, 120, 120, 120,  -1,  -1,  -1,  -1,  -1,  -1,  -1,
                  -1,  -1,  -1, 128, 128, 128, 128, 128, 128,  -1,  -1,  -1,  -1,  -1,  -1,  -1],
                [343,  -1,  -1,  -1,  -1,  -1,  -1,  -1, 222,  -1,  -1,  -1,  -1,  -1,  -1,  -1,
                 351,  -1,  -1,  -1,  81,  -1,  -1,  -1, 230,  -1,  -1,  -1,  -1,  -1,  -1,  -1,
                  -1,  -1,  -1, 142,  -1,  -1,  -1,  -1,  -1,  -1,  -1,  -1,  -1,  -1,  -1,  -1,
                  -1,  -1,  -1, 142,  -1, 250, 251, 252,  -1,  -1,  -1,  -1,  -1,  -1,  -1,  -1,
                  -1,  -1,  -1,  -1,  -1,  -1,  -1,  -1,  -1,   7, 253,  -1, 250, 251, 252,  -1,
                  -1,  -1,  -1,  -1, 194, 194, 194, 194, 194,  15, 273,  -1, 272,  -1,  -1,  -1,
                  -1,  -1,  -1,  -1,  -1,  -1,  -1,  -1,  -1,   6, 262,  -1, 181,  -1,  -1,  -1,
                  -1,  -1,  -1,  -1,  -1,  -1,  -1,  -1,  -1,  23, 262,  -1,  -1,  -1,  -1,  -1,
                  -1,  -1,  -1,  -1,  -1,  -1,  -1,  -1,  -1,  31,  -1,  -1,  -1,  -1,  -1,  -1],
                [ -1,  -1,  -1,  -1,  -1,  -1,  -1,  -1,  -1,  -1,  -1,  -1,  -1,  -1,  -1,  -1,
                  -1,  -1, 158,  -1,  -1,  -1,  -1,  -1,  -1,  -1,  -1,  -1,  -1,  -1,  -1,  -1,
                  -1,  -1, 166,  -1,  -1,  -1,  -1,  -1,  -1,  -1,  -1,  -1,  -1,  -1,  -1,  -1,
                  -1,  -1,  -1,  -1,  -1, 220, 236, 236,  -1,  -1,  -1,  -1,  -1,  -1,  -1,  -1,
                  -1,  -1,  -1,  -1,  -1,  -1,  -1,  -1,  -1,  -1,  81,  -1,  -1,  -1,  -1,  -1,
                  -1,  -1,  -1, 159,  -1,  -1,  -1,  -1, 158,  -1,  -1,  -1,  -1,  -1,  -1,  -1,
                  -1,  -1,  -1, 167,  -1,  -1,  -1,  -1, 166,  -1,  -1,  -1,  -1,  -1,  -1,  -1,
                  -1,  -1,  -1,  -1,  -1,  -1,  -1,  -1,  -1,  -1,  -1,  -1,  -1,  -1,  -1,  -1,
                  -1,  -1,  -1,  -1,  -1,  -1,  -1,  -1,  -1,  -1,  -1,  -1,  -1,  -1,  -1,  -1]];

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

    obj.prototype.render = function(getText) {
        this.ctx.globalAlpha = 1.0;

        for (var layer = 0; layer < numBgLayers; layer++) {
            this.renderLayer(layer);
        }

        for (var i = 0; i < this.people.people.length; i++) {
            var person = this.people.people[i];
            if (person.visible) {
                var frame = 2 - Math.abs(person.frame - 2);

                var x, y;

                if (person.adjX < 0 && person.adjY < 0) {
                    x = person.x;
                    y = person.y;
                } else {
                    x = person.x * (1.0 - person.partial) + person.adjX * person.partial;
                    y = person.y * (1.0 - person.partial) + person.adjY * person.partial;
                }

                this.ctx.drawImage(person.sprite,
                                   tileSize * frame,
                                   tileSize * person.direction,
                                   tileSize,
                                   tileSize,
                                   ~~(tileSize * x) * scaleFactor,
                                   ~~(tileSize * y) * scaleFactor,
                                   tileSize * scaleFactor,
                                   tileSize * scaleFactor);
            }
        }

        for (var layer = numBgLayers; layer < numBgLayers + numFgLayers; layer++) {
            this.renderLayer(layer);
        }

        // this.ctx.fillStyle = '#FF0000';
        // this.ctx.globalAlpha = 0.2;

        // for (var i = 0; i < tileWidth; i++) {
        //     for (var j = 0; j < tileHeight; j++) {
        //         if (this.people.reservations[j * tileWidth + i] >= 0) {
        //             this.ctx.fillRect(i * tileSize * scaleFactor,
        //                               j * tileSize * scaleFactor,
        //                               tileSize * scaleFactor,
        //                               tileSize * scaleFactor);
        //         }
        //     }
        // }

        if (this.highlightX >= 0 && this.highlightY >= 0) {
            var date = new Date()

            this.ctx.fillStyle = '#FFFFFF';
            this.ctx.globalAlpha = 0.1 + 0.1 * Math.abs(date.getMilliseconds() - 500) / 500;
            this.ctx.fillRect(this.highlightX * tileSize * scaleFactor,
                              this.highlightY * tileSize * scaleFactor,
                              tileSize * scaleFactor,
                              tileSize * scaleFactor);

            var text = getText(this.highlightX, this.highlightY);

            if (text) {
                this.ctx.globalAlpha = 1.0;
                this.ctx.font = '24px lcd-solid';
                this.ctx.textAlign = 'center';
                this.ctx.lineWidth = 6;
                this.ctx.strokeStyle = '#000000';
                this.ctx.strokeText(text, 512, 568);
                this.ctx.fillStyle = '#FFFFFF';
                this.ctx.fillText(text, 512, 568);
            }
        }

        // this.ctx.globalAlpha = 1.0
        // this.ctx.strokeStyle = '#0000FF';

        // for (var i = 0; i < this.people.people.length; i++) {
        //     var person = this.people.people[i];
        //     if (person.goalX >= 0 && person.goalY >= 0) {
        //         this.ctx.beginPath();
        //         this.ctx.moveTo((person.x + 0.5) * tileSize * scaleFactor,
        //                         (person.y + 0.5) * tileSize * scaleFactor);
        //         for (var j = person.path.length - 1; j >= 0; j--) {
        //             var x = person.path[j] % tileWidth;
        //             var y = ~~(person.path[j] / tileWidth);
        //             this.ctx.lineTo((x + 0.5) * tileSize * scaleFactor,
        //                             (y + 0.5) * tileSize * scaleFactor);
        //         }
        //         this.ctx.stroke();
        //     }
        // }
    };

    obj.prototype.highlight = function(x, y) {
        if (x < 0 || x >= tileWidth) {
            this.highlightX =  -1;
        } else {
            this.highlightX = x;
        }

        if (y < 0 || y >= tileHeight) {
            this.highlightY =  -1;
        } else {
            this.highlightY = y;
        }
    }

    return obj;
})();
