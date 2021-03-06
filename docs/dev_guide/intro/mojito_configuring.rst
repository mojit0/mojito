==================
Configuring Mojito
==================

.. _mojito_configuring-basic:

Basic Information
=================

Mojito can be configured at the framework, application, and mojit levels. 
Each level is configured differently, but uses same general file format 
consisting of JSON or YAML.

.. _config_basic-file:

File Format
-----------

.. _config_basic_file-json:

JSON
####

By default, configuration files in Mojito have a general top-level 
structure and are in JSON format. At the top level of each configuration 
file is an array. Each item of the array is an object containing configuration that 
targets a specific context and runtime. This allows you to have discrete configurations 
for different regions, devices, and development environments.

The context for a configuration object is specified by the ``settings`` property. For
each configuration object in a file, the ``settings`` property must specify a unique 
context, otherwise Mojito fails. For example, the ``application.json``  file
cannot have two configuration objects specifying the context ``environment:development``. 
See `Using Context Configurations <../topics/mojito_using_contexts.html>`_
for more information about contexts.

Below is the skeleton of a configuration file with two configuration
objects, each identified by contexts defined by the ``settings`` property. 
See `Application Configuration`_ and `Mojit Configuration`_ for details about specific 
configuration files.

.. code-block:: javascript

   [
     // Configuration object
     {
       "settings": [ "master" ],
       "specs": {
         ...
       }
     },
     {
       "settings": [ "environment:development" ],
       "specs": {
         ...
       }
     },
     ...
   ]

.. _config_basic_file-yaml:

YAML
####

Mojito also supports configuration files in YAML format (JSON is a subset of YAML). 
The YAML file extension could be ``.yaml`` or ``.yml``. Mojito allows comments in the 
YAML files. When both  the JSON file (e.g., ``application.json``) and the YAML file 
(e.g., ``application.yaml``) are present, the YAML file is used and a warning is issued. 
For the data types of the YAML elements, please see the JSON configuration tables in 
:ref:`Application Configuration <configure_mj-app>`, 
:ref:`Routing <configure_mj-routing>`, and :ref:`Mojit Configuration <configure_mj-mojit>`.

.. _configure_mj-app:

Application Configuration
=========================

Both the server and client runtimes of an application can be configured. The
application is configured in the ``application.json`` file in the application 
directory. The file consists of an array of zero or more ``configuration`` 
objects. Using the ``configuration`` object, you can configure the following 
for your application:

- port number
- location of routing files
- path to static assets
- YUI 3
- URL path for client and server communication
- declare mojit instances
- logging
- static resources

The tables below describe the ``configuration`` object and its properties. 
Those properties that have object values have tables below describing their 
properties as well except the ``config`` object, which is user defined.

.. _app-configuration_obj:

configuration Object
--------------------

+--------------------------------------------------------+----------------------+-------------------+--------------------------------------------------------+
| Property                                               | Data Type            | Default Value     | Description                                            |
+========================================================+======================+===================+========================================================+
| ``actionTimeout``                                      | number               | 60000             | The number of milliseconds that an action can          |
|                                                        |                      |                   | run without calling ``ac.done`` or ``ac.error`` before |
|                                                        |                      |                   | Mojito logs a warning and invokes ``ac.error`` with a  |
|                                                        |                      |                   | Timeout error.                                         |
+--------------------------------------------------------+----------------------+-------------------+--------------------------------------------------------+
| ``appPort``                                            | number               | 8666              | The port number (1-65355) that the application         |
|                                                        |                      |                   | will use.                                              |
+--------------------------------------------------------+----------------------+-------------------+--------------------------------------------------------+
| `builds <#builds-obj>`_                                | object               | N/A               | Specifies configuration for builds.                    |
+--------------------------------------------------------+----------------------+-------------------+--------------------------------------------------------+
| ``cacheViewTemplates``                                 | boolean              | true              | Specifies whether the view engine should attempt       |
|                                                        |                      |                   | to cache the view. Note that not all view engines      |
|                                                        |                      |                   | support caching.                                       |
+--------------------------------------------------------+----------------------+-------------------+--------------------------------------------------------+
| ``middleware``                                         | array of strings     | []                | A list of paths to the Node.js module that exports     |
|                                                        |                      |                   | a Connect middleware function.                         |
+--------------------------------------------------------+----------------------+-------------------+--------------------------------------------------------+
| ``mojitDirs``                                          | array of strings     | []                | The list of directories specifying where to find a     |
|                                                        |                      |                   | single mojit type. The mojits specified by             |
|                                                        |                      |                   | ``mojitDirs`` are loaded after the mojits in           |
|                                                        |                      |                   | ``mojitsDirs``. If a directory doesn't start with      |
|                                                        |                      |                   | a "/", it is taken as relative to the application      |
|                                                        |                      |                   | directory.                                             |
+--------------------------------------------------------+----------------------+-------------------+--------------------------------------------------------+
| ``mojitsDirs``                                         | array of strings     | ['mojits']        | The list of directories specifying where to find       |
|                                                        |                      |                   | mojit types. If a directory doesn't start with a       |
|                                                        |                      |                   | "/", it is taken as relative to the application        |
|                                                        |                      |                   | directory.                                             |
+--------------------------------------------------------+----------------------+-------------------+--------------------------------------------------------+
| ``routesFiles``                                        | array of strings     | ['routes.json']   | The list of files specifying where to find routing     |
|                                                        |                      |                   | information. If a file doesn't start with a "/",       |
|                                                        |                      |                   | it is taken as relative to the application             |
|                                                        |                      |                   | directory.                                             |
+--------------------------------------------------------+----------------------+-------------------+--------------------------------------------------------+
| ``selector``                                           | string               | N/A               | The version of the resource. A resource is either a    |
|                                                        |                      |                   | file to Mojito or metadata to the `Resource Store <../ |
|                                                        |                      |                   | topics/mojito_resource_store.html>`_. For example,     |
|                                                        |                      |                   | ``"selector": "iphone"`` would configure the Resource  |
|                                                        |                      |                   | Store to find resources with the identifier ``iphone`` |
|                                                        |                      |                   | such as ``index.iphone.hb.html``.                      |
|                                                        |                      |                   | See the `selector Propery <../topics/mojito_resource   |
|                                                        |                      |                   | _store.html#selector-property>`_ and `Selectors <../   |
|                                                        |                      |                   | topics/mojito_resource_store.html#selectors>`_ for     |
|                                                        |                      |                   | for more information.                                  |
+--------------------------------------------------------+----------------------+-------------------+--------------------------------------------------------+
| ``settings``                                           | array of strings     | ["master"]        | Defines the context of the configuration. The          |
|                                                        |                      |                   | context consists of a key-value pair that can          |
|                                                        |                      |                   | specify the environment and environment                |
|                                                        |                      |                   | configurations. These key-value pair corresponds       |
|                                                        |                      |                   | to the configuration objects that are elements of      |
|                                                        |                      |                   | the ``dimensions`` array in the ``dimensions.json``    |
|                                                        |                      |                   | file. For example, the following contexts could be     |
|                                                        |                      |                   | used to specify the testing environment and the        |
|                                                        |                      |                   | English language : ``"environment:testing"``,          |
|                                                        |                      |                   | ``"lang:en"``. See `Using Context Configurations       |
|                                                        |                      |                   | <../topics/mojito_using_contexts.html>`_.              |
+--------------------------------------------------------+----------------------+-------------------+--------------------------------------------------------+
| `specs <#specs-obj>`_                                  | object               | N/A               | Specifies the mojit instances. See the                 |
|                                                        |                      |                   | :ref:`specs_obj` for details.                          |
+--------------------------------------------------------+----------------------+-------------------+--------------------------------------------------------+
| `staticHandling <#statichandling-obj>`_                | object               | N/A               | Gives details on the handling of static resources.     |
|                                                        |                      |                   | See the :ref:`staticHandling_obj`                      |
+--------------------------------------------------------+----------------------+-------------------+--------------------------------------------------------+
| ``tunnelPrefix``                                       | string               | "/tunnel/"        | The URL prefix for the communication tunnel            |
|                                                        |                      |                   | from the client back to the server.                    |
+--------------------------------------------------------+----------------------+-------------------+--------------------------------------------------------+
| ``tunnelTimeout``                                      | number               | 30000             | The timeout in milliseconds for the communication      |
|                                                        |                      |                   | tunnel from the client back to the server.             |
+--------------------------------------------------------+----------------------+-------------------+--------------------------------------------------------+
| `yui <#yui-obj>`_                                      | object               | N/A               | When Mojito is deployed to client, the                 |
|                                                        |                      |                   | :ref:`yui_obj` specifies where and how to obtain       |
|                                                        |                      |                   | YUI 3. The ``yui.config`` object also contains         |
|                                                        |                      |                   | logging configurations.                                |
+--------------------------------------------------------+----------------------+-------------------+--------------------------------------------------------+



