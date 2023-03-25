import Enemy from './Enemy';
import Player from './Player';
import Resources from './Resource';

export default class MainScene extends Phaser.Scene {

    constructor() {
        super("MainScene");
        this.enemies = [];
    }


preload(){
    Player.preload(this);
    Resources.preload(this);
    Enemy.preload(this);
    this.load.image('tiles','images/RPG Nature Tileset.png');
    this.load.tilemapTiledJSON('map','images/map.json');
}

create(){
    const map = this.make.tilemap({key: 'map'});
    this.map = map;
    const tileset = map.addTilesetImage('RPG Nature Tileset', 'tiles');
    const layer1 = map.createLayer('ground', tileset, 0, 0);
    const layer2 = map.createLayer('ground2', tileset, 0, 0);
    this.map.getObjectLayer('Resources').objects.forEach(resource => new Resources({scene:this,resource}));
    this.map.getObjectLayer('Enemies').objects.forEach(enemy => this.enemies.push(new Enemy({scene:this,enemy})));   
    layer1.setCollisionByProperty({collides:true});
    layer2.setCollisionByProperty({collides:true});
    this.matter.world.convertTilemapLayer(layer1);
    this.matter.world.convertTilemapLayer(layer2);
    this.player = new Player({scene:this,x: 350,y:310,texture:'female', frame: 'townsfolk_f_idle_1'})
    this.player.inputKeys = this.input.keyboard.addKeys({
        up: Phaser.Input.Keyboard.KeyCodes.W,
        down: Phaser.Input.Keyboard.KeyCodes.S,
        left: Phaser.Input.Keyboard.KeyCodes.A,
        right: Phaser.Input.Keyboard.KeyCodes.D
    })
    let camera  = this.cameras.main;
    camera.zoom = 2;
    camera.startFollow(this.player);
    camera.setLerp(0.1,0.1);
    camera.setBounds(0, 0, this.game.config.width, this.game.config.height);
}
update() {
    this.enemies.forEach(enemy => enemy.update());
    this.player.update();
}
}