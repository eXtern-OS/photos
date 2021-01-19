var win = nw.Window.get();
const fs = require('fs');
const path = require('path');
var screenhsotView = false;
var filesAdded = 0;
var wzoom;
var slideShowInterval;
var intervalDuration = 5000;
var openedFromGallery = false;
//win.showDevTools();

function toggleSlideshow() {
    //$("#innerPhotosSlides").carousel('pause');
    if (slideShowInterval == null) {
        $("#playSlideshowButton > i").removeClass("fa-play");
        $("#playSlideshowButton > i").addClass("fa-pause");
        slideShowInterval = setInterval(function(){
            //$("#innerPhotosSlides").carousel('next');
            $(".right.carousel-control").click(); //smoother than the next one
        }, intervalDuration);
    } else {
        clearInterval(slideShowInterval);
        slideShowInterval = null;
        $("#playSlideshowButton > i").removeClass("fa-pause");
        $("#playSlideshowButton > i").addClass("fa-play");
    }
    
}

function toggleFullscreen() {
    win.toggleFullscreen();
}

$('a').click(function(){
        $(this).blur();
    });

function openFullAppFromScreenshotview() {
	adjustWin();
}

function copyImageToClipboard() {

    var imgFile = $("#innerPhotosSlides > .active > img").attr("img-src");
    //console.log("imgs: ",imgs);
    App.getMimeType(imgFile, function (mimeType) {
        console.log("mimeType: ",mimeType);
        var imageType = "";
        if (mimeType.indexOf("image/jpeg") != -1)
            imageType = "jpeg";
        else if (mimeType.indexOf("image/png") != -1)
            imageType = "png";

        if (imageType == "") {
            //tell user failed to copy
            console.log("failed to copy");
        } else {
            // resolve path as absolute path in order to be used by other applications
            var pngPath = path.resolve(imgFile);
            // read the image from file system as base64 encoded string
            var data = fs.readFileSync(pngPath).toString('base64');
            // transform file path to URL
            var html = '<img src="file:///' + encodeURI(data.replace(/^\//, '')) + '">';
            
            var clip = nw.Clipboard.get();
            // write both PNG and HTML to clipboard
            
            clip.set([
                {
                    type: imageType, data: data, raw: true
                },
                
                {
                    type: 'html', data: html
                }
            ]);
        }
    });
    
    
}





App = parent.getInstance();
$(App.close_button).css("top","21px"); //move close button to other buttons
$(App.close_button).css("margin-right","15px"); //move close button to other buttons
$(App.maximize_button).css("top","21px"); //move maximize button to other buttons
$(App.maximize_button).css("margin-right","20px"); //move maximize button to other buttons
$(App.minimize_button).css("top","15px"); //move minimize button to other buttons
$(App.minimize_button).css("margin-right","25px"); //move minimize button to other buttons

var button = {
	text: "Open Files",
	id: 0
}

var buttons = [];

buttons.push(button);

//    backdrop-filter: blur(20px);
//App.newNotification("Hiiii",buttons,null);
//App.newNotification("Me",buttons,null);
//chrome.runtime.reload();

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

function checkIfLibraryFileIsImage(file) {
    	//console.log("file in folders: ",file);
  	var ext = path.extname(file.name).substr(1);


	var foundExt = false;


	//If we think it's a plain text file there is a chance we don't know what type it is
	//So instead we can use the file extension to figure it out instead
	//Also C++ and C sometimes gets confused





	if ((file.type == "plain" || file.type == "text" || file.type == "c code" || !!foundExt) && (ext != "")) {
		//console.log("gets here for: ",ext);
        	for (var key in map) {
          		if (_.include(map[key], ext)) {
				//console.log("found here: ",key);
            			file.type = key;
				foundExt = true;
				/*$("#"+file.id).attr("filetype",file.type);
				$("#"+file.id).find("img").attr("src","icons/"+file.type+".png");
          $("#"+file.id).find(".filetype").text(file.type);
          $("#flipsterItem"+file.id).empty();
          $("#flipsterItem"+file.id).append("&"+getFontIcon(file.name,file.type));*/
            			break;
          		}
        	}
	}

	if (!foundExt) {

        	for (var key in map) {
          		if (_.include(map[key], ext)) {
				file.type = key;
				foundExt = true;
				//console.log("using this found key B: ", key);
				/*$("#"+file.id).attr("filetype",file.type);
				$("#"+file.id).find("img").attr("src","icons/"+file.type+".png");
				$("#"+file.id).find(".filetype").text(file.type);*/
            			break;
          		}
        	}
	}

	//console.log("finished processing pos",folder_view.localVars.processingFileTypeForPos);

if (file.type == "image") {

var thumb_cache = $("#thumbnail_url").text();
if (fs.existsSync(thumb_cache+file.name+'-[image].png')) {
var stats = fs.statSync(thumb_cache+file.name+'-[image].png');
	file.icon = "file://"+thumb_cache+file.name+'-[image].png';
	//$( "div[fileid='"+file.parentID+"'] > .folder-icon > img:nth-child("+(file.filePos+1)+")" ).attr( "src", file.icon);
	$( "div[fileid='"+file.parentID+"'] > .folder-icon > img:nth-child("+(file.filePos+1)+")" ).addClass( "media-icon");
	//$("#"+file.id).find("img").attr("src",file.icon);
}
}
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
            } else {
                
		}

        
        };

        





        image.src = "file://"+input; //"data:image/png;base64"+resizedImageBuf.toString('base64');

        //lastImage
               /* if (input == lastImage) {
                    var width = 1490;
        var height = 860;
        //win.resizeTo(width,height);
        setTimeout(function(){
        App.ready({width: width, height:height});
        }, 1000);
       
                }*/

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

window.addEventListener('resize', function () {
            wzoom.prepare();
        });

        $('#zoomInButton')[0].addEventListener('click', function () {
            console.log("xoom in");
            wzoom.zoomUp();
        });

        $('#zoomOutButton')[0].addEventListener('click', function () {
            console.log("xoom out");
            wzoom.zoomDown();
        });

var preSelectedImage = false;

var adjustwidth = 100;
var adjustHeight = 100;
var slideBackToIndex = -1;

function addImage(img,customSelectFile) {
    if (customSelectFile)
        $("#innerPhotosSlides").append('<div class="item"><img img-src="'+img+'" src="file://'+img+'" alt="Ismage"></div>');
    else
        $("#innerPhotosSlides").append('<div class="item"><img img-src="'+img+'" src="" alt="Image"></div>');
    if (!preSelectedImage)
        $('#mainView  .item').first().addClass('active');
    //console.log("LENGTH",$("ol li").length);
    
    if (!preSelectedImage)
        $("#mainView  ol li").removeClass('active');

	var thumb_cache = process.env['HOME']+"/.config/hub/Default/thumbnails/videos/";

    var pos = $("#innerPhotosSlides").children().length;

	var fileNameOfInterest = img.replace(/^.*[\\\/]/, '');
	if (fs.existsSync(thumb_cache+fileNameOfInterest+'-[image].png')) {
		$("#mainView .carousel-indicators").append('<li data-target="#carousel-example-generic" data-slide-to="'+(pos-1)+'" class="imgIndicators"><img src="file://'+thumb_cache+fileNameOfInterest+'-[image].png"</li>');
	} else {
		$("#mainView .carousel-indicators").append('<li data-target="#carousel-example-generic" data-slide-to="'+(pos-1)+'" class="imgIndicators"><img src="../extern.files.app/icons/image.png"</li>');
	}


    
    if (!preSelectedImage) {
        $("#mainView .imgIndicators").removeClass("active");
        $("#mainView .item").removeClass("active");
    }
    
    console.log("customSelectFileAAA: ",customSelectFile);

    if (customSelectFile) {
	console.log("custom select");
        preSelectedImage = true;
        $('#mainView .carousel-indicators > li').last().addClass('active');
        $('#mainView .item').last().addClass('active');
        if (openedFromGallery) {
            $("#mainView").css("opacity",0);
            $("#mainView").addClass("animatedOpacity");
            setTimeout(function(){
                $('#innerPhotosSlides > .active').addClass("switchBackTo");
                $("#animateImageOnOpen").width($('#innerPhotosSlides > .active > img').width());
                $("#animateImageOnOpen").height($('#innerPhotosSlides > .active > img').height());
                $("#animateImageOnOpen").css("top",$('#innerPhotosSlides > .active > img').offset().top);
                $("#animateImageOnOpen").css("left",$('#innerPhotosSlides > .active > img').offset().left);
                
                slideBackToIndex = $("#innerPhotosSlides").find('.active').index();

                console.log("slideBackToIndex: ",slideBackToIndex);
                
            }, 200);

            setTimeout(function(){ $("#mainView").css("opacity",1);},600);
            setTimeout(function(){ $("#animateImageOnOpen").addClass("hidden");
            $("#mainView").removeClass("animatedOpacity");
            }, 1000);
        }
        //new ScrollZoom($('#innerPhotosSlides > .active'),4,0.5);
        wzoom = WZoom.create('#innerPhotosSlides > .active > img', {
            minScale: 1,
            maxScale: 4,
            dragScrollableOptions: {
                onGrab: function () {
                    $('#innerPhotosSlides > .active > img')[0].style.cursor = 'grabbing';
                },
                onDrop: function () {
                    $('#innerPhotosSlides > .active > img')[0].style.cursor = 'grab';
                }
            }
        });

        
        
        console.log("selected: ",$('#innerPhotosSlides > .active'));
    //}

	console.log("processedFiles: ",processedFiles);
	console.log("totalFiles: ",totalFiles);

	//if (totalFiles == (processedFiles+1)) {

	console.log("processed check success");

    $("#innerPhotosSlides").carousel({
        interval: false
    });
    $("#innerPhotosSlides").carousel('pause');
    $("#welcomeView").addClass("hidden");
    $("#mainView").removeClass("hidden");
	//App.ready();
	if (!screenhsotView)
		adjustWin(false);
	else {
		adjustWin(true);
	}
    
    setTimeout(function(){
		$("#editButton").removeClass("hiddenOpacity");
            
                }, 4000);

	//} else {
	//	processedFiles++;
	}
    

    
}

function adjustWin (miniVersion) {
    var $img = $('#adaptiveImage > img');//$($('.item')[imgToResizeOn]);
$('#adaptiveImage > img').attr("src",$(".item.active > img").attr("src"));
$("#gallerySection").addClass("hidden");
$("#mainView").removeClass("hidden");

        //win.height = screen.height - 100;
       // win.width = screen.width - 100;
       adjustHeight = $img.width();
       adjustwidth = $img.height();


	if (miniVersion) {
		$('#adaptiveImage > img').css("height",(200)+"px");
		setTimeout(function(){
		win.x = screen.width-($img.width()+50);
		win.y = screen.height-($img.height()+100);
		win.width = $img.width();
		win.height = $img.height();
		

		}, 50);

		setTimeout(function(){
		
				
		App.removeOpacityProperty();

		}, 1200);

	} else {
	$('#adaptiveImage > img').css("height",(screen.height-200)+"px");
        setTimeout(function(){
            console.log("RESIZED at: ",$img.height());
        //win.width = $img.width()+50; 
        //win.height = $img.height()+50; 
            setTimeout(function(){
           // win.x = Math.floor((screen.width/2) - (win.width/2));
            // win.y = Math.floor((screen.height/2) - (win.height/2));
                }, 100);

	if (screenhsotView) {
        console.log("using sreenshotview");
		App.ready({width: $img.width(), height: $img.height()},true,true);
		 //setTimeout(function(){
		$(App.maximize_button).removeClass("hidden");
		$(App.minimize_button).removeClass("hidden");
		setTimeout(function(){
		$(".carousel-indicators").removeClass("hiddenOpacity");
		$("#topToolbar").removeClass("hiddenOpacity");
		$("#showFromScreenshotView").addClass("hidden");
		}, 1000);
		
		//}, 500);
	} else {
    //setTimeout(function(){
		if ($img.width() > 200 && $img.height() > 200) {
			App.ready({width: $img.width(), height: $img.height()});
		} else {
			App.ready({width: 200, height: 200});
		}
		
		$("#showFromScreenshotView").addClass("hidden");
                //}, 400);
	}
            }, 50);

	}
	
}


$(document).keydown(function(e) {
    if (e.which == 27) { //esc
		win.leaveFullscreen();
	}
});

var totalFiles = 0;
var processedFiles = 0;

App.onOpenFiles = function(files) {

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
		totalFiles = allFiles.length;
		processedFiles = 0;
            allFiles.forEach(file => {
                if (file == fileNameOfInterest) {
                    console.log("file found");
                    validateImage(fileDir+"/"+file,addImage,true);
                } else
                    validateImage(fileDir+"/"+file,addImage,false);
                console.log("file: ",file);
            });
		console.log("done?");
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
    $(e.relatedTarget).find("img").attr("src","file://"+imgUrl);
    
    
    

    setTimeout(function(){
        console.log("$(currentImage).parent()",$(currentImage).parent())
        if (!$(currentImage).parent().hasClass("active")) {
            $(currentImage).attr("src",""); 
            wzoom.destroy();
            wzoom = null; //Help garbage collection. Probs not necessary but why not
            wzoom = WZoom.create("#innerPhotosSlides > .item > [src='file://"+imgUrl+"']", {
            minScale: 1,
            maxScale: 4,
            dragScrollableOptions: {
                onGrab: function () {
                    $('#innerPhotosSlides > .active > img')[0].style.cursor = 'grabbing';
                },
                onDrop: function () {
                    $('#innerPhotosSlides > .active > img')[0].style.cursor = 'grab';
                }
            }
        });
        } //incase user switches too fast back to the same image
            
        }, 1500);


       /* setTimeout(function(){
            console.log("inner: ",$("#innerPhotosSlides > .item > [src='file://"+imgUrl+"']"))
        
        }, 500);*/

            //Why remove it you might ask? To reduce memory usage. If user has thousands of high-res images in the folder, you don't want all that in ram do you?
    
    
});

