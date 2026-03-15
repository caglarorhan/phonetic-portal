const phoneticPortal = {
    phoneticPortalURL: "https://www.vocabulary.com/dictionary/",
    dataBaseName: "PhoneticPortalDB",
    dataBaseVersion: 1,
    storeName: "searches",
    languageSelectionStoreName: "languageSelection",
    iconPlacementStoreName: "iconPlacement",
    notFoundCache: new Set(),
    menuItem: {
        "id": "phonetic-portal",
        "title": "Phonetic Portal",
        "contexts": ["selection"]
    },
    async init() {
        chrome.contextMenus.removeAll(() => {
            chrome.contextMenus.create(this.menuItem, () => {
                if (chrome.runtime.lastError) {
                    console.error('Context menu creation failed:', chrome.runtime.lastError.message);
                }
            });
        });
        chrome.contextMenus.onClicked.addListener((info) => {
            if (info.menuItemId === this.menuItem.id) {
                this.checkIPA({ searchText: info.selectionText });
            }
        });
        try {
            await this.initIndexedDB();
            this.initDefaultLanguageOptions();
        } catch (error) {
            console.error('Error initializing extension:', error);
        }
    },
    initIndexedDB() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dataBaseName, this.dataBaseVersion);

            request.onupgradeneeded = (event) => {
                this.db = event.target.result;

                const searchStore = this.db.createObjectStore(this.storeName, { keyPath: "id", autoIncrement: true });
                searchStore.createIndex("searchText", "searchText", { unique: false });

                const languageSelectionStore = this.db.createObjectStore(this.languageSelectionStoreName, { keyPath: "language", autoIncrement: false });
                languageSelectionStore.createIndex("language", "language", { unique: true });

                this.db.createObjectStore(this.iconPlacementStoreName, { keyPath: "id", autoIncrement: false });
            };

            request.onsuccess = (event) => {
                this.db = event.target.result;
                resolve();
            };

            request.onerror = (event) => {
                reject(`Error initializing IndexedDB: ${event.target.error}`);
            };
        });
    },
    sendMessageToContent(data) {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs.length > 0 && tabs[0].id !== undefined) {
                chrome.tabs.sendMessage(tabs[0].id, data);
            }
        });
    },
    initDefaultLanguageOptions() {
        const languageOptions = [
            { language: "us", selected: true },
            { language: "uk", selected: true }
        ];
        languageOptions.forEach((languageOption) => {
            this.putDataToIndexedDB(this.languageSelectionStoreName, languageOption);
        });
    },
    async checkIPA(searchData) {
        if (!searchData.searchText) {
            return;
        }

        // Skip words previously not found (avoids repeated failed network requests)
        if (this.notFoundCache.has(searchData.searchText.toLowerCase())) {
            this.sendMessageToContent({
                action: 'createPopup',
                searchText: searchData.searchText,
                ipaData: JSON.stringify([])
            });
            return;
        }

        // Check IndexedDB cache first
        const result = await this.getIPAFromIndexedDB(searchData.searchText);
        if (result.length > 0) {
            // Deduplicate results
            let transformedResult = result.map(item => ({
                country: item.countryCode,
                ipa_text: item.ipaText
            }));
            transformedResult = transformedResult.filter((item, index, self) =>
                index === self.findIndex(t => t.ipa_text === item.ipa_text && t.country === item.country)
            );

            transformedResult = await this.filterIPAResults(transformedResult);
            this.sendMessageToContent({
                action: 'createPopup',
                searchText: searchData.searchText,
                ipaData: JSON.stringify(transformedResult)
            });
            return;
        }

        // Fetch from vocabulary.com
        try {
            const phoneticPortalURL = this.phoneticPortalURL + this.utils.fixedEncodeURI(searchData.searchText);
            const response = await fetch(phoneticPortalURL);
            const htmlText = await response.text();
            let theIPA = this.utils.parseAndBack(htmlText);

            if (theIPA.length > 0) {
                // Batch write all IPA entries in a single transaction
                const transaction = this.db.transaction([this.storeName], "readwrite");
                const store = transaction.objectStore(this.storeName);
                theIPA.forEach((ipa) => {
                    store.add({
                        searchText: searchData.searchText,
                        ipaText: ipa.ipa_text,
                        countryCode: ipa.country,
                        lastSearchDate: new Date().toISOString()
                    });
                });
            } else {
                // Cache not-found words in memory to avoid repeated network requests
                this.notFoundCache.add(searchData.searchText.toLowerCase());
            }

            theIPA = await this.filterIPAResults(theIPA);
            this.sendMessageToContent({
                action: 'createPopup',
                searchText: searchData.searchText,
                ipaData: JSON.stringify(theIPA)
            });
        } catch (error) {
            console.error('Error fetching IPA data:', error);
            this.sendMessageToContent({
                action: 'createPopup',
                searchText: searchData.searchText,
                ipaData: JSON.stringify([])
            });
        }
    },
    addDataToIndexedDB(storeName, data) {
        const transaction = this.db.transaction([storeName], "readwrite");
        const objectStore = transaction.objectStore(storeName);
        objectStore.add(data);
    },
    getIPAFromIndexedDB(searchText) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([this.storeName], "readonly");
            const store = transaction.objectStore(this.storeName);
            const index = store.index("searchText");
            const query = index.getAll(searchText);

            query.onsuccess = (event) => {
                resolve(event.target.result);
            };

            query.onerror = (event) => {
                reject(`Error retrieving data from IndexedDB: ${event.target.error}`);
            };
        });
    },
    putDataToIndexedDB(storeName, data) {
        const transaction = this.db.transaction([storeName], "readwrite");
        const objectStore = transaction.objectStore(storeName);
        objectStore.put(data);
    },
    getDataFromIndexedDB(storeName, key) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([storeName], "readonly");
            const objectStore = transaction.objectStore(storeName);
            const query = objectStore.get(key);

            query.onsuccess = (event) => {
                resolve(event.target.result);
            };

            query.onerror = (event) => {
                reject(`Error querying ${storeName} store: ${event.target.error}`);
            };
        });
    },
    getLanguagesFromIndexedDB() {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(["languageSelection"], "readonly");
            const objectStore = transaction.objectStore("languageSelection");
            const request = objectStore.openCursor();
            const languages = [];

            request.onsuccess = (event) => {
                const cursor = event.target.result;
                if (cursor) {
                    languages.push(cursor.value);
                    cursor.continue();
                } else {
                    resolve(languages);
                }
            };

            request.onerror = (event) => {
                reject(`Error querying languageSelection store: ${event.target.error}`);
            };
        });
    },
    getLastSearchesFromIndexedDB() {
        return new Promise((resolve, reject) => {
            if (!this.db) {
                reject('Database not initialized');
                return;
            }

            const transaction = this.db.transaction(["searches"], "readonly");
            const objectStore = transaction.objectStore("searches");
            const request = objectStore.openCursor(null, 'prev');
            const searches = [];

            request.onsuccess = (event) => {
                const cursor = event.target.result;
                if (cursor && searches.length < 100) {
                    searches.push(cursor.value);
                    cursor.continue();
                } else {
                    resolve(searches);
                }
            };

            request.onerror = (event) => {
                reject(`Error querying searches store: ${event.target.error}`);
            };
        });
    },
    async filterIPAResults(ipaResults) {
        // Filter IPA results based on user's language selection preferences
        const languages = await this.getLanguagesFromIndexedDB();
        return ipaResults.filter((ipaResult) => {
            const languageSetting = languages.find(ls => ls.language === ipaResult.country);
            return languageSetting && languageSetting.selected;
        });
    },
    utils: {
        fixedEncodeURI(str) {
            return encodeURI(str).replace(/%5B/g, '[').replace(/%5D/g, ']');
        },
        parseAndBack(fullText) {
            const ipaValues = [];
            if (!fullText.includes('<div class="ipa-section">')) return ipaValues;

            try {
                const splittedFullText = fullText.split('<span class="span-replace-h3">');
                if (splittedFullText.length < 2) return ipaValues;

                const ipa_1 = splittedFullText[1].split('</span>')[0];
                ipaValues.push({ country: 'us', ipa_text: ipa_1 });

                if (splittedFullText.length >= 3) {
                    const ipa_2 = splittedFullText[2].split('</span>')[0].replace(/\s+/g, '');
                    if (ipa_2.startsWith("/") && ipa_2.endsWith("/")) {
                        ipaValues.push({ country: 'uk', ipa_text: ipa_2 });
                    }
                }
            } catch (error) {
                console.error('Error parsing IPA data from response:', error);
            }

            return ipaValues;
        }
    }
};

phoneticPortal.init();

// Listen for messages from content.js and popup
chrome.runtime.onMessage.addListener((message) => {
    switch (message.action) {
        case "checkIPA":
            phoneticPortal.checkIPA({ searchText: message.searchText });
            break;
        case "setLanguageOptions": {
            const data = JSON.parse(message.languageOptions);
            Object.keys(data).forEach((key) => {
                phoneticPortal.putDataToIndexedDB(
                    phoneticPortal.languageSelectionStoreName,
                    { language: key, selected: data[key] }
                );
            });
            break;
        }
        case "getLastSearches":
            phoneticPortal.getLastSearchesFromIndexedDB().then((result) => {
                chrome.runtime.sendMessage({ action: 'lastSearchResults', messageText: result });
            });
            break;
        case "setIconPlacement":
            phoneticPortal.putDataToIndexedDB(
                phoneticPortal.iconPlacementStoreName,
                { id: 1, place: message.iconPlace }
            );
            break;
        case "getIconPositionSetting":
            phoneticPortal.getDataFromIndexedDB(phoneticPortal.iconPlacementStoreName, 1)
                .then((result) => {
                    phoneticPortal.sendMessageToContent({ action: 'setIconPosition', position: result });
                });
            break;
    }
    return false;
});
