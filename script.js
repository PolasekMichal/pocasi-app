class Weather {
    constructor(apiKey) {
        this._apiKey = 'eba0784dff26610dc436a2916947e6a2';
    }

    searchWeather = async () => {
        const city = searchBar.value.trim();
        const result = city === "";
        if (result) {
            alert("Zadejte prosím platné jméno města.");
            return;
        }

        const res = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&lang=cs&appid=${this._apiKey}`
        );

        if (res.ok) {
            const data = await res.json();
            this.displayWeather(data, city);
        } else {
            alert("Město nenalezeno. Zadejte prosím platné jméno města.");
        }
    };

    displayWeather = (data, city) => {
        const { name } = data;
        const { icon, description } = data.weather[0];
        const { temp, humidity, speed } = data.main;

        document.querySelector(".city").innerText = `Počasí ve městě ${name}`;
        document.querySelector(".icon").src = `http://openweathermap.org/img/wn/${icon}.png`;
        document.querySelector(".description").innerText = description;
        document.querySelector(".temp h2").innerText = `${temp}°C`;
        document.querySelector(".humidity").innerText = `Vlhkost ${humidity}%`;
      
        
    
        if (data.wind && data.wind.speed) {
            document.querySelector(".wind").innerText = `Rychlost větru ${data.wind.speed}km/h`;
        } else {
            document.querySelector(".wind").innerText = "Rychlost větru není k dispozici";
        }
       
        const historyInfo = {
            name,
            icon,
            description,
            temp,
            humidity,
            speed,
        };

        saved.push({ city, historyInfo });
        localStorage.setItem("historyList", JSON.stringify(saved));

        this.listBuilder(city, historyInfo, history, false);
        searchBar.value = "";
    };

    addToFavorites = () => {
        const city = searchBar.value.trim();
        const result = city === "";
        if (result) {
            alert("Zadejte prosím platné jméno města.");
            return;
        }

        this.searchWeatherAndAddToFavorites(city);
    };

    searchWeatherAndAddToFavorites = async (city) => {
        const res = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&lang=cs&appid=${this._apiKey}`
        );

        if (res.ok) {
            const data = await res.json();
            const { name } = data;
            const { icon, description } = data.weather[0];
            const { temp, humidity, speed } = data.main;

            const historyInfo = {
                name,
                icon,
                description,
                temp,
                humidity,
                speed,
            };

            this.addToFavoritesList(city, historyInfo);
        } else {
            alert("Město nenalezeno. Zadejte prosím platné jméno města.");
        }
    };

    addToFavoritesList = (city, historyInfo) => {
        const favorites = localStorage.getItem("favoriteList")
            ? JSON.parse(localStorage.getItem("favoriteList"))
            : [];

        const isCityAlreadyFavorite = favorites.some((fav) => fav.city === city);

        if (!isCityAlreadyFavorite) {
            favorites.push({ city, historyInfo });
            localStorage.setItem("favoriteList", JSON.stringify(favorites));
            this.displayFavorites();
        } else {
            alert("Toto město je již v oblíbených.");
        }
    };

    removeFromFavorites = (city) => {
        const favorites = localStorage.getItem("favoriteList")
            ? JSON.parse(localStorage.getItem("favoriteList"))
            : [];

        const updatedFavorites = favorites.filter(item => item.city !== city);

        localStorage.setItem("favoriteList", JSON.stringify(updatedFavorites));
        this.displayFavorites();
    };

    listBuilder = (city, historyInfo, container, isFavorite) => {
    const histories = document.createElement("li");

   
    const iconSrc = historyInfo.icon ? `http://openweathermap.org/img/wn/${historyInfo.icon}.png` : '';
    const speedHTML = historyInfo.speed ? `Rychlost větru: ${historyInfo.speed}km/h` : '';

    histories.innerHTML = `
    <div class="card2-content">
        <strong>${city}</strong><br>
        <img class="icon icon-for-card2" src="${iconSrc}" alt="Weather Icon">
        ${historyInfo.description}<br>
        Teplota: ${historyInfo.temp}°C, Vlhkost: ${historyInfo.humidity}%, ${speedHTML}
    </div>
`;

if (!isFavorite) {
    const deleteButton = document.createElement("button");
    deleteButton.innerText = "Smazat";
    deleteButton.addEventListener("click", () => {
        this.deleteHistoryItem(city);
    });
    histories.appendChild(deleteButton);
} else {
    const removeFromFavoritesButton = document.createElement("button");
    removeFromFavoritesButton.innerText = "Odebrat z oblíbených";
    removeFromFavoritesButton.addEventListener("click", () => {
        this.removeFromFavorites(city);
    });
    histories.appendChild(removeFromFavoritesButton);
}

container.appendChild(histories);}


    

    deleteHistoryItem = (city) => {
        const indexToDelete = saved.findIndex(item => item.city === city);

        if (indexToDelete !== -1) {
            saved.splice(indexToDelete, 1);
            localStorage.setItem("historyList", JSON.stringify(saved));
            this.displayHistory();
        }
    };

    displayHistory = () => {
        history.innerHTML = "";
        saved.forEach(({ city, historyInfo }) => {
            this.listBuilder(city, historyInfo, history, false);
        });
    };

    displayFavorites = () => {
        const favoritesContainer = document.getElementById("favoritesList");
        favoritesContainer.innerHTML = "";

        const favorites = localStorage.getItem("favoriteList")
            ? JSON.parse(localStorage.getItem("favoriteList"))
            : [];

        favorites.forEach(({ city, historyInfo }) => {
            this.listBuilder(city, historyInfo, favoritesContainer, true);
        });
    };

    clearHistory = () => {
        saved = [];
        localStorage.setItem("historyList", JSON.stringify(saved));
        this.displayHistory();
    };
}

const controller = new Weather("d3cd4481a1db4ef3b3f161032220103");

const searchBar = document.querySelector(".search-bar");
const searchBtn = document.querySelector(".search button");
const favoriteBtn = document.querySelector(".favorite-btn");
const history = document.getElementById("historyList");
const delHistory = document.getElementById("del-history");

let saved = localStorage.getItem("historyList")
    ? JSON.parse(localStorage.getItem("historyList"))
    : [];

searchBtn.addEventListener("click", () => {
    controller.searchWeather();
});

favoriteBtn.addEventListener("click", () => {
    controller.addToFavorites();
});

delHistory.addEventListener("click", () => {
    controller.clearHistory();
});

controller.displayHistory();
controller.displayFavorites();
