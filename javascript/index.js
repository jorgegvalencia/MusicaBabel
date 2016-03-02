// ------------------------------------ Funciones
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
                html += "<div class='col-xs-6 col-sm-5 col-md-5 col-lg-5 col-md-offset-2 col-lg-offset-2'>";
                html += "<ul>";
                html += "<li>Artista: " + artista + "</li>";
                html += "<li>Canción: " + titulo + "</li>";
                html += "</ul>";
                html += "</div>";
                html += "<div class='col-xs-5 col-sm-6 col-md-2 col-lg-2'>";
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
    $('#mediaPlayer').trigger('play'); // reproduce la cancion
    // cambiar la clase de los demas iconos a play
    $('.pause-button').addClass('play-button glyphicon-play').removeClass('pause-button glyphicon-pause');
    $('#playButtonFooter').addClass('glyphicon-pause').removeClass('glyphicon-play');
    // cambiar manejador a traves de la clase
    $(button).removeClass('play-button glyphicon-play').addClass('pause-button glyphicon-pause');
}

function pauseSong(button) {
    $('#mediaPlayer').trigger('pause');
    paused = $(this).data().songid;
    $('#playButtonFooter').addClass('glyphicon-play').removeClass('glyphicon-pause');
    $(button).removeClass('pause-button glyphicon-pause').addClass('play-button glyphicon-play');
}

// Crear cancion
function createSong(artista, titulo, url) {
    // Petición ajax al servidor (no olvidar ejecutar server.py)
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
        },
        error: function() {
            console.log("No se pudo editar la cancion");
        }
    });
}

function showForm() {
    $(".form").slideDown('200');
}

function hideForm() {
    // resetear campos del formulario
    $('.form').trigger('reset');
    $(".form").slideUp('200');
}

function showFormEditSong(button) {
    var id = $(button).data("songid");
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

// Editar cancion
$(document).ready(function() { // Cuando la página se ha cargado por completo

    // --------------------------------- Manejadores de evento

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
                    bufferSong(data);
                    playSong(self);
                } else {
                    if (paused == data.id) { // si ya esta cargada la cancion actual
                        playSong(self);
                    } else { // si hay que sobreescribir la cancion
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
        $('#addSongButton').addClass('cancel-button btn-danger').removeClass('add-button btn-info');
        if ($('#submitButton').hasClass('create-song')) {
            $("#submitButton").addClass('edit-song').removeClass('create-song').html('Editar');
            $("#submitButton").data('songid', id);
        }
    })

    // Botón de editar activo
    $("main").on('click', '.edit-button-current', function() {
        var self = this; // this referencia al elemento del DOM button
        console.log("Estableciendo manejador de edicion", this);
        var id = $(self).data("songid");
        hideForm();
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
    })

    // Botón de enviar formulario
    $("form").on("submit", function() {
        // comprobar si estamos añadiendo u editando
        if (validateForm()) {
            if ($(this).hasClass('create-song')) {
                createSong(artista, titulo, url);
            } else {
                editSong();
            }
        }
        return false; // Jquery cancela el envio del formulario (prevent default)
    });

    // -------------------------------------------- Ejecución
    var paused = null;
    var currentForm = null;
    $(".form").hide();
    loadSongs();
});
