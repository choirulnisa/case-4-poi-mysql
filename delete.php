<?php
$servername = "localhost";
$username = "root";
$password = "nisa12345"; 
$dbname = "casebased4"; 

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}


if (isset($_GET['id']) && is_numeric($_GET['id'])) {
    $id = $_GET['id'];
    
    $sql = "DELETE FROM place WHERE id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $id);
    $stmt->execute();

    $stmt->close();
}

// Close connection
$conn->close();

header("Location: read.php");
exit();
?>
