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
        // record.style.background = "red";

        stop.disabled = false;
        record.disabled = true;
      }else{
        alert("input your data!");
      } 
    }

    stop.onclick = function() {
      $(".letters").html("Saved");
      mediaRecorder.stop();
      console.log(mediaRecorder.state);
      console.log("recorder stopped");
      record.style.background = "";
      record.style.color = "";
      // mediaRecorder.requestData();

      stop.disabled = true;
      record.disabled = false;
    }

    mediaRecorder.onstop = function(e) {
      console.log("data available after MediaRecorder.stop() called.");

      const clipName = prompt('Enter a name for your sound clip?','My unnamed clip');

      const clipContainer = document.createElement('article');
      const clipLabel = document.createElement('p');
      const audio = document.createElement('audio');
      const deleteButton = document.createElement('button');

      clipContainer.classList.add('clip');
      audio.setAttribute('controls', '');
      deleteButton.textContent = 'Delete';
      deleteButton.className = 'delete';

      if(clipName === null) {
        clipLabel.textContent = 'fdsghjkdgf';
      } else {
        clipLabel.textContent = "dsjkuffghj";
      }

      clipContainer.appendChild(audio);
      clipContainer.appendChild(clipLabel);
      clipContainer.appendChild(deleteButton);
      soundClips.appendChild(clipContainer);

      audio.controls = true;
      const blob = new Blob(chunks, { 'type' : 'audio/mp3; codecs=opus' });
      chunks = [];
      const audioURL = window.URL.createObjectURL(blob);
      audio.src = audioURL;
      console.log("recorder stopped");

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

    mediaRecorder.ondataavailable = function(e) {
      chunks.push(e.data);
    }
  }

  let onError = function(err) {
    console.log('The following error occured: ' + err);
  }

  navigator.mediaDevices.getUserMedia(constraints).then(onSuccess, onError);

} else {
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


//audio recording


// Expose globally your audio_context, the recorder instance and audio_stream
// var audio_context;
// var recorder;
// var audio_stream;

// /**
//  * Patch the APIs for every browser that supports them and check
//  * if getUserMedia is supported on the browser. 
//  * 
//  */
//  if (navigator.mediaDevices.getUserMedia) {
//    console.log("success");
//  }

// function Initialize() {
//     try {
//         // Monkeypatch for AudioContext, getUserMedia and URL
//         window.AudioContext = window.AudioContext || window.webkitAudioContext;
//         navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia;
//         window.URL = window.URL || window.webkitURL;

//         // Store the instance of AudioContext globally
//         audio_context = new AudioContext;
//         console.log('Audio context is ready !');
//         console.log('navigator.getUserMedia ' + (navigator.getUserMedia ? 'available.' : 'not present!'));
//     } catch (e) {
//         alert('No web audio support in this browser!');
//     }
// }

// /**
//  * Starts the recording process by requesting the access to the microphone.
//  * Then, if granted proceed to initialize the library and store the stream.
//  *
//  * It only stops when the method stopRecording is triggered.
//  */
// function startRecording() {
//     // Access the Microphone using the navigator.getUserMedia method to obtain a stream
//     navigator.getUserMedia({ audio: true }, function (stream) {
//         // Expose the stream to be accessible globally
//         audio_stream = stream;
//         // Create the MediaStreamSource for the Recorder library
//         var input = audio_context.createMediaStreamSource(stream);
//         console.log('Media stream succesfully created');

//         // Initialize the Recorder Library
//         recorder = new Recorder(input);
//         console.log('Recorder initialised');

//         // Start recording !
//         recorder && recorder.record();
//         console.log('Recording...');

//         // Disable Record button and enable stop button !
//         document.getElementById("start-btn").disabled = true;
//         document.getElementById("stop-btn").disabled = false;
//     }, function (e) {
//         console.error('No live audio input: ' + e);
//     });
// }

// /**
//  * Stops the recording process. The method expects a callback as first
//  * argument (function) executed once the AudioBlob is generated and it
//  * receives the same Blob as first argument. The second argument is
//  * optional and specifies the format to export the blob either wav or mp3
//  */
// function stopRecording(callback, AudioFormat) {
//     // Stop the recorder instance
//     recorder && recorder.stop();
//     console.log('Stopped recording.');

//     // Stop the getUserMedia Audio Stream !
//     audio_stream.getAudioTracks()[0].stop();

//     // Disable Stop button and enable Record button !
//     document.getElementById("start-btn").disabled = false;
//     document.getElementById("stop-btn").disabled = true;

//     // Use the Recorder Library to export the recorder Audio as a .wav file
//     // The callback providen in the stop recording method receives the blob
//     if(typeof(callback) == "function"){

//         /**
//          * Export the AudioBLOB using the exportWAV method.
//          * Note that this method exports too with mp3 if
//          * you provide the second argument of the function
//          */
//         recorder && recorder.exportWAV(function (blob) {
//             callback(blob);
//             console.log("this is decleared function", blob)
//             // create WAV download link using audio data blob
//             // createDownloadLink();

//             // Clear the Recorder to start again !
//             recorder.clear();
//         }, (AudioFormat || "audio/mp3"));
//     }
// }

// // Initialize everything once the window loads
// window.onload = function(){
//     // Prepare and check if requirements are filled
//     Initialize();

//     // Handle on start recording button
//     document.getElementById("start-btn").addEventListener("click", function(){
//       var n_make = document.getElementById("car_make").value;
//       var n_model = document.getElementById("car_model").value;
//       var n_year = document.getElementById("year").value;
//       var n_code = document.getElementById("zipcode").value;
//       var n_issue = document.getElementById("suspect_issue").value;
//       if(n_make && n_model && n_year && n_code && n_issue){
//         $(".letters").html("Recording");
//         $(".pause").css("background-color", "#007bff");
//         $("#disable").css("display", "none");
//         $("#stop-btn").css("display", "block");
//         startRecording();
//         setTimeout(function(){
//           // Use wav format
//           var _AudioFormat = "audio/mp3";
  
//           var n_make = document.getElementById("car_make").value;
//           var n_model = document.getElementById("car_model").value;
//           var n_year = document.getElementById("year").value;
//           var n_code = document.getElementById("zipcode").value;
//           var n_issue = document.getElementById("suspect_issue").value;
//           // You can use mp3 to using the correct mimetype
//           //var AudioFormat = "audio/mpeg";
  
//           // upload file name 
//           var n_name = n_make + "_" + n_model + "_" + n_year + "_" + n_code + "_" + n_issue
          
//           stopRecording(function(AudioBLOB){
//               // Note:
//               // Use the AudioBLOB for whatever you need, to download
//               // directly in the browser, to upload to the server, you name it !
  
//               // In this case we are going to add an Audio item to the list so you
//               // can play every stored Audio
//               var url = URL.createObjectURL(AudioBLOB);
  
//               $("#submit").click(function(){
//                 $(".letters").html("Uploaded");
                
//                 var data = new FormData();
//                 var oReq = new XMLHttpRequest();
//                 oReq.open("POST", 'upload.php', true);
//                 oReq.onload = function (oEvent) {
//                   console.log("Here is uploaded it.")
//                 };
  
//                 var blob = AudioBLOB;
//                 // var blob = new Blob(['abc123'], {type: 'text/plain'});
//                 data.append('name', n_name);
//                 data.append('file', blob);
//                 console.log("this is my data:", data)
  
//                 oReq.send(data);
//               });
              
  
//               var li = document.createElement('li');
//               var au = document.createElement('audio');
//               var hf = document.createElement('a');
  
//               au.controls = true;
//               au.src = url;
//               hf.href = url;
//               // Important:
//               // Change the format of the file according to the mimetype
//               // e.g for audio/wav the extension is .wav 
//               //     for audio/mpeg (mp3) the extension is .mp3
//               hf.download = new Date().toISOString() + '.mp3';
//               hf.innerHTML = hf.download;
//               li.appendChild(au);
//               li.appendChild(hf);
//               recordingslist.appendChild(li);
//               $(".letters").html("Saved");
//           }, _AudioFormat);
//       },120000);
//         // alert("Recording")
//       }else{
//         alert("Please input correct date!")
//       }
//     }, false);

//     // Handle on stop recording button
//     document.getElementById("stop-btn").addEventListener("click", function(){
//         // Use wav format
//         var _AudioFormat = "audio/mp3";

//         var n_make = document.getElementById("car_make").value;
//         var n_model = document.getElementById("car_model").value;
//         var n_year = document.getElementById("year").value;
//         var n_code = document.getElementById("zipcode").value;
//         var n_issue = document.getElementById("suspect_issue").value;
//         // You can use mp3 to using the correct mimetype
//         //var AudioFormat = "audio/mpeg";

//         // upload file name 
//         var n_name = n_make + "_" + n_model + "_" + n_year + "_" + n_code + "_" + n_issue
        
//         stopRecording(function(AudioBLOB){
//             // Note:
//             // Use the AudioBLOB for whatever you need, to download
//             // directly in the browser, to upload to the server, you name it !

//             // In this case we are going to add an Audio item to the list so you
//             // can play every stored Audio
//             var url = URL.createObjectURL(AudioBLOB);

//             $("#submit").click(function(){
//               $(".letters").html("Uploaded");
              
//               var data = new FormData();
//               var oReq = new XMLHttpRequest();
//               oReq.open("POST", 'upload.php', true);
//               oReq.onload = function (oEvent) {
//                 console.log("Here is uploaded it.")
//               };

//               var blob = AudioBLOB;
//               // var blob = new Blob(['abc123'], {type: 'text/plain'});
//               data.append('name', n_name);
//               data.append('file', blob);
//               console.log("this is my data:", data)

//               oReq.send(data);
//             });
            

//             var li = document.createElement('li');
//             var au = document.createElement('audio');
//             var hf = document.createElement('a');

//             au.controls = true;
//             au.src = url;
//             hf.href = url;
//             // Important:
//             // Change the format of the file according to the mimetype
//             // e.g for audio/wav the extension is .wav 
//             //     for audio/mpeg (mp3) the extension is .mp3
//             hf.download = new Date().toISOString() + '.mp3';
//             hf.innerHTML = hf.download;
//             li.appendChild(au);
//             li.appendChild(hf);
//             recordingslist.appendChild(li);
//             $(".letters").html("Saved");
//         }, _AudioFormat);
//     }, false);
// };

!(function($) {
  "use strict";
  // type effect
  // if ($('.text-slider').length == 1) {
  //   var typed_strings = $('.text-slider-items').text();
  //   var typed = new Typed('.text-slider', {
  //     strings: typed_strings.split(','),
  //     typeSpeed: 120,
  //     loop: true,
  //     backDelay: 1100,
  //     backSpeed: 50
  //   });
  // }

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



  var status = "c_make";
  // $.ajax({
  //   url:"dropdown.php",    //the page containing php script
  //   type: "post",    //request type,
  //   dataType: 'json',
  //   data: {id: "id", status:status},
  //     success:function(result){
  //       $('#car_make').html(result);
  //        console.log(result);
  //       var status = 'c_model';
        
  //     }
  // });
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