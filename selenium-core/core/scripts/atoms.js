var COMPILED = true, goog = goog || {};
goog.global = this;
goog.DEBUG = true;
goog.LOCALE = "en";
goog.evalWorksForGlobals_ = null;
goog.provide = function(a) {
  if(!COMPILED) {
    if(goog.getObjectByName(a) && !goog.implicitNamespaces_[a]) {
      throw Error('Namespace "' + a + '" already declared.');
    }
    for(var b = a;b = b.substring(0, b.lastIndexOf("."));) {
      goog.implicitNamespaces_[b] = true
    }
  }
  goog.exportPath_(a)
};
goog.setTestOnly = function(a) {
  if(COMPILED && !goog.DEBUG) {
    a = a || "";
    throw Error("Importing test-only code into non-debug environment" + a ? ": " + a : ".");
  }
};
if(!COMPILED) {
  goog.implicitNamespaces_ = {}
}
goog.exportPath_ = function(a, b, c) {
  a = a.split(".");
  c = c || goog.global;
  !(a[0] in c) && c.execScript && c.execScript("var " + a[0]);
  for(var d;a.length && (d = a.shift());) {
    if(!a.length && goog.isDef(b)) {
      c[d] = b
    }else {
      c = c[d] ? c[d] : c[d] = {}
    }
  }
};
goog.getObjectByName = function(a, b) {
  var c = a.split("."), d = b || goog.global;
  for(var e;e = c.shift();) {
    if(goog.isDefAndNotNull(d[e])) {
      d = d[e]
    }else {
      return null
    }
  }
  return d
};
goog.globalize = function(a, b) {
  var c = b || goog.global;
  for(var d in a) {
    c[d] = a[d]
  }
};
goog.addDependency = function(a, b, c) {
  if(!COMPILED) {
    var d;
    a = a.replace(/\\/g, "/");
    var e = goog.dependencies_;
    for(var f = 0;d = b[f];f++) {
      e.nameToPath[d] = a;
      a in e.pathToNames || (e.pathToNames[a] = {});
      e.pathToNames[a][d] = true
    }
    for(d = 0;b = c[d];d++) {
      a in e.requires || (e.requires[a] = {});
      e.requires[a][b] = true
    }
  }
};
goog.require = function(a) {
  if(!COMPILED) {
    if(!goog.getObjectByName(a)) {
      var b = goog.getPathFromDeps_(a);
      if(b) {
        goog.included_[b] = true;
        goog.writeScripts_()
      }else {
        a = "goog.require could not find: " + a;
        goog.global.console && goog.global.console.error(a);
        throw Error(a);
      }
    }
  }
};
goog.basePath = "";
goog.nullFunction = function() {
};
goog.identityFunction = function(a) {
  return a
};
goog.abstractMethod = function() {
  throw Error("unimplemented abstract method");
};
goog.addSingletonGetter = function(a) {
  a.getInstance = function() {
    return a.instance_ || (a.instance_ = new a)
  }
};
if(!COMPILED) {
  goog.included_ = {};
  goog.dependencies_ = {pathToNames:{}, nameToPath:{}, requires:{}, visited:{}, written:{}};
  goog.inHtmlDocument_ = function() {
    var a = goog.global.document;
    return typeof a != "undefined" && "write" in a
  };
  goog.findBasePath_ = function() {
    if(goog.global.CLOSURE_BASE_PATH) {
      goog.basePath = goog.global.CLOSURE_BASE_PATH
    }else {
      if(goog.inHtmlDocument_()) {
        var a = goog.global.document.getElementsByTagName("script");
        for(var b = a.length - 1;b >= 0;--b) {
          var c = a[b].src, d = c.lastIndexOf("?");
          d = d == -1 ? c.length : d;
          if(c.substr(d - 7, 7) == "base.js") {
            goog.basePath = c.substr(0, d - 7);
            return
          }
        }
      }
    }
  };
  goog.importScript_ = function(a) {
    var b = goog.global.CLOSURE_IMPORT_SCRIPT || goog.writeScriptTag_;
    if(!goog.dependencies_.written[a] && b(a)) {
      goog.dependencies_.written[a] = true
    }
  };
  goog.writeScriptTag_ = function(a) {
    if(goog.inHtmlDocument_()) {
      goog.global.document.write('<script type="text/javascript" src="' + a + '"><\/script>');
      return true
    }else {
      return false
    }
  };
  goog.writeScripts_ = function() {
    function a(f) {
      if(!(f in d.written)) {
        if(!(f in d.visited)) {
          d.visited[f] = true;
          if(f in d.requires) {
            for(var g in d.requires[f]) {
              if(g in d.nameToPath) {
                a(d.nameToPath[g])
              }else {
                if(!goog.getObjectByName(g)) {
                  throw Error("Undefined nameToPath for " + g);
                }
              }
            }
          }
        }
        if(!(f in c)) {
          c[f] = true;
          b.push(f)
        }
      }
    }
    var b = [], c = {}, d = goog.dependencies_;
    for(var e in goog.included_) {
      d.written[e] || a(e)
    }
    for(e = 0;e < b.length;e++) {
      if(b[e]) {
        goog.importScript_(goog.basePath + b[e])
      }else {
        throw Error("Undefined script input");
      }
    }
  };
  goog.getPathFromDeps_ = function(a) {
    return a in goog.dependencies_.nameToPath ? goog.dependencies_.nameToPath[a] : null
  };
  goog.findBasePath_();
  goog.global.CLOSURE_NO_DEPS || goog.importScript_(goog.basePath + "deps.js")
}
goog.typeOf = function(a) {
  var b = typeof a;
  if(b == "object") {
    if(a) {
      if(a instanceof Array) {
        return"array"
      }else {
        if(a instanceof Object) {
          return b
        }
      }
      var c = Object.prototype.toString.call(a);
      if(c == "[object Window]") {
        return"object"
      }
      if(c == "[object Array]" || typeof a.length == "number" && typeof a.splice != "undefined" && typeof a.propertyIsEnumerable != "undefined" && !a.propertyIsEnumerable("splice")) {
        return"array"
      }
      if(c == "[object Function]" || typeof a.call != "undefined" && typeof a.propertyIsEnumerable != "undefined" && !a.propertyIsEnumerable("call")) {
        return"function"
      }
    }else {
      return"null"
    }
  }else {
    if(b == "function" && typeof a.call == "undefined") {
      return"object"
    }
  }
  return b
};
goog.propertyIsEnumerableCustom_ = function(a, b) {
  if(b in a) {
    for(var c in a) {
      if(c == b && Object.prototype.hasOwnProperty.call(a, b)) {
        return true
      }
    }
  }
  return false
};
goog.propertyIsEnumerable_ = function(a, b) {
  return a instanceof Object ? Object.prototype.propertyIsEnumerable.call(a, b) : goog.propertyIsEnumerableCustom_(a, b)
};
goog.isDef = function(a) {
  return a !== undefined
};
goog.isNull = function(a) {
  return a === null
};
goog.isDefAndNotNull = function(a) {
  return a != null
};
goog.isArray = function(a) {
  return goog.typeOf(a) == "array"
};
goog.isArrayLike = function(a) {
  var b = goog.typeOf(a);
  return b == "array" || b == "object" && typeof a.length == "number"
};
goog.isDateLike = function(a) {
  return goog.isObject(a) && typeof a.getFullYear == "function"
};
goog.isString = function(a) {
  return typeof a == "string"
};
goog.isBoolean = function(a) {
  return typeof a == "boolean"
};
goog.isNumber = function(a) {
  return typeof a == "number"
};
goog.isFunction = function(a) {
  return goog.typeOf(a) == "function"
};
goog.isObject = function(a) {
  a = goog.typeOf(a);
  return a == "object" || a == "array" || a == "function"
};
goog.getUid = function(a) {
  return a[goog.UID_PROPERTY_] || (a[goog.UID_PROPERTY_] = ++goog.uidCounter_)
};
goog.removeUid = function(a) {
  "removeAttribute" in a && a.removeAttribute(goog.UID_PROPERTY_);
  try {
    delete a[goog.UID_PROPERTY_]
  }catch(b) {
  }
};
goog.UID_PROPERTY_ = "closure_uid_" + Math.floor(Math.random() * 2147483648).toString(36);
goog.uidCounter_ = 0;
goog.getHashCode = goog.getUid;
goog.removeHashCode = goog.removeUid;
goog.cloneObject = function(a) {
  var b = goog.typeOf(a);
  if(b == "object" || b == "array") {
    if(a.clone) {
      return a.clone()
    }
    b = b == "array" ? [] : {};
    for(var c in a) {
      b[c] = goog.cloneObject(a[c])
    }
    return b
  }
  return a
};
goog.bindNative_ = function(a) {
  return a.call.apply(a.bind, arguments)
};
goog.bindJs_ = function(a, b) {
  var c = b || goog.global;
  if(arguments.length > 2) {
    var d = Array.prototype.slice.call(arguments, 2);
    return function() {
      var e = Array.prototype.slice.call(arguments);
      Array.prototype.unshift.apply(e, d);
      return a.apply(c, e)
    }
  }else {
    return function() {
      return a.apply(c, arguments)
    }
  }
};
goog.bind = function() {
  goog.bind = Function.prototype.bind && Function.prototype.bind.toString().indexOf("native code") != -1 ? goog.bindNative_ : goog.bindJs_;
  return goog.bind.apply(null, arguments)
};
goog.partial = function(a) {
  var b = Array.prototype.slice.call(arguments, 1);
  return function() {
    var c = Array.prototype.slice.call(arguments);
    c.unshift.apply(c, b);
    return a.apply(this, c)
  }
};
goog.mixin = function(a, b) {
  for(var c in b) {
    a[c] = b[c]
  }
};
goog.now = Date.now || function() {
  return+new Date
};
goog.globalEval = function(a) {
  if(goog.global.execScript) {
    goog.global.execScript(a, "JavaScript")
  }else {
    if(goog.global.eval) {
      if(goog.evalWorksForGlobals_ == null) {
        goog.global.eval("var _et_ = 1;");
        if(typeof goog.global._et_ != "undefined") {
          delete goog.global._et_;
          goog.evalWorksForGlobals_ = true
        }else {
          goog.evalWorksForGlobals_ = false
        }
      }
      if(goog.evalWorksForGlobals_) {
        goog.global.eval(a)
      }else {
        var b = goog.global.document, c = b.createElement("script");
        c.type = "text/javascript";
        c.defer = false;
        c.appendChild(b.createTextNode(a));
        b.body.appendChild(c);
        b.body.removeChild(c)
      }
    }else {
      throw Error("goog.globalEval not available");
    }
  }
};
goog.typedef = true;
goog.getCssName = function(a, b) {
  var c = function(e) {
    var f = e.split("-"), g = [];
    for(var h = 0;h < f.length;h++) {
      var i = goog.cssNameMapping_[f[h]];
      if(!i) {
        return e
      }
      g.push(i)
    }
    return g.join("-")
  }, d = function(e) {
    return goog.cssNameMapping_[e] || e
  };
  c = goog.cssNameMapping_ ? goog.cssNameMappingStyle_ == "BY_WHOLE" ? d : c : function(e) {
    return e
  };
  return b ? a + "-" + c(b) : c(a)
};
goog.setCssNameMapping = function(a, b) {
  goog.cssNameMapping_ = a;
  goog.cssNameMappingStyle_ = b
};
goog.getMsg = function(a, b) {
  var c = b || {};
  for(var d in c) {
    var e = ("" + c[d]).replace(/\$/g, "$$$$");
    a = a.replace(RegExp("\\{\\$" + d + "\\}", "gi"), e)
  }
  return a
};
goog.exportSymbol = function(a, b, c) {
  goog.exportPath_(a, b, c)
};
goog.exportProperty = function(a, b, c) {
  a[b] = c
};
goog.inherits = function(a, b) {
  function c() {
  }
  c.prototype = b.prototype;
  a.superClass_ = b.prototype;
  a.prototype = new c;
  a.prototype.constructor = a
};
goog.base = function(a, b) {
  var c = arguments.callee.caller;
  if(c.superClass_) {
    return c.superClass_.constructor.apply(a, Array.prototype.slice.call(arguments, 1))
  }
  var d = Array.prototype.slice.call(arguments, 2), e = false;
  for(var f = a.constructor;f;f = f.superClass_ && f.superClass_.constructor) {
    if(f.prototype[b] === c) {
      e = true
    }else {
      if(e) {
        return f.prototype[b].apply(a, d)
      }
    }
  }
  if(a[b] === c) {
    return a.constructor.prototype[b].apply(a, d)
  }else {
    throw Error("goog.base called from a method of one name to a method of a different name");
  }
};
goog.scope = function(a) {
  a.call(goog.global)
};goog.debug = {};
goog.debug.Error = function(a) {
  this.stack = Error().stack || "";
  if(a) {
    this.message = String(a)
  }
};
goog.inherits(goog.debug.Error, Error);
goog.debug.Error.prototype.name = "CustomError";goog.object = {};
goog.object.forEach = function(a, b, c) {
  for(var d in a) {
    b.call(c, a[d], d, a)
  }
};
goog.object.filter = function(a, b, c) {
  var d = {};
  for(var e in a) {
    if(b.call(c, a[e], e, a)) {
      d[e] = a[e]
    }
  }
  return d
};
goog.object.map = function(a, b, c) {
  var d = {};
  for(var e in a) {
    d[e] = b.call(c, a[e], e, a)
  }
  return d
};
goog.object.some = function(a, b, c) {
  for(var d in a) {
    if(b.call(c, a[d], d, a)) {
      return true
    }
  }
  return false
};
goog.object.every = function(a, b, c) {
  for(var d in a) {
    if(!b.call(c, a[d], d, a)) {
      return false
    }
  }
  return true
};
goog.object.getCount = function(a) {
  var b = 0;
  for(var c in a) {
    b++
  }
  return b
};
goog.object.getAnyKey = function(a) {
  for(var b in a) {
    return b
  }
};
goog.object.getAnyValue = function(a) {
  for(var b in a) {
    return a[b]
  }
};
goog.object.contains = function(a, b) {
  return goog.object.containsValue(a, b)
};
goog.object.getValues = function(a) {
  var b = [], c = 0;
  for(var d in a) {
    b[c++] = a[d]
  }
  return b
};
goog.object.getKeys = function(a) {
  var b = [], c = 0;
  for(var d in a) {
    b[c++] = d
  }
  return b
};
goog.object.getValueByKeys = function(a, b) {
  var c = goog.isArrayLike(b), d = c ? b : arguments;
  for(c = c ? 0 : 1;c < d.length;c++) {
    a = a[d[c]];
    if(!goog.isDef(a)) {
      break
    }
  }
  return a
};
goog.object.containsKey = function(a, b) {
  return b in a
};
goog.object.containsValue = function(a, b) {
  for(var c in a) {
    if(a[c] == b) {
      return true
    }
  }
  return false
};
goog.object.findKey = function(a, b, c) {
  for(var d in a) {
    if(b.call(c, a[d], d, a)) {
      return d
    }
  }
};
goog.object.findValue = function(a, b, c) {
  return(b = goog.object.findKey(a, b, c)) && a[b]
};
goog.object.isEmpty = function(a) {
  for(var b in a) {
    return false
  }
  return true
};
goog.object.clear = function(a) {
  for(var b in a) {
    delete a[b]
  }
};
goog.object.remove = function(a, b) {
  var c;
  if(c = b in a) {
    delete a[b]
  }
  return c
};
goog.object.add = function(a, b, c) {
  if(b in a) {
    throw Error('The object already contains the key "' + b + '"');
  }
  goog.object.set(a, b, c)
};
goog.object.get = function(a, b, c) {
  if(b in a) {
    return a[b]
  }
  return c
};
goog.object.set = function(a, b, c) {
  a[b] = c
};
goog.object.setIfUndefined = function(a, b, c) {
  return b in a ? a[b] : a[b] = c
};
goog.object.clone = function(a) {
  var b = {};
  for(var c in a) {
    b[c] = a[c]
  }
  return b
};
goog.object.transpose = function(a) {
  var b = {};
  for(var c in a) {
    b[a[c]] = c
  }
  return b
};
goog.object.PROTOTYPE_FIELDS_ = ["constructor", "hasOwnProperty", "isPrototypeOf", "propertyIsEnumerable", "toLocaleString", "toString", "valueOf"];
goog.object.extend = function(a) {
  var b, c;
  for(var d = 1;d < arguments.length;d++) {
    c = arguments[d];
    for(b in c) {
      a[b] = c[b]
    }
    for(var e = 0;e < goog.object.PROTOTYPE_FIELDS_.length;e++) {
      b = goog.object.PROTOTYPE_FIELDS_[e];
      if(Object.prototype.hasOwnProperty.call(c, b)) {
        a[b] = c[b]
      }
    }
  }
};
goog.object.create = function() {
  var a = arguments.length;
  if(a == 1 && goog.isArray(arguments[0])) {
    return goog.object.create.apply(null, arguments[0])
  }
  if(a % 2) {
    throw Error("Uneven number of arguments");
  }
  var b = {};
  for(var c = 0;c < a;c += 2) {
    b[arguments[c]] = arguments[c + 1]
  }
  return b
};
goog.object.createSet = function() {
  var a = arguments.length;
  if(a == 1 && goog.isArray(arguments[0])) {
    return goog.object.createSet.apply(null, arguments[0])
  }
  var b = {};
  for(var c = 0;c < a;c++) {
    b[arguments[c]] = true
  }
  return b
};var bot = {};
bot.ErrorCode = {SUCCESS:0, NO_SUCH_ELEMENT:7, NO_SUCH_FRAME:8, UNKNOWN_COMMAND:9, UNSUPPORTED_OPERATION:9, STALE_ELEMENT_REFERENCE:10, ELEMENT_NOT_VISIBLE:11, INVALID_ELEMENT_STATE:12, UNKNOWN_ERROR:13, ELEMENT_NOT_SELECTABLE:15, XPATH_LOOKUP_ERROR:19, NO_SUCH_WINDOW:23, INVALID_COOKIE_DOMAIN:24, UNABLE_TO_SET_COOKIE:25, MODAL_DIALOG_OPENED:26, MODAL_DIALOG_OPEN:27, SCRIPT_TIMEOUT:28};
bot.Error = function(a, b) {
  goog.debug.Error.call(this, b);
  this.code = a;
  this.name = bot.Error.NAMES_[a] || bot.Error.NAMES_[bot.ErrorCode.UNKNOWN_ERROR]
};
goog.inherits(bot.Error, goog.debug.Error);
bot.Error.NAMES_ = goog.object.transpose({NoSuchElementError:bot.ErrorCode.NO_SUCH_ELEMENT, NoSuchFrameError:bot.ErrorCode.NO_SUCH_FRAME, UnknownCommandError:bot.ErrorCode.UNKNOWN_COMMAND, StaleElementReferenceError:bot.ErrorCode.STALE_ELEMENT_REFERENCE, ElementNotVisibleError:bot.ErrorCode.ELEMENT_NOT_VISIBLE, InvalidElementStateError:bot.ErrorCode.INVALID_ELEMENT_STATE, UnknownError:bot.ErrorCode.UNKNOWN_ERROR, ElementNotSelectableError:bot.ErrorCode.ELEMENT_NOT_SELECTABLE, XPathLookupError:bot.ErrorCode.XPATH_LOOKUP_ERROR, 
NoSuchWindowError:bot.ErrorCode.NO_SUCH_WINDOW, InvalidCookieDomainError:bot.ErrorCode.INVALID_COOKIE_DOMAIN, UnableToSetCookieError:bot.ErrorCode.UNABLE_TO_SET_COOKIE, ModalDialogOpenedError:bot.ErrorCode.MODAL_DIALOG_OPENED, ModalDialogOpenError:bot.ErrorCode.MODAL_DIALOG_OPEN, ScriptTimeoutError:bot.ErrorCode.SCRIPT_TIMEOUT});
bot.Error.prototype.isAutomationError = true;
if(goog.DEBUG) {
  bot.Error.prototype.toString = function() {
    return"[" + this.name + "] " + this.message
  }
}
;goog.string = {};
goog.string.Unicode = {NBSP:"\u00a0"};
goog.string.startsWith = function(a, b) {
  return a.lastIndexOf(b, 0) == 0
};
goog.string.endsWith = function(a, b) {
  var c = a.length - b.length;
  return c >= 0 && a.indexOf(b, c) == c
};
goog.string.caseInsensitiveStartsWith = function(a, b) {
  return goog.string.caseInsensitiveCompare(b, a.substr(0, b.length)) == 0
};
goog.string.caseInsensitiveEndsWith = function(a, b) {
  return goog.string.caseInsensitiveCompare(b, a.substr(a.length - b.length, b.length)) == 0
};
goog.string.subs = function(a) {
  for(var b = 1;b < arguments.length;b++) {
    var c = String(arguments[b]).replace(/\$/g, "$$$$");
    a = a.replace(/\%s/, c)
  }
  return a
};
goog.string.collapseWhitespace = function(a) {
  return a.replace(/[\s\xa0]+/g, " ").replace(/^\s+|\s+$/g, "")
};
goog.string.isEmpty = function(a) {
  return/^[\s\xa0]*$/.test(a)
};
goog.string.isEmptySafe = function(a) {
  return goog.string.isEmpty(goog.string.makeSafe(a))
};
goog.string.isBreakingWhitespace = function(a) {
  return!/[^\t\n\r ]/.test(a)
};
goog.string.isAlpha = function(a) {
  return!/[^a-zA-Z]/.test(a)
};
goog.string.isNumeric = function(a) {
  return!/[^0-9]/.test(a)
};
goog.string.isAlphaNumeric = function(a) {
  return!/[^a-zA-Z0-9]/.test(a)
};
goog.string.isSpace = function(a) {
  return a == " "
};
goog.string.isUnicodeChar = function(a) {
  return a.length == 1 && a >= " " && a <= "~" || a >= "\u0080" && a <= "\ufffd"
};
goog.string.stripNewlines = function(a) {
  return a.replace(/(\r\n|\r|\n)+/g, " ")
};
goog.string.canonicalizeNewlines = function(a) {
  return a.replace(/(\r\n|\r|\n)/g, "\n")
};
goog.string.normalizeWhitespace = function(a) {
  return a.replace(/\xa0|\s/g, " ")
};
goog.string.normalizeSpaces = function(a) {
  return a.replace(/\xa0|[ \t]+/g, " ")
};
goog.string.trim = function(a) {
  return a.replace(/^[\s\xa0]+|[\s\xa0]+$/g, "")
};
goog.string.trimLeft = function(a) {
  return a.replace(/^[\s\xa0]+/, "")
};
goog.string.trimRight = function(a) {
  return a.replace(/[\s\xa0]+$/, "")
};
goog.string.caseInsensitiveCompare = function(a, b) {
  var c = String(a).toLowerCase(), d = String(b).toLowerCase();
  return c < d ? -1 : c == d ? 0 : 1
};
goog.string.numerateCompareRegExp_ = /(\.\d+)|(\d+)|(\D+)/g;
goog.string.numerateCompare = function(a, b) {
  if(a == b) {
    return 0
  }
  if(!a) {
    return-1
  }
  if(!b) {
    return 1
  }
  var c = a.toLowerCase().match(goog.string.numerateCompareRegExp_), d = b.toLowerCase().match(goog.string.numerateCompareRegExp_), e = Math.min(c.length, d.length);
  for(var f = 0;f < e;f++) {
    var g = c[f], h = d[f];
    if(g != h) {
      c = parseInt(g, 10);
      if(!isNaN(c)) {
        d = parseInt(h, 10);
        if(!isNaN(d) && c - d) {
          return c - d
        }
      }
      return g < h ? -1 : 1
    }
  }
  if(c.length != d.length) {
    return c.length - d.length
  }
  return a < b ? -1 : 1
};
goog.string.encodeUriRegExp_ = /^[a-zA-Z0-9\-_.!~*'()]*$/;
goog.string.urlEncode = function(a) {
  a = String(a);
  if(!goog.string.encodeUriRegExp_.test(a)) {
    return encodeURIComponent(a)
  }
  return a
};
goog.string.urlDecode = function(a) {
  return decodeURIComponent(a.replace(/\+/g, " "))
};
goog.string.newLineToBr = function(a, b) {
  return a.replace(/(\r\n|\r|\n)/g, b ? "<br />" : "<br>")
};
goog.string.htmlEscape = function(a, b) {
  if(b) {
    return a.replace(goog.string.amperRe_, "&amp;").replace(goog.string.ltRe_, "&lt;").replace(goog.string.gtRe_, "&gt;").replace(goog.string.quotRe_, "&quot;")
  }else {
    if(!goog.string.allRe_.test(a)) {
      return a
    }
    if(a.indexOf("&") != -1) {
      a = a.replace(goog.string.amperRe_, "&amp;")
    }
    if(a.indexOf("<") != -1) {
      a = a.replace(goog.string.ltRe_, "&lt;")
    }
    if(a.indexOf(">") != -1) {
      a = a.replace(goog.string.gtRe_, "&gt;")
    }
    if(a.indexOf('"') != -1) {
      a = a.replace(goog.string.quotRe_, "&quot;")
    }
    return a
  }
};
goog.string.amperRe_ = /&/g;
goog.string.ltRe_ = /</g;
goog.string.gtRe_ = />/g;
goog.string.quotRe_ = /\"/g;
goog.string.allRe_ = /[&<>\"]/;
goog.string.unescapeEntities = function(a) {
  if(goog.string.contains(a, "&")) {
    return"document" in goog.global && !goog.string.contains(a, "<") ? goog.string.unescapeEntitiesUsingDom_(a) : goog.string.unescapePureXmlEntities_(a)
  }
  return a
};
goog.string.unescapeEntitiesUsingDom_ = function(a) {
  var b = goog.global.document.createElement("div");
  b.innerHTML = "<pre>x" + a + "</pre>";
  b.firstChild[goog.string.NORMALIZE_FN_] && b.firstChild[goog.string.NORMALIZE_FN_]();
  a = b.firstChild.firstChild.nodeValue.slice(1);
  b.innerHTML = "";
  return goog.string.canonicalizeNewlines(a)
};
goog.string.unescapePureXmlEntities_ = function(a) {
  return a.replace(/&([^;]+);/g, function(b, c) {
    switch(c) {
      case "amp":
        return"&";
      case "lt":
        return"<";
      case "gt":
        return">";
      case "quot":
        return'"';
      default:
        if(c.charAt(0) == "#") {
          var d = Number("0" + c.substr(1));
          if(!isNaN(d)) {
            return String.fromCharCode(d)
          }
        }
        return b
    }
  })
};
goog.string.NORMALIZE_FN_ = "normalize";
goog.string.whitespaceEscape = function(a, b) {
  return goog.string.newLineToBr(a.replace(/  /g, " &#160;"), b)
};
goog.string.stripQuotes = function(a, b) {
  var c = b.length;
  for(var d = 0;d < c;d++) {
    var e = c == 1 ? b : b.charAt(d);
    if(a.charAt(0) == e && a.charAt(a.length - 1) == e) {
      return a.substring(1, a.length - 1)
    }
  }
  return a
};
goog.string.truncate = function(a, b, c) {
  if(c) {
    a = goog.string.unescapeEntities(a)
  }
  if(a.length > b) {
    a = a.substring(0, b - 3) + "..."
  }
  if(c) {
    a = goog.string.htmlEscape(a)
  }
  return a
};
goog.string.truncateMiddle = function(a, b, c) {
  if(c) {
    a = goog.string.unescapeEntities(a)
  }
  if(a.length > b) {
    var d = Math.floor(b / 2), e = a.length - d;
    d += b % 2;
    a = a.substring(0, d) + "..." + a.substring(e)
  }
  if(c) {
    a = goog.string.htmlEscape(a)
  }
  return a
};
goog.string.specialEscapeChars_ = {"\u0000":"\\0", "\u0008":"\\b", "\u000c":"\\f", "\n":"\\n", "\r":"\\r", "\t":"\\t", "\u000b":"\\x0B", '"':'\\"', "\\":"\\\\"};
goog.string.jsEscapeCache_ = {"'":"\\'"};
goog.string.quote = function(a) {
  a = String(a);
  if(a.quote) {
    return a.quote()
  }else {
    var b = ['"'];
    for(var c = 0;c < a.length;c++) {
      var d = a.charAt(c), e = d.charCodeAt(0);
      b[c + 1] = goog.string.specialEscapeChars_[d] || (e > 31 && e < 127 ? d : goog.string.escapeChar(d))
    }
    b.push('"');
    return b.join("")
  }
};
goog.string.escapeString = function(a) {
  var b = [];
  for(var c = 0;c < a.length;c++) {
    b[c] = goog.string.escapeChar(a.charAt(c))
  }
  return b.join("")
};
goog.string.escapeChar = function(a) {
  if(a in goog.string.jsEscapeCache_) {
    return goog.string.jsEscapeCache_[a]
  }
  if(a in goog.string.specialEscapeChars_) {
    return goog.string.jsEscapeCache_[a] = goog.string.specialEscapeChars_[a]
  }
  var b = a, c = a.charCodeAt(0);
  if(c > 31 && c < 127) {
    b = a
  }else {
    if(c < 256) {
      b = "\\x";
      if(c < 16 || c > 256) {
        b += "0"
      }
    }else {
      b = "\\u";
      if(c < 4096) {
        b += "0"
      }
    }
    b += c.toString(16).toUpperCase()
  }
  return goog.string.jsEscapeCache_[a] = b
};
goog.string.toMap = function(a) {
  var b = {};
  for(var c = 0;c < a.length;c++) {
    b[a.charAt(c)] = true
  }
  return b
};
goog.string.contains = function(a, b) {
  return a.indexOf(b) != -1
};
goog.string.removeAt = function(a, b, c) {
  var d = a;
  if(b >= 0 && b < a.length && c > 0) {
    d = a.substr(0, b) + a.substr(b + c, a.length - b - c)
  }
  return d
};
goog.string.remove = function(a, b) {
  var c = RegExp(goog.string.regExpEscape(b), "");
  return a.replace(c, "")
};
goog.string.removeAll = function(a, b) {
  var c = RegExp(goog.string.regExpEscape(b), "g");
  return a.replace(c, "")
};
goog.string.regExpEscape = function(a) {
  return String(a).replace(/([-()\[\]{}+?*.$\^|,:#<!\\])/g, "\\$1").replace(/\x08/g, "\\x08")
};
goog.string.repeat = function(a, b) {
  return Array(b + 1).join(a)
};
goog.string.padNumber = function(a, b, c) {
  a = goog.isDef(c) ? a.toFixed(c) : String(a);
  c = a.indexOf(".");
  if(c == -1) {
    c = a.length
  }
  return goog.string.repeat("0", Math.max(0, b - c)) + a
};
goog.string.makeSafe = function(a) {
  return a == null ? "" : String(a)
};
goog.string.buildString = function() {
  return Array.prototype.join.call(arguments, "")
};
goog.string.getRandomString = function() {
  return Math.floor(Math.random() * 2147483648).toString(36) + Math.abs(Math.floor(Math.random() * 2147483648) ^ goog.now()).toString(36)
};
goog.string.compareVersions = function(a, b) {
  var c = 0, d = goog.string.trim(String(a)).split("."), e = goog.string.trim(String(b)).split("."), f = Math.max(d.length, e.length);
  for(var g = 0;c == 0 && g < f;g++) {
    var h = d[g] || "", i = e[g] || "", j = RegExp("(\\d*)(\\D*)", "g"), l = RegExp("(\\d*)(\\D*)", "g");
    do {
      var m = j.exec(h) || ["", "", ""], k = l.exec(i) || ["", "", ""];
      if(m[0].length == 0 && k[0].length == 0) {
        break
      }
      c = m[1].length == 0 ? 0 : parseInt(m[1], 10);
      var o = k[1].length == 0 ? 0 : parseInt(k[1], 10);
      c = goog.string.compareElements_(c, o) || goog.string.compareElements_(m[2].length == 0, k[2].length == 0) || goog.string.compareElements_(m[2], k[2])
    }while(c == 0)
  }
  return c
};
goog.string.compareElements_ = function(a, b) {
  if(a < b) {
    return-1
  }else {
    if(a > b) {
      return 1
    }
  }
  return 0
};
goog.string.HASHCODE_MAX_ = 4294967296;
goog.string.hashCode = function(a) {
  var b = 0;
  for(var c = 0;c < a.length;++c) {
    b = 31 * b + a.charCodeAt(c);
    b %= goog.string.HASHCODE_MAX_
  }
  return b
};
goog.string.uniqueStringCounter_ = Math.random() * 2147483648 | 0;
goog.string.createUniqueString = function() {
  return"goog_" + goog.string.uniqueStringCounter_++
};
goog.string.toNumber = function(a) {
  var b = Number(a);
  if(b == 0 && goog.string.isEmpty(a)) {
    return NaN
  }
  return b
};
goog.string.toCamelCaseCache_ = {};
goog.string.toCamelCase = function(a) {
  return goog.string.toCamelCaseCache_[a] || (goog.string.toCamelCaseCache_[a] = String(a).replace(/\-([a-z])/g, function(b, c) {
    return c.toUpperCase()
  }))
};
goog.string.toSelectorCaseCache_ = {};
goog.string.toSelectorCase = function(a) {
  return goog.string.toSelectorCaseCache_[a] || (goog.string.toSelectorCaseCache_[a] = String(a).replace(/([A-Z])/g, "-$1").toLowerCase())
};goog.asserts = {};
goog.asserts.ENABLE_ASSERTS = goog.DEBUG;
goog.asserts.AssertionError = function(a, b) {
  b.unshift(a);
  goog.debug.Error.call(this, goog.string.subs.apply(null, b));
  b.shift();
  this.messagePattern = a
};
goog.inherits(goog.asserts.AssertionError, goog.debug.Error);
goog.asserts.AssertionError.prototype.name = "AssertionError";
goog.asserts.doAssertFailure_ = function(a, b, c, d) {
  var e = "Assertion failed";
  if(c) {
    e += ": " + c;
    var f = d
  }else {
    if(a) {
      e += ": " + a;
      f = b
    }
  }
  throw new goog.asserts.AssertionError("" + e, f || []);
};
goog.asserts.assert = function(a, b) {
  goog.asserts.ENABLE_ASSERTS && !a && goog.asserts.doAssertFailure_("", null, b, Array.prototype.slice.call(arguments, 2));
  return a
};
goog.asserts.fail = function(a) {
  if(goog.asserts.ENABLE_ASSERTS) {
    throw new goog.asserts.AssertionError("Failure" + (a ? ": " + a : ""), Array.prototype.slice.call(arguments, 1));
  }
};
goog.asserts.assertNumber = function(a, b) {
  goog.asserts.ENABLE_ASSERTS && !goog.isNumber(a) && goog.asserts.doAssertFailure_("Expected number but got %s: %s.", [goog.typeOf(a), a], b, Array.prototype.slice.call(arguments, 2));
  return a
};
goog.asserts.assertString = function(a, b) {
  goog.asserts.ENABLE_ASSERTS && !goog.isString(a) && goog.asserts.doAssertFailure_("Expected string but got %s: %s.", [goog.typeOf(a), a], b, Array.prototype.slice.call(arguments, 2));
  return a
};
goog.asserts.assertFunction = function(a, b) {
  goog.asserts.ENABLE_ASSERTS && !goog.isFunction(a) && goog.asserts.doAssertFailure_("Expected function but got %s: %s.", [goog.typeOf(a), a], b, Array.prototype.slice.call(arguments, 2));
  return a
};
goog.asserts.assertObject = function(a, b) {
  goog.asserts.ENABLE_ASSERTS && !goog.isObject(a) && goog.asserts.doAssertFailure_("Expected object but got %s: %s.", [goog.typeOf(a), a], b, Array.prototype.slice.call(arguments, 2));
  return a
};
goog.asserts.assertArray = function(a, b) {
  goog.asserts.ENABLE_ASSERTS && !goog.isArray(a) && goog.asserts.doAssertFailure_("Expected array but got %s: %s.", [goog.typeOf(a), a], b, Array.prototype.slice.call(arguments, 2));
  return a
};
goog.asserts.assertBoolean = function(a, b) {
  goog.asserts.ENABLE_ASSERTS && !goog.isBoolean(a) && goog.asserts.doAssertFailure_("Expected boolean but got %s: %s.", [goog.typeOf(a), a], b, Array.prototype.slice.call(arguments, 2));
  return a
};
goog.asserts.assertInstanceof = function(a, b, c) {
  goog.asserts.ENABLE_ASSERTS && !(a instanceof b) && goog.asserts.doAssertFailure_("instanceof check failed.", null, c, Array.prototype.slice.call(arguments, 3))
};goog.array = {};
goog.array.ArrayLike = {};
goog.array.peek = function(a) {
  return a[a.length - 1]
};
goog.array.ARRAY_PROTOTYPE_ = Array.prototype;
goog.array.indexOf = goog.array.ARRAY_PROTOTYPE_.indexOf ? function(a, b, c) {
  goog.asserts.assert(a.length != null);
  return goog.array.ARRAY_PROTOTYPE_.indexOf.call(a, b, c)
} : function(a, b, c) {
  c = c == null ? 0 : c < 0 ? Math.max(0, a.length + c) : c;
  if(goog.isString(a)) {
    if(!goog.isString(b) || b.length != 1) {
      return-1
    }
    return a.indexOf(b, c)
  }
  for(c = c;c < a.length;c++) {
    if(c in a && a[c] === b) {
      return c
    }
  }
  return-1
};
goog.array.lastIndexOf = goog.array.ARRAY_PROTOTYPE_.lastIndexOf ? function(a, b, c) {
  goog.asserts.assert(a.length != null);
  return goog.array.ARRAY_PROTOTYPE_.lastIndexOf.call(a, b, c == null ? a.length - 1 : c)
} : function(a, b, c) {
  c = c == null ? a.length - 1 : c;
  if(c < 0) {
    c = Math.max(0, a.length + c)
  }
  if(goog.isString(a)) {
    if(!goog.isString(b) || b.length != 1) {
      return-1
    }
    return a.lastIndexOf(b, c)
  }
  for(c = c;c >= 0;c--) {
    if(c in a && a[c] === b) {
      return c
    }
  }
  return-1
};
goog.array.forEach = goog.array.ARRAY_PROTOTYPE_.forEach ? function(a, b, c) {
  goog.asserts.assert(a.length != null);
  goog.array.ARRAY_PROTOTYPE_.forEach.call(a, b, c)
} : function(a, b, c) {
  var d = a.length, e = goog.isString(a) ? a.split("") : a;
  for(var f = 0;f < d;f++) {
    f in e && b.call(c, e[f], f, a)
  }
};
goog.array.forEachRight = function(a, b, c) {
  var d = a.length, e = goog.isString(a) ? a.split("") : a;
  for(d = d - 1;d >= 0;--d) {
    d in e && b.call(c, e[d], d, a)
  }
};
goog.array.filter = goog.array.ARRAY_PROTOTYPE_.filter ? function(a, b, c) {
  goog.asserts.assert(a.length != null);
  return goog.array.ARRAY_PROTOTYPE_.filter.call(a, b, c)
} : function(a, b, c) {
  var d = a.length, e = [], f = 0, g = goog.isString(a) ? a.split("") : a;
  for(var h = 0;h < d;h++) {
    if(h in g) {
      var i = g[h];
      if(b.call(c, i, h, a)) {
        e[f++] = i
      }
    }
  }
  return e
};
goog.array.map = goog.array.ARRAY_PROTOTYPE_.map ? function(a, b, c) {
  goog.asserts.assert(a.length != null);
  return goog.array.ARRAY_PROTOTYPE_.map.call(a, b, c)
} : function(a, b, c) {
  var d = a.length, e = Array(d), f = goog.isString(a) ? a.split("") : a;
  for(var g = 0;g < d;g++) {
    if(g in f) {
      e[g] = b.call(c, f[g], g, a)
    }
  }
  return e
};
goog.array.reduce = function(a, b, c, d) {
  if(a.reduce) {
    return d ? a.reduce(goog.bind(b, d), c) : a.reduce(b, c)
  }
  var e = c;
  goog.array.forEach(a, function(f, g) {
    e = b.call(d, e, f, g, a)
  });
  return e
};
goog.array.reduceRight = function(a, b, c, d) {
  if(a.reduceRight) {
    return d ? a.reduceRight(goog.bind(b, d), c) : a.reduceRight(b, c)
  }
  var e = c;
  goog.array.forEachRight(a, function(f, g) {
    e = b.call(d, e, f, g, a)
  });
  return e
};
goog.array.some = goog.array.ARRAY_PROTOTYPE_.some ? function(a, b, c) {
  goog.asserts.assert(a.length != null);
  return goog.array.ARRAY_PROTOTYPE_.some.call(a, b, c)
} : function(a, b, c) {
  var d = a.length, e = goog.isString(a) ? a.split("") : a;
  for(var f = 0;f < d;f++) {
    if(f in e && b.call(c, e[f], f, a)) {
      return true
    }
  }
  return false
};
goog.array.every = goog.array.ARRAY_PROTOTYPE_.every ? function(a, b, c) {
  goog.asserts.assert(a.length != null);
  return goog.array.ARRAY_PROTOTYPE_.every.call(a, b, c)
} : function(a, b, c) {
  var d = a.length, e = goog.isString(a) ? a.split("") : a;
  for(var f = 0;f < d;f++) {
    if(f in e && !b.call(c, e[f], f, a)) {
      return false
    }
  }
  return true
};
goog.array.find = function(a, b, c) {
  b = goog.array.findIndex(a, b, c);
  return b < 0 ? null : goog.isString(a) ? a.charAt(b) : a[b]
};
goog.array.findIndex = function(a, b, c) {
  var d = a.length, e = goog.isString(a) ? a.split("") : a;
  for(var f = 0;f < d;f++) {
    if(f in e && b.call(c, e[f], f, a)) {
      return f
    }
  }
  return-1
};
goog.array.findRight = function(a, b, c) {
  b = goog.array.findIndexRight(a, b, c);
  return b < 0 ? null : goog.isString(a) ? a.charAt(b) : a[b]
};
goog.array.findIndexRight = function(a, b, c) {
  var d = a.length, e = goog.isString(a) ? a.split("") : a;
  for(d = d - 1;d >= 0;d--) {
    if(d in e && b.call(c, e[d], d, a)) {
      return d
    }
  }
  return-1
};
goog.array.contains = function(a, b) {
  return goog.array.indexOf(a, b) >= 0
};
goog.array.isEmpty = function(a) {
  return a.length == 0
};
goog.array.clear = function(a) {
  if(!goog.isArray(a)) {
    for(var b = a.length - 1;b >= 0;b--) {
      delete a[b]
    }
  }
  a.length = 0
};
goog.array.insert = function(a, b) {
  goog.array.contains(a, b) || a.push(b)
};
goog.array.insertAt = function(a, b, c) {
  goog.array.splice(a, c, 0, b)
};
goog.array.insertArrayAt = function(a, b, c) {
  goog.partial(goog.array.splice, a, c, 0).apply(null, b)
};
goog.array.insertBefore = function(a, b, c) {
  var d;
  arguments.length == 2 || (d = goog.array.indexOf(a, c)) < 0 ? a.push(b) : goog.array.insertAt(a, b, d)
};
goog.array.remove = function(a, b) {
  var c = goog.array.indexOf(a, b), d;
  if(d = c >= 0) {
    goog.array.removeAt(a, c)
  }
  return d
};
goog.array.removeAt = function(a, b) {
  goog.asserts.assert(a.length != null);
  return goog.array.ARRAY_PROTOTYPE_.splice.call(a, b, 1).length == 1
};
goog.array.removeIf = function(a, b, c) {
  b = goog.array.findIndex(a, b, c);
  if(b >= 0) {
    goog.array.removeAt(a, b);
    return true
  }
  return false
};
goog.array.concat = function() {
  return goog.array.ARRAY_PROTOTYPE_.concat.apply(goog.array.ARRAY_PROTOTYPE_, arguments)
};
goog.array.clone = function(a) {
  if(goog.isArray(a)) {
    return goog.array.concat(a)
  }else {
    var b = [], c = 0;
    for(var d = a.length;c < d;c++) {
      b[c] = a[c]
    }
    return b
  }
};
goog.array.toArray = function(a) {
  if(goog.isArray(a)) {
    return goog.array.concat(a)
  }
  return goog.array.clone(a)
};
goog.array.extend = function(a) {
  for(var b = 1;b < arguments.length;b++) {
    var c = arguments[b], d;
    if(goog.isArray(c) || (d = goog.isArrayLike(c)) && c.hasOwnProperty("callee")) {
      a.push.apply(a, c)
    }else {
      if(d) {
        var e = a.length, f = c.length;
        for(var g = 0;g < f;g++) {
          a[e + g] = c[g]
        }
      }else {
        a.push(c)
      }
    }
  }
};
goog.array.splice = function(a) {
  goog.asserts.assert(a.length != null);
  return goog.array.ARRAY_PROTOTYPE_.splice.apply(a, goog.array.slice(arguments, 1))
};
goog.array.slice = function(a, b, c) {
  goog.asserts.assert(a.length != null);
  return arguments.length <= 2 ? goog.array.ARRAY_PROTOTYPE_.slice.call(a, b) : goog.array.ARRAY_PROTOTYPE_.slice.call(a, b, c)
};
goog.array.removeDuplicates = function(a, b) {
  var c = b || a, d = {}, e = 0;
  for(var f = 0;f < a.length;) {
    var g = a[f++], h = goog.isObject(g) ? "o" + goog.getUid(g) : (typeof g).charAt(0) + g;
    if(!Object.prototype.hasOwnProperty.call(d, h)) {
      d[h] = true;
      c[e++] = g
    }
  }
  c.length = e
};
goog.array.binarySearch = function(a, b, c) {
  return goog.array.binarySearch_(a, c || goog.array.defaultCompare, false, b)
};
goog.array.binarySelect = function(a, b, c) {
  return goog.array.binarySearch_(a, b, true, undefined, c)
};
goog.array.binarySearch_ = function(a, b, c, d, e) {
  var f = 0, g = a.length;
  for(var h;f < g;) {
    var i = f + g >> 1, j;
    j = c ? b.call(e, a[i], i, a) : b(d, a[i]);
    if(j > 0) {
      f = i + 1
    }else {
      g = i;
      h = !j
    }
  }
  return h ? f : ~f
};
goog.array.sort = function(a, b) {
  goog.asserts.assert(a.length != null);
  goog.array.ARRAY_PROTOTYPE_.sort.call(a, b || goog.array.defaultCompare)
};
goog.array.stableSort = function(a, b) {
  for(var c = 0;c < a.length;c++) {
    a[c] = {index:c, value:a[c]}
  }
  var d = b || goog.array.defaultCompare;
  goog.array.sort(a, function(e, f) {
    return d(e.value, f.value) || e.index - f.index
  });
  for(c = 0;c < a.length;c++) {
    a[c] = a[c].value
  }
};
goog.array.sortObjectsByKey = function(a, b, c) {
  var d = c || goog.array.defaultCompare;
  goog.array.sort(a, function(e, f) {
    return d(e[b], f[b])
  })
};
goog.array.isSorted = function(a, b, c) {
  b = b || goog.array.defaultCompare;
  for(var d = 1;d < a.length;d++) {
    var e = b(a[d - 1], a[d]);
    if(e > 0 || e == 0 && c) {
      return false
    }
  }
  return true
};
goog.array.equals = function(a, b, c) {
  if(!goog.isArrayLike(a) || !goog.isArrayLike(b) || a.length != b.length) {
    return false
  }
  var d = a.length;
  c = c || goog.array.defaultCompareEquality;
  for(var e = 0;e < d;e++) {
    if(!c(a[e], b[e])) {
      return false
    }
  }
  return true
};
goog.array.compare = function(a, b, c) {
  return goog.array.equals(a, b, c)
};
goog.array.defaultCompare = function(a, b) {
  return a > b ? 1 : a < b ? -1 : 0
};
goog.array.defaultCompareEquality = function(a, b) {
  return a === b
};
goog.array.binaryInsert = function(a, b, c) {
  c = goog.array.binarySearch(a, b, c);
  if(c < 0) {
    goog.array.insertAt(a, b, -(c + 1));
    return true
  }
  return false
};
goog.array.binaryRemove = function(a, b, c) {
  b = goog.array.binarySearch(a, b, c);
  return b >= 0 ? goog.array.removeAt(a, b) : false
};
goog.array.bucket = function(a, b) {
  var c = {};
  for(var d = 0;d < a.length;d++) {
    var e = a[d], f = b(e, d, a);
    if(goog.isDef(f)) {
      (c[f] || (c[f] = [])).push(e)
    }
  }
  return c
};
goog.array.repeat = function(a, b) {
  var c = [];
  for(var d = 0;d < b;d++) {
    c[d] = a
  }
  return c
};
goog.array.flatten = function() {
  var a = [];
  for(var b = 0;b < arguments.length;b++) {
    var c = arguments[b];
    goog.isArray(c) ? a.push.apply(a, goog.array.flatten.apply(null, c)) : a.push(c)
  }
  return a
};
goog.array.rotate = function(a, b) {
  goog.asserts.assert(a.length != null);
  if(a.length) {
    b %= a.length;
    if(b > 0) {
      goog.array.ARRAY_PROTOTYPE_.unshift.apply(a, a.splice(-b, b))
    }else {
      b < 0 && goog.array.ARRAY_PROTOTYPE_.push.apply(a, a.splice(0, -b))
    }
  }
  return a
};
goog.array.zip = function() {
  if(!arguments.length) {
    return[]
  }
  var a = [];
  for(var b = 0;;b++) {
    var c = [];
    for(var d = 0;d < arguments.length;d++) {
      var e = arguments[d];
      if(b >= e.length) {
        return a
      }
      c.push(e[b])
    }
    a.push(c)
  }
};
goog.array.shuffle = function(a, b) {
  var c = b || Math.random;
  for(var d = a.length - 1;d > 0;d--) {
    var e = Math.floor(c() * (d + 1)), f = a[d];
    a[d] = a[e];
    a[e] = f
  }
};goog.debug.entryPointRegistry = {};
goog.debug.EntryPointMonitor = function() {
};
goog.debug.entryPointRegistry.refList_ = [];
goog.debug.entryPointRegistry.register = function(a) {
  goog.debug.entryPointRegistry.refList_[goog.debug.entryPointRegistry.refList_.length] = a
};
goog.debug.entryPointRegistry.monitorAll = function(a) {
  a = goog.bind(a.wrap, a);
  for(var b = 0;b < goog.debug.entryPointRegistry.refList_.length;b++) {
    goog.debug.entryPointRegistry.refList_[b](a)
  }
};
goog.debug.entryPointRegistry.unmonitorAllIfPossible = function(a) {
  a = goog.bind(a.unwrap, a);
  for(var b = 0;b < goog.debug.entryPointRegistry.refList_.length;b++) {
    goog.debug.entryPointRegistry.refList_[b](a)
  }
};goog.debug.errorHandlerWeakDep = {protectEntryPoint:function(a) {
  return a
}};goog.userAgent = {};
goog.userAgent.ASSUME_IE = false;
goog.userAgent.ASSUME_GECKO = false;
goog.userAgent.ASSUME_WEBKIT = false;
goog.userAgent.ASSUME_MOBILE_WEBKIT = false;
goog.userAgent.ASSUME_OPERA = false;
goog.userAgent.BROWSER_KNOWN_ = goog.userAgent.ASSUME_IE || goog.userAgent.ASSUME_GECKO || goog.userAgent.ASSUME_MOBILE_WEBKIT || goog.userAgent.ASSUME_WEBKIT || goog.userAgent.ASSUME_OPERA;
goog.userAgent.getUserAgentString = function() {
  return goog.global.navigator ? goog.global.navigator.userAgent : null
};
goog.userAgent.getNavigator = function() {
  return goog.global.navigator
};
goog.userAgent.init_ = function() {
  goog.userAgent.detectedOpera_ = false;
  goog.userAgent.detectedIe_ = false;
  goog.userAgent.detectedWebkit_ = false;
  goog.userAgent.detectedMobile_ = false;
  goog.userAgent.detectedGecko_ = false;
  var a;
  if(!goog.userAgent.BROWSER_KNOWN_ && (a = goog.userAgent.getUserAgentString())) {
    var b = goog.userAgent.getNavigator();
    goog.userAgent.detectedOpera_ = a.indexOf("Opera") == 0;
    goog.userAgent.detectedIe_ = !goog.userAgent.detectedOpera_ && a.indexOf("MSIE") != -1;
    goog.userAgent.detectedWebkit_ = !goog.userAgent.detectedOpera_ && a.indexOf("WebKit") != -1;
    goog.userAgent.detectedMobile_ = goog.userAgent.detectedWebkit_ && a.indexOf("Mobile") != -1;
    goog.userAgent.detectedGecko_ = !goog.userAgent.detectedOpera_ && !goog.userAgent.detectedWebkit_ && b.product == "Gecko"
  }
};
goog.userAgent.BROWSER_KNOWN_ || goog.userAgent.init_();
goog.userAgent.OPERA = goog.userAgent.BROWSER_KNOWN_ ? goog.userAgent.ASSUME_OPERA : goog.userAgent.detectedOpera_;
goog.userAgent.IE = goog.userAgent.BROWSER_KNOWN_ ? goog.userAgent.ASSUME_IE : goog.userAgent.detectedIe_;
goog.userAgent.GECKO = goog.userAgent.BROWSER_KNOWN_ ? goog.userAgent.ASSUME_GECKO : goog.userAgent.detectedGecko_;
goog.userAgent.WEBKIT = goog.userAgent.BROWSER_KNOWN_ ? goog.userAgent.ASSUME_WEBKIT || goog.userAgent.ASSUME_MOBILE_WEBKIT : goog.userAgent.detectedWebkit_;
goog.userAgent.MOBILE = goog.userAgent.ASSUME_MOBILE_WEBKIT || goog.userAgent.detectedMobile_;
goog.userAgent.SAFARI = goog.userAgent.WEBKIT;
goog.userAgent.determinePlatform_ = function() {
  var a = goog.userAgent.getNavigator();
  return a && a.platform || ""
};
goog.userAgent.PLATFORM = goog.userAgent.determinePlatform_();
goog.userAgent.ASSUME_MAC = false;
goog.userAgent.ASSUME_WINDOWS = false;
goog.userAgent.ASSUME_LINUX = false;
goog.userAgent.ASSUME_X11 = false;
goog.userAgent.PLATFORM_KNOWN_ = goog.userAgent.ASSUME_MAC || goog.userAgent.ASSUME_WINDOWS || goog.userAgent.ASSUME_LINUX || goog.userAgent.ASSUME_X11;
goog.userAgent.initPlatform_ = function() {
  goog.userAgent.detectedMac_ = goog.string.contains(goog.userAgent.PLATFORM, "Mac");
  goog.userAgent.detectedWindows_ = goog.string.contains(goog.userAgent.PLATFORM, "Win");
  goog.userAgent.detectedLinux_ = goog.string.contains(goog.userAgent.PLATFORM, "Linux");
  goog.userAgent.detectedX11_ = !!goog.userAgent.getNavigator() && goog.string.contains(goog.userAgent.getNavigator().appVersion || "", "X11")
};
goog.userAgent.PLATFORM_KNOWN_ || goog.userAgent.initPlatform_();
goog.userAgent.MAC = goog.userAgent.PLATFORM_KNOWN_ ? goog.userAgent.ASSUME_MAC : goog.userAgent.detectedMac_;
goog.userAgent.WINDOWS = goog.userAgent.PLATFORM_KNOWN_ ? goog.userAgent.ASSUME_WINDOWS : goog.userAgent.detectedWindows_;
goog.userAgent.LINUX = goog.userAgent.PLATFORM_KNOWN_ ? goog.userAgent.ASSUME_LINUX : goog.userAgent.detectedLinux_;
goog.userAgent.X11 = goog.userAgent.PLATFORM_KNOWN_ ? goog.userAgent.ASSUME_X11 : goog.userAgent.detectedX11_;
goog.userAgent.determineVersion_ = function() {
  var a = "", b;
  if(goog.userAgent.OPERA && goog.global.opera) {
    a = goog.global.opera.version;
    a = typeof a == "function" ? a() : a
  }else {
    if(goog.userAgent.GECKO) {
      b = /rv\:([^\);]+)(\)|;)/
    }else {
      if(goog.userAgent.IE) {
        b = /MSIE\s+([^\);]+)(\)|;)/
      }else {
        if(goog.userAgent.WEBKIT) {
          b = /WebKit\/(\S+)/
        }
      }
    }
    if(b) {
      a = (a = b.exec(goog.userAgent.getUserAgentString())) ? a[1] : ""
    }
  }
  if(goog.userAgent.IE) {
    b = goog.userAgent.getDocumentMode_();
    if(b > parseFloat(a)) {
      return String(b)
    }
  }
  return a
};
goog.userAgent.getDocumentMode_ = function() {
  var a = goog.global.document;
  return a ? a.documentMode : undefined
};
goog.userAgent.VERSION = goog.userAgent.determineVersion_();
goog.userAgent.compare = function(a, b) {
  return goog.string.compareVersions(a, b)
};
goog.userAgent.isVersionCache_ = {};
goog.userAgent.isVersion = function(a) {
  return goog.userAgent.isVersionCache_[a] || (goog.userAgent.isVersionCache_[a] = goog.string.compareVersions(goog.userAgent.VERSION, a) >= 0)
};goog.events = {};
goog.events.BrowserFeature = {HAS_W3C_BUTTON:!goog.userAgent.IE || goog.userAgent.isVersion("9"), SET_KEY_CODE_TO_PREVENT_DEFAULT:goog.userAgent.IE && !goog.userAgent.isVersion("8")};goog.Disposable = function() {
  if(goog.Disposable.ENABLE_MONITORING) {
    goog.Disposable.instances_[goog.getUid(this)] = this
  }
};
goog.Disposable.ENABLE_MONITORING = false;
goog.Disposable.instances_ = {};
goog.Disposable.getUndisposedObjects = function() {
  var a = [];
  for(var b in goog.Disposable.instances_) {
    goog.Disposable.instances_.hasOwnProperty(b) && a.push(goog.Disposable.instances_[Number(b)])
  }
  return a
};
goog.Disposable.clearUndisposedObjects = function() {
  goog.Disposable.instances_ = {}
};
goog.Disposable.prototype.disposed_ = false;
goog.Disposable.prototype.isDisposed = function() {
  return this.disposed_
};
goog.Disposable.prototype.getDisposed = goog.Disposable.prototype.isDisposed;
goog.Disposable.prototype.dispose = function() {
  if(!this.disposed_) {
    this.disposed_ = true;
    this.disposeInternal();
    if(goog.Disposable.ENABLE_MONITORING) {
      var a = goog.getUid(this);
      if(!goog.Disposable.instances_.hasOwnProperty(a)) {
        throw Error(this + " did not call the goog.Disposable base constructor or was disposed of after a clearUndisposedObjects call");
      }
      delete goog.Disposable.instances_[a]
    }
  }
};
goog.Disposable.prototype.disposeInternal = function() {
};
goog.dispose = function(a) {
  a && typeof a.dispose == "function" && a.dispose()
};goog.events.Event = function(a, b) {
  goog.Disposable.call(this);
  this.type = a;
  this.currentTarget = this.target = b
};
goog.inherits(goog.events.Event, goog.Disposable);
goog.events.Event.prototype.disposeInternal = function() {
  delete this.type;
  delete this.target;
  delete this.currentTarget
};
goog.events.Event.prototype.propagationStopped_ = false;
goog.events.Event.prototype.returnValue_ = true;
goog.events.Event.prototype.stopPropagation = function() {
  this.propagationStopped_ = true
};
goog.events.Event.prototype.preventDefault = function() {
  this.returnValue_ = false
};
goog.events.Event.stopPropagation = function(a) {
  a.stopPropagation()
};
goog.events.Event.preventDefault = function(a) {
  a.preventDefault()
};goog.events.EventType = {CLICK:"click", DBLCLICK:"dblclick", MOUSEDOWN:"mousedown", MOUSEUP:"mouseup", MOUSEOVER:"mouseover", MOUSEOUT:"mouseout", MOUSEMOVE:"mousemove", SELECTSTART:"selectstart", KEYPRESS:"keypress", KEYDOWN:"keydown", KEYUP:"keyup", BLUR:"blur", FOCUS:"focus", DEACTIVATE:"deactivate", FOCUSIN:goog.userAgent.IE ? "focusin" : "DOMFocusIn", FOCUSOUT:goog.userAgent.IE ? "focusout" : "DOMFocusOut", CHANGE:"change", SELECT:"select", SUBMIT:"submit", INPUT:"input", PROPERTYCHANGE:"propertychange", 
DRAGSTART:"dragstart", DRAGENTER:"dragenter", DRAGOVER:"dragover", DRAGLEAVE:"dragleave", DROP:"drop", TOUCHSTART:"touchstart", TOUCHMOVE:"touchmove", TOUCHEND:"touchend", TOUCHCANCEL:"touchcancel", CONTEXTMENU:"contextmenu", ERROR:"error", HELP:"help", LOAD:"load", LOSECAPTURE:"losecapture", READYSTATECHANGE:"readystatechange", RESIZE:"resize", SCROLL:"scroll", UNLOAD:"unload", HASHCHANGE:"hashchange", PAGEHIDE:"pagehide", PAGESHOW:"pageshow", POPSTATE:"popstate", COPY:"copy", PASTE:"paste", CUT:"cut", 
MESSAGE:"message", CONNECT:"connect"};goog.reflect = {};
goog.reflect.object = function(a, b) {
  return b
};
goog.reflect.sinkValue = new Function("a", "return a");goog.events.BrowserEvent = function(a, b) {
  a && this.init(a, b)
};
goog.inherits(goog.events.BrowserEvent, goog.events.Event);
goog.events.BrowserEvent.MouseButton = {LEFT:0, MIDDLE:1, RIGHT:2};
goog.events.BrowserEvent.IEButtonMap = [1, 4, 2];
goog.events.BrowserEvent.prototype.target = null;
goog.events.BrowserEvent.prototype.relatedTarget = null;
goog.events.BrowserEvent.prototype.offsetX = 0;
goog.events.BrowserEvent.prototype.offsetY = 0;
goog.events.BrowserEvent.prototype.clientX = 0;
goog.events.BrowserEvent.prototype.clientY = 0;
goog.events.BrowserEvent.prototype.screenX = 0;
goog.events.BrowserEvent.prototype.screenY = 0;
goog.events.BrowserEvent.prototype.button = 0;
goog.events.BrowserEvent.prototype.keyCode = 0;
goog.events.BrowserEvent.prototype.charCode = 0;
goog.events.BrowserEvent.prototype.ctrlKey = false;
goog.events.BrowserEvent.prototype.altKey = false;
goog.events.BrowserEvent.prototype.shiftKey = false;
goog.events.BrowserEvent.prototype.metaKey = false;
goog.events.BrowserEvent.prototype.platformModifierKey = false;
goog.events.BrowserEvent.prototype.event_ = null;
goog.events.BrowserEvent.prototype.init = function(a, b) {
  var c = this.type = a.type;
  goog.events.Event.call(this, c);
  this.target = a.target || a.srcElement;
  this.currentTarget = b;
  var d = a.relatedTarget;
  if(d) {
    if(goog.userAgent.GECKO) {
      try {
        goog.reflect.sinkValue(d.nodeName)
      }catch(e) {
        d = null
      }
    }
  }else {
    if(c == goog.events.EventType.MOUSEOVER) {
      d = a.fromElement
    }else {
      if(c == goog.events.EventType.MOUSEOUT) {
        d = a.toElement
      }
    }
  }
  this.relatedTarget = d;
  this.offsetX = a.offsetX !== undefined ? a.offsetX : a.layerX;
  this.offsetY = a.offsetY !== undefined ? a.offsetY : a.layerY;
  this.clientX = a.clientX !== undefined ? a.clientX : a.pageX;
  this.clientY = a.clientY !== undefined ? a.clientY : a.pageY;
  this.screenX = a.screenX || 0;
  this.screenY = a.screenY || 0;
  this.button = a.button;
  this.keyCode = a.keyCode || 0;
  this.charCode = a.charCode || (c == "keypress" ? a.keyCode : 0);
  this.ctrlKey = a.ctrlKey;
  this.altKey = a.altKey;
  this.shiftKey = a.shiftKey;
  this.metaKey = a.metaKey;
  this.platformModifierKey = goog.userAgent.MAC ? a.metaKey : a.ctrlKey;
  this.state = a.state;
  this.event_ = a;
  delete this.returnValue_;
  delete this.propagationStopped_
};
goog.events.BrowserEvent.prototype.isButton = function(a) {
  return goog.events.BrowserFeature.HAS_W3C_BUTTON ? this.event_.button == a : this.type == "click" ? a == goog.events.BrowserEvent.MouseButton.LEFT : !!(this.event_.button & goog.events.BrowserEvent.IEButtonMap[a])
};
goog.events.BrowserEvent.prototype.isMouseActionButton = function() {
  return this.isButton(goog.events.BrowserEvent.MouseButton.LEFT) && !(goog.userAgent.WEBKIT && goog.userAgent.MAC && this.ctrlKey)
};
goog.events.BrowserEvent.prototype.stopPropagation = function() {
  goog.events.BrowserEvent.superClass_.stopPropagation.call(this);
  if(this.event_.stopPropagation) {
    this.event_.stopPropagation()
  }else {
    this.event_.cancelBubble = true
  }
};
goog.events.BrowserEvent.prototype.preventDefault = function() {
  goog.events.BrowserEvent.superClass_.preventDefault.call(this);
  var a = this.event_;
  if(a.preventDefault) {
    a.preventDefault()
  }else {
    a.returnValue = false;
    if(goog.events.BrowserFeature.SET_KEY_CODE_TO_PREVENT_DEFAULT) {
      try {
        if(a.ctrlKey || a.keyCode >= 112 && a.keyCode <= 123) {
          a.keyCode = -1
        }
      }catch(b) {
      }
    }
  }
};
goog.events.BrowserEvent.prototype.getBrowserEvent = function() {
  return this.event_
};
goog.events.BrowserEvent.prototype.disposeInternal = function() {
  goog.events.BrowserEvent.superClass_.disposeInternal.call(this);
  this.relatedTarget = this.currentTarget = this.target = this.event_ = null
};goog.events.EventWrapper = function() {
};
goog.events.EventWrapper.prototype.listen = function() {
};
goog.events.EventWrapper.prototype.unlisten = function() {
};goog.events.Listener = function() {
};
goog.events.Listener.counter_ = 0;
goog.events.Listener.prototype.key = 0;
goog.events.Listener.prototype.removed = false;
goog.events.Listener.prototype.callOnce = false;
goog.events.Listener.prototype.init = function(a, b, c, d, e, f) {
  if(goog.isFunction(a)) {
    this.isFunctionListener_ = true
  }else {
    if(a && a.handleEvent && goog.isFunction(a.handleEvent)) {
      this.isFunctionListener_ = false
    }else {
      throw Error("Invalid listener argument");
    }
  }
  this.listener = a;
  this.proxy = b;
  this.src = c;
  this.type = d;
  this.capture = !!e;
  this.handler = f;
  this.callOnce = false;
  this.key = ++goog.events.Listener.counter_;
  this.removed = false
};
goog.events.Listener.prototype.handleEvent = function(a) {
  if(this.isFunctionListener_) {
    return this.listener.call(this.handler || this.src, a)
  }
  return this.listener.handleEvent.call(this.listener, a)
};goog.structs = {};
goog.structs.SimplePool = function(a, b) {
  goog.Disposable.call(this);
  this.maxCount_ = b;
  this.freeQueue_ = [];
  this.createInitial_(a)
};
goog.inherits(goog.structs.SimplePool, goog.Disposable);
goog.structs.SimplePool.prototype.createObjectFn_ = null;
goog.structs.SimplePool.prototype.disposeObjectFn_ = null;
goog.structs.SimplePool.prototype.setCreateObjectFn = function(a) {
  this.createObjectFn_ = a
};
goog.structs.SimplePool.prototype.setDisposeObjectFn = function(a) {
  this.disposeObjectFn_ = a
};
goog.structs.SimplePool.prototype.getObject = function() {
  if(this.freeQueue_.length) {
    return this.freeQueue_.pop()
  }
  return this.createObject()
};
goog.structs.SimplePool.prototype.releaseObject = function(a) {
  this.freeQueue_.length < this.maxCount_ ? this.freeQueue_.push(a) : this.disposeObject(a)
};
goog.structs.SimplePool.prototype.createInitial_ = function(a) {
  if(a > this.maxCount_) {
    throw Error("[goog.structs.SimplePool] Initial cannot be greater than max");
  }
  for(var b = 0;b < a;b++) {
    this.freeQueue_.push(this.createObject())
  }
};
goog.structs.SimplePool.prototype.createObject = function() {
  return this.createObjectFn_ ? this.createObjectFn_() : {}
};
goog.structs.SimplePool.prototype.disposeObject = function(a) {
  if(this.disposeObjectFn_) {
    this.disposeObjectFn_(a)
  }else {
    if(goog.isObject(a)) {
      if(goog.isFunction(a.dispose)) {
        a.dispose()
      }else {
        for(var b in a) {
          delete a[b]
        }
      }
    }
  }
};
goog.structs.SimplePool.prototype.disposeInternal = function() {
  goog.structs.SimplePool.superClass_.disposeInternal.call(this);
  for(var a = this.freeQueue_;a.length;) {
    this.disposeObject(a.pop())
  }
  delete this.freeQueue_
};goog.userAgent.jscript = {};
goog.userAgent.jscript.ASSUME_NO_JSCRIPT = false;
goog.userAgent.jscript.init_ = function() {
  goog.userAgent.jscript.DETECTED_HAS_JSCRIPT_ = "ScriptEngine" in goog.global && goog.global.ScriptEngine() == "JScript";
  goog.userAgent.jscript.DETECTED_VERSION_ = goog.userAgent.jscript.DETECTED_HAS_JSCRIPT_ ? goog.global.ScriptEngineMajorVersion() + "." + goog.global.ScriptEngineMinorVersion() + "." + goog.global.ScriptEngineBuildVersion() : "0"
};
goog.userAgent.jscript.ASSUME_NO_JSCRIPT || goog.userAgent.jscript.init_();
goog.userAgent.jscript.HAS_JSCRIPT = goog.userAgent.jscript.ASSUME_NO_JSCRIPT ? false : goog.userAgent.jscript.DETECTED_HAS_JSCRIPT_;
goog.userAgent.jscript.VERSION = goog.userAgent.jscript.ASSUME_NO_JSCRIPT ? "0" : goog.userAgent.jscript.DETECTED_VERSION_;
goog.userAgent.jscript.isVersion = function(a) {
  return goog.string.compareVersions(goog.userAgent.jscript.VERSION, a) >= 0
};goog.events.pools = {};
(function() {
  function a() {
    return{count_:0, remaining_:0}
  }
  function b() {
    return[]
  }
  function c() {
    var k = function(o) {
      return g.call(k.src, k.key, o)
    };
    return k
  }
  function d() {
    return new goog.events.Listener
  }
  function e() {
    return new goog.events.BrowserEvent
  }
  var f = goog.userAgent.jscript.HAS_JSCRIPT && !goog.userAgent.jscript.isVersion("5.7"), g;
  goog.events.pools.setProxyCallbackFunction = function(k) {
    g = k
  };
  if(f) {
    goog.events.pools.getObject = function() {
      return h.getObject()
    };
    goog.events.pools.releaseObject = function(k) {
      h.releaseObject(k)
    };
    goog.events.pools.getArray = function() {
      return i.getObject()
    };
    goog.events.pools.releaseArray = function(k) {
      i.releaseObject(k)
    };
    goog.events.pools.getProxy = function() {
      return j.getObject()
    };
    goog.events.pools.releaseProxy = function() {
      j.releaseObject(c())
    };
    goog.events.pools.getListener = function() {
      return l.getObject()
    };
    goog.events.pools.releaseListener = function(k) {
      l.releaseObject(k)
    };
    goog.events.pools.getEvent = function() {
      return m.getObject()
    };
    goog.events.pools.releaseEvent = function(k) {
      m.releaseObject(k)
    };
    var h = new goog.structs.SimplePool(0, 600);
    h.setCreateObjectFn(a);
    var i = new goog.structs.SimplePool(0, 600);
    i.setCreateObjectFn(b);
    var j = new goog.structs.SimplePool(0, 600);
    j.setCreateObjectFn(c);
    var l = new goog.structs.SimplePool(0, 600);
    l.setCreateObjectFn(d);
    var m = new goog.structs.SimplePool(0, 600);
    m.setCreateObjectFn(e)
  }else {
    goog.events.pools.getObject = a;
    goog.events.pools.releaseObject = goog.nullFunction;
    goog.events.pools.getArray = b;
    goog.events.pools.releaseArray = goog.nullFunction;
    goog.events.pools.getProxy = c;
    goog.events.pools.releaseProxy = goog.nullFunction;
    goog.events.pools.getListener = d;
    goog.events.pools.releaseListener = goog.nullFunction;
    goog.events.pools.getEvent = e;
    goog.events.pools.releaseEvent = goog.nullFunction
  }
})();goog.events.listeners_ = {};
goog.events.listenerTree_ = {};
goog.events.sources_ = {};
goog.events.onString_ = "on";
goog.events.onStringMap_ = {};
goog.events.keySeparator_ = "_";
goog.events.listen = function(a, b, c, d, e) {
  if(b) {
    if(goog.isArray(b)) {
      for(var f = 0;f < b.length;f++) {
        goog.events.listen(a, b[f], c, d, e)
      }
      return null
    }else {
      d = !!d;
      var g = goog.events.listenerTree_;
      b in g || (g[b] = goog.events.pools.getObject());
      g = g[b];
      if(!(d in g)) {
        g[d] = goog.events.pools.getObject();
        g.count_++
      }
      g = g[d];
      var h = goog.getUid(a), i;
      g.remaining_++;
      if(g[h]) {
        i = g[h];
        for(f = 0;f < i.length;f++) {
          g = i[f];
          if(g.listener == c && g.handler == e) {
            if(g.removed) {
              break
            }
            return i[f].key
          }
        }
      }else {
        i = g[h] = goog.events.pools.getArray();
        g.count_++
      }
      f = goog.events.pools.getProxy();
      f.src = a;
      g = goog.events.pools.getListener();
      g.init(c, f, a, b, d, e);
      c = g.key;
      f.key = c;
      i.push(g);
      goog.events.listeners_[c] = g;
      goog.events.sources_[h] || (goog.events.sources_[h] = goog.events.pools.getArray());
      goog.events.sources_[h].push(g);
      if(a.addEventListener) {
        if(a == goog.global || !a.customEvent_) {
          a.addEventListener(b, f, d)
        }
      }else {
        a.attachEvent(goog.events.getOnString_(b), f)
      }
      return c
    }
  }else {
    throw Error("Invalid event type");
  }
};
goog.events.listenOnce = function(a, b, c, d, e) {
  if(goog.isArray(b)) {
    for(var f = 0;f < b.length;f++) {
      goog.events.listenOnce(a, b[f], c, d, e)
    }
    return null
  }
  a = goog.events.listen(a, b, c, d, e);
  goog.events.listeners_[a].callOnce = true;
  return a
};
goog.events.listenWithWrapper = function(a, b, c, d, e) {
  b.listen(a, c, d, e)
};
goog.events.unlisten = function(a, b, c, d, e) {
  if(goog.isArray(b)) {
    for(var f = 0;f < b.length;f++) {
      goog.events.unlisten(a, b[f], c, d, e)
    }
    return null
  }
  d = !!d;
  a = goog.events.getListeners_(a, b, d);
  if(!a) {
    return false
  }
  for(f = 0;f < a.length;f++) {
    if(a[f].listener == c && a[f].capture == d && a[f].handler == e) {
      return goog.events.unlistenByKey(a[f].key)
    }
  }
  return false
};
goog.events.unlistenByKey = function(a) {
  if(!goog.events.listeners_[a]) {
    return false
  }
  var b = goog.events.listeners_[a];
  if(b.removed) {
    return false
  }
  var c = b.src, d = b.type, e = b.proxy, f = b.capture;
  if(c.removeEventListener) {
    if(c == goog.global || !c.customEvent_) {
      c.removeEventListener(d, e, f)
    }
  }else {
    c.detachEvent && c.detachEvent(goog.events.getOnString_(d), e)
  }
  c = goog.getUid(c);
  e = goog.events.listenerTree_[d][f][c];
  if(goog.events.sources_[c]) {
    var g = goog.events.sources_[c];
    goog.array.remove(g, b);
    g.length == 0 && delete goog.events.sources_[c]
  }
  b.removed = true;
  e.needsCleanup_ = true;
  goog.events.cleanUp_(d, f, c, e);
  delete goog.events.listeners_[a];
  return true
};
goog.events.unlistenWithWrapper = function(a, b, c, d, e) {
  b.unlisten(a, c, d, e)
};
goog.events.cleanUp_ = function(a, b, c, d) {
  if(!d.locked_) {
    if(d.needsCleanup_) {
      var e = 0;
      for(var f = 0;e < d.length;e++) {
        if(d[e].removed) {
          var g = d[e].proxy;
          g.src = null;
          goog.events.pools.releaseProxy(g);
          goog.events.pools.releaseListener(d[e])
        }else {
          if(e != f) {
            d[f] = d[e]
          }
          f++
        }
      }
      d.length = f;
      d.needsCleanup_ = false;
      if(f == 0) {
        goog.events.pools.releaseArray(d);
        delete goog.events.listenerTree_[a][b][c];
        goog.events.listenerTree_[a][b].count_--;
        if(goog.events.listenerTree_[a][b].count_ == 0) {
          goog.events.pools.releaseObject(goog.events.listenerTree_[a][b]);
          delete goog.events.listenerTree_[a][b];
          goog.events.listenerTree_[a].count_--
        }
        if(goog.events.listenerTree_[a].count_ == 0) {
          goog.events.pools.releaseObject(goog.events.listenerTree_[a]);
          delete goog.events.listenerTree_[a]
        }
      }
    }
  }
};
goog.events.removeAll = function(a, b, c) {
  var d = 0, e = a == null, f = b == null, g = c == null;
  c = !!c;
  if(e) {
    goog.object.forEach(goog.events.sources_, function(i) {
      for(var j = i.length - 1;j >= 0;j--) {
        var l = i[j];
        if((f || b == l.type) && (g || c == l.capture)) {
          goog.events.unlistenByKey(l.key);
          d++
        }
      }
    })
  }else {
    a = goog.getUid(a);
    if(goog.events.sources_[a]) {
      a = goog.events.sources_[a];
      for(e = a.length - 1;e >= 0;e--) {
        var h = a[e];
        if((f || b == h.type) && (g || c == h.capture)) {
          goog.events.unlistenByKey(h.key);
          d++
        }
      }
    }
  }
  return d
};
goog.events.getListeners = function(a, b, c) {
  return goog.events.getListeners_(a, b, c) || []
};
goog.events.getListeners_ = function(a, b, c) {
  var d = goog.events.listenerTree_;
  if(b in d) {
    d = d[b];
    if(c in d) {
      d = d[c];
      a = goog.getUid(a);
      if(d[a]) {
        return d[a]
      }
    }
  }
  return null
};
goog.events.getListener = function(a, b, c, d, e) {
  d = !!d;
  if(a = goog.events.getListeners_(a, b, d)) {
    for(b = 0;b < a.length;b++) {
      if(a[b].listener == c && a[b].capture == d && a[b].handler == e) {
        return a[b]
      }
    }
  }
  return null
};
goog.events.hasListener = function(a, b, c) {
  a = goog.getUid(a);
  var d = goog.events.sources_[a];
  if(d) {
    var e = goog.isDef(b), f = goog.isDef(c);
    if(e && f) {
      d = goog.events.listenerTree_[b];
      return!!d && !!d[c] && a in d[c]
    }else {
      return e || f ? goog.array.some(d, function(g) {
        return e && g.type == b || f && g.capture == c
      }) : true
    }
  }
  return false
};
goog.events.expose = function(a) {
  var b = [];
  for(var c in a) {
    a[c] && a[c].id ? b.push(c + " = " + a[c] + " (" + a[c].id + ")") : b.push(c + " = " + a[c])
  }
  return b.join("\n")
};
goog.events.getOnString_ = function(a) {
  if(a in goog.events.onStringMap_) {
    return goog.events.onStringMap_[a]
  }
  return goog.events.onStringMap_[a] = goog.events.onString_ + a
};
goog.events.fireListeners = function(a, b, c, d) {
  var e = goog.events.listenerTree_;
  if(b in e) {
    e = e[b];
    if(c in e) {
      return goog.events.fireListeners_(e[c], a, b, c, d)
    }
  }
  return true
};
goog.events.fireListeners_ = function(a, b, c, d, e) {
  var f = 1;
  b = goog.getUid(b);
  if(a[b]) {
    a.remaining_--;
    a = a[b];
    if(a.locked_) {
      a.locked_++
    }else {
      a.locked_ = 1
    }
    try {
      var g = a.length;
      for(var h = 0;h < g;h++) {
        var i = a[h];
        if(i && !i.removed) {
          f &= goog.events.fireListener(i, e) !== false
        }
      }
    }finally {
      a.locked_--;
      goog.events.cleanUp_(c, d, b, a)
    }
  }
  return Boolean(f)
};
goog.events.fireListener = function(a, b) {
  var c = a.handleEvent(b);
  a.callOnce && goog.events.unlistenByKey(a.key);
  return c
};
goog.events.getTotalListenerCount = function() {
  return goog.object.getCount(goog.events.listeners_)
};
goog.events.dispatchEvent = function(a, b) {
  var c = b.type || b, d = goog.events.listenerTree_;
  if(!(c in d)) {
    return true
  }
  if(goog.isString(b)) {
    b = new goog.events.Event(b, a)
  }else {
    if(b instanceof goog.events.Event) {
      b.target = b.target || a
    }else {
      var e = b;
      b = new goog.events.Event(c, a);
      goog.object.extend(b, e)
    }
  }
  e = 1;
  var f;
  d = d[c];
  c = true in d;
  var g;
  if(c) {
    f = [];
    for(g = a;g;g = g.getParentEventTarget()) {
      f.push(g)
    }
    g = d[true];
    g.remaining_ = g.count_;
    for(var h = f.length - 1;!b.propagationStopped_ && h >= 0 && g.remaining_;h--) {
      b.currentTarget = f[h];
      e &= goog.events.fireListeners_(g, f[h], b.type, true, b) && b.returnValue_ != false
    }
  }
  if(false in d) {
    g = d[false];
    g.remaining_ = g.count_;
    if(c) {
      for(h = 0;!b.propagationStopped_ && h < f.length && g.remaining_;h++) {
        b.currentTarget = f[h];
        e &= goog.events.fireListeners_(g, f[h], b.type, false, b) && b.returnValue_ != false
      }
    }else {
      for(d = a;!b.propagationStopped_ && d && g.remaining_;d = d.getParentEventTarget()) {
        b.currentTarget = d;
        e &= goog.events.fireListeners_(g, d, b.type, false, b) && b.returnValue_ != false
      }
    }
  }
  return Boolean(e)
};
goog.events.protectBrowserEventEntryPoint = function(a) {
  goog.events.handleBrowserEvent_ = a.protectEntryPoint(goog.events.handleBrowserEvent_);
  goog.events.pools.setProxyCallbackFunction(goog.events.handleBrowserEvent_)
};
goog.events.handleBrowserEvent_ = function(a, b) {
  if(!goog.events.listeners_[a]) {
    return true
  }
  var c = goog.events.listeners_[a], d = c.type, e = goog.events.listenerTree_;
  if(!(d in e)) {
    return true
  }
  e = e[d];
  var f, g;
  if(goog.events.synthesizeEventPropagation_()) {
    f = b || goog.getObjectByName("window.event");
    var h = true in e, i = false in e;
    if(h) {
      if(goog.events.isMarkedIeEvent_(f)) {
        return true
      }
      goog.events.markIeEvent_(f)
    }
    var j = goog.events.pools.getEvent();
    j.init(f, this);
    f = true;
    try {
      if(h) {
        var l = goog.events.pools.getArray();
        for(var m = j.currentTarget;m;m = m.parentNode) {
          l.push(m)
        }
        g = e[true];
        g.remaining_ = g.count_;
        for(var k = l.length - 1;!j.propagationStopped_ && k >= 0 && g.remaining_;k--) {
          j.currentTarget = l[k];
          f &= goog.events.fireListeners_(g, l[k], d, true, j)
        }
        if(i) {
          g = e[false];
          g.remaining_ = g.count_;
          for(k = 0;!j.propagationStopped_ && k < l.length && g.remaining_;k++) {
            j.currentTarget = l[k];
            f &= goog.events.fireListeners_(g, l[k], d, false, j)
          }
        }
      }else {
        f = goog.events.fireListener(c, j)
      }
    }finally {
      if(l) {
        l.length = 0;
        goog.events.pools.releaseArray(l)
      }
      j.dispose();
      goog.events.pools.releaseEvent(j)
    }
    return f
  }
  d = new goog.events.BrowserEvent(b, this);
  try {
    f = goog.events.fireListener(c, d)
  }finally {
    d.dispose()
  }
  return f
};
goog.events.pools.setProxyCallbackFunction(goog.events.handleBrowserEvent_);
goog.events.markIeEvent_ = function(a) {
  var b = false;
  if(a.keyCode == 0) {
    try {
      a.keyCode = -1;
      return
    }catch(c) {
      b = true
    }
  }
  if(b || a.returnValue == undefined) {
    a.returnValue = true
  }
};
goog.events.isMarkedIeEvent_ = function(a) {
  return a.keyCode < 0 || a.returnValue != undefined
};
goog.events.uniqueIdCounter_ = 0;
goog.events.getUniqueId = function(a) {
  return a + "_" + goog.events.uniqueIdCounter_++
};
goog.events.synthesizeEventPropagation_ = function() {
  if(goog.events.requiresSyntheticEventPropagation_ === undefined) {
    goog.events.requiresSyntheticEventPropagation_ = goog.userAgent.IE && !goog.global.addEventListener
  }
  return goog.events.requiresSyntheticEventPropagation_
};
goog.debug.entryPointRegistry.register(function(a) {
  goog.events.handleBrowserEvent_ = a(goog.events.handleBrowserEvent_);
  goog.events.pools.setProxyCallbackFunction(goog.events.handleBrowserEvent_)
});bot.script = {};
bot.script.execute = function(a, b, c, d, e, f) {
  function g(n, p) {
    if(!k) {
      k = true;
      goog.events.unlistenByKey(l);
      m.clearTimeout(j);
      if(n != bot.ErrorCode.SUCCESS) {
        var q = new bot.Error(n, p.message);
        q.stack = p.stack;
        e(q)
      }else {
        d(p)
      }
    }
  }
  function h() {
    g(bot.ErrorCode.UNHANDLED_JS_ERROR, Error("Detected a page unload event; asynchronous script execution does not work across apge loads."))
  }
  function i(n) {
    g(bot.ErrorCode.SCRIPT_TIMEOUT, Error("Timed out waiting for asynchronous script result after " + (goog.now() - n) + "ms"))
  }
  var j, l, m = f || window, k = false;
  if(f = c >= 0) {
    b.push(function(n) {
      g(bot.ErrorCode.SUCCESS, n)
    });
    l = goog.events.listen(m, goog.events.EventType.UNLOAD, h, true)
  }
  var o = goog.now();
  try {
    with(m) {
      var s = (new Function(a)).apply(m, b)
    }
    if(f) {
      j = m.setTimeout(goog.partial(i, o), c)
    }else {
      g(bot.ErrorCode.SUCCESS, s)
    }
  }catch(r) {
    g(r.code || bot.ErrorCode.UNHANDLED_JS_ERROR, r)
  }
};bot.window_ = goog.global;
bot.getWindow = function() {
  return bot.window_
};
bot.setWindow = function(a) {
  bot.window_ = a
};goog.dom = {};
goog.dom.BrowserFeature = {CAN_ADD_NAME_OR_TYPE_ATTRIBUTES:!goog.userAgent.IE || goog.userAgent.isVersion("9"), CAN_USE_INNER_TEXT:goog.userAgent.IE && !goog.userAgent.isVersion("9"), INNER_HTML_NEEDS_SCOPED_ELEMENT:goog.userAgent.IE};goog.dom.TagName = {A:"A", ABBR:"ABBR", ACRONYM:"ACRONYM", ADDRESS:"ADDRESS", APPLET:"APPLET", AREA:"AREA", B:"B", BASE:"BASE", BASEFONT:"BASEFONT", BDO:"BDO", BIG:"BIG", BLOCKQUOTE:"BLOCKQUOTE", BODY:"BODY", BR:"BR", BUTTON:"BUTTON", CANVAS:"CANVAS", CAPTION:"CAPTION", CENTER:"CENTER", CITE:"CITE", CODE:"CODE", COL:"COL", COLGROUP:"COLGROUP", DD:"DD", DEL:"DEL", DFN:"DFN", DIR:"DIR", DIV:"DIV", DL:"DL", DT:"DT", EM:"EM", FIELDSET:"FIELDSET", FONT:"FONT", FORM:"FORM", FRAME:"FRAME", FRAMESET:"FRAMESET", 
H1:"H1", H2:"H2", H3:"H3", H4:"H4", H5:"H5", H6:"H6", HEAD:"HEAD", HR:"HR", HTML:"HTML", I:"I", IFRAME:"IFRAME", IMG:"IMG", INPUT:"INPUT", INS:"INS", ISINDEX:"ISINDEX", KBD:"KBD", LABEL:"LABEL", LEGEND:"LEGEND", LI:"LI", LINK:"LINK", MAP:"MAP", MENU:"MENU", META:"META", NOFRAMES:"NOFRAMES", NOSCRIPT:"NOSCRIPT", OBJECT:"OBJECT", OL:"OL", OPTGROUP:"OPTGROUP", OPTION:"OPTION", P:"P", PARAM:"PARAM", PRE:"PRE", Q:"Q", S:"S", SAMP:"SAMP", SCRIPT:"SCRIPT", SELECT:"SELECT", SMALL:"SMALL", SPAN:"SPAN", STRIKE:"STRIKE", 
STRONG:"STRONG", STYLE:"STYLE", SUB:"SUB", SUP:"SUP", TABLE:"TABLE", TBODY:"TBODY", TD:"TD", TEXTAREA:"TEXTAREA", TFOOT:"TFOOT", TH:"TH", THEAD:"THEAD", TITLE:"TITLE", TR:"TR", TT:"TT", U:"U", UL:"UL", VAR:"VAR"};goog.dom.classes = {};
goog.dom.classes.set = function(a, b) {
  a.className = b
};
goog.dom.classes.get = function(a) {
  return(a = a.className) && typeof a.split == "function" ? a.split(/\s+/) : []
};
goog.dom.classes.add = function(a) {
  var b = goog.dom.classes.get(a), c = goog.array.slice(arguments, 1);
  c = goog.dom.classes.add_(b, c);
  a.className = b.join(" ");
  return c
};
goog.dom.classes.remove = function(a) {
  var b = goog.dom.classes.get(a), c = goog.array.slice(arguments, 1);
  c = goog.dom.classes.remove_(b, c);
  a.className = b.join(" ");
  return c
};
goog.dom.classes.add_ = function(a, b) {
  var c = 0;
  for(var d = 0;d < b.length;d++) {
    if(!goog.array.contains(a, b[d])) {
      a.push(b[d]);
      c++
    }
  }
  return c == b.length
};
goog.dom.classes.remove_ = function(a, b) {
  var c = 0;
  for(var d = 0;d < a.length;d++) {
    if(goog.array.contains(b, a[d])) {
      goog.array.splice(a, d--, 1);
      c++
    }
  }
  return c == b.length
};
goog.dom.classes.swap = function(a, b, c) {
  var d = goog.dom.classes.get(a), e = false;
  for(var f = 0;f < d.length;f++) {
    if(d[f] == b) {
      goog.array.splice(d, f--, 1);
      e = true
    }
  }
  if(e) {
    d.push(c);
    a.className = d.join(" ")
  }
  return e
};
goog.dom.classes.addRemove = function(a, b, c) {
  var d = goog.dom.classes.get(a);
  if(goog.isString(b)) {
    goog.array.remove(d, b)
  }else {
    goog.isArray(b) && goog.dom.classes.remove_(d, b)
  }
  if(goog.isString(c) && !goog.array.contains(d, c)) {
    d.push(c)
  }else {
    goog.isArray(c) && goog.dom.classes.add_(d, c)
  }
  a.className = d.join(" ")
};
goog.dom.classes.has = function(a, b) {
  return goog.array.contains(goog.dom.classes.get(a), b)
};
goog.dom.classes.enable = function(a, b, c) {
  c ? goog.dom.classes.add(a, b) : goog.dom.classes.remove(a, b)
};
goog.dom.classes.toggle = function(a, b) {
  var c = !goog.dom.classes.has(a, b);
  goog.dom.classes.enable(a, b, c);
  return c
};goog.math = {};
goog.math.Coordinate = function(a, b) {
  this.x = goog.isDef(a) ? a : 0;
  this.y = goog.isDef(b) ? b : 0
};
goog.math.Coordinate.prototype.clone = function() {
  return new goog.math.Coordinate(this.x, this.y)
};
if(goog.DEBUG) {
  goog.math.Coordinate.prototype.toString = function() {
    return"(" + this.x + ", " + this.y + ")"
  }
}
goog.math.Coordinate.equals = function(a, b) {
  if(a == b) {
    return true
  }
  if(!a || !b) {
    return false
  }
  return a.x == b.x && a.y == b.y
};
goog.math.Coordinate.distance = function(a, b) {
  var c = a.x - b.x, d = a.y - b.y;
  return Math.sqrt(c * c + d * d)
};
goog.math.Coordinate.squaredDistance = function(a, b) {
  var c = a.x - b.x, d = a.y - b.y;
  return c * c + d * d
};
goog.math.Coordinate.difference = function(a, b) {
  return new goog.math.Coordinate(a.x - b.x, a.y - b.y)
};
goog.math.Coordinate.sum = function(a, b) {
  return new goog.math.Coordinate(a.x + b.x, a.y + b.y)
};goog.math.Size = function(a, b) {
  this.width = a;
  this.height = b
};
goog.math.Size.equals = function(a, b) {
  if(a == b) {
    return true
  }
  if(!a || !b) {
    return false
  }
  return a.width == b.width && a.height == b.height
};
goog.math.Size.prototype.clone = function() {
  return new goog.math.Size(this.width, this.height)
};
if(goog.DEBUG) {
  goog.math.Size.prototype.toString = function() {
    return"(" + this.width + " x " + this.height + ")"
  }
}
goog.math.Size.prototype.getLongest = function() {
  return Math.max(this.width, this.height)
};
goog.math.Size.prototype.getShortest = function() {
  return Math.min(this.width, this.height)
};
goog.math.Size.prototype.area = function() {
  return this.width * this.height
};
goog.math.Size.prototype.perimeter = function() {
  return(this.width + this.height) * 2
};
goog.math.Size.prototype.aspectRatio = function() {
  return this.width / this.height
};
goog.math.Size.prototype.isEmpty = function() {
  return!this.area()
};
goog.math.Size.prototype.ceil = function() {
  this.width = Math.ceil(this.width);
  this.height = Math.ceil(this.height);
  return this
};
goog.math.Size.prototype.fitsInside = function(a) {
  return this.width <= a.width && this.height <= a.height
};
goog.math.Size.prototype.floor = function() {
  this.width = Math.floor(this.width);
  this.height = Math.floor(this.height);
  return this
};
goog.math.Size.prototype.round = function() {
  this.width = Math.round(this.width);
  this.height = Math.round(this.height);
  return this
};
goog.math.Size.prototype.scale = function(a) {
  this.width *= a;
  this.height *= a;
  return this
};
goog.math.Size.prototype.scaleToFit = function(a) {
  return this.scale(this.aspectRatio() > a.aspectRatio() ? a.width / this.width : a.height / this.height)
};goog.dom.ASSUME_QUIRKS_MODE = false;
goog.dom.ASSUME_STANDARDS_MODE = false;
goog.dom.COMPAT_MODE_KNOWN_ = goog.dom.ASSUME_QUIRKS_MODE || goog.dom.ASSUME_STANDARDS_MODE;
goog.dom.NodeType = {ELEMENT:1, ATTRIBUTE:2, TEXT:3, CDATA_SECTION:4, ENTITY_REFERENCE:5, ENTITY:6, PROCESSING_INSTRUCTION:7, COMMENT:8, DOCUMENT:9, DOCUMENT_TYPE:10, DOCUMENT_FRAGMENT:11, NOTATION:12};
goog.dom.getDomHelper = function(a) {
  return a ? new goog.dom.DomHelper(goog.dom.getOwnerDocument(a)) : goog.dom.defaultDomHelper_ || (goog.dom.defaultDomHelper_ = new goog.dom.DomHelper)
};
goog.dom.getDocument = function() {
  return document
};
goog.dom.getElement = function(a) {
  return goog.isString(a) ? document.getElementById(a) : a
};
goog.dom.$ = goog.dom.getElement;
goog.dom.getElementsByTagNameAndClass = function(a, b, c) {
  return goog.dom.getElementsByTagNameAndClass_(document, a, b, c)
};
goog.dom.getElementsByClass = function(a, b) {
  var c = b || document;
  if(goog.dom.canUseQuerySelector_(c)) {
    return c.querySelectorAll("." + a)
  }else {
    if(c.getElementsByClassName) {
      return c.getElementsByClassName(a)
    }
  }
  return goog.dom.getElementsByTagNameAndClass_(document, "*", a, b)
};
goog.dom.getElementByClass = function(a, b) {
  var c = b || document, d = null;
  return(d = goog.dom.canUseQuerySelector_(c) ? c.querySelector("." + a) : goog.dom.getElementsByClass(a, b)[0]) || null
};
goog.dom.canUseQuerySelector_ = function(a) {
  return a.querySelectorAll && a.querySelector && (!goog.userAgent.WEBKIT || goog.dom.isCss1CompatMode_(document) || goog.userAgent.isVersion("528"))
};
goog.dom.getElementsByTagNameAndClass_ = function(a, b, c, d) {
  a = d || a;
  b = b && b != "*" ? b.toUpperCase() : "";
  if(goog.dom.canUseQuerySelector_(a) && (b || c)) {
    return a.querySelectorAll(b + (c ? "." + c : ""))
  }
  if(c && a.getElementsByClassName) {
    a = a.getElementsByClassName(c);
    if(b) {
      d = {};
      var e = 0, f = 0;
      for(var g;g = a[f];f++) {
        if(b == g.nodeName) {
          d[e++] = g
        }
      }
      d.length = e;
      return d
    }else {
      return a
    }
  }
  a = a.getElementsByTagName(b || "*");
  if(c) {
    d = {};
    e = 0;
    for(f = 0;g = a[f];f++) {
      b = g.className;
      if(typeof b.split == "function" && goog.array.contains(b.split(/\s+/), c)) {
        d[e++] = g
      }
    }
    d.length = e;
    return d
  }else {
    return a
  }
};
goog.dom.$$ = goog.dom.getElementsByTagNameAndClass;
goog.dom.setProperties = function(a, b) {
  goog.object.forEach(b, function(c, d) {
    if(d == "style") {
      a.style.cssText = c
    }else {
      if(d == "class") {
        a.className = c
      }else {
        if(d == "for") {
          a.htmlFor = c
        }else {
          if(d in goog.dom.DIRECT_ATTRIBUTE_MAP_) {
            a.setAttribute(goog.dom.DIRECT_ATTRIBUTE_MAP_[d], c)
          }else {
            a[d] = c
          }
        }
      }
    }
  })
};
goog.dom.DIRECT_ATTRIBUTE_MAP_ = {cellpadding:"cellPadding", cellspacing:"cellSpacing", colspan:"colSpan", rowspan:"rowSpan", valign:"vAlign", height:"height", width:"width", usemap:"useMap", frameborder:"frameBorder", maxlength:"maxLength", type:"type"};
goog.dom.getViewportSize = function(a) {
  return goog.dom.getViewportSize_(a || window)
};
goog.dom.getViewportSize_ = function(a) {
  var b = a.document;
  if(goog.userAgent.WEBKIT && !goog.userAgent.isVersion("500") && !goog.userAgent.MOBILE) {
    if(typeof a.innerHeight == "undefined") {
      a = window
    }
    b = a.innerHeight;
    var c = a.document.documentElement.scrollHeight;
    if(a == a.top) {
      if(c < b) {
        b -= 15
      }
    }
    return new goog.math.Size(a.innerWidth, b)
  }
  a = goog.dom.isCss1CompatMode_(b);
  if(goog.userAgent.OPERA && !goog.userAgent.isVersion("9.50")) {
    a = false
  }
  a = a ? b.documentElement : b.body;
  return new goog.math.Size(a.clientWidth, a.clientHeight)
};
goog.dom.getDocumentHeight = function() {
  return goog.dom.getDocumentHeight_(window)
};
goog.dom.getDocumentHeight_ = function(a) {
  var b = a.document, c = 0;
  if(b) {
    a = goog.dom.getViewportSize_(a).height;
    c = b.body;
    var d = b.documentElement;
    if(goog.dom.isCss1CompatMode_(b) && d.scrollHeight) {
      c = d.scrollHeight != a ? d.scrollHeight : d.offsetHeight
    }else {
      b = d.scrollHeight;
      var e = d.offsetHeight;
      if(d.clientHeight != e) {
        b = c.scrollHeight;
        e = c.offsetHeight
      }
      c = b > a ? b > e ? b : e : b < e ? b : e
    }
  }
  return c
};
goog.dom.getPageScroll = function(a) {
  return goog.dom.getDomHelper((a || goog.global || window).document).getDocumentScroll()
};
goog.dom.getDocumentScroll = function() {
  return goog.dom.getDocumentScroll_(document)
};
goog.dom.getDocumentScroll_ = function(a) {
  a = goog.dom.getDocumentScrollElement_(a);
  return new goog.math.Coordinate(a.scrollLeft, a.scrollTop)
};
goog.dom.getDocumentScrollElement = function() {
  return goog.dom.getDocumentScrollElement_(document)
};
goog.dom.getDocumentScrollElement_ = function(a) {
  return!goog.userAgent.WEBKIT && goog.dom.isCss1CompatMode_(a) ? a.documentElement : a.body
};
goog.dom.getWindow = function(a) {
  return a ? goog.dom.getWindow_(a) : window
};
goog.dom.getWindow_ = function(a) {
  return a.parentWindow || a.defaultView
};
goog.dom.createDom = function() {
  return goog.dom.createDom_(document, arguments)
};
goog.dom.createDom_ = function(a, b) {
  var c = b[0], d = b[1];
  if(!goog.dom.BrowserFeature.CAN_ADD_NAME_OR_TYPE_ATTRIBUTES && d && (d.name || d.type)) {
    c = ["<", c];
    d.name && c.push(' name="', goog.string.htmlEscape(d.name), '"');
    if(d.type) {
      c.push(' type="', goog.string.htmlEscape(d.type), '"');
      var e = {};
      goog.object.extend(e, d);
      d = e;
      delete d.type
    }
    c.push(">");
    c = c.join("")
  }
  c = a.createElement(c);
  if(d) {
    if(goog.isString(d)) {
      c.className = d
    }else {
      goog.isArray(d) ? goog.dom.classes.add.apply(null, [c].concat(d)) : goog.dom.setProperties(c, d)
    }
  }
  b.length > 2 && goog.dom.append_(a, c, b, 2);
  return c
};
goog.dom.append_ = function(a, b, c, d) {
  function e(g) {
    if(g) {
      b.appendChild(goog.isString(g) ? a.createTextNode(g) : g)
    }
  }
  for(d = d;d < c.length;d++) {
    var f = c[d];
    goog.isArrayLike(f) && !goog.dom.isNodeLike(f) ? goog.array.forEach(goog.dom.isNodeList(f) ? goog.array.clone(f) : f, e) : e(f)
  }
};
goog.dom.$dom = goog.dom.createDom;
goog.dom.createElement = function(a) {
  return document.createElement(a)
};
goog.dom.createTextNode = function(a) {
  return document.createTextNode(a)
};
goog.dom.createTable = function(a, b, c) {
  return goog.dom.createTable_(document, a, b, !!c)
};
goog.dom.createTable_ = function(a, b, c, d) {
  var e = ["<tr>"];
  for(var f = 0;f < c;f++) {
    e.push(d ? "<td>&nbsp;</td>" : "<td></td>")
  }
  e.push("</tr>");
  e = e.join("");
  c = ["<table>"];
  for(f = 0;f < b;f++) {
    c.push(e)
  }
  c.push("</table>");
  a = a.createElement(goog.dom.TagName.DIV);
  a.innerHTML = c.join("");
  return a.removeChild(a.firstChild)
};
goog.dom.htmlToDocumentFragment = function(a) {
  return goog.dom.htmlToDocumentFragment_(document, a)
};
goog.dom.htmlToDocumentFragment_ = function(a, b) {
  var c = a.createElement("div");
  if(goog.dom.BrowserFeature.INNER_HTML_NEEDS_SCOPED_ELEMENT) {
    c.innerHTML = "<br>" + b;
    c.removeChild(c.firstChild)
  }else {
    c.innerHTML = b
  }
  if(c.childNodes.length == 1) {
    return c.removeChild(c.firstChild)
  }else {
    for(var d = a.createDocumentFragment();c.firstChild;) {
      d.appendChild(c.firstChild)
    }
    return d
  }
};
goog.dom.getCompatMode = function() {
  return goog.dom.isCss1CompatMode() ? "CSS1Compat" : "BackCompat"
};
goog.dom.isCss1CompatMode = function() {
  return goog.dom.isCss1CompatMode_(document)
};
goog.dom.isCss1CompatMode_ = function(a) {
  if(goog.dom.COMPAT_MODE_KNOWN_) {
    return goog.dom.ASSUME_STANDARDS_MODE
  }
  return a.compatMode == "CSS1Compat"
};
goog.dom.canHaveChildren = function(a) {
  if(a.nodeType != goog.dom.NodeType.ELEMENT) {
    return false
  }
  switch(a.tagName) {
    case goog.dom.TagName.APPLET:
    ;
    case goog.dom.TagName.AREA:
    ;
    case goog.dom.TagName.BASE:
    ;
    case goog.dom.TagName.BR:
    ;
    case goog.dom.TagName.COL:
    ;
    case goog.dom.TagName.FRAME:
    ;
    case goog.dom.TagName.HR:
    ;
    case goog.dom.TagName.IMG:
    ;
    case goog.dom.TagName.INPUT:
    ;
    case goog.dom.TagName.IFRAME:
    ;
    case goog.dom.TagName.ISINDEX:
    ;
    case goog.dom.TagName.LINK:
    ;
    case goog.dom.TagName.NOFRAMES:
    ;
    case goog.dom.TagName.NOSCRIPT:
    ;
    case goog.dom.TagName.META:
    ;
    case goog.dom.TagName.OBJECT:
    ;
    case goog.dom.TagName.PARAM:
    ;
    case goog.dom.TagName.SCRIPT:
    ;
    case goog.dom.TagName.STYLE:
      return false
  }
  return true
};
goog.dom.appendChild = function(a, b) {
  a.appendChild(b)
};
goog.dom.append = function(a) {
  goog.dom.append_(goog.dom.getOwnerDocument(a), a, arguments, 1)
};
goog.dom.removeChildren = function(a) {
  for(var b;b = a.firstChild;) {
    a.removeChild(b)
  }
};
goog.dom.insertSiblingBefore = function(a, b) {
  b.parentNode && b.parentNode.insertBefore(a, b)
};
goog.dom.insertSiblingAfter = function(a, b) {
  b.parentNode && b.parentNode.insertBefore(a, b.nextSibling)
};
goog.dom.removeNode = function(a) {
  return a && a.parentNode ? a.parentNode.removeChild(a) : null
};
goog.dom.replaceNode = function(a, b) {
  var c = b.parentNode;
  c && c.replaceChild(a, b)
};
goog.dom.flattenElement = function(a) {
  var b, c = a.parentNode;
  if(c && c.nodeType != goog.dom.NodeType.DOCUMENT_FRAGMENT) {
    if(a.removeNode) {
      return a.removeNode(false)
    }else {
      for(;b = a.firstChild;) {
        c.insertBefore(b, a)
      }
      return goog.dom.removeNode(a)
    }
  }
};
goog.dom.getFirstElementChild = function(a) {
  return goog.dom.getNextElementNode_(a.firstChild, true)
};
goog.dom.getLastElementChild = function(a) {
  return goog.dom.getNextElementNode_(a.lastChild, false)
};
goog.dom.getNextElementSibling = function(a) {
  return goog.dom.getNextElementNode_(a.nextSibling, true)
};
goog.dom.getPreviousElementSibling = function(a) {
  return goog.dom.getNextElementNode_(a.previousSibling, false)
};
goog.dom.getNextElementNode_ = function(a, b) {
  for(;a && a.nodeType != goog.dom.NodeType.ELEMENT;) {
    a = b ? a.nextSibling : a.previousSibling
  }
  return a
};
goog.dom.getNextNode = function(a) {
  if(!a) {
    return null
  }
  if(a.firstChild) {
    return a.firstChild
  }
  for(;a && !a.nextSibling;) {
    a = a.parentNode
  }
  return a ? a.nextSibling : null
};
goog.dom.getPreviousNode = function(a) {
  if(!a) {
    return null
  }
  if(!a.previousSibling) {
    return a.parentNode
  }
  for(a = a.previousSibling;a && a.lastChild;) {
    a = a.lastChild
  }
  return a
};
goog.dom.isNodeLike = function(a) {
  return goog.isObject(a) && a.nodeType > 0
};
goog.dom.isWindow = function(a) {
  return goog.isObject(a) && a.window == a
};
goog.dom.contains = function(a, b) {
  if(a.contains && b.nodeType == goog.dom.NodeType.ELEMENT) {
    return a == b || a.contains(b)
  }
  if(typeof a.compareDocumentPosition != "undefined") {
    return a == b || Boolean(a.compareDocumentPosition(b) & 16)
  }
  for(;b && a != b;) {
    b = b.parentNode
  }
  return b == a
};
goog.dom.compareNodeOrder = function(a, b) {
  if(a == b) {
    return 0
  }
  if(a.compareDocumentPosition) {
    return a.compareDocumentPosition(b) & 2 ? 1 : -1
  }
  if("sourceIndex" in a || a.parentNode && "sourceIndex" in a.parentNode) {
    var c = a.nodeType == goog.dom.NodeType.ELEMENT, d = b.nodeType == goog.dom.NodeType.ELEMENT;
    if(c && d) {
      return a.sourceIndex - b.sourceIndex
    }else {
      var e = a.parentNode, f = b.parentNode;
      if(e == f) {
        return goog.dom.compareSiblingOrder_(a, b)
      }
      if(!c && goog.dom.contains(e, b)) {
        return-1 * goog.dom.compareParentsDescendantNodeIe_(a, b)
      }
      if(!d && goog.dom.contains(f, a)) {
        return goog.dom.compareParentsDescendantNodeIe_(b, a)
      }
      return(c ? a.sourceIndex : e.sourceIndex) - (d ? b.sourceIndex : f.sourceIndex)
    }
  }
  d = goog.dom.getOwnerDocument(a);
  c = d.createRange();
  c.selectNode(a);
  c.collapse(true);
  d = d.createRange();
  d.selectNode(b);
  d.collapse(true);
  return c.compareBoundaryPoints(goog.global.Range.START_TO_END, d)
};
goog.dom.compareParentsDescendantNodeIe_ = function(a, b) {
  var c = a.parentNode;
  if(c == b) {
    return-1
  }
  for(var d = b;d.parentNode != c;) {
    d = d.parentNode
  }
  return goog.dom.compareSiblingOrder_(d, a)
};
goog.dom.compareSiblingOrder_ = function(a, b) {
  for(var c = b;c = c.previousSibling;) {
    if(c == a) {
      return-1
    }
  }
  return 1
};
goog.dom.findCommonAncestor = function() {
  var a, b = arguments.length;
  if(b) {
    if(b == 1) {
      return arguments[0]
    }
  }else {
    return null
  }
  var c = [], d = Infinity;
  for(a = 0;a < b;a++) {
    var e = [];
    for(var f = arguments[a];f;) {
      e.unshift(f);
      f = f.parentNode
    }
    c.push(e);
    d = Math.min(d, e.length)
  }
  e = null;
  for(a = 0;a < d;a++) {
    f = c[0][a];
    for(var g = 1;g < b;g++) {
      if(f != c[g][a]) {
        return e
      }
    }
    e = f
  }
  return e
};
goog.dom.getOwnerDocument = function(a) {
  return a.nodeType == goog.dom.NodeType.DOCUMENT ? a : a.ownerDocument || a.document
};
goog.dom.getFrameContentDocument = function(a) {
  return goog.userAgent.WEBKIT ? a.document || a.contentWindow.document : a.contentDocument || a.contentWindow.document
};
goog.dom.getFrameContentWindow = function(a) {
  return a.contentWindow || goog.dom.getWindow_(goog.dom.getFrameContentDocument(a))
};
goog.dom.setTextContent = function(a, b) {
  if("textContent" in a) {
    a.textContent = b
  }else {
    if(a.firstChild && a.firstChild.nodeType == goog.dom.NodeType.TEXT) {
      for(;a.lastChild != a.firstChild;) {
        a.removeChild(a.lastChild)
      }
      a.firstChild.data = b
    }else {
      goog.dom.removeChildren(a);
      var c = goog.dom.getOwnerDocument(a);
      a.appendChild(c.createTextNode(b))
    }
  }
};
goog.dom.getOuterHtml = function(a) {
  if("outerHTML" in a) {
    return a.outerHTML
  }else {
    var b = goog.dom.getOwnerDocument(a).createElement("div");
    b.appendChild(a.cloneNode(true));
    return b.innerHTML
  }
};
goog.dom.findNode = function(a, b) {
  var c = [];
  return goog.dom.findNodes_(a, b, c, true) ? c[0] : undefined
};
goog.dom.findNodes = function(a, b) {
  var c = [];
  goog.dom.findNodes_(a, b, c, false);
  return c
};
goog.dom.findNodes_ = function(a, b, c, d) {
  if(a != null) {
    var e = 0;
    for(var f;f = a.childNodes[e];e++) {
      if(b(f)) {
        c.push(f);
        if(d) {
          return true
        }
      }
      if(goog.dom.findNodes_(f, b, c, d)) {
        return true
      }
    }
  }
  return false
};
goog.dom.TAGS_TO_IGNORE_ = {SCRIPT:1, STYLE:1, HEAD:1, IFRAME:1, OBJECT:1};
goog.dom.PREDEFINED_TAG_VALUES_ = {IMG:" ", BR:"\n"};
goog.dom.isFocusableTabIndex = function(a) {
  var b = a.getAttributeNode("tabindex");
  if(b && b.specified) {
    a = a.tabIndex;
    return goog.isNumber(a) && a >= 0
  }
  return false
};
goog.dom.setFocusableTabIndex = function(a, b) {
  if(b) {
    a.tabIndex = 0
  }else {
    a.removeAttribute("tabIndex")
  }
};
goog.dom.getTextContent = function(a) {
  if(goog.dom.BrowserFeature.CAN_USE_INNER_TEXT && "innerText" in a) {
    a = goog.string.canonicalizeNewlines(a.innerText)
  }else {
    var b = [];
    goog.dom.getTextContent_(a, b, true);
    a = b.join("")
  }
  a = a.replace(/ \xAD /g, " ").replace(/\xAD/g, "");
  a = a.replace(/\u200B/g, "");
  goog.userAgent.IE || (a = a.replace(/ +/g, " "));
  if(a != " ") {
    a = a.replace(/^\s*/, "")
  }
  return a
};
goog.dom.getRawTextContent = function(a) {
  var b = [];
  goog.dom.getTextContent_(a, b, false);
  return b.join("")
};
goog.dom.getTextContent_ = function(a, b, c) {
  if(!(a.nodeName in goog.dom.TAGS_TO_IGNORE_)) {
    if(a.nodeType == goog.dom.NodeType.TEXT) {
      c ? b.push(String(a.nodeValue).replace(/(\r\n|\r|\n)/g, "")) : b.push(a.nodeValue)
    }else {
      if(a.nodeName in goog.dom.PREDEFINED_TAG_VALUES_) {
        b.push(goog.dom.PREDEFINED_TAG_VALUES_[a.nodeName])
      }else {
        for(a = a.firstChild;a;) {
          goog.dom.getTextContent_(a, b, c);
          a = a.nextSibling
        }
      }
    }
  }
};
goog.dom.getNodeTextLength = function(a) {
  return goog.dom.getTextContent(a).length
};
goog.dom.getNodeTextOffset = function(a, b) {
  var c = b || goog.dom.getOwnerDocument(a).body;
  for(var d = [];a && a != c;) {
    for(var e = a;e = e.previousSibling;) {
      d.unshift(goog.dom.getTextContent(e))
    }
    a = a.parentNode
  }
  return goog.string.trimLeft(d.join("")).replace(/ +/g, " ").length
};
goog.dom.getNodeAtOffset = function(a, b, c) {
  a = [a];
  var d = 0;
  for(var e;a.length > 0 && d < b;) {
    e = a.pop();
    if(!(e.nodeName in goog.dom.TAGS_TO_IGNORE_)) {
      if(e.nodeType == goog.dom.NodeType.TEXT) {
        var f = e.nodeValue.replace(/(\r\n|\r|\n)/g, "").replace(/ +/g, " ");
        d += f.length
      }else {
        if(e.nodeName in goog.dom.PREDEFINED_TAG_VALUES_) {
          d += goog.dom.PREDEFINED_TAG_VALUES_[e.nodeName].length
        }else {
          for(f = e.childNodes.length - 1;f >= 0;f--) {
            a.push(e.childNodes[f])
          }
        }
      }
    }
  }
  if(goog.isObject(c)) {
    c.remainder = e ? e.nodeValue.length + b - d - 1 : 0;
    c.node = e
  }
  return e
};
goog.dom.isNodeList = function(a) {
  if(a && typeof a.length == "number") {
    if(goog.isObject(a)) {
      return typeof a.item == "function" || typeof a.item == "string"
    }else {
      if(goog.isFunction(a)) {
        return typeof a.item == "function"
      }
    }
  }
  return false
};
goog.dom.getAncestorByTagNameAndClass = function(a, b, c) {
  var d = b ? b.toUpperCase() : null;
  return goog.dom.getAncestor(a, function(e) {
    return(!d || e.nodeName == d) && (!c || goog.dom.classes.has(e, c))
  }, true)
};
goog.dom.getAncestorByClass = function(a, b) {
  return goog.dom.getAncestorByTagNameAndClass(a, null, b)
};
goog.dom.getAncestor = function(a, b, c, d) {
  if(!c) {
    a = a.parentNode
  }
  c = d == null;
  for(var e = 0;a && (c || e <= d);) {
    if(b(a)) {
      return a
    }
    a = a.parentNode;
    e++
  }
  return null
};
goog.dom.DomHelper = function(a) {
  this.document_ = a || goog.global.document || document
};
goog.dom.DomHelper.prototype.getDomHelper = goog.dom.getDomHelper;
goog.dom.DomHelper.prototype.setDocument = function(a) {
  this.document_ = a
};
goog.dom.DomHelper.prototype.getDocument = function() {
  return this.document_
};
goog.dom.DomHelper.prototype.getElement = function(a) {
  return goog.isString(a) ? this.document_.getElementById(a) : a
};
goog.dom.DomHelper.prototype.$ = goog.dom.DomHelper.prototype.getElement;
goog.dom.DomHelper.prototype.getElementsByTagNameAndClass = function(a, b, c) {
  return goog.dom.getElementsByTagNameAndClass_(this.document_, a, b, c)
};
goog.dom.DomHelper.prototype.getElementsByClass = function(a, b) {
  return goog.dom.getElementsByClass(a, b || this.document_)
};
goog.dom.DomHelper.prototype.getElementByClass = function(a, b) {
  return goog.dom.getElementByClass(a, b || this.document_)
};
goog.dom.DomHelper.prototype.$$ = goog.dom.DomHelper.prototype.getElementsByTagNameAndClass;
goog.dom.DomHelper.prototype.setProperties = goog.dom.setProperties;
goog.dom.DomHelper.prototype.getViewportSize = function(a) {
  return goog.dom.getViewportSize(a || this.getWindow())
};
goog.dom.DomHelper.prototype.getDocumentHeight = function() {
  return goog.dom.getDocumentHeight_(this.getWindow())
};
goog.dom.DomHelper.prototype.createDom = function() {
  return goog.dom.createDom_(this.document_, arguments)
};
goog.dom.DomHelper.prototype.$dom = goog.dom.DomHelper.prototype.createDom;
goog.dom.DomHelper.prototype.createElement = function(a) {
  return this.document_.createElement(a)
};
goog.dom.DomHelper.prototype.createTextNode = function(a) {
  return this.document_.createTextNode(a)
};
goog.dom.DomHelper.prototype.createTable = function(a, b, c) {
  return goog.dom.createTable_(this.document_, a, b, !!c)
};
goog.dom.DomHelper.prototype.htmlToDocumentFragment = function(a) {
  return goog.dom.htmlToDocumentFragment_(this.document_, a)
};
goog.dom.DomHelper.prototype.getCompatMode = function() {
  return this.isCss1CompatMode() ? "CSS1Compat" : "BackCompat"
};
goog.dom.DomHelper.prototype.isCss1CompatMode = function() {
  return goog.dom.isCss1CompatMode_(this.document_)
};
goog.dom.DomHelper.prototype.getWindow = function() {
  return goog.dom.getWindow_(this.document_)
};
goog.dom.DomHelper.prototype.getDocumentScrollElement = function() {
  return goog.dom.getDocumentScrollElement_(this.document_)
};
goog.dom.DomHelper.prototype.getDocumentScroll = function() {
  return goog.dom.getDocumentScroll_(this.document_)
};
goog.dom.DomHelper.prototype.appendChild = goog.dom.appendChild;
goog.dom.DomHelper.prototype.append = goog.dom.append;
goog.dom.DomHelper.prototype.removeChildren = goog.dom.removeChildren;
goog.dom.DomHelper.prototype.insertSiblingBefore = goog.dom.insertSiblingBefore;
goog.dom.DomHelper.prototype.insertSiblingAfter = goog.dom.insertSiblingAfter;
goog.dom.DomHelper.prototype.removeNode = goog.dom.removeNode;
goog.dom.DomHelper.prototype.replaceNode = goog.dom.replaceNode;
goog.dom.DomHelper.prototype.flattenElement = goog.dom.flattenElement;
goog.dom.DomHelper.prototype.getFirstElementChild = goog.dom.getFirstElementChild;
goog.dom.DomHelper.prototype.getLastElementChild = goog.dom.getLastElementChild;
goog.dom.DomHelper.prototype.getNextElementSibling = goog.dom.getNextElementSibling;
goog.dom.DomHelper.prototype.getPreviousElementSibling = goog.dom.getPreviousElementSibling;
goog.dom.DomHelper.prototype.getNextNode = goog.dom.getNextNode;
goog.dom.DomHelper.prototype.getPreviousNode = goog.dom.getPreviousNode;
goog.dom.DomHelper.prototype.isNodeLike = goog.dom.isNodeLike;
goog.dom.DomHelper.prototype.contains = goog.dom.contains;
goog.dom.DomHelper.prototype.getOwnerDocument = goog.dom.getOwnerDocument;
goog.dom.DomHelper.prototype.getFrameContentDocument = goog.dom.getFrameContentDocument;
goog.dom.DomHelper.prototype.getFrameContentWindow = goog.dom.getFrameContentWindow;
goog.dom.DomHelper.prototype.setTextContent = goog.dom.setTextContent;
goog.dom.DomHelper.prototype.findNode = goog.dom.findNode;
goog.dom.DomHelper.prototype.findNodes = goog.dom.findNodes;
goog.dom.DomHelper.prototype.getTextContent = goog.dom.getTextContent;
goog.dom.DomHelper.prototype.getNodeTextLength = goog.dom.getNodeTextLength;
goog.dom.DomHelper.prototype.getNodeTextOffset = goog.dom.getNodeTextOffset;
goog.dom.DomHelper.prototype.getAncestorByTagNameAndClass = goog.dom.getAncestorByTagNameAndClass;
goog.dom.DomHelper.prototype.getAncestor = goog.dom.getAncestor;goog.dom.xml = {};
goog.dom.xml.MAX_XML_SIZE_KB = 2048;
goog.dom.xml.MAX_ELEMENT_DEPTH = 256;
goog.dom.xml.createDocument = function(a, b) {
  if(b && !a) {
    throw Error("Can't create document with namespace and no root tag");
  }
  if(document.implementation && document.implementation.createDocument) {
    return document.implementation.createDocument(b || "", a || "", null)
  }else {
    if(typeof ActiveXObject != "undefined") {
      var c = goog.dom.xml.createMsXmlDocument_();
      if(c) {
        if(a) {
          c.appendChild(c.createNode(goog.dom.NodeType.ELEMENT, a, b || ""))
        }
        return c
      }
    }
  }
  throw Error("Your browser does not support creating new documents");
};
goog.dom.xml.loadXml = function(a) {
  if(typeof DOMParser != "undefined") {
    return(new DOMParser).parseFromString(a, "application/xml")
  }else {
    if(typeof ActiveXObject != "undefined") {
      var b = goog.dom.xml.createMsXmlDocument_();
      b.loadXML(a);
      return b
    }
  }
  throw Error("Your browser does not support loading xml documents");
};
goog.dom.xml.serialize = function(a) {
  if(typeof XMLSerializer != "undefined") {
    return(new XMLSerializer).serializeToString(a)
  }
  if(a = a.xml) {
    return a
  }
  throw Error("Your browser does not support serializing XML documents");
};
goog.dom.xml.selectSingleNode = function(a, b) {
  if(typeof a.selectSingleNode != "undefined") {
    var c = goog.dom.getOwnerDocument(a);
    typeof c.setProperty != "undefined" && c.setProperty("SelectionLanguage", "XPath");
    return a.selectSingleNode(b)
  }else {
    if(document.implementation.hasFeature("XPath", "3.0")) {
      c = goog.dom.getOwnerDocument(a);
      var d = c.createNSResolver(c.documentElement);
      return c.evaluate(b, a, d, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue
    }
  }
  return null
};
goog.dom.xml.selectNodes = function(a, b) {
  if(typeof a.selectNodes != "undefined") {
    var c = goog.dom.getOwnerDocument(a);
    typeof c.setProperty != "undefined" && c.setProperty("SelectionLanguage", "XPath");
    return a.selectNodes(b)
  }else {
    if(document.implementation.hasFeature("XPath", "3.0")) {
      c = goog.dom.getOwnerDocument(a);
      var d = c.createNSResolver(c.documentElement);
      c = c.evaluate(b, a, d, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
      d = [];
      var e = c.snapshotLength;
      for(var f = 0;f < e;f++) {
        d.push(c.snapshotItem(f))
      }
      return d
    }else {
      return[]
    }
  }
};
goog.dom.xml.createMsXmlDocument_ = function() {
  var a = new ActiveXObject("MSXML2.DOMDocument");
  if(a) {
    a.resolveExternals = false;
    a.validateOnParse = false;
    try {
      a.setProperty("ProhibitDTD", true);
      a.setProperty("MaxXMLSize", goog.dom.xml.MAX_XML_SIZE_KB);
      a.setProperty("MaxElementDepth", goog.dom.xml.MAX_ELEMENT_DEPTH)
    }catch(b) {
    }
  }
  return a
};bot.locators = {};
bot.locators.xpath = {};
bot.locators.xpath.single = function(a, b) {
  try {
    var c = goog.dom.xml.selectSingleNode(b, a)
  }catch(d) {
    return null
  }
  if(!c) {
    return null
  }
  if(c.nodeType != goog.dom.NodeType.ELEMENT) {
    throw Error("Returned node is not an element: " + a);
  }
  return c
};
bot.locators.xpath.many = function(a, b) {
  var c = goog.dom.xml.selectNodes(b, a);
  goog.array.forEach(c, function(d) {
    if(d.nodeType != goog.dom.NodeType.ELEMENT) {
      throw Error("Returned nodes must be elements: " + a);
    }
  });
  return c
};goog.iter = {};
goog.iter.StopIteration = "StopIteration" in goog.global ? goog.global.StopIteration : Error("StopIteration");
goog.iter.Iterator = function() {
};
goog.iter.Iterator.prototype.next = function() {
  throw goog.iter.StopIteration;
};
goog.iter.Iterator.prototype.__iterator__ = function() {
  return this
};
goog.iter.toIterator = function(a) {
  if(a instanceof goog.iter.Iterator) {
    return a
  }
  if(typeof a.__iterator__ == "function") {
    return a.__iterator__(false)
  }
  if(goog.isArrayLike(a)) {
    var b = 0, c = new goog.iter.Iterator;
    c.next = function() {
      for(;;) {
        if(b >= a.length) {
          throw goog.iter.StopIteration;
        }
        if(b in a) {
          return a[b++]
        }else {
          b++
        }
      }
    };
    return c
  }
  throw Error("Not implemented");
};
goog.iter.forEach = function(a, b, c) {
  if(goog.isArrayLike(a)) {
    try {
      goog.array.forEach(a, b, c)
    }catch(d) {
      if(d !== goog.iter.StopIteration) {
        throw d;
      }
    }
  }else {
    a = goog.iter.toIterator(a);
    try {
      for(;;) {
        b.call(c, a.next(), undefined, a)
      }
    }catch(e) {
      if(e !== goog.iter.StopIteration) {
        throw e;
      }
    }
  }
};
goog.iter.filter = function(a, b, c) {
  a = goog.iter.toIterator(a);
  var d = new goog.iter.Iterator;
  d.next = function() {
    for(;;) {
      var e = a.next();
      if(b.call(c, e, undefined, a)) {
        return e
      }
    }
  };
  return d
};
goog.iter.range = function(a, b, c) {
  var d = 0, e = a, f = c || 1;
  if(arguments.length > 1) {
    d = a;
    e = b
  }
  if(f == 0) {
    throw Error("Range step argument must not be zero");
  }
  var g = new goog.iter.Iterator;
  g.next = function() {
    if(f > 0 && d >= e || f < 0 && d <= e) {
      throw goog.iter.StopIteration;
    }
    var h = d;
    d += f;
    return h
  };
  return g
};
goog.iter.join = function(a, b) {
  return goog.iter.toArray(a).join(b)
};
goog.iter.map = function(a, b, c) {
  a = goog.iter.toIterator(a);
  var d = new goog.iter.Iterator;
  d.next = function() {
    for(;;) {
      var e = a.next();
      return b.call(c, e, undefined, a)
    }
  };
  return d
};
goog.iter.reduce = function(a, b, c, d) {
  var e = c;
  goog.iter.forEach(a, function(f) {
    e = b.call(d, e, f)
  });
  return e
};
goog.iter.some = function(a, b, c) {
  a = goog.iter.toIterator(a);
  try {
    for(;;) {
      if(b.call(c, a.next(), undefined, a)) {
        return true
      }
    }
  }catch(d) {
    if(d !== goog.iter.StopIteration) {
      throw d;
    }
  }
  return false
};
goog.iter.every = function(a, b, c) {
  a = goog.iter.toIterator(a);
  try {
    for(;;) {
      if(!b.call(c, a.next(), undefined, a)) {
        return false
      }
    }
  }catch(d) {
    if(d !== goog.iter.StopIteration) {
      throw d;
    }
  }
  return true
};
goog.iter.chain = function() {
  var a = arguments, b = a.length, c = 0, d = new goog.iter.Iterator;
  d.next = function() {
    try {
      if(c >= b) {
        throw goog.iter.StopIteration;
      }
      return goog.iter.toIterator(a[c]).next()
    }catch(e) {
      if(e !== goog.iter.StopIteration || c >= b) {
        throw e;
      }else {
        c++;
        return this.next()
      }
    }
  };
  return d
};
goog.iter.dropWhile = function(a, b, c) {
  a = goog.iter.toIterator(a);
  var d = new goog.iter.Iterator, e = true;
  d.next = function() {
    for(;;) {
      var f = a.next();
      if(!(e && b.call(c, f, undefined, a))) {
        e = false;
        return f
      }
    }
  };
  return d
};
goog.iter.takeWhile = function(a, b, c) {
  a = goog.iter.toIterator(a);
  var d = new goog.iter.Iterator, e = true;
  d.next = function() {
    for(;;) {
      if(e) {
        var f = a.next();
        if(b.call(c, f, undefined, a)) {
          return f
        }else {
          e = false
        }
      }else {
        throw goog.iter.StopIteration;
      }
    }
  };
  return d
};
goog.iter.toArray = function(a) {
  if(goog.isArrayLike(a)) {
    return goog.array.toArray(a)
  }
  a = goog.iter.toIterator(a);
  var b = [];
  goog.iter.forEach(a, function(c) {
    b.push(c)
  });
  return b
};
goog.iter.equals = function(a, b) {
  a = goog.iter.toIterator(a);
  b = goog.iter.toIterator(b);
  var c, d;
  try {
    for(;;) {
      c = d = false;
      var e = a.next();
      c = true;
      var f = b.next();
      d = true;
      if(e != f) {
        return false
      }
    }
  }catch(g) {
    if(g !== goog.iter.StopIteration) {
      throw g;
    }else {
      if(c && !d) {
        return false
      }
      if(!d) {
        try {
          b.next();
          return false
        }catch(h) {
          if(h !== goog.iter.StopIteration) {
            throw h;
          }
          return true
        }
      }
    }
  }
  return false
};
goog.iter.nextOrValue = function(a, b) {
  try {
    return goog.iter.toIterator(a).next()
  }catch(c) {
    if(c != goog.iter.StopIteration) {
      throw c;
    }
    return b
  }
};
goog.iter.product = function() {
  if(goog.array.some(arguments, function(d) {
    return!d.length
  }) || !arguments.length) {
    return new goog.iter.Iterator
  }
  var a = new goog.iter.Iterator, b = arguments, c = goog.array.repeat(0, b.length);
  a.next = function() {
    if(c) {
      var d = goog.array.map(c, function(f, g) {
        return b[g][f]
      });
      for(var e = c.length - 1;e >= 0;e--) {
        goog.asserts.assert(c);
        if(c[e] < b[e].length - 1) {
          c[e]++;
          break
        }
        if(e == 0) {
          c = null;
          break
        }
        c[e] = 0
      }
      return d
    }
    throw goog.iter.StopIteration;
  };
  return a
};goog.dom.TagWalkType = {START_TAG:1, OTHER:0, END_TAG:-1};
goog.dom.TagIterator = function(a, b, c, d, e) {
  this.reversed = !!b;
  a && this.setPosition(a, d);
  this.depth = e != undefined ? e : this.tagType || 0;
  if(this.reversed) {
    this.depth *= -1
  }
  this.constrained = !c
};
goog.inherits(goog.dom.TagIterator, goog.iter.Iterator);
goog.dom.TagIterator.prototype.node = null;
goog.dom.TagIterator.prototype.tagType = goog.dom.TagWalkType.OTHER;
goog.dom.TagIterator.prototype.started_ = false;
goog.dom.TagIterator.prototype.setPosition = function(a, b, c) {
  if(this.node = a) {
    this.tagType = goog.isNumber(b) ? b : this.node.nodeType != goog.dom.NodeType.ELEMENT ? goog.dom.TagWalkType.OTHER : this.reversed ? goog.dom.TagWalkType.END_TAG : goog.dom.TagWalkType.START_TAG
  }
  if(goog.isNumber(c)) {
    this.depth = c
  }
};
goog.dom.TagIterator.prototype.copyFrom = function(a) {
  this.node = a.node;
  this.tagType = a.tagType;
  this.depth = a.depth;
  this.reversed = a.reversed;
  this.constrained = a.constrained
};
goog.dom.TagIterator.prototype.clone = function() {
  return new goog.dom.TagIterator(this.node, this.reversed, !this.constrained, this.tagType, this.depth)
};
goog.dom.TagIterator.prototype.skipTag = function() {
  var a = this.reversed ? goog.dom.TagWalkType.END_TAG : goog.dom.TagWalkType.START_TAG;
  if(this.tagType == a) {
    this.tagType = a * -1;
    this.depth += this.tagType * (this.reversed ? -1 : 1)
  }
};
goog.dom.TagIterator.prototype.restartTag = function() {
  var a = this.reversed ? goog.dom.TagWalkType.START_TAG : goog.dom.TagWalkType.END_TAG;
  if(this.tagType == a) {
    this.tagType = a * -1;
    this.depth += this.tagType * (this.reversed ? -1 : 1)
  }
};
goog.dom.TagIterator.prototype.next = function() {
  var a;
  if(this.started_) {
    if(!this.node || this.constrained && this.depth == 0) {
      throw goog.iter.StopIteration;
    }
    a = this.node;
    var b = this.reversed ? goog.dom.TagWalkType.END_TAG : goog.dom.TagWalkType.START_TAG;
    if(this.tagType == b) {
      var c = this.reversed ? a.lastChild : a.firstChild;
      c ? this.setPosition(c) : this.setPosition(a, b * -1)
    }else {
      (c = this.reversed ? a.previousSibling : a.nextSibling) ? this.setPosition(c) : this.setPosition(a.parentNode, b * -1)
    }
    this.depth += this.tagType * (this.reversed ? -1 : 1)
  }else {
    this.started_ = true
  }
  a = this.node;
  if(!this.node) {
    throw goog.iter.StopIteration;
  }
  return a
};
goog.dom.TagIterator.prototype.isStarted = function() {
  return this.started_
};
goog.dom.TagIterator.prototype.isStartTag = function() {
  return this.tagType == goog.dom.TagWalkType.START_TAG
};
goog.dom.TagIterator.prototype.isEndTag = function() {
  return this.tagType == goog.dom.TagWalkType.END_TAG
};
goog.dom.TagIterator.prototype.isNonElement = function() {
  return this.tagType == goog.dom.TagWalkType.OTHER
};
goog.dom.TagIterator.prototype.equals = function(a) {
  return a.node == this.node && (!this.node || a.tagType == this.tagType)
};
goog.dom.TagIterator.prototype.splice = function() {
  var a = this.node;
  this.restartTag();
  this.reversed = !this.reversed;
  goog.dom.TagIterator.prototype.next.call(this);
  this.reversed = !this.reversed;
  var b = goog.isArrayLike(arguments[0]) ? arguments[0] : arguments;
  for(var c = b.length - 1;c >= 0;c--) {
    goog.dom.insertSiblingAfter(b[c], a)
  }
  goog.dom.removeNode(a)
};goog.dom.NodeIterator = function(a, b, c, d) {
  goog.dom.TagIterator.call(this, a, b, c, null, d)
};
goog.inherits(goog.dom.NodeIterator, goog.dom.TagIterator);
goog.dom.NodeIterator.prototype.next = function() {
  do {
    goog.dom.NodeIterator.superClass_.next.call(this)
  }while(this.isEndTag());
  return this.node
};goog.math.Box = function(a, b, c, d) {
  this.top = a;
  this.right = b;
  this.bottom = c;
  this.left = d
};
goog.math.Box.boundingBox = function() {
  var a = new goog.math.Box(arguments[0].y, arguments[0].x, arguments[0].y, arguments[0].x);
  for(var b = 1;b < arguments.length;b++) {
    var c = arguments[b];
    a.top = Math.min(a.top, c.y);
    a.right = Math.max(a.right, c.x);
    a.bottom = Math.max(a.bottom, c.y);
    a.left = Math.min(a.left, c.x)
  }
  return a
};
goog.math.Box.prototype.clone = function() {
  return new goog.math.Box(this.top, this.right, this.bottom, this.left)
};
if(goog.DEBUG) {
  goog.math.Box.prototype.toString = function() {
    return"(" + this.top + "t, " + this.right + "r, " + this.bottom + "b, " + this.left + "l)"
  }
}
goog.math.Box.prototype.contains = function(a) {
  return goog.math.Box.contains(this, a)
};
goog.math.Box.prototype.expand = function(a, b, c, d) {
  if(goog.isObject(a)) {
    this.top -= a.top;
    this.right += a.right;
    this.bottom += a.bottom;
    this.left -= a.left
  }else {
    this.top -= a;
    this.right += b;
    this.bottom += c;
    this.left -= d
  }
  return this
};
goog.math.Box.prototype.expandToInclude = function(a) {
  this.left = Math.min(this.left, a.left);
  this.top = Math.min(this.top, a.top);
  this.right = Math.max(this.right, a.right);
  this.bottom = Math.max(this.bottom, a.bottom)
};
goog.math.Box.equals = function(a, b) {
  if(a == b) {
    return true
  }
  if(!a || !b) {
    return false
  }
  return a.top == b.top && a.right == b.right && a.bottom == b.bottom && a.left == b.left
};
goog.math.Box.contains = function(a, b) {
  if(!a || !b) {
    return false
  }
  if(b instanceof goog.math.Box) {
    return b.left >= a.left && b.right <= a.right && b.top >= a.top && b.bottom <= a.bottom
  }
  return b.x >= a.left && b.x <= a.right && b.y >= a.top && b.y <= a.bottom
};
goog.math.Box.distance = function(a, b) {
  if(b.x >= a.left && b.x <= a.right) {
    if(b.y >= a.top && b.y <= a.bottom) {
      return 0
    }
    return b.y < a.top ? a.top - b.y : b.y - a.bottom
  }
  if(b.y >= a.top && b.y <= a.bottom) {
    return b.x < a.left ? a.left - b.x : b.x - a.right
  }
  return goog.math.Coordinate.distance(b, new goog.math.Coordinate(b.x < a.left ? a.left : a.right, b.y < a.top ? a.top : a.bottom))
};
goog.math.Box.intersects = function(a, b) {
  return a.left <= b.right && b.left <= a.right && a.top <= b.bottom && b.top <= a.bottom
};goog.math.Rect = function(a, b, c, d) {
  this.left = a;
  this.top = b;
  this.width = c;
  this.height = d
};
goog.math.Rect.prototype.clone = function() {
  return new goog.math.Rect(this.left, this.top, this.width, this.height)
};
goog.math.Rect.prototype.toBox = function() {
  return new goog.math.Box(this.top, this.left + this.width, this.top + this.height, this.left)
};
goog.math.Rect.createFromBox = function(a) {
  return new goog.math.Rect(a.left, a.top, a.right - a.left, a.bottom - a.top)
};
if(goog.DEBUG) {
  goog.math.Rect.prototype.toString = function() {
    return"(" + this.left + ", " + this.top + " - " + this.width + "w x " + this.height + "h)"
  }
}
goog.math.Rect.equals = function(a, b) {
  if(a == b) {
    return true
  }
  if(!a || !b) {
    return false
  }
  return a.left == b.left && a.width == b.width && a.top == b.top && a.height == b.height
};
goog.math.Rect.prototype.intersection = function(a) {
  var b = Math.max(this.left, a.left), c = Math.min(this.left + this.width, a.left + a.width);
  if(b <= c) {
    var d = Math.max(this.top, a.top);
    a = Math.min(this.top + this.height, a.top + a.height);
    if(d <= a) {
      this.left = b;
      this.top = d;
      this.width = c - b;
      this.height = a - d;
      return true
    }
  }
  return false
};
goog.math.Rect.intersection = function(a, b) {
  var c = Math.max(a.left, b.left), d = Math.min(a.left + a.width, b.left + b.width);
  if(c <= d) {
    var e = Math.max(a.top, b.top), f = Math.min(a.top + a.height, b.top + b.height);
    if(e <= f) {
      return new goog.math.Rect(c, e, d - c, f - e)
    }
  }
  return null
};
goog.math.Rect.intersects = function(a, b) {
  return a.left <= b.left + b.width && b.left <= a.left + a.width && a.top <= b.top + b.height && b.top <= a.top + a.height
};
goog.math.Rect.prototype.intersects = function(a) {
  return goog.math.Rect.intersects(this, a)
};
goog.math.Rect.difference = function(a, b) {
  var c = goog.math.Rect.intersection(a, b);
  if(!c || !c.height || !c.width) {
    return[a.clone()]
  }
  c = [];
  var d = a.top, e = a.height, f = a.left + a.width, g = a.top + a.height, h = b.left + b.width, i = b.top + b.height;
  if(b.top > a.top) {
    c.push(new goog.math.Rect(a.left, a.top, a.width, b.top - a.top));
    d = b.top;
    e -= b.top - a.top
  }
  if(i < g) {
    c.push(new goog.math.Rect(a.left, i, a.width, g - i));
    e = i - d
  }
  b.left > a.left && c.push(new goog.math.Rect(a.left, d, b.left - a.left, e));
  h < f && c.push(new goog.math.Rect(h, d, f - h, e));
  return c
};
goog.math.Rect.prototype.difference = function(a) {
  return goog.math.Rect.difference(this, a)
};
goog.math.Rect.prototype.boundingRect = function(a) {
  var b = Math.max(this.left + this.width, a.left + a.width), c = Math.max(this.top + this.height, a.top + a.height);
  this.left = Math.min(this.left, a.left);
  this.top = Math.min(this.top, a.top);
  this.width = b - this.left;
  this.height = c - this.top
};
goog.math.Rect.boundingRect = function(a, b) {
  if(!a || !b) {
    return null
  }
  var c = a.clone();
  c.boundingRect(b);
  return c
};
goog.math.Rect.prototype.contains = function(a) {
  return a instanceof goog.math.Rect ? this.left <= a.left && this.left + this.width >= a.left + a.width && this.top <= a.top && this.top + this.height >= a.top + a.height : a.x >= this.left && a.x <= this.left + this.width && a.y >= this.top && a.y <= this.top + this.height
};
goog.math.Rect.prototype.getSize = function() {
  return new goog.math.Size(this.width, this.height)
};goog.style = {};
goog.style.setStyle = function(a, b, c) {
  goog.isString(b) ? goog.style.setStyle_(a, c, b) : goog.object.forEach(b, goog.partial(goog.style.setStyle_, a))
};
goog.style.setStyle_ = function(a, b, c) {
  a.style[goog.string.toCamelCase(c)] = b
};
goog.style.getStyle = function(a, b) {
  return a.style[goog.string.toCamelCase(b)] || ""
};
goog.style.getComputedStyle = function(a, b) {
  var c = goog.dom.getOwnerDocument(a);
  if(c.defaultView && c.defaultView.getComputedStyle) {
    if(c = c.defaultView.getComputedStyle(a, null)) {
      return c[b] || c.getPropertyValue(b)
    }
  }
  return""
};
goog.style.getCascadedStyle = function(a, b) {
  return a.currentStyle ? a.currentStyle[b] : null
};
goog.style.getStyle_ = function(a, b) {
  return goog.style.getComputedStyle(a, b) || goog.style.getCascadedStyle(a, b) || a.style[b]
};
goog.style.getComputedPosition = function(a) {
  return goog.style.getStyle_(a, "position")
};
goog.style.getBackgroundColor = function(a) {
  return goog.style.getStyle_(a, "backgroundColor")
};
goog.style.getComputedOverflowX = function(a) {
  return goog.style.getStyle_(a, "overflowX")
};
goog.style.getComputedOverflowY = function(a) {
  return goog.style.getStyle_(a, "overflowY")
};
goog.style.getComputedZIndex = function(a) {
  return goog.style.getStyle_(a, "zIndex")
};
goog.style.getComputedTextAlign = function(a) {
  return goog.style.getStyle_(a, "textAlign")
};
goog.style.getComputedCursor = function(a) {
  return goog.style.getStyle_(a, "cursor")
};
goog.style.setPosition = function(a, b, c) {
  var d, e = goog.userAgent.GECKO && (goog.userAgent.MAC || goog.userAgent.X11) && goog.userAgent.isVersion("1.9");
  if(b instanceof goog.math.Coordinate) {
    d = b.x;
    b = b.y
  }else {
    d = b;
    b = c
  }
  a.style.left = goog.style.getPixelStyleValue_(d, e);
  a.style.top = goog.style.getPixelStyleValue_(b, e)
};
goog.style.getPosition = function(a) {
  return new goog.math.Coordinate(a.offsetLeft, a.offsetTop)
};
goog.style.getClientViewportElement = function(a) {
  a = a ? a.nodeType == goog.dom.NodeType.DOCUMENT ? a : goog.dom.getOwnerDocument(a) : goog.dom.getDocument();
  if(goog.userAgent.IE && !goog.dom.getDomHelper(a).isCss1CompatMode()) {
    return a.body
  }
  return a.documentElement
};
goog.style.getBoundingClientRect_ = function(a) {
  var b = a.getBoundingClientRect();
  if(goog.userAgent.IE) {
    a = a.ownerDocument;
    b.left -= a.documentElement.clientLeft + a.body.clientLeft;
    b.top -= a.documentElement.clientTop + a.body.clientTop
  }
  return b
};
goog.style.getOffsetParent = function(a) {
  if(goog.userAgent.IE) {
    return a.offsetParent
  }
  var b = goog.dom.getOwnerDocument(a), c = goog.style.getStyle_(a, "position"), d = c == "fixed" || c == "absolute";
  for(a = a.parentNode;a && a != b;a = a.parentNode) {
    c = goog.style.getStyle_(a, "position");
    d = d && c == "static" && a != b.documentElement && a != b.body;
    if(!d && (a.scrollWidth > a.clientWidth || a.scrollHeight > a.clientHeight || c == "fixed" || c == "absolute")) {
      return a
    }
  }
  return null
};
goog.style.getVisibleRectForElement = function(a) {
  var b = new goog.math.Box(0, Infinity, Infinity, 0), c = goog.dom.getDomHelper(a), d = c.getDocument().body, e = c.getDocumentScrollElement(), f;
  for(a = a;a = goog.style.getOffsetParent(a);) {
    if((!goog.userAgent.IE || a.clientWidth != 0) && (!goog.userAgent.WEBKIT || a.clientHeight != 0 || a != d) && (a.scrollWidth != a.clientWidth || a.scrollHeight != a.clientHeight) && goog.style.getStyle_(a, "overflow") != "visible") {
      var g = goog.style.getPageOffset(a), h = goog.style.getClientLeftTop(a);
      g.x += h.x;
      g.y += h.y;
      b.top = Math.max(b.top, g.y);
      b.right = Math.min(b.right, g.x + a.clientWidth);
      b.bottom = Math.min(b.bottom, g.y + a.clientHeight);
      b.left = Math.max(b.left, g.x);
      f = f || a != e
    }
  }
  d = e.scrollLeft;
  e = e.scrollTop;
  if(goog.userAgent.WEBKIT) {
    b.left += d;
    b.top += e
  }else {
    b.left = Math.max(b.left, d);
    b.top = Math.max(b.top, e)
  }
  if(!f || goog.userAgent.WEBKIT) {
    b.right += d;
    b.bottom += e
  }
  c = c.getViewportSize();
  b.right = Math.min(b.right, d + c.width);
  b.bottom = Math.min(b.bottom, e + c.height);
  return b.top >= 0 && b.left >= 0 && b.bottom > b.top && b.right > b.left ? b : null
};
goog.style.scrollIntoContainerView = function(a, b, c) {
  var d = goog.style.getPageOffset(a), e = goog.style.getPageOffset(b), f = goog.style.getBorderBox(b), g = d.x - e.x - f.left;
  d = d.y - e.y - f.top;
  e = b.clientWidth - a.offsetWidth;
  a = b.clientHeight - a.offsetHeight;
  if(c) {
    b.scrollLeft += g - e / 2;
    b.scrollTop += d - a / 2
  }else {
    b.scrollLeft += Math.min(g, Math.max(g - e, 0));
    b.scrollTop += Math.min(d, Math.max(d - a, 0))
  }
};
goog.style.getClientLeftTop = function(a) {
  if(goog.userAgent.GECKO && !goog.userAgent.isVersion("1.9")) {
    var b = parseFloat(goog.style.getComputedStyle(a, "borderLeftWidth"));
    if(goog.style.isRightToLeft(a)) {
      var c = a.offsetWidth - a.clientWidth - b - parseFloat(goog.style.getComputedStyle(a, "borderRightWidth"));
      b += c
    }
    return new goog.math.Coordinate(b, parseFloat(goog.style.getComputedStyle(a, "borderTopWidth")))
  }
  return new goog.math.Coordinate(a.clientLeft, a.clientTop)
};
goog.style.getPageOffset = function(a) {
  var b, c = goog.dom.getOwnerDocument(a), d = goog.style.getStyle_(a, "position"), e = goog.userAgent.GECKO && c.getBoxObjectFor && !a.getBoundingClientRect && d == "absolute" && (b = c.getBoxObjectFor(a)) && (b.screenX < 0 || b.screenY < 0), f = new goog.math.Coordinate(0, 0), g = goog.style.getClientViewportElement(c);
  if(a == g) {
    return f
  }
  if(a.getBoundingClientRect) {
    b = goog.style.getBoundingClientRect_(a);
    a = goog.dom.getDomHelper(c).getDocumentScroll();
    f.x = b.left + a.x;
    f.y = b.top + a.y
  }else {
    if(c.getBoxObjectFor && !e) {
      b = c.getBoxObjectFor(a);
      a = c.getBoxObjectFor(g);
      f.x = b.screenX - a.screenX;
      f.y = b.screenY - a.screenY
    }else {
      b = a;
      do {
        f.x += b.offsetLeft;
        f.y += b.offsetTop;
        if(b != a) {
          f.x += b.clientLeft || 0;
          f.y += b.clientTop || 0
        }
        if(goog.userAgent.WEBKIT && goog.style.getComputedPosition(b) == "fixed") {
          f.x += c.body.scrollLeft;
          f.y += c.body.scrollTop;
          break
        }
        b = b.offsetParent
      }while(b && b != a);
      if(goog.userAgent.OPERA || goog.userAgent.WEBKIT && d == "absolute") {
        f.y -= c.body.offsetTop
      }
      for(b = a;(b = goog.style.getOffsetParent(b)) && b != c.body && b != g;) {
        f.x -= b.scrollLeft;
        if(!goog.userAgent.OPERA || b.tagName != "TR") {
          f.y -= b.scrollTop
        }
      }
    }
  }
  return f
};
goog.style.getPageOffsetLeft = function(a) {
  return goog.style.getPageOffset(a).x
};
goog.style.getPageOffsetTop = function(a) {
  return goog.style.getPageOffset(a).y
};
goog.style.getFramedPageOffset = function(a, b) {
  var c = new goog.math.Coordinate(0, 0), d = goog.dom.getWindow(goog.dom.getOwnerDocument(a)), e = a;
  do {
    var f = d == b ? goog.style.getPageOffset(e) : goog.style.getClientPosition(e);
    c.x += f.x;
    c.y += f.y
  }while(d && d != b && (e = d.frameElement) && (d = d.parent));
  return c
};
goog.style.translateRectForAnotherFrame = function(a, b, c) {
  if(b.getDocument() != c.getDocument()) {
    var d = b.getDocument().body;
    c = goog.style.getFramedPageOffset(d, c.getWindow());
    c = goog.math.Coordinate.difference(c, goog.style.getPageOffset(d));
    if(goog.userAgent.IE && !b.isCss1CompatMode()) {
      c = goog.math.Coordinate.difference(c, b.getDocumentScroll())
    }
    a.left += c.x;
    a.top += c.y
  }
};
goog.style.getRelativePosition = function(a, b) {
  var c = goog.style.getClientPosition(a), d = goog.style.getClientPosition(b);
  return new goog.math.Coordinate(c.x - d.x, c.y - d.y)
};
goog.style.getClientPosition = function(a) {
  var b = new goog.math.Coordinate;
  if(a.nodeType == goog.dom.NodeType.ELEMENT) {
    if(a.getBoundingClientRect) {
      a = goog.style.getBoundingClientRect_(a);
      b.x = a.left;
      b.y = a.top
    }else {
      var c = goog.dom.getDomHelper(a).getDocumentScroll();
      a = goog.style.getPageOffset(a);
      b.x = a.x - c.x;
      b.y = a.y - c.y
    }
  }else {
    c = goog.isFunction(a.getBrowserEvent);
    var d = a;
    if(a.targetTouches) {
      d = a.targetTouches[0]
    }else {
      if(c && a.getBrowserEvent().targetTouches) {
        d = a.getBrowserEvent().targetTouches[0]
      }
    }
    b.x = d.clientX;
    b.y = d.clientY
  }
  return b
};
goog.style.setPageOffset = function(a, b, c) {
  var d = goog.style.getPageOffset(a);
  if(b instanceof goog.math.Coordinate) {
    c = b.y;
    b = b.x
  }
  goog.style.setPosition(a, a.offsetLeft + (b - d.x), a.offsetTop + (c - d.y))
};
goog.style.setSize = function(a, b, c) {
  if(b instanceof goog.math.Size) {
    c = b.height;
    b = b.width
  }else {
    if(c == undefined) {
      throw Error("missing height argument");
    }
    c = c
  }
  goog.style.setWidth(a, b);
  goog.style.setHeight(a, c)
};
goog.style.getPixelStyleValue_ = function(a, b) {
  if(typeof a == "number") {
    a = (b ? Math.round(a) : a) + "px"
  }
  return a
};
goog.style.setHeight = function(a, b) {
  a.style.height = goog.style.getPixelStyleValue_(b, true)
};
goog.style.setWidth = function(a, b) {
  a.style.width = goog.style.getPixelStyleValue_(b, true)
};
goog.style.getSize = function(a) {
  var b = goog.userAgent.OPERA && !goog.userAgent.isVersion("10");
  if(goog.style.getStyle_(a, "display") != "none") {
    return b ? new goog.math.Size(a.offsetWidth || a.clientWidth, a.offsetHeight || a.clientHeight) : new goog.math.Size(a.offsetWidth, a.offsetHeight)
  }
  var c = a.style, d = c.display, e = c.visibility, f = c.position;
  c.visibility = "hidden";
  c.position = "absolute";
  c.display = "inline";
  if(b) {
    b = a.offsetWidth || a.clientWidth;
    a = a.offsetHeight || a.clientHeight
  }else {
    b = a.offsetWidth;
    a = a.offsetHeight
  }
  c.display = d;
  c.position = f;
  c.visibility = e;
  return new goog.math.Size(b, a)
};
goog.style.getBounds = function(a) {
  var b = goog.style.getPageOffset(a);
  a = goog.style.getSize(a);
  return new goog.math.Rect(b.x, b.y, a.width, a.height)
};
goog.style.toCamelCase = function(a) {
  return goog.string.toCamelCase(String(a))
};
goog.style.toSelectorCase = function(a) {
  return goog.string.toSelectorCase(a)
};
goog.style.getOpacity = function(a) {
  var b = a.style;
  a = "";
  if("opacity" in b) {
    a = b.opacity
  }else {
    if("MozOpacity" in b) {
      a = b.MozOpacity
    }else {
      if("filter" in b) {
        if(b = b.filter.match(/alpha\(opacity=([\d.]+)\)/)) {
          a = String(b[1] / 100)
        }
      }
    }
  }
  return a == "" ? a : Number(a)
};
goog.style.setOpacity = function(a, b) {
  var c = a.style;
  if("opacity" in c) {
    c.opacity = b
  }else {
    if("MozOpacity" in c) {
      c.MozOpacity = b
    }else {
      if("filter" in c) {
        c.filter = b === "" ? "" : "alpha(opacity=" + b * 100 + ")"
      }
    }
  }
};
goog.style.setTransparentBackgroundImage = function(a, b) {
  var c = a.style;
  if(goog.userAgent.IE && !goog.userAgent.isVersion("8")) {
    c.filter = 'progid:DXImageTransform.Microsoft.AlphaImageLoader(src="' + b + '", sizingMethod="crop")'
  }else {
    c.backgroundImage = "url(" + b + ")";
    c.backgroundPosition = "top left";
    c.backgroundRepeat = "no-repeat"
  }
};
goog.style.clearTransparentBackgroundImage = function(a) {
  a = a.style;
  if("filter" in a) {
    a.filter = ""
  }else {
    a.backgroundImage = "none"
  }
};
goog.style.showElement = function(a, b) {
  a.style.display = b ? "" : "none"
};
goog.style.isElementShown = function(a) {
  return a.style.display != "none"
};
goog.style.installStyles = function(a, b) {
  var c = goog.dom.getDomHelper(b), d = null;
  if(goog.userAgent.IE) {
    d = c.getDocument().createStyleSheet();
    goog.style.setStyles(d, a)
  }else {
    var e = c.getElementsByTagNameAndClass("head")[0];
    if(!e) {
      d = c.getElementsByTagNameAndClass("body")[0];
      e = c.createDom("head");
      d.parentNode.insertBefore(e, d)
    }
    d = c.createDom("style");
    goog.style.setStyles(d, a);
    c.appendChild(e, d)
  }
  return d
};
goog.style.uninstallStyles = function(a) {
  goog.dom.removeNode(a.ownerNode || a.owningElement || a)
};
goog.style.setStyles = function(a, b) {
  if(goog.userAgent.IE) {
    a.cssText = b
  }else {
    a[goog.userAgent.WEBKIT ? "innerText" : "innerHTML"] = b
  }
};
goog.style.setPreWrap = function(a) {
  a = a.style;
  if(goog.userAgent.IE && !goog.userAgent.isVersion("8")) {
    a.whiteSpace = "pre";
    a.wordWrap = "break-word"
  }else {
    a.whiteSpace = goog.userAgent.GECKO ? "-moz-pre-wrap" : goog.userAgent.OPERA ? "-o-pre-wrap" : "pre-wrap"
  }
};
goog.style.setInlineBlock = function(a) {
  a = a.style;
  a.position = "relative";
  if(goog.userAgent.IE && !goog.userAgent.isVersion("8")) {
    a.zoom = "1";
    a.display = "inline"
  }else {
    a.display = goog.userAgent.GECKO ? goog.userAgent.isVersion("1.9a") ? "inline-block" : "-moz-inline-box" : "inline-block"
  }
};
goog.style.isRightToLeft = function(a) {
  return"rtl" == goog.style.getStyle_(a, "direction")
};
goog.style.unselectableStyle_ = goog.userAgent.GECKO ? "MozUserSelect" : goog.userAgent.WEBKIT ? "WebkitUserSelect" : null;
goog.style.isUnselectable = function(a) {
  if(goog.style.unselectableStyle_) {
    return a.style[goog.style.unselectableStyle_].toLowerCase() == "none"
  }else {
    if(goog.userAgent.IE || goog.userAgent.OPERA) {
      return a.getAttribute("unselectable") == "on"
    }
  }
  return false
};
goog.style.setUnselectable = function(a, b, c) {
  c = !c ? a.getElementsByTagName("*") : null;
  var d = goog.style.unselectableStyle_;
  if(d) {
    b = b ? "none" : "";
    a.style[d] = b;
    if(c) {
      a = 0;
      for(var e;e = c[a];a++) {
        e.style[d] = b
      }
    }
  }else {
    if(goog.userAgent.IE || goog.userAgent.OPERA) {
      b = b ? "on" : "";
      a.setAttribute("unselectable", b);
      if(c) {
        for(a = 0;e = c[a];a++) {
          e.setAttribute("unselectable", b)
        }
      }
    }
  }
};
goog.style.getBorderBoxSize = function(a) {
  return new goog.math.Size(a.offsetWidth, a.offsetHeight)
};
goog.style.setBorderBoxSize = function(a, b) {
  var c = goog.dom.getOwnerDocument(a), d = goog.dom.getDomHelper(c).isCss1CompatMode();
  if(goog.userAgent.IE && (!d || !goog.userAgent.isVersion("8"))) {
    c = a.style;
    if(d) {
      d = goog.style.getPaddingBox(a);
      var e = goog.style.getBorderBox(a);
      c.pixelWidth = b.width - e.left - d.left - d.right - e.right;
      c.pixelHeight = b.height - e.top - d.top - d.bottom - e.bottom
    }else {
      c.pixelWidth = b.width;
      c.pixelHeight = b.height
    }
  }else {
    goog.style.setBoxSizingSize_(a, b, "border-box")
  }
};
goog.style.getContentBoxSize = function(a) {
  var b = goog.dom.getOwnerDocument(a), c = goog.userAgent.IE && a.currentStyle;
  if(c && goog.dom.getDomHelper(b).isCss1CompatMode() && c.width != "auto" && c.height != "auto" && !c.boxSizing) {
    b = goog.style.getIePixelValue_(a, c.width, "width", "pixelWidth");
    a = goog.style.getIePixelValue_(a, c.height, "height", "pixelHeight");
    return new goog.math.Size(b, a)
  }else {
    c = goog.style.getBorderBoxSize(a);
    b = goog.style.getPaddingBox(a);
    a = goog.style.getBorderBox(a);
    return new goog.math.Size(c.width - a.left - b.left - b.right - a.right, c.height - a.top - b.top - b.bottom - a.bottom)
  }
};
goog.style.setContentBoxSize = function(a, b) {
  var c = goog.dom.getOwnerDocument(a), d = goog.dom.getDomHelper(c).isCss1CompatMode();
  if(goog.userAgent.IE && (!d || !goog.userAgent.isVersion("8"))) {
    c = a.style;
    if(d) {
      c.pixelWidth = b.width;
      c.pixelHeight = b.height
    }else {
      d = goog.style.getPaddingBox(a);
      var e = goog.style.getBorderBox(a);
      c.pixelWidth = b.width + e.left + d.left + d.right + e.right;
      c.pixelHeight = b.height + e.top + d.top + d.bottom + e.bottom
    }
  }else {
    goog.style.setBoxSizingSize_(a, b, "content-box")
  }
};
goog.style.setBoxSizingSize_ = function(a, b, c) {
  a = a.style;
  if(goog.userAgent.GECKO) {
    a.MozBoxSizing = c
  }else {
    if(goog.userAgent.WEBKIT) {
      a.WebkitBoxSizing = c
    }else {
      if(goog.userAgent.OPERA && !goog.userAgent.isVersion("9.50")) {
        c ? a.setProperty("box-sizing", c) : a.removeProperty("box-sizing")
      }else {
        a.boxSizing = c
      }
    }
  }
  a.width = b.width + "px";
  a.height = b.height + "px"
};
goog.style.getIePixelValue_ = function(a, b, c, d) {
  if(/^\d+px?$/.test(b)) {
    return parseInt(b, 10)
  }else {
    var e = a.style[c], f = a.runtimeStyle[c];
    a.runtimeStyle[c] = a.currentStyle[c];
    a.style[c] = b;
    b = a.style[d];
    a.style[c] = e;
    a.runtimeStyle[c] = f;
    return b
  }
};
goog.style.getIePixelDistance_ = function(a, b) {
  return goog.style.getIePixelValue_(a, goog.style.getCascadedStyle(a, b), "left", "pixelLeft")
};
goog.style.getBox_ = function(a, b) {
  if(goog.userAgent.IE) {
    var c = goog.style.getIePixelDistance_(a, b + "Left"), d = goog.style.getIePixelDistance_(a, b + "Right"), e = goog.style.getIePixelDistance_(a, b + "Top"), f = goog.style.getIePixelDistance_(a, b + "Bottom");
    return new goog.math.Box(e, d, f, c)
  }else {
    c = goog.style.getComputedStyle(a, b + "Left");
    d = goog.style.getComputedStyle(a, b + "Right");
    e = goog.style.getComputedStyle(a, b + "Top");
    f = goog.style.getComputedStyle(a, b + "Bottom");
    return new goog.math.Box(parseFloat(e), parseFloat(d), parseFloat(f), parseFloat(c))
  }
};
goog.style.getPaddingBox = function(a) {
  return goog.style.getBox_(a, "padding")
};
goog.style.getMarginBox = function(a) {
  return goog.style.getBox_(a, "margin")
};
goog.style.ieBorderWidthKeywords_ = {thin:2, medium:4, thick:6};
goog.style.getIePixelBorder_ = function(a, b) {
  if(goog.style.getCascadedStyle(a, b + "Style") == "none") {
    return 0
  }
  var c = goog.style.getCascadedStyle(a, b + "Width");
  if(c in goog.style.ieBorderWidthKeywords_) {
    return goog.style.ieBorderWidthKeywords_[c]
  }
  return goog.style.getIePixelValue_(a, c, "left", "pixelLeft")
};
goog.style.getBorderBox = function(a) {
  if(goog.userAgent.IE) {
    var b = goog.style.getIePixelBorder_(a, "borderLeft"), c = goog.style.getIePixelBorder_(a, "borderRight"), d = goog.style.getIePixelBorder_(a, "borderTop");
    a = goog.style.getIePixelBorder_(a, "borderBottom");
    return new goog.math.Box(d, c, a, b)
  }else {
    b = goog.style.getComputedStyle(a, "borderLeftWidth");
    c = goog.style.getComputedStyle(a, "borderRightWidth");
    d = goog.style.getComputedStyle(a, "borderTopWidth");
    a = goog.style.getComputedStyle(a, "borderBottomWidth");
    return new goog.math.Box(parseFloat(d), parseFloat(c), parseFloat(a), parseFloat(b))
  }
};
goog.style.getFontFamily = function(a) {
  var b = goog.dom.getOwnerDocument(a), c = "";
  if(b.body.createTextRange) {
    b = b.body.createTextRange();
    b.moveToElementText(a);
    try {
      c = b.queryCommandValue("FontName")
    }catch(d) {
      c = ""
    }
  }
  if(!c) {
    c = goog.style.getStyle_(a, "fontFamily");
    if(goog.userAgent.OPERA && goog.userAgent.LINUX) {
      c = c.replace(/ \[[^\]]*\]/, "")
    }
  }
  a = c.split(",");
  if(a.length > 1) {
    c = a[0]
  }
  return goog.string.stripQuotes(c, "\"'")
};
goog.style.lengthUnitRegex_ = /[^\d]+$/;
goog.style.getLengthUnits = function(a) {
  return(a = a.match(goog.style.lengthUnitRegex_)) && a[0] || null
};
goog.style.ABSOLUTE_CSS_LENGTH_UNITS_ = {cm:1, "in":1, mm:1, pc:1, pt:1};
goog.style.CONVERTIBLE_RELATIVE_CSS_UNITS_ = {em:1, ex:1};
goog.style.getFontSize = function(a) {
  var b = goog.style.getStyle_(a, "fontSize"), c = goog.style.getLengthUnits(b);
  if(b && "px" == c) {
    return parseInt(b, 10)
  }
  if(goog.userAgent.IE) {
    if(c in goog.style.ABSOLUTE_CSS_LENGTH_UNITS_) {
      return goog.style.getIePixelValue_(a, b, "left", "pixelLeft")
    }else {
      if(a.parentNode && a.parentNode.nodeType == goog.dom.NodeType.ELEMENT && c in goog.style.CONVERTIBLE_RELATIVE_CSS_UNITS_) {
        a = a.parentNode;
        c = goog.style.getStyle_(a, "fontSize");
        return goog.style.getIePixelValue_(a, b == c ? "1em" : b, "left", "pixelLeft")
      }
    }
  }
  c = goog.dom.createDom("span", {style:"visibility:hidden;position:absolute;line-height:0;padding:0;margin:0;border:0;height:1em;"});
  goog.dom.appendChild(a, c);
  b = c.offsetHeight;
  goog.dom.removeNode(c);
  return b
};
goog.style.parseStyleAttribute = function(a) {
  var b = {};
  goog.array.forEach(a.split(/\s*;\s*/), function(c) {
    c = c.split(/\s*:\s*/);
    if(c.length == 2) {
      b[goog.string.toCamelCase(c[0].toLowerCase())] = c[1]
    }
  });
  return b
};
goog.style.toStyleAttribute = function(a) {
  var b = [];
  goog.object.forEach(a, function(c, d) {
    b.push(goog.string.toSelectorCase(d), ":", c, ";")
  });
  return b.join("")
};
goog.style.setFloat = function(a, b) {
  a.style[goog.userAgent.IE ? "styleFloat" : "cssFloat"] = b
};
goog.style.getFloat = function(a) {
  return a.style[goog.userAgent.IE ? "styleFloat" : "cssFloat"] || ""
};
goog.style.getScrollbarWidth = function() {
  var a = goog.dom.createElement("div");
  a.style.cssText = "visibility:hidden;overflow:scroll;position:absolute;top:0;width:100px;height:100px";
  goog.dom.appendChild(goog.dom.getDocument().body, a);
  var b = a.offsetWidth - a.clientWidth;
  goog.dom.removeNode(a);
  return b
};bot.dom = {};
bot.dom.getActiveElement = function(a) {
  return goog.dom.getOwnerDocument(a).activeElement
};
bot.dom.isElement = function(a, b) {
  return!!a && a.nodeType == goog.dom.NodeType.ELEMENT && (!b || a.tagName.toUpperCase() == b)
};
bot.dom.PROPERTY_ALIASES_ = {"class":"className", readonly:"readOnly"};
bot.dom.getProperty = function(a, b) {
  return a[bot.dom.PROPERTY_ALIASES_[b] || b]
};
bot.dom.BOOLEAN_ATTRIBUTES_ = ["async", "autofocus", "autoplay", "checked", "compact", "complete", "controls", "declare", "defaultchecked", "defaultselected", "defer", "disabled", "draggable", "ended", "formnovalidate", "hidden", "indeterminate", "iscontenteditable", "ismap", "itemscope", "loop", "multiple", "muted", "nohref", "noresize", "noshade", "novalidate", "nowrap", "open", "paused", "pubdate", "readonly", "required", "reversed", "scoped", "seamless", "seeking", "selected", "spellcheck", "truespeed", 
"willvalidate"];
bot.dom.getAttribute = function(a, b) {
  if(goog.dom.NodeType.COMMENT == a.nodeType) {
    return null
  }
  b = b.toLowerCase();
  if(b == "style") {
    var c = goog.string.trim(a.style.cssText).toLowerCase();
    return c.charAt(c.length - 1) == ";" ? c : c + ";"
  }
  c = a.getAttributeNode(b);
  if(goog.userAgent.IE) {
    if(!c && goog.userAgent.isVersion(8) && goog.array.contains(bot.dom.BOOLEAN_ATTRIBUTES_, b)) {
      c = a[b]
    }
  }
  if(!c) {
    return null
  }
  if(goog.array.contains(bot.dom.BOOLEAN_ATTRIBUTES_, b)) {
    return goog.userAgent.IE && c.value == "false" ? null : "true"
  }
  return c.specified ? c.value : null
};
bot.dom.DISABLED_ATTRIBUTE_SUPPORTED_ = [goog.dom.TagName.BUTTON, goog.dom.TagName.INPUT, goog.dom.TagName.OPTGROUP, goog.dom.TagName.OPTION, goog.dom.TagName.SELECT, goog.dom.TagName.TEXTAREA];
bot.dom.isEnabled = function(a) {
  var b = a.tagName.toUpperCase();
  if(!goog.array.contains(bot.dom.DISABLED_ATTRIBUTE_SUPPORTED_, b)) {
    return true
  }
  if(bot.dom.getAttribute(a, "disabled")) {
    return false
  }
  if(a.parentNode && a.parentNode.nodeType == goog.dom.NodeType.ELEMENT && goog.dom.TagName.OPTGROUP == b || goog.dom.TagName.OPTION == b) {
    return bot.dom.isEnabled(a.parentNode)
  }
  return true
};
bot.dom.getParentElement_ = function(a) {
  for(a = a.parentNode;a && a.nodeType != goog.dom.NodeType.ELEMENT && a.nodeType != goog.dom.NodeType.DOCUMENT && a.nodeType != goog.dom.NodeType.DOCUMENT_FRAGMENT;) {
    a = a.parentNode
  }
  return bot.dom.isElement(a) ? a : null
};
bot.dom.getInlineStyle = function(a, b) {
  return goog.style.getStyle(a, b)
};
bot.dom.getEffectiveStyle = function(a, b) {
  b = goog.style.toCamelCase(b);
  return goog.style.getComputedStyle(a, b) || bot.dom.getCascadedStyle_(a, b)
};
bot.dom.getCascadedStyle_ = function(a, b) {
  var c = (a.currentStyle || a.style)[b];
  if(c != "inherit") {
    return goog.isDef(c) ? c : null
  }
  return(c = bot.dom.getParentElement_(a)) ? bot.dom.getCascadedStyle_(c, b) : null
};
bot.dom.getElementSize_ = function(a) {
  if(goog.isFunction(a.getBBox)) {
    return a.getBBox()
  }
  return goog.style.getSize(a)
};
bot.dom.isShown = function(a, b) {
  function c(f) {
    if(bot.dom.getEffectiveStyle(f, "display") == "none") {
      return false
    }
    f = bot.dom.getParentElement_(f);
    return!f || c(f)
  }
  function d(f) {
    var g = bot.dom.getElementSize_(f);
    if(g.height > 0 && g.width > 0) {
      return true
    }
    if(f.innerText || f.textContent) {
      if(bot.dom.JUST_HTML_WHITESPACE_REGEXP_.test(f.innerText || f.textContent)) {
        return true
      }
    }
    return goog.userAgent.WEBKIT && goog.array.some(f.childNodes, function(h) {
      return bot.dom.isElement(h) && d(h)
    })
  }
  if(!bot.dom.isElement(a)) {
    throw Error("Argument to isShown must be of type Element");
  }
  if(bot.dom.isElement(a, goog.dom.TagName.TITLE)) {
    return goog.dom.getWindow(goog.dom.getOwnerDocument(a)) == bot.getWindow()
  }
  if(bot.dom.isElement(a, goog.dom.TagName.OPTION) || bot.dom.isElement(a, goog.dom.TagName.OPTGROUP)) {
    var e = goog.dom.getAncestor(a, function(f) {
      return bot.dom.isElement(f, goog.dom.TagName.SELECT)
    });
    return!!e && bot.dom.isShown(e)
  }
  if(bot.dom.isElement(a, goog.dom.TagName.MAP)) {
    if(!a.name) {
      return false
    }
    e = goog.dom.getOwnerDocument(a);
    e = e.evaluate ? bot.locators.xpath.single('/descendant::*[@usemap = "#' + a.name + '"]', e) : goog.dom.findNode(e, function(f) {
      return bot.dom.isElement(f) && bot.dom.getAttribute(f, "usemap") == "#" + a.name
    });
    return!!e && bot.dom.isShown(e)
  }
  if(bot.dom.isElement(a, goog.dom.TagName.AREA)) {
    e = goog.dom.getAncestor(a, function(f) {
      return bot.dom.isElement(f, goog.dom.TagName.MAP)
    });
    return!!e && bot.dom.isShown(e)
  }
  if(bot.dom.isElement(a, goog.dom.TagName.INPUT) && a.type.toLowerCase() == "hidden") {
    return false
  }
  if(bot.dom.getEffectiveStyle(a, "visibility") == "hidden") {
    return false
  }
  if(!c(a)) {
    return false
  }
  if(!b && bot.dom.getOpacity(a) == 0) {
    return false
  }
  if(!d(a)) {
    return false
  }
  return true
};
bot.dom.getVisibleText = function(a) {
  var b = [""];
  bot.dom.appendVisibleTextLinesFromElement_(a, b);
  b = goog.array.map(b, goog.string.trim);
  return goog.string.trim(b.join("\n"))
};
bot.dom.appendVisibleTextLinesFromElement_ = function(a, b) {
  if(bot.dom.isElement(a, goog.dom.TagName.BR)) {
    b.push("")
  }else {
    var c = bot.dom.hasBlockStyle_(a);
    c && goog.array.peek(b) && b.push("");
    goog.array.forEach(a.childNodes, function(d) {
      if(d.nodeType == goog.dom.NodeType.TEXT) {
        bot.dom.appendVisibleTextLinesFromTextNode_(d, b)
      }else {
        bot.dom.isElement(d) && bot.dom.appendVisibleTextLinesFromElement_(d, b)
      }
    });
    c && goog.array.peek(b) && b.push("")
  }
};
bot.dom.hasBlockStyle_ = function(a) {
  a = bot.dom.getEffectiveStyle(a, "display");
  return a == "block" || a == "inline-block"
};
bot.dom.HTML_WHITESPACE_ = "[\\s\\xa0" + String.fromCharCode(160) + "]+";
bot.dom.HTML_WHITESPACE_REGEXP_ = RegExp(bot.dom.HTML_WHITESPACE_, "g");
bot.dom.JUST_HTML_WHITESPACE_REGEXP_ = RegExp("^" + bot.dom.HTML_WHITESPACE_ + "$", "g");
bot.dom.appendVisibleTextLinesFromTextNode_ = function(a, b) {
  var c = bot.dom.getParentElement_(a);
  bot.dom.isShown(c);
  if(!c || !bot.dom.isShown(c)) {
    bot.dom.isShown(c)
  }else {
    c = a.nodeValue.replace(bot.dom.HTML_WHITESPACE_REGEXP_, " ");
    var d = b.pop();
    if(goog.string.endsWith(d, " ") && goog.string.startsWith(c, " ")) {
      c = c.substr(1)
    }
    b.push(d + c)
  }
};
bot.dom.getOpacity = function(a) {
  if(goog.userAgent.IE) {
    if(bot.dom.getEffectiveStyle(a, "position") == "relative") {
      return 1
    }
    a = bot.dom.getEffectiveStyle(a, "filter");
    return(a = a.match(/^alpha\(opacity=(\d*)\)/) || a.match(/^progid:DXImageTransform.Microsoft.Alpha\(Opacity=(\d*)\)/)) ? Number(a[1]) / 100 : 1
  }else {
    return bot.dom.getOpacityNonIE_(a)
  }
};
bot.dom.getOpacityNonIE_ = function(a) {
  var b = 1, c = bot.dom.getEffectiveStyle(a, "opacity");
  if(c) {
    b = Number(c)
  }
  if(a = bot.dom.getParentElement_(a)) {
    b *= bot.dom.getOpacityNonIE_(a)
  }
  return b
};bot.events = {};
bot.events.Button = {LEFT:goog.userAgent.IE ? 1 : 0, MIDDLE:goog.userAgent.IE ? 4 : 1, RIGHT:goog.userAgent.IE ? 2 : 2};
bot.events.RELATED_TARGET_EVENTS_ = [goog.events.EventType.DRAGSTART, "dragexit", goog.events.EventType.MOUSEOVER, goog.events.EventType.MOUSEOUT];
bot.events.newMouseEvent_ = function(a, b, c) {
  var d = goog.dom.getOwnerDocument(a), e = goog.dom.getWindow(d), f = c || {};
  c = f.x || 0;
  var g = f.y || 0, h = f.button || bot.events.Button.LEFT, i = f.bubble || true, j = null;
  if(goog.array.contains(bot.events.RELATED_TARGET_EVENTS_, b)) {
    j = f.related || null
  }
  var l = !!f.alt, m = !!f.control, k = !!f.shift;
  f = !!f.meta;
  if(a.fireEvent && d && d.createEventObject) {
    a = d.createEventObject();
    a.altKey = l;
    a.controlKey = m;
    a.metaKey = f;
    a.shiftKey = k;
    a.clientX = c;
    a.clientY = g;
    a.button = h;
    a.relatedTarget = j
  }else {
    a = d.createEvent("MouseEvents");
    if(a.initMouseEvent) {
      a.initMouseEvent(b, i, true, e, 1, 0, 0, c, g, m, l, k, f, h, j)
    }else {
      a.initEvent(b, i, true);
      a.shiftKey = k;
      a.metaKey = f;
      a.altKey = l;
      a.ctrlKey = m;
      a.button = h
    }
  }
  return a
};
bot.events.newKeyEvent_ = function(a, b, c) {
  var d = goog.dom.getOwnerDocument(a);
  a = goog.dom.getWindow(d);
  var e = c || {};
  c = e.keyCode || 0;
  var f = e.charCode || 0, g = !!e.alt, h = !!e.ctrl, i = !!e.shift;
  e = !!e.meta;
  if(goog.userAgent.GECKO) {
    d = d.createEvent("KeyboardEvent");
    d.initKeyEvent(b, true, true, a, h, g, i, e, c, f)
  }else {
    if(goog.userAgent.IE) {
      d = d.createEventObject()
    }else {
      d = d.createEvent("Events");
      d.initEvent(b, true, true);
      d.charCode = f
    }
    d.keyCode = c;
    d.altKey = g;
    d.ctrlKey = h;
    d.metaKey = e;
    d.shiftKey = i
  }
  return d
};
bot.events.newHtmlEvent_ = function(a, b, c) {
  var d = goog.dom.getOwnerDocument(a);
  goog.dom.getWindow(d);
  var e = c || {};
  c = e.bubble !== false;
  var f = !!e.alt, g = !!e.control, h = !!e.shift;
  e = !!e.meta;
  if(a.fireEvent && d && d.createEventObject) {
    a = d.createEventObject();
    a.altKey = f;
    a.ctrl = g;
    a.metaKey = e;
    a.shiftKey = h
  }else {
    a = d.createEvent("HTMLEvents");
    a.initEvent(b, c, true);
    a.shiftKey = h;
    a.metaKey = e;
    a.altKey = f;
    a.ctrlKey = g
  }
  return a
};
bot.events.INIT_FUNCTIONS_ = {};
bot.events.INIT_FUNCTIONS_[goog.events.EventType.CLICK] = bot.events.newMouseEvent_;
bot.events.INIT_FUNCTIONS_[goog.events.EventType.KEYDOWN] = bot.events.newKeyEvent_;
bot.events.INIT_FUNCTIONS_[goog.events.EventType.KEYPRESS] = bot.events.newKeyEvent_;
bot.events.INIT_FUNCTIONS_[goog.events.EventType.KEYUP] = bot.events.newKeyEvent_;
bot.events.INIT_FUNCTIONS_[goog.events.EventType.MOUSEDOWN] = bot.events.newMouseEvent_;
bot.events.INIT_FUNCTIONS_[goog.events.EventType.MOUSEMOVE] = bot.events.newMouseEvent_;
bot.events.INIT_FUNCTIONS_[goog.events.EventType.MOUSEOUT] = bot.events.newMouseEvent_;
bot.events.INIT_FUNCTIONS_[goog.events.EventType.MOUSEOVER] = bot.events.newMouseEvent_;
bot.events.INIT_FUNCTIONS_[goog.events.EventType.MOUSEUP] = bot.events.newMouseEvent_;
bot.events.dispatchEvent_ = function(a, b, c) {
  if(goog.isFunction(a.fireEvent) || goog.isObject(a.fireEvent)) {
    try {
      var d = goog.dom.getOwnerDocument(a);
      goog.dom.getWindow(d).event = c
    }catch(e) {
    }
    return a.fireEvent("on" + b, c)
  }else {
    return a.dispatchEvent(c)
  }
};
bot.events.fire = function(a, b, c) {
  c = (bot.events.INIT_FUNCTIONS_[b] || bot.events.newHtmlEvent_)(a, b, c);
  return bot.events.dispatchEvent_(a, b, c)
};goog.structs.getCount = function(a) {
  if(typeof a.getCount == "function") {
    return a.getCount()
  }
  if(goog.isArrayLike(a) || goog.isString(a)) {
    return a.length
  }
  return goog.object.getCount(a)
};
goog.structs.getValues = function(a) {
  if(typeof a.getValues == "function") {
    return a.getValues()
  }
  if(goog.isString(a)) {
    return a.split("")
  }
  if(goog.isArrayLike(a)) {
    var b = [], c = a.length;
    for(var d = 0;d < c;d++) {
      b.push(a[d])
    }
    return b
  }
  return goog.object.getValues(a)
};
goog.structs.getKeys = function(a) {
  if(typeof a.getKeys == "function") {
    return a.getKeys()
  }
  if(typeof a.getValues != "function") {
    if(goog.isArrayLike(a) || goog.isString(a)) {
      var b = [];
      a = a.length;
      for(var c = 0;c < a;c++) {
        b.push(c)
      }
      return b
    }
    return goog.object.getKeys(a)
  }
};
goog.structs.contains = function(a, b) {
  if(typeof a.contains == "function") {
    return a.contains(b)
  }
  if(typeof a.containsValue == "function") {
    return a.containsValue(b)
  }
  if(goog.isArrayLike(a) || goog.isString(a)) {
    return goog.array.contains(a, b)
  }
  return goog.object.containsValue(a, b)
};
goog.structs.isEmpty = function(a) {
  if(typeof a.isEmpty == "function") {
    return a.isEmpty()
  }
  if(goog.isArrayLike(a) || goog.isString(a)) {
    return goog.array.isEmpty(a)
  }
  return goog.object.isEmpty(a)
};
goog.structs.clear = function(a) {
  if(typeof a.clear == "function") {
    a.clear()
  }else {
    goog.isArrayLike(a) ? goog.array.clear(a) : goog.object.clear(a)
  }
};
goog.structs.forEach = function(a, b, c) {
  if(typeof a.forEach == "function") {
    a.forEach(b, c)
  }else {
    if(goog.isArrayLike(a) || goog.isString(a)) {
      goog.array.forEach(a, b, c)
    }else {
      var d = goog.structs.getKeys(a), e = goog.structs.getValues(a), f = e.length;
      for(var g = 0;g < f;g++) {
        b.call(c, e[g], d && d[g], a)
      }
    }
  }
};
goog.structs.filter = function(a, b, c) {
  if(typeof a.filter == "function") {
    return a.filter(b, c)
  }
  if(goog.isArrayLike(a) || goog.isString(a)) {
    return goog.array.filter(a, b, c)
  }
  var d, e = goog.structs.getKeys(a), f = goog.structs.getValues(a), g = f.length;
  if(e) {
    d = {};
    for(var h = 0;h < g;h++) {
      if(b.call(c, f[h], e[h], a)) {
        d[e[h]] = f[h]
      }
    }
  }else {
    d = [];
    for(h = 0;h < g;h++) {
      b.call(c, f[h], undefined, a) && d.push(f[h])
    }
  }
  return d
};
goog.structs.map = function(a, b, c) {
  if(typeof a.map == "function") {
    return a.map(b, c)
  }
  if(goog.isArrayLike(a) || goog.isString(a)) {
    return goog.array.map(a, b, c)
  }
  var d, e = goog.structs.getKeys(a), f = goog.structs.getValues(a), g = f.length;
  if(e) {
    d = {};
    for(var h = 0;h < g;h++) {
      d[e[h]] = b.call(c, f[h], e[h], a)
    }
  }else {
    d = [];
    for(h = 0;h < g;h++) {
      d[h] = b.call(c, f[h], undefined, a)
    }
  }
  return d
};
goog.structs.some = function(a, b, c) {
  if(typeof a.some == "function") {
    return a.some(b, c)
  }
  if(goog.isArrayLike(a) || goog.isString(a)) {
    return goog.array.some(a, b, c)
  }
  var d = goog.structs.getKeys(a), e = goog.structs.getValues(a), f = e.length;
  for(var g = 0;g < f;g++) {
    if(b.call(c, e[g], d && d[g], a)) {
      return true
    }
  }
  return false
};
goog.structs.every = function(a, b, c) {
  if(typeof a.every == "function") {
    return a.every(b, c)
  }
  if(goog.isArrayLike(a) || goog.isString(a)) {
    return goog.array.every(a, b, c)
  }
  var d = goog.structs.getKeys(a), e = goog.structs.getValues(a), f = e.length;
  for(var g = 0;g < f;g++) {
    if(!b.call(c, e[g], d && d[g], a)) {
      return false
    }
  }
  return true
};goog.structs.Map = function(a) {
  this.map_ = {};
  this.keys_ = [];
  var b = arguments.length;
  if(b > 1) {
    if(b % 2) {
      throw Error("Uneven number of arguments");
    }
    for(var c = 0;c < b;c += 2) {
      this.set(arguments[c], arguments[c + 1])
    }
  }else {
    a && this.addAll(a)
  }
};
goog.structs.Map.prototype.count_ = 0;
goog.structs.Map.prototype.version_ = 0;
goog.structs.Map.prototype.getCount = function() {
  return this.count_
};
goog.structs.Map.prototype.getValues = function() {
  this.cleanupKeysArray_();
  var a = [];
  for(var b = 0;b < this.keys_.length;b++) {
    a.push(this.map_[this.keys_[b]])
  }
  return a
};
goog.structs.Map.prototype.getKeys = function() {
  this.cleanupKeysArray_();
  return this.keys_.concat()
};
goog.structs.Map.prototype.containsKey = function(a) {
  return goog.structs.Map.hasKey_(this.map_, a)
};
goog.structs.Map.prototype.containsValue = function(a) {
  for(var b = 0;b < this.keys_.length;b++) {
    var c = this.keys_[b];
    if(goog.structs.Map.hasKey_(this.map_, c) && this.map_[c] == a) {
      return true
    }
  }
  return false
};
goog.structs.Map.prototype.equals = function(a, b) {
  if(this === a) {
    return true
  }
  if(this.count_ != a.getCount()) {
    return false
  }
  var c = b || goog.structs.Map.defaultEquals;
  this.cleanupKeysArray_();
  var d;
  for(var e = 0;d = this.keys_[e];e++) {
    if(!c(this.get(d), a.get(d))) {
      return false
    }
  }
  return true
};
goog.structs.Map.defaultEquals = function(a, b) {
  return a === b
};
goog.structs.Map.prototype.isEmpty = function() {
  return this.count_ == 0
};
goog.structs.Map.prototype.clear = function() {
  this.map_ = {};
  this.version_ = this.count_ = this.keys_.length = 0
};
goog.structs.Map.prototype.remove = function(a) {
  if(goog.structs.Map.hasKey_(this.map_, a)) {
    delete this.map_[a];
    this.count_--;
    this.version_++;
    this.keys_.length > 2 * this.count_ && this.cleanupKeysArray_();
    return true
  }
  return false
};
goog.structs.Map.prototype.cleanupKeysArray_ = function() {
  if(this.count_ != this.keys_.length) {
    var a = 0;
    for(var b = 0;a < this.keys_.length;) {
      var c = this.keys_[a];
      if(goog.structs.Map.hasKey_(this.map_, c)) {
        this.keys_[b++] = c
      }
      a++
    }
    this.keys_.length = b
  }
  if(this.count_ != this.keys_.length) {
    var d = {};
    a = 0;
    for(b = 0;a < this.keys_.length;) {
      c = this.keys_[a];
      if(!goog.structs.Map.hasKey_(d, c)) {
        this.keys_[b++] = c;
        d[c] = 1
      }
      a++
    }
    this.keys_.length = b
  }
};
goog.structs.Map.prototype.get = function(a, b) {
  if(goog.structs.Map.hasKey_(this.map_, a)) {
    return this.map_[a]
  }
  return b
};
goog.structs.Map.prototype.set = function(a, b) {
  if(!goog.structs.Map.hasKey_(this.map_, a)) {
    this.count_++;
    this.keys_.push(a);
    this.version_++
  }
  this.map_[a] = b
};
goog.structs.Map.prototype.addAll = function(a) {
  var b;
  if(a instanceof goog.structs.Map) {
    b = a.getKeys();
    a = a.getValues()
  }else {
    b = goog.object.getKeys(a);
    a = goog.object.getValues(a)
  }
  for(var c = 0;c < b.length;c++) {
    this.set(b[c], a[c])
  }
};
goog.structs.Map.prototype.clone = function() {
  return new goog.structs.Map(this)
};
goog.structs.Map.prototype.transpose = function() {
  var a = new goog.structs.Map;
  for(var b = 0;b < this.keys_.length;b++) {
    var c = this.keys_[b];
    a.set(this.map_[c], c)
  }
  return a
};
goog.structs.Map.prototype.toObject = function() {
  this.cleanupKeysArray_();
  var a = {};
  for(var b = 0;b < this.keys_.length;b++) {
    var c = this.keys_[b];
    a[c] = this.map_[c]
  }
  return a
};
goog.structs.Map.prototype.getKeyIterator = function() {
  return this.__iterator__(true)
};
goog.structs.Map.prototype.getValueIterator = function() {
  return this.__iterator__(false)
};
goog.structs.Map.prototype.__iterator__ = function(a) {
  this.cleanupKeysArray_();
  var b = 0, c = this.keys_, d = this.map_, e = this.version_, f = this, g = new goog.iter.Iterator;
  g.next = function() {
    for(;;) {
      if(e != f.version_) {
        throw Error("The map has changed since the iterator was created");
      }
      if(b >= c.length) {
        throw goog.iter.StopIteration;
      }
      var h = c[b++];
      return a ? h : d[h]
    }
  };
  return g
};
goog.structs.Map.hasKey_ = function(a, b) {
  return Object.prototype.hasOwnProperty.call(a, b)
};goog.uri = {};
goog.uri.utils = {};
goog.uri.utils.CharCode_ = {AMPERSAND:38, EQUAL:61, HASH:35, QUESTION:63};
goog.uri.utils.buildFromEncodedParts = function(a, b, c, d, e, f, g) {
  var h = [];
  a && h.push(a, ":");
  if(c) {
    h.push("//");
    b && h.push(b, "@");
    h.push(c);
    d && h.push(":", d)
  }
  e && h.push(e);
  f && h.push("?", f);
  g && h.push("#", g);
  return h.join("")
};
goog.uri.utils.splitRe_ = RegExp("^(?:([^:/?#.]+):)?(?://(?:([^/?#]*)@)?([\\w\\d\\-\\u0100-\\uffff.%]*)(?::([0-9]+))?)?([^?#]+)?(?:\\?([^#]*))?(?:#(.*))?$");
goog.uri.utils.ComponentIndex = {SCHEME:1, USER_INFO:2, DOMAIN:3, PORT:4, PATH:5, QUERY_DATA:6, FRAGMENT:7};
goog.uri.utils.split = function(a) {
  return a.match(goog.uri.utils.splitRe_)
};
goog.uri.utils.decodeIfPossible_ = function(a) {
  return a && decodeURIComponent(a)
};
goog.uri.utils.getComponentByIndex_ = function(a, b) {
  return goog.uri.utils.split(b)[a] || null
};
goog.uri.utils.getScheme = function(a) {
  return goog.uri.utils.getComponentByIndex_(goog.uri.utils.ComponentIndex.SCHEME, a)
};
goog.uri.utils.getUserInfoEncoded = function(a) {
  return goog.uri.utils.getComponentByIndex_(goog.uri.utils.ComponentIndex.USER_INFO, a)
};
goog.uri.utils.getUserInfo = function(a) {
  return goog.uri.utils.decodeIfPossible_(goog.uri.utils.getUserInfoEncoded(a))
};
goog.uri.utils.getDomainEncoded = function(a) {
  return goog.uri.utils.getComponentByIndex_(goog.uri.utils.ComponentIndex.DOMAIN, a)
};
goog.uri.utils.getDomain = function(a) {
  return goog.uri.utils.decodeIfPossible_(goog.uri.utils.getDomainEncoded(a))
};
goog.uri.utils.getPort = function(a) {
  return Number(goog.uri.utils.getComponentByIndex_(goog.uri.utils.ComponentIndex.PORT, a)) || null
};
goog.uri.utils.getPathEncoded = function(a) {
  return goog.uri.utils.getComponentByIndex_(goog.uri.utils.ComponentIndex.PATH, a)
};
goog.uri.utils.getPath = function(a) {
  return goog.uri.utils.decodeIfPossible_(goog.uri.utils.getPathEncoded(a))
};
goog.uri.utils.getQueryData = function(a) {
  return goog.uri.utils.getComponentByIndex_(goog.uri.utils.ComponentIndex.QUERY_DATA, a)
};
goog.uri.utils.getFragmentEncoded = function(a) {
  var b = a.indexOf("#");
  return b < 0 ? null : a.substr(b + 1)
};
goog.uri.utils.setFragmentEncoded = function(a, b) {
  return goog.uri.utils.removeFragment(a) + (b ? "#" + b : "")
};
goog.uri.utils.getFragment = function(a) {
  return goog.uri.utils.decodeIfPossible_(goog.uri.utils.getFragmentEncoded(a))
};
goog.uri.utils.getHost = function(a) {
  a = goog.uri.utils.split(a);
  return goog.uri.utils.buildFromEncodedParts(a[goog.uri.utils.ComponentIndex.SCHEME], a[goog.uri.utils.ComponentIndex.USER_INFO], a[goog.uri.utils.ComponentIndex.DOMAIN], a[goog.uri.utils.ComponentIndex.PORT])
};
goog.uri.utils.getPathAndAfter = function(a) {
  a = goog.uri.utils.split(a);
  return goog.uri.utils.buildFromEncodedParts(null, null, null, null, a[goog.uri.utils.ComponentIndex.PATH], a[goog.uri.utils.ComponentIndex.QUERY_DATA], a[goog.uri.utils.ComponentIndex.FRAGMENT])
};
goog.uri.utils.removeFragment = function(a) {
  var b = a.indexOf("#");
  return b < 0 ? a : a.substr(0, b)
};
goog.uri.utils.haveSameDomain = function(a, b) {
  var c = goog.uri.utils.split(a), d = goog.uri.utils.split(b);
  return c[goog.uri.utils.ComponentIndex.DOMAIN] == d[goog.uri.utils.ComponentIndex.DOMAIN] && c[goog.uri.utils.ComponentIndex.SCHEME] == d[goog.uri.utils.ComponentIndex.SCHEME] && c[goog.uri.utils.ComponentIndex.PORT] == d[goog.uri.utils.ComponentIndex.PORT]
};
goog.uri.utils.assertNoFragmentsOrQueries_ = function(a) {
  if(goog.DEBUG && (a.indexOf("#") >= 0 || a.indexOf("?") >= 0)) {
    throw Error("goog.uri.utils: Fragment or query identifiers are not supported: [" + a + "]");
  }
};
goog.uri.utils.appendQueryData_ = function(a) {
  if(a[1]) {
    var b = a[0], c = b.indexOf("#");
    if(c >= 0) {
      a.push(b.substr(c));
      a[0] = b = b.substr(0, c)
    }
    c = b.indexOf("?");
    if(c < 0) {
      a[1] = "?"
    }else {
      if(c == b.length - 1) {
        a[1] = undefined
      }
    }
  }
  return a.join("")
};
goog.uri.utils.appendKeyValuePairs_ = function(a, b, c) {
  if(goog.isArray(b)) {
    for(var d = 0;d < b.length;d++) {
      c.push("&", a);
      b[d] !== "" && c.push("=", goog.string.urlEncode(b[d]))
    }
  }else {
    if(b != null) {
      c.push("&", a);
      b !== "" && c.push("=", goog.string.urlEncode(b))
    }
  }
};
goog.uri.utils.buildQueryDataBuffer_ = function(a, b, c) {
  goog.asserts.assert(Math.max(b.length - (c || 0), 0) % 2 == 0, "goog.uri.utils: Key/value lists must be even in length.");
  for(c = c || 0;c < b.length;c += 2) {
    goog.uri.utils.appendKeyValuePairs_(b[c], b[c + 1], a)
  }
  return a
};
goog.uri.utils.buildQueryData = function(a, b) {
  var c = goog.uri.utils.buildQueryDataBuffer_([], a, b);
  c[0] = "";
  return c.join("")
};
goog.uri.utils.buildQueryDataBufferFromMap_ = function(a, b) {
  for(var c in b) {
    goog.uri.utils.appendKeyValuePairs_(c, b[c], a)
  }
  return a
};
goog.uri.utils.buildQueryDataFromMap = function(a) {
  a = goog.uri.utils.buildQueryDataBufferFromMap_([], a);
  a[0] = "";
  return a.join("")
};
goog.uri.utils.appendParams = function(a) {
  return goog.uri.utils.appendQueryData_(arguments.length == 2 ? goog.uri.utils.buildQueryDataBuffer_([a], arguments[1], 0) : goog.uri.utils.buildQueryDataBuffer_([a], arguments, 1))
};
goog.uri.utils.appendParamsFromMap = function(a, b) {
  return goog.uri.utils.appendQueryData_(goog.uri.utils.buildQueryDataBufferFromMap_([a], b))
};
goog.uri.utils.appendParam = function(a, b, c) {
  return goog.uri.utils.appendQueryData_([a, "&", b, "=", goog.string.urlEncode(c)])
};
goog.uri.utils.findParam_ = function(a, b, c, d) {
  b = b;
  for(var e = c.length;(b = a.indexOf(c, b)) >= 0 && b < d;) {
    var f = a.charCodeAt(b - 1);
    if(f == goog.uri.utils.CharCode_.AMPERSAND || f == goog.uri.utils.CharCode_.QUESTION) {
      f = a.charCodeAt(b + e);
      if(!f || f == goog.uri.utils.CharCode_.EQUAL || f == goog.uri.utils.CharCode_.AMPERSAND || f == goog.uri.utils.CharCode_.HASH) {
        return b
      }
    }
    b += e + 1
  }
  return-1
};
goog.uri.utils.hashOrEndRe_ = /#|$/;
goog.uri.utils.hasParam = function(a, b) {
  return goog.uri.utils.findParam_(a, 0, b, a.search(goog.uri.utils.hashOrEndRe_)) >= 0
};
goog.uri.utils.getParamValue = function(a, b) {
  var c = a.search(goog.uri.utils.hashOrEndRe_), d = goog.uri.utils.findParam_(a, 0, b, c);
  if(d < 0) {
    return null
  }else {
    var e = a.indexOf("&", d);
    if(e < 0 || e > c) {
      e = c
    }
    d += b.length + 1;
    return goog.string.urlDecode(a.substr(d, e - d))
  }
};
goog.uri.utils.getParamValues = function(a, b) {
  var c = a.search(goog.uri.utils.hashOrEndRe_), d = 0, e;
  for(var f = [];(e = goog.uri.utils.findParam_(a, d, b, c)) >= 0;) {
    d = a.indexOf("&", e);
    if(d < 0 || d > c) {
      d = c
    }
    e += b.length + 1;
    f.push(goog.string.urlDecode(a.substr(e, d - e)))
  }
  return f
};
goog.uri.utils.trailingQueryPunctuationRe_ = /[?&]($|#)/;
goog.uri.utils.removeParam = function(a, b) {
  var c = a.search(goog.uri.utils.hashOrEndRe_), d = 0, e;
  for(var f = [];(e = goog.uri.utils.findParam_(a, d, b, c)) >= 0;) {
    f.push(a.substring(d, e));
    d = Math.min(a.indexOf("&", e) + 1 || c, c)
  }
  f.push(a.substr(d));
  return f.join("").replace(goog.uri.utils.trailingQueryPunctuationRe_, "$1")
};
goog.uri.utils.setParam = function(a, b, c) {
  return goog.uri.utils.appendParam(goog.uri.utils.removeParam(a, b), b, c)
};
goog.uri.utils.appendPath = function(a, b) {
  goog.uri.utils.assertNoFragmentsOrQueries_(a);
  if(goog.string.endsWith(a, "/")) {
    a = a.substr(0, a.length - 1)
  }
  if(goog.string.startsWith(b, "/")) {
    b = b.substr(1)
  }
  return goog.string.buildString(a, "/", b)
};
goog.uri.utils.StandardQueryParam = {RANDOM:"zx"};
goog.uri.utils.makeUnique = function(a) {
  return goog.uri.utils.setParam(a, goog.uri.utils.StandardQueryParam.RANDOM, goog.string.getRandomString())
};goog.Uri = function(a, b) {
  var c;
  if(a instanceof goog.Uri) {
    this.setIgnoreCase(b == null ? a.getIgnoreCase() : b);
    this.setScheme(a.getScheme());
    this.setUserInfo(a.getUserInfo());
    this.setDomain(a.getDomain());
    this.setPort(a.getPort());
    this.setPath(a.getPath());
    this.setQueryData(a.getQueryData().clone());
    this.setFragment(a.getFragment())
  }else {
    if(a && (c = goog.uri.utils.split(String(a)))) {
      this.setIgnoreCase(!!b);
      this.setScheme(c[goog.uri.utils.ComponentIndex.SCHEME] || "", true);
      this.setUserInfo(c[goog.uri.utils.ComponentIndex.USER_INFO] || "", true);
      this.setDomain(c[goog.uri.utils.ComponentIndex.DOMAIN] || "", true);
      this.setPort(c[goog.uri.utils.ComponentIndex.PORT]);
      this.setPath(c[goog.uri.utils.ComponentIndex.PATH] || "", true);
      this.setQuery(c[goog.uri.utils.ComponentIndex.QUERY_DATA] || "", true);
      this.setFragment(c[goog.uri.utils.ComponentIndex.FRAGMENT] || "", true)
    }else {
      this.setIgnoreCase(!!b);
      this.queryData_ = new goog.Uri.QueryData(null, this, this.ignoreCase_)
    }
  }
};
goog.Uri.RANDOM_PARAM = goog.uri.utils.StandardQueryParam.RANDOM;
goog.Uri.prototype.scheme_ = "";
goog.Uri.prototype.userInfo_ = "";
goog.Uri.prototype.domain_ = "";
goog.Uri.prototype.port_ = null;
goog.Uri.prototype.path_ = "";
goog.Uri.prototype.fragment_ = "";
goog.Uri.prototype.isReadOnly_ = false;
goog.Uri.prototype.ignoreCase_ = false;
goog.Uri.prototype.toString = function() {
  if(this.cachedToString_) {
    return this.cachedToString_
  }
  var a = [];
  this.scheme_ && a.push(goog.Uri.encodeSpecialChars_(this.scheme_, goog.Uri.reDisallowedInSchemeOrUserInfo_), ":");
  if(this.domain_) {
    a.push("//");
    this.userInfo_ && a.push(goog.Uri.encodeSpecialChars_(this.userInfo_, goog.Uri.reDisallowedInSchemeOrUserInfo_), "@");
    a.push(goog.Uri.encodeString_(this.domain_));
    this.port_ != null && a.push(":", String(this.getPort()))
  }
  if(this.path_) {
    this.hasDomain() && this.path_.charAt(0) != "/" && a.push("/");
    a.push(goog.Uri.encodeSpecialChars_(this.path_, goog.Uri.reDisallowedInPath_))
  }
  var b = String(this.queryData_);
  b && a.push("?", b);
  this.fragment_ && a.push("#", goog.Uri.encodeSpecialChars_(this.fragment_, goog.Uri.reDisallowedInFragment_));
  return this.cachedToString_ = a.join("")
};
goog.Uri.prototype.resolve = function(a) {
  var b = this.clone(), c = a.hasScheme();
  if(c) {
    b.setScheme(a.getScheme())
  }else {
    c = a.hasUserInfo()
  }
  if(c) {
    b.setUserInfo(a.getUserInfo())
  }else {
    c = a.hasDomain()
  }
  if(c) {
    b.setDomain(a.getDomain())
  }else {
    c = a.hasPort()
  }
  var d = a.getPath();
  if(c) {
    b.setPort(a.getPort())
  }else {
    if(c = a.hasPath()) {
      if(d.charAt(0) != "/") {
        if(this.hasDomain() && !this.hasPath()) {
          d = "/" + d
        }else {
          var e = b.getPath().lastIndexOf("/");
          if(e != -1) {
            d = b.getPath().substr(0, e + 1) + d
          }
        }
      }
      d = goog.Uri.removeDotSegments(d)
    }
  }
  if(c) {
    b.setPath(d)
  }else {
    c = a.hasQuery()
  }
  if(c) {
    b.setQuery(a.getDecodedQuery())
  }else {
    c = a.hasFragment()
  }
  c && b.setFragment(a.getFragment());
  return b
};
goog.Uri.prototype.clone = function() {
  return goog.Uri.create(this.scheme_, this.userInfo_, this.domain_, this.port_, this.path_, this.queryData_.clone(), this.fragment_, this.ignoreCase_)
};
goog.Uri.prototype.getScheme = function() {
  return this.scheme_
};
goog.Uri.prototype.setScheme = function(a, b) {
  this.enforceReadOnly();
  delete this.cachedToString_;
  if(this.scheme_ = b ? goog.Uri.decodeOrEmpty_(a) : a) {
    this.scheme_ = this.scheme_.replace(/:$/, "")
  }
  return this
};
goog.Uri.prototype.hasScheme = function() {
  return!!this.scheme_
};
goog.Uri.prototype.getUserInfo = function() {
  return this.userInfo_
};
goog.Uri.prototype.setUserInfo = function(a, b) {
  this.enforceReadOnly();
  delete this.cachedToString_;
  this.userInfo_ = b ? goog.Uri.decodeOrEmpty_(a) : a;
  return this
};
goog.Uri.prototype.hasUserInfo = function() {
  return!!this.userInfo_
};
goog.Uri.prototype.getDomain = function() {
  return this.domain_
};
goog.Uri.prototype.setDomain = function(a, b) {
  this.enforceReadOnly();
  delete this.cachedToString_;
  this.domain_ = b ? goog.Uri.decodeOrEmpty_(a) : a;
  return this
};
goog.Uri.prototype.hasDomain = function() {
  return!!this.domain_
};
goog.Uri.prototype.getPort = function() {
  return this.port_
};
goog.Uri.prototype.setPort = function(a) {
  this.enforceReadOnly();
  delete this.cachedToString_;
  if(a) {
    a = Number(a);
    if(isNaN(a) || a < 0) {
      throw Error("Bad port number " + a);
    }
    this.port_ = a
  }else {
    this.port_ = null
  }
  return this
};
goog.Uri.prototype.hasPort = function() {
  return this.port_ != null
};
goog.Uri.prototype.getPath = function() {
  return this.path_
};
goog.Uri.prototype.setPath = function(a, b) {
  this.enforceReadOnly();
  delete this.cachedToString_;
  this.path_ = b ? goog.Uri.decodeOrEmpty_(a) : a;
  return this
};
goog.Uri.prototype.hasPath = function() {
  return!!this.path_
};
goog.Uri.prototype.hasQuery = function() {
  return this.queryData_.toString() !== ""
};
goog.Uri.prototype.setQueryData = function(a, b) {
  this.enforceReadOnly();
  delete this.cachedToString_;
  if(a instanceof goog.Uri.QueryData) {
    this.queryData_ = a;
    this.queryData_.uri_ = this;
    this.queryData_.setIgnoreCase(this.ignoreCase_)
  }else {
    b || (a = goog.Uri.encodeSpecialChars_(a, goog.Uri.reDisallowedInQuery_));
    this.queryData_ = new goog.Uri.QueryData(a, this, this.ignoreCase_)
  }
  return this
};
goog.Uri.prototype.setQuery = function(a, b) {
  return this.setQueryData(a, b)
};
goog.Uri.prototype.getEncodedQuery = function() {
  return this.queryData_.toString()
};
goog.Uri.prototype.getDecodedQuery = function() {
  return this.queryData_.toDecodedString()
};
goog.Uri.prototype.getQueryData = function() {
  return this.queryData_
};
goog.Uri.prototype.getQuery = function() {
  return this.getEncodedQuery()
};
goog.Uri.prototype.setParameterValue = function(a, b) {
  this.enforceReadOnly();
  delete this.cachedToString_;
  this.queryData_.set(a, b);
  return this
};
goog.Uri.prototype.setParameterValues = function(a, b) {
  this.enforceReadOnly();
  delete this.cachedToString_;
  goog.isArray(b) || (b = [String(b)]);
  this.queryData_.setValues(a, b);
  return this
};
goog.Uri.prototype.getParameterValues = function(a) {
  return this.queryData_.getValues(a)
};
goog.Uri.prototype.getParameterValue = function(a) {
  return this.queryData_.get(a)
};
goog.Uri.prototype.getFragment = function() {
  return this.fragment_
};
goog.Uri.prototype.setFragment = function(a, b) {
  this.enforceReadOnly();
  delete this.cachedToString_;
  this.fragment_ = b ? goog.Uri.decodeOrEmpty_(a) : a;
  return this
};
goog.Uri.prototype.hasFragment = function() {
  return!!this.fragment_
};
goog.Uri.prototype.hasSameDomainAs = function(a) {
  return(!this.hasDomain() && !a.hasDomain() || this.getDomain() == a.getDomain()) && (!this.hasPort() && !a.hasPort() || this.getPort() == a.getPort())
};
goog.Uri.prototype.makeUnique = function() {
  this.enforceReadOnly();
  this.setParameterValue(goog.Uri.RANDOM_PARAM, goog.string.getRandomString());
  return this
};
goog.Uri.prototype.removeParameter = function(a) {
  this.enforceReadOnly();
  this.queryData_.remove(a);
  return this
};
goog.Uri.prototype.setReadOnly = function(a) {
  this.isReadOnly_ = a;
  return this
};
goog.Uri.prototype.isReadOnly = function() {
  return this.isReadOnly_
};
goog.Uri.prototype.enforceReadOnly = function() {
  if(this.isReadOnly_) {
    throw Error("Tried to modify a read-only Uri");
  }
};
goog.Uri.prototype.setIgnoreCase = function(a) {
  this.ignoreCase_ = a;
  this.queryData_ && this.queryData_.setIgnoreCase(a);
  return this
};
goog.Uri.prototype.getIgnoreCase = function() {
  return this.ignoreCase_
};
goog.Uri.parse = function(a, b) {
  return a instanceof goog.Uri ? a.clone() : new goog.Uri(a, b)
};
goog.Uri.create = function(a, b, c, d, e, f, g, h) {
  h = new goog.Uri(null, h);
  a && h.setScheme(a);
  b && h.setUserInfo(b);
  c && h.setDomain(c);
  d && h.setPort(d);
  e && h.setPath(e);
  f && h.setQueryData(f);
  g && h.setFragment(g);
  return h
};
goog.Uri.resolve = function(a, b) {
  a instanceof goog.Uri || (a = goog.Uri.parse(a));
  b instanceof goog.Uri || (b = goog.Uri.parse(b));
  return a.resolve(b)
};
goog.Uri.removeDotSegments = function(a) {
  if(a == ".." || a == ".") {
    return""
  }else {
    if(!goog.string.contains(a, "./") && !goog.string.contains(a, "/.")) {
      return a
    }else {
      var b = goog.string.startsWith(a, "/");
      a = a.split("/");
      var c = [];
      for(var d = 0;d < a.length;) {
        var e = a[d++];
        if(e == ".") {
          b && d == a.length && c.push("")
        }else {
          if(e == "..") {
            if(c.length > 1 || c.length == 1 && c[0] != "") {
              c.pop()
            }
            b && d == a.length && c.push("")
          }else {
            c.push(e);
            b = true
          }
        }
      }
      return c.join("/")
    }
  }
};
goog.Uri.decodeOrEmpty_ = function(a) {
  return a ? decodeURIComponent(a) : ""
};
goog.Uri.encodeString_ = function(a) {
  if(goog.isString(a)) {
    return encodeURIComponent(a)
  }
  return null
};
goog.Uri.encodeSpecialRegExp_ = /^[a-zA-Z0-9\-_.!~*'():\/;?]*$/;
goog.Uri.encodeSpecialChars_ = function(a, b) {
  var c = null;
  if(goog.isString(a)) {
    c = a;
    goog.Uri.encodeSpecialRegExp_.test(c) || (c = encodeURI(a));
    if(c.search(b) >= 0) {
      c = c.replace(b, goog.Uri.encodeChar_)
    }
  }
  return c
};
goog.Uri.encodeChar_ = function(a) {
  a = a.charCodeAt(0);
  return"%" + (a >> 4 & 15).toString(16) + (a & 15).toString(16)
};
goog.Uri.reDisallowedInSchemeOrUserInfo_ = /[#\/\?@]/g;
goog.Uri.reDisallowedInPath_ = /[\#\?]/g;
goog.Uri.reDisallowedInQuery_ = /[\#\?@]/g;
goog.Uri.reDisallowedInFragment_ = /#/g;
goog.Uri.haveSameDomain = function(a, b) {
  var c = goog.uri.utils.split(a), d = goog.uri.utils.split(b);
  return c[goog.uri.utils.ComponentIndex.DOMAIN] == d[goog.uri.utils.ComponentIndex.DOMAIN] && c[goog.uri.utils.ComponentIndex.PORT] == d[goog.uri.utils.ComponentIndex.PORT]
};
goog.Uri.QueryData = function(a, b, c) {
  this.encodedQuery_ = a || null;
  this.uri_ = b || null;
  this.ignoreCase_ = !!c
};
goog.Uri.QueryData.prototype.ensureKeyMapInitialized_ = function() {
  if(!this.keyMap_) {
    this.keyMap_ = new goog.structs.Map;
    if(this.encodedQuery_) {
      var a = this.encodedQuery_.split("&");
      for(var b = 0;b < a.length;b++) {
        var c = a[b].indexOf("="), d = null, e = null;
        if(c >= 0) {
          d = a[b].substring(0, c);
          e = a[b].substring(c + 1)
        }else {
          d = a[b]
        }
        d = goog.string.urlDecode(d);
        d = this.getKeyName_(d);
        this.add(d, e ? goog.string.urlDecode(e) : "")
      }
    }
  }
};
goog.Uri.QueryData.createFromMap = function(a, b, c) {
  var d = goog.structs.getKeys(a);
  if(typeof d == "undefined") {
    throw Error("Keys are undefined");
  }
  return goog.Uri.QueryData.createFromKeysValues(d, goog.structs.getValues(a), b, c)
};
goog.Uri.QueryData.createFromKeysValues = function(a, b, c, d) {
  if(a.length != b.length) {
    throw Error("Mismatched lengths for keys/values");
  }
  c = new goog.Uri.QueryData(null, c, d);
  for(d = 0;d < a.length;d++) {
    c.add(a[d], b[d])
  }
  return c
};
goog.Uri.QueryData.prototype.keyMap_ = null;
goog.Uri.QueryData.prototype.count_ = null;
goog.Uri.QueryData.decodedQuery_ = null;
goog.Uri.QueryData.prototype.getCount = function() {
  this.ensureKeyMapInitialized_();
  return this.count_
};
goog.Uri.QueryData.prototype.add = function(a, b) {
  this.ensureKeyMapInitialized_();
  this.invalidateCache_();
  a = this.getKeyName_(a);
  if(this.containsKey(a)) {
    var c = this.keyMap_.get(a);
    goog.isArray(c) ? c.push(b) : this.keyMap_.set(a, [c, b])
  }else {
    this.keyMap_.set(a, b)
  }
  this.count_++;
  return this
};
goog.Uri.QueryData.prototype.remove = function(a) {
  this.ensureKeyMapInitialized_();
  a = this.getKeyName_(a);
  if(this.keyMap_.containsKey(a)) {
    this.invalidateCache_();
    var b = this.keyMap_.get(a);
    if(goog.isArray(b)) {
      this.count_ -= b.length
    }else {
      this.count_--
    }
    return this.keyMap_.remove(a)
  }
  return false
};
goog.Uri.QueryData.prototype.clear = function() {
  this.invalidateCache_();
  this.keyMap_ && this.keyMap_.clear();
  this.count_ = 0
};
goog.Uri.QueryData.prototype.isEmpty = function() {
  this.ensureKeyMapInitialized_();
  return this.count_ == 0
};
goog.Uri.QueryData.prototype.containsKey = function(a) {
  this.ensureKeyMapInitialized_();
  a = this.getKeyName_(a);
  return this.keyMap_.containsKey(a)
};
goog.Uri.QueryData.prototype.containsValue = function(a) {
  var b = this.getValues();
  return goog.array.contains(b, a)
};
goog.Uri.QueryData.prototype.getKeys = function() {
  this.ensureKeyMapInitialized_();
  var a = this.keyMap_.getValues(), b = this.keyMap_.getKeys(), c = [];
  for(var d = 0;d < b.length;d++) {
    var e = a[d];
    if(goog.isArray(e)) {
      for(var f = 0;f < e.length;f++) {
        c.push(b[d])
      }
    }else {
      c.push(b[d])
    }
  }
  return c
};
goog.Uri.QueryData.prototype.getValues = function(a) {
  this.ensureKeyMapInitialized_();
  if(a) {
    a = this.getKeyName_(a);
    if(this.containsKey(a)) {
      var b = this.keyMap_.get(a);
      if(goog.isArray(b)) {
        return b
      }else {
        a = [];
        a.push(b)
      }
    }else {
      a = []
    }
  }else {
    b = this.keyMap_.getValues();
    a = [];
    for(var c = 0;c < b.length;c++) {
      var d = b[c];
      goog.isArray(d) ? goog.array.extend(a, d) : a.push(d)
    }
  }
  return a
};
goog.Uri.QueryData.prototype.set = function(a, b) {
  this.ensureKeyMapInitialized_();
  this.invalidateCache_();
  a = this.getKeyName_(a);
  if(this.containsKey(a)) {
    var c = this.keyMap_.get(a);
    if(goog.isArray(c)) {
      this.count_ -= c.length
    }else {
      this.count_--
    }
  }
  this.keyMap_.set(a, b);
  this.count_++;
  return this
};
goog.Uri.QueryData.prototype.get = function(a, b) {
  this.ensureKeyMapInitialized_();
  a = this.getKeyName_(a);
  if(this.containsKey(a)) {
    var c = this.keyMap_.get(a);
    return goog.isArray(c) ? c[0] : c
  }else {
    return b
  }
};
goog.Uri.QueryData.prototype.setValues = function(a, b) {
  this.ensureKeyMapInitialized_();
  this.invalidateCache_();
  a = this.getKeyName_(a);
  if(this.containsKey(a)) {
    var c = this.keyMap_.get(a);
    if(goog.isArray(c)) {
      this.count_ -= c.length
    }else {
      this.count_--
    }
  }
  if(b.length > 0) {
    this.keyMap_.set(a, b);
    this.count_ += b.length
  }
};
goog.Uri.QueryData.prototype.toString = function() {
  if(this.encodedQuery_) {
    return this.encodedQuery_
  }
  if(!this.keyMap_) {
    return""
  }
  var a = [], b = 0, c = this.keyMap_.getKeys();
  for(var d = 0;d < c.length;d++) {
    var e = c[d], f = goog.string.urlEncode(e);
    e = this.keyMap_.get(e);
    if(goog.isArray(e)) {
      for(var g = 0;g < e.length;g++) {
        b > 0 && a.push("&");
        a.push(f);
        e[g] !== "" && a.push("=", goog.string.urlEncode(e[g]));
        b++
      }
    }else {
      b > 0 && a.push("&");
      a.push(f);
      e !== "" && a.push("=", goog.string.urlEncode(e));
      b++
    }
  }
  return this.encodedQuery_ = a.join("")
};
goog.Uri.QueryData.prototype.toDecodedString = function() {
  if(!this.decodedQuery_) {
    this.decodedQuery_ = goog.Uri.decodeOrEmpty_(this.toString())
  }
  return this.decodedQuery_
};
goog.Uri.QueryData.prototype.invalidateCache_ = function() {
  delete this.decodedQuery_;
  delete this.encodedQuery_;
  this.uri_ && delete this.uri_.cachedToString_
};
goog.Uri.QueryData.prototype.filterKeys = function(a) {
  this.ensureKeyMapInitialized_();
  goog.structs.forEach(this.keyMap_, function(b, c) {
    goog.array.contains(a, c) || this.remove(c)
  }, this);
  return this
};
goog.Uri.QueryData.prototype.clone = function() {
  var a = new goog.Uri.QueryData;
  if(this.decodedQuery_) {
    a.decodedQuery_ = this.decodedQuery_
  }
  if(this.encodedQuery_) {
    a.encodedQuery_ = this.encodedQuery_
  }
  if(this.keyMap_) {
    a.keyMap_ = this.keyMap_.clone()
  }
  return a
};
goog.Uri.QueryData.prototype.getKeyName_ = function(a) {
  a = String(a);
  if(this.ignoreCase_) {
    a = a.toLowerCase()
  }
  return a
};
goog.Uri.QueryData.prototype.setIgnoreCase = function(a) {
  if(a && !this.ignoreCase_) {
    this.ensureKeyMapInitialized_();
    this.invalidateCache_();
    goog.structs.forEach(this.keyMap_, function(b, c) {
      var d = c.toLowerCase();
      if(c != d) {
        this.remove(c);
        this.add(d, b)
      }
    }, this)
  }
  this.ignoreCase_ = a
};
goog.Uri.QueryData.prototype.extend = function() {
  for(var a = 0;a < arguments.length;a++) {
    goog.structs.forEach(arguments[a], function(b, c) {
      this.add(c, b)
    }, this)
  }
};bot.action = {};
bot.action.isShown_ = function(a) {
  return bot.dom.isShown(a, true)
};
bot.action.checkShown_ = function(a) {
  if(!bot.action.isShown_(a)) {
    throw new bot.Error(bot.ErrorCode.ELEMENT_NOT_VISIBLE, "Element is not currently visible and may not be manipulated");
  }
};
bot.action.checkEnabled_ = function(a) {
  if(!bot.dom.isEnabled(a)) {
    throw new bot.Error(bot.ErrorCode.INVALID_ELEMENT_STATE, "Element is not currently enabled and may not be manipulated");
  }
};
bot.action.isSelectable = function(a) {
  if(bot.dom.isElement(a, goog.dom.TagName.OPTION)) {
    return true
  }
  if(bot.dom.isElement(a, goog.dom.TagName.INPUT)) {
    a = a.type.toLowerCase();
    return a == "checkbox" || a == "radio"
  }
  return false
};
bot.action.isTextual = function(a) {
  if(bot.dom.isElement(a, goog.dom.TagName.TEXTAREA)) {
    return true
  }
  if(bot.dom.isElement(a, goog.dom.TagName.INPUT)) {
    a = a.type.toLowerCase();
    return a == "text" || a == "password" || a == "email" || a == "search"
  }
  return false
};
bot.action.isSelected = function(a) {
  if(!bot.action.isSelectable(a)) {
    throw new bot.Error(bot.ErrorCode.ELEMENT_NOT_SELECTABLE, "Element is not selectable");
  }
  var b = "selected", c = a.type && a.type.toLowerCase();
  if("checkbox" == c || "radio" == c) {
    b = "checked"
  }
  return!!bot.dom.getProperty(a, b)
};
bot.action.isSelectElement_ = function(a) {
  return bot.dom.isElement(a, goog.dom.TagName.SELECT)
};
bot.action.selectInputElement_ = function(a, b) {
  var c = a.type.toLowerCase();
  if(c == "checkbox" || c == "radio") {
    if(a.checked != b) {
      if(a.type == "radio" && !b) {
        throw new bot.Error(bot.ErrorCode.INVALID_ELEMENT_STATE, "You may not deselect a radio button");
      }
      if(b != bot.action.isSelected(a)) {
        a.checked = b;
        bot.events.fire(a, goog.events.EventType.CHANGE)
      }
    }
  }else {
    throw new bot.Error(bot.ErrorCode.ELEMENT_NOT_SELECTABLE, "You may not select an unselectable input element: " + a.type);
  }
};
bot.action.selectOptionElement_ = function(a, b) {
  var c = goog.dom.getAncestor(a, bot.action.isSelectElement_);
  if(!c.multiple && !b) {
    throw new bot.Error(bot.ErrorCode.ELEMENT_NOT_SELECTABLE, "You may not deselect an option within a select that does not support multiple selections.");
  }
  if(b != bot.action.isSelected(a)) {
    a.selected = b;
    bot.events.fire(c, goog.events.EventType.CHANGE)
  }
};
bot.action.setSelected = function(a, b) {
  bot.action.checkEnabled_(a);
  bot.action.checkShown_(a);
  if(bot.dom.isElement(a, goog.dom.TagName.INPUT)) {
    bot.action.selectInputElement_(a, b)
  }else {
    if(bot.dom.isElement(a, goog.dom.TagName.OPTION)) {
      bot.action.selectOptionElement_(a, b)
    }else {
      throw new bot.Error(bot.ErrorCode.ELEMENT_NOT_SELECTABLE, "You may not select an unselectable element: " + a.tagName);
    }
  }
};
bot.action.toggle = function(a) {
  if(bot.dom.isElement(a, goog.dom.TagName.INPUT) && "radio" == a.type) {
    throw new bot.Error(bot.ErrorCode.INVALID_ELEMENT_STATE, "You may not toggle a radio button");
  }
  bot.action.setSelected(a, !bot.action.isSelected(a));
  return bot.action.isSelected(a)
};
bot.action.focusOnElement = function(a, b) {
  var c = b || bot.dom.getActiveElement(a);
  bot.action.checkShown_(a);
  if(a != c) {
    if(c) {
      if(goog.isFunction(c.blur) || goog.userAgent.IE && goog.isObject(c.blur)) {
        c.blur()
      }
      goog.userAgent.IE && !goog.userAgent.isVersion(8) && goog.dom.getWindow(goog.dom.getOwnerDocument(a)).focus()
    }
    if(goog.isFunction(a.focus) || goog.userAgent.IE && goog.isObject(a.focus)) {
      a.focus()
    }
  }
};
bot.action.clear = function(a) {
  if(bot.action.isTextual(a)) {
    if(bot.dom.getProperty(a, "readOnly")) {
      throw new bot.Error(bot.ErrorCode.INVALID_ELEMENT_STATE, "Element is readonly and may not be cleared.");
    }
    if(a.value != "") {
      bot.action.checkShown_(a);
      bot.action.checkEnabled_(a);
      bot.action.focusOnElement(a);
      a.value = "";
      bot.events.fire(a, goog.events.EventType.CHANGE)
    }
  }
};
bot.action.isForm_ = function(a) {
  return bot.dom.isElement(a, goog.dom.TagName.FORM)
};
bot.action.submit = function(a) {
  a = goog.dom.getAncestor(a, bot.action.isForm_, true);
  if(!a) {
    throw new bot.Error(bot.ErrorCode.INVALID_ELEMENT_STATE, "Element was not in a form, so could not submit.");
  }
  bot.events.fire(a, goog.events.EventType.SUBMIT) && a.submit()
};
bot.action.click = function(a) {
  bot.action.checkShown_(a);
  var b = bot.dom.getActiveElement(a);
  goog.isFunction(a.scrollIntoView) && a.scrollIntoView();
  var c = goog.style.getBounds(a);
  c = {x:c.left + c.width / 2, y:c.top + c.height / 2, button:undefined, bubble:undefined, alt:undefined, control:undefined, shift:undefined, meta:undefined, related:undefined};
  bot.events.fire(a, goog.events.EventType.MOUSEOVER);
  if(bot.action.isShown_(a)) {
    bot.events.fire(a, goog.events.EventType.MOUSEMOVE, c);
    if(bot.action.isShown_(a)) {
      bot.events.fire(a, goog.events.EventType.MOUSEDOWN, c);
      if(bot.action.isShown_(a)) {
        bot.action.focusOnElement(a, b);
        if(bot.action.isShown_(a)) {
          bot.events.fire(a, goog.events.EventType.MOUSEUP, c);
          if(bot.action.isShown_(a)) {
            b = bot.events.fire(a, goog.events.EventType.CLICK, c);
            if((goog.userAgent.IE || goog.userAgent.GECKO) && !bot.events.isFirefoxExtension()) {
              if(b) {
                (a = goog.dom.getAncestor(a, function(d) {
                  return bot.dom.isElement(d, goog.dom.TagName.A)
                }, true)) && a.href && bot.action.followHref_(a)
              }
            }
          }
        }
      }
    }
  }
};
bot.events.isFirefoxExtension = function() {
  try {
    Components.classes["@mozilla.org/uuid-generator;1"].getService(Components.interfaces.nsIUUIDGenerator);
    return true
  }catch(a) {
    return false
  }
};
bot.action.followHref_ = function(a) {
  var b = a.href, c = goog.dom.getWindow(goog.dom.getOwnerDocument(a));
  b = goog.Uri.resolve(c.location.href, b);
  if(a.target) {
    c.open(b, a.target)
  }else {
    c.location.href = b
  }
};
bot.action.back = function(a) {
  a = bot.action.checkNumPages_(a);
  bot.getWindow().history.go(-a)
};
bot.action.forward = function(a) {
  a = bot.action.checkNumPages_(a);
  bot.getWindow().history.go(a)
};
bot.action.checkNumPages_ = function(a) {
  a = goog.isDef(a) ? a : 1;
  if(a <= 0) {
    throw new bot.Error(bot.ErrorCode.UNKNOWN_ERROR, "number of pages must be positive");
  }
  if(a >= bot.getWindow().history.length) {
    throw new bot.Error(bot.ErrorCode.UNKNOWN_ERROR, "number of pages must be less than the length of the browser history");
  }
  return a
};goog.dom.selection = {};
goog.dom.selection.setStart = function(a, b) {
  if(goog.dom.selection.useSelectionProperties_(a)) {
    a.selectionStart = b
  }else {
    if(goog.userAgent.IE) {
      var c = goog.dom.selection.getRangeIe_(a), d = c[0];
      if(d.inRange(c[1])) {
        b = goog.dom.selection.canonicalizePositionIe_(a, b);
        d.collapse(true);
        d.move("character", b);
        d.select()
      }
    }
  }
};
goog.dom.selection.getStart = function(a) {
  return goog.dom.selection.getEndPoints_(a, true)[0]
};
goog.dom.selection.getEndPointsTextareaIe_ = function(a, b, c) {
  b = b.duplicate();
  var d = a.text, e = d, f = b.text, g = f;
  for(var h = false;!h;) {
    if(a.compareEndPoints("StartToEnd", a) == 0) {
      h = true
    }else {
      a.moveEnd("character", -1);
      if(a.text == d) {
        e += "\r\n"
      }else {
        h = true
      }
    }
  }
  if(c) {
    return[e.length, -1]
  }
  for(a = false;!a;) {
    if(b.compareEndPoints("StartToEnd", b) == 0) {
      a = true
    }else {
      b.moveEnd("character", -1);
      if(b.text == f) {
        g += "\r\n"
      }else {
        a = true
      }
    }
  }
  return[e.length, e.length + g.length]
};
goog.dom.selection.getEndPoints = function(a) {
  return goog.dom.selection.getEndPoints_(a, false)
};
goog.dom.selection.getEndPoints_ = function(a, b) {
  var c = 0, d = 0;
  if(goog.dom.selection.useSelectionProperties_(a)) {
    c = a.selectionStart;
    d = b ? -1 : a.selectionEnd
  }else {
    if(goog.userAgent.IE) {
      var e = goog.dom.selection.getRangeIe_(a), f = e[0];
      e = e[1];
      if(f.inRange(e)) {
        f.setEndPoint("EndToStart", e);
        if(a.type == "textarea") {
          return goog.dom.selection.getEndPointsTextareaIe_(f, e, b)
        }
        c = f.text.length;
        d = b ? -1 : f.text.length + e.text.length
      }
    }
  }
  return[c, d]
};
goog.dom.selection.setEnd = function(a, b) {
  if(goog.dom.selection.useSelectionProperties_(a)) {
    a.selectionEnd = b
  }else {
    if(goog.userAgent.IE) {
      var c = goog.dom.selection.getRangeIe_(a), d = c[1];
      if(c[0].inRange(d)) {
        b = goog.dom.selection.canonicalizePositionIe_(a, b);
        c = goog.dom.selection.canonicalizePositionIe_(a, goog.dom.selection.getStart(a));
        d.collapse(true);
        d.moveEnd("character", b - c);
        d.select()
      }
    }
  }
};
goog.dom.selection.getEnd = function(a) {
  return goog.dom.selection.getEndPoints_(a, false)[1]
};
goog.dom.selection.setCursorPosition = function(a, b) {
  if(goog.dom.selection.useSelectionProperties_(a)) {
    a.selectionStart = b;
    a.selectionEnd = b
  }else {
    if(goog.userAgent.IE) {
      b = goog.dom.selection.canonicalizePositionIe_(a, b);
      var c = a.createTextRange();
      c.collapse(true);
      c.move("character", b);
      c.select()
    }
  }
};
goog.dom.selection.setText = function(a, b) {
  if(goog.dom.selection.useSelectionProperties_(a)) {
    var c = a.value, d = a.selectionStart, e = c.substr(0, d);
    c = c.substr(a.selectionEnd);
    a.value = e + b + c;
    a.selectionStart = d;
    a.selectionEnd = d + b.length
  }else {
    if(goog.userAgent.IE) {
      e = goog.dom.selection.getRangeIe_(a);
      d = e[1];
      if(e[0].inRange(d)) {
        e = d.duplicate();
        d.text = b;
        d.setEndPoint("StartToStart", e);
        d.select()
      }
    }else {
      throw Error("Cannot set the selection end");
    }
  }
};
goog.dom.selection.getText = function(a) {
  if(goog.dom.selection.useSelectionProperties_(a)) {
    return a.value.substring(a.selectionStart, a.selectionEnd)
  }
  if(goog.userAgent.IE) {
    var b = goog.dom.selection.getRangeIe_(a), c = b[1];
    if(b[0].inRange(c)) {
      if(a.type == "textarea") {
        return goog.dom.selection.getSelectionRangeText_(c)
      }
    }else {
      return""
    }
    return c.text
  }
  throw Error("Cannot get the selection text");
};
goog.dom.selection.getSelectionRangeText_ = function(a) {
  a = a.duplicate();
  var b = a.text, c = b;
  for(var d = false;!d;) {
    if(a.compareEndPoints("StartToEnd", a) == 0) {
      d = true
    }else {
      a.moveEnd("character", -1);
      if(a.text == b) {
        c += "\r\n"
      }else {
        d = true
      }
    }
  }
  return c
};
goog.dom.selection.getRangeIe_ = function(a) {
  var b = a.ownerDocument || a.document, c = b.selection.createRange();
  if(a.type == "textarea") {
    b = b.body.createTextRange();
    b.moveToElementText(a)
  }else {
    b = a.createTextRange()
  }
  return[b, c]
};
goog.dom.selection.canonicalizePositionIe_ = function(a, b) {
  if(a.type == "textarea") {
    var c = a.value.substring(0, b);
    b = goog.string.canonicalizeNewlines(c).length
  }
  return b
};
goog.dom.selection.useSelectionProperties_ = function(a) {
  try {
    return typeof a.selectionStart == "number"
  }catch(b) {
    return false
  }
};goog.events.KeyCodes = {MAC_ENTER:3, BACKSPACE:8, TAB:9, NUM_CENTER:12, ENTER:13, SHIFT:16, CTRL:17, ALT:18, PAUSE:19, CAPS_LOCK:20, ESC:27, SPACE:32, PAGE_UP:33, PAGE_DOWN:34, END:35, HOME:36, LEFT:37, UP:38, RIGHT:39, DOWN:40, PRINT_SCREEN:44, INSERT:45, DELETE:46, ZERO:48, ONE:49, TWO:50, THREE:51, FOUR:52, FIVE:53, SIX:54, SEVEN:55, EIGHT:56, NINE:57, QUESTION_MARK:63, A:65, B:66, C:67, D:68, E:69, F:70, G:71, H:72, I:73, J:74, K:75, L:76, M:77, N:78, O:79, P:80, Q:81, R:82, S:83, T:84, U:85, 
V:86, W:87, X:88, Y:89, Z:90, META:91, CONTEXT_MENU:93, NUM_ZERO:96, NUM_ONE:97, NUM_TWO:98, NUM_THREE:99, NUM_FOUR:100, NUM_FIVE:101, NUM_SIX:102, NUM_SEVEN:103, NUM_EIGHT:104, NUM_NINE:105, NUM_MULTIPLY:106, NUM_PLUS:107, NUM_MINUS:109, NUM_PERIOD:110, NUM_DIVISION:111, F1:112, F2:113, F3:114, F4:115, F5:116, F6:117, F7:118, F8:119, F9:120, F10:121, F11:122, F12:123, NUMLOCK:144, SEMICOLON:186, DASH:189, EQUALS:187, COMMA:188, PERIOD:190, SLASH:191, APOSTROPHE:192, SINGLE_QUOTE:222, OPEN_SQUARE_BRACKET:219, 
BACKSLASH:220, CLOSE_SQUARE_BRACKET:221, WIN_KEY:224, MAC_FF_META:224, WIN_IME:229, PHANTOM:255};
goog.events.KeyCodes.isTextModifyingKeyEvent = function(a) {
  if(a.altKey && !a.ctrlKey || a.metaKey || a.keyCode >= goog.events.KeyCodes.F1 && a.keyCode <= goog.events.KeyCodes.F12) {
    return false
  }
  switch(a.keyCode) {
    case goog.events.KeyCodes.ALT:
    ;
    case goog.events.KeyCodes.CAPS_LOCK:
    ;
    case goog.events.KeyCodes.CONTEXT_MENU:
    ;
    case goog.events.KeyCodes.CTRL:
    ;
    case goog.events.KeyCodes.DOWN:
    ;
    case goog.events.KeyCodes.END:
    ;
    case goog.events.KeyCodes.ESC:
    ;
    case goog.events.KeyCodes.HOME:
    ;
    case goog.events.KeyCodes.INSERT:
    ;
    case goog.events.KeyCodes.LEFT:
    ;
    case goog.events.KeyCodes.MAC_FF_META:
    ;
    case goog.events.KeyCodes.META:
    ;
    case goog.events.KeyCodes.NUMLOCK:
    ;
    case goog.events.KeyCodes.NUM_CENTER:
    ;
    case goog.events.KeyCodes.PAGE_DOWN:
    ;
    case goog.events.KeyCodes.PAGE_UP:
    ;
    case goog.events.KeyCodes.PAUSE:
    ;
    case goog.events.KeyCodes.PHANTOM:
    ;
    case goog.events.KeyCodes.PRINT_SCREEN:
    ;
    case goog.events.KeyCodes.RIGHT:
    ;
    case goog.events.KeyCodes.SHIFT:
    ;
    case goog.events.KeyCodes.UP:
    ;
    case goog.events.KeyCodes.WIN_KEY:
      return false;
    default:
      return true
  }
};
goog.events.KeyCodes.firesKeyPressEvent = function(a, b, c, d, e) {
  if(!goog.userAgent.IE && !(goog.userAgent.WEBKIT && goog.userAgent.isVersion("525"))) {
    return true
  }
  if(goog.userAgent.MAC && e) {
    return goog.events.KeyCodes.isCharacterKey(a)
  }
  if(e && !d) {
    return false
  }
  if(!c && (b == goog.events.KeyCodes.CTRL || b == goog.events.KeyCodes.ALT)) {
    return false
  }
  if(goog.userAgent.IE && d && b == a) {
    return false
  }
  switch(a) {
    case goog.events.KeyCodes.ENTER:
      return true;
    case goog.events.KeyCodes.ESC:
      return!goog.userAgent.WEBKIT
  }
  return goog.events.KeyCodes.isCharacterKey(a)
};
goog.events.KeyCodes.isCharacterKey = function(a) {
  if(a >= goog.events.KeyCodes.ZERO && a <= goog.events.KeyCodes.NINE) {
    return true
  }
  if(a >= goog.events.KeyCodes.NUM_ZERO && a <= goog.events.KeyCodes.NUM_MULTIPLY) {
    return true
  }
  if(a >= goog.events.KeyCodes.A && a <= goog.events.KeyCodes.Z) {
    return true
  }
  if(goog.userAgent.WEBKIT && a == 0) {
    return true
  }
  switch(a) {
    case goog.events.KeyCodes.SPACE:
    ;
    case goog.events.KeyCodes.QUESTION_MARK:
    ;
    case goog.events.KeyCodes.NUM_PLUS:
    ;
    case goog.events.KeyCodes.NUM_MINUS:
    ;
    case goog.events.KeyCodes.NUM_PERIOD:
    ;
    case goog.events.KeyCodes.NUM_DIVISION:
    ;
    case goog.events.KeyCodes.SEMICOLON:
    ;
    case goog.events.KeyCodes.DASH:
    ;
    case goog.events.KeyCodes.EQUALS:
    ;
    case goog.events.KeyCodes.COMMA:
    ;
    case goog.events.KeyCodes.PERIOD:
    ;
    case goog.events.KeyCodes.SLASH:
    ;
    case goog.events.KeyCodes.APOSTROPHE:
    ;
    case goog.events.KeyCodes.SINGLE_QUOTE:
    ;
    case goog.events.KeyCodes.OPEN_SQUARE_BRACKET:
    ;
    case goog.events.KeyCodes.BACKSLASH:
    ;
    case goog.events.KeyCodes.CLOSE_SQUARE_BRACKET:
      return true;
    default:
      return false
  }
};bot.keys = {};
bot.keys.CHAR_TO_KEYCODE_MAP_ = function() {
  var a = {"!":goog.events.KeyCodes.ONE, "@":goog.events.KeyCodes.TWO, "#":goog.events.KeyCodes.THREE, $:goog.events.KeyCodes.FOUR, "%":goog.events.KeyCodes.FIVE, "^":goog.events.KeyCodes.SIX, "&":goog.events.KeyCodes.SEVEN, "*":goog.events.KeyCodes.EIGHT, "(":goog.events.KeyCodes.NINE, ")":goog.events.KeyCodes.ZERO};
  if(goog.userAgent.GECKO) {
    goog.object.extend(a, {";":59, ":":59, "=":61, "+":61, ",":188, "<":188, "-":109, _:109, ".":190, ">":190, "/":191, "?":191, "`":192, "~":192, "[":219, "{":219, "\\":220, "|":220, "]":221, "}":221, "'":222, '"':222})
  }else {
    if(goog.userAgent.IE) {
      goog.object.extend(a, {";":186, ":":186, "=":187, "+":187, ",":188, "<":188, "-":189, _:189, ".":190, ">":190, "/":191, "?":191, "`":192, "~":192, "[":219, "{":219, "\\":220, "|":220, "]":221, "}":221, "'":222, '"':222})
    }else {
      goog.userAgent.OPERA && goog.object.extend(a, {";":59, ":":59, "=":61, "+":61, ",":44, "<":44, "-":45, _:45, ".":46, ">":46, "/":47, "?":47, "`":96, "~":96, "[":91, "{":91, "\\":92, "|":92, "]":93, "}":93, "'":39, '"':39})
    }
  }
  return a
}();
bot.keys.NUMPAD_TO_CHAR_MAP_ = function() {
  var a = {};
  a[goog.events.KeyCodes.NUM_ZERO] = "0";
  a[goog.events.KeyCodes.NUM_ONE] = "1";
  a[goog.events.KeyCodes.NUM_TWO] = "2";
  a[goog.events.KeyCodes.NUM_THREE] = "3";
  a[goog.events.KeyCodes.NUM_FOUR] = "4";
  a[goog.events.KeyCodes.NUM_FIVE] = "5";
  a[goog.events.KeyCodes.NUM_SIX] = "6";
  a[goog.events.KeyCodes.NUM_SEVEN] = "7";
  a[goog.events.KeyCodes.NUM_EIGHT] = "8";
  a[goog.events.KeyCodes.NUM_NINE] = "9";
  a[goog.events.KeyCodes.NUM_MULTIPLY] = "*";
  a[goog.events.KeyCodes.NUM_PLUS] = "+";
  a[goog.events.KeyCodes.NUM_MINUS] = "-";
  a[goog.events.KeyCodes.NUM_PERIOD] = ".";
  a[goog.events.KeyCodes.NUM_DIVISION] = "/";
  return a
}();
bot.keys.MODIFIER_TO_NAME_MAP_ = function() {
  var a = {};
  a[goog.events.KeyCodes.ALT] = "alt";
  a[goog.events.KeyCodes.CTRL] = "ctrl";
  a[goog.events.KeyCodes.META] = "meta";
  a[goog.events.KeyCodes.SHIFT] = "shift";
  return a
}();
bot.keys.NEW_LINE_ = goog.userAgent.IE ? "\r\n" : "\n";
bot.keys.keyCode_ = function(a) {
  if(a.length != 1) {
    throw new bot.Error(bot.ErrorCode.UNKNOWN_ERROR, 'Expected a single character, got: "' + a + '"');
  }
  return bot.keys.CHAR_TO_KEYCODE_MAP_[a] || a.toUpperCase().charCodeAt(0)
};
bot.keys.genKeyParams_ = function(a, b, c) {
  a = {keyCode:a, charCode:b, alt:undefined, ctrl:undefined, shift:undefined, meta:undefined};
  for(var d in c) {
    a[d] = c[d]
  }
  return a
};
bot.keys.sendCharKey_ = function(a, b, c, d, e) {
  var f = c.charCodeAt(0), g = bot.keys.genKeyParams_(b, f, e);
  b = bot.keys.genKeyParams_(b, 0, e);
  e = goog.userAgent.GECKO ? bot.keys.genKeyParams_(0, f, e) : goog.userAgent.IE ? bot.keys.genKeyParams_(f, 0, e) : bot.keys.genKeyParams_(f, f, e);
  bot.events.fire(a, goog.events.EventType.KEYDOWN, g);
  bot.events.fire(a, goog.events.EventType.KEYPRESS, e);
  if(!goog.userAgent.GECKO && f && d) {
    goog.dom.selection.setText(a, c);
    goog.dom.selection.setStart(a, goog.dom.selection.getStart(a) + 1);
    goog.userAgent.IE || bot.events.fire(a, goog.events.EventType.INPUT)
  }
  bot.events.fire(a, goog.events.EventType.KEYUP, b)
};
bot.keys.handleBackspaceDelete_ = function(a, b) {
  if(!b == goog.events.KeyCodes.BACKSPACE && !b == goog.events.KeyCodes.DELETE) {
    throw new bot.Error(bot.ErrorCode.UNSUPPORTED_OPERATION, "handleBackspaceDelete_ called with non backspace or delete key.");
  }
  if(!goog.userAgent.GECKO) {
    var c = goog.dom.selection.getEndPoints(a);
    if(b == goog.events.KeyCodes.BACKSPACE && c[0] == c[1]) {
      goog.dom.selection.setStart(a, c[1] - 1);
      goog.dom.selection.setEnd(a, c[1])
    }else {
      goog.dom.selection.setEnd(a, c[1] + 1)
    }
    c = goog.dom.selection.getEndPoints(a);
    c = !(c[0] == a.value.length || c[1] == 0);
    goog.dom.selection.setText(a, "");
    !goog.userAgent.IE && c && bot.events.fire(a, goog.events.EventType.INPUT)
  }
};
bot.keys.sendSpecialKey_ = function(a, b, c, d) {
  var e = bot.keys.genKeyParams_(b, 0, d), f;
  if(goog.userAgent.GECKO) {
    f = bot.keys.genKeyParams_(b, 0, d)
  }else {
    if(b == goog.events.KeyCodes.ENTER) {
      f = bot.keys.genKeyParams_(b, b, d)
    }
  }
  bot.events.fire(a, goog.events.EventType.KEYDOWN, e);
  f && bot.events.fire(a, goog.events.EventType.KEYPRESS, f);
  if(!goog.userAgent.GECKO && b == goog.events.KeyCodes.ENTER && a.tagName.toUpperCase() == goog.dom.TagName.TEXTAREA) {
    goog.dom.selection.setText(a, bot.keys.NEW_LINE_);
    goog.dom.selection.setStart(a, goog.dom.selection.getStart(a) + 1);
    goog.userAgent.IE || bot.events.fire(a, goog.events.EventType.INPUT)
  }
  if(b == goog.events.KeyCodes.LEFT) {
    goog.dom.selection.setCursorPosition(a, goog.dom.selection.getStart(a) - 1)
  }else {
    b == goog.events.KeyCodes.RIGHT && goog.dom.selection.setCursorPosition(a, goog.dom.selection.getStart(a) + 1)
  }
  if(c && (b == goog.events.KeyCodes.BACKSPACE || b == goog.events.KeyCodes.DELETE)) {
    bot.keys.handleBackspaceDelete_(a, b)
  }
  bot.events.fire(a, goog.events.EventType.KEYUP, e)
};
bot.keys.sendModifierKey_ = function(a, b, c) {
  var d = bot.keys.MODIFIER_TO_NAME_MAP_[b];
  if(!d) {
    throw new bot.Error(bot.ErrorCode.UNSUPPORTED_OPERATION, "Unrecognized toggle key: " + b);
  }
  var e = c[d], f = bot.keys.genKeyParams_(b, 0, c);
  if(e) {
    if(goog.userAgent.LINUX && b == goog.events.KeyCodes.SHIFT) {
      f = bot.keys.genKeyParams_(0, 0, c)
    }
    bot.events.fire(a, goog.events.EventType.KEYUP, f)
  }else {
    if(goog.userAgent.GECKO && b == goog.events.KeyCodes.META) {
      f = bot.keys.genKeyParams_(0, 0, c)
    }
    bot.events.fire(a, goog.events.EventType.KEYDOWN, f);
    goog.userAgent.GECKO && b == goog.events.KeyCodes.META && bot.events.fire(a, goog.events.EventType.KEYPRESS, f)
  }
  c[d] = !c[d]
};
bot.keys.type = function(a) {
  bot.action.focusOnElement(a);
  var b = {alt:false, ctrl:false, meta:false, shift:false}, c = bot.action.isTextual(a);
  c && goog.dom.selection.setCursorPosition(a, a.value.length);
  var d = goog.array.slice(arguments, 1);
  goog.array.forEach(d, function(f) {
    if(goog.isString(f)) {
      for(var g = 0;g < f.length;g++) {
        bot.keys.sendCharKey_(a, bot.keys.keyCode_(f.charAt(g)), f.charAt(g), c, b)
      }
    }else {
      if(f >= goog.events.KeyCodes.NUM_ZERO && f <= goog.events.KeyCodes.NUM_DIVISION) {
        bot.keys.sendCharKey_(a, f, bot.keys.NUMPAD_TO_CHAR_MAP_[f], c, b)
      }else {
        if(bot.keys.MODIFIER_TO_NAME_MAP_[f]) {
          bot.keys.sendModifierKey_(a, f, b)
        }else {
          if(goog.events.KeyCodes.isCharacterKey(f)) {
            throw new bot.Error(bot.ErrorCode.UNSUPPORTED_OPERATION, "bot.keys.type does not support using keycodes for printable characters, excluding the numpad keys. Use strings instead.");
          }else {
            bot.keys.sendSpecialKey_(a, f, c, b)
          }
        }
      }
    }
  });
  for(var e in bot.keys.MODIFIER_TO_NAME_MAP_) {
    d = e;
    b[bot.keys.MODIFIER_TO_NAME_MAP_[d]] && bot.keys.sendModifierKey_(a, d, b)
  }
};goog.json = {};
goog.json.isValid_ = function(a) {
  if(/^\s*$/.test(a)) {
    return false
  }
  return/^[\],:{}\s\u2028\u2029]*$/.test(a.replace(/\\["\\\/bfnrtu]/g, "@").replace(/"[^"\\\n\r\u2028\u2029\x00-\x08\x10-\x1f\x80-\x9f]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, "]").replace(/(?:^|:|,)(?:[\s\u2028\u2029]*\[)+/g, ""))
};
goog.json.parse = function(a) {
  a = String(a);
  if(goog.json.isValid_(a)) {
    try {
      return eval("(" + a + ")")
    }catch(b) {
    }
  }
  throw Error("Invalid JSON string: " + a);
};
goog.json.unsafeParse = function(a) {
  return eval("(" + a + ")")
};
goog.json.serialize = function(a) {
  return(new goog.json.Serializer).serialize(a)
};
goog.json.Serializer = function() {
};
goog.json.Serializer.prototype.serialize = function(a) {
  var b = [];
  this.serialize_(a, b);
  return b.join("")
};
goog.json.Serializer.prototype.serialize_ = function(a, b) {
  switch(typeof a) {
    case "string":
      this.serializeString_(a, b);
      break;
    case "number":
      this.serializeNumber_(a, b);
      break;
    case "boolean":
      b.push(a);
      break;
    case "undefined":
      b.push("null");
      break;
    case "object":
      if(a == null) {
        b.push("null");
        break
      }
      if(goog.isArray(a)) {
        this.serializeArray_(a, b);
        break
      }
      this.serializeObject_(a, b);
      break;
    case "function":
      break;
    default:
      throw Error("Unknown type: " + typeof a);
  }
};
goog.json.Serializer.charToJsonCharCache_ = {'"':'\\"', "\\":"\\\\", "/":"\\/", "\u0008":"\\b", "\u000c":"\\f", "\n":"\\n", "\r":"\\r", "\t":"\\t", "\u000b":"\\u000b"};
goog.json.Serializer.charsToReplace_ = /\uffff/.test("\uffff") ? /[\\\"\x00-\x1f\x7f-\uffff]/g : /[\\\"\x00-\x1f\x7f-\xff]/g;
goog.json.Serializer.prototype.serializeString_ = function(a, b) {
  b.push('"', a.replace(goog.json.Serializer.charsToReplace_, function(c) {
    if(c in goog.json.Serializer.charToJsonCharCache_) {
      return goog.json.Serializer.charToJsonCharCache_[c]
    }
    var d = c.charCodeAt(0), e = "\\u";
    if(d < 16) {
      e += "000"
    }else {
      if(d < 256) {
        e += "00"
      }else {
        if(d < 4096) {
          e += "0"
        }
      }
    }
    return goog.json.Serializer.charToJsonCharCache_[c] = e + d.toString(16)
  }), '"')
};
goog.json.Serializer.prototype.serializeNumber_ = function(a, b) {
  b.push(isFinite(a) && !isNaN(a) ? a : "null")
};
goog.json.Serializer.prototype.serializeArray_ = function(a, b) {
  var c = a.length;
  b.push("[");
  var d = "";
  for(var e = 0;e < c;e++) {
    b.push(d);
    this.serialize_(a[e], b);
    d = ","
  }
  b.push("]")
};
goog.json.Serializer.prototype.serializeObject_ = function(a, b) {
  b.push("{");
  var c = "";
  for(var d in a) {
    if(Object.prototype.hasOwnProperty.call(a, d)) {
      var e = a[d];
      if(typeof e != "function") {
        b.push(c);
        this.serializeString_(d, b);
        b.push(":");
        this.serialize_(e, b);
        c = ","
      }
    }
  }
  b.push("}")
};bot.inject = {};
bot.inject.cache = {};
bot.inject.ELEMENT_KEY = "ELEMENT";
bot.inject.wrapValue = function(a) {
  switch(goog.typeOf(a)) {
    case "string":
    ;
    case "number":
    ;
    case "boolean":
      return a;
    case "function":
      return a.toString();
    case "array":
      return goog.array.map(a, bot.inject.wrapValue);
    case "object":
      a = a;
      if(goog.object.containsKey(a, "tagName") && goog.object.containsKey(a, "nodeType") && a.nodeType == goog.dom.NodeType.ELEMENT) {
        var b = {};
        b[bot.inject.ELEMENT_KEY] = bot.inject.cache.addElement(a);
        return b
      }
      if(goog.isArrayLike(a)) {
        return goog.array.map(a, bot.inject.wrapValue)
      }
      a = goog.object.filter(a, function(c, d) {
        return goog.isNumber(d) || goog.isString(d)
      });
      return goog.object.map(a, bot.inject.wrapValue);
    default:
      return null
  }
};
bot.inject.unwrapValue = function(a, b) {
  if(goog.isArray(a)) {
    return goog.array.map(a, function(c) {
      return bot.inject.unwrapValue(c, b)
    })
  }else {
    if(goog.isObject(a)) {
      return goog.object.containsKey(a, bot.inject.ELEMENT_KEY) ? bot.inject.cache.getElement(a[bot.inject.ELEMENT_KEY], b) : goog.object.map(a, function(c) {
        return bot.inject.unwrapValue(c, b)
      })
    }
  }
  return a
};
bot.inject.executeScript = function(a, b, c) {
  var d;
  try {
    if(goog.isString(a)) {
      a = new Function(a)
    }
    var e = bot.inject.unwrapValue(b), f = a.apply(null, e);
    d = {status:bot.ErrorCode.SUCCESS, value:bot.inject.wrapValue(f)}
  }catch(g) {
    d = bot.inject.wrapError_(g)
  }
  return c ? goog.json.serialize(d) : d
};
bot.inject.wrapError_ = function(a) {
  return{status:goog.object.containsKey(a, "code") ? a.code : bot.ErrorCode.UNKNOWN_ERROR, value:{message:a.message}}
};
bot.inject.cache.CACHE_KEY_ = "$wdc_";
bot.inject.cache.ELEMENT_KEY_PREFIX = ":wdc:";
bot.inject.cache.getCache_ = function(a) {
  a = a || document;
  var b = a[bot.inject.cache.CACHE_KEY_];
  if(!b) {
    b = a[bot.inject.cache.CACHE_KEY_] = {};
    b.nextId = goog.now()
  }
  return b
};
bot.inject.cache.addElement = function(a) {
  var b = bot.inject.cache.getCache_(a.ownerDocument), c = goog.object.findKey(b, function(d) {
    return d == a
  });
  if(!c) {
    c = bot.inject.cache.ELEMENT_KEY_PREFIX + b.nextId++;
    b[c] = a
  }
  return c
};
bot.inject.cache.getElement = function(a, b) {
  a = decodeURIComponent(a);
  var c = b || document, d = bot.inject.cache.getCache_(c);
  if(!goog.object.containsKey(d, a)) {
    throw new bot.Error(bot.ErrorCode.STALE_ELEMENT_REFERENCE, "Element does not exist in cache");
  }
  var e = d[a];
  for(var f = e;f;) {
    if(f == c.documentElement) {
      return e
    }
    f = f.parentNode
  }
  delete d[a];
  throw new bot.Error(bot.ErrorCode.STALE_ELEMENT_REFERENCE, "Element is no longer attached to the DOM");
};bot.locators.tagName = {};
bot.locators.tagName.single = function(a, b) {
  return goog.dom.getDomHelper(b).getElementsByTagNameAndClass(a, null, b)[0] || null
};
bot.locators.tagName.many = function(a, b) {
  return goog.dom.getDomHelper(b).getElementsByTagNameAndClass(a, null, b)
};bot.locators.className = {};
bot.locators.className.single = function(a, b) {
  if(!a) {
    throw Error("No class name specified");
  }
  a = goog.string.trim(a);
  if(a.split(/\s+/).length > 1) {
    throw Error("Compound class names not permitted");
  }
  var c = goog.dom.getDomHelper(b).getElementsByTagNameAndClass("*", a, b);
  return c.length ? c[0] : null
};
bot.locators.className.many = function(a, b) {
  if(!a) {
    throw Error("No class name specified");
  }
  a = goog.string.trim(a);
  if(a.split(/\s+/).length > 1) {
    throw Error("Compound class names not permitted");
  }
  return goog.dom.getDomHelper(b).getElementsByTagNameAndClass("*", a, b)
};bot.locators.css = {};
bot.locators.css.single = function(a, b) {
  if(!goog.isFunction(b.querySelector) && goog.userAgent.IE && goog.userAgent.isVersion(8) && !goog.isObject(b.querySelector)) {
    throw Error("CSS selection is not supported");
  }
  if(!a) {
    throw Error("No selector specified");
  }
  if(a.split(/,/).length > 1) {
    throw Error("Compound selectors not permitted");
  }
  a = goog.string.trim(a);
  var c = b.querySelector(a);
  return c && c.nodeType == goog.dom.NodeType.ELEMENT ? c : null
};
bot.locators.css.many = function(a, b) {
  if(!goog.isFunction(b.querySelectorAll) && goog.userAgent.IE && goog.userAgent.isVersion(8) && !goog.isObject(b.querySelector)) {
    throw Error("CSS selection is not supported");
  }
  if(!a) {
    throw Error("No selector specified");
  }
  if(a.split(/,/).length > 1) {
    throw Error("Compound selectors not permitted");
  }
  a = goog.string.trim(a);
  return b.querySelectorAll(a)
};bot.locators.id = {};
bot.locators.id.single = function(a, b) {
  var c = goog.dom.getDomHelper(b), d = c.getElement(a);
  if(!d) {
    return null
  }
  if(bot.dom.getAttribute(d, "id") == a && goog.dom.contains(b, d)) {
    return d
  }
  c = c.getElementsByTagNameAndClass("*");
  return goog.array.find(c, function(e) {
    return bot.dom.getAttribute(e, "id") == a && goog.dom.contains(b, e)
  })
};
bot.locators.id.many = function(a, b) {
  var c = goog.dom.getDomHelper(b).getElementsByTagNameAndClass("*", null, b);
  return goog.array.filter(c, function(d) {
    return bot.dom.getAttribute(d, "id") == a
  })
};bot.locators.name = {};
bot.locators.name.single = function(a, b) {
  var c = goog.dom.getDomHelper(b).getElementsByTagNameAndClass("*", null, b);
  return goog.array.find(c, function(d) {
    return bot.dom.getAttribute(d, "name") == a
  })
};
bot.locators.name.many = function(a, b) {
  var c = goog.dom.getDomHelper(b).getElementsByTagNameAndClass("*", null, b);
  return goog.array.filter(c, function(d) {
    return bot.dom.getAttribute(d, "name") == a
  })
};bot.locators.linkText = {};
bot.locators.partialLinkText = {};
bot.locators.linkText.single_ = function(a, b, c) {
  b = goog.dom.getDomHelper(b).getElementsByTagNameAndClass(goog.dom.TagName.A, null, b);
  return goog.array.find(b, function(d) {
    d = bot.dom.getVisibleText(d);
    return c && d.indexOf(a) != -1 || d == a
  })
};
bot.locators.linkText.many_ = function(a, b, c) {
  b = goog.dom.getDomHelper(b).getElementsByTagNameAndClass(goog.dom.TagName.A, null, b);
  return goog.array.filter(b, function(d) {
    d = bot.dom.getVisibleText(d);
    return c && d.indexOf(a) != -1 || d == a
  })
};
bot.locators.linkText.single = function(a, b) {
  return bot.locators.linkText.single_(a, b, false)
};
bot.locators.linkText.many = function(a, b) {
  return bot.locators.linkText.many_(a, b, false)
};
bot.locators.partialLinkText.single = function(a, b) {
  return bot.locators.linkText.single_(a, b, true)
};
bot.locators.partialLinkText.many = function(a, b) {
  return bot.locators.linkText.many_(a, b, true)
};bot.locators.STRATEGIES_ = {className:bot.locators.className, css:bot.locators.css, id:bot.locators.id, linkText:bot.locators.linkText, name:bot.locators.name, partialLinkText:bot.locators.partialLinkText, tagName:bot.locators.tagName, xpath:bot.locators.xpath};
bot.locators.add = function(a, b) {
  bot.locators.STRATEGIES_[a] = b
};
bot.locators.findElement = function(a, b) {
  var c = goog.object.getAnyKey(a);
  if(c) {
    var d = bot.locators.STRATEGIES_[c];
    if(d && goog.isFunction(d.single)) {
      var e = b || goog.dom.getOwnerDocument(bot.getWindow());
      return d.single(a[c], e)
    }
  }
  throw Error("Unsupported locator strategy: " + c);
};
bot.locators.findElements = function(a, b) {
  var c = goog.object.getAnyKey(a);
  if(c) {
    var d = bot.locators.STRATEGIES_[c];
    if(d && goog.isFunction(d.many)) {
      var e = b || goog.dom.getOwnerDocument(bot.getWindow());
      return d.many(a[c], e)
    }
  }
  throw Error("Unsupported locator strategy: " + c);
};goog.math.randomInt = function(a) {
  return Math.floor(Math.random() * a)
};
goog.math.uniformRandom = function(a, b) {
  return a + Math.random() * (b - a)
};
goog.math.clamp = function(a, b, c) {
  return Math.min(Math.max(a, b), c)
};
goog.math.modulo = function(a, b) {
  var c = a % b;
  return c * b < 0 ? c + b : c
};
goog.math.lerp = function(a, b, c) {
  return a + c * (b - a)
};
goog.math.nearlyEquals = function(a, b, c) {
  return Math.abs(a - b) <= (c || 1.0E-6)
};
goog.math.standardAngle = function(a) {
  return goog.math.modulo(a, 360)
};
goog.math.toRadians = function(a) {
  return a * Math.PI / 180
};
goog.math.toDegrees = function(a) {
  return a * 180 / Math.PI
};
goog.math.angleDx = function(a, b) {
  return b * Math.cos(goog.math.toRadians(a))
};
goog.math.angleDy = function(a, b) {
  return b * Math.sin(goog.math.toRadians(a))
};
goog.math.angle = function(a, b, c, d) {
  return goog.math.standardAngle(goog.math.toDegrees(Math.atan2(d - b, c - a)))
};
goog.math.angleDifference = function(a, b) {
  var c = goog.math.standardAngle(b) - goog.math.standardAngle(a);
  if(c > 180) {
    c -= 360
  }else {
    if(c <= -180) {
      c = 360 + c
    }
  }
  return c
};
goog.math.sign = function(a) {
  return a == 0 ? 0 : a < 0 ? -1 : 1
};
goog.math.longestCommonSubsequence = function(a, b, c, d) {
  c = c || function(l, m) {
    return l == m
  };
  d = d || function(l) {
    return a[l]
  };
  var e = a.length, f = b.length, g = [];
  for(var h = 0;h < e + 1;h++) {
    g[h] = [];
    g[h][0] = 0
  }
  for(var i = 0;i < f + 1;i++) {
    g[0][i] = 0
  }
  for(h = 1;h <= e;h++) {
    for(i = 1;i <= e;i++) {
      g[h][i] = c(a[h - 1], b[i - 1]) ? g[h - 1][i - 1] + 1 : Math.max(g[h - 1][i], g[h][i - 1])
    }
  }
  var j = [];
  h = e;
  for(i = f;h > 0 && i > 0;) {
    if(c(a[h - 1], b[i - 1])) {
      j.unshift(d(h - 1, i - 1));
      h--;
      i--
    }else {
      if(g[h - 1][i] > g[h][i - 1]) {
        h--
      }else {
        i--
      }
    }
  }
  return j
};
goog.math.sum = function() {
  return goog.array.reduce(arguments, function(a, b) {
    return a + b
  }, 0)
};
goog.math.average = function() {
  return goog.math.sum.apply(null, arguments) / arguments.length
};
goog.math.standardDeviation = function() {
  var a = arguments.length;
  if(a < 2) {
    return 0
  }
  var b = goog.math.average.apply(null, arguments);
  a = goog.math.sum.apply(null, goog.array.map(arguments, function(c) {
    return Math.pow(c - b, 2)
  })) / (a - 1);
  return Math.sqrt(a)
};
goog.math.isInt = function(a) {
  return isFinite(a) && a % 1 == 0
};
goog.math.isFiniteNumber = function(a) {
  return isFinite(a) && !isNaN(a)
};/*

 Copyright 2010 WebDriver committers
 Copyright 2010 Google Inc.

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
*/
var webdriver = {};
webdriver.element = {};
webdriver.element.SELECTABLE_TYPES_ = ["checkbox", "radio"];
webdriver.element.isSelectable_ = function(a) {
  var b = a.tagName.toUpperCase();
  if(b == goog.dom.TagName.OPTION) {
    return true
  }
  if(b == goog.dom.TagName.INPUT) {
    if(goog.array.contains(webdriver.element.SELECTABLE_TYPES_, a.type)) {
      return true
    }
  }
  return false
};
webdriver.element.isSelected = function(a) {
  if(!webdriver.element.isSelectable_(a)) {
    return false
  }
  var b = "selected";
  a.tagName.toUpperCase();
  var c = a.type && a.type.toLowerCase();
  if("checkbox" == c || "radio" == c) {
    b = "checked"
  }
  return!!a[b]
};
webdriver.element.getAttribute = function(a, b) {
  var c = null;
  c = b.toLowerCase();
  if("style" == b.toLowerCase()) {
    if((c = a.style) && !goog.isString(c)) {
      c = c.cssText
    }
    return c
  }
  if("selected" == c || "checked" == c && webdriver.element.isSelectable_(a)) {
    return webdriver.element.isSelected(a) ? "true" : null
  }
  var d = a.tagName && goog.dom.TagName.A == a.tagName.toUpperCase(), e = a.tagName && goog.dom.TagName.IMG == a.tagName.toUpperCase(), f;
  try {
    f = bot.dom.getProperty(a, b)
  }catch(g) {
  }
  c = c == "href" && d || c == "src" && e || !goog.isDefAndNotNull(f) || goog.isObject(f) ? bot.dom.getAttribute(a, b) : f;
  return goog.isDefAndNotNull(c) ? c.toString() : null
};
webdriver.element.getLocation = function(a) {
  if(!bot.dom.isShown(a)) {
    return null
  }
  return goog.style.getBounds(a)
};
webdriver.element.isInHead_ = function(a) {
  for(;a;) {
    if(a.tagName && a.tagName.toLowerCase() == "head") {
      return true
    }
    try {
      a = a.parentNode
    }catch(b) {
      return false
    }
  }
  return false
};
webdriver.element.getText = function(a) {
  if(webdriver.element.isInHead_(a)) {
    var b = goog.dom.getOwnerDocument(a);
    if(a.tagName.toUpperCase() == goog.dom.TagName.TITLE && goog.dom.getWindow(b) == bot.window_.top) {
      return goog.string.trim(b.title)
    }
    return""
  }
  return bot.dom.getVisibleText(a)
};goog.structs.Set = function(a) {
  this.map_ = new goog.structs.Map;
  a && this.addAll(a)
};
goog.structs.Set.getKey_ = function(a) {
  var b = typeof a;
  return b == "object" && a || b == "function" ? "o" + goog.getUid(a) : b.substr(0, 1) + a
};
goog.structs.Set.prototype.getCount = function() {
  return this.map_.getCount()
};
goog.structs.Set.prototype.add = function(a) {
  this.map_.set(goog.structs.Set.getKey_(a), a)
};
goog.structs.Set.prototype.addAll = function(a) {
  a = goog.structs.getValues(a);
  var b = a.length;
  for(var c = 0;c < b;c++) {
    this.add(a[c])
  }
};
goog.structs.Set.prototype.removeAll = function(a) {
  a = goog.structs.getValues(a);
  var b = a.length;
  for(var c = 0;c < b;c++) {
    this.remove(a[c])
  }
};
goog.structs.Set.prototype.remove = function(a) {
  return this.map_.remove(goog.structs.Set.getKey_(a))
};
goog.structs.Set.prototype.clear = function() {
  this.map_.clear()
};
goog.structs.Set.prototype.isEmpty = function() {
  return this.map_.isEmpty()
};
goog.structs.Set.prototype.contains = function(a) {
  return this.map_.containsKey(goog.structs.Set.getKey_(a))
};
goog.structs.Set.prototype.containsAll = function(a) {
  return goog.structs.every(a, this.contains, this)
};
goog.structs.Set.prototype.intersection = function(a) {
  var b = new goog.structs.Set;
  a = goog.structs.getValues(a);
  for(var c = 0;c < a.length;c++) {
    var d = a[c];
    this.contains(d) && b.add(d)
  }
  return b
};
goog.structs.Set.prototype.getValues = function() {
  return this.map_.getValues()
};
goog.structs.Set.prototype.clone = function() {
  return new goog.structs.Set(this)
};
goog.structs.Set.prototype.equals = function(a) {
  return this.getCount() == goog.structs.getCount(a) && this.isSubsetOf(a)
};
goog.structs.Set.prototype.isSubsetOf = function(a) {
  var b = goog.structs.getCount(a);
  if(this.getCount() > b) {
    return false
  }
  if(!(a instanceof goog.structs.Set) && b > 5) {
    a = new goog.structs.Set(a)
  }
  return goog.structs.every(this, function(c) {
    return goog.structs.contains(a, c)
  })
};
goog.structs.Set.prototype.__iterator__ = function() {
  return this.map_.__iterator__(false)
};goog.debug.catchErrors = function(a, b, c) {
  c = c || goog.global;
  var d = c.onerror;
  c.onerror = function(e, f, g) {
    d && d(e, f, g);
    a({message:e, fileName:f, line:g});
    return Boolean(b)
  }
};
goog.debug.expose = function(a, b) {
  if(typeof a == "undefined") {
    return"undefined"
  }
  if(a == null) {
    return"NULL"
  }
  var c = [];
  for(var d in a) {
    if(!(!b && goog.isFunction(a[d]))) {
      var e = d + " = ";
      try {
        e += a[d]
      }catch(f) {
        e += "*** " + f + " ***"
      }
      c.push(e)
    }
  }
  return c.join("\n")
};
goog.debug.deepExpose = function(a, b) {
  var c = new goog.structs.Set, d = [], e = function(f, g) {
    var h = g + "  ";
    try {
      if(goog.isDef(f)) {
        if(goog.isNull(f)) {
          d.push("NULL")
        }else {
          if(goog.isString(f)) {
            d.push('"' + f.replace(/\n/g, "\n" + g) + '"')
          }else {
            if(goog.isFunction(f)) {
              d.push(String(f).replace(/\n/g, "\n" + g))
            }else {
              if(goog.isObject(f)) {
                if(c.contains(f)) {
                  d.push("*** reference loop detected ***")
                }else {
                  c.add(f);
                  d.push("{");
                  for(var i in f) {
                    if(!(!b && goog.isFunction(f[i]))) {
                      d.push("\n");
                      d.push(h);
                      d.push(i + " = ");
                      e(f[i], h)
                    }
                  }
                  d.push("\n" + g + "}")
                }
              }else {
                d.push(f)
              }
            }
          }
        }
      }else {
        d.push("undefined")
      }
    }catch(j) {
      d.push("*** " + j + " ***")
    }
  };
  e(a, "");
  return d.join("")
};
goog.debug.exposeArray = function(a) {
  var b = [];
  for(var c = 0;c < a.length;c++) {
    goog.isArray(a[c]) ? b.push(goog.debug.exposeArray(a[c])) : b.push(a[c])
  }
  return"[ " + b.join(", ") + " ]"
};
goog.debug.exposeException = function(a, b) {
  try {
    var c = goog.debug.normalizeErrorObject(a);
    return"Message: " + goog.string.htmlEscape(c.message) + '\nUrl: <a href="view-source:' + c.fileName + '" target="_new">' + c.fileName + "</a>\nLine: " + c.lineNumber + "\n\nBrowser stack:\n" + goog.string.htmlEscape(c.stack + "-> ") + "[end]\n\nJS stack traversal:\n" + goog.string.htmlEscape(goog.debug.getStacktrace(b) + "-> ")
  }catch(d) {
    return"Exception trying to expose exception! You win, we lose. " + d
  }
};
goog.debug.normalizeErrorObject = function(a) {
  var b = goog.getObjectByName("window.location.href");
  if(goog.isString(a)) {
    return{message:a, name:"Unknown error", lineNumber:"Not available", fileName:b, stack:"Not available"}
  }
  var c, d, e = false;
  try {
    c = a.lineNumber || a.line || "Not available"
  }catch(f) {
    c = "Not available";
    e = true
  }
  try {
    d = a.fileName || a.filename || a.sourceURL || b
  }catch(g) {
    d = "Not available";
    e = true
  }
  if(e || !a.lineNumber || !a.fileName || !a.stack) {
    return{message:a.message, name:a.name, lineNumber:c, fileName:d, stack:a.stack || "Not available"}
  }
  return a
};
goog.debug.enhanceError = function(a, b) {
  var c = typeof a == "string" ? Error(a) : a;
  if(!c.stack) {
    c.stack = goog.debug.getStacktrace(arguments.callee.caller)
  }
  if(b) {
    for(var d = 0;c["message" + d];) {
      ++d
    }
    c["message" + d] = String(b)
  }
  return c
};
goog.debug.getStacktraceSimple = function(a) {
  var b = [], c = arguments.callee.caller;
  for(var d = 0;c && (!a || d < a);) {
    b.push(goog.debug.getFunctionName(c));
    b.push("()\n");
    try {
      c = c.caller
    }catch(e) {
      b.push("[exception trying to get caller]\n");
      break
    }
    d++;
    if(d >= goog.debug.MAX_STACK_DEPTH) {
      b.push("[...long stack...]");
      break
    }
  }
  a && d >= a ? b.push("[...reached max depth limit...]") : b.push("[end]");
  return b.join("")
};
goog.debug.MAX_STACK_DEPTH = 50;
goog.debug.getStacktrace = function(a) {
  return goog.debug.getStacktraceHelper_(a || arguments.callee.caller, [])
};
goog.debug.getStacktraceHelper_ = function(a, b) {
  var c = [];
  if(goog.array.contains(b, a)) {
    c.push("[...circular reference...]")
  }else {
    if(a && b.length < goog.debug.MAX_STACK_DEPTH) {
      c.push(goog.debug.getFunctionName(a) + "(");
      var d = a.arguments;
      for(var e = 0;e < d.length;e++) {
        e > 0 && c.push(", ");
        var f;
        f = d[e];
        switch(typeof f) {
          case "object":
            f = f ? "object" : "null";
            break;
          case "string":
            f = f;
            break;
          case "number":
            f = String(f);
            break;
          case "boolean":
            f = f ? "true" : "false";
            break;
          case "function":
            f = (f = goog.debug.getFunctionName(f)) ? f : "[fn]";
            break;
          case "undefined":
          ;
          default:
            f = typeof f;
            break
        }
        if(f.length > 40) {
          f = f.substr(0, 40) + "..."
        }
        c.push(f)
      }
      b.push(a);
      c.push(")\n");
      try {
        c.push(goog.debug.getStacktraceHelper_(a.caller, b))
      }catch(g) {
        c.push("[exception trying to get caller]\n")
      }
    }else {
      a ? c.push("[...long stack...]") : c.push("[end]")
    }
  }
  return c.join("")
};
goog.debug.getFunctionName = function(a) {
  a = String(a);
  if(!goog.debug.fnNameCache_[a]) {
    var b = /function ([^\(]+)/.exec(a);
    goog.debug.fnNameCache_[a] = b ? b[1] : "[Anonymous]"
  }
  return goog.debug.fnNameCache_[a]
};
goog.debug.makeWhitespaceVisible = function(a) {
  return a.replace(/ /g, "[_]").replace(/\f/g, "[f]").replace(/\n/g, "[n]\n").replace(/\r/g, "[r]").replace(/\t/g, "[t]")
};
goog.debug.fnNameCache_ = {};goog.debug.LogRecord = function(a, b, c, d, e) {
  this.reset(a, b, c, d, e)
};
goog.debug.LogRecord.prototype.sequenceNumber_ = 0;
goog.debug.LogRecord.prototype.exception_ = null;
goog.debug.LogRecord.prototype.exceptionText_ = null;
goog.debug.LogRecord.ENABLE_SEQUENCE_NUMBERS = true;
goog.debug.LogRecord.nextSequenceNumber_ = 0;
goog.debug.LogRecord.prototype.reset = function(a, b, c, d, e) {
  if(goog.debug.LogRecord.ENABLE_SEQUENCE_NUMBERS) {
    this.sequenceNumber_ = typeof e == "number" ? e : goog.debug.LogRecord.nextSequenceNumber_++
  }
  this.time_ = d || goog.now();
  this.level_ = a;
  this.msg_ = b;
  this.loggerName_ = c;
  delete this.exception_;
  delete this.exceptionText_
};
goog.debug.LogRecord.prototype.getLoggerName = function() {
  return this.loggerName_
};
goog.debug.LogRecord.prototype.getException = function() {
  return this.exception_
};
goog.debug.LogRecord.prototype.setException = function(a) {
  this.exception_ = a
};
goog.debug.LogRecord.prototype.getExceptionText = function() {
  return this.exceptionText_
};
goog.debug.LogRecord.prototype.setExceptionText = function(a) {
  this.exceptionText_ = a
};
goog.debug.LogRecord.prototype.setLoggerName = function(a) {
  this.loggerName_ = a
};
goog.debug.LogRecord.prototype.getLevel = function() {
  return this.level_
};
goog.debug.LogRecord.prototype.setLevel = function(a) {
  this.level_ = a
};
goog.debug.LogRecord.prototype.getMessage = function() {
  return this.msg_
};
goog.debug.LogRecord.prototype.setMessage = function(a) {
  this.msg_ = a
};
goog.debug.LogRecord.prototype.getMillis = function() {
  return this.time_
};
goog.debug.LogRecord.prototype.setMillis = function(a) {
  this.time_ = a
};
goog.debug.LogRecord.prototype.getSequenceNumber = function() {
  return this.sequenceNumber_
};goog.debug.LogBuffer = function() {
  goog.asserts.assert(goog.debug.LogBuffer.isBufferingEnabled(), "Cannot use goog.debug.LogBuffer without defining goog.debug.LogBuffer.CAPACITY.");
  this.clear()
};
goog.debug.LogBuffer.getInstance = function() {
  if(!goog.debug.LogBuffer.instance_) {
    goog.debug.LogBuffer.instance_ = new goog.debug.LogBuffer
  }
  return goog.debug.LogBuffer.instance_
};
goog.debug.LogBuffer.CAPACITY = 0;
goog.debug.LogBuffer.prototype.addRecord = function(a, b, c) {
  var d = (this.curIndex_ + 1) % goog.debug.LogBuffer.CAPACITY;
  this.curIndex_ = d;
  if(this.isFull_) {
    d = this.buffer_[d];
    d.reset(a, b, c);
    return d
  }
  this.isFull_ = d == goog.debug.LogBuffer.CAPACITY - 1;
  return this.buffer_[d] = new goog.debug.LogRecord(a, b, c)
};
goog.debug.LogBuffer.isBufferingEnabled = function() {
  return goog.debug.LogBuffer.CAPACITY > 0
};
goog.debug.LogBuffer.prototype.clear = function() {
  this.buffer_ = Array(goog.debug.LogBuffer.CAPACITY);
  this.curIndex_ = -1;
  this.isFull_ = false
};
goog.debug.LogBuffer.prototype.forEachRecord = function(a) {
  var b = this.buffer_;
  if(b[0]) {
    var c = this.curIndex_, d = this.isFull_ ? c : -1;
    do {
      d = (d + 1) % goog.debug.LogBuffer.CAPACITY;
      a(b[d])
    }while(d != c)
  }
};goog.debug.Logger = function(a) {
  this.name_ = a
};
goog.debug.Logger.prototype.parent_ = null;
goog.debug.Logger.prototype.level_ = null;
goog.debug.Logger.prototype.children_ = null;
goog.debug.Logger.prototype.handlers_ = null;
goog.debug.Logger.ENABLE_HIERARCHY = true;
if(!goog.debug.Logger.ENABLE_HIERARCHY) {
  goog.debug.Logger.rootHandlers_ = []
}
goog.debug.Logger.Level = function(a, b) {
  this.name = a;
  this.value = b
};
goog.debug.Logger.Level.prototype.toString = function() {
  return this.name
};
goog.debug.Logger.Level.OFF = new goog.debug.Logger.Level("OFF", Infinity);
goog.debug.Logger.Level.SHOUT = new goog.debug.Logger.Level("SHOUT", 1200);
goog.debug.Logger.Level.SEVERE = new goog.debug.Logger.Level("SEVERE", 1E3);
goog.debug.Logger.Level.WARNING = new goog.debug.Logger.Level("WARNING", 900);
goog.debug.Logger.Level.INFO = new goog.debug.Logger.Level("INFO", 800);
goog.debug.Logger.Level.CONFIG = new goog.debug.Logger.Level("CONFIG", 700);
goog.debug.Logger.Level.FINE = new goog.debug.Logger.Level("FINE", 500);
goog.debug.Logger.Level.FINER = new goog.debug.Logger.Level("FINER", 400);
goog.debug.Logger.Level.FINEST = new goog.debug.Logger.Level("FINEST", 300);
goog.debug.Logger.Level.ALL = new goog.debug.Logger.Level("ALL", 0);
goog.debug.Logger.Level.PREDEFINED_LEVELS = [goog.debug.Logger.Level.OFF, goog.debug.Logger.Level.SHOUT, goog.debug.Logger.Level.SEVERE, goog.debug.Logger.Level.WARNING, goog.debug.Logger.Level.INFO, goog.debug.Logger.Level.CONFIG, goog.debug.Logger.Level.FINE, goog.debug.Logger.Level.FINER, goog.debug.Logger.Level.FINEST, goog.debug.Logger.Level.ALL];
goog.debug.Logger.Level.predefinedLevelsCache_ = null;
goog.debug.Logger.Level.createPredefinedLevelsCache_ = function() {
  goog.debug.Logger.Level.predefinedLevelsCache_ = {};
  var a = 0;
  for(var b;b = goog.debug.Logger.Level.PREDEFINED_LEVELS[a];a++) {
    goog.debug.Logger.Level.predefinedLevelsCache_[b.value] = b;
    goog.debug.Logger.Level.predefinedLevelsCache_[b.name] = b
  }
};
goog.debug.Logger.Level.getPredefinedLevel = function(a) {
  goog.debug.Logger.Level.predefinedLevelsCache_ || goog.debug.Logger.Level.createPredefinedLevelsCache_();
  return goog.debug.Logger.Level.predefinedLevelsCache_[a] || null
};
goog.debug.Logger.Level.getPredefinedLevelByValue = function(a) {
  goog.debug.Logger.Level.predefinedLevelsCache_ || goog.debug.Logger.Level.createPredefinedLevelsCache_();
  if(a in goog.debug.Logger.Level.predefinedLevelsCache_) {
    return goog.debug.Logger.Level.predefinedLevelsCache_[a]
  }
  for(var b = 0;b < goog.debug.Logger.Level.PREDEFINED_LEVELS.length;++b) {
    var c = goog.debug.Logger.Level.PREDEFINED_LEVELS[b];
    if(c.value <= a) {
      return c
    }
  }
  return null
};
goog.debug.Logger.getLogger = function(a) {
  return goog.debug.LogManager.getLogger(a)
};
goog.debug.Logger.prototype.getName = function() {
  return this.name_
};
goog.debug.Logger.prototype.addHandler = function(a) {
  if(goog.debug.Logger.ENABLE_HIERARCHY) {
    if(!this.handlers_) {
      this.handlers_ = []
    }
    this.handlers_.push(a)
  }else {
    goog.asserts.assert(!this.name_, "Cannot call addHandler on a non-root logger when goog.debug.Logger.ENABLE_HIERARCHY is false.");
    goog.debug.Logger.rootHandlers_.push(a)
  }
};
goog.debug.Logger.prototype.removeHandler = function(a) {
  var b = goog.debug.Logger.ENABLE_HIERARCHY ? this.handlers_ : goog.debug.Logger.rootHandlers_;
  return!!b && goog.array.remove(b, a)
};
goog.debug.Logger.prototype.getParent = function() {
  return this.parent_
};
goog.debug.Logger.prototype.getChildren = function() {
  if(!this.children_) {
    this.children_ = {}
  }
  return this.children_
};
goog.debug.Logger.prototype.setLevel = function(a) {
  if(goog.debug.Logger.ENABLE_HIERARCHY) {
    this.level_ = a
  }else {
    goog.asserts.assert(!this.name_, "Cannot call setLevel() on a non-root logger when goog.debug.Logger.ENABLE_HIERARCHY is false.");
    goog.debug.Logger.rootLevel_ = a
  }
};
goog.debug.Logger.prototype.getLevel = function() {
  return this.level_
};
goog.debug.Logger.prototype.getEffectiveLevel = function() {
  if(!goog.debug.Logger.ENABLE_HIERARCHY) {
    return goog.debug.Logger.rootLevel_
  }
  if(this.level_) {
    return this.level_
  }
  if(this.parent_) {
    return this.parent_.getEffectiveLevel()
  }
  goog.asserts.fail("Root logger has no level set.");
  return null
};
goog.debug.Logger.prototype.isLoggable = function(a) {
  return a.value >= this.getEffectiveLevel().value
};
goog.debug.Logger.prototype.log = function(a, b, c) {
  this.isLoggable(a) && this.doLogRecord_(this.getLogRecord(a, b, c))
};
goog.debug.Logger.prototype.getLogRecord = function(a, b, c) {
  var d = goog.debug.LogBuffer.isBufferingEnabled() ? goog.debug.LogBuffer.getInstance().addRecord(a, b, this.name_) : new goog.debug.LogRecord(a, String(b), this.name_);
  if(c) {
    d.setException(c);
    d.setExceptionText(goog.debug.exposeException(c, arguments.callee.caller))
  }
  return d
};
goog.debug.Logger.prototype.shout = function(a, b) {
  this.log(goog.debug.Logger.Level.SHOUT, a, b)
};
goog.debug.Logger.prototype.severe = function(a, b) {
  this.log(goog.debug.Logger.Level.SEVERE, a, b)
};
goog.debug.Logger.prototype.warning = function(a, b) {
  this.log(goog.debug.Logger.Level.WARNING, a, b)
};
goog.debug.Logger.prototype.info = function(a, b) {
  this.log(goog.debug.Logger.Level.INFO, a, b)
};
goog.debug.Logger.prototype.config = function(a, b) {
  this.log(goog.debug.Logger.Level.CONFIG, a, b)
};
goog.debug.Logger.prototype.fine = function(a, b) {
  this.log(goog.debug.Logger.Level.FINE, a, b)
};
goog.debug.Logger.prototype.finer = function(a, b) {
  this.log(goog.debug.Logger.Level.FINER, a, b)
};
goog.debug.Logger.prototype.finest = function(a, b) {
  this.log(goog.debug.Logger.Level.FINEST, a, b)
};
goog.debug.Logger.prototype.logRecord = function(a) {
  this.isLoggable(a.getLevel()) && this.doLogRecord_(a)
};
goog.debug.Logger.prototype.logToSpeedTracer_ = function(a) {
  goog.global.console && goog.global.console.markTimeline && goog.global.console.markTimeline(a)
};
goog.debug.Logger.prototype.doLogRecord_ = function(a) {
  this.logToSpeedTracer_("log:" + a.getMessage());
  if(goog.debug.Logger.ENABLE_HIERARCHY) {
    for(var b = this;b;) {
      b.callPublish_(a);
      b = b.getParent()
    }
  }else {
    b = 0;
    for(var c;c = goog.debug.Logger.rootHandlers_[b++];) {
      c(a)
    }
  }
};
goog.debug.Logger.prototype.callPublish_ = function(a) {
  if(this.handlers_) {
    var b = 0;
    for(var c;c = this.handlers_[b];b++) {
      c(a)
    }
  }
};
goog.debug.Logger.prototype.setParent_ = function(a) {
  this.parent_ = a
};
goog.debug.Logger.prototype.addChild_ = function(a, b) {
  this.getChildren()[a] = b
};
goog.debug.LogManager = {};
goog.debug.LogManager.loggers_ = {};
goog.debug.LogManager.rootLogger_ = null;
goog.debug.LogManager.initialize = function() {
  if(!goog.debug.LogManager.rootLogger_) {
    goog.debug.LogManager.rootLogger_ = new goog.debug.Logger("");
    goog.debug.LogManager.loggers_[""] = goog.debug.LogManager.rootLogger_;
    goog.debug.LogManager.rootLogger_.setLevel(goog.debug.Logger.Level.CONFIG)
  }
};
goog.debug.LogManager.getLoggers = function() {
  return goog.debug.LogManager.loggers_
};
goog.debug.LogManager.getRoot = function() {
  goog.debug.LogManager.initialize();
  return goog.debug.LogManager.rootLogger_
};
goog.debug.LogManager.getLogger = function(a) {
  goog.debug.LogManager.initialize();
  return goog.debug.LogManager.loggers_[a] || goog.debug.LogManager.createLogger_(a)
};
goog.debug.LogManager.createFunctionForCatchErrors = function(a) {
  return function(b) {
    (a || goog.debug.LogManager.getRoot()).severe("Error: " + b.message + " (" + b.fileName + " @ Line: " + b.line + ")")
  }
};
goog.debug.LogManager.createLogger_ = function(a) {
  var b = new goog.debug.Logger(a);
  if(goog.debug.Logger.ENABLE_HIERARCHY) {
    var c = a.lastIndexOf("."), d = a.substr(0, c);
    c = a.substr(c + 1);
    d = goog.debug.LogManager.getLogger(d);
    d.addChild_(c, b);
    b.setParent_(d)
  }
  return goog.debug.LogManager.loggers_[a] = b
};goog.debug.RelativeTimeProvider = function() {
  this.relativeTimeStart_ = goog.now()
};
goog.debug.RelativeTimeProvider.defaultInstance_ = new goog.debug.RelativeTimeProvider;
goog.debug.RelativeTimeProvider.prototype.set = function(a) {
  this.relativeTimeStart_ = a
};
goog.debug.RelativeTimeProvider.prototype.reset = function() {
  this.set(goog.now())
};
goog.debug.RelativeTimeProvider.prototype.get = function() {
  return this.relativeTimeStart_
};
goog.debug.RelativeTimeProvider.getDefaultInstance = function() {
  return goog.debug.RelativeTimeProvider.defaultInstance_
};goog.debug.Formatter = function(a) {
  this.prefix_ = a || "";
  this.startTimeProvider_ = goog.debug.RelativeTimeProvider.getDefaultInstance()
};
goog.debug.Formatter.prototype.showAbsoluteTime = true;
goog.debug.Formatter.prototype.showRelativeTime = true;
goog.debug.Formatter.prototype.showLoggerName = true;
goog.debug.Formatter.prototype.showExceptionText = false;
goog.debug.Formatter.prototype.showSeverityLevel = false;
goog.debug.Formatter.prototype.setStartTimeProvider = function(a) {
  this.startTimeProvider_ = a
};
goog.debug.Formatter.prototype.getStartTimeProvider = function() {
  return this.startTimeProvider_
};
goog.debug.Formatter.prototype.resetRelativeTimeStart = function() {
  this.startTimeProvider_.reset()
};
goog.debug.Formatter.getDateTimeStamp_ = function(a) {
  a = new Date(a.getMillis());
  return goog.debug.Formatter.getTwoDigitString_(a.getFullYear() - 2E3) + goog.debug.Formatter.getTwoDigitString_(a.getMonth() + 1) + goog.debug.Formatter.getTwoDigitString_(a.getDate()) + " " + goog.debug.Formatter.getTwoDigitString_(a.getHours()) + ":" + goog.debug.Formatter.getTwoDigitString_(a.getMinutes()) + ":" + goog.debug.Formatter.getTwoDigitString_(a.getSeconds()) + "." + goog.debug.Formatter.getTwoDigitString_(Math.floor(a.getMilliseconds() / 10))
};
goog.debug.Formatter.getTwoDigitString_ = function(a) {
  if(a < 10) {
    return"0" + a
  }
  return String(a)
};
goog.debug.Formatter.getRelativeTime_ = function(a, b) {
  var c = (a.getMillis() - b) / 1E3, d = c.toFixed(3), e = 0;
  if(c < 1) {
    e = 2
  }else {
    for(;c < 100;) {
      e++;
      c *= 10
    }
  }
  for(;e-- > 0;) {
    d = " " + d
  }
  return d
};
goog.debug.HtmlFormatter = function(a) {
  goog.debug.Formatter.call(this, a)
};
goog.inherits(goog.debug.HtmlFormatter, goog.debug.Formatter);
goog.debug.HtmlFormatter.prototype.showExceptionText = true;
goog.debug.HtmlFormatter.prototype.formatRecord = function(a) {
  var b;
  switch(a.getLevel().value) {
    case goog.debug.Logger.Level.SHOUT.value:
      b = "dbg-sh";
      break;
    case goog.debug.Logger.Level.SEVERE.value:
      b = "dbg-sev";
      break;
    case goog.debug.Logger.Level.WARNING.value:
      b = "dbg-w";
      break;
    case goog.debug.Logger.Level.INFO.value:
      b = "dbg-i";
      break;
    case goog.debug.Logger.Level.FINE.value:
    ;
    default:
      b = "dbg-f";
      break
  }
  var c = [];
  c.push(this.prefix_, " ");
  this.showAbsoluteTime && c.push("[", goog.debug.Formatter.getDateTimeStamp_(a), "] ");
  this.showRelativeTime && c.push("[", goog.string.whitespaceEscape(goog.debug.Formatter.getRelativeTime_(a, this.startTimeProvider_.get())), "s] ");
  this.showLoggerName && c.push("[", goog.string.htmlEscape(a.getLoggerName()), "] ");
  c.push('<span class="', b, '">', goog.string.newLineToBr(goog.string.whitespaceEscape(goog.string.htmlEscape(a.getMessage()))));
  if(this.showExceptionText && a.getException()) {
    c.push("<br>", goog.string.newLineToBr(goog.string.whitespaceEscape(a.getExceptionText() || "")))
  }
  c.push("</span><br>");
  return c.join("")
};
goog.debug.TextFormatter = function(a) {
  goog.debug.Formatter.call(this, a)
};
goog.inherits(goog.debug.TextFormatter, goog.debug.Formatter);
goog.debug.TextFormatter.prototype.formatRecord = function(a) {
  var b = [];
  b.push(this.prefix_, " ");
  this.showAbsoluteTime && b.push("[", goog.debug.Formatter.getDateTimeStamp_(a), "] ");
  this.showRelativeTime && b.push("[", goog.debug.Formatter.getRelativeTime_(a, this.startTimeProvider_.get()), "s] ");
  this.showLoggerName && b.push("[", a.getLoggerName(), "] ");
  this.showSeverityLevel && b.push("[", a.getLevel().name, "] ");
  b.push(a.getMessage(), "\n");
  this.showExceptionText && a.getException() && b.push(a.getExceptionText(), "\n");
  return b.join("")
};/*

 Copyright 2010 WebDriver committers
 Copyright 2010 Google Inc.

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
*/
webdriver.debug = {};
webdriver.debug.Console = function() {
  var a = Components.classes, b = Components.interfaces;
  if(a && b) {
    this.console_ = a["@mozilla.org/consoleservice;1"].getService(b.nsIConsoleService);
    this.publishHandler_ = goog.bind(this.addLogRecord, this);
    this.formatter_ = new goog.debug.TextFormatter;
    this.isCapturing_ = false
  }
};
webdriver.debug.Console.prototype.getFormatter = function() {
  return this.formatter_
};
webdriver.debug.Console.prototype.setCapturing = function(a) {
  if(a != this.isCapturing_) {
    var b = goog.debug.LogManager.getRoot();
    if(a) {
      b.addHandler(this.publishHandler_)
    }else {
      b.removeHandler(this.publishHandler_);
      this.logBuffer = ""
    }
    this.isCapturing_ = a
  }
};
webdriver.debug.Console.prototype.addLogRecord = function(a) {
  a = this.formatter_.formatRecord(a);
  if(this.console_.logStringMessage) {
    var b = Components.stack;
    for(var c = 0;c < 6 && b;c++) {
      b = b.caller
    }
    this.console_.logStringMessage((b ? b.filename.replace(/.*\//, "") : "unknown") + ":" + (b ? b.lineNumber : "xx") + " - " + a)
  }
};
try {
  if(Components && Components.classes && !webdriver.debug.Console.instance) {
    webdriver.debug.Console.instance = new webdriver.debug.Console
  }
}catch(e$$31) {
}
webdriver.debug.Console.instance && webdriver.debug.Console.instance.setCapturing(true);var core = {};
core.Error = function(a) {
  goog.debug.Error.call(this, a)
};
goog.inherits(core.Error, goog.debug.Error);core.script = {};
core.script.execute = function(a) {
  var b = false, c, d, e;
  bot.script.execute(a.script, a.args, a.timeout, function(f) {
    b = true;
    c = f == null ? "null" : f
  }, function(f) {
    b = d = true;
    e = f.name + " " + f.message;
    if(f.stack) {
      e += "\n" + f.stack
    }
  }, selenium.browserbot.getCurrentWindow());
  return{terminationCondition:function() {
    if(b) {
      this.result = c;
      this.failed = d;
      this.failureMessage = e
    }
    return b
  }}
};core.filters = {};
core.filters.name_ = function(a, b) {
  return goog.array.filter(b, function(c) {
    return bot.dom.getProperty(c, "name") == a
  })
};
core.filters.value_ = function(a, b) {
  return goog.array.filter(b, function(c) {
    return bot.dom.getProperty(c, "value") === a
  })
};
core.filters.index_ = function(a, b) {
  a = Number(a);
  if(isNaN(a) || a < 0) {
    throw new core.Error("Illegal Index: " + a);
  }
  if(b.length <= a) {
    throw new core.Error("Index out of range: " + a);
  }
  return[b[a]]
};
core.filters.Filters_ = {index:core.filters.index_, name:core.filters.name_, value:core.filters.value_};
core.filters.selectElementsBy_ = function(a, b, c) {
  var d = core.filters.Filters_[a];
  if(!d) {
    throw new core.Error("Unrecognised element-filter type: '" + a + "'");
  }
  return d(b, c)
};
core.filters.selectElements = function(a, b, c) {
  c = c || "value";
  var d = a.match(/^([A-Za-z]+)=(.+)/);
  if(d) {
    c = d[1].toLowerCase();
    a = d[2]
  }
  return core.filters.selectElementsBy_(c, a, b)
};core.LocatorStrategies = {};
core.LocatorStrategies.implicit_ = function(a, b) {
  if(goog.string.startsWith(a, "//")) {
    return core.LocatorStrategies.xpath_(a, b)
  }
  if(goog.string.startsWith(a, "document.")) {
    return core.LocatorStrategies.dom_(a, b)
  }
  return core.LocatorStrategies.identifier_(a, b)
};
core.LocatorStrategies.alt_ = function(a, b) {
  var c = b || goog.dom.getOwnerDocument(bot.window_);
  return core.locators.elementFindFirstMatchingChild(c, function(d) {
    return d.alt == a
  })
};
core.LocatorStrategies.class_ = function(a, b) {
  var c = b || goog.dom.getOwnerDocument(bot.window_);
  return core.locators.elementFindFirstMatchingChild(c, function(d) {
    return d.className == a
  })
};
core.LocatorStrategies.dom_ = function(a) {
  var b = null;
  try {
    b = eval(a)
  }catch(c) {
    return null
  }
  return b ? b : null
};
core.LocatorStrategies.id_ = function(a, b) {
  return bot.locators.findElement({id:a}, b)
};
core.LocatorStrategies.identifier_ = function(a, b) {
  return core.LocatorStrategies.id(a, b) || core.LocatorStrategies.name(a, b)
};
core.LocatorStrategies.name_ = function(a, b) {
  var c = b || goog.dom.getOwnerDocument(bot.window_);
  goog.dom.getDomHelper(c);
  c = goog.dom.getElementsByTagNameAndClass("*", null, c);
  var d = a.split(" ");
  for(d[0] = "name=" + d[0];d.length;) {
    var e = d.shift();
    c = core.filters.selectElements(e, c, "value")
  }
  return c.length > 0 ? c[0] : null
};
core.LocatorStrategies.stored_ = function(a, b) {
  try {
    return bot.inject.cache.getElement(a, b)
  }catch(c) {
    return null
  }
};
core.LocatorStrategies.xpath_ = function(a, b) {
  var c = goog.string.endsWith(a, "/"), d = {xpath:a};
  if((d = bot.locators.findElement(d, b)) || !c) {
    return d
  }
  d = {xpath:a.substring(0, a.length - 1)};
  return bot.locators.findElement(d, b)
};
core.LocatorStrategies.alt = core.LocatorStrategies.alt_;
core.LocatorStrategies["class"] = core.LocatorStrategies.class_;
core.LocatorStrategies.dom = core.LocatorStrategies.dom_;
core.LocatorStrategies.id = core.LocatorStrategies.id_;
core.LocatorStrategies.identifier = core.LocatorStrategies.identifier_;
core.LocatorStrategies.implicit = core.LocatorStrategies.implicit_;
core.LocatorStrategies.name = core.LocatorStrategies.name_;
core.LocatorStrategies.stored = core.LocatorStrategies.stored_;
core.LocatorStrategies.xpath = core.LocatorStrategies.xpath_;core.locators = {};
core.locators.Locator = {};
core.locators.parseLocator_ = function(a) {
  var b = a.match(/^([A-Za-z]+)=.+/);
  if(b) {
    b = b[1].toLowerCase();
    a = a.substring(b.length + 1);
    return{type:b, string:a}
  }
  b = {string:"", type:""};
  b.string = a;
  b.type = goog.string.startsWith(a, "//") ? "xpath" : goog.string.startsWith(a, "document.") ? "dom" : "identifier";
  return b
};
core.locators.addStrategy = function(a, b) {
  core.LocatorStrategies[a] = b
};
core.locators.findElementBy_ = function(a, b, c) {
  var d = core.LocatorStrategies[a];
  if(!d) {
    throw new core.Error("Unrecognised locator type: '" + a + "'");
  }
  return d.call(null, b, c)
};
core.locators.findElementRecursive_ = function(a, b, c, d) {
  c = core.locators.findElementBy_(a, b, c);
  if(c != null) {
    return c
  }
  if(!d) {
    return null
  }
  for(var e = 0;e < d.frames.length;e++) {
    var f;
    try {
      f = d.frames[e].document
    }catch(g) {
    }
    if(f) {
      c = core.locators.findElementRecursive_(a, b, f, d.frames[e]);
      if(c != null) {
        return c
      }
    }
  }
  return null
};
core.locators.findElementOrNull = function(a, b) {
  a = core.locators.parseLocator_(a);
  var c = b || bot.window_;
  c = core.locators.findElementRecursive_(a.type, a.string, c.document, c);
  if(c != null) {
    return c
  }
  return null
};
core.locators.findElement = function(a, b, c) {
  b = core.locators.findElementOrNull(a, c || bot.window_);
  if(b == null) {
    throw new core.Error("Element " + a + " not found");
  }
  return b
};
core.locators.isElementPresent = function(a) {
  return!!core.locators.findElementOrNull(a)
};
core.locators.elementFindFirstMatchingChild = function(a, b) {
  var c = a.childNodes.length;
  for(var d = 0;d < c;d++) {
    var e = a.childNodes[d];
    if(e.nodeType == goog.dom.NodeType.ELEMENT) {
      if(b(e)) {
        return e
      }
      if(e = core.locators.elementFindFirstMatchingChild(e, b)) {
        return e
      }
    }
  }
  return null
};core.patternMatcher = {};
core.patternMatcher.exact_ = function(a, b) {
  return b.indexOf(a) != -1
};
core.patternMatcher.regexp_ = function(a, b) {
  return RegExp(a).test(b)
};
core.patternMatcher.regexpi_ = function(a, b) {
  return RegExp(a, "i").text(b)
};
core.patternMatcher.globContains_ = function(a, b) {
  return RegExp(core.patternMatcher.regexpFromGlobContains(a)).test(b)
};
core.patternMatcher.glob_ = function(a, b) {
  return RegExp(core.patternMatcher.regexpFromGlob(a)).test(b)
};
core.patternMatcher.convertGlobMetaCharsToRegexpMetaChars_ = function(a) {
  a = a;
  a = a.replace(/([.^$+(){}\[\]\\|])/g, "\\$1");
  a = a.replace(/\?/g, "(.|[\r\n])");
  return a = a.replace(/\*/g, "(.|[\r\n])*")
};
core.patternMatcher.regexpFromGlobContains = function(a) {
  return core.patternMatcher.convertGlobMetaCharsToRegexpMetaChars_(a)
};
core.patternMatcher.regexpFromGlob = function(a) {
  return"^" + core.patternMatcher.convertGlobMetaCharsToRegexpMetaChars_(a) + "$"
};
core.patternMatcher.KNOWN_STRATEGIES_ = {exact:core.patternMatcher.exact_, glob:core.patternMatcher.glob_, globcontains:core.patternMatcher.globContains_, regex:core.patternMatcher.regexp_, regexi:core.patternMatcher.regexpi_, regexpi:core.patternMatcher.regexpi_, regexp:core.patternMatcher.regexp_};
core.patternMatcher.against = function(a) {
  var b = "glob", c = /^([a-zA-Z-]+):(.*)/.exec(a);
  if(c) {
    var d = c[1];
    c = c[2];
    if(core.patternMatcher.KNOWN_STRATEGIES_[d.toLowerCase()]) {
      b = d.toLowerCase();
      a = c
    }
  }
  d = core.patternMatcher.KNOWN_STRATEGIES_[b];
  if(!d) {
    throw new core.Error("Cannot find pattern matching strategy: " + b);
  }
  if(b == "glob") {
    if(a.indexOf("glob:") == 0) {
      a = a.substring(5)
    }
    d = core.patternMatcher.KNOWN_STRATEGIES_.glob
  }else {
    if(b == "exact" && a.indexOf("exact:") == 0) {
      a = a.substring(6)
    }
  }
  a = goog.partial(d, a);
  a.strategyName = b;
  return a
};
core.patternMatcher.matches = function(a, b) {
  return core.patternMatcher.against(a)(b)
};core.select = {};
core.select.option = {};
core.select.option.createIndexLocator_ = function(a) {
  var b = Number(a);
  if(isNaN(b) || b < 0) {
    throw new core.Error("Illegal Index: " + a);
  }
  return{findOption:function(c) {
    if(c.options.length <= b) {
      throw new core.Error("Index out of range.  Only " + c.options.length + " options available");
    }
    return c.options[b]
  }, assertSelected:function(c) {
    if(b != c.selectedIndex) {
      throw new core.Error("Selected index (" + c.selectedIndex + ") does not match expected index: " + b);
    }
  }}
};
core.select.option.createTextLocator_ = function(a) {
  var b = core.patternMatcher.against(a);
  return{findOption:function(c) {
    for(var d = 0;d < c.options.length;d++) {
      if(b(c.options[d].text)) {
        return c.options[d]
      }
    }
    throw new core.Error("Option with label '" + a + "' not found");
  }, assertSelected:function(c) {
    c = c.options[c.selectedIndex].text;
    if(!b(c)) {
      throw new core.Error("Expected text (" + a + ") did not match: " + c);
    }
  }}
};
core.select.option.createValueLocator_ = function(a) {
  var b = core.patternMatcher.against(a);
  return{findOption:function(c) {
    for(var d = 0;d < c.options.length;d++) {
      if(b(c.options[d].value)) {
        return c.options[d]
      }
    }
    throw new core.Error("Option with value '" + a + "' not found");
  }, assertSelected:function(c) {
    c = c.options[c.selectedIndex].value;
    if(!matches(c)) {
      throw new core.Error("Expected value (" + a + ") did not match: " + c);
    }
  }}
};
core.select.option.createIdLocator_ = function(a) {
  var b = core.patternMatcher.against(a);
  return{findOption:function(c) {
    for(var d = 0;d < c.options.length;d++) {
      if(b(c.options[d].id)) {
        return c.options[d]
      }
    }
    throw new core.Error("Option with id '" + a + "' not found");
  }, assertSelected:function(c) {
    c = c.options[c.selectedIndex].id;
    if(!b(selectedValue)) {
      throw new core.Error("Expected id (" + a + ") did not match: " + c);
    }
  }}
};
core.select.option.Locators_ = {id:core.select.option.createIdLocator_, index:core.select.option.createIndexLocator_, label:core.select.option.createTextLocator_, text:core.select.option.createTextLocator_, value:core.select.option.createValueLocator_};
core.select.option.getOptionLocator_ = function(a) {
  var b = "label", c = a;
  if(a = a.match(/^([a-zA-Z]+)=(.*)/)) {
    b = a[1];
    c = a[2]
  }
  if(a = core.select.option.Locators_[b]) {
    return a(c)
  }
  throw new core.Error("Unknown option locator type: " + b);
};
core.select.findSelect = function(a) {
  a = goog.isString(a) ? core.locators.findElement(a) : a;
  if(goog.isDef(a.options)) {
    return a
  }
  throw new core.Error("Specified element is not a Select (has no options)");
};
core.select.option.findOption = function(a, b) {
  var c = core.select.findSelect(a);
  return core.select.option.getOptionLocator_(b).findOption(c)
};
core.select.findSelectedOptionProperties_ = function(a, b) {
  var c = core.select.findSelect(a), d = [];
  for(var e = 0;e < c.options.length;e++) {
    c.options[e].selected && d.push(c.options[e][b])
  }
  if(d.length == 0) {
    throw new core.Error("No option selected");
  }
  return d
};
core.select.findSelectedOptionProperty_ = function(a, b) {
  var c = core.select.findSelectedOptionProperties_(a, b);
  if(c.length > 1) {
    throw new core.Error("More than one selected option!");
  }
  return c[0]
};
core.select.isSomethingSelected = function(a) {
  a = core.select.findSelect(a);
  for(var b = 0;b < a.options.length;b++) {
    if(a.options[b].selected) {
      return true
    }
  }
  return false
};
core.select.getSelectedText = function(a) {
  return core.select.findSelectedOptionProperty_(a, "text")
};
core.select.setSelected = function(a, b) {
  var c = core.select.findSelect(a);
  c = core.select.option.getOptionLocator_(b).findOption(c);
  bot.action.setSelected(c, true)
};core.element = {};
core.element.findAttribute_ = function(a) {
  var b = a.lastIndexOf("@"), c = a.slice(0, b);
  a = a.slice(b + 1);
  c = core.locators.findElement(c);
  return bot.dom.getAttribute(c, a)
};
core.element.getAttribute = function(a) {
  var b = core.element.findAttribute_(a);
  if(b == null) {
    throw new core.Error("Could not find element attribute: " + a);
  }
  return b
};core.browserbot = {};
core.browserbot.isVisible = function(a) {
  a = core.locators.findElement(a);
  return bot.dom.isShown(a)
};core.text = {};
core.text.getTextContent_ = function(a, b) {
  if(a.style && (a.style.visibility == "hidden" || a.style.display == "none")) {
    return""
  }
  var c;
  if(a.nodeType == goog.dom.NodeType.TEXT) {
    c = a.data;
    b || (c = c.replace(/\n|\r|\t/g, " "));
    return c.replace(/&nbsp/, " ")
  }
  if(a.nodeType == goog.dom.NodeType.ELEMENT && a.nodeName != "SCRIPT") {
    var d = b || a.tagName == "PRE";
    c = "";
    for(var e = 0;e < a.childNodes.length;e++) {
      var f = a.childNodes.item(e);
      c += core.text.getTextContent_(f, d)
    }
    if(a.tagName == "P" || a.tagName == "BR" || a.tagName == "HR" || a.tagName == "DIV") {
      c += "\n"
    }
    return c.replace(/&nbsp/, " ")
  }
  return""
};
core.text.normalizeNewlines_ = function(a) {
  return a.replace(/\r\n|\r/g, "\n")
};
core.text.replaceAll_ = function(a, b, c) {
  for(;a.indexOf(b) != -1;) {
    a = a.replace(b, c)
  }
  return a
};
core.text.normalizeSpaces_ = function(a) {
  if(goog.userAgent.IE) {
    return a
  }
  a = a.replace(/\ +/g, " ");
  var b = RegExp(String.fromCharCode(160), "g");
  return goog.userAgent.SAFARI ? core.text.replaceAll_(a, String.fromCharCode(160), " ") : a.replace(b, " ")
};
core.text.getText = function(a) {
  a = goog.isString(a) ? core.locators.findElement(a) : a;
  var b;
  if(goog.userAgent.GECKO && goog.userAgent.VERSION >= "1.8" || goog.userAgent.KONQUEROR || goog.userAgent.SAFARI || goog.userAgent.OPERA) {
    b = core.text.getTextContent_(a)
  }else {
    if(a.textContent) {
      b = a.textContent
    }else {
      if(a.innerText) {
        b = a.innerText
      }
    }
  }
  b = core.text.normalizeNewlines_(b);
  b = core.text.normalizeSpaces_(b);
  return goog.string.trim(b)
};
core.text.getBodyText = function() {
  return core.text.getText(bot.window_.document.body)
};
core.text.isTextPresent = function(a) {
  var b = core.text.getBodyText(), c = core.patternMatcher.against(a);
  if(c.strategyName == "glob") {
    if(a.indexOf("glob:") == 0) {
      a = a.substring(5)
    }
    c = core.patternMatcher.against("globContains:" + a)
  }
  return c(b)
};
core.text.linkLocator = function(a, b) {
  var c = (b || goog.dom.getOwnerDocument(bot.getWindow())).getElementsByTagName("a");
  for(var d = 0;d < c.length;d++) {
    var e = c[d], f = core.text.getText(e);
    if(core.patternMatcher.matches(a, f)) {
      return e
    }
  }
  return null
};
core.locators.addStrategy("link", core.text.linkLocator);
