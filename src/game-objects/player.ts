import { Paddle } from './paddle';
export default class Player {
    game: Phaser.Game;
    paddle: Paddle;

    constructor(game: Phaser.Game, paddle: Paddle) {
        this.game = game;
        this.paddle = paddle;
    }
}