const phoneticPortal = {
    defaultIconPosition: 'top-center',
    previousSearches:{}, // {"us":{searchText: "hello", ipaText: "həˈloʊ"}, "uk":{searchText: "hello", ipaText: "həˈloʊ"}}
    languageOptions: {us:true, uk:true}, // {us:true, uk:true, au:false, ca:false, nz:false, za:false, ie:false, in:false, ph:false, sg:false}
    async init(){
        this.addCommonEvents();
        this.getLastSearches();
    },
    addCommonEvents(){
        let allPlacementSelectorIcons = document.querySelectorAll('.symbolic-rectangle .icon');
        if(!localStorage.getItem('iconPlace')){localStorage.setItem('iconPlace', this.defaultIconPosition)};
        let currentIconPlace = localStorage.getItem('iconPlace');
        document.querySelector(`.symbolic-rectangle [data-place=${currentIconPlace}]`).classList.add('selected');
        document.querySelector('.symbolic-rectangle').addEventListener('click', (e)=>{
            allPlacementSelectorIcons.forEach(icon => {icon.classList.remove('selected')})
            if([...e.target.classList].includes('icon')){
                e.target.classList.add('selected');
                // "top-left", middle-left", "bottom-left", "top-right", "middle-right", "bottom-right" gibi
                document.querySelector(".selected-place").innerHTML = "New place will be <strong>" + e.target.dataset.place + "</strong> of the selected word!";	
                this.passIconPositionPlacementToBackground(e.target.dataset.place);
            }
        })

        document.querySelector('#tab_2').addEventListener('keyup', (e) => {
          if (e.target.classList.contains('search-in-history')) {
            const searchValue = e.target.value.toLowerCase();
            document.querySelectorAll('.search-result')
              .forEach(searchResult => searchResult.style.display = searchResult.querySelector('.search-text').textContent.toLowerCase().includes(searchValue) ? '' : 'none');
          }
        });
    },
    passIconPositionPlacementToBackground(iconPlace){
        chrome.runtime.sendMessage({action: 'setIconPlacement', iconPlace: iconPlace});
        // and put it into localhost of extension
        localStorage.setItem('iconPlace', iconPlace);

    },
    getLastSearches(){
        let newLastSearchesButton = document.createElement('button');
        newLastSearchesButton.textContent = 'Get Last Searches';
        newLastSearchesButton.classList.add('get-last-searches');
        document.querySelector('#tab_2').appendChild(newLastSearchesButton);
        newLastSearchesButton.addEventListener('click', ()=>{
            chrome.runtime.sendMessage({action: 'getLastSearches'}, response => {
                console.log(response);
            })
        })
        chrome.runtime.sendMessage({action: 'getLastSearches'}, response =>{
            // console.log(response);
        })
    }
}

window.addEventListener('load', function() {
    phoneticPortal.init();
    activateTabs();
    addFeedbackLinkListener();
})

function activateTabs() {
    let tabButtons = document.querySelectorAll('.tab-container .tab');
    tabButtons.forEach(tabButton => {
        tabButton.addEventListener('click', (event)=>{
            openTab(event, tabButton.dataset.tab);
        })
    })
    document.querySelectorAll('.tab-container .tab')[0].click();
}

function addFeedbackLinkListener() {
    const feedbackLink = document.getElementById('feedback-link');
    if (feedbackLink) {
        feedbackLink.addEventListener('click', (event) => {
            event.preventDefault();
            const feedbackTabButton = document.querySelector('.tab[data-tab="tab_5"]');
            if (feedbackTabButton) {
                feedbackTabButton.click();
            }
        });
    }
}

function openTab(evt, tabName) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tab-content");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
        tabcontent[i].classList.remove("active");
    }
    tablinks = document.getElementsByClassName("tab");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].classList.remove("active");
    }
    document.getElementById(tabName).style.display = "block";
    document.getElementById(tabName).classList.add("active");
    evt.currentTarget.classList.add("active");
}

            // Listener for messages from background script
            chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
                if (message.action === 'lastSearchResults') {
                    console.log('Last 10 searches:', message.messageText);
                    // Handle the received data as needed
                    document.querySelector('#tab_2').innerHTML=`<div class="search-container">
    <input type="text" class="search-in-history" placeholder="Search in history">
</div>`;
                    
        let searchInHistoryInput = document.querySelector("#tab_2 input.search-in-history");
                     message.messageText.forEach(search => {
                        document.querySelector('#tab_2').innerHTML +=`
                        <div class="search-result">
                            <div class="search-text">${search.searchText}</div>
                            <div class="ipa-text">${search.ipaText}</div>
                            <div class="country-code">${search.countryCode}</div>
                            <div class="search-date">${search.lastSearchDate}</div>
                        </div>

                        
                        `  	
                     })
                }
            });
