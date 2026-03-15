// IPA phoneme classification for color-coding
const IPA_VOWELS = new Set([
    'i', 'y', 'ɨ', 'ʉ', 'ɯ', 'u', 'ɪ', 'ʏ', 'ʊ',
    'e', 'ø', 'ɘ', 'ɵ', 'ɤ', 'o', 'ə',
    'ɛ', 'œ', 'ɜ', 'ɞ', 'ʌ', 'ɔ',
    'æ', 'ɐ', 'a', 'ɶ', 'ɑ', 'ɒ',
    'ĩ', 'ũ', 'ɛ̃', 'ɔ̃', 'ã',
]);

const IPA_SUPRASEGMENTALS = new Set(['ˈ', 'ˌ', 'ː', '/', '.', '|', '‖']);

// Multi-char phonemes matched longest-first
const MULTI_CHAR_PHONEMES = ['t͡ʃ', 'd͡ʒ', 'tʃ', 'dʒ', 'aɪ', 'aʊ', 'eɪ', 'oʊ', 'ɔɪ', 'ɪə', 'eə', 'ʊə'];


const COUNTRY_FLAG_URLS = {
    us: chrome.runtime.getURL('img/united-states-flag.png'),
    uk: chrome.runtime.getURL('img/united-kingdom-flag.png')
};

const SHADOW_STYLES = `
    :host {
        all: initial;
        position: absolute;
        z-index: 2147483647;
    }
    .pp-portal {
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        background: #0f172a;
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 12px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(168, 85, 247, 0.1);
        color: #f1f5f9;
        width: auto;
        min-width: 200px;
        max-width: 400px;
        overflow: hidden;
        font-size: 14px;
        line-height: 1.4;
    }
    .pp-header {
        padding: 14px 18px 10px;
        position: relative;
    }
    .pp-header::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 18px;
        right: 18px;
        height: 1px;
        background: linear-gradient(90deg, transparent, #a855f7, #ec4899, transparent);
    }
    .pp-word {
        font-size: 18px;
        font-weight: 700;
        color: #f1f5f9;
    }
    .pp-content {
        padding: 12px 18px;
        display: flex;
        flex-direction: column;
        gap: 10px;
    }
    .pp-dialect {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 6px 8px;
        border-radius: 6px;
        transition: background 0.15s ease;
    }
    .pp-dialect:hover {
        background: rgba(168, 85, 247, 0.08);
    }
    .pp-colon {
        color: #475569;
        margin-right: 2px;
    }
    .pp-flag {
        width: 22px;
        height: 16px;
        object-fit: cover;
        border-radius: 2px;
        flex-shrink: 0;
    }
    .pp-ipa {
        font-size: 17px;
        letter-spacing: 0.5px;
    }
    .pp-vowel { color: #60a5fa; }
    .pp-consonant { color: #4ade80; }
    .pp-supra { color: #a855f7; }
    .pp-phoneme {
        position: relative;
        cursor: default;
        border-radius: 3px;
        padding: 0 1px;
        transition: background 0.15s ease;
    }
    .pp-footer {
        padding: 8px 18px;
        font-size: 11px;
        color: #475569;
        text-align: right;
        border-top: 1px solid rgba(255, 255, 255, 0.05);
    }

    /* Loading shimmer */
    .pp-shimmer-area {
        padding: 12px 18px;
        display: flex;
        flex-direction: column;
        gap: 10px;
    }
    .pp-shimmer-block {
        background: #1e293b;
        border-radius: 8px;
        height: 42px;
        position: relative;
        overflow: hidden;
    }
    .pp-shimmer-block::after {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(168, 85, 247, 0.08), transparent);
        animation: pp-shimmer 1.5s infinite;
    }
    @keyframes pp-shimmer {
        100% { left: 100%; }
    }

    /* Header with ? button */
    .pp-header-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
    .pp-help-btn {
        width: 22px;
        height: 22px;
        border-radius: 50%;
        border: 1px solid rgba(255, 255, 255, 0.15);
        background: rgba(255, 255, 255, 0.05);
        color: #94a3b8;
        font-size: 12px;
        font-weight: 600;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.15s ease;
        flex-shrink: 0;
    }
    .pp-help-btn:hover {
        background: rgba(168, 85, 247, 0.15);
        border-color: #a855f7;
        color: #a855f7;
    }

    /* Color legend (toggled by ? button) */
    .pp-legend {
        display: none;
        padding: 8px 18px 4px;
        font-size: 12px;
        color: #94a3b8;
        border-top: 1px solid rgba(255, 255, 255, 0.05);
    }
    .pp-legend.visible {
        display: block;
    }
    .pp-legend-title {
        font-weight: 600;
        margin-bottom: 6px;
        color: #cbd5e1;
    }
    .pp-legend-items {
        display: flex;
        flex-direction: column;
        gap: 3px;
    }
    .pp-legend-item {
        display: flex;
        align-items: center;
        gap: 8px;
    }
    .pp-legend-dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        flex-shrink: 0;
    }


    /* Header button group */
    .pp-header-btns {
        display: flex;
        align-items: center;
        gap: 6px;
    }

    /* Pin button */
    .pp-pin-btn {
        width: 22px;
        height: 22px;
        border-radius: 50%;
        border: 1px solid rgba(255, 255, 255, 0.15);
        background: rgba(255, 255, 255, 0.05);
        color: #94a3b8;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.15s ease;
        flex-shrink: 0;
        padding: 0;
    }
    .pp-pin-btn:hover {
        background: rgba(168, 85, 247, 0.15);
        border-color: #a855f7;
        color: #a855f7;
    }
    .pp-pin-btn svg {
        width: 12px;
        height: 12px;
        fill: currentColor;
    }
    .pp-pin-btn.active {
        background: rgba(239, 68, 68, 0.15);
        border-color: #ef4444;
        color: #ef4444;
    }
    .pp-pin-btn.active:hover {
        background: rgba(239, 68, 68, 0.25);
    }

    /* Copy button */
    .pp-copy-btn {
        width: 20px;
        height: 20px;
        border-radius: 4px;
        border: none;
        background: transparent;
        color: #475569;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.15s ease;
        flex-shrink: 0;
        padding: 0;
        margin-left: auto;
    }
    .pp-copy-btn:hover {
        background: rgba(168, 85, 247, 0.15);
        color: #a855f7;
    }
    .pp-copy-btn svg {
        width: 14px;
        height: 14px;
        fill: none;
        stroke: currentColor;
        stroke-width: 2;
        stroke-linecap: round;
        stroke-linejoin: round;
    }
    .pp-copy-btn.copied {
        color: #4ade80;
        gap: 3px;
        width: auto;
    }
    .pp-copy-btn .pp-copied-text {
        font-size: 10px;
        font-weight: 600;
        letter-spacing: 0.3px;
    }

    /* Error state */
    .pp-error {
        padding: 12px 18px;
        color: #f87171;
        font-size: 14px;
    }
    .pp-error-hint {
        padding: 0 18px 12px;
        font-size: 12px;
        color: #64748b;
    }
`;

