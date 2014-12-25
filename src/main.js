$(function() {
    var fps = 30;
    var tileSize = 32;
    var scaleFactor = 2;

    var canvas = document.getElementById('frame');

    var seats = [{x: 1, y: 2},
                 {x: 1, y: 3},
                 {x: 1, y: 4},
                 {x: 1, y: 5},
                 {x: 2, y: 7},
                 {x: 3, y: 7},
                 {x: 4, y: 7},
                 {x: 5, y: 7},
                 {x: 6, y: 7},
                 {x: 7, y: 7},
                 {x: 8, y: 7}];

    function getPos(evt) {
        var rect = canvas.getBoundingClientRect();
        return {
            x: ~~((evt.clientX - rect.left) / (tileSize * scaleFactor)),
            y: ~~((evt.clientY - rect.top) / (tileSize * scaleFactor))
        }
    }

    canvas.addEventListener('mousemove', function(evt) {
        var coord = getPos(evt);
        renderer.highlight(coord.x, coord.y);
    });

    canvas.addEventListener('mousedown', function(evt) {
        var coord = getPos(evt);
        karis.setGoal(coord.x, coord.y);
    });

    var peopleReady = false;
    var rendererReady = false;

    function ready() {
        return peopleReady && rendererReady;
    }

    var people = new People(function() {
        peopleReady = true;
        if (ready()) {
            start();
        }
    });

    var karis = people.add('karis.png', 4, 3);

    var customers = [people.add('customerm.png', 0, 2),
                     people.add('customerf.png', 0, 4),
                     people.add('customerm.png', 0, 6),
                     people.add('customerf.png', 0, 8)]

    people.done();

    var renderer = new Renderer(canvas, people, function() {
        rendererReady = true;
        if (ready()) {
            start();
        }
    });

    var last;

    function frame() {
        var now = new Date();
        dt = now - last;
        last = now;

        people.update(dt);
        renderer.render();

        requestAnimationFrame(frame);
    }

    function start() {
        people.start();
        setInterval(function() {
            for (var i = 0; i < customers.length; i++) {
                var coord = seats[~~(Math.random() * seats.length)];
                customers[i].setGoal(coord.x, coord.y);
            }
        }, 4000);
        last = new Date();
        setTimeout(frame, 0);
    }
});
