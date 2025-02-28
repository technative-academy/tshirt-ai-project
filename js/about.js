class about {
    constructor() {
        document.addEventListener('DOMContentLoaded', () => {
            const tabButtons = document.querySelectorAll('.tab-button')
            const tabContents = document.querySelectorAll('.tab-content')

            tabButtons.forEach((button) => {
                button.addEventListener('click', () => {
                    // Remove active class from all buttons
                    tabButtons.forEach((btn) => btn.classList.remove('active'))
                    // Hide all tab contents
                    tabContents.forEach((content) =>
                        content.classList.remove('active')
                    )

                    // Add active class to clicked button
                    button.classList.add('active')
                    // Show the corresponding tab content
                    document
                        .getElementById(button.dataset.tab)
                        .classList.add('active')
                })
            })
        })
    }
}

export default new about()
