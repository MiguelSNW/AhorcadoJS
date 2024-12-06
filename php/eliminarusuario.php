<?php
$conexion = mysqli_connect("127.0.0.1", "root", "", "ahorcado");

if ($conexion->connect_error) {
    echo json_encode(["estado" => "error", "detalle" => "Error de conexión: " . $conexion->connect_error]);
    exit;
}

if (isset($_POST['usuario'])) {
    $usuario = $_POST['usuario'];

    // Primero eliminamos las entradas en la tabla historial
    $queryHistorial = "DELETE FROM historial WHERE id_usuario = ?";
    $stmtHistorial = $conexion->prepare($queryHistorial);
    $stmtHistorial->bind_param("s", $usuario);

    if (!$stmtHistorial->execute()) {
        echo json_encode(["estado" => "error", "detalle" => "No se pudo eliminar los registros de historial."]);
        exit;
    }

    // Ahora eliminamos el usuario de la tabla jugadores
    $queryJugador = "DELETE FROM jugadores WHERE usuario = ?";
    $stmtJugador = $conexion->prepare($queryJugador);
    $stmtJugador->bind_param("s", $usuario);

    if ($stmtJugador->execute()) {
        echo json_encode(["estado" => "success"]);
    } else {
        echo json_encode(["estado" => "error", "detalle" => "No se pudo eliminar el usuario."]);
    }

    $stmtHistorial->close();
    $stmtJugador->close();
    $conexion->close();
} else {
    echo json_encode(["estado" => "error", "detalle" => "Usuario no proporcionado."]);
}
?>
