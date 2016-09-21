// bounding box
/**
 * Created by kushal on 15/9/16.
 */


// face detection




var canvas, imcanvas;
var canvas2, imcanvas2;
var ul_element = document.getElementById("face_idx");
canvas = document.getElementById("mycanvas");
canvas.width = 640;
canvas.height = 480;

canvas2 = document.getElementById("newcanvas");
imcanvas2 = canvas2.getContext('2d');
canvas2.width = 200;
canvas2.height = 1000;



imcanvas = canvas.getContext("2d");
// load an image in the canvas
var imagesrc = "26.jpg";
var im = new Image();
var detected_faces = [];
var face_idx = [];
var face_images = [];

im.src = imagesrc;

im.onload = initiate_face_location;
function initiate_face_location(){
    imcanvas.drawImage(im, 0, 0);
    // run object detector to detect faces
    var face_tracker = new tracking.ObjectTracker("face");
    tracking.track(im, face_tracker);
    face_tracker.on("track", handle_faces);
}

function drawBoundingBox(rect){
    detected_faces.push(rect);
    console.log(rect.x +" " + rect.y);
    imcanvas.beginPath();
    imcanvas.lineWidth = "2";
    imcanvas.strokeStyle = 'red';
    imcanvas.rect(rect.x, rect.y, rect.width, rect.height);
    imcanvas.stroke();
}

function handle_faces(event) {
    console.log(event.data);
    event.data.forEach(drawBoundingBox);
    updateIndex();
}


function updateIndex(){
    dx=0;dy=0;
    console.log("Updating face index");
    // tr = detected_faces[0];
    // tmp = imcanvas.getImageData(tr.x, tr.y, tr.width, tr.height);
    // imcanvas2.putImageData(tmp, 0, 0);
    detected_faces.forEach(function(person){
        console.log(person);
        tmp = imcanvas.getImageData(person.x, person.y, person.width, person.height);
        console.log(tmp);
        // canvas2.height+=person.height;
        imcanvas2.putImageData(tmp, dx, dy);
        dy += person.height;
    });

}




