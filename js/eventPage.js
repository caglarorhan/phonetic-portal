const phoneticPortal = {
    phoneticPortalURL:"https://www.vocabulary.com/dictionary/",
    init(){
        chrome.contextMenus.removeAll(()=>{
            console.log("All context menus removed.");
            chrome.contextMenus.create(this.menuItem, () => {
                if (chrome.runtime.lastError) {
                    console.error("Error creating context menu:", chrome.runtime.lastError);
                } else {
                    console.log("Context menu item created successfully.");
                }
            });
            });
        chrome.contextMenus.onClicked.addListener((info, tab) => {
            if (info.menuItemId === this.menuItem.id) {
                this.checkIPA({searchText:info.selectionText});
            }
        });
       this.initIndexedDB();
    },
    menuItem: {
        "id":"phonetic-portal",
        "title":"Phonetic Portal",
        "contexts":["selection"]
    },
    checkIPA(searchData={searchText:""}){
        let anyStoredData = this.getIPAFromIndexedDB(searchData.searchText);
        if(anyStoredData){
            this.sendMessageToContent({ action: 'createPopup', searchText: searchData.searchText, ipaText: anyStoredData});
            return;
        }
        if(searchData.searchText){
            let phoneticPortalURL = this.phoneticPortalURL + this.utils.fixedEncodeURI(searchData.searchText);
            let response = fetch(phoneticPortalURL, {});
            response.then((response)=>{
                return response.text();
            }).then((ipaText)=>{
                let theIPA = this.utils.parseAndBack(ipaText);
                this.sendMessageToContent({ action: 'straightMessage', messageText: theIPA});
                theIPA.forEach((ipa)=>{
                    //this.addDataToIndexedDB({searchText: searchData.searchText, ipaText: ipa.ipa_text, countryCode: ipa.country});
                })
                this.sendMessageToContent({ action: 'createPopup', searchText: searchData.searchText, ipaData: theIPA});
            }).catch((error)=>{
                this.sendMessageToContent({ action: 'straightMessage', messageText: `Background script error!`});
            }); 
        }else{
            this.sendMessageToContent({ action: 'straightMessage', messageText:"There is no text to search!"});
        }
    },
    sendMessageToContent(data={action: 'checkIPA', searchText: ''}){
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.tabs.sendMessage(tabs[0].id, data);
        });

    },
    initIndexedDB() {
        let request = indexedDB.open("PhoneticPortalDB", 1);

        request.onupgradeneeded = (event) => {
            let db = event.target.result;
            let objectStore = db.createObjectStore("searches", { keyPath: "id", autoIncrement: true });
            objectStore.createIndex("searchText", "searchText", { unique: false });
            objectStore.createIndex("ipaText", "ipaText", { unique: false });
            objectStore.createIndex("countryCode", "countryCode", { unique: false });
        };

        request.onsuccess = (event) => {
            this.db = event.target.result;
            //this.sendMessageToContent({ action: 'straightMessage', messageText: `IndexedDB initialized successfully!`});
        };

        request.onerror = (event) => {
            //this.sendMessageToContent({ action: 'straightMessage', messageText: `Error initializing IndexedDB!`});
        };
    },
    addDataToIndexedDB(data={searchText:"", ipaText:"", countryCode:""}) {
        let transaction = this.db.transaction(["searches"], "readwrite");
        let objectStore = transaction.objectStore("searches");
        let request = objectStore.add({ searchText: searchText, ipaText: ipaText, countryCode: countryCode });

        request.onsuccess = () => {
            //this.sendMessageToContent({ action: 'straightMessage', messageText: `Data added to IndexedDB successfully.`});
        };

        request.onerror = (event) => {
           // this.sendMessageToContent({ action: 'straightMessage', messageText: `Error adding data to IndexedDB!`});
        };
    },
    getIPAFromIndexedDB(searchText) {
        let transaction = this.db.transaction(["searches"], "readonly");
        let objectStore = transaction.objectStore("searches");
        let index = objectStore.index("searchText");
        let request = index.getAll(searchText);

        request.onsuccess = (event) => {
            if (event.target.result.length > 0) {
                return event.target.result;
            } else {
                return null;
            }
        };

        request.onerror = (event) => {
            this.sendMessageToContent({ action: 'straightMessage', messageText: `Error retrieving data from IndexedDB!`});
            callback([]);
        };
    },
    utils:{
        fixedEncodeURI(str){
            return encodeURI(str).replace(/%5B/g, '[').replace(/%5D/g, ']')
        },
        parseAndBack(fullText){
            let ipa_1 = fullText.split('<div class="ipa-section">')[1].split('<h3>')[1].split('</h3>')[0];
            let ipa_2 = fullText.split('<div class="ipa-section">')[1].split('<h3>')[2].split('</h3>')[0];
            return [
                {country:'us', ipa_text:ipa_1},
                {country:'uk', ipa_text:ipa_2}
            ];
        }
    }
}

phoneticPortal.init();

// Listen for messages from content.js
chrome.runtime.onMessage.addListener((message) => {
    phoneticPortal.checkIPA({searchText:message.searchText});
});

