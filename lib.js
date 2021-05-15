export let ctx = null;
export let width = 0;
export let height = 0;
export function setupCanvas(canvas) {
    const scale = window.devicePixelRatio;
    width = canvas.clientWidth;
    height = canvas.clientHeight;
    canvas.width = Math.floor(width * scale);
    canvas.height = Math.floor(height * scale);
    ctx = canvas.getContext("2d");
    if (ctx === null) {
        throw "Unable to get context";
    }
    ctx.scale(scale, scale);
}

export function drawLoop(draw) {
    requestAnimationFrame(
        function cb(deltaT) {
            draw(deltaT);
            requestAnimationFrame(cb);
        }
    )
}
