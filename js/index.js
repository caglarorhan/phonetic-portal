window.addEventListener('load', function() {
    // Add a click event listener to the button
    let languageOptions = {us:true, uk:true, au:true, ca:true, nz:true, za:true, ie:true, in:true, ph:true, sg:true};
    document.querySelectorAll('.checkbox-container input[type="checkbox"]').forEach(ipaLanguageCheckBox =>{
        ipaLanguageCheckBox.addEventListener('click', function() {
            let statusOfIpaLanguage = ipaLanguageCheckBox.checked;
            let ipaLanguage = ipaLanguageCheckBox.value;
            languageOptions[ipaLanguage] = statusOfIpaLanguage;
            localStorage.setItem('languageOptions', JSON.stringify(languageOptions));
        })
    })




});



