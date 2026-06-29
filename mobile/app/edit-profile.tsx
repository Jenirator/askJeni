import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { useState } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { colors, radius, spacing, font } from '@/lib/theme'
import { MOCK_STUDENT } from '@/lib/mock-data'

export default function EditProfileScreen() {
  const router = useRouter()
  const [name, setName] = useState(MOCK_STUDENT.name)
  const [bio, setBio] = useState('Final-year Computer Science student at Wits with a background in full-stack development. I build tools that solve real South African problems — my load shedding tracker has 1 200+ GitHub stars. Looking for a hybrid or remote role from January 2026.')
  const [city, setCity] = useState(MOCK_STUDENT.city)
  const [email, setEmail] = useState('thabo@students.wits.ac.za')
  const [phone, setPhone] = useState('+27 82 345 6789')
  const [salary, setSalary] = useState('R22 000 – R26 000')
  const [available, setAvailable] = useState(MOCK_STUDENT.availableFrom)
  const [saved, setSaved] = useState(false)

  function handleSave() {
    setSaved(true)
    setTimeout(() => router.back(), 900)
  }

  return (
    <SafeAreaView style={s.safe} edges={['top', 'bottom']}>

      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()} style={s.backBtn}>
          <Ionicons name="chevron-back" size={20} color="#fff" />
        </TouchableOpacity>
        <Text style={s.pageTitle}>Edit profile</Text>
        <View style={{ width: 32 }} />
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={s.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >

          {/* Avatar */}
          <View style={s.avatarSection}>
            <View style={s.avatar}>
              <Text style={s.avatarText}>{name.split(' ').map(n => n[0]).join('').slice(0, 2)}</Text>
            </View>
            <TouchableOpacity style={s.changePhotoBtn}>
              <Ionicons name="camera-outline" size={14} color={colors.blue} />
              <Text style={s.changePhotoText}>Change photo</Text>
            </TouchableOpacity>
          </View>

          <View style={s.section}>
            <Text style={s.sectionTitle}>Personal</Text>
            <Field label="Full name" value={name} onChangeText={setName} />
            <Field label="City" value={city} onChangeText={setCity} />
            <Field label="Email address" value={email} onChangeText={setEmail} keyboardType="url" />
            <Field label="Phone number" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
          </View>

          <View style={s.section}>
            <Text style={s.sectionTitle}>About you</Text>
            <Field label="Bio" value={bio} onChangeText={setBio} multiline />
          </View>

          <View style={s.section}>
            <Text style={s.sectionTitle}>Work preferences</Text>
            <Field label="Salary expectation" value={salary} onChangeText={setSalary} />
            <Field label="Available from" value={available} onChangeText={setAvailable} />
          </View>

          <View style={s.section}>
            <Text style={s.sectionTitle}>Links</Text>
            <Field label="GitHub URL" value="https://github.com/thabonkosi" onChangeText={() => {}} keyboardType="url" />
            <Field label="LinkedIn URL" value="https://linkedin.com/in/thabonkosi" onChangeText={() => {}} keyboardType="url" />
          </View>

          {/* Save button inside scroll so it's always reachable */}
          <TouchableOpacity
            style={[s.saveBtn, saved && s.saveBtnDone]}
            onPress={handleSave}
            activeOpacity={0.85}
          >
            {saved ? (
              <>
                <Ionicons name="checkmark-circle" size={18} color="#fff" />
                <Text style={s.saveBtnText}>Saved!</Text>
              </>
            ) : (
              <Text style={s.saveBtnText}>Save changes</Text>
            )}
          </TouchableOpacity>

        </ScrollView>
      </KeyboardAvoidingView>

    </SafeAreaView>
  )
}

function Field({ label, value, onChangeText, multiline, keyboardType }: {
  label: string
  value: string
  onChangeText: (v: string) => void
  multiline?: boolean
  keyboardType?: 'default' | 'phone-pad' | 'url'
}) {
  return (
    <View style={f.wrap}>
      <Text style={f.label}>{label}</Text>
      <TextInput
        style={[f.input, multiline && f.inputMulti]}
        value={value}
        onChangeText={onChangeText}
        multiline={multiline}
        numberOfLines={multiline ? 4 : 1}
        keyboardType={keyboardType ?? 'default'}
        placeholderTextColor={colors.text3}
        autoCorrect={false}
        autoCapitalize="none"
      />
    </View>
  )
}

const f = StyleSheet.create({
  wrap: { marginBottom: 14 },
  label: { fontSize: font.sm, fontWeight: '600', color: colors.text2, marginBottom: 6 },
  input: {
    backgroundColor: colors.bg,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: 14,
    paddingVertical: 11,
    fontSize: font.base,
    color: colors.text1,
  },
  inputMulti: { minHeight: 90, textAlignVertical: 'top', paddingTop: 11 },
})

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },

  header: {
    backgroundColor: colors.navy,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: 16,
    gap: 12,
  },
  backBtn: { padding: 4 },
  pageTitle: { flex: 1, color: '#fff', fontSize: font.md, fontWeight: '700' },

  scrollContent: { padding: spacing.lg, paddingBottom: 32, gap: spacing.md },

  avatarSection: { alignItems: 'center', paddingVertical: 8 },
  avatar: {
    width: 72, height: 72, borderRadius: 36,
    backgroundColor: colors.blue, alignItems: 'center', justifyContent: 'center',
    marginBottom: 10,
  },
  avatarText: { color: '#fff', fontSize: 26, fontWeight: '800' },
  changePhotoBtn: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  changePhotoText: { fontSize: font.sm, color: colors.blue, fontWeight: '600' },

  section: {
    backgroundColor: '#fff',
    borderRadius: radius.xl,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sectionTitle: {
    fontSize: font.sm, fontWeight: '700', color: colors.text3,
    textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 14,
  },

  saveBtn: {
    backgroundColor: colors.blue,
    borderRadius: 24,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  saveBtnDone: { backgroundColor: colors.green },
  saveBtnText: { color: '#fff', fontSize: font.base, fontWeight: '700' },
})
