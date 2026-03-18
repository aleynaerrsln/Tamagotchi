import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Easing,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

// ─── Uçan Yemek Animasyonu ───────────────────────────
function FlyingFood({ trigger }: { trigger: number }) {
  const posY = useRef(new Animated.Value(80)).current;
  const posX = useRef(new Animated.Value(-40)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (trigger === 0) return;
    posY.setValue(80);
    posX.setValue(-40);
    opacity.setValue(1);
    scale.setValue(1);

    Animated.parallel([
      Animated.timing(posY, { toValue: -20, duration: 600, easing: Easing.out(Easing.quad), useNativeDriver: true }),
      Animated.timing(posX, { toValue: 0, duration: 600, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      Animated.sequence([
        Animated.delay(400),
        Animated.timing(scale, { toValue: 0.2, duration: 200, useNativeDriver: true }),
      ]),
      Animated.sequence([
        Animated.delay(500),
        Animated.timing(opacity, { toValue: 0, duration: 100, useNativeDriver: true }),
      ]),
    ]).start();
  }, [trigger]);

  return (
    <Animated.Text style={[styles.flyingFood, {
      opacity,
      transform: [{ translateY: posY }, { translateX: posX }, { scale }],
    }]}>
      🍕
    </Animated.Text>
  );
}

// ─── Zıplayan Top Animasyonu ──────────────────────────
function BouncingBall({ trigger }: { trigger: number }) {
  const posY = useRef(new Animated.Value(0)).current;
  const posX = useRef(new Animated.Value(40)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (trigger === 0) return;
    posY.setValue(60);
    posX.setValue(40);
    opacity.setValue(1);

    Animated.parallel([
      Animated.sequence([
        Animated.timing(posY, { toValue: -10, duration: 200, easing: Easing.out(Easing.quad), useNativeDriver: true }),
        Animated.timing(posY, { toValue: 30, duration: 200, easing: Easing.in(Easing.quad), useNativeDriver: true }),
        Animated.timing(posY, { toValue: -5, duration: 150, easing: Easing.out(Easing.quad), useNativeDriver: true }),
        Animated.timing(posY, { toValue: 20, duration: 150, easing: Easing.in(Easing.quad), useNativeDriver: true }),
      ]),
      Animated.timing(posX, { toValue: 70, duration: 700, useNativeDriver: true }),
      Animated.sequence([
        Animated.delay(550),
        Animated.timing(opacity, { toValue: 0, duration: 150, useNativeDriver: true }),
      ]),
    ]).start();
  }, [trigger]);

  return (
    <Animated.Text style={[styles.bouncingBall, {
      opacity,
      transform: [{ translateY: posY }, { translateX: posX }],
    }]}>
      🎾
    </Animated.Text>
  );
}

// ─── Yıldız Parıltıları ──────────────────────────────
function Sparkles({ mutluluk }: { mutluluk: number }) {
  const sparkle1 = useRef(new Animated.Value(0)).current;
  const sparkle2 = useRef(new Animated.Value(0)).current;
  const sparkle3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (mutluluk < 70) return;
    const animate = (val: Animated.Value, delay: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(val, { toValue: 1, duration: 400, useNativeDriver: true }),
          Animated.timing(val, { toValue: 0, duration: 400, useNativeDriver: true }),
          Animated.delay(800),
        ])
      );
    const a1 = animate(sparkle1, 0);
    const a2 = animate(sparkle2, 300);
    const a3 = animate(sparkle3, 600);
    a1.start(); a2.start(); a3.start();
    return () => { a1.stop(); a2.stop(); a3.stop(); };
  }, [mutluluk >= 70]);

  if (mutluluk < 70) return null;
  return (
    <>
      <Animated.Text style={[styles.sparkle, { top: 5, left: 10, opacity: sparkle1, transform: [{ scale: sparkle1 }] }]}>✨</Animated.Text>
      <Animated.Text style={[styles.sparkle, { top: 30, right: 5, opacity: sparkle2, transform: [{ scale: sparkle2 }] }]}>⭐</Animated.Text>
      <Animated.Text style={[styles.sparkle, { top: 60, left: 0, opacity: sparkle3, transform: [{ scale: sparkle3 }] }]}>✨</Animated.Text>
    </>
  );
}

