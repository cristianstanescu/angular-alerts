describe('Notify', function () {
  var Notify;

  beforeEach(module('angularNotifications'));

  beforeEach(function () {
    inject(function ($injector) {
      Notify = $injector.get('Notify');
    });
  });

  describe('addMessage', function () {
    describe('adds new messages to the list', function () {
      describe('when message argument is a string', function () {
        it('adds one new message', function () {
          Notify.addMessage("Success");
          expect(Notify.getMessages()[0].text).toEqual("Success");
        });
      });

// {"base":["Quantity you are trying to buy (2) is greater than the one available (1). You can't buy more
//  gift cards than the ones available."]}

      describe('when message argument is an object', function () {
        it('with one attribute with String value, one message', function () {
          Notify.addMessage({"email": "can't be blank"});
          expect(Notify.getMessages().length).toEqual(1);
        });

        it('with one attribute with array value, multiple messages', function () {
          Notify.addMessage({
            "email":["can't be blank", "is not an email"]
          });
          expect(Notify.getMessages().length).toEqual(2);
        });

        it('with multiple attributes, multiple messages', function () {
          Notify.addMessage({
            "email":["can't be blank", "is not an email"],
            "frequency":["is not a number", "is out of bounds"]
          });
          expect(Notify.getMessages().length).toEqual(4);
        });
      });

      it('as objects with "context", "text" attributes', function () {
        Notify.addMessage(
          {
            "email":["can't be blank", "is not an email"],
            "frequency": "is out of bounds"
          },
          'danger'
        );

        _.each(Notify.getMessages(), function (message) {
          expect(_.has(message, 'context')).toEqual(true);
          expect(_.has(message, 'text')).toEqual(true);
        });
      });

      it('sets default context to "info" when none given', function () {
        Notify.addMessage({"email": "can't be blank"});
        expect(Notify.getMessages()[0].context).toEqual('info');
      });

      it('puts the attribute before the values as text built', function () {
        Notify.addMessage({"email": "can't be blank"});
        expect(Notify.getMessages()[0].text).
          toEqual("Email can't be blank");
      });
    });
  });

  describe('addDanger', function () {
    it('adds an danger with "danger" context', function () {
      Notify.danger({"email": "can't be blank"});
      expect(Notify.getMessages()[0].context).toEqual('danger');
    });
  });

  describe('addWarning', function () {
    it('adds an warning with "warning" context', function () {
      Notify.warning({"email": "can't be blank"});
      expect(Notify.getMessages()[0].context).toEqual('warning');
    });
  });

  describe('addInfo', function () {
    it('adds an info with "info" context', function () {
      Notify.info({"email": "can't be blank"});
      expect(Notify.getMessages()[0].context).toEqual('info');
    });
  });

  describe('addSuccess', function () {
    it('adds an success with "success" context', function () {
      Notify.success({"email": "can't be blank"});
      expect(Notify.getMessages()[0].context).toEqual('success');
    });
  });

  describe('getMessages', function () {
    it('only returns 10 maximum messages', function () {
      _.times(15, function () {
        Notify.success({"email": "can't be blank"});
      });
      expect(Notify.getMessages().length).toEqual(10);
    });
  });
});
