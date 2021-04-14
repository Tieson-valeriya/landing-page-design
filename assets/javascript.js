!(function($) {
  "use strict";
  // type effect
  if ($('.text-slider').length == 1) {
    var typed_strings = $('.text-slider-items').text();
    var typed = new Typed('.text-slider', {
      strings: typed_strings.split(','),
      typeSpeed: 120,
      loop: true,
      backDelay: 1100,
      backSpeed: 50
    });
  }

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


  $("#year").change(function(){
    console.log(this.value);
  });


  var status = "log";
  $.ajax({
    url:"dropdown.php",    //the page containing php script
    type: "post",    //request type,
    dataType: 'json',
    data: {id: "id", status:status},
    success:function(result){

    }
  });

})(jQuery);