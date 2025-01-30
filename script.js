const ingredientBox = document.getElementById("ingredientBox");
const addToMagicBox = document.getElementById("addToMagicBox");
const fetchRecipesButton = document.getElementById("fetchRecipes");
const ingredientList = document.getElementById("ingredientsList");
const recipeGallery = document.getElementById("recipeGallery");
const recipeModal = document.getElementById("recipeModal");
const closePopup = document.getElementById("closePopup");
const saveRecipeButton = document.getElementById("saveRecipeButton");
const savedRecipesContainer = document.getElementById("savedRecipesContainer");
const closeSavedPopup = document.getElementById("closeSavedPopup");
const savedRecipesList = document.getElementById("savedRecipesList");
const viewSavedMagic = document.getElementById("viewSavedMagic");
const moodMessage = document.getElementById("moodMessage");
const apiKey = 'c62ac39a65584429a89b499de5f8899c';
let ingredientsArray = JSON.parse(localStorage.getItem('ingredients')) || [];
updateIngredientList()

let savedRecipes = JSON.parse(localStorage.getItem('savedRecipes')) || [];
addToMagicBox.addEventListener('click', function updateIngredient() {
  const updatedIngredient = ingredientBox.value.trim();
  if (updatedIngredient && !ingredientsArray.includes(updatedIngredient)) {
    ingredientsArray.push(updatedIngredient);
    updateIngredientList(); 
    localStorage.setItem('ingredients', JSON.stringify(ingredientsArray));
    ingredientBox.value = ''; 
    addToMagicBox.textContent = 'Add To Magic Box'; 
    displayMessage('Ingredient added successfully!', 'success'); 
  }
});

const homeNav = document.getElementById("homenav");
const magicKitchen = document.getElementById("magicKitchen");

homeNav.addEventListener("click", function () {
  magicKitchen.style.display = "block"; 
  savedRecipesContainer.style.display = "none";
});

// Display Saved Recipes
function displaySavedRecipes() {
  savedRecipesList.innerHTML = ""; 
  if (savedRecipes.length === 0) {
    const emptyMessage = document.createElement("li");
    emptyMessage.textContent = "No recipes saved!";
    savedRecipesList.appendChild(emptyMessage);
  } else {
    savedRecipes.forEach(recipe => {
      const recipeItem = document.createElement("li");
      recipeItem.textContent = recipe.title;
      savedRecipesList.appendChild(recipeItem);
    });
  }
}

// This is Get recipe 
fetchRecipesButton.addEventListener("click", function () {
    if (ingredientsArray.length === 0) {
      moodMessage.textContent = "Please add some magical ingredients first!";
      return;
    }
    moodMessage.textContent = "Fetching recipes...";
 const query = ingredientsArray.join(',');

    fetch(`https://api.spoonacular.com/recipes/findByIngredients?ingredients=${query}&apiKey=${apiKey}`)
      .then(response => response.json())
      .then(data => {

        const recipes = data.results || data;  
        displayRecipes(recipes);
      });
  });
  function displayRecipes(recipes) {
    recipeGallery.innerHTML = ""; 
    if (recipes.length === 0) {
      moodMessage.textContent = "Sorry, no recipes found!";
      return;
    }
  
    recipes.forEach(recipe => {
      const recipeCard = document.createElement("div");
      recipeCard.classList.add("recipe-card");
  
      const img = document.createElement("img");
      img.src = recipe.image;
      recipeCard.appendChild(img);
  
      const title = document.createElement("h3");
      title.textContent = recipe.title;
      recipeCard.appendChild(title);
  
      // View Recipe Button
      const button = document.createElement("button");
      button.textContent = "View";
      button.addEventListener("click", function () {
        fetchRecipeDetails(recipe.id); 
      });
      recipeCard.appendChild(button);
  
      // Save Recipe Button
      const saveButton = document.createElement("button");
      saveButton.textContent = "Save";
      saveButton.addEventListener("click", function () {
        saveRecipe(recipe); 
      });
      recipeCard.appendChild(saveButton);
  
      recipeGallery.appendChild(recipeCard);
    });
  }
  
  function fetchRecipeDetails(recipeId) {
    fetch(`https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=${apiKey}`)
      .then(response => response.json())
      .then(recipe => {
    
        showRecipePopup(recipe);
        saveRecipe(recipe);
      })
      .catch(error => {
        console.error("Error fetching recipe details:", error);
      });
  }
  function saveRecipe(recipe) {
  const messageContainer = document.getElementById("messageContainer");

  if (recipe && recipe.id && !savedRecipes.some(savedRecipe => savedRecipe.id === recipe.id)) {
    savedRecipes.push(recipe);
    localStorage.setItem("savedRecipes", JSON.stringify(savedRecipes));
    displayMessage("Recipe saved successfully!", "success");
  } else {
    displayMessage("This recipe is already saved!", "error");
  }
}

