function clickPercent(evt) {
    var timelineWidth = $("#timeline").width();
    var timeline = $("#timeline");
    var percent = ((evt.pageX - timeline.offset().left - 7.5) / timelineWidth);

    console.log("Click en porciento de cancion: ",percent);
    if(percent > 1){
        return 1;
    }
    else if(percent < 0){
        return 0;
    }
    else{
        return percent;
    }
}

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

    //Makes timeline clickable
    $("#timeline").on("click", function(evt){
        var tracktime = duration * clickPercent(evt);
        if(!isNaN(tracktime)){
            $("#mediaPlayer")[0].currentTime = tracktime;
            console.log("duracion * clickPercent", tracktime);
        };
    });
});