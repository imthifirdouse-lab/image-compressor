// New UI References (Add these to your HTML)
const formatSelect = document.getElementById('formatSelect'); // <select> with options 'image/jpeg', 'image/png', 'application/pdf'

// Update the updatePreview function to handle logic branching
function updatePreview() {
    if (!activeImage) return;

    canvas.width = activeImage.width;
    canvas.height = activeImage.height;
    ctx.drawImage(activeImage, 0, 0);

    const format = formatSelect.value;
    const quality = qualitySlider.value / 100;
    
    let displayUrl;

    if (format === 'application/pdf') {
        // PDF cannot be displayed directly in an <img> tag src easily
        // We show the original or a placeholder, but calculate size based on a JPEG-compressed PDF
        displayUrl = canvas.toDataURL('image/jpeg', quality);
    } else {
        // PNG ignores the quality parameter in toDataURL
        displayUrl = canvas.toDataURL(format, quality);
    }

    compressedImg.src = displayUrl;

    // Calculate approximate size
    const stringLength = displayUrl.split(',')[1].length;
    const sizeInBytes = Math.floor(stringLength * (3/4));
    
    // Note: PDF overhead usually adds ~10-15% to the raw image size
    const estimatedSize = format === 'application/pdf' ? sizeInBytes * 1.1 : sizeInBytes;
    compressedSizeLabel.innerText = "Output: " + formatSize(estimatedSize);
}

// Revised Download Handler
downloadBtn.onclick = () => {
    if (!activeImage) return alert("Please upload an image!");
    
    const format = formatSelect.value;
    const quality = qualitySlider.value / 100;

    if (format === 'application/pdf') {
        // Requirements: <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
        const { jsPDF } = window.jspdf;
        const orientation = activeImage.width > activeImage.height ? 'l' : 'p';
        const pdf = new jsPDF(orientation, 'px', [activeImage.width, activeImage.height]);
        
        const imgData = canvas.toDataURL('image/jpeg', quality);
        pdf.addImage(imgData, 'JPEG', 0, 0, activeImage.width, activeImage.height);
        pdf.save(fileName.split('.')[0] + ".pdf");
    } else {
        const link = document.createElement('a');
        link.href = canvas.toDataURL(format, quality);
        const ext = format === 'image/png' ? '.png' : '.jpg';
        link.download = `converted_${fileName.split('.')[0]}${ext}`;
        link.click();
    }
};

// Listener for format change
formatSelect.onchange = updatePreview;
