let filters = document.querySelectorAll('ul li input'),
contrast = document.getElementById('contrast'),
brightness = document.getElementById('brightness'),
saturate = document.getElementById('saturate'),

    //buttons
    upload = document.getElementById('upload'),
    download = document.getElementById('download'),
    reset = document.querySelector('span'),
    img = document.getElementById('img'),
    imgBox = document.querySelector('.img-box'),


    //Canvas
    canvas = document.getElementById('canvas'),
    ctx = canvas.getContext('2d');

window.onload = () => {
    download.style.display = 'none';
    reset.style.display = 'none';
};

upload.addEventListener('change', uploadImg);
reset.addEventListener('click', resetValue);
download.addEventListener('click', downloadImg);

function uploadImg() {
    resetValue();
    download.style.display = 'block';
    reset.style.display = 'block';
    const reader = new FileReader();
    reader.addEventListener('load', () => {
        const upload_Image = reader.result;
        img.src = upload_Image;
    });

    reader.readAsDataURL(this.files[0]);

    //Replace img with canvas
    img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        img.style.display = 'none';
    };

}

function resetValue() {
    ctx.filter = 'none';
    contrast.value = '100';
    brightness.value = '100';
    saturate.value = '100';
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
}

function downloadImg() {
    download.href = canvas.toDataURL();
}

filters.forEach((filter) => {
    filter.addEventListener('input', () => {
        ctx.filter = `
        contrast(${contrast.value}%)
        brightness(${brightness.value}%)
        saturate(${saturate.value}%)
    `;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    });
});
