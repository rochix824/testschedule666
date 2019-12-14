app.controller("HorariosController", function($scope, $http) 
{
	$scope.hayConexion = true;

	//$http.get("api/horarios.php")
	$http.get("http://testschedule.atwebpages.com/horarios.php")
		.then(
			function (respuesta){
				$scope.horarios = respuesta.data;
				localStorage.horarios = JSON.stringify($scope.horarios);

				if(localStorage.pendingToAdd_horarios) {
					$http.post('http://testschedule.atwebpages.com/horarios.php', {horarios: JSON.parse(localStorage.pendingToAdd_horarios)})
						.then(
							function(respuesta){
								localStorage.removeItem('pendingToAdd_horarios');
							},function (respuesta){
								$scope.horarios = $scope.horarios.concat(JSON.parse(localStorage.pendingToAdd_horarios));
							}
						);
				}
			}, function (respuesta){
				$scope.horarios = JSON.parse(localStorage.horarios);
				if(localStorage.pendingToAdd_horarios) {
					$scope.horarios = $scope.horarios.concat(JSON.parse(localStorage.pendingToAdd_horarios));
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

			$http.post('http://testschedule.atwebpages.com/horarios.php', $scope.data)
				.then(
					function(respuesta){
						$scope.horarios.push(respuesta.data);
						localStorage.setItem('horarios', JSON.stringify($scope.horario));
					},function(respuesta){
						let horarios;
						if(localStorage.pendingToAdd_horarios){
							horarios = JSON.parse(localStorage.pendingToAdd_horarios);
						}else{
							horarios = [];
						}
						
						horarios.push($scope.data);
						localStorage.pendingToAdd_horarios = JSON.stringify(horarios);
						$scope.horarios.push($scope.data);
					}
				);
		}
		$scope.borrarEste = function(id)
		{
			var iToRemove, 
				removed = false;
			if(localStorage.getItem('pendingToAdd_horarios') !== null) {
				var pending = JSON.parse(localStorage.pendingToAdd_horarios);
				for(var i = 0; i < pending.length; i++) {
					if(pending[i].id == id) {
						iToRemove = i;
					}
				}
				if(iToRemove) {
					removed = true;
					pending.splice(iToRemove, 1);
					localStorage.pendingToAdd_horarios = JSON.stringify(pending);
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
					$http.delete('http://testschedule.atwebpages.com/horarios.php?id=' + id)
						.then(function(respuesta) {
							if(respuesta.data.success) {
								recrearArrayHorarios();
							}
						},
						function(respuesta) {
							if(localStorage.getItem('pendingToDelete_horarios') === null) {
								var pendingToDelete_horarios = [];
							} else {
								var pendingToDelete_horarios = JSON.parse(localStorage.pendingToDelete_horarios);
							}
							pendingToDelete_horarios.push(id);
							localStorage.pendingToDelete_horarios = JSON.stringify(pendingToDelete_horarios);
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
	
			if(localStorage.getItem('pendingToAdd_horarios')) {
				$scope.horariosCursada = $scope.horariosCursada.concat(JSON.parse(localStorage.pendingToAdd_horarios));
			}
	
			// Si hay items que eliminar pendientes.
			// if(localStorage.pendingToDelete_horarios) {
			// 	var idsToDelete = JSON.parse(localStorage.pendingToDelete_horarios);
			// 	var iToDelete = [];
			// 	for(var i = 0; i < $scope.fechasExamen.length; i++) {
					
			// 	}
			// }
		}
});