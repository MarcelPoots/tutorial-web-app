console.log('Client side javascript file is loaded!...')

const oneForm = document.querySelector('form')
const search = document.querySelector('input')
const messageOne = document.querySelector('#message-1')
const messageTwo = document.querySelector('#message-2')

oneForm.addEventListener('submit', (e) => {
    e.preventDefault()

    if (messageOne && messageTwo) {
        messageOne.textContent = 'Loading....'
        messageTwo.textContent = ''

        fetch('/search').then((response) => {
            response.json().then((data) => {
                //console.log(data)
                if (data.error) {
                    messageOne.textContent = data.error
                } else {
                    messageOne.textContent = data.name
                    messageTwo.textContent = data.info
                }
            })
        })
    }
})
