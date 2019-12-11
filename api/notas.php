<?php
require 'DBConnection.php';

$method = $_SERVER['REQUEST_METHOD'];

switch($method){

    case 'GET':
        getNotas();
    break; 

    case 'POST':
        $postData = json_decode(file_get_contents('php://input'), true);
        if(isset($postData['notas'])) {
            foreach($postData['notas'] as $unaNota) {
                add($unaNota);
            }
        } else {
            add($postData);
        }
    break;

    case 'DELETE':
     remove($_POST);
    break;
 
}

function getNotas(){
    global $cnx;
    $sql = mysqli_query($cnx, 'SELECT * FROM notas');
    $notas = [];

    while($row=mysqli_fetch_assoc($sql)){
        $notas[] = $row;
    }

    echo json_encode($notas);
}

function add ($data){
    global $cnx;
    $sql = "INSERT INTO notas (materia, nota) VALUE ('$data[materia]', '$data[nota]')";
    $result = mysqli_query($cnx, $sql);
    echo json_encode($result);
    
}