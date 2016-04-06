import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './main.html';
import './container-get.js';


Template.container.events({
    'click button[data-open]': function(e) {
        e.preventDefault();
        $('button[data-open]').removeClass('active');
        let id = $(e.target).closest('button').addClass('active').attr('data-open');
        $('.tab-container').hide();
        $('#' + id).show();
    }
});