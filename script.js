// DOM Elements
const dropdownBtn = document.getElementById("drop-text");
const list = document.getElementById("list");
const icon = document.getElementById("icon");
const span = document.getElementById("span");
const input = document.getElementById("search-input");
const clearButton = document.getElementById("clear-button");
const suggestionsList = document.createElement("ul");
suggestionsList.classList.add("suggestions");
input.parentNode.appendChild(suggestionsList);

const recentSearches = JSON.parse(localStorage.getItem("recentSearches")) || [];
const suggestionsData = [
    "Software development",
    "Web development",
    "Data Analyst",
    "IT Consultant",
    "Network administrator",
    "Cybersecurity",
    "Artificial Intelligence",
    "Machine Learning",
    "Cloud Computing",
    "Blockchain"
];
let currentFocus = -1;

// Dropdown toggle
dropdownBtn.onclick = function () {
    const isExpanded = list.classList.toggle("show");
    icon.style.transform = isExpanded ? "rotate(180deg)" : "rotate(0deg)";
};

// Close dropdown when clicking outside
window.onclick = function (e) {
    if (!dropdownBtn.contains(e.target)) {
        list.classList.remove("show");
        icon.style.transform = "rotate(0deg)";
    }
};

// Dropdown selection
document.querySelectorAll(".dropdown-list-item").forEach(item => {
    item.onclick = function (e) {
        span.innerText = e.target.innerText;
        input.placeholder = e.target.innerText === "Everything" ? "Search Anything..." : `Search in ${e.target.innerText}...`;
    };
});

// Filter and display suggestions
function showSuggestions(query) {
    const category = span.textContent === "Everything" ? "" : span.textContent.toLowerCase();
    const filteredSuggestions = suggestionsData.filter(item =>
        item.toLowerCase().includes(query.toLowerCase()) &&
        item.toLowerCase().includes(category)
    );

    suggestionsList.innerHTML = "";

    if (filteredSuggestions.length > 0) {
        filteredSuggestions.forEach(suggestion => {
            const listItem = document.createElement("li");
            listItem.textContent = suggestion;
            listItem.addEventListener("click", () => {
                input.value = suggestion;
                addRecentSearch(suggestion);
                suggestionsList.style.display = "none";
            });
            suggestionsList.appendChild(listItem);
        });
        suggestionsList.style.display = "block";
    } else {
        suggestionsList.style.display = "none";
    }
}

// Keyboard navigation
input.addEventListener("keydown", (e) => {
    const items = suggestionsList.getElementsByTagName("li");
    if (e.key === "ArrowDown") {
        currentFocus++;
        addActive(items);
    } else if (e.key === "ArrowUp") {
        currentFocus--;
        addActive(items);
    } else if (e.key === "Enter") {
        e.preventDefault();
        if (currentFocus > -1) {
            items[currentFocus].click();
        }
    }
});

// Active suggestion highlight
function addActive(items) {
    if (!items) return false;
    removeActive(items);
    currentFocus = (currentFocus >= items.length) ? 0 : (currentFocus < 0) ? items.length - 1 : currentFocus;
    items[currentFocus].classList.add("suggestion-active");
}

// Remove active highlight
function removeActive(items) {
    for (let i = 0; i < items.length; i++) {
        items[i].classList.remove("suggestion-active");
    }
}

// Store recent searches
function addRecentSearch(query) {
    if (!recentSearches.includes(query)) {
        recentSearches.unshift(query);
        if (recentSearches.length > 5) recentSearches.pop();
        localStorage.setItem("recentSearches", JSON.stringify(recentSearches));
    }
}

// Show recent searches on focus
input.addEventListener("focus", () => {
    if (recentSearches.length > 0) {
        suggestionsList.innerHTML = "";
        recentSearches.forEach(search => {
            const listItem = document.createElement("li");
            listItem.textContent = search;
            listItem.addEventListener("click", () => {
                input.value = search;
                suggestionsList.style.display = "none";
            });
            suggestionsList.appendChild(listItem);
        });
        suggestionsList.style.display = "block";
    }
});

// Clear search and hide suggestions
clearButton.addEventListener("click", () => {
    input.value = "";
    clearButton.style.display = "none";
    suggestionsList.style.display = "none";
});

// Show clear button based on input
input.addEventListener("input", () => {
    clearButton.style.display = input.value ? "block" : "none";
    showSuggestions(input.value);
});

// Dark mode toggle
const themeToggle = document.getElementById("theme-toggle");
const toggleIcon = document.getElementById("toggle-icon");

themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    toggleIcon.classList.toggle("fa-moon", document.body.classList.contains("dark-mode"));
    toggleIcon.classList.toggle("fa-sun", !document.body.classList.contains("dark-mode"));
});

// Voice search functionality
const voiceSearchButton = document.getElementById("voice-search");
voiceSearchButton.addEventListener("click", () => {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.start();

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        input.value = transcript;
        showSuggestions(transcript);
    };

    recognition.onerror = (event) => {
        console.error("Voice search error:", event.error);
    };
});
// Show or hide the clear button and toggle the voice search button based on input
input.addEventListener("input", () => {
    if (input.value) {
        clearButton.style.display = "block"; // Show the clear button
        voiceSearchButton.style.display = "none"; // Hide the voice search button
    } else {
        clearButton.style.display = "none"; // Hide the clear button
        voiceSearchButton.style.display = "flex"; // Show the voice search button
    }
});

// Clear the search input and restore the voice search button when the clear button is clicked
clearButton.addEventListener("click", () => {
    input.value = "";
    clearButton.style.display = "none"; // Hide the clear button
    suggestionsList.style.display = "none"; // Hide suggestions
    voiceSearchButton.style.display = "flex"; // Show the voice search button
    input.focus(); // Refocus the input after clearing
});
