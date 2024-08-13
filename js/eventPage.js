var menuItem = {
    "id":"vocipa",
    "title":"vocIPA",
    "contexts":["selection"]
};
chrome.contextMenus.removeAll(function() {
    chrome.contextMenus.create(menuItem);
    });



function fixedEncodeURI(str){
    return encodeURI(str).replace(/%5B/g, '[').replace(/%5D/g, ']')
}


chrome.contextMenus.onClicked.addListener(function(clickData){
    console.log("calisiyor");
    if(clickData.menuItemId === "vocipa" && clickData.selectionText){
        let vocIPAURL = "https://www.vocabulary.com/dictionary/autocomplete-ss?search="+fixedEncodeURI(clickData.selectionText);
        let response = fetch(vocIPAURL, {});
        response.then(function(response){
            return response.text();
        }).then(function(text){
            let theIPA = text.split(`data-ipa="`)[1].split(`"`)[0];
            console.log(theIPA)
                            // Send a message to the content script to create and position the popup
                            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                                chrome.tabs.sendMessage(tabs[0].id, { action: 'createPopup', text: theIPA });
                            });
        });

        
       
    }
});
