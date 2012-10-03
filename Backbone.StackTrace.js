(function (factory) {
  if (typeof exports === 'object') {
    module.exports = factory(require('backbone'), require('underscore'));
  } else if (typeof define === 'function' && define.amd) {
    define(['backbone', 'underscore'], factory);
  } else {
    factory(Backbone, window._);
  }
}(function (Backbone, _) {

  Backbone.StackTrace = {
    tracer: new printStackTrace.implementation(),

    maxDepth: 128,

    verbose: false,

    oldtrigger: Backbone.Events.trigger,

    logString: function(item, depth, trigger, context) {
      var className, contextString, idString, matches, _ref, _ref2;
      matches = context != null ? (_ref = context.constructor) != null ? (_ref2 = _ref.toString()) != null ? _ref2.match(/function\s+(\w+)/) : void 0 : void 0 : void 0;
      className = matches != null ? matches[1] : void 0;
      idString = (context != null ? context.id : void 0) != null ? "#" + context.id : '';
      contextString = className != null ? "" + className + idString + ": " : '';
      return console.log("" + contextString + " " + trigger + ": " + item + " (" + depth + ")");
    },

    trigger: function() {
      var trigger = arguments[0],
          stack, _base;

      (_base = Backbone.StackTrace).stack || (_base.stack = []);
      stack = Backbone.StackTrace.tracer.run();

      Backbone.StackTrace.stack.push(stack[3]);

      if (Backbone.StackTrace.verbose === true) {
        Backbone.StackTrace.logString(stack[3], Backbone.StackTrace.stack.length, trigger, this);
      }

      if (Backbone.StackTrace.stack.length >= Backbone.StackTrace.maxDepth) {
        _.each(Backbone.StackTrace.stack, function(item, index) {
          return Backbone.StackTrace.logString(item, index, trigger);
        });

        console.log("Backbone.StackTrace: stack too deep (" + Backbone.StackTrace.stack.length + ")");
        throw "Backbone.StackTrace: stack too deep (" + Backbone.StackTrace.stack.length + ")";
      } else {
        Backbone.StackTrace.oldtrigger.apply(this, arguments);
      }

      return Backbone.StackTrace.stack.pop();
    }
  };

  Backbone.Events.trigger = Backbone.StackTrace.trigger;

  Backbone.Collection.prototype.trigger = Backbone.StackTrace.trigger;

  Backbone.Model.prototype.trigger = Backbone.StackTrace.trigger;

  Backbone.View.prototype.trigger = Backbone.StackTrace.trigger;

  Backbone.Router.prototype.trigger = Backbone.StackTrace.trigger;

  Backbone.History.prototype.trigger = Backbone.StackTrace.trigger;

}));
