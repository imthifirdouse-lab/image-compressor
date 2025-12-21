const upload = document.getElementById('upload');
const qualitySlider = document.getElementById('quality');
const qualityVal = document.getElementById('val');
const downloadBtn = document.getElementById('downloadBtn');

const originalImg = document.getElementById('originalPreview');
const compressedImg = document.getElementById('compressedPreview');
const originalSizeLabel = document.getElementById('originalSize');
const compressedSizeLabel = document.getElementById('compressedSize');

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let activeImage = null;
let fileName = "image.jpg";

// Format file size (Bytes to KB/MB)
function formatSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

upload.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    fileName = file.name;
    originalSizeLabel.innerText = "Original: " + formatSize(file.size);

    const reader = new FileReader();
    reader.onload = (event) => {
        activeImage = new Image();
        activeImage.src = event.target.result;
        activeImage.onload = () => {
            originalImg.src = activeImage.src;
            updatePreview();
        };
    };
    reader.readAsDataURL(file);
});

function updatePreview() {
    if (!activeImage) return;

    canvas.width = activeImage.width;
    canvas.height = activeImage.height;
    ctx.drawImage(activeImage, 0, 0);

    const quality = qualitySlider.value / 100;
    const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
    compressedImg.src = compressedDataUrl;

    // Calculate approximate compressed size
    const stringLength = compressedDataUrl.split(',')[1].length;
    const sizeInBytes = Math.floor(stringLength * (3 / 4));
    compressedSizeLabel.innerText = "Compressed: " + formatSize(sizeInBytes);
}

qualitySlider.oninput = () => {
    qualityVal.innerText = qualitySlider.value;
    updatePreview();
};

downloadBtn.onclick = () => {
    if (!compressedImg.src) return alert("Please upload an image!");
    const link = document.createElement('a');
    link.href = compressedImg.src;
    link.download = `compressed_${fileName}`;
    link.click();
};