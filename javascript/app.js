// ------------------------------ Variables ------------------------------

var songsIndex = [];
var duration;
var currentSong = null;

// ------------------------------ Funciones ------------------------------

// Cargar todas las canciones existentes en el DOM
function loadSongs() {
    $.ajax({
        url: '/api/canciones',
        type: 'get',
        success: function(data) {

            var iteracion = 0;
            console.log("loading songs");
            var html = "";
            // var iteracion = 0;
            $('#listadoCanciones').append(html);
            songsIndex = [];

            if(data.length <= 0){
                html = "<h2 class='animated zoomInDown'> Añade tus canciones </h2>";
            } 
            else{
                html = "<h2> Tus canciones </h2>";
            }
            for (var i in data) {
                // html = "";
                var id = data[i].id; // id de la cancion
                var artista = data[i].artista; // nombre del artista
                var titulo = data[i].titulo; // nombre de la canción
                var url = data[i].url; // url de la canción
                songsIndex.push(id);
                html += "<article class='music item animated fadeInUp' data-songid='" + id + "'>";
                html += "<div class='row'>"
                html += "<div class='hidden-xs col-sm-1 col-md-2 col-lg-2'>";
                html += "<span class='playingIndicator' data-songid='" + id + "'>";
                html += "</div>";
                html += "<div class='col-xs-6 col-sm-4 col-md-5 col-lg-5'>";
                html += "<ul>";
                html += "<li><span class='glyphicon glyphicon-user'> <i>Artista - </i> " + artista + "</li>";
                html += "<li><span class='glyphicon glyphicon-equalizer'> <i>Canción - </i> " + titulo + "</li>";
                html += "</ul>";
                html += "</div>";
                html += "<div class='col-xs-4 col-sm-6 col-md-2 col-lg-2'>";
                html += "<div class='control-buttons btn-group'>";
                html += "<button data-songid='" + id + "' class='glyphicon glyphicon-play play-button btn btn-primary' type='button'></button>";
                html += "<button data-songid='" + id + "' class='glyphicon glyphicon-pencil edit-button btn btn-info btn-sm other-button' type='button'></button>";
                html += "<button data-songid='" + id + "' class='glyphicon glyphicon-trash delete-button btn btn-danger btn-sm other-button' type='button'></button>";
                html += "</div>";
                html += "</div>";
                html += "</article>";
                // setTimeout( function () {
                //     $('#listadoCanciones').append(html);
                // }, iteracion*125);
                // iteracion++;
            }
            $('#listadoCanciones').html(html);
            console.log(songsIndex);
        },
        error: function() {
            $("#listadoCanciones").html("Error al cargar las canciones");
        }
    });
}

// Pedir cancion a la api
// function getSong(songid) {
//     $.ajax({
//         url: '/api/canciones/' + songid,
//         type: 'get',
//         success: function(data) {
//             return data;
//         },
//         error: function() {
//             console.log('Error al solicitar la cancion');
//             return null;
//         }
//     })
// }

// Crea una nueva canción
function createSong() {
    // tomamos los valores del formulario
    var artista = $.trim($("#artista").val());
    var titulo = $.trim($("#titulo").val());
    var url = $.trim($("#url").val());

    // validar el formulario
    if (validateForm()) {
        // enviamos la peticion de creacion
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
                loadSongs();
            },
            error: function() { // Error function
                alert("Se ha producido un error al añadir la cancion");
            }
        });
    }
}

// Edita una cancion
function editSong(songid) {
    // tomar los valores del formulario
    var artista = $.trim($("#artista").val());
    var titulo = $.trim($("#titulo").val());
    var url = $.trim($("#url").val());

    // pasar la validacion
    if (validateForm()) {
        $.ajax({
            url: 'api/canciones/' + songid,
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
                hideForm();
                loadSongs();
                alert('Editado con éxito');
            },
            error: function() {
                console.log("No se pudo editar la cancion");
            }
        });
    }
}


// Elimina una cancion
function deleteSong(songid) {
    $.ajax({
        url: 'api/canciones/' + songid,
        type: 'delete',
        success: function() {
            // eliminar cancion del main y recargar

            $('.music.item[data-songid='+songid+']').addClass("animated rollOut");
            console.log("RollOut animated");
            //wait for animation to finish before removing classes
            window.setTimeout( function(){
                $('.music.item[data-songid='+songid+']').remove();
                var index = songsIndex.indexOf(songid);
                songsIndex.splice(index, 1);
                console.log("RollOut deleted");
            }, 600);
            // loadSongs();
        },
        error: function() {
            console.log("No se pudo eliminar la cancion");
        }
    });
}


