import { Settings as SettingsIcon, User, Bell, Shield, Database } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

export default function Settings() {
  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your application preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-4">
          <Card className="p-4 cursor-pointer hover:bg-muted/50 transition-colors border-primary">
            <div className="flex items-center gap-3">
              <User className="h-5 w-5 text-primary" />
              <span className="font-medium">Profile</span>
            </div>
          </Card>
          <Card className="p-4 cursor-pointer hover:bg-muted/50 transition-colors">
            <div className="flex items-center gap-3">
              <Bell className="h-5 w-5" />
              <span className="font-medium">Notifications</span>
            </div>
          </Card>
          <Card className="p-4 cursor-pointer hover:bg-muted/50 transition-colors">
            <div className="flex items-center gap-3">
              <Shield className="h-5 w-5" />
              <span className="font-medium">Security</span>
            </div>
          </Card>
          <Card className="p-4 cursor-pointer hover:bg-muted/50 transition-colors">
            <div className="flex items-center gap-3">
              <Database className="h-5 w-5" />
              <span className="font-medium">Data Management</span>
            </div>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-6">Profile Settings</h2>
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" defaultValue="Admin User" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" defaultValue="admin@fluidcontrols.com" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Input id="department" defaultValue="IT Administration" />
              </div>

              <div className="space-y-4 pt-4 border-t">
                <h3 className="font-medium">Notification Preferences</h3>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Email Notifications</p>
                    <p className="text-sm text-muted-foreground">Receive email updates about asset changes</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Request Alerts</p>
                    <p className="text-sm text-muted-foreground">Get notified about new asset requests</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Maintenance Reminders</p>
                    <p className="text-sm text-muted-foreground">Reminders for upcoming maintenance tasks</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button className="bg-gradient-primary">Save Changes</Button>
                <Button variant="outline">Cancel</Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
