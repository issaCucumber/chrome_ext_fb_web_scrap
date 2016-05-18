function ProcessThread(post, post_id){
	
	this.postDOMEle = post;
	this.json = [];
	this.post_obj 	= {};
	this.post_count 	= 0;
	this.post_id = post_id;
	this.comment_count = 0;
	this.total_comments = 0;
	this.replies_count  = 0;
	this.replies_load_try = 0;
	
	
	var last_comment_component = $(this.postDOMEle).find("span.UFIPagerCount");
	
	if(last_comment_component.length == 0){
		this.total_comments = false;
	}else{
		last_comment_component = last_comment_component[0];
		if($(last_comment_component).text() == ""){
			this.total_comments = false;
			return false;
		}
		
		var comment_component 	= $(last_comment_component).text().split(" ");
		this.total_comments  	= parseInt(comment_component[2].replace(",", ""));
	}
	
	
	return true;
	
}

ProcessThread.prototype.getCommentCount = function(){
	var last_comment_component = $(this.postDOMEle).find("span.UFIPagerCount");
	
	if(last_comment_component.length == 0){
		this.total_comments = false;
	}else{
		last_comment_component = last_comment_component[0];
		if($(last_comment_component).text() == ""){
			this.total_comments = false;
			return false;
		}
		
		var comment_component 	= $(last_comment_component).text().split(" ");
		this.total_comments  	= parseInt(comment_component[2].replace(",", ""));
	}
}

ProcessThread.prototype.expandAllReplies = function(){
	var findElements = findAllRepliesButtons(this.postDOMEle);
	var r_count = findElements.length;
	var that 	= this;
	
	console.log("loading comments from " + this.post_id + " " + r_count);
	
	if(r_count == 0){
		this.expandAllSeeMore();
	}else{
		if(this.replies_count != r_count){
			
			this.replies_count = r_count;
			var loadmore = findElements[0];
			
			var evt = document.createEvent("Event");
			evt.initEvent('click', true, true);
			loadmore.dispatchEvent(evt);
			setTimeout(function(){ 
				that.expandAllReplies();
			}, TIMEOUT);
		}else{
			setTimeout(function(){ 
				that.expandAllReplies();
			}, TIMEOUT);
		}
		
	}
};

ProcessThread.prototype.expandAllSeeMore = function(){
	
	var findElements = findAllSeeMoreLink(this.postDOMEle);
	var that = this;
	
	if(findElements.length == 0){
		analysePost(this.postDOMEle, this.post_obj, this.post_id);
	}else{
		var loadmore = findElements[0];
		var evt = document.createEvent("Event");
		evt.initEvent('click', true, true);
		loadmore.dispatchEvent(evt);
		setTimeout(function(){ 
			that.expandAllSeeMore();
		}, TIMEOUT);
	}
	
}

ProcessThread.prototype.showComments = function(){
	
	var that = this;
	var findElements = $(this.postDOMEle).find("a._ipm");
	if(findElements.length <= 0){
		extractData(iterator++);
		return false;
	}
	
	var loadmore = findElements[0];
	var evt = document.createEvent("MouseEvents");
	evt.initMouseEvent("click", true, true, window,
	  0, 0, 0, 0, 0, false, false, false, false, 0, null);
	loadmore.dispatchEvent(evt);
	setTimeout(function(){ 
		that.replies_load_try = 0;
		that.getCommentCount();
		that.expandAllComments();
	}, TIMEOUT);
	
}

ProcessThread.prototype.expandAllComments = function(){
	
	if(this.total_comments != false){
		console.log("Extracting comments for post ... " + this.post_id + " " + this.comment_count + "/" + this.total_comments);
	}else{
		console.log("Extracting comments for post ... " + this.post_id);
	}
	
	if(this.replies_load_try >= 10){
		this.replies_count = 0;
		this.expandAllReplies();
	}
	
	var that = this;
	if(this.total_comments !== false && this.comment_count == this.total_comments){
		this.replies_count = 0;
		this.expandAllReplies();
	}else{
		var c_count = getCommentCount(this.postDOMEle);
		var findElements = $(that.postDOMEle).find("a.UFIPagerLink");
		if(!c_count){
			if(findElements.length == 0){
				this.replies_count = 0;
				this.expandAllReplies();
			}else{
				this.replies_load_try = 0;
				var loadmore = findElements[0];
				var evt = document.createEvent("MouseEvents");
				evt.initMouseEvent("click", true, true, window,
				  0, 0, 0, 0, 0, false, false, false, false, 0, null);
				loadmore.dispatchEvent(evt);
				setTimeout(function(){ 
					that.expandAllComments();
				}, TIMEOUT);
			}
		}else{
			if(c_count == this.comment_count){
				this.replies_load_try++;
				setTimeout(function(){ 
					that.expandAllComments();
				}, TIMEOUT);
				
			}else{
				this.replies_load_try = 0;
				this.comment_count = c_count;
				if(findElements.length == 0){
					console.log(this.post_id + " comments count :: " + this.comment_count + " / " + this.total_comments);
					this.replies_count = 0;
					this.expandAllReplies(this.postDOMEle);
				}else{
					var loadmore = findElements[0];
					var evt = document.createEvent("MouseEvents");
					evt.initMouseEvent("click", true, true, window,
					  0, 0, 0, 0, 0, false, false, false, false, 0, null);
					loadmore.dispatchEvent(evt);
					setTimeout(function(){ 
						that.expandAllComments();
					}, TIMEOUT);
				}
			}
			
		}
		
	}
}

