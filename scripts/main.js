var output = function (input) {
    var height = window.innerHeight;
    var width = window.innerWidth;
    var ships;

    class Shape {
        constructor(size, x, y) {
            this.size = size;
            this.x = x;
            this.y = y;
        }
        draw = function (){};
    }

    class Dot extends Shape {
        constructor(x, y) {
            super(2, x, y);
        }
        draw = function () {
            input.noStroke();
            input.fill(0, 0, 0, 256);
            input.circle(
                this.x, 
                this.y, 
                this.size,
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
            var newX = this.x + (velocity * (dx / 90));
            var newY = this.y + (velocity * (dy / 90));
            console.log(newX + " " + newY);
            if (
                10 < newX && 
                newX < (width - 10) && 
                10 < newY && 
                newY< (height - 10)
            ) {
                this.x = newX;
                this.y = newY;
            }
        };
    }

    class Bullet extends Moveable {
        constructor(x, y, direction) {
            super(3, x, y, direction);
            this.age = 0;
        }
        draw = function () {
            input.noStroke();
            input.fill(0, 0, 0, 256);
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

            var directionTo2;

            if (dx != 0 && dy != 0) {
                if (dx < 0 && dy > 0) { // target is in quadrant 1
                    directionTo2 = Math.atan2(Math.abs(dx), Math.abs(dy)) * (180 / Math.PI);
                } else if (dx < 0 && dy < 0) { // target is in q2
                    directionTo2 = Math.atan2(Math.abs(dy), Math.abs(dx)) * (180 / Math.PI);
                    directionTo2 += 90;
                } else if (dx > 0 && dy < 0) { // q3
                    directionTo2 = Math.atan2(Math.abs(dx), Math.abs(dy)) * (180 / Math.PI);
                    directionTo2 += 180;
                } else if (dx > 0 && dy > 0) { // q4
                    directionTo2 = Math.atan2(Math.abs(dy), Math.abs(dx)) * (180 / Math.PI);
                    directionTo2 += 270;
                }
                this.direction = directionTo2;
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
            input.fill(0, 0, 0, 256);
            input.circle(
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
            input.circle(
                this.x, 
                this.y, 
                this.size,
                this.size
            );
        }
    };

    var drawAll = function (shapes) {
        for (var i = 0; i < shapes.length; i++) {
            shapes[i].draw();
        }
    };

    var animatePirates = function () {
        for (var i = 1; i < ships.length; i++) {
            ships[i].point(ships[i].x, ships[i].y, ships[0].x, ships[0].y);
            ships[i].drawBullets();
            if (frameCount % 4 == i - 1) {
                ships[i].fire();
            }
            ships[i].move(0.5);
        }
    }

    var didCollide = function(obj1, obj2) {
        return ( 5 > Math.sqrt( (Math.abs(obj1.x - obj2.x) ** 2) + (Math.abs(obj1.y - obj2.y) ** 2)) );
    };

    var checkCollisions = function(obj, arr) {
        for (var i = 0; i < arr.length; i++) {
            if (didCollide(obj, arr[i])) {
                return true
            }
        }
    };

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

        ships = new Array(4);
        ships[0] = new Ship(7, width / 2, height / 10);
        ships[1] = new Pirate(7, width / 7, height / 10);
        ships[2] = new Pirate(7, width / 7, height / 8);
        ships[3] = new Pirate(7, width / 7, height / 4);

    };

    var frameCount = 0;
    input.draw = function () {
        input.clear();
        var dot = new Dot(width / 2, height / 2);
        dot.draw();

        ships[0].point(width / 2, height / 2, input.mouseX, input.mouseY);
        ships[0].drawBullets();

        frameCount++;
        animatePirates();

        drawAll(ships);

        for (var i = 1; i < ships.length; i++) {
            if (checkCollisions(ships[0], ships[i].bullets)) {
                document.getElementById("result").textContent = "You Lose.";
                noLoop();
            }
        }

        for (var i = 1; i < ships.length; i++) {
            if (checkCollisions(ships[i], ships[0].bullets)) {
                ships.pop(i);
            }
        }
    };
};

var display = new p5(output, "canvas");

