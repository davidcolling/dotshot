var output = function (input) {
    var height = window.innerHeight;
    var width = window.innerWidth;
    var ships;
    var map;

    class Shape {
        constructor(size, x, y) {
            this.size = size;
            this.x = x;
            this.y = y;
        }
        draw = function (){};
    }

    class Wall {
        constructor(x1, y1, x2, y2) {
            this.x1 = x1;
            this.y1 = y1;
            this.x2 = x2;
            this.y2 = y2;
        }
        draw = function () {
            input.fill(256, 256, 256, 256);
            input.line(
                this.x1, 
                this.y1, 
                this.x2, 
                this.y2
            );
        }
    };

    class Map {
        constructor() {
            this.walls = new Array();
            this.blockedCoords = new Array();
        }
        addWall = function(wall) {
            this.walls.push(wall);

            // assumes no diagonals for now
            var isVertical = false;
            if (wall.x1 == wall.x2) {
                isVertical = true;
            }

            if (isVertical) {
                if (wall.y1 < wall.y2) {
                    var startingCoord = wall.y1;
                    var endingCoord= wall.y2;
                } else {
                    var startingCoord = wall.y2;
                    var endingCoord= wall.y1;
                }
            } else {
                if (wall.x1 < wall.x2) {
                    var startingCoord = wall.x1;
                    var endingCoord= wall.x2;
                } else {
                    var startingCoord = wall.x2;
                    var endingCoord= wall.x1;
                }
            }

            for (var i = startingCoord; i < endingCoord; i++) {
                var coord = new Array(2);
                coord[0] = [i]
                if (isVertical) {
                    coord[1] = wall.x1;
                } else {
                    coord[1] = wall.y1;
                }
                this.blockedCoords.push(coord);
            }
        }
        // returns true if there is no wall between points 1 and 2
        isOpen = function(x1, y1, x2, y2) {
            // https://stackoverflow.com/questions/7069420/check-if-two-line-segments-are-colliding-only-check-if-they-are-intersecting-n
            // To spell it out: suppose you're looking at two line segments, [AB] and [CD]. The segments intersect if and only if ((A and B are of different sides of [CD]) and (C and D are on different sides of [AB])).
            //                            1     2                                           [walls.1 walls.2]
            // To see whether two points, P and Q, are on different sides of a line segment [E       F], compute two cross products, one for P and one for Q:
            // (F[x] - E[x])(P[y] - F[y]) - (F[y] - E[y])(P[x] - F[x])
            // (F[x] - E[x])(Q[y] - F[y]) - (F[y] - E[y])(Q[x] - F[x])
            // If the results have the same sign (both positive or both negative) then forget it, the points are on the same side, the segments do not intersect. If one is positive and the other negative, then the points are on opposite sides.
            for (var i = 0; i < this.walls.length; i++) {
                if (
                    this.pointsAreSplit(x1, y1, x2, y2, this.walls[i]) &&
                    this.pointsAreSplit(this.walls[i].x1, this.walls[i].y1, this.walls[i].x2, this.walls[i].y2, new Wall(x1, y1, x2, y2))
                ) {
                    return false;
                }
            }
            return true;
        }
        // returns true if x1, y1 are on opposite sides of wall
        pointsAreSplit = function(x1, y1, x2, y2, wall) {
            var val1 = (wall.x2 - wall.x1) * (y1 - wall.y2) - (wall.y2 - wall.y1) * (x1 - wall.x2);
            var val2 = (wall.x2 - wall.x1) * (y2 - wall.y2) - (wall.y2 - wall.y1) * (x2 - wall.x2);
            if ( (val1 < 0 && val2 > 0) || (val1 > 0 && val2 < 0) ) { // if points have opposite signs,
                return true // then they are opposite sides of the wall
            }
            return false
        }
    };

    class Dot extends Shape {
        constructor(x, y) {
            super(2, x, y);
        }
        draw = function () {
            input.fill(0, 0, 0, 256);
            input.circle(
                this.x, 
                this.y, 
                this.size,
            );
        }
    }

    class Moveable extends Shape {
        constructor(size, x, y, direction, map) {
            super(size, x, y);
            this.direction = direction;
            this.map = map;
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
            if (
                10 < newX && 
                newX < (width - 10) && 
                10 < newY && 
                newY< (height - 10) &&

                this.map.isOpen(this.x, this.y, newX, newY)
            ) {
                this.x = newX;
                this.y = newY;
            }
        };
    }

    class Bullet extends Moveable {
        constructor(x, y, direction, map) {
            super(3, x, y, direction, map);
            this.age = 0;
        }
        draw = function () {
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
        constructor(size, x, y, map) {
            super(size, x, y, 0, map);
            this.bullets = new Array(1);
            this.bullets[0] = new Bullet(x, y, 0, map);
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
            var bullet = new Bullet(this.x, this.y, this.direction, this.map);
            this.bullets.push(bullet);
        }
    }

    class Ship extends Steerable {
        constructor(size, x, y, map) {
            super(size, x, y, map);
        }
        draw = function () {
            input.fill(0, 0, 0, 256);
            input.circle(
                this.x, 
                this.y, 
                this.size
            );
        }
    }

    class Pirate extends Steerable {
        constructor(size, x, y, map) {
            super(size, x, y, map);
            this.idleAge = 0;
            this.idleLife = Math.random() * 200;
       }
        draw = function () {
            input.fill(256, 0, 0, 256);
            input.circle(
                this.x, 
                this.y, 
                this.size
            );
        }
        idle = function () {
            if (this.idleAge < this.idleLife) {
                this.idleAge++;
                this.move(0.5);
            } else {
                this.ideAge = 0;
                this.idleLife = Math.random() * 1000;
                this.direction = Math.random() * 360;
            }
        }
    };

    var drawAll = function (shapes) {
        for (var i = 0; i < shapes.length; i++) {
            shapes[i].draw();
        }
    };

    var animatePirates = function () {
        for (var i = 1; i < ships.length; i++) {
            if (
                400 > Math.sqrt( Math.abs(ships[i].x - ships[0].x)**2 + Math.abs(ships[i].y - ships[0].y)**2 ) &&
                map.isOpen(ships[0].x, ships[0].y, ships[i].x, ships[i].x)
            ) {
                ships[i].point(ships[i].x, ships[i].y, ships[0].x, ships[0].y);
                ships[i].drawBullets();
                if (frameCount % 16 == i - 1) {
                    ships[i].fire();
                }
                ships[i].move(0.5);
            } else {
                ships[i].idle();
            }
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

        map = new Map();
        for (var i = 0; i < 15; i ++) {
            map.addWall( new Wall(
                50 + (Math.random() * (width * 0.8)), 
                50 + (Math.random() * (height * 0.8)), 
                Math.random() * (width * 0.8), 
                Math.random() * (height * 0.8)
            ));
        }

        ships = Array(4);
        ships[0] = new Ship(5, width - 20, height - 50, map);
        ships[1] = new Pirate(5, width * Math.random(), (height / 2) * Math.random(), map);
        ships[2] = new Pirate(5, width * Math.random(), (height / 2) * Math.random(), map);
        ships[3] = new Pirate(5, width * Math.random(), (height / 2) * Math.random(), map);
    };

    var frameCount = 0;
    input.draw = function () {
        input.clear();

        frameCount++;

        ships[0].point(ships[0].x, ships[0].y, input.mouseX, input.mouseY);
        drawAll(ships);
        drawAll(map.walls);
        ships[0].drawBullets()

		animatePirates();

		for (var i = 1; i < ships.length; i++) {
             if (checkCollisions(ships[0], ships[i].bullets)) {
                 document.getElementById("result").textContent = "You Lose.";
                 input.noLoop();
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

