import { View, Text, TouchableOpacity, StyleSheet, Linking } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { colors, radius, spacing, font } from '@/lib/theme'

const CV_URL = 'https://askjeni.co.za/profile/thabo-nkosi/cv'
import { MOCK_STUDENT, MOCK_SKILLS, MOCK_ASSESSMENTS, CHECKLIST } from '@/lib/mock-data'

const score = MOCK_STUDENT.passportCompletion
const doneCount = CHECKLIST.filter(c => c.done).length
const verified = MOCK_SKILLS.filter(s => s.level === 'VERIFIED')
const initials = MOCK_STUDENT.name.split(' ').map(n => n[0]).join('')

export default function PassportScreen() {
  return (
    <SafeAreaView style={s.safe} edges={['top']}>

      {/* Header */}
      <View style={s.header}>
        <Text style={s.pageTitle}>Skills Passport</Text>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <TouchableOpacity style={s.publicBtn}>
            <Text style={s.publicBtnText}>View public ↗</Text>
          </TouchableOpacity>
          <TouchableOpacity style={s.cvBtn} onPress={() => Linking.openURL(CV_URL)}>
            <Ionicons name="download-outline" size={13} color={colors.navy} />
            <Text style={s.cvBtnText}>Download CV</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Profile card */}
      <View style={s.profileCard}>
        <View style={s.profileLeft}>
          <View style={s.avatar}>
            <Text style={s.avatarText}>{initials}</Text>
          </View>
          <View>
            <View style={s.nameRow}>
              <Text style={s.name}>{MOCK_STUDENT.name}</Text>
              <View style={s.verifiedBadge}>
                <Text style={s.verifiedText}>✓</Text>
              </View>
            </View>
            <Text style={s.degree} numberOfLines={1}>{MOCK_STUDENT.degree}</Text>
            <Text style={s.institution} numberOfLines={1}>{MOCK_STUDENT.institution}</Text>
          </View>
        </View>
        <View style={s.ring}>
          <Text style={s.ringScore}>{score}%</Text>
          <Text style={s.ringLabel}>done</Text>
        </View>
      </View>

      {/* Signals */}
      <View style={s.signals}>
        <Signal icon="cash-outline"     label={MOCK_STUDENT.salaryExpectation} />
        <Signal icon="location-outline" label={MOCK_STUDENT.city} />
        <Signal icon="calendar-outline" label={MOCK_STUDENT.availableFrom} />
      </View>

      {/* Skills */}
      <View style={s.section}>
        <View style={s.sectionRow}>
          <Text style={s.sectionTitle}>Skills</Text>
          <TouchableOpacity style={s.editBtn}>
            <Text style={s.editBtnText}>Edit</Text>
          </TouchableOpacity>
        </View>
        <View style={s.skillsWrap}>
          {MOCK_SKILLS.slice(0, 6).map(skill => (
            <View key={skill.id} style={[s.chip, skill.level === 'VERIFIED' ? s.chipVerified : s.chipLearning]}>
              {skill.level === 'VERIFIED' && <Ionicons name="checkmark" size={11} color={colors.blue} />}
              <Text style={[s.chipText, skill.level === 'VERIFIED' ? s.chipTextVerified : s.chipTextLearning]}>
                {skill.name}
              </Text>
            </View>
          ))}
          <TouchableOpacity style={s.chipAdd}>
            <Text style={s.chipAddText}>+ Add</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Checklist progress */}
      <View style={s.section}>
        <View style={s.sectionRow}>
          <Text style={s.sectionTitle}>Passport progress</Text>
          <Text style={s.progressCount}>{doneCount}/{CHECKLIST.length} steps</Text>
        </View>
        <View style={s.progressBar}>
          <View style={[s.progressFill, { width: `${(doneCount / CHECKLIST.length) * 100}%` as any }]} />
        </View>
        <View style={s.checklist}>
          {CHECKLIST.slice(0, 3).map((item, i) => (
            <View key={i} style={s.checkRow}>
              <View style={[s.checkDot, item.done && s.checkDotDone]}>
                {item.done && <Ionicons name="checkmark" size={10} color="#fff" />}
              </View>
              <Text style={[s.checkLabel, item.done && s.checkLabelDone]} numberOfLines={1}>
                {item.label}
              </Text>
              {!item.done && (
                <TouchableOpacity style={s.checkAction}>
                  <Text style={s.checkActionText}>Add →</Text>
                </TouchableOpacity>
              )}
            </View>
          ))}
        </View>
      </View>

      {/* Assessments */}
      <View style={[s.section, { flex: 1 }]}>
        <View style={s.sectionRow}>
          <Text style={s.sectionTitle}>Assessments</Text>
          <Text style={s.sectionSub}>Verified scores boost your profile</Text>
        </View>
        {MOCK_ASSESSMENTS.slice(0, 2).map(a => (
          <View key={a.id} style={[s.assessRow, a.completed && s.assessRowDone]}>
            <View style={[s.assessIcon, a.completed && s.assessIconDone]}>
              <Ionicons
                name={a.completed ? 'checkmark-circle' : 'ribbon-outline'}
                size={18}
                color={a.completed ? colors.green : colors.blue}
              />
            </View>
            <View style={s.assessInfo}>
              <Text style={s.assessTitle} numberOfLines={1}>{a.title}</Text>
              <Text style={s.assessSub}>{a.completed ? `Score: ${a.score} · Verified` : `~${a.minutes} min`}</Text>
            </View>
            {!a.completed && (
              <TouchableOpacity style={s.assessBtn}>
                <Text style={s.assessBtnText}>Start</Text>
              </TouchableOpacity>
            )}
          </View>
        ))}
      </View>

    </SafeAreaView>
  )
}

