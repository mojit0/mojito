/*
 * Copyright (c) 2011-2013, Yahoo! Inc.  All rights reserved.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */
YUI().use('mojito-action-context', 'test', function (Y) {

    var suite = new Y.Test.Suite('mojito-action-context tests'),
        acStash = {},
        A = Y.Assert,
        OA = Y.ObjectAssert,
        store = {
            getAppConfig: function() {
                return 'app config';
            },
            getStaticContext: function() {
                return 'static context';
            },
            getRoutes: function(ctx) {
                return "routes";
            }
        };

    suite.add(new Y.Test.Case({

        name: 'instantiation',

        setUp: function() {
            Y.Object.each(Y.namespace('mojito.addons').ac, function(v, k) {
                acStash[k] = v;
            });
        },

        tearDown: function() {
            Y.namespace('mojito').controller = null;
            Y.namespace('mojito').models = {};
            Y.Object.each(acStash, function(v, k) {
                Y.namespace('mojito.addons').ac[k] = v;
            });
        },

        'test flush function': function() {

            var ac;
            Y.namespace('mojito').controller = {
                index: function() {}
            };
            ac = new Y.mojito.ActionContext({
                dispatcher: 'the dispatcher',
                command: {
                    action: 'index',
                    context: 'context',
                    instance: {
                        type: 'Type',
                        config: 'instance config',
                        views: 'views'
                    }
                },
                models: {},
                controller: {index: function() {}},
                store: store
            });

            ac._adapter = {
                flush: function (data, meta) {
                    A.areSame(data, 'test flush data', 'improper test data');
                }
            };

            ac.flush('test flush data');
        },

        'test done function': function() {

            var ac;
            Y.namespace('mojito').controller = {
                index: function() {}
            };
            ac = new Y.mojito.ActionContext({
                dispatcher: 'the dispatcher',
                command: {
                    action: 'index',
                    context: 'context',
                    instance: {
                        type: 'Type',
                        config: 'instance config',
                        views: 'views'
                    }
                },
                models: {},
                controller: {index: function() {}},
                store: store
            });

            ac._adapter = {
                done: function (data, meta) {
                    A.areSame(data, 'test done data', 'improper test data');
                }
            };

            ac.done('test done data');
        },

        'test error function': function() {

            var ac;
            Y.namespace('mojito').controller = {
                index: function() {}
            };
            ac = new Y.mojito.ActionContext({
                dispatcher: 'the dispatcher',
                command: {
                    action: 'index',
                    context: 'context',
                    instance: {
                        type: 'Type',
                        config: 'instance config',
                        views: 'views'
                    }
                },
                models: {},
                controller: {index: function() {}},
                store: store
            });

            ac._adapter = {
                error: function (data, meta) {
                    A.areSame(data, 'test error data', 'improper test data');
                }
            };

            ac.error('test error data');
        },

        'test dispatch function': function() {

            var ac;
            Y.namespace('mojito').controller = {
                index: function() {}
            };
            ac = new Y.mojito.ActionContext({
                command: {
                    action: 'index',
                    context: 'context',
                    instance: {
                        type: 'Type',
                        config: 'instance config',
                        views: 'views'
                    }
                },
                models: {},
                controller: {index: function() {}},
                dispatcher: 'the dispatcher',
                adapter: { },
                store: store
            });

            A.areSame('the dispatcher', ac.dispatcher,
                "dispatcher wasn't stashed.");
        },

        'test all required (was: default) plugins are preloaded and plugged': function() {
            Y.namespace('mojito.addons.ac').custom = function() {
                return { namespace: 'custom' };
            };
            var ac = new Y.mojito.ActionContext({
                dispatcher: 'the dispatcher',
                command: {
                    action: 'index',
                    instance: {
                        id: 'id',
                        type: 'Type666',
                        acAddons: ['custom']
                    }
                },
                controller: {index: function() {}},
                store: store
            });

            A.isObject(ac.custom, 'custom required addon is missing');
        },

        'test AC properties': function() {
            var ac;
            Y.namespace('mojito').controller = {
                index: function() {}
            };
            ac = new Y.mojito.ActionContext({
                dispatcher: 'the dispatcher',
                command: {
                    action: 'index',
                    context: 'context',
                    instance: {
                        type: 'Type',
                        config: 'instance config',
                        views: 'views'
                    }
                },
                models: {},
                controller: {index: function() {}},
                store: store
            });

            A.areSame('Type', ac.type, 'bad type');
            A.areSame('index', ac.action, 'bad action');
            A.areSame('context', ac.context, 'bad context');

            A.areSame('the dispatcher', ac.dispatcher,
                "dispatcher wasn't stashed.");
        },

        'test ac plugins plugged in proper order': function() {
            var mixes = [];

            Y.namespace('mojito').controller = { index: function() {} };

            // null out all existing
            Y.Object.each(Y.namespace('mojito.addons').ac, function(v, k) {
                delete Y.namespace('mojito.addons').ac[k];
            });

            Y.namespace('mojito.addons.ac').third = function() {
                mixes.push(3);
                return { namespace: 'third' };
            };
            Y.namespace('mojito.addons.ac').second = function() {
                mixes.push(2);
                return { namespace: 'second' };
            };
            Y.namespace('mojito.addons.ac').first = function() {
                mixes.push(1);
                return { namespace: 'first' };
            };
            Y.namespace('mojito.addons.ac').fourth = function() {
                mixes.push(4);
                return { namespace: 'fourth' };
            };

            new Y.mojito.ActionContext({
                dispatch: 'the dispatch',
                command: {
                    action: 'index',
                    instance: {
                        id: 'id',
                        type: 'Type2', // Need to clear the addons cache
                        acAddons: [
                            'first',
                            'second',
                            'third',
                            'fourth'
                        ]
                    }
                },
                controller: {index: function() {}},
                store: store
            });

            OA.areEqual([1,2,3,4], mixes, 'wrong addon attach order, should be based on acAddons');
        }

    }));

    suite.add(new Y.Test.Case({

        name: 'general tests',

        'test flush calls done with "more"': function() {
            var doneCalled;
            var ac = new Y.mojito.ActionContext({
                dispatch: 'the dispatch',
                command: {
                    action: 'index',
                    instance: {
                        id: 'id',
                        type: 'TypeGeneral',
                        acAddons: []
                    }
                },
                controller: {index: function() {}},
                store: store
            });

            ac.done = function(data, meta, more) {
                A.areSame('data', data, 'bad data for done');
                A.areSame('meta', meta, 'bad meta for done');
                A.isTrue(more, "flush should've send 'more' = true to done");
                doneCalled = true;
            };

            ac.flush('data', 'meta');

            A.isTrue(doneCalled, 'flush never called done');
        },

        'test when called with string data, done renders a string without templating': function() {
            var doneCalled;
            var ac = new Y.mojito.ActionContext({
                dispatch: 'the dispatch',
                command: {
                    action: 'index',
                    instance: {
                        id: 'id',
                        type: 'TypeGeneral',
                        acAddons: [],
                        views: {}
                    }
                },
                controller: {index: function() {}},
                store: store
            });

            ac._adapter = {
                done: function(data, meta) {
                    var ct = meta.http.headers['content-type'];
                    doneCalled = true;
                    A.areSame('hi',data, 'bad string to done');
                    A.areSame(1, ct.length, "should be only one content-type header");
                    A.areSame('text/plain; charset=utf-8', ct[0]);
                }
            };

            ac.done('hi');

            A.isTrue(doneCalled, 'done never called');
        },

        'test when called with string data and Content-Type header set, done respects the type': function() {
            var doneCalled;
            var ac = new Y.mojito.ActionContext({
                dispatch: 'the dispatch',
                command: {
                    action: 'index',
                    instance: {
                        id: 'id',
                        type: 'TypeGeneral',
                        acAddons: [],
                        views: {}
                    }
                },
                controller: {index: function() {}},
                store: store
            });

            ac._adapter = {
                done: function(data, meta) {
                    var ct = meta.http.headers['content-type'];
                    doneCalled = true;
                    A.areSame('hi',data, 'bad string to done');
                    A.areSame(1, ct.length, "should be only one content-type header");
                    A.areSame('my favorite type', ct[0]);
                }
            };

            ac.done('hi', {
                http: {
                    headers: {
                        'content-type': ['my favorite type']
                    }
                }
            });

            A.isTrue(doneCalled, 'done never called');
        },

        'test when called with "json" meta string, done renders a string with json content type': function() {
            var doneCalled;
            var ac = new Y.mojito.ActionContext({
                dispatch: 'the dispatch',
                command: {
                    action: 'index',
                    instance: {
                        id: 'id',
                        type: 'TypeGeneral',
                        acAddons: [],
                        views: {}
                    }
                },
                controller: {index: function() {}},
                store: store
            });
            var json = {hi:'there'};

            ac._adapter = {
                done: function(data, meta) {
                    var ct = meta.http.headers['content-type'];
                    doneCalled = true;
                    A.areSame(Y.JSON.stringify(json), data, 'bad string to done');
                    A.areSame(1, ct.length, "should be only one content-type header");
                    A.areSame('application/json; charset=utf-8', ct[0]);
                }
            };

            ac.done(json, 'json');

            A.isTrue(doneCalled, 'done never called');
        },

        'test when called with "xml" meta string, done renders a string with xml content type': function() {
            var doneCalled;
            var ac = new Y.mojito.ActionContext({
                dispatch: 'the dispatch',
                command: {
                    action: 'index',
                    instance: {
                        id: 'id',
                        type: 'TypeGeneral',
                        acAddons: [],
                        views: {}
                    }
                },
                controller: {index: function() {}},
                store: store
            });
            var json = {hi:'there'};

            ac._adapter = {
                done: function(data, meta) {
                    var ct = meta.http.headers['content-type'];
                    doneCalled = true;
                    A.areSame('<xml><hi>there</hi></xml>', data, 'bad string to done');
                    A.areSame(1, ct.length, "should be only one content-type header");
                    A.areSame('application/xml; charset=utf-8', ct[0]);
                }
            };

            ac.done(json, 'xml');

            A.isTrue(doneCalled, 'done never called');
        },

        'test when there is no view meta, adapter is called directly': function() {
            var doneCalled;
            var ac = new Y.mojito.ActionContext({
                dispatch: 'the dispatch',
                command: {
                    action: 'index',
                    instance: {
                        id: 'id',
                        type: 'TypeGeneral',
                        acAddons: [],
                        views: {}
                    }
                },
                controller: {index: function() {}},
                store: store
            });
            var data = 'data';
            var meta = {};

            ac._adapter = {
                done: function(d, m) {
                    doneCalled = true;
                    A.areSame(data, d, 'bad data to done');
                    A.areSame(meta, m, 'bad meta to done');
                }
            };

            ac.done(data, meta);

            A.isTrue(doneCalled, 'done never called');
        },

        'test device-specific view is used for render': function() {
            var vrRendered;
            // mock view renderer
            var VR = Y.mojito.ViewRenderer;
            Y.mojito.ViewRenderer = function(engine) {
                A.areSame('engine', engine, 'bad view engine');
                return {
                    render: function(d, type, v, a, m, more) {
                        vrRendered = true;
                        A.areSame(data, d, 'bad data to view');
                        A.areSame('t', type, 'bad mojitType to view');
                        A.areSame(meta, m, 'bad meta to view');
                        A.areSame('path', v, 'bad view content path to view engine');
                        A.areSame(ac._adapter, a, 'bad adapter to view');
                        A.isFalse(more);
                    }
                };
            };
            var ac = new Y.mojito.ActionContext({
                dispatch: 'the dispatch',
                command: {
                    action: 'index',
                    instance: {
                        id: 'id',
                        type: 't',
                        acAddons: [],
                        views: {
                            viewName: {
                                engine: 'engine',
                                'content-path': 'path'
                            }
                        }
                    }
                },
                controller: {index: function() {}},
                store: store
            });
            var data = {};
            var meta = { view: {name: 'viewName'} };
            ac._adapter = {
                done: function() {
                    A.fail('done should not be called, the view renderer should be calling it');
                }
            };

            ac.done(data, meta, false);

            A.isTrue(vrRendered, 'view render never called');

            // replace mock
            Y.mojito.ViewRenderer = VR;
        },

        'test config children params are stripped': function() {
            var doneCalled;
            var children = {
                foo: {
                    params: 'params'
                }
            };
            var ac = new Y.mojito.ActionContext({
                dispatch: 'the dispatch',
                command: {
                    action: 'index',
                    instance: {
                        id: 'id',
                        type: 'TypeGeneral',
                        acAddons: [],
                        views: {
                            mockView: {}
                        },
                        binders: {
                            mockView: {}
                        },
                        config: {
                            children: children
                        }
                    }
                },
                controller: {index: function() {}},
                store: store
            });

            ac._adapter = {
                done: function(data, meta) {
                    doneCalled = true;
                    A.isObject(meta.binders.binderid, 'no binder id');
                    A.isUndefined(meta.binders.binderid.config.children.params, 'config.children.params should be undefined');
                    A.isUndefined(meta.binders.binderid.children.params, 'children.params should be undefined');
                }
            };
            // mock view renderer
            var VR = Y.mojito.ViewRenderer;
            Y.mojito.ViewRenderer = function(engine) {
                return {
                    render: function(d, type, v, a, m, more) {
                        a.done('html', m);
                    }
                };
            };

            var yguid = Y.guid;
            Y.guid = function() {
                return 'binderid';
            };
            ac.done({data: 'data'}, { view: {name: 'mockView'}, children: children});

            A.isTrue(doneCalled, 'never called done');

            // replace
            Y.guid = yguid;
            Y.mojito.ViewRenderer = VR;
        }

    }));

    Y.Test.Runner.add(suite);

});
