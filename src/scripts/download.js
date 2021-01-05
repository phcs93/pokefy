async function download () {

    const sortEncounters = (encounters) => encounters.sort((a,b) => {
        const compare = (a, b) => (a > b) - (a < b);
        const versionA = versionsJSON.indexOf(a.version);
        const versionB = versionsJSON.indexOf(b.version);
        return compare(versionA, versionB) || compare(a.min, b.min) || compare(b.chance, a.chance)
    });

    const pokemons = [];
    const api = "https://pokeapi.co/api/v2";

    for (let id = 1; id <= 898; id++) {

        const pokemonRAW = await fetch(`${api}/pokemon/${id}`).then(response => response.json());
        const encounters = await fetch(`${api}/pokemon/${id}/encounters`).then(response => response.json());

        const compressed = {};

        for (const area of encounters) {
            for (const version of area.version_details) {
                for (const encounter of version.encounter_details) {

                    const location = area.location_area.name;
                    const method = encounter.method.name;
                    const condition = encounter.condition_values.map(c => c.name).join(",");                
                    const key = `${version.version.name}|${location}|${method}|${condition}`;

                    if (compressed.hasOwnProperty(key)) {
                        if (encounter.min_level < compressed[key].min) {
                            compressed[key].min = encounter.min_level;
                        }
                        if (encounter.max_level > compressed[key].max) {
                            compressed[key].max = encounter.max_level;
                        }
                        compressed[key].chance += encounter.chance;
                    } else {
                        compressed[key] = {
                            min: encounter.min_level,
                            max: encounter.max_level,
                            chance: encounter.chance
                        };
                    }                

                }                
            }
        }

        const transformed = Object.keys(compressed).map(k => {
            const e = compressed[k];
            const s = k.split("|");
            return {
                version: s[0],
                location: s[1],
                min: e.min,
                max: e.max,
                chance: e.chance,
                method: s[2],
                conditions: s[3] ? s[3].split(",") : []
            };
        });

        pokemons.push({
            id: pokemonRAW.id,
            name: pokemonRAW.species.name,
            types: pokemonRAW.types.map(t => t.type.name),
            stats: pokemonRAW.stats.map(s => s.base_stat),
            encounters: sortEncounters(transformed)
        });

    }

    const json = JSON.stringify(pokemons);
    const a = document.createElement('a');
    a.href = URL.createObjectURL( new Blob([json], { type:`text/json` }) );
    a.download = "pokemons-json.js";
    a.click();

}