describe('messagesService', function() {
  var messagesService;

  beforeEach(module('search.messages-service'));

  beforeEach(function() {
    inject(function($injector) {
      messagesService = $injector.get('messagesService');
    });
  });

  describe('addMessage', function() {
    describe('adds new messages to the list', function() {
      describe('when message argument is a string', function() {
        it('adds one new message', function() {
          messagesService.addMessage("Success");
          expect(messagesService.getMessages()[0].text).
            toEqual("Success");
        });
      });

      describe('when message argument is an object', function() {
        it('with one attribute with String value, one message', function() {
          messagesService.addMessage({"email":"can't be blank"});
          expect(messagesService.getMessages().length).toEqual(1);
        });

        it('with one attribute with array value, multiple messages', function() {
          messagesService.addMessage({
            "email":["can't be blank", "is not an email"]
          });
          expect(messagesService.getMessages().length).toEqual(2);
        });

        it('with multiple attributes, multiple messages', function() {
          messagesService.addMessage({
            "email":["can't be blank", "is not an email"],
            "frequency":["is not a number", "is out of bounds"]
          });
          expect(messagesService.getMessages().length).toEqual(4);
        });
      });

      it('as objects with "context", "text" attributes', function() {
        messagesService.addMessage(
          {
            "email":["can't be blank", "is not an email"],
            "frequency": "is out of bounds"
          },
          'danger'
        );

        _.each(messagesService.getMessages(), function(message) {
          expect(_.has(message, 'context')).toEqual(true);
          expect(_.has(message, 'text')).toEqual(true);
        });
      });

      it('sets default context to "info" when none given', function() {
        messagesService.addMessage({"email":"can't be blank"});
        expect(messagesService.getMessages()[0].context).toEqual('info');
      });

      it('puts the attribute before the values as text built', function() {
        messagesService.addMessage({"email":"can't be blank"});
        expect(messagesService.getMessages()[0].text).
          toEqual("Email can't be blank");
      });
    });
  });

  describe('addDanger', function() {
    it('adds an danger with "danger" context', function() {
      messagesService.addDanger({"email":"can't be blank"});
      expect(messagesService.getMessages()[0].context).toEqual('danger');
    });
  });

  describe('addWarning', function() {
    it('adds an warning with "warning" context', function() {
      messagesService.addWarning({"email":"can't be blank"});
      expect(messagesService.getMessages()[0].context).toEqual('warning');
    });
  });

  describe('addInfo', function() {
    it('adds an info with "info" context', function() {
      messagesService.addInfo({"email":"can't be blank"});
      expect(messagesService.getMessages()[0].context).toEqual('info');
    });
  });

  describe('addSuccess', function() {
    it('adds an success with "success" context', function() {
      messagesService.addSuccess({"email":"can't be blank"});
      expect(messagesService.getMessages()[0].context).toEqual('success');
    });
  });

  describe('getMessages', function() {
    it('only returns 10 maximum messages', function() {
      _.times(15, function() {
        messagesService.addSuccess({"email":"can't be blank"});
      });
      expect(messagesService.getMessages().length).toEqual(10);
    });
  });
});
