function stripToText(html){
	var $ele = $(html);
	var text = "";
	var $children = $ele.contents().filter(function( index ) {
		if($(this).context.nodeName == "#text"){
			return text += $(this)[0].data + " ";
		}else if($(this).context.nodeName == "A" || $(this).context.nodeName == "P" || $(this).context.nodeName == "SPAN"){
			return text += $(this)[0].innerText + " "
		}else{
			return "";
		}
	    
	  });
	
	return text;
	
}

function findAllRepliesButtons(postDOMElement){
	var replies_divs = $(postDOMElement).find("div.UFIReplyList span.UFIReplySocialSentenceLinkText");
	var all_replies  = [];
	$.each(replies_divs, function(i, r_div){
		if($(r_div).text().startsWith("Hide")){
			return;
		}
		
		all_replies.push(r_div);
	});
	
	var view_more_divs = $(postDOMElement).find("div.UFIReplyList a.UFIPagerLink");
	$.each(view_more_divs, function(i, v_div){
		all_replies.push(v_div);
	});
	
	return all_replies;
	
}

function findAllSeeMoreLink(postDOMElement){
	var allSeeMoreLinks = [];
	var findElements = $(postDOMElement).find("span.UFICommentBody a");
	
	$.each(findElements, function(i, ele){
		if($(ele).text().includes("See more")){
			allSeeMoreLinks.push(ele);
		}
	});
	
	return allSeeMoreLinks;
}

function parseDiff(seconds){
	var timeDiff = {
		day 	: 0,
		hour 	: 0,
		minute 	: 0,
		second 	: 0
	};
	
	if(seconds == undefined){
		return timeDiff;
	}
	
	var days = Math.floor(seconds / SECONDS_ONE_DAY);
	if(days > 0){
		timeDiff.day = days;
	}
	
	seconds = seconds % SECONDS_ONE_DAY;
	
	var hours = Math.floor(seconds / SECONDS_ONE_HOUR);
	if(hours > 0){
		timeDiff.hour = hours;
	}
	
	seconds = seconds % SECONDS_ONE_HOUR;
	
	var minutes = Math.floor(seconds / SECONDS_ONE_MINUTE);
	if(minutes > 0){
		timeDiff.minute = minutes;
	}
	
	timeDiff.second = seconds % SECONDS_ONE_MINUTE;
	
	return timeDiff;
}

function analysePost(postDOMElement, post_id){
	
	var $post    = $(postDOMElement);
	post_obj["id"]				= post_count;
	post_obj["replyto"]			= "null"	; //parent post
	post_obj["content"] 		= stripToText($($post.find(".userContent")[0]).html());
	post_obj["count"] 			= $($post.find(".UFILikeSentence span[data-hover=tooltip]")[0]).text();
	post_obj["author"] 			= $($post.find("h5 a")[0]).text();
	post_obj["timestamp"]		= $($post.find("abbr")[0]).attr("data-utime");
	post_obj["comments"] 		= [];
	post_obj["timeElapsed"]     = parseDiff();

	//find all comments for this post
	var comment_elements = $post.find(".UFIComment");
	var current_comment  = null;
	var replies			 = [];
	$.each(comment_elements, function(i, c_ele){
		
		var $child_obj = $(c_ele);
		
		//determine if this is a comment or reply
		if($child_obj.attr("aria-label").match(/reply/i)){ //reply
			
			post_count++;
			var p_obj = {};
			p_obj["id"]				= post_count;
			p_obj["replyto"]		= current_comment["id"]	; //parent post
			p_obj["author"] 		= $($child_obj.find("a.UFICommentActorName")[0]).text();
			p_obj["content"] 		= stripToText($($child_obj.find("span.UFICommentBody")[0]).html());
			p_obj["count"] 			= $($child_obj.find("a.UFICommentLikeButton span")).text();
			p_obj["timestamp"]  	= $($child_obj.find("abbr.livetimestamp")).attr("data-utime");
			p_obj["timeElapsed"]	= parseDiff(p_obj["timestamp"]-post_obj["timestamp"]);
			
			replies.push(p_obj);
		}else{ //comment
			if(current_comment != null){
				current_comment["comments"] = replies;
				post_obj["comments"].push(current_comment);
			}
			
			replies = [];
			current_comment = {};
			post_count++;
			
			current_comment["id"]			= post_count;
			current_comment["replyto"]		= post_obj["id"]	; //parent post
			current_comment["author"] 		= $($child_obj.find("a.UFICommentActorName")[0]).text();
			current_comment["content"] 		= stripToText($($child_obj.find("span.UFICommentBody")[0]).html());
			current_comment["count"] 		= $($child_obj.find("a.UFICommentLikeButton span")).text();
			current_comment["timestamp"]  	= $($child_obj.find("abbr.livetimestamp")).attr("data-utime");
			current_comment["timeElapsed"]	= parseDiff(current_comment["timestamp"]-post_obj["timestamp"]);
		}
	});
	
	if(current_comment != null){
		current_comment["comments"] = replies;
		post_obj["comments"].push(current_comment);
	}
	
	json.push(post_obj);
	//data.push(json);
	//saveContentToFile(json);
	
	var uri = XMLEncoder(json);
//	uri = 'data:text/plain,' + window.encodeURIComponent(uri); // to data URI
//	var win = window.open(uri, postId+'.xml');
	
	download(post_id+'.xml', uri);
	extractData(iterator++);
}

function download(filename, text) {
    var pom = document.createElement('a');
    pom.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    pom.setAttribute('download', filename);

    if (document.createEvent) {
        var event = document.createEvent('MouseEvents');
        event.initEvent('click', true, true);
        pom.dispatchEvent(event);
    }
    else {
        pom.click();
    }
}

function getCommentCount(postDOMEle){
	var last_comment_component = $(postDOMEle).find(".UFILastCommentComponent span.UFIPagerCount");
	
	if(last_comment_component.length == 0){
		return false;
	}
	
	var comment_component 	   = $(last_comment_component[0]).text().split(" ");
	
	return parseInt(comment_component[0].replace(",", ""));
}