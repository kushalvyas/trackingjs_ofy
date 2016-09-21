// /**
//  * Created by kushal on 15/9/16.
//  */


var canvas, imcanvas;
var canvas2, imcanvas2;
var canvas3, imcanvas3;
var video_frame;
var num_faces = {num_val:0, old_val:0};
var faces = [];
var dy=0, dx=0;
var name;

video_frame = document.getElementById("myVideo");
canvas = document.getElementById("mycanvas");
imcanvas = canvas.getContext("2d");
canvas.width = 480;
canvas.height = 320;

canvas2 = document.getElementById("newcanvas");
imcanvas2 = canvas2.getContext("2d");
canvas2.width = 480;
canvas2.height = 10000;

canvas3 = document.getElementById("canvas3");
imcanvas3 = canvas3.getContext("2d");
canvas2.width = 1000;
canvas2.height = 10000;

function stop(){
    mTracker.stop();
}
function start(){
    name = prompt("Enter name");
    num_faces.num_val = 0;
    mTracker.run();
}
var face_tracker = new tracking.ObjectTracker("face");
face_tracker.setInitialScale(4);
face_tracker.setEdgesDensity(0.1);
face_tracker.setStepSize(2);
var mTracker = tracking.track("#myVideo", face_tracker, {camera:'true'});
face_tracker.on("track", handle_faces);


function drawBoundingBox(rect){
    imcanvas.font="32px serif";
    imcanvas.fillStyle="white";
    imcanvas.fillText(name, rect.x, rect.y);
    imcanvas.stroke();
    imcanvas.strokeStyle = "red";
    imcanvas.lineWidth="3";
    imcanvas.strokeRect(rect.x, rect.y, rect.width, rect.height);
    imcanvas.stroke();
}

function handle_faces(event){
    // console.log(event);
    imcanvas.clearRect(0, 0, canvas.width, canvas.height);
    imcanvas.drawImage(video_frame, 0, 0, canvas.width, canvas.height);
    dx=0;dy=0;
    var len = event.data.length;
    if(len !== num_faces.num_val){
        console.log("found new face");
        handle_change(len);
        handle_new_faces(event.data);
    }else{
        for(var data_cx in event.data){
            drawBoundingBox(event.data[data_cx]);
        }
        console.log("constant faces");
    }

}

function handle_new_faces(data){
    imcanvas2.clearRect(0, 0, canvas2.width, canvas2.height);
    for(var data_cx in data){
        var tmp = data[data_cx];
        name = prompt("enter name");
        document.getElementById("p_name").innerHTML=  name;
        drawBoundingBox(tmp);
        updateIndex(tmp);
    }
}

function handle_change(newval){
    num_faces.num_val = newval;
}

function updateIndex(person){
    var tmp = imcanvas.getImageData(person.x, person.y, person.width, person.height);
    imcanvas2.putImageData(tmp, dx, dy);
    dy += person.height+2;
}