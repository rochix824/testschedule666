app.controller("NotasController", function($scope, $http) {

	$scope.hayConexion = true,

	$http.get('api/notas.php')
		.then(
			function(respuesta){
				$scope.nota = respuesta.data;
				localStorage.notas = JSON.stringify($scope.nota);

				if(localStorage.pendingToAdd){
					$http.post('api/notas.php', {notas: JSON.parse(localStorage.pendingToAdd)})
						.then(function(respuesta){
							localStorage.removeItem('pendingToAdd');
						}, function(respuesta){
							$scope.nota = $scope.nota.concat(JSON.parse(localStorage.pendingToAdd));
						});
				}
			}, function (respuesta){
				$scope.nota = JSON.parse(localStorage.notas);

				if(localStorage.pendingToAdd){
					$scope.nota = $scope.nota.concat(JSON.parse(localStorage.pendingToAdd));
				}
				$scope.hayConexion = false;
			}
		);
	$scope.agregarNotas = function (notas)
	{
		$scope.data = {
			materia: $scope.notas.materia, 
			nota: $scope.notas.nota
		}

		$http.post('api/notas.php', $scope.data)
			.then(function(respuesta){
				//$scope.notas = [];
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
	// $scope.notas = function()
	// {
	// 	if (!localStorage.getItem("notass")){
	// 		$scope.array_para_notas =[];
	// 	}else{
	// 		$scope.array_para_notas = JSON.parse(localStorage.notass);
	// 		}

	// 	$scope.data3 = 
	// 	{ 
	// 		materiaa: $scope.n_materia,
	// 		nota: $scope.nota
	// 	}
	// 	$scope.array_para_notas.push($scope.data3);
	// 	localStorage.setItem("notass", JSON.stringify($scope.array_para_notas));			 
	// }
			
	// $scope.recuperar_localStorage3= JSON.parse(localStorage.getItem("notass"));
		
	// $scope.borrarEste = function(x)
	// {
	// 	localStorage.removeItem("notass");
	// 	$scope.recuperar_localStorage3.splice($scope.recuperar_localStorage3.indexOf(x), 1);
	// 	$scope.queda_datos = [];
		
	// 	angular.forEach($scope.recuperar_localStorage3, function(x)
	// 	{					
	// 		$scope.queda_datos.push(x);
	// 		localStorage.setItem("notass", JSON.stringify($scope.queda_datos))
	// 	});
	// }
});