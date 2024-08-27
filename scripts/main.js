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
    Coord.prototype.createOffset = function (dx, dy) {
        return new Coord(this.x + dx, this.y + dy);
    };
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
    function CenteredShape(size, location) {
        var _this = _super.call(this) || this;
        _this.size = size;
        _this.location = location;
        return _this;
    }
    CenteredShape.prototype.draw = function (drawWorker, strokeColor) {
        drawWorker.circle(this.location.x, this.location.y, this.size);
    };
    return CenteredShape;
}(Drawable));
var NPcSpawner = /** @class */ (function (_super) {
    __extends(NPcSpawner, _super);
    function NPcSpawner(location, world) {
        var _this = _super.call(this, 8, location) || this;
        _this.counter = 0;
        _this.world = world;
        return _this;
    }
    NPcSpawner.prototype.step = function () {
        this.counter++;
        if (this.counter % (Math.floor(World.calculateDistance(this.world.player.location, this.location))) == 0) {
            this.world.nPCs.push(new Pirate(this.location, this.world.map, this.world.bullets, this.world.player));
        }
    };
    NPcSpawner.prototype.draw = function (drawWorker, strokeColor) {
        drawWorker.circle(this.location.x, this.location.y, this.size);
    };
    return NPcSpawner;
}(CenteredShape));
var Weapon = /** @class */ (function () {
    function Weapon(bullets, owner, coolDownTimer) {
        this.bullets = bullets;
        this.owner = owner;
        this.counter = 0;
        this.lastCount = 0;
        this.coolDownTimer = coolDownTimer;
    }
    Weapon.prototype.shoot = function (target) {
        if (!this.hasShot || this.counter - this.lastCount >= this.coolDownTimer) {
            if (!this.hasShot) {
                this.hasShot = true;
            }
            this.counter = this.lastCount;
            this.fire(target);
        }
    };
    Weapon.prototype.fire = function (target) { };
    Weapon.prototype.step = function () {
        this.counter++;
    };
    return Weapon;
}());
var Gun = /** @class */ (function (_super) {
    __extends(Gun, _super);
    function Gun(bullets, owner, coolDownTimer) {
        return _super.call(this, bullets, owner, coolDownTimer) || this;
    }
    Gun.prototype.fire = function (target) {
        _super.prototype.fire.call(this, target);
        this.bullets.push(new Bullet(this.owner.location, target, this.owner.map, this.owner));
    };
    return Gun;
}(Weapon));
var ExplodingBulletGun = /** @class */ (function (_super) {
    __extends(ExplodingBulletGun, _super);
    function ExplodingBulletGun(bullets, owner, coolDownTimer) {
        return _super.call(this, bullets, owner, coolDownTimer) || this;
    }
    ExplodingBulletGun.prototype.fire = function (target) {
        _super.prototype.fire.call(this, target);
        this.bullets.push(new ExplodingBullet(this.owner.location, target, this.owner.map, this.owner, this.bullets));
    };
    return ExplodingBulletGun;
}(Weapon));
var DoubleBarrelGun = /** @class */ (function (_super) {
    __extends(DoubleBarrelGun, _super);
    function DoubleBarrelGun(bullets, owner, coolDownTimer) {
        return _super.call(this, bullets, owner, coolDownTimer) || this;
    }
    DoubleBarrelGun.prototype.fire = function (target) {
        _super.prototype.fire.call(this, target);
        this.bullets.push(new Bullet(this.owner.location.createOffset(5, 0), target, this.owner.map, this.owner));
        this.bullets.push(new Bullet(this.owner.location.createOffset(-5, 0), target, this.owner.map, this.owner));
    };
    return DoubleBarrelGun;
}(Weapon));
var Cannon = /** @class */ (function (_super) {
    __extends(Cannon, _super);
    function Cannon(bullets, owner) {
        return _super.call(this, bullets, owner, 35) || this;
    }
    Cannon.prototype.fire = function (target) {
        _super.prototype.fire.call(this, target);
        this.bullets.push(new CannonBall(this.owner.location.createOffset(5, 0), target, this.owner.map, this.owner));
        this.lastCount = this.counter;
    };
    return Cannon;
}(Weapon));
var Ping = /** @class */ (function (_super) {
    __extends(Ping, _super);
    function Ping(location) {
        var _this = _super.call(this, 1, location) || this;
        _this.age = 0;
        return _this;
    }
    Ping.prototype.step = function () {
        this.age++;
        this.size++;
    };
    Ping.prototype.draw = function (drawWorker, strokeColor) {
        drawWorker.fill(strokeColor.r, 0);
        _super.prototype.draw.call(this, drawWorker, strokeColor);
    };
    return Ping;
}(CenteredShape));
var Food = /** @class */ (function (_super) {
    __extends(Food, _super);
    function Food(location) {
        var _this = _super.call(this, 2, location) || this;
        _this.isGrowing = true;
        _this.growAge = 0;
        return _this;
    }
    Food.prototype.step = function () {
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
    Food.prototype.draw = function (drawWorker, strokeColor) {
        drawWorker.fill(strokeColor.r, 256);
        _super.prototype.draw.call(this, drawWorker, strokeColor);
    };
    return Food;
}(CenteredShape));
var GridMapImage = /** @class */ (function () {
    function GridMapImage(width, height, viewPoint, viewDistance) {
        this.gridWidth = width;
        this.gridHeight = height;
        this.viewPoint = viewPoint;
        this.viewDistance = viewDistance;
        var distLeft = viewDistance;
        if (this.viewPoint.x < this.viewDistance)
            distLeft -= this.viewDistance - this.viewPoint.x;
        this.distLeft = distLeft;
        var distRight = viewDistance;
        if (this.viewPoint.x + this.viewDistance > width)
            distRight -= this.viewDistance - (width - this.viewPoint.x);
        this.distRight = distRight;
        var distAbove = viewDistance;
        if (this.viewPoint.y < this.viewDistance)
            distAbove -= this.viewDistance - this.viewPoint.y;
        this.distAbove = distAbove;
        var distBelow = viewDistance;
        if (this.viewPoint.y + this.viewDistance > height)
            distBelow -= this.viewDistance - (height - this.viewPoint.y);
        this.distBelow = distBelow;
        this.map = new Array();
        for (var i = 0; i < distLeft + distRight + 1; i++) {
            this.map[i] = new Array();
            for (var j = 0; j < distAbove + distBelow + 1; j++) {
                this.map[i][j] = false;
            }
        }
    }
    GridMapImage.prototype.set = function (x, y) {
        var subMapCoord = this.mapIndexToHashIndex(new Coord(x, y));
        if (this.indexIsInRange(subMapCoord)) {
            this.map[subMapCoord.x][subMapCoord.y] = true;
        }
    };
    GridMapImage.prototype.unSet = function (x, y) {
        var subMapCoord = this.mapIndexToHashIndex(new Coord(x, y));
        if (this.indexIsInRange(subMapCoord)) {
            this.map[subMapCoord.x][subMapCoord.y] = false;
        }
    };
    GridMapImage.prototype.canSee = function (coord) {
        var subMapCoord = this.mapIndexToHashIndex(coord);
        if (this.indexIsInRange(subMapCoord)) {
            return this.map[subMapCoord.x][subMapCoord.y];
        }
        else {
            return false;
        }
    };
    // translates a grid index from the whole map to the grid index of the interal hash map representing the visible portion of the entire math
    GridMapImage.prototype.mapIndexToHashIndex = function (coord) {
        var dx = this.viewPoint.x - this.distLeft;
        var dy = this.viewPoint.y - this.distAbove;
        return new Coord(coord.x - dx, coord.y - dy);
    };
    GridMapImage.prototype.indexIsInRange = function (coord) {
        return (coord.x >= 0 &&
            coord.x < this.map.length &&
            coord.y >= 0 &&
            coord.y < this.map[0].length);
    };
    return GridMapImage;
}());
var GridSquare = /** @class */ (function (_super) {
    __extends(GridSquare, _super);
    function GridSquare(size, coord, isEmpty) {
        var _this = _super.call(this) || this;
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
    GridSquare.prototype.isVisible = function (coord) {
        if (this.visibleIndexes == null) {
            return true;
        }
        else {
            return this.visibleIndexes.canSee(coord);
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
            var viewDistance = 10;
            for (var i = 0; i < gridWidth; i++) {
                for (var j = 0; j < gridHeight; j++) {
                    if (_this.map[i][j].isEmpty) {
                        _this.map[i][j].visibleIndexes = new GridMapImage(gridWidth, gridHeight, new Coord(i, j), viewDistance);
                        for (var x = -300; x < 300; x++) {
                            var y;
                            if (x < 0) {
                                y = 300 + x;
                            }
                            else {
                                y = 300 - x;
                            }
                            for (var k = 0; k < 1; k++) {
                                if (k == 1) {
                                    x = -x;
                                    y = -y;
                                }
                                // wherever this Moveable is able to move in a "straight" line is visible from the starting place
                                var coordinateTracker = new Moveable(1, new Coord(i * gridSquareSize, j * gridSquareSize), new Coord(x, y), 3, _this, false);
                                var previousCoord = new Coord(i, j);
                                var currentDistance = 0;
                                while (coordinateTracker.move(2)) {
                                    var gridCoord = GridMap.getGridIndex(coordinateTracker.location, gridSquareSize);
                                    //check if the tracker entered a new grid cell
                                    if (gridCoord.x != previousCoord.x ||
                                        gridCoord.y != previousCoord.y) {
                                        currentDistance++;
                                        previousCoord.x = gridCoord.x;
                                        previousCoord.y = gridCoord.y;
                                        _this.map[i][j].visibleIndexes.set(gridCoord.x, gridCoord.y);
                                    }
                                    if (currentDistance == viewDistance) {
                                        break;
                                    }
                                }
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
    // blocks out gridSquares that aren't visible from the viewpoint
    GridMap.prototype.drawVisible = function (viewPointScreenCoord, drawWorker, strokeColor) {
        if (!this.isEmpty) {
            var viewPoint = this.getGridIndex(viewPointScreenCoord);
            for (var i = 0; i < this.gridWidth; i++) {
                for (var j = 0; j < this.gridHeight; j++) {
                    if (this.map[viewPoint.x][viewPoint.y].isVisible(new Coord(i, j))) {
                        this.map[i][j].draw(drawWorker, strokeColor);
                    }
                    else {
                        drawWorker.fill(0, 256);
                        drawWorker.rect(i * this.gridSquareSize, j * this.gridSquareSize, this.gridSquareSize, this.gridSquareSize);
                    }
                }
            }
        }
    };
    GridMap.prototype.isOpen = function (screenCoord) {
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
    GridMap.getGridIndex = function (screenCoord, gridSquareSize) {
        var indexX = Math.floor(screenCoord.x / gridSquareSize);
        var indexY = Math.floor(screenCoord.y / gridSquareSize);
        var indexCoord = new Coord(indexX, indexY);
        return indexCoord;
    };
    GridMap.prototype.getGridIndex = function (screenCoord) {
        if (!this.isEmpty)
            return GridMap.getGridIndex(screenCoord, this.gridSquareSize);
    };
    GridMap.prototype.getSquareScreenCoord = function (square) {
        // 0: UL, 1: UR, 2: LL, 3: LR
        var output = new Array();
        output.push(new Coord(square.x * this.gridSquareSize, square.y * this.gridSquareSize)); // UL
        output.push(output[0].createOffset(this.gridSquareSize, 0)); // UR
        output.push(output[0].createOffset(0, this.gridSquareSize)); // LL
        output.push(output[0].createOffset(this.gridSquareSize, this.gridSquareSize)); // LR
        return output;
    };
    GridMap.prototype.randomCoord = function () {
        return new Coord(Math.random() * this.width, Math.random() * this.height);
    };
    return GridMap;
}(Drawable));
// facade and factory of all game objects: bullets, map, characters (player and npc)
// an unenforced singleton
// an observer of when bullets should be collected from characters
// an observer of when objects need to become null, eg old bullets and dead npc
// an observer of when characters lose hp
// an observer of NPC "sight" for hunting
var World = /** @class */ (function () {
    function World(width, height, numberOfEnemies, map, loading, strokeColor, includeSpawner) {
        this.frameCount = 0;
        this.bullets = new Array();
        this.drawWorker = null;
        this.strokeColor = strokeColor;
        this.messages = new Array();
        this.pings = new Array();
        if (!loading) {
            this.map = map;
            var playerCoordinate = new Coord(this.map.width - 20, this.map.height - 50);
            while (!map.isOpen(playerCoordinate)) {
                playerCoordinate.x--;
            }
            this.player = new Player(5, playerCoordinate, this.map, this.bullets);
            this.healthBar = new HealthBar(32, this.map);
            this.food = new Array();
            for (var i = 0; i < 5; i++) {
                this.food.push(new Food(new Coord(Math.random() * this.map.width, Math.random() * this.map.height)));
            }
            this.nPCs = new Array();
            for (var i = 0; i < numberOfEnemies; i++) {
                this.nPCs.push(new Pirate(new Coord(this.map.width * Math.random(), (this.map.height / 2) * Math.random()), this.map, this.bullets, this.player));
                this.nPCs.push(new Spewer(new Coord(this.map.width * Math.random(), (this.map.height / 2) * Math.random()), this.map, this.bullets, this.player));
                this.nPCs.push(new Mine(new Coord(this.map.width * Math.random(), (this.map.height) * Math.random()), this.map, this.bullets));
                this.nPCs.push(new Chicken(new Coord(Math.random() * this.map.width, Math.random() * this.map.height), this.map, this.food));
            }
            this.spawners = new Array();
            if (includeSpawner) {
                this.spawners.push(new NPcSpawner(new Coord(this.map.width / 2, this.map.height / 2), this));
            }
        }
        else {
            this.map = new GridMap(width, height, 0, 0, 0, true);
            this.player = null;
            this.healthBar = null;
            this.food = null;
            this.nPCs = new Array();
            this.nPCs.push(new LoadingActor(new Coord(width / 2, height / 2), this.map, this.bullets));
        }
    }
    World.prototype.draw = function () {
        var playerIsDead = false; // setting this allows the rest of the function to finish running before the game is stopped
        // world 
        this.frameCount++;
        this.map.draw(this.drawWorker, this.strokeColor);
        this.drawBullets(this.bullets);
        for (var i = 0; i < this.spawners.length; i++) {
            if (this.spawners[i] != null) {
                this.spawners[i].draw(this.drawWorker, this.strokeColor);
                this.spawners[i].step();
            }
        }
        for (var i = 0; i < this.pings.length; i++) {
            if (this.pings[i] != null) {
                this.pings[i].step();
                this.pings[i].draw(this.drawWorker, this.strokeColor);
                if (this.pings[i].age > 16) {
                    this.pings[i] = null;
                }
            }
        }
        // player
        if (this.player != null) {
            this.player.control(this.drawWorker);
            this.player.step();
            var damage = this.collectDamage(this.player, this.bullets);
            this.player.takeDamage(damage);
            if (damage) {
                this.healthBar.hp = this.player.hp;
            }
            this.player.draw(this.drawWorker, this.strokeColor);
            if (this.player.hp <= 0) {
                playerIsDead = true;
            }
            this.healthBar.draw(this.drawWorker, this.strokeColor);
            for (var i = 0; i < this.food.length; i++) {
                if (this.food[i] != null) {
                    this.food[i].draw(this.drawWorker, this.strokeColor);
                    this.food[i].step();
                    if (5 > World.calculateDistance(this.player.location, this.food[i].location)) {
                        if (this.player.hp < this.healthBar.max) {
                            this.food[i] = null;
                            this.player.hp += 10;
                            this.healthBar.hp = this.player.hp;
                        }
                    }
                }
            }
            if (this.frameCount % 32 == 0) {
                this.pings.push(new Ping(this.player.location));
            }
        }
        if (this.player != null) {
            var playerIndex = this.map.getGridIndex(this.player.location);
        }
        // NPCs
        for (var i = 0; i < this.nPCs.length; i++) {
            if (this.nPCs[i] != null) {
                //check for shots
                var damage = this.collectDamage(this.nPCs[i], this.bullets);
                this.nPCs[i].takeDamage(damage);
                if (this.player != null) {
                    var npcGridCoord = this.map.getGridIndex(this.nPCs[i].location);
                    this.nPCs[i].seesPlayer = this.map.map[playerIndex.x][playerIndex.y].isVisible(npcGridCoord);
                    if (this.nPCs[i].seesPlayer) {
                        this.nPCs[i].lastSeenPlayerCoord = this.player.location;
                    }
                }
                this.nPCs[i].step();
                this.nPCs[i].draw(this.drawWorker, this.strokeColor);
                if (this.nPCs[i].hp <= 0) {
                    this.messages.push("kill");
                    this.nPCs[i] = null;
                    this.player.enemiesKilled++;
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
    ;
    World.prototype.save = function () {
        return JSON.stringify(this.map);
    };
    World.prototype.drawBullets = function (list) {
        for (var i = 0; i < list.length; i++) {
            if (list[i] != null) {
                list[i].draw(this.drawWorker, this.strokeColor);
                if (!list[i].step()) {
                    list[i] = null;
                }
            }
        }
    };
    World.calculateDistance = function (coord1, coord2) {
        return Math.sqrt(Math.pow(Math.abs(coord2.x - coord1.x), 2) + Math.pow(Math.abs(coord2.y - coord1.y), 2));
    };
    ;
    // returns true if obj1 (target) is shot by obj2 (projectile)
    World.prototype.isShotBy = function (obj1, obj2) {
        var isClose = 3 > World.calculateDistance(obj1.location, obj2.location);
        // var isInFrontOf = this.isInFrontOf(obj1, obj2);
        return isClose; //&& isInFrontOf;
    };
    // isInFrontOf(obj1: Character, obj2: Bullet):boolean {
    // return (Math.PI / 2) >= Math.abs(this.calculateDifference(obj1.direction, World.calculateDirection(obj1.location, obj2.location)));
    // }
    World.calculateDirection = function (c1, c2) {
        var dx = c1.x - c2.x;
        var dy = c1.y - c2.y;
        var direction;
        if (dx != 0 && dy != 0) {
            if (dx < 0 && dy > 0) { // target is in quadrant 1
                direction = Math.atan2(Math.abs(dx), Math.abs(dy));
            }
            else if (dx < 0 && dy < 0) { // target is in q2
                direction = Math.atan2(Math.abs(dy), Math.abs(dx));
                direction += Math.PI / 2;
            }
            else if (dx > 0 && dy < 0) { // q3
                direction = Math.atan2(Math.abs(dx), Math.abs(dy));
                direction += Math.PI;
            }
            else if (dx > 0 && dy > 0) { // q4
                direction = Math.atan2(Math.abs(dy), Math.abs(dx));
                direction += (2 * Math.PI) - (Math.PI / 2);
            }
            return direction;
        }
    };
    World.calculateAddDirection = function (direction, summand) {
        return (direction + summand) % (2 * Math.PI);
    };
    World.calculateRicochetDirection = function (currentDirection, faceIsHorizontal) {
        if (faceIsHorizontal) {
            if (0 <= currentDirection && (Math.PI / 2) > currentDirection) {
                return ((Math.PI / 2) - currentDirection) + (Math.PI / 2);
            }
            else if ((Math.PI / 2) <= currentDirection && Math.PI > currentDirection) {
                return (Math.PI / 2) - (currentDirection - (Math.PI / 2));
            }
            else if (Math.PI <= currentDirection && ((Math.PI * 2) - (Math.PI / 2)) > currentDirection) {
                return (((Math.PI * 2) - (Math.PI / 2)) - currentDirection) + ((Math.PI * 2) - (Math.PI / 2));
            }
            else {
                return ((Math.PI * 2) - (Math.PI / 2)) - (currentDirection - ((Math.PI * 2) - (Math.PI / 2)));
            }
        }
        else {
            if (0 <= currentDirection && (Math.PI / 2) > currentDirection) {
                return (Math.PI * 2) - currentDirection;
            }
            else if ((Math.PI / 2) <= currentDirection && (Math.PI) > currentDirection) {
                return (Math.PI * 2) - currentDirection;
            }
            else if (Math.PI <= currentDirection && ((Math.PI * 2) - (Math.PI / 2)) > currentDirection) {
                return Math.PI - (currentDirection - Math.PI);
            }
            else {
                return (Math.PI * 2) - currentDirection;
            }
        }
    };
    World.prototype.calculateDifference = function (direction1, direction2) {
        var difference = direction1 - direction2;
        if (difference > Math.PI) {
            difference = (Math.PI * 2) - difference;
        }
        return difference;
    };
    World.prototype.collectDamage = function (obj, arr) {
        var totalDamage = 0;
        for (var i = 0; i < arr.length; i++) {
            if (arr[i] != null) {
                if (this.isShotBy(obj, arr[i])) {
                    if (obj != arr[i].owner) {
                        totalDamage += arr[i].maxForce;
                    }
                }
            }
        }
        return totalDamage;
    };
    ;
    // calculates a coordinate relative to (0, 0) that is length units in direction from (0, 0)
    // since it's relative to 0 its really easy to use addition to calculate a new coordinate from a coordinate that isn't 0
    // I debated if this should belong to Moveable, but decided it should stay in World because so much imprecision still exists in the calculation of directions in dotshot; may as well that the imprecision is managed closely together; a different world might want to manage all that imprecision all together in a different way. -David
    World.calculateCoordinate = function (length, direction) {
        var quadrant = Math.floor(direction / (Math.PI / 2)); // the quadrant that the new coord will be in relative to the moveable as if the space is a unit circle where the moveable is at (0, 0)
        var quadrantAngle = direction - (quadrant * (Math.PI / 2));
        var quadrantAngleIsLowHalf = quadrantAngle < (Math.PI / 4);
        var finalAngle;
        if (quadrantAngleIsLowHalf) {
            finalAngle = quadrantAngle;
        }
        else {
            finalAngle = (Math.PI / 2) - quadrantAngle;
        }
        var angleInRadians = finalAngle;
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
    World.inverseCoord = function (coord, center) {
        var newDirection = this.calculateDirection(coord, center);
        var relative = this.calculateCoordinate(this.calculateDistance(coord, center), newDirection);
        var output = center.createOffset(relative.x, relative.y);
        return output;
    };
    return World;
}());
var Moveable = /** @class */ (function (_super) {
    __extends(Moveable, _super);
    function Moveable(size, location, target, currentVelocity, map, doesRicochet) {
        var _this = _super.call(this, size, location) || this;
        _this.target = target;
        _this.currentVelocity = currentVelocity;
        _this.map = map;
        _this.doesRicochet = doesRicochet;
        _this.originalLocation = location;
        _this.stepsInDirection = 0;
        return _this;
    }
    Moveable.prototype.point = function (target) {
        this.setVector(target);
    };
    Moveable.prototype.setVector = function (target) {
        this.stepsInDirection = 0;
        this.originalLocation = this.location;
        var targetDx = target.x - this.location.x;
        var targetDy = target.y - this.location.y;
        var slope = targetDx / targetDy;
        this.dx = Math.abs(this.currentVelocity * slope) * (targetDx / Math.abs(targetDx));
        this.dy = this.currentVelocity * (1 - slope) * (targetDy / Math.abs(targetDy));
    };
    Moveable.prototype.move = function (velocity) {
        this.stepsInDirection++;
        var newLocation = this.location.createOffset(this.dx, this.dy);
        if (!this.map.isOpen(newLocation)) {
            this.stepsInDirection = 0;
            // if (this.doesRicochet) {
            // var newCoordAsGrid = this.map.getGridIndex(newLocation);
            // var angleToAdd = Math.PI / 2;
            // var squareCoords = this.map.getSquareScreenCoord(newCoordAsGrid);
            // if (squareCoords[0].x <= this.location.x && squareCoords[1].x >= this.location.x) {
            // this.setDirection(World.calculateRicochetDirection(this.direction, true));
            // } else if (squareCoords[0].y <= this.location.y && squareCoords[2].y >= this.location.y) {
            // this.setDirection(World.calculateRicochetDirection(this.direction, false));
            // } else {
            // }
            // } else {
            // return false;
            // }
            return false;
        }
        // relativeChangeCoordinate = World.calculateCoordinate(velocity * this.stepsInDirection, this.direction);
        // newLocation = this.originalLocation.createOffset(relativeChangeCoordinate.x, relativeChangeCoordinate.y);
        this.location = newLocation;
        return true;
    };
    ;
    return Moveable;
}(CenteredShape));
var Bullet = /** @class */ (function (_super) {
    __extends(Bullet, _super);
    function Bullet(location, target, map, owner) {
        var _this = _super.call(this, 3, location, target, 2, map, true) || this;
        _this.maxForce = 1;
        _this.owner = owner;
        _this.age = 0;
        return _this;
    }
    Bullet.prototype.step = function () {
        this.move(6);
        this.age++;
        if (this.age < 80) {
            return true;
        }
        else {
            return false;
        }
    };
    Bullet.prototype.draw = function (drawWorker, strokeColor) {
        drawWorker.fill(256, 256);
        _super.prototype.draw.call(this, drawWorker, strokeColor);
    };
    return Bullet;
}(Moveable));
var ExplodingBullet = /** @class */ (function (_super) {
    __extends(ExplodingBullet, _super);
    function ExplodingBullet(location, target, map, owner, bullets) {
        var _this = _super.call(this, location, target, map, owner) || this;
        _this.bullets = bullets;
        return _this;
    }
    ExplodingBullet.prototype.step = function () {
        _super.prototype.step.call(this);
        if (this.age > 30) {
            this.bullets.push(new Bullet(this.location, this.location.createOffset(10, 10), this.map, this.owner));
            this.bullets.push(new Bullet(this.location, this.location.createOffset(10, -10), this.map, this.owner));
            this.bullets.push(new Bullet(this.location, this.location.createOffset(-10, 10), this.map, this.owner));
            this.bullets.push(new Bullet(this.location, this.location.createOffset(-10, -10), this.map, this.owner));
            return false;
        }
        return true;
    };
    ExplodingBullet.prototype.draw = function (drawWorker, strokeColor) {
        _super.prototype.draw.call(this, drawWorker, strokeColor);
    };
    return ExplodingBullet;
}(Bullet));
var CannonBall = /** @class */ (function (_super) {
    __extends(CannonBall, _super);
    function CannonBall(location, target, map, owner) {
        var _this = _super.call(this, location, target, map, owner) || this;
        _this.size = 7;
        _this.maxForce = 10;
        return _this;
    }
    CannonBall.prototype.step = function () {
        this.size = 5 + (this.age % 10);
        return _super.prototype.step.call(this);
    };
    return CannonBall;
}(Bullet));
var Character = /** @class */ (function (_super) {
    __extends(Character, _super);
    function Character(size, location, target, currentVelocity, map, bullets, maxHP) {
        var _this = _super.call(this, size, location, target, currentVelocity, map, false) || this;
        _this.hp = maxHP;
        _this.bullets = bullets;
        _this.weapons = new Array();
        _this.currentWeapon = 0;
        return _this;
    }
    Character.prototype.shoot = function (target) {
        this.weapons[this.currentWeapon].shoot(target);
    };
    Character.prototype.step = function () {
        for (var i = 0; i < this.weapons.length; i++) {
            if (null != this.weapons[i]) {
                this.weapons[i].step();
            }
        }
    };
    Character.prototype.takeDamage = function (amount) {
        this.hp -= amount;
    };
    ;
    return Character;
}(Moveable));
var Player = /** @class */ (function (_super) {
    __extends(Player, _super);
    function Player(size, location, map, bullets) {
        var _this = _super.call(this, size, location, new Coord(0, 0), 1, map, bullets, 32) || this;
        _this.weapons.push(new Gun(bullets, _this, 0));
        _this.weapons.push(new DoubleBarrelGun(bullets, _this, 0));
        _this.weapons.push(new ExplodingBulletGun(bullets, _this, 0));
        _this.weapons.push(new Cannon(bullets, _this));
        _this.initialSize = size;
        _this.isFiring = "front";
        _this.isMoving = false;
        _this.firingAge = 0;
        _this.enemiesKilled = 0;
        return _this;
    }
    Player.prototype.step = function () {
        _super.prototype.step.call(this);
        if (this.size != this.initialSize) {
            this.size = this.initialSize;
        }
    };
    Player.prototype.control = function (drawWorker) {
        this.point(new Coord(drawWorker.mouseX, drawWorker.mouseY));
        if (this.isFiring == "front") {
            this.firingAge++;
            if (this.firingAge % 4 == 0) {
                this.shoot(new Coord(drawWorker.mouseX, drawWorker.mouseY));
            }
        }
        else if (this.isFiring == "behind") {
            this.firingAge++;
            if (this.firingAge % 4 == 0) {
                this.shoot(World.inverseCoord(new Coord(drawWorker.mouseX, drawWorker.mouseY), this.location));
            }
        }
        else {
            this.firingAge = 0;
        }
        if (this.isMoving) {
            this.move(3);
        }
    };
    Player.prototype.draw = function (drawWorker, strokeColor) {
        var shade = strokeColor.r;
        drawWorker.fill(shade, 256);
        _super.prototype.draw.call(this, drawWorker, strokeColor);
        drawWorker.line(this.location.x, this.location.y, drawWorker.mouseX, drawWorker.mouseY);
        var cursor = new CenteredShape(5, new Coord(drawWorker.mouseX, drawWorker.mouseY));
        cursor.draw(drawWorker, new RGBA(1, 1, 1, 1));
    };
    Player.prototype.takeDamage = function (amount) {
        _super.prototype.takeDamage.call(this, amount);
        if (amount > 0) {
            this.size = 30;
        }
    };
    return Player;
}(Character));
var NPC = /** @class */ (function (_super) {
    __extends(NPC, _super);
    function NPC(size, location, map, bullets, maxHP, combatTarget, life, idleAge, idleLife) {
        var _this = _super.call(this, size, location, new Coord(0, 0), 1, map, bullets, maxHP) || this;
        _this.isHunting = false;
        _this.age = 0;
        _this.idleAge = idleAge;
        _this.idleLife = idleLife;
        _this.combatTarget = combatTarget;
        _this.seesPlayer = false;
        _this.lastSeenPlayerCoord = null;
        return _this;
    }
    NPC.prototype.idle = function () {
        if (!(this.idleAge < this.idleLife)) {
            this.idleAge = 0;
            this.idleLife = Math.random() * 2000;
            this.setVector(this.map.randomCoord());
        }
        this.idleAge++;
        this.move(1);
    };
    NPC.prototype.attack = function () { };
    NPC.prototype.decide = function () {
        if (this.isHunting || this.seesPlayer) {
            this.attack();
        }
        else {
            this.idle();
        }
    };
    return NPC;
}(Character));
var Chicken = /** @class */ (function (_super) {
    __extends(Chicken, _super);
    function Chicken(location, map, food) {
        var _this = _super.call(this, 5, location, map, null, 8, null, 1000, 0, 200) || this;
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
    Chicken.prototype.step = function () {
        _super.prototype.step.call(this);
        if (this.hp <= 0) {
            this.food.push(new Food(this.location));
        }
        if (this.seesPlayer) {
            if (this.fleeAge < this.fleeLife) {
                this.fleeAge++;
            }
            else {
                this.fleeAge = 0;
                this.setVector(this.map.randomCoord());
            }
            this.move(2);
        }
        else {
            this.idle();
        }
    };
    return Chicken;
}(NPC));
var Spewer = /** @class */ (function (_super) {
    __extends(Spewer, _super);
    function Spewer(location, map, bullets, combatTarget) {
        var _this = _super.call(this, 5, location, map, bullets, 8, combatTarget, 1000, 0, 200) || this;
        _this.didIgnite = false;
        _this.igniteAge = 0;
        _this.isGrowing = true;
        _this.weapons.push(new Gun(bullets, _this, 0));
        return _this;
    }
    Spewer.prototype.draw = function (drawWorker, strokeColor) {
        drawWorker.stroke(128, 0, 0, 256);
        drawWorker.fill(128, 0, 0, 256);
        _super.prototype.draw.call(this, drawWorker, strokeColor);
        drawWorker.stroke(strokeColor.r, strokeColor.g, strokeColor.b, strokeColor.a);
    };
    Spewer.prototype.step = function () {
        _super.prototype.step.call(this);
        if (this.didIgnite) {
            this.igniteAge++;
            if (this.igniteAge > 100) {
                this.explode();
            }
        }
        this.decide();
    };
    Spewer.prototype.explode = function () {
        this.shoot(this.combatTarget.location);
        this.shoot(this.combatTarget.location.createOffset(1, 1));
        this.shoot(this.combatTarget.location.createOffset(-1, -1));
        this.shoot(this.combatTarget.location.createOffset(2, 2));
        this.shoot(this.combatTarget.location.createOffset(-2, -2));
        this.shoot(this.combatTarget.location.createOffset(3, 3));
        this.shoot(this.combatTarget.location.createOffset(-3, -3));
        this.hp = 0;
    };
    // animation for when its about to explode
    Spewer.prototype.pulse = function () {
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
    Spewer.prototype.attack = function () {
        var distance = World.calculateDistance(this.location, this.lastSeenPlayerCoord);
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
    return Spewer;
}(NPC));
;
var Pirate = /** @class */ (function (_super) {
    __extends(Pirate, _super);
    function Pirate(location, map, bullets, combatTarget) {
        var _this = _super.call(this, 5, location, map, bullets, 8, combatTarget, 1000, 0, 200) || this;
        _this.weapons.push(new Gun(bullets, _this, 10));
        return _this;
    }
    Pirate.prototype.draw = function (drawWorker, strokeColor) {
        drawWorker.stroke(256, 0, 0, 256);
        drawWorker.fill(256, 0, 0, 256);
        _super.prototype.draw.call(this, drawWorker, strokeColor);
        drawWorker.stroke(strokeColor.r, strokeColor.g, strokeColor.b, strokeColor.a);
    };
    Pirate.prototype.step = function () {
        _super.prototype.step.call(this);
        this.decide();
    };
    Pirate.prototype.attack = function () {
        this.point(this.lastSeenPlayerCoord);
        this.move(0.5);
        if (this.seesPlayer) {
            this.shoot(this.combatTarget.location);
        }
        if (this.isHunting) {
            if (0 != World.calculateDistance(this.location, this.lastSeenPlayerCoord)) {
                this.isHunting = false;
            }
        }
        else {
            this.isHunting = true;
        }
    };
    return Pirate;
}(NPC));
;
var LoadingActor = /** @class */ (function (_super) {
    __extends(LoadingActor, _super);
    function LoadingActor(location, map, bullets) {
        var _this = _super.call(this, 5, location, map, bullets, 1, null, 1000, 0, 200) || this;
        _this.stepCount = 0;
        _this.weapons.push(new Gun(bullets, _this, 0));
        return _this;
    }
    LoadingActor.prototype.draw = function (drawWorker, strokeColor) {
        var shade = strokeColor.r;
        drawWorker.fill(shade, 256);
        _super.prototype.draw.call(this, drawWorker, strokeColor);
    };
    LoadingActor.prototype.step = function () {
        _super.prototype.step.call(this);
        if (this.direction < Math.PI * 2) {
            this.direction += 3;
        }
        else {
            this.direction = 0;
        }
        this.move(3);
        if (this.stepCount % 8 == 0) {
            var bulletRelative = World.calculateCoordinate(10, this.direction);
            this.shoot(this.location.createOffset(bulletRelative.x, bulletRelative.y));
        }
        this.stepCount++;
    };
    return LoadingActor;
}(NPC));
var Mine = /** @class */ (function (_super) {
    __extends(Mine, _super);
    function Mine(location, map, bullets) {
        var _this = _super.call(this, 5, location, map, bullets, 1, null, 1000, 0, 200) || this;
        _this.weapons.push(new Gun(bullets, _this, 0));
        return _this;
    }
    Mine.prototype.draw = function (drawWorker, strokeColor) {
        drawWorker.stroke(130, 128, 128, 256);
        drawWorker.fill(128, 128, 128, 256);
        _super.prototype.draw.call(this, drawWorker, strokeColor);
        drawWorker.stroke(strokeColor.r, strokeColor.g, strokeColor.b, strokeColor.a);
    };
    Mine.prototype.explode = function () {
        var directions = Array();
        directions.push(this.location.createOffset(0, -300));
        directions.push(this.location.createOffset(300, 0));
        directions.push(this.location.createOffset(0, 300));
        directions.push(this.location.createOffset(-300, 0));
        for (var i = 0; i < directions.length; i++) {
            this.shoot(directions[i]);
            this.shoot(directions[i].createOffset(1, 1));
            this.shoot(directions[i].createOffset(-1, -1));
            this.shoot(directions[i].createOffset(2, 2));
            this.shoot(directions[i].createOffset(-2, -2));
            this.shoot(directions[i].createOffset(3, 3));
            this.shoot(directions[i].createOffset(-3, -3));
            this.shoot(directions[i].createOffset(4, 4));
            this.shoot(directions[i].createOffset(-4, -4));
            this.shoot(directions[i].createOffset(5, 5));
            this.shoot(directions[i].createOffset(-5, -5));
            this.shoot(directions[i].createOffset(10, 10));
            this.shoot(directions[i].createOffset(-10, -10));
            this.shoot(directions[i].createOffset(20, 20));
            this.shoot(directions[i].createOffset(-20, -20));
            this.shoot(directions[i].createOffset(30, 30));
            this.shoot(directions[i].createOffset(-30, -30));
            this.shoot(directions[i].createOffset(40, 40));
            this.shoot(directions[i].createOffset(-40, -40));
        }
    };
    Mine.prototype.move = function () {
        return false;
    };
    Mine.prototype.idle = function () { };
    Mine.prototype.attack = function () { };
    Mine.prototype.step = function () {
        _super.prototype.step.call(this);
        if (this.hp <= 0) {
            this.explode();
        }
    };
    return Mine;
}(NPC));
;
var HTMLDotshotUI = /** @class */ (function () {
    function HTMLDotshotUI() {
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
        this.worldSettings.push(new NumericalSetting("numberOfEnemies", 10, null));
        this.worldSettings.push(new NumericalSetting("numberOfWalls", 50, null));
        this.worldSettings.push(new NumericalSetting("wallLength", 10, null));
        this.worldSettings.push(new NumericalSetting("gridSquareSize", 8, null));
        this.worldSettings.push(new BinarySetting("useSpawner", true, null));
        for (var i = 0; i < this.worldSettings.length; i++) {
            this.worldSettings[i].display();
        }
        this.console = new HTMLDotshotMessageConsole();
        this.console.display();
    }
    HTMLDotshotUI.prototype.startNewGame = function () {
        if (this.display != null) {
            this.display.remove();
        }
        for (var i = 0; i < this.worldSettings.length; i++) {
            this.worldSettings[i].setValueFromDocument();
        }
        this.console.post("Loading...");
        var map = new GridMap(this.width, this.height, this.worldSettings[3].value, this.worldSettings[1].value, this.worldSettings[2].value, false);
        this.world = new World(this.width, this.height, this.worldSettings[0].value, map, false, this.defaultStrokeColor, this.worldSettings[4].value);
        this.display = new p5(output, "canvas");
        this.console.post("'w' to move; 'r' to shoot; player faces the cursor; desktop only");
    };
    HTMLDotshotUI.prototype.saveMap = function () {
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
    return HTMLDotshotUI;
}());
var HTMLDotshotMessageConsole = /** @class */ (function () {
    function HTMLDotshotMessageConsole() {
        this.numberOfLines = 4;
        this.lines = new Array();
        for (var i = 0; i < this.numberOfLines; i++) {
            this.lines[i] = "";
        }
        this.currentLineNumber = 1;
        this.constructHTML();
    }
    HTMLDotshotMessageConsole.prototype.constructHTML = function () {
        this.html = "";
        for (var i = 0; i < this.numberOfLines; i++) {
            this.html += "<p>" + this.lines[i] + "</p>";
        }
        this.display();
    };
    HTMLDotshotMessageConsole.prototype.display = function () {
        var element = document.getElementById("console");
        if (element) {
            element.innerHTML = this.html;
        }
    };
    HTMLDotshotMessageConsole.prototype.post = function (string) {
        for (var i = 0; i < this.numberOfLines; i++) {
            if (i != this.numberOfLines - 1) {
                this.lines[i] = this.lines[i + 1];
            }
            else {
                this.lines[i] = this.currentLineNumber + " " + string;
            }
        }
        this.currentLineNumber++;
        this.constructHTML();
    };
    return HTMLDotshotMessageConsole;
}());
var Setting = /** @class */ (function () {
    function Setting(name, defaultValue, value) {
        this.name = name;
        this.defaultValue = defaultValue;
        if (this.value == null) {
            this.value = defaultValue;
        }
        else {
            this.value = value;
        }
        this.htmlExtraAttributes = "";
    }
    Setting.prototype.getElementFromDocument = function () {
        var element = document.getElementById(this.name);
        if (element) {
            return element;
        }
    };
    Setting.prototype.setValueFromDocument = function () {
        this.htmlValue = this.getElementFromDocument().value;
        this.setValueFromHTML();
    };
    Setting.prototype.display = function () {
        this.setHTMLFromValue();
        var container = document.getElementById("worldSettings");
        if (container) {
            container.innerHTML += this.generateHTML();
        }
    };
    Setting.prototype.generateHTML = function () {
        return "<p class='label'>" + this.name + "</p><input type='" + this.htmlType + "' " + this.htmlExtraAttributes + "value=" + this.htmlValue + " id='" + this.name + "'>";
    };
    Setting.prototype.setValueFromHTML = function () { };
    Setting.prototype.setHTMLFromValue = function () { };
    return Setting;
}());
var NumericalSetting = /** @class */ (function (_super) {
    __extends(NumericalSetting, _super);
    function NumericalSetting(name, defaultValue, value) {
        var _this = _super.call(this, name, defaultValue, value) || this;
        _this.htmlType = "range";
        _this.htmlExtraAttributes = "' min='0' max='500' ";
        return _this;
    }
    NumericalSetting.prototype.setValueFromHTML = function () {
        this.value = this.htmlValue;
    };
    NumericalSetting.prototype.setHTMLFromValue = function () {
        this.htmlValue = this.value;
    };
    return NumericalSetting;
}(Setting));
var BinarySetting = /** @class */ (function (_super) {
    __extends(BinarySetting, _super);
    function BinarySetting(name, defaultValue, value) {
        var _this = _super.call(this, name, defaultValue, value) || this;
        _this.htmlType = "checkbox";
        return _this;
    }
    BinarySetting.prototype.setValueFromHTML = function () {
        if (this.htmlExtraAttributes == " checked ") {
            this.value = true;
        }
        else {
            this.value = false;
        }
    };
    BinarySetting.prototype.setHTMLFromValue = function () {
        if (this.value) {
            this.htmlExtraAttributes = " checked ";
        }
        else {
            this.htmlExtraAttributes = "";
        }
    };
    BinarySetting.prototype.setValueFromDocument = function () {
        var element = this.getElementFromDocument();
        if (element.checked == true) {
            this.htmlExtraAttributes = " checked ";
        }
        else {
            this.htmlExtraAttributes = "";
        }
        this.setValueFromHTML();
    };
    return BinarySetting;
}(Setting));
document.addEventListener('keydown', recordKey);
function recordKey(e) {
    switch (e.key) {
        case "r":
            game.world.player.isFiring = "front";
            break;
        case "e":
            game.world.player.isFiring = "behind";
            break;
        case "Shift":
            game.world.player.isFiring = "front";
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
            break;
        case "3":
            if (game.world.player.weapons.length > 2) {
                game.world.player.currentWeapon = 2;
            }
            break;
        case "4":
            if (game.world.player.weapons.length > 3) {
                game.world.player.currentWeapon = 3;
            }
            break;
    }
}
document.addEventListener('keyup', stopKey);
function stopKey(e) {
    switch (e.key) {
        case "r":
            game.world.player.isFiring = "off";
            break;
        case "e":
            game.world.player.isFiring = "off";
            break;
        case "Shift":
            game.world.player.isFiring = "off";
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
        for (var i = 0; i < game.world.messages.length; i++) {
            if (game.world.messages[i] != null) {
                game.console.post(game.world.messages[i]);
                game.world.messages.pop(i);
            }
        }
    };
};
var game;
var loadPage = function () {
    game = new HTMLDotshotUI();
};
