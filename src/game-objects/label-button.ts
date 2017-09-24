import * as Assets from '../assets';

export class LabelButton extends Phaser.Button {

  label: Phaser.Text;

  constructor(game: Phaser.Game, x: number, y: number, text: string, callback: Function, callbackContext?, overFrame?, outFrame?, downFrame?, upFrame?) {
    super(game, x, y, '', callback, callbackContext, overFrame, outFrame, downFrame, upFrame);

    const defaultTextStyle = {
      font: '1.6em ' + Assets.GoogleWebFonts.PressStart2P,
      fill: '#ffffff'
    };

    this.anchor.setTo(0.5, 0.5);

    // puts the label in the center of the button
    this.label = new Phaser.Text(game, 0, 0, text, defaultTextStyle);
    this.label.text = text;
    this.label.anchor.setTo(0.5, 0.5);
    this.label.setShadow(4, 4, 'rgba(0,0,0,0.9)', 2);
    this.addChild(this.label);

    game.add.existing(this);
  }

}
