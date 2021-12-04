var output = function (input) {
    var height = window.innerHeight;
    var width = window.innerWidth;
    var bigStars;
    var mediumStars;
    var tinyStars;
    var ships;

    class Shape {
        constructor(size, x, y) {
            this.size = size;
            this.x = x;
            this.y = y;
        }
        move = function (dx, dy) {
            this.x += dx;
            this.y += dy;
        };
        draw = function (){};
    }

    class Star extends Shape {
        constructor(size, x, y) {
            super(size, x, y);
        }
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

    class Ship extends Shape {
        constructor(size, x, y) {
            super(size, x, y);
            this.direction = 180;
        }
        draw = function () {
            input.noStroke();
            input.fill(256, 256, 256, 256);
            input.rect(
                this.x, 
                this.y, 
                this.size,
                this.size
            );
        }
        point = function () {
            if (input.mouseX < width / 2) {
                this.direction = Math.abs(360  - ((width / 2) - input.mouseX));
            } else {
                this.direction = Math.abs(((width / 2) - input.mouseX));
            }
            console.log(this.direction);
        }
        move = function () {
            var dx;
            var dy;
            if (this.direction >= 0 && this.direction < 90) {
                dx = this.direction;
                dy = -1 * (90 - this.direction);
            } else if (this.direction >= 90 && this.direction < 180) {
                dx = 180 - this.direction;
                dy = this.direction - 90;
            } else if (this.direction >= 180 && this.direction < 270) {
                dx = -1 * (this.direction - 180);
                dy = 270 - this.direction;
            } else if (this.direction >= 270 && this.direction < 360) {
                dx = this.direction - 360;
                dy = -1 * (this.direction - 270);
            }
            this.x += 2 * (dx / 90);
            this.y += 2 * (dy / 90);
        };
    }

    var drawStars = function (stars) {
        for (var i = 0; i < stars.length; i++) {
            stars[i].draw();
        }
    };

    document.addEventListener('keydown', recordKey);
    function recordKey(e) {
        switch (e.key) {
            case "w":
                ships[0].move();
                break;
        }
    }

    input.setup = function () {
        input.createCanvas(width, height);
        var starCount = 20 + Math.floor(Math.random() * 20);

        bigStars = new Array(starCount);
        mediumStars = new Array(starCount);
        tinyStars = new Array(starCount);
        ships = new Array(1);
        ships[0] = new Ship(7, width / 2, height / 2);

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
        ships[0].point();
        drawStars(ships);
        drawStars(bigStars);
        drawStars(mediumStars);
        drawStars(tinyStars);
    };
};

var display = new p5(output, "canvas");

