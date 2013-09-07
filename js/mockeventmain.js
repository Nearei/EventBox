var response = 
{
	events : [
		{
			name: 'Dancing with the Stars',
			hostname: 'Bill Nye',
			hostid: '38457270',
			id: '00001',
			time: '11:30:00',
			date: 'September 13, 2013',
			loc: {
				lat: 43.451603,
				lon: -80.492277,
				name: 'Google Waterloo'
			},
			picture: '/img/event1.jpg'
		},
		{
			name: 'Tim\'s surprise birthday party',
			hostname: 'Tim Pei',
			hostid: '1038958394',
			id: '00002',
			time: '18:00:00',
			date: 'Setember 15, 2013',
			loc: {
				lat: 43.470666,
				lon: -80.545321,
				name: 'V1 Field'
			},
			picture: '/img/event2.jpg'
		},
		{
			name: 'First Day of School',
			hostname: 'Kevin Jeong',
			hostid: '10101010',
			id: '00003',
			time: '08:00:00',
			date: 'September 6, 2013',
			loc: {
				lat: 43.470643,
				lon: -80.545300,
				name: 'Where-ever'
			},
			picture: '/img/event3.jpg'
		},
		{
			name: 'Poop Event',
			hostname: 'Kevin Jeong',
			hostid: '10101010',
			id: '00003',
			time: '18:40:00',
			date: 'September 10, 2013',
			loc: {
				lat: 43.470638,
				lon: -80.545284,
				name: 'Notebook'
			},
			picture: '/img/event4.jpg'
		}
	]
};

function getResponse(){
	return response;
}