.. _builds_obj:

builds Object
#############

+---------------------------------+---------------+--------------------------------------------------------------------------------+
| Property                        | Data Type     | Description                                                                    |
+=================================+===============+================================================================================+
| `html5app <#html5app-obj>`_     | object        | Specifies configuration for HTML5 applications                                 |
|                                 |               | created with ``$ mojito build html5app``.                                      | 
+---------------------------------+---------------+--------------------------------------------------------------------------------+
| `hybridapp <#hybridapp-obj>`_   | object        | Specifies configuration for hybrid applications                                |
|                                 |               | created with the following:                                                    |
|                                 |               | ``mojito build hybridapp -n <snapshot_name> -t <snapshot_tag> [<build_path>]`` |
+---------------------------------+---------------+--------------------------------------------------------------------------------+


.. _html5app_obj:

html5app Object
***************

+------------------------+---------------+-----------+---------------+-------------------------------------------+
| Property               | Data Type     | Required? | Default Value | Description                               |
+========================+===============+===========+===============+===========================================+
| ``attachManifest``     | boolean       | no        | ``false``     | When ``true``, the ``manifest``           |
|                        |               |           |               | attribute is added to ``<html>``.         |
+------------------------+---------------+-----------+---------------+-------------------------------------------+
| ``buildDir``           | string        | no        | none          | The path to the built HTML5 application.  |
|                        |               |           |               | If not specified, the HTML5 application   |
|                        |               |           |               | will be placed in                         |
|                        |               |           |               | ``artifacts/build/html5app``. The         |
|                        |               |           |               | specified path for ``buildDir`` will be   |
|                        |               |           |               | overridden if a build path is given to    |
|                        |               |           |               | the following command:                    |
|                        |               |           |               | ``mojito build html5app [<build_path>]``  |
+------------------------+---------------+-----------+---------------+-------------------------------------------+
| ``forceRelativePaths`` | boolean       | no        | ``false``     | When ``true``, the server-relative paths  |
|                        |               |           |               | (those starting with "/") are converted   |
|                        |               |           |               | into paths relative to the generated      |
|                        |               |           |               | file.                                     |
+------------------------+---------------+-----------+---------------+-------------------------------------------+
| ``urls``               | array of      | yes       | none          | Lists the routing paths to views that     | 
|                        | strings       |           |               | be rendered into static pages and then    |
|                        |               |           |               | cached so that the page can be viewed     |
|                        |               |           |               | offline. For example, if the running      |
|                        |               |           |               | application renders the view              |
|                        |               |           |               | ``view.html``, you could configure the    |
|                        |               |           |               | application to statically create and      | 
|                        |               |           |               | cache ``view.html`` in                    |
|                        |               |           |               | ``{app_dir}/artifacts/builds/html5app``   |
|                        |               |           |               | using the following:                      |
|                        |               |           |               | ``urls: [ '/view.html']``                 |
+------------------------+---------------+-----------+---------------+-------------------------------------------+

.. _hybrid_obj:

hybridapp Object
****************

The ``hybridapp`` object is used to specify build information for hybrid applications,
which are created with the command 
``mojito build hybridapp -n <snapshot_name> -t <snapshot_tag> [<build_path>]``.
Hybrid applications are HTML5 applications that are designed to work with future
Cocktails components that will enable hybrid applications to use the native features
of mobile devices. Currently, hybrid applications are strictly an experimental feature of 
Mojito and Cocktails.

