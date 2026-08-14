import getServiceWidget from "utils/config/service-helpers";
import { httpProxy } from "utils/proxy/http";
import createLogger from "utils/logger";

const logger = createLogger("wgdashboard");

export default async function wgdashboardProxyHandler(req, res) {
  const { group, service, endpoint } = req.query;

  if (!group || !service) {
    logger.debug("Invalid or missing service '%s' or group '%s'", service, group);
    return res.status(400).json({ error: "Invalid proxy service type" });
  }

  const widget = await getServiceWidget(group, service);

  if (!widget) {
    logger.debug("Invalid or missing widget for service '%s' in group '%s'", service, group);
    return res.status(400).json({ error: "Invalid proxy service type" });
  }

  const url = new URL(`${widget.url}/api/${endpoint}`);

  const headers = {
    "Content-Type": "application/json",
    "wg-dashboard-apikey": widget.key,
  };

  const params = {
    method: "GET",
    headers,
  };

  logger.debug("Calling WireGuard Dashboard API: %s", url.toString());

  const [status, contentType, data] = await httpProxy(url, params);

  if (status !== 200) {
    logger.error("HTTP Error %d calling %s", status, url.toString());
    return res.status(status).json({ error: { message: `HTTP Error ${status}`, url, data } });
  }

  if (contentType) res.setHeader("Content-Type", contentType);
  return res.status(status).send(data);
}
