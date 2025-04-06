const dataQuestTemplate = document.querySelector("[data-quest-template]");
const dataListContainer = document.querySelector("[data-list-container]");
const searchInput = document.querySelector("[data-search]");
const filterToggle = document.querySelector("[filter-toggle]");
const filterInput = document.querySelector("[data-filter-search]");
const filterBandit = document.querySelector("[data-filter-bandit]");
const filterCovenant = document.querySelector("[data-filter-covenant]");
const paginationContainer = document.querySelector("[data-pagination-container]");

let questsearch = [];
let currentPage = 1;
const itemsPerPage = 5;

function fetchQuests(page = 1) {
  const visibilityBandit = filterBandit.getAttribute('faction-visible') === "true";
  const visibilityCovenant = filterCovenant.getAttribute('faction-visible') === "true";
  const searchValue = searchInput.value.toLowerCase();

    const params = new URLSearchParams({
      page,
      limit: itemsPerPage,
      search: searchValue,
      bandit: visibilityBandit,
      covenant: visibilityCovenant,
    });

  fetch(`https://webapi-chi-ochre.vercel.app/queststable?${params.toString()}`)
    .then((response) => response.json())
    .then((data) => {
      questsearch = data.quests.map(quest => {
        const quests = dataQuestTemplate.content.cloneNode(true);
        const questElement = quests.firstElementChild;
        const header = questElement.querySelector("[data-header]");
        const body = questElement.querySelector("[data-body]");
        const link = questElement.querySelector("[data-link]");
        const logo = questElement.querySelector("[data-logo]");
        if (header && body && link && logo) {
          header.textContent = quest.QuestName;
          body.textContent = quest.QuestDescription;
          link.href = quest.Link;
          if (quest.Faction.toLowerCase() === "bandit") {
            logo.src = "images/Bandit logo.png";
          } else if (quest.Faction.toLowerCase() === "covenant") {
            logo.src = "images/Covenant logo.png";
          }
          dataListContainer.append(questElement);
          return { name: quest.QuestName, faction: quest.Faction, element: questElement };
        } else {
          console.error('Error creating quest:', quest);
          return null;
        }
      });
      renderQuests();
      renderPagination(data.total);
    })
    .catch((error) => console.error('Error fetching quests:', error));
}

document.addEventListener("DOMContentLoaded", () => {
  fetchQuests(currentPage);
});

function renderQuests() {
  dataListContainer.innerHTML = "";
  if (questsearch.length === 0) {
    const noResultsMessage = document.createElement("p");
    noResultsMessage.textContent = "No quests found.";
    noResultsMessage.classList.add("no-results-message");
    dataListContainer.append(noResultsMessage);
    return;
  }
  questsearch.forEach(quest => {
    dataListContainer.append(quest.element);
  });
}

function renderPagination(total) {
  paginationContainer.innerHTML = "";

  if (total === 0) {
    paginationContainer.style.display = "none";
    return;
  }

  paginationContainer.style.display = "block";
  
  const totalPages = Math.ceil(total / itemsPerPage);
  const maxVisiblePages = 5;

  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

  if (endPage - startPage < maxVisiblePages - 1) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }

  if (currentPage > 1) {
    const prevButton = document.createElement("button");
    prevButton.textContent = "<";
    prevButton.classList.add("pagination-button");
    prevButton.addEventListener("click", () => {
      currentPage--;
      fetchQuests(currentPage);
    });
    paginationContainer.append(prevButton);
  }

  for (let i = startPage; i <= endPage; i++) {
    const button = document.createElement("button");
    button.textContent = i;
    button.classList.add("pagination-button");
    if (i === currentPage) {
      button.classList.add("active");
    }
    button.addEventListener("click", () => {
      currentPage = i;
      fetchQuests(currentPage);
    });
    paginationContainer.append(button);
  }

  if (currentPage < totalPages) {
    const nextButton = document.createElement("button");
    nextButton.textContent = ">";
    nextButton.classList.add("pagination-button");
    nextButton.addEventListener("click", () => {
      currentPage++;
      fetchQuests(currentPage);
    });
    paginationContainer.append(nextButton);
  }
}


filterToggle.addEventListener('click', () => {
  const visibility = filterInput.getAttribute('data-visible');

  if (visibility === "false") {
    filterInput.setAttribute('data-visible', true);
  } else if (visibility === "true") {
    filterInput.setAttribute('data-visible', false);
  }
});

const updateQuestVisibility = () => {
  fetchQuests(currentPage);
};

filterBandit.addEventListener('click', () => {
  currentPage = 1;
  const visibilityBandit = filterBandit.getAttribute('faction-visible') === "true";
  filterBandit.setAttribute('faction-visible', !visibilityBandit);
  fetchQuests(currentPage);
});

filterCovenant.addEventListener('click', () => {
  currentPage = 1;
  const visibilityCovenant = filterCovenant.getAttribute('faction-visible') === "true";
  filterCovenant.setAttribute('faction-visible', !visibilityCovenant);
  fetchQuests(currentPage);
});

searchInput.addEventListener("input", e => {
  currentPage = 1;
  updateQuestVisibility();
});