
export class Paddle extends Phaser.Sprite {

    game: Phaser.Game;

    constructor(game: Phaser.Game, x: number, y: number, width: number, height: number) {
        super(game, x, y);

        this.game = game;
        this.texture = this.drawPaddle(x, y, width, height);
        this.anchor.set(0.5);

        this.game.add.existing(this);
    }

    private drawPaddle(x: number, y: number, width: number, height: number): PIXI.RenderTexture {
        let texture: PIXI.RenderTexture;
        let paddleGraphic = new Phaser.Graphics(this.game, 0, 0);
        paddleGraphic.lineStyle(0, 0xFFFFFF, 1);
        paddleGraphic.beginFill(0xFFFFFF);
        paddleGraphic.drawRect(50, 250, width, height);

        texture = paddleGraphic.generateTexture();
        paddleGraphic.destroy();

        return texture;
    }
}