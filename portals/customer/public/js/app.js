console.log('Client side javascript file is loaded!...')

const weatherForm = document.querySelector('form')
const search = document.querySelector('input')
const messageOne = document.querySelector('#message-1')
const messageTwo = document.querySelector('#message-2')

weatherForm.addEventListener('submit', (e) => {
    e.preventDefault()


    messageOne.textContent = 'Marcel'
    messageTwo.textContent = 'Good guy....'

    // fetch('/login' ).then((response) => {
    //     response.json().then((data) => {
    //         //console.log(data)
    //         if (data.error) {
    //             messageOne.textContent = data.error
    //         } else {
    //             messageOne.textContent = data.name
    //             messageTwo.textContent = data.info
    //         }
    //     })
    // })
})
