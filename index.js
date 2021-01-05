let config = {};
let pokemons = [];

document.addEventListener("DOMContentLoaded", async () => {

    const url = new URL(window.location.href);

    config = {
        from: parseInt(url.searchParams.get("from")) || 1, 
        to: parseInt(url.searchParams.get("to")) || 898,
        min: parseInt(url.searchParams.get("min")) || 1,
        max: parseInt(url.searchParams.get("max")) || 100,
        versions: url.searchParams.get("versions") ? url.searchParams.get("versions").split(",") : [],
        types: url.searchParams.get("types") ? url.searchParams.get("types").split(",") : [],
        name: url.searchParams.get("name") || "",
        obtainable: (url.searchParams.get("obtainable") || "true") === "true",
        pinned: url.searchParams.get("pinned") ? url.searchParams.get("pinned").split(",").map(id => parseInt(id)) : [],
    };

    for (const p in config) {
        if (p === "pinned") continue;
        const input = document.getElementById(p);
        switch (input.type) {
            case "text" : case "number" : {
                if (Array.isArray(config[p])) {
                    input.value = config[p].join(" "); 
                } else {
                    input.value = config[p];
                }
                break;
            }
            case "checkbox" : input.checked = config[p]; break;
        }
    }

    render();

    // lazy code
    for (const id of config.pinned) {
        pokemons[id-1].dataset.pinned = true;
    }

    filter();

});

function render () {

    for (let id = 1; id <= 898; id++) {

        const pokemon = pokemonsJSON[id-1];

        document.querySelector("div.pokemons#unpinned").insertAdjacentHTML("beforeend", renderPokemon(pokemon, false));

    }

    pokemons = document.querySelectorAll("div.pokemon");

}

function filter () {

    const url = new URL(window.location.href);

    for (const p in config) {
        url.searchParams.set(p, config[p]);
    }

    window.history.replaceState(null, null, url);

    for (let id = config.from; id <= config.to; id++) {

        const pokemon = pokemonsJSON[id-1];

        const obtainable = pokemon.encounters.length > 0;

        if (!obtainable && config.obtainable) pokemons[id-1].dataset.visible = false;

        const length = pokemon.encounters.filter(e => 
            e.min >= config.min && e.max <= config.max &&
            (config.versions.length === 0 || config.versions.includes(e.version))
        ).length;

        const typesFlag = (config.types.length === 0 || config.types.every(t => pokemon.types.includes(t)));
        const nameFlag = (config.name === "" || pokemon.name.toUpperCase().indexOf(config.name.toUpperCase()) > -1);
        const obtainableFlag = obtainable ? length > 0 : !config.obtainable;

        if (!obtainableFlag || !typesFlag || !nameFlag) {
            pokemons[id-1].dataset.visible = false;
        } else {
            pokemons[id-1].dataset.visible = true;
        }

    }

    // lazy code
    document.querySelector("div.pokemons#pinned").innerHTML = "";

    for (const id of config.pinned) {        
        const pokemon = pokemonsJSON[id-1];
        pokemons[id-1].dataset.visible = false;
        document.querySelector("div.pokemons#pinned").insertAdjacentHTML("beforeend", renderPokemon(pokemon, true));
    }

}