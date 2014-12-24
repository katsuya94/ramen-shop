$(function() {
    var fps = 30;

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

    people.add('karis.png');
    people.done();

    var renderer = new Renderer(people, function() {
        rendererReady = true;
        if (ready()) {
            start();
        }
    });

    function frame() {
        renderer.render();

        requestAnimationFrame(frame);
    }

    function start() {
        people.people[0].start();
        setTimeout(frame, 0);
    }
});
