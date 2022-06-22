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
    var HealthBar = /** @class */ (function () {
        function HealthBar(max, map) {
            this.draw = function () {
                if (this.hp != 0) {
                    input.stroke(256, 0, 0, 256);
                    input.fill(256, 0, 0, 256);
                    input.strokeWeight(5);
                    input.line(0, this.map.height - 1, this.map.width * (this.hp / this.max), this.map.height - 1);
                    input.strokeWeight(1);
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
    var Food = /** @class */ (function (_super) {
        __extends(Food, _super);
        function Food(x, y) {
            var _this = _super.call(this, 2, x, y) || this;
            _this.step = function () {
                this.growAge++;
                if (this.growAge % 3 == 0) {
                    if (this.size == 4) {
                        this.isGrowing = false;
                    }
                    if (this.size == 1) {
                        this.isGrowing = true;
                    }
                    if (this.isGrowing) {
                        this.size++;
                    }
                    else {
                        this.size--;
                    }
                }
            };
            _this.draw = function () {
                input.fill(defaultStrokeColor.r, 256);
                input.circle(this.x, this.y, this.size);
            };
            _this.isGrowing = true;
            _this.growAge = 0;
            return _this;
        }
        return Food;
    }(CenteredShape));
    var GridMapImage = /** @class */ (function () {
        function GridMapImage(width, height) {
            this.set = function (x, y) {
                this.map[x][y] = true;
            };
            this.unSet = function (x, y) {
                this.map[x][y] = false;
            };
            this.gridWidth = width;
            this.gridHeight = height;
            this.map = new Array();
            for (var i = 0; i < width; i++) {
                this.map[i] = new Array();
                for (var j = 0; j < height; j++) {
                    this.map[i][j] = false;
                }
            }
        }
        return GridMapImage;
    }());
    var GridSquare = /** @class */ (function () {
        function GridSquare(size, coord, isEmpty) {
            this.draw = function () {
                if (this.isHighlighted) {
                    input.fill(256, 0, 0, 256);
                    input.rect(this.coord.x, this.coord.y, this.size, this.size);
                }
                else {
                    if (this.isEmpty) {
                        return;
                    }
                    else {
                        var shade = defaultStrokeColor.r;
                        input.fill(shade, 256);
                        input.rect(this.coord.x, this.coord.y, this.size, this.size);
                    }
                }
            };
            this.size = size;
            this.isEmpty = isEmpty;
            this.coord = coord;
            this.visibleIndexes = null;
            this.isHightlighted = false;
        }
        return GridSquare;
    }());
    var GridMap = /** @class */ (function () {
        function GridMap(screenWidth, screenHeight, gridSquareSize, numberOfWalls, wallLength) {
            this.draw = function () {
                for (var i = 0; i < this.gridWidth; i++) {
                    for (var j = 0; j < this.gridHeight; j++) {
                        this.map[i][j].draw();
                    }
                }
            };
            // blocks out gridSquares that aren't visible from the viewpoint
            this.drawVisible = function (viewPointScreenCoord) {
                var viewPoint = this.getGridIndex(viewPointScreenCoord);
                for (var i = 0; i < this.gridWidth; i++) {
                    for (var j = 0; j < this.gridHeight; j++) {
                        if (this.map[viewPoint.x][viewPoint.y].visibleIndexes.map[i][j]) {
                            this.map[i][j].draw();
                        }
                        else {
                            input.fill(0, 256);
                            input.rect(i * this.gridSquareSize, j * this.gridSquareSize, this.gridSquareSize, this.gridSquareSize);
                        }
                    }
                }
            };
            this.isOpen = function (screenCoord) {
                if (0 < screenCoord.x &&
                    screenCoord.x < this.width &&
                    0 < screenCoord.y &&
                    screenCoord.y < this.height) {
                    var gridIndex = GridMap.getGridIndex(screenCoord, this.gridSquareSize);
                    return this.map[gridIndex.x][gridIndex.y].isEmpty;
                }
                else {
                    return false;
                }
            };
            this.getGridIndex = function (screenCoord) {
                return GridMap.getGridIndex(screenCoord, this.gridSquareSize);
            };
            var gridWidth = Math.floor(screenWidth / gridSquareSize);
            var gridHeight = Math.floor(screenHeight / gridSquareSize);
            var width = gridSquareSize * gridWidth;
            var height = gridSquareSize * gridHeight;
            this.gridSquareSize = gridSquareSize;
            this.width = width;
            this.height = height;
            this.gridWidth = gridWidth;
            this.gridHeight = gridHeight;
            this.map = Array();
            // make empty map
            for (var i = 0; i < gridWidth; i++) {
                this.map[i] = new Array();
                for (var j = 0; j < gridHeight; j++) {
                    var coord = new Coord((i * gridSquareSize), (j * gridSquareSize));
                    this.map[i][j] = new GridSquare(gridSquareSize, coord, true);
                }
            }
            // make walls
            for (var i = 0; i < numberOfWalls; i++) {
                var randomCoord = GridMap.getGridIndex(new Coord(Math.random() * width, Math.random() * height), gridSquareSize);
                this.map[randomCoord.x][randomCoord.y].isEmpty = false;
                // Determine along which axes the wall moves 
                var dx = Math.random() < .5;
                var dy = Math.random() < .5;
                for (var j = 0; j < wallLength; j++) {
                    var newX = randomCoord.x;
                    var newY = randomCoord.y;
                    if (dx) {
                        newX += j;
                    }
                    if (dy) {
                        newY += j;
                    }
                    var newCoord = new Coord(newX, newY);
                    if (newCoord.x >= gridWidth ||
                        newCoord.x < 0 ||
                        newCoord.y >= gridHeight ||
                        newCoord.y < 0) {
                        break; // don't go off the map
                    }
                    else {
                        this.map[newCoord.x][newCoord.y].isEmpty = false;
                    }
                }
            }
            // populate visibleIndexes for each GridSquare
            for (var i = 0; i < gridWidth; i++) {
                for (var j = 0; j < gridHeight; j++) {
                    if (this.map[i][j].isEmpty) {
                        this.map[i][j].visibleIndexes = new GridMapImage(gridWidth, gridHeight);
                        for (var k = 0; k < 360; k += 2) {
                            // wherever this Moveable is able to move in a "straight" line is visible from the starting place
                            var coordinateTracker = new Moveable(1, i * gridSquareSize, j * gridSquareSize, k, this);
                            var moveCount = 0;
                            while (coordinateTracker.move(2)) {
                                moveCount++;
                                if (moveCount > 50) {
                                    break;
                                }
                                var gridCoord = GridMap.getGridIndex(new Coord(coordinateTracker.x, coordinateTracker.y), gridSquareSize);
                                this.map[i][j].visibleIndexes.set(gridCoord.x, gridCoord.y);
                            }
                        }
                    }
                }
            }
        }
        GridMap.getGridIndex = function (screenCoord, gridSquareSize) {
            var indexX = Math.floor(screenCoord.x / gridSquareSize);
            var indexY = Math.floor(screenCoord.y / gridSquareSize);
            var indexCoord = new Coord(indexX, indexY);
            return indexCoord;
        };
        return GridMap;
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
    // an observer of NPC "sight" for hunting
    var World = /** @class */ (function () {
        function World(width, height, numberOfEnemies, numberOfWalls, wallLength, gridSquareSize) {
            this.draw = function () {
                var playerIsDead = false; // setting this allows the rest of the function to finish running before the game is stopped
                // world 
                this.frameCount++;
                this.map.draw();
                this.drawBullets(this.bullets);
                // player
                if (this.isShotByAny(this.player, this.bullets)) {
                    this.player.hp -= 1;
                    this.healthBar.hp = this.player.hp;
                }
                this.player.step();
                this.player.draw();
                if (this.player.hp == 0) {
                    playerIsDead = true;
                    document.getElementById("message").textContent = "You Lose.";
                }
                this.healthBar.draw();
                for (var i = 0; i < this.food.length; i++) {
                    if (this.food[i] != null) {
                        this.food[i].draw();
                        this.food[i].step();
                        if (5 > World.calculateDistance(this.player.x, this.player.y, this.food[i].x, this.food[i].y)) {
                            if (this.player.hp < this.healthBar.max) {
                                this.food[i] = null;
                                this.player.hp += 10;
                                this.healthBar.hp = this.player.hp;
                            }
                        }
                    }
                }
                var playerIndex = this.map.getGridIndex(new Coord(this.player.x, this.player.y));
                // NPCs
                for (var i = 0; i < this.nPCs.length; i++) {
                    if (this.nPCs[i] != null) {
                        //check for shots
                        if (this.isShotByAny(this.nPCs[i], this.bullets)) {
                            this.nPCs[i].hp--;
                        }
                        var npcGridCoord = this.map.getGridIndex(new Coord(this.nPCs[i].x, this.nPCs[i].y));
                        this.nPCs[i].seesPlayer = this.map.map[playerIndex.x][playerIndex.y].visibleIndexes.map[npcGridCoord.x][npcGridCoord.y];
                        if (this.nPCs[i].seesPlayer) {
                            this.nPCs[i].lastSeenPlayerCoord = new Coord(this.player.x, this.player.y);
                        }
                        this.nPCs[i].step();
                        this.nPCs[i].draw();
                        if (this.nPCs[i].hp <= 0) {
                            this.nPCs[i] = null;
                        }
                    }
                }
                if (playerIsDead) {
                    return false;
                }
                else {
                    return true;
                }
            };
            this.save = function () {
                return JSON.stringify(this.map);
            };
            this.drawBullets = function (list) {
                for (var i = 0; i < list.length; i++) {
                    if (list[i] != null) {
                        list[i].draw();
                        if (!list[i].step()) {
                            list[i] = null;
                        }
                    }
                }
            };
            // returns true if obj1 (target) is shot by obj2 (projectile)
            this.isShotBy = function (obj1, obj2) {
                var isClose = 3 > World.calculateDistance(obj1.x, obj1.y, obj2.x, obj2.y);
                var isInFrontOf = this.isInFrontOf(obj1, obj2);
                return isClose && isInFrontOf;
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
            this.isShotByAny = function (obj, arr) {
                for (var i = 0; i < arr.length; i++) {
                    if (arr[i] != null) {
                        if (this.isShotBy(obj, arr[i])) {
                            return true;
                        }
                    }
                }
                return false;
            };
            this.frameCount = 0;
            this.bullets = new Array();
            this.map = new GridMap(width, height, gridSquareSize, numberOfWalls, wallLength);
            var playerCoordinate = new Coord(this.map.width - 20, this.map.height - 50);
            // make sure the player starts on the map
            while (!this.map.isOpen(playerCoordinate)) {
                if (playerCoordinate.x > 0) {
                    playerCoordinate.x -= gridSquareSize;
                }
                else {
                    this.map = null;
                    playerCoordinate = new Coord(width - 20, height - 50);
                    this.map = new GridMap(width, height, gridSquareSize, numberOfWalls, wallLength);
                }
            }
            this.player = new Player(5, playerCoordinate.x, playerCoordinate.y, this.map, this.bullets);
            this.healthBar = new HealthBar(32, this.map);
            this.food = new Array();
            for (var i = 0; i < 5; i++) {
                this.food.push(new Food(Math.random() * this.map.width, Math.random() * this.map.height));
            }
            this.nPCs = new Array();
            for (var i = 0; i < numberOfEnemies; i++) {
                this.nPCs.push(new Pirate(5, this.map.width * Math.random(), (this.map.height / 2) * Math.random(), this.map, this.bullets, this.player));
                this.nPCs.push(new Bomb(this.map.width * Math.random(), (this.map.height / 2) * Math.random(), this.map, this.player, this.bullets));
                this.nPCs.push(new Mine(this.map.width * Math.random(), (this.map.height) * Math.random(), this.map, this.bullets));
                this.nPCs.push(new Chicken(Math.random() * this.map.width, Math.random() * this.map.height, this.map, this.food));
            }
        }
        // calculates a coordinate relative to (0, 0) that is length units in direction from (0, 0)
        // since it's relative to 0 its really easy to use addition to calculate a new coordinate from a coordinate that isn't 0
        // I debated if this should belong to Moveable, but decided it should stay in World because so much imprecision still exists in the calculation of directions in dotshot; may as well that the imprecision is managed closely together; a different world might want to manage all that imprecision all together in a different way. -David
        World.calculateCoordinate = function (length, direction) {
            var quadrant = Math.floor(direction / 90); // the quadrant that the new coord will be in relative to the moveable as if the space is a unit circle where the moveable is at (0, 0)
            var quadrantAngle = direction - (quadrant * 90);
            var quadrantAngleIsLowHalf = quadrantAngle < 45;
            var finalAngle;
            if (quadrantAngleIsLowHalf) {
                finalAngle = quadrantAngle;
            }
            else {
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
                }
                else {
                    dx = Math.acos(angleInRadians);
                    dy = Math.asin(angleInRadians);
                }
                dy *= -1;
                if (quadrant == 2) {
                    dx *= -1;
                    dy *= -1;
                }
            }
            else {
                if (quadrantAngleIsLowHalf) {
                    dx = Math.acos(angleInRadians);
                    dy = Math.asin(angleInRadians);
                }
                else {
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
        };
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
            _this.point = function (target) {
                this.direction = World.calculateDirection(this.x, this.y, target.x, target.y);
            };
            _this.move = function (velocity) {
                // this function can be understood in two basic parts
                // port one calculates the objects new coordinates based off of their current coordinates, their direction, their velocity
                var relativeChangeCoordinate = World.calculateCoordinate(velocity, this.direction);
                var newX = this.x + relativeChangeCoordinate.x;
                var newY = this.y + relativeChangeCoordinate.y;
                // part two determines if the coordinates are somewhere the character can actually go
                if (this.map.isOpen(new Coord(newX, newY))) {
                    this.x = newX;
                    this.y = newY;
                    return true;
                }
                else {
                    return false;
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
        function Bullet(x, y, target, map) {
            var _this = _super.call(this, 3, x, y, World.calculateDirection(x, y, target.x, target.y), map) || this;
            _this.step = function () {
                if (!this.hasPassedTarget) {
                    var distance = World.calculateDistance(this.x, this.y, this.target.x, this.target.y);
                    if (distance > 10) {
                        this.point(this.target);
                    }
                    else {
                        this.hasPassedTarget = true;
                    }
                }
                this.move(6);
                this.age++;
                if (this.age < 80) {
                    return true;
                }
                else {
                    return false;
                }
            };
            _this.draw = function () {
                input.fill(256, 256);
                input.circle(this.x, this.y, this.size);
            };
            _this.age = 0;
            _this.target = target;
            _this.hasPassedTarget = false;
            return _this;
        }
        return Bullet;
    }(Moveable));
    var Character = /** @class */ (function (_super) {
        __extends(Character, _super);
        function Character(size, x, y, map, bullets, maxHP) {
            var _this = _super.call(this, size, x, y, Math.random() * 360, map) || this;
            _this.fire = function (target) {
                this.bullets.push(new Bullet(this.x, this.y, target, this.map));
            };
            _this.step = function () { };
            _this.hp = maxHP;
            _this.bullets = bullets;
            return _this;
        }
        return Character;
    }(Moveable));
    var Player = /** @class */ (function (_super) {
        __extends(Player, _super);
        function Player(size, x, y, map, bullets) {
            var _this = _super.call(this, size, x, y, map, bullets, 32) || this;
            _this.step = function () {
                this.point(new Coord(input.mouseX, input.mouseY));
                if (this.isFiring) {
                    this.firingAge++;
                    if (this.firingAge % 4 == 0) {
                        this.fire(new Coord(input.mouseX, input.mouseY));
                    }
                }
                else {
                    this.firingAge = 0;
                }
                if (this.isMoving) {
                    this.move(3);
                }
            };
            _this.draw = function () {
                var shade = defaultStrokeColor.r;
                input.fill(shade, 256);
                input.circle(this.x, this.y, this.size);
            };
            _this.isFiring = true;
            _this.isMoving = false;
            _this.firingAge = 0;
            return _this;
        }
        return Player;
    }(Character));
    var NPC = /** @class */ (function (_super) {
        __extends(NPC, _super);
        function NPC(size, x, y, map, bullets, maxHP, target, life, idleAge, idleLife) {
            var _this = _super.call(this, size, x, y, map, bullets, maxHP) || this;
            _this.idle = function () {
                if (!(this.idleAge < this.idleLife)) {
                    this.idleAge = 0;
                    this.idleLife = Math.random() * 2000;
                    this.direction = Math.random() * 360;
                }
                this.idleAge++;
                this.move(1);
            };
            _this.attack = function () { };
            _this.decideDraw = function () {
                if (this.isHunting || this.seesPlayer) {
                    this.attack();
                }
                else {
                    this.idle();
                }
            };
            _this.isHunting = false;
            _this.age = 0;
            _this.idleAge = idleAge;
            _this.idleLife = idleLife;
            _this.target = target;
            _this.seesPlayer = false;
            _this.lastSeenPlayerCoord = null;
            return _this;
        }
        return NPC;
    }(Character));
    var Chicken = /** @class */ (function (_super) {
        __extends(Chicken, _super);
        function Chicken(x, y, map, food) {
            var _this = _super.call(this, 5, x, y, map, null, 8, null, 1000, 0, 200) || this;
            _this.draw = function () {
                var shade = defaultStrokeColor.r;
                input.fill(shade, 256);
                input.circle(this.x, this.y, this.size);
            };
            _this.step = function () {
                if (this.hp <= 0) {
                    this.food.push(new Food(this.x, this.y));
                }
                if (this.seesPlayer) {
                    if (this.fleeAge < this.fleeLife) {
                        this.fleeAge++;
                    }
                    else {
                        this.fleeAge = 0;
                        this.direction = Math.random() * 360;
                    }
                    this.move(2);
                }
                else {
                    this.idle();
                }
            };
            _this.isRunning = false;
            _this.fleeAge = 0;
            _this.fleeLife = 20;
            _this.food = food;
            return _this;
        }
        return Chicken;
    }(NPC));
    var Bomb = /** @class */ (function (_super) {
        __extends(Bomb, _super);
        function Bomb(x, y, map, target, bullets) {
            var _this = _super.call(this, 5, x, y, map, bullets, 8, target, 1000, 0, 200) || this;
            _this.draw = function () {
                input.stroke(128, 0, 0, 256);
                input.fill(128, 0, 0, 256);
                input.circle(this.x, this.y, this.size);
                input.stroke(defaultStrokeColor.r, defaultStrokeColor.g, defaultStrokeColor.b, defaultStrokeColor.a);
            };
            _this.step = function () {
                if (this.didIgnite) {
                    this.igniteAge++;
                    if (this.igniteAge > 100) {
                        this.explode();
                    }
                }
                this.decideDraw();
            };
            _this.explode = function () {
                this.fire(new Coord(this.target.x, this.target.y));
                this.fire(new Coord(this.target.x + 1, this.target.y + 1));
                this.fire(new Coord(this.target.x - 1, this.target.y - 1));
                this.fire(new Coord(this.target.x + 2, this.target.y + 2));
                this.fire(new Coord(this.target.x - 2, this.target.y - 2));
                this.fire(new Coord(this.target.x + 3, this.target.y + 3));
                this.fire(new Coord(this.target.x - 3, this.target.y - 3));
                this.hp = 0;
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
            _this.attack = function () {
                var distance = World.calculateDistance(this.x, this.y, this.lastSeenPlayerCoord.x, this.lastSeenPlayerCoord.y);
                var willMove = true;
                if (this.seesPlayer) {
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
                    this.point(this.lastSeenPlayerCoord);
                    this.move(1.6);
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
        function Pirate(size, x, y, map, bullets, target) {
            var _this = _super.call(this, size, x, y, map, bullets, 8, target, 1000, 0, 200) || this;
            _this.draw = function () {
                input.stroke(256, 0, 0, 256);
                input.fill(256, 0, 0, 256);
                input.circle(this.x, this.y, this.size);
                input.stroke(defaultStrokeColor.r, defaultStrokeColor.g, defaultStrokeColor.b, defaultStrokeColor.a);
            };
            _this.step = function () {
                this.weaponCooldownCounter++;
                this.decideDraw();
            };
            _this.attack = function () {
                this.point(this.lastSeenPlayerCoord);
                this.move(0.5);
                if (this.seesPlayer) {
                    if (this.weaponCooldownCounter % 16 == 0) {
                        this.fire(new Coord(this.target.x, this.target.y));
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
        function Mine(x, y, map, bullets) {
            var _this = _super.call(this, 5, x, y, map, bullets, 1, null, 1000, 0, 200) || this;
            _this.draw = function () {
                input.stroke(128, 128, 128, 256);
                input.fill(128, 128, 128, 256);
                input.circle(this.x, this.y, this.size);
                input.stroke(defaultStrokeColor.r, defaultStrokeColor.g, defaultStrokeColor.b, defaultStrokeColor.a);
            };
            _this.explode = function () {
                var directions = Array();
                directions.push(new Coord(this.x, this.y - 300));
                directions.push(new Coord(this.x + 300, this.y));
                directions.push(new Coord(this.x, this.y + 300));
                directions.push(new Coord(this.x - 300, this.y));
                for (var i = 0; i < directions.length; i++) {
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
            };
            _this.move = function () {
                return false;
            };
            _this.idle = function () { };
            _this.attack = function () { };
            _this.step = function () {
                if (this.hp <= 0) {
                    this.explode();
                }
            };
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
            case "Shift":
                world.player.isFiring = true;
                break;
            case "w":
                world.player.isMoving = true;
                break;
            case " ":
                world.player.isMoving = true;
                break;
            case "ArrowUp":
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
            case "Shift":
                world.player.isFiring = false;
                break;
            case "w":
                world.player.isMoving = false;
                break;
            case " ":
                world.player.isMoving = false;
                break;
            case "ArrowUp":
                world.player.isMoving = false;
                break;
        }
    }
    input.setup = function () {
        var height = window.innerHeight * 0.9;
        var width = window.innerWidth * 0.98;
        if (height > 700) {
            height = 700;
        }
        if (width > 700) {
            width = 700;
        }
        input.frameRate(100000);
        input.createCanvas(width, height);
        input.stroke(defaultStrokeColor.r, defaultStrokeColor.g, defaultStrokeColor.b, defaultStrokeColor.a);
        world = new World(width, height, worldSettings[0].value, worldSettings[1].value, worldSettings[2].value, worldSettings[3].value);
    };
    input.draw = function () {
        input.clear();
        if (!world.draw()) {
            input.noLoop();
        }
    };
};
var NumericalSetting = /** @class */ (function () {
    function NumericalSetting(name, defaultValue, value) {
        this.display = function () {
            var output = "<p class='label'>" + this.name + "</p> <input type='range' min='0' max='500' value='" + this.value + "' id='" + this.name + "'>";
            var container = document.getElementById("worldSettings");
            if (container) {
                container.innerHTML += output;
            }
        };
        this.setFromDocument = function () {
            var element = document.getElementById(this.name);
            if (element) {
                this.value = element.value;
            }
        };
        this.name = name;
        this.defaultValue = defaultValue;
        if (this.value == null) {
            this.value = defaultValue;
        }
        else {
            this.value = value;
        }
    }
    return NumericalSetting;
}());
var printMap = function () {
    var container = document.getElementById("json");
    if (container) {
        container.innerHTML = world.save();
    }
};
var RGBA = /** @class */ (function () {
    function RGBA(r, g, b, a) {
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
    }
    return RGBA;
}());
var world;
var defaultStrokeColor;
var display = null;
var worldSettings = new Array();
var firstRunSinceLoad = true;
worldSettings.push(new NumericalSetting("numberOfEnemies", "10", null));
worldSettings.push(new NumericalSetting("numberOfWalls", "50", null));
worldSettings.push(new NumericalSetting("wallLength", "10", null));
worldSettings.push(new NumericalSetting("gridSquareSize", "8", null));
var startNewGame = function () {
    var isLight = window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (isLight) {
        defaultStrokeColor = new RGBA(256, 256, 256, 256);
    }
    else {
        defaultStrokeColor = new RGBA(0, 0, 0, 256);
    }
    for (var i = 0; i < worldSettings.length; i++) {
        worldSettings[i].setFromDocument();
    }
    if (firstRunSinceLoad) {
        firstRunSinceLoad = false;
        for (var i = 0; i < worldSettings.length; i++) {
            worldSettings[i].display();
        }
    }
    if (display != null) {
        display.remove();
    }
    display = new p5(output, "canvas");
};
