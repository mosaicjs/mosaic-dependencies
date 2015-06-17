import expect from 'expect.js';
import { Dependencies, callDependencies, callDependents } from '../';

describe('Dependencies', function() {
    it('shoud be able to define all dependencies for an element', function(){
        let deps = new Dependencies();
        deps.setDependency('A', ['B', 'C']);
        deps.setDependency('B', ['D']);
        deps.setDependency('C', ['D']);
        expect(deps.getDependencies('A')).to.eql(['B', 'C']);
        expect(deps.getDependencies('B')).to.eql(['D']);
        expect(deps.getDependencies('C')).to.eql(['D']);
        expect(deps.getDependencies('D')).to.eql([]);
    });
    it('shoud be able to define dependent modules for an element', function(){
        let deps = new Dependencies();
        deps.setDependency('A', ['B', 'C']);
        deps.setDependency('B', ['D']);
        deps.setDependency('C', ['D']);
        expect(deps.getDependents('A')).to.eql([]);
        expect(deps.getDependents('B')).to.eql(['A']);
        expect(deps.getDependents('C')).to.eql(['A']);
        expect(deps.getDependents('D')).to.eql(['B','C']);
    });
    it('shoud be able to call all dependent elements in a good order', function(done){
        let deps = new Dependencies();
        deps.setDependency('A', ['B', 'C']);
        deps.setDependency('B', ['D']);
        deps.setDependency('C', ['D']);
        var idx = 0;
        callDependents(deps, 'D', {
            end : function(params){
                var result = { key: params.key, idx: idx++ };
                if (params.result) {
                    result.res = params.result;
                } else if (params.error) {
                    result.error = params.error;
                }
                return result; 
            }
        }).then(function(result){
            // console.log(JSON.stringify(result, null, 2));
            expect(result).to.eql([
           {
               "key": "D",
               "idx": 3,
               "res": [
                 {
                   "key": "B",
                   "idx": 1,
                   "res": [
                     {
                       "key": "A",
                       "idx": 0
                     }
                   ]
                 },
                 {
                   "key": "C",
                   "idx": 2,
                   "res": [
                     {
                       "key": "A",
                       "idx": 0
                     }
                   ]
                 }
               ]
             }
           ]);
        }).then(done, done);
    });
    it('should be able to call dependencies in a good order...', function(done) {
        let deps = new Dependencies();
        deps.setDependency('load', ['loadData', 'loadPreferences']);
        deps.setDependency('configure', ['load']);
        deps.setDependency('view', ['configure', 'checkAccess']);
        var idx = 0;
        callDependencies(deps, 'view', {
            end : function(params){
                var result = { key: params.key, idx: idx++ };
                if (params.result) {
                    result.res = params.result;
                } else if (params.error) {
                    result.error = params.error;
                }
                return result; 
            }
        }).then(function(result){
// console.log(JSON.stringify(result, null, 2));
            expect(result).to.eql([
               {
                   "key": "view",
                   "idx": 5,
                   "res": [
                     {
                       "key": "configure",
                       "idx": 4,
                       "res": [
                         {
                           "key": "load",
                           "idx": 3,
                           "res": [
                             {
                               "key": "loadData",
                               "idx": 1
                             },
                             {
                               "key": "loadPreferences",
                               "idx": 2
                             }
                           ]
                         }
                       ]
                     },
                     {
                       "key": "checkAccess",
                       "idx": 0
                     }
                   ]
                 }
              ]);
        }).then(done, done);
    });
});
    