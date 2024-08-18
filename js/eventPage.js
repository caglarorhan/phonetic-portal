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
        //let phoneticPortalURL = "https://www.vocabulary.com/dictionary/autocomplete-ss?search="+fixedEncodeURI(searchData.searchText); // SOLUTION_1
        let phoneticPortalURL = "https://www.vocabulary.com/dictionary/"+fixedEncodeURI(searchData.searchText); // SOLUTION_2
        let response = fetch(phoneticPortalURL, {});
        response.then(function(response){
            return response.text();
        }).then(function(ipaText){

            //let theIPA = ipaText.split(`data-ipa="`)[1].split(`"`)[0]; // SOLUTION_1
            let theIPA = parseAndBack(ipaText) // SOLUTION_2
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

function parseAndBack(fullText){
    // <div class="ipa-section"> [1]
    // <h3> [1] sonra </h3> ve [0] -> US degeri
    // <h3> [2] sonra </h3> ve [0] -> UK degeri
    let ipa_1 = fullText.split('<div class="ipa-section">')[1].split('<h3>')[1].split('</h3>')[0];
    let ipa_2 = fullText.split('<div class="ipa-section">')[1].split('<h3>')[2].split('</h3>')[0];
    return [ipa_1, ipa_2];
}


// Listen for messages from content.js
chrome.runtime.onMessage.addListener((message) => {
    checkIPA({searchText:message.searchText});
});

