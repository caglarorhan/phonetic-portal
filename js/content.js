const phoneticPortal = {
	// base64 image degiskeni refactor edilmeli
	iconImageBase64Data:`iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAAsQAAALEBxi1JjQAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAR+SURBVEiJtZVZbBR1HMe/c+zs7OzM7vZYWtpdukC3By4FIRDDpUgM8SSCkBg0QOJLKQYSNFYDGn0wxqAPUBNC0Bdj8AgBxBNioAW1qTRU3aVdoKV7td3abpe9Zmfn+PtQ2tBQMZvo921mfr/v53clA/zPoopNmOOq2Q6Q/YQQ/n5xNE3l5GzmQLEAzt3QOPLuia9KxoaGUF5VBbNFmP54e3wMrIlDaiIBe2kZWrc8E6WLBEjOajdltgj4YG8LEvE44pEwYv03EerrRdtrr2AkHMLh/XshSBKkkhKKLRKQWvnEU0kAjgqXG4nROE4fOwqapuGq9WLby/uw0LcY9vLy6YRiATM02HsNjzy7BRzPo6/7CrxLlt4TU+yIbF3ffeOYeli/eSt6LrWj48wpSI6SWROK7UBX1QIAgLNYEI+E0PLeoRkB/s5fUeKcAwDQNJ1i/sVwqZmmXwAhtQQYApAwVPX5oWhEKK12F+qWr4AoiiwAyIpCfvjy8/RgsC/H8oL88/ffZkcGB67/05lWOhj2+Fp76bJNDmfluGHkPkvEbydV5f2srlqqLOLuzS5PRfv8eVzzoQ8xEAyqR994NfVXONSaS6ev3vFQAQRmAzxUYeI+ObbQ5603CywtSaAlEQTAm4HuhJUxFVobmiplXcdL+QksWvswAl+cIIOR8I1RRd4CwH+32QwAAaiWynk/7SqvWi8xLBi7DZTVOmuLBiHYGbyK5bZS7JlbgzEljxe72odjirxL0bQf7wFwDLNta0nF6werFywFAMpqBWO33W8/9yiradh15VLMn5rYW9D1k9MAM8M8/aBF+ujjBQ+4GWqSqdhs6NcVhPIyQkTDqK5OutCTl+2kaHjAosYiwCvaYGEmD1IjBnZ0dUR7bid2K7p+lmKBDU2C7fg77lrPNb0Av8gjqquwlpXCt2QxvA0N8NbXo7S8bMZEx4aGcKO3FzeC1xHwB5BNJuHmeDTBhEWCiAP+7sgfyfGdlMCy46Io2Tdt3EhWP7aBWbV6DeWZP7+o0Uzp1sAALl+4oP1ysV0/e/48m8tmJlia4PoqXljR3dnJ0pqGKqcTLlc1WBNXlLmmFjASDqOv6zc22PM7u4a36ufSqZsUgLpa3nLmdN2yBn8ug4tKFn08A02wwFvnhc/ng8tTA4tVgCBJMHNmyJk0YrFhjESjGI7F0Pz4kzh8pA1UOIp1Jit8gohNwavX+pXcZgoAGGD7o/ayt454Gr1TFamEIKTICCkyxjUVBZpGngYyugaRUHDSDCpMHJwshwW8ML0dAmDPrd7gxdT42zpwYnprJpret0p0NLd5GutMVNE/OgBAgRhoudUX7Mwm21TDaLtT/KQMQjpDihz9emJ0SZPVZp5rMpuLMe/OppI7+v8cCMiZVoOQT6fez1ZquYNlWzoaV8qnkvHmFYLD7TKbmbxhIFLIawDg5niWp2mE83m9Iz0ROZmI54ZV5XLO0A8CGL3b7H6zoAA8Z6bpdTxNN1IE6Yyu+QFAZFgfoSDlDSOgGMYlAOcApIrp+D/T3xMNy1WrZyH+AAAAAElFTkSuQmCC`,
	previousSearches: {}, // {"bottle": ["/ˈbɑdl/", "/ˈbɒtəl/"]}  // first value is US ipa second value is UK ipa
	searchIconId: "phoneticSearchIcon",
	searchPopupId: "phoneticSearchPopup",
	// TODO: Tum localStorage yapisini  index.js ye tasimaliyiz.
	init(){
		this.syncToLocalStorage();
		this.addCommonEvents();
	},
	syncToLocalStorage(){
			if(localStorage.getItem("previousSearches") === null){
				localStorage.setItem("previousSearches", JSON.stringify({}));
			}else{
				this.previousSearches = JSON.parse(localStorage.getItem("previousSearches"));
			}
	},
	addToLocalStorage(data={searchText:"", ipaText:""}){
		if(data.searchText.length < 1 || data.ipaText.length < 1) return;
		this.previousSearches[data.searchText] = data.ipaText;
		this.updateLocalStorage();
	},
	updateLocalStorage(){
		localStorage.setItem("previousSearches", JSON.stringify(this.previousSearches));
	},
	lookUpInLocalStorage(searchText=""){
		if(searchText.length < 1) return null;
		if(this.previousSearches[searchText]){
			return {searchText: searchText, ipaText: this.previousSearches[searchText]};
		}else{
			return null;
		}
	},
	createAndPositionPopup(data={searchText: "Unknown", ipaText: "No data found!"}) {
		document.getElementById(this.searchPopupId)?.remove();
		const popup = document.createElement('div');
		popup.id = this.searchPopupId;
		popup.style.position = 'absolute';
		popup.style.backgroundColor = '#ffffff';
		popup.style.border = '1px solid #cccccc';
		popup.style.padding = '10px';
		popup.style.zIndex = '1000';
	
		const header = document.createElement('div');
		header.style.fontWeight = 'bold';
		header.textContent = 'Selected Text';
	
		const content = document.createElement('div');
		content.textContent = data.ipaText;
	
		const footer = document.createElement('div');
		footer.style.fontSize = '14px';
		footer.style.color = '#888888'; // Assuming lighter text color for the footer from index.css
	
		// Append header, content, and footer to the popup
		popup.appendChild(header);
		popup.appendChild(content);
		popup.appendChild(footer);
	
		// Get the coordinates of the selected text
		const selection = window.getSelection();
		if (selection.rangeCount > 0) {
			const range = selection.getRangeAt(0);
			const rect = range.getBoundingClientRect();
			popup.style.top = `${rect.bottom + 10 + window.scrollY}px`;
			popup.style.left = `${rect.left + window.scrollX}px`;
		}
	
		document.body.appendChild(popup);
		this.addToLocalStorage(data);
	},
	createAndPositionIcon() {
		const button = document.createElement('button');
		button.id = this.searchIconId;
		button.style.position = 'absolute';
		button.style.width = '24px';
		button.style.height = '24px';
		button.style.backgroundImage = `url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAAsQAAALEBxi1JjQAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAR+SURBVEiJtZVZbBR1HMe/c+zs7OzM7vZYWtpdukC3By4FIRDDpUgM8SSCkBg0QOJLKQYSNFYDGn0wxqAPUBNC0Bdj8AgBxBNioAW1qTRU3aVdoKV7td3abpe9Zmfn+PtQ2tBQMZvo921mfr/v53clA/zPoopNmOOq2Q6Q/YQQ/n5xNE3l5GzmQLEAzt3QOPLuia9KxoaGUF5VBbNFmP54e3wMrIlDaiIBe2kZWrc8E6WLBEjOajdltgj4YG8LEvE44pEwYv03EerrRdtrr2AkHMLh/XshSBKkkhKKLRKQWvnEU0kAjgqXG4nROE4fOwqapuGq9WLby/uw0LcY9vLy6YRiATM02HsNjzy7BRzPo6/7CrxLlt4TU+yIbF3ffeOYeli/eSt6LrWj48wpSI6SWROK7UBX1QIAgLNYEI+E0PLeoRkB/s5fUeKcAwDQNJ1i/sVwqZmmXwAhtQQYApAwVPX5oWhEKK12F+qWr4AoiiwAyIpCfvjy8/RgsC/H8oL88/ffZkcGB67/05lWOhj2+Fp76bJNDmfluGHkPkvEbydV5f2srlqqLOLuzS5PRfv8eVzzoQ8xEAyqR994NfVXONSaS6ev3vFQAQRmAzxUYeI+ObbQ5603CywtSaAlEQTAm4HuhJUxFVobmiplXcdL+QksWvswAl+cIIOR8I1RRd4CwH+32QwAAaiWynk/7SqvWi8xLBi7DZTVOmuLBiHYGbyK5bZS7JlbgzEljxe72odjirxL0bQf7wFwDLNta0nF6werFywFAMpqBWO33W8/9yiradh15VLMn5rYW9D1k9MAM8M8/aBF+ujjBQ+4GWqSqdhs6NcVhPIyQkTDqK5OutCTl+2kaHjAosYiwCvaYGEmD1IjBnZ0dUR7bid2K7p+lmKBDU2C7fg77lrPNb0Av8gjqquwlpXCt2QxvA0N8NbXo7S8bMZEx4aGcKO3FzeC1xHwB5BNJuHmeDTBhEWCiAP+7sgfyfGdlMCy46Io2Tdt3EhWP7aBWbV6DeWZP7+o0Uzp1sAALl+4oP1ysV0/e/48m8tmJlia4PoqXljR3dnJ0pqGKqcTLlc1WBNXlLmmFjASDqOv6zc22PM7u4a36ufSqZsUgLpa3nLmdN2yBn8ug4tKFn08A02wwFvnhc/ng8tTA4tVgCBJMHNmyJk0YrFhjESjGI7F0Pz4kzh8pA1UOIp1Jit8gohNwavX+pXcZgoAGGD7o/ayt454Gr1TFamEIKTICCkyxjUVBZpGngYyugaRUHDSDCpMHJwshwW8ML0dAmDPrd7gxdT42zpwYnprJpret0p0NLd5GutMVNE/OgBAgRhoudUX7Mwm21TDaLtT/KQMQjpDihz9emJ0SZPVZp5rMpuLMe/OppI7+v8cCMiZVoOQT6fez1ZquYNlWzoaV8qnkvHmFYLD7TKbmbxhIFLIawDg5niWp2mE83m9Iz0ROZmI54ZV5XLO0A8CGL3b7H6zoAA8Z6bpdTxNN1IE6Yyu+QFAZFgfoSDlDSOgGMYlAOcApIrp+D/T3xMNy1WrZyH+AAAAAElFTkSuQmCC)`;
		button.style.backgroundSize = 'cover';
		button.style.border = 'none';
		button.style.cursor = 'pointer';
		button.style.zIndex = '1000';
		button.setAttribute('tabindex', '1');
	
		// Get the coordinates of the selected text
		const selection = window.getSelection();
		if (selection.rangeCount > 0) {
			const range = selection.getRangeAt(0);
			const rect = range.getBoundingClientRect();
			button.style.top = `${rect.top + 5 + window.scrollY}px`;
			button.style.left = `${rect.right + window.scrollX}px`;
		}
		document.body.appendChild(button);
	},
	addCommonEvents() {
		const popupId = this.searchPopupId;
		const searchIconId = this.searchIconId;
		const createAndPositionIcon = this.createAndPositionIcon.bind(this);
		const sendMessageToBackground = this.sendMessageToBackground.bind(this);


		// Remove the pop-up when the user clicks somewhere else
		document.addEventListener('click', function(e) {
			let popup = document.getElementById(popupId);
			let icon = document.getElementById(searchIconId);
			const selection = window.getSelection();
			if (selection.isCollapsed) {
				popup?.remove();
				icon?.remove();
			}else{		
				if(e.target.id === searchIconId){
					console.log("Icon clicked");
					sendMessageToBackground({action:'checkIPA', searchText:selection.toString()});
				}
			}


		});
	
		// Show the icon when the selection ends
		document.addEventListener('mouseup', function() {
			const selection = window.getSelection();
			if (!selection.isCollapsed) {
					createAndPositionIcon();
			}else{
				let icon = document.getElementById(searchIconId);
				icon?.remove();
			}
		});
	},
	sendMessageToBackground(data={action: 'checkIPa', searchText: ''}) {
		console.log(data);
		chrome.runtime.sendMessage(data);
	}


}


phoneticPortal.init();


// Listen for messages from the background script
chrome.runtime.onMessage.addListener(function(request) {
	switch(request.action){
		case "createPopup":
			console.log("Message has been received: " + request.searchText);
			if (request.searchText.length < 1) {
				request.searchText = "No data found!";
			}
			phoneticPortal.createAndPositionPopup({searchText: request.searchText, ipaText: request.ipaText});
			break;
			case "straightMessage":
				console.log("Message has been received: " + request.messageText);
				break;
	}
});

