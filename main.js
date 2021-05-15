import { setupCanvas, drawLoop, ctx, width, height } from "./lib.js";

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
let p1 = 0.5;
let f1 = 0;
let f2 = 0;
let p2 = 0.5;
let v1 = 0;
let v2 = 0;
let bx;
let by;
let ball_style = "white"
let bvx;
let bvy;
let game_over = false;
function main() {
    let canvas = $("#main");
    if (canvas === null) {
        console.error("Unable to find the canvas element with id main");
    }
    setupCanvas(canvas);
    drawLoop(draw)
    spawn_ball()
}
function spawn_ball() {
    bx = width / 2.;
    by = height / 2.;
    let theta = Math.random() * Math.PI * 2;
    bvx = (4 * Math.random() + 2) * ((Math.random() < 0.5) ? - 1 : 1);
    bvy = 2 * Math.random();
    ball_style = "white"
    game_over = false;
}

const PADDLE_WIDTH = 20;
const PADDLE_HEIGHT = 100;
function draw(t) {
    // clear the canvas
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, width, height)
    ctx.beginPath();

    // draw the paddles
    ctx.fillStyle = "red";
    ctx.fillRect(50, p1 * height - PADDLE_HEIGHT / 2, PADDLE_WIDTH, PADDLE_HEIGHT);
    ctx.fillStyle = "blue";
    ctx.fillRect(width - 50 - PADDLE_WIDTH, p2 * height - PADDLE_HEIGHT / 2, PADDLE_WIDTH, PADDLE_HEIGHT);

    // draw the ball
    ctx.fillStyle = ball_style;
    ctx.ellipse(bx, by, 20, 20, 0, 0, Math.PI * 2.);
    ctx.fill();

    // physics
    p1 += v1;
    p2 += v2;
    v1 *= 0.95;
    v1 += FORCE * f1;
    v2 *= 0.95;
    v2 += FORCE * f2;
    if (p1 > 1.0 || p1 < 0.0) {
        v1 = 0;
    }
    if (p2 > 1.0 || p2 < 0.0) {
        v2 = 0;
    }

    p1 = Math.min(Math.max(0, p1), 1);
    p2 = Math.min(Math.max(0, p2), 1);

    // ball physics
    bx += bvx;
    by += bvy;
    if (bx < 0 && !game_over) {
        bvy = 0;
        bvx = 0;
        ball_style = "blue"
        let even = 0;
        let inv = setInterval(() => {
            ball_style = (even % 2) ? "blue" : "white";
            even++;
        }, 100)
        setTimeout(() => {
            spawn_ball(); clearInterval(inv); $("#score2").innerHTML = parseInt($("#score2").innerHTML) + 1;
        }, 1000)
        game_over = true;
    }
    if (bx > width && !game_over) {
        bvy = 0;
        bvx = 0;
        ball_style = "red"
        let even = 0;
        let inv = setInterval(() => {
            ball_style = (even % 2) ? "red" : "white";
            even++;
        }, 100)
        setTimeout(() => {
            spawn_ball(); clearInterval(inv); $("#score1").innerHTML = parseInt($("#score1").innerHTML) + 1;
        }, 1000)
        game_over = true;
    }
    if (by < 0) {
        by = 0;
        bvy *= -1;
    }
    if (by > height) {
        by = height;
        bvy *= -1;
    }

    let p1x = 50;
    let p1y = p1 * height;

    if (checkOverlap(
        20, bx, by, p1x, p1y - PADDLE_HEIGHT / 2, p1x + PADDLE_WIDTH, p1y + PADDLE_HEIGHT / 2)) {
        bx = 50 + PADDLE_WIDTH + 21;
        bvx *= -1;
    }
    let p2x = width - 50 - PADDLE_WIDTH;
    let p2y = p2 * height;
    if (checkOverlap(
        20, bx, by, p2x, p2y - PADDLE_HEIGHT / 2, p2x + PADDLE_WIDTH, p2y + PADDLE_HEIGHT / 2)) {
        bx = width - 50 - PADDLE_WIDTH - 21;
        bvx *= -1;
    }
    bvx *= 1.0001;
    bvy *= 1.0001;
}
function checkOverlap(R, Xc, Yc,
    X1, Y1,
    X2, Y2) {

    // Find the nearest point on the
    // rectangle to the center of
    // the circle
    let Xn = Math.max(X1, Math.min(Xc, X2));
    let Yn = Math.max(Y1, Math.min(Yc, Y2));

    // Find the distance between the
    // nearest point and the center
    // of the circle
    // Distance between 2 points,
    // (x1, y1) & (x2, y2) in
    // 2D Euclidean space is
    // ((x1-x2)**2 + (y1-y2)**2)**0.5
    let Dx = Xn - Xc;
    let Dy = Yn - Yc;
    return (Dx * Dx + Dy * Dy) <= R * R;
}

let FORCE = 0.002;
document.addEventListener("keydown", ev => {
    switch (ev.keyCode) {
        case 83:
            f1 = 1;
            break;
        case 87:
            f1 = -1;
            break;
        case 69: case 98: case 40:
            f2 = 1;
            break;
        case 85: case 104: case 38:
            f2 = -1;
            break;
    }
})

document.addEventListener("keyup", ev => {
    switch (ev.keyCode) {
        case 83: case 87:
            f1 = 0;
            break;
        case 69: case 98: case 85: case 104: case 40: case 38:
            f2 = 0;
            break;
    }
})
main();