var currentImageDir = "";
var currentImageName = "";

function saveChanges(imageData) {
    //console.log("try saving image: ",imageData);
screenhsotView = false; //Prevent going into mini mode
    var imagePath = currentImageDir.substring(0, currentImageDir.lastIndexOf('/')) + "/";
    var newName = currentImageDir.split("/").pop();
    var nameOnly = path.parse(newName).name;
    var extensionOnly = ".png";//path.parse(newName).ext;
    var data = imageData.replace(/^data:image\/\w+;base64,/, "");
    var buf = new Buffer(data, 'base64');
    var finalFileName = imagePath+nameOnly+"-modified";

    try {
        if (fs.existsSync(finalFileName+extensionOnly)) {
            var i = 1
            while (true) {
                if (fs.existsSync(finalFileName+i+extensionOnly)) {
                    //file exists
                    i++;
                } else {
                    break;
                }
            }
            fs.writeFile(finalFileName+i+extensionOnly, buf, function(err) {
                console.log(err);
                //console.log("saved: ",imagePath+nameOnly+"-modified"+extensionOnly);
                preSelectedImage = false;
                addImage(finalFileName+i+extensionOnly,true);
            });
        } else {
            fs.writeFile(finalFileName+extensionOnly, buf, function(err) {
                console.log(err);
                //console.log("saved: ",imagePath+nameOnly+"-modified"+extensionOnly);
                preSelectedImage = false;
                addImage(finalFileName+extensionOnly,true);
            });
        }
    } catch(err) {
            console.error(err)
        }

    
}

