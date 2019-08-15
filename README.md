###############################################################################
#                                                                             #
#                       Video Quality Metric Calculator                       #
#                                                                             #
#						PSNR / SSIM / VAMF                            #
#																			  #
###############################################################################

This tool calculates PSNR/SSIM/VAMF for 2 given inputs video.

requirements:
ffmpeg 4.1 with libvmaf library enabled
NodeJS v8 with the libraries: fluent-mmfpeg, minimist

usage:
node vmc.js [-m psnr, -m ssim, -m vamf] -i inpot video 1 -i video input 2