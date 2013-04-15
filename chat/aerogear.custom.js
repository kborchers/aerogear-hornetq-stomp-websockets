/*! AeroGear JavaScript Library - v1.0.0 - 2013-04-15
* https://github.com/aerogear/aerogear-js
* JBoss, Home of Professional Open Source
* Copyright Red Hat, Inc., and individual contributors
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
* http://www.apache.org/licenses/LICENSE-2.0
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
/**
    The AeroGear namespace provides a way to encapsulate the library's properties and methods away from the global namespace
    @namespace
 */
this.AeroGear = {};

/**
    AeroGear.Core is a base for all of the library modules to extend. It is not to be instantiated and will throw an error when attempted
    @class
    @private
 */
AeroGear.Core = function() {
    // Prevent instantiation of this base class
    if ( this instanceof AeroGear.Core ) {
        throw "Invalid instantiation of base class AeroGear.Core";
    }

    /**
        This function is used by the different parts of AeroGear to add a new Object to its respective collection.
        @name AeroGear.add
        @method
        @param {String|Array|Object} config - This can be a variety of types specifying how to create the object. See the particular constructor for the object calling .add for more info.
        @returns {Object} The object containing the collection that was updated
     */
    this.add = function( config ) {
        var i,
            current,
            collection = this[ this.collectionName ] || {};

        if ( !config ) {
            return this;
        } else if ( typeof config === "string" ) {
            // config is a string so use default adapter type
            collection[ config ] = AeroGear[ this.lib ].adapters[ this.type ]( config );
        } else if ( AeroGear.isArray( config ) ) {
            // config is an array so loop through each item in the array
            for ( i = 0; i < config.length; i++ ) {
                current = config[ i ];

                if ( typeof current === "string" ) {
                    collection[ current ] = AeroGear[ this.lib ].adapters[ this.type ]( current );
                } else {
                    collection[ current.name ] = AeroGear[ this.lib ].adapters[ current.type || this.type ]( current.name, current.settings || {} );
                }
            }
        } else {
            // config is an object so use that signature
            collection[ config.name ] = AeroGear[ this.lib ].adapters[ config.type || this.type ]( config.name, config.settings || {} );
        }

        // reset the collection instance
        this[ this.collectionName ] = collection;

        return this;
    };
    /**
        This function is used internally by pipeline, datamanager, etc. to remove an Object (pipe, store, etc.) from the respective collection.
        @name AeroGear.remove
        @method
        @param {String|String[]|Object[]|Object} config - This can be a variety of types specifying how to remove the object. See the particular constructor for the object calling .remove for more info.
        @returns {Object} The object containing the collection that was updated
     */
    this.remove = function( config ) {
        var i,
            current,
            collection = this[ this.collectionName ] || {};

        if ( typeof config === "string" ) {
            // config is a string so delete that item by name
            delete collection[ config ];
        } else if ( AeroGear.isArray( config ) ) {
            // config is an array so loop through each item in the array
            for ( i = 0; i < config.length; i++ ) {
                current = config[ i ];

                if ( typeof current === "string" ) {
                    delete collection[ current ];
                } else {
                    delete collection[ current.name ];
                }
            }
        } else if ( config ) {
            // config is an object so use that signature
            delete collection[ config.name ];
        }

        // reset the collection instance
        this[ this.collectionName ] = collection;

        return this;
    };
};

/**
    Utility function to test if an object is an Array
    @private
    @method
    @param {Object} obj - This can be any object to test
*/
AeroGear.isArray = function( obj ) {
    return ({}).toString.call( obj ) === "[object Array]";
};

/**
    This callback is executed when an HTTP request completes whether it was successful or not.
    @callback AeroGear~completeCallbackREST
    @param {Object} jqXHR - The jQuery specific XHR object
    @param {String} textStatus - The text status message returned from the server
 */
/**
    This callback is executed when an HTTP error is encountered during a request.
    @callback AeroGear~errorCallbackREST
    @param {Object} jqXHR - The jQuery specific XHR object
    @param {String} textStatus - The text status message returned from the server
    @param {Object} errorThrown - The HTTP error thrown which caused the is callback to be called
 */
/**
    This callback is executed when an HTTP success message is returned during a request.
    @callback AeroGear~successCallbackREST
    @param {Object} data - The data, if any, returned in the response
    @param {String} textStatus - The text status message returned from the server
    @param {Object} jqXHR - The jQuery specific XHR object
 */
