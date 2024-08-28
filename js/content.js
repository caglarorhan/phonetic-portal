const phoneticPortal = {
	// base64 image degiskeni refactor edilmeli
	iconImageBase64Data:`iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAAsQAAALEBxi1JjQAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAR+SURBVEiJtZVZbBR1HMe/c+zs7OzM7vZYWtpdukC3By4FIRDDpUgM8SSCkBg0QOJLKQYSNFYDGn0wxqAPUBNC0Bdj8AgBxBNioAW1qTRU3aVdoKV7td3abpe9Zmfn+PtQ2tBQMZvo921mfr/v53clA/zPoopNmOOq2Q6Q/YQQ/n5xNE3l5GzmQLEAzt3QOPLuia9KxoaGUF5VBbNFmP54e3wMrIlDaiIBe2kZWrc8E6WLBEjOajdltgj4YG8LEvE44pEwYv03EerrRdtrr2AkHMLh/XshSBKkkhKKLRKQWvnEU0kAjgqXG4nROE4fOwqapuGq9WLby/uw0LcY9vLy6YRiATM02HsNjzy7BRzPo6/7CrxLlt4TU+yIbF3ffeOYeli/eSt6LrWj48wpSI6SWROK7UBX1QIAgLNYEI+E0PLeoRkB/s5fUeKcAwDQNJ1i/sVwqZmmXwAhtQQYApAwVPX5oWhEKK12F+qWr4AoiiwAyIpCfvjy8/RgsC/H8oL88/ffZkcGB67/05lWOhj2+Fp76bJNDmfluGHkPkvEbydV5f2srlqqLOLuzS5PRfv8eVzzoQ8xEAyqR994NfVXONSaS6ev3vFQAQRmAzxUYeI+ObbQ5603CywtSaAlEQTAm4HuhJUxFVobmiplXcdL+QksWvswAl+cIIOR8I1RRd4CwH+32QwAAaiWynk/7SqvWi8xLBi7DZTVOmuLBiHYGbyK5bZS7JlbgzEljxe72odjirxL0bQf7wFwDLNta0nF6werFywFAMpqBWO33W8/9yiradh15VLMn5rYW9D1k9MAM8M8/aBF+ujjBQ+4GWqSqdhs6NcVhPIyQkTDqK5OutCTl+2kaHjAosYiwCvaYGEmD1IjBnZ0dUR7bid2K7p+lmKBDU2C7fg77lrPNb0Av8gjqquwlpXCt2QxvA0N8NbXo7S8bMZEx4aGcKO3FzeC1xHwB5BNJuHmeDTBhEWCiAP+7sgfyfGdlMCy46Io2Tdt3EhWP7aBWbV6DeWZP7+o0Uzp1sAALl+4oP1ysV0/e/48m8tmJlia4PoqXljR3dnJ0pqGKqcTLlc1WBNXlLmmFjASDqOv6zc22PM7u4a36ufSqZsUgLpa3nLmdN2yBn8ug4tKFn08A02wwFvnhc/ng8tTA4tVgCBJMHNmyJk0YrFhjESjGI7F0Pz4kzh8pA1UOIp1Jit8gohNwavX+pXcZgoAGGD7o/ayt454Gr1TFamEIKTICCkyxjUVBZpGngYyugaRUHDSDCpMHJwshwW8ML0dAmDPrd7gxdT42zpwYnprJpret0p0NLd5GutMVNE/OgBAgRhoudUX7Mwm21TDaLtT/KQMQjpDihz9emJ0SZPVZp5rMpuLMe/OppI7+v8cCMiZVoOQT6fez1ZquYNlWzoaV8qnkvHmFYLD7TKbmbxhIFLIawDg5niWp2mE83m9Iz0ROZmI54ZV5XLO0A8CGL3b7H6zoAA8Z6bpdTxNN1IE6Yyu+QFAZFgfoSDlDSOgGMYlAOcApIrp+D/T3xMNy1WrZyH+AAAAAElFTkSuQmCC`,
	previousSearches: {}, // {"bottle": ["/ˈbɑdl/", "/ˈbɒtəl/"]}  // first value is US ipa second value is UK ipa
	noDataFoundMessage: "No data found!",
	countryFlags: {
		us:"https://raw.githubusercontent.com/caglarorhan/phonetic-portal/main/img/united-states-flag.png",
		uk:"https://raw.githubusercontent.com/caglarorhan/phonetic-portal/main/img/united-kingdom-flag.png"
	},
	searchIconId: "phoneticSearchIcon",
	searchPopupId: "phoneticSearchPopup",
	styleText: `
	.phonetic-search-popup {
							display: flex;
							flex-direction: column;
							position: absolute;
							background-color: #ffffff;
							border: 1px solid #cccccc;
							border-radius: 8px;
							box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
							padding: 0 15px;
							z-index: 1000;
							overflow: auto;
							width: auto;
							font-family: Arial, sans-serif;
							font-size: 16px;
							color: black;
							white-space: pre;
	}
	.phonetic-search-popup .header {
							font-weight: bold;
							font-size: 18px;
							margin-bottom: 10px;
	}
	.phonetic-search-popup .header h3 {
							color: red;
							margin-top: 4px;
							margin-bottom: 4px;
	}
	.phonetic-search-popup .content {
							display: flex;
							flex-direction: column;
							justify-content: flex-start;
							align-items: flex-start;
	}
	.phonetic-search-popup .content .ipaData{
							display: flex;
							margin-bottom: 4px;
							align-items: center;
	}
	.phonetic-search-popup .content .ipaData img.flag{
							margin-right: 5px;
							width:16px;
							height:16px;

	}
	.phonetic-search-popup .footer {
							font-size: 12px;
							color: #888888;
							margin-top: 5px;
							text-align:right;
	}
	button.phonetic-search-icon {
							position: absolute;
							width: 32px;
							height: 32px;
							background-image: url('https://raw.githubusercontent.com/caglarorhan/phonetic-portal/main/img/phonetic-portal-64.png');
							background-size: 24px 24px;
							background-repeat: no-repeat;
							background-position: center;
							border: none;
							cursor: pointer;
							z-index: 1000;
							background-color: white;
							border-radius: 10%;
							box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
	}						
	`,
	init(){
		this.addCommonEvents();
		this.createStyleElement(this.styleText);
		this.getIconPositionSettingFromBackground();
	},
	createStyleElement(styleText) {
		const styleElement = document.createElement('style');
		styleElement.textContent = styleText;
		document.head.appendChild(styleElement);
	},
	createAndPositionPopup(data={searchText: "Unknown", ipaData:[]}) {
		document.getElementById(this.searchPopupId)?.remove();
		const popup = document.createElement('div');
		popup.id = this.searchPopupId;
		popup.classList.add('phonetic-search-popup');
	
		const header = document.createElement('div');
		header.classList.add('header');

		header.innerHTML = `<h3>${data.searchText}</h3>`;
	
		const content = document.createElement('div');
		content.classList.add('content');
		if(JSON.parse(data.ipaData).length === 0){
			content.innerHTML+= this.noDataFoundMessage;	
		}else{
			content.innerHTML+= JSON.parse(data.ipaData).map((ipa) => `
			<div class="ipaData">
				<img class="flag" src="${this.countryFlags[ipa.country]}" />
				<span>: ${ipa.ipa_text}</span>
			</div>
			`).join("");
		}

		const footer = document.createElement('div');
		footer.classList.add('footer');
		footer.innerHTML = 'Phonetic Portal';
	
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
		this.removeAllPreviousIcons();
	},
	getIconPositionSettingFromBackground(){
		this.sendMessageToBackground({action: 'getIconPositionSetting'});
	},
	saveIconPositionSettingToLocalStorage(data){
		if(!data || !data.place){
			localStorage.setItem('iconPosition', "bottom-right");
		}else{
			localStorage.setItem('iconPosition', data.place);
		}
	},
	createAndPositionIcon() {
		let allIcons = [...document.querySelectorAll(".phonetic-search-icon")];
		if(allIcons.length > 1){
			allIcons.forEach((icon, index)=>{
				if(index > 0){
					icon.remove();
				}});
		}
		const button = document.createElement('button');
		button.id = this.searchIconId;
		button.className = 'phonetic-search-icon';
		button.setAttribute('tabindex', '1');
	
		// Get the coordinates of the selected text
		const selection = window.getSelection();
		if (selection.rangeCount > 0) {
			const range = selection.getRangeAt(0);
			const rect = range.getBoundingClientRect();

        // Define the 8 positions
        const positions = {
            'top-left': { top: rect.top + window.scrollY - 30, left: rect.left + window.scrollX - 30 },
            'top-center': { top: rect.top + window.scrollY - 30, left: rect.left + window.scrollX + (rect.width / 2) - 15 },
            'top-right': { top: rect.top + window.scrollY - 30, left: rect.right + window.scrollX + 5 },
            'middle-left': { top: rect.top + window.scrollY + (rect.height / 2) - 15, left: rect.left + window.scrollX - 30 },
            'middle-right': { top: rect.top + window.scrollY + (rect.height / 2) - 15, left: rect.right + window.scrollX + 5 },
            'bottom-left': { top: rect.bottom + window.scrollY + 5, left: rect.left + window.scrollX - 30 },
            'bottom-center': { top: rect.bottom + window.scrollY + 5, left: rect.left + window.scrollX + (rect.width / 2) - 15 },
            'bottom-right': { top: rect.bottom + window.scrollY + 5, left: rect.right + window.scrollX + 5 }
        };

			const iconPosition = localStorage.getItem('iconPosition') || 'top-right';
			button.style.top = `${positions[iconPosition].top}px`;
			button.style.left = `${positions[iconPosition].left}px`;
		}
		document.body.appendChild(button);
	},
	removeAllPreviousIcons(){
		[...document.querySelectorAll(".phonetic-search-icon")].forEach(icon=>icon.remove());
	},
	addCommonEvents() {
		const popupId = this.searchPopupId;
		const searchIconId = this.searchIconId;
		const createAndPositionIcon = this.createAndPositionIcon.bind(this);
		const sendMessageToBackground = this.sendMessageToBackground.bind(this);


		// Remove the pop-up when the user clicks somewhere else
		document.addEventListener('click', (e)=>{
			let popup = document.getElementById(popupId);
			let icon = document.getElementById(searchIconId);
			const selection = window.getSelection();
			if (selection.isCollapsed) {
				popup?.remove();
				icon?.remove();
			}else{		
				if(e.target.id === searchIconId){
					let selectedTextOnly = selection.toString().trimEnd();
					if(selectedTextOnly.split(" ").length > 1){
						this.createAndPositionPopup({searchText: `<span style="font-size:12px">Too much words selected!<br>Please try to select a single word!</span>`, ipaData: JSON.stringify([])});
					}else{
						sendMessageToBackground({action:'checkIPA', searchText:selectedTextOnly});	
					}
					
				}
			}


		});
	
		// Show the icon when the selection ends
		document.addEventListener('mouseup', ()=>{
			const selection = window.getSelection();
			if (!selection.isCollapsed) {
					createAndPositionIcon();
			}else{
				this.removeAllPreviousIcons();
			}
		});
		document.addEventListener('selectionchange', (e)=>{
			let popup = document.getElementById(popupId);
			this.removeAllPreviousIcons();
			if(popup){
				popup.remove();
			}
			
		})
	},
	sendMessageToBackground(data={action: 'checkIPa', searchText: ''}) {
		if (!chrome.runtime || !chrome.runtime.sendMessage) {
			console.error('Extension context invalidated.');
			return;
		}
		chrome.runtime.sendMessage(data, () => {
			// Callback function without response parameter
			return true;
		});
	}


}


phoneticPortal.init();


// Listen for messages from the background script
chrome.runtime.onMessage.addListener(function(request) {
	switch(request.action){
		case "createPopup":
			console.log(request.ipaData);
			phoneticPortal.createAndPositionPopup({searchText: request.searchText, ipaData: request.ipaData});
			break;
		case "setIconPosition":
			phoneticPortal.saveIconPositionSettingToLocalStorage(request.position);
			break;	
		case "straightMessage":
			console.log("Message: " + request.messageText);
		break;
	}
});

