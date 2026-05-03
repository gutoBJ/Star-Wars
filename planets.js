let currentPageUrl = 'https://swapi.py4e.com/api/planets/'

const nextButton = document.getElementById('next-button')
const backButton = document.getElementById('back-button')
const pageAtualSpan = document.getElementById('page-atual');
const pageTotal = document.getElementById('page-total')

window.onload = async () => {
    try {
        await loadPlanets(currentPageUrl)
    } catch (error) {
        console.log(error)
        alert('Erro ao carregar cards')
    }


    nextButton.addEventListener('click', loadNextPage)
    backButton.addEventListener('click', loadBackPage)
}

async function loadPlanets(url) {
    const mainContent = document.getElementById('main-content')
    mainContent.innerHTML = '';

    const urlParams = new URL(url);
    const pageNumber = urlParams.searchParams.get('page') || '1';

    if (pageAtualSpan) {
        pageAtualSpan.innerText = pageNumber;
    }

    try {
        const response = await fetch(url)
        const responseJson = await response.json()

        const totalPages = Math.ceil(responseJson.count / 10);

        if (pageTotal) {
            pageTotal.innerText = totalPages;
        }

        responseJson.results.forEach((planets) => {
            const card = document.createElement('div')
            card.style.backgroundImage = `url("https://starwars-visualguide.com/assets/img/planets/${planets.url.replace(/\D/g, "")}.jpg ")`
            card.className = 'cards'

            const characterNameBG = document.createElement('div')
            characterNameBG.className = 'character-name-bg'

            const characterName = document.createElement('span')
            characterName.className = 'character-name'
            characterName.innerText = `${planets.name}`

            characterNameBG.appendChild(characterName)
            card.appendChild(characterNameBG)

            card.onclick = () => {
                const modal = document.getElementById('modal')
                modal.style.visibility = 'visible'

                const modalContent = document.getElementById('modal-content')

                modalContent.innerHTML = ''

                const characterImage = document.createElement('div')
                characterImage.style.backgroundImage = `url("https://starwars-visualguide.com/assets/img/planets/${planets.url.replace(/\D/g, "")}.jpg")`

                characterImage.className = 'character-image'

                const name = document.createElement('span')
                name.className = 'character-details'
                name.innerText = `Nome: ${convertName(planets.name)}`

                const diameter = document.createElement('span')
                diameter.className = 'character-details'
                diameter.innerText = `Diametro: ${convertDiameter(planets.diameter)}`

                const climate = document.createElement('span')
                climate.className = 'character-details'
                climate.innerText = `Clima: ${convertClimate(planets.climate)}`

                const terrain = document.createElement('span')
                terrain.className = 'character-details'
                terrain.innerText = `Terreno: ${convertTerrain(planets.terrain)}`

                const population = document.createElement('span')
                population.className = 'character-details'
                population.innerText = `Populacao: ${covertPopulation(planets.population)}`

                modalContent.appendChild(characterImage)
                modalContent.appendChild(name)
                modalContent.appendChild(diameter)
                modalContent.appendChild(climate)
                modalContent.appendChild(terrain)
                modalContent.appendChild(population)
            }

            mainContent.appendChild(card)
        });

        nextButton.disabled = !responseJson.next
        backButton.disabled = !responseJson.previous

        backButton.style.visibility = responseJson.previous ? 'visible' : 'hidden'
        nextButton.style.visibility = responseJson.next ? 'visible' : 'hidden'

        currentPageUrl = url

    } catch (error) {
        console.log(error)
        alert('Erro ao carregar planetas')
    }

}

async function loadNextPage() {
    try {
        const response = await fetch(currentPageUrl);
        const responseJson = await response.json();

        if (responseJson.next) {
            await loadPlanets(responseJson.next);
        }
    } catch (error) {
        console.log(error);
    }
}

async function loadBackPage() {
    try {
        const response = await fetch(currentPageUrl);
        const responseJson = await response.json();

        if (responseJson.previous) {
            await loadPlanets(responseJson.previous);
        }
    } catch (error) {
        console.log(error);
    }
}


function hideModal() {
    const modal = document.getElementById('modal')
    modal.style.visibility = 'hidden'
}

function convertName(names) {
    const name = {
        unknown: 'desconhecido'
    }

    return name[names.toLowerCase()] || names;
}

function convertDiameter(diametros) {
    const diametro = {
        unknown: 'desconhecido'
    }

    return diametro[diametros.toLowerCase()] || diametros;
}

function convertClimate(climate) {
    const climas = {
        arid: 'arido',
        temperate: 'temperado',
        tropical: 'tropical',
        frozen: 'congelado',
        murky: 'obscuro',
        hot: 'quente',
        frigid: 'frigido',
        polluted: 'poluido',
        superheated: 'superaquecido',
        artificialtemperate: 'temperado artificial',
        covert: () => {

        },
        unknown: 'desconhecido'
    }
    return climas[climate.toLowerCase()] || climate;
}

function convertTerrain(terrain) {
    const terreno = {
        desert: 'deserto',
        ocean: 'oceano',
        grass: 'grama',
        cityscape: 'paisagens urbanas',
        verdant: 'verdejante',
        rocky: 'rochoso',
        deserts: 'desertos',
        unknown: 'deconhecido'
    }

    return terreno[terrain.toLowerCase()] || terrain;
}

function covertPopulation(people) {
    const populacao = {
        unknown: 'desconhecida'
    }

    return populacao[people.toLowerCase()] || people
}