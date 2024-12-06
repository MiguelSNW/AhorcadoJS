<?php
header('Content-Type: application/json');

$conexion = mysqli_connect("127.0.0.1", "root", "", "ahorcado");

if ($conexion->connect_error) {
    echo json_encode(["estado" => "error", "detalle" => "Error de conexión: " . $conexion->connect_error]);
    exit;
}

// Recibe los datos del formulario
$usuario = $_POST['usuario'];
$clave = $_POST['clave'];
$puntuacion = $_POST['puntuacion'];

// Actualizar el usuario en la base de datos
$stmt = $conexion->prepare("UPDATE jugadores SET clave = ?, puntuacion = ? WHERE usuario = ?");
$stmt->bind_param("sis", $clave, $puntuacion, $usuario); // Usamos 's' para el usuario y 'i' para puntuacion

if ($stmt->execute()) {
    echo json_encode(["estado" => "success", "detalle" => "Usuario actualizado correctamente"]);
} else {
    echo json_encode(["estado" => "error", "detalle" => "Error al actualizar los datos"]);
}

$stmt->close();
mysqli_close($conexion);
?>
