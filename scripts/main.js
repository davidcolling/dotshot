"use strict";
class RGBA {
    r;
    g;
    b;
    a;
    constructor(r, g, b, a) {
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
    }
}
class Coord {
    x;
    y;
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    createOffset(dx, dy) {
        return new Coord(this.x + dx, this.y + dy);
    }
    equals(coord) {
        return (this.x == coord.x) && (this.y == coord.y);
    }
}
class Drawable {
    draw(drawWorker, strokeColor) { }
}
class CenteredShape extends Drawable {
    size;
    location;
    constructor(size, location) {
        super();
        this.size = size;
        this.location = location;
    }
    draw(drawWorker, strokeColor) {
        drawWorker.circle(this.location.x, this.location.y, this.size);
    }
}
class NPcSpawner extends CenteredShape {
    counter;
    world;
    constructor(location, world) {
        super(8, location);
        this.counter = 0;
        this.world = world;
    }
    step() {
        this.counter++;
        if (this.counter % (Math.floor(World.calculateDistance(this.world.player.location, this.location))) == 0) {
            this.world.nPCs.push(new Pirate(this.location, this.world.map, this.world.bullets, this.world.bulletSpeed, this.world.player));
        }
    }
    draw(drawWorker, strokeColor) {
        drawWorker.circle(this.location.x, this.location.y, this.size);
    }
}
class Weapon {
    bullets;
    owner;
    counter;
    lastCount;
    coolDownTimer;
    hasShot;
    constructor(bullets, owner, coolDownTimer) {
        this.bullets = bullets;
        this.owner = owner;
        this.counter = 0;
        this.lastCount = 0;
        this.coolDownTimer = coolDownTimer;
    }
    shoot(target) {
        if (!this.hasShot || this.counter - this.lastCount >= this.coolDownTimer) {
            if (!this.hasShot) {
                this.hasShot = true;
            }
            this.counter = this.lastCount;
            this.fire(target);
        }
    }
    fire(target) { }
    step() {
        this.counter++;
    }
}
class Gun extends Weapon {
    baseVelocity;
    constructor(bullets, owner, coolDownTimer, baseVelocity) {
        super(bullets, owner, coolDownTimer);
        this.baseVelocity = baseVelocity;
    }
    fire(target) {
        super.fire(target);
        this.bullets.push(new Bullet(this.owner.location, target, this.owner.map, this.owner, this.baseVelocity));
    }
}
class ExplodingBulletGun extends Weapon {
    constructor(bullets, owner, coolDownTimer) {
        super(bullets, owner, coolDownTimer);
    }
    fire(target) {
        super.fire(target);
        this.bullets.push(new ExplodingBullet(this.owner.location, target, this.owner.map, this.owner, this.bullets));
    }
}
class DoubleBarrelGun extends Weapon {
    constructor(bullets, owner, coolDownTimer) {
        super(bullets, owner, coolDownTimer);
    }
    fire(target) {
        super.fire(target);
        const velocity = 8;
        this.bullets.push(new Bullet(this.owner.location.createOffset(5, 0), target, this.owner.map, this.owner, velocity));
        this.bullets.push(new Bullet(this.owner.location.createOffset(-5, 0), target, this.owner.map, this.owner, velocity));
    }
}
class Cannon extends Weapon {
    constructor(bullets, owner) {
        super(bullets, owner, 35);
    }
    fire(target) {
        super.fire(target);
        this.bullets.push(new CannonBall(this.owner.location.createOffset(5, 0), target, this.owner.map, this.owner));
        this.lastCount = this.counter;
    }
}
class Ping extends CenteredShape {
    age;
    constructor(location) {
        super(1, location);
        this.age = 0;
    }
    step() {
        this.age++;
        this.size++;
    }
    draw(drawWorker, strokeColor) {
        drawWorker.fill(strokeColor.r, 0);
        super.draw(drawWorker, strokeColor);
    }
}
class Food extends CenteredShape {
    isGrowing;
    growAge;
    constructor(location) {
        super(2, location);
        this.isGrowing = true;
        this.growAge = 0;
    }
    step() {
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
    }
    draw(drawWorker, strokeColor) {
        drawWorker.fill(strokeColor.r, 256);
        super.draw(drawWorker, strokeColor);
    }
}
class GridSquare extends Drawable {
    size;
    isEmpty; // is the square wall or open space?
    coord;
    constructor(size, coord, isEmpty) {
        super();
        this.size = size;
        this.isEmpty = isEmpty;
        this.coord = coord;
    }
    draw(drawWorker, strokeColor) {
        if (this.isEmpty) {
            return;
        }
        else {
            var shade = strokeColor.r;
            drawWorker.fill(shade, 256);
            drawWorker.rect(this.coord.x, this.coord.y, this.size, this.size);
        }
    }
}
class HealthBar extends Drawable {
    max;
    hp;
    map;
    constructor(max, map) {
        super();
        this.max = max;
        this.map = map;
        this.hp = this.max;
    }
    draw(drawWorker, strokeColor) {
        if (this.hp != 0) {
            drawWorker.stroke(256, 0, 0, 256);
            drawWorker.fill(256, 0, 0, 256);
            drawWorker.strokeWeight(5);
            drawWorker.line(0, this.map.height - 1, this.map.width * (this.hp / this.max), this.map.height - 1);
            drawWorker.strokeWeight(1);
            drawWorker.stroke(strokeColor.r, strokeColor.g, strokeColor.b, strokeColor.a);
        }
    }
}
class GridMap extends Drawable {
    width; // number of p5 screen units wide game map is
    height;
    gridWidth; // number of GridSquare long that the game map is
    gridHeight;
    map; // hash table used to represent the map
    gridSquareSize; // number of p5 units wide a single square of the map is; gridSquareSize * gridWidth == width
    isEmpty;
    constructor(screenWidth, screenHeight, gridSquareSize, numberOfWalls, wallLength, isEmpty) {
        super();
        var gridWidth = Math.floor(screenWidth / gridSquareSize);
        var gridHeight = Math.floor(screenHeight / gridSquareSize);
        var width = gridSquareSize * gridWidth;
        var height = gridSquareSize * gridHeight;
        this.width = width;
        this.height = height;
        this.isEmpty = isEmpty;
        if (!isEmpty) {
            this.gridSquareSize = gridSquareSize;
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
                if (Math.random() < .5) {
                    var dx = 1;
                    var dy = 0;
                }
                else {
                    var dx = 0;
                    var dy = 1;
                }
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
        }
        else {
            this.gridSquareSize = null;
            this.gridWidth = null;
            this.gridHeight = null;
            this.map = null;
        }
    }
    draw(drawWorker, strokeColor) {
        if (!this.isEmpty) {
            for (var i = 0; i < this.gridWidth; i++) {
                for (var j = 0; j < this.gridHeight; j++) {
                    this.map[i][j].draw(drawWorker, strokeColor);
                }
            }
        }
    }
    isOpen(screenCoord) {
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
    }
    static getGridIndex(screenCoord, gridSquareSize) {
        var indexX = Math.floor(screenCoord.x / gridSquareSize);
        var indexY = Math.floor(screenCoord.y / gridSquareSize);
        var indexCoord = new Coord(indexX, indexY);
        return indexCoord;
    }
    getGridIndex(screenCoord) {
        if (!this.isEmpty)
            return GridMap.getGridIndex(screenCoord, this.gridSquareSize);
    }
    getSquareScreenCoord(square) {
        // 0: UL, 1: UR, 2: LL, 3: LR
        var output = new Array();
        output.push(new Coord(square.x * this.gridSquareSize, square.y * this.gridSquareSize)); // UL
        output.push(output[0].createOffset(this.gridSquareSize, 0)); // UR
        output.push(output[0].createOffset(0, this.gridSquareSize)); // LL
        output.push(output[0].createOffset(this.gridSquareSize, this.gridSquareSize)); // LR
        return output;
    }
    // the parameters must constitute a wall ie a line which represents a single side of a GridSquare 
    isWall(coord1, coord2) {
        let square1;
        let square2;
        if (coord1.x == coord2.x) {
            if (coord1.y < coord2.y) {
                square1 = new Coord(coord1.x, coord1.y);
                square2 = new Coord(coord1.x - 1, coord1.y);
            }
            else {
                square1 = new Coord(coord2.x, coord1.y);
                square2 = new Coord(coord2.x - 1, coord1.y);
            }
        }
        else {
            if (coord1.x < coord2.x) {
                square1 = new Coord(coord1.x, coord1.y);
                square2 = new Coord(coord1.x, coord1.y - 1);
            }
            else {
                square1 = new Coord(coord2.x, coord1.y);
                square2 = new Coord(coord2.x, coord1.y - 1);
            }
        }
        return !(this.isOpen(square1) && this.isOpen(square2));
    }
    // this would be most efficient if the searching is done from both sides or the expected closer-to-wall side
    isOpenBetween(coord1, coord2) {
        // the line is y = mx + b. m, b are known. just calculate the coordinates for eash x, y that are on the grid, check if they are walls
        var slope = (coord2.y - coord1.y) / (coord2.x - coord1.x);
        var intercept = coord2.y - (slope * coord2.x);
        var startingX;
        var endingX;
        if (coord1.x < coord2.x) {
            startingX = coord1.x;
            endingX = coord2.x;
        }
        else {
            startingX = coord2.x;
            endingX = coord1.x;
        }
        for (var i = startingX + (this.gridSquareSize - (startingX % this.gridSquareSize)); i < endingX; i += (this.gridSquareSize - 1)) {
            var wallIntersection = (slope * i) + intercept;
            var wallEnd1 = new Coord(i, wallIntersection - (wallIntersection % this.gridSquareSize));
            var wallEnd2 = new Coord(i, wallIntersection + (this.gridSquareSize - (wallIntersection % this.gridSquareSize)));
            if (this.isWall(wallEnd1, wallEnd2)) {
                return false;
            }
        }
        var startingY;
        var endingY;
        if (coord1.y < coord2.y) {
            startingY = coord1.y;
            endingY = coord2.y;
        }
        else {
            startingY = coord2.y;
            endingY = coord1.y;
        }
        for (var i = startingY + (this.gridSquareSize - (startingY % this.gridSquareSize)); i < endingY; i += (this.gridSquareSize - 1)) {
            var wallIntersection = (i - intercept) / slope;
            var wallEnd1 = new Coord(wallIntersection - (wallIntersection % this.gridSquareSize), i);
            var wallEnd2 = new Coord(wallIntersection + (this.gridSquareSize - (wallIntersection % this.gridSquareSize)), i);
            if (this.isWall(wallEnd1, wallEnd2)) {
                return false;
            }
        }
        return true;
    }
    randomCoord() {
        return new Coord(Math.random() * this.width, Math.random() * this.height);
    }
}
// facade and factory of all game objects: bullets, map, characters (player and npc)
// an unenforced singleton
// an observer of when bullets should be collected from characters
// an observer of when objects need to become null, eg old bullets and dead npc
// an observer of when characters lose hp
// an observer of NPC "sight" for hunting
class World {
    frameCount; // used for optionally offsetting the frequency of certain calculations
    map;
    bullets;
    nPCs;
    player;
    healthBar;
    food;
    pings;
    drawWorker;
    strokeColor;
    bulletSpeed;
    spawners;
    messages;
    constructor(width, height, numberOfEnemies, map, loading, strokeColor, bulletSpeed, includeSpawner) {
        this.frameCount = 0;
        this.bullets = new Array();
        this.drawWorker = null;
        this.strokeColor = strokeColor;
        this.bulletSpeed = bulletSpeed;
        this.messages = new Array();
        this.pings = new Array();
        if (!loading) {
            this.map = map;
            var playerCoordinate = new Coord(this.map.width - 20, this.map.height - 50);
            while (!map.isOpen(playerCoordinate)) {
                playerCoordinate.x--;
            }
            this.player = new Player(5, playerCoordinate, this.map, this.bullets, this.bulletSpeed);
            this.healthBar = new HealthBar(32, this.map);
            this.food = new Array();
            for (var i = 0; i < 5; i++) {
                this.food.push(new Food(new Coord(Math.random() * this.map.width, Math.random() * this.map.height)));
            }
            this.nPCs = new Array();
            for (var i = 0; i < numberOfEnemies; i++) {
                this.nPCs.push(new Pirate(new Coord(this.map.width * Math.random(), (this.map.height / 2) * Math.random()), this.map, this.bullets, this.bulletSpeed, this.player));
                this.nPCs.push(new Spewer(new Coord(this.map.width * Math.random(), (this.map.height / 2) * Math.random()), this.map, this.bullets, this.bulletSpeed, this.player));
                // this.nPCs.push(new Mine(  new Coord(this.map.width * Math.random(),     
                // (this.map.height / 2) * Math.random()),  this.map, this.bullets));
                // this.nPCs.push(new Chicken(  new Coord(this.map.width * Math.random(),     
                // (this.map.height / 2) * Math.random()),  this.map, this.food));
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
            this.nPCs.push(new LoadingActor(new Coord(width / 2, height / 2), this.map, this.bullets, this.bulletSpeed));
        }
    }
    draw() {
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
                if (this.nPCs[i].combatTarget == null) {
                    this.nPCs[i].combatTarget = this.player;
                    console.log("it happened");
                }
                if (this.player != null) {
                    var distanceFromCombatTarget = World.calculateDistance(this.nPCs[i].location, this.nPCs[i].combatTarget.location);
                    if (distanceFromCombatTarget < 200) {
                        var npcGridCoord = this.map.getGridIndex(this.nPCs[i].location);
                        this.nPCs[i].seesCombatTarget = this.map.isOpenBetween(this.nPCs[i].location, this.nPCs[i].combatTarget.location);
                        if (this.nPCs[i].seesCombatTarget) {
                            this.nPCs[i].lastSeenCombatTargetCoord = this.nPCs[i].combatTarget.location;
                        }
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
    }
    ;
    save() {
        return JSON.stringify(this.map);
    }
    drawBullets(list) {
        for (var i = 0; i < list.length; i++) {
            if (list[i] != null) {
                list[i].draw(this.drawWorker, this.strokeColor);
                if (!list[i].step()) {
                    list[i] = null;
                }
            }
        }
    }
    static calculateDistance(coord1, coord2) {
        return Math.sqrt(Math.abs(coord2.x - coord1.x) ** 2 + Math.abs(coord2.y - coord1.y) ** 2);
    }
    ;
    // returns true if obj1 (target) is shot by obj2 (projectile)
    isShotBy(obj1, obj2) {
        let distance = World.calculateDistance(obj1.location, obj2.location);
        let isInTrajectory = false;
        let nextLinearLocation = obj2.location.createOffset(obj2.dx, obj2.dy);
        let signDiffNextLocation = new Coord((obj2.location.x - nextLinearLocation.x) / Math.abs(obj2.location.x - nextLinearLocation.x), (obj2.location.y - nextLinearLocation.y) / Math.abs(obj2.location.y - nextLinearLocation.y));
        let signDiffTargetLocation = new Coord((obj2.location.x - obj1.location.x) / Math.abs(obj2.location.x - obj1.location.x), (obj2.location.y - obj1.location.y) / Math.abs(obj2.location.y - obj1.location.y));
        if (300 > distance) {
            if (signDiffNextLocation.x == signDiffTargetLocation.x &&
                signDiffNextLocation.y == signDiffTargetLocation.y) {
                let trajectorySlope = (obj2.location.y - nextLinearLocation.y) / (obj2.location.x - nextLinearLocation.x);
                let trajectoryIntercept = obj2.location.y - (trajectorySlope * obj1.location.x);
                let perpendicularSlope = 1 / (trajectorySlope * -1);
                let perpendicularIntercept = obj1.location.y - (perpendicularSlope * obj1.location.x);
                let intersectionX = (perpendicularIntercept - trajectoryIntercept) / (trajectoryIntercept - perpendicularIntercept);
                let intersectionY = (perpendicularSlope * intersectionX) + perpendicularIntercept;
                let intersectionCoord = new Coord(intersectionX, intersectionY);
                let isInTrajectory = 10 > World.calculateDistance(obj2.location, intersectionCoord);
            }
        }
        return (3 > distance) || isInTrajectory;
    }
    collectDamage(obj, arr) {
        var totalDamage = 0;
        for (var i = 0; i < arr.length; i++) {
            if (arr[i] != null) {
                if (this.isShotBy(obj, arr[i])) {
                    if (obj != arr[i].owner) {
                        totalDamage += arr[i].maxForce;
                    }
                    if (obj instanceof NPC) {
                        obj.combatTarget = arr[i].owner;
                    }
                }
            }
        }
        return totalDamage;
    }
    ;
    static inverseCoord(coord, center) {
        return new Coord(coord.x * -1, coord.y * -1);
    }
    static calculateVector(location, target, distance) {
        let targetDx = target.x - location.x;
        let targetDy = target.y - location.y;
        let slope = targetDx / targetDy;
        let dy = Math.sqrt((distance * distance) /
            ((slope * slope) + 1)) *
            (targetDy / Math.abs(targetDy));
        let dx = Math.sqrt((distance * distance) -
            (dy * dy)) *
            (targetDx / Math.abs(targetDx));
        return new Coord(dx, dy);
    }
}
class Moveable extends CenteredShape {
    target;
    velocity;
    dx;
    dy;
    map;
    doesRicochet;
    originalLocation;
    constructor(size, location, target, startingVelocity, map, doesRicochet) {
        super(size, location);
        this.target = target;
        this.velocity = startingVelocity;
        this.map = map;
        this.doesRicochet = doesRicochet;
        this.originalLocation = location;
        this.setVector(target);
    }
    point(target) {
        this.target = target;
        this.setVector(target);
    }
    setVector(target) {
        this.originalLocation = this.location;
        let d = World.calculateVector(this.location, target, this.velocity);
        this.dy = d.y;
        this.dx = d.x;
    }
    move() {
        var newLocation = this.location.createOffset(this.dx, this.dy);
        if (!this.map.isOpen(newLocation)) {
            if (this.doesRicochet) {
                var newCoordAsGrid = this.map.getGridIndex(newLocation);
                var squareCoords = this.map.getSquareScreenCoord(newCoordAsGrid);
                if (squareCoords[0].x <= this.location.x && squareCoords[1].x >= this.location.x) {
                    this.dy = this.dy * -1;
                }
                else if (squareCoords[0].y <= this.location.y && squareCoords[2].y >= this.location.y) {
                    this.dx = this.dx * -1;
                }
                newLocation = this.location.createOffset(this.dx, this.dy);
            }
            else {
                return false;
            }
        }
        this.location = newLocation;
        return true;
    }
    ;
}
class Bullet extends Moveable {
    age;
    maxForce;
    owner;
    constructor(location, target, map, owner, baseVelocity) {
        super(3, location, target, baseVelocity, map, true);
        this.maxForce = 1;
        this.owner = owner;
        this.age = 0;
    }
    step() {
        this.move();
        this.age++;
        if (this.age < 80) {
            return true;
        }
        else {
            return false;
        }
    }
    draw(drawWorker, strokeColor) {
        drawWorker.fill(256, 256);
        super.draw(drawWorker, strokeColor);
    }
}
class ExplodingBullet extends Bullet {
    bullets;
    constructor(location, target, map, owner, bullets) {
        super(location, target, map, owner, 8);
        this.bullets = bullets;
    }
    step() {
        super.step();
        const velocity = 8;
        if (this.age > 30) {
            this.bullets.push(new Bullet(this.location, this.location.createOffset(10, 10), this.map, this.owner, velocity));
            this.bullets.push(new Bullet(this.location, this.location.createOffset(10, -10), this.map, this.owner, velocity));
            this.bullets.push(new Bullet(this.location, this.location.createOffset(-10, 10), this.map, this.owner, velocity));
            this.bullets.push(new Bullet(this.location, this.location.createOffset(-10, -10), this.map, this.owner, velocity));
            return false;
        }
        return true;
    }
    draw(drawWorker, strokeColor) {
        super.draw(drawWorker, strokeColor);
    }
}
class CannonBall extends Bullet {
    constructor(location, target, map, owner) {
        super(location, target, map, owner, 8);
        this.size = 7;
        this.maxForce = 10;
    }
    step() {
        this.size = 5 + (this.age % 10);
        return super.step();
    }
}
class Character extends Moveable {
    hp;
    bullets;
    weapons;
    mainWeaponBaseVelocity;
    currentWeapon;
    constructor(size, location, target, startingVelocity, map, bullets, mainWeaponBaseVelocity, maxHP) {
        super(size, location, target, startingVelocity, map, false);
        this.hp = maxHP;
        this.bullets = bullets;
        this.weapons = new Array();
        this.mainWeaponBaseVelocity = mainWeaponBaseVelocity;
        this.currentWeapon = 0;
    }
    shoot(target) {
        this.weapons[this.currentWeapon].shoot(target);
    }
    step() {
        for (var i = 0; i < this.weapons.length; i++) {
            if (null != this.weapons[i]) {
                this.weapons[i].step();
            }
        }
    }
    takeDamage(amount) {
        this.hp -= amount;
    }
    ;
    drawPointDirection(drawWorker, strokeColor) {
        let directionIndicatorEndPointRelative = World.calculateVector(this.location, this.target, 5);
        let directionIndicatorEndPoint = this.location.createOffset(directionIndicatorEndPointRelative.x, directionIndicatorEndPointRelative.y);
        drawWorker.line(this.location.x, this.location.y, directionIndicatorEndPoint.x, directionIndicatorEndPoint.y);
    }
}
class Player extends Character {
    isFiring;
    isMoving;
    firingAge;
    initialSize;
    enemiesKilled;
    previousTarget;
    constructor(size, location, map, bullets, mainWeaponBaseVelocity) {
        super(size, location, new Coord(0, 0), 2, map, bullets, mainWeaponBaseVelocity, 32);
        this.weapons.push(new Gun(bullets, this, 0, this.mainWeaponBaseVelocity));
        this.weapons.push(new DoubleBarrelGun(bullets, this, 0));
        this.weapons.push(new ExplodingBulletGun(bullets, this, 0));
        this.weapons.push(new Cannon(bullets, this));
        this.initialSize = size;
        this.isFiring = "front";
        this.isMoving = false;
        this.firingAge = 0;
        this.enemiesKilled = 0;
        this.previousTarget = new Coord(0, 0);
    }
    step() {
        super.step();
        if (this.size != this.initialSize) {
            this.size = this.initialSize;
        }
    }
    control(drawWorker) {
        let target = new Coord(drawWorker.mouseX, drawWorker.mouseY);
        if (!this.previousTarget.equals(target)) {
            this.point(target);
        }
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
            this.move();
        }
    }
    draw(drawWorker, strokeColor) {
        var shade = strokeColor.r;
        drawWorker.fill(shade, 256);
        super.draw(drawWorker, strokeColor);
        super.drawPointDirection(drawWorker, strokeColor);
    }
    takeDamage(amount) {
        super.takeDamage(amount);
        if (amount > 0) {
            this.size = 30;
        }
    }
}
class NPC extends Character {
    isHunting;
    age;
    idleAge;
    idleLife;
    combatTarget;
    seesCombatTarget;
    lastSeenCombatTargetCoord;
    constructor(size, location, map, bullets, mainWeaponBaseVelocity, maxHP, combatTarget, life, idleAge, idleLife) {
        super(size, location, new Coord(0, 0), 1, map, bullets, mainWeaponBaseVelocity, maxHP);
        this.isHunting = false;
        this.age = 0;
        this.idleAge = idleAge;
        this.idleLife = idleLife;
        this.combatTarget = combatTarget;
        this.seesCombatTarget = false;
        this.lastSeenCombatTargetCoord = null;
    }
    idle() {
        if (!(this.idleAge < this.idleLife)) {
            this.idleAge = 0;
            this.idleLife = Math.random() * 2000;
            this.point(this.map.randomCoord());
        }
        this.idleAge++;
        this.move();
    }
    attack() { }
    decide() {
        if (this.isHunting || this.seesCombatTarget) {
            this.attack();
        }
        else {
            this.idle();
        }
    }
}
class Chicken extends NPC {
    isRunning;
    fleeAge;
    fleeLife;
    food;
    constructor(location, map, food) {
        super(5, location, map, null, 1, 8, null, 1000, 0, 200);
        this.isRunning = false;
        this.fleeAge = 0;
        this.fleeLife = 20;
        this.food = food;
    }
    draw(drawWorker, strokeColor) {
        var shade = strokeColor.r;
        drawWorker.fill(shade, 256);
        super.draw(drawWorker, strokeColor);
        super.drawPointDirection(drawWorker, strokeColor);
    }
    step() {
        super.step();
        if (this.hp <= 0) {
            this.food.push(new Food(this.location));
        }
        if (this.seesCombatTarget) {
            if (this.fleeAge < this.fleeLife) {
                this.fleeAge++;
            }
            else {
                this.fleeAge = 0;
                this.point(this.map.randomCoord());
            }
            this.move();
        }
        else {
            this.idle();
        }
    }
}
class Spewer extends NPC {
    didIgnite;
    igniteAge;
    isGrowing;
    constructor(location, map, bullets, mainWeaponBaseVelocity, combatTarget) {
        super(5, location, map, bullets, mainWeaponBaseVelocity, 8, combatTarget, 1000, 0, 200);
        this.didIgnite = false;
        this.igniteAge = 0;
        this.isGrowing = true;
        this.weapons.push(new Gun(bullets, this, 0, mainWeaponBaseVelocity));
    }
    draw(drawWorker, strokeColor) {
        drawWorker.stroke(128, 0, 0, 256);
        drawWorker.fill(128, 0, 0, 256);
        super.draw(drawWorker, strokeColor);
        super.drawPointDirection(drawWorker, strokeColor);
        drawWorker.stroke(strokeColor.r, strokeColor.g, strokeColor.b, strokeColor.a);
    }
    step() {
        super.step();
        if (this.didIgnite) {
            this.igniteAge++;
            if (this.igniteAge > 100) {
                this.explode();
            }
        }
        this.decide();
    }
    explode() {
        this.shoot(this.combatTarget.location);
        this.shoot(this.combatTarget.location.createOffset(1, 1));
        this.shoot(this.combatTarget.location.createOffset(-1, -1));
        this.shoot(this.combatTarget.location.createOffset(2, 2));
        this.shoot(this.combatTarget.location.createOffset(-2, -2));
        this.shoot(this.combatTarget.location.createOffset(3, 3));
        this.shoot(this.combatTarget.location.createOffset(-3, -3));
        this.hp = 0;
    }
    // animation for when its about to explode
    pulse() {
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
    }
    attack() {
        var distance = World.calculateDistance(this.location, this.lastSeenCombatTargetCoord);
        var willMove = true;
        if (this.seesCombatTarget) {
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
            this.point(this.lastSeenCombatTargetCoord);
            this.move();
        }
        if (!this.isHunting) {
            this.isHunting = true;
        }
        else {
            if (distance < 2 && !this.didIgnite) {
                this.isHunting = false;
            }
        }
    }
}
;
class Pirate extends NPC {
    constructor(location, map, bullets, mainWeaponBaseVelocity, combatTarget) {
        super(5, location, map, bullets, mainWeaponBaseVelocity, 8, combatTarget, 1000, 0, 200);
        this.weapons.push(new Gun(bullets, this, 10, this.mainWeaponBaseVelocity));
    }
    draw(drawWorker, strokeColor) {
        drawWorker.stroke(256, 0, 0, 256);
        drawWorker.fill(256, 0, 0, 256);
        super.draw(drawWorker, strokeColor);
        super.drawPointDirection(drawWorker, strokeColor);
        drawWorker.stroke(strokeColor.r, strokeColor.g, strokeColor.b, strokeColor.a);
    }
    step() {
        super.step();
        this.decide();
    }
    attack() {
        this.point(this.lastSeenCombatTargetCoord);
        if (World.calculateDistance(this.location, this.lastSeenCombatTargetCoord) > 20) {
            this.move();
        }
        if (this.seesCombatTarget) {
            this.shoot(this.combatTarget.location);
        }
        if (this.isHunting) {
            if (3 < World.calculateDistance(this.location, this.lastSeenCombatTargetCoord)) {
                this.isHunting = false;
            }
        }
        else {
            this.isHunting = true;
        }
    }
}
;
class LoadingActor extends NPC {
    direction;
    stepCount;
    constructor(location, map, bullets, mainWeaponBaseVelocity) {
        super(5, location, map, bullets, mainWeaponBaseVelocity, 1, null, 1000, 0, 200);
        this.stepCount = 0;
        this.weapons.push(new Gun(bullets, this, 0, this.mainWeaponBaseVelocity));
    }
    draw(drawWorker, strokeColor) {
        var shade = strokeColor.r;
        drawWorker.fill(shade, 256);
        super.draw(drawWorker, strokeColor);
    }
    step() {
        super.step();
        if (this.direction < Math.PI * 2) {
            this.direction += 3;
        }
        else {
            this.direction = 0;
        }
        this.move();
        if (this.stepCount % 8 == 0) {
            // shoot
        }
        this.stepCount++;
    }
}
class Mine extends NPC {
    constructor(location, map, bullets) {
        super(5, location, map, bullets, 8, 1, null, 1000, 0, 200);
        this.weapons.push(new Gun(bullets, this, 0, this.mainWeaponBaseVelocity));
    }
    draw(drawWorker, strokeColor) {
        drawWorker.stroke(130, 128, 128, 256);
        drawWorker.fill(128, 128, 128, 256);
        super.draw(drawWorker, strokeColor);
        drawWorker.stroke(strokeColor.r, strokeColor.g, strokeColor.b, strokeColor.a);
    }
    explode() {
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
    }
    move() {
        return false;
    }
    idle() { }
    attack() { }
    step() {
        super.step();
        if (this.hp <= 0) {
            this.explode();
        }
    }
}
;
class HTMLDotshotUI {
    world;
    defaultStrokeColor;
    display;
    worldSettings;
    height;
    width;
    console;
    constructor() {
        // determine dimensions 
        var height = window.innerHeight * 0.9;
        var width = window.innerWidth * 0.98;
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
        this.worldSettings = new SettingsProfile(4, 25, 5, 32, 10, true);
        for (const s in this.worldSettings) {
            this.worldSettings[s].display();
        }
        this.console = new HTMLDotshotMessageConsole();
        this.console.display();
    }
    setWorldSettings() {
        for (const s in this.worldSettings) {
            this.worldSettings[s].setValueFromDocument();
        }
    }
    startNewGame() {
        if (this.display != null) {
            this.display.remove();
        }
        this.console.post("Loading...");
        var map = new GridMap(this.width, this.height, this.worldSettings.gridSquareSize.value, this.worldSettings.numberOfWalls.value, this.worldSettings.wallLength.value, false);
        this.world = new World(this.width, this.height, this.worldSettings.numberOfEnemies.value, map, false, this.defaultStrokeColor, this.worldSettings.bulletSpeed.value, this.worldSettings.useSpawner.value);
        this.display = new p5(output, "canvas");
        this.console.post("'w' to move; 'r' to shoot; player faces the cursor; desktop only");
    }
    startNewGameFromSettings() {
        this.setWorldSettings();
        this.startNewGame();
    }
    startNewRandomGame() {
        this.worldSettings.numberOfEnemies.value = Math.random() * 100;
        this.worldSettings.numberOfWalls.value = Math.random() * 50;
        this.worldSettings.wallLength.value = Math.random() * 15;
        this.worldSettings.gridSquareSize.value = Math.random() * 50;
        for (const s in this.worldSettings) {
            this.worldSettings[s].setHTMLFromValue();
        }
        this.startNewGame();
    }
    saveMap() {
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
    }
}
class HTMLDotshotMessageConsole {
    currentLineNumber;
    html;
    numberOfLines;
    lines;
    constructor() {
        this.numberOfLines = 4;
        this.lines = new Array();
        for (var i = 0; i < this.numberOfLines; i++) {
            this.lines[i] = "";
        }
        this.currentLineNumber = 1;
        this.generateHTML();
    }
    generateHTML() {
        this.html = "";
        for (var i = 0; i < this.numberOfLines; i++) {
            this.html += "<p>" + this.lines[i] + "</p>";
        }
    }
    display() {
        var element = document.getElementById("console");
        if (element) {
            element.innerHTML = this.html;
        }
    }
    post(string) {
        for (var i = 0; i < this.numberOfLines; i++) {
            if (i != this.numberOfLines - 1) {
                this.lines[i] = this.lines[i + 1];
            }
            else {
                this.lines[i] = this.currentLineNumber + " " + string;
            }
        }
        this.currentLineNumber++;
        this.generateHTML();
        this.display();
    }
}
class Setting {
    name;
    defaultValue;
    value;
    htmlValue;
    htmlType;
    htmlExtraAttributes;
    constructor(name, defaultValue, value) {
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
    getElementFromDocument() {
        var element = document.getElementById(this.name);
        if (element) {
            return element;
        }
    }
    setValueFromDocument() {
        this.htmlValue = this.getElementFromDocument().value;
        this.setValueFromHTML();
    }
    display() {
        this.setHTMLFromValue();
        var container = document.getElementById("worldSettings");
        if (container) {
            container.innerHTML += this.generateHTML();
        }
    }
    generateHTML() {
        return "<p class='label'>" + this.name + "</p><input type='" + this.htmlType + "' " + this.htmlExtraAttributes + "value=" + this.htmlValue + " id='" + this.name + "'>";
    }
    setValueFromHTML() { }
    setHTMLFromValue() { }
}
class NumericalSetting extends Setting {
    constructor(name, defaultValue, value) {
        super(name, defaultValue, value);
        this.htmlType = "range";
        this.htmlExtraAttributes = "' min='0' max='500' ";
    }
    setValueFromHTML() {
        this.value = this.htmlValue;
    }
    setHTMLFromValue() {
        this.htmlValue = this.value;
    }
}
class BinarySetting extends Setting {
    constructor(name, defaultValue, value) {
        super(name, defaultValue, value);
        this.htmlType = "checkbox";
    }
    setValueFromHTML() {
        if (this.htmlExtraAttributes == " checked ") {
            this.value = true;
        }
        else {
            this.value = false;
        }
    }
    setHTMLFromValue() {
        if (this.value) {
            this.htmlExtraAttributes = " checked ";
        }
        else {
            this.htmlExtraAttributes = "";
        }
    }
    setValueFromDocument() {
        var element = this.getElementFromDocument();
        if (element.checked == true) {
            this.htmlExtraAttributes = " checked ";
        }
        else {
            this.htmlExtraAttributes = "";
        }
        this.setValueFromHTML();
    }
}
class SettingsProfile {
    numberOfEnemies;
    numberOfWalls;
    wallLength;
    gridSquareSize;
    bulletSpeed;
    useSpawner;
    constructor(numberOfEnemies, numberOfWalls, wallLength, gridSquareSize, bulletSpeed, useSpawner) {
        this.numberOfEnemies = new NumericalSetting("numberOfEnemies", numberOfEnemies, null);
        this.numberOfWalls = new NumericalSetting("numberOfWalls", numberOfWalls, null);
        this.wallLength = new NumericalSetting("wallLength", wallLength, null);
        this.gridSquareSize = new NumericalSetting("gridSquareSize", gridSquareSize, null);
        this.bulletSpeed = new NumericalSetting("bulletSpeed", bulletSpeed, null);
        this.useSpawner = new BinarySetting("useSpawner", useSpawner, null);
    }
}
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
    game.startNewGame();
};
