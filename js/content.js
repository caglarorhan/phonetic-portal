console.log('Content script loaded');

function createAndPositionPopup(text) {
	let popup = document.getElementById('selectionPopup');
	if (!popup) {
		popup = document.createElement('div');
		popup.id = 'selectionPopup';
		popup.style.position = 'absolute';
		popup.style.zIndex = '9999';
		popup.style.padding = '15px';
		popup.style.backgroundColor = '#ffffff'; // Assuming white background from index.css
		popup.style.color = '#000000'; // Assuming black text color from index.css
		popup.style.borderRadius = '10px'; // Assuming border radius from index.css
		popup.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)'; // Assuming box shadow from index.css
		popup.style.maxWidth = '300px';
		popup.style.fontSize = '16px';
		popup.style.lineHeight = '1.5';
		document.body.appendChild(popup);
	}
	popup.innerHTML = ''; // Clear previous content

	// Create and style header
	const header = document.createElement('div');
	header.textContent = 'Pronunciation';
	header.style.fontWeight = 'bold';
	header.style.marginBottom = '10px';
	header.style.fontSize = '18px'; // Assuming header font size from index.css

	// Create and style content
	const content = document.createElement('div');
	content.textContent = text;
	content.style.marginBottom = '10px';

	// Create and style footer
	const footer = document.createElement('div');
	footer.textContent = 'vocIPA';
	footer.style.textAlign = 'right';
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
		popup.style.top = `${rect.top - 120 + window.scrollY}px`;
		popup.style.left = `${rect.left + window.scrollX}px`;
	}
}

// Listen for messages from the background script
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	if (request.action === 'createPopup') {
		console.log("Mesaj geldi: " + request.text);
		if (request.text.length < 1) {
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