+------------------------+---------------+-----------+-------------------------------+--------------------------------------------------------------------------------+
| Property               | Data Type     | Required? | Default Value                 | Description                                                                    |
+========================+===============+===========+===============================+================================================================================+
| ``buildDir``           | string        | no        | none                          | The build path of the hybrid application. If not specified, the hybrid         |
|                        |               |           |                               | application will be placed in ``artifacts/build/hybridapp``. The specified     |
|                        |               |           |                               | path for ``buildDir`` will be overridden if a build path is given to the       |
|                        |               |           |                               | following command:                                                             |
|                        |               |           |                               | ``mojito build hybridapp -n <snapshot_name> -t <snapshot_tag> [<build_path>]`` |
+------------------------+---------------+-----------+-------------------------------+--------------------------------------------------------------------------------+
| ``forceRelativePaths`` | boolean       | no        | ``false``                     | When ``true``, the server-relative paths (those starting with "/") are         |
|                        |               |           |                               | converted into paths relative to the generated file.                           |
+------------------------+---------------+-----------+-------------------------------+--------------------------------------------------------------------------------+
| ``packages``           | object        | yes       | none                          | An object containing key-value pairs that specify dependencies and their       |
|                        |               |           |                               | associated versions. When you create a hybrid application with the command     |
|                        |               |           |                               | ``mojito build hybridapp``, the dependencies listed in ``packages`` are added  |
|                        |               |           |                               | to the ``packages.json`` of the built hybrid application.                      |
+------------------------+---------------+-----------+-------------------------------+--------------------------------------------------------------------------------+
| ``urls``               | array of      | yes       | none                          | The routing paths to views that be rendered into static pages and then cached  | 
|                        | strings       |           |                               | so that the page can be viewed offline. For example, if the running            |
|                        |               |           |                               | application renders the view ``view.html``, you could configure the            |
|                        |               |           |                               | application to statically create and cache ``view.html`` in                    |
|                        |               |           |                               | ``{app_dir}/artifacts/builds/hybridapp`` (default location) using the          |
|                        |               |           |                               | following: ``urls: [ '/view.html']``                                           |
+------------------------+---------------+-----------+-------------------------------+--------------------------------------------------------------------------------+


.. _specs_obj:

specs Object
############

+------------------------------+---------------+-------------------------------------------------------------------------+
| Property                     | Data Type     | Description                                                             |
+==============================+===============+=========================================================================+
| ``action``                   | string        | Specifies a default action to use if the mojit instance wasn't          |
|                              |               | dispatched with one. If not given and the mojit wasn't dispatched       |
|                              |               | with an explicit action, the action defaults to ``index``.              |
+------------------------------+---------------+-------------------------------------------------------------------------+
| ``base``                     | string        | Specifies another mojit instance to use as a "base". Any changes        |
|                              |               | in this instance will override those in the base. Only mojit            |
|                              |               | instances with an ID can be used as a base, and only mojit              |
|                              |               | instances specified at the top-level of the ``specs`` object in         |
|                              |               | ``application.json`` have an ID. The ID is the instance's name in       |
|                              |               | the ``specs`` object. Either the ``type`` or ``base`` property is       |
|                              |               | required in the ``specs`` object.                                       |
+------------------------------+---------------+-------------------------------------------------------------------------+
| `config <#config-obj>`_      | object        | This is user-defined information that allows you to configure the       |
|                              |               | controller. Mojito does not interpret any part of this object. You can  |
|                              |               | access your defined ``config`` in the controller using the `Config      |
|                              |               | addon <../../api/classes/Config.common.html>`_. For example:            |
|                              |               | ``ac.config.get('message')``                                            |
+------------------------------+---------------+-------------------------------------------------------------------------+
| ``defer``                    | boolean       | If true and the mojit instance is a child of the ``HTMLFrameMojit``,    |
|                              |               | an empty node will initially be rendered and then content will be       |
|                              |               | lazily loaded. See                                                      |
|                              |               | `LazyLoadMojit <../topics/mojito_frame_mojits.html#lazyloadmojit>`_     |
|                              |               | for more information.                                                   |
+------------------------------+---------------+-------------------------------------------------------------------------+
| ``proxy``                    | object        | This is a normal mojit spec to proxy this mojit's execution             |
|                              |               | through. This feature only works when defined within a child            |
|                              |               | mojit. When specified, Mojito will replace this mojit child with a      |
|                              |               | mojit spec of the specified type, which is expected to handle the       |
|                              |               | child's execution itself. The proxy mojit will be executed in           |
|                              |               | place of the mojit being proxied. The original proxied child mojit      |
|                              |               | spec will be attached as a *proxied* object on the proxy mojit's        |
|                              |               | ``config`` for it to handle as necessary.                               |
+------------------------------+---------------+-------------------------------------------------------------------------+
| ``type``                     | string        | Specifies the mojit type. Either the ``type`` or ``base`` property is   |
|                              |               | required in the ``specs`` object.                                       |
+------------------------------+---------------+-------------------------------------------------------------------------+

.. _config_obj:

config Object
*************

+--------------------------+---------------+--------------------------------------------------------------------------------+
| Property                 | Data Type     | Description                                                                    |
+==========================+===============+================================================================================+
| ``child``                | object        | Contains the ``type`` property that specifies mojit type and may also          |
|                          |               | contain a ``config`` object. This property can only be used when the mojit     |
|                          |               | instance is a child of the ``HTMLFrameMojit``. See                             |
|                          |               | `HTMLFrameMojit <../topics/mojito_frame_mojits.html#htmlframemojit>`_ for      |              
|                          |               | more information.                                                              |
+--------------------------+---------------+--------------------------------------------------------------------------------+
| ``children``             | object        | Contains one or more mojit instances that specify the mojit type with          |
|                          |               | the property ``type``. Each mojit instance may also contain a ``config``       |
|                          |               | objects.                                                                       |
+--------------------------+---------------+--------------------------------------------------------------------------------+
| ``deploy``               | boolean       | If set to ``true``, Mojito application code is deployed to the client.         |
|                          |               | See :ref:`deploy_app` for details. The default value is ``false``. Your        |
|                          |               | mojit code will only be deployed if it is a child of ``HTMLFrameMojit``.       |
+--------------------------+---------------+--------------------------------------------------------------------------------+
| ``title``                | string        | If application is using the frame mojit ``HTMLFrameMojit``,                    |
|                          |               | the value will be used for the HTML ``<title>`` element.                       |    
|                          |               | See `HTMLFrameMojit <../topics/mojito_frame_mojits.html#htmlframemojit>`_      |
|                          |               | for more information.                                                          |
+--------------------------+---------------+--------------------------------------------------------------------------------+
| ``{key}``                | any           | The ``{key}`` is user defined and can have any type of configuration value.    |
+--------------------------+---------------+--------------------------------------------------------------------------------+


