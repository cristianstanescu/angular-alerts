angular.

  module('angular-notifications', []).

  factory('notificationsService', function() {
    function MessagesService () {
      var contexts = ['danger', 'warning', 'info', 'success'];
      var messages = [];

      // Builds and add a new message to the list.
      //
      // The message given as argument can be a String or an Object.
      //
      // If an object is given, the service will build messages for all the
      // attributes that the object has. When the object's attributes have Array
      // values, the service will build messages for all the elements in the
      // attribute's Array value. I.e. when message is
      //
      // {"email":["can't be blank", "is not an email"]}
      //
      // the service will build two alert messages
      this.addMessage = function (message, context) {
        function addNewMessage(attribute, text) {
          messages.push({
            context: context || 'info',
            text: _.trim(_.capitalize(attribute) + ' ' + text)
          });

          if(messages.length >= 10) {
            messages = _.last(messages, 10);
          }
        }

        function parseCollection(message) {
          _.each(message, function (value, key, list) {
            if(value instanceof Array) {
              _.each(value, function(text) {
                addNewMessage(key, text);
              });
            } else {
              var attribute = (typeof key === 'string') ? key : null;
              addNewMessage(attribute, value);
            }
          });
        }

        if(typeof message === 'string') {
          addNewMessage(null, message);
        } else {
          parseCollection(message);
        }
      };

      // Returns an Array of all messages added
      this.getMessages = function() {
        return messages;
      };

      this.removeFirstMessage = function () {
        messages = _.rest(messages);
      };

      this.removeMessage = function (message) {
        messages = _.without(messages, message);
      };

      // For each element of the `contexts` variable we create a new method on
      // the MessageService that delegates a call to `addMessage` but sets the
      // context
      //
      // We use the _.reduce function and set MessagesService as the accumulator
      // and we also bind the callback to MessagesService
      _.reduce(contexts, function(result, context) {
        result[context] = function (message) {
          this.addMessage(message, context);
        };
        return result;
      }, this, this);
    }

    return new MessagesService();
  }).

  directive('angularNotifications', [
    'notificationsService', '$interval', '$templateCache',
    function(notificationsService, $interval, $templateCache) {

      function link(scope, element, attrs) {

        scope.$watch(notificationsService.getMessages, function(messages) {
          scope.messages = messages;
        });

        scope.removeNotificationMessage = function (message) {
          notificationsService.removeMessage(message);
        };

        // TODO: add to config
        var fadeOutTime = 4000;

        $interval(function(){
          notificationsService.removeFirstMessage();
        }, fadeOutTime);
      }

      return {
        restrict: 'EA',
        link: link,
        template: $templateCache.get('notifications.html'),
        scope: {
          message: '='
        }
      };
    }
  ]);
