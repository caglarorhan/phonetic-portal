var menuItem = {
    "id":"phonetic-portal",
    "title":"Phonetic Portal",
    "contexts":["selection"]
};
chrome.contextMenus.removeAll(function() {
    chrome.contextMenus.create(menuItem);
    });



function fixedEncodeURI(str){
    return encodeURI(str).replace(/%5B/g, '[').replace(/%5D/g, ']')
}


chrome.contextMenus.onClicked.addListener((clickData)=>{
    checkIPA(clickData)
});


function checkIPA(clickData){
    console.log("Works like a charm!");
    if(clickData.menuItemId === "phonetic-portal" && clickData.selectionText){
        let phoneticPortalURL = "https://www.vocabulary.com/dictionary/autocomplete-ss?search="+fixedEncodeURI(clickData.selectionText);
        let response = fetch(phoneticPortalURL, {});
        response.then(function(response){
            return response.text();
        }).then(function(text){
            let theIPA = text.split(`data-ipa="`)[1].split(`"`)[0];
            console.log(theIPA)
                            // Send a message to the content script to create and position the popup
                            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                                chrome.tabs.sendMessage(tabs[0].id, { action: 'createPopup', text: theIPA });
                            });
        }).catch(function(error){
            console.log("Error: " + error);
        }); 
    }
}


// Listen for messages from content.js
chrome.runtime.onMessage.addListener((message) => {
    checkIPA(message.text);
});