// ─── ZZZ Uyku Animasyonu ──────────────────────────────
function SleepBubbles({ sleeping }: { sleeping: boolean }) {
  const z1 = useRef(new Animated.Value(0)).current;
  const z2 = useRef(new Animated.Value(0)).current;
  const z3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!sleeping) return;
    const animateZ = (val: Animated.Value, delay: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.parallel([
            Animated.timing(val, { toValue: 1, duration: 1200, useNativeDriver: true }),
          ]),
          Animated.timing(val, { toValue: 0, duration: 0, useNativeDriver: true }),
        ])
      );
    const a1 = animateZ(z1, 0);
    const a2 = animateZ(z2, 400);
    const a3 = animateZ(z3, 800);
    a1.start(); a2.start(); a3.start();
    return () => { a1.stop(); a2.stop(); a3.stop(); };
  }, [sleeping]);

  if (!sleeping) return null;
  return (
    <>
      {[z1, z2, z3].map((z, i) => (
        <Animated.Text key={i} style={[styles.zzz, {
          right: 10 + i * 12,
          opacity: z,
          fontSize: 14 + i * 6,
          transform: [{ translateY: z.interpolate({ inputRange: [0, 1], outputRange: [0, -40 - i * 15] }) }],
        }]}>
          Z
        </Animated.Text>
      ))}
    </>
  );
}

// ─── Animasyonlu Karakter ─────────────────────────────
function PetCharacter({ aclik, mutluluk, feedTrigger, playTrigger, sleeping }: {
  aclik: number; mutluluk: number; feedTrigger: number; playTrigger: number; sleeping: boolean;
}) {
  const float = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(1)).current;
  const rotate = useRef(new Animated.Value(0)).current;
  const heartScale = useRef(new Animated.Value(0)).current;

  // Süzülme
  useEffect(() => {
    const speed = sleeping ? 2500 : 1500;
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(float, { toValue: sleeping ? -4 : -8, duration: speed, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(float, { toValue: sleeping ? 4 : 8, duration: speed, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ])
    );
    anim.start();
    return () => anim.stop();
  }, [sleeping]);

  // Beslenince bounce
  useEffect(() => {
    if (feedTrigger === 0) return;
    Animated.sequence([
      Animated.timing(scale, { toValue: 1.3, duration: 150, useNativeDriver: true }),
      Animated.spring(scale, { toValue: 1, friction: 3, useNativeDriver: true }),
    ]).start();
  }, [feedTrigger]);

  // Oynarken sallanma + kalp
  useEffect(() => {
    if (playTrigger === 0) return;
    Animated.parallel([
      Animated.sequence([
        Animated.timing(rotate, { toValue: 1, duration: 80, useNativeDriver: true }),
        Animated.timing(rotate, { toValue: -1, duration: 80, useNativeDriver: true }),
        Animated.timing(rotate, { toValue: 1, duration: 80, useNativeDriver: true }),
        Animated.timing(rotate, { toValue: -1, duration: 80, useNativeDriver: true }),
        Animated.timing(rotate, { toValue: 0, duration: 80, useNativeDriver: true }),
      ]),
      Animated.sequence([
        Animated.timing(heartScale, { toValue: 1, duration: 200, useNativeDriver: true }),
        Animated.delay(600),
        Animated.timing(heartScale, { toValue: 0, duration: 300, useNativeDriver: true }),
      ]),
    ]).start();
  }, [playTrigger]);

  const spin = rotate.interpolate({ inputRange: [-1, 1], outputRange: ['-15deg', '15deg'] });

  const getCharacter = () => {
    if (sleeping) return { face: '😽', label: 'Uyuyor... 💤' };
    if (aclik > 80) return { face: '😿', label: 'Çok açım...' };
    if (mutluluk >= 90) return { face: '😻', label: 'Harikayım!' };
    if (mutluluk > 65) return { face: '😸', label: 'Mutluyum!' };
    if (mutluluk > 40) return { face: '🐱', label: 'İyiyim' };
    if (mutluluk > 20) return { face: '😾', label: 'Canım sıkkın...' };
    return { face: '🙀', label: 'Çok mutsuzum!' };
  };

  const { face, label } = getCharacter();

  return (
    <View style={styles.characterArea}>
      <Sparkles mutluluk={mutluluk} />
      <SleepBubbles sleeping={sleeping} />

      <Animated.View style={{
        transform: [{ translateY: float }, { scale }, { rotate: spin }],
        alignItems: 'center',
      }}>
        <Text style={styles.characterEmoji}>{face}</Text>
      </Animated.View>

      {/* Kalp */}
      <Animated.Text style={[styles.heartFloat, {
        opacity: heartScale,
        transform: [{ scale: heartScale }, { translateY: heartScale.interpolate({ inputRange: [0, 1], outputRange: [0, -30] }) }],
      }]}>
        💕
      </Animated.Text>

      {/* Yemek uçuşu */}
      <FlyingFood trigger={feedTrigger} />
      {/* Top zıplaması */}
      <BouncingBall trigger={playTrigger} />

      <Text style={styles.moodLabel}>{label}</Text>
    </View>
  );
}