function openImage(imageElement) {
    
    $('#mainView .carousel-indicators').empty();
    $("#innerPhotosSlides").empty();
    console.log("imageElement: ",$(imageElement).offset());
    $(".currentlyViewingImage").removeClass("currentlyViewingImage");
    $(imageElement).addClass("currentlyViewingImage");
    $("#animateImageOnOpen").attr("src",$(imageElement).attr("src"));
    $("#animateImageOnOpen").removeClass("hidden");
    $("#animateImageOnOpen").width($(imageElement).width());
    $("#animateImageOnOpen").height($(imageElement).height());
    $("#animateImageOnOpen").css("top",$(imageElement).offset().top);
    $("#animateImageOnOpen").css("left",$(imageElement).offset().left);
    $("#animateImageOnOpen").addClass("enableSizeAnimation");
    openedFromGallery = true;
    var files = [$(imageElement).attr("img-src")];
    App.onOpenFiles(files); //FIXME: come here

}

function openEditor() {
    var width = 1490;
    var height = 860;
    if (win.width < width) {
        win.resizeTo(width,height);
        win.x = Math.floor(((screen.width/2) - (width/2)));
    }
    
//win.showDevTools();
	var image = $("#innerPhotosSlides > .active > img").attr("src");
    currentImageDir = $("#innerPhotosSlides > .active > img").attr("img-src");
    App.imageEditor(image,image.split("/").pop(),saveChanges);
}

