<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
header("Access-Control-Allow-Headers: X-Requested-With, Content-Type");
$cnx = @mysqli_connect( 
	'localhost',
	'root',
	'',  
	'final_adm' 
);

 //$cnx = mysqli_connect("fdb13.awardspace.net", "2526078_adm", "ADM123456", "2526078_adm");


@mysqli_set_charset( $cnx, 'utf8' );