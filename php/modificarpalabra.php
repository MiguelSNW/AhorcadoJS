<?php
header('Content-Type: application/json');

// Conexión a la base de datos
$conexion = mysqli_connect("127.0.0.1", "root", "", "ahorcado");

// Verificar si los datos fueron enviados correctamente
if (isset($_POST['palabra']) && isset($_POST['categoria']) && isset($_POST['palabraAntigua'])) {
    $palabra = $_POST['palabra']; // Nueva palabra
    $categoria = $_POST['categoria']; // Nueva categoría
    $palabraAntigua = $_POST['palabraAntigua']; // Palabra original que se quiere actualizar
} else {
    // Si faltan datos, mostrar el detalle de los datos que faltan
    echo json_encode(["estado" => "error", "detalle" => "Datos no proporcionados: " . json_encode($_POST)]);
    exit;
}

// Verificar la conexión a la base de datos
if ($conexion->connect_error) {
    echo json_encode(["estado" => "error", "detalle" => "Error de conexión: " . $conexion->connect_error]);
    exit;
}

// Preparar la consulta de actualización
$stmt = $conexion->prepare("UPDATE palabras SET palabra = ?, categoria = ? WHERE palabra = ?");
$stmt->bind_param("sss", $palabra, $categoria, $palabraAntigua);

// Ejecutar la consulta
if ($stmt->execute()) {
    echo json_encode(["estado" => "success", "detalle" => "Palabra y categoría actualizadas correctamente"]);
} else {
    echo json_encode(["estado" => "error", "detalle" => "Error al actualizar la palabra"]);
}

// Cerrar la conexión
$stmt->close();
mysqli_close($conexion);
?>
