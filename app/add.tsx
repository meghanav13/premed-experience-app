import { useExperiences } from "@/hooks/useExperiences";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

export default function AddExperience() {
  const router = useRouter();
  const { addExperience } = useExperiences();

  const [title, setTitle] = useState("");
  const [hours, setHours] = useState("");
  const [type, setType] = useState("Clinical");

  const [location, setLocation] = useState("");
  const [supervisor, setSupervisor] = useState("");
  const [reflection1, setReflection1] = useState("");
  const [reflection2, setReflection2] = useState("");

  const handleSave = () => {
    if (!title || !hours) return;

    addExperience({
      id: Date.now().toString(),
      title,
      type: type as any,
      date: new Date().toISOString(),
      hours: Number(hours),
      location,
      supervisor,
      tags: [type as any],
      description: reflection1,
      impact: reflection2,
      isMeaningful: false,
    });

    router.back();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Quick Log</Text>

      <TextInput
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
        style={styles.input}
      />

      <TextInput
        placeholder="Hours"
        value={hours}
        onChangeText={setHours}
        keyboardType="numeric"
        style={styles.input}
      />

      <TextInput
        placeholder="Type (Clinical, Research...)"
        value={type}
        onChangeText={setType}
        style={styles.input}
      />

      <TextInput
        placeholder="Location"
        value={location}
        onChangeText={setLocation}
        style={styles.input}
      />

      <TextInput
        placeholder="Supervisor"
        value={supervisor}
        onChangeText={setSupervisor}
        style={styles.input}
      />

      <TextInput
        placeholder="What did you learn?"
        value={reflection1}
        onChangeText={setReflection1}
        style={styles.input}
      />

      <TextInput
        placeholder="Why was this important?"
        value={reflection2}
        onChangeText={setReflection2}
        style={styles.input}
      />

      <Pressable style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>Save Experience</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FB",
    padding: 20,
    paddingTop: 60,
  },
  header: {
    fontSize: 26,
    fontWeight: "700",
    marginBottom: 20,
  },
  input: {
    backgroundColor: "#FFFFFF",
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  button: {
    backgroundColor: "#2E7D32",
    padding: 14,
    borderRadius: 12,
    marginTop: 10,
  },
  buttonText: {
    color: "#FFFFFF",
    textAlign: "center",
    fontWeight: "600",
  },
});
