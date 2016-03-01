$("#playButtonFooter").on("click", function(){
    var music = $("#mediaPlayer")[0];

    if (music.paused) {
        music.play();
        $(this).removeClass('pauseButtonFooter glyphicon-pause').addClass('playButtonFooter glyphicon-play')
        //console.log("Play");
    } else {
        music.pause();
        $(this).removeClass('playButtonFooter glyphicon-play').addClass('pauseButtonFooter glyphicon-pause')
        //console.log("Pause");
    }
})