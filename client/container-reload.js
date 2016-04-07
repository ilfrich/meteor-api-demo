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
 * Function that reloads the API data.
 */
function refreshGetData() {
    console.log('Reloading data on demand.');
    Meteor.call('simpleGetData', function(err, data) {
        Template.containerReload.apiData.set(data);
    });
}

/**
 * The reactive variable holding the API data.
 * @type {ReactiveVar}
 */
Template.containerReload.apiData = new ReactiveVar();


Template.containerReload.helpers({

    /**
     * Same as for the simple API get example, this helper is executed twice, first time returning undefined,
     * second time it will return the API data.
     * @returns {any}
     */
    getApiData: function() {
        if (Template.containerReload.apiData.get() === undefined) {
            refreshGetData();
        }
        return Template.containerReload.apiData.get();
    }
});

/**
 * Register the onClick event for the reload button
 */
Template.containerReload.events({

    /**
     * #reload-data is the reload button.
     * @param e
     */
    'click #reload-data': function(e) {
        e.preventDefault();
        // this updates the reactive variable, which will re-execute the helper and update the UI.
        refreshGetData();
    }
});