app.controller("HorariosController", function($scope, $http) 
{
	$scope.hayConexion = true;

	$http.get("api/horarios.php")
		.then(
			function (respuesta){
				$scope.horarios = respuesta.data;
				localStorage.horarios = JSON.stringify($scope.horarios);

				if(localStorage.pendingToAdd) {
					$http.post('api/horarios.php', {horarios: JSON.parse(localStorage.pendingToAdd)})
						.then(
							function(respuesta){
								localStorage.removeItem('pendingToAdd');
							},function (respuesta){
								$scope.horarios = $scope.horarios.concat(JSON.parse(localStorage.pendingToAdd));
							}
						);
				}
			}, function (respuesta){
				$scope.horarios = JSON.parse(localStorage.horarios);
				if(localStorage.pendingToAdd) {
					$scope.horarios = $scope.horarios.concat(JSON.parse(localStorage.pendingToAdd));
				}
				$scope.hayConexion = false;
			}
		);
		$scope.nuevoHorario = function(horario)
		{
			$scope.data = {
				materia: horario.materia,
				dia: horario.dia,
				hora: horario.hora
			}

			$http.post('api/horarios.php', $scope.data)
				.then(
					function(respuesta){
						$scope.horarios.push(respuesta.data);
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
						$scope.horarios.push($scope.data);
					}
				);
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
				var horarios = JSON.parse(localStorage.horarios);
				for(var i = 0; i < horarios.length; i++) {
					if(horarios[i].id == id) {
						iToRemove = i;
					}
				}
				if(iToRemove) {
					removed = true;
					horarios.splice(iToRemove, 1);
					localStorage.horarios = JSON.stringify(horarios);
					$http.delete('api/horarios.php?id=' + id)
						.then(function(respuesta) {
							if(respuesta.data.success) {
								recrearArrayHorarios();
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
	
			recrearArrayHorarios();
		}
		function recrearArrayHorarios() {
			$scope.horariosCursada = [];
	
			if(localStorage.getItem('horarios')) {
				$scope.horariosCursada = JSON.parse(localStorage.horarios);
			}
	
			if(localStorage.getItem('pendingToAdd')) {
				$scope.horariosCursada = $scope.horariosCursada.concat(JSON.parse(localStorage.pendingToAdd));
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