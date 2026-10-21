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
import { useGame, xpForLevel } from '../../context/GameContext';
import CatCharacter from '../../components/CatCharacter';

// ─── Başarım Popup ────────────────────────────────────
function AchievementPopup() {
  const { newAchievement, clearNewAchievement } = useGame();
  const slide = useRef(new Animated.Value(-100)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!newAchievement) return;
    Animated.parallel([
      Animated.spring(slide, { toValue: 0, friction: 6, useNativeDriver: true }),
      Animated.timing(opacity, { toValue: 1, duration: 300, useNativeDriver: true }),
    ]).start();
    const t = setTimeout(() => {
      Animated.parallel([
        Animated.timing(slide, { toValue: -100, duration: 300, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0, duration: 300, useNativeDriver: true }),
      ]).start(() => clearNewAchievement());
    }, 2500);
    return () => clearTimeout(t);
  }, [newAchievement]);

  if (!newAchievement) return null;
  return (
    <Animated.View style={[styles.popup, { transform: [{ translateY: slide }], opacity }]}>
      <LinearGradient colors={['#fdcb6e', '#f39c12']} style={styles.popupInner} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
        <Text style={styles.popupIcon}>{newAchievement.icon}</Text>
        <View>
          <Text style={styles.popupLabel}>Başarım Açıldı!</Text>
          <Text style={styles.popupTitle}>{newAchievement.title}</Text>
        </View>
      </LinearGradient>
    </Animated.View>
  );
}

// ─── XP & Coin Bar ────────────────────────────────────
function TopBar() {
  const { xp, level, levelTitle, coins } = useGame();
  const nextXP = xpForLevel(level + 1);
  const currentXP = xpForLevel(level);
  const progress = Math.min(((xp - currentXP) / (nextXP - currentXP)) * 100, 100);
  const animW = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(animW, { toValue: progress, friction: 8, useNativeDriver: false }).start();
  }, [progress]);

  const w = animW.interpolate({ inputRange: [0, 100], outputRange: ['0%', '100%'] });

  return (
    <View style={styles.topBar}>
      <View style={styles.topBarLeft}>
        <View style={styles.levelCircle}>
          <Text style={styles.levelNum}>{level}</Text>
        </View>
        <View style={styles.xpInfo}>
          <Text style={styles.levelTitle}>{levelTitle}</Text>
          <View style={styles.xpTrack}>
            <Animated.View style={[styles.xpFill, { width: w }]}>
              <LinearGradient colors={['#f9ca24', '#f0932b']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={{ flex: 1, borderRadius: 3 }} />
            </Animated.View>
          </View>
          <Text style={styles.xpText}>{xp} / {nextXP} XP</Text>
        </View>
      </View>
      <View style={styles.coinBadge}>
        <Text style={styles.coinIcon}>🪙</Text>
        <Text style={styles.coinNum}>{coins}</Text>
      </View>
    </View>
  );
}

