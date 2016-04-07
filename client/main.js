import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './main.html';


Template.container.events({

    /**
     * This event is just responsible to tab between the examples (clicking the buttons on top)
     * @param e
     */
    'click button[data-open]': function(e) {
        e.preventDefault();
        $('button[data-open]').removeClass('active');
        let id = $(e.target).closest('button').addClass('active').attr('data-open');
        $('.tab-container').hide();
        $('#' + id).show();
    }
});