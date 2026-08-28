// Finds the detail page HTML elements
const nameElement =
    document.getElementById("detail-name");

const imageElement =
    document.getElementById("detail-image");

const categoriesElement =
    document.getElementById("detail-categories");

const descriptionElement =
    document.getElementById("detail-description");

const benefitsElement =
    document.getElementById("detail-benefits");

const foundInElement =
    document.getElementById("detail-found-in");

const suitableForElement =
    document.getElementById("detail-suitable-for");

const tipElement =
    document.getElementById("detail-tip");


// Gets the ingredient ID from the page address
const pageParameters =
    new URLSearchParams(window.location.search);

const ingredientId =
    pageParameters.get("id");


/*
    Creates list items
*/
function displayList(element, items) {
    element.innerHTML = "";

    items.forEach(function (item) {
        const listItem =
            document.createElement("li");

        listItem.textContent = item;

        element.appendChild(listItem);
    });
}


/*
    Shows an error if an ingredient cannot be found
*/
function showError(message) {
    nameElement.textContent =
        "Ingredient Not Found";

    descriptionElement.textContent =
        message;

    categoriesElement.innerHTML = "";
    benefitsElement.innerHTML = "";
    foundInElement.innerHTML = "";
    suitableForElement.innerHTML = "";
    tipElement.textContent = "";
}


/*
    Loads the selected ingredient from JSON
*/
async function loadIngredientDetails() {
    if (!ingredientId) {
        showError(
            "Please return to the Ingredient Library and select an ingredient."
        );

        return;
    }

    try {
        const response =
            await fetch("data/ingredients.json");

        if (!response.ok) {
            throw new Error(
                "The JSON file could not be loaded."
            );
        }

        const ingredients =
            await response.json();

        const selectedIngredient =
            ingredients.find(function (ingredient) {
                return ingredient.id === ingredientId;
            });

        if (!selectedIngredient) {
            showError(
                "The selected ingredient does not exist."
            );

            return;
        }


        // Changes the browser tab title
        document.title =
            `${selectedIngredient.name} | SkinWise`;


        // Displays the ingredient name
        nameElement.textContent =
            selectedIngredient.name;
        
        imageElement.src =
            selectedIngredient.image;

        imageElement.alt =
            selectedIngredient.name;


        // Displays the categories
        categoriesElement.innerHTML =
            selectedIngredient.categories
                .map(function (category) {
                    return `
                        <span class="detail-category">
                            ${category}
                        </span>
                    `;
                })
                .join("");


        // Displays the description
        descriptionElement.textContent =
            selectedIngredient.description ||
            selectedIngredient.summary;


        // Displays the benefits
        displayList(
            benefitsElement,
            selectedIngredient.benefits || [
                selectedIngredient.summary
            ]
        );


        // Displays commonly found in
        displayList(
            foundInElement,
            selectedIngredient.foundIn || [
                "Serums",
                "Moisturisers",
                "Creams"
            ]
        );


        // Displays suitable skin types
        displayList(
            suitableForElement,
            selectedIngredient.suitableFor || [
                "Suitability depends on the complete product formula",
                "Patch testing is recommended"
            ]
        );


        // Displays the beginner tip
        tipElement.textContent =
            selectedIngredient.tip ||
            "Introduce new skincare products gradually and follow the product instructions.";

    } catch (error) {
        showError(
            "Unable to load the ingredient information."
        );

        console.error(error);
    }
}


// Starts loading the selected ingredient
loadIngredientDetails();