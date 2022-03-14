var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var output = function (input) {
    var RGBA = /** @class */ (function () {
        function RGBA(r, g, b, a) {
            this.r = r;
            this.g = g;
            this.b = b;
            this.a = a;
        }
        return RGBA;
    }());
    var HealthBar = /** @class */ (function () {
        function HealthBar(max, map) {
            this.draw = function () {
                if (this.hp != 0) {
                    input.stroke(256, 0, 0, 256);
                    input.fill(256, 0, 0, 256);
                    input.line(0, this.map.height - 1, this.map.width * (this.hp / this.max), this.map.height - 1);
                    input.stroke(defaultStrokeColor.r, defaultStrokeColor.g, defaultStrokeColor.b, defaultStrokeColor.a);
                }
            };
            this.max = max;
            this.map = map;
            this.hp = this.max;
        }
        return HealthBar;
    }());
    var CenteredShape = /** @class */ (function () {
        function CenteredShape(size, x, y) {
            this.draw = function () { };
            this.size = size;
            this.x = x;
            this.y = y;
        }
        return CenteredShape;
    }());
    var Coord = /** @class */ (function () {
        function Coord(x, y) {
            this.x = x;
            this.y = y;
        }
        return Coord;
    }());
    var Wall = /** @class */ (function () {
        function Wall(end1, end2) {
            this.draw = function () {
                input.fill(256, 256);
                input.line(this.end1.x, this.end1.y, this.end2.x, this.end2.y);
            };
            this.end1 = end1;
            this.end2 = end2;
        }
        return Wall;
    }());
    ;
    // composite of walls
    var Structure = /** @class */ (function () {
        function Structure() {
            this.draw = function () {
                for (var i = 0; i < this.walls.length; i++) {
                    this.walls[i].draw();
                }
            };
            this.walls = new Array();
        }
        return Structure;
    }());
    var Castle = /** @class */ (function (_super) {
        __extends(Castle, _super);
        // coord of center 
        function Castle(location, size) {
            var _this = _super.call(this) || this;
            _this.location = location;
            _this.walls.push(new Wall(//1
            new Coord(_this.location.x - (size / 2), _this.location.y - (size / 2)), new Coord(_this.location.x - (size / 8), _this.location.y - (size / 2))));
            _this.walls.push(new Wall(//2
            new Coord(_this.location.x + (size / 8), _this.location.y - (size / 2)), new Coord(_this.location.x + (size / 2), _this.location.y - (size / 2))));
            _this.walls.push(new Wall(//3
            new Coord(_this.location.x + (size / 2), _this.location.y - (size / 2)), new Coord(_this.location.x + (size / 2), _this.location.y - (size / 8))));
            _this.walls.push(new Wall(//4
            new Coord(_this.location.x + (size / 2), _this.location.y + (size / 8)), new Coord(_this.location.x + (size / 2), _this.location.y + (size / 2))));
            _this.walls.push(new Wall(//5
            new Coord(_this.location.x + (size / 2), _this.location.y + (size / 2)), new Coord(_this.location.x + (size / 8), _this.location.y + (size / 2))));
            _this.walls.push(new Wall(//6
            new Coord(_this.location.x - (size / 8), _this.location.y + (size / 2)), new Coord(_this.location.x - (size / 2), _this.location.y + (size / 2))));
            _this.walls.push(new Wall(//7
            new Coord(_this.location.x - (size / 2), _this.location.y + (size / 2)), new Coord(_this.location.x - (size / 2), _this.location.y + (size / 8))));
            _this.walls.push(new Wall(//8
            new Coord(_this.location.x - (size / 2), _this.location.y - (size / 8)), new Coord(_this.location.x - (size / 2), _this.location.y - (size / 2))));
            _this.walls.push(new Wall(//9
            new Coord(_this.location.x - (size / 8), _this.location.y - (size / 4)), new Coord(_this.location.x + (size / 8), _this.location.y - (size / 4))));
            _this.walls.push(new Wall(//10
            new Coord(_this.location.x + (size / 4), _this.location.y - (size / 8)), new Coord(_this.location.x + (size / 4), _this.location.y + (size / 8))));
            _this.walls.push(new Wall(//11
            new Coord(_this.location.x - (size / 8), _this.location.y + (size / 4)), new Coord(_this.location.x + (size / 8), _this.location.y + (size / 4))));
            _this.walls.push(new Wall(//12
            new Coord(_this.location.x - (size / 4), _this.location.y - (size / 8)), new Coord(_this.location.x - (size / 4), _this.location.y + (size / 8))));
            return _this;
        }
        return Castle;
    }(Structure));
    var Map = /** @class */ (function (_super) {
        __extends(Map, _super);
        function Map(width, height) {
            var _this = _super.call(this) || this;
            _this.addWall = function (wall) {
                this.walls.push(wall);
            };
            // returns true if there is no wall between points 1 and 2
            _this.isOpen = function (x1, y1, x2, y2) {
                // https://stackoverflow.com/questions/7069420/check-if-two-line-segments-are-colliding-only-check-if-they-are-intersecting-n
                // To spell it out: suppose you're looking at two line segments, [AB] and [CD]. The segments intersect if and only if ((A and B are of different sides of [CD]) and (C and D are on different sides of [AB])).
                //                            1     2                                           [walls.1 walls.2]
                // To see whether two points, P and Q, are on different sides of a line segment [E       F], compute two cross products, one for P and one for Q:
                // (F[x] - E[x])(P[y] - F[y]) - (F[y] - E[y])(P[x] - F[x])
                // (F[x] - E[x])(Q[y] - F[y]) - (F[y] - E[y])(Q[x] - F[x])
                // If the results have the same sign (both positive or both negative) then forget it, the points are on the same side, the segments do not intersect. If one is positive and the other negative, then the points are on opposite sides.
                for (var i = 0; i < this.walls.length; i++) {
                    if (this.pointsAreSplit(x1, y1, x2, y2, this.walls[i]) &&
                        this.pointsAreSplit(this.walls[i].end1.x, this.walls[i].end1.y, this.walls[i].end2.x, this.walls[i].end2.y, new Wall(new Coord(x1, y1), new Coord(x2, y2)))) {
                        return false;
                    }
                }
                return true;
            };
            // returns true if x1, y1 are on opposite sides of wall
            _this.pointsAreSplit = function (x1, y1, x2, y2, wall) {
                var val1 = (wall.end2.x - wall.end1.x) * (y1 - wall.end2.y) - (wall.end2.y - wall.end1.y) * (x1 - wall.end2.x);
                var val2 = (wall.end2.x - wall.end1.x) * (y2 - wall.end2.y) - (wall.end2.y - wall.end1.y) * (x2 - wall.end2.x);
                if ((val1 < 0 && val2 > 0) || (val1 > 0 && val2 < 0)) { // if points have opposite signs,
                    return true; // then they are opposite sides of the wall
                }
                return false;
            };
            _this.width = width;
            _this.height = height;
            _this.walls.push(new Wall(new Coord(0, 0), new Coord(width, 0)));
            _this.walls.push(new Wall(new Coord(width, 0), new Coord(width, height)));
            _this.walls.push(new Wall(new Coord(0, height), new Coord(width, height)));
            _this.walls.push(new Wall(new Coord(0, height), new Coord(0, 0)));
            return _this;
        }
        return Map;
    }(Structure));
    ;
    // facade and factory of all game objects: bullets, map, characters (player and npc)
    // an unenforced singleton
    // on observer of when bullets should be collected from characters
    // an observer of when objects need to become null, eg old bullets and dead npc
    // an observer of when characters lose hp
    // an observer of when npc should idle or attack
    var World = /** @class */ (function () {
        function World(width, height, numberOfEnemies) {
            this.draw = function () {
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
                if (playerIsDead) {
                    return false;
                }
                else {
                    return true;
                }
            };
            this.drawBullets = function (list) {
                for (var i = 0; i < list.length; i++) {
                    if (list[i] != null) {
                        if (!list[i].draw()) {
                            list[i] = null;
                        }
                    }
                }
            };
            this.drawAnimateEnemies = function (list) {
                for (var i = 0; i < list.length; i++) {
                    if (list[i] != null) {
                        // calculate npc behavior
                        var seesPlayer = (400 > World.calculateDistance(this.player.x, this.player.y, list[i].x, list[i].y) &&
                            this.map.isOpen(this.player.x, this.player.y, list[i].x, list[i].y));
                        //check for shots
                        if (this.checkIsShot(list[i], this.bullets)) {
                            list[i].decideDraw(seesPlayer, new Coord(this.player.x, this.player.y), -1);
                        }
                        else {
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
            };
            this.drawAnimateMines = function (list) {
                for (var i = 0; i < list.length; i++) {
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
            };
            this.getCharacterBullets = function (character) {
                for (var i = 0; i < character.bullets.length; i++) {
                    this.bullets.push(character.bullets[i]);
                }
                character.bullets = new Array();
            };
            // obj2 is the projectile
            this.isShot = function (obj1, obj2) {
                return (5 > World.calculateDistance(obj1.x, obj1.y, obj2.x, obj2.y) &&
                    this.isInFrontOf(obj1, obj2));
            };
            this.isInFrontOf = function (obj1, obj2) {
                return 90 >= Math.abs(this.calculateDifference(obj1.direction, World.calculateDirection(obj1.x, obj1.y, obj2.x, obj2.y)));
            };
            this.calculateDifference = function (direction1, direction2) {
                var difference = direction1 - direction2;
                if (difference > 180) {
                    difference = 360 - difference;
                }
                return difference;
            };
            this.checkIsShot = function (obj, arr) {
                for (var i = 0; i < arr.length; i++) {
                    if (arr[i] != null) {
                        if (this.isShot(obj, arr[i])) {
                            return true;
                        }
                    }
                }
                return false;
            };
            this.frameCount = 0;
            this.map = new Map(width, height);
            this.bullets = new Array();
            this.healthBar = new HealthBar(8, this.map);
            // put stuff on the map
            if (Math.random() < 0.3) {
                for (var i = 0; i < 60; i++) {
                    this.map.addWall(new Wall(new Coord(i * (this.map.width / 60), 50 + (Math.random() * (this.map.height * 0.8))), new Coord(i * (this.map.width / 60), Math.random() * (this.map.height * 0.8))));
                }
            }
            else {
                for (var i = 0; i < 2; i++) {
                    this.map.addWall(new Wall(new Coord(Math.random() * this.map.width, Math.random() * this.map.height), new Coord(Math.random() * this.map.width, Math.random() * this.map.height)));
                }
                for (var i = 0; i < 15; i++) {
                    var castle = new Castle(new Coord(Math.random() * (0.7 * this.map.width), Math.random() * (0.7 * this.map.height)), Math.random() * 500);
                    for (var j = 0; j < castle.walls.length; j++) {
                        this.map.addWall(castle.walls[j]);
                    }
                }
            }
            // make characters
            this.enemies = new Array();
            this.player = new Player(5, this.map.width - 20, this.map.height - 50, this.map);
            for (var i = 0; i < numberOfEnemies; i++) {
                this.enemies.push(new Pirate(5, this.map.width * Math.random(), (this.map.height / 2) * Math.random(), this.map));
                this.enemies.push(new Bomb(this.map.width * Math.random(), (this.map.height / 2) * Math.random(), this.map));
            }
            this.mines = new Array();
            for (var i = 0; i < 20; i++) {
                this.mines.push(new Mine(this.map.width * Math.random(), (this.map.height) * Math.random(), this.map));
            }
        }
        World.calculateDistance = function (x1, y1, x2, y2) {
            return Math.sqrt(Math.pow(Math.abs(x2 - x1), 2) + Math.pow(Math.abs(y2 - y1), 2));
        };
        World.calculateDirection = function (x1, y1, x2, y2) {
            var dx = x1 - x2;
            var dy = y1 - y2;
            var direction;
            if (dx != 0 && dy != 0) {
                if (dx < 0 && dy > 0) { // target is in quadrant 1
                    direction = Math.atan2(Math.abs(dx), Math.abs(dy)) * (180 / Math.PI);
                }
                else if (dx < 0 && dy < 0) { // target is in q2
                    direction = Math.atan2(Math.abs(dy), Math.abs(dx)) * (180 / Math.PI);
                    direction += 90;
                }
                else if (dx > 0 && dy < 0) { // q3
                    direction = Math.atan2(Math.abs(dx), Math.abs(dy)) * (180 / Math.PI);
                    direction += 180;
                }
                else if (dx > 0 && dy > 0) { // q4
                    direction = Math.atan2(Math.abs(dy), Math.abs(dx)) * (180 / Math.PI);
                    direction += 270;
                }
                return direction;
            }
        };
        return World;
    }());
    var Moveable = /** @class */ (function (_super) {
        __extends(Moveable, _super);
        function Moveable(size, x, y, direction, map) {
            var _this = _super.call(this, size, x, y) || this;
            _this.move = function (velocity, offset) {
                // this function can be understood in two basic parts
                // port one calculates the objects new coordinates based off of their current coordinates, their direction, their velocity
                var dx;
                var dy;
                var offsetDirection = this.direction + offset;
                if (offsetDirection > 359) {
                    offsetDirection -= 360;
                }
                var quadrantAngle;
                var quadrantAngleInRadians;
                if (offsetDirection >= 0 && offsetDirection < 90) {
                    quadrantAngle = offsetDirection;
                    if (quadrantAngle < 45) {
                        quadrantAngleInRadians = quadrantAngle * (Math.PI / 180);
                        dx = velocity * Math.asin(quadrantAngleInRadians);
                        dy = velocity * Math.acos(quadrantAngleInRadians);
                    }
                    else {
                        quadrantAngleInRadians = quadrantAngle * (Math.PI / 180);
                        dx = velocity * Math.acos(quadrantAngleInRadians);
                        dy = velocity * Math.asin(quadrantAngleInRadians);
                    }
                }
                else if (offsetDirection >= 90 && offsetDirection < 180) {
                    quadrantAngle = offsetDirection - 90;
                    if (quadrantAngle < 45) {
                        quadrantAngleInRadians = quadrantAngle * (Math.PI / 180);
                        dx = velocity * Math.acos(quadrantAngleInRadians);
                        dy = velocity * Math.asin(quadrantAngleInRadians) * -1;
                    }
                    else {
                        quadrantAngleInRadians = (90 - quadrantAngle) * (Math.PI / 180);
                        dx = velocity * Math.asin(quadrantAngleInRadians);
                        dy = velocity * Math.acos(quadrantAngleInRadians) * -1;
                    }
                }
                else if (offsetDirection >= 180 && offsetDirection < 270) {
                    quadrantAngle = offsetDirection - 180;
                    if (quadrantAngle < 45) {
                        quadrantAngleInRadians = quadrantAngle * (Math.PI / 180);
                        dx = velocity * Math.asin(quadrantAngleInRadians) * -1;
                        dy = velocity * Math.acos(quadrantAngleInRadians) * -1;
                    }
                    else {
                        quadrantAngleInRadians = (90 - quadrantAngle) * (Math.PI / 180);
                        dx = velocity * Math.acos(quadrantAngleInRadians) * -1;
                        dy = velocity * Math.asin(quadrantAngleInRadians) * -1;
                    }
                }
                else if (offsetDirection >= 270 && offsetDirection < 360) {
                    quadrantAngle = offsetDirection - 270;
                    if (quadrantAngle < 45) {
                        quadrantAngleInRadians = quadrantAngle * (Math.PI / 180);
                        dx = velocity * Math.acos(quadrantAngleInRadians) * -1;
                        dy = velocity * Math.asin(quadrantAngleInRadians);
                    }
                    else {
                        quadrantAngleInRadians = (90 - quadrantAngle) * (Math.PI / 180);
                        dx = velocity * Math.asin(quadrantAngleInRadians) * -1;
                        dy = velocity * Math.acos(quadrantAngleInRadians);
                    }
                }
                console.log(dx);
                console.log(dy);
                var newX = this.x + dx;
                var newY = this.y + dy;
                // part two determines if the coordinates are somewhere the character can actually go
                if (this.map.isOpen(this.x, this.y, newX, newY) &&
                    0 < newX && // idk why but without the additional bounds checks the player sometimes disappears when moving in direction between 359-360 degrees
                    newX < this.map.width &&
                    0 < newY &&
                    newY < this.map.height) {
                    this.x = newX;
                    this.y = newY;
                }
            };
            _this.direction = direction;
            _this.map = map;
            return _this;
        }
        return Moveable;
    }(CenteredShape));
    var Bullet = /** @class */ (function (_super) {
        __extends(Bullet, _super);
        function Bullet(x, y, direction, map) {
            var _this = _super.call(this, 3, x, y, direction, map) || this;
            _this.draw = function () {
                input.fill(256, 256);
                this.move(15, 0);
                input.circle(this.x, this.y, this.size);
                this.age++;
                if (this.age < 30) {
                    return true;
                }
                else {
                    return false;
                }
            };
            _this.age = 0;
            return _this;
        }
        return Bullet;
    }(Moveable));
    var Character = /** @class */ (function (_super) {
        __extends(Character, _super);
        function Character(size, x, y, map) {
            var _this = _super.call(this, size, x, y, Math.random() * 360, map) || this;
            _this.point = function (x1, y1, x2, y2) {
                this.direction = World.calculateDirection(x1, y1, x2, y2);
            };
            _this.fire = function (direction) {
                if (direction == null) {
                    var bulletDirection = this.direction;
                }
                else {
                    var bulletDirection = direction;
                }
                var bullet = new Bullet(this.x, this.y, bulletDirection, this.map);
                this.bullets.push(bullet);
            };
            _this.hp = 8;
            _this.bullets = new Array();
            return _this;
        }
        return Character;
    }(Moveable));
    var Player = /** @class */ (function (_super) {
        __extends(Player, _super);
        function Player(size, x, y, map) {
            var _this = _super.call(this, size, x, y, map) || this;
            _this.draw = function () {
                this.point(this.x, this.y, input.mouseX, input.mouseY);
                if (this.isFiring) {
                    this.fire(null);
                }
                if (this.isMoving) {
                    this.move(2, 0);
                }
                input.fill(256, 256);
                input.circle(this.x, this.y, this.size);
                if (this.hp == 0) {
                    return false;
                }
                else {
                    return true;
                }
            };
            _this.isFiring = false;
            _this.isMoving = false;
            return _this;
        }
        return Player;
    }(Character));
    var NPC = /** @class */ (function (_super) {
        __extends(NPC, _super);
        function NPC(size, x, y, map, life, idleAge, idleLife) {
            var _this = _super.call(this, size, x, y, map) || this;
            _this.draw = function () {
                input.fill(256, 256);
                input.circle(this.x, this.y, this.size);
            };
            _this.idle = function () {
                if (!(this.idleAge < this.idleLife)) {
                    this.idleAge = 0;
                    this.idleLife = Math.random() * 2000;
                    this.direction = Math.random() * 360;
                }
                this.idleAge++;
                this.move(1, 0);
            };
            _this.attack = function (seesPlayer) { };
            _this.decideDraw = function (seesPlayer, lastSeenPlayerCoord, hpOffset) {
                this.draw();
                this.hp += hpOffset;
                if (this.isHunting || seesPlayer) {
                    if (seesPlayer) {
                        this.lastSeenPlayerCoord = lastSeenPlayerCoord;
                    }
                    this.attack(seesPlayer);
                }
                else {
                    this.idle();
                }
            };
            _this.didExplode = false;
            _this.isHunting = false;
            _this.age = 0;
            _this.idleAge = idleAge;
            _this.idleLife = idleLife;
            _this.lastSeenPlayerCoord = null;
            return _this;
        }
        return NPC;
    }(Character));
    var Bomb = /** @class */ (function (_super) {
        __extends(Bomb, _super);
        function Bomb(x, y, map) {
            var _this = _super.call(this, 5, x, y, map, 1000, 0, 200) || this;
            _this.draw = function () {
                if (this.didIgnite) {
                    this.igniteAge++;
                    if (this.igniteAge > 100) {
                        this.didExplode = true;
                        this.explode();
                    }
                }
                input.stroke(0, 256, 0, 256);
                input.fill(0, 256, 0, 256);
                input.circle(this.x, this.y, this.size);
                input.stroke(defaultStrokeColor.r, defaultStrokeColor.g, defaultStrokeColor.b, defaultStrokeColor.a);
            };
            _this.explode = function () {
                this.fire(this.direction);
                this.fire(this.direction + 1);
                this.fire(this.direction - 1);
                this.fire(this.direction + 2);
                this.fire(this.direction - 2);
                this.fire(this.direction + 3);
                this.fire(this.direction - 3);
                this.fire(this.direction + 4);
                this.fire(this.direction - 4);
                this.fire(this.direction + 5);
                this.fire(this.direction - 5);
                this.fire(this.direction + 10);
                this.fire(this.direction - 10);
                this.fire(this.direction + 20);
                this.fire(this.direction - 20);
                this.fire(this.direction + 30);
                this.fire(this.direction - 30);
            };
            // animation for when its about to explode
            _this.pulse = function () {
                if (this.isGrowing) {
                    if (this.size < 9) {
                        this.size += 1;
                    }
                    else {
                        this.isGrowing = false;
                        this.size -= 1;
                    }
                }
                else {
                    if (this.size > 5) {
                        this.size -= 1;
                    }
                    else {
                        this.isGrowing = true;
                        this.size += 1;
                    }
                }
            };
            _this.attack = function (seesPlayer) {
                var distance = World.calculateDistance(this.x, this.y, this.lastSeenPlayerCoord.x, this.lastSeenPlayerCoord.y);
                var willMove = true;
                if (seesPlayer) {
                    if (distance < 300) {
                        this.pulse();
                        if (distance < 200) {
                            this.didIgnite = true;
                            if (distance < 100) {
                                willMove = false;
                            }
                        }
                    }
                }
                if (willMove) {
                    this.point(this.x, this.y, this.lastSeenPlayerCoord.x, this.lastSeenPlayerCoord.y);
                    this.move(1.6, 0);
                }
                if (!this.isHunting) {
                    this.isHunting = true;
                }
                else {
                    if (distance < 2 && !this.didIgnite) {
                        this.isHunting = false;
                    }
                }
            };
            _this.didIgnite = false;
            _this.igniteAge = 0;
            _this.isGrowing = true;
            return _this;
        }
        return Bomb;
    }(NPC));
    ;
    var Pirate = /** @class */ (function (_super) {
        __extends(Pirate, _super);
        function Pirate(size, x, y, map) {
            var _this = _super.call(this, size, x, y, map, 1000, 0, 200) || this;
            _this.draw = function () {
                this.weaponCooldownCounter++;
                input.stroke(256, 0, 0, 256);
                input.fill(256, 0, 0, 256);
                input.circle(this.x, this.y, this.size);
                input.stroke(defaultStrokeColor.r, defaultStrokeColor.g, defaultStrokeColor.b, defaultStrokeColor.a);
            };
            _this.attack = function (seesPlayer) {
                this.point(this.x, this.y, this.lastSeenPlayerCoord.x, this.lastSeenPlayerCoord.y);
                this.move(0.5, 0);
                if (seesPlayer) {
                    if (this.weaponCooldownCounter % 16 == 0) {
                        this.fire(null);
                    }
                }
                if (this.isHunting) {
                    if (0 != World.calculateDistance(this.x, this.y, this.lastSeenPlayerCoord.x, this.lastSeenPlayerCoord.y)) {
                        this.isHunting = false;
                    }
                }
                else {
                    this.isHunting = true;
                }
            };
            _this.weaponCooldownCounter = 0;
            return _this;
        }
        return Pirate;
    }(NPC));
    ;
    var Mine = /** @class */ (function (_super) {
        __extends(Mine, _super);
        function Mine(x, y, map) {
            var _this = _super.call(this, 5, x, y, map, 1000, 0, 200) || this;
            _this.draw = function () {
                if (this.didIgnite) {
                    this.explode();
                }
                input.stroke(0, 0, 256, 256);
                input.fill(0, 0, 256, 256);
                input.circle(this.x, this.y, this.size);
                input.stroke(defaultStrokeColor.r, defaultStrokeColor.g, defaultStrokeColor.b, defaultStrokeColor.a);
            };
            _this.explode = function () {
                for (var i = 0; i < 3; i++) {
                    var perpendicular = 90 * i;
                    this.fire(perpendicular);
                    this.fire(perpendicular + 1);
                    this.fire(perpendicular - 1);
                    this.fire(perpendicular + 2);
                    this.fire(perpendicular - 2);
                    this.fire(perpendicular + 3);
                    this.fire(perpendicular - 3);
                    this.fire(perpendicular + 4);
                    this.fire(perpendicular - 4);
                    this.fire(perpendicular + 5);
                    this.fire(perpendicular - 5);
                    this.fire(perpendicular + 10);
                    this.fire(perpendicular - 10);
                    this.fire(perpendicular + 20);
                    this.fire(perpendicular - 20);
                    this.fire(perpendicular + 30);
                    this.fire(perpendicular - 30);
                }
                this.didExplode = true;
            };
            _this.move = function () { };
            _this.idle = function () { };
            _this.attack = function () { };
            _this.didIgnite = false;
            _this.didExplode = false;
            return _this;
        }
        return Mine;
    }(NPC));
    ;
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
        input.stroke(defaultStrokeColor.r, defaultStrokeColor.g, defaultStrokeColor.b, defaultStrokeColor.a);
        world = new World(width, height, 10);
    };
    input.draw = function () {
        input.clear();
        if (!world.draw()) {
            input.noLoop();
        }
    };
};
var display = new p5(output, "canvas");
