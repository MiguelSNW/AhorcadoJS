<?php
header('Content-Type: application/json');
session_start(); // Iniciar sesión al inicio

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $conexion = new mysqli("127.0.0.1", "root", "", "ahorcado");
    $conexion->set_charset("utf8");

    if ($conexion->connect_error) {
        echo json_encode(["estado" => "error", "detalle" => "Error de conexión: " . $conexion->connect_error]);
        exit;
    }

    $nombre_usuario = trim($_POST['nombre'] ?? '');
    $clave_usuario = trim($_POST['clave'] ?? '');
    $accion = $_POST['accion'] ?? '';

    if (empty($nombre_usuario) || empty($clave_usuario)) {
        echo json_encode(["estado" => "error", "detalle" => "Usuario y contraseña son requeridos"]);
        exit;
    }

    if ($accion === 'registro') {
        $stmt = $conexion->prepare("SELECT usuario FROM jugadores WHERE usuario = ?");
        $stmt->bind_param("s", $nombre_usuario);
        $stmt->execute();
        $stmt->store_result();

        if ($stmt->num_rows > 0) {
            echo json_encode(["estado" => "error", "detalle" => "El usuario ya existe"]);
        } else {
            $stmt->close();
            $stmt = $conexion->prepare("INSERT INTO jugadores (usuario, clave, puntuacion) VALUES (?, ?, 0)");
            $stmt->bind_param("ss", $nombre_usuario, $clave_usuario);

           if ($stmt->execute()) {
    echo json_encode(["estado" => "ok", "mensaje" => "Usuario registrado exitosamente"]);
} else {
    echo json_encode(["estado" => "error", "detalle" => "Error al registrar el usuario: " . $conexion->error]);
}
            $stmt->close();
        }
    } else if ($accion === 'iniciarSesion') {
        $stmt = $conexion->prepare("SELECT clave FROM jugadores WHERE usuario = ?");
        $stmt->bind_param("s", $nombre_usuario);
        $stmt->execute();
        $stmt->store_result();

        if ($stmt->num_rows > 0) {
            $stmt->bind_result($stored_password);
            $stmt->fetch();
            if ($clave_usuario === $stored_password) {
                $_SESSION['usuario'] = $nombre_usuario;
                echo json_encode(["usuario" => $nombre_usuario]);
            } else {
                echo json_encode(["estado" => "error", "detalle" => "Contraseña incorrecta"]);
            }
        } else {
            echo json_encode(["estado" => "error", "detalle" => "El usuario no existe"]);
        }
        $stmt->close();
    }

    $conexion->close();
}
?>
