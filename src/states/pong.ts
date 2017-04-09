import * as Assets from '../assets';
import PongBaseState from './PongBaseState';
import { PongGameProperties } from '../interfaces/pong-properties';

export default class Pong extends PongBaseState {
    private _backgroundTemplateSprite: Phaser.Sprite = null;
    private _headline: Phaser.Text = null;
    private sfxAudiosprite: Phaser.AudioSprite = null;
    private _paddleLeft: Phaser.Sprite = null;
    private _paddleRight: Phaser.Sprite = null;
    private _paddleGroup: Phaser.Group = null;
    private _paddleRight_down: Phaser.Key;
    private _paddleRight_up: Phaser.Key;
    private _paddleLeft_down: Phaser.Key;
    private _paddleLeft_up: Phaser.Key;
    private _ball: Phaser.Sprite = null;
    private _scoreBoardLeft: Phaser.Text;
    private _scoreBoardRight: Phaser.Text;
    private _scoreLeft: number = 0;
    private _scoreRight: number = 0;
    private _ballReturnCount: number = 0;


    private _pongProperties: PongGameProperties = {
        debug: false,
        paddleSpeed: 500,
        paddleSegmentsMax: 4,
        paddleSegmentHeight: 15,
        paddleSegmentAngle: 15,

        ballVelocity: 500,
        ballVelocityIncrease: 50,
        ballVelocityMaxValue: 4
    };

    private _currrentBallVelocity: number;

    public create(): void {
        this.initGraphics();
        this.initKeyboard();
        this.initPhysics();
        this.startIdleMode();
    }

    public update(): void {
        this.onInputUpdate();
        this.game.physics.arcade.collide(this._ball, this._paddleGroup, this.collideWithPaddle, null, this);

    }

    public render(): void {
        this.game.debug.font = '9px Courier';
        if (this._pongProperties.debug) {
            this.game.debug.spriteInfo(this._paddleLeft, 16, 100);
            this.game.debug.spriteInfo(this._paddleRight, this.game.world.width - 230, 100);
            this.game.debug.spriteInfo(this._ball, this.game.world.centerX - 110, 100);
        }
    }

    private startIdleMode(): void {
        this.enablePaddles(false);
        this._ball.body.velocity.setTo(0);
        this._headline.text = 'P0ng';

        // start game via input
        this.game.input.onDown.add(this.startGame, this);
    }

    private startGame(): void {
        this.game.input.onDown.remove(this.startGame, this);

        this.game.camera.flash(0x000000, 800);
        this.camera.onFlashComplete.add(this.readySetGo, this);

        this.enablePaddles(true);
        this.resetScores();
        this._headline.text = 'Ready';
    }

    private resetScores(): void {
        this._scoreBoardLeft.text = '0';
        this._scoreLeft = 0;
        this._scoreBoardRight.text = '0';
        this._scoreRight = 0;
    }

    private enablePaddles(enabled: boolean): void {
        this._paddleGroup.setAll('body.enable', enabled);

        this._paddleRight_down.enabled = enabled;
        this._paddleRight_up.enabled = enabled;

        this._paddleLeft_down.enabled = enabled;
        this._paddleLeft_up.enabled = enabled;

    }

    private resetBall(): void {
        this._ball.reset(this.game.world.centerX, this.game.world.centerY);
        this._ball.visible = true;

        this.game.time.events.add(Phaser.Timer.SECOND * 2, this.startBall, this);
    }

    private startBall(): void {
        this._currrentBallVelocity = this._pongProperties.ballVelocity;
        this._ball.visible = true;
        this._ballReturnCount = 0;

        // calculate random  angle
        let randomStartAngle = this.game.rnd.pick([-60, 60, 25, -25, -120, 120]);
        this.game.physics.arcade.velocityFromAngle(randomStartAngle, this._currrentBallVelocity, this._ball.body.velocity);
    }

