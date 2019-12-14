app.controller("HomeController", function($scope, $http) {
	$scope.hayConexion = true;
	
	//$http.get("api/examenes.php") 
	 $http.get("http://testschedule.atwebpages.com/examenes.php") 
		.then(
			function(respuesta) {

				$scope.fechasExamen = respuesta.data;
				localStorage.examenes = JSON.stringify($scope.fechasExamen);

				if(localStorage.pendingToAdd_examenes) {
					 $http.post('http://testschedule.atwebpages.com/examenes.php', {materias: JSON.parse(localStorage.pendingToAdd_examenes)})
					//$http.post('api/examenes.php', {materias: JSON.parse(localStorage.pendingToAdd_examenes)})
						.then(function(respuesta) {
							localStorage.removeItem('pendingToAdd_examenes');
						}, function(respuesta) {
							$scope.fechasExamen = $scope.fechasExamen.concat(JSON.parse(localStorage.pendingToAdd_examenes));
						});
				}
				if(localStorage.getItem('pendingToDelete_examenes') != null) {
					var fechasFiltradas = [];
					var pendingToDelete_examenes = JSON.parse(localStorage.pendingToDelete_examenes);
					for(var i = 0; i < $scope.fechasExamen.length; i++) {
						if(pendingToDelete_examenes.indexOf($scope.fechasExamen[i].id) === -1) {
							fechasFiltradas.push($scope.fechasExamen[i]);
						}
					}
					$scope.fechasExamen = fechasFiltradas;
					localStorage.examenes = JSON.stringify($scope.fechasExamen);

					//$http.delete('api/examenes.php?ids=' + localStorage.pendingToDelete_examenes)
					$http.delete('http://testschedule.atwebpages.com/examenes.php?ids=' + localStorage.pendingToDelete_examenes)
					.then(function(respuesta) {
							if(respuesta.data.success) {
								localStorage.removeItem('pendingToDelete_examenes');
							}
						});
				}

			}, function(respuesta) {
				$scope.fechasExamen = JSON.parse(localStorage.examenes);
				if(localStorage.pendingToAdd_examenes) {
					$scope.fechasExamen = $scope.fechasExamen.concat(JSON.parse(localStorage.pendingToAdd_examenes));
				}
				$scope.hayConexion = false;

			}
		);

	$scope.agregarFechas = function(fechaExamen) 
	{

				
		$scope.data = {
			materia: fechaExamen.materia,
			dia: fechaExamen.dia, 
			hora : fechaExamen.hora
		}
						
		 $http.post('http://testschedule.atwebpages.com/examenes.php', $scope.data)
		//$http.post('api/examenes.php', $scope.data)
			.then(function(respuesta) {
				$scope.fechasExamen.push(respuesta.data);
				localStorage.setItem('examenes', JSON.stringify($scope.fechasExamen));
				localStorage.removeItem('pendingToAdd_examenes');
			}, function(respuesta) {
				let examenes;
				if(localStorage.pendingToAdd_examenes) {
					examenes = JSON.parse(localStorage.pendingToAdd_examenes);
				} else {
					examenes = [];
				}
				examenes.push($scope.data);
				localStorage.pendingToAdd_examenes = JSON.stringify(examenes);

				$scope.fechasExamen.push($scope.data);
			});

	}

	$scope.recuperar_localStorage = JSON.parse(localStorage.getItem("examenes"));
			
	$scope.borrarEste = function(id)
	{
		var iToRemove, 
			removed = false;
		if(localStorage.getItem('pendingToAdd_examenes') !== null) {
			var pending = JSON.parse(localStorage.pendingToAdd_examenes);
			for(var i = 0; i < pending.length; i++) {
				if(pending[i].id == id) {
					iToRemove = i;
				}
			}
			if(iToRemove) {
				removed = true;
				pending.splice(iToRemove, 1);
				localStorage.pendingToAdd_examenes = JSON.stringify(pending);
			}
		}

		if(!removed) {
			var examenes = JSON.parse(localStorage.examenes);
			for(var i = 0; i < examenes.length; i++) {
				if(examenes[i].id == id) {
					iToRemove = i;
				}
			}
			if(iToRemove) {
				removed = true;
				examenes.splice(iToRemove, 1);
				localStorage.examenes = JSON.stringify(examenes);


				//$http.delete('api/examenes.php?id=' + id)
				$http.delete('http://testschedule.atwebpages.com/examenes.php?id=' + id)
					.then(function(respuesta) {
						if(respuesta.data.success) {
							recrearArrayExamenes();
						}
					},
					function(respuesta) {
						if(localStorage.getItem('pendingToDelete_examenes') === null) {
							var pendingToDelete_examenes = [];
						} else {
							var pendingToDelete_examenes = JSON.parse(localStorage.pendingToDelete_examenes);
						}
						pendingToDelete_examenes.push(id);
						localStorage.pendingToDelete_examenes = JSON.stringify(pendingToDelete_examenes);
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

		if(localStorage.getItem('pendingToAdd_examenes')) {
			$scope.fechasExamen = $scope.fechasExamen.concat(JSON.parse(localStorage.pendingToAdd_examenes));
		}


	}
});