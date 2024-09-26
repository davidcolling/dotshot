class RGBA {
    r: number;
    g: number;
    b: number;
    a: number;
    constructor(r: number, g: number, b: number, a: number) {
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
    }
}

class Coord {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
    createOffset(dx: number, dy: number): Coord {
        return new Coord(this.x + dx, this.y + dy);
    }
    equals(coord: Coord): boolean {
        return (this.x == coord.x) && (this.y == coord.y);
    }
}

class Drawable {
    draw(drawWorker, strokeColor: RGBA):void {}
}

class CenteredShape extends Drawable {
    size: number;
    location: Coord

    constructor(size: number, location: Coord) {
        super();
        this.size = size;
        this.location = location;
    }
    draw(drawWorker, strokeColor: RGBA):void {
        drawWorker.circle(
            this.location.x,
            this.location.y,
            this.size
        );
    }
}

class NPcSpawner extends CenteredShape {
    counter:number;
    world: World;

    constructor(location: Coord, world: World) {
        super(8, location);
        this.counter = 0;
        this.world = world
    }
    step():void {
        this.counter++;
        if (this.counter % (Math.floor(World.calculateDistance(this.world.player.location, this.location))) == 0) {
            this.world.nPCs.push(new Pirate(this.location,  this.world.map, this.world.bullets, this.world.player));
        }
    }
    draw(drawWorker, strokeColor: RGBA):void {
        drawWorker.circle(
            this.location.x,
            this.location.y,
            this.size
        );
    }

}

class Weapon {
    bullets: Array<Bullet>;
    owner: Character;
    counter:  number;
    lastCount: number;
    coolDownTimer: number;
    hasShot:boolean;

    constructor(bullets: Array<Bullet>, owner: Character, coolDownTimer: number) {
        this.bullets = bullets;
        this.owner = owner;
        this.counter = 0;
        this.lastCount = 0;
        this.coolDownTimer = coolDownTimer;
    }

    shoot(target:Coord):void {
        if (!this.hasShot || this.counter - this.lastCount >= this.coolDownTimer) {
            if (!this.hasShot) {
                this.hasShot = true;
            }
            this.counter = this.lastCount;
            this.fire(target);
        }
    }

    fire(target: Coord):void {}

    step():void {
        this.counter++;
    }
}

class Gun extends Weapon {
    constructor(bullets: Array<Bullet>, owner: Character, coolDownTimer: number) {
        super(bullets, owner, coolDownTimer);
    }

    fire(target: Coord):void {
        super.fire(target);
        this.bullets.push(new Bullet(this.owner.location, target, this.owner.map, this.owner));
    }
}

class ExplodingBulletGun extends Weapon {
    constructor(bullets: Array<Bullet>, owner: Character, coolDownTimer: number) {
        super(bullets, owner, coolDownTimer);
    }

    fire(target: Coord):void {
        super.fire(target);
        this.bullets.push(new ExplodingBullet(this.owner.location, target, this.owner.map, this.owner, this.bullets));
    }
}

class DoubleBarrelGun extends Weapon {
    constructor(bullets: Array<Bullet>, owner: Character, coolDownTimer: number) {
        super(bullets, owner, coolDownTimer);
    }

    fire(target: Coord):void {
        super.fire(target);
        this.bullets.push(new Bullet(this.owner.location.createOffset(5, 0), target, this.owner.map, this.owner));
        this.bullets.push(new Bullet(this.owner.location.createOffset(-5, 0), target, this.owner.map, this.owner));
    }
}

class Cannon extends Weapon {
    constructor(bullets: Array<Bullet>, owner: Character) {
        super(bullets, owner, 35);
    }

    fire(target: Coord):void {
        super.fire(target);
        this.bullets.push(new CannonBall(this.owner.location.createOffset(5, 0), target, this.owner.map, this.owner));
        this.lastCount = this.counter;
    }
}

class Ping extends CenteredShape {
    age: number;
    constructor(location) {
        super(1, location);
        this.age = 0;
    }
    step():void {
        this.age++;
        this.size++;
    }
    draw(drawWorker, strokeColor: RGBA):void {
        drawWorker.fill(strokeColor.r, 0);
        super.draw(drawWorker, strokeColor); 
    }
}

class Food extends CenteredShape {
    isGrowing: boolean;
    growAge: number;

    constructor(location) {
        super(2, location);
        this.isGrowing = true;
        this.growAge = 0;
    }
    step():void {
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
            } else {
                this.size--;
            }
        }
    }
    draw(drawWorker, strokeColor: RGBA):void {
        drawWorker.fill(strokeColor.r, 256);
        super.draw(drawWorker, strokeColor); 
    }
}

class GridMapImage {
    gridWidth:number;
    gridHeight:number;
    map: Array<Array<boolean>>;
    viewPoint: Coord;
    viewDistance: number;

