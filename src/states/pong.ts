import * as Assets from '../assets';
import { Ball } from '../game-objects/ball';
import { CenterBanner } from '../game-objects/center-banner';
import { Headline } from '../game-objects/headline';
import { Menu } from '../game-objects/menu';
import { Paddle } from '../game-objects/paddle';
import Player from '../game-objects/player';
import { PlayerKeySet } from '../game-objects/player';
import { ScoreBoard } from '../game-objects/score-board';
import { PongGameProperties } from '../interfaces/pong-properties';
import PongBaseState from './PongBaseState';

export default class Pong extends PongBaseState {
  private _menu: Menu;
  private _backgroundTemplateSprite: Phaser.Sprite;
  private _headline: Phaser.Text;
  private sfxAudiosprite: Phaser.AudioSprite;
  private _paddleGroup: Phaser.Group;
  private _ball: Ball;
  private _ballReturnCount: number = 0;
  private _scoreBoard: ScoreBoard;
  private _leftPlayer: Player;
  private _rightPlayer: Player;
  private _ballStartEvent: Phaser.TimerEvent;
  private _centerBanner: CenterBanner;


  private _pongProperties: PongGameProperties = {
    debug: false,
    paddleSpeed: 500,
    paddleSegmentsMax: 4,
    paddleSegmentHeight: 15,
    paddleSegmentAngle: 15,

    ballVelocity: 500,
    ballVelocityIncrease: 50,
    ballVelocityMaxValue: 4,

    winningScore: 2
  };

  private _currrentBallVelocity: number;

  public create(): void {
    this.initGraphics();
    this.initKeyboard();
    this.initPhysics();
    this.startIdleMode();
  }

  public update(): void {
    this.updateInputs();
    this.game.physics.arcade.collide(this._ball, this._paddleGroup, this.collideWithPaddle, undefined, this);

  }

  public render(): void {
    this.game.debug.font = '9px Courier';
    if (this._pongProperties.debug) {
      this.game.debug.spriteInfo(this._leftPlayer.paddle, 16, 100);
      this.game.debug.spriteInfo(this._rightPlayer.paddle, this.game.world.width - 230, 100);
      this.game.debug.spriteInfo(this._ball, this.game.world.centerX - 110, 100);
    }
  }

  private startIdleMode(): void {
    this._ball.resetBall();
    this._ball.visible = false;
    this._menu.visible = true;
    this.setPaddlesActive(false);
    this._ball.body.velocity.setTo(0);
    this._headline.text = 'P0ng';
    this._scoreBoard.resetScores();

    // start game via input
    // this.game.input.onDown.add(this.startGame, this);
  }

  private startGame(): void {
    this._centerBanner.visible = false;
    this._menu.visible = false;

    this.game.input.onDown.remove(this.startGame, this);

    this.game.camera.flash(0x000000, 1200);
    this.camera.onFlashComplete.add(this.readySetGo, this);

    this.setPaddlesActive(true);
    this._scoreBoard.resetScores();
    this._centerBanner.text = 'Ready';
  }

  private setPaddlesActive(enabled: boolean): void {
    this._paddleGroup.setAll('body.enable', enabled);

    this._leftPlayer.keyDown.enabled = enabled;
    this._leftPlayer.keyUp.enabled = enabled;

    this._rightPlayer.keyDown.enabled = enabled;
    this._rightPlayer.keyUp.enabled = enabled;

    if (!enabled) {
      this._paddleGroup.getAll().forEach((paddle: Paddle) => {
        paddle.resetToStart();
      });
    }
  }

  private resetBall(): void {
    this._ball.resetBall();
    this.game.time.events.add(Phaser.Timer.SECOND * 2.8, this.startBall, this);
  }

  private startBall(): void {
    this._ball.visible = true;
    this._currrentBallVelocity = this._pongProperties.ballVelocity;
    this._ballReturnCount = 0;

    // calculate random  angle
    let randomStartAngle = this.game.rnd.pick([-60, 60, 25, -25, -120, 120]);
    this.game.physics.arcade.velocityFromAngle(randomStartAngle, this._currrentBallVelocity, this._ball.body.velocity);
  }

  private readySetGo(): void {
    this.resetBall();
    this._centerBanner.visible = true;
    this.game.time.events.add(Phaser.Timer.SECOND * 1.05, () => {
      this._centerBanner.text = 'Set';
      this.game.time.events.add(Phaser.Timer.SECOND * 0.95, () => {
        this._centerBanner.text = 'Go';
        this.game.time.events.add(Phaser.Timer.SECOND * 0.95, () => {
          this._centerBanner.visible = false;
        }, this);
      }, this);
    }, this);
  }

  private initGraphics(): void {
    this._backgroundTemplateSprite = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, Assets.Images.ImagesBackgroundTemplate.getName());
    this._backgroundTemplateSprite.anchor.setTo(0.5);

    this._headline = new Headline(this.game, this.game.world.centerX, 30, 'P0ng');

    this._centerBanner = new CenterBanner(this.game, this.game.world.centerX, this.game.world.centerY - 190, ``);
    this._centerBanner.visible = false;

