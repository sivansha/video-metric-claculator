// video quality metrices calculator
// input: 2 video files, required metrices
// output: PSNR / SSIM / VMAF

// requirements:
// ffmpeg 4.1 with libvmaf library enabled
// NodeJS v8 with libraries: fluent-mmfpeg, minimist

function Args()
{
    this.calc_psnr = false;
    this.calc_ssim = false;
    this.calc_vmaf = false;
    this.original_video = "";
    this.encoded_video = "";
}
// ----------------------------------------------------------------------------

// input message
function input_msg(args) {
    console.log("\nVideo Quality Metric Calculator Input:");
    console.log("PSNR: " + args.calc_psnr + "\nSSIM: " + args.calc_ssim + "\nVMAF: " + args.calc_vmaf + "\nOriginal Video: " + args.original_video + "\nEncoded Video: " + args.encoded_video + "\n");
}
// ----------------------------------------------------------------------------

// start message
function start_msg(args) {
    console.log("\nVideo Quality Metric Calculator");
    console.log("Calculating:");
    if(args.calc_psnr) {
        console.log("   PSNR");
    }
    if(args.calc_ssim) {
        console.log("   SSIM");
    }
    if(args.calc_vmaf) {
        console.log("   VMAF");
    }
    console.log("Original video file: \n   " + args.original_video);
    console.log("Encoded video file: \n   " + args.encoded_video);
}
// ----------------------------------------------------------------------------

async function run(args) {

    // get command line arguments and input sanitation
    var args = new Args();

    const cmdline_args = require("minimist")(process.argv.slice(2).map(f=>{ return f; }));
    const getArgs = require("./args.js");
    getArgs.get_commandline_args(args, cmdline_args);

    input_msg(args);

    // check videos dimensions
    const video_dimensions = require("./adjust_dimensions.js");
    args = await video_dimensions.check_video_Dimensions(args);

    start_msg(args);

    // calculates metrics and print results
    const calculate_metrics = require("./metrics.js");

    if(args.calc_psnr) {
        calculate_metrics.calc_metric_PSNR(args.original_video, args.encoded_video);
    }
    if(args.calc_ssim) {
        calculate_metrics.calc_metric_SSIM(args.original_video, args.encoded_video);
    }
    if(args.calc_vmaf) {
        calculate_metrics.calc_metric_VMAF(args.original_video, args.encoded_video);
    }
}
// ----------------------------------------------------------------------------

run();