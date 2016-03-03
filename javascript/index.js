// var songsIndex = new Array();

// ------------------------------------ Funciones
function loadSongs() {
    $.ajax({
        url: '/api/canciones',
        type: 'get',
        success: function(data) {
            console.log("loading songs");
            var html = "";
            // songsIndex = [];
            for (var i in data) {
                // songIndex.push(i);
                var id = data[i].id; // id de la cancion
                var artista = data[i].artista; // nombre del artista
                var titulo = data[i].titulo; // nombre de la canción
                var url = data[i].url; // url de la canción
                html += "<article class='music item' data-song-id='"+ id +"'>";
                html += "<div class='row'>"
                html += "<div class='hidden-xs col-sm-1 col-md-2 col-lg-2'>";
                html += "<span class='playingIndicator' data-song-id='"+ id +"'>";
                html += "</div>";
                html += "<div class='col-xs-6 col-sm-5 col-md-5 col-lg-5 col-md-offset-2 col-lg-offset-2'>";
                html += "<ul>";
                html += "<li>Artista: " + artista + "</li>";
                html += "<li>Canción: " + titulo + "</li>";
                html += "</ul>";
                html += "</div>";
                html += "<div class='col-xs-4 col-sm-6 col-md-2 col-lg-2'>";
                html += "<div class='control-buttons btn-group'>";
                html += "<button data-songid='" + id + "' class='glyphicon glyphicon-play play-button btn btn-primary' type='button'></button>";
                html += "<button data-songid='" + id + "' class='glyphicon glyphicon-pencil edit-button btn btn-info btn-sm other-button' type='button'></button>";
                html += "<button data-songid='" + id + "' class='glyphicon glyphicon-trash delete-button btn btn-danger btn-sm other-button' type='button'></button>";
                html += "</div>";
                html += "</div>";
                html += "<div data-songid='" + id + "' class='edit-form col-xs-12 col-sm-12 col-md-12 col-lg-12' style='background-color: azure'></div>";
                html += "</article>";
            }
            $("#listadoCanciones").html(html);
        },
        error: function() {
            $("#listadoCanciones").html("Error al cargar las canciones");
        }
    });
} //loadSongs()

// Cargar nueva cancion en el reproductor
function bufferSong(data) {
    var html = "";
    html += "<source src='" + data.url + "'>";
    $('#mediaPlayer').html(html); // asigna la source de la cancion
    $('#mediaPlayer').trigger('load'); // carga la cancion
}

// Reproducir cancion
function playSong(button) {
    console.log("Reproduciendo cancion");
    $("#playButtonFooter").prop('disabled', false);
    $('#mediaPlayer').trigger('play'); // reproduce la cancion
    // cambiar la clase de los demas iconos a play
    $('.pause-button').addClass('play-button glyphicon-play').removeClass('pause-button glyphicon-pause');
    $('#playButtonFooter').addClass('glyphicon-pause').removeClass('glyphicon-play');
    // cambiar manejador a traves de la clase
    $(button).removeClass('play-button glyphicon-play').addClass('pause-button glyphicon-pause');
}

function pauseSong(button) {
    $('#mediaPlayer').trigger('pause');
    paused = $(button).data().songid;
    // console.log(paused);
    $('#playButtonFooter').addClass('glyphicon-play').removeClass('glyphicon-pause');
    $(button).removeClass('pause-button glyphicon-pause').addClass('play-button glyphicon-play');
}

// Crear cancion
function createSong() {
    // Petición ajax al servidor (no olvidar ejecutar server.py)
    //     var id = $('#submitButton').data("songid");
    var artista = $.trim($("#artista").val());
    var titulo = $.trim($("#titulo").val());
    var url = $.trim($("#url").val());
    $.ajax({
        method: 'POST',
        url: "/api/canciones/",
        data: JSON.stringify({
            artista: artista,
            titulo: titulo,
            url: url,
        }),
        contentType: 'application/json',
        success: function() { // Success function
            alert("Guardado con éxito!");
            hideForm();
        },
        error: function() { // Error function
            alert("Se ha producido un error");
        }
    });
    loadSongs();
}

