import { chromium } from "playwright"
const S = "/private/tmp/claude-501/-Users-admin-Desktop-Projects-web-samaaceholdings/ba8233d9-df03-403a-a0a5-0bc1c52bdd83/scratchpad/shots"
const b = await chromium.launch()
const errs = []
const p = await b.newPage({ viewport: { width: 1440, height: 1000 } })
p.on("console", m => m.type() === "error" && errs.push(m.text()))
p.on("pageerror", e => errs.push("pageerror: " + e.message))
await p.goto("http://localhost:3000/admin/sign-in", { waitUntil: "networkidle" })
await p.fill('input[type="email"]', "admin@auntienana.com")
await p.fill('input[type="password"]', "password123")
await p.getByRole("button", { name: /^sign in$/i }).click()
await p.waitForURL("**/admin", { timeout: 10000 })
await p.waitForLoadState("networkidle")
await p.waitForTimeout(2000)
await p.screenshot({ path: `${S}/v6-charts.png`, fullPage: true })

// hover the area chart to prove the tooltip layer works
const box = await p.locator(".recharts-wrapper").first().boundingBox()
await p.mouse.move(box.x + box.width * 0.62, box.y + box.height * 0.5)
await p.waitForTimeout(600)
await p.screenshot({ path: `${S}/v6-tooltip.png`, clip: { x: box.x - 10, y: box.y - 40, width: box.width + 20, height: box.height + 60 } })
console.log("ERRORS:", errs.length ? JSON.stringify(errs.slice(0,6)) : "none")
await b.close()
