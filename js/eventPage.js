const phoneticPortal = {
    phoneticPortalURL:"https://www.vocabulary.com/dictionary/",
    dataBaseName: "PhoneticPortalDB",
    dataBaseVersion:1,
    storeName: "searches",
    sendMessageToContent(data){
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.tabs.sendMessage(tabs[0].id, data);
        });

    },
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
    checkIPA(searchData){
        let anyStoredData = this.getIPAFromIndexedDB(searchData.searchText);
        this.sendMessageToContent({ action: 'straightMessage', messageText: JSON.stringify(anyStoredData)});
        if(anyStoredData){
            
            this.sendMessageToContent({ action: 'createPopup', searchText: searchData.searchText, ipaData: anyStoredData});
            return;
        }
        if(searchData.searchText){
            let phoneticPortalURL = this.phoneticPortalURL + this.utils.fixedEncodeURI(searchData.searchText);
            let response = fetch(phoneticPortalURL, {});
            response.then((response)=>{
                return response.text();
            }).then((ipaText)=>{
                let theIPA = this.utils.parseAndBack(ipaText);
                this.sendMessageToContent({ action: 'straightMessage', messageText: this.db?`IndexedDB is ready!`:`IndexedDB is not ready!`});

                theIPA.forEach((ipa)=>{
                    this.addDataToIndexedDB({searchText: searchData.searchText, ipaText: ipa.ipa_text, countryCode: ipa.country});
                })
                this.sendMessageToContent({ action: 'createPopup', searchText: searchData.searchText, ipaData: theIPA});
            }).catch((error)=>{
                this.sendMessageToContent({ action: 'straightMessage', messageText: `Background script error!`});
            }); 
        }else{
            this.sendMessageToContent({ action: 'straightMessage', messageText:"There is no text to search!"});
        }
    },
    initIndexedDB() {
        let request = indexedDB.open(this.dataBaseName, this.dataBaseVersion);

        request.onupgradeneeded = (event) => {
            this.db = event.target.result;
            let objectStore = this.db.createObjectStore(this.storeName, { keyPath: "id", autoIncrement: true });
            objectStore.createIndex("searchText", "searchText", { unique: false });
        };

        request.onsuccess = (event) => {
            this.db = event.target.result;
            this.sendMessageToContent({ action: 'straightMessage', messageText: `IndexedDB initialized successfully!`});
        };

        request.onerror = () => {
            this.sendMessageToContent({ action: 'straightMessage', messageText: `Error initializing IndexedDB!`});
        };
    },
    addDataToIndexedDB(data) {
        let transaction = this.db.transaction([this.storeName], "readwrite");
        let objectStore = transaction.objectStore(this.storeName);
  
        let request = objectStore.add({ searchText: data.searchText, ipaText: data.ipaText, countryCode: data.countryCode });

        request.onsuccess = () => {
            this.sendMessageToContent({ action: 'straightMessage', messageText: `Data added to IndexedDB successfully.`});
        };

        request.onerror = (event) => {
           this.sendMessageToContent({ action: 'straightMessage', messageText: `Error adding data to IndexedDB!`});
        };
    },
    getIPAFromIndexedDB(searchText) {
        const request = indexedDB.open(this.dataBaseName, this.dataBaseVersion);
        request.onsuccess = (event) => {
            const db = event.target.result;
            const transaction = db.transaction([this.storeName], "readonly");
            const store = transaction.objectStore(this.storeName);
            const index = store.index("searchText");
            let query = index.getAll(searchText);

            query.onsuccess = (event) => {
                const result = event.target.result;
                if (result) {
                    return event.target.result;
                } else {
                    return null;
                }
            };

            query.onerror = (event) => {
                this.sendMessageToContent({ action: 'straightMessage', messageText: `Error retrieving data from IndexedDB!`});
            };
        }

        request.onerror = (event) => {
            this.sendMessageToContent({ action: 'straightMessage', messageText: `Error opening IndexedDB!`});
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

