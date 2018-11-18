const elements = {
  form: document.querySelector("#form"),
  details: document.querySelector("#details"),
  history: document.querySelector("#history-list"),
  body: document.querySelector("body")
}
const localStore = {
  get(item) {
    return JSON.parse(localStorage.getItem(item));
  },
  set(item, data) {
    return localStorage.setItem(item, JSON.stringify(data));
  }
}
const history = ((historyElement, localStore) => {
  function historyWordHTML(historyList) {
    if (historyList.length === 0) {
      return "<div class='history-word'>Search a word to add it to your history.</div>";
    }
    return historyList.map(({word}, index) => `<div class="history-word" id=${index}>${word}</div>`).join("");
  }
  return {
    addToHistory(data) {
      const historyList = localStore.get("wordHistory") || [];
      historyList.unshift(data);
      historyElement.innerHTML = historyWordHTML(historyList)
      localStore.set("wordHistory", historyList);
    },
    showFullHistory() {
      const historyList = localStore.get("wordHistory") || [];
      historyElement.innerHTML = historyWordHTML(historyList)
    }
  }
})(elements.history, localStore);

function setWordData({ word, details = [] } = {}) {
  if (details.length) {
    elements.details.innerHTML = `<div class="word-details"><h2>${word}</h2>${wordDataHTML(details)}</div>`;
    history.addToHistory({word, details})
  } else {
    elements.details.innerHTML = "Sorry, no meaning found";
  }
}
function wordDataHTML(dataList = []) {
  return dataList.map(({ type, definition, example }) => `
    <p>
      <div class="type">${type}</div>
      <div>
        <span class="label">Meaning: </span>
        <span class="detail">${definition}</span>
      </div>
      <div>
        <span class="label">Example usage: </span>
        <span class="detail">${example}</span>
      </div>
    </p>
  `).join("");
}
const handleSearch = function (e) {
  e.preventDefault();
  const wordElement = this.querySelector("#search-box");
  const word = wordElement.value.toLowerCase();
  axios.get(`/getWordDetails/${word}`)
    .then((response) => {
      setWordData({ word, details: response.data });
    })
    .catch(response => setWordData())
  wordElement.value = "";
}
const handleWordClick = function(e) {
  const id = e.target.id;
  const history = localStore.get("wordHistory") || [];
  setWordData(history[id]);
}

elements.form.addEventListener("submit", handleSearch);
elements.history.addEventListener("click", handleWordClick);