function displayMessage(message, type) {
  const moodMessage = document.getElementById('moodMessage');
  moodMessage.textContent = message; 
  moodMessage.className = type === 'success' ? 'success-class' : 'error-class'; // Apply class for success/error
  setTimeout(() => {
    moodMessage.textContent = ''; 
    moodMessage.className = ''; 
  }, 3000);
}

function showRecipePopup(recipe) {
  const modal = document.getElementById('recipeModal');
  const titleElement = document.getElementById('popupTitle');
  const ingredientsElement = document.getElementById('popupIngredients');
  const instructionsElement = document.getElementById('popupInstructions');
  titleElement.textContent = recipe.title;

  // Display ingredients (if available)
  if (recipe.extendedIngredients && recipe.extendedIngredients.length < 5) {
    ingredientsElement.textContent = "Ingredients";
    recipe.extendedIngredients.forEach(ingredient => {
      const ingredientItem = document.createElement("li");
      ingredientItem.textContent = ingredient.original;
      ingredientsElement.appendChild(ingredientItem);
    });
  } 

  // Display instructions (if available)
  if (recipe.instructions) {
    instructionsElement.textContent = "Instructions";
    instructionsElement.textContent = recipe.instructions;
  } else {
    instructionsElement.textContent = "No instructions available.";
  }
  modal.style.display = "block";
}
// for check saved content 
viewSavedMagic.addEventListener("click", function () {
  savedRecipesContainer.style.display = "block";
  savedRecipesList.innerHTML = ""; 
  
  savedRecipes.forEach(recipe => {
    const listItem = document.createElement("li");
    listItem.textContent = recipe.title;
    const editButton = document.createElement("button");
    editButton.textContent = "Edit";
    editButton.addEventListener("click", function () {
      editSavedRecipe(recipe);
    });
    
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.addEventListener("click", function () {
      deleteSavedRecipe(recipe);
    });
    listItem.appendChild(editButton);
    listItem.appendChild(deleteButton);
    savedRecipesList.appendChild(listItem); 
  });

});
closeSavedPopup.addEventListener("click", function () {
  savedRecipesContainer.style.display = "none"; 
});

// We can edit the 
function editSavedRecipe(recipe) {
  const inputField = document.createElement("input");
  inputField.type = "text";
  inputField.value = recipe.title;

  // saving the updated title
  const saveButton = document.createElement("button");
  saveButton.textContent = "Save Changes";
  saveButton.addEventListener("click", function () {
    const newTitle = inputField.value.trim();
    if (newTitle && newTitle !== recipe.title) {
      const index = savedRecipes.indexOf(recipe);
      if (index !== -1) {
        savedRecipes[index].title = newTitle;
        localStorage.setItem("savedRecipes", JSON.stringify(savedRecipes));
        updateSavedRecipesList(); 
      }
    }
  });

  // input field and save button
  const listItem = document.createElement("li");
  listItem.textContent = "Editing: ";
  listItem.appendChild(inputField);
  listItem.appendChild(saveButton);

  // Replace the original list item with the editable version
  savedRecipesList.innerHTML = "";
  savedRecipesList.appendChild(listItem);
}

