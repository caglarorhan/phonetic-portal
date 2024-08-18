
const phoneticPortal = {
    languageOptions: {us:true, uk:true}, // {us:true, uk:true, au:false, ca:false, nz:false, za:false, ie:false, in:false, ph:false, sg:false}
    init(){
        this.createLanguageOptions();
        this.languageSetting();
        this.addCommonEvents();
    },
    createLanguageOptions(){
        Object.keys(this.languageOptions).forEach(languageOption =>{
            let newLanguageOptionCheckBoxLabel = document.createElement('label');
            let newLanguageOptionCheckBox = document.createElement('input');
            newLanguageOptionCheckBox.type = 'checkbox';
            newLanguageOptionCheckBox.value = languageOption;
            newLanguageOptionCheckBox.name = `ipa-${languageOption}`;
            newLanguageOptionCheckBoxLabel.appendChild(newLanguageOptionCheckBox);
            newLanguageOptionCheckBoxLabel.appendChild(document.createTextNode(languageOption.toUpperCase() + ' IPA'));
            document.querySelector(`.checkbox-container`).appendChild(newLanguageOptionCheckBoxLabel);
        })
    },
    languageSetting(){
        let languageOptions = localStorage.getItem('languageOptions');
        if(languageOptions){
            Object.keys(languageOptions).forEach(languageOption =>{
                document.querySelector(`.checkbox-container input[value="${languageOption}"]`).checked = languageOptions[languageOption]; // HATA
            })
        }else{
            this.languageOptions = JSON.parse(languageOptions);
            document.querySelectorAll('.checkbox-container input[type="checkbox"]').forEach(ipaLanguageCheckBox =>{
                ipaLanguageCheckBox.checked = this.languageOptions[ipaLanguageCheckBox.value];
            })  
        }
    },
    addCommonEvents(){
        document.querySelectorAll('.checkbox-container input[type="checkbox"]').forEach(ipaLanguageCheckBox =>{
            ipaLanguageCheckBox.addEventListener('click', ()=>{
                let statusOfIpaLanguage = ipaLanguageCheckBox.checked;
                let ipaLanguage = ipaLanguageCheckBox.value;
                this.languageOptions[ipaLanguage] = statusOfIpaLanguage;
                localStorage.setItem('languageOptions', JSON.stringify(this.languageOptions));
            })
        })
    }
}

window.addEventListener('load', function() {
    phoneticPortal.init();
})