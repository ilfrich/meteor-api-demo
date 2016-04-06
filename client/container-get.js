/**
 * Created by Peter Ilfrich
 * Copyright (c) 2015 IBM Research. All rights reserved.
 *
 *
 */
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

function refreshGetData() {
    console.log('Retrieving simpleGetData');
    Meteor.call('simpleGetData', function(err, data) {
        Template.containerGet.apiData.set(data);
    });
}

Template.containerGet.apiData = new ReactiveVar();

Template.containerGet.helpers({

    getApiData: function() {
        if (Template.containerGet.apiData.get() === undefined) {
            refreshGetData();
        }
        return Template.containerGet.apiData.get();
    }
});