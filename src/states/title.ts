import * as Assets from '../assets';

export default class Title extends Phaser.State {
    paddleRight_down: Phaser.Key;
    paddleRight_up: Phaser.Key;
    paddleLeft_down: Phaser.Key;
    paddleLeft_up: Phaser.Key;
    private backgroundTemplateSprite: Phaser.Sprite = null;
    private googleFontText: Phaser.Text = null;
    // private localFontText: Phaser.Text = null;
    // private bitmapFontText: Phaser.BitmapText = null;
    private sfxAudiosprite: Phaser.AudioSprite = null;
    private _paddleLeft: Phaser.Sprite = null;
    private _paddleRight: Phaser.Sprite = null;
    private Ball: Phaser.Sprite = null;

    // This is any[] not string[] due to a limitation in TypeScript at the moment;
    // despite string enums working just fine, they are not officially supported so we trick the compiler into letting us do it anyway.
    private sfxLaserSounds: any[] = null;

    public preload(): void {
        this.backgroundTemplateSprite = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, Assets.Images.ImagesBackgroundTemplate.getName());
        this.backgroundTemplateSprite.anchor.setTo(0.5);

        this.googleFontText = this.game.add.text(this.game.world.centerX, this.game.world.centerY - 220, 'Pong', {
            font: '2em ' + Assets.GoogleWebFonts.PressStart2P,
            fill: '#ffffff'
        });
        this.googleFontText.anchor.setTo(0.5);

        // this.localFontText = this.game.add.text(this.game.world.centerX, this.game.world.centerY, 'Local Fonts!', {
        //     font: '50px ' + Assets.CustomWebFonts.Fonts2DumbWebfont.getFamily()
        // });
        // this.localFontText.anchor.setTo(0.5);

        // this.bitmapFontText = this.game.add.bitmapText(this.game.world.centerX, this.game.world.centerY + 100, Assets.BitmapFonts.FontsFontFnt.getName(), 'Bitmap Fonts!', 50);
        // this.bitmapFontText.anchor.setTo(0.5);

        this.sfxAudiosprite = this.game.add.audioSprite(Assets.Audiosprites.AudiospritesSfx.getName());

        // This is an example of how you can lessen the verbosity
        let availableSFX = Assets.Audiosprites.AudiospritesSfx.Sprites;
        this.sfxLaserSounds = [
            availableSFX.Laser1,
            availableSFX.Laser2,
            availableSFX.Laser3,
            availableSFX.Laser4,
            availableSFX.Laser5,
            availableSFX.Laser6,
            availableSFX.Laser7,
            availableSFX.Laser8,
            availableSFX.Laser9
        ];

