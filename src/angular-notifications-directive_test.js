describe('asraMessagesDirective', function() {
  var $compile, $rootScope, element, messagesService;

  function MessagesService() {
    var messages = [{ context: 'one' }, { context: 'two' }];

    this.getMessages = function () {
        return messages;
    };
  }

  beforeEach(function() {
    module('search.messages-directive', function ($provide) {
      $provide.value('messagesService', new MessagesService());
    });
    module('app/assets/javascripts/components/search/messages.html');
    module('app/assets/javascripts/components/search/alert-timeout.html');
  });

  beforeEach(inject(function(_$compile_, _$rootScope_, $injector, $templateCache){
    $compile = _$compile_;
    $rootScope = _$rootScope_;
    var $httpBackend = $injector.get('$httpBackend');

    // Mock the request for the template. Respond with the template loaded
    // into the $templateCache by the 'ng-html2js' preprocessor
    $httpBackend.
      whenGET('<%= asset_path("components/search/messages.html") %>').
      respond($templateCache.get(
        'app/assets/javascripts/components/search/messages.html'
      ));

    $httpBackend.
      whenGET('<%= asset_path("components/search/alert-timeout.html") %>').
      respond($templateCache.get(
        'app/assets/javascripts/components/search/alert-timeout.html'
      ));

    element = $compile('<asra-messages></asra-messages>')($rootScope);

    $httpBackend.flush();
  }));

  it('replaces the element with the appropriate content', function() {
    // The following functions are based on jQuery or Angular's jqLite
    // We need to wrap the element in order to get the html() including the root
    // container specified in the template
    element.wrap('<div>');
    var element_html = element.parent().html();

    expect(element_html).not.toContain('<asra-messages></asra-messages>');
    expect(element_html).toContain('<div class="alerts-panel row">');
  });

  it('displays all alert messages texts set in scope', function() {
    $rootScope.messages = [
      {
        text: "Well done! You successfully read this important alert message."
      },
      {
        text: "Warning! Better check yourself, you're not looking too good."
      }
    ];

    $rootScope.$digest();

    expect(element.html()).
      toContain("Well done! You successfully read this important alert message.");
    expect(element.html()).
      toContain("Warning! Better check yourself, you're not looking too good.");
  });

  it('it builds alert contextual classes for all messages', function() {
    $rootScope.messages = [{ context: 'success' }, { context: 'info' }];
    $rootScope.$digest();

    expect(element.html()).toContain('alert-success');
    expect(element.html()).toContain('alert-info');
  });

  it('uses the messages service to get messages', function() {
    expect($rootScope.messages.length).toEqual(2);
  });
});