// Carga la cancion en el reproductor
function bufferSong(songid) {
    $.ajax({
        url: '/api/canciones/' + songid,
        type: 'get',
        success: function(data) {
            var html = "";
            html += "<source src='" + data.url + "'>";
            $('#mediaPlayer').html(html); // asigna la source de la cancion
            $('#mediaPlayer').trigger('load'); // carga la cancion
            currentSong = songid;
        },
        error: function() {
            console.log("Error al cargar la cancion");
        }
    })
}

// Reproduce la cancion
function playSong(songid) {
    if (currentSong == null) {
        $(".hiddenFooter").slideDown();
        $.ajax({
            url: '/api/canciones/' + songid,
            type: 'get',
            success: function(data) {
                var html = "";
                html += "<source src='" + data.url + "'>";
                $('#mediaPlayer').html(html); // asigna la source de la cancion
                $('#mediaPlayer').trigger('load'); // carga la cancion
                currentSong = songid;
                $('#mediaPlayer').trigger('play'); // reproduce la cancion
            },
            error: function() {
                console.log("Error al cargar la cancion");
            }
        })
    } else if (currentSong != songid) { // si no es la cancion actual
        $.ajax({
            url: '/api/canciones/' + songid,
            type: 'get',
            success: function(data) {
                var html = "";
                html += "<source src='" + data.url + "'>";
                $('#mediaPlayer').html(html); // asigna la source de la cancion
                $('#mediaPlayer').trigger('load'); // carga la cancion
                currentSong = songid;
                $('#mediaPlayer').trigger('play'); // reproduce la cancion
            },
            error: function() {
                console.log("Error al cargar la cancion");
            }
        })
    }
    else{
         $('#mediaPlayer').trigger('play'); // reproduce la cancion
     }
 }


// Pausa la cancion actual
function pauseSong(songid) {
    $('#mediaPlayer').trigger('pause'); // pausa la cancion
    currentSong = songid;
}

// Muestra el formulario
function showForm() {
    $(".form").slideDown('200');
    // cambiar la clase del boton de añadir cancion
    $('#addSongButton').addClass('cancel-button btn-danger').removeClass('add-button btn-info');
    $(window).scrollTop(0);
}

// Muestra el formulario con los datos de la cancion a editar
function showFormEditSong(songid) {
    $.ajax({
        url: '/api/canciones/' + songid,
        type: 'get',
        success: function(data) {
            var artista = $.trim(data.artista);
            var titulo = $.trim(data.titulo);
            var url = $.trim(data.url);

            // asigna los valores a los campos del formulario
            $("#artista").val(artista);
            $("#titulo").val(titulo);
            $("#url").val(url);

            // y muestra el formulario
            showForm();
        },
        error: function() {
            console.log("No se puede editar esta cancion");
        }
    })
}

// Oculta el formulario
function hideForm() {
    $('.form').trigger('reset'); // resetear campos del formulario
    $(".form").slideUp('200');
    // cambiar la clase del boton de añadir a la original
    $('#addSongButton').addClass('add-button btn-info').removeClass('cancel-button btn-danger');
    // eliminar estilos de la cancion que se esta editando
    $('.music.item').removeClass('currentEditing');
}

// Valida el formulario
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

// Encuentra la cancion siguiente a la actual
function findNext(songid) {
    var currentIndex = songsIndex.indexOf(songid);
    var lastIndex = songsIndex.length - 1;
    if (currentIndex == lastIndex) { // si la cancion actual es la última
        // la siguiente es la primera
        return songsIndex[0];
    } else {
        return songsIndex[currentIndex + 1];
    }
}

// Entra la cancion anterior a la actual
function findPrev(songid) {
    var currentIndex = songsIndex.indexOf(songid);
    var lastIndex = songsIndex.length - 1;
    if (currentIndex == 0) { // si la cancion actual es la primera
        // la anterior es la ultima
        return songsIndex[lastIndex];
    } else {
        return songsIndex[currentIndex - 1];
    }
}

// Mover reproductor custom
function clickPercent(evt) {
    var timelineWidth = $("#timeline").width();
    var timeline = $("#timeline");
    var percent = ((evt.pageX - timeline.offset().left - 7.5) / timelineWidth);
    if (percent > 1) {
        return 1;
    } else if (percent < 0) {
        return 0;
    } else {
        return percent;
    }
}

// Disparar animacion tada al hacer hover sobre el icono
$("#logo").on("mouseover", function(){
    var self = this;
    $(self).addClass("animated tada");
    //wait for animation to finish before removing classes
    window.setTimeout( function(){
        $(self).removeClass("animated tada");
    }, 1250);
});

