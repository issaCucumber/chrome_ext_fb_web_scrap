function ProcessThread(post, post_id){
	
	this.postDOMEle = post;
	this.json = [];
	this.post_obj 	= {};
	this.post_count 	= 0;
	this.post_id = post_id;
	this.comment_count = 0;
	this.total_comments = total_comments;
	this.replies_count  = 0;
	this.replies_load_try = 0;
	
	
	var last_comment_component = $(this.postDOMEle).find(".UFILastCommentComponent span.UFIPagerCount")[0];
	
	if($(last_comment_component).text() == ""){
		return false;
	}
	
	var comment_component 	= $(last_comment_component).text().split(" ");
	var total_comments  	= parseInt(comment_component[2].replace(",", ""));
	
	return true;
	
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
		analysePost(this.postDOMEle, this.post_id);
	}else{
		var loadmore = findElements[0];
		var evt = document.createEvent("Event");
		evt.initEvent('click', true, true);
		loadmore.dispatchEvent(evt);
		setTimeout(function(){ 
			that.expandAllSeeMore(that.postDOMEle);
		}, TIMEOUT);
	}
	
	
}

ProcessThread.prototype.expandAllComments = function(){
	
	
	console.log("Extracting ... " + this.post_id);
	var that = this;
	if(this.comment_count == this.total_comments){
		this.replies_count = 0;
		this.expandAllReplies(this.postDOMEle);
	}else{
		var c_count = getCommentCount(this.postDOMEle);
		
		if(!c_count){
			console.log(this.post_id + " comments count :: " + this.comment_count + " / " + this.total_comments);
			replies_count = 0;
			this.expandAllReplies(this.postDOMEle);
		}else{
			if(c_count == this.comment_count){
				setTimeout(function(){ 
					that.expandAllComments(that.postDOMEle);
				}, TIMEOUT);
				
			}else{
				
				this.comment_count = c_count;
				var findElements = $(that.postDOMEle).find("a.UFIPagerLink");
				if(findElements.length == 0){
					this.expandAllReplies(this.postDOMEle);
				}else{
					var loadmore = findElements[0];
					var evt = document.createEvent("MouseEvents");
					evt.initMouseEvent("click", true, true, window,
					  0, 0, 0, 0, 0, false, false, false, false, 0, null);
					loadmore.dispatchEvent(evt);
					setTimeout(function(){ 
						that.expandAllComments(that.postDOMEle);
					}, TIMEOUT);
				}
			}
			
		}
		
	}
}

