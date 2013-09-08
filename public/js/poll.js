var mockdata = {
	selections:[
		{
			name: "Locations",
			votes: 30
		},{
			name: "Kenzo Ramen",
			votes: 15
		},{
			name: "Mr. Sushi",
			votes: 8
		},{
			name: "McGinnis",
			votes: 2
		}, {
			name: "The Cabin",
			votes: 5
		}
	]
};
function getPollResponse (){
	return mockdata;
}


function pollrefresh(){
	var colours = {colours:[
		{},
		{colour:"#FFC973"},
		{colour:"#5DC8CD"},
		{colour:"#C7F66F"},
		{colour:"#A767D5"},
		{colour:"#B637C5"},
		{colour:"#C7F66F"},
		{colour:"#5DC8CD"}
	]};

	var pollresponse = getPollResponse();
	pollresponse = pollresponse.selections;
	var pollName = pollresponse[0].name;
	var pollTotal = pollresponse[0].votes;
	var html = "";
	for (var i=1;i<pollresponse.length;i++){
		html+='<div style="background-color:'+colours.colours[i].colour+';width:'+((pollresponse[i].votes/pollresponse[0].votes)*100)+'%;height:7%">'+pollresponse[i].name+'</div>';
	}
	document.getElementById("poll-1").innerHTML = html;
	document.getElementById("poll-2").innerHTML = html;
	document.getElementById("poll-3").innerHTML = html;

	document.getElementById("poll-title-1").innerHTML = pollresponse[0].name;
	document.getElementById("poll-title-2").innerHTML = pollresponse[0].name;
	document.getElementById("poll-title-3").innerHTML = pollresponse[0].name;

}

pollrefresh();