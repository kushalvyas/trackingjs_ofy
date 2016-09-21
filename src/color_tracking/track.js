/**
 * Created by kushal on 14/9/16.
 *
 * This is an example tracking code
 * Please look at src/camera/watch_video.js to understand details about permissions, etc.
 *
 *
 */


var video_frame;
var canvas;
var imcanvas;
var start_tracking, stop_tracking;

video_frame = document.getElementById("myVideo");
canvas = document.getElementById("canvas");
imcanvas = canvas.getContext("2d");
start_tracking = document.getElementById("start");
stop_tracking = document.getElementById("stop");
start_tracking.addEventListener("click", startTracking);
stop_tracking.addEventListener("click", stopTracking);

navigator.getUserMedia = (
                            //        check for all available media
                            //    chrome
                        navigator.getUserMedia ||
                        navigator.webkitGetUserMedia ||
                        navigator.mozGetUserMedia ||
                        navigator.msGetUserMedia );
if(navigator.getUserMedia){
    //log ... print in the JS console in browser
    console.log("Browser supports media api");
    //specify what type of media if required.
    /*
     navigator.getUserMedia({
     params include :
     -> video
     -> audio
     })

     */
    navigator.getUserMedia({
        video : true
        //   audio : true, //if microphone access was required
    }, success_stream, error_stream);




}else{
    alert("The browser does not support Media Interface");
}


// start tracking
tracking.ColorTracker.registerColor('col1', function(r, g, b){
    var r_low = 140, r_high = 200, g_low = 20, g_high = 80, b_low = 10, b_high = 100;
    if(r > r_low && r < r_high && g > g_low && g < g_high && b > b_low && b < b_high){
        return true;
    }
    return false;
});
var myTracker = new tracking.ColorTracker(['col1','yellow']);


myTracker.on("track", color_tracking_handler);
var mt = tracking.track('#myVideo', myTracker);


function success_stream(stream){
    video_frame.src = window.URL.createObjectURL(stream);

}

function error_stream(err){
    console.log("Error : " + err);
}


function startTracking() {
    mt.run();
}

function stopTracking() {
    mt.stop();
}

function color_tracking_handler(e){
    if(e.data.length === 0){
        console.log("No trackable sutff");
    }else{
        imcanvas.drawImage(video_frame, 0, 0, canvas.width, canvas.height);
        e.data.forEach(drawBoundingBox);
    }
}


function drawBoundingBox(rect){
    console.log(rect.x +" " + rect.y);

    imcanvas.beginPath();
    imcanvas.lineWidth = "2";
    imcanvas.strokeStyle = 'red';
    imcanvas.rect(rect.x, rect.y, rect.width, rect.height);
    imcanvas.stroke();
    // video_frame.src = imcanvas;
}

