import { logDebug, getConnectionSpeed, send } from "../utils.mjs";
const vitalsUrl = "https://vitals.vercel-analytics.com/v1/vitals";
export function sendToAnalytics({ fullPath, href }, metric, options) {
  const body = {
    dsn: options.dsn,
    id: metric.id,
    page: fullPath,
    href,
    event_name: metric.name,
    value: metric.value.toString(),
    speed: getConnectionSpeed()
  };
  if (options.debug) {
    logDebug(metric.name, JSON.stringify(body, null, 2));
  }
  const blob = new Blob([new URLSearchParams(body).toString()], {
    type: "application/x-www-form-urlencoded"
  });
  send(vitalsUrl, blob);
}
