$(document).on("click", "#savearticle", function(){

	var thisId = $(this).attr("data-id");

	$.ajax({
		method: "POST",
		url: "/saved/" + thisId
	}).then(function(data){
		console.log("line 9 app.js" , data);

	})
})

$(document).on("click", "#deletearticle", function(){

	var thisId = $(this).attr("data-id");

	$.ajax({
		method: "POST",
		url: "/delete/" + thisId
	}).then(function(data){
		console.log("line 9 app.js" , data);

	})
})

$(document).on("click", "#addNote", function(){

	var thisId = $(this).attr("data-id");

	$.ajax({
		method: "POST",
		url: "/notes/" + thisId,
		data: {
			body: $("#bodyinput").val()
		}
	}).done(function(data){
		console.log("line 38 app.js" , data);

	})
})

$(document).on("click", "#deleteNote", function(){

	var thisId = $(this).attr("data-id");

	$.ajax({
		method: "DELETE",
		url: "/delete/" + thisId,
		
	}).done(function(data){
		console.log("line 51 app.js" , data);

	})
})




