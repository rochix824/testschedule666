<?php 
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
        remove($_POST);
    break;    
}

function getHorarios(){
    global $cnx;
    $sql = mysqli_query($cnx, 'SELECT * FROM examenes');
    $horarios = [];
    while($row = mysqli_fetch_assoc($sql)){
        $horarios[] = $row;
    }
    echo json_encode($horarios);
}

function add ($data){
    global $cnx;
    var_dump($data);
    $sql = "INSERT INTO 
            horarios (materia, dia, hora) 
            VALUE ( '$data[materia]', '$data[dia]', '$data[hora]')";
    $result = mysqli_query($cnx, $sql);
    
    echo json_encode ($result);

}

function remove ($data){
    global $cnx;
    //$sql = "DELETE FROM horarios WHERE"

}