var People = (function() {
    var tileSize = 32;

    var scaleFactor = 2;

    var tileWidth = 1024 / (tileSize * scaleFactor);
    var tileHeight = 576 / (tileSize * scaleFactor);

    var maxFrame = 4;

    var terrain = [-2, -2, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
                   -2, -2, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
                   -2, -2, -1, -1, -2, -2, -2, -2, -2, -1, -2, -2, -2, -2, -2, -2,
                   -2, -2, -1, -1, -2, -2, -2, -2, -2, -2, -2, -2, -2, -2, -2, -2,
                   -2, -2, -1, -1, -2, -2, -2, -2, -2, -2, -2, -2, -2, -2, -2, -2,
                   -2, -2, -1, -1, -2, -2, -2, -2, -2, -2, -1, -2, -1, -1, -1, -2,
                   -2, -2, -1, -1, -1, -1, -1, -1, -1, -1, -1, -2, -1, -1, -1, -2,
                   -2, -2, -2, -2, -2, -2, -2, -2, -2, -1, -1, -2, -2, -2, -2, -2,
                   -2, -2, -2, -2, -2, -2, -2, -2, -2, -1, -2, -2, -2, -2, -2, -2];

    var borders = [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
                   -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
                   -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
                   -1, -1, -1, -1, -1,  0,  0,  0, -1, -1, -1, -1, -1, -1, -1, -1,
                   -1, -1, -1, -1, -1,  3,  3,  3, -1, -1, -1, -1, -1, -1, -1, -1,
                   -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
                   -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
                   -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
                   -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1];

    function Person(sprite, reserve, release, available, ready) {
        this.sprite = new Image();
        this.sprite.src = sprite;
        this.ready = false;
        var instance = this;
        this.sprite.onload = function() {
            instance.ready = true;
            ready();
        };
        this.frame = 0;
        this.direction = 0;

        this.interval = null;

        this.visible = false;

        this.x = -1;
        this.y = -1;

        this.goalX = -1;
        this.goalY = -1;

        this.adjX = -1;
        this.adjY = -1;

        this.partial = 0.0;
        this.path = new Array();

        this.newGoal = null;
        this.tryAgain = false;

        this.reserve = reserve;
        this.release = release;
        this.available = available;
    }

    Person.prototype.start = function() {
        var instance = this;
        this.interval = setInterval(function() {
            instance.animate.call(instance);
        }, 250);
    }

    Person.prototype.stop = function() {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
    }

    Person.prototype.animate = function() {
        this.frame = (this.frame + 1) % maxFrame;
    }

    Person.prototype.findAdjacent = function() {
        switch (this.direction) {
        case 0:
            this.adjX = this.x;
            this.adjY = this.y + 1;
            break;
         case 1:
            this.adjX = this.x - 1;
            this.adjY = this.y;
            break;
         case 2:
            this.adjX = this.x + 1;
            this.adjY = this.y;
            break;
         case 3:
            this.adjX = this.x;
            this.adjY = this.y - 1;
            break;
        }
    }

    Person.prototype.update = function(dt) {
        if (this.newGoal) {
            this.goalX = this.newGoal.x;
            this.goalY = this.newGoal.y;
            this.newGoal = null;
        }

        if (this.tryAgain) {
            if (this.recalculate()) {
                this.tryAgain = false;
            }
        }

        if (this.adjX >= 0 && this.adjY >= 0) {
            this.partial += 2.0 * dt / 1000;
            if (this.partial > 1.0) {
                this.release(this.y * tileWidth + this.x)
                this.x = this.adjX;
                this.y = this.adjY;
                this.partial = 0.0;
                this.adjX = -1;
                this.adjY = -1;
                if (this.x == this.goalX && this.y == this.goalY) {
                    this.goalX = -1;
                    this.goalY = -1;
                } else {
                    if (!this.nextMove()) {
                        this.tryAgain = true;
                    }
                }
            }
        }
    }

    Person.prototype.setGoal = function(x, y) {
        this.newGoal = {x: x, y: y};
        this.tryAgain = true;
    }

    Person.prototype.shortestPath = function(x, y, goalX, goalY) {
        var path = new Array();

        var start = y * tileWidth + x;
        var goal = goalY * tileWidth + goalX;

        if (terrain[goal] >= -1) {
            return null;
        }

        var grid = terrain.slice(0);
        grid[start] = -1;

        var frontier = [start];

        function found() {
            var index = goal;
            while (grid[index] >= 0) {
                path.push(index);
                index = grid[index];
            }
        }

        var instance = this;

        function explore(index, candidate, direction) {
            if (borders[index] != direction && grid[candidate] < -1 && instance.available.call(instance, candidate)) {
                grid[candidate] = index;
                if (candidate === goal) {
                    found();
                    return true;
                }
                frontier.push(candidate);
            }
            return false;
        }

        while (frontier.length) {
            var index = frontier.shift();
            var candidate;
            candidate = index + tileWidth;
            if (candidate < tileWidth * tileHeight) {
                if (explore(index, candidate, 0)) {
                    return path;
                }
            }
            candidate = index - 1;
            if (~~(candidate / tileWidth) == ~~(index / tileWidth)) {
                if (explore(index, candidate, 1)) {
                    return path;
                }
            }
            candidate = index + 1;
            if (~~(candidate / tileWidth) == ~~(index / tileWidth)) {
                if (explore(index, candidate, 2)) {
                    return path;
                }
            }
            candidate = index - tileWidth;
            if (candidate >= 0) {
                if (explore(index, candidate, 3)) {
                    return path;
                }
            }
        }

        return null;
    };

    Person.prototype.switchTurn = function() {
        var x = this.x;
        var y = this.y;
        this.x = this.adjX;
        this.y = this.adjY;
        this.adjX = x;
        this.adjY = y;
        this.direction = 3 - this.direction;
        this.partial = 1.0 - this.partial;
    }

    Person.prototype.legal = function(index) {
        return terrain[index] < -1 && this.available(index);
    }

    Person.prototype.nextMove = function() {
        if (!this.path.length) {
            this.tryAgain = true;
            return false;
        }
        var next = this.path.pop();
        var index = this.y * tileWidth + this.x;
        if (this.legal(next)) {
            var direction = null;
            if (next - index == tileWidth) {
                direction = 0;
            } else if (next - index == -1) {
                direction = 1;
            } else if (next - index == 1) {
                direction = 2;
            } else if (next - index == -tileWidth) {
                direction = 3;
            }
            if (direction !== null && this.reserve(next)) {
                this.direction = direction;
                this.findAdjacent();
                return true;
            }
        }
        return false
    }

    Person.prototype.recalculate = function() {
        var path = this.shortestPath(this.x, this.y, this.goalX, this.goalY);

        if (!path) {
            this.path = new Array();
            return false;
        }

        if (this.adjX >= 0 && this.adjY >= 0) {
            var alternate = this.shortestPath(this.adjX, this.adjY, this.goalX, this.goalY)
            if (alternate && this.partial + path.length > 1.0 - this.partial + alternate.length) {
                this.path = alternate;
            } else {
                this.path = path;
                this.switchTurn();
            }
            return true;
        } else {
            this.path = path;
            return this.nextMove();
        }
    };

    var obj = function(ready) {
        this.ready = ready;
        this.noMore = false;
        this.people = new Array();
        this.reservations = [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
                             -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
                             -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
                             -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
                             -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
                             -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
                             -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
                             -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
                             -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1];
    };

    obj.prototype.update = function(dt) {
        for (var i = 0; i < this.people.length; i++) {
            if (this.people[i].visible) {
                this.people[i].update(dt);
            }
        }
    }

    obj.prototype.add = function(sprite) {
        var id = this.people.length;
        var instance = this;
        var person = new Person(sprite, function(index) {
            return instance.reserve.call(instance, index, id);
        }, function(index) {
            return instance.release.call(instance, index, id);
        }, function(index) {
            return instance.available.call(instance, index, id);
        }, function() {
            instance.spriteLoaded.call(instance);
        });
        this.people.push(person);
        return person;
    };

    obj.prototype.done = function() {
        this.noMore = true;
        this.spriteLoaded();
    }

    obj.prototype.spriteLoaded = function() {
        if (this.noMore) {
            for (var i = 0; i < this.people.length; i++) {
                if (!this.people[i].ready) {
                    return;
                }
            }
            this.ready();
        }
    }

    obj.prototype.start = function() {
        for (var i = 0; i < this.people.length; i++) {
            this.people[i].start();
        }
    }

    obj.prototype.reserve = function(index, id) {
        var value = this.reservations[index];
        if (value < 0 || value == id) {
            this.reservations[index] = id;
            return true;
        } else {
            return false;
        }
    }

    obj.prototype.release = function(index, id) {
        var value = this.reservations[index];
        if (value == id) {
            this.reservations[index] = -1;
            return true;
        } else {
            return false;
        }
    }

    obj.prototype.available = function(index, id) {
        var value = this.reservations[index];
        return value < 0 || value == id;
    }

    return obj;
})();
