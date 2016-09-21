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
var btnCapture, btnGray, btnBinary, btnBlur, btnInvert, downloadbtn;
var imcanvas;
var captureFlag = false;

function watch_video(){


    /*
        Initialize all selectors.
        Get access of required element
        setup event triggers.
     */
    //select the elements relevant to video and capture
    video_frame = document.getElementById("myVideo");
    canvas = document.getElementById("canvas");
    btnCapture = document.getElementById("btnCapture");
    btnGray = document.getElementById("btnGray");
    btnBinary = document.getElementById("btnBinary");
    btnBlur = document.getElementById("btnBlur");
    btnInvert = document.getElementById("btnInvert");
    btnDownload = document.getElementById("downloadbtn");

    imcanvas = canvas.getContext("2d");

    //set up event listeners ..
    btnCapture.addEventListener("click", capture);
    btnGray.addEventListener("click", gray);
    btnBinary.addEventListener("click", binary);
    // btnBlur.addEventListener("click", blur);
    btnInvert.addEventListener("click", invert);
    btnDownload.addEventListener("click", downloadImage);



    /*

     This part of javascript code will capture frames from
     the webcam and display on webpage.
     */

//    obtain access to browser local system connected media ..

    navigator.getUserMedia = (
    //        check for all available media
    //    chrome
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

function capture(){
    /*
     When the button is called, this function is called.
     Once the button is clicked, the canvas will be updated with current frame
     */
    captureFlag = true;
    console.log("Button is clicked");
    imcanvas.drawImage(video_frame, 0, 0, canvas.width, canvas.height);
    // ipcanvas.getContext("2d").drawImage(video_frame, 0, 0, 640, 480);
}


function gray(){
    /*
    convert the image to gray scale ...
    the formula to convert an image to gray scale is quite simple
    every pixel  = I(x,y) -> G(a,b)
    such that G(a,b) = 0.21R + 0.72G + 0.07B
     */

    capture();
    console.log("Gray operation to be performed");
    // 32 bit image
    var image = imcanvas.getImageData(0, 0, canvas.width, canvas.height);
    console.log(image.data.length);
    console.log(image);
    var channels = image.data.length/4;
    for(var i=0;i<channels;i++){
        var r = image.data[i*4 + 0];
        var g = image.data[i*4 + 1];
        var b = image.data[i*4 + 2];
        var gray =  Math.round(0.21*r + 0.72*g + 0.07*b);
        image.data[i*4 + 0] = gray;
        image.data[i*4 + 1] = gray;
        image.data[i*4 + 2] = gray;
    }

    console.log(image);
    imcanvas.putImageData(image, 0, 0);
    //imcanvas.putImageData(image.toDataURL(), 0, 0, canvas.width, canvas.height);
    // imcanvas.drawImage();
}

function binary(){

    /*
       To convert image into binary , we will threshold it.
       Based upon the threshold value

       thresh_red, thresh_blue, thresh_green ==> are the respective red, blue and green color threshold values. Any thing above this threshold value will be denoted by white color and anything below will be black

     */

    capture();
    var image = imcanvas.getImageData(0, 0, canvas.width, canvas.height);
    var thresh_red = 100;
    var thresh_green = 100;
    var thresh_blue = 100;

    var channels = image.data.length/4;
    for(var i=0;i<channels;i++){
        var r = image.data[i*4 + 0];
        var g = image.data[i*4 + 1];
        var b = image.data[i*4 + 2];
        if( r>= thresh_red && g>= thresh_green && b>=thresh_blue ){
            image.data[i*4 + 0] = 255;
            image.data[i*4 + 1] = 255;
            image.data[i*4 + 2] = 255;
        }else{
            image.data[i*4 + 0] = 0;
            image.data[i*4 + 1] = 0;
            image.data[i*4 + 2] = 0;
        }
    }
    imcanvas.putImageData(image, 0,  0);



}

function blur(){
    /*
    Blurring is basically convolution of image with a kernel
     */


}

function invert(){
    /*
    invert an image means to copy left half upon the right one
     */

    capture();
    var image = imcanvas.getImageData(0, 0, canvas.width, canvas.height);
    var channels = image.data.length/4;
    for(var i=0; i<channels;i++){
        image.data[i*4 + 0] = 255 - image.data[i*4 + 0];
        image.data[i*4 + 1] = 255 - image.data[i*4 + 1];
        image.data[i*4 + 2] = 255 - image.data[i*4 + 2];
    }
    imcanvas.putImageData(image, 0, 0);
}


function downloadImage(){
    if(!captureFlag){
        capture();
    }
    canvas.toDataURL("image.png", 1.0);


}
