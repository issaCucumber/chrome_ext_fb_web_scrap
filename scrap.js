// $("#pages_name").append('Test');
//var elements = $("body").find(".userContentWrapper");
// for(var i = 0; i<elements.length; i++){
//	 var ele = $(elements[i]);
//	 ele.css("backgroundColor","green");
// }

var SECONDS_ONE_MINUTE 	= 60;
var SECONDS_ONE_HOUR	= 60 * SECONDS_ONE_MINUTE;
var SECONDS_ONE_DAY = 24 * SECONDS_ONE_HOUR;
var TIMEOUT = 1000;

var iterator = 4;
var discussion_threads = $("body").find(".mbm");
var skip = ["1114235818639123"];

//var requestedBytes = 1024*1024*10; // 10MB
//
//window.requestFileSystem  = window.requestFileSystem || window.webkitRequestFileSystem;
//
//function SaveDatFileBro(localstorage) {
//  localstorage.root.getFile("info.txt", {create: true}, function(DatFile) {
//    DatFile.createWriter(function(DatContent) {
//      var blob = new Blob(["Lorem Ipsum"], {type: "text/plain"});
//      DatContent.write(blob);
//      console.log(DatContent);
//    });
//  });
//}
//
//function onInitFs(fs) {
//  console.log('Opened file system: ' + fs.name);
//  
//  fs.root.getFile('log.txt', {create: true}, function(fileEntry) {
//
//	    // Create a FileWriter object for our FileEntry (log.txt).
//	    fileEntry.createWriter(function(fileWriter) {
//
//	      fileWriter.onwriteend = function(e) {
//	        console.log('Write completed.');
//	      };
//
//	      fileWriter.onerror = function(e) {
//	        console.log('Write failed: ' + e.toString());
//	      };
//
//	      // Create a new Blob and write it to log.txt.
//	      var blob = new Blob(['Lorem Ipsum'], {type: 'text/plain'});
//
//	      fileWriter.write(blob);
//
//	    }, errorHandler);
//
//	  }, errorHandler);
//}
//
//function errorHandler(e) {
//  var msg = '';
//
//  switch (e.code) {
//    case FileError.QUOTA_EXCEEDED_ERR:
//      msg = 'QUOTA_EXCEEDED_ERR';
//      break;
//    case FileError.NOT_FOUND_ERR:
//      msg = 'NOT_FOUND_ERR';
//      break;
//    case FileError.SECURITY_ERR:
//      msg = 'SECURITY_ERR';
//      break;
//    case FileError.INVALID_MODIFICATION_ERR:
//      msg = 'INVALID_MODIFICATION_ERR';
//      break;
//    case FileError.INVALID_STATE_ERR:
//      msg = 'INVALID_STATE_ERR';
//      break;
//    default:
//      msg = 'Unknown Error';
//      break;
//  };
//
//  alert('Error: ' + msg);
//}
//
//
////window.requestFileSystem(window.TEMPORARY, 5*1024*1024 /*5MB*/, onInitFs, errorHandler);
//
//navigator.webkitPersistentStorage.requestQuota (
//    requestedBytes, function(grantedBytes) {
//        window.requestFileSystem(PERSISTENT, grantedBytes, onInitFs, errorHandler);
//    }, function(e) { console.log('Error', e); }
//);










//function saveContentToFile(content){
//	fileEntry.createWriter(function(fileWriter) {
//
//	      var truncated = false;
//	      var blob = new Blob([contents]);
//
//	      fileWriter.onwriteend = function(e) {
//	        if (!truncated) {
//	          truncated = true;
//	          // You need to explicitly set the file size to truncate
//	          // any content that might have been there before
//	          this.truncate(blob.size);
//	          return;
//	        }
//	       // console.log('Export to '+fileDisplayPath+' completed');
//	      };
//
//	      fileWriter.onerror = function(e) {
//	    	console.log('Export failed: '+e.toString());
//	      };
//
//	      fileWriter.write(blob);
//
//	});
//}

function extractData(i){
	if(i >= discussion_threads.length) return;
	
	var thread = discussion_threads[i];
	var thread_obj = $(thread);
	var postIdJson = JSON.parse(thread_obj.attr("data-ft"));
	var post_id 	= postIdJson["tl_objid"];
	
	if($.inArray(post_id, skip) >= 0){
		extractData(iterator++);
	}
	
	var post = thread_obj.find(".userContentWrapper")[0];
	
	var thread = new ProcessThread(post, post_id);
	
	if(thread){
		thread.expandAllComments();
	}else{
		extractData(iterator++);
	}
	
}

extractData(iterator);