angular

.module('angular-notifications-directive', [
  'angular-notifications-service'
])

.directive('angularNotifications', [
  'notificationsService', '$interval', '$timeout',
  function(notificationsService, $interval, $timeout) {
    var tmpl = 'notifications.html';

    function link(scope, element, attrs) {
      scope.$watch(notificationsService.getMessages, function(messages) {
        scope.messages = messages;
      });

      var fadeOutTime = 7000;

      // First trigger the fade out
      $timeout(function(){
        element.find('button').trigger('click');
      }, fadeOutTime);

      // Second be sure it's hidden correctly
      $timeout(function() {
        element.hide();
      }, fadeOutTime + 2000);
    }

    return {
      restrict: 'E',
      link: link,
      replace: true,
      templateUrl: tmpl,
      scope: {
        message: '='
      }
    };
  }
]);