// ─── Progress Bar ─────────────────────────────────────
function StatBar({ icon, label, value, colors }: {
  icon: string; label: string; value: number; colors: [string, string];
}) {
  const animWidth = useRef(new Animated.Value(value)).current;

  useEffect(() => {
    Animated.spring(animWidth, { toValue: value, friction: 8, useNativeDriver: false }).start();
  }, [value]);

  const widthPercent = animWidth.interpolate({ inputRange: [0, 100], outputRange: ['0%', '100%'] });

  return (
    <View style={styles.statRow}>
      <View style={styles.statHeader}>
        <Text style={styles.statIcon}>{icon}</Text>
        <Text style={styles.statLabel}>{label}</Text>
        <Text style={styles.statValue}>{value}%</Text>
      </View>
      <View style={styles.barTrack}>
        <Animated.View style={[styles.barThumb, { width: widthPercent }]}>
          <LinearGradient colors={colors} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.barGradient} />
        </Animated.View>
      </View>
    </View>
  );
}

// ─── Ana Tamagotchi ───────────────────────────────────
function Tamagotchi({ isim, tur }: { isim: string; tur: string }) {
  const [aclik, setAclik] = useState(50);
  const [mutluluk, setMutluluk] = useState(50);
  const [enerji, setEnerji] = useState(100);
  const [sleeping, setSleeping] = useState(false);
  const [feedTrigger, setFeedTrigger] = useState(0);
  const [playTrigger, setPlayTrigger] = useState(0);

  // Zamanla açlık artar, enerji düşer (gerçek Tamagotchi)
  useEffect(() => {
    const timer = setInterval(() => {
      if (!sleeping) {
        setAclik(prev => Math.min(prev + 2, 100));
        setMutluluk(prev => Math.max(prev - 1, 0));
        setEnerji(prev => Math.max(prev - 1, 0));
      } else {
        // Uyurken enerji yüklenir
        setEnerji(prev => Math.min(prev + 3, 100));
        setMutluluk(prev => Math.min(prev + 1, 100));
      }
    }, 3000);
    return () => clearInterval(timer);
  }, [sleeping]);

  // Enerji bitince uyutma uyarısı otomatik
  useEffect(() => {
    if (enerji <= 0 && !sleeping) {
      setSleeping(true);
    }
  }, [enerji]);

  const besle = useCallback(() => {
    if (sleeping) return;
    setAclik(prev => Math.max(prev - 20, 0));
    setMutluluk(prev => Math.min(prev + 5, 100));
    setFeedTrigger(t => t + 1);
  }, [sleeping]);

  const oyna = useCallback(() => {
    if (sleeping) return;
    if (enerji < 10) return;
    setMutluluk(prev => Math.min(prev + 20, 100));
    setAclik(prev => Math.min(prev + 5, 100));
    setEnerji(prev => Math.max(prev - 10, 0));
    setPlayTrigger(t => t + 1);
  }, [sleeping, enerji]);

  const uyut = useCallback(() => {
    setSleeping(prev => !prev);
  }, []);

  const getBgColors = (): [string, string, string] => {
    if (sleeping) return ['#2c3e50', '#34495e', '#2c3e50'];
    if (mutluluk > 70 && aclik < 40) return ['#a8e6cf', '#dcedc1', '#ffd3b6'];
    if (aclik > 70) return ['#ff9a9e', '#fecfef', '#fdfcfb'];
    if (mutluluk < 30) return ['#a18cd1', '#fbc2eb', '#f6d5f7'];
    return ['#ffecd2', '#fcb69f', '#ff9a9e'];
  };

  const aclikColors: [string, string] = aclik > 60 ? ['#ff6b6b', '#ee5a24'] : aclik > 30 ? ['#f9ca24', '#f0932b'] : ['#6ab04c', '#badc58'];
  const mutlulukColors: [string, string] = mutluluk > 60 ? ['#6ab04c', '#badc58'] : mutluluk > 30 ? ['#f9ca24', '#f0932b'] : ['#ff6b6b', '#ee5a24'];
  const enerjiColors: [string, string] = enerji > 50 ? ['#74b9ff', '#0984e3'] : enerji > 20 ? ['#fdcb6e', '#e17055'] : ['#ff6b6b', '#d63031'];

  return (
    <LinearGradient colors={getBgColors()} style={styles.gradient}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, sleeping && { color: '#ecf0f1' }]}>🐾 Tamagotchi</Text>
        </View>

        {/* Pet Card */}
        <View style={[styles.petCard, sleeping && styles.petCardSleep]}>
          <View style={styles.nameSection}>
            <Text style={[styles.petName, sleeping && { color: '#ecf0f1' }]}>{isim}</Text>
            <View style={[styles.typeBadge, sleeping && { backgroundColor: 'rgba(236,240,241,0.2)' }]}>
              <Text style={[styles.typeText, sleeping && { color: '#dfe6e9' }]}>{tur}</Text>
            </View>
          </View>

          <PetCharacter
            aclik={aclik}
            mutluluk={mutluluk}
            feedTrigger={feedTrigger}
            playTrigger={playTrigger}
            sleeping={sleeping}
          />
        </View>

        {/* Stats */}
        <View style={[styles.statsCard, sleeping && styles.statsCardSleep]}>
          <StatBar icon="🍖" label="Açlık" value={aclik} colors={aclikColors} />
          <StatBar icon="💖" label="Mutluluk" value={mutluluk} colors={mutlulukColors} />
          <StatBar icon="⚡" label="Enerji" value={enerji} colors={enerjiColors} />
        </View>

        {/* Butonlar */}
        <View style={styles.buttonRow}>
          <TouchableOpacity onPress={besle} activeOpacity={0.8} disabled={sleeping}>
            <LinearGradient
              colors={sleeping ? ['#636e72', '#b2bec3'] : ['#ff9966', '#ff5e62']}
              style={styles.actionButton} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
            >
              <Text style={styles.btnIcon}>🍕</Text>
              <Text style={styles.btnText}>Besle</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity onPress={oyna} activeOpacity={0.8} disabled={sleeping || enerji < 10}>
            <LinearGradient
              colors={sleeping || enerji < 10 ? ['#636e72', '#b2bec3'] : ['#4facfe', '#00f2fe']}
              style={styles.actionButton} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
            >
              <Text style={styles.btnIcon}>🎾</Text>
              <Text style={styles.btnText}>Oyna</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity onPress={uyut} activeOpacity={0.8}>
            <LinearGradient
              colors={sleeping ? ['#fdcb6e', '#e17055'] : ['#a29bfe', '#6c5ce7']}
              style={styles.actionButton} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
            >
              <Text style={styles.btnIcon}>{sleeping ? '☀️' : '🌙'}</Text>
              <Text style={styles.btnText}>{sleeping ? 'Uyandır' : 'Uyut'}</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Durum mesajları */}
        {aclik === 0 && mutluluk === 100 && (
          <View style={styles.alertBox}>
            <Text style={styles.alertPerfect}>🌟 {isim} en mutlu halinde!</Text>
          </View>
        )}
        {aclik > 80 && !sleeping && (
          <View style={[styles.alertBox, styles.alertDanger]}>
            <Text style={styles.alertWarning}>⚠️ {isim} çok aç! Hemen besle!</Text>
          </View>
        )}
        {enerji < 15 && !sleeping && (
          <View style={[styles.alertBox, styles.alertEnergy]}>
            <Text style={styles.alertEnergyText}>😴 {isim} çok yorgun! Uyutmalısın.</Text>
          </View>
        )}
      </View>
    </LinearGradient>
  );
}

