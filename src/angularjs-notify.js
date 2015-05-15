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
            return attribute.replace('_', ' ') + ' ';
          }
        }

        function addNewMessage(attribute, text) {
          messages.push({
            context: context || 'info',
            text: _.trim(_.capitalize(attributeForDisplay(attribute) + text))
          });

          if (messages.length >= 10) {
            messages = _.slice(messages, 0, 10);
          }
        }

        function parseCollection(message) {
          _.each(message, function (value, key, list) {
            if (value instanceof Array) {
              _.each(value, function(text) {
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
        messages = _.rest(messages);
      };

      this.removeMessage = function (message) {
        messages = _.without(messages, message);
      };

      this.removeAllMessages = function () {
        messages = [];
      };

      // Return the last message added
      this.lastMessage = function () {
        return _.last(messages);
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
