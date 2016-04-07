/**
 * Created by Peter Ilfrich
 * Copyright (c) 2015 IBM Research. All rights reserved.
 *
 *
 */
import { HTTP } from 'meteor/http';


/**
 * Replace this with your target API or use the API URLs directly in the methods below.
 * @type {string}
 */
var baseUrl = 'http://localhost:9080/hub/api/provider';


Meteor.methods({

    /**
     * Just executes a simple HTTP request (synchronously on the server side)
     *
     * @returns the data returned from the API.
     */
    simpleGetData: function() {
        var response = HTTP.get(baseUrl);
        return response.data;
    },

    /**
     * Appends the parameter as new path element to the base URL and invokes a GET request.
     * @param param - the parameter to append
     * @returns the data returned from the API
     */
    getWithParameter: function(param) {
        var response = HTTP.get(baseUrl + '/' + param);
        return response.data;
    }
});