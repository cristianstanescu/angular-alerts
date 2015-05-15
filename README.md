#angularjs-notify

Show alert messages with **AngularJS** (for easy **Ruby on Rails** integration)

#Install

> bower install angularjs-notify --save

#Usage

For a working example, see the examples folder.

You just need to add the `angularjsNotify` module to your AngularJS app and include the
`Notify` service when you need to show notifications.

```js
angular.

  module('examples', [
    'angularjsNotify',
    'ngAnimate'
  ]).

  controller('angularjsNotifyExampleController', [
    '$scope', 'Notify',
    function ($scope, Notify) {
      $scope.addNotification = function (msgType, msg) {
        Notify.addMessage(msg, msgType);
      };
    }
  ]);
```

The notifications will appear where the **angularjsNotify** directive in included inside your
app's HTML template:

```html
<body>
    <angularjs-notify></angularjs-notify>
</body>
```

You can use CSS to set the position for the directive where you want the notifications to appear
(left, right, bottom, middle, etc).

#Configuration

You can use a provider in the configuration phase of your Angular app to customize some properties:

```js
config(['NotifyProvider', function (NotifyProvider) {
    NotifyProvider.config.displayTime = 3000;
}]).
```

By default, **angularjs-notify** will setup contextual methods for integration with Twitter
Bootstrap (the template used for displaying messagesis also a Twitter Bootstrap alert) and will try
to remove some keys from **Ruby on Rails** responses:

```js
var config = {
    contexts: ['danger', 'warning', 'info', 'success'],
    keysToSkip: ['base', 'error'],
    displayTime: 7000
};
```

#Working with Ruby on Rails

Say you have an Angular app that calls a Rails server for some data and you receive a JSON response
with an error like this:

```json
{"base": ["Your are not Donald Draper!"]}
```

In Angular, you might deal with an `$http` error response:

```js
function (httpResponse) {
    Notify.danger(httpResponse.data);
}
```

That's all, the **angularjsNotify** directive will display: "Your are not Donald Draper!" as a
Twitter Bootstrap alert.

Multiple errors will be displayed individually.

#Dependencies

Tested on AngularJS 1.3.15 with [lodash](https://lodash.com/) 3.8.0.
