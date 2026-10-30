(function () {
  const placeEl = document.querySelector("#place");
  const metaEl = document.querySelector("#meta");
  const alsoEl = document.querySelector("#also");
  const drawBtn = document.querySelector("#draw");
  const orderEl = document.querySelector("#order");
  const historyEl = document.querySelector("#history");
  const regularEl = document.querySelector("#regular");
  const occasionalEl = document.querySelector("#occasional");
  const statusEl = document.querySelector("#status");
  const resultEl = document.querySelector("#result");
  const storageKey = "lunch-jar-v1";

  function todayKey() {
    const now = new Date();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    return `${now.getFullYear()}-${month}-${day}`;
  }

  function loadState() {
    const today = todayKey();
    const empty = { day: today, recent: [], history: [] };
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey) || "null");
      if (
        saved &&
        saved.day === today &&
        Array.isArray(saved.recent) &&
        Array.isArray(saved.history)
      ) {
        return saved;
      }
    } catch {
      return empty;
    }
    return empty;
  }

  let state = loadState();
  let spinning = false;
  let picker = null;

  function save() {
    try {
      localStorage.setItem(storageKey, JSON.stringify(state));
    } catch {
      return;
    }
  }

  function eatsUrl(query) {
    return `https://www.ubereats.com/search?diningMode=DELIVERY&q=${encodeURIComponent(query)}`;
  }

  function headline(choice) {
    return choice.occasional ? choice.cuisine : choice.name;
  }

  function renderChoice(choice, settled) {
    const title = headline(choice);
    placeEl.textContent = title;
    placeEl.dataset.long = title.length > 16 ? "true" : "false";
    metaEl.textContent = choice.occasional ? "Closest open spot" : choice.cuisine;

    const group = picker.board.find((item) => item.cuisine === choice.cuisine);
    const others = group
      ? group.places.map((place) => place.name).filter((name) => name !== choice.name)
      : [];
    if (settled && others.length > 0) {
      alsoEl.hidden = false;
      alsoEl.textContent = `Also in ${choice.cuisine}: ${others.join(", ")}`;
    } else {
      alsoEl.hidden = true;
      alsoEl.textContent = "";
    }

    if (settled) {
      orderEl.hidden = false;
      orderEl.href = eatsUrl(choice.query);
      statusEl.textContent = `${choice.cuisine}. ${title}.`;
      drawBtn.textContent = "Draw again";
    }
  }

  function renderHistory() {
    const past = state.history.slice(1, 5);
    historyEl.textContent =
      past.length === 0 ? "" : `Earlier today: ${past.map((item) => headline(item)).join(" · ")}`;
  }

  function wait(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }

  async function spinTo(choice) {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      renderChoice(choice, true);
      return;
    }

    const reel = picker.board.flatMap((group) =>
      group.places.map((place) => ({
        cuisine: group.cuisine,
        name: place.name,
        occasional: Boolean(group.occasional),
      })),
    );
    resultEl.classList.add("is-spinning");
    orderEl.hidden = true;
    alsoEl.hidden = true;

    for (let frame = 0; frame < 16; frame += 1) {
      const flash = reel[Math.floor(Math.random() * reel.length)];
      const title = flash.occasional ? flash.cuisine : flash.name;
      placeEl.textContent = title;
      placeEl.dataset.long = title.length > 16 ? "true" : "false";
      metaEl.textContent = flash.occasional ? "Closest open spot" : flash.cuisine;
      await wait(36 + frame * 18);
    }

    resultEl.classList.remove("is-spinning");
    renderChoice(choice, true);
  }

  function renderBoard() {
    regularEl.replaceChildren();
    const occasionalNames = [];

    for (const group of picker.board) {
      if (group.occasional) {
        occasionalNames.push(group.cuisine);
        continue;
      }
      const row = document.createElement("div");
      row.className = "group";
      const title = document.createElement("h3");
      title.textContent = group.cuisine;
      const names = document.createElement("p");
      names.textContent = group.places.map((place) => place.name).join(", ");
      row.append(title, names);
      regularEl.append(row);
    }

    occasionalEl.textContent = occasionalNames.join(", ");
  }

  async function draw() {
    if (spinning || !picker) return;
    spinning = true;
    drawBtn.disabled = true;
    drawBtn.textContent = "Drawing";
    const choice = picker.pick(Math.random, state.recent);
    await spinTo(choice);
    state.recent = [...state.recent, choice.key].slice(-3);
    state.history = [choice, ...state.history.filter((item) => item.key !== choice.key)].slice(0, 6);
    save();
    renderHistory();
    spinning = false;
    drawBtn.disabled = false;
  }

  drawBtn.addEventListener("click", () => {
    void draw();
  });

  document.addEventListener("keydown", (event) => {
    if (event.repeat || (event.key !== "d" && event.key !== "D")) return;
    if (event.metaKey || event.ctrlKey || event.altKey) return;
    if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) return;
    event.preventDefault();
    void draw();
  });

  function showLoadError() {
    metaEl.textContent = "The restaurant list failed to load.";
    drawBtn.disabled = true;
  }

  drawBtn.disabled = true;

  fetch("restaurants.json")
    .then((response) => {
      if (!response.ok) throw new Error("restaurants.json");
      return response.json();
    })
    .then((data) => {
      picker = globalThis.LunchPicker.create(data);
      renderBoard();
      renderHistory();
      if (state.history[0]) renderChoice(state.history[0], true);
      drawBtn.disabled = false;
    })
    .catch(showLoadError);
})();
