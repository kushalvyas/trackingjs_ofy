/**
 * Created by kushal on 16/9/16.
 */


// /**
//  * Created by kushal on 15/9/16.
//  */


var canvas, imcanvas;
var canvas2, imcanvas2;
var canvas3, imcanvas3;
var video_frame;
var num_faces = {num_val:0, old_val:0};
var dim_rect = {x:0,y:0,width:200,height:200};
var dictlist = [];
var faces = [];
var dy=0, dx=0;
var start_stop_flag=false;
var face_obj = [];
var count=0;
var existing_faces = [];


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
    num_faces.num_val = 0;
    faces = [];
    mTracker.run();
}
var face_tracker = new tracking.ObjectTracker("face");
face_tracker.setInitialScale(4);
face_tracker.setEdgesDensity(0.1);
face_tracker.setStepSize(2);
var mTracker = tracking.track("#myVideo", face_tracker, {camera:'true'});
face_tracker.on("track", handle_faces);


function drawBoundingBox(canv, rect, name){
    canv.font = "32px serif";
    canv.fillStyle = "white";
    canv.fillText(name, rect.x, rect.y);
    canv.stroke();
    canv.strokeStyle = "red";
    canv.lineWidth="3";
    canv.strokeRect(rect.x, rect.y, rect.width, rect.height);
    canv.stroke();
}

function handle_faces(event){
    // console.log(event);
    imcanvas.clearRect(0, 0, canvas.width, canvas.height);
    imcanvas.drawImage(video_frame, 0, 0, canvas.width, canvas.height);
    dx=0;dy=0;
    // event.data.forEach(drawBoundingBox);
    var len = event.data.length;
    if(len ==1  && num_faces.val == 1 && existing_faces.len == 1){
        drawBoundingBox(imcanvas, event.data[0], existing_faces[0].name);
    }
    if(len != num_faces.num_val){
        if(len ==1 ){
            var val = handle_new_faces(event.data[0]);
            handle_change(val);
        }
    }else{
        for (var ev_cx in event.data){
            var face = event.data[ev_cx];
            // if(num_faces.num_val == num_faces.old_val){
            var flag_face = doesFaceExist(face); //flag_face = bool, getface from array
            if(flag_face[0]){
                drawBoundingBox(imcanvas, face, flag_face[1].name);
            }else{
                console.log("face does not exist");
                handle_change(num_faces.num_val + 1);
                var val = handle_new_faces(face);
                drawBoundingBox(imcanvas, faces[val].face, faces[val].rect);
            }

        }
    }

}

function handle_new_faces(data){
    // faces = [];
    // imcanvas2.clearRect(0, 0, canvas2.width, canvas2.height);
    // for(var data_cx in data){
    var tmp = data;
    var name = updateIndex(tmp);
    var fx;
    if(existing_faces.find(function(x){
        if(name == x.name){
            fx = x.id;
            return true;
        }else{return false;}
        })){
        console.log("face already exists");
        return fx;
    }else{
        console.log("current people : " + name);
        faces.push({
            idx:count,
            face:tmp,
            name:name
        });
        existing_faces.push(faces[count]);
        count++;
        return existing_faces.length -1;

    }

}

function handle_change(newval){
    num_faces.old = num_faces.num_val;
    num_faces.num_val = newval;
}

function updateIndex(person){
    console.log("Updating face index");
    var tmp = imcanvas.getImageData(person.x, person.y, person.width, person.height);
    imcanvas2.putImageData(tmp, dx, dy);
    dy += person.height+2;
    var name = prompt("Enter name");
    return name;
}

function doesFaceExist(face){
    var tmp = [];
    if (existing_faces.length <= 0) {
        return [false, null];
    } else {
        for (var exc in existing_faces) {
            var e_face = existing_faces[exc].face;
            console.log(e_face);
            var d1, d2;
            var c1 = [], c2 = [];
            c1[0] = (face.x + face.width) / 2.0;
            c1[1] = (face.y + face.height) / 2.0;
            c2[0] = (e_face.x + e_face.width) / 2.0;
            c2[1] = (e_face.y + e_face.height) / 2.0;
            d1 = Math.abs(c1[0] - c2[0]);
            d2 = Math.abs(c1[1] - c2[1]);
            console.log(d1 + " " + d2);
            tmp.push([exc, mod([d1, d2])]);

        }
        tmp.sort(function (a, b) {
            return a[1] - b[1];
        });
        console.log("TMp array  of existing faces...sorted by euclidan faces");
        console.log(tmp);
        if (tmp[0][1] < 40) {
            var tmpid = tmp[0][0];
            var tt = existing_faces[tmpid];
            existing_faces[tmpid].face = face;
            return [true, tt];
        } else {
            return [false, null];
        }
    }

}


function mod(a){
    return Math.sqrt(a[0]*a[0] + a[1]*a[1]);
}

function  filterExistingFaces() {

}