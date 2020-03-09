<?php

ajax.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
    	console.log(this.responseText);
    	var data = JSON.parse(this.responseText);
    	console.log(data);
    }
};

?>