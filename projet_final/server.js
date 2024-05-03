const express = require("express");
const cors = require("cors");
const { createProxyMiddleware } = require("http-proxy-middleware");
const fs = require('node:fs/promises');

const proxy_port = 8088;
const autocompletion_port = 5055;

/* The proxy */
const app = express();
app.use(cors());
app.use(
  createProxyMiddleware({
	pathRewrite: (path, req) => {
		const result = path.split('/').slice(4).join('/');
		return "/"+result
	},
    router: (req) => {
		return new URL(req.path.substring(1))
	},
    changeOrigin: true,
    logger: console,
  })
);

app.listen(proxy_port, () => {
  console.info("proxy server is running");
});

/* The autocompletion server */
function retrieveElements(db) {
	let output = db.elements;

	for (const [key, value] of Object.entries(db.children))
		output = output.concat(retrieveElements(value));

	return output;
}

function findInDatabase(db, text, text_index=0) {
	if(text_index >= text.length)
		return retrieveElements(db);
	
	const c = text.charAt(text_index);
	if(c in db.children)
		return findInDatabase(db.children[c], text, text_index+1);
	else
		return [];
}

function autocompletion404(res) {
    res.writeHead(404, {"Content-Type": "application/json"});   
    res.end("{}");
    return;
}

async function startAutocompletionServer() {
    const app2 = express();
	const data = await fs.readFile("output-db.json", {encoding: "utf-8"});
	const entries = JSON.parse(data);

    app2.get('/', (req, res) => {
        // On retire le / au début de l'URL
        const params = new URLSearchParams(req.url.toLowerCase().substring(1));
        if(!params.has("text")) {
            autocompletion404(res);
            return;
        }

        const cityname = params.get("text");
        let found_entries = findInDatabase(entries, cityname);

		if(params.has("country")) {
			const country_code = params.get("country").toLowerCase();
			found_entries = found_entries.filter((city) => {
				return city.country == country_code;
			});
		}
        if(found_entries.length == 0) {
            autocompletion404(res);
            return;
        }

        res.writeHead(200, {"Content-Type": "application/json"});
        res.end(JSON.stringify({elements: found_entries}));
    });

    app2.listen(autocompletion_port, () => {
        console.info("autocompletion server is running");
    });
}

startAutocompletionServer();
