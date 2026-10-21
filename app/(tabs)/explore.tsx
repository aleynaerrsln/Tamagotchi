import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useGame, LEVEL_TITLES, xpForLevel } from '../../context/GameContext';

function AchievementCard({ icon, title, description, unlocked, index }: {
  icon: string; title: string; description: string; unlocked: boolean; index: number;
}) {
  const scaleAnim = useRef(new Animated.Value(unlocked ? 1 : 0.95)).current;
  const opacityAnim = useRef(new Animated.Value(unlocked ? 1 : 0.5)).current;

  useEffect(() => {
    if (unlocked) {
      Animated.parallel([
        Animated.spring(scaleAnim, { toValue: 1, friction: 4, useNativeDriver: true }),
        Animated.timing(opacityAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
      ]).start();
    }
  }, [unlocked]);

  return (
    <Animated.View style={[
      styles.achievementCard,
      { transform: [{ scale: scaleAnim }], opacity: opacityAnim },
      !unlocked && styles.achievementLocked,
    ]}>
      <Text style={styles.achievementIcon}>{unlocked ? icon : '🔒'}</Text>
      <View style={styles.achievementInfo}>
        <Text style={[styles.achievementTitle, !unlocked && { color: '#b2bec3' }]}>{title}</Text>
        <Text style={[styles.achievementDesc, !unlocked && { color: '#dfe6e9' }]}>{description}</Text>
      </View>
      {unlocked && <Text style={styles.checkMark}>✅</Text>}
    </Animated.View>
  );
}

function StatsSection() {
  const { xp, level, levelTitle, totalFeeds, totalPlays, totalSleeps } = useGame();

  const stats = [
    { icon: '⭐', label: 'Toplam XP', value: xp.toString() },
    { icon: '📊', label: 'Seviye', value: `${level} - ${levelTitle}` },
    { icon: '🍕', label: 'Toplam Besleme', value: totalFeeds.toString() },
    { icon: '🎾', label: 'Toplam Oyun', value: totalPlays.toString() },
    { icon: '😴', label: 'Toplam Uyku', value: totalSleeps.toString() },
  ];

  return (
    <View style={styles.statsSection}>
      {stats.map((s, i) => (
        <View key={i} style={styles.statItem}>
          <Text style={styles.statItemIcon}>{s.icon}</Text>
          <Text style={styles.statItemLabel}>{s.label}</Text>
          <Text style={styles.statItemValue}>{s.value}</Text>
        </View>
      ))}
    </View>
  );
}

function LevelRoadmap() {
  const { level } = useGame();

  return (
    <View style={styles.roadmapSection}>
      <Text style={styles.sectionTitle}>🗺️ Seviye Yol Haritası</Text>
      {LEVEL_TITLES.map((title, i) => {
        const isReached = level >= i;
        const isCurrent = level === i;
        return (
          <View key={i} style={[styles.roadmapItem, isCurrent && styles.roadmapCurrent]}>
            <View style={[styles.roadmapDot, isReached ? styles.dotReached : styles.dotLocked]}>
              <Text style={styles.roadmapLevel}>{i}</Text>
            </View>
            <View style={styles.roadmapInfo}>
              <Text style={[styles.roadmapTitle, isReached && { color: '#2d3436' }]}>{title}</Text>
              <Text style={styles.roadmapXP}>{xpForLevel(i)} XP</Text>
            </View>
            {isCurrent && <Text style={styles.currentBadge}>📍 Buradasın</Text>}
            {isReached && !isCurrent && <Text style={styles.reachedMark}>✅</Text>}
          </View>
        );
      })}
    </View>
  );
}

export default function AchievementsScreen() {
  const { achievements } = useGame();
  const unlockedCount = achievements.filter(a => a.unlocked).length;

  return (
    <LinearGradient colors={['#667eea', '#764ba2']} style={styles.gradient}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <Text style={styles.headerTitle}>🏆 Başarımlar & İstatistikler</Text>
        <Text style={styles.headerSub}>{unlockedCount} / {achievements.length} başarım açıldı</Text>

        {/* Progress */}
        <View style={styles.progressContainer}>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${(unlockedCount / achievements.length) * 100}%` }]} />
          </View>
          <Text style={styles.progressText}>{Math.round((unlockedCount / achievements.length) * 100)}%</Text>
        </View>

        {/* Stats */}
        <StatsSection />

        {/* Achievements Grid */}
        <Text style={styles.sectionTitle}>🎖️ Rozetler</Text>
        {achievements.map((a, i) => (
          <AchievementCard key={a.id} icon={a.icon} title={a.title} description={a.description} unlocked={a.unlocked} index={i} />
        ))}

        {/* Level Roadmap */}
        <LevelRoadmap />

        <View style={{ height: 40 }} />
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingTop: 55 },

  // Header
  headerTitle: { fontSize: 26, fontWeight: '900', color: '#fff', textAlign: 'center' },
  headerSub: { fontSize: 14, color: 'rgba(255,255,255,0.8)', textAlign: 'center', marginTop: 4, marginBottom: 12 },

  // Progress
  progressContainer: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 16 },
  progressTrack: { flex: 1, height: 10, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 5, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: '#fdcb6e', borderRadius: 5 },
  progressText: { fontSize: 14, fontWeight: '800', color: '#fdcb6e' },

  // Stats
  statsSection: { backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 18, padding: 16, marginBottom: 18, gap: 10 },
  statItem: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  statItemIcon: { fontSize: 18 },
  statItemLabel: { flex: 1, fontSize: 14, fontWeight: '600', color: 'rgba(255,255,255,0.9)' },
  statItemValue: { fontSize: 14, fontWeight: '800', color: '#fff' },

  // Section Title
  sectionTitle: { fontSize: 20, fontWeight: '800', color: '#fff', marginBottom: 12, marginTop: 6 },

  // Achievement Card
  achievementCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 14,
    padding: 14,
    marginBottom: 8,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  achievementLocked: { backgroundColor: 'rgba(255,255,255,0.2)' },
  achievementIcon: { fontSize: 28 },
  achievementInfo: { flex: 1 },
  achievementTitle: { fontSize: 15, fontWeight: '700', color: '#2d3436' },
  achievementDesc: { fontSize: 12, color: '#636e72', marginTop: 2 },
  checkMark: { fontSize: 18 },

  // Roadmap
  roadmapSection: { marginTop: 6, marginBottom: 10 },
  roadmapItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginBottom: 4,
  },
  roadmapCurrent: { backgroundColor: 'rgba(253,203,110,0.2)' },
  roadmapDot: { width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  dotReached: { backgroundColor: '#fdcb6e' },
  dotLocked: { backgroundColor: 'rgba(255,255,255,0.2)' },
  roadmapLevel: { fontSize: 13, fontWeight: '800', color: '#fff' },
  roadmapInfo: { flex: 1 },
  roadmapTitle: { fontSize: 14, fontWeight: '700', color: 'rgba(255,255,255,0.5)' },
  roadmapXP: { fontSize: 11, color: 'rgba(255,255,255,0.4)' },
  currentBadge: { fontSize: 12, fontWeight: '700' },
  reachedMark: { fontSize: 14 },
});
