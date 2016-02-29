
$("form").on("submit", function(){

    var artista = $.trim( $("#artista").val() );
    var titulo = $.trim( $("#titulo").val() );
    var url = $.trim( $("#url").val() );

    if(artista == ""){
        alert("El artista no puede ser vacío");
        return false;
    }
    if(titulo == ""){
        alert("El titulo no puede ser vacío");
        return false;
    }

    var pattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/ig
    if(url == "" && pattern.test(url) == false){
        alert("La URL de la carátula no es válida");
        return false;
    }

    //alert(artista);
    //alert(titulo);
    //alert(url);
    alert("ENVIO DE FORMULARIO CORRECTO");
    return false; // Jquery cancela el envio del formulario (prevent default)

});