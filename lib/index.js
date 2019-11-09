'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

var re = new RegExp(/:(\d+):\d+\)$/);

function __line() {
  var trace = new Error().stack.split('at ')[3].trim();
  var m = re.exec(trace);
  return m && m.length > 0 ? m[1] : 0;
}

var Samples =
/*#__PURE__*/
function () {
  function Samples(testFn) {
    var _this = this;

    _classCallCheck(this, Samples);

    this._samples = [];
    this._output = [];
    if (!testFn || typeof testFn !== 'function') throw new Error('Samples needs testFn as a callback function');
    this.testFn = testFn;

    this._collectFn = function (example, result, ln, test) {
      _this._output.push({
        example: example,
        ln: ln,
        result: result,
        test: test
      });
    };

    this._dbgFn = function (sample, result, ln, test) {
      console.log(sample, 'at', ln);
      if (test) console.log('test', test);
      console.log('output', JSON.stringify(result, null, 2));
    };
  }

  _createClass(Samples, [{
    key: "add",
    value: function add(dbg, example) {
      var test = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

      var ln = __line();

      this._samples.push({
        ln: ln,
        example: example,
        dbg: dbg,
        test: test
      });

      return this;
    }
  }, {
    key: "checkAll",
    value: function checkAll(cb) {
      this.check(null, cb);
    }
  }, {
    key: "checkEach",
    value: function checkEach(cb) {
      this.check(cb, null);
    }
  }, {
    key: "check",
    value: function check(collectFn) {
      var doneFn = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      var hasIsolates = false;
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = this._samples[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var ex = _step.value;

          if (ex.dbg) {
            hasIsolates = true;
            break;
          }
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator["return"] != null) {
            _iterator["return"]();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = this._samples[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var _ex = _step2.value;

          if (!hasIsolates || _ex.dbg) {
            var result = this.testFn(_ex.example);

            if (_ex.dbg) {
              this._dbgFn(_ex.example, result, _ex.ln, _ex.test);
            } else {
              collectFn = collectFn ? collectFn : this._collectFn;
              collectFn(_ex.example, result, _ex.ln, _ex.test);
            }
          }
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2["return"] != null) {
            _iterator2["return"]();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }

      if (!hasIsolates && doneFn) doneFn(this._output);
    }
  }]);

  return Samples;
}();

function samples(testFn) {
  return new Samples(testFn);
}

exports.samples = samples;
