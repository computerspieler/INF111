const express = require("express");
const cors = require("cors");
const { createProxyMiddleware } = require("http-proxy-middleware");
const fs = require('node:fs/promises');

const proxy_port = 8088;
const autocompletion_port = 5055;
const http_port = 5000;

/* The web server */
async function readFile(path)
{
    return (await fs.readFile(path ,"utf8", (err, data) => {
        if(err) throw err;
        return data;
    }));
}

async function retrieveFiles(js_folder, static_folder) {
    let fileArray = [];
    if(!static_folder.endsWith("/"))
        static_folder += "/";
    if(!js_folder.endsWith("/"))
        js_folder += "/";

    await (
		fs.readdir(static_folder, (err, files) => {
			if(err) throw err;
			return files
		}).then(files => {
			files.forEach((file) => {
				let path = static_folder + file;
				const entryName = file.toLowerCase();
				if(!entryName.endsWith(".html") && !entryName.endsWith(".css"))
					return;

				fileArray.push(readFile(path)
					.then(data => [entryName, data])
				);
			});
		})
	);

    await (
		fs.readdir(js_folder, (err, files) => {
			if(err) throw err;
			return files
		}).then(files => {
			files.forEach((file) => {
				let path = js_folder + file;
				const entryName = path.toLowerCase();
				if(!entryName.endsWith(".js"))
					return;

				fileArray.push(readFile(path)
					.then(data => [entryName, data])
				);
			})
		})
	);

    return (await (Promise.all(fileArray)));
}

retrieveFiles("out", ".").then(filesArray => {
	const app_http = express();
	filesArray.forEach(file => {
		const entryName = file[0];
		const data = file[1];

		if(entryName.endsWith(".css")) {
			app_http.get('/' + entryName, (req, res) => {
				res.set('Content-Type', 'text/css');
				res.send(data);
			});
		} else if(entryName.endsWith(".html")) {
			let callback = (req, res) => {
				res.set('Content-Type', 'text/html');
				res.send(data);
			};

			if(entryName == "index.html")
				app_http.get('/', callback);	
			app_http.get('/' + entryName, callback);
		} else if(entryName.endsWith(".js")) {
			app_http.get('/' + entryName, (req, res) => {
				res.set('Content-Type', 'text/javascript');
				res.send(data);
			});
		}
	});

	app_http.listen(http_port, () => {
		console.log('HTTP server is running on port ' + http_port);
	});
});

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
  console.info("proxy server is running on port " + proxy_port);
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
    res.end('{"elements":[]}');
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

		/* TODO: Pemettre d'ajuster le nombre d'élements */
		if(found_entries.length > 10) {
			found_entries = found_entries.slice(0, 10);
		}

        res.writeHead(200, {"Content-Type": "application/json", "Access-Control-Allow-Origin": "*"});
        res.end(JSON.stringify({elements: found_entries}));
    });

    app2.listen(autocompletion_port, () => {
        console.info("autocompletion server is running on port " + autocompletion_port);
    });
}

startAutocompletionServer();