.. _staticHandling_obj:

staticHandling Object
#####################

+-----------------------+---------------+-----------------------------+--------------------------------------------------------+
| Property              | Data Type     | Default Value               | Description                                            |
+=======================+===============+=============================+========================================================+
| ``appName``           | string        | {application-directory}     | Specifies the path prefix for assets that              |
|                       |               |                             | originated in the application directory, but which     |
|                       |               |                             | are not part of a mojit.                               |
+-----------------------+---------------+-----------------------------+--------------------------------------------------------+
| ``cache``             | boolean       | false                       | When ``true``, Mojito caches files in memory           |
|                       |               |                             | indefinitely until they are invalidated by a           |
|                       |               |                             | conditional GET request. When given ``maxAge``,        |
|                       |               |                             | Mojito caches file for the duration given by           |
|                       |               |                             | ``maxAge``.                                            |
+-----------------------+---------------+-----------------------------+--------------------------------------------------------+
| ``forceUpdate``       | boolean       | false                       | When ``false``, static assets are returned with the    |
|                       |               |                             | HTTP headers (``Last-Modified``, ``Cache-Control``,    |
|                       |               |                             | ``ETag``) for browser caching. Set to ``true`` to      |
|                       |               |                             | prevent these headers from being sent.                 |                     
+-----------------------+---------------+-----------------------------+--------------------------------------------------------+
| ``frameworkName``     | string        | "mojito"                    | Specifies the path prefix for assets that              |
|                       |               |                             | originated from Mojito, but which are not part of      |
|                       |               |                             | a mojit.                                               |
+-----------------------+---------------+-----------------------------+--------------------------------------------------------+
| ``maxAge``            | number        | 0                           | The time in milliseconds that the browser should       |
|                       |               |                             | cache.                                                 |
+-----------------------+---------------+-----------------------------+--------------------------------------------------------+
| ``prefix``            | string        | "static"                    | The URL prefix for all statically served assets.       |
|                       |               |                             | Specified as a simple string and wrapped in "/".       |
|                       |               |                             | For example ``"static"`` becomes the URL prefix        |
|                       |               |                             | ``/static/``. An empty string can be given if no       |
|                       |               |                             | prefix is desired.                                     |
+-----------------------+---------------+-----------------------------+--------------------------------------------------------+

.. _yui_obj:

yui Object
##########

See `Example Application Configurations`_ for an example of the ``yui`` object. 

+--------------------------------+----------------------+------------------------------------------------------------------------+
| Property                       | Data Type            | Description                                                            |
+================================+======================+========================================================================+
| :ref:`config <yui_config>`     | object               | Used to populate the `YUI_config <http://yuilibrary.com/yui/docs/yui/  |
|                                |                      | #yui_config>`_ global variable that allows you to configure every YUI  |
|                                |                      | instance on the page even before YUI is loaded. For example, you can   |
|                                |                      | configure logging or YUI not to load its default CSS with the          |
|                                |                      | following: ``"yui": { "config": { "fetchCSS": false } }``              |
+--------------------------------+----------------------+------------------------------------------------------------------------+
| ``showConsoleInClient``        | boolean              | Determines if the YUI debugging console will be shown on the           |
|                                |                      | client.                                                                |
+--------------------------------+----------------------+------------------------------------------------------------------------+


.. _yui_config:

config Object
*************

The ``config`` object can be used to configure all the options for the YUI instance. 
To see all the options for the ``config`` object, see the 
`YUI config Class <http://yuilibrary.com/yui/docs/api/classes/config.html>`_.
Some of the properties of the ``config`` object used for configuring logging are shown below.


+----------------------+------------------+--------------------------+---------------------------------------------------------------+
| Property             | Data Type        | Default Value            | Description                                                   |
+======================+==================+==========================+===============================================================+
| ``debug``            | boolean          | true                     | Determines whether ``Y.log`` messages are written to the      |    
|                      |                  |                          | browser console.                                              |
+----------------------+------------------+--------------------------+---------------------------------------------------------------+
| ``logExclude``       | object           | none                     | Excludes the logging of the YUI module(s) specified.          |
|                      |                  |                          | For example: ``logExclude: { "logModel": true }``             |  
+----------------------+------------------+--------------------------+---------------------------------------------------------------+
| ``logInclude``       | object           | none                     | Includes the logging of the YUI module(s) specified.          |
|                      |                  |                          | For example: ``logInclude: { "DemoBinderIndex": true }``      |  
+----------------------+------------------+--------------------------+---------------------------------------------------------------+
| ``logLevel``         | string           | "debug"                  | Specifies the lowest log level to include in the              |
|                      |                  |                          | log output. The log level can only be set with ``logLevel``   |
|                      |                  |                          | if ``debug`` is set to ``true``. For more information,        | 
|                      |                  |                          | see `Log Levels <../topics/mojito_logging.html#log-levels>`_. |
+----------------------+------------------+--------------------------+---------------------------------------------------------------+
| ``logLevelOrder``    | array of strings | ``['debug', 'mojito',    | Defines the order of evaluating log levels. Each log          |
|                      |                  | 'info', 'warn', 'error'  | level is a superset of the levels that follow, so messages    |
|                      |                  | 'none']``                | at levels within the set will be displayed. Thus, at the      |
|                      |                  |                          | ``debug`` level, messages at all levels will be displayed,    |
|                      |                  |                          | and at the ``mojito`` level, levels ``info``, ``warn``,       |
|                      |                  |                          | ``error`` will be displayed, etc.                             |
+----------------------+------------------+--------------------------+---------------------------------------------------------------+




.. _config-multiple_mojits:

Configuring Applications to Have Multiple Mojits
------------------------------------------------

Applications not only can specify multiple mojit instances in ``application.json``, but 
mojits can have one or more child mojits as well.

.. _config_mult_mojits-app:

Application With Multiple Mojits
################################

Your application configuration can specify multiple mojit instances of the same or 
different types in the ``specs`` object. In the example ``application.json`` below, the 
mojit instances ``sign_in`` and ``sign_out`` are defined:

