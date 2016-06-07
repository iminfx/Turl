/**
 * Created by Administrator on 2016/6/6.
 */
//define the console.log for IE
window.console = window.console || {};
window.console.log = window.console.log || function() {};

window.NGeTP = window.NGeTP || {};

var NGeTP = (function () {

    var NGeTP = window.NGeTP || {};
    NGeTP.SDK_VERSION = '0.0.1';
    NGeTP.A = 'ApplicationQuery';


    /**
     *  @constructor
     *  @param {string} method
     *  @param {string} path
     *  @param {object} jsonObj
     *  @param {object} paramsObj
     *  @param {function} successCallback
     *  @param {function} failureCallback
     */
    NGeTP.Query = function(method, resource, jsonObj, paramsObj, successCallback, failureCallback) {
        //query vars
        this._method = method;
        this._resource = resource;
        this._jsonObj = jsonObj;
        this._paramsObj = paramsObj;
        this._successCallback = successCallback;
        this._failureCallback = failureCallback;

        //curl command - will be populated by runQuery function
        this._curl = '';
        this._token = false;

        //paging vars
        this._cursor = null;
        this._next = null;
        this._previous = [];
        this._start = 0;
        this._end = 0;
    };

    NGeTP.Query.prototype = {
        setQueryStartTime: function() {
            this._start = new Date().getTime();
        },

        setQueryEndTime: function() {
            this._end = new Date().getTime();
        },

        getQueryTotalTime: function() {
            var seconds = 0;
            var time = this._end - this._start;
            try {
                seconds = ((time/10) / 60).toFixed(2);
            } catch(e){ return 0; }
            return this.getMethod() + " " + this.getResource() + " - " + seconds + " seconds";
        },
        /**
         *  A method to set all settable parameters of the Query at one time
         *
         *  @public
         *  @method validateUsername
         *  @param {string} method
         *  @param {string} path
         *  @param {object} jsonObj
         *  @param {object} paramsObj
         *  @param {function} successCallback
         *  @param {function} failureCallback
         *  @return none
         */
        setAllQueryParams: function(method, resource, jsonObj, paramsObj, successCallback, failureCallback) {
            this._method = method;
            this._resource = resource;
            this._jsonObj = jsonObj;
            this._paramsObj = paramsObj;
            this._successCallback = successCallback;
            this._failureCallback = failureCallback;
        },

        /**
         *  A method to reset all the parameters in one call
         *
         *  @public
         *  @return none
         */
        clearAll: function() {
            this._method = null;
            this._resource = null;
            this._jsonObj = {};
            this._paramsObj = {};
            this._successCallback = null;
            this._failureCallback = null;
        },
        /**
         * Returns the method
         *
         * @public
         * @method getMethod
         * @return {string} Returns method
         */
        getMethod: function() {
            return this._method;
        },

        /**
         * sets the method (POST, PUT, DELETE, GET)
         *
         * @public
         * @method setMethod
         * @return none
         */
        setMethod: function(method) {
            this._method = method;
        },

        /**
         * Returns the resource
         *
         * @public
         * @method getResource
         * @return {string} the resource
         */
        getResource: function() {
            return this._resource;
        },

        /**
         * sets the resource
         *
         * @public
         * @method setResource
         * @return none
         */
        setResource: function(resource) {
            this._resource = resource;
        },

        /**
         * Returns the json Object
         *
         * @public
         * @method getJsonObj
         * @return {object} Returns the json Object
         */
        getJsonObj: function() {
            return this._jsonObj;
        },

        /**
         * sets the json object
         *
         * @public
         * @method setJsonObj
         * @return none
         */
        setJsonObj: function(jsonObj) {
            this._jsonObj = jsonObj;
        },
        /**
         * Returns the Query Parameters object
         *
         * @public
         * @method getQueryParams
         * @return {object} Returns Query Parameters object
         */
        getQueryParams: function() {
            return this._paramsObj;
        },

        /**
         * sets the query parameter object
         *
         * @public
         * @method setQueryParams
         * @return none
         */
        setQueryParams: function(paramsObj) {
            this._paramsObj = paramsObj;
        },

        /**
         * Returns the success callback function
         *
         * @public
         * @method getSuccessCallback
         * @return {function} Returns the successCallback
         */
        getSuccessCallback: function() {
            return this._successCallback;
        },

        /**
         * sets the success callback function
         *
         * @public
         * @method setSuccessCallback
         * @return none
         */
        setSuccessCallback: function(successCallback) {
            this._successCallback = successCallback;
        },

        /**
         * Calls the success callback function
         *
         * @public
         * @method callSuccessCallback
         * @return {boolean} Returns true or false based on if there was a callback to call
         */
        callSuccessCallback: function(response) {
            if (this._successCallback && typeof(this._successCallback ) === "function") {
                this._successCallback(response);
                return true;
            } else {
                return false;
            }
        },

        /**
         * Returns the failure callback function
         *
         * @public
         * @method getFailureCallback
         * @return {function} Returns the failureCallback
         */
        getFailureCallback: function() {
            return this._failureCallback;
        },

        /**
         * sets the failure callback function
         *
         * @public
         * @method setFailureCallback
         * @return none
         */
        setFailureCallback: function(failureCallback) {
            this._failureCallback = failureCallback;
        },

        /**
         * Calls the failure callback function
         *
         * @public
         * @method callFailureCallback
         * @return {boolean} Returns true or false based on if there was a callback to call
         */
        callFailureCallback: function(response) {
            if (this._failureCallback && typeof(this._failureCallback) === "function") {
                this._failureCallback(response);
                return true;
            } else {
                return false;
            }
        },

        /**
         * Returns the curl call
         *
         * @public
         * @method getCurl
         * @return {function} Returns the curl call
         */
        getCurl: function() {
            return this._curl;
        },

        /**
         * sets the curl call
         *
         * @public
         * @method setCurl
         * @return none
         */
        setCurl: function(curl) {
            this._curl = curl;
        },

        /**
         * Returns the Token
         *
         * @public
         * @method getToken
         * @return {function} Returns the Token
         */
        getToken: function() {
            return this._token;
        },

        /**
         * Method to set
         *
         * @public
         * @method setToken
         * @return none
         */
        setToken: function(token) {
            this._token = token;
        },

        /**
         * Resets the paging pointer (back to original page)
         *
         * @public
         * @method resetPaging
         * @return none
         */
        resetPaging: function() {
            this._previous = [];
            this._next = null;
            this._cursor = null;
        },

        /**
         * Method to determine if there is a previous page of data
         *
         * @public
         * @method hasPrevious
         * @return {boolean} true or false based on if there is a previous page
         */
        hasPrevious: function() {
            return (this._previous.length > 0);
        },

        /**
         * Method to set the paging object to get the previous page of data
         *
         * @public
         * @method getPrevious
         * @return none
         */
        getPrevious: function() {
            this._next=null; //clear out next so the comparison will find the next item
            this._cursor = this._previous.pop();
        },

        /**
         * Method to determine if there is a next page of data
         *
         * @public
         * @method hasNext
         * @return {boolean} true or false based on if there is a next page
         */
        hasNext: function(){
            return (this._next);
        },

        /**
         * Method to set the paging object to get the next page of data
         *
         * @public
         * @method getNext
         * @return none
         */
        getNext: function() {
            this._previous.push(this._cursor);
            this._cursor = this._next;
        },

        /**
         * Method to save off the cursor just returned by the last API call
         *
         * @public
         * @method saveCursor
         * @return none
         */
        saveCursor: function(cursor) {
            //if current cursor is different, grab it for next cursor
            if (this._next !== cursor) {
                this._next = cursor;
            }
        },

        /**
         * Method to determine if there is a next page of data
         *
         * @public
         * @method getCursor
         * @return {string} the current cursor
         */
        getCursor: function() {
            return this._cursor;
        }
    };


    /*
     *
     *  A Singleton that is the main client for making calls to the API. Maintains
     *  state between calls for the following items:
     *
     *  Token
     *  User (username, email, name, uuid)
     *
     *  Main methods for making calls to the API are:
     *
     *  runAppQuery (Query)
     *  runManagementQuery(Query)
     *
     *  Create a new NGeTP.Query object and then pass it to either of these
     *  two methods for making calls directly to the API.
     *
     *  A method for logging in an app user (to get a OAuth token) also exists:
     *
     *  logInAppUser (username, password, successCallback, failureCallback)
     *
     *  @class NGeTP.ApiClient
     *
     */
    NGeTP.ApiClient = (function () {
        //Default Public API endpoint
        var _apiUrl = "http://localhost:8000/";
        var _token = null;
        var _callTimeout = 30000;
        var _queryType = null;

        /*
         *  Public method to run calls against the app endpoint
         *
         *  @method runAppQuery
         *  @public
         *  @params {object} NGeTP.Query - {method, path, jsonObj, params, successCallback, failureCallback}
         *  @return none
         */
        function runAppQuery (Query) {
            var endpoint = "/" ;
            setQueryType(NGeTP.A);
            run(Query, endpoint);
        }


        /*
         *  A public method to get current OAuth token
         *
         *  @method getToken
         *  @public
         *  @return {string} the current token
         */
        function getToken() {
            return _token;
        }

        /*
         *  A public method to set the current Oauth token
         *
         *  @method setToken
         *  @public
         *  @param token - the bearer token
         *  @return none
         */
        function setToken(token) {
            _token = token;
        }

        /*
         *  A public method to return the API URL
         *
         *  @method getApiUrl
         *  @public
         *  @return {string} the API url
         */
        function getApiUrl() {
            return _apiUrl;
        }

        /*
         *  A public method to overide the API url
         *
         *  @method setApiUrl
         *  @public
         *  @return none
         */
        function setApiUrl(apiUrl) {
            _apiUrl = apiUrl;
        }

        /**
         *  Private helper method to encode the query string parameters
         *
         *  @method encodeParams
         *  @public
         *  @params {object} params - an object of name value pairs that will be urlencoded
         *  @return {string} Returns the encoded string
         */
        function encodeParams (params) {
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
        }

        /*
         *  A private method to get the type of the current api call - (Management or Application)
         *
         *  @method getQueryType
         *  @private
         *  @return {string} the call type
         */
        function getQueryType() {
            return _queryType;
        }
        /*
         *  A private method to set the type of the current api call - (Management or Application)
         *
         *  @method setQueryType
         *  @private
         *  @param {string} call type
         *  @return none
         */
        function setQueryType(type) {
            _queryType = type;
        }

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
        function run (Query, endpoint) {
            console.log("Not Implemented");
            console.log(Query);
        }


        return {
            runAppQuery:runAppQuery,
            getToken:getToken,
            setToken:setToken,
            getApiUrl:getApiUrl,
            setApiUrl:setApiUrl
        }
    })();

    return NGeTP;

})(NGeTP);