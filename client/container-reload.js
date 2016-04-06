/**
 * Created by Peter Ilfrich
 * Copyright (c) 2015 IBM Research. All rights reserved.
 *
 *
 */
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

function refreshGetData() {
    console.log('Reloading data on demand.');
    Meteor.call('simpleGetData', function(err, data) {
        Template.containerReload.apiData.set(data);
    });
}

Template.containerReload.apiData = new ReactiveVar();

Template.containerReload.helpers({

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
    'click #reload-data': function(e) {
        e.preventDefault();
        refreshGetData();
    }
});