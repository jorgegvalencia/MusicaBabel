
$("form").on("submit", function(){

    // Campos del formulario
    var artista = $.trim( $("#artista").val() );
    var titulo = $.trim( $("#titulo").val() );
    var url = $.trim( $("#url").val() );

    // Patrón para la url
    var pattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/ig

    // Validación de campos
    if(artista == ""){
        alert("El artista no puede ser vacío");
        return false;
    }
    if(titulo == ""){
        alert("El titulo no puede ser vacío");
        return false;
    }
    if(url == "" && pattern.test(url) == false){
        alert("La URL de la carátula no es válida");
        return false;
    }

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
        success: function(){  // Success function
            alert("Guardado con éxito!");
        },
        error: function(){  // Error function
            alert("Se ha producido un error");
        }
    });
    return false; // Jquery cancela el envio del formulario (prevent default)

});