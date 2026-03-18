import React, { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

// Tamagotchi componenti - isim ve tur proplari alir
function Tamagotchi({ isim, tur }: { isim: string; tur: string }) {
  const [aclik, setAclik] = useState(50);
  const [mutluluk, setMutluluk] = useState(50);

  const besle = () => {
    if (aclik > 0) {
      setAclik(aclik - 10);
    }
  };

  const oyna = () => {
    if (mutluluk < 100) {
      setMutluluk(mutluluk + 10);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.baslik}>Dijital Evcil Hayvan</Text>
      <Text style={styles.isim}>{isim} ({tur})</Text>
      <Text>Aclik: {aclik}</Text>
      <Text>Mutluluk: {mutluluk}</Text>
      <Button title="Besle" onPress={besle} />
      <Button title="Oyna" onPress={oyna} />
    </View>
  );
}

export default function HomeScreen() {
  return <Tamagotchi isim="Pamuk" tur="Kedi" />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  baslik: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  isim: {
    fontSize: 18,
    marginBottom: 10,
  },
});
