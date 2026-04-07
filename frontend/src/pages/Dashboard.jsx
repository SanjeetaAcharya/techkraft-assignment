import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const API = import.meta.env.VITE_API_URL;

const SAMPLE_PROPERTIES = [
  { id: 'prop001', title: 'Modern Apartment in Thamel', location: 'Thamel, Kathmandu', price: 25000, type: 'Apartment', beds: 2, image: '/images/prop1.jpg' },
  { id: 'prop002', title: 'Cozy Studio in Baneshwor', location: 'Baneshwor, Kathmandu', price: 15000, type: 'Studio', beds: 1, image: '/images/prop2.jpg' },
  { id: 'prop003', title: 'Spacious Villa in Bhaktapur', location: 'Bhaktapur', price: 65000, type: 'Villa', beds: 4, image: '/images/prop3.jpg' },
  { id: 'prop004', title: 'Budget Room in Lalitpur', location: 'Patan, Lalitpur', price: 8000, type: 'Room', beds: 1, image: '/images/prop4.jpg' },
  { id: 'prop005', title: 'Luxury Penthouse, Maharajgunj', location: 'Maharajgunj, Kathmandu', price: 120000, type: 'Penthouse', beds: 3, image: '/images/prop5.jpg' },
  { id: 'prop006', title: 'Family Home in Kirtipur', location: 'Kirtipur, Kathmandu', price: 45000, type: 'House', beds: 3, image: '/images/prop6.jpg' },
];

