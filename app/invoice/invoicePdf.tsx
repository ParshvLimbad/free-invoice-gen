// app/invoice/invoicePdf.tsx
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  pdf,
} from "@react-pdf/renderer";

export type Item = {
  description: string;
  rate: number;
  qty: number;
};

export type InvoiceData = {
  company: { name: string; address: string; mobile: string; email: string };
  client: { name: string; address: string; mobile: string; email: string };
  date: string;
  orderNumber: string;
  currency: "INR" | "USD" | "EUR";
  items: Item[];
  total: number;
};

// Simple ASCII prefixes
const symbolMap: Record<InvoiceData["currency"], string> = {
  INR: "Rs. ",
  USD: "$",
  EUR: "€",
};

const styles = StyleSheet.create({
  page: {
    padding: 32,
    fontFamily: "Helvetica",
    fontSize: 11,
    color: "#111827",
  },
  header: { marginBottom: 24 },
  companyName: { fontSize: 20, fontWeight: "bold", marginBottom: 2 },
  companyDetails: { fontSize: 10, lineHeight: 1.5 },

  section: { marginBottom: 20 },
  metaRow: { flexDirection: "row", justifyContent: "space-between" },
  metaText: { fontSize: 10, marginBottom: 2, color: "#4b5563" },
  billToTitle: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 4,
    textAlign: "right",
    color: "#111827",
  },

  tableContainer: { width: "100%", overflow: "hidden", marginTop: 12 },
  table: { width: "100%", borderCollapse: "collapse" as const },

  tableHeader: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#d1d5db",
  },
  tableHeadCell: {
    flex: 1,
    padding: 8,
    fontSize: 10,
    fontWeight: "bold",
    color: "#6b7280",
    textAlign: "left",
  },
  tableHeadCellRight: { textAlign: "right" },

  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#e5e7eb",
  },
  tableCell: {
    flex: 1,
    padding: 8,
    fontSize: 10,
    color: "#111827",
    textAlign: "left",
  },
  tableCellRight: {
    flex: 1,
    padding: 8,
    fontSize: 10,
    color: "#111827",
    textAlign: "right",
  },

  tableFooter: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderColor: "#e5e7eb",
  },
  footerLabelCell: {
    flex: 3,
    padding: 8,
    fontSize: 10,
    fontWeight: "bold",
    color: "#6b7280",
    textAlign: "left",
  },
  footerValueCell: {
    flex: 1,
    padding: 8,
    fontSize: 10,
    fontWeight: "bold",
    color: "#111827",
    textAlign: "right",
  },
});

export function InvoiceDocument(props: InvoiceData) {
  const { company, client, date, orderNumber, currency, items, total } = props;

  const headers = ["Name", "Rate", "Qty", "Amount"];
  const symbol = symbolMap[currency];

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Company Header */}
        <View style={styles.header}>
          <Text style={styles.companyName}>{company.name}</Text>
          <Text style={styles.companyDetails}>{company.address}</Text>
          <Text style={styles.companyDetails}>Mob: {company.mobile}</Text>
          <Text style={styles.companyDetails}>Email: {company.email}</Text>
        </View>

        {/* Date / Order & Bill To */}
        <View style={[styles.section, styles.metaRow]}>
          <View>
            <Text style={styles.metaText}>Date: {date}</Text>
            <Text style={styles.metaText}>Order #: {orderNumber}</Text>
          </View>
          <View>
            <Text style={styles.billToTitle}>Bill To</Text>
            <Text style={styles.metaText}>{client.name}</Text>
            <Text style={styles.metaText}>{client.address}</Text>
            <Text style={styles.metaText}>Mob: {client.mobile}</Text>
            <Text style={styles.metaText}>Email: {client.email}</Text>
          </View>
        </View>

        {/* Items Table */}
        <View style={styles.tableContainer}>
          <View style={styles.table}>
            {/* Table Header */}
            <View style={styles.tableHeader}>
              {headers.map((h, i) =>
                i === 3 ? (
                  <Text
                    key={h}
                    style={[styles.tableHeadCell, styles.tableHeadCellRight]}
                  >
                    {h}
                  </Text>
                ) : (
                  <Text key={h} style={styles.tableHeadCell}>
                    {h}
                  </Text>
                )
              )}
            </View>

            {/* Table Body */}
            {items.map((it, idx) => (
              <View style={styles.tableRow} key={idx}>
                {/* Name */}
                <Text style={styles.tableCell}>{it.description}</Text>

                {/* Rate */}
                <Text style={styles.tableCell}>
                  {symbol}
                  {it.rate.toFixed(2)}
                </Text>

                {/* Qty */}
                <Text style={styles.tableCell}>{it.qty}</Text>

                {/* Amount */}
                <Text style={styles.tableCellRight}>
                  {symbol}
                  {(it.rate * it.qty).toFixed(2)}
                </Text>
              </View>
            ))}

            {/* Total Footer */}
            <View style={styles.tableFooter}>
              <Text style={styles.footerLabelCell}>Total</Text>
              <Text style={styles.footerValueCell}>
                {symbol}
                {total.toFixed(2)}
              </Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
}

/** Render the document to a Blob for download */
export async function generateInvoicePdfBlob(data: InvoiceData): Promise<Blob> {
  return pdf(<InvoiceDocument {...data} />).toBlob();
}
