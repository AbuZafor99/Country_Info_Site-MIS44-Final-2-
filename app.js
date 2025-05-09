document.addEventListener('DOMContentLoaded', function() {
    const countryInput = document.getElementById('country-input');
    const searchBtn = document.getElementById('search-btn');
    const resultsSection = document.getElementById('results');
    
   
    searchBtn.addEventListener('click', searchCountry);
    
    
    countryInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            searchCountry();
        }
    });
    
    function searchCountry() {
        const countryName = countryInput.value.trim();
        
        if (!countryName) {
            showError('Please enter a country name');
            return;
        }
        
        
        resultsSection.innerHTML = '<div class="loading"><i class="fas fa-spinner fa-spin"></i> Searching for country information...</div>';
        
        fetch(`https://restcountries.com/v3.1/name/${countryName}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Country not found');
                }
                return response.json();
            })
            .then(data => {
                
                fetch('https://restcountries.com/v3.1/all')
                    .then(response => response.json())
                    .then(allCountries => {
                        displayResults(data, allCountries);
                    })
                    .catch(error => {
                        showError('Failed to load country ranking data');
                    });
            })
            .catch(error => {
                showError(error.message);
            });
    }
});