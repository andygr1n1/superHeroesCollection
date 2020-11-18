/* eslint-disable arrow-parens */
document.addEventListener("DOMContentLoaded", () => {
  // eslint-disable-next-line strict
  "use strict";
  const collectionWrapper = document.querySelector(".collection-wrapper");
  const movieNameContainer = document.querySelector(".movie-name-container");

  //! f
  const addCards = (collection) => {
    collectionWrapper.textContent = "";
    collection.forEach((element) => {
      let {
        name,
        species,
        gender,
        birthDay,
        deathDay,
        status,
        actors,
        photo,
        movies,
      } = element;

      if (birthDay === undefined) {
        birthDay = "неизвестно";
      }

      const heroCard = document.createElement("div");
      heroCard.classList.add("hero-card");
      heroCard.insertAdjacentHTML(
        "beforeend",
        `
          <img class="hero-card-img" src="database/${photo}" alt="${name}">
          <div class="hero-card-name"> Имя: ${name}</div>         
          <div class="hero-card-species"> Расса: ${species}</div>
          <div class="hero-card-gender"> Пол: ${gender}</div>
          <div class="hero-card-birthday"> День Рождения: ${birthDay}</div>
          <div class="hero-card-status"> Статус: ${status}</div>`
      );

      if (deathDay !== undefined) {
        heroCard.insertAdjacentHTML(
          "beforeend",
          `
          <div class="hero-card-name"> Дата Смерти: ${deathDay}</div>`
        );
      }

      heroCard.insertAdjacentHTML(
        "beforeend",
        `
             <div class="hero-card-actors"> Настоящее имя: ${actors}</div>
             <div class="hero-card-movies"> Фильмы: ${movies}</div>
             `
      );
      collectionWrapper.append(heroCard);
    });
  };

  const addMovie = (name) => {
    movieNameContainer.textContent = `Movie: ${name}`;
  };

  const core = (response) => {
    addCards(response);
    document.addEventListener("click", (event) => {
      const target = event.target;

      if (target.closest(".all-heroes-filter")) {
        addCards(response);
        addMovie("All Movies");
      }
      
      if (target.closest(".alive-filter")) {
        addCards(response.filter((obj) => obj.status === "alive"));
        addMovie("All Movies");
      }

      if (target.closest(".menu-movie")) {
        console.log(target.textContent);
        if (target.textContent === "Select Movie") {
          const surprice = 7777777;
        } else {
          addCards(
            response.filter((obj) => {
              if (obj.movies !== undefined) {
                return obj.movies.join(",").includes(target.textContent);
              }
            })
          );
          addMovie(target.textContent);
        }
      }
    });

    const selectMovie = document.getElementById("select-movie");
    let movieList = new Set();
    response.forEach((allElements) => {
      if (allElements.movies !== undefined) {
        allElements.movies.forEach((arrayElement) => {
          movieList.add(arrayElement);
        });
      }
    });
    movieList = Array.from(movieList).sort();

    movieList.forEach((movie) => {
      const addMovie = document.createElement("li");
      addMovie.classList.add("menu-movie");
      addMovie.textContent = movie;
      selectMovie.insertAdjacentElement("beforeend", addMovie);
    });

    //!Select - menu
    const movie = document.querySelectorAll(".menu-movie");
    const activeMovie = document.querySelector(".active");
    for (let i = 1; i < movie.length; i++) {
      movie[i].style.marginTop = 50 * i + "px";
      selectMovie.style.height = 50 + 50 * i + "px";
    }
    document.addEventListener("click", (event) => {
      const target = event.target;
      if (
        !target.matches("#select-movie, .activeMovie, .menu-movie") &&
        activeMovie.classList.contains("a-active-color")
      ) {
        movie.forEach((element) => {
          element.classList.remove("show");
          activeMovie.classList.remove("a-active-color");
        });
      }
      if (target.closest(".active")) {
        activeMovie.classList.toggle("a-active-color");
        movie.forEach((element) => {
          element.classList.toggle("show");
        });
      }
    });
  };

  fetch("../database/dbHeroes.json")
    .then((response) => {
      if (response.status !== 200) {
        throw new Error("status network not 200");
      }
      return response.json();
    })
    .then((response) => core(response));
});
