# mosaic-dependencies

Promise-based dependency management. This module allows to manage a good order
of asynchronous method calls taking into account a chain of dependencies.

The "Dependencies" class of this module allows to define dependencies between
elements using their string keys. It checks that there is no cycles in
dependency declarations. This class allows to recursively retrieve all
dependencies as well as all dependent keys.

This module also declares two utility methods:
 * callDependencies
 * callDependents
These method take a dependency object and an element key as parameters and
calls a specified listener for all dependencies or dependent elements taking 
into account their declaration order.  