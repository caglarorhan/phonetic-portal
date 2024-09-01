const phoneticPortal = {
    defaultIconPosition: 'top-center',
	// base64 image degiskeni refactor edilmeli
	iconImageBase64Data:`iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAAsQAAALEBxi1JjQAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAR+SURBVEiJtZVZbBR1HMe/c+zs7OzM7vZYWtpdukC3By4FIRDDpUgM8SSCkBg0QOJLKQYSNFYDGn0wxqAPUBNC0Bdj8AgBxBNioAW1qTRU3aVdoKV7td3abpe9Zmfn+PtQ2tBQMZvo921mfr/v53clA/zPoopNmOOq2Q6Q/YQQ/n5xNE3l5GzmQLEAzt3QOPLuia9KxoaGUF5VBbNFmP54e3wMrIlDaiIBe2kZWrc8E6WLBEjOajdltgj4YG8LEvE44pEwYv03EerrRdtrr2AkHMLh/XshSBKkkhKKLRKQWvnEU0kAjgqXG4nROE4fOwqapuGq9WLby/uw0LcY9vLy6YRiATM02HsNjzy7BRzPo6/7CrxLlt4TU+yIbF3ffeOYeli/eSt6LrWj48wpSI6SWROK7UBX1QIAgLNYEI+E0PLeoRkB/s5fUeKcAwDQNJ1i/sVwqZmmXwAhtQQYApAwVPX5oWhEKK12F+qWr4AoiiwAyIpCfvjy8/RgsC/H8oL88/ffZkcGB67/05lWOhj2+Fp76bJNDmfluGHkPkvEbydV5f2srlqqLOLuzS5PRfv8eVzzoQ8xEAyqR994NfVXONSaS6ev3vFQAQRmAzxUYeI+ObbQ5603CywtSaAlEQTAm4HuhJUxFVobmiplXcdL+QksWvswAl+cIIOR8I1RRd4CwH+32QwAAaiWynk/7SqvWi8xLBi7DZTVOmuLBiHYGbyK5bZS7JlbgzEljxe72odjirxL0bQf7wFwDLNta0nF6werFywFAMpqBWO33W8/9yiradh15VLMn5rYW9D1k9MAM8M8/aBF+ujjBQ+4GWqSqdhs6NcVhPIyQkTDqK5OutCTl+2kaHjAosYiwCvaYGEmD1IjBnZ0dUR7bid2K7p+lmKBDU2C7fg77lrPNb0Av8gjqquwlpXCt2QxvA0N8NbXo7S8bMZEx4aGcKO3FzeC1xHwB5BNJuHmeDTBhEWCiAP+7sgfyfGdlMCy46Io2Tdt3EhWP7aBWbV6DeWZP7+o0Uzp1sAALl+4oP1ysV0/e/48m8tmJlia4PoqXljR3dnJ0pqGKqcTLlc1WBNXlLmmFjASDqOv6zc22PM7u4a36ufSqZsUgLpa3nLmdN2yBn8ug4tKFn08A02wwFvnhc/ng8tTA4tVgCBJMHNmyJk0YrFhjESjGI7F0Pz4kzh8pA1UOIp1Jit8gohNwavX+pXcZgoAGGD7o/ayt454Gr1TFamEIKTICCkyxjUVBZpGngYyugaRUHDSDCpMHJwshwW8ML0dAmDPrd7gxdT42zpwYnprJpret0p0NLd5GutMVNE/OgBAgRhoudUX7Mwm21TDaLtT/KQMQjpDihz9emJ0SZPVZp5rMpuLMe/OppI7+v8cCMiZVoOQT6fez1ZquYNlWzoaV8qnkvHmFYLD7TKbmbxhIFLIawDg5niWp2mE83m9Iz0ROZmI54ZV5XLO0A8CGL3b7H6zoAA8Z6bpdTxNN1IE6Yyu+QFAZFgfoSDlDSOgGMYlAOcApIrp+D/T3xMNy1WrZyH+AAAAAElFTkSuQmCC`,
	previousSearches: {}, // {"bottle": ["/ˈbɑdl/", "/ˈbɒtəl/"]}  // first value is US ipa second value is UK ipa
	noDataFoundMessage: "No data found!",
	countryFlags: {
		us:"iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAD9UlEQVR4nO2Z72scRRjHP7O3Se4SexeT2kjSioWai5ULhYJKX6R9odAXxX9AG4IipiIiiQm+EDUIRRtOSl5oQayQgiCUIvpC8Y0aEMT4otxRvaMiRN81anK5XO5uf8z4YjeXdZM0hs6RHt4Xhptn5tnvfJ99dmZ2bqGJJppoYi8hgAjQ5v82ElygagLxM2fe+bveo30kbmjn7PniSpcJJKRUnDx5lMnJp7hw4fOag067jTat4svffQ+QEEDy9OnzuaGhh1leLgGg1IajEHgPmvLaDQFqM9+/oJR/XcB+46i5s6rwhdv4iI52nJ/zdE5NDphem8RxvAKQTp9lbGzW5xKk02cZH78CgIsinR5mfGzW4xPwXnrY71coNmwVCPWekad3DmC3mJpEAMknn3g799jjD1EolNl8f0WgTYT61+1we/h6mJkZ0aQ6wCyElwHHVViWw8zMCKOjH9YcLl16Xptd+uSaPuGxKM7CH14dSJ469Vbu2LEHKRTWtA0Sxrtc18ZlJOJY1zP0fvv1gAHgupJq1cayHCzL4fLlc7V6za46m/urt/EP2JblIGxTX7EiCNUO+Bk4ceL1XH9/L8ViWdtdCuPT94f1kRkGWDZm3/3BDFhcvTpGtWrXik47cmC/vrK/i0hvD+Bn4Pjx13KHDnWzulrRd5dC+PKDZ/SRGQbYNi0DR7xVSEpJuWxRrdoAzM1NMTT0Zs3/Tm2AxWdf1KZftMeQt/706kAylXo119nZQblsaRskjM+Y08YlYlFUYYWDmXl/H3Ak5TWL+Z/Okxqc8LwUZLPTDKYmavtUJjtNanCitm1lM77t72WZzDSp1IS3gwf9FcRfeE5bAJgRsB14ed7LQDL5Sk6pnd5w7gz5/EXtnEIIbxVyHJdKxa6VfP6iVrtSsbWLrwUBJA8ffim3uLhSt0EAfn20pJXP6Ixz4NrHG3NASkWpNEtHx8aGo9Mu//CN1gAi3d2An4He3tHc0tKq1gHCuPnAb1r5RCJO349fDQgg6bpuzjAMrQPUG1JKIpGIN4nrvQLVEybA7z2PYFo2yqrfaqETorUFp7UF8ANQjosClFTrB6jtD17bIey/Vb/Yoh7uv93hb91PKpTrBgKQ0j/JK5Ah4iCR3IJ4u2C28gu3h4Payn9dQ1CXAOXKjQD6bt0gGo3uoOruQqVSgViMhp3E65pNgIXOftpbW1Fr9TuR6YRoj7FmeW/OBoD8L38o3U0QwtOMHwAN+AgRfIQO/vUL8Xh8T/XsFisrK5BINO4kljKwjC50Jbl3X2NlYLnovf6beB8KWCrW9zxQJ7gC6AFSwH17LGa3WASyAu/z0j7/t5FQBYp7LaKJJpr4v+MfxsZudiAyPLgAAAAASUVORK5CYII=",
		uk:`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`
	},
//	countryFlags: {
//		us:"https://raw.githubusercontent.com/caglarorhan/phonetic-portal/main/img/united-states-flag.png",
//		uk:"https://raw.githubusercontent.com/caglarorhan/phonetic-portal/main/img/united-kingdom-flag.png"
//	},
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
							width:24px;
							height:24px;
							margin-bottom:unset;

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
				<img class="flag" src="data:image/png;base64,${this.countryFlags[ipa.country]}" />
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
			localStorage.setItem('iconPosition', this.defaultIconPosition);
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

			const iconPosition = localStorage.getItem('iconPosition') || this.defaultIconPosition;
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

