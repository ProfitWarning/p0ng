export default class PongBaseState extends Phaser.State {

    public drawBall(x?: number, y?: number, r?: number): Phaser.Sprite {
        let ballGraphic = this.game.add.graphics(0, 0);
        let ballSprite: Phaser.Sprite = null;

        ballGraphic.lineStyle(2, 0xFFFFFF, 1);
        ballGraphic.beginFill(0xFFFFFF);
        ballGraphic.drawCircle(this.game.world.centerX, this.game.world.centerY, r | 8);

        ballSprite = this.game.add.sprite(x | this.game.world.centerX, y | this.game.world.centerY, ballGraphic.generateTexture());
        ballSprite.anchor.set(0.5);

        ballGraphic.destroy();

        return ballSprite;
    }
    public drawPaddle(x: number, y: number, width: number, height: number): Phaser.Sprite {
        let paddleGraphic = this.game.add.graphics(0, 0);
        let paddleSprite: Phaser.Sprite = null;

        paddleGraphic.lineStyle(0, 0xFFFFFF, 1);
        paddleGraphic.beginFill(0xFFFFFF);
        paddleGraphic.drawRect(50, 250, width, height);

        paddleSprite = this.game.add.sprite(x, y, paddleGraphic.generateTexture());
        paddleSprite.anchor.set(0.5);

        paddleGraphic.destroy();

        return paddleSprite;
    }

    public log(msg: string): void {
        console.log(msg);
    }

    public isSpriteOnLeftSide(sprite: Phaser.Sprite): boolean {
        return sprite.x < this.game.world.width * 0.5;
    }
}