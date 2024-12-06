<?php
header('Content-Type: application/json');

$conexion = new mysqli("127.0.0.1", "root", "", "ahorcado");

if ($conexion->connect_error) {
    echo json_encode(["estado" => "error", "detalle" => "Error de conexión: " . $conexion->connect_error]);
    exit;
}

// Preparar y ejecutar la consulta para obtener las categorías
$consulta = "SELECT DISTINCT categoria FROM palabras";  // Suponiendo que las categorías están en la columna 'categoria'
$resultado = $conexion->query($consulta);

if ($resultado->num_rows > 0) {
    $categorias = [];
    while ($row = $resultado->fetch_assoc()) {
        $categorias[] = $row['categoria'];  // Añadir cada categoría al array
    }
    echo json_encode(["estado" => "success", "categorias" => $categorias]);
} else {
    echo json_encode(["estado" => "error", "detalle" => "No se encontraron categorías"]);
}

$conexion->close();
?>