function deleteSavedRecipe(recipe) {
  savedRecipes = savedRecipes.filter(savedRecipe => savedRecipe.id !== recipe.id);
  localStorage.setItem("savedRecipes", JSON.stringify(savedRecipes));
  updateSavedRecipesList(); 
}
// Updating ingredient list when adding/editing
function updateIngredientList() {
  ingredientList.innerHTML = ''; 
  ingredientsArray.forEach(ingredient => {
    const li = document.createElement('li');
    li.textContent = ingredient;
    
    // Create Edit Button
    const editButton = document.createElement('button');
    editButton.textContent = 'Edit';
    editButton.addEventListener('click', function() {
      editIngredient(ingredient);
    });

    // Create Delete Button
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.addEventListener('click', function() {
      deleteIngredient(ingredient);
    });

    // Append buttons to the list item
    li.appendChild(editButton);
    li.appendChild(deleteButton);

    ingredientList.appendChild(li);
  });
}
  
function editIngredient(ingredient) {
  ingredientBox.value = ingredient;
  addToMagicBox.textContent = "Update Ingredient";
  addToMagicBox.removeEventListener("click", addIngredientHandler);
  addToMagicBox.addEventListener("click", function updateIngredient() {
    const updatedIngredient = ingredientBox.value.trim();
    if (updatedIngredient && !ingredientsArray.includes(updatedIngredient)) {
      const index = ingredientsArray.indexOf(ingredient);
      ingredientsArray[index] = updatedIngredient;
      updateIngredientList();
      localStorage.setItem('ingredients', JSON.stringify(ingredientsArray));
      ingredientBox.value = "";
      addToMagicBox.textContent = "Add";
      addToMagicBox.removeEventListener("click", updateIngredient);
    }
  });
}

function deleteIngredient(ingredient) {
  ingredientsArray = ingredientsArray.filter(ing => ing !== ingredient);
  localStorage.setItem('ingredients', JSON.stringify(ingredientsArray));
  updateIngredientList();
}

// Recipe Save Button Click Event
saveRecipeButton.addEventListener("click", function () {
  const titleElement = document.getElementById("popupTitle");
  const descriptionElement = document.getElementById("popupDescription");
  
  const recipeTitle = titleElement.textContent.trim();
  const recipeDescription = descriptionElement.textContent.trim();

  if (!recipeTitle) {
    displayMessage("No recipe to save!", "error");
    return;
  }

  // Save recipe object
  const recipe = {
    title: recipeTitle,
    description: recipeDescription || "No description available."
  };
  if (!savedRecipes.some(savedRecipe => savedRecipe.title === recipe.title)) {
    savedRecipes.push(recipe);
    localStorage.setItem("savedRecipes", JSON.stringify(savedRecipes));
    displayMessage("Recipe saved successfully!", "success");
  } else {
    displayMessage("This recipe is already saved!", "error");
  }
});

// veiw button 
viewSavedMagic.addEventListener("click", function () {
  savedRecipesContainer.style.display = "block";
  savedRecipesList.innerHTML = "";

  if (savedRecipes.length === 0) {
    savedRecipesList.innerHTML = "<li>No saved recipes yet.</li>";
    return;
  }

  savedRecipes.forEach(recipe => {
    const listItem = document.createElement("li");
    listItem.innerHTML = `<strong>${recipe.title}</strong>: ${recipe.description}`;

    // Delete Button
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.addEventListener("click", function () {
      deleteSavedRecipe(recipe);
    });

    listItem.appendChild(deleteButton);
    savedRecipesList.appendChild(listItem);
  }); 
});
closePopup.addEventListener("click", function () {
  recipeModal.style.display = "none"; // Hide Saved Recipes
});

// Delete Saved Recipe
function deleteSavedRecipe(recipe) {
  savedRecipes = savedRecipes.filter(r => r.title !== recipe.title);
  localStorage.setItem("savedRecipes", JSON.stringify(savedRecipes));
  displayMessage("Recipe deleted!", "success");
  viewSavedMagic.click(); 
}
