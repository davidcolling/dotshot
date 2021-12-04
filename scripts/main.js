var output = function (input) {
    class Star {
        constructor(size, x, y) {
            this.size = size;
            this.x = x;
            this.y = y;
        }
    }

    class ShootingStar extends Star {
        constructor(size, x, y) {
            super(size, x, y);
            this.dx = 5 * (Math.random() - 0.5);
            this.dy = 5 * (Math.random() - 0.5);
        };

        move = function () {
            this.x += this.dx;
            this.y += this.dy;
        };
    }

    var height = window.innerHeight;
    var width = window.innerWidth;
    var currentShootingStarAge = 0;

    input.setup = function () {
        input.createCanvas(width, height);
        var starCount = 20 + Math.floor(Math.random() * 20);
        bigStars = new Array(starCount);
        mediumStars = new Array(starCount);
        tinyStars = new Array(starCount);
        shootingStars = new Array(1);
        shootingStars[0] = null;
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

        p = new ShootingStar(
            2, 
            Math.floor(Math.random() * width), 
            Math.floor(Math.random() * height), 
        );

        drawStars(bigStars);
        drawStars(mediumStars);
        drawStars(tinyStars);
    };

    var drawStars = function (stars) {
        for (var i = 0; i < stars.length; i++) {
            input.noStroke();
            input.fill(256, 256, 256, 256);
            input.circle(
                stars[i].x, 
                stars[i].y, 
                stars[i].size
            );
        }
    };

    var twinkleStars = function (stars) {
        for (var i = 0; i < stars.length; i++) {
            if (stars[i].size == 3) {
                if (Math.random() < 0.001) {
                    stars[i].size = 10;
                }
            } else {
                stars[i].size = 3;
            }
        }
    };
};

var display = new p5(output, "canvas");

document.addEventListener('keydown', recordKey);
function recordKey(e) {
    switch (e.key) {
        case "w":

}
