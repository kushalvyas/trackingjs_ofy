var canvas_big, canvas_query, imcanvas_big, imcanvas_query;
var imbig;var imquery;
document.addEventListener("DOMContentLoaded", function(){
    var btn = document.getElementById("locate");
    btn.addEventListener("click", template_match);

}, false);

function template_match(){
    console.log("template matching using features");
    var im_big = imcanvas_big.getImageData(0, 0, canvas_big.width, canvas_big.height);
    var im_query = imcanvas_query.getImageData(0, 0, canvas_query.width, canvas_query.height);
    var cd_big = getdescriptors(im_big.data, canvas_big.width, canvas_big.height);
    var cd_query = getdescriptors(im_query.data, canvas_query.width, canvas_query.height);
    console.log(cd_big);
    console.log(cd_query);
    var matches = getNearestMatch(cd_big, cd_query);
    plot_matches(matches);


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
    console.log("plotting matches");
    for (var i = 0; i < matches.length; i++) {
        var color = "red";
        imcanvas_big.lineWidth = "2px";
        imcanvas_big.fillStyle = color;
        imcanvas_big.strokeStyle = color;
        imcanvas_big.beginPath();
        imcanvas_big.arc(matches[i].keypoint1[0], matches[i].keypoint1[1], 4, 0, 2*Math.PI);
        imcanvas_big.stroke();

        imcanvas_query.lineWidth = "2px";
        imcanvas_query.fillStyle = color;
        imcanvas_query.strokeStyle = color;
        imcanvas_query.beginPath();
        imcanvas_query.arc(matches[i].keypoint1[0], matches[i].keypoint1[1], 4, 0, 2*Math.PI);
        imcanvas_query.stroke();
    }

}


function getdescriptors(im, w, h){
    var blur_im = tracking.Image.blur(im, w, h, 3);
    var gray_im = tracking.Image.grayscale(blur_im, w, h);
    var corners = tracking.Fast.findCorners(gray_im, w, h);
    var desc = tracking.Brief.getDescriptors(gray_im, w, corners);
    return [corners, desc];
}

window.onload = function(){

    canvas_big = document.getElementById("big_canvas");
    canvas_query = document.getElementById("query_canvas");
    imcanvas_big = canvas_big.getContext("2d");
    imcanvas_query = canvas_query.getContext("2d");
    imbig = new Image();
    imbig.src = "images/temA1.jpg";
    imquery = new Image();
    imquery.src = "images/t12.jpg";
    canvas_big.width = imbig.width;
    canvas_big.height = imbig.height;
    canvas_query.width = imquery.width;
    canvas_query.height = imquery.height;
    imbig.onload = function(){imcanvas_big.drawImage(imbig, 0, 0);};
    imquery.onload = function(){imcanvas_query.drawImage(imquery, 0, 0);}


};
