import { Settings as SettingsIcon, Shield, Bell, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export default function AdminSettings() {
  return (
    <>
      <div className="mb-8">
        <h2 className="font-display text-2xl lg:text-3xl font-bold text-foreground mb-2">
          Settings
        </h2>
        <p className="text-muted-foreground">
          Configure system preferences.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* General Settings */}
        <div className="bg-card rounded-2xl p-6 border border-border/50">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <SettingsIcon className="w-5 h-5 text-primary" />
            </div>
            <h3 className="font-display text-lg font-semibold text-foreground">
              General
            </h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Auto-confirm Email</Label>
                <p className="text-xs text-muted-foreground">
                  Skip email verification for new users
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Allow Registrations</Label>
                <p className="text-xs text-muted-foreground">
                  Enable new user signups
                </p>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-card rounded-2xl p-6 border border-border/50">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center">
              <Bell className="w-5 h-5 text-secondary" />
            </div>
            <h3 className="font-display text-lg font-semibold text-foreground">
              Notifications
            </h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Absence Alerts</Label>
                <p className="text-xs text-muted-foreground">
                  Email when student misses 2+ days/week
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>New User Notifications</Label>
                <p className="text-xs text-muted-foreground">
                  Notify when new users register
                </p>
              </div>
              <Switch />
            </div>
          </div>
        </div>

        {/* Security */}
        <div className="bg-card rounded-2xl p-6 border border-border/50">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center">
              <Shield className="w-5 h-5 text-destructive" />
            </div>
            <h3 className="font-display text-lg font-semibold text-foreground">
              Security
            </h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Two-Factor Auth</Label>
                <p className="text-xs text-muted-foreground">
                  Require 2FA for admin accounts
                </p>
              </div>
              <Switch />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Session Timeout</Label>
                <p className="text-xs text-muted-foreground">
                  Auto-logout after 30 minutes
                </p>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
        </div>

        {/* Appearance */}
        <div className="bg-card rounded-2xl p-6 border border-border/50">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
              <Palette className="w-5 h-5 text-accent" />
            </div>
            <h3 className="font-display text-lg font-semibold text-foreground">
              Appearance
            </h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Dark Mode</Label>
                <p className="text-xs text-muted-foreground">
                  Use dark theme
                </p>
              </div>
              <Switch />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Compact View</Label>
                <p className="text-xs text-muted-foreground">
                  Reduce spacing in lists
                </p>
              </div>
              <Switch />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
