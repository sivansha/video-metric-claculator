# Video Quality Metric Calculator
### PSNR / SSIM / VAMF

Node.js based tool for calculating video qulity metrics.<br>
Intendent to be a part of adaptive streaming system.<br>
based on FFMPEG and fluent.

requirements:
- ffmpeg 4.1 with libvmaf library enabled
- NodeJS v8 with the libraries: fluent-mmfpeg, minimist

usage:
node vmc.js [-m psnr, -m ssim, -m vamf] -i inpot video 1 -i video input 2