    distLeft: number;
    distRight: number;
    distAbove: number;
    distBelow:number;

    constructor(width: number, height: number, viewPoint: Coord, viewDistance: number) {
        this.gridWidth = width;
        this.gridHeight = height;
        this.viewPoint = viewPoint;
        this.viewDistance = viewDistance;

        var distLeft = viewDistance;
        if (this.viewPoint.x < this.viewDistance) 
            distLeft -= this.viewDistance - this.viewPoint.x;
        this.distLeft = distLeft ;
        var distRight = viewDistance;
        if (this.viewPoint.x + this.viewDistance > width) 
            distRight -= this.viewDistance - (width - this.viewPoint.x);
        this.distRight = distRight ;

        var distAbove = viewDistance;
        if (this.viewPoint.y < this.viewDistance) 
            distAbove -= this.viewDistance - this.viewPoint.y;
        this.distAbove = distAbove ;
        var distBelow = viewDistance;
        if (this.viewPoint.y + this.viewDistance > height) 
            distBelow -= this.viewDistance - (height - this.viewPoint.y);
        this.distBelow = distBelow ;

        this.map = new Array();
        for (var i = 0; i < distLeft + distRight + 1; i++) {
            this.map[i] = new Array();
            for (var j = 0; j < distAbove + distBelow + 1; j++) {
                this.map[i][j] = false;
            }
        }
    }
    set(x: number, y: number):void {
        var subMapCoord = this.mapIndexToHashIndex(new Coord(x, y));
        if (this.indexIsInRange(subMapCoord)) {
            this.map[subMapCoord.x][subMapCoord.y] = true;
        }
    }
    unSet(x: number, y: number):void {
        var subMapCoord = this.mapIndexToHashIndex(new Coord(x, y));
        if (this.indexIsInRange(subMapCoord)) {
            this.map[subMapCoord.x][subMapCoord.y] = false;
        }
    }

    canSee(coord: Coord): boolean {
        var subMapCoord = this.mapIndexToHashIndex(coord);
        if (this.indexIsInRange(subMapCoord)) {
            return this.map[subMapCoord.x][subMapCoord.y];
        } else {
            return false;
        }
    }

    // translates a grid index from the whole map to the grid index of the interal hash map representing the visible portion of the entire math
    private mapIndexToHashIndex(coord: Coord): Coord {
        var dx = this.viewPoint.x - this.distLeft;
        var dy = this.viewPoint.y - this.distAbove;
        return new Coord(coord.x - dx, coord.y - dy);
    }
    private indexIsInRange(coord: Coord): boolean {
        return (
            coord.x >= 0 &&
            coord.x < this.map.length &&
            coord.y >= 0 &&
            coord.y < this.map[0].length
        )
    }

}

class GridSquare extends Drawable {
    size: number;
    isEmpty: boolean; // is the square wall or open space?
    coord: Coord;
    visibleIndexes: GridMapImage // it is assumed the scope that calls this constructor will create and add an image;
    isHighlighted: boolean; // for ad-hoc debugging

    constructor(size: number, coord: Coord, isEmpty: boolean) {
        super();
        this.size = size;
        this.isEmpty = isEmpty;
        this.coord = coord;
        this.visibleIndexes = null;
        this.isHighlighted = false;
    }

    draw(drawWorker, strokeColor: RGBA):boolean {
        if (this.isHighlighted) {
            drawWorker.fill(256, 0, 0, 256);
            drawWorker.rect(
                this.coord.x,
                this.coord.y,
                this.size,
                this.size
            );
        } else {
            if (this.isEmpty) {
                return;
            } else {
                var shade = strokeColor.r;
                drawWorker.fill(shade, 256);
                drawWorker.rect(
                    this.coord.x,
                    this.coord.y,
                    this.size,
                    this.size
                );
            }
        }
    }

    isVisible(coord: Coord):boolean {
        if (this.visibleIndexes == null) {
            return true;
        } else {
            return this.visibleIndexes.canSee(coord);
        }
    }
}

class HealthBar extends Drawable {
    max: number;
    hp: number;
    map: GridMap;

    constructor(max: number, map: GridMap) {
        super();
        this.max = max;
        this.map = map
        this.hp = this.max;
    }

    draw(drawWorker, strokeColor: RGBA):void {
        if (this.hp != 0) {
            drawWorker.stroke(256, 0, 0, 256);
            drawWorker.fill(256, 0, 0, 256);
            drawWorker.strokeWeight(5);
            drawWorker.line(
                0, 
                this.map.height - 1, 
                this.map.width * (this.hp / this.max), 
                this.map.height - 1
            );
            drawWorker.strokeWeight(1);
            drawWorker.stroke(
                strokeColor.r, 
                strokeColor.g, 
                strokeColor.b, 
                strokeColor.a, 
            );            
        }
    }
}