// Eliminar cancion
function deleteSong(button) {
    var id = $(button).data("songid");
    $.ajax({
        url: 'api/canciones/' + id,
        type: 'delete',
        success: function() {
            // eliminar cancion del main y recargar
            $(button).parent().remove();
            loadSongs();
        },
        error: function() {
            console.log("No se pudo eliminar la cancion");
        }
    });
}

function editSong() {
    // peticion get para recuperar datos de la cancion
    // traer formulario al main y rellenar inputs con los datos de la cancion
    var id = $('#submitButton').data("songid");
    var artista = $.trim($("#artista").val());
    var titulo = $.trim($("#titulo").val());
    var url = $.trim($("#url").val());
    $.ajax({
        url: 'api/canciones/' + id,
        type: 'put',
        contentType: 'application/json',
        data: JSON.stringify({
            titulo: titulo,
            artista: artista,
            url: url
        }),
        success: function() {
            // eliminar cancion del main y recargar
            // $(button).parent().remove();
            loadSongs();
            hideForm();
        },
        error: function() {
            console.log("No se pudo editar la cancion");
        }
    });
}

function showForm() {
    $(".form").slideDown('200');
    $('#addSongButton').addClass('cancel-button btn-danger').removeClass('add-button btn-info');
    $(window).scrollTop(0);
}

function hideForm() {
    // resetear campos del formulario
    $('.form').trigger('reset');
    $(".form").slideUp('200');
    $('#addSongButton').addClass('add-button btn-info').removeClass('cancel-button btn-danger');
}

function showFormEditSong(button) {
    var id = $(button).data("songid");
    $('.music.item').removeClass('currentEditing');
    $('.container').find('.music.item[data-songid="'+ id +'"]').addClass('currentEditing');
    $.ajax({
        // pedir datos de la cancion
        url: '/api/canciones/' + id,
        type: 'get',
        success: function(data) {

            // cargar campos del formulario con los datos recibidos
            var artista = $.trim(data.artista);
            var titulo = $.trim(data.titulo);
            var url = $.trim(data.url);

            $("#artista").val(artista);
            $("#titulo").val(titulo);
            $("#url").val(url);

            // mostrar formulario
            showForm();
        },
        error: function(data) {
            console.log("Error al solicitar la canción");
        }
    });
}

function validateForm() {
    // Campos del formulario
    var artista = $.trim($("#artista").val());
    var titulo = $.trim($("#titulo").val());
    var url = $.trim($("#url").val());

    // Patrón para la url
    var pattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/ig

    // Validación de campos
    if (artista == "") {
        alert("El artista no puede ser vacío");
        return false;
    }
    if (titulo == "") {
        alert("El titulo no puede ser vacío");
        return false;
    }
    if (url == "" && pattern.test(url) == false) {
        alert("La URL de la carátula no es válida");
        return false;
    }
    return true;
}

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

