export default class PongBaseState extends Phaser.State {

    public log(msg: string): void {
        console.log(msg);
    }

    public isSpriteOnLeftSide(sprite: Phaser.Sprite): boolean {
        return sprite.x < this.game.world.width * 0.5;
    }
}