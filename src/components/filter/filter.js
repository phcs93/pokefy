document.addEventListener("DOMContentLoaded", async () => {

    document.querySelectorAll("input").forEach(input => input.oninput = e => {
        switch (e.target.type) {
            case "text" : case "number" : {
                if (Array.isArray(config[e.target.name])) {
                    config[e.target.name] = e.target.value ? e.target.value.split(" ") : [];
                } else {
                    config[e.target.name] = e.target.value;
                }
                break;
            }
            case "checkbox" : {
                config[e.target.name] = e.target.checked;
                break;
            }
        }
        filter();
    });

    document.getElementById("reset").onclick = e => {
        window.location.href = window.location.href.split("?")[0];
    };

    document.getElementById("unpin").onclick = e => {
        for (let id = 1; id <= 898; id++) {
            pokemons[id-1].dataset.pinned = false;
        }
        config.pinned = [];
        filter();
    };

    document.getElementById("fold").onclick = e => {
        document.querySelectorAll("li.version").forEach(li => {
            li.dataset.fold = true;
        });
    };

    document.getElementById("unfold").onclick = e => {
        document.querySelectorAll("li.version").forEach(li => {
            li.dataset.fold = false;
        });
    };

});