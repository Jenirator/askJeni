import {
  View, Text, TouchableOpacity, StyleSheet, Animated,
  PanResponder, Dimensions, ScrollView,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useState, useRef } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { colors, radius, spacing, font, companyColor } from '@/lib/theme'
import { MOCK_MATCHES } from '@/lib/mock-data'

const { width: SCREEN_W } = Dimensions.get('window')
const SWIPE_THRESHOLD = SCREEN_W * 0.3

type Match = typeof MOCK_MATCHES[0]

export default function OpportunitiesScreen() {
  const [mode, setMode] = useState<'swipe' | 'list'>('swipe')
  const [deck, setDeck] = useState<Match[]>([...MOCK_MATCHES])
  const [saved, setSaved] = useState<Match[]>([])
  const [lastAction, setLastAction] = useState<'saved' | 'skipped' | null>(null)

  function onSave(match: Match) {
    setSaved(prev => [match, ...prev])
    setLastAction('saved')
    setDeck(prev => prev.filter(m => m.id !== match.id))
    setTimeout(() => setLastAction(null), 1200)
  }

  function onSkip(match: Match) {
    setLastAction('skipped')
    setDeck(prev => prev.filter(m => m.id !== match.id))
    setTimeout(() => setLastAction(null), 1200)
  }

  function resetDeck() {
    setDeck([...MOCK_MATCHES])
    setSaved([])
  }

  return (
    <SafeAreaView style={s.safe} edges={['top']}>

      {/* Header */}
      <View style={s.header}>
        <Text style={s.title}>Matches</Text>
        <View style={s.modeToggle}>
          <TouchableOpacity
            style={[s.modeBtn, mode === 'swipe' && s.modeBtnActive]}
            onPress={() => setMode('swipe')}
          >
            <Ionicons name="layers-outline" size={15} color={mode === 'swipe' ? '#fff' : colors.text3} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[s.modeBtn, mode === 'list' && s.modeBtnActive]}
            onPress={() => setMode('list')}
          >
            <Ionicons name="list-outline" size={15} color={mode === 'list' ? '#fff' : colors.text3} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Toast feedback */}
      {lastAction && (
        <View style={[s.toast, lastAction === 'saved' ? s.toastSave : s.toastSkip]}>
          <Text style={s.toastText}>
            {lastAction === 'saved' ? '❤️  Saved!' : '👋  Skipped'}
          </Text>
        </View>
      )}

      {mode === 'swipe' ? (
        <View style={s.swipeArea}>
          {deck.length === 0 ? (
            <View style={s.emptyState}>
              <Text style={s.emptyEmoji}>🎉</Text>
              <Text style={s.emptyTitle}>You've seen all your matches</Text>
              <Text style={s.emptySub}>You saved {saved.length} role{saved.length !== 1 ? 's' : ''}.</Text>
              <TouchableOpacity style={s.resetBtn} onPress={resetDeck}>
                <Text style={s.resetBtnText}>Start over</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              <Text style={s.deckCount}>{deck.length} remaining · swipe to explore</Text>

              {/* Card stack container */}
              <View style={s.stackWrap}>
                {/* Cards peeking behind */}
                {deck.slice(1, 3).reverse().map((match, i) => (
                  <View
                    key={match.id}
                    style={[
                      s.stackCard,
                      {
                        top: 6 + (i * 7),
                        transform: [{ scale: 0.97 - (i * 0.03) }],
                        opacity: 0.55 - (i * 0.15),
                        zIndex: i,
                      },
                    ]}
                  />
                ))}

                {/* Top swipeable card */}
                <SwipeCard
                  key={deck[0].id}
                  match={deck[0]}
                  onSave={() => onSave(deck[0])}
                  onSkip={() => onSkip(deck[0])}
                />
              </View>

              {/* Swipe hint */}
              <View style={s.swipeHint}>
                <View style={s.hintSkip}><Text style={s.hintSkipText}>✕ Skip</Text></View>
                <Text style={s.hintCenter}>drag to decide</Text>
                <View style={s.hintSave}><Text style={s.hintSaveText}>Save ❤</Text></View>
              </View>
            </>
          )}
        </View>
      ) : (
        <ScrollView style={s.listScroll} showsVerticalScrollIndicator={false}>
          <View style={s.listContent}>
            {saved.length > 0 && (
              <View style={s.savedSection}>
                <Text style={s.savedLabel}>❤️  Saved ({saved.length})</Text>
                {saved.map(m => <ListCard key={m.id} match={m} saved />)}
              </View>
            )}
            <Text style={s.savedLabel}>All matches</Text>
            {MOCK_MATCHES.map(m => (
              <ListCard key={m.id} match={m} saved={saved.some(s => s.id === m.id)} />
            ))}
            <View style={{ height: 32 }} />
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  )
}

