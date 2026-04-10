import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Gear,
  UserCircle,
  ShieldCheck,
  CreditCard,
  Bell,
  TextAa,
  SquaresFour,
  Palette,
  UsersThree,
  PlugsConnected,
  UploadSimple,
  PaperPlaneTilt,
} from '@phosphor-icons/react';

type SettingsSection =
  | 'General'
  | 'Account'
  | 'Security'
  | 'Billing'
  | 'Notifications'
  | 'Typefaces'
  | 'Apps'
  | 'Branding'
  | 'Team'
  | 'Integrations';

interface SettingsState {
  companyLogo: string;
  companyName: string;
  email: string;
  emailVerified: boolean;
  profileBio: string;
  xHandle: string;
  website: string;
}

const STORAGE_KEY = 'settings_page_v1';
const initialState: SettingsState = {
  companyLogo: '',
  companyName: 'Good Days Studio',
  email: 'ina@gooddays.studio',
  emailVerified: false,
  profileBio:
    'Good Days Studio is a design studio focused on creating thoughtful digital products, brands, and experiences.',
  xHandle: 'gooddays',
  website: 'https://gooddays.studio',
};

const sectionItems: { label: SettingsSection; icon: React.ReactNode }[] = [
  { label: 'General', icon: <Gear size={16} weight="bold" /> },
  { label: 'Account', icon: <UserCircle size={16} weight="bold" /> },
  { label: 'Security', icon: <ShieldCheck size={16} weight="bold" /> },
  { label: 'Billing', icon: <CreditCard size={16} weight="bold" /> },
  { label: 'Notifications', icon: <Bell size={16} weight="bold" /> },
  { label: 'Typefaces', icon: <TextAa size={16} weight="bold" /> },
  { label: 'Apps', icon: <SquaresFour size={16} weight="bold" /> },
  { label: 'Branding', icon: <Palette size={16} weight="bold" /> },
  { label: 'Team', icon: <UsersThree size={16} weight="bold" /> },
  { label: 'Integrations', icon: <PlugsConnected size={16} weight="bold" /> },
];

const SettingsPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState<SettingsSection>('Account');
  const [state, setState] = useState<SettingsState>(initialState);
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [saveMessage, setSaveMessage] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setState({ ...initialState, ...(JSON.parse(stored) as SettingsState) });
      } catch {
        setState(initialState);
      }
    }
  }, []);

  const remainingCharacters = useMemo(() => Math.max(0, 240 - state.profileBio.length), [state.profileBio]);

  const onUploadLogo = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setState((prev) => ({ ...prev, companyLogo: reader.result }));
      }
    };
    reader.readAsDataURL(file);
  };

  const onChange = <K extends keyof SettingsState>(key: K, value: SettingsState[K]) => {
    setState((prev) => ({ ...prev, [key]: value }));
  };

  const onSave = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    setSaveMessage('Settings saved');
    window.setTimeout(() => setSaveMessage(''), 1800);
  };

  const onVerifyEmail = () => {
    if (code.every((digit) => digit.trim().length === 1)) {
      onChange('emailVerified', true);
      setSaveMessage('Email verified');
      window.setTimeout(() => setSaveMessage(''), 1800);
    } else {
      setSaveMessage('Enter full 6-digit code');
      window.setTimeout(() => setSaveMessage(''), 1800);
    }
  };

  return (
    <div className="mx-auto max-w-6xl rounded-3xl border border-border bg-card p-4 md:p-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-[220px_1fr]">
        <aside className="rounded-2xl border border-border bg-background p-3">
          <p className="mb-3 px-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Settings</p>
          <div className="space-y-1">
            {sectionItems.map((item) => (
              <button
                key={item.label}
                onClick={() => setActiveSection(item.label)}
                className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-sm transition ${
                  activeSection === item.label
                    ? 'bg-primary/15 text-primary'
                    : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </div>
        </aside>

        <motion.section
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-border bg-background p-4 md:p-6"
        >
          <h1 className="text-2xl font-bold text-foreground">{activeSection}</h1>
          <p className="mb-6 text-sm text-muted-foreground">
            {activeSection === 'Account'
              ? 'Manage your public company profile and billing details.'
              : `Configure your ${activeSection.toLowerCase()} preferences.`}
          </p>

          {activeSection === 'Account' ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-3 md:grid-cols-[160px_1fr] md:items-center">
                <label className="text-sm font-medium text-foreground">Company logo</label>
                <div className="flex items-center gap-4">
                  <div className="h-14 w-14 overflow-hidden rounded-xl border border-border bg-secondary">
                    {state.companyLogo ? (
                      <img src={state.companyLogo} alt="Company logo" className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
                        Logo
                      </div>
                    )}
                  </div>
                  <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm hover:bg-accent">
                    <UploadSimple size={16} />
                    Upload
                    <input type="file" accept="image/*" className="hidden" onChange={onUploadLogo} />
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 md:grid-cols-[160px_1fr] md:items-center">
                <label className="text-sm font-medium text-foreground">Company name</label>
                <input
                  value={state.companyName}
                  onChange={(e) => onChange('companyName', e.target.value)}
                  className="w-full rounded-lg border border-border bg-card px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>

              <div className="grid grid-cols-1 gap-3 md:grid-cols-[160px_1fr] md:items-center">
                <label className="text-sm font-medium text-foreground">Email address</label>
                <input
                  value={state.email}
                  onChange={(e) => {
                    onChange('email', e.target.value);
                    onChange('emailVerified', false);
                  }}
                  className="w-full rounded-lg border border-border bg-card px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>

              <div className="rounded-xl border border-border p-4">
                <div className="mb-3 flex items-center gap-2 text-sm font-medium text-foreground">
                  <PaperPlaneTilt size={16} />
                  Please verify your email
                </div>
                <p className="mb-3 text-xs text-muted-foreground">
                  Enter a 6-digit code sent to your email address.
                </p>
                <div className="mb-3 flex flex-wrap gap-2">
                  {code.map((digit, index) => (
                    <input
                      key={index}
                      value={digit}
                      onChange={(e) => {
                        const next = [...code];
                        next[index] = e.target.value.replace(/\D/g, '').slice(0, 1);
                        setCode(next);
                      }}
                      className="h-10 w-10 rounded-md border border-border bg-card text-center text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                  ))}
                  <button
                    onClick={onVerifyEmail}
                    className="rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground"
                  >
                    Verify email
                  </button>
                </div>
                <p className={`text-xs ${state.emailVerified ? 'text-green-600' : 'text-muted-foreground'}`}>
                  {state.emailVerified ? 'Email verified' : "Didn't get the email?"}
                </p>
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="text-sm font-medium text-foreground">Profile bio</label>
                  <span className="text-xs text-muted-foreground">{remainingCharacters} characters left</span>
                </div>
                <textarea
                  value={state.profileBio}
                  onChange={(e) => onChange('profileBio', e.target.value.slice(0, 240))}
                  rows={6}
                  className="w-full rounded-lg border border-border bg-card px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>

              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-foreground">x.com</label>
                  <input
                    value={state.xHandle}
                    onChange={(e) => onChange('xHandle', e.target.value)}
                    className="w-full rounded-lg border border-border bg-card px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-foreground">Website</label>
                  <input
                    value={state.website}
                    onChange={(e) => onChange('website', e.target.value)}
                    className="w-full rounded-lg border border-border bg-card px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-border bg-card p-4 text-sm text-muted-foreground">
              {activeSection} panel is ready. You can add deeper controls here next.
            </div>
          )}

          <div className="mt-6 flex items-center gap-3">
            <button
              onClick={onSave}
              className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
            >
              Save Changes
            </button>
            {saveMessage ? <span className="text-sm text-green-600">{saveMessage}</span> : null}
          </div>
        </motion.section>
      </div>
    </div>
  );
};

export default SettingsPage;

