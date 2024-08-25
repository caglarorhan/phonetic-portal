const phoneticPortal = {
    phoneticPortalURL:"https://www.vocabulary.com/dictionary/",
    dataBaseName: "PhoneticPortalDB",
    dataBaseVersion:1,
    storeName: "searches",
    sendMessageToContent(data){
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.tabs.sendMessage(tabs[0].id, data, (response) => {
                // do nothing
            });
        });

    },
    init(){
        chrome.contextMenus.removeAll(()=>{
            chrome.contextMenus.create(this.menuItem, () => {
                if (chrome.runtime.lastError) {
                } else {
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
    async checkIPA(searchData){
                if(searchData.searchText){
                    // if data is already in indexedDB, get it from there
                    let result = await this.getIPAFromIndexedDB(searchData.searchText);
                    if(result.length>0){
                        const transformedResult = result.map(item => ({
                            country: item.countryCode,
                            ipa_text: item.ipaText
                        }));
                        const filteredResult = transformedResult.filter((item,index,self)=>{
                            if(index===self.findIndex(t=>{
                                return t.ipa_text===item.ipa_text && t.country===item.country
                            }))
                            return true;
                        }
                        )
                        


                        //this.sendMessageToContent({ action: 'straightMessage', messageText: JSON.stringify(transformedResult)});
                        this.sendMessageToContent({ action: 'createPopup', searchText: searchData.searchText, ipaData: JSON.stringify(transformedResult)});
                        return;
                    }else{
                        this.sendMessageToContent({ action: 'straightMessage', messageText: `No data in IndexedDB!`});
                    // Else, fetch from the phonetic portal and add to indexedDB
                    let phoneticPortalURL = this.phoneticPortalURL + this.utils.fixedEncodeURI(searchData.searchText);
                    let response = fetch(phoneticPortalURL, {});
                    response.then((response)=>{
                        return response.text();
                    }).then((ipaText)=>{
                        let theIPA = this.utils.parseAndBack(ipaText);
                        if(theIPA.length!==0){
                            this.sendMessageToContent({ action: 'straightMessage', messageText: this.db?`IndexedDB is ready!`:`IndexedDB is not ready!`});
                            theIPA.forEach((ipa)=>{
                                this.addDataToIndexedDB({searchText: searchData.searchText, ipaText: ipa.ipa_text, countryCode: ipa.country});
                                this.sendMessageToContent({ action: 'straightMessage', messageText: JSON.stringify(theIPA)});
                            })
                        }

                        this.sendMessageToContent({ action: 'createPopup', searchText: searchData.searchText, ipaData: JSON.stringify(theIPA)});
                    }).catch((error)=>{
                        this.sendMessageToContent({ action: 'straightMessage', messageText: `Background script error!`});
                    }); 
                    }

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
    async getIPAFromIndexedDB(searchText) {
        return new Promise((resolve, reject) => {
            let request = indexedDB.open(this.dataBaseName, this.dataBaseVersion);

            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains(this.storeName)) {
                    db.createObjectStore(this.storeName, { keyPath: 'searchText' });
                }
            };

            request.onsuccess = (event) => {
                const db = event.target.result;
                const transaction = db.transaction([this.storeName], "readonly");
                const store = transaction.objectStore(this.storeName);
                const index = store.index("searchText");
                let query = index.getAll(searchText);

                query.onsuccess = (event) => {
                    const result = event.target.result;
                    resolve(result)
                };

                query.onerror = () => {
                    this.sendMessageToContent({ action: 'straightMessage', messageText: `Error retrieving data from IndexedDB!`});
                    reject();
                };
            }

            request.onerror = () => {
                this.sendMessageToContent({ action: 'straightMessage', messageText: `Error opening IndexedDB!`});
                reject();
            };
        });
    },
    utils:{
        fixedEncodeURI(str){
            return encodeURI(str).replace(/%5B/g, '[').replace(/%5D/g, ']')
        },
        parseAndBack(fullText){
            const ipaValues = [];
            if(!fullText.includes('<div class="ipa-section">')) return ipaValues;
            let ipa_1 = fullText.split('<div class="ipa-section">')[1].split('<h3>')[1].split('</h3>')[0];
            ipaValues.push({country:'us', ipa_text:ipa_1});
            let ipa_2 = fullText.split('<div class="ipa-section">')[1].split('<h3>')[2].split('</h3>')[0];
            (ipa_2.startsWith("/") && ipa_2.endsWith("/"))?ipaValues.push({country:'uk', ipa_text:ipa_2}):"";
            return ipaValues;
        }
    }
}

phoneticPortal.init();

// Listen for messages from content.js
chrome.runtime.onMessage.addListener((message) => {
    switch (message.action) {
        case "checkIPA":
            phoneticPortal.checkIPA({searchText:message.searchText});
            break;
        case "setLanguageOptions":
            phoneticPortal.sendMessageToContent({ action: 'straightMessage', messageText: message.languageOptions});
            // TODO: Save the language options to the indexedDB and use it from there
            break;
        case "straightMessage":
            //
            break;
    }
});

