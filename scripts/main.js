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

    class Moveable extends Shape {
        constructor(size, x, y, direction) {
            super(size, x, y);
            this.direction = direction;
        }
        move = function (velocity) {
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
            this.x += velocity * (dx / 90);
            this.y += velocity * (dy / 90);
        };
    }

    class Bullet extends Moveable {
        constructor(x, y, direction) {
            super(3, x, y, direction);
            this.age = 0;
        }
        draw = function () {
            input.noStroke();
            input.fill(256, 256, 256, 256);
            input.circle(
                this.x, 
                this.y, 
                this.size,
            );
            this.age++;
        }
    }

    class Steerable extends Moveable {
        constructor(size, x, y) {
            super(size, x, y);
            this.bullets = new Array(1);
            this.bullets[0] = new Bullet(x, y, 0);
        }
        point = function (x1, y1, x2, y2) {
            var dx = x1 - x2;
            var dy = y1 - y2;

            var directionToPrey;

            if (dx != 0 && dy != 0) {
                if (dx < 0 && dy > 0) { // target is in quadrant 1
                    directionToPrey = Math.atan2(Math.abs(dx), Math.abs(dy)) * (180 / Math.PI);
                } else if (dx < 0 && dy < 0) { // target is in q2
                    directionToPrey = Math.atan2(Math.abs(dy), Math.abs(dx)) * (180 / Math.PI);
                    directionToPrey += 90;
                } else if (dx > 0 && dy < 0) { // q3
                    directionToPrey = Math.atan2(Math.abs(dx), Math.abs(dy)) * (180 / Math.PI);
                    directionToPrey += 180;
                } else if (dx > 0 && dy > 0) { // q4
                    directionToPrey = Math.atan2(Math.abs(dy), Math.abs(dx)) * (180 / Math.PI);
                    directionToPrey += 270;
                }
                this.direction = directionToPrey;
            }
        }
        drawBullets = function () {
            for (var i = 0; i < this.bullets.length; i++) {
                if (this.bullets[i].age < 30) {
                    this.bullets[i].move(15);
                    this.bullets[i].draw();
                } else {
                    this.bullets.pop(i)
                }
            }
        }
        fire = function() {
            var bullet = new Bullet(this.x, this.y, this.direction);
            this.bullets.push(bullet);
        }
    }

    class Ship extends Steerable {
        constructor(size, x, y) {
            super(size, x, y);
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
    }

    class Pirate extends Steerable {
        constructor(size, x, y) {
            super(size, x, y);
        }
        draw = function () {
            input.noStroke();
            input.fill(256, 0, 0, 256);
            input.rect(
                this.x, 
                this.y, 
                this.size,
                this.size
            );
        }
    };

    var drawAll = function (stars) {
        for (var i = 0; i < stars.length; i++) {
            stars[i].draw();
        }
    };

    var moveBullets = function(bullets) {
        for (var i = 0; i < bullets.length; i++) {
            if (bullets[i].age < 30) {
                bullets[i].move(15);
            } else {
                bullets.pop(i)
            }
        }
    }

    document.addEventListener('keydown', recordKey);
    function recordKey(e) {
        switch (e.key) {
            case "w":
                ships[0].move(2);
                break;
            case "r":
                ships[0].fire();
                break;
        }
    }

    input.setup = function () {
        input.createCanvas(width, height);
        var starCount = 20 + Math.floor(Math.random() * 20);

        bigStars = new Array(starCount);
        mediumStars = new Array(starCount);
        tinyStars = new Array(starCount);
        ships = new Array(2);
        ships[0] = new Ship(7, width / 2, height / 2);
        ships[1] = new Pirate(7, width / 3, height / 3, ships[0]);

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

    var frameCount = 0;
    input.draw = function () {
        frameCount++;

        input.clear();
        ships[0].point(width / 2, height / 2, input.mouseX, input.mouseY);
        ships[0].drawBullets();
        ships[1].point(ships[1].x, ships[1].y, ships[0].x, ships[0].y);
        ships[1].drawBullets();
        if (frameCount % 20 == 0) {
            ships[1].fire();
        }
        ships[1].move(1);

        drawAll(ships);
        drawAll(bigStars);
        drawAll(mediumStars);
        drawAll(tinyStars);
    };
};

var display = new p5(output, "canvas");

