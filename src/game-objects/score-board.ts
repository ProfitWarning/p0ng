import * as Assets from '../assets';

export class Score extends Phaser.Text {
  game: Phaser.Game;
  score: number;

  constructor(game: Phaser.Game, x: number, y: number, style?: Phaser.PhaserTextStyle) {
    const defaultTextStyle = {
      font: '4.5em ' + Assets.GoogleWebFonts.PressStart2P,
      fill: '#ffffff'
    };
    super(game, x, y, '0', Object.assign({}, defaultTextStyle, style));

    this.game = game;
    this.score = 0;
    this.text = this.score.toString();
    this.anchor.setTo(0.5);

    this.setShadow(3, 3, 'rgba(0,0,0,0.5)', 4);

    this.game.add.existing(this);
  }

  public setScore(score: number): void {
    this.score = score;
    this.text = this.score.toString();
  }

  public increaseScore(): void {
    this.setScore(this.score + 1);
  }
}

export class ScoreBoard {
  game: Phaser.Game;
  leftScore: Score;
  rightScore: Score;

  constructor(game: Phaser.Game, x: number, y: number, style?: Phaser.PhaserTextStyle) {
    this.game = game;
    this.leftScore = new Score(game, this.game.world.centerX - x, y, style);
    this.rightScore = new Score(game, this.game.world.centerX + x, y, style);
  }

  public resetScores(): void {
    this.leftScore.setScore(0);
    this.rightScore.setScore(0);
  }

  public increaseLeftScore(): void {
    this.leftScore.increaseScore();
  }

  public increaseRightScore(): void {
    this.rightScore.increaseScore();
  }
}
