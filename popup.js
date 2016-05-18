// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.


function scrap(e) {
  chrome.tabs.executeScript(null,{ file: "scrap.js" });
  window.close();
}

function count(e) {
  chrome.tabs.executeScript(null,{ file: "count.js" });
  window.close();
}

function scrap_wall(e) {
  chrome.tabs.executeScript(null,{ file: "scrap_wall.js" });
  window.close();
}

document.addEventListener('DOMContentLoaded', function () {
  var divs = document.querySelectorAll('div');
  for (var i = 0; i < divs.length; i++) {
	 if(divs[i].id == "extract"){
		 divs[i].addEventListener('click', scrap);
	 }else if(divs[i].id == "count"){
		 divs[i].addEventListener('click', count);
	 }else if(divs[i].id == "extract_wall"){
		 divs[i].addEventListener('click', scrap_wall);
	 }
    
  }
});