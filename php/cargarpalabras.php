<?php
header('Content-Type: application/json');

$conexion = mysqli_connect("127.0.0.1", "root", "", "ahorcado");

if ($conexion->connect_error) {
    echo json_encode(["estado" => "error", "detalle" => "Error de conexión: " . $conexion->connect_error]);
    exit;
}

$categoria = $_POST['categoria'] ?? '';

if (empty($categoria)) {
    echo json_encode(["estado" => "error", "detalle" => "Categoría no especificada"]);
    exit;
}

$palabras = [];
$stmt = $conexion->prepare("SELECT palabra FROM palabras WHERE categoria = ?");
$stmt->bind_param("s", $categoria);
$stmt->execute();
$result = $stmt->get_result();

while ($fila = $result->fetch_assoc()) {
    $palabras[] = $fila;
}

echo json_encode($palabras);

$stmt->close();
mysqli_close($conexion);
?>
