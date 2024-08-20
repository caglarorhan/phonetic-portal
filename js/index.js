
const phoneticPortal = {
    previousSearches:{}, // {"us":{searchText: "hello", ipaText: "həˈloʊ"}, "uk":{searchText: "hello", ipaText: "həˈloʊ"}}
    languageOptions: {us:true, uk:true}, // {us:true, uk:true, au:false, ca:false, nz:false, za:false, ie:false, in:false, ph:false, sg:false}
    async init(){
        this.syncLanguageOptions();
        await this.createLanguageOptions();
        this.languageSetting();
        this.addCommonEvents();
        this.checkControlOnLanguageSelections();
    },
    async createLanguageOptions(){
        Object.keys(this.languageOptions).forEach(languageOption =>{
            let newLanguageOptionCheckBoxLabel = document.createElement('label');
            let newLanguageOptionCheckBox = document.createElement('input');
            newLanguageOptionCheckBox.type = 'checkbox';
            newLanguageOptionCheckBox.value = languageOption;
            newLanguageOptionCheckBox.name = `ipa-${languageOption}`;
            newLanguageOptionCheckBox.checked = this.languageOptions[languageOption];

            newLanguageOptionCheckBoxLabel.appendChild(newLanguageOptionCheckBox);
            newLanguageOptionCheckBoxLabel.appendChild(document.createTextNode(languageOption.toUpperCase() + ' IPA'));
            document.querySelector(`.checkbox-container`).appendChild(newLanguageOptionCheckBoxLabel);
        })
        console.log("checkbox creation function is ended")
    },
    checkControlOnLanguageSelections(){
        Object.keys(this.languageOptions).forEach(languageOption =>{
            document.querySelector(`.checkbox-container input[value="${languageOption}"]`).checked = this.languageOptions[languageOption];
        })
    },
    languageSetting(){
        if(localStorage.getItem('languageOptions') === null){
            this.syncLanguageOptions();
        }
        let languageOptions = localStorage.getItem('languageOptions');
        if(languageOptions){
            Object.keys(this.languageOptions).forEach(languageCode =>{
                console.log(languageCode);
                document.querySelector(`.checkbox-container input[value="${languageCode}"]`).checked = languageOptions[languageCode];
            })
        }else{
            this.languageOptions = JSON.parse(languageOptions);
            document.querySelectorAll('.checkbox-container input[type="checkbox"]').forEach(ipaLanguageCheckBox =>{
                ipaLanguageCheckBox.checked = this.languageOptions[ipaLanguageCheckBox.value];
            })  
        }
    },
    syncLanguageOptions(){
        if(!localStorage.getItem('languageOptions')){
            localStorage.setItem('languageOptions', JSON.stringify(this.languageOptions));
        }else{
            this.languageOptions = JSON.parse(localStorage.getItem('languageOptions'));
        }
    },
    saveLanguageOptions(){
        localStorage.setItem('languageOptions', JSON.stringify(this.languageOptions));
    },
    addCommonEvents(){
        document.querySelector('.checkbox-container').addEventListener('click',(e)=>{
            if(e.target.tagName === 'INPUT' && e.target.type === 'checkbox'){
                this.languageOptions[e.target.value] = e.target.checked;
                this.saveLanguageOptions();
            }
        })
    }
}

window.addEventListener('load', function() {
    phoneticPortal.init();
})