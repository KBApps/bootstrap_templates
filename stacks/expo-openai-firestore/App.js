import React, { useEffect, useState } from "react";
import { Text, View, Button } from "react-native";
import { Configuration, OpenAIApi } from "openai";
import { db } from "./firebaseConfig";

const openai = new OpenAIApi(
  new Configuration({ apiKey: process.env.EXPO_PUBLIC_OPENAI_KEY })
);

export default function App() {
  const [reply, setReply] = useState("");

  const askAI = async () => {
    const res = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: "Say hello in pirate language." }],
    });
    setReply(res.data.choices[0].message.content);
  };

  return (
    <View style={{ padding: 40 }}>
      <Text style={{ fontSize: 24 }}>Expo + OpenAI + Firebase</Text>
      <Button title="Ask OpenAI" onPress={askAI} />
      <Text style={{ marginTop: 20 }}>{reply}</Text>
    </View>
  );
}