        this._paddleLeft = this.drawPaddle(120, this.game.world.centerY, 10, 120);
        this._paddleRight = this.drawPaddle(this.game.world.width - 120, this.game.world.centerY, 10, 120);
        this.Ball = this.drawBall();
    }

    public create(): void {
        this.game.camera.flash(0x000000, 500);

        this.backgroundTemplateSprite.inputEnabled = true;
        // this.backgroundTemplateSprite.events.onInputDown.add(() => {
        //     this.sfxAudiosprite.play(Phaser.ArrayUtils.getRandomItem(this.sfxLaserSounds));
        // });

        // enable input
        this.initKeyboard();

        this.game.physics.enable([this._paddleLeft, this._paddleRight, this.Ball], Phaser.Physics.ARCADE);
        this.game.physics.startSystem(Phaser.Physics.ARCADE);

        this._paddleLeft.body.immovable = true;
        this._paddleLeft.body.collideWorldBounds = true;
        this._paddleLeft.body.bounce.setTo(1, 1);

        this._paddleRight.body.immovable = true;
        this._paddleRight.body.collideWorldBounds = true;
        this._paddleRight.body.bounce.setTo(1, 1);

        this.Ball.body.velocity.setTo(-200, 0);
        this.Ball.body.bounce.setTo(1, 1);
        this.Ball.body.collideWorldBounds = true;
    }

    public update(): void {
        this.game.physics.arcade.collide(this._paddleLeft, this.Ball, (_paddle: Phaser.Sprite, _ball: Phaser.Sprite) => {
            let diff = 0;

            if (_ball.y < _paddle.y) {
                //  Ball is on the upper-hand side of the paddle
                diff = _paddle.y - _ball.y;
                _ball.body.velocity.y = (-2 * diff);
            }
            else if (_ball.y > _paddle.y) {
                //  Ball is on the down-hand side of the paddles
                diff = _ball.y - _paddle.y;
                _ball.body.velocity.y = (2 * diff);
            }
            else {
                //  Ball is perfectly in the middle
                //  Add a little random X to stop it bouncing straight!
                _ball.body.velocity.y = 2 + Math.random() * 8;
            }
        });
        this.game.physics.arcade.collide(this._paddleRight, this.Ball, (_paddle, _ball) => {
            let diff = 0;

            if (_ball.y < _paddle.y) {
                //  Ball is on the upper-hand side of the paddle
                diff = _paddle.y - _ball.y;
                _ball.body.velocity.y = (2 * diff);
            }
            else if (_ball.y > _paddle.y) {
                //  Ball is on the down-hand side of the paddles
                diff = _ball.y - _paddle.y;
                _ball.body.velocity.y = (-2 * diff);
            }
            else {
                //  Ball is perfectly in the middle
                //  Add a little random X to stop it bouncing straight!
                _ball.body.velocity.y = 2 + Math.random() * 8;
            }
        });

        if (this.paddleLeft_up.isDown) {
            this._paddleLeft.body.velocity.y = -400;
        }
        else if (this.paddleRight_up.isDown) {
            this._paddleRight.body.velocity.y = -400;
        }
        else if (this.paddleLeft_down.isDown) {
            this._paddleLeft.body.velocity.y = 400;
        }
        else if (this.paddleRight_down.isDown) {
            this._paddleRight.body.velocity.y = 400;
        }
        else {
            this._paddleLeft.body.velocity.setTo(0, 0);
            this._paddleRight.body.velocity.setTo(0, 0);
        }
    }

    public render(): void {
        this.game.debug.font = '9px Courier';
        this.game.debug.spriteInfo(this._paddleLeft, 16, 16);
        this.game.debug.spriteInfo(this.Ball, 230, 16);
    }

    private drawBall(x?: number, y?: number, r?: number): Phaser.Sprite {
        let ballGraphic = this.game.add.graphics(0, 0);
        let ballSprite: Phaser.Sprite = null;

        ballGraphic.lineStyle(2, 0xFFFFFF, 1);
        ballGraphic.beginFill(0xFFFFFF);
        ballGraphic.drawCircle(this.game.world.centerX, this.game.world.centerY, r | 8);

        ballSprite = this.game.add.sprite(x | this.game.world.centerX, y | this.game.world.centerY, ballGraphic.generateTexture());
        ballSprite.anchor.set(0.5);

        ballGraphic.destroy();

        return ballSprite;
    }
    private drawPaddle(x: number, y: number, width: number, height: number): Phaser.Sprite {
        let paddleGraphic = this.game.add.graphics(0, 0);
        let paddleSprite: Phaser.Sprite = null;

        paddleGraphic.lineStyle(2, 0xFFFFFF, 1);
        paddleGraphic.beginFill(0xFFFFFF);
        paddleGraphic.drawRect(50, 250, width, height);

        paddleSprite = this.game.add.sprite(x, y, paddleGraphic.generateTexture());
        paddleSprite.anchor.set(0.5);

        paddleGraphic.destroy();

        return paddleSprite;
    }

    private initKeyboard(): void {
        this.paddleLeft_up = this.game.input.keyboard.addKey(Phaser.Keyboard.W);
        this.paddleLeft_down = this.game.input.keyboard.addKey(Phaser.Keyboard.S);

        this.paddleRight_up = this.game.input.keyboard.addKey(Phaser.Keyboard.UP);
        this.paddleRight_down = this.game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
    }
}
