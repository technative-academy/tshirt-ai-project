class Ask {
  maxLength = 160

  constructor() {
      this.askContainer = document.querySelector('.ask')
      if (this.askContainer) {
          this.askInput = this.askContainer.querySelector('.ask__input')
          this.exampleButton = this.askContainer.querySelector(
              '.ask__button-example'
          )
          this.askButton = this.askContainer.querySelector('.ask__button-ask')
          this.resetButton =
              this.askContainer.querySelector('.ask__button-reset')
          this.charCounter =
              this.askContainer.querySelector('.ask__char-count')
          this.loading = this.askContainer.querySelector('.ask__loading')

          this.resultsContainer = document.querySelector('.results')
          this.resultsList =
              this.resultsContainer.querySelector('.results__list')
      }
  }

  init() {
      if (!this.askContainer) return
      this.askInput.addEventListener('input', (e) => this.checkInput(e))
      this.exampleButton.addEventListener('click', (e) => this.setExample(e))
      this.askButton.addEventListener('click', (e) => this.askClicked(e))
      this.resetButton.addEventListener('click', (e) => this.resetClicked(e))
      this.checkInput()
  }

  checkInput() {
      // check submission validity
      const charsRemaining = this.maxLength - this.askInput.value.length
      if (charsRemaining < 0) {
          this.askButton.disabled = true
          this.charCounter.classList.add('has-error')
      } else {
          this.askButton.disabled = false
          this.charCounter.classList.remove('has-error')
      }
      this.charCounter.textContent = `${charsRemaining} characters remaining`

      // check whether to display example button
      if (this.askInput.value.length === 0) {
          this.askButton.disabled = true
          this.exampleButton.classList.remove('is-hidden')
      } else {
          this.exampleButton.classList.add('is-hidden')
      }
  }

  setExample(event) {
      event.preventDefault()
      console.log('setting example')
      this.askInput.value =
          'Tell me about some of the best things I could see with a telescope from Brighton (assuming it ever stops raining)'
      this.checkInput()
  }

  resetClicked(event) {
      event.preventDefault()
      this.askInput.value = ''
      this.checkInput()
  }

  async askClicked(event) {
      event.preventDefault()
      this.loading.classList.add('is-loading')

      const query = encodeURIComponent(this.askInput.value)
      const url =
          'https://ai-project.technative.dev.f90.co.uk/ai/egg?query=${query}'
      try {
          const response = await fetch(url)
          if (!response.ok) {
              throw new Error(`Response status: ${response.status}`)
          }
          const json = await response.json() 
          console.log(json)
          // fake a one second wait, use the two lines below for an instant response
          // const json = await response.json();
          // this.processResults(json);
          if (json.results && Array.isArray(json.results)) {
            this.processResults(json.results);  // Process results
        } else {
            this.resultsList.innerHTML = '<p>No results found. Try a different question.</p>';
        }
        this.loading.classList.remove('is-loading'); 
      } catch (error) {
          console.error(error.message)
          this.loading.classList.remove('is-loading')
      }
  }

  processResults(results) {
      this.resultsList.innerHTML = ''
      // check 'results' is an array and contains data
      if (Array.isArray(results) && results.length > 0) {
          results.forEach((result) => {
              const resultsItem = document.createElement('div')
              resultsItem.classList.add('results__item')

              const resultsItemTitle = document.createElement('h3')
              resultsItemTitle.classList.add('results__item-title')
              resultsItemTitle.textContent = result.title

              const resultsItemDescription = document.createElement('p')
              resultsItemDescription.classList.add(
                  'results__item-description'
              )
              resultsItemDescription.textContent = result.description

              resultsItem.appendChild(resultsItemTitle)
              resultsItem.appendChild(resultsItemDescription)
              this.resultsList.appendChild(resultsItem)
          })

          this.resultsContainer.classList.add('is-shown')
      } else {
          this.resultsList.innerHTML =
              '<p>No results found. Try a different question.</p>'
      }
  }
}

export default new Ask()
