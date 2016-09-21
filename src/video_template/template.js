/**
 * Created by kushal on 13/9/16.
 *
 * Usage :
 * To access local system webcam on the internet/
 * Couple of points to be remembered:
 *
 *  - Accessing the webcam using HTML5 and JS requires permission from
 *  the browser. The url of the file has to be a valid one. Url such as file:/// in your browser will not permit the browser to access local webcam.
 *  - Whereas, an http or https url will surely make a paved way for it. Hence, while developing, one can use Xampp, Wamp or the LAMP Stack.
 *  - Secondly, every browser has it's own Media API. Using the browser's media api. The MediaDevices interface will provide access to connected media input devides such as microphones, camera, etc. This interface (MediaDevices) will enable a developer to access the local webcam. The method being MediaDevices.getUserMedia();
 *
 *
 *  The ability of web applications to handle media in such seamless manner has been possible due to Media API.What we require is the Navigator.MediaDevices() method. This returns a mediadevices object which provides accerss to connected media.
 *
 *  - Apparently, not all browsers follow the same interface class designs. Hence, to make a model that is cross - browser compatible, we much check for all avaible interfacing methods with which the webcam can be accesssed.
 *      Hence,
 *              navigator.getUserMedia = (
 *            //        check for all available media
 *            //    chrome
 *            navigator.getUserMedia ||
 *            navigator.webkitGetUserMedia ||
 *            navigator.mozGetUserMedia ||
 *            navigator.msGetUserMedia );
 *
 *      This will return an object that is browser specific for media device interchange.
 *
 *
 *
 */

var video_frame;
var canvas ;
var imcanvas;
var regioncanvas, imregioncanvas;
var cd_region;
var color_tracker;

function watch_video(){


    /*
     Initialize all selectors.
     Get access of required element
     setup event triggers.
     */
    //select the elements relevant to video and capture
    video_frame = document.getElementById("myVideo");
    canvas = document.getElementById("canvas");
    regioncanvas = document.getElementById("regioncanvas");
    imregioncanvas = regioncanvas.getContext("2d");
    imcanvas = canvas.getContext("2d");
    /*

     This part of javascript code will capture frames from
     the webcam and display on webpage.
     */

//    obtain access to browser local system connected media ..

    navigator.getUserMedia = (
                                navigator.getUserMedia ||
                                navigator.webkitGetUserMedia ||
                                navigator.mozGetUserMedia ||
                                navigator.msGetUserMedia );

    //this will set a read-only boolean property to the
//            obtained list of media devices

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
            video : true,
            //   audio : true, //if microphone access was required
        }, success_stream, error_stream);

    }else{
        alert("The browser does not support Media Interface");
    }
    // wionload = function(){
    var tmp = document.getElementById("im");
    regioncanvas.getContext("2d").drawImage(tmp, 0, 0);

    var tmp_data = imregioncanvas.getImageData(0, 0, 480, 320);
    cd_region = getCD(tmp_data.data, 480, 320);
    console.log("corners and descriptors are :" + cd_region);
    // }

    tracking.ColorTracker.registerColor('mycustom', function(r,g,b){
        return true;
    });
    color_tracker = new tracking.ColorTracker(['mycustom']);
    color_tracker.on("track", process_video);
    tracking.track("#myVideo", color_tracker);


}

function success_stream(stream){
    //This is a callback. Please refer to javascripts callbacks for futher information
    console.log("Streaming successful");
//    once we have the webcam stream, we shall display it in the
//    html video element created
    video_frame.src = window.URL.createObjectURL(stream);

}

function error_stream(error){
    console.log("error has occured" + error);
}


function process_video(data){
    imcanvas.drawImage(video_frame, 0, 0);
    var im_frame = imcanvas.getImageData(0, 0, 480, 320);
    // console.log(im_frame);
    var cd_frame = getCD(im_frame.data, 480, 320);
    // console.log(cd_frame);
    var matches = getNearestMatch(cd_frame, cd_region);
    plot_matches(matches);
}

function getCD(im, w, h){
    var blur_im = tracking.Image.blur(im, w, h, 3);
    var gray_im = tracking.Image.grayscale(blur_im, w, h);
    var corners = tracking.Fast.findCorners(gray_im, w, h);
    var desc = tracking.Brief.getDescriptors(gray_im, w, corners);
    return [corners, desc];

}


function getNearestMatch(cd1, cd2){
    var matches = tracking.Brief.reciprocalMatch(cd1[0], cd1[1], cd2[0], cd2[1]);
    matches.sort(function(a, b){
        return  b.confidence - a.confidence;
    });
    console.log(matches);
    return matches;
}


function plot_matches(matches){
    imcanvas.clearRect(0, 0, 480, 320);
    imregioncanvas.clearRect(0, 0, 480, 320);
    console.log("plotting matches");
    for (var i = 0; i < matches.length; i++) {
        var color = "red";
        imcanvas.lineWidth = "2px";
        imcanvas.fillStyle = color;
        imcanvas.strokeStyle = color;
        imcanvas.beginPath();
        imcanvas.arc(matches[i].keypoint1[0], matches[i].keypoint1[1], 4, 0, 2*Math.PI);
        imcanvas.stroke();

        imregioncanvas.lineWidth = "2px";
        imregioncanvas.fillStyle = color;
        imregioncanvas.strokeStyle = color;
        imregioncanvas.beginPath();
        imregioncanvas.arc(matches[i].keypoint1[0], matches[i].keypoint1[1], 4, 0, 2*Math.PI);
        imregioncanvas.stroke();
    }

}

