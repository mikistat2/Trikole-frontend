import { useEffect, useState } from 'react';
import { leaderboardApi, roomsApi, settingsApi } from '@/api';
import { useAuthStore } from '@/store/auth.store';
import LeaderboardRow from '@/components/common/LeaderboardRow';

export default function AppLeaderboardPage() {
  const [tab, setTab]         = useState('global');  // 'global' | room id
  const [global, setGlobal]   = useState([]);
  const [rooms, setRooms]     = useState([]);
  const [roomLb, setRoomLb]   = useState({});        // roomId → entries[]
  const [loading, setLoading] = useState(true);
  const [joinCode, setJoinCode] = useState('');
  const [showJoin, setShowJoin] = useState(false);
  const [message, setMessage] = useState('');
  const { user } = useAuthStore();

  useEffect(() => {
    (async () => {
      const [lb, myRooms, msgRes] = await Promise.all([
        leaderboardApi.getGlobal(),
        roomsApi.getAll(),
        settingsApi.get('leaderboard_message').catch(() => ({ data: { value: '' } })),
      ]);
      const maxCount = lb.data[0]?.total_watched || 1;
      setGlobal(lb.data.map(e => ({ ...e, _pct: Math.round((e.total_watched / maxCount) * 100) })));
      setRooms(myRooms.data);
      if (msgRes?.data?.value) {
        setMessage(msgRes.data.value);
      }
      setLoading(false);
    })();
  }, []);

  async function loadRoom(roomId) {
    if (roomLb[roomId]) { setTab(roomId); return; }
    const res = await leaderboardApi.getRoom(roomId);
    const maxCount = res.data[0]?.total_watched || 1;
    setRoomLb(prev => ({
      ...prev,
      [roomId]: res.data.map(e => ({ ...e, _pct: Math.round((e.total_watched / maxCount) * 100) })),
    }));
    setTab(roomId);
  }

  async function handleJoin(e) {
    e.preventDefault();
    try {
      const res = await roomsApi.join(joinCode);
      setRooms(r => [...r, res.data]);
      setJoinCode('');
      setShowJoin(false);
    } catch { alert('Room not found'); }
  }

  const entries = tab === 'global' ? global : (roomLb[tab] || []);

  return (
    <div className="px-4 pt-12 pb-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold">Leaderboard</h1>
        <button onClick={() => setShowJoin(s => !s)} className="text-xs px-3 py-1.5 border border-gray-200 rounded-full text-gray-600">
          + Join room
        </button>
      </div>

      {/* Leaderboard Message Box */}
      {tab === 'global' && (
        <div className="mb-4 relative group overflow-hidden rounded-2xl border border-brand/30 bg-gradient-to-br from-brand/10 via-surface-card to-surface-card shadow-glow mx-1">
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand/20 blur-[50px] -mr-16 -mt-16 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-brand/10 blur-[40px] -ml-12 -mb-12 pointer-events-none" />
          
          <div className="p-4 relative z-10">
            <div className="flex gap-3.5 items-start">
              <div className="mt-0.5 shrink-0 flex items-center justify-center w-9 h-9 rounded-full bg-brand/20 text-brand shadow-inner ring-1 ring-brand/30">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                  <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
                  <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
                  <path d="M4 22h16" />
                  <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
                  <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
                  <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-[10px] font-bold text-brand uppercase tracking-widest mb-1 opacity-90">Prize Pool & News</h3>
                <p className="text-text-primary font-medium text-sm leading-relaxed whitespace-pre-wrap">
                  {message || 'Welcome to the leaderboard! Participate and climb the ranks.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Join code input */}
      {showJoin && (
        <form onSubmit={handleJoin} className="flex gap-2 mb-4">
          <input
            type="text"
            placeholder="Enter invite code"
            value={joinCode}
            onChange={e => setJoinCode(e.target.value.toUpperCase())}
            maxLength={8}
            className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-brand uppercase tracking-widest"
          />
          <button type="submit" className="px-4 py-2 text-sm bg-brand text-white rounded-xl font-medium">
            Join
          </button>
        </form>
      )}

      {/* Tab strip */}
      <div className="flex gap-2 overflow-x-auto pb-1 mb-4">
        <button
          onClick={() => setTab('global')}
          className={`shrink-0 text-xs px-3 py-1.5 rounded-full border transition-colors ${tab === 'global' ? 'bg-brand text-white border-brand' : 'bg-white text-gray-500 border-gray-200'}`}
        >
          Global
        </button>
        {rooms.map(r => (
          <button
            key={r.id}
            onClick={() => loadRoom(r.id)}
            className={`shrink-0 text-xs px-3 py-1.5 rounded-full border transition-colors ${tab === r.id ? 'bg-brand text-white border-brand' : 'bg-white text-gray-500 border-gray-200'}`}
          >
            {r.name}
          </button>
        ))}
      </div>

      {/* Entries */}
      {loading ? (
        <div className="flex justify-center py-16 text-gray-400 text-sm">Loading...</div>
      ) : (
        <div className="space-y-2">
          {entries.map((e, i) => (
            <LeaderboardRow key={e.id} entry={e} rank={i + 1} isMe={e.id === user?.id} />
          ))}
        </div>
      )}
    </div>
  );
}