// ─── Stat Bar ─────────────────────────────────────────
function StatBar({ icon, label, value, colors }: {
  icon: string; label: string; value: number; colors: [string, string];
}) {
  const animW = useRef(new Animated.Value(value)).current;
  useEffect(() => {
    Animated.spring(animW, { toValue: value, friction: 8, useNativeDriver: false }).start();
  }, [value]);
  const w = animW.interpolate({ inputRange: [0, 100], outputRange: ['0%', '100%'] });

  return (
    <View style={styles.statRow}>
      <View style={styles.statHeader}>
        <Text style={styles.statIcon}>{icon}</Text>
        <Text style={styles.statLabel}>{label}</Text>
        <Text style={styles.statValue}>{value}%</Text>
      </View>
      <View style={styles.barTrack}>
        <Animated.View style={[styles.barThumb, { width: w }]}>
          <LinearGradient colors={colors} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.barGrad} />
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
  const game = useGame();

  // Zamanla değişim
  useEffect(() => {
    const timer = setInterval(() => {
      if (!sleeping) {
        setAclik(prev => Math.min(prev + 2, 100));
        setMutluluk(prev => Math.max(prev - 1, 0));
        setEnerji(prev => Math.max(prev - 1, 0));
      } else {
        setEnerji(prev => Math.min(prev + 3, 100));
        setMutluluk(prev => Math.min(prev + 1, 100));
      }
    }, 3000);
    return () => clearInterval(timer);
  }, [sleeping]);

  useEffect(() => {
    if (enerji <= 0 && !sleeping) setSleeping(true);
  }, [enerji]);

  useEffect(() => {
    game.checkAchievements(aclik, mutluluk);
  }, [aclik, mutluluk]);

  const besle = useCallback(() => {
    if (sleeping) return;
    setAclik(prev => Math.max(prev - 20, 0));
    setMutluluk(prev => Math.min(prev + 5, 100));
    setFeedTrigger(t => t + 1);
    game.recordFeed();
  }, [sleeping, game]);

  const oyna = useCallback(() => {
    if (sleeping || enerji < 10) return;
    setMutluluk(prev => Math.min(prev + 20, 100));
    setAclik(prev => Math.min(prev + 5, 100));
    setEnerji(prev => Math.max(prev - 10, 0));
    setPlayTrigger(t => t + 1);
    game.recordPlay();
  }, [sleeping, enerji, game]);

  const uyut = useCallback(() => {
    const willSleep = !sleeping;
    setSleeping(willSleep);
    if (willSleep) game.recordSleep();
  }, [sleeping, game]);

  const getBg = (): [string, string, string] => {
    if (sleeping) return ['#2c3e50', '#34495e', '#2c3e50'];
    if (mutluluk > 70 && aclik < 40) return ['#a8e6cf', '#dcedc1', '#ffd3b6'];
    if (aclik > 70) return ['#ff9a9e', '#fecfef', '#fdfcfb'];
    if (mutluluk < 30) return ['#a18cd1', '#fbc2eb', '#f6d5f7'];
    return ['#ffecd2', '#fcb69f', '#ff9a9e'];
  };

  const aclikC: [string, string] = aclik > 60 ? ['#ff6b6b', '#ee5a24'] : aclik > 30 ? ['#f9ca24', '#f0932b'] : ['#6ab04c', '#badc58'];
  const mutlulukC: [string, string] = mutluluk > 60 ? ['#6ab04c', '#badc58'] : mutluluk > 30 ? ['#f9ca24', '#f0932b'] : ['#ff6b6b', '#ee5a24'];
  const enerjiC: [string, string] = enerji > 50 ? ['#74b9ff', '#0984e3'] : enerji > 20 ? ['#fdcb6e', '#e17055'] : ['#ff6b6b', '#d63031'];

  return (
    <LinearGradient colors={getBg()} style={styles.gradient}>
      <View style={styles.container}>
        <AchievementPopup />

        <Text style={[styles.title, sleeping && { color: '#ecf0f1' }]}>🐾 Tamagotchi</Text>
        <TopBar />

        {/* Kedi Karakteri */}
        <View style={[styles.petCard, sleeping && styles.petCardSleep]}>
          <View style={styles.nameRow}>
            <Text style={[styles.petName, sleeping && { color: '#ecf0f1' }]}>{isim}</Text>
            <View style={[styles.typeBadge, sleeping && { backgroundColor: 'rgba(236,240,241,0.2)' }]}>
              <Text style={[styles.typeText, sleeping && { color: '#dfe6e9' }]}>{tur}</Text>
            </View>
          </View>
          <View style={styles.catArea}>
            <CatCharacter
              aclik={aclik}
              mutluluk={mutluluk}
              sleeping={sleeping}
              feedTrigger={feedTrigger}
              playTrigger={playTrigger}
              equippedItems={game.equippedItems}
            />
          </View>
        </View>

        {/* Stats */}
        <View style={[styles.statsCard, sleeping && styles.statsCardSleep]}>
          <StatBar icon="🍖" label="Açlık" value={aclik} colors={aclikC} />
          <StatBar icon="💖" label="Mutluluk" value={mutluluk} colors={mutlulukC} />
          <StatBar icon="⚡" label="Enerji" value={enerji} colors={enerjiC} />
        </View>

        {/* Butonlar */}
        <View style={styles.btnRow}>
          <TouchableOpacity onPress={besle} activeOpacity={0.8} disabled={sleeping}>
            <LinearGradient colors={sleeping ? ['#636e72', '#b2bec3'] : ['#ff9966', '#ff5e62']} style={styles.btn} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
              <Text style={styles.btnIcon}>🍕</Text>
              <Text style={styles.btnText}>Besle</Text>
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity onPress={oyna} activeOpacity={0.8} disabled={sleeping || enerji < 10}>
            <LinearGradient colors={sleeping || enerji < 10 ? ['#636e72', '#b2bec3'] : ['#4facfe', '#00f2fe']} style={styles.btn} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
              <Text style={styles.btnIcon}>🎾</Text>
              <Text style={styles.btnText}>Oyna</Text>
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity onPress={uyut} activeOpacity={0.8}>
            <LinearGradient colors={sleeping ? ['#fdcb6e', '#e17055'] : ['#a29bfe', '#6c5ce7']} style={styles.btn} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
              <Text style={styles.btnIcon}>{sleeping ? '☀️' : '🌙'}</Text>
              <Text style={styles.btnText}>{sleeping ? 'Uyandır' : 'Uyut'}</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {aclik > 80 && !sleeping && (
          <View style={[styles.alert, { backgroundColor: 'rgba(255,107,107,0.2)' }]}>
            <Text style={{ fontSize: 13, fontWeight: '700', color: '#d63031' }}>⚠️ {isim} çok aç!</Text>
          </View>
        )}
        {enerji < 15 && !sleeping && (
          <View style={[styles.alert, { backgroundColor: 'rgba(116,185,255,0.2)' }]}>
            <Text style={{ fontSize: 13, fontWeight: '700', color: '#0984e3' }}>😴 {isim} çok yorgun!</Text>
          </View>
        )}
      </View>
    </LinearGradient>
  );
}

