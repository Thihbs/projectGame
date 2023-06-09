import MatterEntity from "./MatterEntity.js";

export default class Player extends MatterEntity {
    
    constructor(data) {
        let {scene,x,y,texture,frame} = data;
        super({ ...data, health: 200, drops: [], name: 'player' });
        this.touching = [];
        //weapons
        this.spriteWeapon = new Phaser.GameObjects.Sprite(this.scene, 0, 0, 'items', 162);
        this.spriteWeapon.setScale(0.8);
        this.spriteWeapon.setOrigin(0.25, 0.75);
        this.scene.add.existing(this.spriteWeapon);
        const { Body, Bodies } = Phaser.Physics.Matter.Matter;
        var playerCollider = Bodies.circle(this.x, this.y, 12, { isSensor: false, label: 'playerCollider' });
        var playerSensor = Bodies.circle(this.x, this.y, 24, { isSensor: true, label: 'playerSensor' }); 
        playerCollider.render.visible = false;
        playerSensor.render.visible = false;
        const compoundBody = Body.create({
            parts: [playerCollider, playerSensor],
            frictionAir: 0.35,
        });
        this.setExistingBody(compoundBody);
        this.setFixedRotation();
        this.CreateMiningColissions(playerSensor);
        this.CreatePickupCollisions(playerCollider);
        this.scene.input.on('pointermove', pointer => { if (!this.dead) this.setFlipX(pointer.worldX < this.x) });
    }
    static preload(scene) {
        scene.load.atlas('female', 'images/female.png', 'images/female_atlas.json');
        scene.load.animation('female_anim', 'images/female_anim.json');
        scene.load.spritesheet('items', 'images/items.png', { frameWidth: 32, frameHeight: 32 });
        scene.load.audio('player', 'audio/player.mp3');
    }

    onDeath = () =>  {
        this.anims.stop();
        this.setTexture('items', 0);
        this.setOrigin(0.5,0.5);
        this.spriteWeapon.destroy();
    }
    update() {
        if (this.dead) return;
        this.anims.play('idle', true)
        const speed = 2.5;
        let playerVelocity = new Phaser.Math.Vector2();
        if (this.inputKeys.left.isDown) {
            playerVelocity.x = -1;
        } else if (this.inputKeys.right.isDown) {
            playerVelocity.x = 1;
        }
        if (this.inputKeys.up.isDown) {
            playerVelocity.y = -1;
        } else if (this.inputKeys.down.isDown) {
            playerVelocity.y = 1;
        }
        playerVelocity.normalize();
        playerVelocity.scale(speed);
        this.setVelocity(playerVelocity.x, playerVelocity.y)

        const isMovingHorizontally = Math.abs(this.velocity.x) > 0.1;
        const isMovingVertically = Math.abs(this.velocity.y) > 0.1;
        const isMoving = isMovingHorizontally || isMovingVertically;

        if (isMoving) {
            this.anims.play('walk', true);
        } else {
            this.anims.play('idle', true);
        }
        this.spriteWeapon.setPosition(this.x + (this.flipX ? -0 : - 3), this.y + 10);
        this.weaponRotate();
    }
    weaponRotate() {
        let pointer = this.scene.input.activePointer;
        if (pointer.isDown) {
            this.weaponRotation += 6;
        } else {
            this.weaponRotation = 0;
        }
        if (this.weaponRotation > 100) {
            this.weaponRotation = 0;
            this.whackStuff();
        }
        if (this.flipX) {
            this.spriteWeapon.setAngle(-this.weaponRotation - 90);
        } else {
            this.spriteWeapon.setAngle(this.weaponRotation);
        }
    }
    CreateMiningColissions(playerSensor) {
        this.scene.matterCollision.addOnCollideStart({
            objectA: [playerSensor],
            callback: other => {
                if (other.bodyB.isSensor) return;
                this.touching.push(other.gameObjectB);
                console.log(this.touching.length, other.gameObjectB.name);
            },
            context: this.scene,
        });
        this.scene.matterCollision.addOnCollideEnd({
            objectA: [playerSensor],
            callback: other => {
                this.touching = this.touching.filter(gameObject => gameObject != other.gameObjectB);
                console.log(this.touching.length);
            },
            context: this.scene,
        })
    }
    whackStuff() {
        console.log('whackStuff called');
        this.touching = this.touching.filter(gameObject => gameObject.hit && !gameObject.dead);
        this.touching.forEach(gameobject => {
            gameobject.hit();
            if (gameobject.dead) gameobject.destroy();
        })
    }

    CreatePickupCollisions(playerCollider) {
        this.scene.matterCollision.addOnCollideStart({
            objectA: [playerCollider],
            callback: other => {
                if (other.gameObjectB && other.gameObjectB.pickup) other.gameObjectB.pickup();
            },
            context: this.scene,
        });
        this.scene.matterCollision.addOnCollideActive({
            objectA: [playerCollider],
            callback: other => {
                if (other.gameObjectB && other.gameObjectB.pickup) other.gameObjectB.pickup();
            },
            context: this.scene,
        })
    }
}