export default function HomeScreen() {
  return <Tamagotchi isim="Pamuk" tur="Kedi" />;
}

// ─── Stiller ──────────────────────────────────────────
const styles = StyleSheet.create({
  gradient: { flex: 1 },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 55,
    alignItems: 'center',
  },
  header: { marginBottom: 12 },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: '#fff',
    textShadowColor: 'rgba(0,0,0,0.15)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },

  // Pet Card
  petCard: {
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.85)',
    borderRadius: 28,
    paddingVertical: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
    marginBottom: 14,
  },
  petCardSleep: {
    backgroundColor: 'rgba(44,62,80,0.7)',
  },
  nameSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 4,
  },
  petName: { fontSize: 24, fontWeight: '800', color: '#2d3436' },
  typeBadge: {
    backgroundColor: 'rgba(108,92,231,0.15)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  typeText: { fontSize: 13, fontWeight: '700', color: '#6c5ce7' },

  // Karakter
  characterArea: {
    alignItems: 'center',
    height: 150,
    justifyContent: 'center',
    width: '100%',
  },
  characterEmoji: { fontSize: 90 },
  heartFloat: {
    position: 'absolute',
    top: 5,
    right: 30,
    fontSize: 28,
  },
  moodLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#636e72',
    marginTop: 2,
  },

  // Animasyonlar
  flyingFood: {
    position: 'absolute',
    fontSize: 32,
    zIndex: 10,
  },
  bouncingBall: {
    position: 'absolute',
    fontSize: 24,
    zIndex: 10,
  },
  sparkle: {
    position: 'absolute',
    fontSize: 18,
    zIndex: 5,
  },
  zzz: {
    position: 'absolute',
    top: 10,
    fontWeight: '900',
    color: '#dfe6e9',
    zIndex: 5,
  },

  // Stats
  statsCard: {
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.85)',
    borderRadius: 20,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    marginBottom: 16,
    gap: 12,
  },
  statsCardSleep: {
    backgroundColor: 'rgba(44,62,80,0.7)',
  },
  statRow: { gap: 5 },
  statHeader: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  statIcon: { fontSize: 15 },
  statLabel: { fontSize: 13, fontWeight: '700', color: '#2d3436', flex: 1 },
  statValue: { fontSize: 13, fontWeight: '800', color: '#636e72' },
  barTrack: {
    height: 10,
    backgroundColor: 'rgba(0,0,0,0.06)',
    borderRadius: 5,
    overflow: 'hidden',
  },
  barThumb: { height: '100%', borderRadius: 5, overflow: 'hidden' },
  barGradient: { flex: 1, borderRadius: 5 },

  // Butonlar
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 6,
    gap: 6,
  },
  btnIcon: { fontSize: 20 },
  btnText: { color: '#fff', fontSize: 16, fontWeight: '800' },

  // Uyarılar
  alertBox: {
    marginTop: 12,
    backgroundColor: 'rgba(255,255,255,0.8)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 14,
  },
  alertDanger: { backgroundColor: 'rgba(255,107,107,0.2)' },
  alertEnergy: { backgroundColor: 'rgba(116,185,255,0.2)' },
  alertPerfect: { fontSize: 15, fontWeight: '700', color: '#00b894' },
  alertWarning: { fontSize: 14, fontWeight: '700', color: '#d63031' },
  alertEnergyText: { fontSize: 14, fontWeight: '700', color: '#0984e3' },
});
