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
                   -2, -2, -1, -1, -1, -1, -1, -1, -1, -1, -2, -2, -2, -2, -2, -2,
                   -2, -2, -1, -1, -1, -1, -1, -1, -1, -1, -2, -2, -2, -2, -2, -2,
                   -2, -2, -2, -2, -2, -2, -2, -2, -2, -1, -2, -2, -2, -2, -2, -2,
                   -2, -2, -2, -2, -2, -2, -2, -2, -2, -1, -2, -2, -2, -2, -2, -2];

    function Person(sprite, x, y, reserve, release, available, ready) {
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

        this.x = x;
        this.y = y;

        this.goalX = -1;
        this.goalY = -1;

        this.partial = 0.0;
        this.path = new Array();

        this.pending = null;

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

    Person.prototype.update = function(dt) {
        if (this.pending) {
            var instance = this;
            this.pending.call(instance, this.pending);
            this.pending = null;
        }

        if (this.goalX >= 0 && this.goalY >= 0) {
            this.partial += 2.0 * dt / 1000;
            if (this.partial > 1.0) {
                this.release(this.y * tileWidth + this.x)
                switch (this.direction) {
                case 0:
                    this.y++;
                    break;
                case 1:
                    this.x--;
                    break;
                case 2:
                    this.x++;
                    break;
                case 3:
                    this.y--;
                    break;
                }
                this.partial = 0.0;
                this.nextMove();
            }
        }
    }

    Person.prototype.setGoal = function(x, y) {
        this.pending = function() {
            if (this.goalX === x && this.goalY === y) {
                return;
            }
            this.goalX = x;
            this.goalY = y;
            this.recalculate();
        }
    };

    Person.prototype.shortestPath = function(x, y, goalX, goalY) {
        var path = new Array();

        var start = y * tileWidth + x;
        var goal = goalY * tileWidth + goalX;

        if (terrain[goal] >= -1) {
            return path;
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

        function explore(index, candidate) {
            if (grid[candidate] < -1 && instance.available.call(instance, candidate)) {
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
            candidate = index - tileWidth;
            if (candidate >= 0) {
                if (explore(index, candidate)) {
                    return path;
                }
            }
            candidate = index - 1;
            if (~~(candidate / tileWidth) == ~~(index / tileWidth)) {
                if (explore(index, candidate)) {
                    return path;
                }
            }
            candidate = index + 1;
            if (~~(candidate / tileWidth) == ~~(index / tileWidth)) {
                if (explore(index, candidate)) {
                    return path;
                }
            }
            candidate = index + tileWidth;
            if (candidate < tileWidth * tileHeight) {
                if (explore(index, candidate)) {
                    return path;
                }
            }
        }

        return path;
    };

    Person.prototype.switchTurn = function() {
        switch (this.direction) {
        case 0:
            this.y++;
            break;
        case 1:
            this.x--;
            break;
        case 2:
            this.x++;
            break;
        case 3:
            this.y--;
            break;
        }
        this.direction = 3 - this.direction;
        this.partial = 1.0 - this.partial;
    }

    Person.prototype.legal = function(index) {
        return terrain[index] < -1;
    }

    Person.prototype.nextMove = function() {
        if (!this.path.length) {
            this.goalX = -1;
            this.goalY = -1;
            return;
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
                return;
            }
        }
        this.recalculate();
    }

    Person.prototype.recalculate = function() {
        var path = this.shortestPath(this.x, this.y, this.goalX, this.goalY);

        if (this.partial > 0.0) {
            var altX, altY;
            switch (this.direction) {
            case 0:
                altX = this.x;
                altY = this.y + 1;
                break;
            case 1:
                altX = this.x - 1;
                altY = this.y;
                break;
            case 2:
                altX = this.x + 1;
                altY = this.y;
                break;
            case 3:
                altX = this.x;
                altY = this.y - 1;
                break;
            }
            var alternate = this.shortestPath(altX, altY, this.goalX, this.goalY)
            if (this.partial + path.length < 1.0 - this.partial + alternate.length) {
                this.path = path;
                this.switchTurn();
            } else {
                this.path = alternate;
            }
        } else {
            this.path = path;
            this.nextMove();
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
            this.people[i].update(dt);
        }
    }

    obj.prototype.add = function(sprite, x, y) {
        var id = this.people.length;
        var instance = this;
        var person = new Person(sprite, x, y, function(index) {
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
        if (this.reservations[index] < 0) {
            this.reservations[index] = id;
            return true;
        } else {
            return false;
        }
    }

    obj.prototype.release = function(index, id) {
        if (this.reservations[index] == id) {
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
