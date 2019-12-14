<?php 
// header("Access-Control-Allow-Origin:*");
require 'DBConnection.php';
$method = $_SERVER['REQUEST_METHOD'];

switch($method){
    case 'GET':
        getHorarios();
    break;
    case 'POST':
        $postData = json_decode(file_get_contents('php://input'), true);

        if(isset($postData['horarios'])){
            foreach($postData['horarios'] as $unHorario) {
                add($unHorario);
            }
        }else{
            add($postData);
        }
    break;
    case 'DELETE' :
        if(isset($_GET['id'])) {
            remove($_GET['id']);
        } else if(isset($_GET['ids'])) {
            $ids = json_decode($_GET['ids']);
            removeAll($ids);
        }
    break;    
}

function getHorarios(){
    global $cnx;
    $sql = mysqli_query($cnx, 'SELECT * FROM horarios');
    $horarios = [];
    while($row = mysqli_fetch_assoc($sql)){
        $horarios[] = $row;
    }
    echo json_encode($horarios);
}

function add ($data){
    global $cnx;
    $sql = "INSERT INTO 
            horarios (materia, dia, hora) 
            VALUE ( '$data[materia]', '$data[dia]', '$data[hora]')";
    $exito = mysqli_query($cnx, $sql);
    if($exito){
        $data['id'] = mysqli_insert_id($cnx);
        echo json_encode($data);
    }else{
        echo json_encode(['success' => false]);
    }

}

function remove($id){
    global $cnx;
    $id = mysqli_real_escape_string($cnx, $id);
    $sql = "DELETE FROM horarios WHERE id = '" . $id . "'";
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
    $sql = "DELETE FROM horarios WHERE id IN (" . $list . ")";
    //echo $sql;
    $exito = mysqli_query($cnx, $sql);

    echo json_encode([
        'success' => $exito
    ]);
}