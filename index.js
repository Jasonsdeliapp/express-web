var _ = require('underscore');
var s = require('underscore.string');

var $ = module.exports = {};

var dirs = ['lib', 'views', 'plugins', 'controllers', 'services', 'managers', 'orchestrators'];
_.each(dirs, function(dir) {
    $[dir] = {};
});

$.load = function(_$) {
    if (_$) {
        _.extend($, _$);
    }

    console.log('');
    console.log('LOADING');

    var process = function(moduleName, list) {
        var module = $[moduleName];

        var indexItems = [];

        var doItem = function(item) {
            var splits = item.name.split('/');
            if (splits.length > 1) {
                var ref = module;
                _.each(splits, function(split, index) {
                    split = s.camelize(split);
                    if (index === splits.length - 1) {
                        ref[split] = item.module;
                    } else {
                        ref = ref[split] || (ref[split] = {});
                    }
                });
            } else {
                module[s.camelize(item.name)] = item.module;
            }
        };

        _.each(list, function(item) {
            //console.log('!!!item.name before', item.name);
            item.name = item.name.split(moduleName+'/')[1];

            //console.log('!!!item.name', item.name);
            if (item.name.indexOf('index') !== -1) {
                return indexItems.push(item);
            }
            doItem(item);
        });

        _.each(indexItems, function(item) {
            doItem(item);
        });
        console.log('loaded', moduleName, module);
    };

    process('lib', require('../../lib/**/*.js', {mode: 'list', resolve:['path','strip-ext']}));

    process('views', require('../../views/**/*{.ejs,.js}', {mode: 'list', resolve:['path','strip-ext']}));

    process('plugins', require('../../plugins/**/*.js', {mode: 'list', resolve:['path','strip-ext']}));

    process('controllers', require('../../controllers/**/*.js', {mode: 'list', resolve:['path','strip-ext']}));

    process('services', require('../../services/**/*.js', {mode: 'list', resolve:['path','strip-ext']}));

    process('managers', require('../../managers/**/*.js', {mode: 'list', resolve:['path','strip-ext']}));

    process('orchestrators', require('../../orchestrators/**/*.js', {mode: 'list', resolve:['path','strip-ext']}));

    return $;
};