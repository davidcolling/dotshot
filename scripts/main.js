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
        move = function (velocity, offset) {
            var dx;
            var dy;
            var offsetDirection = this.direction + offset;
            if (offsetDirection > 359) {
                offsetDirection -= 360;
            }
            if (offsetDirection >= 0 && offsetDirection < 90) {
                dx = offsetDirection;
                dy = -1 * (90 - offsetDirection);
            } else if (offsetDirection >= 90 && offsetDirection < 180) {
                dx = 180 - offsetDirection;
                dy = offsetDirection - 90;
            } else if (offsetDirection >= 180 && offsetDirection < 270) {
                dx = -1 * (offsetDirection - 180);
                dy = 270 - offsetDirection;
            } else if (offsetDirection >= 270 && offsetDirection < 360) {
                dx = offsetDirection - 360;
                dy = -1 * (offsetDirection - 270);
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
                    this.bullets[i].move(15, 0);
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
            this.lastSeenPlayerX = null;
            this.lastSeenPlayerY = null;
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
            if (this.lastSeenPlayerX != null) {
                if (5 < calculateDistance(this.x, this.y, this.lastSeenPlayerX, this.lastSeenPlayerY)) {
                    this.point(this.x, this.y, this.lastSeenPlayerX, this.lastSeenPlayerY);
                    this.move(1, 0);
                } else {
                    this.lastSeenPlayerX = null;
                    this.lastSeenPlayerY = null;
                }
            } else {
                if (!(this.idleAge < this.idleLife)) {
                    this.ideAge = 0;
                    this.idleLife = Math.random() * 2000;
                    this.direction = Math.random() * 360;
                }
                this.idleAge++;
                this.move(1, 0);
            }
        }
    };

    var drawAll = function (shapes) {
        for (var i = 0; i < shapes.length; i++) {
            shapes[i].draw();
        }
    };

    var calculateDistance = function (x1, y1, x2, y2) {
        return Math.sqrt( Math.abs(x2 - x1)**2 + Math.abs(y2 - y1)**2 ) 
    };

    var didCollide = function(obj1, obj2) {
        return ( 5 > calculateDistance(obj1.x, obj1.y, obj2.x, obj2.y) );
    };

    var checkCollisions = function(obj, arr) {
        for (var i = 0; i < arr.length; i++) {
            if (didCollide(obj, arr[i])) {
                return true
            }
        }
        return false;
    };

    document.addEventListener('keydown', recordKey);
    function recordKey(e) {
        switch (e.key) {
            case "r":
                ships[0].fire();
                break;
            case "w":
                ships[0].move(2, 0);
                break;
            case "d":
                ships[0].move(2, 90);
                break;
            case "s":
                ships[0].move(2, 180);
                break;
            case "a":
                ships[0].move(2, 270);
                break;
        }
    }

    input.setup = function () {
        input.createCanvas(width, height);

        map = new Map();
        if (Math.random() < 0.3) {
            for (var i = 0; i < 60; i ++) {
                map.addWall( new Wall(
                    i * (width / 60),
                    50 + (Math.random() * (height * 0.8)), 
                    i * (width / 60),
                    Math.random() * (height * 0.8)
                ));
            }
        } else {
            for (var i = 0; i < 15; i ++) {
                map.addWall( new Wall(
                    50 + (Math.random() * (height * 0.8)), 
                    50 + (Math.random() * (width * 0.8)), 
                    Math.random() * (width * 0.8),
                    Math.random() * (height * 0.8)
                ));
            }
        }

        ships = Array(1);
        ships[0] = new Ship(5, width - 20, height - 50, map);
        for (var i = 0; i < 10; i++ ) {
            ships.push(new Pirate(5, width * Math.random(), (height / 2) * Math.random(), map));
        }
    };

    var frameCount = 0;
    input.draw = function () {
        input.clear();
        frameCount++;
        drawAll(map.walls);

		for (var i = 0; i < ships.length; i++) {
            if ( i == 0 ) {
                ships[i].drawBullets()
                ships[i].point(ships[i].x, ships[i].y, input.mouseX, input.mouseY);
                ships[i].draw();
            } else {
                if (ships[i] != null) {
                    ships[i].draw();
                    if (
                        400 > calculateDistance(ships[0].x, ships[0].y, ships[i].x, ships[i].y) &&
                        map.isOpen(ships[0].x, ships[0].y, ships[i].x, ships[i].y)
                    ) {
                        ships[i].lastSeenPlayerX = ships[0].x;
                        ships[i].lastSeenPlayerY = ships[0].y;
                        ships[i].point(ships[i].x, ships[i].y, ships[0].x, ships[0].y);
                        ships[i].drawBullets();
                        if (frameCount % 16 == i - 1) {
                            ships[i].fire();
                       }
                        ships[i].move(0.5, 0);
                    } else {
                        ships[i].idle();
                    }
        
                    if (checkCollisions(ships[0], ships[i].bullets)) {
                        document.getElementById("result").textContent = "You Lose.";
                        input.noLoop();
                    }
        
                    if (checkCollisions(ships[i], ships[0].bullets)) {
                        ships[i] = null;
                    }
                }
            }
         }
 
    };

};

var display = new p5(output, "canvas");

