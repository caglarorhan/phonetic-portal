const phoneticPortal = {
	// base64 image degiskeni refactor edilmeli
	iconImageBase64Data:`iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAAsQAAALEBxi1JjQAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAR+SURBVEiJtZVZbBR1HMe/c+zs7OzM7vZYWtpdukC3By4FIRDDpUgM8SSCkBg0QOJLKQYSNFYDGn0wxqAPUBNC0Bdj8AgBxBNioAW1qTRU3aVdoKV7td3abpe9Zmfn+PtQ2tBQMZvo921mfr/v53clA/zPoopNmOOq2Q6Q/YQQ/n5xNE3l5GzmQLEAzt3QOPLuia9KxoaGUF5VBbNFmP54e3wMrIlDaiIBe2kZWrc8E6WLBEjOajdltgj4YG8LEvE44pEwYv03EerrRdtrr2AkHMLh/XshSBKkkhKKLRKQWvnEU0kAjgqXG4nROE4fOwqapuGq9WLby/uw0LcY9vLy6YRiATM02HsNjzy7BRzPo6/7CrxLlt4TU+yIbF3ffeOYeli/eSt6LrWj48wpSI6SWROK7UBX1QIAgLNYEI+E0PLeoRkB/s5fUeKcAwDQNJ1i/sVwqZmmXwAhtQQYApAwVPX5oWhEKK12F+qWr4AoiiwAyIpCfvjy8/RgsC/H8oL88/ffZkcGB67/05lWOhj2+Fp76bJNDmfluGHkPkvEbydV5f2srlqqLOLuzS5PRfv8eVzzoQ8xEAyqR994NfVXONSaS6ev3vFQAQRmAzxUYeI+ObbQ5603CywtSaAlEQTAm4HuhJUxFVobmiplXcdL+QksWvswAl+cIIOR8I1RRd4CwH+32QwAAaiWynk/7SqvWi8xLBi7DZTVOmuLBiHYGbyK5bZS7JlbgzEljxe72odjirxL0bQf7wFwDLNta0nF6werFywFAMpqBWO33W8/9yiradh15VLMn5rYW9D1k9MAM8M8/aBF+ujjBQ+4GWqSqdhs6NcVhPIyQkTDqK5OutCTl+2kaHjAosYiwCvaYGEmD1IjBnZ0dUR7bid2K7p+lmKBDU2C7fg77lrPNb0Av8gjqquwlpXCt2QxvA0N8NbXo7S8bMZEx4aGcKO3FzeC1xHwB5BNJuHmeDTBhEWCiAP+7sgfyfGdlMCy46Io2Tdt3EhWP7aBWbV6DeWZP7+o0Uzp1sAALl+4oP1ysV0/e/48m8tmJlia4PoqXljR3dnJ0pqGKqcTLlc1WBNXlLmmFjASDqOv6zc22PM7u4a36ufSqZsUgLpa3nLmdN2yBn8ug4tKFn08A02wwFvnhc/ng8tTA4tVgCBJMHNmyJk0YrFhjESjGI7F0Pz4kzh8pA1UOIp1Jit8gohNwavX+pXcZgoAGGD7o/ayt454Gr1TFamEIKTICCkyxjUVBZpGngYyugaRUHDSDCpMHJwshwW8ML0dAmDPrd7gxdT42zpwYnprJpret0p0NLd5GutMVNE/OgBAgRhoudUX7Mwm21TDaLtT/KQMQjpDihz9emJ0SZPVZp5rMpuLMe/OppI7+v8cCMiZVoOQT6fez1ZquYNlWzoaV8qnkvHmFYLD7TKbmbxhIFLIawDg5niWp2mE83m9Iz0ROZmI54ZV5XLO0A8CGL3b7H6zoAA8Z6bpdTxNN1IE6Yyu+QFAZFgfoSDlDSOgGMYlAOcApIrp+D/T3xMNy1WrZyH+AAAAAElFTkSuQmCC`,
	previousSearches: {}, // {"bottle": ["/ˈbɑdl/", "/ˈbɒtəl/"]}  // first value is US ipa second value is UK ipa
	countryFlags: {
		us: "iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAAB2AAAAdgFOeyYIAAAAGXRFWHRTb2Z0d2FyZQB3d3cuaW5rc2NhcGUub3Jnm+48GgAAAh1JREFUOI2dk91LU2Ecx7+/87LVSo5ujrFJQ8NgIoGDQIqMXgzJgoyIKDSIIspbiS5KGoHsD5hEQRBdFBRYGLGbdjEQiqJubLVZvp9scyKec9ZO7eWcpwtxyXSRfq9+PHw/Hx5+Dw+hLFdCH85MLuT6Fb24MyZnt6Xu78sS0TSAiGEYD+x2e2x1n1aGN7K8lc/w9zqCoxcO+CR0t7nQMxiHfF7822bMNL6nXlm+TvU4QgGtJLjxbEL6GEuNab8N1/txDd5aK6ptAkZns0g87yu/JER/01L1/pZ6RyigCQAQG0uPJJW86/JhNxJzWdTVWHFyTy0Sc5MQW3xrBGCsRgc/DOCQMPA01nFnaGa3x26FvJiD9stA3mCI/9CRNwBH9NFawXLaFgO9zYKiF/uICGm1gE/yT1gEDt+SOqptAgSeYCqZSgKeM9lV4XSrs+FhdB4+jw3XT+zASFxFp9+B434Hop+XkK5vrySA2Nx4ibacDbOiyUrPUTAYRJ5K83pLXAknbWekKIoGoKpi69/ROMaYvEkYAGYF9eItPR99tynaerBVF3iPM2hq2SGY5sZojgO5nUECgPnh1084qercRnhTyTx2dR3tJgBgjFlUVQ0DOPKffESSpE4iKpQ+E2PMkhy4+yIXeXuMgWg9isCY2L43XHez9xQRFZbPyjJ1LdBFEzO3C+NyE0stWACAczvzQqP3C7erIeAd7H+5uv8HrKfWF0/8TXUAAAAASUVORK5CYII=",
		uk: "iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAAB2AAAAdgFOeyYIAAAAGXRFWHRTb2Z0d2FyZQB3d3cuaW5rc2NhcGUub3Jnm+48GgAAAmtJREFUOI2lk09I03EYxj/f3+Z+/l2bNs1/XWOVpYQSdRDy0sEkjYmZeQhCJT3oQYXuqYNMKEsiOpgQhX8wDBQjtENuZSWoc5cotDnnn+m2pm42fx0qCZcd6jm9h+d53vd5eV/YhZqOiSJTi8XqdjhtdjlDscsZitvhtJnMVsu1exOFu/nqX4WiKHJ52/ir9mFHTkKcGiEEBIIACCGMI7Y1Vnzfesta31jMMa68lIpz6wASwELnUIzzRseH+oKDOWkJmt1NdpCs19AwO3JSWZobVxRFs2NQv5rwcsUTMOpuP+B5wzEO7o8ME6fGywzqp9BHChaLi4yXb70dBRA1HRNF7cOOnmS9hsH4aXRBP+u1V0mM2MaVkgtA0vwortYuYtWwdKWMfPMkztUgFXlJhdL8WqBRG63CHwhRsnkcv1om7nFf2ATaAzq+VpZTdmcGfyCENlrFojfUKFY+frILlfpQmGJjk0VjPgCJMwMQFR5LUrZnhF1zVCG4tefi/gpNBBJC/JsYQJL47wjqiu4lz4spNwCpepmeuiNou58RVZq/QxT74tjo7Me77ONC8ASO1QAAZw7rvFKSVtPsXQ8RI6voqjYS29GJd2EtrJvvYiFxsRqeYCVGVuHbCJGsl5uk9qrMvtLTBstAfQaGh114A9tcIjvMoLjNhqvUhD4+mqHod5ScMoy1V2b1SwCParNzE5/22jxBhbP+LGaXN8MM5lcD5LdM/jBJ1Nqa+ZwHP09ZCBEUhvTsprRcy5eV4J5Ld3m2uDkwN5ZyvSozva5444+kqrvj54vN1jG3wzn92ztPm8zW19X33xfs5n8Hyxr8KXZ6YJkAAAAASUVORK5CYII=",
	},
	searchIconId: "phoneticSearchIcon",
	searchPopupId: "phoneticSearchPopup",
	init(){
		this.addCommonEvents();
	},
	createAndPositionPopup(data={searchText: "Unknown", ipaData:[]}) {
		document.getElementById(this.searchPopupId)?.remove();
		const popup = document.createElement('div');
		popup.id = this.searchPopupId;
		popup.style.cssText = `
        position: absolute;
        background-color: #ffffff;
        border: 1px solid #cccccc;
        border-radius: 8px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        padding: 0 15px;
        z-index: 1000;
        max-width: 300px;
        font-family: Arial, sans-serif;
    `;;
	
		const header = document.createElement('div');
		header.style.cssText = `
        font-weight: bold;
        font-size: 18px;
        margin-bottom: 10px;
    `;
		header.innerHTML = `<h3 style="color:red; margin-top:4px;">${data.searchText}</h3>`;
	
		const content = document.createElement('div');
		console.log(`Gelen veri: ${data.ipaData}`);
		content.innerHTML+= JSON.parse(data.ipaData).map((ipa) => `<img src="data:image/png;base64,${this.countryFlags[ipa.country]}" />: ${ipa.ipa_text}`).join('<br>');
	
		const footer = document.createElement('div');
		footer.style.cssText = `
        font-size: 12px;
        color: #888888;
        margin-top: 10px;
    `;
	
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
		button.style.cssText = `
        position: absolute;
        width: 32px;
        height: 32px;
        background-image: url('data:image/png;base64,${this.iconImageBase64Data}');
        background-size: 24px 24px;
        background-repeat: no-repeat;
        background-position: center;
        border: none;
        cursor: pointer;
        z-index: 1000;
        background-color: white;
        border-radius: 50%;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    `;
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
					let selectedTextOnly = selection.toString().trimEnd();
					sendMessageToBackground({action:'checkIPA', searchText:selectedTextOnly});
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
		chrome.runtime.sendMessage(data, response=>{
			console.log(response);
			return true;
		});
	}


}


phoneticPortal.init();


// Listen for messages from the background script
chrome.runtime.onMessage.addListener(function(request) {
	switch(request.action){
		case "createPopup":
			if (request.searchText.length < 1) {
				request.searchText = "No data found!";
			}
			phoneticPortal.createAndPositionPopup({searchText: request.searchText, ipaData: request.ipaData});
			break;
			case "straightMessage":
				console.log("Message: " + request.messageText);
				break;
	}
});

