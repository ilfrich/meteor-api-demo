/**
 * Created by Peter Ilfrich
 * Copyright (c) 2015 IBM Research. All rights reserved.
 *
 *
 */
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

// refresh the data if the currentToken matches the passed token
function refreshGetData(token) {
    if (token == Template.containerReloadAuto.currentToken.get()) {
        console.log("Retrieving auto-reload data with token " + token + ' and interval ' + Template.containerReloadAuto.interval.get() + ' seconds.');
        Meteor.call('simpleGetData', function(err, data) {
            Template.containerReloadAuto.apiData.set(data);
            setTimeout(function() {
                refreshGetData(token);
            }, (Template.containerReloadAuto.interval.get() * 1000));
        });
    }
}

// reactive variables for this template
Template.containerReloadAuto.currentToken = new ReactiveVar();
Template.containerReloadAuto.apiData = new ReactiveVar();
Template.containerReloadAuto.interval = new ReactiveVar(5);

Template.containerReloadAuto.helpers({

    getApiData: function() {
        if (Template.containerReloadAuto.apiData.get() === undefined) {
            // create token (timestamp)
            var ts = new Date().getTime();
            Template.containerReloadAuto.currentToken.set(ts);
            refreshGetData(ts);
        }

        // whenever apiData is set(), this will be executed (and refresh the UI)
        return Template.containerReloadAuto.apiData.get();
    },

    // just display the current interval
    currentReloadInterval: function() {
        return Template.containerReloadAuto.interval.get();
    }
});

Template.containerReloadAuto.events({
    'change #reload-interval': function(e) {
        e.preventDefault();
        // set new refresh interval
        Template.containerReloadAuto.interval.set(parseInt($('#reload-interval').val()));
        // set new token (will stop previous refresh)
        var ts = new Date().getTime();
        Template.containerReloadAuto.currentToken.set(ts);
        // trigger new refresh
        refreshGetData(ts);
    }
});