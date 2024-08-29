document.getElementById("searchBtn").addEventListener("click", function () {
  const category = document.getElementById("category").value;
  const url = `https://openlibrary.org/subjects/${category}.json`;

  const loader = document.getElementById("loader");
  const resultsDiv = document.getElementById("result");

  loader.style.display = "block";
  resultsDiv.innerHTML = "";

  axios
    .get(url)
    .then((response) => {
      const books = response.data.works;
      console.log(response.data);

      loader.style.display = "none";
      mostraRisultati(books);
    })
    .catch((error) => {
      loader.style.display = "none";
      console.error("Errore durante la ricerca:", error);
    });
});

function mostraRisultati(books) {
  const resultsDiv = document.getElementById("result");
  resultsDiv.innerHTML = "";
  books.forEach((book) => {
    const bookElement = document.createElement("div");
    bookElement.className = "book";

    const titleElement = document.createElement("div");
    titleElement.className = "titleElement";
    titleElement.innerHTML = `<span class="arrow">&#9660;</span><h3>${
      book.title
    }</h3><p>${book.authors.map((author) => author.name).join(", ")}</p>`;

    const descriptionElement = document.createElement("div");
    descriptionElement.className = "description";
    descriptionElement.style.display = "none";

    titleElement.addEventListener("click", () => {
      mostraDettagli(book.key, descriptionElement, book.cover_id);
    });

    bookElement.appendChild(titleElement);
    bookElement.appendChild(descriptionElement);
    resultsDiv.appendChild(bookElement);
  });
}
function mostraDettagli(bookKey, descriptionElement, coverId) {
  const url = `https://openlibrary.org${bookKey}.json`;
  
  axios
    .get(url)
    .then((response) => {
      const description =
        response.data.description && response.data.description.value
          ? response.data.description.value
          : "La descrizione non è disponibile";

      const coverUrl = coverId
        ? `https://covers.openlibrary.org/b/id/${coverId}-M.jpg`
        : "https://via.placeholder.com/128x193.png?text=No+Cover";

      descriptionElement.innerHTML = `
          <div class="bookDetails">
            <img src="${coverUrl}" alt="Cover Image" class="coverImage" />
            <p>${description}</p>
          </div>
        `;
      descriptionElement.style.display =
        descriptionElement.style.display === "none" ? "block" : "none";
    })
    .catch((error) => {
      console.error("Errore nel caricamento della descrizione:", error);
    });
}
