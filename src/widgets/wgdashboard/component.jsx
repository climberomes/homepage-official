import Block from "components/services/widget/block";
import Container from "components/services/widget/container";
import { useTranslation } from "next-i18next";

import useWidgetAPI from "utils/proxy/use-widget-api";

export default function Component({ service }) {
  const { t } = useTranslation();
  const { widget } = service;
  const { data, error } = useWidgetAPI(widget, "configurations");

  // Set default fields if not specified
  if (!widget.fields) {
    widget.fields = ["connected", "total", "rx", "tx", "totaldata"];
  }

  // Enhanced error handling similar to wgeasy
  if (error || data?.statusCode > 400) {
    return <Container service={service} error={error ?? { message: data.statusMessage, data: data }} />;
  }

  // Loading state
  if (!data || !data.data || data.data.length === 0) {
    return (
      <Container service={service}>
        <Block label="wgdashboard.connected" />
        <Block label="wgdashboard.total" />
        <Block label="wgdashboard.rx" />
        <Block label="wgdashboard.tx" />
        <Block label="wgdashboard.totaldata" />
      </Container>
    );
  }

  // Get the first configuration (wg0)
  const config = data.data[0];
  const connectedPeers = config.ConnectedPeers || 0;
  const totalPeers = config.TotalPeers || 0;
  const dataReceive = (config.DataUsage?.Receive || 0) * 1024 * 1024 * 1024;
  const dataSent = (config.DataUsage?.Sent || 0) * 1024 * 1024 * 1024;
  const dataTotal = (config.DataUsage?.Total || 0) * 1024 * 1024 * 1024;

  return (
    <Container service={service}>
      <Block 
        label="wgdashboard.connectedpeers" 
        value={t("common.number", { value: connectedPeers })} 
      />
      <Block
        label="wgdashboard.totalpeers"
        value={t("common.number", { value: totalPeers })}
      />
      <Block 
        label="wgdashboard.datareceive" 
        value={t("common.bytes", { value: dataReceive })}
      />
      <Block 
        label="wgdashboard.datasent" 
        value={t("common.bytes", { value: dataSent })}
      />
      <Block 
        label="wgdashboard.datatotal" 
        value={t("common.bytes", { value: dataTotal })}
      />
    </Container>
  );
}
