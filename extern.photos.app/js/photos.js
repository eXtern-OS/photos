var win = nw.Window.get();
const fs = require('fs');


// function to encode file data to base64 encoded string
function base64_encode(file) {
    // read binary data
    var bitmap = fs.readFileSync(file);
    // convert binary data to base64 encoded string
    return new Buffer(bitmap).toString('base64');
}

function openFilesApp() {
    win.minimize();
    win.openApp("extern.files.app");
}


var resizebase64 = require('resize-base64'); 
function validateImage(input,callback,customSelectFile){

    console.log("customSelectFile: ",customSelectFile);
        var image = new Image();

        image.onload = function() {
            if (this.width) {
                 console.log('Image has width, I think it is real image');
                 console.log("customSelectFileB: ",customSelectFile);
                callback(input,customSelectFile);
                 //TODO: upload to backend
            }
        };





        image.src = "file://"+input; //"data:image/png;base64"+resizedImageBuf.toString('base64');

	//var base64str = base64_encode(input);

	//var  img = resizebase64(base64str, 100, 100); 

	//console.log("img",img);

	// obtain an image object:
/*require('lwip').open(input, function(err, image){

  // check err...
  // define a batch of manipulations and save to disk as JPEG:
  image.batch()
    .scale(0.75)          // scale to 75%
    .rotate(45, 'white')  // rotate 45degs clockwise (white fill)
    .crop(200, 200)       // crop a 200X200 square from center
    .blur(5)              // Gaussian blur with SD=5
    .writeFile('output.jpg', function(err){
	cosole.log("done>.");
      // check err...
      // done.
    });

});*/
    
};

var preSelectedImage = false;

function addImage(img,customSelectFile) {
    if (customSelectFile)
        $("#innerPhotosSlides").append('<div class="item"><img img-src="file://'+img+'" src="file://'+img+'" alt="Ismage"></div>');
    else
        $("#innerPhotosSlides").append('<div class="item"><img img-src="file://'+img+'" src="" alt="Image"></div>');
    if (!preSelectedImage)
        $('.item').first().addClass('active');
    //console.log("LENGTH",$("ol li").length);
    
    if (!preSelectedImage)
        $("ol li").removeClass('active');

	var thumb_cache = "/home/extern/.config/hub/Default/thumbnails/videos/";

	var fileNameOfInterest = img.replace(/^.*[\\\/]/, '');
	if (fs.existsSync(thumb_cache+fileNameOfInterest+'-[image].png')) {
		$(".carousel-indicators").append('<li data-target="#carousel-example-generic" data-slide-to="'+$("ol li").length+'" class="imgIndicators"><img src="file://'+thumb_cache+fileNameOfInterest+'-[image].png"</li>');
	} else {
		$(".carousel-indicators").append('<li data-target="#carousel-example-generic" data-slide-to="'+$("ol li").length+'" class="imgIndicators"><img src="../extern.files.app/icons/image.png"</li>');
	}


    
    if (!preSelectedImage) {
        $(".imgIndicators").removeClass("active");
        $(".item").removeClass("active");
    }
    
    console.log("customSelectFileAAA: ",customSelectFile);

    if (customSelectFile) {
        preSelectedImage = true;
        $('.carousel-indicators > li').last().addClass('active');
        $('.item').last().addClass('active');
    }
    
    $("#innerPhotosSlides").carousel({
        interval: false
    });
    $("#innerPhotosSlides").carousel('pause');
    $("#welcomeView").addClass("hidden");
    $("#mainView").removeClass("hidden");
    
    setTimeout(function(){
            //adjustWin();
                }, 1000);
    
}

function adjustWin () {
    var $img = $('#innerPhotosSlides .active img');//$($('.item')[imgToResizeOn]);
        win.height = screen.height - 100;
        win.width = screen.width - 100;
        setTimeout(function(){
            console.log("RESIZED at: ",$img.height());
        win.width = $img.width()+50; 
        win.height = $img.height()+50; 
            setTimeout(function(){
            win.x = Math.floor((screen.width/2) - (win.width/2));
            win.y = Math.floor((screen.height/2) - (win.height/2));
                }, 100);
            }, 50);
}

win.onOpenFiles = function(files) {

console.log("file opened");

if (files.length != 1) {
    
    for (var i = 0; i < files.length; i++) {
        console.log("FILES",files);
        if (i == 0)
            validateImage(files[i],addImage,true);
        else
            validateImage(files[i],addImage,false);
    }

} else {
        var fileDir = files[0].substring(0, files[0].lastIndexOf("/"));
        var fileNameOfInterest = files[0].replace(/^.*[\\\/]/, '');
        console.log("fileNameOfInterest: ",fileNameOfInterest);
        fs.readdir(fileDir, (err, allFiles) => {
            allFiles.forEach(file => {
                if (file == fileNameOfInterest) {
                    console.log("file found");
                    validateImage(fileDir+"/"+file,addImage,true);
                } else
                    validateImage(fileDir+"/"+file,addImage,false);
                console.log("file: ",file);
            });
        });
    }
}

$(function(){
    $('.active img').load(function(){
		//Do nothing, removed
    });
});



$carousel = $("#carousel-example-generic");

$carousel.bind('slide.bs.carousel', function (e) {
    var currentImage = $(".item.active > img");
    var imgUrl = $(e.relatedTarget).find("img").attr("img-src");
    $(e.relatedTarget).find("img").attr("src",imgUrl);
    

    setTimeout(function(){
        console.log("$(currentImage).parent()",$(currentImage).parent())
        if (!$(currentImage).parent().hasClass("active")) //incase user switches too fast back to the same image
            $(currentImage).attr("src",""); 
        }, 500);

            //Why remove it you might ask? To reduce memory usage. If user has thousands of high-res images in the folder, you don't want all that in ram do you?
    
    
});