// ------------------------- Manejadores de evento -------------------------
$(document).ready(function() {

    // Botones de reproducion
    $("main").on('click', '.play-button', function() {
        var id = $(this).data("songid"); // tomar el id de la cancion
        playSong(id);
        // icono de now playing
        $('.playingIndicator').removeClass('glyphicon glyphicon-volume-up');
        $(this).parent().parent().parent().find('.playingIndicator').addClass('glyphicon glyphicon-volume-up');
        // cambiar la clase de los demas iconos a play
        $('.pause-button').addClass('play-button glyphicon-play').removeClass('pause-button glyphicon-pause');
        // cambiar la clase del boton de reproduccion/pausa custom
        $('#playButtonFooter').addClass('glyphicon-pause').removeClass('glyphicon-play');
        // cambiar la clase del boton pulsado
        $(this).removeClass('play-button glyphicon-play').addClass('pause-button glyphicon-pause');
    });

    // Botones de pausa
    $("main").on('click', '.pause-button', function() {
        var id = $(this).data("songid"); // tomar el id de la cancion
        pauseSong(id);
        // cambiar reproductor custom
        $('#playButtonFooter').addClass('glyphicon-play').removeClass('glyphicon-pause');
        // cambiar la clase del boton de la cancion actual
        $(this).removeClass('pause-button glyphicon-pause').addClass('play-button glyphicon-play');
    });

    // Boton de reproducion y pausa custom
    $("#playButtonFooter").on("click", function() {
        var music = $("#mediaPlayer")[0];
        if (music.paused) {
            playSong(currentSong);
            // cambiar la clase de los demas iconos a play
            $('.pause-button').addClass('play-button glyphicon-play').removeClass('pause-button glyphicon-pause');
            // cambiar la clase del boton de reproduccion/pausa custom
            $('#playButtonFooter').addClass('glyphicon-pause').removeClass('glyphicon-play');
            // cambiar la clase del boton de la cancion actual
            $('.play-button[data-songid=' + currentSong + ']').addClass('pause-button glyphicon-pause').removeClass('play-button glyphicon-play');
        } else {
            pauseSong(currentSong);
            // cambiar reproductor custom
            $('#playButtonFooter').addClass('glyphicon-play').removeClass('glyphicon-pause');
            // cambiar la clase del boton de la cancion actual
            $('.pause-button').addClass('play-button glyphicon-play').removeClass('pause-button glyphicon-pause');
        }
    });
    // Boton de reproducir siguiente
    $("#nextButtonFooter").on("click", function() {
        // parar la cancion actual
        if ($('#mediaPlayer')[0].playing) {
            pauseSong(currentSong);
        }
        // calcular la siguiente cancion
        var next = findNext(currentSong);
        console.log(currentSong,next);
        // cambiar la clase de la cancion actual
        $('.pause-button[data-songid=' + currentSong + ']').addClass('play-button glyphicon-play').removeClass('pause-button glyphicon-pause');
        // y reproducirla
        playSong(next);
        // actualizar boton de reproduccion de la cancion
        $('.play-button[data-songid=' + next + ']').addClass('pause-button glyphicon-pause').removeClass('play-button glyphicon-play');
        $('#playButtonFooter').addClass('pause-button glyphicon-pause').removeClass('play-button glyphicon-play');
        // icono de now playing
        $('.playingIndicator').removeClass('glyphicon glyphicon-volume-up');
        $('.music.item').find('.playingIndicator[data-songid=' + next + ']').addClass('glyphicon glyphicon-volume-up');
    });

    // Boton de reproducir anterior
    $("#prevButtonFooter").on("click", function() {
        // parar la cancion actual
        if ($('#mediaPlayer')[0].playing) {
            pauseSong(currentSong);
        }
        // calcular la siguiente cancion
        var prev = findPrev(currentSong);
        console.log(currentSong,prev);
        // cambiar la clase de la cancion actual
        $('.pause-button[data-songid=' + currentSong + ']').addClass('play-button glyphicon-play').removeClass('pause-button glyphicon-pause');
        // y reproducirla
        playSong(prev);
        // actualizar boton de reproduccion de la cancion
        $('.play-button[data-songid=' + prev + ']').addClass('pause-button glyphicon-pause').removeClass('play-button glyphicon-play');
        $('#playButtonFooter').addClass('pause-button glyphicon-pause').removeClass('play-button glyphicon-play');
        // icono de now playing
        $('.playingIndicator').removeClass('glyphicon glyphicon-volume-up');
        $('.music.item').find('.playingIndicator[data-songid=' + prev + ']').addClass('glyphicon glyphicon-volume-up');
    });


    // Botones de eliminar
    $("main").on('click', '.delete-button', function() {
        if (confirm("¿Estás seguro de que quieres eliminar esta canción?") == true)
            var id = $(this).data('songid');
        deleteSong(id);
    });

    // Botones de editar
    $("main").on('click', '.edit-button', function() {
        var id = $(this).data('songid');
        showFormEditSong(id);
        // Cambiar la clase del boton que se estuviese editando
        $('.edit-button-current').addClass('edit-button').removeClass('edit-button-current');
        // y ponersela a este boton
        $(this).addClass('edit-button-current').removeClass('edit-button');
        // cambiar la clase del boton de guardar por la de editar
        $("#submitButton").addClass('edit-song').removeClass('create-song').html('Editar');
        // eliminar y actualizar los datos del boton de guardar
        $("#submitButton").removeData();
        $("#submitButton").data('songid', id);
    });

    // Botones de editar activos
    $("main").on('click', '.edit-button-current', function() {
        hideForm();
        // cambiar la clase del boton de añadir cancion
        $('#addSongButton').addClass('add-button btn-info').removeClass('cancel-button btn-danger');
        // indicar que esta cancion se esta editando actualmente
        $(this).addClass('edit-button').removeClass('edit-button-current');
        //  cambiar la clase del boton de editar por la de guardar
        $('#submitButton').addClass('create-song').removeClass('edit-song').removeData().html('Guardar');
    });

    // Boton de añadir cancion
    $('header').on('click', '.add-button', function() {
        showForm();
        // cambiar la clase del boton de añadir cancion
        $(this).addClass('cancel-button btn-danger').removeClass('add-button btn-info');
        //cambiar la clase del boton de editar por la de guardar
        $('#submitButton').addClass('create-song').removeClass('edit-song').removeData().html('Guardar');
    });

    // Boton de cancelar entrada al formulario
    $('header').on('click', '.cancel-button', function() {
        hideForm();
        // cambiar la clase del boton de añadir cancion
        $(this).addClass('add-button btn-info').removeClass('cancel-button btn-danger');
        //$(this).parents(".music.item").addClass('currentEditing');
    });

    // Boton de guardar y editar cancion
    $("form").on("submit", function() {
        // comprobar si estamos añadiendo u editando
        if (validateForm()) {
            if ($('#submitButton').hasClass('create-song')) {
                createSong();
            } else {
                var songid = $('.edit-button-current').data('songid');
                editSong(songid);
            }
        }
        return false; // Jquery cancela el envio del formulario (prevent default)
    });

    // Reproduccion automatica
    $("#mediaPlayer").on("ended", function() {
        var next = findNext(currentSong);
        playSong(next);
        // actualizar boton de reproduccion de la cancion
        $('.pause-button[data-songid=' + currentSong + ']').addClass('play-button glyphicon-play').removeClass('pause-button glyphicon-pause');
        $('.play-button[data-songid=' + next + ']').addClass('pause-button glyphicon-pause').removeClass('play-button glyphicon-play');
        // icono de now playing
        $('.playingIndicator').removeClass('glyphicon glyphicon-volume-up');
        $('.music.item').find('.playingIndicator[data-songid=' + next + ']').addClass('glyphicon glyphicon-volume-up');
    });

    // Actualizar barra de progreso custom
    $("#mediaPlayer").on("timeupdate", function() {
        var playPercent = 100 * ($(this)[0].currentTime / duration);
        $("#playhead")[0].style.marginLeft = playPercent + "%";
    });

    //Makes timeline clickable
    $("#timeline").on("click", function(evt) {
        var tracktime = duration * clickPercent(evt);
        if (!isNaN(tracktime)) {
            $("#mediaPlayer")[0].currentTime = tracktime;
            console.log("duracion * clickPercent", tracktime);
        };
    });

    $("#mediaPlayer").on("canplaythrough", function() {
        duration = $(this)[0].duration;
    });

    // Disparar animacion tada al hacer hover sobre el icono
    $("#logo").on("mouseover", function(){
        var self = this;
        $(self).addClass("animated tada");
        //wait for animation to finish before removing classes
        window.setTimeout( function(){
            $(self).removeClass("animated tada");
        }, 1250);
    });

    // ------------------------------ Ejecucion ------------------------------

    // ocultar el reproductor custom
    $('.hiddenFooter').hide();

    // ocultar el formulario
    $(".form").hide();

    // Cargar configuracion por defecto de las peticiones ajax
    $.ajaxSetup({
        beforeSend: function() {
            $('body').addClass('loading');
        },
        complete: function() {
            $('body').removeClass('loading');
        }
    })
        // Cargar las canciones existentes al cargar la pagina
        loadSongs();
    });