.. code-block:: javascript

   [
     {
       "settings": [ "master" ],
       "specs": {
         "sign_in": {
           "type": "SignInMojit"
         },
         "sign_out": {
           "type": "SignOutMojit"
         }
       }
     }
   ]
   
.. _config_mult_mojits-parent_child:

Parent Mojit With Child Mojit
#############################

A mojit instance can be configured to have a child mojit using the ``child`` 
object. In the example ``application.json`` below, the mojit instance ``parent`` 
of type ``ParentMojit`` has a child mojit of type ``ChildMojit``.

.. code-block:: javascript

   [
     {
       "settings": [ "master" ],
       "specs": {
         "parent": {
           "type": "ParentMojit",
           "config": {
             "child": {
               "type": "ChildMojit"
             }
           }
         }
       }
     }
   ]

.. _config_mult_mojits-parent_children:

Parent Mojit With Children
##########################

A mojit instance can also be configured to have more than one child mojits using 
the ``children`` object that contains mojit instances. To execute the children, 
the parent mojit would use the ``Composite addon``. 
See `Composite Mojits <../topics/mojito_composite_mojits.html#composite-mojits>`_
for more information.

In the example ``application.json`` below, the mojit instance ``father`` of type 
``ParentMojit`` has the children ``son`` and ``daughter`` of type ``ChildMojit``.

.. code-block:: javascript

   [
     {
       "settings": [ "master" ],
       "specs": {
         "father": {
           "type": "ParentMojit",
           "config": {
             "children": {
               "son": {
                 "type": "ChildMojit"
               },
               "daughter": {
                 "type": "ChildMojit"
               }
             }
           }
         }
       }
     }
   ]


.. _config_mult_mojits-child_children:

Child Mojit With Children
#########################

A parent mojit can have a child that has its own children. The parent mojit 
specifies a child with the ``child`` object, which in turn lists children in the 
``children`` object. For the child to execute its children,it would use the ``Composite`` 
addon. See `Composite Mojits <../topics/mojito_composite_mojits.html#composite-mojits>`_ 
for more information.

The example ``application.json`` below creates the parent mojit ``grandfather`` with the 
child ``son``, which has the children ``grandson`` and ``granddaughter``.

.. code-block:: javascript

   [
     {
       "settings": [ "master" ],
       "specs": {
         "grandfather": {
           "type": "GrandparentMojit",
           "config": {
             "child": {
               "son": {
                 "type": "ChildMojit",
                 "children": {
                   "grandson": {
                     "type": "GrandchildMojit"
                   },
                   "grandaughter": {
                     "type": "GrandchildMojit"
                   }
                 }
               }
             }
           }
         }
       }
     }
   ]

The child mojits can also have their own children, but beware that 
having so many child mojits may cause memory issues. In our updated 
example ``application.json`` below, the ``grandaughter`` mojit now has
its own children mojits:

.. code-block:: javascript

   [
     {
       "settings": [ "master" ],
       "specs": {
         "grandfather": {
           "type": "GrandparentMojit",
           "config": {
             "child": {
               "son": {
                 "type": "ChildMojit",
                 "children": {
                   "grandson": {
                     "type": "GrandchildMojit"
                   },
                   "grandaughter": {
                     "type": "GrandchildMojit",
                     "children": {
                       "girl_doll": {
                          "type": "GirlDollMojit"
                       },
                       "boy_doll": {
                          "type": "BoyDollMojit"
                       }
                     }
                   }
                 }
               }
             }
           }
         }
       }
     }
   ]



.. _deploy_app:

Configuring Applications to Be Deployed to Client
-------------------------------------------------

To configure Mojito to deploy code to the client, you must be using the ``HTMLFrameMojit`` 
as the parent mojit and also set the ``deploy`` property of the :ref:`app-configuration_obj` 
object to ``true`` in the ``config`` object of your mojit instance.

.. _deploy_app-what:

What Gets Deployed?
###################

The following is deployed to the client:

- Mojito framework
- binders (and their dependencies)

When a binder invokes its controller, if the controller has the ``client`` or ``common`` 
affinity, then the controller and its dependencies are deployed to the client as well. If 
the affinity of the controller is ``server``, the invocation occurs on the server. In 
either case, the binder can invoke the controller.

.. _deploy_app-ex:

Example
#######

The example ``application.json`` below uses the ``deploy`` property to configure the 
application to be deployed to the client.

.. code-block:: javascript

   [
     {
       "settings": [ "master" ],
       "specs": {
         "frame": {
           "type": "HTMLFrameMojit",
           "config": {
             "deploy": true,
             "child": {
               "type": "PagerMojit"
             }
           }
         }
       }
     }
   ]
   


.. _app_config-ex:

Example Application Configurations
----------------------------------

This example ``application.json`` defines the two mojit instances ``foo`` and ``bar``. 
The ``foo`` mojit instance is of type ``MessageViewer``, and the ``bar`` mojit instance 
uses ``foo`` as the base mojit. Both have metadata configured in the ``config`` object.

.. code-block:: javascript

   [
     {
       "settings": [ "master" ],
       "yui": {
         "showConsoleInClient": false,
         "config": {
            "fetchCSS": false,
            "combine": true,
            "comboBase:" 'http://mydomain.com/combo?',
            "root": 'yui3/'
          }
       },
       "specs": {
         "foo": {
           "type": "MessageViewer",
           "config": {
             "message": "hi"
           }
         },
         "bar": {
           "base": "foo",
           "config": {
             "message": "hello"
           }
         }
       }
     }
   ]

.. _configure_mj-mojit:

Mojit Configuration
===================

Although mojit instances are defined at the application level, you configure metadata and 
defaults for the mojit at the mojit level. The following sections will cover configuration 
at the mojit level as well as examine the configuration of the mojit instance.


.. _configure_mojit-metadata:

Configuring Metadata
--------------------

The ``definition.json`` file in the mojit directory is used to specify metadata about the 
mojit type. The contents of the file override the mojit type metadata that Mojito 
generates from the contents of the file system.

The information is available from the controller using the 
`Config addon <../../api/classes/Config.common.html>`_. For example, you would use 
``ac.config.getDefinition('version')`` to get the version information.

The table below describes the ``configuration`` object in ``definition.json``.

