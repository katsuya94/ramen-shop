$(function() {
    var fps = 30;

    var rendererReady = false;

    function ready() {
        return rendererReady;
    }

    var renderer = new Renderer(function() {
        rendererReady = true;
        if (ready()) {
            start();
        }
    });

    function frame() {
        setTimeout(function() {
            requestAnimationFrame(frame);
        }, 1000 / fps);

        renderer.render();
    }

    function start() {
        setTimeout(frame, 0);
    }
});
