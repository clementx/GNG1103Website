var mapHide = [{
		"stylers": [{
			"gamma": 3
		}]
	}];
	var mapShow = [{
		"stylers": [{
			"gamma": 1
		}]
	}];
	var map;

	function load() {
		var orderList = document.getElementById("order_list_content");
		orderList.innerHTML = "";
		for (var i = 0; i < 20; i++) {
			var order = document.createElement("li");
			
			if (i < 3) {
				order.style.background = "#ffa099";
			}
			else if (i < 8) {
				order.style.background = "#e7e874";
			}
			else
				order.style.background = "#89e687";
				
			order.appendChild(document.createTextNode("Order# "));
			order.appendChild(document.createTextNode(139234+i));			
			order.appendChild(document.createElement("br"));
			order.appendChild(document.createTextNode("22/03/2021"));
			order.setAttribute("onclick","showOrder(" + i + ")");
			orderList.appendChild(order);
		}
		initMap();
		
		//check if page opened due to drone management option
		//hide dialog and show map if this is the case
		const query = window.location.search;
		if (query.includes("true")) { //show drone map
			toggleDialog(3); //option 3 does not display animation
		}
	}
	function showOrder(i) {
		var adapter = new LocalStorage("orders");
		var db = low(adapter);
		alert("ok");
		alert(db.read());
	}
	function switchChat() {
		var title = document.getElementById("chat_title");
		if (title.innerHTML.includes("Operator")) {
			title.innerHTML = "Customer Chat";
		}
		else {
			title.innerHTML = "Operator Chat";
		}
		var img = document.createElement("img");
		img.setAttribute("class","chat_switch");
		img.setAttribute("src","misc/switch.svg");
		img.setAttribute("onclick","switchChat()");
		title.appendChild(img);
	}
	function acceptReject(i) {
		if (i) {
			alert("Order Accepted");
			var orderActions = document.getElementById("order_actions");
			orderActions.innerHTML = "";
			var shipButton = document.createElement("button");
			shipButton.setAttribute("class","shipButton");
			shipButton.setAttribute("onclick","ship()");
			shipButton.appendChild(document.createTextNode("Ship!"));
			orderActions.appendChild(shipButton);
			orderActions.appendChild(document.createElement("br"));
			var problemButton = document.createElement("button");
			problemButton.setAttribute("class","fullButton");
			problemButton.setAttribute("onclick","problem()");
			problemButton.appendChild(document.createTextNode("Report Problem"));
			orderActions.appendChild(problemButton);
		}
		else {
			alert("Order Rejected");
		}
	}
	function problem() {
		alert("Not implemented yet");
	}
	function ship() {
		var itemList = document.getElementById("order_content_content").getElementsByTagName("li");
		var checkBoxes = 0;
		for (var z = 0; z < itemList.length; z++) {
			var checkbox = document.getElementById(139234+z);
			if (checkbox.checked) {
				checkBoxes++;
			}
		}
		if (checkBoxes == itemList.length) {
			alert("Item shipped!");
		}
		else {
			alert("Please ensure you have checked off all items before shipping");
		}
	}
	function sendMessage() {
		//first check if messagebox is empty
		if (document.getElementById("msg").value == "") {
			document.getElementById("msg").placeholder = "REQUIRED FIELD";
			document.getElementById("msg").style.border = "solid red";
			return;
		}
		else {
			document.getElementById("msg").style.border = "";
		}
		
		var message = "ME :: " + document.getElementById("msg").value;
		
		//check if message history tab is empty
		var messageHistory = document.getElementById("msgHist");
		
		if (messageHistory.value == "No messages yet") {
			messageHistory.value = message;
		}
		else {
			messageHistory.value = messageHistory.value + "\n" + message;
		}
		
		//clear message input field
		document.getElementById("msg").value = "";
		document.getElementById("msg").placeholder = "Enter message...";
	}
	function testOrderID() {
	alert("run");
		var orderList = JSON.parse(data);
		alert(orderList.orders[0].orderID);
	}
	function initMap() {
		const start = { lat: 45.424721, lng: -75.695 }; //ottawa
		map = new google.maps.Map(document.getElementById("map"), {
			zoom: 13,
			center: start,
			disableDefaultUI: true,
			gestureHandling: "none",
			styles: mapHide,
		});
	}
	function toggleMap(i) {
		if (i == 1) { //show map 
			map.setOptions({
				styles: mapShow,
				gestureHandling: "cooperative",
				disableDefaultUI: false,
			});
		}
		else { //hide map
			map.setOptions({
				styles: mapHide,
				gestureHandling: "none",
				disableDefaultUI: true,
			});
		}
	}
	function toggleDialog(x) {
		//x is used to prevent the dialog from reappearing if one clicks on the map while the dialog is hidden
		//this is because we want the user to be able to interact with the map
		var img = document.getElementById("bodyShiftButton");
		var container = document.getElementById("container");
		var childContainer = document.getElementById("map_order_list");
		
		//move dialog without animation if drone manager is meant to open
		if (x == 3) {
			img.src = "misc/down.svg";
			container.style.top = "-50%";
			childContainer.style.top = "80%";
			toggleMap(1);
			return;
		}
		
		//check if dialog is hidden already, uses image src tag for this
		if (img.src.includes("up.svg")) { //dialog open
			img.src = "misc/down.svg";
			var mainPos = 50; //position of main dialog
			var orderListPos = 100; //position of child dialog
			var id = setInterval(frame, 1);
			function frame() {
				if (mainPos == -50) {
					clearInterval(id);
				}
				else {
					mainPos--;
					container.style.top = mainPos + '%';
					orderListPos = orderListPos - 0.2;
					childContainer.style.top = orderListPos + '%';
				}
			}
			toggleMap(1);
		}
		else if (img.src.includes("down.svg") && !x) { //dialog closed, also checks if user clicked on map
			img.src = "misc/up.svg";
			var mainPos = -50; //position of main dialog
			var orderListPos = 80; //position of child dialog
			var id = setInterval(frame, 1);
			function frame() {
				if (mainPos == 50) {
					clearInterval(id);
				}
				else {
					mainPos++;
					container.style.top = mainPos + '%';
					orderListPos = orderListPos + 0.2;
					childContainer.style.top = orderListPos + '%';
				}
			}
			toggleMap(0);
		}
	}