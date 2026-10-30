globalThis.LunchPicker = (() => {
  const board = [
    {
      cuisine: "Healthy",
      weight: 5,
      places: [
        { name: "Mendocino Farms", query: "Mendocino Farms San Francisco" },
        { name: "Tender Greens", query: "Tender Greens San Francisco" },
        { name: "Sweetgreen", query: "Sweetgreen San Francisco" },
        { name: "Mixt", query: "Mixt San Francisco" },
      ],
    },
    {
      cuisine: "Mexican",
      weight: 5,
      places: [
        { name: "Chipotle", query: "Chipotle San Francisco" },
        { name: "Suavecito", query: "Suavecito San Francisco" },
        { name: "El Toro Taqueria", query: "El Toro Taqueria San Francisco" },
      ],
    },
    {
      cuisine: "Indian",
      weight: 5,
      places: [
        { name: "Chaat Corner", query: "Chaat Corner San Francisco" },
        { name: "Curry Up Now", query: "Curry Up Now San Francisco" },
      ],
    },
    {
      cuisine: "Mediterranean",
      weight: 5,
      places: [
        { name: "Hummus Mediterranean Kitchen", query: "Hummus Mediterranean Kitchen San Francisco" },
        { name: "Sumac", query: "Sumac Mediterranean San Francisco" },
      ],
    },
    {
      cuisine: "Italian",
      weight: 5,
      places: [
        { name: "Pink Onion", query: "Pink Onion San Francisco" },
        { name: "Little Original Joe's", query: "Little Original Joe's Marina San Francisco" },
      ],
    },
    {
      cuisine: "Sandwiches",
      weight: 5,
      places: [
        { name: "Ike's", query: "Ike's Love and Sandwiches San Francisco" },
        { name: "Starbird", query: "Starbird San Francisco" },
      ],
    },
    {
      cuisine: "Vietnamese",
      weight: 5,
      places: [{ name: "Freshroll", query: "Freshroll San Francisco" }],
    },
    {
      cuisine: "Korean",
      weight: 5,
      places: [{ name: "Purple Rice", query: "Purple Rice San Francisco" }],
    },
    {
      cuisine: "Thai",
      weight: 5,
      places: [{ name: "Lers Ros", query: "Lers Ros Thai San Francisco" }],
    },
    {
      cuisine: "Ethiopian",
      weight: 2,
      occasional: true,
      places: [{ name: "Closest open spot", query: "Ethiopian food San Francisco" }],
    },
    {
      cuisine: "Japanese",
      weight: 1,
      occasional: true,
      places: [{ name: "Closest open spot", query: "Japanese food San Francisco" }],
    },
    {
      cuisine: "Chinese",
      weight: 1,
      occasional: true,
      places: [{ name: "Closest open spot", query: "Chinese food San Francisco" }],
    },
    {
      cuisine: "Burgers",
      weight: 1,
      occasional: true,
      places: [{ name: "Closest open spot", query: "Burgers San Francisco" }],
    },
    {
      cuisine: "Pizza",
      weight: 1,
      occasional: true,
      places: [{ name: "Closest open spot", query: "Pizza San Francisco" }],
    },
    {
      cuisine: "Peruvian",
      weight: 1,
      occasional: true,
      places: [{ name: "Closest open spot", query: "Peruvian food San Francisco" }],
    },
    {
      cuisine: "Seafood",
      weight: 1,
      occasional: true,
      places: [{ name: "Closest open spot", query: "Seafood San Francisco" }],
    },
  ];

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
})();
