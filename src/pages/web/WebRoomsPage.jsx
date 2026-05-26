import { useEffect, useState } from 'react';
import { roomsApi, leaderboardApi } from '@/api';
import { useAuthStore } from '@/store/auth.store';
import LeaderboardRow from '@/components/common/LeaderboardRow';

export default function WebRoomsPage() {
  const [rooms, setRooms] = useState([]);
  const [activeRoom, setActiveRoom] = useState(null);
  const [roomLb, setRoomLb] = useState([]);
  const [showCreate, setShowCreate] = useState(false);
  const [joinCode, setJoinCode] = useState('');
  const [createForm, setCreateForm] = useState({ name: '', starts_at: '', ends_at: '' });
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();

  useEffect(() => {
    roomsApi.getAll().then(r => { setRooms(r.data); setLoading(false); });
  }, []);

  async function loadRoom(room) {
    setActiveRoom(room);
    const res = await leaderboardApi.getRoom(room.id);
    const maxCount = res.data[0]?.total_watched || 1;
    setRoomLb(res.data.map(e => ({ ...e, _pct: Math.round((e.total_watched / maxCount) * 100) })));
  }

  async function handleCreate(e) {
    e.preventDefault();
    const res = await roomsApi.create(createForm);
    setRooms(r => [...r, res.data]);
    setShowCreate(false);
    setCreateForm({ name: '', starts_at: '', ends_at: '' });
  }

  async function handleJoin(e) {
    e.preventDefault();
    const res = await roomsApi.join(joinCode);
    setRooms(r => [...r, res.data]);
    setJoinCode('');
  }

  const daysLeft = (room) => {
    const diff = new Date(room.ends_at) - new Date();
    return Math.max(0, Math.ceil(diff / 86400000));
  };

  return (
    <div className="p-4 sm:p-6 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h1 className="page-header">Competition Rooms</h1>
        <button
          onClick={() => setShowCreate(true)}
          className="text-sm px-4 py-2.5 rounded-xl bg-brand text-white font-semibold hover:bg-brand-dark hover:shadow-glow transition-all duration-200 active:scale-95"
        >
          + New Room
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Room list */}
        <div className="lg:col-span-1 space-y-3">
          <form onSubmit={handleJoin} className="flex gap-2 mb-4">
            <input
              type="text"
              placeholder="Invite code..."
              value={joinCode}
              onChange={e => setJoinCode(e.target.value.toUpperCase())}
              maxLength={8}
              className="input-dark flex-1 uppercase tracking-widest font-mono"
            />
            <button type="submit" className="btn-secondary shrink-0">Join</button>
          </form>

          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="p-4 rounded-xl space-y-2">
                  <div className="h-4 w-2/3 shimmer rounded" />
                  <div className="h-3 w-1/3 shimmer rounded" />
                </div>
              ))}
            </div>
          ) : rooms.length === 0 ? (
            <p className="text-sm text-text-muted py-8 text-center">No rooms yet. Create one!</p>
          ) : (
            rooms.map(room => (
              <button
                key={room.id}
                onClick={() => loadRoom(room)}
                className={`w-full text-left p-4 rounded-xl border transition-all duration-200 ${
                  activeRoom?.id === room.id
                    ? 'border-brand/30 bg-brand/5'
                    : 'border-surface-border bg-surface-card hover:border-surface-subtle'
                }`}
              >
                <p className="text-sm font-medium text-text-primary">{room.name}</p>
                <p className="text-xs text-text-muted mt-0.5">{daysLeft(room)} days left</p>
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-xs bg-surface-raised text-text-muted px-2 py-0.5 rounded font-mono tracking-wider border border-surface-border">
                    {room.invite_code}
                  </span>
                  <span className="text-xs text-text-muted">{room.member_count} members</span>
                </div>
              </button>
            ))
          )}
        </div>

        {/* Room leaderboard */}
        <div className="lg:col-span-2">
          {activeRoom ? (
            <div>
              <h2 className="font-semibold text-base text-text-primary mb-4">{activeRoom.name} — Rankings</h2>
              <div className="space-y-2">
                {roomLb.map((e, i) => (
                  <LeaderboardRow key={e.id} entry={e} rank={i + 1} isMe={e.id === user?.id} />
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-text-muted text-sm">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-12 h-12 mb-3 text-surface-subtle">
                <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 00-3-3.87" /><path d="M16 3.13a4 4 0 010 7.75" />
              </svg>
              Select a room to see rankings
            </div>
          )}
        </div>
      </div>

      {/* Create modal */}
      {showCreate && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="glass-strong rounded-2xl w-full max-w-md p-6 shadow-modal animate-scale-in">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-bold text-lg text-text-primary">Create room</h2>
              <button onClick={() => setShowCreate(false)} className="w-8 h-8 rounded-lg flex items-center justify-center text-text-muted hover:text-text-primary hover:bg-surface-hover">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-text-secondary mb-2">Room name</label>
                <input
                  type="text" required
                  value={createForm.name}
                  onChange={e => setCreateForm(f => ({ ...f, name: e.target.value }))}
                  className="input-dark"
                  placeholder="e.g. Movie Marathon 2025"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-text-secondary mb-2">Start date</label>
                  <input
                    type="datetime-local" required
                    value={createForm.starts_at}
                    onChange={e => setCreateForm(f => ({ ...f, starts_at: e.target.value }))}
                    className="input-dark"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-text-secondary mb-2">End date</label>
                  <input
                    type="datetime-local" required
                    value={createForm.ends_at}
                    onChange={e => setCreateForm(f => ({ ...f, ends_at: e.target.value }))}
                    className="input-dark"
                  />
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setShowCreate(false)} className="btn-secondary flex-1">
                  Cancel
                </button>
                <button type="submit" className="btn-primary flex-1">
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
