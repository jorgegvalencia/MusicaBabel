$(document).ready(function() { // Cuando la página se ha cargado por completo

    // Funciones
    function loadSongs() {
        $.ajax({
            url: '/api/canciones',
            type: 'get',
            success: function(data) {
                console.log("loading songs");
                var html = "";
                for (var i in data) {
                    var id = data[i].id; // id de la cancion
                    var artista = data[i].artista; // nombre del artista
                    var titulo = data[i].titulo; // nombre de la canción
                    var url = data[i].url; // url de la canción
                    html += "<article class='music item'>";
                    html += "<div class='row'>"
                    html += "<div class='col-xs-6 col-sm-3 col-md-2 col-lg-2 col-md-offset-2 col-lg-offset-2'>";
                    html += "<ul>";
                    html += "<li>Artista: " + artista + "</li>";
                    html += "<li>Canción: " + titulo + "</li>";
                    html += "</ul>";
                    html += "</div>";
                    html += "<div class='col-xs-5 col-sm-8 col-md-5 col-lg-5'>";
                    html += "<div class='control-buttons btn-group'>";
                    html += "<button data-songid='"+ id + "' class='glyphicon glyphicon-play play-button btn btn-primary btn-sm' type='button'></button>";
                    html += "<button data-songid='"+ id + "' class='glyphicon glyphicon-pencil edit-button btn btn-info btn-sm' type='button'></button>";
                    html += "<button data-songid='"+ id + "' class='glyphicon glyphicon-trash delete-button btn btn-danger btn-sm' type='button'></button>";
                    html += "</div>";
                    html += "</div>";
                    html += "</article>";
                }
                $("#listadoCanciones").html(html);
            },
            error: function() {
                $("#listadoCanciones").html("Error al cargar las canciones");
            }
        });
    } //loadSongs()

    // Cargar nueva cancion

    function loadSong(data) {
        var html = "";
        html += "<source src='" + data.url + "'>";
        $('#mediaPlayer').html(html); // asigna la source de la cancion
        $('#mediaPlayer').trigger('load'); // carga la cancion
    }

    function playSong(button) {
        console.log("Reproduciendo cancion");
        $('#mediaPlayer').trigger('play'); // reproduce la cancion
        // cambiar la clase de los demas iconos a play
        $('.pause-button').addClass('play-button glyphicon-play').removeClass('pause-button glyphicon-pause');
        // cambiar manejador a traves de la clase
        $(button).removeClass('play-button glyphicon-play').addClass('pause-button glyphicon-pause');
    }

    // Manejadores de evento

    // Boton de reproducción
    $("main").on('click', '.play-button', function() {
        var self = this; // this referencia al elemento del DOM button
        var id = $(self).data("songid");
        console.log("Evento añadido");
        $.ajax({
            // cambiar la source del reproductor
            url: '/api/canciones/' + id,
            type: 'get',
            success: function(data) {
                // si el reproductor no esta reproduciendo ninguna cancion
                if (paused == null) {
                    loadSong(data);
                    playSong(self);
                } else {
                    if (paused == data.id) { // si ya esta cargada la cancion actual
                        playSong(self);
                    } else { // si hay que sobreescribir la cancion
                        loadSong(data);
                        paused = data.id; // nueva cancion
                        playSong(self);
                    }
                }
            },
            error: function(data) {
                console.log("Error al reproducir la canción", data);
            }
        });
    })

    // Botón de pausa
    $("main").on('click', '.pause-button', function() {
        console.log("Estableciendo manejador de stop");
        $('#mediaPlayer').trigger('pause');
        paused = $(this).data().songid;
        console.log(paused);
        $(this).removeClass('pause-button glyphicon-pause').addClass('play-button glyphicon-play');
    })

    // Ejecución

    var paused = null;

    loadSongs();

});
