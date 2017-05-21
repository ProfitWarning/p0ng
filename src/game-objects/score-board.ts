import * as Assets from '../assets';

export class ScoreBoard extends Phaser.Text {
    game: Phaser.Game;
    score: number;



    constructor(game: Phaser.Game, x: number, y: number, style?: Phaser.PhaserTextStyle) {
        const defaultTextStyle = {
            font: '5em ' + Assets.GoogleWebFonts.PressStart2P,
            fill: '#ffffff'
        };
        super(game, x, y, '0', Object.assign({}, defaultTextStyle, style));

        this.game = game;
        this.score = 0;
        this.text = this.score.toString();
    }
}