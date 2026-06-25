import { Resend } from 'resend';

var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// src/index.ts
var corsHeaders = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, PUT, POST, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "*",
  "Access-Control-Allow-Credentials": "true",
  "Access-Control-Max-Age": "86400"
};

export interface Env {
  DB: D1Database;
  RESEND_API_KEY: string;
  GOOGLE_MAPS_API_KEY: string;
  OPENWEATHER_API_KEY: string;
  EDAMAM_APP_ID: string;
  EDAMAM_APP_KEY: string;
}

var src_default = {
  async fetch(request: Request, env: Env) {
    const { url, method } = request;
    const { pathname, searchParams } = new URL(url);
    async function readRequestBody(request2) {
      const contentType = request2.headers.get("content-type");
      if (contentType.includes("application/json")) {
        return JSON.stringify(await request2.json());
      } else if (contentType.includes("application/text")) {
        return request2.text();
      } else if (contentType.includes("text/html")) {
        return request2.text();
      } else if (contentType.includes("form")) {
        const formData = await request2.formData();
        const body = {};
        for (const entry of formData.entries()) {
          body[entry[0]] = entry[1];
        }
        return JSON.stringify(body);
      } else {
        return "a file";
      }
    }
    __name(readRequestBody, "readRequestBody");
    if (method === "POST") {
      const reqBody = await readRequestBody(request);
      if (pathname === "/api/expense/create") {
        const { year, date, month, method: method2, amount, type, note } = JSON.parse(reqBody);
        const { results } = await env.DB.prepare("INSERT INTO Expense (year, date, month, method, amount, type, note) VALUES (?,?,?,?,?,?,?)").bind(year, date, month, method2, amount, type, note).run();
        return new Response(JSON.stringify(results), { headers: corsHeaders });
      }
      if (pathname === "/api/expense/update") {
        const { year, date, month, method: method2, amount, type, note, id } = JSON.parse(reqBody);
        const { results } = await env.DB.prepare("UPDATE Expense SET year = ?, date = ?, month = ?, method = ?, amount = ?, type = ?, note = ? WHERE id = ?").bind(year, date, month, method2, amount, type, note, id).run();
        return new Response(JSON.stringify(results), { headers: corsHeaders });
      }
	  if (pathname === '/api/send-booking-email') {
		const booking = JSON.parse(reqBody);
		if (!booking.email) {
			return new Response(JSON.stringify({ skipped: 'no email' }), { headers: corsHeaders });
		}
		const resend = new Resend(env.RESEND_API_KEY);
		const party =
			`${booking.adults} 位大人` +
			(booking.children > 0 ? `、${booking.children} 位小孩` : '');
		const { data, error } = await resend.emails.send({
			from: '漁家莊 <booking@peggyideas.com>',
			to: booking.email,
			subject: `訂位確認 — ${booking.date} ${booking.time}`,
			html: `<div style="font-family:sans-serif;max-width:480px;margin:auto;padding:24px;background:#fffdf8;border-radius:12px;border:1px solid #d8cdb3;">
			<h2 style="color:#d4a857;margin:0 0 16px;">訂位成功！</h2>
			<p style="color:#1f1b16;">${booking.name} 您好，您的訂位已確認：</p>
			<table style="width:100%;border-collapse:collapse;margin-top:12px;">
				<tr><td style="padding:6px 0;color:#7a6a4a;">日期</td><td style="color:#1f1b16;"><b>${booking.date}</b></td></tr>
				<tr><td style="padding:6px 0;color:#7a6a4a;">時段</td><td style="color:#1f1b16;"><b>${booking.time}</b></td></tr>
				<tr><td style="padding:6px 0;color:#7a6a4a;">人數</td><td style="color:#1f1b16;"><b>${party}</b></td></tr>
			</table>
			<p style="color:#9a8c6c;font-size:13px;margin-top:24px;">如需異動，請來電 +886 1131415</p>
			</div>`,
		});
		if (error) {
			return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: corsHeaders });
		}
		return new Response(JSON.stringify({ ok: true, id: data.id }), { headers: corsHeaders });
		}
      return new Response("The request was a POST");
    } else if (method === "GET") {
      if (pathname === "/api/expense") {
        const { results } = await env.DB.prepare(
          "SELECT * FROM Expense"
        ).all();
        return new Response(JSON.stringify(results), { headers: corsHeaders });
      }
      if (pathname === "/api/camping") {
        const { results } = await env.DB.prepare(
          "SELECT * FROM Camping"
        ).all();
        return new Response(JSON.stringify(results), { headers: corsHeaders });
      }
      if (pathname === "/api/weather") {
        const lat = searchParams.get("lat") || "25.0651335306964";
        const lon = searchParams.get("lon") || "121.576200811347";
        const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lon)}&lang=zh_tw&units=metric&appid=${env.OPENWEATHER_API_KEY}`;
        try {
          const response = await fetch(apiUrl);
          if (!response.ok) {
            throw new Error(`OpenWeatherMap API request failed with status ${response.status}`);
          }
          const data = await response.json();
          return new Response(JSON.stringify(data), { headers: corsHeaders });
        } catch (error) {
          return new Response(`Error: ${error.message}`, {
            status: 500
          });
        }
      }
      if (pathname === "/api/recipe") {
        const q = searchParams.get("q") || "";
        const health = searchParams.get("health") || "";
        const appId = env.EDAMAM_APP_ID;
        const appKey = env.EDAMAM_APP_KEY;
        const apiUrl = `https://api.edamam.com/api/recipes/v2?type=public&q=${encodeURIComponent(q)}&app_id=${appId}&app_key=${appKey}&health=${encodeURIComponent(health)}`;
        try {
          const response = await fetch(apiUrl);
          if (!response.ok) {
            throw new Error(`Edamam API request failed with status ${response.status}`);
          }
          const data = await response.json();
          return new Response(JSON.stringify(data), { headers: corsHeaders });
        } catch (error) {
          return new Response(`Error: ${error.message}`, {
            status: 500
          });
        }
      }
      if (pathname === "/api/distance") {
        const origins = searchParams.get("origins");
        const destinations = searchParams.get("destinations");
        const apiKey = env.GOOGLE_MAPS_API_KEY;
        const apiUrl = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(origins)}&destinations=${encodeURIComponent(destinations)}&key=${apiKey}`;
        try {
          const response = await fetch(apiUrl);
          if (!response.ok) {
            throw new Error(`Google API request failed with status ${response.status}`);
          }
          const data = await response.json();
          return new Response(JSON.stringify(data), { headers: corsHeaders });
        } catch (error) {
          return new Response(`Error: ${error.message}`, {
            status: 500
          });
        }
      }
    } else if (method === "DELETE") {
      const reqBody = await readRequestBody(request);
      const { id } = JSON.parse(reqBody).data;
      if (pathname === `/api/expense/delete`) {
        const { results } = await env.DB.prepare(
          "DELETE FROM Expense WHERE id = ?"
        ).bind(id).run();
        return new Response(JSON.stringify(results), { headers: corsHeaders });
      }
    }
    return new Response(
      "Call /api/expense to see expense",
      { headers: corsHeaders }
    );
  }
};
export {
  src_default as default
};
//# sourceMappingURL=index.js.map
