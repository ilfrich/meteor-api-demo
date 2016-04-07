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
 * Refresh the data if the currentToken matches the passed token. This function is executed recursively
 * with a configurable interval between executions (the interval is stored in a reactive variable)
 *
 * @param token - the timestamp when this refresh execution was initially invoked. This will prevent multiple parallel
 * executions of this function.
 */
function refreshGetData(token) {

    // only if the provided token matches the current template token proceed, otherwise terminate recursive execution.
    if (token == Template.containerReloadAuto.currentToken.get()) {
        console.log("Retrieving auto-reload data with token " + token + ' and interval ' + Template.containerReloadAuto.interval.get() + ' seconds.');
        Meteor.call('simpleGetData', function(err, data) {
            // update reactive data variable with newest API data.
            Template.containerReloadAuto.apiData.set(data);
            setTimeout(function() {
                // after the timeout, recursively execute refresh again passing the timestamp.
                refreshGetData(token);
            }, (Template.containerReloadAuto.interval.get() * 1000));
        });
    }
}

// reactive variables for this template

/**
 * Stores the timestamp (or some other randomised token) that specifies the current refresh thread (there could be
 * multiple). Every time something is changed and the refresh function needs to be re-executed, old threads executing
 * this function will terminate at the token check. Only the latest thread will stay alive and recursively invoke the
 * refresh again and again.
 *
 * @type {ReactiveVar}
 */
Template.containerReloadAuto.currentToken = new ReactiveVar();

/**
 * The reactive variable holding the latest API data.
 * @type {ReactiveVar}
 */
Template.containerReloadAuto.apiData = new ReactiveVar();

/**
 * The refresh interval in seconds. Default: 5 (seconds)
 * @type {ReactiveVar}
 */
Template.containerReloadAuto.interval = new ReactiveVar(5);

Template.containerReloadAuto.helpers({

    /**
     * Helper to retrieve the API data, will be executed every time, the API data is updated.
     * @returns {any}
     */
    getApiData: function() {
        // first invocation of the helper (or after reset from somewhere)
        if (Template.containerReloadAuto.apiData.get() === undefined) {
            // create token (timestamp)
            var ts = new Date().getTime();
            // store the token with the template
            Template.containerReloadAuto.currentToken.set(ts);
            // invoke the refresh with the correct token
            refreshGetData(ts);
        }

        // whenever apiData is set(), this will be executed (and refresh the UI)
        return Template.containerReloadAuto.apiData.get();
    },

    // just display the current interval as number (e.g. '5')
    currentReloadInterval: function() {
        return Template.containerReloadAuto.interval.get();
    }
});

Template.containerReloadAuto.events({

    /**
     * Whenever the range slider for the refresh interval is changed, this event will update the interval, stop other
     * refresh threads and create a new one (by using a new token)
     * @param e
     */
    'change #reload-interval': function(e) {
        e.preventDefault();
        // set new refresh interval
        Template.containerReloadAuto.interval.set(parseInt($('#reload-interval').val()));
        // set new token (will stop previous refresh(s))
        var ts = new Date().getTime();
        Template.containerReloadAuto.currentToken.set(ts);
        // trigger new refresh with the latest token
        refreshGetData(ts);
    }
});