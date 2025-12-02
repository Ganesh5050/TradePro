import { useState } from 'react';
import { motion } from 'framer-motion';
// import { useAuthStore } from '@/stores/useAuthStore'; // Temporarily disabled
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Bell, Shield, Palette } from 'lucide-react';

const Settings = () => {
  // Mock user to replace useAuthStore while it's broken
  const user = { id: 'demo-user', email: 'demo@example.com', name: 'Demo User' };
  // const { user } = useAuthStore(); // Temporarily disabled
  const { toast } = useToast();
  
  const [profile, setProfile] = useState({
    name: user?.name || '',
    email: user?.email || '',
    bio: '',
    phone: '',
  });

  const [notifications, setNotifications] = useState({
    priceAlerts: true,
    newsUpdates: true,
    portfolioUpdates: true,
    patternAlerts: false,
    weeklyReports: true,
  });

  const [preferences, setPreferences] = useState({
    defaultChartType: 'candlestick',
    autoRefresh: true,
    soundEffects: false,
    compactView: false,
  });

  const handleSaveProfile = () => {
    toast({
      title: "Profile updated",
      description: "Your profile information has been saved successfully.",
    });
  };

  const handleSaveNotifications = () => {
    toast({
      title: "Notification preferences updated",
      description: "Your notification settings have been saved.",
    });
  };

  const handleSavePreferences = () => {
    toast({
      title: "Preferences updated",
      description: "Your app preferences have been saved.",
    });
  };

  return (
    <div className="min-h-screen pt-20 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            <span className="text-gradient-primary">Settings</span>
          </h1>
          <p className="text-muted-foreground">Manage your account and preferences</p>
        </motion.div>

        {/* Settings Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-8">
              <TabsTrigger value="profile" className="flex items-center space-x-2">
                <User className="w-4 h-4" />
                <span className="hidden sm:inline">Profile</span>
              </TabsTrigger>
              <TabsTrigger value="notifications" className="flex items-center space-x-2">
                <Bell className="w-4 h-4" />
                <span className="hidden sm:inline">Notifications</span>
              </TabsTrigger>
              <TabsTrigger value="preferences" className="flex items-center space-x-2">
                <Palette className="w-4 h-4" />
                <span className="hidden sm:inline">Preferences</span>
              </TabsTrigger>
              <TabsTrigger value="security" className="flex items-center space-x-2">
                <Shield className="w-4 h-4" />
                <span className="hidden sm:inline">Security</span>
              </TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile" className="space-y-6">
              <div className="trading-card">
                <h3 className="text-xl font-semibold mb-6">Profile Information</h3>
                
                <div className="flex items-center space-x-6 mb-8">
                  <Avatar className="w-20 h-20">
                    <AvatarImage src={user?.avatar} />
                    <AvatarFallback className="text-xl">
                      {user?.name?.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <Button variant="outline" size="sm">
                      Change Avatar
                    </Button>
                    <p className="text-sm text-muted-foreground mt-2">
                      Upload a new profile picture
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={profile.name}
                      onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                      className="glass-card"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                      className="glass-card"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={profile.phone}
                      onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                      placeholder="Enter your phone number"
                      className="glass-card"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Input
                      id="bio"
                      value={profile.bio}
                      onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                      placeholder="Tell us about yourself"
                      className="glass-card"
                    />
                  </div>
                </div>

                <div className="flex justify-end mt-6">
                  <Button onClick={handleSaveProfile}>
                    Save Changes
                  </Button>
                </div>
              </div>
            </TabsContent>

            {/* Notifications Tab */}
            <TabsContent value="notifications" className="space-y-6">
              <div className="trading-card">
                <h3 className="text-xl font-semibold mb-6">Notification Preferences</h3>
                
                <div className="space-y-6">
                  {[
                    { key: 'priceAlerts', label: 'Price Alerts', description: 'Get notified when stocks hit your target prices' },
                    { key: 'newsUpdates', label: 'News Updates', description: 'Receive latest market news and updates' },
                    { key: 'portfolioUpdates', label: 'Portfolio Updates', description: 'Daily summary of your portfolio performance' },
                    { key: 'patternAlerts', label: 'Pattern Alerts', description: 'Notifications for detected chart patterns' },
                    { key: 'weeklyReports', label: 'Weekly Reports', description: 'Weekly performance and market analysis reports' },
                  ].map((item) => (
                    <div key={item.key} className="flex items-center justify-between py-4 border-b border-border/50 last:border-0">
                      <div>
                        <p className="font-medium">{item.label}</p>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      </div>
                      <Switch
                        checked={notifications[item.key as keyof typeof notifications]}
                        onCheckedChange={(checked) => 
                          setNotifications({ ...notifications, [item.key]: checked })
                        }
                      />
                    </div>
                  ))}
                </div>

                <div className="flex justify-end mt-6">
                  <Button onClick={handleSaveNotifications}>
                    Save Preferences
                  </Button>
                </div>
              </div>
            </TabsContent>

            {/* Preferences Tab */}
            <TabsContent value="preferences" className="space-y-6">
              <div className="trading-card">
                <h3 className="text-xl font-semibold mb-6">App Preferences</h3>
                
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="chartType">Default Chart Type</Label>
                    <select
                      id="chartType"
                      value={preferences.defaultChartType}
                      onChange={(e) => setPreferences({ ...preferences, defaultChartType: e.target.value })}
                      className="w-full bg-transparent border border-border rounded-lg px-3 py-2 glass-card"
                    >
                      <option value="candlestick">Candlestick</option>
                      <option value="line">Line Chart</option>
                      <option value="area">Area Chart</option>
                    </select>
                  </div>

                  {[
                    { key: 'autoRefresh', label: 'Auto Refresh Data', description: 'Automatically refresh stock prices' },
                    { key: 'soundEffects', label: 'Sound Effects', description: 'Play sounds for notifications and alerts' },
                    { key: 'compactView', label: 'Compact View', description: 'Show more information in less space' },
                  ].map((item) => (
                    <div key={item.key} className="flex items-center justify-between py-4 border-b border-border/50 last:border-0">
                      <div>
                        <p className="font-medium">{item.label}</p>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      </div>
                      <Switch
                        checked={preferences[item.key as keyof typeof preferences] as boolean}
                        onCheckedChange={(checked) => 
                          setPreferences({ ...preferences, [item.key]: checked })
                        }
                      />
                    </div>
                  ))}
                </div>

                <div className="flex justify-end mt-6">
                  <Button onClick={handleSavePreferences}>
                    Save Preferences
                  </Button>
                </div>
              </div>
            </TabsContent>

            {/* Security Tab */}
            <TabsContent value="security" className="space-y-6">
              <div className="trading-card">
                <h3 className="text-xl font-semibold mb-6">Security Settings</h3>
                
                <div className="space-y-6">
                  <div>
                    <h4 className="font-medium mb-4">Change Password</h4>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="currentPassword">Current Password</Label>
                        <Input
                          id="currentPassword"
                          type="password"
                          placeholder="Enter current password"
                          className="glass-card"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="newPassword">New Password</Label>
                        <Input
                          id="newPassword"
                          type="password"
                          placeholder="Enter new password"
                          className="glass-card"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm Password</Label>
                        <Input
                          id="confirmPassword"
                          type="password"
                          placeholder="Confirm new password"
                          className="glass-card"
                        />
                      </div>
                      <Button>Update Password</Button>
                    </div>
                  </div>

                  <hr className="border-border/50" />

                  <div>
                    <h4 className="font-medium mb-4">Two-Factor Authentication</h4>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Add an extra layer of security to your account
                        </p>
                      </div>
                      <Button variant="outline">Enable 2FA</Button>
                    </div>
                  </div>

                  <hr className="border-border/50" />

                  <div>
                    <h4 className="font-medium mb-4 text-danger">Danger Zone</h4>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Delete Account</p>
                          <p className="text-sm text-muted-foreground">
                            Permanently delete your account and all associated data
                          </p>
                        </div>
                        <Button variant="destructive">Delete Account</Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
};

export default Settings;