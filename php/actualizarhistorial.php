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

// Preparar la consulta SQL
$stmt = $conexion->prepare("INSERT INTO historial (fecha, puntuacion_ganada, id_usuario) VALUES (NOW(), ?, ?)");
$stmt->bind_param("is", $puntuacion, $usuario); // "is" indica que el primer parámetro es un entero y el segundo es una cadena

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