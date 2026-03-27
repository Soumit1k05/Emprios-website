import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, Mail, Shield, LogOut, Phone, Building2,
  FileText, Calendar, Clock, CheckCircle2, Pencil, X, Save, Loader2,
  Sparkles, ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';


const DetailRow = ({ icon: Icon, label, value }) => (
  <div className="flex items-start gap-4 py-4 border-b border-white/10 last:border-0">
    <div className="w-9 h-9 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0 mt-0.5">
      <Icon size={16} className="text-blue-400" />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-[9px] font-black uppercase tracking-widest opacity-40 mb-0.5">{label}</p>
      <p className="text-sm font-bold truncate">{value || <span className="opacity-30 italic">Not provided</span>}</p>
    </div>
  </div>
);

const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  });
};

const formatDateTime = (dateStr) => {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
};

export default function AccountPage({ onLogout }) {
  const { user, login, logout } = useAuth();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');
  const [saveType, setSaveType] = useState('success');
  const [form, setForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    company: user?.company || '',
    bio: user?.bio || '',
    profilePic: user?.profilePic || '',
  });

  // Fetch latest profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.token) return;
      try {
        const res = await fetch('http://localhost:5000/api/auth/profile', {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        if (res.ok) {
          const data = await res.json();
          login({ ...data, token: user.token }); // update context
          setForm({
            name: data.name || '',
            phone: data.phone || '',
            company: data.company || '',
            bio: data.bio || '',
            profilePic: data.profilePic || '',
          });
        }
      } catch (err) {
        console.error('Failed to fetch profile:', err);
      }
    };
    fetchProfile();
  }, []);

  const handleLogout = () => { logout(); onLogout(); };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSave = async () => {
    setSaving(true);
    setSaveMsg('');
    setSaveType('success');
    try {
      const res = await fetch('http://localhost:5000/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        login(data); // update context + localStorage with new data
        setEditing(false);
        setSaveMsg('Profile updated successfully.');
        setTimeout(() => setSaveMsg(''), 3000);
      } else {
        setSaveType('error');
        setSaveMsg(data.message || 'Update failed.');
      }
    } catch {
      setSaveType('error');
      setSaveMsg('Server error. Try again.');
    } finally {
      setSaving(false);
    }
  };


  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-2xl mx-auto space-y-5 pb-10"
    >
      {/* ── Profile Hero Card ── */}
      <div className="glass-pod p-8 flex flex-col sm:flex-row items-center sm:items-start gap-6">
        {/* Avatar */}
        <div className="relative shrink-0 group cursor-pointer" onClick={() => editing && document.getElementById('avatar-input').click()}>
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-700 overflow-hidden text-white text-4xl font-black shadow-xl shadow-blue-500/30 flex items-center justify-center relative">
            {user?.profilePic ? (
              <img src={user.profilePic} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              user?.name?.charAt(0).toUpperCase()
            )}
            
            {editing && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Pencil size={20} className="text-white" />
              </div>
            )}
          </div>
          {user?.isActive && (
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white/20" title="Active" />
          )}
          <input 
            id="avatar-input"
            type="file" 
            className="hidden" 
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) {
                const reader = new FileReader();
                reader.onloadend = () => {
                  setForm({ ...form, profilePic: reader.result });
                };
                reader.readAsDataURL(file);
              }
            }}
          />
        </div>

        {/* Name + meta */}
        <div className="flex-1 text-center sm:text-left space-y-2">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <h2 className="text-2xl font-black uppercase tracking-tighter">{user?.name}</h2>
            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest w-fit mx-auto sm:mx-0 ${
              user?.role === 'admin'
                ? 'bg-purple-500/15 text-purple-400 border border-purple-500/20'
                : 'bg-blue-500/15 text-blue-400 border border-blue-500/20'
            }`}>
              <Shield size={10} /> {user?.role}
            </span>
            {user?.isActive && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest bg-green-500/10 text-green-400 border border-green-500/20 w-fit mx-auto sm:mx-0">
                <CheckCircle2 size={10} /> Active
              </span>
            )}
          </div>
          <p className="text-sm opacity-60 font-medium">{user?.email}</p>
          {user?.company && (
            <p className="text-xs font-bold opacity-50 flex items-center gap-1 justify-center sm:justify-start">
              <Building2 size={12} /> {user.company}
            </p>
          )}
          {user?.bio && (
            <p className="text-xs opacity-60 font-medium max-w-sm leading-relaxed">{user.bio}</p>
          )}
        </div>

        {/* Edit button */}
        <button
          onClick={() => { setEditing(!editing); setSaveMsg(''); setForm({ ...form, profilePic: user?.profilePic || '' }); }}
          className="shrink-0 w-10 h-10 rounded-2xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all"
          title={editing ? 'Cancel' : 'Edit Profile'}
        >
          {editing ? <X size={16} /> : <Pencil size={16} />}
        </button>
      </div>


      {/* ── Save message ── */}
      <AnimatePresence>
        {saveMsg && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className={`px-5 py-3 rounded-2xl border text-xs font-bold ${
              saveType === 'success' 
                ? 'bg-green-500/10 text-green-400 border-green-500/20' 
                : 'bg-red-500/10 text-red-400 border-red-500/20'
            }`}
          >
            {saveMsg}
          </motion.div>

        )}
      </AnimatePresence>

      {/* ── Edit Form ── */}
      <AnimatePresence>
        {editing && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="glass-pod p-8 space-y-5 overflow-hidden"
          >
            <h3 className="text-[10px] font-black uppercase tracking-widest opacity-50">Edit Profile</h3>

            {[
              { name: 'name', label: 'Full Name', type: 'text', placeholder: 'John Doe' },
              { name: 'phone', label: 'Phone Number', type: 'tel', placeholder: '+1 234 567 8900' },
              { name: 'company', label: 'Company / Organisation', type: 'text', placeholder: 'Acme Corp' },
            ].map(({ name, label, type, placeholder }) => (
              <div key={name} className="space-y-1.5">
                <label className="text-[9px] font-black uppercase tracking-widest opacity-50">{label}</label>
                <input
                  type={type}
                  name={name}
                  value={form[name]}
                  onChange={handleChange}
                  placeholder={placeholder}
                  className="w-full bg-white/10 border border-white/20 rounded-2xl py-3 px-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all placeholder:opacity-30"
                />
              </div>
            ))}

            <div className="space-y-1.5">
              <label className="text-[9px] font-black uppercase tracking-widest opacity-50">Bio</label>
              <textarea
                name="bio"
                value={form.bio}
                onChange={handleChange}
                placeholder="Tell us a little about yourself..."
                rows={3}
                maxLength={300}
                className="w-full bg-white/10 border border-white/20 rounded-2xl py-3 px-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all placeholder:opacity-30 resize-none"
              />
              <p className="text-[9px] opacity-30 text-right">{form.bio.length}/300</p>
            </div>

            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full bg-blue-600 text-white font-black py-3.5 rounded-2xl text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-blue-500 transition-all disabled:opacity-60"
            >
              {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Affiliate Access Card ── */}
      <Link to="/affiliate" className="block group">
        <div className="glass-pod p-6 flex items-center justify-between bg-gradient-to-r from-blue-600/10 to-indigo-600/10 border border-blue-500/20 group-hover:bg-blue-600/20 transition-all duration-300">
           <div className="flex items-center gap-5">
              <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform">
                <Sparkles size={22} />
              </div>
              <div>
                 <h3 className="text-sm font-black uppercase tracking-tight flex items-center gap-2">
                    Partner Program <span className="px-2 py-0.5 rounded-full bg-blue-500 text-[8px] font-black uppercase tracking-widest text-white">Earn 60%</span>
                 </h3>
                 <p className="text-[10px] opacity-50 font-bold uppercase tracking-widest mt-0.5">Manage your referrals and payouts</p>
              </div>
           </div>
           <ArrowRight size={20} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all" />
        </div>
      </Link>

      {/* ── Account Details ── */}
      <div className="glass-pod p-8">

        <h3 className="text-[10px] font-black uppercase tracking-widest opacity-50 mb-2">Account Information</h3>
        <DetailRow icon={User}      label="Full Name"    value={user?.name} />
        <DetailRow icon={Mail}      label="Email Address" value={user?.email} />
        <DetailRow icon={Phone}     label="Phone Number"  value={user?.phone} />
        <DetailRow icon={Building2} label="Company"       value={user?.company} />
        <DetailRow icon={FileText}  label="Bio"           value={user?.bio} />
        <DetailRow icon={Shield}    label="Role"          value={user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)} />
      </div>

      {/* ── Activity ── */}
      <div className="glass-pod p-8">
        <h3 className="text-[10px] font-black uppercase tracking-widest opacity-50 mb-2">Activity</h3>
        <DetailRow icon={Calendar} label="Member Since" value={formatDate(user?.createdAt)} />
        <DetailRow icon={Clock}    label="Last Login"   value={formatDateTime(user?.lastLogin)} />
      </div>

      {/* ── Danger Zone ── */}
      <div className="glass-pod p-6">
        <h3 className="text-[10px] font-black uppercase tracking-widest opacity-50 mb-4">Session</h3>
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl border border-red-500/20 text-red-400 font-black text-[10px] uppercase tracking-widest hover:bg-red-500/10 transition-all"
        >
          <LogOut size={15} /> Sign Out of Empiros
        </button>
      </div>
    </motion.div>
  );
}
