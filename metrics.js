// calculate the metrices

var ffmpeg = require("fluent-ffmpeg");

const errorHandler = (err, stdout, stderr) => {
    console.log("Error: " + err.message);
    console.log("ffmpeg output:\n" + stdout);
    console.log("ffmpeg stderr:\n" + stderr);
}
// ----------------------------------------------------------------------------

// calculate PSNR
// ffmpeg -threads 6 -progress", "pipe:1" -i 1.mov -i output.mp4 -filter_complex "psnr" -f null -
function calc_metric_PSNR(original_video, encoded_video) {

    var psnr = ffmpeg({ logger: "debug", stdoutLines: 0 })
        .addOption("-f", "null")
        .addOption("-threads", "6")
        .addOption("-progress", "pipe:1")
        .input(original_video)
        .input(encoded_video)
        .on("start", function (commandLine) {
            // console.log("ffmpeg command:\n " + commandLine)
        })
        .on("progress", function (progress) {
            console.log("Calculating PSNR: " + progress.percent + "% done");
        })
        .on("end", function(err, stdout) {
			// write output
            console.log("PSNR calculation finished");
            PSNR_output = stdout.split("Parsed_psnr")[1].split(']')[1].trim();
            console.log("Results:");
            console.log(PSNR_output);

            PSNR_output = PSNR_output.split(' ');
            PSNR_av = PSNR_output[4].split(':')[1];
            PSNR_y = PSNR_output[1].split(':')[1];
            PSNR_u = PSNR_output[2].split(':')[1];
            PSNR_v = PSNR_output[3].split(':')[1];
            PSNR_min = PSNR_output[5].split(':')[1];
            PSNR_max = PSNR_output[6].split(':')[1];
            console.log("   PSNR Average: " + PSNR_av);
            console.log("   PSNR Y: " + PSNR_y);
            console.log("   PSNR U: " + PSNR_u);
            console.log("   PSNR V: " + PSNR_v);
            console.log("   PSNR Min: " + PSNR_min);
            console.log("   PSNR Max: " + PSNR_max);
        })
        .on("error", errorHandler)
        .outputOptions("-filter_complex psnr")
        .output("nowhere")

    psnr.run()
}
// ----------------------------------------------------------------------------

// calculate SSIM
// ffmpeg -threads 6 -progress", "pipe:1" -i 1.mov -i output.mp4 -filter_complex "ssim" -f null -
function calc_metric_SSIM(original_video, encoded_video) {

    var ssim = ffmpeg({ logger: "debug", stdoutLines: 0 })
        .addOption("-f", "null")
        .addOption("-threads", "6")
        .addOption("-progress", "pipe:1")
        .input(original_video)
        .input(encoded_video)
        .on("start", function (commandLine) {
            // console.log("ffmpeg command:\n " + commandLine)
        })
        .on("progress", function (progress) {
            console.log("Calculating SSIM: " + progress.percent + "% done");
        })
        .on("end", function(err, stdout) {
			// write output
            console.log("SSIM calculation finished");
            SSIM_output = stdout.split("Parsed_ssim")[1].split(']')[1].trim();
            console.log("Results:");
            SSIM_output = SSIM_output.split(' ');
            SSIM_all = SSIM_output[7].split(':')[1] + " " + SSIM_output[8];
            SSIM_y = SSIM_output[1].split(':')[1] + " " + SSIM_output[2];
            SSIM_u = SSIM_output[3].split(':')[1] + " " + SSIM_output[4];
            SSIM_v = SSIM_output[5].split(':')[1] + " " + SSIM_output[6];
			
            console.log("   SSIM All: " + SSIM_all);
            console.log("   SSIM Y: " + SSIM_y);
            console.log("   SSIM U: " + SSIM_u);
            console.log("   SSIM V: " + SSIM_v);
        })
        .on("error", errorHandler)
        .outputOptions("-filter_complex ssim")
        .output("nowhere")

    ssim.run()
}
// ----------------------------------------------------------------------------

// calculate VMAF
// ffmpeg -threads 6 -progress", "pipe:1" -i 1.mov -i output.mp4 -lavfi libvmaf -f null -
function calc_metric_VMAF(original_video, encoded_video) {

    var vmaf = ffmpeg({ logger: "debug", stdoutLines: 0 })
        .addOption("-f", "null")
        .addOption("-threads", "6")
        .addOption("-progress", "pipe:1")
        .input(original_video)
        .input(encoded_video)
        .on("start", function (commandLine) {
            console.log("ffmpeg command:\n " + commandLine)
        })
            .on("progress", function (progress) {
            console.log("Calculating VMAF: " + progress.percent + "% done");
        })
        .on("end", function(err, stdout) {
			// write output
            console.log("VMAF calculation finished");
            VMAF_output = stdout.split("[libvmaf")[1].split(']')[1].trim();
			
            console.log("Results:");
            console.log(VMAF_output);
        })
        .on("error", errorHandler)
        .outputOptions("-lavfi libvmaf")
        .output("nowhere")

    vmaf.run()
}
// ----------------------------------------------------------------------------

module.exports = { calc_metric_PSNR, calc_metric_SSIM, calc_metric_VMAF };