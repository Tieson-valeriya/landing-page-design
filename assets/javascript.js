// set up basic variables for app

const record = document.querySelector('#start-btn');
const stop = document.querySelector('#stop-btn');
const soundClips = document.querySelector('#recordingslist');
const mainSection = document.querySelector('.main-controls');

// disable stop button while not recording

stop.disabled = true;

// visualiser setup - create web audio api context and canvas

let audioCtx;
// const canvasCtx = canvas.getContext("2d");

//main block for doing the audio recording

if (navigator.mediaDevices.getUserMedia) {
  console.log('getUserMedia supported.');

  const constraints = { audio: true };
  let chunks = [];

  let onSuccess = function(stream) {
    const mediaRecorder = new MediaRecorder(stream);

    visualize(stream);

    record.onclick = function() {
      var n_make = document.getElementById("car_make").value;
      var n_model = document.getElementById("car_model").value;
      var n_year = document.getElementById("year").value;
      var n_code = document.getElementById("zipcode").value;
      var n_issue = document.getElementById("suspect_issue").value;

      if(n_make && n_model && n_year && n_code && n_issue){
        $(".letters").html("Recording");
        $(".pause").css("background-color", "#007bff");
        $("#disable").css("display", "none");
        $("#stop_btn").css("display", "block");
        mediaRecorder.start();
        console.log(mediaRecorder.state);
        console.log("recorder started");

        setTimeout(function() {
          
          mediaRecorder.stop();
          console.log(mediaRecorder.state);
          console.log("recorder stopped");
          // mediaRecorder.requestData();

          stop.disabled = true;
          record.disabled = false;
          
          mediaRecorder.onstop = function(AudioBLOB) {
          
            console.log("data available after MediaRecorder.stop() called.");
      
            const clipContainer = document.createElement('article');
            const clipLabel = document.createElement('p');
            const audio = document.createElement('audio');
            const deleteButton = document.createElement('button');
      
            clipContainer.classList.add('clip');
            audio.setAttribute('controls', '');
            deleteButton.textContent = 'Delete';
            deleteButton.className = 'delete';
            clipLabel.textContent = "clipname";
      
            clipContainer.appendChild(audio);
            clipContainer.appendChild(clipLabel);
            clipContainer.appendChild(deleteButton);
            soundClips.appendChild(clipContainer);
      
            audio.controls = true;
            const blob = new Blob(chunks, { 'type' : 'audio/mp3; codecs=opus' });
            console.log(blob);
            chunks = [];
            const audioURL = window.URL.createObjectURL(blob);
            audio.src = audioURL;
            audio.download = "akfjlajfkdl";
            console.log("recorder stopped");
      
            $("#submit").click(function(){
              var n_make = document.getElementById("car_make").value;
              var n_model = document.getElementById("car_model").value;
              var n_year = document.getElementById("year").value;
              var n_code = document.getElementById("zipcode").value;
              var n_issue = document.getElementById("suspect_issue").value;
      
              var n_name = n_make + "_" + n_model + "_" + n_year + "_" + n_code + "_" + n_issue;
              $(".letters").html("Uploaded");
              
              var data = new FormData();
              var oReq = new XMLHttpRequest();
              oReq.open("POST", 'upload.php', true);
              oReq.onload = function () {
                console.log("Here is uploaded it.")
              };
      
              chunks = [];
              console.log(blob);
              data.append('name', n_name);
              data.append('file', blob);
              console.log("this is my data:", data)
      
              oReq.send(data);
            });
          }
          $(".letters").html("Saved");
        }, 5000);
      }else{
        alert("input your data!");
      } 
    }

    stop.onclick = function() {
      
      mediaRecorder.stop();
      console.log(mediaRecorder.state);
      console.log("recorder stopped");
      record.style.background = "";
      record.style.color = "";
      // mediaRecorder.requestData();

      stop.disabled = true;
      record.disabled = false;

      mediaRecorder.onstop = function() {
      
        console.log("data available after MediaRecorder.stop() called.");
  
        const clipContainer = document.createElement('article');
        const clipLabel = document.createElement('p');
        const audio = document.createElement('audio');
        const deleteButton = document.createElement('button');
  
        clipContainer.classList.add('clip');
        audio.setAttribute('controls', '');
        deleteButton.textContent = 'Delete';
        deleteButton.className = 'delete';
        clipLabel.textContent = "clipname";
  
        clipContainer.appendChild(audio);
        clipContainer.appendChild(clipLabel);
        clipContainer.appendChild(deleteButton);
        soundClips.appendChild(clipContainer);
  
        audio.controls = true;
        const blob = new Blob(chunks, { 'type' : 'audio/mp3; codecs=opus' });
        chunks = [];
        const audioURL = window.URL.createObjectURL(blob);
        audio.src = audioURL;
        audio.download = "akfjlajfkdl";
        console.log("recorder stopped");
  
        $("#submit").click(function(){
          var n_make = document.getElementById("car_make").value;
          var n_model = document.getElementById("car_model").value;
          var n_year = document.getElementById("year").value;
          var n_code = document.getElementById("zipcode").value;
          var n_issue = document.getElementById("suspect_issue").value;
  
          var n_name = n_make + "_" + n_model + "_" + n_year + "_" + n_code + "_" + n_issue;
          $(".letters").html("Uploaded");
          
          var data = new FormData();
          var oReq = new XMLHttpRequest();
          oReq.open("POST", 'upload.php', true);
          oReq.onload = function () {
            console.log("Here is uploaded it.")
          };
  
          // audio.controls = true;
          // const blob = AudioBLOB;
          // const blob = new Blob(chunks, { 'type' : 'audio/mp3; codecs=opus' });
          // chunks = [];
          console.log(blob);
          data.append('name', n_name);
          data.append('file', blob);
          console.log("this is my data:", data)
  
          oReq.send(data);
        });
  
        deleteButton.onclick = function(e) {
          let evtTgt = e.target;
          evtTgt.parentNode.parentNode.removeChild(evtTgt.parentNode);
        }
  
        clipLabel.onclick = function() {
          const existingName = clipLabel.textContent;
          const newClipName = prompt('Enter a new name for your sound clip?');
          if(newClipName === null) {
            clipLabel.textContent = "adfasdfdasf";
          } else {
            clipLabel.textContent = "gdghfhgfhfhgfhgfhg";
          }
        }
      }
      $(".letters").html("Saved");
    }

    

    mediaRecorder.ondataavailable = function(AudioBLOB) {
      chunks.push(AudioBLOB.data);
    }
  }

  let onError = function(err) {
    console.log('The following error occured: ' + err);
  }

  navigator.mediaDevices.getUserMedia(constraints).then(onSuccess, onError);

}else {
   console.log('getUserMedia not supported on your browser!');
}

