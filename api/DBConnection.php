<?php
header("Access-Control-Allow-Origin: *");
$cnx = @mysqli_connect( 
	'localhost',
	'root',
	'',  
	'final_adm' 
);

 //$cnx = mysqli_connect("fdb13.awardspace.net", "2526078_adm", "ADM123456", "2526078_adm");


@mysqli_set_charset( $cnx, 'utf8' );