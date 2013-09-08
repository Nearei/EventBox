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
		{colour:"#DBDBDB"},
		{colour:"#DBDBDB"},
		{colour:"#DBDBDB"},
		{colour:"#DBDBDB"},
		{colour:"#DBDBDB"},
		{colour:"#DBDBDB"},
		{colour:"#DBDBDB"}
	]};

	var pollresponse = getPollResponse();
	pollresponse = pollresponse.selections;
	var pollName = pollresponse[0].name;
	var pollTotal = pollresponse[0].votes;
	var html = "";
	var top=0;
	for (var i=1;i<pollresponse.length;i++){
		if (top<pollresponse[i].votes){
			top=pollresponse[i].votes;
		}
	}
	for (var i=1;i<pollresponse.length;i++){
		html+='<div style="background-color:'+colours.colours[i].colour+';width:'+((pollresponse[i].votes/top)*100)+'%;height:7%;overflow:visible"><div style="width:300px">'+pollresponse[i].name+'</div></div>';
	}
		
	document.getElementById("poll-1").innerHTML = html;
	document.getElementById("poll-2").innerHTML = html;
	document.getElementById("poll-3").innerHTML = html;

	document.getElementById("poll-title-1").innerHTML = pollresponse[0].name;
	document.getElementById("poll-title-2").innerHTML = pollresponse[0].name;
	document.getElementById("poll-title-3").innerHTML = pollresponse[0].name;

}

pollrefresh();