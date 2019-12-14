app.controller("HomeController", function($scope, $http) {
	$scope.hayConexion = true;
	
	$http.get("api/examenes.php") 
	// $http.get("noexisto.lala") 
	// $http.get("http://testschedule.atwebpages.com/examenes.php") 
		.then(
			function(respuesta) {

				$scope.fechasExamen = respuesta.data;
				localStorage.examenes = JSON.stringify($scope.fechasExamen);

				if(localStorage.pendingToAdd) {
					// $scope.fechasExamen = $scope.fechasExamen.concat(JSON.parse(localStorage.pendingToAdd));
					// Enviamos TODOS los exámenes que falten grabar.
					// $http.post('agregar-examenes.esto-es-una-array.jaja', {materias: JSON.parse(localStorage.pendingToAdd)})
					// $http.post('http://testschedule.atwebpages.com/examenes.php', {materias: JSON.parse(localStorage.pendingToAdd)})
					$http.post('api/examenes.php', {materias: JSON.parse(localStorage.pendingToAdd)})
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
				if(localStorage.getItem('pendingToDelete') != null) {
					// Filtramos los datos que trajimos del back con los pendientes a eliminar.
					var fechasFiltradas = [];
					var pendingToDelete = JSON.parse(localStorage.pendingToDelete);
					for(var i = 0; i < $scope.fechasExamen.length; i++) {
						// Si el id de este examen no figura entre los pendientes a eliminar, lo
						// guardamos en el array de fechasFiltradas.
						if(pendingToDelete.indexOf($scope.fechasExamen[i].id) === -1) {
							fechasFiltradas.push($scope.fechasExamen[i]);
						}
					}
					$scope.fechasExamen = fechasFiltradas;
					localStorage.examenes = JSON.stringify($scope.fechasExamen);

					// No hacemos un JSON.stringify ya lo leemos directo de localStorage.
					$http.delete('api/examenes.php?ids=' + localStorage.pendingToDelete)
						.then(function(respuesta) {
							if(respuesta.data.success) {
								localStorage.removeItem('pendingToDelete');
							}
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
			materia: fechaExamen.materia,
			dia: fechaExamen.dia, 
			hora : fechaExamen.hora
		}
						
		// $scope.array_para_examenes.push($scope.data);
		// Petición de alta
		// $http.post('http://testschedule.atwebpages.m/examenes.php', $scope.data)
		$http.post('api/examenes.php', $scope.data)
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

	$scope.recuperar_localStorage = JSON.parse(localStorage.getItem("examenes"));
			
	$scope.borrarEste = function(id)
	{
		var iToRemove, 
			removed = false;
		// buscamos si está en localStorage pendingToAdd.
		if(localStorage.getItem('pendingToAdd') !== null) {
			var pending = JSON.parse(localStorage.pendingToAdd);
			for(var i = 0; i < pending.length; i++) {
				if(pending[i].id == id) {
					iToRemove = i;
				}
			}
			if(iToRemove) {
				removed = true;
				pending.splice(iToRemove, 1);
				localStorage.pendingToAdd = JSON.stringify(pending);
			}
		}

		// Preguntamos si ya se borró, o si tenemos que chequear los "comunes" para hacer la
		// petición (no pendientes).
		if(!removed) {
			var examenes = JSON.parse(localStorage.examenes);
			for(var i = 0; i < examenes.length; i++) {
				if(examenes[i].id == id) {
					iToRemove = i;
				}
			}
			if(iToRemove) {
				removed = true;
				console.log("Examenes no filtrados: ", examenes);
				examenes.splice(iToRemove, 1);
				localStorage.examenes = JSON.stringify(examenes);

				console.log("Examenes filtrados: ", examenes);

				// Tratamos de hacer la petición para eliminar el registro de la base.
				$http.delete('api/examenes.php?id=' + id)
				// $http.delete('queres-borrar-y-no-podes-jajajaja.lalala?id=' + id)
					.then(function(respuesta) {
						if(respuesta.data.success) {
							// Se borró, así que actualizamos todo el contenido de los arrays.
							recrearArrayExamenes();
						}
					},
					function(respuesta) {
						// Lo agregamos al id a los "pendientes a eliminar".
						if(localStorage.getItem('pendingToDelete') === null) {
							var pendingToDelete = [];
						} else {
							var pendingToDelete = JSON.parse(localStorage.pendingToDelete);
						}
						pendingToDelete.push(id);
						localStorage.pendingToDelete = JSON.stringify(pendingToDelete);
					});
			}
		}

		recrearArrayExamenes();
	}

	/**
	 * Lee el contenido de los arrays de local y rearma el array de $scope.fechasExamen
	 */
	function recrearArrayExamenes() {
		$scope.fechasExamen = [];

		if(localStorage.getItem('examenes')) {
			$scope.fechasExamen = JSON.parse(localStorage.examenes);
		}

		if(localStorage.getItem('pendingToAdd')) {
			$scope.fechasExamen = $scope.fechasExamen.concat(JSON.parse(localStorage.pendingToAdd));
		}

		// Si hay items que eliminar pendientes.
		// if(localStorage.pendingToDelete) {
		// 	var idsToDelete = JSON.parse(localStorage.pendingToDelete);
		// 	var iToDelete = [];
		// 	for(var i = 0; i < $scope.fechasExamen.length; i++) {
				
		// 	}
		// }
	}
});