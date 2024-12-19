const searchForm = document.querySelector('#recipe-form');
const searchInput = document.querySelector('#ingredient');
const resultsList = document.querySelector('#recipe-results');
const loadingSpinner = document.querySelector('#loading-spinner');

searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    searchRecipes();
});

async function searchRecipes() {
    const searchValue = searchInput.value.trim();
    
    if (searchValue === '') {
        resultsList.innerHTML = '<p>Please enter an ingredient.</p>';
        return;
    }

    loadingSpinner.style.display = 'block';
    resultsList.innerHTML = ''; // Clear previous results

    try {
        const response = await fetch(`https://api.edamam.com/search?q=${encodeURIComponent(searchValue)}&app_id=9939bd97&app_key=cd02b6d91e1b41a5ec9e12f49140923a`);
        
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        
        const data = await response.json();
        loadingSpinner.style.display = 'none';
        
        if (data.hits && data.hits.length > 0) {
            displayRecipes(data.hits);
        } else {
            resultsList.innerHTML = '<p>No recipes found.</p>';
        }
    } catch (error) {
        loadingSpinner.style.display = 'none';
        console.error('Error fetching recipes:', error);
        resultsList.innerHTML = '<p>There was an error fetching the recipes. Please try again later.</p>';
    }
}

function displayRecipes(recipes) {
    let html = '';
    
    recipes.forEach((recipe) => {
        html += `
        <div class="recipe-card">
            <img src="${recipe.recipe.image}" alt="${recipe.recipe.label}">
            <h3>${recipe.recipe.label}</h3>
            <ul>
                ${recipe.recipe.ingredientLines.map(ingredient => `<li>${ingredient}</li>`).join('')}
            </ul>
            <a href="${recipe.recipe.url}" target="_blank">View Recipe</a>
        </div>
        `;
    });

    resultsList.innerHTML = html;
}
