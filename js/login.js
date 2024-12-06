$(document).ready(function () {
    // Array para almacenar errores
    var errores = [];

    // Función para mostrar los errores en el label
    function mostrarError(mensaje, labelId) {
        $(labelId).text(mensaje); // Actualiza el texto del label con el mensaje de error
        $(labelId).show();         // Muestra el label
        $(labelId).css('color', 'red'); // Cambia el color del texto a rojo
    }

    $('#mostrarLogin').on('click', function () {
        window.location.href = 'index.html';
    });

    $('#formregistro').on('submit', function (event) {
        event.preventDefault(); // Evitar el envío tradicional del formulario

        var accion = $('button[type="submit"][clicked=true]').val(); // Obtener el valor del botón clickeado

        // Limpiar errores previos
        errores = [];

        // Realizar la solicitud AJAX al archivo de registro
        $.ajax({
            url: "php/registro.php", // El archivo PHP que procesará los datos
            type: "POST", // Tipo de solicitud
            data: $(this).serialize() + "&accion=" + accion, // Se agregan los datos del formulario y la acción
            dataType: "json", // Esperamos una respuesta en formato JSON
            success: function (respuesta) {
                if (respuesta.estado === "error") {
                    // Si el estado es 'error', mostramos el mensaje de error
                    mostrarError(respuesta.detalle, '#erroresRegistro');
                } else if (respuesta.estado === "ok") {
                    // Si el estado es 'ok', redirigimos a la página de inicio de sesión
                    window.location.href = 'index.html';
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.error("Error al procesar la solicitud de registro:", textStatus, errorThrown);
                mostrarError("Ocurrió un error al procesar tu solicitud. Inténtalo nuevamente.", '#erroresRegistro');
            }
        });
    });
    // Cuando el formulario de login se envía
    $('#login').on('submit', function (event) {
        event.preventDefault(); // Evitar el envío tradicional del formulario

        var accion = $('button[type="submit"][clicked=true]').val(); // Obtener el valor del botón clickeado

        // Limpiar errores previos
        errores = [];

        // Realizar la solicitud AJAX al archivo de login
        $.ajax({
            url: "php/registro.php", // El archivo PHP que procesará los datos
            type: "POST", // Tipo de solicitud
            data: $(this).serialize() + "&accion=" + accion, // Se agregan los datos del formulario y la acción
            dataType: "json", // Esperamos una respuesta en formato JSON
            success: function (respuesta) {
                if (respuesta.usuario) {
                    // Si la respuesta incluye un usuario, lo almacenamos en localStorage
                    localStorage.setItem('usuarioLogueado', respuesta.usuario);

                    // Realizamos una nueva solicitud AJAX para obtener la puntuación del usuario
                    $.ajax({
                        url: "php/conseguirpuntuacion.php", // Archivo para obtener la puntuación
                        type: "POST", // Mantener el tipo de solicitud como POST
                        dataType: "json", // Esperamos una respuesta JSON
                        success: function (respuestaPuntuacion) {
                            if (respuestaPuntuacion.puntuacion !== undefined && respuestaPuntuacion.puntuacion !== null) {
                                // Si hay puntuación, la almacenamos
                                localStorage.setItem('puntuacionLogueado', respuestaPuntuacion.puntuacion);
                                window.location.href = "juego.html"; // Redirigimos al juego
                            } else {
                                mostrarError("Error al obtener la puntuación", '#errores');
                            }
                        },
                        error: function (jqXHR, textStatus, errorThrown) {
                            console.error("Error al procesar la solicitud de puntuación:", textStatus, errorThrown);
                            mostrarError("Ocurrió un error al obtener la puntuación. Inténtalo nuevamente.", '#errores');
                        }
                    });

                } else {
                    // Mostrar el error desde la respuesta
                    mostrarError(respuesta.detalle, '#errores');
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.error("Error al procesar la solicitud de login:", textStatus, errorThrown);
                mostrarError("Ocurrió un error al procesar tu solicitud. Inténtalo nuevamente.", '#errores');
            }
        });
    });

    // Mostrar el formulario de registro
    $('#mostrarRegistro').on('click', function () {
        $('#menu').hide();  // Ocultamos el formulario de login
        $('#panelregistro').show(); // Mostramos el formulario de registro
    });

    // Volver al formulario de login
    $('#mostrarLogin').click(function () {
        $('#registro').hide();  // Ocultamos el formulario de registro
        $('#login').show();     // Mostramos el formulario de login
    });

    // Cuando un botón de submit es clickeado, marcamos cuál fue el botón
    $('form button[type="submit"]').click(function () {
        $('button[type="submit"]', $(this).parents('form')).removeAttr('clicked');
        $(this).attr('clicked', 'true');
    });
});
