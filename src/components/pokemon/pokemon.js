const renderPokemon = (pokemon, flag) => `
    <div class="pokemon" id="${pokemon.id}" data-visible="true" data-pinned="${flag}">        
        <div>
            <div>
                <!-- <img src="res/images/pokemons/${pokemon.id}.gif" alt="${pokemon.name}"> -->
                <div class="pokemon-sprite" data-id="${pokemon.id}"></div>
            </div>
            <div>
                <div>
                    <div style="display: inline-block;">
                        <small>
                            #${("000"+pokemon.id).slice(-3)}
                        </small>
                        <br>
                        <a href="https://pokemondb.net/pokedex/${pokemon.id}" target="_blank">
                            <strong>${capitalize(pokemon.name)}</strong>
                        </a>
                    </div>
                    <div style="display: inline-block; float: right;">
                        <img class="pin" src="res/images/icons/pin.svg" onclick="pin(${pokemon.id})">
                    </div>
                </div>
                ${renderTypes(pokemon.types).join("\r\n")}
            </div>
        </div>    
        <hr>
        <table class="stats">
            <tbody>
                <tr>
                    <td style="width: 52px;">HP</td>
                    <td style="width: 25px;">${pokemon.stats[0]}</td>
                    <td>
                        <span class="hud" style="background-color: ${hudColor(pokemon.stats[0])}; width: ${(pokemon.stats[0]/255)*100}%;"></span>
                    </td>
                </tr>
                <tr>
                    <td style="width: 52px;">Attack</td>
                    <td style="width: 25px;">${pokemon.stats[1]}</td>
                    <td>
                        <span class="hud" style="background-color: ${hudColor(pokemon.stats[1])}; width: ${(pokemon.stats[1]/255)*100}%;"></span>
                    </td>
                </tr>
                <tr>
                    <td style="width: 52px;">Defense</td>
                    <td style="width: 25px;">${pokemon.stats[2]}</td>
                    <td>
                        <span class="hud" style="background-color: ${hudColor(pokemon.stats[2])}; width: ${(pokemon.stats[2]/255)*100}%;"></span>
                    </td>
                </tr>
                <tr>
                    <td style="width: 52px;">Sp.Atk</td>
                    <td style="width: 25px;">${pokemon.stats[3]}</td>
                    <td>
                        <span class="hud" style="background-color: ${hudColor(pokemon.stats[3])}; width: ${(pokemon.stats[3]/255)*100}%;"></span>
                    </td>
                </tr>
                <tr>
                    <td style="width: 52px;">Sp.Def</td>
                    <td style="width: 25px;">${pokemon.stats[4]}</td>
                    <td>
                        <span class="hud" style="background-color: ${hudColor(pokemon.stats[4])}; width: ${(pokemon.stats[4]/255)*100}%;"></span>
                    </td>
                </tr>
                <tr>
                    <td style="width: 52px;">Speed</td>
                    <td style="width: 25px;">${pokemon.stats[5]}</td>
                    <td>
                        <span class="hud" style="background-color: ${hudColor(pokemon.stats[5])}; width: ${(pokemon.stats[5]/255)*100}%;"></span>
                    </td>
                </tr>
            </tbody>
        </table>
        <hr>
        <ul>
            ${renderVersions(pokemon.encounters).join("\r\n")}
        </ul>
    </div>
`;

const renderTypes = (types) => types.map(type => `
    <span class="type" style="background-color: var(--${type});">${type.toUpperCase()}</span>
`);

const renderVersions = (encounters) => {

    const versions = {};

    for (const encounter of encounters) {
        if (!versions.hasOwnProperty(encounter.version)) {
            versions[encounter.version] = [];
        }
        versions[encounter.version].push(encounter);
    }

    return Object.keys(versions).map(version => `
        <li class="version" data-version="${version}" data-fold="true"> 
            <span style="color: var(--${version});" onclick="toggle(this)">${version.toUpperCase()}</span>            
            <ul>
                ${renderEncounters(versions[version]).join("\r\n")}
            </ul>            
        </li>
    `);

}

