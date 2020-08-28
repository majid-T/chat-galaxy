$(function(){
	const tableHeader = $('#tableHeader');
	const tableContent = $('#tableContent');
	let currentView = '';
    let socket = io.connect();
    const eventsHeader = '<tr><th scope="col">#</th><th scope="col">EVENT</th><th scope="col">OWNER</th><th scope="col">DESC</th><th scope="col">DATE</th><th scope="col">DB ID</th><th scope="col">SOCKET ID</th></tr>';
    const chatHeader = '<tr><th scope="col">#</th><th scope="col">USERNAME</th><th scope="col">MESSAGE</th><th scope="col">ROOM</th><th scope="col">DATE</th><th scope="col">DB ID</th><th scope="col">SOCKET ID</th></tr>';


    //enabling tool tip bootstrap
     $('[data-toggle="tooltip"]').tooltip();

    //loading all events by default
	socket.emit('getAllEvents');
	$('#getAllEvents').hide();
	currentView = 'getAllEvents';



    // get specific room
    $(".logLink").click((e)=>{
        tableHeader.empty();
        tableContent.empty();

    	// tableContent.children('tr').remove();
	   	socket.emit('getChatsForRoom',{room:e.target.id});
    });

    //get all messages
    $('#getAllChats').click(()=>{
    	socket.emit('getAllChats');
        tableHeader.empty();
        tableContent.empty();
    });

    //get all events
    $('#getAllEvents').click(()=>{
    	socket.emit('getAllEvents');
        tableHeader.empty();
        tableContent.empty();
    });

    //listeners for events
    //for all chats
	socket.on('allChats',(data)=>{
		let jsonData = JSON.parse(data);
		let counter = 1;
        tableHeader.append(chatHeader);
		for(item of jsonData){
			let st1 = `<tr><th scope="row">${counter++}</th><td>${item.chatUsername}</td>
			<td>${item.chatMessage}</td><td>${item.chatRoom}</td><td>${item.chatDate}</td>
			<td>${item.chatId}</td><td>${item.socketId}</td></tr>`;
			tableContent.append(st1);
		}

		$(`#${currentView}`).show();
		$('#getAllChats').hide();
		currentView = 'getAllChats';
	});

	//for all events
	socket.on('allEvents',(data)=>{
		let jsonData = JSON.parse(data);
		let counter = 1;
        tableHeader.append(eventsHeader);
		for(item of jsonData){
			let st1 = `<tr><th scope="row">${counter++}</th><td>${item.eventName}</td>
			<td>${item.eventOwner}</td><td>${item.eventDesc}</td><td>${item.eventDate}</td>
			<td>${item.eventId}</td><td>${item.socketId}</td></tr>`;
			tableContent.append(st1);
		}

		$(`#${currentView}`).show();
		$('#getAllEvents').hide();
		currentView = 'getAllEvents';
	});
});
