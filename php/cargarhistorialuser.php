<?php
header('Content-Type: application/json');

// Conexión a la base de datos
$conexion = mysqli_connect("127.0.0.1", "root", "", "ahorcado");

// Verificar que el usuario fue enviado
if (isset($_GET['usuario'])) {
    $usuario = $_GET['usuario'];
} else {
    echo json_encode(["estado" => "error", "detalle" => "Usuario no proporcionado"]);
    exit;
}

// Verificar la conexión a la base de datos
if ($conexion->connect_error) {
    echo json_encode(["estado" => "error", "detalle" => "Error de conexión: " . $conexion->connect_error]);
    exit;
}

// Preparar y ejecutar la consulta
$stmt = $conexion->prepare("SELECT * FROM historial WHERE id_usuario = ?");
$stmt->bind_param("s", $usuario); 
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
    echo json_encode(["estado" => "error", "detalle" => "No se encontraron historiales para este usuario"]);
}

// Cerrar la consulta y la conexión
$stmt->close();
mysqli_close($conexion);
?>
