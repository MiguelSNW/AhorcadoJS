<?php
header('Content-Type: application/json');

// Conexión a la base de datos
$conexion = mysqli_connect("127.0.0.1", "root", "", "ahorcado");

if ($conexion->connect_error) {
    echo json_encode(["estado" => "error", "detalle" => "Error de conexión: " . $conexion->connect_error]);
    exit;
}


$stmt = $conexion->prepare("SELECT * FROM historial");
$stmt->execute();
$result = $stmt->get_result();

// Verificar si hay resultados
$historial = [];
if ($result->num_rows > 0) {
    // Recoger todos los registros como un array asociativo
    while ($row = $result->fetch_assoc()) {
        $historial[] = $row;
    }
    echo json_encode(["estado" => "success", "historial" => $historial]);
} else {
    echo json_encode(["estado" => "error", "detalle" => "No se encontraron historiales"]);
}

// Cerrar la consulta y la conexión
$stmt->close();
mysqli_close($conexion);
?>