const phoneticPortal = {
    defaultIconPosition: 'top-center',
    iconUrl: chrome.runtime.getURL('img/phonetic-portal-128.png'),
    searchIconId: 'phoneticSearchIcon',
    shadowHost: null,
    shadowRoot: null,
    isPinned: false,

    init() {
        this.createIconStyles();
        this.addCommonEvents();
        this.getIconPositionSettingFromBackground();
    },

    // Icon styles stay in the main DOM (simple, no conflict risk)
    createIconStyles() {
        const style = document.createElement('style');
        style.textContent = `
            button.phonetic-search-icon {
                position: absolute;
                width: 32px;
                height: 32px;
                background-repeat: no-repeat;
                background-position: center;
                background-size: 28px;
                border: none;
                cursor: pointer;
                z-index: 2147483646;
                background-color: white;
                border-radius: 10%;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
            }
        `;
        document.head.appendChild(style);
    },

    // Tokenize IPA text into classified spans
    tokenizeIPA(text) {
        const tokens = [];
        let i = 0;
        while (i < text.length) {
            // Try multi-char phonemes first (longest match)
            let matched = false;
            for (const multi of MULTI_CHAR_PHONEMES) {
                if (text.startsWith(multi, i)) {
                    // Diphthongs and affricates: classify by first char
                    const isVowel = IPA_VOWELS.has(multi[0]);
                    tokens.push({ text: multi, type: isVowel ? 'vowel' : 'consonant' });
                    i += multi.length;
                    matched = true;
                    break;
                }
            }
            if (matched) continue;

            const ch = text[i];
            if (IPA_SUPRASEGMENTALS.has(ch)) {
                tokens.push({ text: ch, type: 'supra' });
            } else if (IPA_VOWELS.has(ch)) {
                tokens.push({ text: ch, type: 'vowel' });
            } else if (ch === ' ') {
                tokens.push({ text: ch, type: 'supra' });
            } else {
                tokens.push({ text: ch, type: 'consonant' });
            }
            i++;
        }
        return tokens;
    },

    // Build color-coded IPA element with hover descriptions
    buildColoredIPA(ipaText) {
        const container = document.createElement('span');
        container.className = 'pp-ipa';
        const tokens = this.tokenizeIPA(ipaText);
        for (const token of tokens) {
            const span = document.createElement('span');
            span.className = `pp-${token.type}`;
            span.textContent = token.text;
            container.appendChild(span);
        }
        return container;
    },

    // Remove existing portal
    removePortal() {
        this.shadowHost?.remove();
        this.shadowHost = null;
        this.shadowRoot = null;
        this.isPinned = false;
    },

    createAndPositionPopup(data = { searchText: 'Unknown', ipaData: '[]', loading: false }) {
        this.removePortal();

        // Create shadow DOM host
        const host = document.createElement('div');
        host.id = 'phonetic-portal-host';
        const shadow = host.attachShadow({ mode: 'closed' });

        // Inject styles
        const style = document.createElement('style');
        style.textContent = SHADOW_STYLES;
        shadow.appendChild(style);

        // Build portal card
        const portal = document.createElement('div');
        portal.className = 'pp-portal';

        // Header with word and ? button
        const header = document.createElement('div');
        header.className = 'pp-header';
        const headerRow = document.createElement('div');
        headerRow.className = 'pp-header-row';
        const word = document.createElement('div');
        word.className = 'pp-word';
        word.textContent = data.searchText;
        headerRow.appendChild(word);
        header.appendChild(headerRow);
        portal.appendChild(header);

        if (data.loading) {
            // Shimmer loading state
            const shimmerArea = document.createElement('div');
            shimmerArea.className = 'pp-shimmer-area';
            for (let i = 0; i < 2; i++) {
                const block = document.createElement('div');
                block.className = 'pp-shimmer-block';
                shimmerArea.appendChild(block);
            }
            portal.appendChild(shimmerArea);
        } else {
            const ipaDataArray = JSON.parse(data.ipaData);
            if (ipaDataArray.length === 0) {
                // Error / no data state
                const error = document.createElement('div');
                error.className = 'pp-error';
                error.textContent = data.searchText.includes('Too many')
                    ? 'Please select a single word'
                    : 'No pronunciation found';
                portal.appendChild(error);

                const hint = document.createElement('div');
                hint.className = 'pp-error-hint';
                hint.textContent = data.searchText.includes('Too many')
                    ? 'Highlight just one word to look up'
                    : 'Try selecting a different word';
                portal.appendChild(hint);
            } else {
                // Header button group
                const btnGroup = document.createElement('div');
                btnGroup.className = 'pp-header-btns';

                // ? button
                const helpBtn = document.createElement('button');
                helpBtn.className = 'pp-help-btn';
                helpBtn.textContent = '?';
                helpBtn.title = 'Show guide';
                helpBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const legend = portal.querySelector('.pp-legend');
                    if (legend) legend.classList.toggle('visible');
                });
                btnGroup.appendChild(helpBtn);

                // Pin / Close button
                const pinBtn = document.createElement('button');
                pinBtn.className = 'pp-pin-btn';
                pinBtn.innerHTML = '<svg viewBox="0 0 24 24"><path d="M15.113 3.21l.094.083 5.5 5.5a1 1 0 01.083 1.32l-.083.094-4 4a1 1 0 01-.112.097l-.1.063-1.5.875-3.084 3.083a1 1 0 01-1.32.083l-.094-.083-2.5-2.5-3.793 3.793a1 1 0 01-1.497-1.32l.083-.094 3.793-3.793-2.5-2.5a1 1 0 01-.083-1.32l.083-.094 3.084-3.083.874-1.5a1 1 0 01.16-.212l4-4a1 1 0 011.32-.083z"/></svg>';
                pinBtn.title = 'Pin portal';
                pinBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    if (!this.isPinned) {
                        this.isPinned = true;
                        pinBtn.classList.add('active');
                        pinBtn.innerHTML = '<svg viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none"/></svg>';
                        pinBtn.title = 'Close portal';
                    } else {
                        this.removePortal();
                    }
                });
                btnGroup.appendChild(pinBtn);

                headerRow.appendChild(btnGroup);

                // IPA data rows
                const content = document.createElement('div');
                content.className = 'pp-content';

                ipaDataArray.forEach((ipa) => {
                    const dialectRow = document.createElement('div');
                    dialectRow.className = 'pp-dialect';

                    const flag = document.createElement('img');
                    flag.className = 'pp-flag';
                    flag.src = COUNTRY_FLAG_URLS[ipa.country] || '';
                    flag.alt = ipa.country ? ipa.country.toUpperCase() : '';

                    const colon = document.createElement('span');
                    colon.className = 'pp-colon';
                    colon.textContent = ':';

                    const clipboardSvg = '<svg viewBox="0 0 24 24"><path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2"/><rect x="8" y="2" width="8" height="4" rx="1"/></svg>';
                    const copyBtn = document.createElement('button');
                    copyBtn.className = 'pp-copy-btn';
                    copyBtn.innerHTML = clipboardSvg;
                    copyBtn.title = 'Copy IPA';
                    copyBtn.addEventListener('click', (e) => {
                        e.stopPropagation();
                        navigator.clipboard.writeText(ipa.ipa_text).then(() => {
                            copyBtn.classList.add('copied');
                            copyBtn.innerHTML = '<span class="pp-copied-text">Copied!</span><svg viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5" stroke="currentColor" stroke-width="2" fill="none"/></svg>';
                            setTimeout(() => {
                                copyBtn.classList.remove('copied');
                                copyBtn.innerHTML = clipboardSvg;
                            }, 1500);
                        });
                    });

                    dialectRow.appendChild(flag);
                    dialectRow.appendChild(colon);
                    dialectRow.appendChild(this.buildColoredIPA(ipa.ipa_text.replace(/\//g, '')));
                    dialectRow.appendChild(copyBtn);
                    content.appendChild(dialectRow);
                });

                portal.appendChild(content);

                // Color legend (hidden by default, toggled by ?)
                const legend = document.createElement('div');
                legend.className = 'pp-legend';
                const legendTitle = document.createElement('div');
                legendTitle.className = 'pp-legend-title';
                legendTitle.textContent = 'Color guide';
                legend.appendChild(legendTitle);
                const legendItems = document.createElement('div');
                legendItems.className = 'pp-legend-items';
                const colors = [
                    { color: '#60a5fa', label: 'Vowels' },
                    { color: '#4ade80', label: 'Consonants' },
                    { color: '#a855f7', label: 'Stress marks & separators' },
                ];
                colors.forEach(({ color, label }) => {
                    const item = document.createElement('div');
                    item.className = 'pp-legend-item';
                    const dot = document.createElement('span');
                    dot.className = 'pp-legend-dot';
                    dot.style.background = color;
                    const text = document.createElement('span');
                    text.textContent = label;
                    item.appendChild(dot);
                    item.appendChild(text);
                    legendItems.appendChild(item);
                });
                legend.appendChild(legendItems);

                portal.appendChild(legend);
            }
        }

        // Footer
        const footer = document.createElement('div');
        footer.className = 'pp-footer';
        footer.textContent = 'Phonetic Portal';
        portal.appendChild(footer);

        shadow.appendChild(portal);

        // Position below selected text
        const selection = window.getSelection();
        if (selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            const rect = range.getBoundingClientRect();
            const top = rect.bottom + 10 + window.scrollY;
            const left = rect.left + window.scrollX;

            host.style.position = 'absolute';
            host.style.top = `${top}px`;
            host.style.left = `${left}px`;
            host.style.zIndex = '2147483647';
        }

        document.body.appendChild(host);
        this.shadowHost = host;
        this.shadowRoot = shadow;
        this.removeAllPreviousIcons();
    },

    getIconPositionSettingFromBackground() {
        this.sendMessageToBackground({ action: 'getIconPositionSetting' });
    },

    saveIconPositionSettingToLocalStorage(data) {
        if (!data || !data.place) {
            localStorage.setItem('iconPosition', this.defaultIconPosition);
        } else {
            localStorage.setItem('iconPosition', data.place);
        }
    },

    createAndPositionIcon() {
        const allIcons = [...document.querySelectorAll('.phonetic-search-icon')];
        if (allIcons.length > 1) {
            allIcons.forEach((icon, index) => {
                if (index > 0) icon.remove();
            });
        }
        const button = document.createElement('button');
        button.id = this.searchIconId;
        button.className = 'phonetic-search-icon';
        button.setAttribute('tabindex', '1');
        button.style.backgroundImage = `url('${this.iconUrl}')`;

        const selection = window.getSelection();
        if (selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            const rect = range.getBoundingClientRect();

            const positions = {
                'top-left': { top: rect.top + window.scrollY - 30, left: rect.left + window.scrollX - 30 },
                'top-center': { top: rect.top + window.scrollY - 30, left: rect.left + window.scrollX + (rect.width / 2) - 15 },
                'top-right': { top: rect.top + window.scrollY - 30, left: rect.right + window.scrollX + 5 },
                'middle-left': { top: rect.top + window.scrollY + (rect.height / 2) - 15, left: rect.left + window.scrollX - 30 },
                'middle-right': { top: rect.top + window.scrollY + (rect.height / 2) - 15, left: rect.right + window.scrollX + 5 },
                'bottom-left': { top: rect.bottom + window.scrollY + 5, left: rect.left + window.scrollX - 30 },
                'bottom-center': { top: rect.bottom + window.scrollY + 5, left: rect.left + window.scrollX + (rect.width / 2) - 15 },
                'bottom-right': { top: rect.bottom + window.scrollY + 5, left: rect.right + window.scrollX + 5 }
            };

            const iconPosition = localStorage.getItem('iconPosition') || this.defaultIconPosition;
            button.style.top = `${positions[iconPosition].top}px`;
            button.style.left = `${positions[iconPosition].left}px`;
        }
        document.body.appendChild(button);
    },

    removeAllPreviousIcons() {
        [...document.querySelectorAll('.phonetic-search-icon')].forEach(icon => icon.remove());
    },

    addCommonEvents() {
        const searchIconId = this.searchIconId;
        const createAndPositionIcon = this.createAndPositionIcon.bind(this);
        const sendMessageToBackground = this.sendMessageToBackground.bind(this);

        document.addEventListener('click', (e) => {
            const icon = document.getElementById(searchIconId);
            const selection = window.getSelection();
            if (selection.isCollapsed) {
                if (!this.isPinned) {
                    this.removePortal();
                }
                icon?.remove();
            } else {
                if (e.target.id === searchIconId) {
                    const selectedTextOnly = selection.toString().trimEnd();
                    if (selectedTextOnly.split(' ').length > 1) {
                        this.createAndPositionPopup({
                            searchText: 'Too many words selected!',
                            ipaData: JSON.stringify([])
                        });
                    } else {
                        this.createAndPositionPopup({
                            searchText: selectedTextOnly,
                            ipaData: '[]',
                            loading: true
                        });
                        sendMessageToBackground({ action: 'checkIPA', searchText: selectedTextOnly });
                    }
                }
            }
        });

        document.addEventListener('mouseup', () => {
            const selection = window.getSelection();
            if (!selection.isCollapsed) {
                createAndPositionIcon();
            } else {
                this.removeAllPreviousIcons();
            }
        });

        document.addEventListener('selectionchange', () => {
            this.removeAllPreviousIcons();
            if (!this.isPinned) {
                this.removePortal();
            }
        });
    },

    sendMessageToBackground(data = { action: 'checkIPA', searchText: '' }) {
        try {
            if (!chrome.runtime || !chrome.runtime.sendMessage) {
                throw new Error('Extension context invalidated.');
            }
            chrome.runtime.sendMessage(data, () => {
                if (chrome.runtime.lastError) {
                    console.error('Message send failed:', chrome.runtime.lastError.message);
                    this.removePortal();
                    this.removeAllPreviousIcons();
                }
            });
        } catch (e) {
            console.error('Extension context invalidated:', e.message);
            this.removePortal();
            this.removeAllPreviousIcons();
        }
    }
};

phoneticPortal.init();

// Listen for messages from the background script
chrome.runtime.onMessage.addListener(function (request) {
    switch (request.action) {
        case 'createPopup':
            phoneticPortal.createAndPositionPopup({
                searchText: request.searchText,
                ipaData: request.ipaData
            });
            break;
        case 'setIconPosition':
            phoneticPortal.saveIconPositionSettingToLocalStorage(request.position);
            break;
    }
});
