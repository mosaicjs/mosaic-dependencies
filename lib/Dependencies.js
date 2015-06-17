/**
 * This is a simple class used to manage dependencies between entities.
 */
export default class Dependencies {
    
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
    static check(key, provider) {
        let index = {};
        function isIndexed(k) {
            if (index[k])
                return true;
            try {
                index[k] = true;
                let list = provider(k) || [];
                return !!list.find(isIndexed);
            } finally {
                delete index[k];
            }
        }
        return !isIndexed(key);
    };


    /**
     * Sets dependencies between modules using a map where keys are module names
     * and values are lists of dependencies. This method rises an exception if
     * user tries to set circular dependencies.
     * 
     * @param dependencies
     *            a map containing modules with the corresponding arrays of
     *            dependencies
     */
    setDependencies(dependencies) {
        dependencies.forEach(function(deps, module) {
            this.setDependency(module, deps);
        }, this);
    }

    /**
     * Sets new dependency for the specified module. This method rises an
     * exception if user tries to set circular dependencies.
     * 
     * @param key
     *            the key of the module
     * @param dependencies
     *            an array of dependencies for the specified module
     */
    setDependency(key, dependencies) {
        let that = this;
        if (!that._checkDependencies(key, dependencies)) {
            throw new Error('Circular dependencies');
        }
        that._setDependencies(key, dependencies);
    }

    /**
     * Visits dependencies and notifies the given listener when the visitor
     * enters and exists from an entry.
     * 
     * @param key
     *            the key of an entry to visit
     */
    visit(key, listener) {
        return this._visit(this._direct, key, listener);
    }

    /**
     * Visits all elements depending on the specified one.
     * 
     * @param key
     *            the key of an entry to visit
     */
    visitDependent(key, listener) {
        return this._visit(this._inverse, key, listener);
    }
    
    /**
     * Visits dependencies using the specified index and notifies a listener
     * when the visitor enters and exists from an entry.
     * 
     * @param key
     *            the key of an entry to visit
     */
    _visit(index, key, listener) {
        if (listener.begin) {
            listener.begin(key);
        }
        if (index){
            let deps = index[key] || [];
            deps.forEach(function(k) {
                this._visit(index, k, listener);
            }, this);
        }
        if (listener.end) {
            listener.end(key);
        }
    }


    /**
     * Returns all dependencies of an element with the specified key.
     */
    getDependencies(key) {
        if (!this._direct)
            return [];
        return this._direct[key] || [];
    }

    /**
     * Returns key of all elements depending on the specified one.
     */
    getDependents(key) {
        if (!this._inverse)
            return [];
        return this._inverse[key] || [];
    }
    
    /**
     * Returns key of all elements depending on the specified one.
     */
    getAllDependents(key) {
        return this._collect(this._inverse, key);
    }
    
    /**
     * A list of all dependencies for the specified key in the order of their
     * resolving.
     */
    getAllDependencies(key) {
        return this._collect(this._direct, key);
        
    }
    
    /**
     * Collects all keys depending on the specified one.
     */
    _collect(index, key){
        let deps = [];
        this._visit(index, key, {
            end : function(k) {
                if (k !== key) {
                    deps.push(k);
                }
            }
        });
        return deps;
    }

    /**
     * Returns true if the specified dependencies could be set for the given
     * key.
     * 
     * @param key
     *            the key to check
     * @param dependencies
     *            a list of dependencies to check
     */
    _checkDependencies(key, dependencies) {
        let that = this;
        let deps = Array.isArray(dependencies) ? dependencies : [ dependencies ];
        return Dependencies.check(key, function(k) {
            if (k === key) {
                return deps;
            } else {
                return that.getDependencies(k);
            }
        });
    }

    /**
     * Really sets dependencies for a module with the specified key. This method
     * could be overloaded in subclasses.
     * 
     * @param key
     *            for this key a list dependencies should be set
     * @param deps
     *            a list of dependencies
     */
    _setDependencies(key, deps) {
        if (!this._direct) {
            this._direct = {};
        }
        if (!this._inverse) {
            this._inverse = {};
        }
        this._direct[key] = deps;
        deps.forEach(function(dep){
            let array = this._inverse[dep] = this._inverse[dep] || [];
            let add = true;
            array.forEach(function(d){
                add &= (d !== dep); 
            })
            if (add){
                array.push(key);
            }
        }.bind(this));
    }

}
