var output = function (input) {

    class RGBA {
        r: number;
        g: number;
        b: number;
        a: number;
        constructor(r, g, b, a) {
            this.r = r;
            this.g = g;
            this.b = b;
            this.a = a;
        }
    }

    class HealthBar {
        max: number;
        hp: number;
        map: Map;

        constructor(max, map) {
            this.max = max;
            this.map = map
            this.hp = this.max;
        }

        draw  = function() {
            if (this.hp != 0) {
                input.stroke(256, 0, 0, 256);
                input.fill(256, 0, 0, 256);
                input.line(
                    0, 
                    this.map.height - 1, 
                    this.map.width * (this.hp / this.max), 
                    this.map.height - 1
                );
                input.stroke(
                    defaultStrokeColor.r, 
                    defaultStrokeColor.g, 
                    defaultStrokeColor.b, 
                    defaultStrokeColor.a, 
                );            
            }
        }
    }

    class CenteredShape {
        size: number;
        x: number;
        y: number;

        constructor(size, x, y) {
            this.size = size;
            this.x = x;
            this.y = y;
        }
        draw = function (){};
    }

    class Coord {
        x: number;
        y: number;

        constructor(x, y) {
            this.x = x;
            this.y = y;
        }
    }

    class Wall {
        end1: Coord;
        end2: Coord;

        constructor(end1, end2) {
            this.end1 = end1;
            this.end2 = end2;
        }
        draw = function () {
            input.fill(256, 256);
            input.line(
                this.end1.x, 
                this.end1.y, 
                this.end2.x, 
                this.end2.y
            );
        }
    };

    // composite of walls
    class Structure {
        walls: Array<Wall>;

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
        location: Coord;
        size: number;

        // coord of center 
        constructor(location, size) {
            super();
            this.location = location;
            this.walls.push( new Wall( //1
                new Coord(
                    this.location.x - (size / 2),
                    this.location.y - (size / 2)
                ),
                new Coord(
                    this.location.x - (size / 8),
                    this.location.y - (size / 2)
                )
            ));
            this.walls.push( new Wall( //2
                new Coord(
                    this.location.x + (size / 8),
                    this.location.y - (size / 2)
                ),
                new Coord(
                    this.location.x + (size / 2),
                    this.location.y - (size / 2)
                )
            ));
            this.walls.push( new Wall( //3
                new Coord(
                    this.location.x + (size / 2),
                    this.location.y - (size / 2)
                ),
                new Coord(
                    this.location.x + (size / 2),
                    this.location.y - (size / 8)
                )
            ));
            this.walls.push( new Wall( //4
                new Coord(
                    this.location.x + (size / 2),
                    this.location.y + (size / 8)
                ),
                new Coord(
                    this.location.x + (size / 2),
                    this.location.y + (size / 2)
                )
            ));
            this.walls.push( new Wall( //5
                new Coord(
                    this.location.x + (size / 2),
                    this.location.y + (size / 2)
                ),
                new Coord(
                    this.location.x + (size / 8),
                    this.location.y + (size / 2)
                )
            ));
            this.walls.push( new Wall( //6
                new Coord(
                    this.location.x - (size / 8),
                    this.location.y + (size / 2)
                ),
                new Coord(
                    this.location.x - (size / 2),
                    this.location.y + (size / 2)
                )
            ));
            this.walls.push( new Wall( //7
                new Coord(
                    this.location.x - (size / 2),
                    this.location.y + (size / 2)
                ),
                new Coord(
                    this.location.x - (size / 2),
                    this.location.y + (size / 8)
                )
            ));
            this.walls.push( new Wall( //8
                new Coord(
                    this.location.x - (size / 2),
                    this.location.y - (size / 8)
                ),
                new Coord(
                    this.location.x - (size / 2),
                    this.location.y - (size / 2)
                )
            ));

            this.walls.push( new Wall( //9
                new Coord(
                    this.location.x - (size / 8),
                    this.location.y - (size / 4)
                ),
                new Coord(
                    this.location.x + (size / 8),
                    this.location.y - (size / 4)
                )
            ));
            this.walls.push( new Wall( //10
                new Coord(
                    this.location.x + (size / 4),
                    this.location.y - (size / 8)
                ),
                new Coord(
                    this.location.x + (size / 4),
                    this.location.y + (size / 8)
                )
            ));
            this.walls.push( new Wall( //11
                new Coord(
                    this.location.x - (size / 8),
                    this.location.y + (size / 4)
                ),
                new Coord(
                    this.location.x + (size / 8),
                    this.location.y + (size / 4)
                )
            ));
            this.walls.push( new Wall( //12
                new Coord(
                    this.location.x - (size / 4),
                    this.location.y - (size / 8)
                ),
                new Coord(
                    this.location.x - (size / 4),
                    this.location.y + (size / 8)
                )
            ));
        }
    }

    class Map extends Structure {
        width: number;
        height: number;

        constructor(width, height) {
            super();
            this.width = width;
            this.height = height;
            this.walls.push(new Wall(
                new Coord(0, 0),
                new Coord(width, 0)
            ));
            this.walls.push(new Wall(
                new Coord(width, 0),
                new Coord(width, height)
            ));
            this.walls.push(new Wall(
                new Coord(0, height),
                new Coord(width, height)
            ));
            this.walls.push(new Wall(
                new Coord(0, height),
                new Coord(0, 0)
            ));
        }
        addWall = function(wall) {
            this.walls.push(wall);
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
                    this.pointsAreSplit(this.walls[i].end1.x, this.walls[i].end1.y, this.walls[i].end2.x, this.walls[i].end2.y, new Wall(new Coord(x1, y1), new Coord(x2, y2)))
                ) {
                    return false;
                }
            }
            return true;
        }
        // returns true if x1, y1 are on opposite sides of wall
        pointsAreSplit = function(x1, y1, x2, y2, wall) {
            var val1 = (wall.end2.x - wall.end1.x) * (y1 - wall.end2.y) - (wall.end2.y - wall.end1.y) * (x1 - wall.end2.x);
            var val2 = (wall.end2.x - wall.end1.x) * (y2 - wall.end2.y) - (wall.end2.y - wall.end1.y) * (x2 - wall.end2.x);
            if ( (val1 < 0 && val2 > 0) || (val1 > 0 && val2 < 0) ) { // if points have opposite signs,
                return true // then they are opposite sides of the wall
            }
            return false
        }
    };

    // facade and factory of all game objects: bullets, map, characters (player and npc)
    // an unenforced singleton
    // on observer of when bullets should be collected from characters
    // an observer of when objects need to become null, eg old bullets and dead npc
    // an observer of when characters lose hp
    // an observer of when npc should idle or attack
    class World {
        frameCount: number;
        map: Map;
        bullets: Array<Bullet>;
        enemies: Array<NPC>;
        mines: Array<NPC>;
        player: Player;
        healthBar: HealthBar;
        food: Array<Food>;
        chickens: Array<Chicken>;

        constructor(width, height, numberOfEnemies) {
            this.frameCount = 0;
            this.map = new Map(width, height);
            this.bullets = new Array();
            this.healthBar = new HealthBar(32, this.map);

            // put stuff on the map
            if (Math.random() < 0.3) {
                for (var i = 0; i < 60; i ++) {
                    this.map.addWall( new Wall(
                        new Coord(i * (this.map.width / 60),
                        50 + (Math.random() * (this.map.height * 0.8))),
                        new Coord(i * (this.map.width / 60),
                        Math.random() * (this.map.height * 0.8))
                    ));
                }
            } else {
                for (var i = 0; i < 2; i ++) {
                    this.map.addWall( new Wall(
                        new Coord(Math.random() * this.map.width, 
                        Math.random() * this.map.height), 
                        new Coord(Math.random() * this.map.width, 
                        Math.random() * this.map.height)
                    ));
                }
                for (var i = 0; i < 15; i ++) {
                    var castle = new Castle(
                        new Coord(
                            Math.random() * (0.7 * this.map.width),
                            Math.random() * (0.7 * this.map.height)
                        ),
                        Math.random() * 500
                    );
                    for (var j = 0; j < castle.walls.length; j++) {
                        this.map.addWall(castle.walls[j]);
                    }
                }
            }

            // make characters
            this.enemies = new Array();
            this.player = new Player(5, this.map.width - 20, this.map.height - 50, this.map);
            for (var i = 0; i < numberOfEnemies; i++ ) {
                this.enemies.push(new Pirate(5, this.map.width * Math.random(), (this.map.height / 2) * Math.random(), this.map, this.player));
                this.enemies.push(new Bomb(this.map.width * Math.random(), (this.map.height / 2) * Math.random(), this.map, this.player));
            }

            this.mines = new Array();
            for (var i = 0; i < 20; i++ ) {
                this.mines.push(new Mine(this.map.width * Math.random(), (this.map.height) * Math.random(), this.map));
            }
            
            this.food = new Array();
            for (var i = 0; i < 5; i++) {
                this.food.push(new Food(Math.random() * this.map.width, Math.random() * this.map.height));
            }

            this.chickens = new Array();
            for (var i = 0; i < 5; i++) {
                this.chickens.push(new Chicken(Math.random() * this.map.width, Math.random() * this.map.height, this.map));
            }
        }

        draw = function () {
            var playerIsDead = false; // setting this allows the rest of the function to finish running before the game is stopped

            // 
            this.frameCount++;
            this.map.draw();
        
            this.drawBullets(this.bullets);

            // player
            this.getCharacterBullets(this.player);
            if (this.checkIsShot(this.player, this.bullets)) {
                this.player.hp -= 1;
                this.healthBar.hp = this.player.hp;
            }
            if (!this.player.draw()) {
                playerIsDead = true;
                document.getElementById("message").textContent = "You Lose.";
            }
            this.healthBar.draw();
        
            this.drawAnimateEnemies(this.enemies);
            this.drawAnimateMines(this.mines);
            this.drawAnimateChickens(this.chickens);

            for (var i = 0; i < this.food.length; i ++) {
                if (this.food[i] != null) {
                    this.food[i].draw();
                    if (5 > World.calculateDistance(this.player.x, this.player.y, this.food[i].x, this.food[i].y)) {
                        if (this.player.hp < this.healthBar.max) {
                            this.food[i] = null;
                            this.player.hp += 10;
                            this.healthBar.hp = this.player.hp;
                        }
                    }
                }
            }

            if (playerIsDead) {
                return false;
            } else {
                return true;
            }

        };

        drawBullets = function(list) {
            for (var i = 0; i < list.length; i++) {
                if (list[i] != null) {
                    if (!list[i].draw()) {
                        list[i] = null;
                    }
                }
            }
        }

        drawAnimateEnemies = function(list) {
            for (var i = 0; i < list.length; i++) {
                if (list[i] != null) {

                    // calculate npc behavior
                    var seesPlayer = (
                        400 > World.calculateDistance(this.player.x, this.player.y, list[i].x, list[i].y) && 
                        this.map.isOpen(this.player.x, this.player.y, list[i].x, list[i].y) 
                    );

                    //check for shots
                    if (this.checkIsShot(list[i], this.bullets)) {
                        list[i].decideDraw(seesPlayer, new Coord(this.player.x, this.player.y), -1);
                    } else {
                        list[i].decideDraw(seesPlayer, new Coord(this.player.x, this.player.y), 0);
                    }

                    this.getCharacterBullets(list[i]);
                    if (list[i].hp == 0) {
                        list[i] = null;
                    }
    
                    if (list[i] != null) {
                        if (list[i].didExplode) {
                            list[i] = null;
                        }
                    }
                }
            }
        }

        drawAnimateMines = function(list) {
            for ( var i = 0; i < list.length; i++) {
                if (list[i] != null) {
                    list[i].draw();
                    // check for collisions
                    if (this.checkIsShot(list[i], this.bullets)) {
                        list[i].didIgnite = true;
                    }
                    // see if it gave up it bullets yet
                    if (list[i].didExplode) {
                        this.getCharacterBullets(list[i]);
                        list[i] = null;
                    }
                }
            }
        }

        drawAnimateChickens = function(list) {
            for ( var i = 0; i < list.length; i++) {
                if (list[i] != null) {
                    list[i].draw();
                    // calculate npc behavior
                    var seesPlayer = (
                        400 > World.calculateDistance(this.player.x, this.player.y, list[i].x, list[i].y) && 
                        this.map.isOpen(this.player.x, this.player.y, list[i].x, list[i].y) 
                    );
                    if (this.checkIsShot(list[i], this.bullets)) {
                        list[i].decideDraw(seesPlayer, new Coord(this.player.x, this.player.y), -1);
                    } else {
                        list[i].decideDraw(seesPlayer, new Coord(this.player.x, this.player.y), 0);
                    }

                    if (list[i].hp <= 0) {
                        this.food.push(new Food(list[i].x, list[i].y));
                        list[i] = null;
                    }
                }
            }
        }


        getCharacterBullets = function(character) {
            for (var i = 0; i < character.bullets.length; i++) {
                this.bullets.push(character.bullets[i]);
            }
            character.bullets = new Array();
        }

        static calculateDistance = function (x1, y1, x2, y2) {
            return Math.sqrt( Math.abs(x2 - x1)**2 + Math.abs(y2 - y1)**2 ) 
        };

        // obj2 is the projectile
        isShot= function(obj1, obj2) {
            return ( 5 > World.calculateDistance(obj1.x, obj1.y, obj2.x, obj2.y) &&
                    this.isInFrontOf(obj1, obj2) );
        };

        isInFrontOf = function(obj1, obj2) {
            return 90 >= Math.abs(this.calculateDifference(obj1.direction, World.calculateDirection(obj1.x, obj1.y, obj2.x, obj2.y)));
        }

        static calculateDirection = function (x1, y1, x2, y2) {
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

        calculateDifference = function(direction1, direction2) {
            var difference = direction1 - direction2;
    
            if (difference > 180) {
                difference = 360 - difference;
            }
    
            return difference
        }

        checkIsShot = function(obj, arr) {
            for (var i = 0; i < arr.length; i++) {
                if (arr[i] != null) {
                    if (this.isShot(obj, arr[i])) {
                        return true
                    }
                }
            }
            return false;
        };

        static calculateCoordinate(length, direction): Coord {
            var quadrant = Math.floor(direction / 90); // the quadrant that the new coord will be in relative to the moveable as if the space is a unit circle where the moveable is at (0, 0)
            var quadrantAngle = direction - (quadrant * 90);
            var quadrantAngleIsLowHalf = quadrantAngle < 45;
            var finalAngle
            if (quadrantAngleIsLowHalf) {
                 finalAngle = quadrantAngle;
            } else {
                 finalAngle = 90 - quadrantAngle;
            }
            var angleInRadians = finalAngle * (Math.PI / 180);

            var dx;
            var dy;
            // the above calculations shouls have laid out everything needed to determine which trig function to use and the sign
            if (quadrant % 2 == 0) {
                if (quadrantAngleIsLowHalf) {
                    dx = Math.asin(angleInRadians);
                    dy = Math.acos(angleInRadians);
                } else {
                    dx = Math.acos(angleInRadians);
                    dy = Math.asin(angleInRadians);
                }

                dy *= -1;

                if (quadrant == 2) {
                    dx *= -1;
                    dy *= -1;
                }
            } else {
                if (quadrantAngleIsLowHalf) {
                    dx = Math.acos(angleInRadians);
                    dy = Math.asin(angleInRadians);
                } else {
                    dx = Math.asin(angleInRadians);
                    dy = Math.acos(angleInRadians);
                }

                if (quadrant == 3) {
                    dx *= -1;
                    dy *= -1;
                }
            }


            dx *= length;
            dy *= length;

            return new Coord(dx, dy);
        }

    }

    class Moveable extends CenteredShape {
        direction: number;
        map: Map;

        constructor(size, x, y, direction, map) {
            super(size, x, y);
            this.direction = direction;
            this.map = map;
        }
        point = function (x1, y1, x2, y2) {
            this.direction = World.calculateDirection(x1, y1, x2, y2);
        }
        move = function (velocity) {
            // this function can be understood in two basic parts
            // port one calculates the objects new coordinates based off of their current coordinates, their direction, their velocity
            var relativeChangeCoordinate = World.calculateCoordinate(velocity, this.direction);
            var newX = this.x + relativeChangeCoordinate.x;
            var newY = this.y + relativeChangeCoordinate.y;
            // part two determines if the coordinates are somewhere the character can actually go
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
        age: number;
        target: Coord;

        constructor(x, y, target, map) {
            super(3, x, y, World.calculateDirection(x, y, target.x, target.y), map);
            this.age = 0;
            this.target = target;
        }
        draw = function () {
            input.fill(256, 256);
            this.point(this.x, this.y, this.target.x, this.target.y);
            this.move(15);
            input.circle(
                this.x, 
                this.y, 
                this.size,
            );
            this.age++;
            if (this.age < 30) {
                return true;
            } else {
                return false;
            }
        }
    }

    class Character extends Moveable {
        hp: number;
        bullets: Array<Bullet>;

        constructor(size, x, y, map, maxHP) {
            super(size, x, y, Math.random() * 360, map);
            this.hp = maxHP;
            this.bullets = new Array();
        }
        fire = function(target) {
            var bullet = new Bullet(this.x, this.y, target, this.map);
            this.bullets.push(bullet);
        }
    }

    class Food extends CenteredShape {
        constructor(x, y) {
            super(2, x, y);
        }
        draw = function () {
            input.fill(256, 256);
            input.circle(
                this.x, 
                this.y, 
                this.size
            );
        }
    }

    class Player extends Character {
        isFiring: boolean;
        isMoving: boolean;

        constructor(size, x, y, map) {
            super(size, x, y, map, 32);
            this.isFiring = false; 
            this.isMoving = false;
        }
        draw = function () {
            this.point(this.x, this.y, input.mouseX, input.mouseY);
            if (this.isFiring) {
                this.fire(new Coord(input.mouseX, input.mouseY));
            }
            if (this.isMoving) {
                this.move(2);
            }
            input.fill(256, 256);
            input.circle(
                this.x, 
                this.y, 
                this.size
            );
            if (this.hp == 0) {
                return false;
            } else {
                return true;
            }
        }
        
    }

    class NPC extends Character {
        didExplode: boolean;
        isHunting: boolean;
        age: number;
        idleAge: number;
        idleLife: number;
        lastSeenPlayerCoord: Coord;
        target: Character;

       constructor(size, x, y, map, target, life, idleAge, idleLife) {
            super(size, x, y, map, 8);
            this.didExplode = false;
            this.isHunting = false;
            this.age = 0;
            this.idleAge = idleAge;
            this.idleLife = idleLife;
            this.lastSeenPlayerCoord = null;
            this.target = target;
        }
        draw = function () {
            input.fill(256, 256);
            input.circle(
                this.x, 
                this.y, 
                this.size
            );
        }
        idle = function () {
            if (!(this.idleAge < this.idleLife)) {
                this.idleAge = 0;
                this.idleLife = Math.random() * 2000;
                this.direction = Math.random() * 360;
            }
            this.idleAge++;
            this.move(1);
        }
        attack = function (seesPlayer) {}
        decideDraw = function (seesPlayer, lastSeenPlayerCoord, hpOffset) {
            this.draw();
            this.hp += hpOffset;
            if ( this.isHunting || seesPlayer) {
                if (seesPlayer) {
                    this.lastSeenPlayerCoord = lastSeenPlayerCoord;
                }
                this.attack(seesPlayer);
            } else {
                this.idle();
            }
        }
    }

    class Chicken extends NPC {
        isRunning: boolean;
        fleeAge: number;
        fleeLife: number;

        constructor(x, y, map) {
            super(5, x, y, map, null, 1000, 0, 200);
            this.isRunning = false;
            this.fleeAge = 0;
            this.fleeLife = 20;
        }
        draw = function () {
            input.stroke(0, 256, 256, 256);
            input.fill(0, 256, 256, 256);
            input.circle(
                this.x, 
                this.y, 
                this.size
            );
            input.stroke(
                defaultStrokeColor.r, 
                defaultStrokeColor.g, 
                defaultStrokeColor.b, 
                defaultStrokeColor.a, 
            );            
        }    
        decideDraw = function (seesPlayer, lastSeenPlayerCoord, hpOffset) {
            this.draw();
            this.hp += hpOffset;
            if (seesPlayer) {
                if (this.fleeAge < this.fleeLife) {
                    this.fleeAge++;
                } else {
                    this.fleeAge = 0;
                    this.direction = Math.random() * 360;
                }
                this.move(3);
            } else {
                this.idle();
            }

        }
    }

    class Bomb extends NPC {
        didIgnite: boolean;
        igniteAge: number;
        isGrowing: boolean;

        constructor(x, y, map, target) {
            super(5, x, y, map, target, 1000, 0, 200);
            this.didIgnite = false;
            this.igniteAge = 0
            this.isGrowing = true;
        }
        draw = function () {
            if (this.didIgnite) {
                this.igniteAge++;
                if (this.igniteAge > 100) {
                    this.didExplode = true;
                    this.explode();
                }
            }
            input.stroke(0, 256, 0, 256);
            input.fill(0, 256, 0, 256);
            input.circle(
                this.x, 
                this.y, 
                this.size
            );
            input.stroke(
                defaultStrokeColor.r, 
                defaultStrokeColor.g, 
                defaultStrokeColor.b, 
                defaultStrokeColor.a, 
            );            
        }
        explode = function () {
            this.fire(new Coord(this.target.x, this.target.y));

            this.fire(new Coord(this.target.x + 1, this.target.y + 1));
            this.fire(new Coord(this.target.x - 1, this.target.y - 1));

            this.fire(new Coord(this.target.x + 2, this.target.y + 2));
            this.fire(new Coord(this.target.x - 2, this.target.y - 2));

            this.fire(new Coord(this.target.x + 3, this.target.y + 3));
            this.fire(new Coord(this.target.x - 3, this.target.y - 3));
        }
        // animation for when its about to explode
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
        attack = function (seesPlayer) {
            var distance = World.calculateDistance(this.x, this.y, this.lastSeenPlayerCoord.x, this.lastSeenPlayerCoord.y);
            var willMove = true;
            if (seesPlayer) {
                if ( distance < 300 ) {
                    this.pulse();
                    if ( distance < 200 ) {
                        this.didIgnite = true;
                        if (distance < 100) {
                            willMove = false;
                        }
                    }
                }
            }

            if (willMove) {
                this.point(this.x, this.y, this.lastSeenPlayerCoord.x, this.lastSeenPlayerCoord.y);
                this.move(1.6);
            }

            if (!this.isHunting) {
                this.isHunting = true;
            } else {
                if (distance < 2 && !this.didIgnite) {
                    this.isHunting = false;
                }
            }
        }
    };

    class Pirate extends NPC {
        weaponCooldownCounter: number;

        constructor(size, x, y, map, target) {
            super(size, x, y, map, target, 1000, 0, 200);
            this.weaponCooldownCounter = 0
        }
        draw = function () {
            this.weaponCooldownCounter++;
            input.stroke(256, 0, 0, 256);
            input.fill(256, 0, 0, 256);
            input.circle(
                this.x, 
                this.y, 
                this.size
            );
            input.stroke(
                defaultStrokeColor.r, 
                defaultStrokeColor.g, 
                defaultStrokeColor.b, 
                defaultStrokeColor.a, 
            );            
        }
        attack = function (seesPlayer) {
            this.point(this.x, this.y, this.lastSeenPlayerCoord.x, this.lastSeenPlayerCoord.y);
            this.move(0.5);
            if (seesPlayer) {
                if (this.weaponCooldownCounter % 16 == 0) {
                    this.fire(new Coord(this.target.x, this.target.y));
                }
            }
            if (this.isHunting) {
                if (0 != World.calculateDistance(this.x, this.y, this.lastSeenPlayerCoord.x, this.lastSeenPlayerCoord.y)) {
                    this.isHunting = false;
                }
            } else {
                this.isHunting = true;
            }
        }
    };

    class Mine extends NPC {
        didIgnite: boolean;
        didExplode: boolean;

        constructor(x, y, map) {
            super(5, x, y, map, null, 1000, 0, 200);
            this.didIgnite = false;
            this.didExplode = false;
        }
        draw = function () {
            if (this.didIgnite) {
                this.explode();
            }
            input.stroke(0, 0, 256, 256);
            input.fill(0, 0, 256, 256);
            input.circle(
                this.x, 
                this.y, 
                this.size
            );
            input.stroke(
                defaultStrokeColor.r, 
                defaultStrokeColor.g, 
                defaultStrokeColor.b, 
                defaultStrokeColor.a, 
            );            
        }
        explode = function () {
            var directions = Array();
            directions.push(new Coord(this.x, this.y - 300));
            directions.push(new Coord(this.x + 300, this.y));
            directions.push(new Coord(this.x, this.y + 300));
            directions.push(new Coord(this.x - 300, this.y));

            for(var i = 0; i < directions.length; i++) {
                this.fire(directions[i]);

                this.fire(new Coord(directions[i].x + 1, directions[i].y + 1));
                this.fire(new Coord(directions[i].x - 1, directions[i].y - 1));

                this.fire(new Coord(directions[i].x + 2, directions[i].y + 2));
                this.fire(new Coord(directions[i].x - 2, directions[i].y - 2));

                this.fire(new Coord(directions[i].x + 3, directions[i].y + 3));
                this.fire(new Coord(directions[i].x - 3, directions[i].y - 3));

                this.fire(new Coord(directions[i].x + 4, directions[i].y + 4));
                this.fire(new Coord(directions[i].x - 4, directions[i].y - 4));

                this.fire(new Coord(directions[i].x + 5, directions[i].y + 5));
                this.fire(new Coord(directions[i].x - 5, directions[i].y - 5));

                this.fire(new Coord(directions[i].x + 10, directions[i].y + 10));
                this.fire(new Coord(directions[i].x - 10, directions[i].y - 10));

                this.fire(new Coord(directions[i].x + 20, directions[i].y + 20));
                this.fire(new Coord(directions[i].x - 20, directions[i].y - 20));

                this.fire(new Coord(directions[i].x + 30, directions[i].y + 30));
                this.fire(new Coord(directions[i].x - 30, directions[i].y - 30));

                this.fire(new Coord(directions[i].x + 40, directions[i].y + 40));
                this.fire(new Coord(directions[i].x - 40, directions[i].y - 40));
            }

            this.didExplode = true;
        }
        move = function () { }
        idle = function () { }
        attack = function () { }
    };


    document.addEventListener('keydown', recordKey);
    function recordKey(e) {
        switch (e.key) {
            case "r":
                world.player.isFiring = true;
                break;
            case "w":
                world.player.isMoving = true;
                break;
        }
    }

    document.addEventListener('keyup', stopKey);
    function stopKey(e) {
        switch (e.key) {
            case "r":
                world.player.isFiring = false;
                break;
            case "w":
                world.player.isMoving = false;
                break;
        }
    }

    var world;
    var defaultStrokeColor = new RGBA(256, 256, 256, 256);
    input.setup = function () {
        var height = window.innerHeight * 0.9;
        var width = window.innerWidth * 0.98;

        input.createCanvas(width, height);
        input.stroke(
            defaultStrokeColor.r, 
            defaultStrokeColor.g, 
            defaultStrokeColor.b, 
            defaultStrokeColor.a, 
        );

        world = new World(width, height, 10)
    };

    input.draw = function () {
        input.clear();
        if (!world.draw()) {
            input.noLoop();
        }
    }

};

var display = new p5(output, "canvas");

