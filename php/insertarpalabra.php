<?php
header('Content-Type: application/json');

$conexion = new mysqli("127.0.0.1", "root", "", "ahorcado");

// Recibir los datos desde el formulario
$palabra = $_POST['palabra'];
$categoria = $_POST['categoria'];

// Preparar la consulta SQL para insertar la nueva palabra
$query = "INSERT INTO palabras (palabra, categoria) VALUES ('$palabra', '$categoria')";

if (mysqli_query($conexion, $query)) {
    // Si la inserción fue exitosa
    echo json_encode(['estado' => 'success']);
} else {
    // Si hubo un error en la inserción
    echo json_encode(['estado' => 'error', 'detalle' => mysqli_error($conexion)]);
}
?>
