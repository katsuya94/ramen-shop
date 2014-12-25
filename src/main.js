$(function() {
    var fps = 30;
    var tileSize = 32;
    var scaleFactor = 2;

    var canvas = document.getElementById('frame');

    var state = {
        seats: [
            {x: 1, y: 2, occupant: null, direction: 2},
            {x: 1, y: 3, occupant: null, direction: 2},
            {x: 1, y: 4, occupant: null, direction: 2},
            {x: 1, y: 5, occupant: null, direction: 2},
            {x: 3, y: 7, occupant: null, direction: 3},
            {x: 4, y: 7, occupant: null, direction: 3},
            {x: 5, y: 7, occupant: null, direction: 3},
            {x: 6, y: 7, occupant: null, direction: 3},
            {x: 7, y: 7, occupant: null, direction: 3},
            {x: 8, y: 7, occupant: null, direction: 3}
        ]
    };

    function getPos(evt) {
        var rect = canvas.getBoundingClientRect();
        return {
            x: ~~((evt.clientX - rect.left) / (tileSize * scaleFactor)),
            y: ~~((evt.clientY - rect.top) / (tileSize * scaleFactor))
        };
    }

    canvas.addEventListener('mousemove', function(evt) {
        var coord = getPos(evt);
        renderer.highlight(coord.x, coord.y);
    });

    canvas.addEventListener('mouseout', function(evt) {
        renderer.highlight(-1, -1);
    });

    canvas.addEventListener('mousedown', function(evt) {
        var coord = getPos(evt);
        console.log(coord);
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

    var karis = people.add('karis.png');
    karis.x = 4;
    karis.y = 3;
    karis.visible = true;

    var customers = [people.add('customer0.png'),
                     people.add('customer0.png'),
                     people.add('customer1.png'),
                     people.add('customer1.png'),
                     people.add('customer2.png'),
                     people.add('customer2.png'),
                     people.add('customer3.png'),
                     people.add('customer3.png')];

    people.done();

    var renderer = new Renderer(canvas, people, function() {
        rendererReady = true;
        if (ready()) {
            start();
        }
    });

    var text = new Array();

    text[0 * 16 + 8] = 'Grab Donburi';
    text[1 * 16 + 8] = 'Grab Donburi';

    text[1 * 16 + 10] = 'Grab Pork';
    text[1 * 16 + 11] = 'Grab Fish';
    text[1 * 16 + 12] = 'Grab Bean Sprouts';
    text[1 * 16 + 13] = 'Grab Leek';
    text[1 * 16 + 14] = 'Grab Bamboo Shoots';
    text[1 * 16 + 15] = 'Grab Egg';
    text[2 * 16 + 10] = 'Grab Pork';
    text[2 * 16 + 11] = 'Grab Fish';
    text[2 * 16 + 12] = 'Grab Bean Sprouts';
    text[2 * 16 + 13] = 'Grab Leek';
    text[2 * 16 + 14] = 'Grab Bamboo Shoots';
    text[2 * 16 + 15] = 'Grab Egg';

    text[2 * 16 + 3] = 'No Donburi to add Soy Sauce to';
    text[3 * 16 + 3] = 'No Donburi to add Chili Oil to';
    text[1 * 16 + 4] = 'No Donburi to add Miso to';

    text[3 * 16 + 5] = 'Tap Beer';
    text[3 * 16 + 6] = 'Pour Sake';
    text[3 * 16 + 7] = 'Pour Sake';
    text[3 * 16 + 7] = 'Pour Sake';

    text[4 * 16 + 10] = 'Grab Garlic';

    text[5 * 16 + 10] = 'Wash Hands';

    text[5 * 16 + 12] = 'Nothing to Trash';
    text[6 * 16 + 12] = 'Nothing to Cut';
    text[6 * 16 + 10] = 'Nothing to Cook';
    text[7 * 16 + 10] = 'Nothing to Cook';

    function getText(x, y) {
        var value = text[y * 16 + x];
        if (typeof(value) === 'function') {
            return value();
        } else {
            return value;
        }
    }

    var last;

    function frame() {
        var now = new Date();
        dt = now - last;
        last = now;

        if (Math.random() < 0.1 * dt / 1000) {
            invisible = new Array();
            for (var i = 0; i < people.people.length; i++) {
                if (!people.people[i].visible) {
                    invisible.push(people.people[i]);
                }
            }
            if (invisible.length) {
                var person = invisible[~~(Math.random() * invisible.length)];
                person.x = 0;
                person.y = 1;
                person.visible = true;
                person.start();
                person.objective = 0;
            }
        }

        people.think(state);
        people.update(dt);
        renderer.render(getText);

        requestAnimationFrame(frame);
    }

    function start() {
        karis.start();
        last = new Date();
        setTimeout(frame, 0);
    }
});
