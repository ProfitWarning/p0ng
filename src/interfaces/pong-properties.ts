export interface PongGameProperties {
    debug: boolean;
    paddleSpeed: number;
    paddleSegmentsMax: number;
    paddleSegmentHeight: number;
    paddleSegmentAngle: number;

    ballVelocity: number;
    ballVelocityIncrease: number;
    ballVelocityMaxValue: number;

    winningScore: number;
}