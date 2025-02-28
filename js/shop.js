class Shop {
  constructor() {
    this.searchContainer = document.querySelector(".search");
    if (this.searchContainer) {
      this.searchInput = this.searchContainer.querySelector(".search__input");
      this.searchButton = this.searchContainer.querySelector(".search__submit");
      this.sortSelector = this.searchContainer.querySelector(".search__sort");

      this.searchResultCount = this.searchContainer.querySelector(
        ".search__result-count"
      );
      this.loading = this.searchContainer.querySelector(".search__loading");

      this.productsContainer = document.querySelector(".products");
      this.productsList =
        this.productsContainer.querySelector(".products__list");
    }
  }

  init() {
    if (!this.searchContainer) return;
    this.searchInput.addEventListener("input", (e) => this.checkInput(e));
    this.searchButton.addEventListener("click", (e) => this.search(e, this.sortSelector.value));
    this.sortSelector.addEventListener("change", (e)=> {this.search(e, this.sortSelector.value);})
    this.checkInput();
    this.search();
  }

  checkInput() {
    this.searchButton.disabled = this.searchInput.value.length === 0;
  }

  async search(e, sortType) {
    if (e) e.preventDefault();

    this.loading.classList.add("is-loading");
    this.productsContainer.classList.remove("is-shown");
    this.searchResultCount.textContent = "";

    while (this.productsList.firstChild) {
      this.productsList.removeChild(this.productsList.lastChild);
    }

    const url = "https://ai-project.technative.dev.f90.co.uk/products/egg";
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }

      await setTimeout(async () => {
        const json = await response.json();
        this.processProducts(json, sortType);
        this.loading.classList.remove("is-loading");
      }, 1000);
    } catch (error) {
      console.error(error.message);
      this.loading.classList.remove("is-loading");
    }
  }

  processProducts(data, sortingType) {
    const searchTerm = this.searchInput.value.toLowerCase();
    const serverImgUrl = "https://ai-project.technative.dev.f90.co.uk/"
    const filteredProducts = data.products.filter(
      (product) =>
        product.title.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm)
    );  

    this.searchResultCount.textContent = `${filteredProducts.length} products found`;

    if (filteredProducts.length > 0) {
      this.productsContainer.classList.add("is-shown");
    } else {
      this.productsContainer.classList.remove("is-shown");
    }
    
    if ((!sortingType) || sortingType == "Sort by: Price (low to high)") {
      filteredProducts.sort(
        function(a,b) {
          return a.price - b.price;
        }
      );
    } else if (sortingType == "Sort by: Price (high to low)") {
      filteredProducts.sort(
        function(a,b) {
          return b.price - a.price;
        }
      )
    } else if (sortingType == "Sort alphabetically (A to Z)") {
      filteredProducts.sort();
    } else {
      filteredProducts.sort().reverse();
    }

    filteredProducts.forEach((product) => {
      const productsItem = document.createElement("div");
      productsItem.classList.add("products__item");
      this.productsList.appendChild(productsItem);

      const productsItemImage = document.createElement("img");
      productsItemImage.classList.add("products__item-image");
      productsItemImage.src = serverImgUrl + product.image;
      productsItem.appendChild(productsItemImage);

      const productsItemTitle = document.createElement("h3");
      productsItemTitle.classList.add("products__item-title");
      productsItemTitle.textContent = product.title;
      productsItem.appendChild(productsItemTitle);

      const productsItemDescription = document.createElement("p");
      productsItemDescription.classList.add("products__item-description");
      productsItemDescription.textContent = product.description;
      productsItem.appendChild(productsItemDescription);

      const productsItemStars = document.createElement("p");
      productsItemStars.classList.add("products__item-stars");
      productsItemStars.textContent = "⭐".repeat(product.stars);
      productsItem.appendChild(productsItemStars);

      const productsItemPrice = document.createElement("p");
      productsItemPrice.classList.add("products__item-price");
      productsItemPrice.textContent = "£ " + product.price;
      productsItem.appendChild(productsItemPrice);
    });
  }
}

// Expose an instance of the 'Shop' class
export default new Shop();
