$(document).ready(function() {

    $("#playButtonFooter").on("click", function(){
        var music = $("#mediaPlayer")[0];

        if (music.paused) {
            music.play();
            $(this).removeClass('glyphicon-pause').addClass('glyphicon-play')
            //console.log("Play");
        } else {
            music.pause();
            $(this).removeClass('glyphicon-play').addClass('glyphicon-pause')
            //console.log("Pause");
        }
    })

    var duration;


    $("#mediaPlayer").on("timeupdate", function(){
        var playPercent = 100 * ($(this)[0].currentTime / duration);
        $("#playhead")[0].style.marginLeft = playPercent + "%";
    });

    $("#mediaPlayer").on("canplaythrough", function(){
        duration = $(this)[0].duration;
    });

    $("#nextButtonFooter").on("click", function(){

        //$(this).data("songid", )


    });

    $("#prevButtonFooter").on("click", function(){

    });
})