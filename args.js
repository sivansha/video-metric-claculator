// get the command line arguments

var fs = require("fs");

// check if variable is a string
function isString (aVar){
    return ((typeof aVar === 'string') || (aVar instanceof String));
}
// ----------------------------------------------------------------------------

// check if file exists
function isFileAccesible(aFile) {
    return fs.existsSync(aFile) ? true : false;
}
// ----------------------------------------------------------------------------

// usage message
function usage_msg(usage_issue) {
    console.log("Video Quality Metric Calculator\nSupported Metrics: PSNR, SSIM, VMAF\nUsage: [-m psnr, -m ssim, -m vmaf] -i original_video -i encoded_video\n\nUsage Error: "+ usage_issue +"\nExiting...");
    process.exit();
}
// ----------------------------------------------------------------------------

function get_commandline_args(args, cmdline_args) {

    // the parameters 'm' and 'i' has to exist, 'm' can't be a boolean 
    // (-> happen when only "-m" is provided without a string after it)
    // 'i' may contains signle video file as input
    if(cmdline_args['m'] && cmdline_args['i'] && typeof(cmdline_args['m']) !== "boolean" && typeof(cmdline_args['i']) !== "boolean") {
        // if metric is string, check that it is supported
        if(isString(cmdline_args['m']) && !cmdline_args['m'] === "psnr" && !cmdline_args['m'] === "ssim" && !cmdline_args['m'] === "vmaf") {
            usage_msg("unsupported metric: option \"-m (" + cmdline_args['m'] +")\" unsupported");
        }
        // if metric is array, check that at least one option is supported
        args.calc_psnr = (cmdline_args['m'] === "psnr") || (cmdline_args['m'].indexOf("psnr") > -1);
        args.calc_ssim = (cmdline_args['m'] === "ssim") || (cmdline_args['m'].indexOf("ssim") > -1);
        args.calc_vmaf = (cmdline_args['m'] === "vmaf") || (cmdline_args['m'].indexOf("vmaf") > -1);

        if(!args.calc_psnr && !args.calc_ssim && !args.calc_vmaf) { 
            var msg = cmdline_args['m'].toString();
            usage_msg("unsupported metric: option \"-m (" + msg +")\" unsupported");
        }

        // if only 1 video file
        if (isString(cmdline_args['i'])) {
            args.original_video = cmdline_args['i'];
            args.encoded_video = cmdline_args['i'];
        }
        // if array of videos
        else {
            if (cmdline_args['i'].length !== 2) {
                usage_msg("length of video files array > 2  (\'-i\' takes up to 2 arguments)");
            }
            else {
                args.original_video = cmdline_args['i'][0];
                args.encoded_video = cmdline_args['i'][1];
            }
        }
		// check that video files exists
        const is_org_acc = isFileAccesible(args.original_video) ? true : false;
        const is_enc_acc = isFileAccesible(args.encoded_video) ? true : false;
        if(!is_org_acc || !is_enc_acc) {
            var file_unaccesable_msg = is_org_acc ? '' : args.original_video;
            if(!is_enc_acc) {
                file_unaccesable_msg = is_org_acc? args.encoded_video : args.original_video + ", " + args.encoded_video;
            }
            usage_msg("\"" + file_unaccesable_msg + "\" not accessible");
        }
    }
    else {
        usage_msg("missing argument"); 
    }
}
// ----------------------------------------------------------------------------

module.exports = { get_commandline_args };