export class Ball extends Phaser.Sprite {
    game: Phaser.Game;

    constructor(game: Phaser.Game, x: number = game.world.centerX, y: number = game.world.centerY, r?: number) {
        super(game, x, y);

        this.game = game;
        this.texture = this.drawBall(x, y, r);
        this.anchor.set(0.5);

        this.game.add.existing(this);
    }

    public resetBall(): void {
        this.reset(this.game.world.centerX, this.game.world.centerY);
    }

    private drawBall(x?: number, y?: number, r: number = 8): Phaser.RenderTexture {
        let texture: Phaser.RenderTexture;
        let ballGraphic = this.game.add.graphics(0, 0);
        ballGraphic.lineStyle(2, 0xFFFFFF, 1);
        ballGraphic.beginFill(0xFFFFFF);
        ballGraphic.drawCircle(this.game.world.centerX, this.game.world.centerY, r | 8);

        texture = ballGraphic.generateTexture();

        ballGraphic.destroy();

        return texture;
    }
}
