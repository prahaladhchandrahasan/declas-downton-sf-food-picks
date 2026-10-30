globalThis.LunchPicker = (() => {
  const regularWeight = 5;
  const occasionalWeight = 1;

  function restaurant(entry) {
    if (typeof entry === "string") {
      const name = entry.trim();
      if (!name) return null;
      return { name, query: `${name} San Francisco` };
    }
    if (!entry || typeof entry.name !== "string") return null;
    const name = entry.name.trim();
    if (!name) return null;
    const search = typeof entry.uberEatsSearch === "string" ? entry.uberEatsSearch.trim() : "";
    return { name, query: search || `${name} San Francisco` };
  }

  function occasional(entry) {
    const cuisine = typeof entry === "string" ? entry.trim() : "";
    if (!cuisine) return null;
    const search = /burger|pizza|seafood|food/i.test(cuisine) ? cuisine : `${cuisine} food`;
    return {
      cuisine,
      weight: occasionalWeight,
      occasional: true,
      places: [{ name: "Closest open spot", query: `${search} San Francisco` }],
    };
  }

  function create(data) {
    const regular = Array.isArray(data && data.regular) ? data.regular : [];
    const sometimes = Array.isArray(data && data.occasional) ? data.occasional : [];
    const board = [];

    for (const group of regular) {
      if (!group || typeof group.cuisine !== "string" || !group.cuisine.trim()) continue;
      const places = (Array.isArray(group.restaurants) ? group.restaurants : [])
        .map(restaurant)
        .filter((place) => place !== null);
      if (places.length === 0) continue;
      board.push({
        cuisine: group.cuisine.trim(),
        weight: regularWeight,
        occasional: false,
        places,
      });
    }

    for (const entry of sometimes) {
      const group = occasional(entry);
      if (group) board.push(group);
    }

    if (board.length === 0) {
      throw new Error("restaurants.json has no places");
    }

    function pick(random, recentKeys) {
      const recent = new Set(recentKeys);
      const total = board.reduce((sum, group) => sum + group.weight, 0);
      let choice = null;

      for (let attempt = 0; attempt < 12; attempt += 1) {
        let cursor = random() * total;
        let group = board[board.length - 1];
        for (const candidate of board) {
          cursor -= candidate.weight;
          if (cursor < 0) {
            group = candidate;
            break;
          }
        }

        const open = group.places.filter((place) => !recent.has(`${group.cuisine}::${place.name}`));
        const places = open.length > 0 ? open : group.places;
        const place = places[Math.floor(random() * places.length)];
        choice = {
          cuisine: group.cuisine,
          name: place.name,
          query: place.query,
          occasional: Boolean(group.occasional),
          key: `${group.cuisine}::${place.name}`,
        };
        if (!recent.has(choice.key)) break;
      }

      return choice;
    }

    return { board, pick };
  }

  return { create };
})();
