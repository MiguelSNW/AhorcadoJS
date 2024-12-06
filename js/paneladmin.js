$(document).ready(function () {

    var usuarioLogueado = localStorage.getItem('usuarioLogueado');


    $(document).on('click', '#volveradmin', function () {
        window.location.href = 'panel.html';
    });

    $(document).on('click', '#volverJuego', function () {
        window.location.href = 'juego.html';
    });

    $(document).on('click', '#volverusuario', function () {
        window.location.href = 'juego.html';
    });


    if (usuarioLogueado == 'admin') {
        $('#menuadmin').show();
        $('#desconectar').on('click', function () {
            window.location.href = 'index.html';


        });
    }
    if (usuarioLogueado != 'admin') {
        $('#menuadmin').hide();
        $('#historial').show();
        $('#desconectar').on('click', function () {
            window.location.href = 'index.html';
        });


        $.ajax({
            url: "php/cargarhistorialuser.php",
            type: "GET",
            data: { usuario: usuarioLogueado },  // Asegúrate de que 'usuarioLogueado' esté definido correctamente
            dataType: "json",
            success: function (usuarios) {
                var tablahistorial = $('#tablaHistorial');  // ID corregido
                tablahistorial.empty();  // Limpiar contenido previo

                // Verificar si el estado es 'success'
                if (usuarios.estado === "success") {
                    // Agregar cabeceras de la tabla
                    tablahistorial.append('<thead><tr><th>Fecha</th><th>Puntuación</th><th>Usuario</th></tr></thead><tbody>');

                    // Recorrer y agregar las filas a la tabla
                    usuarios.historial.forEach(function (usuario) {
                        tablahistorial.append(
                            '<tr>' +
                            '<td>' + usuario.fecha + '</td>' +
                            '<td>' + usuario.puntuacion_ganada + '</td>' +
                            '<td>' + usuario.id_usuario + '</td>' +
                            '</tr>'
                        );
                    });

                    tablahistorial.append('</tbody>');
                } else {
                    // Si no hay datos, mostrar un mensaje al usuario
                    tablahistorial.append('<tbody><tr><td colspan="3">No hay historiales disponibles.</td></tr></tbody>');
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.error("Error al procesar la solicitud:", textStatus, errorThrown);
                alert("Ocurrió un error al cargar los datos del historial. Por favor, inténtalo nuevamente.");
            }
        });


    }


    $.ajax({
        url: 'php/cargarcategoria.php',  // Cambia esta ruta al archivo PHP que has creado
        type: 'GET',  // Método de la petición
        dataType: 'json',  // Esperamos una respuesta JSON
        success: function (data) {
            if (data.estado === 'success') {
                // Obtener el select
                var select = $('#categoriaSelect');

                // Vaciar el select para no duplicar las opciones
                select.empty();

                // Agregar la opción por defecto
                select.append('<option value="">Selecciona una categoría</option>');

                // Recorrer las categorías y agregar una opción por cada categoría
                $.each(data.categorias, function (index, categoria) {
                    select.append('<option value="' + categoria + '">' + categoria + '</option>');
                });
            } else {
                console.error("Error al obtener las categorías:", data.detalle);
            }
        },
        error: function (xhr, status, error) {
            console.error("Error en la solicitud AJAX:", error);
        }
    });


    $('#actualizarcat').on('click', function () {
        $('#menuadmin').hide();
        $('#tablapalabras').show();
        $.ajax({
            url: "php/cargartablapalabras.php",
            type: "GET",
            dataType: "json",
            success: function (usuarios) {
                if (usuarios.estado === "success") {
                    var tablaPalabras = $('#tablaPalabras');
                    tablaPalabras.empty();
                    tablaPalabras.append('<thead><tr><th>Palabra</th><th>Categoría</th><th>Modificación</th></thead><tbody>');
                    usuarios.palabras.forEach(function (usuario) {
                        tablaPalabras.append(
                            '<tr>' +
                            '<td>' + usuario.palabra + '</td>' +
                            '<td>' + usuario.categoria + '</td>' +
                            '<td><button class="modificarpalabras">Modificar</button></td>' +
                            '</tr>'
                        );
                    });

                    tablaPalabras.append('</tbody>');
                } else {
                    console.log('No hay palabras existentes');
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.error("Error al procesar la solicitud:", textStatus, errorThrown);
                alert("Ocurrió un error. Inténtalo nuevamente.");
            }
        });



    })

    $('#actualizarus').on('click', function () {
        $('#menuadmin').hide();
        $('#tabla').show();

        $.ajax({
            url: "php/cargartabla.php",
            type: "GET",
            dataType: "json",
            success: function (usuarios) {
                console.log(usuarios);  // Depura la respuesta

                if (usuarios.estado === "success") {
                    var tablaUsuarios = $('#tablaUsuarios');
                    tablaUsuarios.empty();
                    tablaUsuarios.append('<thead><tr><th>Usuario</th><th>Clave</th><th>Puntuación</th><th>Modificación</th></tr></thead><tbody>');

                    // Asegúrate de que usuarios.jugadores sea un array
                    if (Array.isArray(usuarios.jugadores)) {
                        usuarios.jugadores.forEach(function (usuario) {
                            tablaUsuarios.append(
                                '<tr data-usuario="' + usuario.usuario + '">' +  // Cambiar de data-id a data-usuario
                                '<td>' + usuario.usuario + '</td>' +
                                '<td>' + usuario.clave + '</td>' +
                                '<td>' + usuario.puntuacion + '</td>' +
                                '<td>' +
                                '<button class="modificar">Modificar</button><br>' +
                                '<button class="eliminar" style="background-color:red;">Eliminar</button>' +
                                '</td>' +
                                '</tr>'
                            );
                        });
                    } else {
                        console.error("El formato de 'jugadores' no es un array.");
                        alert("No se encontraron usuarios en la base de datos.");
                    }

                    tablaUsuarios.append('</tbody>');
                } else {
                    console.log('No hay usuarios existentes');
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.error("Error al procesar la solicitud:", textStatus, errorThrown);
                alert("Ocurrió un error. Inténtalo nuevamente.");
            }
        });
    });

    $(document).on('click', '.eliminar', function () {
        var fila = $(this).closest('tr');  // Obtener la fila correspondiente al botón
        var usuarioNombre = fila.data('usuario');   // Ahora se obtiene 'usuario' en lugar de 'id'

        if (confirm("¿Estás seguro de que deseas eliminar este usuario?")) {
            $.ajax({
                url: "php/eliminarusuario.php",  // El archivo PHP que procesará la eliminación
                type: "POST",
                data: { usuario: usuarioNombre },  // Enviar el nombre del usuario
                dataType: "json",
                success: function (response) {
                    if (response.estado === "success") {
                        alert("Usuario eliminado correctamente.");
                        fila.remove();  // Eliminar la fila de la tabla
                    } else {
                        alert("Error al eliminar el usuario.");
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    console.error("Error al procesar la solicitud:", textStatus, errorThrown);
                    alert("Hubo un error al eliminar el usuario.");
                }
            });
        }
    });


    $(document).on('click', '.modificarpalabras', function () {
        var fila = $(this).closest('tr');  // Obtener la fila correspondiente al botón
        var palabra = fila.find('td').eq(0).text(); // Obtener la palabra
        var categoria = fila.find('td').eq(1).text();   // Obtener la categoría

        $('#palabraEdit').val(palabra);
        $('#categoriaEdit').val(categoria);
        $('#palabraAntigua').val(palabra);

        $('#formularioModificacionPalabra').show();
        $('#tablapalabras').hide();

        // Asegúrate de que solo se registre el evento de enviar una vez
        $('#formEditPalabras').on('submit', function (e) {
            e.preventDefault();  // Prevenir el envío tradicional del formulario

            var palabraEdit = $('#palabraEdit').val();
            var categoriaEdit = $('#categoriaEdit').val();
            var palabraAntigua = $('#palabraAntigua').val();  // La palabra original


            // Validación de campos
            if (!palabraEdit || !categoriaEdit || !palabraAntigua) {
                alert("Por favor, complete todos los campos.");
                return;  // Detener si algún campo está vacío
            }

            $.ajax({
                url: "php/modificarpalabra.php",  // El archivo PHP para procesar la actualización
                type: "POST",
                data: {
                    palabra: palabraEdit,
                    categoria: categoriaEdit,
                    palabraAntigua: palabraAntigua  // Enviar la palabra original para usarla en el WHERE
                },
                dataType: "json",
                success: function (response) {
                    if (response.estado === "success") {
                        $('#actualizarcat').click();  // Actualizar la tabla de palabras
                        $('#formularioModificacionPalabra').hide();  // Ocultar el formulario de edición
                    } else {
                        alert("Error al modificar la palabra.");
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    console.error("Error al procesar la solicitud:", textStatus, errorThrown);
                }
            });
        });

    });


    // Cuando se hace clic en "Modificar", mostrar el formulario con los datos del usuario
    $(document).on('click', '.modificar', function () {
        var fila = $(this).closest('tr');  // Obtener la fila correspondiente al botón
        var usuario = fila.find('td').eq(0).text(); // Obtener el nombre de usuario
        var clave = fila.find('td').eq(1).text();   // Obtener la clave
        var puntuacion = fila.find('td').eq(2).text();  // Obtener la puntuación

        // Mostrar el formulario con los datos actuales del usuario
        $('#usuarioEdit').val(usuario);
        $('#claveEdit').val(clave);
        $('#puntuacionEdit').val(puntuacion);
        $('#formularioModificacion').show();

        // Ocultar la tabla
        $('#tabla').hide();
        $('#cancelarEdicion').on('click', function () {
            $('#formularioModificacion').hide();
            $('#tabla').show();
        });


        // Cuando se envíe el formulario de modificación
        $('#formEditUsuario').on('submit', function (e) {
            e.preventDefault();  // Prevenir que el formulario se envíe de la manera tradicional

            var usuarioEdit = $('#usuarioEdit').val();
            var claveEdit = $('#claveEdit').val();
            var puntuacionEdit = $('#puntuacionEdit').val();

            $.ajax({
                url: "php/modificarusuario.php",  // Aquí va el archivo PHP para actualizar los datos
                type: "POST",
                data: {
                    usuario: usuarioEdit,
                    clave: claveEdit,
                    puntuacion: puntuacionEdit
                },
                dataType: "json",
                success: function (response) {
                    if (response.estado === "success") {

                        // Recargar la tabla con los datos actualizados
                        $('#actualizarus').click();
                        $('#formularioModificacion').hide();
                    } else {

                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    console.error("Error al procesar la solicitud:", textStatus, errorThrown);
                }
            });
        });

    });

    $('#verhistorial').on('click', function () {
        $('#menuadmin').hide();
        $('#historialadmin').show();

        $.ajax({
            url: "php/cargarhistorial.php",
            type: "GET",
            data: { usuario: usuarioLogueado },  // Asegúrate de que 'usuarioLogueado' esté definido correctamente
            dataType: "json",
            success: function (usuarios) {
                var tablahistorial = $('#tablaHistorialadmin');  // ID corregido
                tablahistorial.empty();  // Limpiar contenido previo

                // Verificar si el estado es 'success'
                if (usuarios.estado === "success") {
                    // Agregar cabeceras de la tabla
                    tablahistorial.append('<thead><tr><th>Fecha</th><th>Puntuación</th><th>Usuario</th></tr></thead><tbody>');

                    // Recorrer y agregar las filas a la tabla
                    usuarios.historial.forEach(function (usuario) {
                        tablahistorial.append(
                            '<tr>' +
                            '<td>' + usuario.fecha + '</td>' +
                            '<td>' + usuario.puntuacion_ganada + '</td>' +
                            '<td>' + usuario.id_usuario + '</td>' +
                            '</tr>'
                        );
                    });

                    tablahistorial.append('</tbody>');
                } else {
                    // Si no hay datos, mostrar un mensaje al usuario
                    tablahistorial.append('<tbody><tr><td colspan="3">No hay historiales disponibles.</td></tr></tbody>');
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.error("Error al procesar la solicitud:", textStatus, errorThrown);
                alert("Ocurrió un error al cargar los datos del historial. Por favor, inténtalo nuevamente.");
            }
        });

    });

    $('#insertarpalabra').on('click', function () {
        $('#menuadmin').hide();
        $('#insertar').show();



    });

    $('#insertpalabra').on('submit', function (e) {
        e.preventDefault(); // Prevenir el comportamiento predeterminado de envío del formulario

        // Obtener los valores de los campos
        var palabra = $('#palabra').val();
        var categoria = $('#categoria').val();

        // Validación para asegurarse de que los campos no estén vacíos
        if (!palabra || !categoria) {
            alert("Por favor, complete ambos campos.");
            return;
        }

        // Enviar los datos al servidor con AJAX
        $.ajax({
            url: "php/insertarpalabra.php",  // Cambia esta ruta al archivo PHP que procesará la inserción
            type: "POST",
            data: {
                palabra: palabra,
                categoria: categoria
            },
            dataType: "json",
            success: function (response) {
                if (response.estado === "success") {
                    alert("Palabra insertada correctamente.");
                    // Puedes hacer que se recargue la tabla de palabras aquí, si es necesario
                    $('#insertar').hide();
                    window.location.href = 'panel.html';// Ocultar el formulario
                } else {
                    $('#errorinsert').show();
                    $('#errorinsert').text("La palabra o categoría ya existen.");
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.error("Error al procesar la solicitud:", textStatus, errorThrown);
                $('#errorinsert').show();
                $('#errorinsert').text("La palabra o categoría ya existen.");
            }
        });
    });



});