+------------------+----------------------+-------------------+--------------------------------------------------------+
| Property         | Data Type            | Default Value     | Description                                            |
+==================+======================+===================+========================================================+
| ``appLevel``     | boolean              | false             | When set to ``true``, the actions, addons, assets,     |
|                  |                      |                   | binders, models, and view of the mojit are             |
|                  |                      |                   | *shared* with other mojits. Mojits wanting to use      |
|                  |                      |                   | the resources of the shared mojit must                 |
|                  |                      |                   | include the YUI module of the application-level        |
|                  |                      |                   | mojit in the ``requires`` array.                       |
+------------------+----------------------+-------------------+--------------------------------------------------------+
| ``setting``      | array of strings     | "master"          | The default value is "master", which maps to the       |
|                  |                      |                   | default configurations for an application. You can     |
|                  |                      |                   | also provide a context to map to configurations.       |
|                  |                      |                   | See `Using Context Configurations                      |
|                  |                      |                   | <../topics/mojito_using_contexts.html>`_ for more      |
|                  |                      |                   | information.                                           |
+------------------+----------------------+-------------------+--------------------------------------------------------+


.. _configure_mojit-app_level:

Configuring and Using an Application-Level Mojit
------------------------------------------------

The ``definition.json`` file lets you configure a mojit to be available at the application 
level, so that other mojits can use its actions, addons, assets, binders, models, and 
views. Mojits available at the application level are not intended to be run alone, and 
some of its resources, such as the controller and configuration, are not available to 
other mojits.

To configure a mojit to be available at the application level, you set the ``appLevel`` 
property in ``definition.json`` to ``true`` as seen below:

.. code-block:: javascript

   [
     {
       "settings": [ "master" ],
       "appLevel": true
     }
   ]

To use an application-level mojit, other mojits must include the YUI module name in the 
``requires`` array of the controller. For example, to use the ``FooMojitModel`` module of 
the application-level ``Foo`` mojit, the controller of the Bar mojit would include 
``'FooMojitModel'`` in the ``requires`` array as seen below:

.. code-block:: javascript

   YUI.add('BarMojit', function(Y, NAME) {
     Y.namespace('mojito.controllers')[NAME] = { 
       index: function(actionContext) {
         actionContext.done({title: "Body"});
       }
     };
   }, '0.0.1', {requires: ['FooMojitModel']});


.. _configure_mojit-defaults:

Configuring Defaults for Mojit Instances
----------------------------------------

The ``defaults.json`` file in the mojit type directory can be used to specify 
defaults for each mojit instance of the type. The format is the same as the mojit 
instance as specified in the ``specs`` object of ``application.json``. This means 
that you can specify a default action, as well as any defaults you might want to 
put in the ``config`` object.

.. _configure_mojit-instances:

Mojit Instances
---------------

A mojit instance is defined with configuration. This configuration specifies 
which mojit type to use and configures an instance of that type. The mojit 
instances are defined in the ``specs`` object of the ``application.json`` file.

See :ref:`configure_mj-app` and :ref:`app_config-ex` for details of the ``specs`` 
object.

.. _configure_mojit_instances-using:

Using Mojit Instances
#####################

When a mojit instance is defined in ``application.json``, routing paths defined 
in ``routes.json`` can be associated with an action of that mojit instance. 
Actions are references to functions in the mojit controllers. When a client 
makes an HTTP request on a defined routing path, the function in the mojit 
controller that is referenced by the action from the mojit instance is called.

For example, the ``application.json`` below defines the ``foo`` mojit instance 
of the mojit type ``Foo``.

.. code-block:: javascript

   [
     {
       "settings": [ "master" ],
       "specs": {
         "foo": {
           "type": "Foo",
           "config": {
             "message": "hi"
           }
         }
       }
     }
   ]

The ``routes.json`` below uses the ``foo`` instance to call the ``index`` action 
when an HTTP GET request is made on the root path. The ``index`` action references 
the ``index`` function in the controller of the ``Foo`` mojit.

.. code-block:: javascript

   [
     {
       "settings": [ "master" ],
       "foo index": {
         "verbs": ["get"],
         "path": "/",
         "call": "foo.index"
       }
     }
   ]

.. _configure_mj-routing:

Routing
=======

In Mojito, routing is the mapping of URLs to specific mojit actions. This section 
will describe the routing configuration file ``routes.json`` and the following 
two ways to configure routing:

- Map Routes to Specific Mojit Instances and Actions
- Generate URLs from the Controller

See `Code Examples: Configuring Routing <../code_exs/route_config.html>`_ to 
see an example of configuring routing in a Mojito application.


.. _configure_routing-file:

Routing Configuration File
--------------------------

The ``routes.json`` file contains the routing configuration information in JSON. The JSON 
consists of an array of one or more ``configuration`` objects that include ``route`` 
objects specifying route paths, parameters, HTTP methods, and actions.

The table below describes the properties of the ``route`` object of  ``routes.json``.