export default function HomeScreen() {
  return <Tamagotchi isim="Pamuk" tur="Kedi" />;
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  container: { flex: 1, paddingHorizontal: 18, paddingTop: 48, alignItems: 'center' },
  title: { fontSize: 24, fontWeight: '900', color: '#fff', textShadowColor: 'rgba(0,0,0,0.15)', textShadowOffset: { width: 0, height: 2 }, textShadowRadius: 4, marginBottom: 6 },

  // Top bar
  topBar: { width: '100%', flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.75)', borderRadius: 14, padding: 10, marginBottom: 8, gap: 10 },
  topBarLeft: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8 },
  levelCircle: { width: 34, height: 34, borderRadius: 17, backgroundColor: '#f0932b', justifyContent: 'center', alignItems: 'center' },
  levelNum: { color: '#fff', fontSize: 15, fontWeight: '900' },
  xpInfo: { flex: 1 },
  levelTitle: { fontSize: 12, fontWeight: '800', color: '#2d3436' },
  xpTrack: { height: 6, backgroundColor: 'rgba(0,0,0,0.06)', borderRadius: 3, overflow: 'hidden', marginVertical: 2 },
  xpFill: { height: '100%', borderRadius: 3, overflow: 'hidden' },
  xpText: { fontSize: 10, color: '#636e72', fontWeight: '600' },
  coinBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(241,196,15,0.2)', borderRadius: 12, paddingHorizontal: 10, paddingVertical: 4, gap: 4 },
  coinIcon: { fontSize: 16 },
  coinNum: { fontSize: 15, fontWeight: '900', color: '#f39c12' },

  // Pet card
  petCard: { width: '100%', backgroundColor: 'rgba(255,255,255,0.85)', borderRadius: 22, paddingTop: 12, paddingBottom: 6, paddingHorizontal: 16, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.1, shadowRadius: 10, elevation: 5, marginBottom: 8 },
  petCardSleep: { backgroundColor: 'rgba(44,62,80,0.7)' },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 2 },
  petName: { fontSize: 20, fontWeight: '800', color: '#2d3436' },
  typeBadge: { backgroundColor: 'rgba(108,92,231,0.15)', paddingHorizontal: 10, paddingVertical: 3, borderRadius: 10 },
  typeText: { fontSize: 11, fontWeight: '700', color: '#6c5ce7' },
  catArea: { height: 230, justifyContent: 'center', alignItems: 'center' },

  // Stats
  statsCard: { width: '100%', backgroundColor: 'rgba(255,255,255,0.85)', borderRadius: 16, padding: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 3, marginBottom: 10, gap: 8 },
  statsCardSleep: { backgroundColor: 'rgba(44,62,80,0.7)' },
  statRow: { gap: 3 },
  statHeader: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  statIcon: { fontSize: 13 },
  statLabel: { fontSize: 11, fontWeight: '700', color: '#2d3436', flex: 1 },
  statValue: { fontSize: 11, fontWeight: '800', color: '#636e72' },
  barTrack: { height: 7, backgroundColor: 'rgba(0,0,0,0.06)', borderRadius: 4, overflow: 'hidden' },
  barThumb: { height: '100%', borderRadius: 4, overflow: 'hidden' },
  barGrad: { flex: 1, borderRadius: 4 },

  // Buttons
  btnRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap', justifyContent: 'center' },
  btn: { flexDirection: 'row', alignItems: 'center', paddingVertical: 11, paddingHorizontal: 16, borderRadius: 14, shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.12, shadowRadius: 5, elevation: 4, gap: 5 },
  btnIcon: { fontSize: 16 },
  btnText: { color: '#fff', fontSize: 14, fontWeight: '800' },

  // Alert
  alert: { marginTop: 8, paddingHorizontal: 16, paddingVertical: 7, borderRadius: 10 },

  // Popup
  popup: { position: 'absolute', top: 45, left: 18, right: 18, zIndex: 100 },
  popupInner: { flexDirection: 'row', alignItems: 'center', padding: 12, borderRadius: 14, gap: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 8 },
  popupIcon: { fontSize: 28 },
  popupLabel: { fontSize: 10, fontWeight: '600', color: '#fff', opacity: 0.9 },
  popupTitle: { fontSize: 14, fontWeight: '900', color: '#fff' },
});
