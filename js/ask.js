class Ask {
    maxLength = 160

    constructor() {
        this.askContainer = document.querySelector('.ask')
        this.showMoreButton = document.querySelector(
            '.results__show-more button'
        )
        this.clearResultsButton = document.querySelector(
            '.results__clear button'
        )
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
        if (this.clearResultsButton) {
            this.clearResultsButton.addEventListener('click', () =>
                this.clearResults()
            )
        }
        this.exampleButton.addEventListener('click', (e) => this.setExample(e))
        this.askButton.addEventListener('click', (e) => this.askClicked(e))
        this.resetButton.addEventListener('click', (e) => this.resetClicked(e))
        if (this.showMoreButton) {
            this.showMoreButton.addEventListener('click', () =>
                this.showMoreResults()
            )
        }
        this.checkInput()
    }

    clearResults() {
        this.resultsList.innerHTML = '' // Clear the results
        this.resultsContainer.classList.remove('is-shown') // Hide results section
        this.showMoreButton.classList.add('is-hidden') // Hide "Show More" button
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
        const examples = [
            'What are the best AI-themed T-shirts?',
            'Give me an example of AI merch?',
            'What kind of AI hoodies are trending?',
            'Show me cool AI-themed hats?',
            "What's a good AI slogan for a shirt?",
        ]
        this.askInput.value =
            examples[Math.floor(Math.random() * examples.length)]
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
                this.processResults(json.results) // Process results
            } else {
                this.resultsList.innerHTML =
                    '<p>No results found. Try a different question.</p>'
            }
            this.loading.classList.remove('is-loading')
        } catch (error) {
            console.error(error.message)
            this.loading.classList.remove('is-loading')
        }
    }

    // processResults(results) {
    //     this.resultsList.innerHTML = ''
    //     // check 'results' is an array and contains data
    //     if (Array.isArray(results) && results.length > 0) {
    //         results.forEach((result) => {
    //             const resultsItem = document.createElement('div')
    //             resultsItem.classList.add('results__item')

    //             const resultsItemTitle = document.createElement('h3')
    //             resultsItemTitle.classList.add('results__item-title')
    //             resultsItemTitle.textContent = result.title

    //             const resultsItemDescription = document.createElement('p')
    //             resultsItemDescription.classList.add(
    //                 'results__item-description'
    //             )
    //             resultsItemDescription.textContent = result.description

    //             resultsItem.appendChild(resultsItemTitle)
    //             resultsItem.appendChild(resultsItemDescription)
    //             this.resultsList.appendChild(resultsItem)
    //         })

    //         this.resultsContainer.classList.add('is-shown')
    //     } else {
    //         this.resultsList.innerHTML =
    //             '<p>No results found. Try a different question.</p>'
    //     }
    // }

    processResults(results) {
        this.resultsList.innerHTML = ''
        this.allResults = results
        this.displayedResults = 3

        this.renderResults()

        this.showMoreButton.classList.toggle('is-hidden', results.length <= 3)
        this.resultsContainer.classList.add('is-shown')
    }
    renderResults() {
        this.resultsList.innerHTML = ''

        this.allResults.slice(0, this.displayedResults).forEach((result) => {
            const resultsItem = document.createElement('div')
            resultsItem.classList.add('results__item')

            const resultsItemTitle = document.createElement('h3')
            resultsItemTitle.classList.add('results__item-title')
            resultsItemTitle.textContent = result.title

            const resultsItemDescription = document.createElement('p')
            resultsItemDescription.classList.add('results__item-description')
            resultsItemDescription.textContent = result.description

            resultsItem.appendChild(resultsItemTitle)
            resultsItem.appendChild(resultsItemDescription)
            this.resultsList.appendChild(resultsItem)
        })

        if (this.displayedResults >= this.allResults.length) {
            this.showMoreButton.classList.add('is-hidden')
        }
    }
    showMoreResults() {
        this.displayedResults = this.allResults.length
        this.renderResults()
    }
}

export default new Ask()
