app.controller("HorariosController", function($scope, $http) 
{
	$scope.hayConexion = true;

	$http.get("api/horarios.php")
		.then(
			function (respuesta){
				$scope.horario = respuesta.data;
				localStorage.horarios = JSON.stringify($scope.horario);

				if(localStorage.pendingToAdd) {
					$http.post('api/horarios.php', {horarios: JSON.parse(localStorage.pendingToAdd)})
						.then(
							function(respuesta){
								localStorage.removeItem('pendingToAdd');
							},function (respuesta){
								$scope.horario = $scope.horario.concat(JSON.parse(localStorage.pendingToAdd));
							}
						);
				}
			}, function (respuesta){
				$scope.horario = JSON.parse(localStorage.horarios);
				if(localStorage.pendingToAdd) {
					$scope.horario = $scope.horario.concat(JSON.parse(localStorage.pendingToAdd));
				}
				$scope.hayConexion = false;
			}
		);
		$scope.nuevoHorario = function(horario)
		{
			$scope.data = {
				materia: $scope.horario.materia,
				dia: $scope.horario.dia,
				hora: $scope.horario.hora
			}

			$http.post('api/horarios.php', $scope.data)
				.then(
					function(respuesta){
						$scope.horario.push(respuesta.data);
						localStorage.setItem('horarios', JSON.stringify($scope.horario));
					},function(respuesta){
						let horarios;
						if(localStorage.pendingToAdd){
							horarios = JSON.parse(localStorage.pendingToAdd);
						}else{
							horarios = [];
						}
						
						horarios.push($scope.data);
						localStorage.pendingToAdd = JSON.stringify(horarios);
						$scope.horario.push($scope.data);
					}
				);
		}

	// // $scope.nuevoHorario = function()
	// // {
	// // 	if (!localStorage.getItem("horarios")){
	// // 		$scope.array_para_horarios =[];
	// // 	}else{
	// // 		$scope.array_para_horarios = JSON.parse(localStorage.horarios);
	// // 		}
				
	// // 	$scope.data2 = 
	// // 	{
	// // 		materia: $scope.h_materia,
	// // 		horario: $scope.h_hora, 
	// // 		diaa : $scope.diaa
	// // 	}
	// // 	$scope.array_para_horarios.push($scope.data2);
	// // 	localStorage.setItem("horarios", JSON.stringify($scope.array_para_horarios));			 
	// // }
			
 $scope.recuperar_localStorage2= JSON.parse(localStorage.getItem("horarios"));
		
		
	$scope.borrarEste3 = function(x)
	{
		localStorage.removeItem("horarios");
		$scope.recuperar_localStorage2.splice($scope.recuperar_localStorage2.indexOf(x), 1);
		$scope.queda_datos = [];
	
		angular.forEach($scope.recuperar_localStorage2, function(x)
		{					
			$scope.queda_datos.push(x);
			localStorage.setItem("horarios", JSON.stringify($scope.queda_datos));
		});
	}	
});