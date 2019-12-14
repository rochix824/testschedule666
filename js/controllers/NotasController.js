app.controller("NotasController", function($scope, $http) {

	$scope.hayConexion = true,

	$http.get('api/notas.php')
		.then(
			function(respuesta){
				$scope.notas = respuesta.data;
				localStorage.notas = JSON.stringify($scope.notas);

				if(localStorage.pendingToAdd){
					$http.post('api/notas.php', {notas: JSON.parse(localStorage.pendingToAdd)})
						.then(function(respuesta){
							localStorage.removeItem('pendingToAdd');
						}, function(respuesta){
							$scope.notas = $scope.notas.concat(JSON.parse(localStorage.pendingToAdd));
						});
				}
			}, function (respuesta){
				$scope.notas = JSON.parse(localStorage.notas);

				if(localStorage.pendingToAdd){
					$scope.notas = $scope.nota.concat(JSON.parse(localStorage.pendingToAdd));
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

		$http.post('api/notas.php', $scope.data)
			.then(function(respuesta){
				console.log(respuesta);
				$scope.notas.push(respuesta.data);
				localStorage.setItem('notas', JSON.stringify($scope.notas));

			},function(respuesta){
				let notas;
				if(localStorage.pendingToAdd){
					notas = JSON.parse(localStorage.pendingToAdd);
				}else{
					notas = [];
				}
				notas.push($scope.data);
				localStorage.pendingToAdd = JSON.stringify(notas);
				$scope.notas.push($scope.data);
			});

	}	
	$scope.borrarEste = function(id)
	{
		var iToRemove, 
			removed = false;
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
				$http.delete('api/notas.php?id=' + id)
					.then(function(respuesta) {
						if(respuesta.data.success) {
							recrearArrayNotas();
						}
					},
					function(respuesta) {
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

		recrearArrayNotas();
	}
	function recrearArrayNotas() {
		$scope.notasCursada = [];

		if(localStorage.getItem('notas')) {
			$scope.notasCursada = JSON.parse(localStorage.notas);
		}

		if(localStorage.getItem('pendingToAdd')) {
			$scope.notasCursada = $scope.notasCursada.concat(JSON.parse(localStorage.pendingToAdd));
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