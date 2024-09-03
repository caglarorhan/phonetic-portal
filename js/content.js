const phoneticPortal = {
    defaultIconPosition: 'top-center',
	// base64 image degiskeni refactor edilmeli
	iconImageBase64Data:`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`,
	previousSearches: {}, // {"bottle": ["/ˈbɑdl/", "/ˈbɒtəl/"]}  // first value is US ipa second value is UK ipa
	noDataFoundMessage: "No data found!",
	countryFlags: {
		us:"iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAD9UlEQVR4nO2Z72scRRjHP7O3Se4SexeT2kjSioWai5ULhYJKX6R9odAXxX9AG4IipiIiiQm+EDUIRRtOSl5oQayQgiCUIvpC8Y0aEMT4otxRvaMiRN81anK5XO5uf8z4YjeXdZM0hs6RHt4Xhptn5tnvfJ99dmZ2bqGJJppoYi8hgAjQ5v82ElygagLxM2fe+bveo30kbmjn7PniSpcJJKRUnDx5lMnJp7hw4fOag067jTat4svffQ+QEEDy9OnzuaGhh1leLgGg1IajEHgPmvLaDQFqM9+/oJR/XcB+46i5s6rwhdv4iI52nJ/zdE5NDphem8RxvAKQTp9lbGzW5xKk02cZH78CgIsinR5mfGzW4xPwXnrY71coNmwVCPWekad3DmC3mJpEAMknn3g799jjD1EolNl8f0WgTYT61+1we/h6mJkZ0aQ6wCyElwHHVViWw8zMCKOjH9YcLl16Xptd+uSaPuGxKM7CH14dSJ469Vbu2LEHKRTWtA0Sxrtc18ZlJOJY1zP0fvv1gAHgupJq1cayHCzL4fLlc7V6za46m/urt/EP2JblIGxTX7EiCNUO+Bk4ceL1XH9/L8ViWdtdCuPT94f1kRkGWDZm3/3BDFhcvTpGtWrXik47cmC/vrK/i0hvD+Bn4Pjx13KHDnWzulrRd5dC+PKDZ/SRGQbYNi0DR7xVSEpJuWxRrdoAzM1NMTT0Zs3/Tm2AxWdf1KZftMeQt/706kAylXo119nZQblsaRskjM+Y08YlYlFUYYWDmXl/H3Ak5TWL+Z/Okxqc8LwUZLPTDKYmavtUJjtNanCitm1lM77t72WZzDSp1IS3gwf9FcRfeE5bAJgRsB14ed7LQDL5Sk6pnd5w7gz5/EXtnEIIbxVyHJdKxa6VfP6iVrtSsbWLrwUBJA8ffim3uLhSt0EAfn20pJXP6Ixz4NrHG3NASkWpNEtHx8aGo9Mu//CN1gAi3d2An4He3tHc0tKq1gHCuPnAb1r5RCJO349fDQgg6bpuzjAMrQPUG1JKIpGIN4nrvQLVEybA7z2PYFo2yqrfaqETorUFp7UF8ANQjosClFTrB6jtD17bIey/Vb/Yoh7uv93hb91PKpTrBgKQ0j/JK5Ah4iCR3IJ4u2C28gu3h4Payn9dQ1CXAOXKjQD6bt0gGo3uoOruQqVSgViMhp3E65pNgIXOftpbW1Fr9TuR6YRoj7FmeW/OBoD8L38o3U0QwtOMHwAN+AgRfIQO/vUL8Xh8T/XsFisrK5BINO4kljKwjC50Jbl3X2NlYLnovf6beB8KWCrW9zxQJ7gC6AFSwH17LGa3WASyAu/z0j7/t5FQBYp7LaKJJpr4v+MfxsZudiAyPLgAAAAASUVORK5CYII=",
		uk:`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`
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
							background-image: url('data:image/jpeg;base64,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');
							background-repeat: no-repeat;
							background-position: center;
							background-size: 28px;
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

