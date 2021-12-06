var output = function (input) {
    var height = window.innerHeight;
    var width = window.innerWidth;
    var bigStars;
    var mediumStars;
    var tinyStars;
    var ships;
    var bullets;

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

    class Ship extends Moveable {
        constructor(size, x, y) {
            super(size, x, y, 180);
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
            var oldDirection = this.direction;
            if (input.mouseX < width / 2) {
                this.direction = Math.abs(360  - ((width / 2) - input.mouseX));
            } else {
                this.direction = Math.abs(((width / 2) - input.mouseX));
            }
            if ( !(this.direction >= 0 && this.direction < 360) ) {
                this.direction = oldDirection;
            }
        }
    }

    class Pirate extends Moveable {
        constructor(size, x, y, prey) {
            super(size, x, y, 180);
            this.prey = prey;
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
        point = function () {
            var dx = this.x - this.prey.x;
            var dy = this.y - this.prey.y;

            var directionToPrey;

            if (dx < 0 && dy > 0) { // prey is in quadrant 1
                directionToPrey = Math.atan2(Math.abs(dx), Math.abs(dy)) * (180 / Math.PI);
            } else if (dx < 0 && dy < 0) { // prey is in q2
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
            console.log(this.direction);
        }
    };

    var drawStars = function (stars) {
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
                bullet = new Bullet(ships[0].x, ships[0].y, ships[0].direction);
                bullets.push(bullet);
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
        bullets = new Array(1);
        bullets[0] = new Bullet(ships[0].x, ships[0].y, ships[0].direction);

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
        ships[0].point();
        ships[1].point();
        if (frameCount % 20 == 0) {
                bullet = new Bullet(ships[1].x, ships[1].y, ships[1].direction);
                bullets.push(bullet);
        }
        moveBullets(bullets);

        drawStars(bullets);
        drawStars(ships);
        drawStars(bigStars);
        drawStars(mediumStars);
        drawStars(tinyStars);
    };
};

var display = new p5(output, "canvas");

