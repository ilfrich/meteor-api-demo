/**
 * Created by Peter Ilfrich
 * Copyright (c) 2015 IBM Research. All rights reserved.
 *
 *
 */
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import './container-get.js';

function refreshGetData(parameter) {
    console.log("Retrieving apiData with parameter " + parameter);
    Meteor.call('getWithParameter', parameter, function(err, data) {
        // add current result to template data
        var existingData = Template.containerSwitch.apiData.get();
        existingData[data.id] = data;
        Template.containerSwitch.apiData.set(existingData);
    });
}

Template.containerSwitch.currentParameter = new ReactiveVar();
Template.containerSwitch.apiData = new ReactiveVar({});


Template.containerSwitch.helpers({

    getApiData: function() {
        var parameter = Template.containerSwitch.currentParameter.get();
        var data = Template.containerSwitch.apiData.get();

        if (data !== undefined && parameter !== undefined) {
            if (data[parameter] !== undefined) {
                return data[parameter];
            } else {
                refreshGetData(parameter);
            }

        } else {
            return false;
        }
    },

    apiEntries: function() {
        return Template.containerGet.apiData.get();
    }
});

Template.containerSwitch.events({
    'change #entry-switch': function(e) {
        Template.containerSwitch.currentParameter.set($('#entry-switch option:selected').val());
    }
})