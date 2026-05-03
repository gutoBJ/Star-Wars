let currentPageUrl = 'https://swapi.py4e.com/api/people/';

const nextButton = document.getElementById('next-button');
const backButton = document.getElementById('back-button');
const pageAtualSpan = document.getElementById('page-atual');
const pageTotal = document.getElementById('page-total');

window.onload = async () => {
    try {
        await loadCharacters(currentPageUrl);
    } catch (error) {
        console.log(error);
        alert('Erro ao carregar cards');
    }

    nextButton.addEventListener('click', loadNextPage);
    backButton.addEventListener('click', loadPreviousPage);
};

async function getCharacterImage(characterId) {
    try {
        const response = await fetch(
            `https://akabab.github.io/starwars-api/api/id/${characterId}.json`
        );

        const data = await response.json();

        return data.image;
    } catch (error) {
        console.log(error);
        return './assets/fallback.jpg';
    }
}

async function loadCharacters(url) {
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = '';

    const urlParams = new URL(url);
    const pageNumber = urlParams.searchParams.get('page') || '1';

    if (pageAtualSpan) {
        pageAtualSpan.innerText = pageNumber;
    }

    try {
        const response = await fetch(url);
        const responseJson = await response.json();

        const totalPages = Math.ceil(responseJson.count / 10);

        if (pageTotal) {
            pageTotal.innerText = totalPages;
        }

        for (const character of responseJson.results) {
            const card = document.createElement('div');

            const characterId = character.url.match(/\/people\/(\d+)\//)[1];
            const imageUrl = await getCharacterImage(characterId);

            card.className = 'cards';
            card.style.backgroundImage = `url('${imageUrl}')`;

            const characterNameBG = document.createElement('div');
            characterNameBG.className = 'character-name-bg';

            const characterName = document.createElement('span');
            characterName.className = 'character-name';
            characterName.innerText = character.name;

            characterNameBG.appendChild(characterName);
            card.appendChild(characterNameBG);

            card.onclick = () => showModal(character, characterId);

            mainContent.appendChild(card);
        }

        nextButton.disabled = !responseJson.next;
        backButton.disabled = !responseJson.previous;

        backButton.style.visibility =
            responseJson.previous ? 'visible' : 'hidden';

        nextButton.style.visibility =
            responseJson.next ? 'visible' : 'hidden';

        currentPageUrl = url;

    } catch (error) {
        console.log(error);
        alert('Erro ao carregar os personagens');
    }
}

async function loadNextPage() {
    try {
        const response = await fetch(currentPageUrl);
        const responseJson = await response.json();

        if (responseJson.next) {
            await loadCharacters(responseJson.next);
        }

    } catch (error) {
        console.log(error);
    }
}

async function loadPreviousPage() {
    try {
        const response = await fetch(currentPageUrl);
        const responseJson = await response.json();

        if (responseJson.previous) {
            await loadCharacters(responseJson.previous);
        }

    } catch (error) {
        console.log(error);
    }
}

async function showModal(character, characterId) {
    const modal = document.getElementById('modal');
    modal.style.visibility = 'visible';

    const modalContent = document.getElementById('modal-content');
    modalContent.innerHTML = '';

    const imageUrl = await getCharacterImage(characterId);

    const characterImage = document.createElement('div');
    characterImage.className = 'character-image';
    characterImage.style.backgroundImage = `url('${imageUrl}')`;

    const name = document.createElement('span');
    name.className = 'character-details';
    name.innerText = `Nome: ${character.name}`;

    const height = document.createElement('span');
    height.className = 'character-details';
    height.innerText = `Altura: ${convertHeight(character.height)}`;

    const mass = document.createElement('span');
    mass.className = 'character-details';
    mass.innerText = `Peso: ${convertMass(character.mass)}`;

    const birthYear = document.createElement('span');
    birthYear.className = 'character-details';
    birthYear.innerText = `Aniversário: ${character.birth_year}`;

    modalContent.appendChild(characterImage);
    modalContent.appendChild(name);
    modalContent.appendChild(height);
    modalContent.appendChild(mass);
    modalContent.appendChild(birthYear);
}

function hideModal() {
    document.getElementById('modal').style.visibility = 'hidden';
}

function convertHeight(height) {
    if (height === "unknown") return "desconhecida";
    return (height / 100).toFixed(2) + "m";
}

function convertMass(mass) {
    if (mass === "unknown") return "desconhecido";
    return `${mass}kg`;
}