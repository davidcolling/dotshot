var output = function (input) {
    var player;
    var enemies;
    var world;

    class CenteredShape {
        constructor(size, x, y) {
            this.size = size;
            this.x = x;
            this.y = y;
        }
        draw = function (){};
    }

    class Coord {
        constructor(x, y) {
            this.x = x;
            this.y = y;
        }
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

    // assumes multiple walls
    class Structure {
        constructor() {
            this.walls = new Array();
        }
        draw = function() {
            for (var i = 0; i < this.walls.length; i++) {
                this.walls[i].draw();
            }
        }
    }

    class Castle extends Structure {
        // coord of center 
        constructor(x, y, size) {
            super();
            this.x = x;
            this.y = y;
            this.walls.push( new Wall( //1
                x - (size / 2),
                y - (size / 2),
                x - (size / 8),
                y - (size / 2)
            ));
            this.walls.push( new Wall( //2
                x + (size / 8),
                y - (size / 2),
                x + (size / 2),
                y - (size / 2)
            ));
            this.walls.push( new Wall( //3
                x + (size / 2),
                y - (size / 2),
                x + (size / 2),
                y - (size / 8)
            ));
            this.walls.push( new Wall( //4
                x + (size / 2),
                y + (size / 8),
                x + (size / 2),
                y + (size / 2)
            ));
            this.walls.push( new Wall( //5
                x + (size / 2),
                y + (size / 2),
                x + (size / 8),
                y + (size / 2)
            ));
            this.walls.push( new Wall( //6
                x - (size / 8),
                y + (size / 2),
                x - (size / 2),
                y + (size / 2)
            ));
            this.walls.push( new Wall( //7
                x - (size / 2),
                y + (size / 2),
                x - (size / 2),
                y + (size / 8)
            ));
            this.walls.push( new Wall( //8
                x - (size / 2),
                y - (size / 8),
                x - (size / 2),
                y - (size / 2)
            ));

            this.walls.push( new Wall( //9
                x - (size / 8),
                y - (size / 4),
                x + (size / 8),
                y - (size / 4)
            ));
            this.walls.push( new Wall( //10
                x + (size / 4),
                y - (size / 8),
                x + (size / 4),
                y + (size / 8)
            ));
            this.walls.push( new Wall( //11
                x - (size / 8),
                y + (size / 4),
                x + (size / 8),
                y + (size / 4)
            ));
            this.walls.push( new Wall( //12
                x - (size / 4),
                y - (size / 8),
                x - (size / 4),
                y + (size / 8)
            ));
        }
    }

    class Map extends Structure {
        constructor(width, height) {
            super();
            this.width = width;
            this.height = height;
            this.walls = new Array();
            this.blockedCoords = new Array();
            this.walls.push(new Wall(0, 0, width, 0));
            this.walls.push(new Wall(width, 0, width, height));
            this.walls.push(new Wall(0, height, width, height));
            this.walls.push(new Wall(0, height, 0, 0));
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

    class World {
        constructor(width, height) {
            this.frameCount = 0;
            this.map = new Map(width, height);
            this.bullets = new Array();

            if (Math.random() < 0.3) {
                for (var i = 0; i < 60; i ++) {
                    this.map.addWall( new Wall(
                        i * (this.map.width / 60),
                        50 + (Math.random() * (this.map.height * 0.8)), 
                        i * (this.map.width / 60),
                        Math.random() * (this.map.height * 0.8)
                    ));
                }
            } else {
                for (var i = 0; i < 2; i ++) {
                    this.map.addWall( new Wall(
                        Math.random() * this.map.width, 
                        Math.random() * this.map.height, 
                        Math.random() * this.map.width, 
                        Math.random() * this.map.height
                    ));
                }
                for (var i = 0; i < 15; i ++) {
                    var castle = new Castle(
                        Math.random() * (0.7 * this.map.width),
                        Math.random() * (0.7 * this.map.height),
                        Math.random() * 500
                    );
                    for (var j = 0; j < castle.walls.length; j++) {
                        this.map.addWall(castle.walls[j]);
                    }
                }
            }
        }
    }

    class Moveable extends CenteredShape {
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
                this.map.isOpen(this.x, this.y, newX, newY) &&
                0 < newX &&                                                 // idk why but without the additional bounds checks the player sometimes disappears when moving in direction between 359-360 degrees
                newX < this.map.width &&
                0 < newY &&
                newY < this.map.height
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

    class Character extends Moveable {
        constructor(size, x, y, map) {
            super(size, x, y, 0, map);
        }
        point = function (x1, y1, x2, y2) {
            this.direction = calculateDirection(x1, y1, x2, y2);
        }
        fire = function(direction) {
            if (direction == null) {
                var bulletDirection = this.direction;
            } else {
                var bulletDirection = direction;
            }
            var bullet = new Bullet(this.x, this.y, bulletDirection, this.map);
            // this.world.bullets.push(bullet);
        }
    }

    class Player extends Character {
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

    class NPC extends Character {
       constructor(size, x, y, map, life, idleAge, idleLife) {
            super(size, x, y, map);
            this.age = 0;
            this.life = life;
            this.idleAge = idleAge;
            this.idleLife = idleLife;
            this.lastSeenPlayerCoord = null;
        }
        draw = function () {
            input.fill(0, 0, 0, 256);
            input.circle(
                this.x, 
                this.y, 
                this.size
            );
        }
        idle = function () {
            if (this.lastSeenPlayerCoord != null) {
                if (5 < calculateDistance(this.x, this.y, this.lastSeenPlayerCoord.x, this.lastSeenPlayerCoord.y)) {
                    this.point(this.x, this.y, this.lastSeenPlayerCoord.x, this.lastSeenPlayerCoord.y);
                    this.move(1, 0);
                } else {
                    this.lastSeenPlayerCoord.x = null;
                    this.lastSeenPlayerCoord.y = null;
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
        attack = function () {}
   }

    class Bomb extends NPC {
        constructor(x, y, map) {
            super(5, x, y, map, 1000, 0, 200);
            this.isGrowing = true;
            this.shockWave = null;
        }
        draw = function () {
            if (this.shockWave != null) {
                this.shockWave.draw();
            }
            input.fill(0, 256, 0, 256);
            input.circle(
                this.x, 
                this.y, 
                this.size
            );
        }
        explode = function () {
            this.shockWave = new ShockWave(300, this.x, this.y);
        }
        pulse = function () {
            if (this.isGrowing) {
                if (this.size < 9) {
                    this.size += 1;
                } else {
                    this.isGrowing = false;
                    this.size -= 1;
                }
            } else {
                if (this.size > 5) {
                    this.size -= 1;
                } else {
                    this.isGrowing = true;
                    this.size += 1;
                }
            }
        }
        attack = function () {
            var distance = calculateDistance(this.x, this.y, this.lastSeenPlayerCoord.x, this.lastSeenPlayerCoord.y);
            if ( distance < 100 ) {
                    this.fire(this.direction);
        
                    this.fire(this.direction + 1);
                    this.fire(this.direction - 1);
        
                    this.fire(this.direction + 3);
                    this.fire(this.direction - 3);
        
                    this.fire(this.direction + 10);
                    this.fire(this.direction - 10);
        
                    this.fire(this.direction + 20);
                    this.fire(this.direction - 20);
        
                    this.fire(this.direction + 30);
                    this.fire(this.direction - 30);
            } else if (distance < 200) {
                    this.pulse();
            }

            this.point(this.x, this.y, this.lastSeenPlayerCoord.x, this.lastSeenPlayerCoord.y);
            this.move(0.5, 0);
        }
    };

    class ShockWave extends CenteredShape {
        constructor(size, x, y) {
            super(size, x, y);
            this.age = 0;
        }
        incAge = function() {
            if (this.age < this.size) {
                this.age += 1;
            }
        }
        draw = function () {
            this.incAge();
            input.noFill(256, 0, 0, 256);
            input.circle(
                this.x, 
                this.y, 
                this.age
            );
        }
    }

    class Pirate extends NPC {
        constructor(size, x, y, map) {
            super(size, x, y, map, 1000, 0, 200);
        }
        draw = function () {
            input.fill(256, 0, 0, 256);
            input.circle(
                this.x, 
                this.y, 
                this.size
            );
        }
        attack = function () {
                this.fire();
            this.point(this.x, this.y, this.lastSeenPlayerCoord.x, this.lastSeenPlayerCoord.y);
            this.move(0.5, 0);
        }
    };

    var calculateDistance = function (x1, y1, x2, y2) {
        return Math.sqrt( Math.abs(x2 - x1)**2 + Math.abs(y2 - y1)**2 ) 
    };

    // obj2 is the projectile
    var isShot= function(obj1, obj2) {
        return ( 5 > calculateDistance(obj1.x, obj1.y, obj2.x, obj2.y) &&
                isInFrontOf(obj1, obj2) );
    };

    var calculateDirection = function (x1, y1, x2, y2) {
        var dx = x1 - x2;
        var dy = y1 - y2;

        var direction;

        if (dx != 0 && dy != 0) {
            if (dx < 0 && dy > 0) { // target is in quadrant 1
                direction = Math.atan2(Math.abs(dx), Math.abs(dy)) * (180 / Math.PI);
            } else if (dx < 0 && dy < 0) { // target is in q2
                direction = Math.atan2(Math.abs(dy), Math.abs(dx)) * (180 / Math.PI);
                direction += 90;
            } else if (dx > 0 && dy < 0) { // q3
                direction = Math.atan2(Math.abs(dx), Math.abs(dy)) * (180 / Math.PI);
                direction += 180;
            } else if (dx > 0 && dy > 0) { // q4
                direction = Math.atan2(Math.abs(dy), Math.abs(dx)) * (180 / Math.PI);
                direction += 270;
            }
            return direction
        }
    }

    var isInFrontOf = function(obj1, obj2) {
        return 90 >= Math.abs(calculateDifference(obj1.direction, calculateDirection(obj1.x, obj1.y, obj2.x, obj2.y)));
    }

    var calculateDifference = function(direction1, direction2) {
        difference = direction1 - direction2;

        if (difference > 180) {
            difference = 360 - difference;
        }

        return difference
    }

    var checkIsShot = function(obj, arr) {
        for (var i = 0; i < arr.length; i++) {
            if (isShot(obj, arr[i])) {
                return true
            }
        }
        return false;
    };

    document.addEventListener('keydown', recordKey);
    function recordKey(e) {
        switch (e.key) {
            case "r":
                player.fire();
                break;
            case "w":
                player.move(2, 0);
                break;
            case "d":
                player.move(2, 90);
                break;
            case "s":
                player.move(2, 180);
                break;
            case "a":
                player.move(2, 270);
                break;
        }
    }

    input.setup = function () {
        var height = window.innerHeight * 0.9;
        var width = window.innerWidth * 0.9;

        input.createCanvas(width, height);

        world = new World(width, height);
        enemies = new Array();

        player = new Player(5, width - 20, height - 50, world.map);
        for (var i = 0; i < 5; i++ ) {
            enemies.push(new Pirate(5, width * Math.random(), (height / 2) * Math.random(), world.map));
            enemies.push(new Bomb(width * Math.random(), (height / 2) * Math.random(), world.map));
        }
    };

    input.draw = function () {
        input.clear();
        world.map.draw();

        if (world.bullets.length > 0) {
            for (var i = 0; i < world.bullets.length; i++) {
                if (world.bullets[i].age < 30) {
                    world.bullets[i].move(15, 0);
                    world.bullets[i].draw();
                } else {
                    world.bullets.pop(i)
                }
    
            }
        }

        player.point(player.x, player.y, input.mouseX, input.mouseY);
        player.draw();

        for (var i = 0; i < enemies.length; i++) {
            if (enemies[i] != null) {
                enemies[i].draw();
                if (
                    400 > calculateDistance(player.x, player.y, enemies[i].x, enemies[i].y) &&
                    world.map.isOpen(player.x, player.y, enemies[i].x, enemies[i].y)
                ) {
                    enemies[i].lastSeenPlayerCoord = new Coord(player.x, player.y);
                    enemies[i].attack();
                } else {
                    enemies[i].idle();
                }
    
                if (checkIsShot(player, world.bullets)) {
                    document.getElementById("result").textContent = "You Lose.";
                    input.noLoop();
                }
    
                if (checkIsShot(enemies[i], world.bullets)) {
                    enemies[i] = null;
                }
            }
        }
    };
};

var display = new p5(output, "canvas");

