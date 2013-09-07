var response = getResponse();
var eventlist = response.events;
var countrow = 1;
var countcol = 1;

for (var i = 0;i<eventlist.length;i++){
	html = '<div style="padding:3px 3px 3px 3px" class="flip-container" ontouchstart="this.classList.toggle(\'hover\');">'
	html += '<div style="height:80%;width:90%" class="flipper">';
	html += '<div class="front" style="background-color:#60B9CE;height:100%; width:100%; overflow:hidden">';
	html += '<div style="height:80%;width:90%;overflow:hidden;text-align:center">';
	html += '<img src="'+eventlist[i].picture+'" alt="'+eventlist[i].name+'" height="100" width="300">';
	html += '</div><p>'+eventlist[i].name+'</p></div>';
	html += '<div class="back" style="background-color:#60B9CE;height:100%; width:100%; overflow:hidden">';
	html += '<p>Name:'+eventlist[i].name+'<br/>Host: '+eventlist[i].hostname+'<br/>Time: '+eventlist[i].time+'<br/>Date: '+eventlist[i].date+'<br/> Place: '+eventlist[i].loc.name+'</p>';
	html += '</div></div></div>';
	
	$(".gridster ul").gridster().data('gridster').add_widget(html,1,1,countcol,countrow);
	if (countcol!=3){
		countcol++;
	} else {
		countcol=1;
		countrow++;
	}
}