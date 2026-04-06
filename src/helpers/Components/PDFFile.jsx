import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Line,
  Image,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    flexDirection: "row",
    backgroundColor: "white",
    padding: 20,
    flexWrap: "wrap",
    display: "flex",
    width: "100%",
  },
  divFull: {
    flexGrow: 1,
    width: "100%",
    height: "100%",
    padding: 10,
    margin: "auto",
    border: "1px black solid",
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
    width: "95%",
  },
  header: {
    fontSize: 16,
    marginBottom: 10,
  },
  subheader: {
    fontSize: 14,
    marginBottom: 10,
    borderBottom: 1, // Línea divisoria en la parte inferior del subencabezado
  },
  label: {
    fontSize: 12,
    marginBottom: 5,
    borderBottom: 0.5,
  },
  value: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 5,
  },
  total: {
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 10,
  },
  divider: {
    marginTop: 15,
    borderBottom: 1, // Línea divisoria
  },
  nav: {
    backgroundColor: "#EDA598", // Color de fondo
    padding: 10,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  navText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white", // Color del texto
  },
});

const MyDocument = ({ afipResponse, Orden, record }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.divFull}>
        <View style={styles.nav}>
          <Text style={styles.navText}>Calyaan</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.subheader}>Información del Cliente</Text>
          <Text style={styles.label}>Cedula del Cliente:</Text>
          <Text style={styles.value}>
            {afipResponse?.customer?.identification}
          </Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.subheader}>Items</Text>
          {afipResponse && afipResponse.items && afipResponse.items.map((item, index) => (
            <View key={index}>
              {/* <Text style={styles.label}>Producto: {item.description.split} {" "} {Orden.nroSesion}</Text> */}
              <Text style={styles.label}>Servicio Contratado: {`${record.nroSesion} de ${item.description}`.trim()}</Text>

              <Text style={styles.label}>Cantidad: {item.quantity}</Text>

              <Text style={styles.label}>Valor por Sesión: {item.price}</Text>

              {/* <Text style={styles.label}>Valor Sesión: {item.total}</Text> */}

              {index < afipResponse.items.length - 1 && (
                <Line style={styles.divider} />
              )}
            </View>
          ))}
        </View>
        <View style={styles.section}>
          <View>
            <Text style={styles.subheader}>Factura</Text>
            <Text style={styles.label}>Nombre: {afipResponse.name}</Text>
            <Text style={styles.label}>Fecha: {afipResponse.date}</Text>
          </View>
          <View>
            <Text style={styles.label}>Prefixo: {afipResponse.prefix}</Text>
            <Text style={styles.label}>
              Id del documento: {afipResponse && afipResponse.document && afipResponse.document.id}
            </Text>
            <Text style={styles.label}>Total: ${afipResponse.total}</Text>
            <Text style={styles.label}>Pago:</Text>
            {afipResponse && afipResponse.payments && afipResponse.payments.map((pay) => (
              <View>
                <Text style={styles.value}>{pay.name}</Text>
                <Text style={styles.value}>${pay.value}</Text>
              </View>
            ))}

            <Text style={styles.label}>Email:</Text>
            <Text
  style={{
    ...styles.value,
    padding: 5,
    backgroundColor: afipResponse?.mail?.status === "sent"
      ? "rgba(0, 128, 0, 0.5)"
      : afipResponse?.mail?.status === "not_sent"
      ? "rgba(255, 0, 0, 0.5)"
      : "rgba(255, 255, 0, 0.5)",
  }}
>
  {afipResponse?.mail?.status === "sent"
    ? "Enviado"
    : afipResponse?.mail?.status === "not_sent"
    ? "No enviado"
    : "No Facturado"}
</Text>


            <Text style={styles.label}>{afipResponse && afipResponse.mail && afipResponse.mail.observations}</Text>
          </View>
          <View>
            <Text style={styles.label}>
              hora del servicio: {Orden.hora_servicio}
            </Text>
            <Text style={styles.label}>
              Localidad del servicio: {Orden.localidad_servicio}
            </Text>
            <Text style={styles.label}>
              Numero de Facturacion {afipResponse.number}
            </Text>
          </View>
        </View>
      </View>
    </Page>
  </Document>
);

export default MyDocument;

