/**
 * Created by Peter Ilfrich
 * Copyright (c) 2015 IBM Research. All rights reserved.
 *
 *
 */
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

/**
 * Helper function that retrieves the API data and stores it in the reactive variable.
 */
function refreshGetData() {
    console.log('Retrieving simpleGetData');
    Meteor.call('simpleGetData', function(err, data) {
        Template.containerGet.apiData.set(data);
    });
}

/**
 * The reactive variable used to store the current API data.
 * @type {ReactiveVar}
 */
Template.containerGet.apiData = new ReactiveVar();

Template.containerGet.helpers({

    /**
     * Template helper checking the content of the reactive var. If the reactive variable
     * is undefined, the data will be retrieved, if not, the data is returned.
     * @returns {any}
     */
    getApiData: function() {
        /*
         * First execution will trigger the data refresh and return undefined.
         * When the refreshGetData function returns the async response, this
         * helper will be re-executed, updating the UI with the data.
         */
        if (Template.containerGet.apiData.get() === undefined) {
            refreshGetData();
        }
        return Template.containerGet.apiData.get();
    }
});