/**
    This callback is executed when an error is encountered saving to local or session storage.
    @callback AeroGear~errorCallbackStorage
    @param {Object} errorThrown - The HTTP error thrown which caused the is callback to be called
    @param {Object|Array} data - An object or array of objects representing the data for the failed save attempt.
 */
/**
    This callback is executed when data is successfully saved to session or local storage.
    @callback AeroGear~successCallbackStorage
    @param {Object} data - The updated data object after the new saved data has been added
 */

(function( AeroGear, undefined ) {
    /**
        The AeroGear.Notifier namespace provides a messaging API. Through the use of adapters, this library provides common methods like connect, disconnect, subscribe, unsubscribe and publish.
        @class
        @augments AeroGear.Core
        @param {String|Array|Object} [config] - A configuration for the client(s) being created along with the notifier. If an object or array containing objects is used, the objects can have the following properties:
        @param {String} config.name - the name that the client will later be referenced by
        @param {String} [config.type="vertx"] - the type of client as determined by the adapter used
        @param {Object} [config.settings={}] - the settings to be passed to the adapter
        @returns {Object} The created notifier containing any messaging clients that may have been created
        @example
        // Create an empty notifier
        var notifier = AeroGear.Notifier();

        // Create a single client using the default adapter
        var notifier2 = AeroGear.Notifier( "myNotifier" );

        // Create multiple clients using the default adapter
        var notifier3 = AeroGear.Notifier( [ "someNotifier", "anotherNotifier" ] );
     */
    AeroGear.Notifier = function( config ) {
        // Allow instantiation without using new
        if ( !( this instanceof AeroGear.Notifier ) ) {
            return new AeroGear.Notifier( config );
        }
        // Super Constructor
        AeroGear.Core.call( this );

        this.lib = "Notifier";
        this.type = config ? config.type || "vertx" : "vertx";

        /**
            The name used to reference the collection of notifier client instances created from the adapters
            @memberOf AeroGear.Notifier
            @type Object
            @default modules
         */
        this.collectionName = "clients";

        this.add( config );
    };

    AeroGear.Notifier.prototype = AeroGear.Core;
    AeroGear.Notifier.constructor = AeroGear.Notifier;

    /**
        The adapters object is provided so that adapters can be added to the AeroGear.Notifier namespace dynamically and still be accessible to the add method
        @augments AeroGear.Notifier
     */
    AeroGear.Notifier.adapters = {};

    /**
        A set of constants used to track the state of a client connection.
     */
    AeroGear.Notifier.CONNECTING = 0;
    AeroGear.Notifier.CONNECTED = 1;
    AeroGear.Notifier.DISCONNECTING = 2;
    AeroGear.Notifier.DISCONNECTED = 3;
})( AeroGear );

