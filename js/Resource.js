import MatterEntity from './MatterEntity.js';

export default class Resource extends MatterEntity {

    static preload(scene) {
        scene.load.atlas('resources', 'images/resources.png', 'images/resources_atlas.json');
        scene.load.audio('tree', 'audio/tree.mp3');
        scene.load.audio('rock', 'audio/rock.mp3');
        scene.load.audio('bush', 'audio/bush.mp3');
        scene.load.audio('pickup', 'audio/pickup.mp3');
    }

    constructor(data) {
        let { scene, resource } = data;
        //super(scene.matter.world, resource.x, resource.y, 'resources', resource.type);
        let drops = JSON.parse(resource.properties.find(p=> p.name == 'drops').value);
        let depth = resource.properties.find(p=> p.name == 'depth').value;
        super({scene,x:resource.x,y:resource.y,texture: 'resources', frame:resource.type,drops,depth,health:5,name:resource.type});
        const { Bodies } = Phaser.Physics.Matter.Matter;
        var circleCollider = Bodies.circle(this.x, this.y, 12, { isSensor: false, label: 'collider' });
        circleCollider.render.visible = false;
        // define o yOrigin para a posição vertical do sprite
        let yOrigin = 0.5;
        if (resource.properties) {
            const property = resource.properties.find(p => p.name === 'yOrigin');
            if (property) {
                yOrigin = property.value;
            }
        }
        this.y += this.height * (yOrigin - 0.5);
        this.setExistingBody(circleCollider);
        this.setStatic(true);
        this.setOrigin(0.5, yOrigin);
    }
}
