/**
 * angularjs-notify - AngularJS plugin to show notifications. Has a directive for positioning the notifications and works out of the box with Rails
 * @author Cristian Stănescu
 * @version v1.3.2
 * @link https://github.com/cristianstanescu/angularjs-notify
 * @license MIT
 */
angular.

  module('angularjsNotify', []).

  provider('Notify', function AngularjsNotifyProvider() {
    var config = {
      contexts: ['danger', 'warning', 'info', 'success'],
      keysToSkip: ['base', 'error'],
      displayTime: 7000
    };

    function MessagesService(config) {
      var contexts = config.contexts;
      var keysToSkip = config.keysToSkip;
      var messages = [];

      this.displayTime = config.displayTime;

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
        function attributeForDisplay(attribute) {
          if (!attribute || keysToSkip.indexOf(attribute.toLowerCase()) > -1) {
            return '';
          } else {
            return attribute.replace(/_/g, ' ') + ' ';
          }
        }

        function addNewMessage(attribute, text) {
          var msg = (attributeForDisplay(attribute) + text).trim();
          msg = msg.charAt(0).toUpperCase() + msg.slice(1);

          messages.push({
            context: context || 'info',
            text: msg,
            attribute: attribute
          });

          if (messages.length >= 10) {
            messages = messages.slice(0, 10);
          }
        }

        function parseCollection(message) {
          angular.forEach(message, function (value, key, list) {
            if (value instanceof Array) {
              angular.forEach(value, function(text) {
                addNewMessage(key, text);
              });
            } else {
              var attribute = (typeof key === 'string') ? key : null;
              addNewMessage(attribute, value);
            }
          });
        }

        if (typeof message === 'string') {
          addNewMessage(null, message);
        } else {
          parseCollection(message);
        }
      };

      // Returns an Array of all messages added
      this.getMessages = function () {
        return messages;
      };

      this.removeFirstMessage = function () {
        messages = messages.slice(1);
      };

      this.removeMessage = function (message) {
        messages = messages.filter(function (msg) {
          return msg === message;
        });
      };

      this.removeAllMessages = function () {
        messages = [];
      };

      // Return the last message added
      this.lastMessage = function () {
        return messages.slice(-1)[0];
      };

      // For each element of the `contexts` variable we create a new method on
      // the MessageService that delegates a call to `addMessage` but sets the
      // context.
      contexts.reduce(function(result, context) {
        result[context] = function (message) {
          this.addMessage(message, context);
        };
        return result;
      }, this);
    }

    this.config = config;

    this.$get = function notifyFactory() {
      return new MessagesService(config);
    };
  }).

  directive('angularjsNotify', [
    'Notify', '$templateCache', '$timeout',
    function(Notify, $templateCache, $timeout) {

      function link(scope, element, attrs) {
        var displayTime = Notify.displayTime;

        function startRemoval(message) {
          $timeout(function () {
            Notify.removeMessage(message);
          }, displayTime);
        }

        scope.$watch(
          Notify.getMessages,
          function (newMessages, oldMessages) {
            scope.messages = newMessages;

            if (newMessages.length > oldMessages.length) {
              startRemoval(Notify.lastMessage());
            }
          },
          true
        );

        scope.removeNotificationMessage = function (message) {
          Notify.removeMessage(message);
        };
      }

      return {
        restrict: 'EA',
        link: link,
        template: $templateCache.get('notifications.html'),
        scope: {}
      };
    }
  ]);

angular.module('angularjsNotify').run(['$templateCache', function($templateCache) {$templateCache.put('notifications.html','<div class="alert alert-{{ message.context }} alert-dismissible fade in animate-hide" message="message" ng-repeat="message in messages.slice().reverse()"><button type="button" class="close" ng-click="removeNotificationMessage(message)"><span aria-hidden="true">&times;</span> <span class="sr-only">Close</span></button> {{ message.text }}</div>');}]);