+----------------+----------------------+---------------+--------------------------------------------------------+
| Property       | Data Type            | Required?     | Description                                            |
+================+======================+===============+========================================================+
| ``call``       | string               | Yes           | The mojit instance defined in ``application.json``     |
|                |                      |               | and the method that is called when an HTTP call is     |
|                |                      |               | made on the path specified by ``path``. For            |
|                |                      |               | example, to call the ``index`` method from the         |
|                |                      |               | ``hello`` mojit instance, you would use the            |
|                |                      |               | following: ``call: "hello.index"`` An anonymous        |
|                |                      |               | mojit instance can also be created by prepending       |
|                |                      |               | "@" to the mojit type. For example, the following      |
|                |                      |               | would create an anonymous mojit instance of type       |
|                |                      |               | ``HelloMojit`` and call the ``index`` action for       |
|                |                      |               | the ``HelloMojit`` mojit: ``call:                      |
|                |                      |               | "@HelloMojito.index"``                                 |
+----------------+----------------------+---------------+--------------------------------------------------------+
| ``params``     | string               | No            | Query string parameters that developers can            |
|                |                      |               | associate with a route path. The default value is an   | 
|                |                      |               | empty string "". The query string parameters should    |
|                |                      |               | be given an object:                                    |
|                |                      |               | ``params: { "name": "Tom", "age": "23" }``             |
|                |                      |               |                                                        |
|                |                      |               | **Deprecated**:  ``params: "name=Tom&age=23"``         |
+----------------+----------------------+---------------+--------------------------------------------------------+
| ``path``       | string               | Yes           | The route path that is mapped to the action in the     |
|                |                      |               | ``call`` property. The route path can have variable    |
|                |                      |               | placeholders for the mojit instance and action         |
|                |                      |               | that are substituted by the mojit instance and         |
|                |                      |               | actions used in the ``call`` property.  See also       |
|                |                      |               | :ref:`parameterized_paths`.                            |
+----------------+----------------------+---------------+--------------------------------------------------------+
| ``regex``      | object               | No            | An object containing a key-value pair, where the key   |
|                |                      |               | is a path parameter and the value contains the regular |
|                |                      |               | expression. For example:                               |
|                |                      |               | ``"regex": { "path_param":  "?:(.*).html" }``          |
|                |                      |               | See :ref:`Using Regular Expressions to Match Routing   |
|                |                      |               | Paths <regex_paths>` for more information.             |
+----------------+----------------------+---------------+--------------------------------------------------------+
| ``verbs``      | array of strings     | No            | The HTTP methods allowed on the route path defined     |
|                |                      |               | by ``path``. For example, to allow HTTP GET and        |
|                |                      |               | POST calls to be made on the specified path, you       |
|                |                      |               | would use the following: ``"verbs": [ "get",           |
|                |                      |               | "post" ]``                                             |
+----------------+----------------------+---------------+--------------------------------------------------------+


.. _configure_routing-mapping:

Map Routes to Specific Mojit Instances and Actions
--------------------------------------------------

This type of route configuration is the most sophisticated and recommended for 
production applications. To map routes to a mojit instance and action, you create 
the file ``routes.json`` in your application directory. The ``routes.json`` file 
allows you to configure a single or multiple routes and specify the HTTP method 
and action to use for each route.


.. _routing_mapping-single:

Single Route
############

To create a route, you need to create a mojit instance that can be mapped to a 
path. In the ``application.json`` below, the ``hello`` instance of type 
``HelloMojit`` is defined.

.. code-block:: javascript

   [
     {
       "settings": [ "master" ],
       "appPort": 8666,
       "specs": {
         "hello": {
           "type": "HelloMojit"
         }
       }
     }
   ]

The ``hello`` instance and a function in the ``HelloMojit`` controller can now 
be mapped to a route path in ``routes.json`` file. In the ``routes.json`` below, 
the ``index`` function is called when an HTTP GET call is made on the root path.

.. code-block:: javascript

   [
     {
       "settings": [ "master" ],
       "hello index": {
         "verbs": ["get"],
         "path": "/",
         "call": "hello.index"
       }
     }
   ]

Instead of using the ``hello`` mojit instance defined in the ``application.json`` 
shown above, you can create an anonymous instance of ``HelloMojit`` for mapping 
an action to a route path. In the ``routes.json`` below,  an anonymous instance 
of ``HelloMojit`` is made by prepending "@" to the mojit type.

.. code-block:: javascript

   [
     {
       "settings": [ "master" ],
       "hello index": {
         "verbs": ["get"],
         "path": "/",
         "call": "@HelloMojit.index",
         "params": { "first_visit": true }
       }
     }
   ]


.. _routing_mapping-multiple:

Multiple Routes
###############

To specify multiple routes, you create multiple route objects that contain 
``verb``, ``path``, and ``call`` properties in ``routes.json`` as seen here:

.. code-block:: javascript

   [
     {
       "settings": [ "master" ],
       "root": {
         "verb": ["get"],
         "path": "/*",
         "call": "foo-1.index"
       },
       "foo_default": {
         "verb": ["get"],
         "path": "/foo",
         "call": "foo-1.index"
       },
       "bar_default": {
         "verb": ["get"],
         "path": "/bar",
         "call": "bar-1.index",
         "params": { "page": 1, "log_request": true }
       }
     }
   ]

The ``routes.json`` file above creates the following routes:

- ``http://localhost:8666``
- ``http://localhost:8666/foo``
- ``http://localhost:8666/bar``
- ``http://localhost:8666/anything``

Notice that the ``routes.json`` above uses the two mojit instances ``foo-1`` and 
``bar-1``; these instances must be defined in the ``application.json`` file before 
they can be mapped to a route path. Also, the wildcard used in ``root`` object 
configures Mojito to call ``foo-1.index`` when HTTP GET calls are made on any 
undefined path.


.. _routing_params:

Adding Routing Parameters
-------------------------

You can configure a routing path to have routing parameters with the ``params`` 
property. Routing parameters are accessible from the ``ActionContext`` object 
using the `Params addon <../../api/classes/Params.common.html>`_.

In the example ``routes.json`` below, routing parameters are added with an object. 
To get the value for the routing parameter ``page`` from a controller, you would 
use ``ac.params.getFromRoute("page")``. 

.. code-block:: javascript

   [
     {
       "settings": [ "master" ],
       "root": {
         "verb": ["get"],
         "path": "/*",
         "call": "foo-1.index",
         "params": { "page": 1, "log_request": true }
       }
     }
   ]
   

.. admonition:: Deprecated

   Specifying routing parameters as a query string, such as 
   ``"params": "page=1&log_request=true"``, 
   is still supported, but may not be in the future.

.. _parameterized_paths:

Using Parameterized Paths to Call a Mojit Action
------------------------------------------------

Your routing configuration can also use parameterized paths to call mojit 
actions. In the ``routes.json`` below, the ``path`` property uses parameters 
to capture a part of the matched URL and then uses that captured part to 
replace ``{{mojit-action}}`` in the value for the ``call`` property. Any 
value can be used for the parameter as long as it is prepended with a 
colon (e.g., ``:foo``). After the parameter has been replaced by a value 
given in the path, the call to the action should have the following syntax: 
``{mojit_instance}.(action}`` 


.. code-block:: javascript

   [
     {
       "settings": [ "master" ],
       "_foo_action": {
         "verb": ["get", "post", "put"],
         "path": "/foo/:mojit-action",
         "call": "@foo-1.{mojit-action}"
       },
       "_bar_action": {
         "verb": ["get", "post", "put"],
         "path": "/bar/:mojit-action",
         "call": "@bar-1.{mojit-action}"
       }
     }
   ]
   
