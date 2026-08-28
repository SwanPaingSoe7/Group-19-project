const homeSearchForm =
    document.getElementById("home-search-form");

const homeSearchInput =
    document.getElementById("home-search-input");


homeSearchForm.addEventListener(
    "submit",
    async function (event) {
        event.preventDefault();

        const searchText =
            homeSearchInput.value.trim().toLowerCase();

        homeSearchInput.setCustomValidity("");

        if (searchText === "") {
            homeSearchInput.setCustomValidity(
                "Please enter an ingredient name."
            );

            homeSearchInput.reportValidity();
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

            const matchingIngredients =
                ingredients.filter(function (ingredient) {
                    return ingredient.name
                        .toLowerCase()
                        .includes(searchText);
                });

            // No matching ingredient
            if (matchingIngredients.length === 0) {
                homeSearchInput.setCustomValidity(
                    "No matching ingredient was found."
                );

                homeSearchInput.reportValidity();
                return;
            }

            // Exactly one match: open its detail page
            if (matchingIngredients.length === 1) {
                window.location.href =
                    `ingredient-detail.html?id=${matchingIngredients[0].id}`;

                return;
            }

            // Several matches: show them in the library
            window.location.href =
                `ingredients.html?search=${encodeURIComponent(searchText)}`;

        } catch (error) {
            homeSearchInput.setCustomValidity(
                "Unable to search ingredients."
            );

            homeSearchInput.reportValidity();
            console.error(error);
        }
    }
);


// Removes the error after the user starts typing again
homeSearchInput.addEventListener("input", function () {
    homeSearchInput.setCustomValidity("");
});