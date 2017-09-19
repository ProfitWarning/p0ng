import * as Assets from '../assets';

export class CenterBanner extends Phaser.Text {

  game: Phaser.Game;

  constructor(game: Phaser.Game, x: number, y: number, text: string, style?: Phaser.PhaserTextStyle) {
    const defaultTextStyle = {
      font: '5.0em ' + Assets.GoogleWebFonts.PressStart2P,
      fill: '#fff'
    };
    super(game, x, y, '', Object.assign({}, defaultTextStyle, style));

    this.game = game;
    this.anchor.setTo(0.5, 0.5);
    this.text = text;

    this.setShadow(3, 3, 'rgba(0,0,0,0.5)', 4);

    this.game.add.existing(this);
  }
}
