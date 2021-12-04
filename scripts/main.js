var output = function (input) {
    class Star {
        constructor(size, x, y) {
            this.size = size;
            this.x = x;
            this.y = y;
        }
        move = function (dx, dy) {
            this.x += dx;
            this.y += dy;
        };
        draw = function () {
            input.noStroke();
            input.fill(256, 256, 256, 256);
            input.circle(
                this.x, 
                this.y, 
                this.size
            );
        }
    }

    var height = window.innerHeight;
    var width = window.innerWidth;
    var bigStars;
    var mediumStars;
    var tinyStars;
    var shootingStars;

    input.setup = function () {
        input.createCanvas(width, height);
        var starCount = 20 + Math.floor(Math.random() * 20);

        bigStars = new Array(starCount);
        mediumStars = new Array(starCount);
        tinyStars = new Array(starCount);
        shootingStars = new Array(1);
        shootingStars[0] = new Star(2, 10, 10);

        for (var i = 0; i < starCount; i++) {
            bigStars[i] = new Star(
                3, 
                Math.floor(Math.random() * width), 
                Math.floor(Math.random() * height)
            );
            mediumStars[i] = new Star(
                2, 
                Math.floor(Math.random() * width), 
                Math.floor(Math.random() * height)
            );
            tinyStars[i] = new Star(
                1, 
                Math.floor(Math.random() * width), 
                Math.floor(Math.random() * height)
            );
        }
    };

    input.draw = function () {
        input.clear();
        drawStars(shootingStars);
        drawStars(bigStars);
        drawStars(mediumStars);
        drawStars(tinyStars);
    };

    var drawStars = function (stars) {
        for (var i = 0; i < stars.length; i++) {
            stars[i].draw();
        }
    };

    document.addEventListener('keydown', recordKey);
    function recordKey(e) {
        switch (e.key) {
            case "w":
                shootingStars[0].move(0, -5);
                break;
            case "s":
                shootingStars[0].move(0, 5);
                break;
            case "d":
                shootingStars[0].move(5, 0);
                break;
            case "a":
                shootingStars[0].move(-5, 0);
                break;
        }
    }
};

var display = new p5(output, "canvas");

