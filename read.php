<!DOCTYPE html>
<html>

<head>
    <title>Data Tempat</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css">
</head>

<body>

    <div class="container">
        <h2>Data Tempat</h2>

        <table class="table table-bordered">
            <thead class="table-dark">
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Category</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>

                <?php

                $servername = "localhost";
                $username = "root";
                $password = "nisa12345";
                $dbname = "casebased4";

                $conn = new mysqli($servername, $username, $password, $dbname);

                if ($conn->connect_error) {
                    die("Connection failed: " . $conn->connect_error);
                }

                $sql = "SELECT id, name, description, ctgry FROM place";
                $result = $conn->query($sql);

                if ($result->num_rows > 0) {
                    while ($row = $result->fetch_assoc()) {
                        echo "<tr>";
                        echo "<td>" . $row['id'] . "</td>";
                        echo "<td>" . $row['name'] . "</td>";
                        echo "<td>" . $row['description'] . "</td>";
                        echo "<td>" . $row['ctgry'] . "</td>";
                        echo "<td>
                            <a href='update.php?id=" . $row['id'] . "' class='btn btn-primary'>Update</a>
                            <a href='delete.php?id=" . $row['id'] . "' class='btn btn-danger'>Delete</a>
                          </td>";
                        echo "</tr>";

                        echo "<div class='modal fade' id='confirmDelete" . $row['id'] . "' tabindex='-1' aria-labelledby='exampleModalLabel' aria-hidden='true'>
                            <div class='modal-dialog'>
                                <div class='modal-content'>
                                    <div class='modal-header'>
                                        <h5 class='modal-title' id='exampleModalLabel'>Confirm Delete</h5>
                                        <button type='button' class='btn-close' data-bs-dismiss='modal' aria-label='Close'></button>
                                    </div>
                                    <div class='modal-body'>
                                        Are you sure you want to delete this record?
                                    </div>
                                    <div class='modal-footer'>
                                        <button type='button' class='btn btn-secondary' data-bs-dismiss='modal'>Cancel</button>
                                        <a href='delete.php?id=" . $row['id'] . "' class='btn btn-danger'>Delete</a>
                                    </div>
                                </div>
                            </div>
                        </div>";
                    }
                } else {
                    echo "<tr><td colspan='5'>0 results</td></tr>";
                }

                $conn->close();
                ?>

            </tbody>
        </table>
    </div>

</body>

</html>