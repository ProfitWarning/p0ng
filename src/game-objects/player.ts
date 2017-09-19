import { Paddle } from './paddle';

export enum PlayerKeySet {
  LeftPlayer = 0,
  RightPlayer
}

export default class Player {
  name: string;
  game: Phaser.Game;
  paddle: Paddle;
  keyUp: Phaser.Key;
  keyDown: Phaser.Key;
  keySet: PlayerKeySet;

  constructor(game: Phaser.Game, paddle: Paddle, keySet: PlayerKeySet) {
    this.game = game;
    this.paddle = paddle;
    this.keySet = keySet;
    this.name = this.keySet === PlayerKeySet.LeftPlayer ? 'Player one' : 'Player two';
  }

  public initKeyboard(): void {
    if (this.keySet === PlayerKeySet.LeftPlayer) {
      this.keyUp = this.game.input.keyboard.addKey(Phaser.Keyboard.W);
      this.keyDown = this.game.input.keyboard.addKey(Phaser.Keyboard.S);
    } else {
      this.keyUp = this.game.input.keyboard.addKey(Phaser.Keyboard.UP);
      this.keyDown = this.game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
    }
  }
}
