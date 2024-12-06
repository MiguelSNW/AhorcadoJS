<?php
header('Content-Type: application/json');
session_start(); // Iniciar sesión al inicio

// Verificar si la sesión del usuario está iniciada
if (!isset($_SESSION['usuario'])) {
    echo json_encode(["estado" => "error", "detalle" => "Usuario no autenticado"]);
    exit;
}

$usuario = $_SESSION['usuario']; // Obtener el usuario de la sesión

$conexion = new mysqli("127.0.0.1", "root", "", "ahorcado");

if ($conexion->connect_error) {
    echo json_encode(["estado" => "error", "detalle" => "Error de conexión: " . $conexion->connect_error]);
    exit;
}

// Preparar la consulta SQL
$stmt = $conexion->prepare("SELECT puntuacion FROM jugadores WHERE usuario = ?");
$stmt->bind_param("s", $usuario);

// Ejecutar la consulta
if ($stmt->execute()) {
    // Obtener el resultado
    $resultado = $stmt->get_result();
    
    if ($resultado->num_rows > 0) {
        // Si se encontró el usuario, obtener la puntuación
        $fila = $resultado->fetch_assoc();
        $puntuacion = $fila['puntuacion'];
        echo json_encode(["estado" => "success", "puntuacion" => $puntuacion]);
    } else {
        echo json_encode(["estado" => "error", "detalle" => "Usuario no encontrado"]);
    }
} else {
    echo json_encode(["estado" => "error", "detalle" => "Error al ejecutar la consulta: " . $stmt->error]);
}

// Cerrar la declaración y la conexión
$stmt->close();
$conexion->close();
?>
