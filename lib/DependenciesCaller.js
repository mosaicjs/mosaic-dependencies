import Promise from 'promise';

function callDeps(context, index, key, listener) {
     let promises = {};
     return Promise.resolve().then(function() {
         let keys = Array.isArray(key) ? key : [key]; 
         return Promise.all(keys.map(visit.bind(context, null)));
     });
     function visit(parentKey, k, pos) {
         if (!promises[k]) {
             var params = {
                parentKey,
                key : k,
                pos : pos
             };
             promises[k] = Promise.resolve().then(function() {
                 if (listener.begin)
                     return listener.begin(params);
             }).then(function() {
                 let deps = index[k];
                 if (!deps || !deps.length)
                     return;
                 return Promise.all(deps.map(visit.bind(context, k)));
             }).then(function(result) {
                 params.result = result;
                 if (listener.end)
                     return listener.end(params);
                 else
                     return result;
             }, function(err) {
                 params.error = err;
                 if (listener.end)
                     return listener.end(params);
                 else
                     throw err;
             });
         }
         return promises[k];
     }        
}

export default {

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
   callDependencies(dependencies, key, listener) {
       if (arguments.length < 3) {
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
   callDependents(dependencies, key, listener) {
       if (arguments.length < 3) {
           key = arguments[0];
           listener = arguments[1];
           dependencies = this;
       }
       return callDeps(this, dependencies._inverse, key, listener);
   },

}