export default function Dashboard() {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();
  const [favourites, setFavourites] = useState([]);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loadingId, setLoadingId] = useState(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const successTimer = useRef(null);

  useEffect(() => { fetchFavourites(); }, [token]);

  useEffect(() => {
    return () => { if (successTimer.current) clearTimeout(successTimer.current); };
  }, []);

  const fetchFavourites = async () => {
    setIsFetching(true);
    try {
      const res = await axios.get(`${API}/api/favourites`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFavourites(res.data);
    } catch {
      setError('Failed to load favourites');
    } finally {
      setIsFetching(false);
    }
  };

  const showSuccess = (msg) => {
    setSuccess(msg);
    if (successTimer.current) clearTimeout(successTimer.current);
    successTimer.current = setTimeout(() => setSuccess(''), 3000);
  };

  const isFavourited = (propertyId) => favourites.some(f => f.propertyId === propertyId);

  const handleToggleFavourite = async (property) => {
    setLoadingId(property.id);
    setError('');
    try {
      if (isFavourited(property.id)) {
        const fav = favourites.find(f => f.propertyId === property.id);
        await axios.delete(`${API}/api/favourites/${fav._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFavourites(prev => prev.filter(f => f.propertyId !== property.id));
        showSuccess('Removed from favourites');
      } else {
        const res = await axios.post(`${API}/api/favourites`, {
          propertyId: property.id,
          title: property.title,
          location: property.location,
          price: property.price,
        }, { headers: { Authorization: `Bearer ${token}` } });
        setFavourites(prev => [...prev, res.data]);
        showSuccess('Added to favourites!');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoadingId(null);
    }
  };

  const confirmLogout = () => setShowLogoutModal(true);
  const cancelLogout = () => setShowLogoutModal(false);
  const doLogout = () => { logout(); navigate('/login'); };

  return (
    <div style={s.page}>

      {/* ── Logout confirm modal ── */}
      {showLogoutModal && (
        <div style={s.modalOverlay} onClick={cancelLogout}>
          <div style={s.modal} onClick={e => e.stopPropagation()}>
            <div style={s.modalIcon}>
              <svg viewBox="0 0 24 24" style={{ width: '22px', height: '22px', fill: '#0f766e' }}>
                <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5-5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z" />
              </svg>
            </div>
            <div style={s.modalTitle}>Log out?</div>
            <div style={s.modalSub}>You'll need to sign in again to access your dashboard.</div>
            <div style={s.modalActions}>
              <button onClick={cancelLogout} style={s.cancelBtn}>Stay</button>
              <button onClick={doLogout} style={s.confirmBtn}>Yes, log out</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Navbar — dark ── */}
      <nav style={s.nav}>
        <div style={s.navBrand}>
          <div style={s.navDot}>
            <svg viewBox="0 0 24 24" style={{ width: '14px', height: '14px', fill: 'white' }}>
              <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
            </svg>
          </div>
          <span style={s.navName}>Buyer<span style={{ color: '#2dd4bf' }}>Portal</span></span>
        </div>
        <div style={s.navRight}>
          <div style={s.userChip}>{user?.name}</div>
          <button onClick={confirmLogout} style={s.logoutBtn}>
            <svg viewBox="0 0 24 24" style={{ width: '13px', height: '13px', fill: '#94a3b8', marginRight: '5px' }}>
              <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5-5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z" />
            </svg>
            Logout
          </button>
        </div>
      </nav>

      {/* ── Body — light ── */}
      <div style={s.body}>
        <div style={s.pageHeader}>
          <div>
            <div style={s.greeting}>Good day, {user?.name?.split(' ')[0]} 👋</div>
            <div style={s.greetingSub}>Browse properties and manage your favourites</div>
          </div>
          <div style={s.rolePill}>{user?.role?.toUpperCase()}</div>
        </div>

        {error && <div style={s.errorBox}>{error}</div>}
        {success && <div style={s.successBox}>{success}</div>}

        {/* Stats */}
        <div style={s.statsRow}>
          <div style={s.statCard}>
            <div style={s.statNum}>{favourites.length}</div>
            <div style={s.statLabel}>Saved properties</div>
          </div>
          <div style={s.statCard}>
            <div style={s.statNum}>{SAMPLE_PROPERTIES.length}</div>
            <div style={s.statLabel}>Available listings</div>
          </div>
          <div style={s.statCard}>
            <div style={s.statNum}>
              {favourites.filter(f =>
                new Date(f.createdAt).toDateString() === new Date().toDateString()
              ).length}
            </div>
            <div style={s.statLabel}>Added today</div>
          </div>
        </div>

        {/* Browse Properties */}
        <div style={s.sectionHeader}>
          <div style={s.sectionTitle}>Browse Properties</div>
          <div style={s.sectionSub}>{SAMPLE_PROPERTIES.length} listings available</div>
        </div>

        <div style={s.propGrid}>
          {SAMPLE_PROPERTIES.map(property => {
            const liked = isFavourited(property.id);
            const isLoading = loadingId === property.id;
            return (
              <div key={property.id} style={{
                ...s.propCard,
                border: liked ? '1.5px solid #0f766e' : '1px solid #e2e8f0',
                boxShadow: liked ? '0 0 0 3px #ccfbf1' : '0 1px 3px rgba(0,0,0,0.06)',
              }}>
                <div style={s.imgWrap}>
                  <img
                    src={property.image} alt={property.title} style={s.propImg}
                    onError={e => { e.target.src = 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&q=80'; }}
                  />
                  <div style={s.imgOverlay}>
                    <div style={s.propTypeBadge}>{property.type}</div>
                    <button
                      onClick={() => handleToggleFavourite(property)}
                      disabled={isLoading}
                      style={{
                        ...s.heartBtn,
                        background: liked ? '#0f766e' : 'rgba(255,255,255,0.95)',
                        border: liked ? '1px solid #0f766e' : '1px solid #e2e8f0',
                      }}
                    >
                      <svg viewBox="0 0 24 24" style={{ width: '14px', height: '14px', fill: liked ? 'white' : '#94a3b8' }}>
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                      </svg>
                    </button>
                  </div>
                </div>
                <div style={s.cardBody}>
                  <div style={s.propTitle}>{property.title}</div>
                  <div style={s.propLoc}>
                    <svg viewBox="0 0 24 24" style={{ width: '11px', height: '11px', fill: '#94a3b8', marginRight: '3px', flexShrink: 0 }}>
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                    </svg>
                    {property.location}
                  </div>
                  <div style={s.propBottom}>
                    <div style={s.propPrice}>
                      NPR {property.price.toLocaleString()}
                      <span style={s.perMonth}>/mo</span>
                    </div>
                    <div style={s.propBeds}>{property.beds} bed{property.beds > 1 ? 's' : ''}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* My Favourites */}
        <div style={{ ...s.sectionHeader, marginTop: '40px' }}>
          <div style={s.sectionTitle}>My Favourites</div>
          <div style={s.sectionSub}>{favourites.length} saved</div>
        </div>

        {isFetching ? (
          <div style={s.loadingState}>Loading your favourites...</div>
        ) : favourites.length === 0 ? (
          <div style={s.emptyState}>
            <svg viewBox="0 0 24 24" style={{ width: '32px', height: '32px', fill: '#cbd5e1', marginBottom: '12px' }}>
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
            <div style={s.emptyText}>No favourites yet</div>
            <div style={s.emptySub}>Click the heart on any property above</div>
          </div>
        ) : (
          favourites.map(f => {
            const prop = SAMPLE_PROPERTIES.find(p => p.id === f.propertyId);
            return (
              <div key={f._id} style={s.favCard}>
                {prop && (
                  <img src={prop.image} alt={f.title} style={s.favImg}
                    onError={e => { e.target.src = 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&q=80'; }}
                  />
                )}
                <div style={s.favLeft}>
                  <div style={s.favTag}>#{f.propertyId}</div>
                  <div style={s.favTitle}>{f.title}</div>
                  <div style={s.favLoc}>{f.location}</div>
                  {f.price > 0 && <div style={s.favPrice}>NPR {f.price.toLocaleString()} / mo</div>}
                </div>
                <button
                  onClick={() => handleToggleFavourite({ id: f.propertyId, title: f.title, location: f.location, price: f.price })}
                  style={s.removeBtn} title="Remove from favourites"
                >
                  <svg viewBox="0 0 24 24" style={{ width: '15px', height: '15px', fill: '#ef4444' }}>
                    <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
                  </svg>
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

const s = {
  page: { minHeight: '100vh', background: '#f1f5f9' },

  nav: {
    background: '#1e293b', padding: '14px 32px',
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
  },
  navBrand: { display: 'flex', alignItems: 'center', gap: '10px' },
  navDot: {
    width: '28px', height: '28px', background: '#0f766e', borderRadius: '8px',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  navName: { fontSize: '16px', fontWeight: '800', color: 'white', letterSpacing: '-0.5px' },
  navRight: { display: 'flex', alignItems: 'center', gap: '12px' },
  userChip: {
    background: '#334155', border: '1px solid #475569',
    borderRadius: '20px', padding: '4px 14px', fontSize: '12px', color: '#e2e8f0',
  },
  logoutBtn: {
    background: 'none', border: '1px solid #334155', color: '#94a3b8',
    fontSize: '12px', cursor: 'pointer', borderRadius: '8px',
    padding: '5px 12px', display: 'flex', alignItems: 'center',
  },

  // ── Body — light ──
  body: { maxWidth: '960px', margin: '0 auto', padding: '32px 24px' },
  pageHeader: {
    display: 'flex', justifyContent: 'space-between',
    alignItems: 'flex-start', marginBottom: '28px',
  },
  greeting: { fontSize: '22px', fontWeight: '700', color: '#1e293b' },
  greetingSub: { fontSize: '13px', color: '#94a3b8', marginTop: '4px' },
  rolePill: {
    background: '#f0fdfa', color: '#0f766e', fontSize: '10px', fontWeight: '700',
    padding: '4px 12px', borderRadius: '20px', border: '1px solid #99f6e4',
    letterSpacing: '0.06em', marginTop: '4px',
  },

  // ── Alerts ──
  errorBox: {
    background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626',
    borderRadius: '8px', padding: '10px 14px', fontSize: '13px', marginBottom: '16px',
  },
  successBox: {
    background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#16a34a',
    borderRadius: '8px', padding: '10px 14px', fontSize: '13px', marginBottom: '16px',
  },

  // ── Stats ──
  statsRow: { display: 'flex', gap: '12px', marginBottom: '32px' },
  statCard: {
    background: 'white', borderRadius: '12px', padding: '18px 22px',
    border: '1px solid #e2e8f0', flex: 1,
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
  },
  statNum: { fontSize: '28px', fontWeight: '700', color: '#0f766e' },
  statLabel: { fontSize: '12px', color: '#94a3b8', marginTop: '2px' },

  // ── Section headers ──
  sectionHeader: {
    display: 'flex', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: '16px',
  },
  sectionTitle: { fontSize: '15px', fontWeight: '700', color: '#1e293b' },
  sectionSub: { fontSize: '12px', color: '#94a3b8' },

  // ── Property grid ──
  propGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' },
  propCard: {
    background: 'white', borderRadius: '14px', overflow: 'hidden',
    transition: 'border 0.2s, box-shadow 0.2s',
  },
  imgWrap: { position: 'relative', height: '160px', overflow: 'hidden' },
  propImg: { width: '100%', height: '100%', objectFit: 'cover' },
  imgOverlay: {
    position: 'absolute', top: '10px', left: '10px', right: '10px',
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
  },
  propTypeBadge: {
    background: 'rgba(255,255,255,0.92)', color: '#0f766e', fontSize: '10px',
    fontWeight: '700', padding: '3px 9px', borderRadius: '20px', border: '1px solid #99f6e4',
  },
  heartBtn: {
    width: '30px', height: '30px', borderRadius: '50%',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    cursor: 'pointer', transition: 'all 0.2s',
  },
  cardBody: { padding: '14px 16px' },
  propTitle: { fontSize: '14px', fontWeight: '600', color: '#1e293b', marginBottom: '6px' },
  propLoc: { fontSize: '12px', color: '#94a3b8', display: 'flex', alignItems: 'center', marginBottom: '12px' },
  propBottom: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  propPrice: { fontSize: '15px', fontWeight: '700', color: '#0f766e' },
  perMonth: { fontSize: '11px', fontWeight: '400', color: '#94a3b8' },
  propBeds: { fontSize: '11px', color: '#64748b', background: '#f1f5f9', padding: '2px 8px', borderRadius: '20px' },

  // ── Favourites list ──
  loadingState: { textAlign: 'center', padding: '32px', color: '#94a3b8', fontSize: '14px' },
  favCard: {
    background: 'white', border: '1px solid #e2e8f0', borderRadius: '12px',
    padding: '12px 16px', marginBottom: '10px', display: 'flex',
    alignItems: 'center', gap: '14px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
  },
  favImg: { width: '60px', height: '60px', borderRadius: '8px', objectFit: 'cover', flexShrink: 0 },
  favLeft: { flex: 1 },
  favTag: {
    fontSize: '10px', color: '#0f766e', fontWeight: '700', background: '#f0fdfa',
    border: '1px solid #99f6e4', borderRadius: '4px', padding: '1px 6px',
    display: 'inline-block', marginBottom: '4px',
  },
  favTitle: { fontSize: '14px', fontWeight: '600', color: '#1e293b' },
  favLoc: { fontSize: '12px', color: '#94a3b8', marginTop: '2px' },
  favPrice: { fontSize: '13px', color: '#0f766e', fontWeight: '600', marginTop: '4px' },
  removeBtn: {
    width: '32px', height: '32px', borderRadius: '8px', background: '#fef2f2',
    border: '1px solid #fecaca', cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  emptyState: {
    textAlign: 'center', padding: '40px 24px', background: 'white',
    borderRadius: '12px', border: '1px solid #e2e8f0',
    display: 'flex', flexDirection: 'column', alignItems: 'center',
  },
  emptyText: { fontSize: '15px', fontWeight: '600', color: '#1e293b' },
  emptySub: { fontSize: '13px', color: '#94a3b8', marginTop: '4px' },

  // ── Logout ──
  modalOverlay: {
    position: 'fixed', inset: 0,
    background: 'rgba(15, 23, 42, 0.55)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    zIndex: 50,
  },
  modal: {
    background: 'white', borderRadius: '16px', padding: '32px 28px',
    width: '100%', maxWidth: '360px', textAlign: 'center',
    boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
  },
  modalIcon: {
    width: '48px', height: '48px', background: '#f0fdfa', borderRadius: '50%',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    margin: '0 auto 16px',
  },
  modalTitle: { fontSize: '18px', fontWeight: '700', color: '#1e293b', marginBottom: '8px' },
  modalSub: { fontSize: '13px', color: '#64748b', marginBottom: '24px', lineHeight: '1.6' },
  modalActions: { display: 'flex', gap: '10px' },
  cancelBtn: {
    flex: 1, padding: '11px', background: '#f1f5f9', border: '1px solid #e2e8f0',
    borderRadius: '10px', fontSize: '14px', fontWeight: '600',
    color: '#475569', cursor: 'pointer',
  },
  confirmBtn: {
    flex: 1, padding: '11px', background: '#0f766e',
    border: 'none', borderRadius: '10px', fontSize: '14px',
    fontWeight: '600', color: 'white', cursor: 'pointer',
  },
};