function visualize(stream) {
  if(!audioCtx) {
    audioCtx = new AudioContext();
  }

  const source = audioCtx.createMediaStreamSource(stream);

  const analyser = audioCtx.createAnalyser();
  analyser.fftSize = 2048;
  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);

  source.connect(analyser);
  //analyser.connect(audioCtx.destination);
}


!(function($) {
  "use strict";
  
  // Init AOS
  function aos_init() {
    AOS.init({
      duration: 1000,
      once: true
    });
  }
  $(window).on('load', function() {
    aos_init();
  });


  var status = "c_model";
  
  $("#car_make").change(function(){
    var make = $("#car_make").val();
    $.ajax({
      url:"dropdown.php",    //the page containing php script
      type: "post",    //request type,
      dataType: 'json',
      data: {id: "id", status:'c_model',make:make},
        success:function(result){
          var model_select = '';
          var model_txt = '';
          for(var i=0; i<result.length; i++){
            model_select += '<option selected>'+result[i]+'</option>';
              model_txt += '<a tabindex="0" class="dropdown-item selected active" data-original-index="'+i+'"><span class="dropdown-item-inner " data-tokens="null" role="option" tabindex="0" aria-disabled="false" aria-selected="true"><span class="text">'+result[i]+'</span><span class="fa fa-check check-mark"></span></span></a>';
          }

          $("#car_model").html(model_select);
          $("#car_model").parent().find("#dropdown-div").html(model_txt);
          $("#car_model").parent().find("#dropdown-div").find("a:first-child").click();
        }
    });
  });

})(jQuery);