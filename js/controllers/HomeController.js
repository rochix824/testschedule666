app.controller("HomeController", function($scope, $http) {
	$scope.hayConexion = true;
	
	//$http.get("api/examenes.php") 
	// $http.get("noexisto.lala") 
	 $http.get("http://testschedule.atwebpages.com/examenes.php") 
		.then(
			function(respuesta) {

				$scope.fechasExamen = respuesta.data;
				localStorage.examenes = JSON.stringify($scope.fechasExamen);

				if(localStorage.pendingToAdd) {
					// $scope.fechasExamen = $scope.fechasExamen.concat(JSON.parse(localStorage.pendingToAdd));
					// Enviamos TODOS los exámenes que falten grabar.
					// $http.post('agregar-examenes.esto-es-una-array.jaja', {materias: JSON.parse(localStorage.pendingToAdd)})
					$http.post('http://testschedule.atwebpages.com/examenes.php', {materias: JSON.parse(localStorage.pendingToAdd)})
						.then(function(respuesta) {
							// Yay! :D
							// Todo grabó.
							// Eliminamos los pendientes de localStorage.
							localStorage.removeItem('pendingToAdd');
						}, function(respuesta) {
							// Como no las pudimos grabar, entonces las agregamos al listado del local.
							$scope.fechasExamen = $scope.fechasExamen.concat(JSON.parse(localStorage.pendingToAdd));
						});
				}

			}, function(respuesta) {
				$scope.fechasExamen = JSON.parse(localStorage.examenes);
				if(localStorage.pendingToAdd) {
					$scope.fechasExamen = $scope.fechasExamen.concat(JSON.parse(localStorage.pendingToAdd));
				}
				// Mostramos algún mensaje de que no hay conexión
				$scope.hayConexion = false;
				//console.error('No hay datos para mostrar');

			}
		);

	$scope.agregarFechas = function(fechaExamen) 
	{
		// if (!localStorage.getItem("examenes")){
		// 	$scope.array_para_examenes =[];
		// }else{
		// 	$scope.array_para_examenes = JSON.parse(localStorage.examenes);
		// }
				
		$scope.data = {
			materia: $scope.fechaExamen.materia,
			dia: $scope.fechaExamen.dia, 
			hora : $scope.fechaExamen.hora
		}
						
		// $scope.array_para_examenes.push($scope.data);
		// Petición de alta
		$http.post('http://testschedule.atwebpages.com/examenes.php', $scope.data)
			.then(function(respuesta) {
				// Yay! :D
				// En respuesta tendría que venir el id, o todos los datos completos.
				$scope.fechasExamen.push(respuesta.data);
				// Actualizamos localStorage.
				localStorage.setItem('examenes', JSON.stringify($scope.fechasExamen));
			}, function(respuesta) {
				// No se pudo grabar :(
				// Obtenemos los exámenes que no se grabaron, si es que hubo.
				let examenes;
				if(localStorage.pendingToAdd) {
					examenes = JSON.parse(localStorage.pendingToAdd);
				} else {
					examenes = [];
				}
				// Agregamos el que no pudimos grabar a la lista de pendientes.
				examenes.push($scope.data);
				// Actualizamos en local los pendientes.
				localStorage.pendingToAdd = JSON.stringify(examenes);

				// También agregamos el examen a la lista de exámenes.
				$scope.fechasExamen.push($scope.data);
				// $scope.fechasExamen = JSON.parse(localStorage.examenes);
			});

		// localStorage.setItem("examenes", JSON.stringify($scope.array_para_examenes));			 
	}

	$scope.recuperar_localStorage= JSON.parse(localStorage.getItem("examenes"));
			
	$scope.borrarEste2 = function(x)
	{
		localStorage.removeItem("examenes");
		$scope.recuperar_localStorage.splice($scope.recuperar_localStorage.indexOf(x), 1);
		$scope.queda_datos = [];
	
		angular.forEach($scope.recuperar_localStorage, function(x)
		{					
			$scope.queda_datos.push(x);
			localStorage.setItem("examenes", JSON.stringify($scope.queda_datos))
		});
			
	}
});