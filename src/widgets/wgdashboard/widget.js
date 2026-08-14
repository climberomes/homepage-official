import wgdashboardProxyHandler from "./proxy";

const widget = {
  api: "{url}/api/{endpoint}",
  proxyHandler: wgdashboardProxyHandler,

  mappings: {
    configurations: {
      endpoint: "getWireguardConfigurations",
      validate: [
        "data"
      ]
    }
  }
};

export default widget;
