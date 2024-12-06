$(document).ready(function () {
    var usuarioLogueado = localStorage.getItem('usuarioLogueado');
    var puntuacionLogueado = parseInt(localStorage.getItem('puntuacionLogueado')) || 0;
    console.log(usuarioLogueado + puntuacionLogueado);
    $('#puntuacionuser').text(puntuacionLogueado - puntuacion);


    $(document).on('click', '#desconectar', function () {
        window.location.href = 'index.html';
    });



    $('#formCambioContraseña').on('submit', function (event) {
        event.preventDefault(); // Evitar el envío tradicional del formulario

        // Obtener los valores del formulario
        var usuarioActual = $('#usuarioActual').val();
        var nuevaClave = $('#nuevaClave').val();
        var confirmarClave = $('#confirmarClave').val();

        // Verificar que las contraseñas coincidan
        if (nuevaClave !== confirmarClave) {
            mostrarError("Las contraseñas no coinciden.");
            return;
        }


        // Realizar la solicitud AJAX para cambiar la contraseña
        $.ajax({
            url: "php/cambiarclave.php", // El archivo PHP que procesará el cambio de contraseña
            type: "POST",
            data: {
                usuarioActual: usuarioLogueado,
                nuevaClave: nuevaClave
            },
            dataType: "json",
            success: function (respuesta) {
                if (respuesta.estado === "success") {
                    console.log("Clave cambiada");
                    // Limpiar los campos después de un cambio exitoso
                    $('#formCambioContraseña')[0].reset();
                    window.location.href = 'juego.html';
                } else {
                    mostrarError(respuesta.detalle); // Mostrar el mensaje de error
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.error("Error al procesar la solicitud de cambio de contraseña:", textStatus, errorThrown);
                mostrarError("Ocurrió un error al cambiar la contraseña. Inténtalo nuevamente.");
            }
        });
    });


    $(document).on('click', '#volver', function () {
        window.location.href = 'juego.html';
    });

    $(document).on('click', '#reiniciar', function () {
        window.location.href = 'juego.html';
    });

    $(document).on('click', '#desconectar2', function () {
        window.location.href = 'index.html';
    });
    $('#puntuacionuser').text('Puntuación: 0');


    $(document).on('click', '#cambiarclave', function () {
        $('#menu').hide();
        $('#juego').hide();
        $('#panelCambioContraseña').show();

    });

    $('#user').text(usuarioLogueado);
    $('#usuario').text('Nombre de usuario: ' + usuarioLogueado);

    if (usuarioLogueado == 'admin') {
        $('#panel').show();
        $('#desconectar').on('click', function () {
            window.location.href = 'index.html';



        });
    }

    if (usuarioLogueado != 'admin') {
        $('#paneluser').show();
        $('#desconectar2').on('click', function () {
            window.location.href = 'index.html';


        });
    }

    function mostrarError(mensaje) {
        $('#erroresCambio').text(mensaje); // Actualiza el texto del label con el mensaje de error
        $('#erroresCambio').show();         // Muestra el label
    }



    // Cuando el formulario de cambio de contraseña se envía


    // Mostrar error en el formulario
    function mostrarError(mensaje) {
        $('#erroresCambio').text(mensaje); // Actualiza el texto del label con el mensaje de error
        $('#erroresCambio').show();         // Muestra el label
    }


    $('#historial').on('click', function () {
        window.location.href = 'panel.html';
    });

    $.ajax({
        url: 'php/cargarcategoria.php', // Ruta al archivo PHP
        type: 'GET',
        dataType: 'json',
        success: function (data) {
            if (data.estado === 'success') {
                // Obtener el select
                var select = $('#categoriaSelect');
                select.empty(); // Limpiar el select antes de agregar las categorías

                // Recorrer las categorías y agregar las opciones al select
                $.each(data.categorias, function (index, categoria) {
                    select.append('<option value="' + categoria + '">' + categoria + '</option>');
                });
            } else {
                console.error("No se encontraron categorías:", data.detalle);

            }
        },
        error: function (xhr, status, error) {
            console.error("Error en la solicitud AJAX:", error);

        }
    });

    $('#empezar').on('click', function () {
        var categoria = $('#categoriaSelect').val();
        $('#menu').hide();
        $('#estadisticas').show();
        $('#juego').show();
        if (categoria) {
            $.ajax({
                url: "php/cargarpalabras.php",
                type: "POST",
                data: { categoria: categoria },
                dataType: "json",
                success: function (palabras) {
                    if (palabras.length > 0) {


                        iniciarJuego(palabras);
                        crearBotonesAbecedario();
                    } else {
                        alert("No se encontraron palabras para la categoría seleccionada.");
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    console.error("Error al procesar la solicitud:", textStatus, errorThrown);
                    alert("Ocurrió un error. Inténtalo nuevamente.");
                }
            });
        } else {
            alert("Por favor, seleccione una categoría.");
        }
    });

    $('#botonAdmin').on('click', function () {
        window.location.href = 'panel.html';

    });
});

// Variables globales
var usuarioLogueado = localStorage.getItem('usuarioLogueado');
var puntuacionLogueado = parseInt(localStorage.getItem('puntuacionLogueado')) || 0;
var palabraSecreta;
var mascara;
var vidas = 6;
var puntuacion = 0;
var puntuacionFinal;


function iniciarJuego(palabras) {
    cambiarImagen(vidas);
    palabraSecreta = palabras[Math.floor(Math.random() * palabras.length)].palabra;
    mascara = mascaraPalabra(palabraSecreta);
    $('#usuario').text('Nombre de usuario: ' + usuarioLogueado);
    $('#mascara').text(mascara);
}

function mascaraPalabra(palabraSecreta) {
    return '-'.repeat(palabraSecreta.length);
}

function seleccionarLetra(letra, boton) {
    let nuevaMascara = '';
    let acierto = false;

    for (let i = 0; i < palabraSecreta.length; i++) {
        if (palabraSecreta[i].toLowerCase() === letra.toLowerCase()) {
            nuevaMascara += palabraSecreta[i];
            acierto = true;
            puntuacion += 2;
            $('#puntuacionuser').text('Puntuación: ' + puntuacion);
            $(boton).addClass('correcto');
        } else {
            nuevaMascara += mascara[i];
        }
    }

    if (!acierto) {
        vidas -= 1;
        cambiarImagen(vidas);
        puntuacion -= 1;
        $(boton).addClass('incorrecto');
        $('#vidas').text(vidas);
        $('#puntuacionuser').text('Puntuación: ' + puntuacion);
    }

    if (vidas == 0) {
        puntuacion -= 5;
        puntuacionFinal = puntuacion;
        insertarEnHistorial(puntuacion, usuarioLogueado);
        actualizarPuntuacion(puntuacionFinal, usuarioLogueado);
        let label = puntuacion + puntuacionLogueado;
        $('#puntos').text('Puntuación obtenida: ' + puntuacion + ' PUNTOS');
        $('#juego').hide();
        $('#estadisticas').hide();

        console.log(puntuacionFinal);


        $('#puntostotal2').text('Puntuación total: ' + label);


        $('#gameover').show();
        $('#solucion').text(palabraSecreta);
        $('#desconectar').on('click', function () {
            window.location.href = 'index.html';
        });
    }



    mascara = nuevaMascara;
    $('#mascara').text(mascara);
    $(boton).prop('disabled', true);

    if (mascara === palabraSecreta) {
        puntuacion += 10;

        puntuacionFinal = puntuacion;
        insertarEnHistorial(puntuacion, usuarioLogueado);
        actualizarPuntuacion(puntuacionFinal, usuarioLogueado);
        $('#puntuacionuser').text('Puntuación: ' + puntuacion);

        console.log(puntuacionFinal);


        let label = puntuacion + puntuacionLogueado;
        localStorage.setItem('puntuacionLogueado', label);
        $('#puntos2').text('Puntuación obtenida: ' + puntuacion);
        $('#puntostotal').text('Puntuación total: ' + label);
        $('#juego').hide();
        $('#solucion2').text(palabraSecreta);
        $('#win').show();

        $('#reiniciar').on('click', function () {

            // Redirigir o recargar la página del juego

            window.location.href = window.location.href; // Recarga la página o reinicia el juego
        });



    }



}

function crearBotonesAbecedario() {
    const contenedor = $('#botonesAbecedario');
    const abecedario = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

    contenedor.empty();

    abecedario.forEach(letra => {
        const boton = $('<button>')
            .text(letra)
            .addClass('botonLetra')
            .on('click', function () {
                seleccionarLetra(letra, this);
            });
        contenedor.append(boton);
    });
}

function actualizarPuntuacion(puntuacion, usuario) {
    $.ajax({
        url: "php/actualizarpuntuacion.php",
        type: "POST",
        data: { puntuacion: puntuacion, usuario: usuario },
        dataType: "json",
        success: function (response) {
            if (response.estado === "success") {
                console.log('Puntuación actualizada: ' + response.detalle);
            } else {
                console.error("Error: " + response.detalle);

            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.error("Error al procesar la solicitud:", textStatus, errorThrown);
        }
    });
}

function insertarEnHistorial(puntuacion, usuario) {
    $.ajax({
        url: "php/actualizarhistorial.php",
        type: "POST",
        data: { puntuacion: puntuacion, usuario: usuario },
        dataType: "json",
        success: function (response) {
            if (response.estado === "success") {
                console.log('Puntuación insertada en el historial: ' + response.detalle);
            } else {
                console.error("Error: " + response.detalle);

            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.error("Error al procesar la solicitud:", textStatus, errorThrown);

        }
    });
}

function cambiarImagen(vidas) {
    switch (vidas) {
        case 6:
            $('#juegoahorcado').attr('src', 'imagenes/6.png');
            break;

        case 5:
            $('#juegoahorcado').attr('src', 'imagenes/5.png');
            break;

        case 4:
            $('#juegoahorcado').attr('src', 'imagenes/4.png');
            break;

        case 3:
            $('#juegoahorcado').attr('src', 'imagenes/3.png');
            break;

        case 2:
            $('#juegoahorcado').attr('src', 'imagenes/2.png');
            break;

        case 1:
            $('#juegoahorcado').attr('src', 'imagenes/1.png');
            break;
    }
}


