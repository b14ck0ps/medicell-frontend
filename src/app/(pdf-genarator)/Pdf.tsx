// @ts-ignore
import { Document, Page, StyleSheet, Text, View } from '@react-pdf/renderer';
const PDFDocument = ({ orders }: any) => {
    const currentDate = new Date().toLocaleDateString();
    return (
        <Document>
            <Page>
                <View style={styles.container}>
                    <Text style={styles.title}>MediCell</Text>
                    <Text style={styles.date}>Printed on: {currentDate}</Text>
                    <Text style={styles.heading}>Order Details</Text>
                    <View style={styles.table}>
                        <View style={styles.tableRow}>
                            <Text style={styles.tableHeaderCell}>Product Name</Text>
                            <Text style={styles.tableHeaderCell}>Quantity</Text>
                            <Text style={styles.tableHeaderCell}>Price</Text>
                            <Text style={styles.tableHeaderCell}>Total Price</Text>
                        </View>
                        {orders.map((order: any) => (
                            <View style={styles.tableRow} key={order.Id}>
                                <Text style={styles.tableCell}>{order.ProductName}</Text>
                                <Text style={styles.tableCell}>{order.Quantity}</Text>
                                <Text style={styles.tableCell}>{order.ProductPrice}</Text>
                                <Text style={styles.tableCell}>{order.Quantity * order.ProductPrice}</Text>
                            </View>
                        ))}
                    </View>
                </View>
            </Page>
        </Document>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    date: {
        fontSize: 12,
        marginBottom: 10,
    },
    heading: {
        fontSize: 18,
        marginBottom: 10,
    },
    table: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    tableRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderColor: '#000',
        alignItems: 'center',
        height: 30,
    },
    tableHeaderCell: {
        width: '25%',
        fontWeight: 'bold',
        borderRightWidth: 1,
        borderRightColor: '#000',
        paddingHorizontal: 5,
    },
    tableCell: {
        width: '25%',
        borderRightWidth: 1,
        borderRightColor: '#000',
        paddingHorizontal: 5,
    }
});
