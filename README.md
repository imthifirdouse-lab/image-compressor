# 🖼️ Quick Image Compressor

A lightweight, privacy-focused web application that allows users to compress images directly in their browser. By utilizing the HTML5 Canvas API, this tool ensures that your images never leave your local machine, providing maximum security and speed.



## 🚀 Live Demo
You can access the live version of this tool here:
**[INSERT YOUR GITHUB PAGES URL HERE]**

## ✨ Features
- **Real-Time Compression:** Adjust quality and see results instantly.
- **Side-by-Side Comparison:** View the original vs. compressed image to spot quality loss.
- **Dynamic File-Size Tracking:** Automatically calculates and displays the new file size in KB/MB.
- **Zero Server Uploads:** 100% client-side processing for total privacy.
- **Responsive Design:** Works on desktops, tablets, and smartphones.

## 🛠️ How It Works
1. **Upload:** User selects an image through the `FileReader` API.
2. **Process:** The image is drawn onto an off-screen `<canvas>`.
3. **Compress:** The `toDataURL('image/jpeg', quality)` method is used to re-encode the image at a specific quality level.
4. **Calculate:** The tool estimates the final file size based on the Base64 string length before the user downloads.

## 📂 Project Structure
- `index.html`: The semantic structure and UI layout.
- `style.css`: Modern styling using Flexbox and responsive design.
- `script.js`: The core logic for image processing and size calculation.

## 📝 License
Distributed under the MIT License. See `LICENSE` for more information.

---
Built with ❤️ by [Your Name]