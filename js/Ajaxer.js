var Ajaxer = new Ajaxer();
function Ajaxer(){


	this.getRequest = function() {
		var request;
		if (window.XMLHttpRequest){
			// code for IE7+, Firefox, Chrome, Opera, Safari
			request = new XMLHttpRequest();
		}else{
			// code for IE6, IE5
			request = new ActiveXObject("Microsoft.XMLHTTP");
		}
		return request;
	}
	this.get = function(url, onComplete){
		var request = this.getRequest();
		request.onreadystatechange = function(){
			if (request.readyState == 4 && request.status == 200){
				onComplete(request.responseText);
			}
		}
		request.open("GET", url, true);
		request.send();
	}
	this.post = function(url, dataObject, onComplete){
		var request = this.getRequest();
		request.onreadystatechange = function(){
			if (request.readyState == 4 && request.status==200){
				onComplete(request.responseText);
			}
		}
		var queryString = "";
		for(var i in dataObject) {
			queryString += i + "=" + dataObject[i] +  "&";

		}
		request.open("POST",url ,true);
		request.setRequestHeader("Content-type","application/x-www-form-urlencoded");
		request.send(queryString);
	}

} 