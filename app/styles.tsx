import { ProgressBar } from "@/components/ProgressBar";
import { Tag } from "@/components/Tag";
import { StyleSheet, Text, View } from "react-native";

export default function StylesScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Style Guide</Text>

      {/* COLORS */}
      <Text style={styles.section}>Colors</Text>
      <View style={styles.row}>
        <View style={[styles.colorBox, { backgroundColor: "#2E7D32" }]} />
        <View style={[styles.colorBox, { backgroundColor: "#F8F9FB" }]} />
        <View style={[styles.colorBox, { backgroundColor: "#E5E7EB" }]} />
      </View>

      {/* TYPOGRAPHY */}
      <Text style={styles.section}>Typography</Text>
      <Text style={styles.title}>Header Text</Text>
      <Text style={styles.body}>Body Text Example</Text>

      {/* COMPONENTS */}
      <Text style={styles.section}>Components</Text>

      <Text style={{ marginBottom: 6 }}>ProgressBar</Text>
      <ProgressBar progress={0.6} />

      <Text style={{ marginTop: 12 }}>Tags</Text>
      <View style={{ flexDirection: "row", gap: 6, marginTop: 6 }}>
        <Tag label="Clinical" />
        <Tag label="Research" />
        <Tag label="Leadership" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 60,
    backgroundColor: "#F8F9FB",
  },
  header: {
    fontSize: 26,
    fontWeight: "700",
    marginBottom: 20,
  },
  section: {
    marginTop: 12,
    marginBottom: 6,
    fontWeight: "600",
    color: "#6B7280",
  },
  row: {
    flexDirection: "row",
    gap: 10,
  },
  colorBox: {
    width: 50,
    height: 50,
    borderRadius: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
  },
  body: {
    fontSize: 14,
    marginTop: 4,
  },
});
