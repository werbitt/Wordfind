'use strict';
var wl = {
    'init' : function () {
        wl.$wordFields = $('#new .input_word');
        wl.numFields = wl.$wordFields.size();
        wl.$wordFields.bind('focus', wl.addWordField);
    },
    
    'addWordField' : function (e) {
            var $target = $(e.currentTarget);
            var id = $target.attr("id");
            var match = /word(\d+)/.exec(id);
            var num = match[1];
            var $form = $('form');
             
            if (num == wl.numFields) {
                var newId = 'word' + (parseInt(num) + 1);
                var html = $target.parent().html();
                var fieldHtml = "<div class = 'word'>" +
                                    "<div class='label'>" +
                                         "<label for='" + newId + "'></label>" +
                                     "</div>" +
                                     "<input class='input_word' id='" + newId + "' name='post[" + newId +"]' type='text' />" +
                                     "<br />" +
                                 "</div>";
                //$form.append(fieldHtml);
                $target.closest(".word").after(fieldHtml);
                wl.$wordFields.unbind;
                wl.$wordFields = $('#new .input_word');
                wl.$wordFields.bind('focus', wl.addWordField);
                wl.numFields ++;
            }
        }
};

$(document).ready(wl.init);
