import { COLORS, FONTS } from "@/constants/theme";
import { useExperiences } from "@/context/ExperiencesContext";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

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
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.header}>Quick Log</Text>

      {/* TITLE */}
      <View style={styles.field}>
        <Text style={styles.label}>Title</Text>
        <TextInput
          placeholder="e.g. Hospital Volunteering"
          value={title}
          onChangeText={setTitle}
          style={styles.input}
        />
      </View>

      {/* HOURS */}
      <View style={styles.field}>
        <Text style={styles.label}>Hours</Text>
        <TextInput
          placeholder="e.g. 4"
          value={hours}
          onChangeText={setHours}
          keyboardType="numeric"
          style={styles.input}
        />
      </View>

      {/* TYPE */}
      <View style={styles.field}>
        <Text style={styles.label}>Type</Text>
        <TextInput
          placeholder="Clinical, Research..."
          value={type}
          onChangeText={setType}
          style={styles.input}
        />
      </View>

      {/* LOCATION */}
      <View style={styles.field}>
        <Text style={styles.label}>Location</Text>
        <TextInput
          placeholder="Where was this?"
          value={location}
          onChangeText={setLocation}
          style={styles.input}
        />
      </View>

      {/* SUPERVISOR */}
      <View style={styles.field}>
        <Text style={styles.label}>Supervisor</Text>
        <TextInput
          placeholder="Doctor / Manager name"
          value={supervisor}
          onChangeText={setSupervisor}
          style={styles.input}
        />
      </View>

      {/* REFLECTIONS */}
      <View style={styles.field}>
        <Text style={styles.label}>What did you learn?</Text>
        <TextInput
          placeholder="Key takeaway..."
          value={reflection1}
          onChangeText={setReflection1}
          style={[styles.input, styles.multiline]}
          multiline
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Why was this important?</Text>
        <TextInput
          placeholder="Impact..."
          value={reflection2}
          onChangeText={setReflection2}
          style={[styles.input, styles.multiline]}
          multiline
        />
      </View>

      {/* BUTTON */}
      <Pressable style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>Save Experience</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.cream,
    padding: 20,
    paddingTop: 60,
  },

  header: {
    fontSize: 30,
    fontFamily: FONTS.serif,
    color: COLORS.green,
    marginBottom: 20,
  },

  field: {
    marginBottom: 16,
  },

  label: {
    fontSize: 13,
    fontFamily: FONTS.sansBold,
    color: COLORS.textSecondary,
    marginBottom: 6,
  },

  input: {
    backgroundColor: COLORS.white,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E5E5E5",
    fontFamily: FONTS.sans,
    fontSize: 14,
  },

  multiline: {
    minHeight: 80,
    textAlignVertical: "top",
  },

  button: {
    backgroundColor: COLORS.green,
    padding: 16,
    borderRadius: 16,
    marginTop: 10,
    marginBottom: 30,
  },

  buttonText: {
    color: COLORS.white,
    textAlign: "center",
    fontFamily: FONTS.sansBold,
    fontSize: 15,
  },
});
