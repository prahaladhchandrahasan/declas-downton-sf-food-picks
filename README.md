# Decla's Downton SF food picks

Draws a cuisine, then a restaurant, and opens Uber Eats.

Deployed site: https://prahaladhchandrahasan.github.io/declas-downton-sf-food-picks/

## How it works

1. Even draw from the regular cuisines.
2. Once a cuisine is chosen, one restaurant from that list is drawn at random.

## Suggest a restaurant

Edit [`restaurants.json`](restaurants.json) and open a pull request. That is the only file to change. Leave `picker.js` and `app.js` alone.

A suggestion is not on the site until it is merged.

### Add a restaurant to a cuisine already on the list

Put the name in that cuisine's `restaurants` list:

```json
"Mixt"
```

The site searches Uber Eats for that name plus "San Francisco". If that search would miss the place, use an object instead:

```json
{ "name": "Lers Ros", "uberEatsSearch": "Lers Ros Thai San Francisco" }
```

### Add a cuisine

Under `regular`, cuisines are an even draw, then one restaurant from that list:

```json
{
  "cuisine": "Breakfast",
  "restaurants": ["Restaurant name"]
}
```

Under `occasional`, there is no fixed restaurant. Those cuisines come up less often. The draw searches Uber Eats for the closest open spot:

```json
"Ethiopian"
```

## Approval

A restaurant is merged only after the Decla team has tried it and approves the pull request.