function SwipeCard({ match, onSave, onSkip }: { match: Match; onSave: () => void; onSkip: () => void }) {
  const pan = useRef(new Animated.ValueXY()).current
  const col = companyColor(match.company)
  const abbr = match.company.split(' ').map(w => w[0]).join('').slice(0, 2)
  const barColor = match.score >= 90 ? colors.green : match.score >= 75 ? colors.blue : colors.yellow

  const rotate = pan.x.interpolate({ inputRange: [-SCREEN_W, 0, SCREEN_W], outputRange: ['-12deg', '0deg', '12deg'] })
  const saveOpacity = pan.x.interpolate({ inputRange: [0, SWIPE_THRESHOLD], outputRange: [0, 1], extrapolate: 'clamp' })
  const skipOpacity = pan.x.interpolate({ inputRange: [-SWIPE_THRESHOLD, 0], outputRange: [1, 0], extrapolate: 'clamp' })

  const panResponder = useRef(PanResponder.create({
    onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dx) > 5,
    onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], { useNativeDriver: false }),
    onPanResponderRelease: (_, g) => {
      if (g.dx > SWIPE_THRESHOLD) {
        Animated.timing(pan, { toValue: { x: SCREEN_W * 1.5, y: g.dy }, duration: 250, useNativeDriver: false }).start(onSave)
      } else if (g.dx < -SWIPE_THRESHOLD) {
        Animated.timing(pan, { toValue: { x: -SCREEN_W * 1.5, y: g.dy }, duration: 250, useNativeDriver: false }).start(onSkip)
      } else {
        Animated.spring(pan, { toValue: { x: 0, y: 0 }, useNativeDriver: false }).start()
      }
    },
  })).current

  return (
    <Animated.View
      style={[s.swipeCard, { transform: [{ translateX: pan.x }, { translateY: pan.y }, { rotate }] }]}
      {...panResponder.panHandlers}
    >
      {/* Save label overlay */}
      <Animated.View style={[s.swipeLabel, s.swipeLabelSave, { opacity: saveOpacity }]}>
        <Text style={s.swipeLabelText}>SAVE ❤️</Text>
      </Animated.View>
      {/* Skip label overlay */}
      <Animated.View style={[s.swipeLabel, s.swipeLabelSkip, { opacity: skipOpacity }]}>
        <Text style={s.swipeLabelText}>SKIP 👋</Text>
      </Animated.View>

      {/* Company header */}
      <View style={[s.cardHeader, { backgroundColor: col }]}>
        <View style={s.cardHeaderInner}>
          <View style={s.cardLogoCircle}>
            <Text style={s.cardLogoText}>{abbr}</Text>
          </View>
          <View>
            <Text style={s.cardCompany}>{match.company}</Text>
            <Text style={s.cardCity}>📍 {match.city}</Text>
          </View>
        </View>
        <View style={[s.scorePill, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
          <Text style={s.scorePillText}>{match.score}% match</Text>
        </View>
      </View>

      {/* Card body */}
      <View style={s.cardBody}>
        <Text style={s.cardRole}>{match.role}</Text>

        <View style={s.tagRow}>
          <Tag icon="briefcase-outline" label="Graduate" />
          <Tag icon="home-outline"      label="Hybrid" />
          <Tag icon="time-outline"      label="Full-time" />
        </View>

        {/* Match bar */}
        <View style={s.cardBarSection}>
          <View style={s.cardBarRow}>
            <Text style={s.cardBarLabel}>Match strength</Text>
            <Text style={[s.cardBarPct, { color: barColor }]}>{match.score}%</Text>
          </View>
          <View style={s.cardBarTrack}>
            <View style={[s.cardBarFill, { width: `${match.score}%`, backgroundColor: barColor }]} />
          </View>
        </View>

        {/* Salary placeholder */}
        <View style={s.salaryRow}>
          <Ionicons name="cash-outline" size={15} color={colors.text3} />
          <Text style={s.salaryText}>R22,000 – R26,000 / month</Text>
        </View>
      </View>

      {/* Action buttons */}
      <View style={s.cardActions}>
        <TouchableOpacity style={s.skipBtn} onPress={onSkip}>
          <Ionicons name="close" size={24} color={colors.text3} />
        </TouchableOpacity>
        <TouchableOpacity style={s.applyBtn} onPress={onSave}>
          <Text style={s.applyBtnText}>Apply via askJeni →</Text>
        </TouchableOpacity>
        <TouchableOpacity style={s.saveBtn} onPress={onSave}>
          <Ionicons name="heart-outline" size={24} color={colors.blue} />
        </TouchableOpacity>
      </View>
    </Animated.View>
  )
}

function Tag({ icon, label }: { icon: React.ComponentProps<typeof Ionicons>['name']; label: string }) {
  return (
    <View style={t.tag}>
      <Ionicons name={icon} size={11} color={colors.text2} />
      <Text style={t.tagText}>{label}</Text>
    </View>
  )
}

function ListCard({ match, saved: isSaved }: { match: Match; saved: boolean }) {
  const col = companyColor(match.company)
  const abbr = match.company.split(' ').map(w => w[0]).join('').slice(0, 2)
  const barColor = match.score >= 90 ? colors.green : match.score >= 75 ? colors.blue : colors.yellow
  return (
    <TouchableOpacity style={l.card} activeOpacity={0.75}>
      <View style={[l.avatar, { backgroundColor: col }]}>
        <Text style={l.avatarText}>{abbr}</Text>
      </View>
      <View style={l.info}>
        <Text style={l.role} numberOfLines={1}>{match.role}</Text>
        <Text style={l.meta}>{match.company} · {match.city}</Text>
      </View>
      <View style={l.right}>
        {isSaved && <Ionicons name="heart" size={12} color={colors.blue} />}
        <Text style={[l.pct, { color: barColor }]}>{match.score}%</Text>
      </View>
    </TouchableOpacity>
  )
}

const t = StyleSheet.create({
  tag: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: colors.bg, paddingHorizontal: 9, paddingVertical: 5, borderRadius: radius.sm },
  tagText: { fontSize: 11, color: colors.text2, fontWeight: '500' },
})