(function( AeroGear, sockjs, stomp, undefined ) {
    /**
        The stomp adapter uses an underlying stomp.js implementation for messaging.
        @constructs AeroGear.Notifier.adapters.stompws
        @param {String} clientName - the name used to reference this particular notifier client
        @param {Object} [settings={}] - the settings to be passed to the adapter
        @param {String} [settings.connectURL=""] - defines the URL for connecting to the messaging service
        @returns {Object} The created notifier client
     */
    AeroGear.Notifier.adapters.stompws = function( clientName, settings ) {
        // Allow instantiation without using new
        if ( !( this instanceof AeroGear.Notifier.adapters.stompws ) ) {
            return new AeroGear.Notifier.adapters.stompws( clientName, settings );
        }

        settings = settings || {};

        // Private Instance vars
        var type = "stompws",
            name = clientName,
            channels = settings.channels || [],
            connectURL = settings.connectURL || "",
            state = AeroGear.Notifier.CONNECTING,
            client = null;

        // Privileged methods
        /**
            Returns the value of the private settings var
            @private
            @augments AeroGear.Notifier.adapters.stompws
         */
        this.getSettings = function() {
            return settings;
        };

        /**
            Returns the value of the private name var
            @private
            @augments AeroGear.Notifier.adapters.stompws
         */
        this.getName = function() {
            return name;
        };

        /**
            Returns the value of the private connectURL var
            @private
            @augments AeroGear.Notifier.adapters.stompws
         */
        this.getConnectURL = function() {
            return connectURL;
        };

        /**
            Set the value of the private connectURL var
            @private
            @augments AeroGear.Notifier.adapters.stompws
            @param {String} url - New connectURL for this client
         */
        this.setConnectURL = function( url ) {
            connectURL = url;
        };

        /**
            Returns the value of the private channels var
            @private
            @augments AeroGear.Notifier.adapters.stompws
         */
        this.getChannels = function() {
            return channels;
        };

        /**
            Adds a channel to the set
            @param {Object} channel - The channel object to add to the set
            @private
            @augments AeroGear.Notifier.adapters.stompws
         */
        this.addChannel = function( channel ) {
            channels.push( channel );
        };


        /**
            Check if subscribed to a channel
            @param {String} address - The address of the channel object to search for in the set
            @private
            @augments AeroGear.Notifier.adapters.stompws
         */
        this.getChannelIndex = function( address ) {
            for ( var i = 0; i < channels.length; i++ ) {
                if ( channels[ i ].address === address ) {
                    return i;
                }
            }
            return -1;
        };

        /**
            Removes a channel from the set
            @param {Object} channel - The channel object to remove from the set
            @private
            @augments AeroGear.Notifier.adapters.stompws
         */
        this.removeChannel = function( channel ) {
            var index = this.getChannelIndex( channel.address );
            if ( index >= 0 ) {
                channels.splice( index, 1 );
            }
        };

        /**
            Returns the value of the private state var
            @private
            @augments AeroGear.Notifier.adapters.stompws
         */
        this.getState = function() {
            return state;
        };

        /**
            Sets the value of the private state var
            @private
            @augments AeroGear.Notifier.adapters.stompws
         */
        this.setState = function( newState ) {
            state = newState;
        };

        /**
            Returns the value of the private client var
            @private
            @augments AeroGear.Notifier.adapters.stompws
         */
        this.getClient = function() {
            return client;
        };

        /**
            Sets the value of the private client var
            @private
            @augments AeroGear.Notifier.adapters.stompws
         */
        this.setClient = function( newClient ) {
            client = newClient;
        };
    };

    //Public Methods
    /**
        Connect the client to the messaging service
        @param {Object} options - Options to pass to the connect method
        @param {String} options.login - login name used to connect to the server
        @param {String} options.password - password used to connect to the server
        @param {String} [options.url] - The URL for the messaging service. This url will override and reset any connectURL specified when the client was created.
        @param {Function} [options.onConnect] - callback to be executed when a connection is established
        @param {Function} [options.onConnectError] - callback to be executed when connecting to a service is unsuccessful
        @param {String} [options.host] - name of a virtual host on the stomp server that the client wishes to connect to
        @example

     */
    AeroGear.Notifier.adapters.stompws.prototype.connect = function( options ) {
        var that = this,
            //ws = new sockjs( options.url || this.getConnectURL() ),
            //client = new stomp.over( ws ),
            client = new stomp.client( options.url || this.getConnectURL() ),
            onConnect = function() {
                var channels = that.getChannels();

                that.setState( AeroGear.Notifier.CONNECTED );

                that.subscribe( channels, true );

                if ( options.onConnect ) {
                    options.onConnect.apply( this, arguments );
                }
            },
            onConnectError = function() {
                that.setState( AeroGear.Notifier.DISCONNECTED );
                if ( options.onConnectError ) {
                    options.onConnectError.apply( this, arguments );
                }
            };

        client.connect( options.login, options.password, onConnect, onConnectError, options.host );
        this.setClient( client );
    };

    /**
        Disconnect the client from the messaging service
        @param {Function} [onDisconnect] - callback to be executed when a connection is terminated
        @example

     */
    AeroGear.Notifier.adapters.stompws.prototype.disconnect = function( onDisconnect ) {
        var that = this,
            client = this.getClient(),
            disconnected = function() {
                if ( that.getState() === AeroGear.Notifier.DISCONNECTING ) {
                    // Fire disconnect as usual
                    that.setState( AeroGear.Notifier.DISCONNECTED );
                    if ( onDisconnect ) {
                        onDisconnect.apply( this, arguments );
                    }
                }
            };

        if ( this.getState() === AeroGear.Notifier.CONNECTED ) {
            this.setState( AeroGear.Notifier.DISCONNECTING );
            client.disconnect( disconnected );
        }
    };

    /**
        Subscribe this client to a new channel
        @param {Object|Array} channels - a channel object or array of channel objects to which this client can subscribe. Each object should have a String address as well as a callback to be executed when a message is received on that channel.
        @param {Boolean} [reset] - if true, remove all channels from the set and replace with the supplied channel(s)
        @example

     */
    AeroGear.Notifier.adapters.stompws.prototype.subscribe = function( channels, reset ) {
        var client = this.getClient();

        if ( reset ) {
            this.unsubscribe( this.getChannels() );
        }

        channels = AeroGear.isArray( channels ) ? channels : [ channels ];
        for ( var i = 0; i < channels.length; i++ ) {
            channels[ i ].id = client.subscribe( channels[ i ].address, channels[ i ].callback );
            this.addChannel( channels[ i ] );
        }
    };

    /**
        Unsubscribe this client from a channel
        @param {Object|Array} channels - a channel object or a set of channel objects to which this client nolonger wishes to subscribe
        @example

     */
    AeroGear.Notifier.adapters.stompws.prototype.unsubscribe = function( channels ) {
        var client = this.getClient();

        channels = AeroGear.isArray( channels ) ? channels : [ channels ];
        for ( var i = 0; i < channels.length; i++ ) {
            client.unsubscribe( channels[ i ].id );
            this.removeChannel( channels[ i ] );
        }
    };

    /**
        Send a message to a particular channel
        @param {String} channel - the channel to which to send the message
        @param {String|Object} [message=""] - the message object to send
        @example

     */
    AeroGear.Notifier.adapters.stompws.prototype.send = function( channel, message ) {
        var headers = {},
            client = this.getClient();

        message = message || "";
        if ( message.headers ) {
            headers = message.headers;
            message = message.body;
        }

        client.send( channel, headers, message );
    };

})( AeroGear, SockJS, Stomp );