function addImageToLibrary(imageToAdd) {
    var pos = $("#innerFeaturedSlides").children().length;
    if (pos < 3) {
        if (pos == 0) {
            $("#innerFeaturedSlides").append('<a href="#" class="item featured-item active"><img img-src="'+imageToAdd+'" onclick="openImage(this)" src="file://'+imageToAdd+'" alt="Ismage"></a>');
            $(".carousel-indicators").append('<li data-target="#featured-photos-carousel" data-slide-to="'+pos+'" class="imgIndicators active"></li>');
        } else {
            $("#innerFeaturedSlides").append('<a href="#" class="item featured-item"><img img-src="'+imageToAdd+'" src="file://'+imageToAdd+'" onclick="openImage(this)" alt="Ismage"></a>');
            $(".carousel-indicators").append('<li data-target="#featured-photos-carousel" data-slide-to="'+pos+'" class="imgIndicators"></li>');
        }
    
    //$(".carousel-indicators").append('<li data-target="#featured-photos-carousel" data-slide-to="'+(currentPos+1)+'" class="imgIndicators"></li>');
    

    } else {
        if ($("#innerFeaturedSlides").children().length == 4) {
            $("#innerFeaturedSlides").carousel({
                interval: true
            });
            //$("#innerFeaturedSlides").carousel('pause');
        }

        //+process.env['HOME']

        $("#allPhotosMain").append('<a href="#" class="photo-stack single-photo photo-thumbnail">'+
                        '<img src="file://'+imageToAdd+'">'+
                            
				
			'<p class="albumLabel">Side Slide</p>'+
                    '</a>');

        $("#allPhotosMain").append('<a href="#" class="photo-stack photo-thumbnail">'+
                        '<div>'+
                            
				'<figure class="stack stack-spread notActive"><img src="file:///usr/eXtern/systemX/Shared/CoreSetup/thumbnails/videos/body of water.jpeg-[image].png" alt="img01"><img src="file:///usr/eXtern/systemX/Shared/CoreSetup/thumbnails/videos/cristina-gottardi.jpg-[image].png" alt="img02"><img src="file:///usr/eXtern/systemX/Shared/CoreSetup/thumbnails/videos/landscape2.jpeg-[image].png" alt="img03"></figure>'+

                        '</div>'+
			'<p class="albumLabel">Side Slide</p>'+
                    '</a>');

                    if ($(".photo-stack").length == 2) {
                        $("#allPhotosMain").append("<br>");
                    }
    }


    
}

