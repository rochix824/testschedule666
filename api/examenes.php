<?php
require 'DBConnection.php';
header("Access-Control-Allow-Origin:*");
$method = $_SERVER['REQUEST_METHOD'];

switch($method){

    case 'GET':
        getExamenes();
    break; 

    case 'POST':
        // Vamos a poder entrar por 2 razones:
        // a. Grabar un examen nuevo.
        // b. Grabar los pendientes.
        $postData = json_decode(file_get_contents('php://input'), true);
        if(isset($postData['materias'])) {
            foreach($postData['materias'] as $unaMateria) {
                add($unaMateria);
            }
        } else {
            add($postData);
        }
    break;

    case 'PUT':
    break;

    case 'DELETE':
     remove($_POST);
    break;
 
}

function getExamenes(){
    global $cnx;
    $sql = mysqli_query($cnx, 'SELECT * FROM examenes');
    $examenes = [];
    // var_dump($examenes);
    //  var_dump(mysqli_fetch_assoc($sql));
    while($row=mysqli_fetch_assoc($sql)){
        $examenes[] = $row;
    }
    echo json_encode($examenes);
}

function add($data){
    global $cnx;
    // var_dump($data);
    $sql = "INSERT INTO examenes (materia, dia, hora) VALUE ( '$data[materia]', '$data[dia]', '$data[hora]')";
    // var_dump($sql);
    $result = mysqli_query($cnx, $sql);

    echo json_encode($result);
}

function remove($data){
    global $cnx;
    //$sql = "DELETE FROM examanes WHERE "
    var_dump($data);
}