(function( AeroGear, undefined ) {
    /**
        DESCRIPTION
        @class
        @augments AeroGear.Core
        @example
     */
    AeroGear.SimplePush = function( config ) {
        // Allow instantiation without using new
        if ( !( this instanceof AeroGear.SimplePush ) ) {
            return new AeroGear.SimplePush( config );
        }
        // Super Constructor
        AeroGear.Core.call( this );

        this.lib = "SimplePush";
        this.type = config ? config.type || "SimplePush" : "SimplePush";

        /**
            DESCRIPTION
            @memberOf AeroGear.SimplePush
            @type Object
            @default connection
         */
        this.collectionName = "connection";

        this.add( config );
    };

    AeroGear.SimplePush.prototype = AeroGear.Core;
    AeroGear.SimplePush.constructor = AeroGear.SimplePush;

    /**
        The adapters object is provided so that adapters can be added to the AeroGear.Notifier namespace dynamically and still be accessible to the add method
        @augments AeroGear.Notifier
     */
    AeroGear.SimplePush.adapters = {};
})( AeroGear );

(function( AeroGear, undefined ) {
    /**
        DESCRIPTION
        @constructs AeroGear.SimplePush.adapters.SimplePush
        @param {String} connectionName - the name used to reference this SimplePush connection
        @param {Object} settings={} - the settings to be passed to the adapter
        @param {String} settings.pushNetworkLogin - push network username
        @param {String} settings.pushNetworkPassword - push network password
        @param {String} [settings.pushNetworkURL="<origin>/agPushNetwork"] - defines the base URL for connecting to the push messaging service
        @param {String} [settings.pushServerURL="<origin>/agUnifiedPush"] - defines the URL for connecting to the AeroGear Unified Push server
        @param {String} [settings.endpoints=[]] - the set of endpoints to filter push notifications by
        @param {Function} [settings.onNetworkConnect] - a callback to execute when the Notifier is connected
        @returns {Object} The created SimplePush connection
     */
    AeroGear.SimplePush.adapters.SimplePush = function( connectionName, settings ) {
        // Allow instantiation without using new
        if ( !( this instanceof AeroGear.SimplePush.adapters.SimplePush ) ) {
            return new AeroGear.SimplePush.adapters.SimplePush( connectionName, settings );
        }

        settings = settings || {};

        // Private Instance vars
        var stompNotifier,
            that = this,
            type = "SimplePush",
            name = connectionName,
            endpoints = settings.endpoints || [],
            pushNetworkURL = settings.pushNetworkURL || "http://" + window.location.hostname + ":61614/agPushNetwork",
            pushServerURL = settings.pushServerURL || "http://" + window.location.hostname + ":8080/agUnifiedPush",
            sessionID = null;

        // Privileged methods
        /**
            Returns the value of the private settings var
            @private
            @augments AeroGear.SimplePush.adapters.SimplePush
         */
        this.getSettings = function() {
            return settings;
        };

        /**
            Returns the value of the private name var
            @private
            @augments AeroGear.SimplePush.adapters.SimplePush
         */
        this.getName = function() {
            return name;
        };

        /**
            Returns the value of the private pushNetworkURL var
            @private
            @augments AeroGear.SimplePush.adapters.SimplePush
         */
        this.getPushNetworkURL = function() {
            return pushNetworkURL;
        };

        /**
            Set the value of the private pushNetworkURL var
            @private
            @augments AeroGear.SimplePush.adapters.SimplePush
            @param {String} url - New pushNetworkURL for this client
         */
        this.setPushNetworkURL = function( url ) {
            pushNetworkURL = url;
        };

        /**
            Returns the value of the private pushServerURL var
            @private
            @augments AeroGear.SimplePush.adapters.SimplePush
         */
        this.getPushServerURL = function() {
            return pushServerURL;
        };

        /**
            Set the value of the private pushServerURL var
            @private
            @augments AeroGear.SimplePush.adapters.SimplePush
            @param {String} url - New pushServerURL for this client
         */
        this.setPushServerURL = function( url ) {
            pushServerURL = url;
        };

        /**
            Returns the value of the private endpoints var
            @private
            @augments AeroGear.SimplePush.adapters.SimplePush
         */
        this.getEndpoints = function() {
            return endpoints;
        };

        /**
            Adds an endpoint to the set
            @param {Object} endpoint - The endpoint object to add to the set
            @private
            @augments AeroGear.SimplePush.adapters.SimplePush
         */
        this.addEndpoint = function( endpoint ) {
            endpoints.push( endpoint );
        };

        /**
            Check if subscribed to an endpoint
            @param {String} address - The address of the endpoint object to search for in the set
            @private
            @augments AeroGear.SimplePush.adapters.SimplePush
         */
        this.getEndpointIndex = function( address ) {
            for ( var i = 0; i < endpoints.length; i++ ) {
                if ( endpoints[ i ].address === address ) {
                    return i;
                }
            }
            return -1;
        };

        /**
            Removes an endpoint from the set
            @param {String} address - The endpoint address for the endpoint object to remove from the set
            @private
            @augments AeroGear.SimplePush.adapters.SimplePush
         */
        this.removeEndpoint = function( address ) {
            var index = this.getEndpointIndex( address );
            if ( index >= 0 ) {
                endpoints.splice( index, 1 );
            }
        };

        /**
            Returns the value of the private sessionID var
            @private
            @augments AeroGear.SimplePush.adapters.SimplePush
         */
        this.getSessionID = function() {
            return sessionID;
        };

        /**
            Sets the value of the private sessionID var
            @param {String} newSession - The new sessionID to set
            @private
            @augments AeroGear.SimplePush.adapters.SimplePush
         */
        this.setSessionID = function( newSession ) {
            sessionID = newSession;
        };

        // Instantiating SimplePush immediately creates a Notifier connection to the Push Network
        stompNotifier = AeroGear.Notifier({
            name: "agPushNetwork",
            type: "stompws",
            settings: {
                connectURL: pushNetworkURL
            }
        }).clients.agPushNetwork;

        stompNotifier.connect({
            login: settings.login,
            password: settings.password,
            onConnect: function( stompFrame ) {
                var endpoints = that.getEndpoints(),
                    settings = that.getSettings();
                that.setSessionID( "jms.topic.aerogear." + stompFrame.headers.session );

                stompNotifier.subscribe({
                    address: that.getSessionID(),
                    callback: function( message ) {
                        var endpoint;
                        if ( message.headers && message.headers.endpoint ) {
                            endpoint = endpoints[ that.getEndpointIndex( message.headers.endpoint ) ];
                            if ( endpoint ) {
                                endpoint.callback( message );
                            }
                        }
                    }
                });

                // TODO: Process initial provided endpoints to register with unified push server

                // Call user supplied onNetworkConnect callback
                if ( settings.onNetworkConnect ) {
                    settings.onNetworkConnect.call( that, stompFrame );
                }
            }
        });
    };

    //Public Methods
    /**
        Register a push message endpoint
        @param {String} address - endpoint identifier
        @param {Function} callback - callback to be executed when a message is received on this endpoint
        @example

     */
    AeroGear.SimplePush.adapters.SimplePush.prototype.register = function( address, callback ) {
        this.addEndpoint({
            address: address,
            callback: callback
        });

        /**************************************
        * TODO: Register with Unified Push Server
        **************************************/
    };

    //Public Methods
    /**
        Unregister a push message endpoint
        @param {String} address - endpoint identifier
        @example

     */
    AeroGear.SimplePush.adapters.SimplePush.prototype.unregister = function( address ) {
        this.removeEndpoint( address );

        /**************************************
        * TODO: Unregister with Unified Push Server
        **************************************/
    };

})( AeroGear );
