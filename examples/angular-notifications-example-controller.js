angular

.module('examples', [
  'angular-notifications',
  'ngAnimate'
])

.controller('angularNotificationsExampleController', [
  '$scope', 'notificationsService',
  function($scope, notificationsService) {
    $scope.addNotification = function (msgType, msg) {
      notificationsService.addMessage(msg, msgType);
    };
  }
]);
