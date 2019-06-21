document.getElementById("loading").style.display = "none";

var upic = document.getElementById('upic');

//Attendance configurations
var camBtn1 = document.getElementById('cambtn1');
var img1 = document.getElementById('image-block1');
var canvas1 = document.getElementById('canvas1');
var video1 = document.getElementById('video1');

camBtn1.addEventListener("click", function(){
  camOperations(video1,canvas1,camBtn1,img1);
  upic1.value = img1.src;
});


//Attendance configurations
var camBtn2 = document.getElementById('cambtn2');
var canvas2 = document.getElementById('canvas2');
var video2 = document.getElementById('video2');
var img2 = document.getElementById('image-block2');   

img1.setAttribute("src"," ");
img2.setAttribute("src"," ");

camBtn2.addEventListener("click", function(){
  camOperations(video2,canvas2,camBtn2,img2);
  upic.value = img2.src;
});

function camOperations(video,canvas,camBtn,img){
  if(video.srcObject){
    const ctx = canvas.getContext('2d'); 
    canvas.width = video.videoWidth; 
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0,0);
    convertCanvasToImage(canvas,img);
    stopStreamedVideo(video);
    video.setAttribute('poster',canvas.toDataURL('image/jpeg', 1.0));
    camBtn.innerHTML = 'Re Capture';
  }
  else{
      if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: true }).then(function(stream) {
            camBtn.innerHTML = 'Capture';
            video.srcObject = stream;
            video.play();
        });
      }
  }
}

function convertCanvasToImage(canvas,img) {
  img.src = canvas.toDataURL('image/jpeg', 1.0);
}

function stopStreamedVideo(videoElem) {
  let stream = videoElem.srcObject;
  let tracks = stream.getTracks();
  tracks.forEach(function(track) {
    track.stop();
  });
  videoElem.srcObject = null;
}


$(document).ready(function(){

    $('#atwarn').hide();
    $('#attnbtn').click(function(e) {
        var aval =  $('#upic1').val(); 
        if((aval=='no1') || ($('#cambtn1').text() != 'Re Capture')){
            $('#atwarn').fadeIn();
            setTimeout(function(){$('#atwarn').fadeOut(3000);},3000);
        } 
        else{
            $('#atwarn').fadeOut(3000);
            $('#usatcourses').val($('#uscourses').val());
            var config = {
              api_key : 'GkkMaojxuBxJy0Jzcuj7-xP3imkzJlPo',
              api_secret : 'X8N4wovdh1F09pVIm-nldNGiUDtBzTFv',
              image_base64 : aval
            }
            document.getElementById("loading").style.display = "block";
            $.ajax({
              type: "POST",
              url: "https://api-us.faceplusplus.com/facepp/v3/detect",
              data: config,
              success: function (data, status, jqXHR) {
                if (Array.isArray(data.faces) && data.faces.length) {
                      $('#atoken').val(data.faces[0].face_token);
                      if($('#atoken').val() != ''){
                        document.getElementById("usearch").submit();
                      }
                 }
                 else{
                      $('#atwarn').text('Oops! Your face is not captured properly, Kindly retake.'); 
                      $('#atwarn').fadeIn();
                      document.getElementById("loading").style.display = "none";
                      setTimeout(function(){$('#atwarn').fadeOut(3000);},3000);
                 }
              }
            });
            
        } 
        
    });


    $('#rgwarn').hide();
    $('#uregform').submit(function(e) {
        e.preventDefault();
        var val =  $('#upic').val(); 
        if(val=='no'){
            $('#rgwarn').fadeIn();
            setTimeout(function(){$('#rgwarn').fadeOut(3000);},3000);
            $('html, body').animate({scrollTop: $('#register').offset().top}, 'slow');
            return false;
        } 
        else{
          var config = {
            api_key : 'GkkMaojxuBxJy0Jzcuj7-xP3imkzJlPo',
            api_secret : 'X8N4wovdh1F09pVIm-nldNGiUDtBzTFv',
            image_base64 : val
          }
          document.getElementById("loading").style.display = "block";
          $.ajax({
            type: "POST",
            url: "https://api-us.faceplusplus.com/facepp/v3/detect",
            data: config,
            success: function (data, status, jqXHR) {
              if (Array.isArray(data.faces) && data.faces.length) {
                  $('#utoken').val(data.faces[0].face_token);
                  if($('#utoken').val() != ''){
				            $('#uregform').unbind('submit').submit();
                    return true;
                  }
                  
               }
               else{
                  $('#rgwarn').fadeIn();
                  $('#rgwarn').text('Oops! Your face is not captured properly, Kindly retake.'); 
                  setTimeout(function(){$('#rgwarn').fadeOut(3000);},8000);
                  document.getElementById("loading").style.display = "none";
                  $('html, body').animate({scrollTop: $('#register').offset().top}, 'slow');
                  return false;
               }
            }
          }); 
          
        }    
    });


})
    


























