<?php 
header("Access-Control-Allow-Origin:*");
$contenido = array(
0=> array("id"=>0, "nombre" => "Programacion", "fecha"=>"12/12/2017", "hora"=>"11"),
1=> array("id"=>1,"nombre" => "Diseño Gráfico", "fecha"=>"20/12/2017", "hora"=>"9"),
2=> array("id"=>2,"nombre" => "Usabilidad", "fecha"=>"30/3/2018", "hora"=>"9"),
3=> array("id"=>3,"nombre" => "Aplicaciones para dispositivos moviles", "fecha"=>"7/12/2017", "hora"=>"9"),
4=> array("id"=>4,"nombre" => "Programacion II", "fecha"=>"8/12/2017", "hora"=>"11"),
5=> array("id"=>5,"nombre" => "Ingles Tecnico", "fecha"=>"15/3/2018", "hora"=>"9"),

);

echo json_encode($contenido);
?>