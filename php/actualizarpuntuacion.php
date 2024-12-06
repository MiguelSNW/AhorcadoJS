<?php
header('Content-Type: application/json');

// Conectar a la base de datos
$conexion = mysqli_connect("127.0.0.1", "root", "", "ahorcado");

if ($conexion->connect_error) {
    echo json_encode(["estado" => "error", "detalle" => "Error de conexión: " . $conexion->connect_error]);
    exit;
}

// Obtener los datos de entrada (por ejemplo, desde una solicitud POST)
$puntuacion = $_POST['puntuacion'] ?? null; // Asegúrate de que 'puntuacion' se envía en el cuerpo de la solicitud
$usuario = $_POST['usuario'] ?? null; // Asegúrate de que 'usuario' se envía en el cuerpo de la solicitud

if ($puntuacion === null || $usuario === null) {
    echo json_encode(["estado" => "error", "detalle" => "Faltan datos necesarios"]);
    exit;
}

// Preparar la consulta para obtener la puntuación actual
$stmt2 = $conexion->prepare('SELECT puntuacion FROM jugadores WHERE usuario = ?');
$stmt2->bind_param('s', $usuario);
$stmt2->execute();
$stmt2->store_result();
$stmt2->bind_result($puntuacionActual);

if ($stmt2->num_rows === 0) {
    // Si no se encuentra el usuario, retornar un error
    echo json_encode(["estado" => "error", "detalle" => "Usuario no encontrado"]);
    exit;
}

$stmt2->fetch();
$stmt2->close();

// Calcular la puntuación final (se puede hacer lo que necesites: sumar o reemplazar la puntuación)
$puntuacionFinal = $puntuacionActual + $puntuacion;

// Preparar la consulta para actualizar la puntuación
$stmt = $conexion->prepare("UPDATE jugadores SET puntuacion = ? WHERE usuario = ?");
$stmt->bind_param("ss", $puntuacionFinal, $usuario); // "is" indica que el primer parámetro es un entero y el segundo es una cadena

// Ejecutar la consulta
if ($stmt->execute()) {
    echo json_encode(["estado" => "success", "detalle" => "Puntuación actualizada correctamente"]);
} else {
    echo json_encode(["estado" => "error", "detalle" => "Error al actualizar la puntuación: " . $stmt->error]);
}

// Cerrar la declaración y la conexión
$stmt->close();
mysqli_close($conexion);
?>
