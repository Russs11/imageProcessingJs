let canvas = document.getElementById('canvas');
let context = canvas.getContext('2d');
let image = new Image();
let scale = 0.2
image.src = "./img/photo.jpg";

image.onload = () => {
    context.drawImage(image, 0, 0, 450, 450)
}





//contrast
function contrast(pixels, amount) {
    let d = pixels.data;
    amount = (amount / 100) + 1;  //convert to decimal & shift range: [0..2]
    let intercept = 128 * (1 - amount);
    for (let i = 0; i < d.length; i += 4) {   //r,g,b,a
        d[i] = d[i] * amount + intercept;
        d[i + 1] = d[i + 1] * amount + intercept;
        d[i + 2] = d[i + 2] * amount + intercept;
    }
    return pixels;
}



function conv_2d(pixels, weights, opaque) {
    let side = Math.round(Math.sqrt(weights.length));
    let halfSide = Math.floor(side / 2);
    let src = pixels.data;
    let sw = pixels.width;
    let sh = pixels.height;
    // pad output by the convolution matrix
    let w = sw;
    let h = sh;
    let output = context.createImageData(w, h);
    let dst = output.data;
    // go through the destination image pixels
    let alphaFac = opaque ? 1 : 0;
    for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
            let sy = y;
            let sx = x;
            let dstOff = (y * w + x) * 4;
            // calculate the weighed sum of the source image pixels that
            // fall under the convolution matrix
            let r = 0, g = 0, b = 0, a = 0;
            for (let cy = 0; cy < side; cy++) {
                for (let cx = 0; cx < side; cx++) {
                    let scy = sy + cy - halfSide;
                    let scx = sx + cx - halfSide;
                    if (scy >= 0 && scy < sh && scx >= 0 && scx < sw) {
                        let srcOff = (scy * sw + scx) * 4;
                        let wt = weights[cy * side + cx];
                        r += src[srcOff] * wt;
                        g += src[srcOff + 1] * wt;
                        b += src[srcOff + 2] * wt;
                        a += src[srcOff + 3] * wt;
                    }
                }
            }
            dst[dstOff] = r;
            dst[dstOff + 1] = g;
            dst[dstOff + 2] = b;
            dst[dstOff + 3] = a + alphaFac * (255 - a);
        }
    }
    return output;
}


function imageProcess() {
    let bw = document.getElementById('bw').value;

    let image = new Image();
    let scale = 0.2
    image.src = "./img/photo.jpg";

    image.onload = () => {
        context.drawImage(image, 0, 0, 450, 450)
        context.putImageData(greyScale(context.getImageData(0, 0, 450, 450), bw), 0, 0)

    }
}

function processConv() {
    let contrast = document.getElementById('filter').value;
    let contrastLabel = document.getElementById("filter-title")
    contrastLabel.innerHTML = filterlist[contrast].label + ":";
    let image = new Image();
    let scale = 0.2
    image.src = "./img/photo.jpg";

    image.onload = () => {
        context.drawImage(image, 0, 0, 450, 450)
        context.putImageData(conv_2d(context.getImageData(0, 0, 450, 450), filterlist[contrast].value, 1), 0, 0)

    }
}

function processContrast() {
    let contra = document.getElementById('contrast').value;

    let image = new Image();
    let scale = 0.2
    image.src = "./img/photo.jpg";

    image.onload = () => {
        context.drawImage(image, 0, 0, 450, 450)
        context.putImageData(contrast(context.getImageData(0, 0, 450, 450), contra), 0, 0)

    }
}