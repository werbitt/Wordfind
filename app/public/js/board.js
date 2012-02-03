'use strict';

var wfB = {
	'config' : {
		'$bw' : $('#board-wrapper'),
		'path' : window.location.href,
		'host' : window.location.hostname
	},

	'init' : function () {
		wfB.$bw = wfB.config.$bw;
		wfB.$bw.load(wfB.config.path + '/board', function () {
			$.getScript('/js/wordfind.js');
			//wf.init();
		});
	}
};

$(document).ready(wfB.init);
