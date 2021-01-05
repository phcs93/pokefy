# Pokefy
A tool to query Pokémon with multiple filters.

All cached data (`pokemons-json.js`) was provided by https://pokeapi.co/

:warning: Data for Generation 8 is incomplete (encounters missing).

# DEMO
https://phcs93.github.io/pokefy/

# TO-DO
* improve current filters UX
  * lock which types can be filtered (multiselect)
  * lock which versions can be filtered (multiselect)
* implement more filters
  * by stats
  * by number of evolutions
  * by egg group
* find a better spritesheet
  * remove `pokemons.css` (calculate the coords with the id)
* refactor all css and js
  * I may actually never do that since this project is only a POC