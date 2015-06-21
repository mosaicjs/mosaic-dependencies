(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("promise"));
	else if(typeof define === 'function' && define.amd)
		define(["promise"], factory);
	else {
		var a = typeof exports === 'object' ? factory(require("promise")) : factory(root["promise"]);
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(this, function(__WEBPACK_EXTERNAL_MODULE_3__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	    value: true
	});

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _libDependencies = __webpack_require__(1);

	var _libDependencies2 = _interopRequireDefault(_libDependencies);

	var _libDependenciesCaller = __webpack_require__(2);

	exports['default'] = {
	    Dependencies: _libDependencies2['default'],
	    callDependencies: _libDependenciesCaller.callDependencies,
	    callDependents: _libDependenciesCaller.callDependents
	};
	module.exports = exports['default'];

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * This is a simple class used to manage dependencies between entities.
	 */
	'use strict';

	Object.defineProperty(exports, '__esModule', {
	    value: true
	});

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	var Dependencies = (function () {
	    function Dependencies() {
	        _classCallCheck(this, Dependencies);
	    }

	    _createClass(Dependencies, [{
	        key: 'setDependencies',

	        /**
	         * Sets dependencies between modules using a map where keys are module names
	         * and values are lists of dependencies. This method rises an exception if
	         * user tries to set circular dependencies.
	         * 
	         * @param dependencies
	         *            a map containing modules with the corresponding arrays of
	         *            dependencies
	         */
	        value: function setDependencies(dependencies) {
	            dependencies.forEach(function (deps, module) {
	                this.setDependency(module, deps);
	            }, this);
	        }
	    }, {
	        key: 'setDependency',

	        /**
	         * Sets new dependency for the specified module. This method rises an
	         * exception if user tries to set circular dependencies.
	         * 
	         * @param key
	         *            the key of the module
	         * @param dependencies
	         *            an array of dependencies for the specified module
	         */
	        value: function setDependency(key, dependencies) {
	            var that = this;
	            if (!that._checkDependencies(key, dependencies)) {
	                throw new Error('Circular dependencies');
	            }
	            that._setDependencies(key, dependencies);
	        }
	    }, {
	        key: 'visit',

	        /**
	         * Visits dependencies and notifies the given listener when the visitor
	         * enters and exists from an entry.
	         * 
	         * @param key
	         *            the key of an entry to visit
	         */
	        value: function visit(key, listener) {
	            return this._visit(this._direct, key, listener);
	        }
	    }, {
	        key: 'visitDependent',

	        /**
	         * Visits all elements depending on the specified one.
	         * 
	         * @param key
	         *            the key of an entry to visit
	         */
	        value: function visitDependent(key, listener) {
	            return this._visit(this._inverse, key, listener);
	        }
	    }, {
	        key: '_visit',

	        /**
	         * Visits dependencies using the specified index and notifies a listener
	         * when the visitor enters and exists from an entry.
	         * 
	         * @param key
	         *            the key of an entry to visit
	         */
	        value: function _visit(index, key, listener) {
	            if (listener.begin) {
	                listener.begin(key);
	            }
	            if (index) {
	                var deps = index[key] || [];
	                deps.forEach(function (k) {
	                    this._visit(index, k, listener);
	                }, this);
	            }
	            if (listener.end) {
	                listener.end(key);
	            }
	        }
	    }, {
	        key: 'getDependencies',

	        /**
	         * Returns all dependencies of an element with the specified key.
	         */
	        value: function getDependencies(key) {
	            if (!this._direct) return [];
	            return this._direct[key] || [];
	        }
	    }, {
	        key: 'getDependents',

	        /**
	         * Returns key of all elements depending on the specified one.
	         */
	        value: function getDependents(key) {
	            if (!this._inverse) return [];
	            return this._inverse[key] || [];
	        }
	    }, {
	        key: 'getAllDependents',

	        /**
	         * Returns key of all elements depending on the specified one.
	         */
	        value: function getAllDependents(key) {
	            return this._collect(this._inverse, key);
	        }
	    }, {
	        key: 'getAllDependencies',

	        /**
	         * A list of all dependencies for the specified key in the order of their
	         * resolving.
	         */
	        value: function getAllDependencies(key) {
	            return this._collect(this._direct, key);
	        }
	    }, {
	        key: '_collect',

	        /**
	         * Collects all keys depending on the specified one.
	         */
	        value: function _collect(index, key) {
	            var deps = [];
	            this._visit(index, key, {
	                end: function end(k) {
	                    if (k !== key) {
	                        deps.push(k);
	                    }
	                }
	            });
	            return deps;
	        }
	    }, {
	        key: '_checkDependencies',

	        /**
	         * Returns true if the specified dependencies could be set for the given
	         * key.
	         * 
	         * @param key
	         *            the key to check
	         * @param dependencies
	         *            a list of dependencies to check
	         */
	        value: function _checkDependencies(key, dependencies) {
	            var that = this;
	            var deps = Array.isArray(dependencies) ? dependencies : [dependencies];
	            return Dependencies.check(key, function (k) {
	                if (k === key) {
	                    return deps;
	                } else {
	                    return that.getDependencies(k);
	                }
	            });
	        }
	    }, {
	        key: '_setDependencies',

	        /**
	         * Really sets dependencies for a module with the specified key. This method
	         * could be overloaded in subclasses.
	         * 
	         * @param key
	         *            for this key a list dependencies should be set
	         * @param deps
	         *            a list of dependencies
	         */
	        value: function _setDependencies(key, deps) {
	            if (!this._direct) {
	                this._direct = {};
	            }
	            if (!this._inverse) {
	                this._inverse = {};
	            }
	            this._direct[key] = deps;
	            deps.forEach((function (dep) {
	                var array = this._inverse[dep] = this._inverse[dep] || [];
	                var add = true;
	                array.forEach(function (d) {
	                    add &= d !== dep;
	                });
	                if (add) {
	                    array.push(key);
	                }
	            }).bind(this));
	        }
	    }], [{
	        key: 'check',

	        /**
	         * This static method checks that there is no circular dependencies between
	         * entities.
	         * 
	         * @param key
	         *            the key of the initial dependency
	         * @param provider
	         *            a function returning an array of all dependencies for the
	         *            specified key
	         */
	        value: function check(key, provider) {
	            var index = {};
	            function isIndexed(k) {
	                if (index[k]) return true;
	                try {
	                    index[k] = true;
	                    var list = provider(k) || [];
	                    return !!list.find(isIndexed);
	                } finally {
	                    delete index[k];
	                }
	            }
	            return !isIndexed(key);
	        }
	    }]);

	    return Dependencies;
	})();

	exports['default'] = Dependencies;
	module.exports = exports['default'];

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	    value: true
	});

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _promise = __webpack_require__(3);

	var _promise2 = _interopRequireDefault(_promise);

	function callDeps(context, index, key, listener) {
	    var promises = {};
	    return _promise2['default'].resolve().then(function () {
	        var keys = Array.isArray(key) ? key : [key];
	        return _promise2['default'].all(keys.map(visit.bind(context, null)));
	    });
	    function visit(parentKey, k, pos) {
	        if (!promises[k]) {
	            var params = {
	                parentKey: parentKey,
	                key: k,
	                pos: pos
	            };
	            promises[k] = _promise2['default'].resolve().then(function () {
	                if (listener.begin) return listener.begin(params);
	            }).then(function () {
	                var deps = index ? index[k] : [];
	                if (!deps || !deps.length) return;
	                return _promise2['default'].all(deps.map(visit.bind(context, k)));
	            }).then(function (result) {
	                params.result = result;
	                if (listener.end) return listener.end(params);else return result;
	            }, function (err) {
	                params.error = err;
	                if (listener.end) return listener.end(params);else throw err;
	            });
	        }
	        return promises[k];
	    }
	}

	exports['default'] = {

	    /**
	     * This method asynchronously executes "begin" and "end" actions in the
	     * specified listener on the given key with all dependencies and return a
	     * promise with the results of the execution.
	     * 
	     * @param dependencies
	     *            a Dependencies object
	     * @param key
	     *            the key of the action to launch; if this parameter is an array
	     *            then all keys from this array will be executed
	     * @param listener
	     *            a listener object containing two methods: "begin" and "end"
	     * @param listener.begin
	     *            this method takes the dependency context - a) key - key of the
	     *            current dependency b) parentKey - key of the parent dependency
	     *            c) pos - position of the key in the parent execution chain
	     * @param listener.end
	     *            this method takes the same context as the "begin" method; this
	     *            context is completed with the "result" or "error" fields
	     *            containing execution results for child actions
	     */
	    callDependencies: function callDependencies(dependencies, key, listener) {
	        if (arguments.length < 3) {
	            key = arguments[0];
	            listener = arguments[1];
	            dependencies = this;
	        }
	        return callDeps(this, dependencies._direct, key, listener);
	    },

	    /**
	      * This method asynchronously executes "begin" and "end" actions in the
	      * specified listener on each element depending on the given key and return
	      * a promise with the results of the execution.
	      * 
	      * @param dependencies
	      *            a Dependencies object
	      * @param key
	      *            the key of the action to launch
	      * @param listener
	      *            a listener object containing two methods: "begin" and "end"
	      * @param listener.begin
	      *            this method takes the dependency context - a) key - key of the
	      *            current dependency b) parentKey - key of the parent dependency
	      *            c) pos - position of the key in the parent execution chain
	      * @param listener.end
	      *            this method takes the same context as the "begin" method; this
	      *            context is completed with the "result" or "error" fields
	      *            containing execution results for child actions
	      */
	    callDependents: function callDependents(dependencies, key, listener) {
	        if (arguments.length < 3) {
	            key = arguments[0];
	            listener = arguments[1];
	            dependencies = this;
	        }
	        var list = dependencies.getAllDependents(key);
	        var index = {};
	        index[key] = true;
	        list.forEach(function (k) {
	            index[k] = true;
	        });
	        return callDeps(this, dependencies._direct, Object.keys(index), listener);
	    } };
	module.exports = exports['default'];

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_3__;

/***/ }
/******/ ])
});
;