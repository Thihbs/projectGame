import Phaser from "phaser";
import PhaserMatterCollisionPlugin from "phaser-matter-collision-plugin";
import MainScene from './MainScene.js';

const config = { 
    type: Phaser.AUTO,
    parent: "survival-game",
    width: 512,
    height: 512,
    backgroundColor: '#333333',
    scene: [MainScene],
    scale: {
        zoom:2,
    },
    physics: {
        default: "matter",
        matter: {
            debug: true,
            gravity: {y:0},
        }
    },
    plugins: {
        scene: [
            {
            key:'matterCollision',
            plugin: PhaserMatterCollisionPlugin,
            mapping:'matterCollision'
        }
    ],
    }
}


new Phaser.Game(config);