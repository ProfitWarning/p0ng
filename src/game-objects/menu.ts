import * as Assets from '../assets';
import { LabelButton } from './label-button';

export class Menu {
  shadow: Phaser.Sprite;
  game: Phaser.Game;
  border: Phaser.Sprite;
  closeButton: LabelButton;
  isVisible: boolean;

  constructor(game: Phaser.Game, x: number, y: number, onClose: Function) {
    this.game = game;
    this.closeButton = new LabelButton(game, 0, 80, '-> Click to start <-', onClose);
    this.border = this.drawBorders();

    this.shadow = this.drawBorders();
    this.shadow.tint = 0x000000;
    this.shadow.alpha = 0.6;

    const defaultTextStyle = {
      font: '1.3em ' + Assets.GoogleWebFonts.PressStart2P,
      fill: '#ffffff'
    };

    const lp = new Phaser.Text(game, -155 , -85, 'Player 1 \nup:W\ndown:S' , defaultTextStyle);
    lp.setShadow(3, 3, 'rgba(0,0,0,0.5)', 4);
    const rp = new Phaser.Text(game, 55 , -85, 'Player 2 \nup:▲\ndown:▼' , defaultTextStyle);
    rp.setShadow(3, 3, 'rgba(0,0,0,0.5)', 4);

    this.border.addChild(this.closeButton);
    this.border.addChild(lp);
    this.border.addChild(rp);

    game.add.existing(this.border);
    // this.shadow.sendToBack();
    // this.shadow.reset(this.shadow.x + 3, this.shadow.y + 3);
    // game.add.existing(this.shadow);
  }

  private drawBorders(): Phaser.Sprite {
    const g = new Phaser.Graphics(this.game, 0, 0);
    g.lineStyle(3, 0xFFFFFF);
    g.drawRoundedRect(0, 0, 370, 220, 4);
    const borderTexture = g.generateTexture();
    const borders = new Phaser.Sprite(this.game, this.game.world.centerX, this.game.world.centerY - 20, borderTexture);
    borders.anchor.setTo(0.5, 0.5);

    g.destroy();

    return borders;
  }

  public get visible() {
    return this.isVisible;
  }

  public set visible(value: boolean) {
    this.isVisible = value;
    this.closeButton.visible = this.isVisible;
    this.border.visible = this.visible;
  }
}
