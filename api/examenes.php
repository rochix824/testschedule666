<?php
// header("Access-Control-Allow-Origin: *");
require 'DBConnection.php';

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
        if(isset($_GET['id'])) {
            remove($_GET['id']);
        } else if(isset($_GET['ids'])) {
            $ids = json_decode($_GET['ids']);
            removeAll($ids);
        }
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
    $exito = mysqli_query($cnx, $sql);

    if($exito) {
        $data['id'] = mysqli_insert_id($cnx);
        echo json_encode($data);
    } else {
        echo json_encode(['success' => false]);
    }
}

function remove($id){
    global $cnx;
    $id = mysqli_real_escape_string($cnx, $id);
    $sql = "DELETE FROM examenes WHERE id = '" . $id . "'";
    //echo $sql;
    $exito = mysqli_query($cnx, $sql);

    echo json_encode([
        'success' => $exito
    ]);
}

function removeAll($ids){
    global $cnx;
    $list = implode(', ', $ids);
    $list = mysqli_real_escape_string($cnx, $list);
    $sql = "DELETE FROM examenes WHERE id IN (" . $list . ")";
    //echo $sql;
    $exito = mysqli_query($cnx, $sql);

    echo json_encode([
        'success' => $exito
    ]);
}
