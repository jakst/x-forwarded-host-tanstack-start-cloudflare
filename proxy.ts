import http from "node:http"

const PROXY_PORT = 4000
const TARGET_HOST = "localhost"
const TARGET_PORT = 3000

const server = http.createServer((req, res) => {
	const options = {
		hostname: TARGET_HOST,
		port: TARGET_PORT,
		path: req.url,
		method: req.method,
		headers: {
			...req.headers,
			host: `${TARGET_HOST}:${TARGET_PORT}`,
			"x-forwarded-host": req.headers.host,
		},
	}

	const proxyReq = http.request(options, (proxyRes) => {
		res.writeHead(proxyRes.statusCode || 200, proxyRes.headers)
		proxyRes.pipe(res)
	})

	proxyReq.on("error", (err) => {
		console.error("Proxy error:", err)
		res.writeHead(500)
		res.end("Proxy error")
	})

	req.pipe(proxyReq)
})

server.listen(PROXY_PORT, () => {
	console.log(`Proxy server running on http://localhost:${PROXY_PORT}`)
	console.log(`Forwarding to http://${TARGET_HOST}:${TARGET_PORT}`)
})
