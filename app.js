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
                // First get all countries to calculate rankings
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
    
    function displayResults(countries, allCountries) {
       
        resultsSection.innerHTML = '';
        
        if (!countries || countries.length === 0) {
            showError('No countries found with that name');
            return;
        }
        
       
        const byPopulation = [...allCountries].sort((a, b) => b.population - a.population);
        const byArea = [...allCountries].sort((a, b) => b.area - a.area);
        
        countries.forEach(country => {
            
            const populationRank = byPopulation.findIndex(c => c.cca3 === country.cca3) + 1;
            const areaRank = byArea.findIndex(c => c.cca3 === country.cca3) + 1;
            
            
            let currencies = 'N/A';
            if (country.currencies) {
                currencies = Object.values(country.currencies)
                    .map(currency => `${currency.name} (${currency.symbol || 'No symbol'})`)
                    .join(', ');
            }
            
            
            let languages = 'N/A';
            if (country.languages) {
                languages = Object.values(country.languages).join(', ');
            }
            
            
            const drivingSide = country.car?.side ? country.car.side.charAt(0).toUpperCase() + country.car.side.slice(1) : 'N/A';
            
            
            const countryCard = document.createElement('div');
            countryCard.className = 'country-card';
            
            countryCard.innerHTML = `
                <div class="country-header">
                    <img src="${country.flags.png}" alt="Flag of ${country.name.common}" class="flag">
                    <h2 class="country-name">${country.name.common}</h2>
                </div>
                <div class="country-details">
                    <div class="detail-item">
                        <span class="detail-label">Official Name:</span>
                        <span>${country.name.official}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Capital:</span>
                        <span>${country.capital ? country.capital.join(', ') : 'N/A'}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Region:</span>
                        <span>${country.region} ${country.subregion ? `(${country.subregion})` : ''}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Population:</span>
                        <span>${country.population.toLocaleString()} (Rank: #${populationRank})</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Area:</span>
                        <span>${country.area ? country.area.toLocaleString() + ' km²' : 'N/A'} (Rank: #${areaRank})</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Currency:</span>
                        <span>${currencies}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Languages:</span>
                        <span>${languages}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Driving Side:</span>
                        <span>${drivingSide}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Timezones:</span>
                        <span>${country.timezones ? country.timezones.join(', ') : 'N/A'}</span>
                    </div>
                </div>
                <div class="ranking-section">
                    <h3>Global Rankings</h3>
                    <div class="ranking-grid">
                        <div class="ranking-item">
                            <span class="ranking-label">Population</span>
                            <span class="ranking-value">#${populationRank}</span>
                            <span class="ranking-total">of ${byPopulation.length} countries</span>
                        </div>
                        <div class="ranking-item">
                            <span class="ranking-label">Area Size</span>
                            <span class="ranking-value">#${areaRank}</span>
                            <span class="ranking-total">of ${byArea.length} countries</span>
                        </div>
                    </div>
                </div>
            `;
            
            resultsSection.appendChild(countryCard);
        });
    }
    
});