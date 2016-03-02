$(document).ready(function() {

    $("#playButtonFooter").on("click", function(){
        var music = $("#mediaPlayer")[0];

        if (music.paused) {
            music.play();
            $(this).addClass('glyphicon-pause').removeClass('glyphicon-play')
            //console.log("Play");
        } else {
            music.pause();
            $(this).addClass('glyphicon-play').removeClass('glyphicon-pause')
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

    $("#mediaPlayer").on("ended", function(){
        $(this).trigger('play');
    });

    $("#nextButtonFooter").on("click", function(){

        //$(this).data("songid", )


    });

    $("#prevButtonFooter").on("click", function(){

    });
})