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
                    html += "<div class='col-xs-3'>";
                    html += "<ul>";
                    html += "<li>Artista: " + artista + "</li>";
                    html += "<li>Canción: " + titulo + "</li>";
                    html += "</ul>";
                    html += "</div>";
                    html += "<div class='col-xs-6'>";
                    html += "<div class='control-buttons'>";
                    html += "<button data-songid='"+ id + "' class='glyphicon glyphicon-play play-button'></button>";
                    html += "<button data-songid='"+ id + "' class='glyphicon glyphicon-pencil edit-button'></button>";
                    html += "<button data-songid='"+ id + "' class='glyphicon glyphicon-trash delete-button'></button>";
                    html += "</div>";
                    html += "</div>";
                    html += "</article>";
                }
                $("main").html(html);
            },
            error: function() {
                $("main").html("Error al cargar las canciones");
            }
        });
    } //loadSongs()

    // Manejadores de evento

    $("main").on('click', '.play-button', function() {
        var self = this; // this referencia al elemento del DOM button
        var id = $(self).data("songid");
        console.log("Evento añadido");
        $.ajax({
            // cambiar la source del reproductor
            url: '/api/canciones/' + id,
            type: 'get',
            success: function(data) {
                console.log("Reproduciendo cancion");
                var html = "";
                html += "<source src='" + data.url + "'>"
                $('#mediaPlayer').html(html); // asigna la source de la cancion
                $(self).trigger('play');
                // cambiar manejador
            },
            error: function(data) {
                console.log("Error al reproducir la canción", data);
            }
        });
    })

    $(".stop-button")

    // Ejecución

    loadSongs();

});
