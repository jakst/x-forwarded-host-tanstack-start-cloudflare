import { createFileRoute } from "@tanstack/react-router"
import { createServerFn } from "@tanstack/react-start"
import { getRequestHeader, getRequestHost } from "@tanstack/react-start/server"

const getData = createServerFn().handler(() => {
	const requestHost = getRequestHost()
	const requestHostXForwarded = getRequestHost({ xForwardedHost: true })
	const xForwardedHost = getRequestHeader("x-forwarded-host")

	return {
		requestHost,
		requestHostXForwarded,
		xForwardedHost,
	}
})

export const Route = createFileRoute("/")({
	loader: () => getData(),
	component: App,
	ssr: false,
})

const ORIGIN_HOST = "localhost:3000"
const PROXY_HOST = "localhost:4000"

function App() {
	const data = Route.useLoaderData()

	const mode = location.host === ORIGIN_HOST ? "direct" : "proxy"

	const requestHost = data.requestHost ?? "undefined"
	const expectedRequestHost = ORIGIN_HOST
	const isExpectedRequestHost = requestHost === expectedRequestHost

	const requestHostXForwarded = data.requestHostXForwarded ?? "undefined"
	const expectedRequestHostXForwarded =
		mode === "proxy" ? PROXY_HOST : ORIGIN_HOST
	const isExpectedRequestHostXForwarded =
		requestHostXForwarded === expectedRequestHostXForwarded

	const xForwardedHost = data.xForwardedHost ?? "undefined"
	const expectedXForwardedHost = mode === "proxy" ? PROXY_HOST : "undefined"
	const isExpectedXForwardedHost = xForwardedHost === expectedXForwardedHost

	return (
		<pre>
			<div>
				Mode:{" "}
				{mode === "proxy"
					? `Proxy (${PROXY_HOST} -> ${ORIGIN_HOST})`
					: `Direct (${ORIGIN_HOST})`}
			</div>
			<a
				href={
					mode === "proxy" ? `http://${ORIGIN_HOST}` : `http://${PROXY_HOST}`
				}
			>
				[Switch to {mode === "proxy" ? "Direct" : "Proxy"}]
			</a>
			<br />
			<br />
			<div>
				{isExpectedRequestHost ? "✅" : "❌"} getRequestHost(): {requestHost}{" "}
				{!isExpectedRequestHost && <em>(expected {expectedRequestHost})</em>}
			</div>
			<div>
				{isExpectedRequestHostXForwarded ? "✅" : "❌"} getRequestHost({"{"}{" "}
				xForwardedHost: true {"}"}): {requestHostXForwarded}{" "}
				{!isExpectedRequestHostXForwarded && (
					<em>(expected {expectedRequestHostXForwarded})</em>
				)}
			</div>
			<div>
				{isExpectedXForwardedHost ? "✅" : "❌"}{" "}
				getRequestHeader("x-forwarded-host"): {xForwardedHost}{" "}
				{!isExpectedXForwardedHost && (
					<em>(expected {expectedXForwardedHost})</em>
				)}
			</div>
		</pre>
	)
}
