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

  const request = new XMLHttpRequest();
  request.open("GET", "../database/dbHeroes.json");
  request.setRequestHeader("Content-type", "application/json");
  request.send();
  request.addEventListener("readystatechange", (event) => {
    try {
      if (request.readyState === 4 && request.status === 200) {
        let heroesData = JSON.parse(request.responseText);
        addCards(heroesData);

        document.addEventListener("click", (event) => {
          const target = event.target;

          if (target.closest(".alive-filter")) {
            heroesData = JSON.parse(request.responseText).filter(
              (obj) => obj.status === "alive"
            );
            addCards(heroesData);
            addMovie("All Movies");
          }
          if (target.closest(".dead-filter")) {
            heroesData = JSON.parse(request.responseText).filter(
              (obj) => obj.status === "deceased"
            );
            addCards(heroesData);
            addMovie("All Movies");
          }

          if (target.closest(".all-heroes-filter")) {
            heroesData = JSON.parse(request.responseText);
            addCards(heroesData);
            addMovie("All Movies");
          }

          if (target.closest(".movie-filter")) {
            heroesData = JSON.parse(request.responseText).filter((obj) => {
              if (obj.movies !== undefined) {
                return obj.movies.join(",").includes("Doctor Strange");
              }
            });
            console.log(heroesData);
            addCards(heroesData);
            addMovie("Doctor Strange");
          }
        });
      }
    } catch (e) {
      console.warn(e.name);
      collectionWrapper.textContent = "СОЗДАТЬ ФОРМУ ОТПРАВКИ ОШИБКИ";
    }
  });

  //!Select - menu
  const movie = document.querySelectorAll(".movie");
  const selectMovie = document.getElementById("select-movie");
  const activeMovie = document.querySelector(".active");

  for (let i = 1; i < movie.length; i++) {
    movie[i].style.marginTop = 28 * i + "px";
  }

  document.addEventListener("click", (event) => {
    const target = event.target;
    console.log(target);

    if (
      !target.matches(".select-movie, .activeMovie, .movie, .movie-link") &&
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
});
