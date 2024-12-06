<?php
header('Content-Type: application/json');

// Conectar a la base de datos
$conexion = mysqli_connect("127.0.0.1", "root", "", "ahorcado");

if ($conexion->connect_error) {
    echo json_encode(["estado" => "error", "detalle" => "Error de conexión: " . $conexion->connect_error]);
    exit;
}

// Obtener los datos de entrada (usuario actual y nueva contraseña)
$usuarioActual = $_POST['usuarioActual'] ?? null;
$nuevaClave = $_POST['nuevaClave'] ?? null;

if ($usuarioActual === null || $nuevaClave === null) {
    echo json_encode(["estado" => "error", "detalle" => "Debe completar todos los campos."]);
    exit;
}

// Actualizar la contraseña del usuario
$stmt = $conexion->prepare("UPDATE jugadores SET clave = ? WHERE usuario = ?");
$stmt->bind_param("ss", $nuevaClave, $usuarioActual);
if ($stmt->execute()) {
    echo json_encode(["estado" => "success", "detalle" => "Contraseña cambiada correctamente"]);
} else {
    echo json_encode(["estado" => "error", "detalle" => "Error al cambiar la contraseña: " . $stmt->error]);
}

// Cerrar la declaración y la conexión
$stmt->close();
mysqli_close($conexion);
?>
