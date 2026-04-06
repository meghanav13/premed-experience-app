import { useState } from "react";
import {
    ActivityIndicator,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";

export default function AIScreen() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");

  const generateEssay = async () => {
    setLoading(true);
    setResult("");

    try {
      const context = `
Prompt: Most meaningful experience

Selected Experiences:
1. Volunteered at a free clinic assisting patients
2. Shadowed a physician in a hospital setting
`;

      const response = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=API-KEY",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                role: "user",
                parts: [
                  {
                    text: `Write a strong personal statement paragraph based on the following:\n${context}`,
                  },
                ],
              },
            ],
          }),
        },
      );

      if (!response.ok) {
        const err = await response.text();
        console.log("API ERROR:", err);
        throw new Error("Request failed");
      }

      const data = await response.json();

      const text =
        data?.candidates?.[0]?.content?.parts
          ?.map((p: any) => p.text)
          .join("") || "No response";

      setResult(text);
    } catch (error) {
      console.log(error);
      setResult("Error generating text");
    }

    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>AI Essay Generator</Text>

      <Pressable style={styles.button} onPress={generateEssay}>
        <Text style={styles.buttonText}>Generate Essay</Text>
      </Pressable>

      {loading && <ActivityIndicator style={{ marginTop: 20 }} />}

      {result !== "" && <Text style={styles.result}>{result}</Text>}
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
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#2E7D32",
    padding: 14,
    borderRadius: 12,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "600",
  },
  result: {
    marginTop: 20,
    fontSize: 14,
    lineHeight: 20,
  },
});
