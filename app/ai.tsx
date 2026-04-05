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
      const response = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer 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`,
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [
              {
                role: "user",
                content:
                  "Write a short personal statement paragraph about a meaningful clinical experience volunteering at a free clinic.",
              },
            ],
          }),
        },
      );

      const data = await response.json();
      const text = data.choices?.[0]?.message?.content || "No response";

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