    private readySetGo(): void {
        this.resetBall();
        this.game.time.events.add(Phaser.Timer.SECOND * .80, () => {
            this._headline.text = 'Set';
            this.game.time.events.add(Phaser.Timer.SECOND * 1.20, () => {
                this._headline.text = 'Go';
            }, this);
        }, this);
    }

    private initGraphics(): void {
        this._backgroundTemplateSprite = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, Assets.Images.ImagesBackgroundTemplate.getName());
        this._backgroundTemplateSprite.anchor.setTo(0.5);

        this._headline = this.game.add.text(this.game.world.centerX, 30, 'P0ng', {
            font: '3em ' + Assets.GoogleWebFonts.PressStart2P,
            fill: '#ffffff'
        });
        this._headline.anchor.setTo(0.5);

        this._scoreBoardLeft = this.game.add.text(this.game.world.centerX - 130, 110, this._scoreLeft.toString(), {
            font: '5em ' + Assets.GoogleWebFonts.PressStart2P,
            fill: '#ffffff'
        });
        this._scoreBoardLeft.anchor.setTo(0.5);

        this._scoreBoardRight = this.game.add.text(this.game.world.centerX + 130, 110, this._scoreLeft.toString(), {
            font: '5em ' + Assets.GoogleWebFonts.PressStart2P,
            fill: '#ffffff'
        });
        this._scoreBoardRight.anchor.setTo(0.5);

        this._paddleLeft = this.drawPaddle(120, this.game.world.centerY, 10, this._pongProperties.paddleSegmentsMax * 2 * this._pongProperties.paddleSegmentHeight);
        this._paddleRight = this.drawPaddle(this.game.world.width - 120, this.game.world.centerY, 10, this._pongProperties.paddleSegmentsMax * 2 * this._pongProperties.paddleSegmentHeight);
        this._ball = this.drawBall();
    }

    private initPhysics(): void {
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.game.physics.arcade.checkCollision.left = false;
        this.game.physics.arcade.checkCollision.right = false;
        this.game.physics.enable(this._ball, Phaser.Physics.ARCADE);

        this._paddleGroup = this.game.add.group();
        this._paddleGroup.enableBody = true;
        this._paddleGroup.physicsBodyType = Phaser.Physics.ARCADE;

        this._paddleGroup.add(this._paddleLeft);
        this._paddleGroup.add(this._paddleRight);

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
            this._scoreRight++;
            this._scoreBoardRight.text = this._scoreRight.toString();
        }
        else  {
            this._scoreLeft++;
            this._scoreBoardLeft.text = this._scoreLeft.toString();
        }

       this.resetBall();
    }
    private collideWithPaddle(ball, paddle): void {
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

    private onInputUpdate(): void {
        if (this._paddleLeft_up.isDown) {
            this._paddleLeft.body.velocity.y = -this._pongProperties.paddleSpeed;
        }
        else if (this._paddleRight_up.isDown) {
            this._paddleRight.body.velocity.y = -this._pongProperties.paddleSpeed;
        }
        else if (this._paddleLeft_down.isDown) {
            this._paddleLeft.body.velocity.y = this._pongProperties.paddleSpeed;
        }
        else if (this._paddleRight_down.isDown) {
            this._paddleRight.body.velocity.y = this._pongProperties.paddleSpeed;
        }
        else {
            this._paddleLeft.body.velocity.setTo(0, 0);
            this._paddleRight.body.velocity.setTo(0, 0);
        }
    }

    private initKeyboard(): void {
        this._backgroundTemplateSprite.inputEnabled = true;

        this._paddleLeft_up = this.game.input.keyboard.addKey(Phaser.Keyboard.W);
        this._paddleLeft_down = this.game.input.keyboard.addKey(Phaser.Keyboard.S);

        this._paddleRight_up = this.game.input.keyboard.addKey(Phaser.Keyboard.UP);
        this._paddleRight_down = this.game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
    }
}
