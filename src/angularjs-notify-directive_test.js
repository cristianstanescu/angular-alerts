describe('angularjsNotify', function () {
  var $compile, $scope, element, Notify;

  function MessagesService() {
    var that = this;

    this.messages = [{ context: 'one' }, { context: 'two' }];

    this.getMessages = function () {
      return that.messages;
    };

    this.addMessage = function (message) {
      that.messages.push(message);
    };

    this.lastMessage = function () {
      return "this is the last";
    };
  }

  beforeEach(function () {
    Notify = new MessagesService();

    module('angularjsNotify', function ($provide) {
      $provide.value('Notify', Notify);
    });
    module('notifications.html');
  });

  beforeEach(inject(function (_$compile_, _$rootScope_){
    $scope = _$rootScope_;

    $scope.messages = [];

    element = _$compile_('<angularjs-notify></angularjs-notify>')($scope);

    $scope.$digest();
  }));

  it('adds divs with alert classes', function () {
    // The following functions are based on jQuery or Angular's jqLite
    // We need to wrap the element in order to get the html() including the root
    // container specified in the template
    element.wrap('<div>');
    var element_html = element.parent().html();

    expect(element_html).toContain('div class="alert alert-');
  });

  it('displays all alert messages texts set', function () {
    Notify.messages = [
      {
        text: "Well done! You successfully read this important alert message."
      },
      {
        text: "Warning! Better check yourself, you're not looking too good."
      }
    ];

    $scope.$digest();

    expect(element.html()).
      toContain("Well done! You successfully read this important alert message.");
    expect(element.html()).
      toContain("Warning! Better check yourself, you're not looking too good.");
  });

  it('it builds alert contextual classes for all messages', function () {
    Notify.messages = [{ context: 'success' }, { context: 'info' }];

    $scope.$digest();

    expect(element.html()).toContain('alert-success');
    expect(element.html()).toContain('alert-info');
  });

  it('uses the Notify service to get messages', function () {
    Notify.addMessage("fdafds");
    $scope.$digest();

    expect(element.html().match(/alert alert-/g).length).toEqual(3);
  });
});
