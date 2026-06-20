const grid = document.getElementById('character-grid');
const modal = document.getElementById('detail-modal');
const closeModal = document.getElementById('close-modal');
const modalInfo = document.getElementById('modal-info');

async function fetchCharacters() {
    try {
        const response = await fetch('https://dragonball-api.com/api/characters?limit=15');
        
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        
        if (!data || (Array.isArray(data) && data.length === 0) || (!Array.isArray(data) && !data.items)) {
            throw new Error('La API no devolvió datos válidos');
        }
        
        const characters = Array.isArray(data) ? data : data.items;
        buildUI(characters);
        
    } catch (error) {
        const errorDiv = document.createElement('div');
        errorDiv.classList.add('error');
        errorDiv.textContent = `❌ Hubo un problema: ${error.message}`;
        grid.appendChild(errorDiv);
        console.error('Error fetching characters:', error);
    }
}

function buildUI(characters) {
    grid.innerHTML = ''; 
    
    characters.forEach((character, index) => {
        const card = document.createElement('div');
        card.classList.add('card');
        
        const img = document.createElement('img');
        img.src = character.image || 'https://via.placeholder.com/250x250?text=Sin+Imagen';
        img.alt = character.name;
        img.onerror = () => img.src = 'https://via.placeholder.com/250x250?text=Error+Imagen';
        
        const name = document.createElement('h3');
        name.textContent = character.name;
        
        const description = document.createElement('p');
        description.textContent = character.race || 'Personaje desconocido';
        
        card.appendChild(img);
        card.appendChild(name);
        card.appendChild(description);
        
        card.addEventListener('click', () => openModal(character));
        
        grid.appendChild(card);
        
        setTimeout(() => {
            card.classList.add('visible');
        }, index * 100);
    });
}

function openModal(character) {
    const modalContent = `
        <h2>${character.name}</h2>
        <p><strong>Raza:</strong> ${character.race || 'Desconocida'}</p>
        <p><strong>Ki:</strong> ${character.ki ? character.ki.toLocaleString() : 'N/A'}</p>
        <p><strong>Ki Máximo:</strong> ${character.maxKi ? character.maxKi.toLocaleString() : 'N/A'}</p>
        <p><strong>Género:</strong> ${character.gender || 'Desconocido'}</p>
        <p><strong>Afinidad:</strong> ${character.affiliation || 'Neutral'}</p>
    `;
    
    modalInfo.innerHTML = modalContent;
    modal.classList.add('show');
}

closeModal.addEventListener('click', () => {
    modal.classList.remove('show');
});

modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.classList.remove('show');
    }
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('show')) {
        modal.classList.remove('show');
    }
});

document.addEventListener('DOMContentLoaded', () => {
    fetchCharacters();
});