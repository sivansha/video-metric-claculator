// adjust video Dimensions:
// if diemensions original video = encoded video - keep originals
// if diemensions original video > encoded video - upscale encoded video
// (if diemensions original video < encoded video - ?)

var ffmpeg = require("fluent-ffmpeg");


const errorHandler = (err, stdout, stderr) => {
    console.log("Error: " + err.message);
    console.log("ffmpeg output:\n" + stdout);
    console.log("ffmpeg stderr:\n" + stderr);
}
// ----------------------------------------------------------------------------

// async function: in order for the program to wait for the function to complete the dimensions adjustment
async function check_video_Dimensions(args) {
	// the async mechanism achieved by using a promise
    return new Promise(function(resolve, reject) {

        console.log("\nChecking input video files Dimensions\nOriginal video Dimensions must be bigger or equal to Encoded video Dimensions\nIn case Original video Dimensions < Encoded video Dimensions:\n   Program will exit\nIn case Original video Dimensions > Encoded video Dimensions:\n   Encoded video will be scaled up in raw format");

        ffmpeg(args.original_video) 
            .ffprobe(0, function(err, data) {
                var original_video_height = data.streams[0]["height"];
                var original_video_width = data.streams[0]["width"];
                ffmpeg(args.encoded_video)
                
                .ffprobe(0, function(err, data) {
                    var encoded_video_height = data.streams[0]["height"];
                    var encoded_video_width = data.streams[0]["width"];
					
                    // if both video files has same Dimensions, return and use them for calculating the metrices
                    if(original_video_height === encoded_video_height && original_video_width === encoded_video_width)
                    {
                        console.log("\nOriginal video Dimensions: " + original_video_width + "x" + original_video_height);
                        console.log("Encoded video Dimensions: " + encoded_video_width + "x" + encoded_video_height);
                        console.log("Original video Dimensions == Encoded video Dimensions\nContinue...");
                        resolve(args);
                    }
					// encoded video is bigger - not supported
                    else if (original_video_height < encoded_video_height || original_video_width < encoded_video_width)
                    {
                        console.log("\nOriginal video Dimensions: " + original_video_width + "x" + original_video_height);
                        console.log("Encoded video Dimensions: " + encoded_video_width + "x" + encoded_video_height);
                        console.log("Original video Dimensions < Encoded video Dimensions\nExiting...");
                        process.exit();
                    }
					// if original video is bigger - scale encoded video
                    else
                    {
                        console.log("\nOriginal video Dimensions: " + original_video_width + "x" + original_video_height);
                        console.log("Encoded video Dimensions: " + encoded_video_width + "x" + encoded_video_height);
                        console.log("Original video Dimensions > Encoded video Dimensions\n\nScaling Encoded Video:");

                        var new_encoded_video = args.encoded_video.split('.').slice(0, -1).join('.') + ".y4m";
						// scaling encoded video
                        var scale = ffmpeg({ logger: "debug", stdoutLines: 0 })
                            .addOption("-pix_fmt", "yuv420p")
                            .addOption("-vsync", "0")
                            .addOption("-s", original_video_width + "x" + original_video_height)
                            .addOption("-sws_flags", "lanczos")
                            .addOption("-progress", "pipe:1")
                            .input(args.encoded_video)
                            .on("start", function (commandLine) {
                                // console.log("ffmpeg command:\n " + commandLine)
                            })
                            .on("progress", function (progress) {
                                console.log("Scaling: " + progress.percent + "% done");
                            })
                            .on("end", function(err, stdout) {
                                console.log("\nScaling Encoded Video finished successfully\nnew Encoded Video Name: " + new_encoded_video)
                                args.encoded_video = new_encoded_video;
                                resolve(args);
                            })
                            .on("error", errorHandler)
                            .output(new_encoded_video)
                    
                            scale.run()
                    }
                });
            });
        })
}
// ----------------------------------------------------------------------------

module.exports = { check_video_Dimensions };