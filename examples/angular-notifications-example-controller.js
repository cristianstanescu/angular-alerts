angular.

  module('examples', [
    'angularNotifications',
    'ngAnimate'
  ]).

  config(['NotifyProvider', function(NotifyProvider) {
    NotifyProvider.config.displayTime = 3000;
  }]).

  controller('angularNotificationsExampleController', [
    '$scope', 'Notify',
    function ($scope, Notify) {
      $scope.addNotification = function (msgType, msg) {
        Notify.addMessage(msg, msgType);
      };
    }
  ]);
