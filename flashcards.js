document.addEventListener("DOMContentLoaded", function () {
  let flashcards = [];
  let currentCardIndex = 0;
  let isRandomOrder = false;
  let currentGroup = "all";

  const flashcardContainer = document.getElementById("flashcard-container");
  const prevButton = document.getElementById("prev-button");
  const nextButton = document.getElementById("next-button");
  const randomOrderCheckbox = document.getElementById("random-order-checkbox");
  const tabsContainer = document.getElementById("tabs-container");

  prevButton.addEventListener("click", showPreviousCard);
  nextButton.addEventListener("click", showNextCard);
  randomOrderCheckbox.addEventListener("change", toggleRandomOrder);
  tabsContainer.addEventListener("click", handleTabClick);

  flashcards = db;
  console.log("db", db);
  flashcards = db.map((card) => {
    return {
      front: replaceCodeFragments(card.front),
      back: replaceCodeFragments(card.back),
    };
  });

  createTabs(db);
  showCard(currentCardIndex);

  function createTabs(data) {
    const groups = ["all"];
    data.forEach((card) => {
      if (card.group && !groups.includes(card.group)) {
        groups.push(card.group);
      }
    });

    tabsContainer.innerHTML = "";

    groups.forEach((group) => {
      const button = document.createElement("button");
      button.classList.add("tab-button");
      button.textContent = group.charAt(0).toUpperCase() + group.slice(1); // Capitalize first letter
      button.dataset.group = group;
      tabsContainer.appendChild(button);
    });
  }

  function showCard(index) {
    flashcardContainer.innerHTML = "";

    const cardData = flashcards[index];
    const flashcard = createFlashcard(cardData);

    flashcardContainer.appendChild(flashcard);
  }

  function createFlashcard(cardData) {
    const flashcard = document.createElement("div");
    flashcard.classList.add("flashcard");

    const frontContent = document.createElement("div");
    frontContent.innerHTML = cardData.front;
    flashcard.appendChild(frontContent);

    const backContent = document.createElement("div");
    backContent.innerHTML = cardData.back;
    backContent.style.display = "none"; // Initially hide the back side
    flashcard.appendChild(backContent);

    flashcard.addEventListener("click", function () {
      toggleCard(frontContent, backContent);
    });

    return flashcard;
  }

  function toggleCard(frontContent, backContent) {
    if (frontContent.style.display === "none") {
      frontContent.style.display = "block";
      backContent.style.display = "none";
    } else {
      frontContent.style.display = "none";
      backContent.style.display = "block";
    }
  }

  function showPreviousCard() {
    currentCardIndex =
      (currentCardIndex - 1 + flashcards.length) % flashcards.length;
    showCard(currentCardIndex);
  }

  function showNextCard() {
    currentCardIndex = (currentCardIndex + 1) % flashcards.length;
    showCard(currentCardIndex);
  }

  function toggleRandomOrder() {
    isRandomOrder = randomOrderCheckbox.checked;

    if (isRandomOrder) {
      shuffleCards();
    } else {
      flashcards.sort((a, b) => a.order - b.order);
    }

    showCard(currentCardIndex);
  }

  function shuffleCards() {
    for (let i = flashcards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [flashcards[i], flashcards[j]] = [flashcards[j], flashcards[i]];
    }
  }

  function handleTabClick(event) {
    const clickedGroup = event.target.dataset.group;
    if (clickedGroup && clickedGroup !== currentGroup) {
      currentGroup = clickedGroup;
      filterCardsByGroup();
      showCard(0);
      updateTabButtons();
    }
  }

  function filterCardsByGroup() {
    if (currentGroup === "all") {
      flashcards = db;
    } else {
      flashcards = db.filter((card) => card.group === currentGroup);
    }
  }

  function updateTabButtons() {
    const tabButtons = tabsContainer.querySelectorAll(".tab-button");
    tabButtons.forEach((button) => {
      if (button.dataset.group === currentGroup) {
        button.classList.add("active");
      } else {
        button.classList.remove("active");
      }
    });
  }

  function replaceCodeFragments(text) {
    return text.replace(/```([^`]+)```/g, "<p>$1</p>");
  }
});