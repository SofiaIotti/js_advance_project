import _ from 'lodash';
import { ottieniLibriCategoria, ottieniDettagliLibro } from './service';


document.addEventListener('DOMContentLoaded', () => {
  document.getElementById("searchBtn").addEventListener("click", function () {
    const categoria = document.getElementById("category").value;

    const loader = document.getElementById("loader");
    const resultsDiv = document.getElementById("result");

    loader.style.display = "block";
    resultsDiv.innerHTML = "";

    cercaLibriPerCategoria(categoria)
      .then(libri => {
        loader.style.display = "none";
        mostraRisultati(libri);
      })
      .catch(error => {
        loader.style.display = "none";
        console.error("Errore durante la ricerca:", error);
      });
  });

  function mostraRisultati(libri) {
    const resultsDiv = document.getElementById("result");
    resultsDiv.innerHTML = "";
    libri.forEach((libro) => {
      const bookElement = document.createElement("div");
      bookElement.className = "book";

      const titleElement = document.createElement("div");
      titleElement.className = "titleElement";
      titleElement.innerHTML = `<span class="arrow">&#9660;</span><h3>${_.get(libro, 'title', 'Titolo non disponibile')}</h3><p>${_.get(libro, 'authors', []).map((autore) => _.get(autore, 'name', 'Nome autore non disponibile')).join(", ")}</p>`;

      const descriptionElement = document.createElement("div");
      descriptionElement.className = "description";
      descriptionElement.style.display = "none";

      titleElement.addEventListener("click", () => {
        ottieniDettagliLibro(_.get(libro, 'key', ''))
          .then(response => {
            const description = _.get(response.data, 'description.value', 'La descrizione non è disponibile');
            const coverUrl = _.get(libro, 'cover_id')
              ? `https://covers.openlibrary.org/b/id/${_.get(libro, 'cover_id')}-M.jpg`
              : "https://via.placeholder.com/128x193.png?text=No+Cover";

            descriptionElement.innerHTML = `
              <div class="bookDetails">
                <img src="${coverUrl}" alt="Cover Image" class="coverImage" />
                <p>${description}</p>
              </div>
            `;
            descriptionElement.style.display = descriptionElement.style.display === "none" ? "block" : "none";
          })
          .catch(error => {
            console.error("Errore nel caricamento della descrizione:", error);
          });
      });

      bookElement.appendChild(titleElement);
      bookElement.appendChild(descriptionElement);
      resultsDiv.appendChild(bookElement);
    });
  }
});
