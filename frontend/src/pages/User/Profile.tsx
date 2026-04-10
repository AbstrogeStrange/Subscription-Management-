import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  UserCircle,
  Key,
  Lock,
  ChatsCircle,
  Bell,
  Keyboard,
  Question,
  SignOut,
  Camera,
} from '@phosphor-icons/react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface ProfileSettings {
  username: string;
  avatarUrl: string;
  privacyBlockedContacts: string;
  chatsTheme: string;
  notificationsEnabled: boolean;
  keyboardShortcutsEnabled: boolean;
  helpEmail: string;
}

const STORAGE_KEY = 'profile_settings_v1';

const defaultSettings: ProfileSettings = {
  username: '',
  avatarUrl: '',
  privacyBlockedContacts: '',
  chatsTheme: 'System',
  notificationsEnabled: true,
  keyboardShortcutsEnabled: true,
  helpEmail: '',
};

const ProfilePage: React.FC = () => {
  const { user, updateUser, logout } = useAuth();
  const navigate = useNavigate();
  const [settings, setSettings] = useState<ProfileSettings>(defaultSettings);
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || '');
  const [saveMessage, setSaveMessage] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as ProfileSettings;
        setSettings({ ...defaultSettings, ...parsed });
      } catch {
        setSettings(defaultSettings);
      }
    }
  }, []);

  useEffect(() => {
    if (!user) return;
    setName(user.name || '');
    setEmail(user.email || '');
    setPhoneNumber(user.phoneNumber || '');
  }, [user]);

  const onChangeSetting = <K extends keyof ProfileSettings>(key: K, value: ProfileSettings[K]) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const onUploadImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        onChangeSetting('avatarUrl', reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const onSave = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));

    if (user) {
      updateUser({
        ...user,
        name: name.trim() || user.name,
        email: email.trim() || user.email,
        phoneNumber: phoneNumber.trim() || user.phoneNumber,
      });
    }

    setSaveMessage('Profile updated successfully');
    window.setTimeout(() => setSaveMessage(''), 2000);
  };

  const onLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold text-foreground">Profile Settings</h1>
        <p className="text-muted-foreground">
          Edit your profile details, account preferences, and notification settings.
        </p>
      </motion.div>

      <div className="rounded-2xl border border-border bg-card p-5">
        <div className="mb-5 flex items-center gap-4">
          <div className="h-24 w-24 overflow-hidden rounded-full border border-border bg-secondary">
            {settings.avatarUrl ? (
              <img src={settings.avatarUrl} alt="Profile" className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-3xl font-bold text-muted-foreground">
                {name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
            )}
          </div>
          <div>
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-border px-3 py-2 text-sm font-medium text-foreground hover:bg-accent">
              <Camera size={16} weight="bold" />
              Upload photo
              <input type="file" accept="image/*" className="hidden" onChange={onUploadImage} />
            </label>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm text-muted-foreground">Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-border bg-background px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm text-muted-foreground">Username</label>
            <input
              value={settings.username}
              onChange={(e) => onChangeSetting('username', e.target.value)}
              placeholder="@username"
              className="w-full rounded-xl border border-border bg-background px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm text-muted-foreground">Email</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-border bg-background px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm text-muted-foreground">Phone</label>
            <input
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full rounded-xl border border-border bg-background px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <section className="rounded-2xl border border-border bg-card p-4">
          <div className="mb-3 flex items-center gap-2">
            <UserCircle size={18} weight="bold" />
            <h2 className="font-semibold text-foreground">Profile</h2>
          </div>
          <p className="text-sm text-muted-foreground">Name, profile photo, username</p>
        </section>

        <section className="rounded-2xl border border-border bg-card p-4">
          <div className="mb-3 flex items-center gap-2">
            <Key size={18} weight="bold" />
            <h2 className="font-semibold text-foreground">Account</h2>
          </div>
          <p className="text-sm text-muted-foreground">Security notifications, account info</p>
        </section>

        <section className="rounded-2xl border border-border bg-card p-4">
          <div className="mb-3 flex items-center gap-2">
            <Lock size={18} weight="bold" />
            <h2 className="font-semibold text-foreground">Privacy</h2>
          </div>
          <input
            value={settings.privacyBlockedContacts}
            onChange={(e) => onChangeSetting('privacyBlockedContacts', e.target.value)}
            placeholder="Blocked contacts (comma separated)"
            className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
        </section>

        <section className="rounded-2xl border border-border bg-card p-4">
          <div className="mb-3 flex items-center gap-2">
            <ChatsCircle size={18} weight="bold" />
            <h2 className="font-semibold text-foreground">Chats</h2>
          </div>
          <select
            value={settings.chatsTheme}
            onChange={(e) => onChangeSetting('chatsTheme', e.target.value)}
            className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
          >
            <option>System</option>
            <option>Light</option>
            <option>Dark</option>
          </select>
        </section>

        <section className="rounded-2xl border border-border bg-card p-4">
          <div className="mb-3 flex items-center gap-2">
            <Bell size={18} weight="bold" />
            <h2 className="font-semibold text-foreground">Notifications</h2>
          </div>
          <label className="inline-flex items-center gap-2 text-sm text-foreground">
            <input
              type="checkbox"
              checked={settings.notificationsEnabled}
              onChange={(e) => onChangeSetting('notificationsEnabled', e.target.checked)}
            />
            Messages, groups, sounds
          </label>
        </section>

        <section className="rounded-2xl border border-border bg-card p-4">
          <div className="mb-3 flex items-center gap-2">
            <Keyboard size={18} weight="bold" />
            <h2 className="font-semibold text-foreground">Keyboard shortcuts</h2>
          </div>
          <label className="inline-flex items-center gap-2 text-sm text-foreground">
            <input
              type="checkbox"
              checked={settings.keyboardShortcutsEnabled}
              onChange={(e) => onChangeSetting('keyboardShortcutsEnabled', e.target.checked)}
            />
            Enable quick actions
          </label>
        </section>
      </div>

      <div className="rounded-2xl border border-border bg-card p-4">
        <div className="mb-3 flex items-center gap-2">
          <Question size={18} weight="bold" />
          <h2 className="font-semibold text-foreground">Help and feedback</h2>
        </div>
        <input
          value={settings.helpEmail}
          onChange={(e) => onChangeSetting('helpEmail', e.target.value)}
          placeholder="Help email"
          className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
        />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={onSave}
          className="rounded-xl bg-primary px-4 py-2.5 font-semibold text-primary-foreground transition hover:opacity-90"
        >
          Save Changes
        </button>
        <button
          onClick={onLogout}
          className="inline-flex items-center gap-2 rounded-xl border border-red-500/40 px-4 py-2.5 font-semibold text-red-500 transition hover:bg-red-500/10"
        >
          <SignOut size={16} weight="bold" />
          Log out
        </button>
        {saveMessage ? <p className="text-sm text-green-600">{saveMessage}</p> : null}
      </div>
    </div>
  );
};

export default ProfilePage;
