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
    if(clickData.menuItemId === "phonetic-portal" && clickData.selectionText){
        checkIPA({searchText:clickData.selectionText});
    }
});


function checkIPA(searchData={searchText:""}){
    if(searchData.searchText){
        let phoneticPortalURL = "https://www.vocabulary.com/dictionary/autocomplete-ss?search="+fixedEncodeURI(searchData.searchText);
        let response = fetch(phoneticPortalURL, {});
        response.then(function(response){
            return response.text();
        }).then(function(ipaText){
            let theIPA = ipaText.split(`data-ipa="`)[1].split(`"`)[0];
            console.log(theIPA)
            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                chrome.tabs.sendMessage(tabs[0].id, { action: 'straightMessage', messageText:"Mesaj backgrounda ulaştı!"});
            });
                            // Send a message to the content script to create and position the popup
                            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                                chrome.tabs.sendMessage(tabs[0].id, { action: 'createPopup', searchText: searchData.searchText, ipaText: theIPA});
                            });
        }).catch(function(error){
            console.log("Error: " + error);
        }); 
    }else{
        chrome.tabs.sendMessage(tabs[0].id, { action: 'straightMessage', messageText:"Search data icinde searchtext yok!"});
    }
}


// Listen for messages from content.js
chrome.runtime.onMessage.addListener((message) => {
    checkIPA({searchText:message.searchText});
});

