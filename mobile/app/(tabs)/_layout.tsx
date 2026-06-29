import { Tabs } from 'expo-router'
import { StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { colors } from '@/lib/theme'

type IoniconName = React.ComponentProps<typeof Ionicons>['name']

const TAB_ICONS: Record<string, { active: IoniconName; inactive: IoniconName }> = {
  index:         { active: 'chatbubbles',        inactive: 'chatbubbles-outline' },
  passport:      { active: 'shield-checkmark',   inactive: 'shield-checkmark-outline' },
  opportunities: { active: 'briefcase',          inactive: 'briefcase-outline' },
  profile:       { active: 'person-circle',      inactive: 'person-circle-outline' },
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: colors.blue,
        tabBarInactiveTintColor: colors.text3,
        tabBarLabelStyle: styles.label,
        tabBarItemStyle: styles.item,
        tabBarIcon: ({ focused, color }) => {
          const map = TAB_ICONS[route.name]
          const name = map ? (focused ? map.active : map.inactive) : 'ellipse-outline'
          return <Ionicons name={name} size={22} color={color} />
        },
      })}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Inbox',
          tabBarBadge: 3,
          tabBarBadgeStyle: { backgroundColor: colors.blue, fontSize: 10 },
        }}
      />
      <Tabs.Screen name="passport"      options={{ title: 'Passport' }} />
      <Tabs.Screen name="opportunities" options={{ title: 'Matches' }} />
      <Tabs.Screen name="profile"       options={{ title: 'Profile' }} />
    </Tabs>
  )
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#fff',
    borderTopColor: '#E5E7EB',
    borderTopWidth: 1,
    height: 72,
    paddingBottom: 12,
    paddingTop: 8,
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },
  item: {
    paddingTop: 4,
  },
})