var albums = [];
var lastImage = "";

function loadAllPhotosSection() {
var fullFilePath = process.env['HOME']+"/Pictures";
$(".photo-stack").remove();
    $(".carousel-indicators").empty();
    $("#innerFeaturedSlides").empty();

    fs.readdir(fullFilePath, function(error, files) {
        if (error) {
            //console.log(error);
            console.log(error);
            return;
        }

        if (files.length > 10)
            var filesLength = 10;
        else
            var filesLength = files.length;

        for (var i = 0; i < filesLength; i++) {
            /*var fileToProcess = {
                name: files[i],
                path: fullFilePath+"/"+files[i],
                type: "blank",
                filePos: filesAdded
            }*/
            filesAdded++;

            if (fs.lstatSync(fullFilePath+"/"+files[i]).isDirectory()) {
                albums.push({path: fullFilePath+"/"+files[i]});
            } else {
                if (i == (filesLength-1)) {
                    lastImage = fullFilePath+"/"+files[i];
                } else if (i == (filesLength-2)) {
                    if (fs.lstatSync(fullFilePath+"/"+files[filesLength-1]).isDirectory()) {
                        lastImage = fullFilePath+"/"+files[i];
                    } //Instead of doing it in one if statement, decided to split it so that it doesn't always check for this using up resources
                }
                validateImage(fullFilePath+"/"+files[i],addImageToLibrary,true);
                
                
            }
            


        }
        //App.ready();


    
    });
}

