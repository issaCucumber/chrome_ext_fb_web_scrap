/**
 * 
 */

var SECONDS_ONE_MINUTE 	= 60;
var SECONDS_ONE_HOUR	= 60 * SECONDS_ONE_MINUTE;
var SECONDS_ONE_DAY = 24 * SECONDS_ONE_HOUR;
var TIMEOUT = 1000;

var iterator = 12;
var discussion_threads = $("body").find(".mbm");

function extractData(i){
	if(i >= discussion_threads.length) return;
	
	var thread = discussion_threads[i];
	var thread_obj = $(thread);
	//var postIdJson = JSON.parse(thread_obj.attr("data-ft"));
	var post_id 	= $($(thread).find("input[name=ft_ent_identifier]")[0]).val();
	
	var post = thread_obj.find(".userContentWrapper")[0];
	
	var processthread = new ProcessThread(post, post_id);
	
	if(processthread){
		processthread.showComments();
	}else{
		extractData(iterator++);
	}
	
}

extractData(iterator);