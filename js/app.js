
var app = angular.module('titulo', ['ngRoute', 'mobile-angular-ui']);


app.config(function($routeProvider) {
	$routeProvider
		.when(
			'/', {
				controller: 'HomeController',
				templateUrl: 'modulos/home.html', reloadOnSearch: false
		}).when(
			'/notas', {
				// controller: 'Controller_monolitico',
				controller: 'NotasController',
				templateUrl: 'modulos/notas.html', reloadOnSearch: false
		}).when(
			'/horarios', {
				// controller: 'Controller_monolitico',
				controller: 'HorariosController',
				templateUrl: 'modulos/horarios.html', reloadOnSearch: false
		}).when(
			'/perfil', {
				templateUrl: 'modulos/perfil.html', reloadOnSearch: false
			}
		).otherwise({
			redirectTo: '/'
		});
					
});

app.controller("Controller_monolitico", function ($scope, $rootScope, $http) {

	$rootScope.dias = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31];
	$rootScope.dia_s = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes'];
	$rootScope.meses = [1,2,3,4,5,6,7,8,9,10,11,12];
	$rootScope.anios = [17,18,19,20,21,22,23];
	$rootScope.horario = [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22];
		
});