function animateBackHome() {
    //$("#gallerySection").addClass("hiddenOpacity");
    $("#gallerySection").css("opacity",0);
    $("#gallerySection").removeClass("hidden");
    $("#animateImageOnOpen").width($(".currentlyViewingImage").width());
    $("#animateImageOnOpen").height($(".currentlyViewingImage").height());
    $("#animateImageOnOpen").css("top",$(".currentlyViewingImage").offset().top);
    $("#animateImageOnOpen").css("left",$(".currentlyViewingImage").offset().left);
    setTimeout(function(){
        $("#gallerySection").css("opacity",1);
    }, 500);
    setTimeout(function(){
        $("#animateImageOnOpen").addClass("hidden");
        $("#animateImageOnOpen").removeClass("enableSizeAnimation");
    }, 1000);
    //$("#animateImageOnOpen").addClass("enableSizeAnimation");
    //openedFromGallery = true;
}

function openGallerySection() {
    console.log("lolb");
    var width = 1490;
    var height = 860;
    /*win.resizeTo(width,height);*/
    //win.x = Math.floor(((screen.width/2) - (width/2)));
    console.log("window resized");

    if (openedFromGallery) {
        openedFromGallery = false;
        //$(imageElement).addClass("currentlyViewingImage");
    //$("#animateImageOnOpen").attr("src",$(imageElement).attr("src"));
    

    if ($(".switchBackTo").hasClass("active")) {
        $("#animateImageOnOpen").removeClass("hidden");
    //$("#innerFeaturedSlides > .active").removeClass("active");
    //$(".currentlyViewingImage").parent().addClass("active");
    $("#mainView").addClass("hidden");
        animateBackHome();
    } else {
        //$("#innerPhotosSlides > .active").removeClass("avtive");
        //$(".switchBackTo").addClass("active")
        //setTimeout(function(){ animateBackHome(); }, 1000);
        if (slideBackToIndex != -1) {
            //$('#innerPhotosSlides').carousel(slideBackToIndex);
            console.log("clicking thisL ",$("li[data-slide-to="+slideBackToIndex+"]"));
            $("li[data-slide-to="+slideBackToIndex+"]").click(); //Why click instead of $('#innerPhotosSlides').carousel(slideBackToIndex);? Because it's animated.
            slideBackToIndex = -1;
            setTimeout(function(){ 
                $("#animateImageOnOpen").removeClass("hidden");
                $("#mainView").addClass("hidden");
                animateBackHome();
            }, 500);
        } else {
            $("#animateImageOnOpen").removeClass("hidden");
            $("#mainView").addClass("hidden");
            animateBackHome();
        }
    }
    
    } else {
        $("#mainView").addClass("hidden");
        $("#gallerySection").removeClass("hidden");
        loadAllPhotosSection();
        var width = 1490;
        var height = 860;
        //win.resizeTo(width,height);
        
        App.ready({width: width, height:height});
    }

    
        
	//win.moveTo(newX,newY);
}

console.log("App.argv: ",App.argv);
if (App.argv != null) {
	if (App.argv.length == 0) {
        //loadAllPhotosSection();
		
       openGallerySection();
	} else {
	if (App.argv[0] == "--screnshot-extern\0") {
		console.log("it's a screenshot");
		$("#mainView  .carousel-indicators").addClass("hiddenOpacity");
		$("#topToolbar").addClass("hiddenOpacity");
		$(App.close_button).removeClass("hiddenOpacity");
		$(App.maximize_button).addClass("hidden"); //So that user doesn't accidentally click it in mini screenshot view mode
		$(App.minimize_button).addClass("hidden"); //So that user doesn't accidentally click it in mini screenshot view mode
		screenhsotView = true;
		var files = [];
		files.push(App.argv[1]);
		App.onOpenFiles(files);
	} else {
		App.onOpenFiles(App.argv);
	}
	}
} else {
    
    var width = 1490;
    var height = 860;
    //win.resizeTo(width,height);
    //App.ready({width: width, height:height});
    openGallerySection();
}