For example, based on the ``routes.json`` above, an HTTP GET call made on the 
path ``http://localhost:8666/foo/index`` would call the ``index`` function in 
the controller because the value of ``:mojit-action`` in the path (``index`` in 
this case) would be then replace ``{mojit-action}}`` in the ``call`` property. 
The following URLs call the ``index`` and ``myAction`` functions in the controller.

- ``http://localhost:8666/foo/index``

- ``http://localhost:8666/foo/myAction``

- ``http://localhost:8666/bar/index``

.. _regex_paths:

Using Regular Expressions to Match Routing Paths
------------------------------------------------

You can use the ``regex`` property of a routing object to define a key-value 
pair that defines a path parameter and a regular expression. The key is prepended 
with a colon when represented as a path parameter. For example, the key ``name`` 
would be represented as ``:name`` as a path parameter: ``"path": "/:name"``.
The associated value contains the regular expression that is matched against 
the request URL. 

For example, in the ``routes.json`` below, if the path of the request 
matches the regular expression ``\\d{1,2}_[Mm]ojitos?``, the ``index``
action of the mojit instance is called. 


.. code-block:: javascript

   [
     {
       "settings": [ "master" ],
       "regex_path": {
         "verbs": ["get"],
         "path": "/:matched_path",
         "regex": { "matched_path": "\\d{1,2}_[Mm]ojitos?" },
         "call": "myMojit.index"
       }
     }
   ]

Based on the above routing configuration, the following URLs 
would call the ``index`` action:

- ``http://localhost:8666/1_mojito``
- ``http://localhost:8666/99_Mojitos``


.. _generate_urls:

Generate URLs from the Controller
---------------------------------

The Mojito JavaScript library contains the `Url addon <../../api/classes/Url.common.html>`_ 
that allows you to create a URL with the mojit instance, the action, and parameters from 
the controller.

In the code snippet below from ``routes.json``,  the mojit instance, the HTTP method, and 
the action are specified in the ``"foo_default"`` object.

.. code-block:: javascript

   "foo_default": {
     "verb": ["get"],
     "path": "/foo",
     "call": "foo-1.index"
   }

In this code snippet from ``controller.js``, the `Url addon <../../api/classes/Url.common.html>`_ 
with the ``make`` method use the mojit instance and function specified in the 
``routes.json`` above to create the URL ``/foo`` with the query string parameters 
``?foo=bar``.

.. code-block:: javascript

   ...
     index: function(ac) {
       ac.url.make('foo-1', 'index', null, 'GET',{'foo': 'bar'});
     }
   ...

The ``index`` function above returns the following URL: ``http://localhost:8666/foo?foo=bar``

.. _mojito_configuring-access:

Accessing Configurations from Mojits
====================================

The model and binder can access mojit configurations from the ``init`` 
function. The controller and model are passed ``configuration`` objects. The controller 
can access configuration with the ``Config`` addon. 
The ``init`` function in the binder, instead of a configuration object, is passed the 
``mojitProxy`` object, which enables you to access configurations.  


.. _configuring_access-applevel:

Application-Level Configurations
--------------------------------

Only the mojit controller has access to application-level configurations 
using the ActionContext ``Config`` addon.

.. _access-applicationjson:

application.json
################

The controller functions that are passed an ``actionContext`` object can get the 
application configurations in ``application.json`` with the method ``getAppConfig``
of the ``Config`` addon.

For example, if you wanted to access the ``specs`` object defined in ``application.json``,
you would use ``ac.config.getAppConfig().specs`` as shown here:

.. code-block:: javascript

      YUI.add('myMojit', function(Y, NAME) {
        Y.namespace('mojito.controllers')[NAME] = {
          index: function(ac) {
            // Get the 'specs' object from teh application configuration 
            // through the Config addon.
            var app_specs = ac.config.getAppConfig().specs;
            Y.log(app_specs);
            ac.done({ status: "Showing app config in the log."});
          }
        };
      }, '0.0.1', {requires: ['mojito', 'mojito-config-addon']});

.. _access-routesjson:

routes.json
###########

The routing configuration can be accessed with the method ``getRoutes``
of the ``Config`` addon.


.. code-block:: javascript

      YUI.add('myMojit', function(Y, NAME) {
        Y.namespace('mojito.controllers')[NAME] = {
          index: function(ac) {
            // Get the routing configuration through
            // the Config addon.
            var route_config = ac.config.getRoutes();
            Y.log(route_config);
            ac.done({ status: "Showing routing config in the log."});
          }
        };
      }, '0.0.1', {requires: ['mojito', 'mojito-config-addon']});

.. _access_configs-context:

Application Context
-------------------

The contexts for an application specify environment variables such as the runtime 
environment, the location, device, region, etc. Once again, only the controller that is 
passed the ``actionContext`` object can access the context. You can access the context 
using ``ac.context``. 


Below is an example of the ``context`` object:

.. code-block:: javascript

   { 
     runtime: 'server',
     site: '',
     device: '',
     lang: 'en-US',
     langs: 'en-US,en',
     region: '',
     jurisdiction: '',
     bucket: '',
     flavor: '',
     tz: '' 
   }

.. _configuring_access-mojit:

Mojit-Level Configurations
--------------------------

Mojit-level configurations can be specified in two locations. You can specify mojit-level 
configurations in the ``config`` object of a mojit instance in ``application.json`` or 
default configurations for a mojit in ``mojits/{mojit_name}/defaults.json``. The 
configurations of ``application.json`` override those in ``defaults.json``.


.. _access_mojit-controller:

Controller
##########

Controllers can access mojit-level configurations from the ``actionContext`` object 
using the `Config addon <../../api/classes/Config.common.html>`_. 
Use ``ac.config.get`` to access configuration values from ``application.json`` and 
``defaults.json`` and ``ac.config.getDefinition`` to access definition values from 
``definition.json``.


.. _access_mojit-model:

Model
#####

The ``init`` function in the model is also passed the mojit-level configurations. 
If other model functions need the configurations, you need to save the 
configurations to the ``this`` reference because no ``actionContext`` object is 
passed to the model, so your model does not have access to the ``Config`` addon.


.. _access_mojit-binder:

Binder
######

As mentioned earlier, you access configurations through the ``mojitProxy`` object by 
referencing the ``config`` property: ``mojitProxy.config``


