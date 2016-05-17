/**
 * XMLEncoder.js
 */
var parser, xmlDoc;
var baseXml = "<?xml version=\"1.0\" encoding=\"UTF-8\"?><body></body>";

var TIMESTAMP_FORMAT = "YYYY-MM-DD HH:mm:ss dddd Z"

/**
 * XML pretty print
 * code extracted: https://gist.github.com/sente/1083506
 */
function formatXml(xml) {
    var formatted = '';
    var reg = /(>)(<)(\/*)/g;
    xml = xml.replace(reg, '$1\r\n$2$3');
    var pad = 0;
    jQuery.each(xml.split('\r\n'), function(index, node) {
        var indent = 0;
        if (node.match( /.+<\/\w[^>]*>$/ )) {
            indent = 0;
        } else if (node.match( /^<\/\w/ )) {
            if (pad != 0) {
                pad -= 1;
            }
        } else if (node.match( /^<\w[^>]*[^\/]>.*$/ )) {
            indent = 1;
        } else {
            indent = 0;
        }

        var padding = '';
        for (var i = 0; i < pad; i++) {
            padding += '  ';
        }

        formatted += padding + node + '\r\n';
        pad += indent;
    });

    return formatted;
}
/**
 * end extraction
 */

function XMLEncoder(json){
	
	parser = new DOMParser();
	xmlDoc = parser.parseFromString(baseXml,"text/xml");
	
	var node = xmlDoc.getElementsByTagName("body")[0];
	addPostToNode(json, node);
	//add extract time now node
	node.appendChild(generateTimestampNode());
	return formatXml(new XMLSerializer().serializeToString(xmlDoc));
}

function generateTimestampNode(unixtime){
	if(unixtime == undefined){
		//timenow
		var extractTime 		= xmlDoc.createElement("extractTimestamp");
		
		var unixTimeNode		= xmlDoc.createElement("unix");
		var unixTimestamp 		= xmlDoc.createTextNode(moment().unix());
		unixTimeNode.appendChild(unixTimestamp);
		
		var browserTimeNode		= xmlDoc.createElement("browser");
		var browserTimestamp 	= xmlDoc.createTextNode(moment().format(TIMESTAMP_FORMAT));
		browserTimeNode.appendChild(browserTimestamp);
		
		extractTime.appendChild(unixTimeNode);
		extractTime.appendChild(browserTimeNode);
		
		return extractTime;
	}
	
	//post timestamp
	var newTimestampNode	= xmlDoc.createElement("timestamp");
	var unixTimeNode		= xmlDoc.createElement("unix");
	var unixTimestamp 		= xmlDoc.createTextNode(unixtime);
	unixTimeNode.appendChild(unixTimestamp);
	
	var browserTimeNode		= xmlDoc.createElement("browser");
	var browserTimestamp 	= xmlDoc.createTextNode(moment.unix(unixtime).format(TIMESTAMP_FORMAT));
	browserTimeNode.appendChild(browserTimestamp);
	
	newTimestampNode.appendChild(unixTimeNode);
	newTimestampNode.appendChild(browserTimeNode);
	
	return newTimestampNode;
	
}

function addPostToNode(array, node){
	if(array == undefined || array.length == 0) {
		return;
	}
	
	$.each(array, function(i, _post){
		var newPostEle 			= xmlDoc.createElement("post");
		
		newPostEle.setAttribute("id", _post["id"]);       // Create attribute
		newPostEle.setAttribute("replyto", _post["replyto"]);       // Create attribute
		
		var newContentNode		= xmlDoc.createElement("content");
		var newContent 			= xmlDoc.createTextNode(_post["content"]);
		newContentNode.appendChild(newContent);
		
		var newAuthorNode		= xmlDoc.createElement("author");
		var newAuthor 			= xmlDoc.createTextNode(_post["author"]);
		newAuthorNode.appendChild(newAuthor);
		
		var newTimestampNode	= generateTimestampNode(_post["timestamp"]);
		
		var newReactionCountNode	= xmlDoc.createElement("reaction");
		var newCount 				= xmlDoc.createTextNode(_post["count"]);
		newReactionCountNode.appendChild(newCount);
		
		var commentsNode			= xmlDoc.createElement("comments");
		addPostToNode(_post["comments"], commentsNode);
		
		var timeElapsedNode			= xmlDoc.createElement("timeElapsed");
		timeElapsedNode.setAttribute("day", _post["timeElapsed"].day);
		timeElapsedNode.setAttribute("hour", _post["timeElapsed"].hour);
		timeElapsedNode.setAttribute("minute", _post["timeElapsed"].minute);
		timeElapsedNode.setAttribute("second", _post["timeElapsed"].second);
		
		newPostEle.appendChild(newContentNode);
		newPostEle.appendChild(newAuthorNode);
		newPostEle.appendChild(newTimestampNode);
		newPostEle.appendChild(newReactionCountNode);
		newPostEle.appendChild(commentsNode);
		newPostEle.appendChild(timeElapsedNode);
		
		node.appendChild(newPostEle);
	});
	
}