// Editar cancion
$(document).ready(function() { // Cuando la página se ha cargado por completo

    // --------------------------------- Manejadores de evento

    // Boton de reproducción
    $("main").on('click', '.play-button', function() {
        var self = this; // this referencia al elemento del DOM button
        var id = $(self).data("songid");
        $('.playingIndicator').removeClass('glyphicon glyphicon-volume-up');
        $('.container').find('.playingIndicator[data-songid="'+ id +'"]').addClass('glyphicon glyphicon-volume-up');
        console.log("Evento añadido");
        $.ajax({
            url: '/api/canciones/' + id,
            type: 'get',
            success: function(data) {
                // si el reproductor no esta reproduciendo ninguna cancion
                if (paused == null) {
                    // cambiar la source del reproductor
                    bufferSong(data);
                    paused = data.id; // nueva cancion
                    playSong(self);
                } else {
                    if (paused == data.id) { // si ya esta cargada la cancion actual
                        playSong(self);
                    } else { // si hay que sobreescribir la cancion
                        // cambiar la source del reproductor
                        bufferSong(data);
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

    // Botón custom de reproducción
    $("#playButtonFooter").on("click", function() {
        var music = $("#mediaPlayer")[0];
        var self = this;
        $(this).data('songid',paused);
        var currentSong = $(this).data('songid');
        console.log(currentSong);
        // console.log($(this).data('songid'));
        if (music.paused) {
            // music.play();
            playSong(self);
            console.log( currentSong );
            $('.play-button[data-songid='+currentSong+']')
            .addClass('pause-button glyphicon-pause').removeClass('play-button glyphicon-play');
                //console.log("Play");
        } else {
            // music.pause();
            pauseSong(self);
            $('.pause-button')
            .addClass('play-button glyphicon-play').removeClass('pause-button glyphicon-pause');
            // $(this).addClass('glyphicon-play').removeClass('glyphicon-pause')
                //console.log("Pause");
        }
    })

    // Botón de pausa
    $("main").on('click', '.pause-button', function() {
        console.log("Estableciendo manejador de stop");
        pauseSong(this);
    })

    // Botón de eliminar
    $("main").on('click', '.delete-button', function() {
        var self = this; // this referencia al elemento del DOM button
        console.log("Eliminado cancion");
        if (confirm("¿Estás seguro de que quieres eliminar esta canción?") == true)
            deleteSong(self);
    })

    // Botón de editar
    $("main").on('click', '.edit-button', function() {
        var self = this; // this referencia al elemento del DOM button
        console.log("Estableciendo manejador de edicion");
        var id = $(self).data("songid");
        showFormEditSong(self);
        $('.edit-button-current').addClass('edit-button').removeClass('edit-button-current');
        $(this).addClass('edit-button-current').removeClass('edit-button');
        // $('#addSongButton').addClass('cancel-button btn-danger').removeClass('add-button btn-info');
        $("#submitButton").removeData();
        $("#submitButton").addClass('edit-song').removeClass('create-song').html('Editar');
        $("#submitButton").data('songid', id);
    })

    // Botón de editar activo
    $("main").on('click', '.edit-button-current', function() {
        var self = this; // this referencia al elemento del DOM button
        console.log("Estableciendo manejador de edicion", this);
        var id = $(self).data("songid");
        hideForm();
        $('.container').find('.music.item[data-songid="'+ id +'"]').addClass('currentEditing');
        $('#addSongButton').addClass('add-button btn-info').removeClass('cancel-button btn-danger');
        $(this).addClass('edit-button').removeClass('edit-button-current');
        $('#submitButton').addClass('create-song').removeClass('edit-song').removeData().html('Guardar');
    })

    // Botón de añadir cancion
    $('header').on('click', '.add-button', function() {
        showForm();
        console.log("Mostrando formulario");
        $(this).addClass('cancel-button btn-danger').removeClass('add-button btn-info');
        $('#submitButton').addClass('create-song').removeClass('edit-song').removeData().html('Guardar');
    })

    // Botón de cancelar entrada al formulario
    $('header').on('click', '.cancel-button', function() {
        hideForm();
        console.log("Escondiendo formulario");
        $(this).addClass('add-button btn-info').removeClass('cancel-button btn-danger');
        $('.container').find('.music.item').addClass('currentEditing');
    })

    // Botón de enviar formulario
    $("form").on("submit", function() {
        // comprobar si estamos añadiendo u editando
        if (validateForm()) {
            if ($('#submitButton').hasClass('create-song')) {
                createSong();
            } else {
                editSong();
            }
        }
        return false; // Jquery cancela el envio del formulario (prevent default)
    });

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

    // -------------------------------------------- Ejecución
    var duration;
    var paused = null;
    $("#playButtonFooter").prop('disabled', true);
    $(".form").hide();
    loadSongs();
});
