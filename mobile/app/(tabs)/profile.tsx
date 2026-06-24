import { View, Text, TouchableOpacity, StyleSheet, Switch } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useState } from 'react'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { colors, radius, spacing, font } from '@/lib/theme'
import { MOCK_STUDENT, MOCK_SKILLS } from '@/lib/mock-data'

const initials = MOCK_STUDENT.name.split(' ').map(n => n[0]).join('')
const verified = MOCK_SKILLS.filter(s => s.level === 'VERIFIED').length

export default function ProfileScreen() {
  const router = useRouter()
  const [openToWork, setOpenToWork] = useState(true)

  return (
    <SafeAreaView style={s.safe} edges={['top']}>

      {/* Header */}
      <View style={s.header}>
        <Text style={s.pageTitle}>Profile</Text>
      </View>

      {/* Hero */}
      <View style={s.heroCard}>
        <View style={s.avatar}>
          <Text style={s.avatarText}>{initials}</Text>
        </View>
        <View style={s.heroInfo}>
          <Text style={s.heroName}>{MOCK_STUDENT.name}</Text>
          <Text style={s.heroDegree} numberOfLines={1}>{MOCK_STUDENT.degree}</Text>
          <Text style={s.heroInstitution} numberOfLines={1}>{MOCK_STUDENT.institution}</Text>
        </View>
        <View style={s.statsCol}>
          <Text style={s.statNum}>{MOCK_STUDENT.passportCompletion}%</Text>
          <Text style={s.statLabel}>Passport</Text>
        </View>
      </View>

      {/* Open to work */}
      <View style={s.toggleCard}>
        <View style={s.toggleLeft}>
          <View style={[s.toggleDot, openToWork && s.toggleDotActive]} />
          <View>
            <Text style={s.toggleLabel}>Open to opportunities</Text>
            <Text style={s.toggleSub}>
              {openToWork ? 'Employers can discover you' : 'Profile hidden from employers'}
            </Text>
          </View>
        </View>
        <Switch
          value={openToWork}
          onValueChange={setOpenToWork}
          trackColor={{ false: colors.border, true: colors.blue }}
          thumbColor="#fff"
        />
      </View>

      {/* Menu */}
      <View style={s.menu}>
        <MenuItem icon="person-outline"          label="Edit profile"          />
        <MenuItem icon="shield-checkmark-outline" label="Skills & assessments"  />
        <MenuItem icon="videocam-outline"         label="Video intro"           tag="New" />
        <MenuItem icon="briefcase-outline"        label="Saved roles"           value={`0 saved`} />
        <MenuItem icon="notifications-outline"   label="Notifications"         onPress={() => router.push('/notifications')} />
        <MenuItem icon="share-outline"           label="Share profile"         />
      </View>

      {/* Sign out */}
      <View style={s.footer}>
        <TouchableOpacity style={s.signOutBtn}>
          <Ionicons name="log-out-outline" size={16} color="#DC2626" />
          <Text style={s.signOutText}>Sign out</Text>
        </TouchableOpacity>
        <Text style={s.versionText}>askJeni · Demo mode</Text>
      </View>

    </SafeAreaView>
  )
}

function MenuItem({ icon, label, value, tag, onPress }: {
  icon: React.ComponentProps<typeof Ionicons>['name']
  label: string
  value?: string
  tag?: string
  onPress?: () => void
}) {
  return (
    <TouchableOpacity style={m.item} activeOpacity={0.7} onPress={onPress}>
      <View style={m.iconWrap}>
        <Ionicons name={icon} size={17} color={colors.text2} />
      </View>
      <Text style={m.label}>{label}</Text>
      {tag && <View style={m.tag}><Text style={m.tagText}>{tag}</Text></View>}
      {value && <Text style={m.value}>{value}</Text>}
      <Ionicons name="chevron-forward" size={15} color={colors.text3} />
    </TouchableOpacity>
  )
}

const m = StyleSheet.create({
  item: { flexDirection: 'row', alignItems: 'center', paddingVertical: 13, gap: 12, borderBottomWidth: 1, borderBottomColor: colors.border },
  iconWrap: { width: 32, height: 32, borderRadius: 8, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center' },
  label: { flex: 1, fontSize: font.base, color: colors.text1, fontWeight: '500' },
  value: { fontSize: font.sm, color: colors.text3, fontWeight: '500' },
  tag: { backgroundColor: colors.blue, borderRadius: 4, paddingHorizontal: 6, paddingVertical: 2 },
  tagText: { color: '#fff', fontSize: 10, fontWeight: '700' },
})

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },

  header: {
    backgroundColor: colors.navy,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.sm,
    paddingBottom: 24,
  },
  pageTitle: { color: '#fff', fontSize: font.xl, fontWeight: '800' },

  heroCard: {
    backgroundColor: '#fff',
    marginHorizontal: spacing.lg,
    marginTop: -14,
    borderRadius: radius.xl,
    padding: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  avatar: { width: 52, height: 52, borderRadius: 26, backgroundColor: colors.blue, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#fff', fontSize: font.xl, fontWeight: '700' },
  heroInfo: { flex: 1 },
  heroName: { fontSize: font.md, fontWeight: '700', color: colors.text1 },
  heroDegree: { fontSize: font.sm, color: colors.text2, marginTop: 2 },
  heroInstitution: { fontSize: 11, color: colors.text3, marginTop: 1 },
  statsCol: { alignItems: 'center' },
  statNum: { fontSize: font.xl, fontWeight: '800', color: colors.navy },
  statLabel: { fontSize: 10, color: colors.text3, fontWeight: '500', marginTop: 1 },

  toggleCard: {
    backgroundColor: '#fff',
    marginHorizontal: spacing.lg,
    marginTop: spacing.md,
    borderRadius: radius.lg,
    padding: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: colors.border,
  },
  toggleLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  toggleDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.text3 },
  toggleDotActive: { backgroundColor: colors.green },
  toggleLabel: { fontSize: font.base, fontWeight: '600', color: colors.text1 },
  toggleSub: { fontSize: font.sm, color: colors.text3, marginTop: 1 },

  menu: { paddingHorizontal: spacing.lg, marginTop: spacing.lg, flex: 1 },

  footer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  signOutBtn: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  signOutText: { fontSize: font.base, color: '#DC2626', fontWeight: '600' },
  versionText: { fontSize: 11, color: colors.text3 },
})
