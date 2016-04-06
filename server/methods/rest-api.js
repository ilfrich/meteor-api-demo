/**
 * Created by Peter Ilfrich
 * Copyright (c) 2015 IBM Research. All rights reserved.
 *
 *
 */
import { HTTP } from 'meteor/http';



var baseUrl = 'http://localhost:9080/hub/api/provider';


Meteor.methods({

    simpleGetData: function() {
        var response = HTTP.get(baseUrl);
        return response.data;
    },

    getWithParameter: function(param) {
        var response = HTTP.get(baseUrl + '/' + param);
        console.log(response.data);
        return response.data;
    }
});