var People = (function() {
    var maxFrame = 4;

    function Person(sprite, ready) {
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

    var obj = function(ready) {
        this.ready = ready;
        this.noMore = false;
        this.people = new Array();
    };

    obj.prototype.add = function(sprite) {
        var instance = this;
        this.people.push(new Person(sprite, function() {
            instance.spriteLoaded.call(instance);
        }));
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

    return obj;
})();
