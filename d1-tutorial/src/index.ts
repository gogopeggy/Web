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
	hedaers: 'GET,HEAD,POST,OPTIONS';
  }
  
  const corsHeaders = {
	'Content-Type': 'application/json',
	"Access-Control-Allow-Origin": "*",
	"Access-Control-Allow-Methods": "GET,HEAD,POST,OPTIONS",
	"Access-Control-Max-Age": "86400",
};

  export default {
	async fetch(request, env): Promise<Response> {
	  const { pathname } = new URL(request.url);
  
	  if (pathname === "/api/expense") {
		// If you did not use `DB` as your binding name, change it here
		const { results } = await env.DB.prepare(
		  "SELECT * FROM Expense"
		)
		//   .bind("Bs Beverages")
		  .all();
		  return new Response(JSON.stringify(results), { headers: corsHeaders });
	  }
	  if (pathname === '/api/expense/create') {
		console.log('res',request)
		// const { id, year, date, month, method, amount, type, note } = request.body
		const { results } = await env.DB.prepare(
			"INSERT INTO Expense values (?)"
		  )
		    // .bind([id, year, date, month, method, amount, type, note])
			.run();
			return new Response(JSON.stringify(results), { headers: corsHeaders });
	  }

  
	  return new Response(
		"Call /api/beverages to see everyone who works at Bs Beverages"
	  );
	},
  } satisfies ExportedHandler<Env>;
