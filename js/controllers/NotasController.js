app.controller("NotasController", function($scope, $http) {

	$scope.hayConexion = true,

	$http.get('http://testschedule.atwebpages.com/notas.php')
		.then(
			function(respuesta){
				$scope.notas = respuesta.data;
				localStorage.notas = JSON.stringify($scope.notas);

				if(localStorage.pendingToAdd_notas){
					$http.post('http://testschedule.atwebpages.com/notas.php', {notas: JSON.parse(localStorage.pendingToAdd_notas)})
						.then(function(respuesta){
							localStorage.removeItem('pendingToAdd_notas');
						}, function(respuesta){
							$scope.notas = $scope.notas.concat(JSON.parse(localStorage.pendingToAdd_notas));
						});
				}
			}, function (respuesta){
				$scope.notas = JSON.parse(localStorage.notas);

				if(localStorage.pendingToAdd_notas){
					$scope.notas = $scope.nota.concat(JSON.parse(localStorage.pendingToAdd_notas));
				}
				$scope.hayConexion = false;
			}
		);
	$scope.agregarNotas = function (nota)
	{
		$scope.data = {
			materia: nota.materia, 
			nota: nota.nota
		}

		$http.post('http://testschedule.atwebpages.com/notas.php', $scope.data)
			.then(function(respuesta){
				console.log(respuesta);
				$scope.notas.push(respuesta.data);
				localStorage.setItem('notas', JSON.stringify($scope.notas));

			},function(respuesta){
				let notas;
				if(localStorage.pendingToAdd_notas){
					notas = JSON.parse(localStorage.pendingToAdd_notas);
				}else{
					notas = [];
				}
				notas.push($scope.data);
				localStorage.pendingToAdd_notas = JSON.stringify(notas);
				$scope.notas.push($scope.data);
			});

	}	
	$scope.borrarEste = function(id)
	{
		var iToRemove, 
			removed = false;
		if(localStorage.getItem('pendingToAdd_notas') !== null) {
			var pending = JSON.parse(localStorage.pendingToAdd_notas);
			for(var i = 0; i < pending.length; i++) {
				if(pending[i].id == id) {
					iToRemove = i;
				}
			}
			if(iToRemove) {
				removed = true;
				pending.splice(iToRemove, 1);
				localStorage.pendingToAdd_notas = JSON.stringify(pending);
			}
		}
		if(!removed) {
			var notas = JSON.parse(localStorage.notas);
			for(var i = 0; i < notas.length; i++) {
				if(notas[i].id == id) {
					iToRemove = i;
				}
			}
			if(iToRemove) {
				removed = true;
				notas.splice(iToRemove, 1);
				localStorage.notas = JSON.stringify(notas);
				$http.delete('http://testschedule.atwebpages.com/notas.php?id=' + id)
					.then(function(respuesta) {
						if(respuesta.data.success) {
							recrearArrayNotas();
						}
					},
					function(respuesta) {
						if(localStorage.getItem('pendingToDelete_notas') === null) {
							var pendingToDelete_notas = [];
						} else {
							var pendingToDelete_notas = JSON.parse(localStorage.pendingToDelete_notas);
						}
						pendingToDelete_notas.push(id);
						localStorage.pendingToDelete_notas = JSON.stringify(pendingToDelete_notas);
					});
			}
		}

		recrearArrayNotas();
	}
	function recrearArrayNotas() {
		$scope.notasCursada = [];

		if(localStorage.getItem('notas')) {
			$scope.notasCursada = JSON.parse(localStorage.notas);
		}

		if(localStorage.getItem('pendingToAdd_notas')) {
			$scope.notasCursada = $scope.notasCursada.concat(JSON.parse(localStorage.pendingToAdd_notas));
		}

		// Si hay items que eliminar pendientes.
		// if(localStorage.pendingToDelete_notas) {
		// 	var idsToDelete = JSON.parse(localStorage.pendingToDelete_notas);
		// 	var iToDelete = [];
		// 	for(var i = 0; i < $scope.fechasExamen.length; i++) {
				
		// 	}
		// }
	}
});