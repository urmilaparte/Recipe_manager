document.addEventListener('DOMContentLoaded', () => {
    // Get page elements
    const ingredientInput = document.getElementById('ingredientInput');
    const addIngredientButton = document.getElementById('addIngredient');
    const viewIngredientsButton = document.getElementById('viewIngredients');
    const ingredientsList = document.getElementById('ingredientsList');
    const getRecipesButton = document.getElementById('getRecipes');
    const recipesList = document.getElementById('recipesList');
    const statusMessage = document.getElementById('statusMessage');
    const ingredientsModal = document.getElementById('ingredientsModal');
    const modalIngredientsList = document.getElementById('modalIngredientsList');
    const closeModalButton = document.getElementById('closeModal');

    const apiKey = '539e9dce746548d4ae9ab93d7e065c56';

    // Show messages in the status bar
    function showMessage(message, color) {
        statusMessage.textContent = message;
        statusMessage.style.color = color;
    }

    // Save ingredients to localStorage
    function saveIngredientsToStorage() {
        const ingredients = Array.from(ingredientsList.children).map(item => item.querySelector('span').textContent);
        localStorage.setItem('ingredients', JSON.stringify(ingredients));
    }

    // Load ingredients from localStorage
    function loadIngredientsFromStorage() {
        const ingredients = JSON.parse(localStorage.getItem('ingredients')) || [];
        ingredients.forEach(addIngredient);
    }

    // Add  Edit and Delete buttons
    function addIngredient(ingredient) {
        const item = document.createElement('li');
        item.innerHTML = `
            <span>${ingredient}</span>
            <button class="edit">Edit</button>
            <button class="delete">Delete</button>`;
        
        // Edit ingredient
        item.querySelector('.edit').addEventListener('click', () => {
            const newIngredient = prompt('Edit ingredient:', ingredient);
            if (newIngredient) {
                item.querySelector('span').textContent = newIngredient;
                saveIngredientsToStorage();
                showMessage('Ingredient updated!', 'green');
            }
        });

        // Delete ingredient
        item.querySelector('.delete').addEventListener('click', () => {
            item.remove();
            saveIngredientsToStorage();
            showMessage('Ingredient deleted!', 'green');
        });

        ingredientsList.appendChild(item);
        saveIngredientsToStorage();
    }

    // Add  button click
    addIngredientButton.addEventListener('click', () => {
        const ingredient = ingredientInput.value.trim();
        if (ingredient) {
            addIngredient(ingredient);
            ingredientInput.value = '';
            showMessage('Ingredient added!', 'green');
        } else {
            showMessage('Please enter an ingredient.', 'red');
        }
    });

    // View 
    viewIngredientsButton.addEventListener('click', () => {
        modalIngredientsList.innerHTML = '';
        const ingredients = JSON.parse(localStorage.getItem('ingredients')) || [];
        
        if (ingredients.length === 0) {
            showMessage('No ingredients to view.', 'red');
            return;
        }

        ingredients.forEach(ingredient => {
            const listItem = document.createElement('li');
            listItem.textContent = ingredient;
            modalIngredientsList.appendChild(listItem);
        });

        ingredientsModal.classList.remove('hidden'); 
    });

    // Close
    closeModalButton.addEventListener('click', () => {
        ingredientsModal.classList.add('hidden'); 
    });

    // Get recipes 
    getRecipesButton.addEventListener('click', () => {
        recipesList.innerHTML = '';
        const ingredients = Array.from(ingredientsList.children).map(item => item.querySelector('span').textContent);
    
        if (ingredients.length === 0) {
            showMessage('Add ingredients first!', 'red');
            return;
        }
    
        const query = encodeURIComponent(ingredients.join(','));
    
        fetch(`https://api.spoonacular.com/recipes/findByIngredients?ingredients=${query}&apiKey=${apiKey}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                if (data.length > 0) {
                    data.forEach(recipe => {
                        const recipeItem = document.createElement('li');
                        recipeItem.innerHTML = `<strong>${recipe.title}</strong>`;
                        recipesList.appendChild(recipeItem);
                    });
                    showMessage('Recipes found!', 'green');
                } else {
                    showMessage('No recipes found.', 'red');
                }
            })
            .catch(err => {
                console.error('Error:', err);
                showMessage('Error fetching recipes. Check console for details.', 'red');
            });
    });

    loadIngredientsFromStorage();
});
