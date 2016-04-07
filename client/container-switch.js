/**
 * Created by Peter Ilfrich
 * Copyright (c) 2015 IBM Research. All rights reserved.
 *
 *
 */
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

/*
 * NOTE: please check container-get.js first as it explains the basic mechanism.
 */


/**
 * Loads data into the reactive variable. This can be a reload or the initial retrieval
 * of data.
 * @param parameter - the parameter to query data for (e.g. an object ID).
 */
function refreshGetData(parameter) {
    console.log("Retrieving apiData with parameter " + parameter);
    // calling a different server method, that appends the parameter to the API URL.
    Meteor.call('getWithParameter', parameter, function(err, data) {
        // add current result to template data
        var existingData = Template.containerSwitch.apiData.get();
        existingData[data.id] = data;
        // set the reactive variable again in order to trigger the helper execution again.
        Template.containerSwitch.apiData.set(existingData);
    });
}

/**
 * Reactive variable holding the parameter that is currently selected in the UI
 * @type {ReactiveVar}
 */
Template.containerSwitch.currentParameter = new ReactiveVar();

/**
 * Reactive variable holding the detailed data of all entries that have been looked up
 * by the user while on the same page.
 *
 * This time, we initialize the reactive variable as empty JSON object {}
 *
 * The object will hold object IDs as keys and the full objects as values:
 * {
 *   'id5823423742374': { name: 'Some name', description: 'Some description', ... },
 *   'id6875353453434': { ... },
 *   ...
 * }
 *
 * @type {ReactiveVar}
 */
Template.containerSwitch.apiData = new ReactiveVar({});


Template.containerSwitch.helpers({

    /**
     * Helper utilising the reactive variables to return the right object or false (if none selected).
     * @returns {*}
     */
    getApiData: function() {
        // parameter is the object id
        var parameter = Template.containerSwitch.currentParameter.get();
        // data is the entire map of data
        var data = Template.containerSwitch.apiData.get();

        // data and parameter are specified
        if (data !== undefined && parameter !== undefined) {

            if (data[parameter] !== undefined) {
                // data already contains the current parameter key, just return the data
                return data[parameter];
            } else {
                /*
                 * data is not available yet, load it, which will overwrite the data variable
                 * and re-execute the template helper
                 */
                refreshGetData(parameter);
            }

        } else {
            return false;
        }
    },

    /**
     * This just reads the api entries displayed in the simple get example in a dropdown to select one.
     * @returns {any}
     */
    apiEntries: function() {
        return Template.containerGet.apiData.get();
    }
});

Template.containerSwitch.events({
    /**
     * Event to handle the selection of a different element.
     *
     * Updating the reactive variable 'currentParameter' will re-execute the template helper to
     * retrieve the data.
     *
     * @param e
     */
    'change #entry-switch': function(e) {
        Template.containerSwitch.currentParameter.set($('#entry-switch option:selected').val());
    }
})