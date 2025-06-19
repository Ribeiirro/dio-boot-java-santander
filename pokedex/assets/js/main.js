const pokemonList = document.getElementById("pokemonList");
const loadMoreButton = document.getElementById("loadMoreButton");

const maxRecords = 511;
console.log("numero de pokemons", maxRecords);
const limit = 10;
let offset = 0;

function convertPokemonToLi(pokemon) {
  return `
        <li class="pokemon ${pokemon.type}">
            <span class="number">#${pokemon.number}</span>
            <span class="name">${pokemon.name}</span>

            <div class="detail">
                <ol class="types">
                    ${pokemon.types
                      .map((type) => `<li class="type ${type}">${type}</li>`)
                      .join("")}
                </ol>

                <img src="${pokemon.photo}"
                     alt="${pokemon.name}">
            </div>
        </li>
    `;
}

function loadPokemonItens(offset, limit) {
  pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
    const newHtml = pokemons.map(convertPokemonToLi).join("");
    pokemonList.innerHTML += newHtml;
  });
}

loadPokemonItens(offset, limit);

loadMoreButton.addEventListener("click", () => {
  offset += limit;
  const qtdRecordsWithNexPage = offset + limit;

  if (qtdRecordsWithNexPage >= maxRecords) {
    const newLimit = maxRecords - offset;
    loadPokemonItens(offset, newLimit);

    loadMoreButton.parentElement.removeChild(loadMoreButton);
  } else {
    loadPokemonItens(offset, limit);
  }
});

function showPokemonModal(pokemonData) {
  const modal = document.getElementById("pokemonModal");

  // Aqui você atualizaria os dados do modal dinamicamente (exemplo):
  modal.querySelector(".id").textContent = `#${pokemonData.number}`;
  modal.querySelector(".name").textContent = pokemonData.name;
  modal.querySelector(".avatar").src = pokemonData.photo;
  modal.querySelector(".avatar").alt = pokemonData.name;

  // Tipos
  const typesContainer = modal.querySelector(".types");
  typesContainer.innerHTML = pokemonData.types
    .map((type) => `<li class="type ${type}">${type}</li>`)
    .join("");

  // Classe de cor por tipo (limpa e aplica)
  const modalContent = modal.querySelector(".modal-content");
  modalContent.className = `modal-content pokemon-detail ${pokemonData.type}`;

  // Exibe
  modal.classList.remove("hidden");
}

// Fechar modal
document.querySelectorAll(".close-modal, .modal-overlay").forEach((el) => {
  el.addEventListener("click", () => {
    document.getElementById("pokemonModal").classList.add("hidden");
  });
});

document.addEventListener("click", (e) => {
  const card = e.target.closest(".pokemon");
  if (!card) return;

  const pokemonData = {
    number: card.querySelector(".number").textContent.replace("#", ""),
    name: card.querySelector(".name").textContent,
    photo: card.querySelector("img").src,
    types: Array.from(card.querySelectorAll(".type")).map((t) => t.textContent),
    type: card.classList[1], // A segunda classe é o tipo base (grass, fire...)
  };

  showPokemonModal(pokemonData);
});
