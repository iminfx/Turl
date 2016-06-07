/**
 * Created by Administrator on 2016/6/6.
 */
//ServicePortal namespace
window.ServicePortal = window.ServicePortal || {};


/*
 *
 *  A Singleton that is the main client for making calls to the API. Maintains
 *  state between calls for the following items:
 *
 *
 *  Main methods for making calls to the API are:
 *
 *  runAppQuery (Query)
 *
 *  Create a new NGeTP.Query object and then pass it to either of these
 *  two methods for making calls directly to the API.
 *
 *
 */

ServicePortal.ApiClient = (function () {
    //Default Public API endpoint
    var _apiUrl = "BUILD_API_PLACEHOLDER";
    var _token = null;
    var _callTimeout = 30000;
    var _queryType = null;
    var _onErrorHandler = function(){};
    var _onLoadStartHandler = function(){};
    var _onLoadStopHandler = function(){};


    /*
     *  Public method to run calls against the app endpoint
     *
     *  @method runAppQuery
     *  @public
     *  @params {object} NGeTP.Query - {method, path, jsonObj, params, successCallback, failureCallback}
     *  @return none
     */
    var runAppQuery = function (query) {
        var endpoint = query._resource ;
        run(query, endpoint);
    };

    var runAppCachedQuery = function (query, params) {
        var endpoint = query._resource ;
        runCached(query, endpoint, params);
    };


    /*
     *  A public method to get current OAuth token
     *
     *  @method getToken
     *  @public
     *  @return {string} the current token
     */
    var getToken = function() {

        var _token = app.session.get("token");
        return _token;
    };

    /*
     *  A public method to set the current Oauth token
     *
     *  @method setToken
     *  @public
     *  @param token - the bearer token
     *  @return none
     */
    var setToken = function(token) {
        app.session.setToken(token);
        _token = token;
    };

    /*
     *  A public method to return the API URL
     *
     *  @method getApiUrl
     *  @public
     *  @return {string} the API url
     */
    var getApiUrl = function() {
        return _apiUrl;
    };

    /*
     *  A public method to overide the API url
     *
     *  @method setApiUrl
     *  @public
     *  @return none
     */
    var setApiUrl = function(apiUrl) {
        _apiUrl = "http://localhost:8000/";
    };

    var setOnLoadStartHandler = function(handler) {
        _onLoadStartHandler = handler;
    };

    var setOnLoadStopHandler = function(handler) {
        _onLoadStopHandler = handler;
    };

    var setOnErrorHandler = function(handler) {
        _onErrorHandler = handler;
    };

    /**
     *  Private helper method to encode the query string parameters
     *
     *  @method encodeParams
     *  @public
     *  @params {object} params - an object of name value pairs that will be urlencoded
     *  @return {string} Returns the encoded string
     */
    var encodeParams = function(params) {
        tail = [];
        var item = [];
        if (params instanceof Array) {
            for (i in params) {
                item = params[i];
                if ((item instanceof Array) && (item.length > 1)) {
                    tail.push(item[0] + "=" + encodeURIComponent(item[1]));
                }
            }
        } else {
            for (var key in params) {
                if (params.hasOwnProperty(key)) {
                    var value = params[key];
                    if (value instanceof Array) {
                        for (i in value) {
                            item = value[i];
                            tail.push(key + "=" + encodeURIComponent(item));
                        }
                    } else {
                        tail.push(key + "=" + encodeURIComponent(value));
                    }
                }
            }
        }
        return tail.join("&");
    };


    /**
     * TODO
     *  A private method to validate, prepare,, and make the calls to the API
     *  Use runAppQuery or runManagementQuery to make your calls!
     *
     *  @method run
     *  @private
     *  @params {object} NGeTP.Query - {method, path, jsonObj, params, successCallback, failureCallback}
     *  @params {string} endpoint - used to differentiate between management and app queries
     *  @return {response} callback functions return API response object
     */
    var run = function(query, endpoint) {
        var method = query._method;
        var path = getApiUrl() + endpoint;
        var jsonObj = query._jsonObj;
        var xhr = null;

        if(window.XDomainRequest){
            xhr = new window.XDomainRequest();
            var _token = getToken();
            if (_token) {
                if (path.indexOf("?")) {
                    path += '&access_token='+_token;
                } else {
                    path = '?access_token='+_token;
                }
            }
            xhr.open(method, path, true);
        }
        else {
            xhr = new XMLHttpRequest();
            xhr.open(method, path, true);
            //add content type = json if there is a json payload
            if (jsonObj) {
                xhr.setRequestHeader("Content-Type", "application/json");
            }
            var authToken = getToken();

            if (authToken) {
                xhr.setRequestHeader("X-Auth-Token", authToken);
                xhr.withCredentials = true;
            }
        }

        _onLoadStartHandler();
        xhr.send(jsonObj);
        xhr.onreadystatechange = function(response) {
            query.setQueryEndTime();
            if (xhr.readyState == 4 /* complete */) {
                _onLoadStopHandler();
                response = xhr.responseText && JSON.parse(xhr.responseText);
                if (xhr.status === 200 || xhr.status === 304) {
                    if (response.authToken) {
                        setToken(response.authToken);
                    }
                    query.callSuccessCallback(response.data);
                }
                else {
                    var xhrClone = {};
                    xhrClone.status = xhr.status;
                    if (xhr.responseText) {
                        xhrClone.responseText = JSON.stringify(JSON.parse(xhr.responseText).data);
                    }
                    if (query.callFailureCallback(xhrClone) != true){
                        _onErrorHandler(xhrClone);
                    }
                }
            }
        };
    };

    var queryCache = {};

    var runCached = function (query, endpoint, params) {

        var hash = md5(query._method + getApiUrl() + endpoint);

        var originalSuccess = queryCache[hash] ? queryCache[hash].getSuccessCallback() : query.getSuccessCallback();
        var result = appCache.get(hash);
        if (typeof result !== 'undefined') {
            console.log("get FROM cache");
            query.callSuccessCallback(result);
        } else if (queryCache[hash]) {
            console.log("Duplicate");
            queryCache[hash].setSuccessCallback(function (result) {
                originalSuccess(result);
                query.callSuccessCallback(result);
            });
        } else {
            queryCache[hash] = query;
            query.setSuccessCallback(function (result) {
                appCache.insert(hash, result, params);
                delete queryCache[hash];
                console.log("insert into cache");
                originalSuccess(result);
            });
            run(query, endpoint);
        }
    };

    return {
        runAppQuery:runAppQuery,
        runAppCachedQuery:runAppCachedQuery,
        run:run,
        runCached:runCached,
        getToken:getToken,
        setToken:setToken,
        getApiUrl:getApiUrl,
        setApiUrl:setApiUrl,
        setOnLoadStartHandler:setOnLoadStartHandler,
        setOnLoadStopHandler:setOnLoadStopHandler,
        setOnErrorHandler:setOnErrorHandler
    };

})();