    this._menu = new Menu(this.game, this.game.world.centerX, this.game.world.centerY - 15, () => { return this.startGame(); }); // new MenuHeadline(this.game, this.game.world.centerX, this.game.world.centerY - 15, `Click to start`);

    this._scoreBoard = new ScoreBoard(this.game, 130, 110);

    this._ball = new Ball(this.game);

    const paddleLeft = new Paddle(this.game,
      120, this.game.world.centerY,
      10,
      this._pongProperties.paddleSegmentsMax * 2 * this._pongProperties.paddleSegmentHeight);

    const paddleRight = new Paddle(this.game,
      this.game.world.width - 120,
      this.game.world.centerY,
      10,
      this._pongProperties.paddleSegmentsMax * 2 * this._pongProperties.paddleSegmentHeight);

    this._leftPlayer = new Player(this.game, paddleLeft, PlayerKeySet.LeftPlayer);
    this._rightPlayer = new Player(this.game, paddleRight, PlayerKeySet.RightPlayer);
  }

  private initPhysics(): void {
    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    this.game.physics.arcade.checkCollision.left = false;
    this.game.physics.arcade.checkCollision.right = false;
    this.game.physics.enable(this._ball, Phaser.Physics.ARCADE);

    this._paddleGroup = this.game.add.group();
    this._paddleGroup.enableBody = true;
    this._paddleGroup.physicsBodyType = Phaser.Physics.ARCADE;

    this._paddleGroup.add(this._leftPlayer.paddle);
    this._paddleGroup.add(this._rightPlayer.paddle);

    this._paddleGroup.setAll('checkWorldBounds', true);
    this._paddleGroup.setAll('body.collideWorldBounds', true);
    this._paddleGroup.setAll('body.immovable', true);

    this._ball.checkWorldBounds = true;
    this._ball.body.collideWorldBounds = true;
    this._ball.body.immovable = true;
    this._ball.events.onOutOfBounds.add(this.onBallHittingWall, this);
    this._ball.body.bounce.setTo(1, 1);
  }

  private onBallHittingWall(): void {
    if (this.isSpriteOnLeftSide(this._ball)) {
      this._scoreBoard.increaseRightScore();
    }
    else {
      this._scoreBoard.increaseLeftScore();
    }

    if (this._pongProperties.winningScore === this._scoreBoard.leftScore.score) {
      this.playerWon(this._leftPlayer);

    }
    else if (this._pongProperties.winningScore === this._scoreBoard.rightScore.score) {
      this.playerWon(this._rightPlayer);
    } else {
      this.resetBall();
    }
  }

  private playerWon(player: Player) {
    this.game.time.events.remove(this._ballStartEvent);
    this.startIdleMode();

    this._centerBanner.text = `${player.name} won!`;
    this._centerBanner.visible = true;
  }

  private collideWithPaddle(ball: Ball, paddle: Paddle): void {
    this.log('ball velocity: ' + this._currrentBallVelocity);
    let returnAngle;
    let segmentHit = Math.floor((ball.y - paddle.y) / this._pongProperties.paddleSegmentHeight);
    this.log('segment hit #: ' + segmentHit);

    if (this.isSpriteOnLeftSide(paddle)) {
      returnAngle = segmentHit * this._pongProperties.paddleSegmentAngle;
      this.log('left paddle return angle: ' + returnAngle);
      this.game.physics.arcade.velocityFromAngle(returnAngle, Math.abs(this._currrentBallVelocity), this._ball.body.velocity);
    }
    else {
      returnAngle = 180 - (segmentHit * this._pongProperties.paddleSegmentAngle);
      if (returnAngle > 180) {
        returnAngle -= 360;
      }
      this.log('right paddle return angle: ' + returnAngle);
      this.game.physics.arcade.velocityFromAngle(returnAngle, Math.abs(this._currrentBallVelocity), this._ball.body.velocity);
    }
    this._ballReturnCount++;
    this.log('ball count: ' + this._ballReturnCount);
    if (this._ballReturnCount === this._pongProperties.ballVelocityMaxValue) {
      this._ballReturnCount = 0;
      this._currrentBallVelocity = Math.abs(this._currrentBallVelocity) + this._pongProperties.ballVelocityIncrease;
    }
  }

  private updateInputs(): void {
    let lp = this._leftPlayer;
    let rp = this._rightPlayer;

    if (lp.keyUp.isDown) {
      lp.paddle.body.velocity.y = -this._pongProperties.paddleSpeed;
    }
    else if (rp.keyUp.isDown) {
      rp.paddle.body.velocity.y = -this._pongProperties.paddleSpeed;
    }
    else if (lp.keyDown.isDown) {
      lp.paddle.body.velocity.y = this._pongProperties.paddleSpeed;
    }
    else if (rp.keyDown.isDown) {
      rp.paddle.body.velocity.y = this._pongProperties.paddleSpeed;
    }
    else {
      rp.paddle.body.velocity.setTo(0, 0);
      lp.paddle.body.velocity.setTo(0, 0);
    }
  }

  private initKeyboard(): void {
    this._backgroundTemplateSprite.inputEnabled = true;

    this._leftPlayer.initKeyboard();
    this._rightPlayer.initKeyboard();
  }
}
