const phoneticPortal = {
    phoneticPortalURL:"https://www.vocabulary.com/dictionary/",
    dataBaseName: "PhoneticPortalDB",
    dataBaseVersion:1,
    storeName: "searches",
    languageSelectionStoreName: "languageSelection",
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
                        let transformedResult = result.map(item => ({
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
                        transformedResult = await this.filterIPAResults(transformedResult);
                        this.sendMessageToContent({ action: 'createPopup', searchText: searchData.searchText, ipaData: JSON.stringify(transformedResult)});
                        return;
                    }else{
                        this.sendMessageToContent({ action: 'straightMessage', messageText: `No data in IndexedDB!`});
                    // Else, fetch from the phonetic portal and add to indexedDB
                    let phoneticPortalURL = this.phoneticPortalURL + this.utils.fixedEncodeURI(searchData.searchText);
                    let response = fetch(phoneticPortalURL, {});
                    response.then((response)=>{
                        return response.text();
                    }).then(async (ipaText)=>{
                        let theIPA = this.utils.parseAndBack(ipaText);
                        if(theIPA.length!==0){
                            this.sendMessageToContent({ action: 'straightMessage', messageText: this.db?`IndexedDB is ready!`:`IndexedDB is not ready!`});
                            theIPA.forEach((ipa)=>{
                                this.addDataToIndexedDB(this.storeName, {
                                    searchText: searchData.searchText,
                                     ipaText: ipa.ipa_text,
                                      countryCode: ipa.country,
                                       lastSearchDate: new Date().toISOString()});
                                this.sendMessageToContent({ action: 'straightMessage', messageText: JSON.stringify(theIPA)});
                            })
                        }
                        theIPA = await this.filterIPAResults(theIPA);
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

            let searchStore = this.db.createObjectStore(this.storeName, { keyPath: "id", autoIncrement: true });
            searchStore.createIndex("searchText", "searchText", { unique: false });

            let languageSelectionStore = this.db.createObjectStore(this.languageSelectionStoreName, { keyPath: "language", autoIncrement: false });
            languageSelectionStore.createIndex("language", "language", { unique: true });
        };

        request.onsuccess = (event) => {
            this.db = event.target.result;
            this.sendMessageToContent({ action: 'straightMessage', messageText: `IndexedDB initialized successfully!`});
        };

        request.onerror = () => {
            this.sendMessageToContent({ action: 'straightMessage', messageText: `Error initializing IndexedDB!`});
        };
    },
    addDataToIndexedDB(storeName, data) {
        let transaction = this.db.transaction([storeName], "readwrite");
        let objectStore = transaction.objectStore(storeName);
  
        let request = objectStore.add(data);

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
    putDataToIndexedDB(storeName, data) {
        let request = indexedDB.open(this.dataBaseName, this.dataBaseVersion);

        request.onsuccess = (event) => {
            this.db = event.target.result;
            let transaction = this.db.transaction([storeName], "readwrite");
            let objectStore = transaction.objectStore(storeName);
            objectStore.clear();
            for (let key in data) {
                objectStore.add({ language: key, selected: data[key] });
            }
        };

        request.onerror = () => {
            this.sendMessageToContent({ action: 'straightMessage', messageText: `Error opening IndexedDB!`});
        };
    },
    getLanguagesFromIndexedDB() {
        return new Promise((resolve, reject) => {
            let transaction = this.db.transaction(["languageSelection"], "readonly");
            let objectStore = transaction.objectStore("languageSelection");
            let request = objectStore.openCursor();
            let languages = [];
    
            request.onsuccess = (event) => {
                let cursor = event.target.result;
                if (cursor) {
                    languages.push(cursor.value);
                    cursor.continue();
                } else {
                    resolve(languages);
                }
            };
    
            request.onerror = (event) => {
                reject(`Error querying languageSelection store: ${event.target.errorCode}`);
            };
        });
    },
    async filterIPAResults(ipaResults){
        // burada ipa sonuclarini db den cekilan dil seceneklerine gore filtreleyip gonderecegiz.
        // ornegin, db de us ve uk secili ise, burada sadece us ve uk olanlari gonderecegiz.
        // bu durumda, ipaResults arrayindeki her bir elemani, db den cekilen dil seceneklerine gore filtreleyip
        // yeni bir array olusturup, onu dondurecegiz.
        // Ornek ipaResults: [{"country":"us","ipa_text":"/əˈspaɪrɪŋ/"},{"country":"uk","ipa_text":"/æˈspaɪərɪŋ/"}]
        // Ornek languages:  [{"language":"uk","selected":true},{"language":"us","selected":true}]
        let languages = await this.getLanguagesFromIndexedDB();
        ipaResults = ipaResults.filter((ipaResult) => {
            const languageSetting = languages.find(languageSetting => languageSetting.language === ipaResult.country);
            return languageSetting && languageSetting.selected;
        });
        this.sendMessageToContent({ action: 'straightMessage', messageText: JSON.stringify(ipaResults)});
        return ipaResults;
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
           // {"us":true,"uk":true}
                phoneticPortal.putDataToIndexedDB(phoneticPortal.languageSelectionStoreName, JSON.parse(message.languageOptions));
            break;
        case "straightMessage":
            //
            break;
    }
});