class GridMap extends Drawable {
    width: number; // number of p5 screen units wide game map is
    height: number;
    gridWidth:number; // number of GridSquare long that the game map is
    gridHeight:number;
    map: Array<Array<GridSquare>>; // hash table used to represent the map
    gridSquareSize: number; // number of p5 units wide a single square of the map is; gridSquareSize * gridWidth == width
    isEmpty: boolean;
    
    constructor(screenWidth: number, screenHeight: number, gridSquareSize: number, numberOfWalls: number, wallLength: number, isEmpty: boolean) {
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
            for (var i = 0; i < gridWidth ; i ++) { 
                this.map[i] = new Array();
                for (var j = 0; j < gridHeight; j ++) {
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

                    if (
                        newCoord.x >= gridWidth ||
                        newCoord.x < 0 ||
                        newCoord.y >= gridHeight ||
                        newCoord.y < 0
                    ) {
                        break; // don't go off the map
                    } else {
                        this.map[newCoord.x][newCoord.y].isEmpty = false;
                    }
                }
            }
            // populate visibleIndexes for each GridSquare
            var viewDistance = 35;
            for (var i = 0; i < gridWidth; i++) { 
                for (var j = 0; j < gridHeight; j++) {
                    if (this.map[i][j].isEmpty) {
                        this.map[i][j].visibleIndexes = new GridMapImage(gridWidth, gridHeight, new Coord(i, j), viewDistance);

                        for (var x = -300; x < 300; x++) {
                            var y;
                            if (x < 0) {
                                y = 300 + x;
                            } else {
                                y = 300 - x;
                            }

                            for (var k = 0; k < 1; k++) {
                                if (k == 1) {
                                    x = -x;
                                    y = -y;
                                }
                                // wherever this Moveable is able to move in a "straight" line is visible from the starting place
                                var coordinateTracker = new Moveable(1, new Coord(i * gridSquareSize, j * gridSquareSize), new Coord(x, y) , 3, this, false);
    
                                var previousCoord = new Coord(i, j);
                                var currentDistance = 0;
    
                                while (coordinateTracker.move()) {
                                    var gridCoord = GridMap.getGridIndex(coordinateTracker.location, gridSquareSize);
    
                                    //check if the tracker entered a new grid cell
                                    if (
                                        gridCoord.x != previousCoord.x ||
                                        gridCoord.y != previousCoord.y
                                    ) {
                                        currentDistance++;
                                        previousCoord.x = gridCoord.x;
                                        previousCoord.y = gridCoord.y;
                                        this.map[i][j].visibleIndexes.set(gridCoord.x, gridCoord.y);
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
        } else {
            this.gridSquareSize = null;
            this.gridWidth = null;
            this.gridHeight = null;
            this.map = null;
        }
    }

    draw(drawWorker, strokeColor: RGBA):void {
        if (!this.isEmpty) {
            for (var i = 0; i < this.gridWidth; i ++) {
                for (var j = 0; j < this.gridHeight; j ++) {
                    this.map[i][j].draw(drawWorker, strokeColor);
                }
            }
        }
    }

    // blocks out gridSquares that aren't visible from the viewpoint
    drawVisible(viewPointScreenCoord: Coord, drawWorker, strokeColor: RGBA):void {
        if( !this.isEmpty) {
            var viewPoint = this.getGridIndex(viewPointScreenCoord);
            for (var i = 0; i < this.gridWidth; i ++) {
                for (var j = 0; j < this.gridHeight; j ++) {
                    if (this.map[viewPoint.x][viewPoint.y].isVisible(new Coord(i, j))) {
                        this.map[i][j].draw(drawWorker, strokeColor);
                    } else {
                        drawWorker.fill(0, 256);
                        drawWorker.rect(
                            i * this.gridSquareSize,
                            j * this.gridSquareSize,
                            this.gridSquareSize,
                            this.gridSquareSize
                        );
                    }
                }
            }
        }
    }

    isOpen(screenCoord: Coord):boolean {
        if(!this.isEmpty) {
            if (
                0 < screenCoord.x &&
                screenCoord.x < this.width &&
                0 < screenCoord.y &&
                screenCoord.y < this.height
            ) {
                var gridIndex = GridMap.getGridIndex(screenCoord, this.gridSquareSize);
                return this.map[gridIndex.x][gridIndex.y].isEmpty;
            } else {
                return false;
            }
        } else {
            return true;
        }
    }

    static getGridIndex(screenCoord: Coord, gridSquareSize: number):Coord {
        var indexX = Math.floor(screenCoord.x / gridSquareSize);
        var indexY = Math.floor(screenCoord.y / gridSquareSize);
        var indexCoord = new Coord(indexX, indexY);
        return indexCoord;
    }

    getGridIndex(screenCoord: Coord):Coord {
        if (!this.isEmpty) 
            return GridMap.getGridIndex(screenCoord, this.gridSquareSize);
    }

    getSquareScreenCoord(square: Coord):Array<Coord> {
        // 0: UL, 1: UR, 2: LL, 3: LR
        var output = new Array();
        output.push(new Coord(square.x * this.gridSquareSize, square.y * this.gridSquareSize)); // UL
        output.push(output[0].createOffset(this.gridSquareSize, 0)) // UR
        output.push(output[0].createOffset(0, this.gridSquareSize)) // LL
        output.push(output[0].createOffset(this.gridSquareSize, this.gridSquareSize)) // LR
        return output;
    }

    // the parameters must constitute a wall ie a line which represents a single side of a GridSquare @Untested
    isWall(coord1: Coord, coord2: Coord):Boolean {
        let square1: Coord
        let square2: Coord

        if (coord1.x == coord2.x) {
            if (coord1.y < coord2.y) {
                square1 = new Coord(coord1.x, coord1.y)
                square2 = new Coord(coord1.x - 1, coord1.y)
            } else {
                square1 = new Coord(coord2.x, coord1.y)
                square2 = new Coord(coord2.x - 1, coord1.y)
            }
        } else {
            if (coord1.x < coord2.x) {
                square1 = new Coord(coord1.x, coord1.y)
                square2 = new Coord(coord1.x, coord1.y - 1)
            } else {
                square1 = new Coord(coord2.x, coord1.y)
                square2 = new Coord(coord2.x, coord1.y - 1)
            }
        }

        return !(this.isOpen(square1) || this.isOpen(square2))
    }

    randomCoord():Coord {
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
    frameCount: number; // used for optionally offsetting the frequency of certain calculations
    map: GridMap;
    bullets: Array<Bullet>;
    nPCs: Array<NPC>;
    player: Player;
    healthBar: HealthBar;
    food: Array<Food>;
    pings: Array<Ping>;
    drawWorker: Object;
    strokeColor: RGBA;
    spawners: Array<NPcSpawner>;
    messages: Array<string>;

    constructor(width: number, height: number, numberOfEnemies: number, map: GridMap, loading: boolean, strokeColor: RGBA, includeSpawner: boolean) {
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
            for (var i = 0; i < numberOfEnemies; i++ ) {
                this.nPCs.push(new Pirate(  new Coord(this.map.width * Math.random(),     
                    (this.map.height / 2) * Math.random()),  this.map, this.bullets, this.player));
                    
                this.nPCs.push(new Spewer(  new Coord(this.map.width * Math.random(),     
                    (this.map.height / 2) * Math.random()),  this.map, this.bullets, this.player));

                this.nPCs.push(new Mine(    new Coord(this.map.width * Math.random(),     
                    (this.map.height) * Math.random()),      this.map, this.bullets));

                this.nPCs.push(new Chicken( new Coord(Math.random() * this.map.width,     
                    Math.random() * this.map.height),        this.map, this.food));
            }

            this.spawners = new Array();
            if (includeSpawner) {
                this.spawners.push(new NPcSpawner(new Coord(this.map.width / 2, this.map.height / 2), this));
            }

        } else {
            this.map = new GridMap(width, height, 0, 0, 0, true);
            this.player = null;
            this.healthBar = null;
            this.food = null;
            this.nPCs = new Array();
            this.nPCs.push(new LoadingActor(new Coord(width / 2, height / 2), this.map, this.bullets));
        }
    }

    draw():boolean {
        var playerIsDead = false; // setting this allows the rest of the function to finish running before the game is stopped

        // world 
        this.frameCount++;
        this.map.draw(this.drawWorker, this.strokeColor);
        this.drawBullets(this.bullets);
        for (var i = 0; i < this.spawners.length; i++) {
            if( this.spawners[i] != null ) {
                this.spawners[i].draw(this.drawWorker, this.strokeColor);
                this.spawners[i].step();
            }
        }
        for (var i = 0; i < this.pings.length; i++) {
            if (this.pings[i] != null) {
                this.pings[i].step();
                this.pings[i].draw(this.drawWorker, this.strokeColor);
    
                if ( this.pings[i].age > 16 ) {
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
            for (var i = 0; i < this.food.length; i ++) {
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
        } else {
            return true;
        }

    };

    save():string {
        return JSON.stringify(this.map);
    }

    drawBullets(list: Array<Bullet>):void {
        for (var i = 0; i < list.length; i++) {
            if (list[i] != null) {
                list[i].draw(this.drawWorker, this.strokeColor);
                if (!list[i].step()) {
                    list[i] = null;
                }
            }
        }
    }

    static calculateDistance(coord1: Coord, coord2: Coord):number {
        return Math.sqrt( Math.abs(coord2.x - coord1.x)**2 + Math.abs(coord2.y - coord1.y)**2 ) 
    };

    // returns true if obj1 (target) is shot by obj2 (projectile)
    isShotBy(obj1: Character, obj2: Bullet):boolean {
        let distance = World.calculateDistance(obj1.location, obj2.location);
        let isInTrajectory = false;
        let nextLinearLocation = obj2.location.createOffset(obj2.dx, obj2.dy);
        if (10 > distance) { // @Untested
            if (
                obj1.location.x >= obj2.location.x &&
                obj1.location.x <= nextLinearLocation.x &&
                obj1.location.y >= obj2.location.y &&
                obj1.location.y <= nextLinearLocation.y
            ) {
                let trajectorySlope = (obj2.location.y - nextLinearLocation.y) / (obj2.location.x - nextLinearLocation.x);
                let trajectoryIntercept = obj2.location.y - (trajectorySlope * obj1.location.x);

                let perpendicularSlope = trajectorySlope * -1;
                let perpendicularIntercept = obj1.location.y - (perpendicularSlope * obj1.location.x);
                
                let intersectionX = (trajectoryIntercept - perpendicularIntercept) / (trajectorySlope - perpendicularSlope);
                let intersectionY = (perpendicularSlope * intersectionX) + perpendicularSlope;
                let intersectionCoord = new Coord(intersectionX, intersectionY);

                let isInTrajectory = 3 > World.calculateDistance(obj1.location, intersectionCoord);
            }
        }
        return (3 > distance) || isInTrajectory;
    }

    collectDamage(obj: Character, arr: Array<Bullet>):number {
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

    static inverseCoord(coord: Coord, center: Coord):Coord {
        return new Coord(coord.x * -1, coord.y * -1);
    }

}

class Moveable extends CenteredShape {
    target: Coord;
    currentVelocity: number; 
    dx: number; 
    dy: number;

    map: GridMap;
    doesRicochet: boolean;
    originalLocation: Coord;

    constructor(size: number, location: Coord, target: Coord, currentVelocity: number, map: GridMap, doesRicochet: boolean) {
        super(size, location);
        this.target = target;
        this.currentVelocity = currentVelocity;
        this.map = map;
        this.doesRicochet = doesRicochet;
        this.originalLocation = location;
        this.setVector(target);
    }
    point(target: Coord):void {
        this.setVector(target);
    }
    setVector(target: Coord):void {
        this.originalLocation = this.location
        let targetDx = target.x - this.location.x;
        let targetDy = target.y - this.location.y;
        let slope = targetDx / targetDy;
        this.dy = Math.sqrt(
                (this.currentVelocity * this.currentVelocity) /
                ((slope * slope) + 1)
            ) *
            (targetDy / Math.abs(targetDy)
        );
        this.dx = Math.sqrt(
                (this.currentVelocity * this.currentVelocity) - 
                (this.dy * this.dy)
            ) * 
            (targetDx / Math.abs(targetDx)
        );
    }
    move():boolean {
        var newLocation = this.location.createOffset(this.dx, this.dy);
        if (!this.map.isOpen(newLocation)) {
            if (this.doesRicochet) {
                var newCoordAsGrid = this.map.getGridIndex(newLocation);

                var squareCoords = this.map.getSquareScreenCoord(newCoordAsGrid);
                if (squareCoords[0].x <= this.location.x && squareCoords[1].x >= this.location.x) {
                    this.dy = this.dy * -1;
                } else if (squareCoords[0].y <= this.location.y && squareCoords[2].y >= this.location.y) {
                    this.dx = this.dx * -1;
                } 

                newLocation = this.location.createOffset(this.dx, this.dy);
            } else {
                return false;
            }
        }
        this.location = newLocation;
        return true;
    };
}

class Bullet extends Moveable {
    age: number;
    maxForce:number;
    owner: Character;

    constructor(location: Coord, target: Coord, map: GridMap, owner: Character) {
        super(3, location, target, 8, map, true);
        this.maxForce = 1;
        this.owner = owner;
        this.age = 0;
    }
    step():boolean {
        this.move();
        this.age++;
        if (this.age < 80) {
            return true;
        } else {
            return false;
        }
    }
    draw(drawWorker, strokeColor: RGBA):void {
        drawWorker.fill(256, 256);
        super.draw(drawWorker, strokeColor); 
    }
}

class ExplodingBullet extends Bullet {
    bullets: Array<Bullet>;

    constructor(location: Coord, target: Coord, map: GridMap, owner: Character, bullets: Array<Bullet>) {
        super(location, target, map, owner);
        this.bullets = bullets;
    }
    step():boolean {
        super.step();

        if (this.age > 30) {
            this.bullets.push(new Bullet(this.location, this.location.createOffset(10, 10), this.map, this.owner));
            this.bullets.push(new Bullet(this.location, this.location.createOffset(10, -10), this.map, this.owner));
            this.bullets.push(new Bullet(this.location, this.location.createOffset(-10, 10), this.map, this.owner));
            this.bullets.push(new Bullet(this.location, this.location.createOffset(-10, -10), this.map, this.owner));
            return false;
        }

        return true;
    }
    draw(drawWorker, strokeColor: RGBA):void {
        super.draw(drawWorker, strokeColor);
    }
}

class CannonBall extends Bullet {
    constructor(location: Coord, target: Coord, map: GridMap, owner: Character) {
        super(location, target, map, owner);
        this.size = 7;
        this.maxForce = 10;
    }
    step(): boolean {
        this.size = 5 + (this.age % 10);
        return super.step();
    }
}

class Character extends Moveable {
    hp: number;
    bullets: Array<Bullet>;
    weapons: Array<Weapon>;
    currentWeapon:number;

    constructor(size: number, location: Coord, target: Coord, currentVelocity: number, map: GridMap, bullets: Array<Bullet>, maxHP: number) {
        super(size, location, target, currentVelocity, map, false);
        this.hp = maxHP;
        this.bullets = bullets;
        this.weapons = new Array();
        this.currentWeapon = 0;
    }
    shoot(target: Coord):void {
        this.weapons[this.currentWeapon].shoot(target);
    }
    step():void {
        for (var i = 0; i < this.weapons.length; i++) {
            if (null != this.weapons[i]){
                this.weapons[i].step();
            }
        }
    }
    takeDamage(amount: number):void {
        this.hp -= amount;
    };
}

class Player extends Character{
    isFiring: string;
    isMoving: boolean;
    firingAge: number;
    initialSize:number;
    enemiesKilled: number;
    previousTarget: Coord

    constructor(size: number, location: Coord, map: GridMap, bullets: Array<Bullet>) {
        super(size, location, new Coord(0, 0), 2, map, bullets, 32);
        this.weapons.push(new Gun(bullets, this, 0));
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
    step():void {
        super.step();
        if (this.size != this.initialSize) {
            this.size = this.initialSize;
        }
    }
    control(drawWorker):void {
        let target = new Coord(drawWorker.mouseX, drawWorker.mouseY);
        if (!this.previousTarget.equals(target)) {
            this.point(target);
        }
        if (this.isFiring == "front") {
            this.firingAge++;
            if (this.firingAge % 4 == 0) {
                this.shoot(new Coord(drawWorker.mouseX, drawWorker.mouseY));
            }
        } else if (this.isFiring == "behind") {
            this.firingAge++;
            if (this.firingAge % 4 == 0) {
                this.shoot(World.inverseCoord(new Coord(drawWorker.mouseX, drawWorker.mouseY), this.location));
            }
        } else {
            this.firingAge = 0;
        }
        if (this.isMoving) {
            this.move();
        }
    }
    draw(drawWorker, strokeColor: RGBA):void {
        var shade = strokeColor.r
        drawWorker.fill(shade, 256);
        super.draw(drawWorker, strokeColor); 
    }
    takeDamage(amount: number):void {
        super.takeDamage(amount);
        if (amount > 0) {
            this.size = 30;
        }
    }
    
}

class NPC extends Character {
    isHunting: boolean;
    age: number;
    idleAge: number;
    idleLife: number;
    combatTarget: Character;
    seesPlayer:boolean;
    lastSeenPlayerCoord: Coord;

   constructor(size: number, location: Coord, map: GridMap, bullets: Array<Bullet>, maxHP: number, combatTarget: Character, life: number, idleAge: number, idleLife: number) {
        super(size, location, new Coord(0, 0), 1, map, bullets, maxHP);
        this.isHunting = false;
        this.age = 0;
        this.idleAge = idleAge;
        this.idleLife = idleLife;
        this.combatTarget = combatTarget;
        this.seesPlayer = false;
        this.lastSeenPlayerCoord = null;
    }
    idle():void {
        if (!(this.idleAge < this.idleLife)) {
            this.idleAge = 0;
            this.idleLife = Math.random() * 2000;
            this.setVector(this.map.randomCoord());
        }
        this.idleAge++;
        this.move();
    }
    attack() :void{}
    decide():void {
        if ( this.isHunting || this.seesPlayer) {
            this.attack();
        } else {
            this.idle();
        }
    }
}

class Chicken extends NPC {
    isRunning: boolean;
    fleeAge: number;
    fleeLife: number;
    food: Array<Food>;

    constructor(location: Coord, map: GridMap, food: Array<Food>) {
        super(5, location, map, null, 8, null, 1000, 0, 200);
        this.isRunning = false;
        this.fleeAge = 0;
        this.fleeLife = 20;
        this.food = food;
    }
    draw(drawWorker, strokeColor:RGBA ):void {
        var shade = strokeColor.r;
        drawWorker.fill(shade, 256);
        super.draw(drawWorker, strokeColor); 
    }    
    step():void {
        super.step();
        if(this.hp <= 0) {
            this.food.push(new Food(this.location));
        }
        if (this.seesPlayer) {
            if (this.fleeAge < this.fleeLife) {
                this.fleeAge++;
            } else {
                this.fleeAge = 0;
                this.setVector(this.map.randomCoord());
            }
            this.move();
        } else {
            this.idle();
        }

    }
}

class Spewer extends NPC {
    didIgnite: boolean;
    igniteAge: number;
    isGrowing: boolean;

    constructor(location: Coord, map: GridMap, bullets: Array<Bullet>, combatTarget: Character) {
        super(5, location, map, bullets, 8, combatTarget, 1000, 0, 200);
        this.didIgnite = false;
        this.igniteAge = 0
        this.isGrowing = true;
        this.weapons.push(new Gun(bullets, this, 0));
    }
    draw(drawWorker, strokeColor: RGBA):void {
        drawWorker.stroke(128, 0, 0, 256);
        drawWorker.fill(128, 0, 0, 256);
        super.draw(drawWorker, strokeColor); 
        drawWorker.stroke(
            strokeColor.r, 
            strokeColor.g, 
            strokeColor.b, 
            strokeColor.a, 
        );            
    }
    step():void {
        super.step();
        if (this.didIgnite) {
            this.igniteAge++;
            if (this.igniteAge > 100) {
                this.explode();
            }
        }
        this.decide();
    }
    explode():void {
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
    pulse():void {
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
    attack():void {
        var distance = World.calculateDistance(this.location, this.lastSeenPlayerCoord);
        var willMove = true;
        if (this.seesPlayer) {
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
            this.point(this.lastSeenPlayerCoord);
            this.move();
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
    constructor(location: Coord, map: GridMap, bullets: Array<Bullet>, combatTarget: Character) {
        super(5 , location, map, bullets, 8, combatTarget, 1000, 0, 200);
        this.weapons.push(new Gun(bullets, this, 10));
    }
    draw(drawWorker, strokeColor: RGBA):void {
        drawWorker.stroke(256, 0, 0, 256);
        drawWorker.fill(256, 0, 0, 256);
        super.draw(drawWorker, strokeColor); 
        drawWorker.stroke(
            strokeColor.r, 
            strokeColor.g, 
            strokeColor.b, 
            strokeColor.a, 
        );            
    }
    step():void {
        super.step();
        this.decide();
    }
    attack():void {
        this.point(this.lastSeenPlayerCoord);
        this.move();
        if (this.seesPlayer) {
            this.shoot(this.combatTarget.location);
        }
        if (this.isHunting) {
         if (0 != World.calculateDistance(this.location, this.lastSeenPlayerCoord)) {
                this.isHunting = false;
            }
        } else {
            this.isHunting = true;
        }
    }
};

class LoadingActor extends NPC {
    direction: number;
    stepCount: number;

    constructor(location: Coord, map: GridMap, bullets: Array<Bullet>) {
        super(5, location, map, bullets, 1, null, 1000, 0, 200);
        this.stepCount = 0;
        this.weapons.push(new Gun(bullets, this, 0));
    }
    draw(drawWorker, strokeColor):void {
        var shade = strokeColor.r
        drawWorker.fill(shade, 256);
        super.draw(drawWorker, strokeColor); 
    }
    step():void {   
        super.step();
        if (this.direction < Math.PI * 2) {
            this.direction += 3;
        } else {
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
    constructor(location: Coord, map: GridMap, bullets: Array<Bullet>) {
        super(5, location, map, bullets, 1, null, 1000, 0, 200);
        this.weapons.push(new Gun(bullets, this, 0));
    }
    draw(drawWorker, strokeColor: RGBA):void {
        drawWorker.stroke(130, 128, 128, 256);
        drawWorker.fill(128, 128, 128, 256);
        super.draw(drawWorker, strokeColor); 
        drawWorker.stroke(
            strokeColor.r, 
            strokeColor.g, 
            strokeColor.b, 
            strokeColor.a, 
        );            
    }
    explode():void {
        var directions = Array();
        directions.push(this.location.createOffset(0, -300));
        directions.push(this.location.createOffset(300, 0));
        directions.push(this.location.createOffset(0, 300));
        directions.push(this.location.createOffset(-300, 0));

        for(var i = 0; i < directions.length; i++) {
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
    move():boolean {
        return false;
    }
    idle():void { }
    attack():void { }
    step():void {
        super.step();
        if (this.hp <= 0) {
            this.explode();
        }
    }
};

class HTMLDotshotUI {
    world: World;
    defaultStrokeColor: RGBA;
    display: Object;
    worldSettings: Array<Setting<any, any>>;
    height: number;
    width: number;
    console: HTMLDotshotMessageConsole;

    constructor () {
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
        } else {
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

    startNewGame():void {
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
    }

    saveMap():void {
        var map = this.world.save();
    
        // https://stackoverflow.com/questions/13405129/create-and-save-a-file-with-javascript
        var file = new Blob([map], {type: "string"});
        if (window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveOrOpenBlob(file, "map.json");
        } else { 
            var a = document.createElement("a"), url = URL.createObjectURL(file);
            a.href = url;
            a.download = "map.json";
            document.body.appendChild(a);
            a.click();
            setTimeout(function() {
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
            }, 0);
        }
    }

}

class HTMLDotshotMessageConsole {
    currentLineNumber: number;
    html: string;
    numberOfLines: number;
    lines:Array<string>;

    constructor() {
        this.numberOfLines = 4;
        this.lines = new Array();
        for (var i = 0; i < this.numberOfLines; i++) {
            this.lines[i] = "";
        }
        this.currentLineNumber = 1;
        this.constructHTML();
    }

    constructHTML():void {
        this.html = "";
        for (var i = 0; i < this.numberOfLines; i++) {
            this.html += "<p>" + this.lines[i] + "</p>";
        }
        this.display();
    }

    display():void {
        var element = document.getElementById("console");
        if (element) {
            element.innerHTML = this.html;
        }
    }

    post(string):void {
        for (var i = 0; i < this.numberOfLines; i++) {
            if (i != this.numberOfLines - 1) {
                this.lines[i] = this.lines[i + 1];
            } else {
                this.lines[i] = this.currentLineNumber + " " + string;
            }
        }
        this.currentLineNumber++;
        this.constructHTML();
    }
}

class Setting<T, U> {
    name: string;
    defaultValue: T;
    value: T;
    htmlValue: U;
    htmlType: string;
    htmlExtraAttributes: string;

    constructor(name: string, defaultValue: T, value: T) {
        this.name = name;
        this.defaultValue = defaultValue;
        if (this.value == null) {
            this.value = defaultValue;
        } else {
            this.value = value;
        }
        this.htmlExtraAttributes = "";
    }
    getElementFromDocument(): HTMLFormElement {
        var element = document.getElementById(this.name);
        if (element) {
            return (element as HTMLFormElement);
        }
    }
    setValueFromDocument(): void {
        this.htmlValue = this.getElementFromDocument().value;
        this.setValueFromHTML();
    }
    display():void {
        this.setHTMLFromValue();
        var container = document.getElementById("worldSettings");
        if (container) {
            container.innerHTML += this.generateHTML();
        }
    }
    generateHTML(): string {
        return "<p class='label'>" + this.name + "</p><input type='" + this.htmlType + "' " + this.htmlExtraAttributes + "value=" + this.htmlValue + " id='" + this.name + "'>";
    }
    setValueFromHTML(): void {}
    setHTMLFromValue(): void {}
}

class NumericalSetting extends Setting<number, number>{
    constructor (name: string, defaultValue: number, value: number) {
        super(name, defaultValue, value);
        this.htmlType = "range"
        this.htmlExtraAttributes = "' min='0' max='500' ";
    }
    setValueFromHTML(): void {
        this.value = this.htmlValue;
    }
    setHTMLFromValue(): void {
        this.htmlValue = this.value;
    }
}

class BinarySetting extends Setting<boolean, string> {
    constructor (name: string, defaultValue: boolean, value: boolean) {
        super(name, defaultValue, value);
        this.htmlType = "checkbox";
    }
    setValueFromHTML():void {
        if (this.htmlExtraAttributes == " checked ") { 
            this.value = true;
        } else {
            this.value = false;
        }
    }
    setHTMLFromValue(): void {
        if (this.value) {
            this.htmlExtraAttributes = " checked ";
        } else {
            this.htmlExtraAttributes = "";
        }
    }
    setValueFromDocument(): void {
        var element = this.getElementFromDocument();
        if (element.checked == true) {
            this.htmlExtraAttributes = " checked ";
        } else {
            this.htmlExtraAttributes = "";
        }
        this.setValueFromHTML();
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
        drawWorker.stroke(
            game.defaultStrokeColor.r, 
            game.defaultStrokeColor.g, 
            game.defaultStrokeColor.b, 
            game.defaultStrokeColor.a, 
        );

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
    }

};

var game;
var loadPage = function() {
    game = new HTMLDotshotUI();
}

