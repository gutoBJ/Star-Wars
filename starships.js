let currentPageUrl = 'https://swapi.dev/api/starships/'

const nextButton = document.getElementById('next-button')
const backButton = document.getElementById('back-button')

window.onload = async () => { /* window.onload => Toda vez que a página 
for carregada ou recarregada vai ser chamada essa função 
(arrow function) */

    try { /* Tente fazer o que tá dentro dessas chaves.
    Se for bem sucedido vai executar o que tá dentro da chaves, caso não
    seja bem sucedido então vai fazer o que tá dentro do catch */
        await loadCharacters(currentPageUrl);
    } catch (error) {
        console.log(error);
        alert('Erro ao carregar cards')
    }


    nextButton.addEventListener('click', loadNextPage)
    backButton.addEventListener('click', loadPreviousPage)
};

async function loadCharacters(url) {
    const mainContent = document.getElementById('main-content')
    mainContent.innerHTML = ''; // Limpar os resultados anteriores

    try {
        const response = await fetch(url)
        const responseJson = await response.json();

        responseJson.results.forEach((starships) => {
            const card = document.createElement('div')
            card.style.backgroundImage = `url('https://starwars-visualguide.com/assets/img/starships/${starships.url.replace(/\D/g, "")}.jpg')`
            card.className = 'cards'

            // RegExp -> expressão regular -> /\D/g, ""

            const characterNameBG = document.createElement('div')
            characterNameBG.className = 'character-name-bg'

            const characterName = document.createElement('span')
            characterName.className = 'character-name'
            characterName.innerText = `${starships.name}`

            characterNameBG.appendChild(characterName)
            card.appendChild(characterNameBG)

            card.onclick = () => {
                const modal = document.getElementById('modal')
                modal.style.visibility = 'visible'

                const modalContent = document.getElementById('modal-content')
                modalContent.innerHTML = ''

                const characterImage = document.createElement('div')
                characterImage.style.backgroundImage = `url('https://starwars-visualguide.com/assets/img/starships/${starships.url.replace(/\D/g, "")}.jpg')`
                characterImage.className = 'character-image'
                
                const name = document.createElement('span')
                name.className = 'character-details'
                name.innerText = `Nome: ${starships.name}`

                const characterHeight = document.createElement('span')
                characterHeight.className = 'character-details'
                characterHeight.innerText = `Modelo: ${starships.model}`

                const mass = document.createElement('span')
                mass.className = 'character-details'
                mass.innerText = `Comprimento: ${starships.length}`
            
                const eyeColor = document.createElement('span')
                eyeColor.className = 'character-details'
                eyeColor.innerText = `Passageiros: ${starships.passengers}`

                const birthYear = document.createElement('span')
                birthYear.className = 'character-details'
                birthYear.innerText = `Capacidade: ${starships.cargo_capacity}`


                modalContent.appendChild(characterImage)
                modalContent.appendChild(name)
                modalContent.appendChild(characterHeight)
                modalContent.appendChild(mass)
                modalContent.appendChild(eyeColor)
                modalContent.appendChild(birthYear)
            }

            mainContent.appendChild(card)
        });

        nextButton.disabled = !responseJson.next
        backButton.disabled = !responseJson.previous

        backButton.style.visibility = responseJson.previous? 'visible' : 'hidden'
        nextButton.style.visibility = responseJson.next? 'visible' : 'hidden'

        currentPageUrl = url

    } catch (error) {
        alert('Erro ao carregar os personagens')
        console.log(error)
    }
} 


async function loadNextPage() {
    if (!currentPageUrl) return; // se o valor dessa variavel for nulo, for false, for inexistente vai dar um return -> vai interromper a execução da função
    
    try {
        let pageAtual = document.getElementById('page-atual')
        const response = await fetch(currentPageUrl)
        const responseJson = await response.json()

        await loadCharacters(responseJson.next)

        pageAtual.innerText = +pageAtual.innerText + 1


    } catch (error) {
        console.log(error)
        alert('Erro ao carregar a próxima página')
    }
}

async function loadPreviousPage() {
    if (!currentPageUrl) return; // return -> vai interromper a execução da função

    try {
        let pageAtual = document.getElementById('page-atual')
        const response = await fetch(currentPageUrl)
        const responseJson = await response.json()

        await loadCharacters(responseJson.previous)

        pageAtual.innerText = +pageAtual.innerText - 1

    } catch (error) {
        console.log(error)
        alert('Erro ao carregar a página anterior')
    }
}

function hideModal() {
    const modal = document.getElementById('modal')
    modal.style.visibility = 'hidden'
}