class Ask {
  maxLength = 160;

  constructor() {
    this.askContainer = document.querySelector(".ask");
    if (this.askContainer) {
      this.askInput = this.askContainer.querySelector(".ask__input");
      this.exampleButton = this.askContainer.querySelector(
        ".ask__button-example"
      );
      this.askButton = this.askContainer.querySelector(".ask__button-ask");
      this.resetButton = this.askContainer.querySelector(".ask__button-reset");
      this.charCounter = this.askContainer.querySelector(".ask__char-count");
      this.loading = this.askContainer.querySelector(".ask__loading");

      this.resultsContainer = document.querySelector(".results");
      this.resultsList = this.resultsContainer.querySelector(".results__list");
    }
  }

  init() {
    if (!this.askContainer) return;
    this.askInput.addEventListener("input", (e) => this.checkInput(e));
    this.exampleButton.addEventListener("click", (e) => this.setExample(e));
    this.askButton.addEventListener("click", (e) => this.askClicked(e));
    this.resetButton.addEventListener("click", (e) => this.resetClicked(e));
    this.checkInput();
  }

  checkInput() {
    // check submission validity
    const charsRemaining = this.maxLength - this.askInput.value.length;
    if (charsRemaining < 0) {
      this.askButton.disabled = true;
      this.charCounter.classList.add("has-error");
    } else {
      this.askButton.disabled = false;
      this.charCounter.classList.remove("has-error");
    }
    this.charCounter.textContent = `${charsRemaining} characters remaining`;

    // check whether to display example button
    if (this.askInput.value.length === 0) {
      this.askButton.disabled = true;
      this.exampleButton.classList.remove("is-hidden");
    } else {
      this.exampleButton.classList.add("is-hidden");
    }
  }

  setExample(event) {
    event.preventDefault();
    console.log("setting example");
    this.askInput.value =
      "Tell me about some of the best things I could see with a telescope from Brighton (assuming it ever stops raining)";
    this.checkInput();
  }

  resetClicked(event) {
    event.preventDefault();
    this.askInput.value = "";
    this.checkInput();
  }

  async askClicked(event) {
    event.preventDefault();
    this.loading.classList.add("is-loading");

    const url = "../js/fake-results.json";
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }

      // fake a one second wait, use the two lines below for an instant response
      // const json = await response.json();
      // this.processResults(json);

      await setTimeout(async () => {
        const json = await response.json();
        this.processResults(json);
        this.loading.classList.remove("is-loading");
      }, 1000);
    } catch (error) {
      console.error(error.message);
      this.loading.classList.remove("is-loading");
    }
  }

  processResults(data) {
    if (data.length > 0) {
      this.resultsContainer.classList.add("is-shown");
    } else {
      this.resultsContainer.classList.remove("is-shown");
    }

    data.forEach((result) => {
      const resultsItem = document.createElement("div");
      resultsItem.classList.add("results__item");
      this.resultsList.appendChild(resultsItem);

      const resultsItemTitle = document.createElement("h3");
      resultsItemTitle.classList.add("results__item-title");
      resultsItemTitle.textContent = result.title;
      resultsItem.appendChild(resultsItemTitle);

      const resultsItemDescription = document.createElement("p");
      resultsItemDescription.classList.add("results__item-description");
      resultsItemDescription.textContent = result.description;
      resultsItem.appendChild(resultsItemDescription);
    });
  }
}

// Expose an instance of the 'Ask' class
export default new Ask();
