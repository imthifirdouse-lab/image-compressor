const upload = document.getElementById('upload');
const qualitySlider = document.getElementById('quality');
const qualityVal = document.getElementById('val');
const downloadBtn = document.getElementById('downloadBtn');
const formatSelect = document.getElementById('formatSelect');

const originalImg = document.getElementById('originalPreview');
const compressedImg = document.getElementById('compressedPreview');
const originalSizeLabel = document.getElementById('originalSize');
const compressedSizeLabel = document.getElementById('compressedSize');

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let activeImage = null;
let fileName = "image.jpg";

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

    const format = formatSelect.value;
    const quality = qualitySlider.value / 100;
    
    // Preview: <img> tags cannot render raw PDF data, so we show JPG/PNG preview
    const previewMime = (format === 'application/pdf') ? 'image/jpeg' : format;
    const dataUrl = canvas.toDataURL(previewMime, quality);
    
    compressedImg.src = dataUrl;

    // Estimate file size
    const stringLength = dataUrl.split(',')[1].length;
    let sizeInBytes = Math.floor(stringLength * (3 / 4));
    
    // Add estimated 15% overhead for PDF container metadata
    if (format === 'application/pdf') sizeInBytes *= 1.15;

    compressedSizeLabel.innerText = "Result: " + formatSize(sizeInBytes);
}

qualitySlider.oninput = () => {
    qualityVal.innerText = qualitySlider.value;
    updatePreview();
};

formatSelect.onchange = updatePreview;

downloadBtn.onclick = () => {
    if (!activeImage) return alert("Please upload an image first!");
    
    const format = formatSelect.value;
    const quality = qualitySlider.value / 100;
    const baseName = fileName.split('.')[0];

    if (format === 'application/pdf') {
        // Validation check for library
        if (!window.jspdf) {
            alert("Error: jsPDF library failed to load. Please check your internet connection.");
            return;
        }
        
        const { jsPDF } = window.jspdf;
        const orientation = activeImage.width > activeImage.height ? 'l' : 'p';
        const pdf = new jsPDF(orientation, 'px', [activeImage.width, activeImage.height]);
        
        // We use JPEG inside the PDF to respect the quality slider
        const imgData = canvas.toDataURL('image/jpeg', quality);
        pdf.addImage(imgData, 'JPEG', 0, 0, activeImage.width, activeImage.height);
        pdf.save(`${baseName}.pdf`);
    } else {
        const link = document.createElement('a');
        link.href = canvas.toDataURL(format, quality);
        const extension = (format === 'image/png') ? '.png' : '.jpg';
        link.download = `result_${baseName}${extension}`;
        link.click();
    }
};