const l = StyleSheet.create({
  card: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#fff', borderRadius: radius.lg, padding: 13, marginBottom: 8, borderWidth: 1, borderColor: colors.border },
  avatar: { width: 40, height: 40, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#fff', fontWeight: '700', fontSize: font.sm },
  info: { flex: 1 },
  role: { fontSize: font.base, fontWeight: '600', color: colors.text1 },
  meta: { fontSize: font.sm, color: colors.text3, marginTop: 2 },
  right: { alignItems: 'flex-end', gap: 2 },
  pct:  { fontSize: font.base, fontWeight: '800' },
})

const s = StyleSheet.create({
  safe:  { flex: 1, backgroundColor: colors.bg },

  header: {
    backgroundColor: colors.navy,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    paddingTop: 12,
    paddingBottom: 20,
  },
  title: { color: '#fff', fontSize: font.xl, fontWeight: '800' },
  modeToggle: { flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: radius.md, padding: 3, gap: 2 },
  modeBtn: { padding: 6, borderRadius: radius.sm },
  modeBtnActive: { backgroundColor: colors.blue },

  toast: {
    position: 'absolute',
    top: 100,
    alignSelf: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: radius.full,
    zIndex: 100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  toastSave: { backgroundColor: colors.green },
  toastSkip: { backgroundColor: colors.text2 },
  toastText: { color: '#fff', fontWeight: '700', fontSize: font.base },

  swipeArea: { flex: 1, alignItems: 'center', justifyContent: 'flex-start', paddingTop: 12 },

  deckCount: { fontSize: 12, color: colors.text3, fontWeight: '600', marginBottom: 14, letterSpacing: 0.3 },

  stackWrap: {
    width: SCREEN_W - 32,
    alignItems: 'center',
  },

  stackCard: {
    position: 'absolute',
    width: SCREEN_W - 32,
    height: 460,
    backgroundColor: '#fff',
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
  },

  swipeCard: {
    width: SCREEN_W - 32,
    backgroundColor: '#fff',
    borderRadius: radius.xl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
    overflow: 'hidden',
    zIndex: 10,
  },

  swipeHint: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: SCREEN_W - 64,
    marginTop: 18,
  },
  hintSkip: { backgroundColor: '#F3F4F6', paddingHorizontal: 14, paddingVertical: 7, borderRadius: radius.full },
  hintSkipText: { fontSize: 12, color: colors.text3, fontWeight: '600' },
  hintCenter: { fontSize: 11, color: colors.text3, fontWeight: '500' },
  hintSave: { backgroundColor: `${colors.blue}12`, paddingHorizontal: 14, paddingVertical: 7, borderRadius: radius.full },
  hintSaveText: { fontSize: 12, color: colors.blue, fontWeight: '600' },

  swipeLabel: {
    position: 'absolute',
    top: 24,
    zIndex: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: radius.md,
    borderWidth: 3,
  },
  swipeLabelSave: { right: 20, borderColor: colors.green, backgroundColor: 'rgba(22,163,74,0.9)' },
  swipeLabelSkip: { left: 20, borderColor: '#9CA3AF', backgroundColor: 'rgba(107,114,128,0.9)' },
  swipeLabelText: { color: '#fff', fontWeight: '800', fontSize: font.base, letterSpacing: 1 },

  cardHeader: { padding: spacing.xl },
  cardHeaderInner: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  cardLogoCircle: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  cardLogoText: { color: '#fff', fontWeight: '800', fontSize: font.base },
  cardCompany: { color: '#fff', fontWeight: '700', fontSize: font.base },
  cardCity: { color: 'rgba(255,255,255,0.7)', fontSize: font.sm, marginTop: 1 },
  scorePill: { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: radius.full },
  scorePillText: { color: '#fff', fontWeight: '700', fontSize: font.sm },

  cardBody: { padding: spacing.xl },
  cardRole: { fontSize: font.xxl, fontWeight: '800', color: colors.text1, marginBottom: 14, letterSpacing: -0.5 },
  tagRow:   { flexDirection: 'row', gap: 6, flexWrap: 'wrap', marginBottom: 18 },

  cardBarSection: { marginBottom: 14 },
  cardBarRow:     { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  cardBarLabel:   { fontSize: font.sm, color: colors.text3, fontWeight: '500' },
  cardBarPct:     { fontSize: font.sm, fontWeight: '800' },
  cardBarTrack:   { height: 6, backgroundColor: colors.border, borderRadius: 3, overflow: 'hidden' },
  cardBarFill:    { height: 6, borderRadius: 3 },

  salaryRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  salaryText:{ fontSize: font.sm, color: colors.text2, fontWeight: '500' },

  cardActions: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    paddingTop: 0,
    gap: 10,
  },
  skipBtn:     { width: 46, height: 46, borderRadius: 23, borderWidth: 1.5, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  applyBtn:    { flex: 1, backgroundColor: colors.navy, paddingVertical: 13, borderRadius: radius.md, alignItems: 'center' },
  applyBtnText:{ color: '#fff', fontWeight: '700', fontSize: font.base },
  saveBtn:     { width: 46, height: 46, borderRadius: 23, borderWidth: 1.5, borderColor: `${colors.blue}40`, alignItems: 'center', justifyContent: 'center', backgroundColor: `${colors.blue}08` },

  emptyState: { alignItems: 'center', justifyContent: 'center', flex: 1, paddingHorizontal: 40 },
  emptyEmoji: { fontSize: 48, marginBottom: 16 },
  emptyTitle: { fontSize: font.lg, fontWeight: '700', color: colors.text1, textAlign: 'center', marginBottom: 8 },
  emptySub:   { fontSize: font.base, color: colors.text3, textAlign: 'center', marginBottom: 24 },
  resetBtn:   { backgroundColor: colors.navy, paddingHorizontal: 24, paddingVertical: 12, borderRadius: radius.md },
  resetBtnText: { color: '#fff', fontWeight: '700', fontSize: font.base },

  listScroll: { flex: 1 },
  listContent: { padding: spacing.lg },
  savedSection: { marginBottom: spacing.lg },
  savedLabel: { fontSize: 11, fontWeight: '700', color: colors.text3, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 10, marginLeft: 2 },
})
