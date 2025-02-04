const dataQuestTemplate = document.querySelector("[data-quest-template]");
const dataListContainer = document.querySelector("[data-list-container]");
const searchInput = document.querySelector("[data-search]");
const filterToggle = document.querySelector("[filter-toggle]");
const filterInput = document.querySelector("[data-filter-search]")
const filterBandit = document.querySelector("[data-filter-bandit]");
const filterCovenant = document.querySelector("[data-filter-covenant]");

let questsearch = [];

fetch('http://localhost:3000/queststable')
  .then((response) => response.json())
  .then((data) => {
   questsearch = data.map(quest => {
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
  })
  .catch((error) => console.error('Error fetching quests:', error));

filterToggle.addEventListener('click', () => {
  const visibility = filterInput.getAttribute('data-visible'); 

  if (visibility === "false"){
    filterInput.setAttribute('data-visible', true);
  } else if (visibility === "true") {
    filterInput.setAttribute('data-visible', false);
  }
});

const updateQuestVisibility = () => {
  const visibilityBandit = filterBandit.getAttribute('faction-visible') === "true";
  const visibilityCovenant = filterCovenant.getAttribute('faction-visible') === "true";
  const searchValue = searchInput.value.toLowerCase();

  questsearch.forEach(quest => {
    const isBandit = quest.faction.toLowerCase() === "bandit";
    const isCovenant = quest.faction.toLowerCase() === "covenant";
    const matchesSearch = quest.name.toLowerCase().includes(searchValue);

    if (((visibilityBandit && isBandit) || (visibilityCovenant && isCovenant) || (!visibilityBandit && !visibilityCovenant)) && matchesSearch) {
      quest.element.classList.remove("hide");
    } else {
      quest.element.classList.add("hide");
    }
  });
};

filterBandit.addEventListener('click', () => {
  const visibilityBandit = filterBandit.getAttribute('faction-visible') === "true";
  filterBandit.setAttribute('faction-visible', !visibilityBandit);
  updateQuestVisibility();
});

filterCovenant.addEventListener('click', () => {
  const visibilityCovenant = filterCovenant.getAttribute('faction-visible') === "true";
  filterCovenant.setAttribute('faction-visible', !visibilityCovenant);
  updateQuestVisibility();
});

searchInput.addEventListener("input", e => {
        updateQuestVisibility();
});