function Signal({ icon, label }: { icon: React.ComponentProps<typeof Ionicons>['name']; label: string }) {
  return (
    <View style={sig.wrap}>
      <Ionicons name={icon} size={12} color={colors.text3} />
      <Text style={sig.text} numberOfLines={1}>{label}</Text>
    </View>
  )
}

const sig = StyleSheet.create({
  wrap: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#fff', paddingHorizontal: 10, paddingVertical: 6, borderRadius: radius.sm, borderWidth: 1, borderColor: colors.border },
  text: { fontSize: 11, color: colors.text2, fontWeight: '500' },
})

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },

  header: {
    backgroundColor: colors.navy,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.sm,
    paddingBottom: 24,
  },
  pageTitle: { color: '#fff', fontSize: font.xl, fontWeight: '800' },
  publicBtn: {},
  publicBtnText: { color: 'rgba(255,255,255,0.45)', fontSize: font.sm, fontWeight: '600' },
  cvBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: colors.yellow, borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4 },
  cvBtnText: { color: colors.navy, fontSize: font.sm, fontWeight: '700' },

  profileCard: {
    backgroundColor: '#fff',
    marginHorizontal: spacing.lg,
    marginTop: -14,
    borderRadius: radius.xl,
    padding: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  profileLeft: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  avatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: colors.blue, alignItems: 'center', justifyContent: 'center', shrink: 0 } as any,
  avatarText: { color: '#fff', fontSize: font.lg, fontWeight: '700' },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  name: { fontSize: font.base, fontWeight: '700', color: colors.text1 },
  verifiedBadge: { backgroundColor: colors.greenPale, width: 18, height: 18, borderRadius: 9, alignItems: 'center', justifyContent: 'center' },
  verifiedText: { fontSize: 10, color: colors.green, fontWeight: '700' },
  degree: { fontSize: font.sm, color: colors.text2, marginTop: 1, maxWidth: 160 },
  institution: { fontSize: 11, color: colors.text3, marginTop: 1, maxWidth: 160 },

  ring: {
    width: 52, height: 52, borderRadius: 26,
    borderWidth: 2.5, borderColor: colors.blue,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: `${colors.blue}08`,
  },
  ringScore: { fontSize: font.base, fontWeight: '800', color: colors.blue, lineHeight: 18 },
  ringLabel: { fontSize: 8, color: colors.text3, fontWeight: '600' },

  signals: { flexDirection: 'row', gap: 6, paddingHorizontal: spacing.lg, marginTop: spacing.md, flexWrap: 'wrap' },

  section: { paddingHorizontal: spacing.lg, marginTop: spacing.lg },
  sectionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  sectionTitle: { fontSize: font.base, fontWeight: '700', color: colors.text1 },
  sectionSub: { fontSize: font.sm, color: colors.text3 },
  progressCount: { fontSize: font.sm, color: colors.blue, fontWeight: '600' },

  editBtn: { backgroundColor: colors.bg, paddingHorizontal: 10, paddingVertical: 5, borderRadius: radius.sm, borderWidth: 1, borderColor: colors.border },
  editBtnText: { fontSize: font.sm, color: colors.text2, fontWeight: '600' },

  skillsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 7 },
  chip: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 11, paddingVertical: 6, borderRadius: radius.full },
  chipVerified: { backgroundColor: `${colors.blue}12` },
  chipLearning: { backgroundColor: colors.bg, borderWidth: 1, borderColor: colors.border },
  chipText: { fontSize: font.sm, fontWeight: '600' },
  chipTextVerified: { color: colors.blue },
  chipTextLearning: { color: colors.text2 },
  chipAdd: { paddingHorizontal: 11, paddingVertical: 6, borderRadius: radius.full, borderWidth: 1, borderColor: colors.blue, borderStyle: 'dashed' },
  chipAddText: { fontSize: font.sm, color: colors.blue, fontWeight: '600' },

  progressBar: { height: 6, backgroundColor: colors.border, borderRadius: 3, overflow: 'hidden', marginBottom: 12 },
  progressFill: { height: 6, backgroundColor: colors.blue, borderRadius: 3 },

  checklist: { gap: 10 },
  checkRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  checkDot: { width: 20, height: 20, borderRadius: 10, borderWidth: 1.5, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  checkDotDone: { backgroundColor: colors.green, borderColor: colors.green },
  checkLabel: { flex: 1, fontSize: font.sm, color: colors.text1 },
  checkLabelDone: { color: colors.text3, textDecorationLine: 'line-through' },
  checkAction: { backgroundColor: colors.bluePale, paddingHorizontal: 9, paddingVertical: 4, borderRadius: radius.sm },
  checkActionText: { fontSize: font.sm, color: colors.blue, fontWeight: '700' },

  assessRow: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#fff', borderRadius: radius.lg, padding: 13, marginBottom: 8, borderWidth: 1, borderColor: colors.border },
  assessRowDone: { backgroundColor: '#F0FFF4', borderColor: `${colors.green}30` },
  assessIcon: { width: 36, height: 36, borderRadius: 10, backgroundColor: `${colors.blue}10`, alignItems: 'center', justifyContent: 'center' },
  assessIconDone: { backgroundColor: `${colors.green}10` },
  assessInfo: { flex: 1 },
  assessTitle: { fontSize: font.base, fontWeight: '600', color: colors.text1 },
  assessSub: { fontSize: font.sm, color: colors.text3, marginTop: 2 },
  assessBtn: { backgroundColor: colors.blue, paddingHorizontal: 13, paddingVertical: 7, borderRadius: radius.sm },
  assessBtnText: { color: '#fff', fontSize: font.sm, fontWeight: '700' },
})
