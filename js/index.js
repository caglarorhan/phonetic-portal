const phoneticPortal = {
    defaultIconPosition: 'top-center',
    async init() {
        this.addCommonEvents();
        this.getLastSearches();
    },
    addCommonEvents() {
        const allPlacementSelectorIcons = document.querySelectorAll('.symbolic-rectangle .icon');
        if (!localStorage.getItem('iconPlace')) {
            localStorage.setItem('iconPlace', this.defaultIconPosition);
        }
        const currentIconPlace = localStorage.getItem('iconPlace');
        document.querySelector(`.symbolic-rectangle [data-place=${currentIconPlace}]`).classList.add('selected');
        document.querySelector('.symbolic-rectangle').addEventListener('click', (e) => {
            allPlacementSelectorIcons.forEach(icon => icon.classList.remove('selected'));
            if ([...e.target.classList].includes('icon')) {
                e.target.classList.add('selected');
                const placeEl = document.querySelector(".selected-place");
                placeEl.textContent = '';
                placeEl.append('New place will be ');
                const strong = document.createElement('strong');
                strong.textContent = e.target.dataset.place;
                placeEl.appendChild(strong);
                placeEl.append(' of the selected word!');
                this.passIconPositionPlacementToBackground(e.target.dataset.place);
            }
        });

        // Event delegation on tab_2 container — survives innerHTML replacement
        document.querySelector('#tab_2').addEventListener('keyup', (e) => {
            if (e.target.classList.contains('search-in-history')) {
                const searchValue = e.target.value.toLowerCase();
                document.querySelectorAll('.search-result')
                    .forEach(searchResult => {
                        const textEl = searchResult.querySelector('.search-text');
                        searchResult.style.display = textEl && textEl.textContent.toLowerCase().includes(searchValue) ? '' : 'none';
                    });
            }
        });
    },
    passIconPositionPlacementToBackground(iconPlace) {
        chrome.runtime.sendMessage({ action: 'setIconPlacement', iconPlace: iconPlace });
        localStorage.setItem('iconPlace', iconPlace);
    },
    getLastSearches() {
        chrome.runtime.sendMessage({ action: 'getLastSearches' });
    }
};

document.addEventListener('DOMContentLoaded', function () {
    phoneticPortal.init();
    activateTabs();
    addFeedbackLinkListener();
});

function activateTabs() {
    const tabButtons = document.querySelectorAll('.tab-container .tab');
    tabButtons.forEach(tabButton => {
        tabButton.addEventListener('click', (event) => {
            openTab(event, tabButton.dataset.tab);
        });
    });
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
    const tabcontent = document.getElementsByClassName("tab-content");
    for (let i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
        tabcontent[i].classList.remove("active");
    }
    const tablinks = document.getElementsByClassName("tab");
    for (let i = 0; i < tablinks.length; i++) {
        tablinks[i].classList.remove("active");
        tablinks[i].setAttribute('aria-selected', 'false');
    }
    document.getElementById(tabName).style.display = "block";
    document.getElementById(tabName).classList.add("active");
    evt.currentTarget.classList.add("active");
    evt.currentTarget.setAttribute('aria-selected', 'true');

    // Lazy-load feedback iframe on first visit
    const tab = document.getElementById(tabName);
    const iframe = tab.querySelector('iframe[data-src]');
    if (iframe) {
        iframe.src = iframe.dataset.src;
        iframe.removeAttribute('data-src');
    }
}

// Helper to safely create text elements
function createTextElement(tag, className, text) {
    const el = document.createElement(tag);
    if (className) el.className = className;
    el.textContent = text;
    return el;
}

// Listener for messages from background script — uses safe DOM methods instead of innerHTML
chrome.runtime.onMessage.addListener((message) => {
    if (message.action === 'lastSearchResults') {
        const tab2 = document.querySelector('#tab_2');

        // Clear existing content safely
        tab2.textContent = '';

        // Create search input container
        const searchContainer = document.createElement('div');
        searchContainer.className = 'search-container';
        const searchInput = document.createElement('input');
        searchInput.type = 'text';
        searchInput.className = 'search-in-history';
        searchInput.placeholder = 'Search in history';
        searchContainer.appendChild(searchInput);
        tab2.appendChild(searchContainer);

        if (message.messageText.length === 0) {
            // Empty state
            const emptyState = document.createElement('div');
            emptyState.className = 'empty-state';
            const icon = createTextElement('div', 'empty-state-icon', '');
            icon.textContent = '\uD83D\uDD0D';
            const text = createTextElement('p', 'empty-state-text', 'No searches yet. Highlight a word on any page to get started.');
            emptyState.appendChild(icon);
            emptyState.appendChild(text);
            tab2.appendChild(emptyState);
        } else {
            // Render each search result
            message.messageText.forEach(search => {
                const resultDiv = document.createElement('div');
                resultDiv.className = 'search-result';

                const searchTextDiv = createTextElement('div', 'search-text', search.searchText);
                const ipaTextDiv = createTextElement('div', 'ipa-text', search.ipaText);

                const dialectDiv = document.createElement('div');
                dialectDiv.className = 'dialect-info';
                const flagImg = document.createElement('img');
                flagImg.src = search.countryCode === 'uk' ? './img/united-kingdom-flag.png' : './img/united-states-flag.png';
                flagImg.alt = search.countryCode.toUpperCase();
                flagImg.className = 'dialect-flag';
                dialectDiv.appendChild(flagImg);

                const dateObj = new Date(search.lastSearchDate);
                const date = dateObj.toLocaleDateString() + ' ' + dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
                const dateDiv = createTextElement('div', 'search-date', date);

                resultDiv.appendChild(searchTextDiv);
                resultDiv.appendChild(ipaTextDiv);
                resultDiv.appendChild(dialectDiv);
                resultDiv.appendChild(dateDiv);

                tab2.appendChild(resultDiv);
            });
        }
    }
});
