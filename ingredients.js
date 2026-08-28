// Finds the important HTML elements
const ingredientGrid = document.getElementById("ingredient-grid");
const searchInput = document.getElementById("ingredient-search");

const filterButtons = document.querySelectorAll(".filter-button");

// Stores all ingredients loaded from JSON
let allIngredients = [];

// Stores the category currently selected
let selectedCategory = "all";

/*
    Loads ingredient information from the JSON file
*/
async function loadIngredients() {
    try {
        ingredientGrid.innerHTML =
            '<p class="status-message">Loading ingredients...</p>';

        const response = await fetch("data/ingredients.json");

        if (!response.ok) {
            throw new Error("The JSON file could not be loaded.");
        }

        allIngredients = await response.json();

        const addressParameters =
        new URLSearchParams(window.location.search);

        const searchFromHome =
        addressParameters.get("search");

        if (searchFromHome) {
        searchInput.value = searchFromHome;
        filterIngredients();
        } else {
        displayIngredients(allIngredients);
        }

        
    } catch (error) {
        ingredientGrid.innerHTML =
            '<p class="status-message">Unable to load the ingredients.</p>';

        console.error(error);
    }
}

/*
    Creates and displays the ingredient cards
*/
function displayIngredients(ingredients) {
    if (ingredients.length === 0) {
        ingredientGrid.innerHTML =
            '<p class="status-message">No matching ingredients found.</p>';

        return;
    }

    ingredientGrid.innerHTML = ingredients
        .map(function (ingredient) {
            const categoryText = ingredient.categories
                .map(function (category) {
                    return `<p>${category}</p>`;
                })
                .join("");

            return `
                <a
                    class="library-card"
                    href="ingredient-detail.html?id=${ingredient.id}"
                >
                    <div class="library-image">
                        <img src="${ingredient.image}" alt="${ingredient.name}">
                    </div>

                    <h2>${ingredient.name}</h2>

                    ${categoryText}
                </a>
            `;
        })
        .join("");
}

/*
    Searches and filters the ingredients
*/
function filterIngredients() {
    const searchText = searchInput.value
        .toLowerCase()
        .trim();

    const filteredIngredients = allIngredients.filter(
        function (ingredient) {
            const matchesSearch = ingredient.name
                .toLowerCase()
                .includes(searchText);

            const matchesCategory =
                selectedCategory === "all" ||
                ingredient.categoryKeys.includes(selectedCategory);

            return matchesSearch && matchesCategory;
        }
    );

    displayIngredients(filteredIngredients);
}

// Runs whenever the user types in the search box
searchInput.addEventListener("input", filterIngredients);

// Runs when a category button is clicked
filterButtons.forEach(function (button) {
    button.addEventListener("click", function () {
        selectedCategory = button.dataset.filter;

        filterButtons.forEach(function (otherButton) {
            otherButton.classList.remove("active");
        });

        button.classList.add("active");

        filterIngredients();
    });
});

// Starts loading the JSON information
loadIngredients();