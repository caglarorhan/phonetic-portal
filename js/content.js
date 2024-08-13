console.log('Content script loaded');
function createAndPositionPopup(text) {
	let popup = document.getElementById('selectionPopup');
	if (!popup) {
		popup = document.createElement('div');
		popup.id = 'selectionPopup';
		popup.style.position = 'absolute';
		popup.style.zIndex = '9999';
		popup.style.padding = '5px';
		popup.style.background = 'rgba(255, 255, 255, 0.8)';
		popup.style.border = '1px solid #ccc';
		document.body.appendChild(popup);
	}
	popup.innerText = text;
    // Get the coordinates of the selected text
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        popup.style.top = `${rect.top-40 + window.scrollY}px`;
        popup.style.left = `${rect.left + window.scrollX}px`;
    }
}

// Listen for messages from the background script
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	if (request.action === 'createPopup') {
        console.log("Mesaj geldi: "+request.text);
        if(request.text.length<1){
            request.text = "No data found";
        }
		createAndPositionPopup(request.text);
		sendResponse({ status: 'Popup created' });
	}
});

// Remove the popup when the user clicks somewhere else
document.addEventListener('click', function() {
    const selection = window.getSelection();
    if (selection.isCollapsed) {
        let popup = document.getElementById('selectionPopup');
        if (popup) {
            popup.remove();
        }
    }
});