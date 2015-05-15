#angular-notifications

Show alert messages with **AngularJS** (for easy **Ruby on Rails** integration)

#Install

> bower install angular-notifications --save

#Usage

For a working example, see the examples folder.

You just need to add the `angularNotifications` module to your AngularJS app and include the
`Notify` service when you need to show notifications.

```
angular.

  module('examples', [
    'angularNotifications',
    'ngAnimate'
  ]).

  controller('angularNotificationsExampleController', [
    '$scope', 'Notify',
    function ($scope, Notify) {
      $scope.addNotification = function (msgType, msg) {
        Notify.addMessage(msg, msgType);
      };
    }
  ]);
```

The notifications will appear where the **angularNotifications** directive in included inside your
app's HTML template:

```
<body>
    <angular-notifications></angular-notifications>
</body>
```

You can use CSS to set the position for the directive where you want the notifications to appear
(left, right, bottom, middle, etc).

#Configuration

You can use a provider in the configuration phase of your Angular app to customize some properties:

```
config(['NotifyProvider', function (NotifyProvider) {
    NotifyProvider.config.displayTime = 3000;
}]).
```

By default, **angular-notifications** will setup contextual methods for integration with Twitter
Bootstrap (the template used for displaying messagesis also a Twitter Bootstrap alert) and will try
to remove some keys from **Ruby on Rails** responses:

```
var config = {
    contexts: ['danger', 'warning', 'info', 'success'],
    keysToSkip: ['base', 'error'],
    displayTime: 7000
};
```

#Working with Ruby on Rails

Say you have an Angular app that calls a Rails server for some data and you receive a JSON response
with an error like this:

```
{"base": ["Your are not Donald Draper!"]}
```

In Angular, you might deal with an `$http` error response:

```
function (httpResponse) {
    Notify.danger(httpResponse.data);
}
```

That's all, the **angularNotifications** directive will display: "Your are not Donald Draper!" as
a Twitter Bootstrap alert.

Multiple errors will be displayed individually.

#Dependencies

Other than the obvious AngularJS, [lodash](https://lodash.com/), because I'm lazy and it's awesome.
