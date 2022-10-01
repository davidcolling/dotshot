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
var RGBA = /** @class */ (function () {
    function RGBA(r, g, b, a) {
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
    }
    return RGBA;
}());
var Coord = /** @class */ (function () {
    function Coord(x, y) {
        this.x = x;
        this.y = y;
    }
    return Coord;
}());
var Drawable = /** @class */ (function () {
    function Drawable() {
    }
    Drawable.prototype.draw = function (drawWorker, strokeColor) { };
    return Drawable;
}());
var CenteredShape = /** @class */ (function (_super) {
    __extends(CenteredShape, _super);
    function CenteredShape(size, x, y) {
        var _this = _super.call(this) || this;
        _this.size = size;
        _this.x = x;
        _this.y = y;
        return _this;
    }
    CenteredShape.prototype.draw = function (drawWorker, strokeColor) {
        drawWorker.circle(this.x, this.y, this.size);
    };
    return CenteredShape;
}(Drawable));
var NPcSpawner = /** @class */ (function (_super) {
    __extends(NPcSpawner, _super);
    function NPcSpawner(x, y, world) {
        var _this = _super.call(this, 8, x, y) || this;
        _this.counter = 0;
        _this.world = world;
        return _this;
    }
    NPcSpawner.prototype.step = function () {
        this.counter++;
        if (this.counter % (Math.floor(World.calculateDistance(this.world.player.x, this.world.player.y, this.x, this.y))) == 0) {
            this.world.nPCs.push(new Pirate(this.x, this.y, this.world.map, this.world.bullets, this.world.player));
        }
    };
    NPcSpawner.prototype.draw = function (drawWorker, strokeColor) {
        drawWorker.circle(this.x, this.y, this.size);
    };
    return NPcSpawner;
}(CenteredShape));
var Weapon = /** @class */ (function () {
    function Weapon(bullets, owner) {
        this.bullets = bullets;
        this.owner = owner;
    }
    Weapon.prototype.fire = function (target) { };
    return Weapon;
}());
var Gun = /** @class */ (function (_super) {
    __extends(Gun, _super);
    function Gun(bullets, owner) {
        return _super.call(this, bullets, owner) || this;
    }
    Gun.prototype.fire = function (target) {
        _super.prototype.fire.call(this, target);
        this.bullets.push(new Bullet(this.owner.x, this.owner.y, target, this.owner.map));
    };
    return Gun;
}(Weapon));
var DoubleBarrelGun = /** @class */ (function (_super) {
    __extends(DoubleBarrelGun, _super);
    function DoubleBarrelGun(bullets, owner) {
        return _super.call(this, bullets, owner) || this;
    }
    DoubleBarrelGun.prototype.fire = function (target) {
        _super.prototype.fire.call(this, target);
        this.bullets.push(new Bullet(this.owner.x + 5, this.owner.y, target, this.owner.map));
        this.bullets.push(new Bullet(this.owner.x - 5, this.owner.y, target, this.owner.map));
    };
    return DoubleBarrelGun;
}(Weapon));
var Ping = /** @class */ (function (_super) {
    __extends(Ping, _super);
    function Ping(x, y) {
        var _this = _super.call(this, 1, x, y) || this;
        _this.step = function () {
            this.age++;
            this.size++;
        };
        _this.age = 0;
        return _this;
    }
    Ping.prototype.draw = function (drawWorker, strokeColor) {
        drawWorker.fill(strokeColor.r, 0);
        _super.prototype.draw.call(this, drawWorker, strokeColor);
    };
    return Ping;
}(CenteredShape));
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
        _this.isGrowing = true;
        _this.growAge = 0;
        return _this;
    }
    Food.prototype.draw = function (drawWorker, strokeColor) {
        drawWorker.fill(strokeColor.r, 256);
        _super.prototype.draw.call(this, drawWorker, strokeColor);
    };
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
var GridSquare = /** @class */ (function (_super) {
    __extends(GridSquare, _super);
    function GridSquare(size, coord, isEmpty) {
        var _this = _super.call(this) || this;
        _this.isVisible = function (coord) {
            if (this.visibleIndexes == null) {
                return true;
            }
            else {
                return this.visibleIndexes.map[coord.x][coord.y];
            }
        };
        _this.size = size;
        _this.isEmpty = isEmpty;
        _this.coord = coord;
        _this.visibleIndexes = null;
        _this.isHighlighted = false;
        return _this;
    }
    GridSquare.prototype.draw = function (drawWorker, strokeColor) {
        if (this.isHighlighted) {
            drawWorker.fill(256, 0, 0, 256);
            drawWorker.rect(this.coord.x, this.coord.y, this.size, this.size);
        }
        else {
            if (this.isEmpty) {
                return;
            }
            else {
                var shade = strokeColor.r;
                drawWorker.fill(shade, 256);
                drawWorker.rect(this.coord.x, this.coord.y, this.size, this.size);
            }
        }
    };
    return GridSquare;
}(Drawable));
var HealthBar = /** @class */ (function (_super) {
    __extends(HealthBar, _super);
    function HealthBar(max, map) {
        var _this = _super.call(this) || this;
        _this.max = max;
        _this.map = map;
        _this.hp = _this.max;
        return _this;
    }
    HealthBar.prototype.draw = function (drawWorker, strokeColor) {
        if (this.hp != 0) {
            drawWorker.stroke(256, 0, 0, 256);
            drawWorker.fill(256, 0, 0, 256);
            drawWorker.strokeWeight(5);
            drawWorker.line(0, this.map.height - 1, this.map.width * (this.hp / this.max), this.map.height - 1);
            drawWorker.strokeWeight(1);
            drawWorker.stroke(strokeColor.r, strokeColor.g, strokeColor.b, strokeColor.a);
        }
    };
    return HealthBar;
}(Drawable));
var GridMap = /** @class */ (function (_super) {
    __extends(GridMap, _super);
    function GridMap(screenWidth, screenHeight, gridSquareSize, numberOfWalls, wallLength, isEmpty) {
        var _this = _super.call(this) || this;
        // blocks out gridSquares that aren't visible from the viewpoint
        _this.drawVisible = function (viewPointScreenCoord, drawWorker) {
            if (!this.isEmpty) {
                var viewPoint = this.getGridIndex(viewPointScreenCoord);
                for (var i = 0; i < this.gridWidth; i++) {
                    for (var j = 0; j < this.gridHeight; j++) {
                        if (this.map[viewPoint.x][viewPoint.y].isVisible(new Coord(i, j))) {
                            this.map[i][j].draw(drawWorker);
                        }
                        else {
                            drawWorker.fill(0, 256);
                            drawWorker.rect(i * this.gridSquareSize, j * this.gridSquareSize, this.gridSquareSize, this.gridSquareSize);
                        }
                    }
                }
            }
        };
        _this.isOpen = function (screenCoord) {
            if (!this.isEmpty) {
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
            }
            else {
                return true;
            }
        };
        _this.getGridIndex = function (screenCoord) {
            if (!this.isEmpty)
                return GridMap.getGridIndex(screenCoord, this.gridSquareSize);
        };
        var gridWidth = Math.floor(screenWidth / gridSquareSize);
        var gridHeight = Math.floor(screenHeight / gridSquareSize);
        var width = gridSquareSize * gridWidth;
        var height = gridSquareSize * gridHeight;
        _this.width = width;
        _this.height = height;
        _this.isEmpty = isEmpty;
        if (!isEmpty) {
            _this.gridSquareSize = gridSquareSize;
            _this.gridWidth = gridWidth;
            _this.gridHeight = gridHeight;
            _this.map = Array();
            // make empty map
            for (var i = 0; i < gridWidth; i++) {
                _this.map[i] = new Array();
                for (var j = 0; j < gridHeight; j++) {
                    var coord = new Coord((i * gridSquareSize), (j * gridSquareSize));
                    _this.map[i][j] = new GridSquare(gridSquareSize, coord, true);
                }
            }
            // make walls
            for (var i = 0; i < numberOfWalls; i++) {
                var randomCoord = GridMap.getGridIndex(new Coord(Math.random() * width, Math.random() * height), gridSquareSize);
                _this.map[randomCoord.x][randomCoord.y].isEmpty = false;
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
                        _this.map[newCoord.x][newCoord.y].isEmpty = false;
                    }
                }
            }
            // populate visibleIndexes for each GridSquare
            for (var i = 0; i < gridWidth; i++) {
                for (var j = 0; j < gridHeight; j++) {
                    if (_this.map[i][j].isEmpty) {
                        _this.map[i][j].visibleIndexes = new GridMapImage(gridWidth, gridHeight);
                        var furthestDistance = 0;
                        for (var k = 0; k < 360; k += 2) {
                            // wherever this Moveable is able to move in a "straight" line is visible from the starting place
                            var previousCoord = new Coord(i * gridSquareSize, j * gridSquareSize);
                            var currentDistance = 0;
                            var coordinateTracker = new Moveable(1, i * gridSquareSize, j * gridSquareSize, k, _this);
                            var moveCount = 0;
                            while (coordinateTracker.move(2)) {
                                //check if the tracker entered a new grid cell
                                if (coordinateTracker.x != previousCoord.x ||
                                    coordinateTracker.y != previousCoord.y) {
                                    currentDistance++;
                                    previousCoord.x = coordinateTracker.x;
                                    previousCoord.y = coordinateTracker.y;
                                }
                                moveCount++;
                                if (moveCount > 50) {
                                    break;
                                }
                                var gridCoord = GridMap.getGridIndex(new Coord(coordinateTracker.x, coordinateTracker.y), gridSquareSize);
                                _this.map[i][j].visibleIndexes.set(gridCoord.x, gridCoord.y);
                            }
                            if (currentDistance > furthestDistance) {
                                furthestDistance = currentDistance;
                            }
                        }
                    }
                }
            }
        }
        else {
            _this.gridSquareSize = null;
            _this.gridWidth = null;
            _this.gridHeight = null;
            _this.map = null;
        }
        return _this;
    }
    GridMap.prototype.draw = function (drawWorker, strokeColor) {
        if (!this.isEmpty) {
            for (var i = 0; i < this.gridWidth; i++) {
                for (var j = 0; j < this.gridHeight; j++) {
                    this.map[i][j].draw(drawWorker, strokeColor);
                }
            }
        }
    };
    GridMap.getGridIndex = function (screenCoord, gridSquareSize) {
        var indexX = Math.floor(screenCoord.x / gridSquareSize);
        var indexY = Math.floor(screenCoord.y / gridSquareSize);
        var indexCoord = new Coord(indexX, indexY);
        return indexCoord;
    };
    return GridMap;
}(Drawable));
// facade and factory of all game objects: bullets, map, characters (player and npc)
// an unenforced singleton
// on observer of when bullets should be collected from characters
// an observer of when objects need to become null, eg old bullets and dead npc
// an observer of when characters lose hp
// an observer of NPC "sight" for hunting
var World = /** @class */ (function () {
    function World(width, height, numberOfEnemies, map, loading, strokeColor) {
        this.draw = function () {
            var playerIsDead = false; // setting this allows the rest of the function to finish running before the game is stopped
            // world 
            this.frameCount++;
            this.map.draw(this.drawWorker, this.strokeColor);
            this.drawBullets(this.bullets);
            // player
            if (this.player != null) {
                this.player.control(this.drawWorker);
                this.player.step();
                if (this.isShotByAny(this.player, this.bullets)) {
                    this.player.takeDamage(1);
                    this.healthBar.hp = this.player.hp;
                }
                this.player.draw(this.drawWorker, this.strokeColor);
                if (this.player.hp == 0) {
                    playerIsDead = true;
                }
                this.healthBar.draw(this.drawWorker, this.strokeColor);
                for (var i = 0; i < this.food.length; i++) {
                    if (this.food[i] != null) {
                        this.food[i].draw(this.drawWorker, this.strokeColor);
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
                if (this.frameCount % 32 == 0) {
                    this.pings.push(new Ping(this.player.x, this.player.y));
                }
            }
            if (this.player != null) {
                var playerIndex = this.map.getGridIndex(new Coord(this.player.x, this.player.y));
            }
            // NPCs
            for (var i = 0; i < this.nPCs.length; i++) {
                if (this.nPCs[i] != null) {
                    //check for shots
                    if (this.isShotByAny(this.nPCs[i], this.bullets)) {
                        this.nPCs[i].takeDamage(1);
                    }
                    if (this.player != null) {
                        var npcGridCoord = this.map.getGridIndex(new Coord(this.nPCs[i].x, this.nPCs[i].y));
                        this.nPCs[i].seesPlayer = this.map.map[playerIndex.x][playerIndex.y].isVisible(new Coord(npcGridCoord.x, npcGridCoord.y));
                        if (this.nPCs[i].seesPlayer) {
                            this.nPCs[i].lastSeenPlayerCoord = new Coord(this.player.x, this.player.y);
                        }
                    }
                    this.nPCs[i].step();
                    this.nPCs[i].draw(this.drawWorker, this.strokeColor);
                    if (this.nPCs[i].hp <= 0) {
                        this.nPCs[i] = null;
                        this.player.enemiesKilled++;
                    }
                }
            }
            for (var i = 0; i < this.spawners.length; i++) {
                if (this.spawners[i] != null) {
                    this.spawners[i].draw(this.drawWorker, this.strokeColor);
                    this.spawners[i].step();
                }
            }
            // pings 
            for (var i = 0; i < this.pings.length; i++) {
                if (this.pings[i] != null) {
                    this.pings[i].step();
                    this.pings[i].draw(this.drawWorker, this.strokeColor);
                    if (this.pings[i].age > 16) {
                        this.pings[i] = null;
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
                    list[i].draw(this.drawWorker, this.strokeColor);
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
        this.drawWorker = null;
        this.strokeColor = strokeColor;
        this.pings = new Array();
        if (!loading) {
            this.map = map;
            var playerCoordinate = new Coord(this.map.width - 20, this.map.height - 50);
            while (!map.isOpen(playerCoordinate)) {
                playerCoordinate.x--;
            }
            this.player = new Player(5, playerCoordinate.x, playerCoordinate.y, this.map, this.bullets);
            this.healthBar = new HealthBar(32, this.map);
            this.food = new Array();
            for (var i = 0; i < 5; i++) {
                this.food.push(new Food(Math.random() * this.map.width, Math.random() * this.map.height));
            }
            this.nPCs = new Array();
            for (var i = 0; i < numberOfEnemies; i++) {
                this.nPCs.push(new Pirate(this.map.width * Math.random(), (this.map.height / 2) * Math.random(), this.map, this.bullets, this.player));
                this.nPCs.push(new Bomb(this.map.width * Math.random(), (this.map.height / 2) * Math.random(), this.map, this.bullets, this.player));
                this.nPCs.push(new Mine(this.map.width * Math.random(), (this.map.height) * Math.random(), this.map, this.bullets));
                this.nPCs.push(new Chicken(Math.random() * this.map.width, Math.random() * this.map.height, this.map, this.food));
            }
            this.spawners = new Array();
            this.spawners.push(new NPcSpawner(this.map.width / 2, this.map.height / 2, this));
        }
        else {
            this.map = new GridMap(width, height, 0, 0, 0, true);
            this.player = null;
            this.healthBar = null;
            this.food = null;
            this.nPCs = new Array();
            this.nPCs.push(new LoadingActor(width / 2, height / 2, this.map, this.bullets));
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
        _this.age = 0;
        _this.target = target;
        _this.hasPassedTarget = false;
        return _this;
    }
    Bullet.prototype.draw = function (drawWorker, strokeColor) {
        drawWorker.fill(256, 256);
        _super.prototype.draw.call(this, drawWorker, strokeColor);
    };
    return Bullet;
}(Moveable));
var Character = /** @class */ (function (_super) {
    __extends(Character, _super);
    function Character(size, x, y, map, bullets, maxHP) {
        var _this = _super.call(this, size, x, y, Math.random() * 360, map) || this;
        _this.fire = function (target) {
            this.weapons[this.currentWeapon].fire(target);
        };
        _this.step = function () { };
        _this.hp = maxHP;
        _this.bullets = bullets;
        _this.weapons = new Array();
        _this.weapons.push(new Gun(bullets, _this));
        _this.currentWeapon = 0;
        return _this;
    }
    Character.prototype.takeDamage = function (amount) {
        this.hp -= amount;
    };
    ;
    return Character;
}(Moveable));
var Player = /** @class */ (function (_super) {
    __extends(Player, _super);
    function Player(size, x, y, map, bullets) {
        var _this = _super.call(this, size, x, y, map, bullets, 32) || this;
        _this.step = function () {
            if (this.size != this.initalSize) {
                this.size = this.initialSize;
            }
        };
        _this.control = function (drawWorker) {
            this.point(new Coord(drawWorker.mouseX, drawWorker.mouseY));
            if (this.isFiring) {
                this.firingAge++;
                if (this.firingAge % 4 == 0) {
                    this.fire(new Coord(drawWorker.mouseX, drawWorker.mouseY));
                }
            }
            else {
                this.firingAge = 0;
            }
            if (this.isMoving) {
                this.move(3);
            }
        };
        _this.weapons.push(new DoubleBarrelGun(bullets, _this));
        _this.initialSize = size;
        _this.isFiring = true;
        _this.isMoving = false;
        _this.firingAge = 0;
        _this.enemiesKilled = 0;
        return _this;
    }
    Player.prototype.draw = function (drawWorker, strokeColor) {
        var shade = strokeColor.r;
        drawWorker.fill(shade, 256);
        _super.prototype.draw.call(this, drawWorker, strokeColor);
    };
    Player.prototype.takeDamage = function (amount) {
        _super.prototype.takeDamage.call(this, amount);
        this.size = 30;
    };
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
    Chicken.prototype.draw = function (drawWorker, strokeColor) {
        var shade = strokeColor.r;
        drawWorker.fill(shade, 256);
        _super.prototype.draw.call(this, drawWorker, strokeColor);
    };
    return Chicken;
}(NPC));
var Bomb = /** @class */ (function (_super) {
    __extends(Bomb, _super);
    function Bomb(x, y, map, bullets, target) {
        var _this = _super.call(this, 5, x, y, map, bullets, 8, target, 1000, 0, 200) || this;
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
    Bomb.prototype.draw = function (drawWorker, strokeColor) {
        drawWorker.stroke(128, 0, 0, 256);
        drawWorker.fill(128, 0, 0, 256);
        _super.prototype.draw.call(this, drawWorker, strokeColor);
        drawWorker.stroke(strokeColor.r, strokeColor.g, strokeColor.b, strokeColor.a);
    };
    return Bomb;
}(NPC));
;
var Pirate = /** @class */ (function (_super) {
    __extends(Pirate, _super);
    function Pirate(x, y, map, bullets, target) {
        var _this = _super.call(this, 5, x, y, map, bullets, 8, target, 1000, 0, 200) || this;
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
    Pirate.prototype.draw = function (drawWorker, strokeColor) {
        drawWorker.stroke(256, 0, 0, 256);
        drawWorker.fill(256, 0, 0, 256);
        _super.prototype.draw.call(this, drawWorker, strokeColor);
        drawWorker.stroke(strokeColor.r, strokeColor.g, strokeColor.b, strokeColor.a);
    };
    return Pirate;
}(NPC));
;
var LoadingActor = /** @class */ (function (_super) {
    __extends(LoadingActor, _super);
    function LoadingActor(x, y, map, bullets) {
        var _this = _super.call(this, 5, x, y, map, bullets, 1, null, 1000, 0, 200) || this;
        _this.step = function () {
            if (this.direction < 360) {
                this.direction += 3;
            }
            else {
                this.direction = 0;
            }
            this.move(3);
            if (this.stepCount % 8 == 0) {
                var bulletRelative = World.calculateCoordinate(10, this.direction);
                this.fire(new Coord(this.x + bulletRelative.x, this.y + bulletRelative.y));
            }
            this.stepCount++;
        };
        _this.stepCount = 0;
        return _this;
    }
    LoadingActor.prototype.draw = function (drawWorker, strokeColor) {
        var shade = strokeColor.r;
        drawWorker.fill(shade, 256);
        _super.prototype.draw.call(this, drawWorker, strokeColor);
    };
    return LoadingActor;
}(NPC));
var Mine = /** @class */ (function (_super) {
    __extends(Mine, _super);
    function Mine(x, y, map, bullets) {
        var _this = _super.call(this, 5, x, y, map, bullets, 1, null, 1000, 0, 200) || this;
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
    Mine.prototype.draw = function (drawWorker, strokeColor) {
        drawWorker.stroke(130, 128, 128, 256);
        drawWorker.fill(128, 128, 128, 256);
        _super.prototype.draw.call(this, drawWorker, strokeColor);
        drawWorker.stroke(strokeColor.r, strokeColor.g, strokeColor.b, strokeColor.a);
    };
    return Mine;
}(NPC));
;
var HTMLDotshotUI = /** @class */ (function () {
    function HTMLDotshotUI() {
        this.startNewGame = function () {
            if (this.display != null) {
                this.display.remove();
            }
            for (var i = 0; i < this.worldSettings.length; i++) {
                this.worldSettings[i].setFromDocument();
            }
            document.getElementById("message").textContent = "Loading...";
            var map = new GridMap(this.width, this.height, this.worldSettings[3].value, this.worldSettings[1].value, this.worldSettings[2].value, false);
            this.world = new World(this.width, this.height, this.worldSettings[0].value, map, false, this.defaultStrokeColor);
            this.display = new p5(output, "canvas");
            document.getElementById("message").textContent = "'w' to move; 'r' to shoot; player faces the cursor; desktop only";
        };
        this.saveMap = function () {
            var map = this.world.save();
            // https://stackoverflow.com/questions/13405129/create-and-save-a-file-with-javascript
            var file = new Blob([map], { type: "string" });
            if (window.navigator.msSaveOrOpenBlob) {
                window.navigator.msSaveOrOpenBlob(file, "map.json");
            }
            else {
                var a = document.createElement("a"), url = URL.createObjectURL(file);
                a.href = url;
                a.download = "map.json";
                document.body.appendChild(a);
                a.click();
                setTimeout(function () {
                    document.body.removeChild(a);
                    window.URL.revokeObjectURL(url);
                }, 0);
            }
        };
        // determine dimensions 
        var height = window.innerHeight * 0.9;
        var width = window.innerWidth * 0.98;
        if (height > 700) {
            height = 700;
        }
        if (width > 700) {
            width = 700;
        }
        this.height = height;
        this.width = width;
        // determine light/dark colorscheme
        var isLight = window.matchMedia("(prefers-color-scheme: dark)").matches;
        if (isLight) {
            this.defaultStrokeColor = new RGBA(256, 256, 256, 256);
        }
        else {
            this.defaultStrokeColor = new RGBA(0, 0, 0, 256);
        }
        // Create and display settings
        this.worldSettings = new Array();
        this.worldSettings.push(new NumericalSetting("numberOfEnemies", "10", null));
        this.worldSettings.push(new NumericalSetting("numberOfWalls", "50", null));
        this.worldSettings.push(new NumericalSetting("wallLength", "10", null));
        this.worldSettings.push(new NumericalSetting("gridSquareSize", "8", null));
        for (var i = 0; i < this.worldSettings.length; i++) {
            this.worldSettings[i].display();
        }
    }
    return HTMLDotshotUI;
}());
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
document.addEventListener('keydown', recordKey);
function recordKey(e) {
    switch (e.key) {
        case "r":
            game.world.player.isFiring = true;
            break;
        case "Shift":
            game.world.player.isFiring = true;
            break;
        case "w":
            game.world.player.isMoving = true;
            break;
        case " ":
            game.world.player.isMoving = true;
            break;
        case "ArrowUp":
            game.world.player.isMoving = true;
            break;
        case "1":
            game.world.player.currentWeapon = 0;
            break;
        case "2":
            if (game.world.player.weapons.length > 1) {
                game.world.player.currentWeapon = 1;
            }
    }
}
document.addEventListener('keyup', stopKey);
function stopKey(e) {
    switch (e.key) {
        case "r":
            game.world.player.isFiring = false;
            break;
        case "Shift":
            game.world.player.isFiring = false;
            break;
        case "w":
            game.world.player.isMoving = false;
            break;
        case " ":
            game.world.player.isMoving = false;
            break;
        case "ArrowUp":
            game.world.player.isMoving = false;
            break;
    }
}
var output = function (drawWorker) {
    drawWorker.setup = function () {
        drawWorker.frameRate(100000);
        drawWorker.createCanvas(game.width, game.height);
        drawWorker.stroke(game.defaultStrokeColor.r, game.defaultStrokeColor.g, game.defaultStrokeColor.b, game.defaultStrokeColor.a);
        game.world.drawWorker = drawWorker;
    };
    drawWorker.draw = function () {
        drawWorker.clear();
        if (!game.world.draw()) {
            drawWorker.noLoop();
        }
    };
};
var game;
var loadPage = function () {
    game = new HTMLDotshotUI();
};