const renderEncounters = (encounters) => encounters.map(e => `    
    <li>
        <span>
            <a href="https://pokemondb.net/location/${formatLocationLink(e.location)}" target="_blank">${formatLocationName(e.location)}</a>
        </span>          
        <div>            
            <span>${e.min}-${e.max}</span>
            <span class="separator"></span>
            <span>${e.chance}%</span>
            <span class="separator"></span>
            <span class="conditions">
                ${e.conditions.filter(filterConditions).map(c => `<img width="16" height="16" src="res/images/icons/${iconNameDictionary[c]}.svg" alt="${c}" title="${c}">`).join("")}
            </span>
            <span class="method">
                <img width="16" height="16" src="res/images/icons/${iconNameDictionary[e.method]}.svg" alt="${e.method}" title="${e.method}">
            </span>
        </div>
    </li>
`);

function toggle (e) {
    if (e.parentNode.dataset.fold === "true") {
        e.parentNode.dataset.fold = false;
    } else {
        e.parentNode.dataset.fold = true;
    }
}

function pin (id) {
    if (pokemons[id-1].dataset.pinned === "true") {
        pokemons[id-1].dataset.pinned = false;
    } else {
        pokemons[id-1].dataset.pinned = true;
    }
    if (config.pinned.includes(id)) {
        config.pinned = config.pinned.filter(i => i !== id);
    } else {
        config.pinned.push(id);
    }
    filter();
}

const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);

const formatLocationName = (location) => location        
    .replace("kanto-", "")
    .replace("johto-", "")
    .replace("hoenn-", "")
    .replace("sinnoh-", "")
    .replace("unova-", "")
    .replace("kalos-", "")
    .replace("alola-", "")
    .replace("galar-", "")
    .replace("-area", "")
    .replace("-entrance", "")
    .replace("-inside", "")
    .replace("-outside", "")
    .replace(/-towards?.*/, "")
    .replace(/-unknown?.*/, "")
    .split("-")
    .map(n => capitalize(n))
    .join(" ")
;

const formatLocationLink = (location) => location
    .replace("-area", "")
    .replace("-entrance", "")
    .replace(/-towards?.*/, "")
;

const iconNameDictionary = {
    "walk" : "grass",
    "surf" : "surf",
    "old-rod" : "fish",
    "good-rod" : "fish",
    "super-rod" : "fish",
    "time-morning" : "cloud",
    "time-day" : "sun",
    "time-night" : "moon",
    "gift" :  "gift",
    "gift-egg" :  "egg",
    "radio-on": "radio",
    "radar-on": "radar",
    "swarm-yes": "swarm",
    "slot2-ruby": "ruby",
    "slot2-sapphire": "sapphire",
    "slot2-emerald": "emerald",
    "slot2-firered": "fire-red",
    "slot2-leafgreen": "leaf-green",
    "slot2-none": "none",
    "rock-smash": "rock-smash",
    "super-rod-spots": "fish",
    "surf-spots": "surf-spots",
    "rock-smash": "rock-smash",
    "dark-grass": "dark-grass",
    "grass-spots": "grass-spots",
    "season-spring": "spring",
    "season-summer": "summer",
    "season-autumn": "autumn",
    "season-winter": "winter",
    "cave-spots": "cave",
    "bridge-spots": "bridge",
    "red-flowers": "red-flowers",
    "yellow-flowers": "yellow-flowers",
    "purple-flowers": "purple-flowers",
    "rough-terrain": "rough-terrain",
    "radio-hoenn": "radio",
    "radio-sinnoh": "radio"
};

const hudColor = (v) => {
    if (v < 30) return "#F34444";
    if (v < 60) return "#FF7F0F";
    if (v < 90) return "#FFDD57";
    if (v < 120) return "#A0E515";
    if (v < 150) return "#23CD5E";
    return "#00C2B8";
};

const filterConditions = (c) => !["swarm-no", "radar-off", "radio-off"].includes(c);