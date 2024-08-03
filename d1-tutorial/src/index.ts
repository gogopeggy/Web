/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Bind resources to your worker in `wrangler.toml`. After adding bindings, a type definition for the
 * `Env` object can be regenerated with `npm run cf-typegen`.
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

export interface Env {
	// If you set another name in wrangler.toml as the value for 'binding',
	// replace "DB" with the variable name you defined.
	DB: D1Database;
  }
  
  const corsHeaders = {
	'Content-Type': 'application/json',
	"Access-Control-Allow-Origin": "*",
	'Access-Control-Allow-Methods': 'GET,POST,PUT,PATCH,DELETE,HEAD,OPTIONS',
	'Access-Control-Allow-Headers': '*',
	"Access-Control-Max-Age": "86400",
};

  export default {
	async fetch(request, env): Promise<Response> {
		const { url, method } = request;
		const { pathname } = new URL(url);
	  // const { pathname } = new URL(request.url);

		async function readRequestBody(request: Request) {
      const contentType = request.headers.get("content-type");
      if (contentType.includes("application/json")) {
        return JSON.stringify(await request.json());
      } else if (contentType.includes("application/text")) {
        return request.text();
      } else if (contentType.includes("text/html")) {
        return request.text();
      } else if (contentType.includes("form")) {
        const formData = await request.formData();
        const body = {};
        for (const entry of formData.entries()) {
          body[entry[0]] = entry[1];
        }
        return JSON.stringify(body);
      } else {
        // Perhaps some other type of data was submitted in the form
        // like an image, or some other binary data.
        return "a file";
      }
    }
	
		  if (method === "POST") {
				const reqBody = await readRequestBody(request);
				if (pathname === '/api/expense/create') {
					const { year, date, month, method, amount, type, note} = JSON.parse(reqBody);
					const { results } = await env.DB.prepare('INSERT INTO Expense (year, date, month, method, amount, type, note) VALUES (?,?,?,?,?,?,?)')
					.bind(year, date, month, method, amount, type, note)
					.run();
					return new Response(JSON.stringify(results), { headers: corsHeaders });
				}
				if (pathname === '/api/expense/update') {
					const { year, date, month, method, amount, type, note, id} = JSON.parse(reqBody);
					const { results } = await env.DB.prepare('UPDATE Expense SET year = ?, date = ?, month = ?, method = ?, amount = ?, type = ?, note = ? WHERE id = ?')
					.bind(year, date, month, method, amount, type, note, id)
					.run();
					return new Response(JSON.stringify(results), { headers: corsHeaders });
				}
				return new Response("The request was a POST");
		  } else if (method === "GET") {
				if (pathname === "/api/expense") {
					// If you did not use `DB` as your binding name, change it here
					const { results } = await env.DB.prepare(
						"SELECT * FROM Expense"
					).all();
						return new Response(JSON.stringify(results), { headers: corsHeaders });
					}
		  }
	  return new Response(
		"Call /api/beverages to see everyone who works at Bs Beverages", { headers: corsHeaders }
	  );
	},
  } satisfies ExportedHandler<Env>;
