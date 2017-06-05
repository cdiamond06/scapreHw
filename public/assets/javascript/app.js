$("#savearticle").on("click", function(){

	var thisId = $(this).attr("data-id");

	$.ajax({
		method: "POST",
		url: "/saved/" + thisId
	}).then(function(data){
		console.log("line 9 app.js" , data);

	})
})

$("#deletearticle").on("click", function(){

	var thisId = $(this).attr("data-id");

	$.ajax({
		method: "POST",
		url: "/delete/" + thisId
	}).then(function(data){
		console.log("line 9 app.js" , data);

	})
})