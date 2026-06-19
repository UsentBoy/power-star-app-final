import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useParams, useNavigate, useLocation } from 'react-router-dom';
import { Menu, ChevronRight, MessageSquare, Download, User as UserIcon, Home as HomeIcon, Wallet, PlayCircle, ExternalLink, DollarSign, Users as UsersIcon, Copy, Gift, Settings, UserPlus, UserMinus, Share2, Search, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import Swal from 'sweetalert2';
import { taskHtmlData } from './taskData';
import './index.css';

// Override default window.alert with beautiful SweetAlert2 popups
window.alert = (message) => {
  const isSuccess = message.toLowerCase().includes('success') || message.includes('✅');
  const isWarning = message.toLowerCase().includes('please') || message.includes('⚠️') || message.includes('দিন');
  
  Swal.fire({
    title: isSuccess ? 'Success!' : isWarning ? 'Attention' : 'Notification',
    text: message,
    icon: isSuccess ? 'success' : isWarning ? 'warning' : 'info',
    confirmButtonColor: '#10b981',
    confirmButtonText: 'OK',
    background: '#ffffff',
    color: '#374151',
    customClass: {
      popup: 'swal2-custom-popup',
      title: 'swal2-custom-title',
      confirmButton: 'swal2-custom-button'
    }
  });
};

const tasks = [
  { id: 'tiktok', title: 'TikTok Like Follow', subtitle: 'লাইক/ফলো করে ইনকাম', iconUrl: 'https://cdn.simpleicons.org/tiktok/000000', type: 'template', dataKey: 'tiktok' },
  { id: 'vk', title: 'VK Surfing', subtitle: 'কমেন্ট/অ্যাড দেখে ইনকাম', iconUrl: 'https://cdn.simpleicons.org/vk/0077FF', type: 'template', dataKey: 'vk' },
  { id: 'gamgala', title: 'Gamgala Earn', subtitle: 'গেম খেলে আয়', iconUrl: 'https://img.icons8.com/color/96/controller.png', type: 'template', dataKey: 'gamgala' },
  { id: 'typing-job', title: 'Typing Job', subtitle: 'টাইপিং করে ইনকাম', iconUrl: 'https://img.icons8.com/color/96/keyboard.png', type: 'template', dataKey: 'typing-job' },
  { id: 'work-cash', title: 'Video Watching', subtitle: 'ভিডিও দেখে ইনকাম', iconUrl: 'https://cdn.simpleicons.org/youtube/FF0000', type: 'template', dataKey: 'work-cash' },
  { id: 'ip-web', title: 'IP Work', subtitle: 'IP ব্যবহার করে অনলাইন কাজ', iconUrl: 'https://img.icons8.com/color/96/internet.png', type: 'template', dataKey: 'ip-web' }
];

const jobData = {
  tiktok: {
    title: 'TikTok Like Follow',
    accountVideo: 'EF_pBnwW9h0',
    regLink: 'https://tiktop-free.com/?ref=mdmahmudsah575',
    workVideo: 'lBJfDuyngFM',
    withdrawVideo: 'JCKlTP0X_YU'
  },
  vk: {
    title: 'VK Surfing',
    accountVideo: '46ZN7DmNzoE',
    regLink: 'https://vkserfing.ru/?ref=551293767',
    workVideo: '-9YSEYHxx4o',
    withdrawVideo: 'ritzyUqWIx4'
  },
  gamgala: {
    title: 'Gamgala Earn',
    accountVideo: 'VJeZY6VjC98',
    regLink: 'https://getblock.me/u/29498073',
    withdrawVideo: 'nk_tRRU9IsA'
  },
  'ip-web': {
    title: 'IP work',
    accountVideo: 'OCPfczevxIo',
    regLink: 'https://www.ipweb.pro/?mahmudsah',
    withdrawVideo: 'GgkJEtw_Uys'
  },
  'work-cash': {
    title: 'Video Watching',
    accountVideo: 'V62ozu15JIo',
    regLink: 'https://worker.cash/u/1412507',
    withdrawVideo: 'cf3asyi9uhI'
  },
  'typing-job': {
    title: 'Typing Job',
    accountVideo: 'JP56leadK6E',
    regLink: '',
    withdrawVideo: '1hhW_9sZtaE'
  }
};

const Header = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const myTelegramId = window.Telegram?.WebApp?.initDataUnsafe?.user?.id?.toString() || "6323700179";
  const [isAdmin, setIsAdmin] = useState(false);
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/admin/user/${window.Telegram?.WebApp?.initDataUnsafe?.user?.id?.toString() || '6323700179'}`).then(r => r.json()).then(d => { if(d.isAdmin) setIsAdmin(true); }).catch(e => console.error(e));
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClick = () => setMenuOpen(false);
    if (menuOpen) document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [menuOpen]);

  return (
    <header className="app-header" style={{position: 'relative'}}>
      <div className="header-left" onClick={() => navigate('/')} style={{cursor:'pointer'}}>
        <div className="logo-icon" style={{background: 'transparent'}}>
          <img src="https://th.bing.com/th/id/OIP.d8ulye8PVBKj2OSA7vndOAHaE7?w=245&h=180&c=7&r=0&o=7&pid=1.7&rm=3" alt="Logo" style={{width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%'}} />
        </div>
        <span className="header-title" style={{fontWeight: '800'}}>Power Star Work</span>
      </div>
      <div style={{display: 'flex', alignItems: 'center', gap: '15px'}}>
        {isAdmin && <Settings className="menu-icon" size={26} color="#4b5563" onClick={() => navigate('/admin')} style={{cursor: 'pointer'}} />}
        <div style={{position: 'relative'}}>
          <Menu className="menu-icon" size={26} onClick={(e) => { e.stopPropagation(); setMenuOpen(!menuOpen); }} style={{cursor: 'pointer'}} />
          
          {menuOpen && (
            <div style={{
              position: 'absolute', top: '100%', right: 0, marginTop: '10px', background: 'white',
              borderRadius: '16px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', padding: '8px',
              minWidth: '200px', zIndex: 100, border: '1px solid #f3f4f6'
            }} onClick={e => e.stopPropagation()}>
              <div onClick={() => { navigate('/history?tab=coin'); setMenuOpen(false); }} style={{display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 16px', borderRadius: '10px', cursor: 'pointer', transition: 'background 0.2s', background: '#f8fafc', marginBottom: '5px'}}>
                <span style={{fontSize: '1.2rem'}}>💰</span>
                <span style={{fontWeight: '700', color: '#1f2937', fontSize: '0.9rem'}}>Coin Sell History</span>
              </div>
              <div onClick={() => { navigate('/history?tab=work'); setMenuOpen(false); }} style={{display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 16px', borderRadius: '10px', cursor: 'pointer', transition: 'background 0.2s', background: '#f8fafc'}}>
                <span style={{fontSize: '1.2rem'}}>💼</span>
                <span style={{fontWeight: '700', color: '#1f2937', fontSize: '0.9rem'}}>Work History</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

const Footer = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  return (
    <div className="footer-bar-new">
      <div className="nav-item" onClick={() => navigate('/')} style={{ color: location.pathname === '/' ? '#a855f7' : '#9ca3af' }}>
        <HomeIcon size={24} />
        <span>Home</span>
      </div>
      <div className="nav-item" onClick={() => navigate('/invite')} style={{ color: location.pathname === '/invite' ? '#a855f7' : '#9ca3af' }}>
        <UsersIcon size={24} />
        <span>Invite</span>
      </div>
      <div className="nav-item" onClick={() => navigate('/contact')} style={{ color: location.pathname === '/contact' ? '#a855f7' : '#9ca3af' }}>
        <MessageSquare size={24} />
        <span>Contact</span>
      </div>
      <div className="nav-item" onClick={() => navigate('/profile')} style={{ color: location.pathname === '/profile' ? '#a855f7' : '#9ca3af' }}>
        <UserIcon size={24} />
        <span>Profile</span>
      </div>
    </div>
  );
};

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container" style={{background: '#f3f4f6', minHeight: '100vh', padding: '20px', paddingBottom: '100px'}}>
      
      {/* Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #6366f1, #a855f7)', 
        borderRadius: '20px', 
        padding: '25px 20px', 
        color: 'white',
        boxShadow: '0 10px 25px rgba(99, 102, 241, 0.4)',
        marginBottom: '25px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <h2 style={{fontSize: '1.8rem', fontWeight: '800', marginBottom: '5px'}}>Start Earning!</h2>
        <p style={{fontSize: '1.1rem', opacity: '0.9'}}>Complete tasks to earn real money daily.</p>
        <div style={{position: 'absolute', right: '-20px', top: '-20px', width: '100px', height: '100px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)'}}></div>
      </div>

      <h3 style={{color: '#1f2937', marginBottom: '15px', fontWeight: '800', fontSize: '1.4rem'}}>🔥 Available Works</h3>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px' }}>
        
        {/* Coin Sell Card */}
        <div onClick={() => navigate('/market')} style={{
          background: 'linear-gradient(135deg, #0ea5e9, #2563eb)',
          borderRadius: '16px',
          padding: '20px 15px',
          textAlign: 'center',
          boxShadow: '0 4px 15px rgba(14,165,233,0.3)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '10px',
          cursor: 'pointer',
          gridColumn: 'span 2'
        }}>
          <div style={{background: 'rgba(255,255,255,0.2)', padding: '14px', borderRadius: '18px', marginBottom: '5px'}}>
            <span style={{fontSize: '2.2rem'}}>💰</span>
          </div>
          <div style={{flex: 1}}>
            <h3 style={{fontSize: '1.2rem', fontWeight: '900', color: 'white', marginBottom: '4px'}}>Coins Sell</h3>
            <p style={{fontSize: '0.85rem', color: 'rgba(255,255,255,0.85)'}}>লাইভ মার্কেট রেট দেখুন ও কয়েন বিক্রি করুন</p>
          </div>
          <span style={{background: 'rgba(255,255,255,0.25)', color: 'white', padding: '8px 24px', borderRadius: '12px', fontSize: '0.9rem', fontWeight: '800', width: '100%', marginTop: '5px'}}>
            📈 Live Market দেখুন
          </span>
        </div>

        {/* Task Cards */}
        {tasks.map((task) => (
          <div key={task.id} onClick={async () => {
            try {
              const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/admin/user/${window.Telegram?.WebApp?.initDataUnsafe?.user?.id?.toString() || '6323700179'}`);
              const data = await res.json();
              if (data && data.isVerified === false) {
                if (window.confirm('আপনার একাউন্টটি এখনো ভেরিফাই করা নেই! (Profile এ যান)')) {
                  navigate('/profile');
                }
              } else {
                navigate(`/task/${task.id}`);
              }
            } catch (err) {
              navigate(`/task/${task.id}`);
            }
          }} style={{
            background: 'white', borderRadius: '16px', padding: '20px 15px', textAlign: 'center',
            boxShadow: '0 4px 10px rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'column',
            alignItems: 'center', gap: '10px', cursor: 'pointer', border: '1px solid #e5e7eb'
          }}>
            <div style={{background: '#f8fafc', padding: '12px', borderRadius: '16px', marginBottom: '5px'}}>
              <img src={task.iconUrl} alt={task.title} style={{width: '40px', height: '40px', objectFit: 'contain'}} />
            </div>
            <div style={{flex: 1}}>
              <h3 style={{fontSize: '1rem', fontWeight: '800', color: '#1f2937', marginBottom: '4px'}}>{task.title}</h3>
              <p style={{fontSize: '0.8rem', color: '#6b7280'}}>{task.subtitle}</p>
            </div>
            <span style={{background: '#4f46e5', color: 'white', padding: '8px 16px', borderRadius: '12px', fontSize: '0.85rem', fontWeight: '800', width: '100%', marginTop: '5px'}}>
              Start Work
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};


// ---- Coin Market Page ----
const CoinMarketPage = () => {
  const navigate = useNavigate();
  const [coins, setCoins] = useState([]);
  const [marketConfig, setMarketConfig] = useState({ marketIsVisible: true });

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/coins`)
      .then(res => res.json())
      .then(data => setCoins(Array.isArray(data) ? data : []))
      .catch(console.error);
    fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/config`)
      .then(res => res.json())
      .then(data => setMarketConfig(data))
      .catch(console.error);
  }, []);

  return (
    <div style={{background: '#f3f4f6', minHeight: '100vh', padding: '20px', paddingBottom: '100px'}}>
      {/* Header */}
      <div style={{display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '25px'}}>
        <button onClick={() => navigate('/')} style={{background: 'white', border: 'none', padding: '8px', borderRadius: '12px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)', cursor: 'pointer'}}>
          <ChevronRight size={24} color="#374151" style={{transform: 'rotate(180deg)'}} />
        </button>
        <div>
          <h2 style={{fontWeight: '900', fontSize: '1.5rem', color: '#1f2937', margin: 0}}>💰 Coins Sell</h2>
          <p style={{fontSize: '0.8rem', color: '#6b7280', margin: 0}}>কয়েন সিলেক্ট করুন এবং বিক্রি করুন</p>
        </div>
      </div>

      {!marketConfig.marketIsVisible ? (
        <div style={{background: 'white', borderRadius: '20px', padding: '40px 20px', textAlign: 'center', boxShadow: '0 4px 10px rgba(0,0,0,0.05)'}}>
          <div style={{fontSize: '3rem', marginBottom: '15px'}}>🔒</div>
          <h3 style={{fontWeight: '800', color: '#1f2937', marginBottom: '8px'}}>মার্কেট বন্ধ আছে</h3>
          <p style={{color: '#6b7280', fontSize: '0.9rem'}}>এই মুহূর্তে কয়েন বিক্রি করা যাচ্ছে না। পরে আবার চেষ্টা করুন।</p>
        </div>
      ) : (
        <>
          {/* Stats Banner */}
          <div style={{background: 'linear-gradient(135deg, #0ea5e9, #2563eb)', borderRadius: '20px', padding: '20px', color: 'white', marginBottom: '20px', boxShadow: '0 8px 20px rgba(14,165,233,0.3)'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
              <div>
                <p style={{fontSize: '0.8rem', opacity: 0.85, margin: '0 0 4px 0'}}>মোট কয়েন</p>
                <h3 style={{fontSize: '1.8rem', fontWeight: '900', margin: 0}}>{coins.filter(c => c.isVisible).length} টি</h3>
              </div>
              <div style={{textAlign: 'right'}}>
                <p style={{fontSize: '0.8rem', opacity: 0.85, margin: '0 0 4px 0'}}>সক্রিয় কয়েন</p>
                <h3 style={{fontSize: '1.8rem', fontWeight: '900', margin: 0}}>{coins.filter(c => c.isActive && c.isVisible).length} টি</h3>
              </div>
            </div>
          </div>

          <h3 style={{color: '#1f2937', fontWeight: '800', fontSize: '1.2rem', marginBottom: '15px'}}>📈 লাইভ মার্কেট রেট</h3>

          <div style={{display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px'}}>
            {coins.filter(c => c.isVisible).map(coin => (
              <div key={coin.coinId} onClick={() => {
                if (!coin.isActive) return alert('এই কয়েনের বিক্রি এখন বন্ধ আছে।');
                navigate(`/sell-coin?type=${coin.coinId}&name=${coin.label}&color=${encodeURIComponent(coin.color)}`);
              }} style={{
                background: 'white',
                padding: '16px',
                borderRadius: '16px',
                borderTop: `4px solid ${coin.color}`,
                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                opacity: coin.isActive ? 1 : 0.6,
                transition: 'transform 0.1s',
              }}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px'}}>
                  <span style={{fontSize: '0.75rem', fontWeight: '800', color: '#6b7280', textTransform: 'uppercase'}}>{coin.label}</span>
                  {coin.isActive
                    ? <span style={{fontSize: '0.65rem', fontWeight: '800', color: 'white', background: '#10b981', padding: '2px 6px', borderRadius: '4px'}}>Active</span>
                    : <span style={{fontSize: '0.65rem', fontWeight: '800', color: 'white', background: '#ef4444', padding: '2px 6px', borderRadius: '4px'}}>Stopped</span>
                  }
                </div>
                <div>
                  <h3 style={{fontSize: '1.8rem', fontWeight: '900', color: '#1f2937', margin: 0, lineHeight: 1}}>{coin.price}<span style={{fontSize: '0.9rem', color: '#9ca3af', marginLeft: '2px'}}>৳</span></h3>
                  <p style={{fontSize: '0.65rem', fontWeight: '600', color: '#9ca3af', margin: '4px 0 10px 0'}}>Per 1,000 Coins</p>
                </div>
                <div style={{background: coin.color, color: 'white', padding: '7px', borderRadius: '10px', textAlign: 'center', fontWeight: '800', fontSize: '0.8rem'}}>
                  Sell Now →
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

const Profile = () => {
  const navigate = useNavigate();
  const [links, setLinks] = useState({ bkashNumber: '...', nagadNumber: '...', rocketNumber: '...', activationFee: 20 });
  const [user, setUser] = useState({ username: 'Md Mahmud', telegramId: window.Telegram?.WebApp?.initDataUnsafe?.user?.id?.toString() || "6323700179", balance: 0, isVerified: false });
  const [trxId, setTrxId] = useState('');

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/contact`)
      .then(res => res.json())
      .then(data => setLinks(data))
      .catch(console.error);
    
    fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/admin/user/${window.Telegram?.WebApp?.initDataUnsafe?.user?.id?.toString() || '6323700179'}`)
      .then(res => res.json())
      .then(data => {
        if (data && !data.error) setUser(data);
      })
      .catch(console.error);
  }, []);

  const submitVerification = () => {
    if(!trxId) return alert("Please enter Transaction ID");
    fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/verify/submit`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userTelegramId: user.telegramId, paymentMethod: 'Manual', transactionId: trxId })
    })
    .then(res => res.json())
    .then(data => {
      alert(data.message || "Verification request submitted!");
      setTrxId('');
    });
  };

  return (
    <div className="home-container" style={{background: '#f3f4f6', minHeight: '100vh', padding: '20px', paddingBottom: '100px'}}>
      
      {/* Profile Header Card */}
      {user.isVerified ? (
        <div style={{
          background: 'linear-gradient(135deg, #10b981, #059669)', padding: '30px 20px', borderRadius: '24px',
          color: 'white', boxShadow: '0 10px 25px rgba(16, 185, 129, 0.4)', position: 'relative', overflow: 'hidden',
          marginBottom: '25px', textAlign: 'center'
        }}>
          <div style={{position: 'absolute', top: 12, right: 15, background: 'rgba(255,255,255,0.25)', padding: '4px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '5px'}}>
            <CheckCircle size={16} /> Verified
          </div>
          <div style={{width: '90px', height: '90px', borderRadius: '50%', background: 'white', margin: '0 auto 15px auto', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '40px', border: '4px solid rgba(255,255,255,0.3)', boxShadow: '0 4px 15px rgba(0,0,0,0.1)'}}>
            😎
          </div>
          <h2 style={{fontWeight: '900', fontSize: '1.8rem', margin: '0 0 5px 0'}}>{user.username || 'User'}</h2>
          <p style={{opacity: '0.9', margin: 0, fontWeight: '600', fontSize: '0.9rem'}}>UID: {user.telegramId}</p>
        </div>
      ) : (
        <div style={{
          background: 'linear-gradient(135deg, #f97316, #ea580c)', padding: '30px 20px', borderRadius: '24px',
          color: 'white', boxShadow: '0 10px 25px rgba(234, 88, 12, 0.4)', position: 'relative', overflow: 'hidden',
          marginBottom: '25px', textAlign: 'center'
        }}>
          <div style={{position: 'absolute', top: 12, right: 15, background: 'rgba(255,255,255,0.25)', padding: '4px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '5px'}}>
            <AlertCircle size={16} /> Not Verified
          </div>
          <div style={{width: '90px', height: '90px', borderRadius: '50%', background: 'white', margin: '0 auto 15px auto', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '40px', border: '4px solid rgba(255,255,255,0.3)', boxShadow: '0 4px 15px rgba(0,0,0,0.1)'}}>
            👤
          </div>
          <h2 style={{fontWeight: '900', fontSize: '1.8rem', margin: '0 0 5px 0'}}>{user.username || 'User'}</h2>
          <p style={{opacity: '0.9', margin: 0, fontWeight: '600', fontSize: '0.9rem'}}>UID: {user.telegramId}</p>
        </div>
      )}

      {/* Balance Card */}
      <div style={{
        background: 'white', borderRadius: '20px', padding: '20px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', marginBottom: '25px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between'
      }}>
        <div>
          <p style={{color: '#6b7280', fontSize: '1.1rem', marginBottom: '5px', fontWeight: '600'}}>Total Balance</p>
          <h2 style={{color: '#1f2937', fontSize: '2.2rem', fontWeight: '900'}}>{user.balance.toFixed(2)} ৳</h2>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <button onClick={() => navigate('/withdraw')} style={{
            background: 'linear-gradient(135deg, #10b981, #059669)', color: 'white', border: 'none', 
            padding: '8px 12px', borderRadius: '10px', fontWeight: '700', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer'
          }}>
            <Wallet size={16} /> Withdraw
          </button>
          <button onClick={() => navigate('/add-fund')} style={{
            background: 'linear-gradient(135deg, #3b82f6, #2563eb)', color: 'white', border: 'none', 
            padding: '8px 12px', borderRadius: '10px', fontWeight: '700', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer'
          }}>
            <span style={{fontSize: '16px', fontWeight: 'bold'}}>+</span> Add Fund
          </button>
        </div>
      </div>

      {/* Account Verification Section (Only if not verified) */}
      {!user.isVerified && (
        <div style={{
          background: 'linear-gradient(135deg, #fef3c7, #fde68a)', borderRadius: '20px', padding: '20px',
          boxShadow: '0 4px 10px rgba(245, 158, 11, 0.15)', marginBottom: '25px', border: '1px solid #fcd34d'
        }}>
          <h3 style={{fontSize: '1.2rem', fontWeight: '800', color: '#d97706', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '5px'}}>
            <AlertCircle size={20} /> Account Not Verified
          </h3>
          <p style={{color: '#92400e', fontSize: '0.95rem', marginBottom: '15px', fontWeight: '600'}}>
            একাউন্ট ভেরিফাই করার জন্য {links.activationFee || 20} টাকা ফি প্রদান করুন। ভেরিফাই করলে আপনি ৪ জেনারেশন (৫+২+১+১) পর্যন্ত রেফার কমিশন পাবেন!
          </p>
          
          <div style={{background: 'white', padding: '15px', borderRadius: '12px', marginBottom: '15px'}}>
            <p style={{fontWeight: '700', marginBottom: '5px', color: '#374151'}}>Send {links.activationFee || 20} ৳ to any number:</p>
            <ul style={{listStyle: 'none', padding: 0, margin: 0, color: '#4b5563', fontSize: '0.95rem'}}>
              <li style={{marginBottom: '5px'}}><strong style={{color: '#e2136e'}}>bKash:</strong> {links.bkashNumber}</li>
              <li style={{marginBottom: '5px'}}><strong style={{color: '#ea580c'}}>Nagad:</strong> {links.nagadNumber}</li>
              <li><strong style={{color: '#8b5cf6'}}>Rocket:</strong> {links.rocketNumber}</li>
            </ul>
          </div>

          <input 
            type="text" 
            value={trxId}
            onChange={(e) => setTrxId(e.target.value)}
            placeholder="Enter Transaction ID (TrxID)" 
            style={{
              width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid #fbbf24',
              marginBottom: '10px', fontSize: '1rem', outline: 'none'
            }} 
          />
          <button onClick={submitVerification} style={{
            background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: 'white', 
            padding: '14px', borderRadius: '12px', fontSize: '1.1rem', fontWeight: '800', 
            width: '100%', border: 'none', boxShadow: '0 4px 10px rgba(217, 119, 6, 0.3)'
          }}>
            Submit Verification
          </button>
        </div>
      )}
    </div>
  );
};

const WithdrawPage = () => {
  const navigate = useNavigate();
  const [withdrawMethod, setWithdrawMethod] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawNumber, setWithdrawNumber] = useState('');

  return (
    <div className="home-container" style={{background: '#f3f4f6', minHeight: '100vh', padding: '20px', paddingBottom: '100px'}}>
      <div style={{display: 'flex', alignItems: 'center', marginBottom: '20px', gap: '10px'}}>
        <button onClick={() => navigate('/profile')} style={{background: 'white', border: 'none', padding: '8px', borderRadius: '12px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)'}}>
          <ChevronRight size={24} color="#374151" style={{transform: 'rotate(180deg)'}} />
        </button>
        <h2 style={{fontWeight: '900', fontSize: '1.5rem', color: '#1f2937'}}>Withdraw Funds</h2>
      </div>

      <div style={{background: 'white', borderRadius: '20px', padding: '20px', boxShadow: '0 4px 10px rgba(0,0,0,0.03)', marginBottom: '25px'}}>
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '15px'}}>
          <h3 style={{fontSize: '1.2rem', fontWeight: '800', color: '#1f2937'}}>💸 Method</h3>
          <span style={{background: '#fee2e2', color: '#ef4444', padding: '4px 10px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: '700'}}>Min: 50 ৳</span>
        </div>

        <p style={{color: '#6b7280', fontSize: '0.9rem', marginBottom: '15px'}}>Select Payment Method:</p>
        
        <div style={{display: 'flex', gap: '10px', marginBottom: '20px'}}>
          <div 
            onClick={() => setWithdrawMethod('bkash')}
            style={{flex: 1, cursor: 'pointer', textAlign: 'center', padding: '10px', borderRadius: '12px', border: withdrawMethod === 'bkash' ? '2px solid #e2136e' : '1px solid #e5e7eb', background: withdrawMethod === 'bkash' ? '#fdf2f8' : 'white'}}
          >
            <div style={{display: 'flex', justifyContent: 'center'}}><img src="https://play-lh.googleusercontent.com/ncgi2sk_NS5u8TfsEVmdaqQhRlv6D0c9JIQ-GmHvazUbp9GDU8gxNZxaq98ysy34juOmSA15KlPLjoAgquZ0nQ" alt="bKash" style={{width: '36px', height: '36px', borderRadius: '8px', margin: '0 auto 8px auto', objectFit: 'cover'}} /></div>
            <span style={{fontSize: '0.9rem', fontWeight: '700', color: '#e2136e'}}>bKash</span>
          </div>

          <div 
            onClick={() => setWithdrawMethod('nagad')}
            style={{flex: 1, cursor: 'pointer', textAlign: 'center', padding: '10px', borderRadius: '12px', border: withdrawMethod === 'nagad' ? '2px solid #ea580c' : '1px solid #e5e7eb', background: withdrawMethod === 'nagad' ? '#fff7ed' : 'white'}}
          >
            <div style={{display: 'flex', justifyContent: 'center'}}><img src="https://play-lh.googleusercontent.com/tFk8R3Fkav7fZEY8e7VJtMwtRCowaWU2Us-AmWaKnTOWBer427fPjWetoOnhrUM4nWeZb0AOEJ6lnlwJ9HRu" alt="Nagad" style={{width: '36px', height: '36px', borderRadius: '8px', margin: '0 auto 8px auto', objectFit: 'cover'}} /></div>
            <span style={{fontSize: '0.9rem', fontWeight: '700', color: '#ea580c'}}>Nagad</span>
          </div>

          <div 
            onClick={() => setWithdrawMethod('rocket')}
            style={{flex: 1, cursor: 'pointer', textAlign: 'center', padding: '10px', borderRadius: '12px', border: withdrawMethod === 'rocket' ? '2px solid #8b5cf6' : '1px solid #e5e7eb', background: withdrawMethod === 'rocket' ? '#f5f3ff' : 'white'}}
          >
            <div style={{display: 'flex', justifyContent: 'center'}}><img src="https://play-lh.googleusercontent.com/hcRpk0BWUTNPwr1bRWzNVKGZd2lbtdtNS9d__2w6glKwAUE_xvTh8FjkipEnzrlbEVCGsQ-75UwA5HRAYzHEdw" alt="Rocket" style={{width: '36px', height: '36px', borderRadius: '8px', margin: '0 auto 8px auto', objectFit: 'cover'}} /></div>
            <span style={{fontSize: '0.9rem', fontWeight: '700', color: '#8b5cf6'}}>Rocket</span>
          </div>
        </div>

        {withdrawMethod && (
          <div style={{animation: 'fadeIn 0.3s'}}>
            <input 
              type="number" 
              placeholder="Enter Amount (Min 50 ৳)" 
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(e.target.value)}
              style={{width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid #d1d5db', marginBottom: '10px', fontSize: '1rem', outline: 'none'}} 
            />
            <input 
              type="text" 
              placeholder={`Enter your ${withdrawMethod} number`} 
              value={withdrawNumber}
              onChange={(e) => setWithdrawNumber(e.target.value)}
              style={{width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid #d1d5db', marginBottom: '15px', fontSize: '1rem', outline: 'none'}} 
            />
            <button 
              onClick={() => {
                if(withdrawAmount < 50) return alert("Minimum withdraw is 50 ৳");
                if(!withdrawNumber) return alert("Please enter your account number");
                alert("Withdraw request submitted successfully!");
                setWithdrawAmount(''); setWithdrawNumber(''); setWithdrawMethod('');
                navigate('/profile');
              }}
              style={{
                background: 'linear-gradient(135deg, #10b981, #059669)', color: 'white', 
                padding: '16px', borderRadius: '12px', fontSize: '1.1rem', fontWeight: '700', 
                width: '100%', border: 'none', boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)'
              }}
            >
              Confirm Withdraw
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const AddFundPage = () => {
  const navigate = useNavigate();
  const [method, setMethod] = useState('');
  const [amount, setAmount] = useState('');
  const [senderNumber, setSenderNumber] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [links, setLinks] = useState({ bkashNumber: '', nagadNumber: '', rocketNumber: '' });

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/contact`).then(res => res.json()).then(data => setLinks(data));
  }, []);

  const handleAddFund = () => {
    if(!method || !amount || !senderNumber || !transactionId) return alert('Please fill in all fields');
    fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/fund/add`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: window.Telegram?.WebApp?.initDataUnsafe?.user?.id?.toString() || "6323700179", username: window.Telegram?.WebApp?.initDataUnsafe?.user?.first_name || 'User', amount: Number(amount), paymentMethod: method, senderNumber, transactionId })
    })
    .then(res => res.json())
    .then(data => {
      alert(data.message || 'Request submitted!');
      navigate('/profile');
    });
  };

  return (
    <div className="home-container" style={{background: '#f3f4f6', minHeight: '100vh', padding: '20px', paddingBottom: '100px'}}>
      <div style={{display: 'flex', alignItems: 'center', marginBottom: '20px', gap: '10px'}}>
        <button onClick={() => navigate('/profile')} style={{background: 'white', border: 'none', padding: '8px', borderRadius: '12px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)'}}>
          <ChevronRight size={24} color="#374151" style={{transform: 'rotate(180deg)'}} />
        </button>
        <h2 style={{fontWeight: '900', fontSize: '1.5rem', color: '#1f2937'}}>Add Fund</h2>
      </div>

      <div style={{background: 'white', borderRadius: '20px', padding: '20px', boxShadow: '0 4px 10px rgba(0,0,0,0.03)', marginBottom: '25px'}}>
        <h3 style={{fontSize: '1.1rem', fontWeight: '800', color: '#1f2937', marginBottom: '15px'}}>1. Select Method</h3>
        <div style={{display: 'flex', gap: '10px', marginBottom: '20px'}}>
          <div onClick={() => setMethod('bkash')} style={{flex: 1, cursor: 'pointer', textAlign: 'center', padding: '10px', borderRadius: '12px', border: method === 'bkash' ? '2px solid #e2136e' : '1px solid #e5e7eb'}}>
            <img src="https://play-lh.googleusercontent.com/ncgi2sk_NS5u8TfsEVmdaqQhRlv6D0c9JIQ-GmHvazUbp9GDU8gxNZxaq98ysy34juOmSA15KlPLjoAgquZ0nQ" alt="bKash" style={{width: '36px', height: '36px', borderRadius: '8px', margin: '0 auto 8px auto'}} />
            <span style={{fontSize: '0.8rem', fontWeight: '700', color: '#e2136e'}}>bKash</span>
          </div>
          <div onClick={() => setMethod('nagad')} style={{flex: 1, cursor: 'pointer', textAlign: 'center', padding: '10px', borderRadius: '12px', border: method === 'nagad' ? '2px solid #ea580c' : '1px solid #e5e7eb'}}>
            <img src="https://play-lh.googleusercontent.com/tFk8R3Fkav7fZEY8e7VJtMwtRCowaWU2Us-AmWaKnTOWBer427fPjWetoOnhrUM4nWeZb0AOEJ6lnlwJ9HRu" alt="Nagad" style={{width: '36px', height: '36px', borderRadius: '8px', margin: '0 auto 8px auto'}} />
            <span style={{fontSize: '0.8rem', fontWeight: '700', color: '#ea580c'}}>Nagad</span>
          </div>
          <div onClick={() => setMethod('rocket')} style={{flex: 1, cursor: 'pointer', textAlign: 'center', padding: '10px', borderRadius: '12px', border: method === 'rocket' ? '2px solid #8b5cf6' : '1px solid #e5e7eb'}}>
            <img src="https://play-lh.googleusercontent.com/hcRpk0BWUTNPwr1bRWzNVKGZd2lbtdtNS9d__2w6glKwAUE_xvTh8FjkipEnzrlbEVCGsQ-75UwA5HRAYzHEdw" alt="Rocket" style={{width: '36px', height: '36px', borderRadius: '8px', margin: '0 auto 8px auto'}} />
            <span style={{fontSize: '0.8rem', fontWeight: '700', color: '#8b5cf6'}}>Rocket</span>
          </div>
        </div>

        {method && (
          <div style={{animation: 'fadeIn 0.3s'}}>
            <div style={{background: '#eff6ff', padding: '15px', borderRadius: '12px', marginBottom: '20px', border: '1px dashed #3b82f6'}}>
              <p style={{fontSize: '0.9rem', color: '#1f2937', marginBottom: '5px'}}>Send money to this {method} number:</p>
              <h3 style={{fontSize: '1.4rem', fontWeight: '900', color: '#3b82f6', letterSpacing: '1px'}}>
                {method === 'bkash' ? links.bkashNumber : method === 'nagad' ? links.nagadNumber : links.rocketNumber}
              </h3>
            </div>

            <h3 style={{fontSize: '1.1rem', fontWeight: '800', color: '#1f2937', marginBottom: '15px'}}>2. Submit Details</h3>
            <input type="number" placeholder="Amount Sent (৳)" value={amount} onChange={e => setAmount(e.target.value)} style={{width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #d1d5db', marginBottom: '10px'}} />
            <input type="text" placeholder="Sender Number" value={senderNumber} onChange={e => setSenderNumber(e.target.value)} style={{width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #d1d5db', marginBottom: '10px'}} />
            <input type="text" placeholder="Transaction ID (TrxID)" value={transactionId} onChange={e => setTransactionId(e.target.value)} style={{width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #d1d5db', marginBottom: '20px'}} />
            
            <button onClick={handleAddFund} style={{background: '#3b82f6', color: 'white', padding: '14px', borderRadius: '10px', fontWeight: '800', width: '100%', border: 'none'}}>Submit Request</button>
          </div>
        )}
      </div>
    </div>
  );
};

const SellCoinPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const coinType = params.get('type') || 'unknown';
  const coinName = params.get('name') || 'Coin';
  const [coinPrice, setCoinPrice] = useState(0);
  const [minAmount, setMinAmount] = useState(1000);
  const [targetUser, setTargetUser] = useState('');
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [paymentNumber, setPaymentNumber] = useState('');
  const [senderDetails, setSenderDetails] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [step, setStep] = useState(1);
  const coinColor = params.get('color') || '#3b82f6';
  const [tutorialVideo, setTutorialVideo] = useState('');
  
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/coins`)
      .then(res => res.json())
      .then(data => {
        console.log('Coins fetched:', data);
        if (Array.isArray(data)) {
          const found = data.find(c => c.coinId === coinType);
          console.log('Found coin:', found, 'coinType:', coinType);
          if (found) {
            setCoinPrice(found.price);
            setMinAmount(found.minAmount || 1000);
            setTargetUser(found.targetUser || '');
            setTutorialVideo(found.tutorialVideo || '');
          }
        }
      }).catch(err => console.error('Fetch coins error:', err));
  }, [coinType]);

  const handleNext = () => {
    if (Number(amount) < minAmount) return alert(`Minimum sell amount is ${minAmount} coins.`);
    if (!paymentMethod || !paymentNumber) return alert("Payment method এবং account number দিন।");
    if (!senderDetails) return alert(`আপনার ${coinName} Username দিন — কোন ID থেকে কয়েন পাঠিয়েছেন।`);
    setStep(2);
  };

  const handleSell = () => {
    if (!senderDetails) return alert("Please enter your App ID or Sender Username.");

    fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/coin/sell`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: window.Telegram?.WebApp?.initDataUnsafe?.user?.first_name || 'User', username: window.Telegram?.WebApp?.initDataUnsafe?.user?.first_name || 'User',
        coinType, amount: Number(amount), paymentMethod, paymentNumber, senderDetails, couponCode
      })
    })
    .then(res => res.json())
    .then(data => {
      alert("Coin sell request submitted successfully!");
      navigate('/');
    })
    .catch(err => console.error(err));
  };

  const totalTaka = (Number(amount) / 1000) * coinPrice;

  return (
    <div className="home-container" style={{background: '#f3f4f6', minHeight: '100vh', padding: '20px', paddingBottom: '100px'}}>
      <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px'}}>
        <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
          <button onClick={() => { if(step === 2) setStep(1); else navigate('/market'); }} style={{background: 'white', border: 'none', padding: '8px', borderRadius: '12px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)', cursor: 'pointer'}}>
            <ChevronRight size={24} color="#374151" style={{transform: 'rotate(180deg)'}} />
          </button>
          <h2 style={{fontWeight: '900', fontSize: '1.5rem', color: '#1f2937'}}>Sell {coinName}</h2>
        </div>
        {tutorialVideo && (
          <a href={tutorialVideo} target="_blank" rel="noopener noreferrer" style={{fontSize:'0.8rem', fontWeight:'700', color:'#ec4899', textDecoration:'none', display:'flex', alignItems:'center', gap:'5px', background:'white', padding:'6px 12px', borderRadius:'20px', boxShadow:'0 2px 5px rgba(0,0,0,0.05)'}}>
            <PlayCircle size={16} /> ভিডিও দেখুন
          </a>
        )}
      </div>

      <div style={{background: 'white', borderRadius: '20px', padding: '20px', boxShadow: '0 4px 10px rgba(0,0,0,0.03)', borderTop: `6px solid ${coinColor}`}}>
        
        {step === 1 ? (
          <>
            <div style={{textAlign: 'center', marginBottom: '20px'}}>
              <h3 style={{fontSize: '2rem', fontWeight: '900', color: coinColor}}>{coinPrice} ৳</h3>
              <p style={{fontSize: '0.9rem', color: '#6b7280', fontWeight: '600'}}>Rate per 1,000 Coins</p>
            </div>

            <div style={{marginBottom: '15px'}}>
              <label style={{display: 'block', fontSize: '0.9rem', fontWeight: '700', color: '#374151', marginBottom: '5px'}}>Coin Amount</label>
              <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder={`Min ${minAmount}`} style={{width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid #d1d5db', fontSize: '1rem', outline: 'none'}} />
            </div>

            <div style={{marginBottom: '15px'}}>
              <label style={{display: 'block', fontSize: '0.9rem', fontWeight: '700', color: '#374151', marginBottom: '5px'}}>Payment Method</label>
              <div style={{display: 'flex', gap: '10px'}}>
                {/* bKash */}
                <div onClick={() => setPaymentMethod('bkash')} style={{flex: 1, cursor: 'pointer', textAlign: 'center', padding: '10px', borderRadius: '12px', border: paymentMethod === 'bkash' ? `2px solid ${coinColor}` : '1px solid #e5e7eb', background: paymentMethod === 'bkash' ? '#f8fafc' : 'white'}}>
                  <img src="https://play-lh.googleusercontent.com/ncgi2sk_NS5u8TfsEVmdaqQhRlv6D0c9JIQ-GmHvazUbp9GDU8gxNZxaq98ysy34juOmSA15KlPLjoAgquZ0nQ" alt="bKash" style={{width: '36px', height: '36px', borderRadius: '8px', margin: '0 auto 8px auto', objectFit: 'cover'}} />
                  <span style={{fontSize: '0.8rem', fontWeight: '700', color: paymentMethod === 'bkash' ? coinColor : '#e2136e', display: 'block'}}>bKash</span>
                </div>
                {/* Nagad */}
                <div onClick={() => setPaymentMethod('nagad')} style={{flex: 1, cursor: 'pointer', textAlign: 'center', padding: '10px', borderRadius: '12px', border: paymentMethod === 'nagad' ? `2px solid ${coinColor}` : '1px solid #e5e7eb', background: paymentMethod === 'nagad' ? '#f8fafc' : 'white'}}>
                  <img src="https://play-lh.googleusercontent.com/tFk8R3Fkav7fZEY8e7VJtMwtRCowaWU2Us-AmWaKnTOWBer427fPjWetoOnhrUM4nWeZb0AOEJ6lnlwJ9HRu" alt="Nagad" style={{width: '36px', height: '36px', borderRadius: '8px', margin: '0 auto 8px auto', objectFit: 'cover'}} />
                  <span style={{fontSize: '0.8rem', fontWeight: '700', color: paymentMethod === 'nagad' ? coinColor : '#ea580c', display: 'block'}}>Nagad</span>
                </div>
                {/* Rocket */}
                <div onClick={() => setPaymentMethod('rocket')} style={{flex: 1, cursor: 'pointer', textAlign: 'center', padding: '10px', borderRadius: '12px', border: paymentMethod === 'rocket' ? `2px solid ${coinColor}` : '1px solid #e5e7eb', background: paymentMethod === 'rocket' ? '#f8fafc' : 'white'}}>
                  <img src="https://play-lh.googleusercontent.com/hcRpk0BWUTNPwr1bRWzNVKGZd2lbtdtNS9d__2w6glKwAUE_xvTh8FjkipEnzrlbEVCGsQ-75UwA5HRAYzHEdw" alt="Rocket" style={{width: '36px', height: '36px', borderRadius: '8px', margin: '0 auto 8px auto', objectFit: 'cover'}} />
                  <span style={{fontSize: '0.8rem', fontWeight: '700', color: paymentMethod === 'rocket' ? coinColor : '#8b5cf6', display: 'block'}}>Rocket</span>
                </div>
              </div>
            </div>

            <div style={{marginBottom: '20px'}}>
              <label style={{display: 'block', fontSize: '0.9rem', fontWeight: '700', color: '#374151', marginBottom: '5px'}}>Account Number</label>
              <input type="text" value={paymentNumber} onChange={e => setPaymentNumber(e.target.value)} placeholder="01XXXXXXXXX" style={{width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid #d1d5db', fontSize: '1rem', outline: 'none'}} />
            </div>

            {/* Admin ID to send coins to */}
            {targetUser && (
              <div style={{background: 'linear-gradient(135deg, #eff6ff, #dbeafe)', padding: '15px', borderRadius: '14px', marginBottom: '15px', border: `2px solid ${coinColor}`}}>
                <p style={{fontSize: '0.75rem', fontWeight: '800', color: '#6b7280', textTransform: 'uppercase', marginBottom: '6px', letterSpacing: '0.05em'}}>📤 এই ID তে কয়েন পাঠান</p>
                <span style={{fontWeight: '900', fontSize: '1.3rem', color: coinColor, userSelect: 'all', wordBreak: 'break-all', display: 'block'}}>{targetUser}</span>
                <p style={{fontSize: '0.75rem', color: '#6b7280', marginTop: '4px'}}>উপরের ID তে কয়েন পাঠিয়ে নিচে আপনার ID দিন</p>
              </div>
            )}

            {/* Sender ID field */}
            <div style={{marginBottom: '15px'}}>
              <label style={{display: 'block', fontSize: '0.9rem', fontWeight: '700', color: '#374151', marginBottom: '5px'}}>আপনার যে {coinName} ID থেকে পাঠিয়েছেন</label>
              <input type="text" value={senderDetails} onChange={e => setSenderDetails(e.target.value)} placeholder={`আপনার ${coinName} Username / ID`} style={{width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid #d1d5db', fontSize: '1rem', outline: 'none'}} />
              <p style={{fontSize: '0.75rem', color: '#6b7280', marginTop: '4px'}}>কোন ID থেকে কয়েন পাঠিয়েছেন সেটা লিখুন</p>
            </div>

            <div style={{background: '#f3f4f6', padding: '15px', borderRadius: '12px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
              <span style={{fontWeight: '700', color: '#4b5563'}}>You will receive:</span>
              <span style={{fontWeight: '900', color: '#10b981', fontSize: '1.2rem'}}>{totalTaka > 0 ? totalTaka.toFixed(2) : '0.00'} ৳</span>
            </div>

            <button onClick={handleNext} style={{
              background: coinColor, color: 'white', padding: '16px', borderRadius: '12px', fontSize: '1.1rem', fontWeight: '800', width: '100%', border: 'none', boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
            }}>
              Next Step
            </button>
          </>
        ) : (
          <>
            {/* Summary box */}
            <div style={{background: '#f0fdf4', borderRadius: '14px', padding: '16px', marginBottom: '18px', border: '1px solid #86efac'}}>
              <h3 style={{fontWeight: '800', color: '#15803d', marginBottom: '12px', fontSize: '1rem'}}>✅ রিকোয়েস্ট সারাংশ</h3>
              <div style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>
                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                  <span style={{color: '#6b7280', fontSize: '0.85rem'}}>কয়েন পরিমাণ</span>
                  <span style={{fontWeight: '800', color: '#1f2937'}}>{amount} Coins</span>
                </div>
                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                  <span style={{color: '#6b7280', fontSize: '0.85rem'}}>পাবেন</span>
                  <span style={{fontWeight: '800', color: '#10b981'}}>{totalTaka.toFixed(2)} ৳</span>
                </div>
                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                  <span style={{color: '#6b7280', fontSize: '0.85rem'}}>Payment Method</span>
                  <span style={{fontWeight: '800', color: '#1f2937', textTransform: 'capitalize'}}>{paymentMethod}</span>
                </div>
                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                  <span style={{color: '#6b7280', fontSize: '0.85rem'}}>Account No.</span>
                  <span style={{fontWeight: '800', color: '#1f2937'}}>{paymentNumber}</span>
                </div>
                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                  <span style={{color: '#6b7280', fontSize: '0.85rem'}}>পাঠানো ID</span>
                  <span style={{fontWeight: '800', color: '#2563eb'}}>{senderDetails}</span>
                </div>
              </div>
            </div>

            {/* Admin ID reminder */}
            <div style={{background: '#eff6ff', padding: '14px', borderRadius: '12px', border: `2px solid ${coinColor}`, marginBottom: '18px', textAlign: 'center'}}>
              <p style={{fontSize: '0.8rem', color: '#6b7280', marginBottom: '4px', fontWeight: '700'}}>📤 আপনি কি এই ID তে কয়েন পাঠিয়েছেন?</p>
              <span style={{fontWeight: '900', fontSize: '1.2rem', color: coinColor, userSelect: 'all'}}>
                {targetUser || <span style={{color:'#ef4444'}}>⚠️ Admin ID নেই</span>}
              </span>
            </div>

            {coinType === 'topfollower' && (
              <div style={{marginBottom: '18px'}}>
                <label style={{display: 'block', fontSize: '0.9rem', fontWeight: '700', color: '#374151', marginBottom: '5px'}}>Coupon Code (Optional)</label>
                <input type="text" value={couponCode} onChange={e => setCouponCode(e.target.value)} placeholder="Enter coupon code if any" style={{width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid #d1d5db', fontSize: '1rem', outline: 'none'}} />
              </div>
            )}

            <button onClick={handleSell} style={{
              background: '#10b981', color: 'white', padding: '16px', borderRadius: '12px', fontSize: '1.1rem', fontWeight: '800', width: '100%', border: 'none', boxShadow: '0 4px 10px rgba(16,185,129,0.2)'
            }}>
              ✅ Submit Request
            </button>
          </>
        )}
      </div>
    </div>
  );
};

const HistoryPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const initialTab = searchParams.get('tab') || 'coin';
  const [activeTab, setActiveTab] = useState(initialTab);

  return (
    <div style={{background: '#f3f4f6', minHeight: '100vh', padding: '20px', paddingBottom: '100px'}}>
      <div style={{display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px'}}>
        <button onClick={() => navigate(-1)} style={{background: 'white', border: 'none', padding: '8px', borderRadius: '12px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)', cursor: 'pointer'}}>
          <ChevronRight size={24} color="#374151" style={{transform: 'rotate(180deg)'}} />
        </button>
        <h2 style={{fontWeight: '900', fontSize: '1.5rem', color: '#1f2937', margin: 0}}>History</h2>
      </div>

      <div style={{display: 'flex', gap: '10px', marginBottom: '20px', background: 'white', padding: '5px', borderRadius: '14px', boxShadow: '0 2px 10px rgba(0,0,0,0.02)'}}>
        <button onClick={() => setActiveTab('coin')} style={{flex: 1, padding: '12px', borderRadius: '10px', border: 'none', background: activeTab === 'coin' ? '#eff6ff' : 'transparent', color: activeTab === 'coin' ? '#2563eb' : '#6b7280', fontWeight: '800', cursor: 'pointer', transition: 'all 0.2s'}}>💰 Coin Sell</button>
        <button onClick={() => setActiveTab('work')} style={{flex: 1, padding: '12px', borderRadius: '10px', border: 'none', background: activeTab === 'work' ? '#f5f3ff' : 'transparent', color: activeTab === 'work' ? '#8b5cf6' : '#6b7280', fontWeight: '800', cursor: 'pointer', transition: 'all 0.2s'}}>💼 Work History</button>
      </div>

      {activeTab === 'coin' && (
        <div style={{textAlign: 'center', padding: '40px 20px', background: 'white', borderRadius: '16px'}}>
          <div style={{fontSize: '3rem', marginBottom: '10px'}}>📄</div>
          <h3 style={{color: '#374151', fontWeight: '800'}}>No Coin Sell History</h3>
          <p style={{color: '#9ca3af', fontSize: '0.9rem'}}>You haven't sold any coins yet.</p>
        </div>
      )}

      {activeTab === 'work' && (
        <div style={{textAlign: 'center', padding: '40px 20px', background: 'white', borderRadius: '16px'}}>
          <div style={{fontSize: '3rem', marginBottom: '10px'}}>🛠️</div>
          <h3 style={{color: '#374151', fontWeight: '800'}}>No Work History</h3>
          <p style={{color: '#9ca3af', fontSize: '0.9rem'}}>You haven't completed any tasks yet.</p>
        </div>
      )}
    </div>
  );
};

const Invite = () => {
  // Hardcoded for local testing, in production use Telegram WebApp initData
  const myTelegramId = window.Telegram?.WebApp?.initDataUnsafe?.user?.id?.toString() || "6323700179"; 
  const referralLink = `https://t.me/PowerStartWork_Bot?start=ref_${myTelegramId}`;
  
  const [stats, setStats] = React.useState({ totalReferrals: 0, totalEarned: 0, referrals: [] });

  React.useEffect(() => {
    fetch(`http://localhost:5000/api/referrals/${myTelegramId}`)
      .then(res => res.json())
      .then(data => {
        if (!data.error) setStats(data);
      })
      .catch(err => console.error(err));
  }, []);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink);
    alert("Copied to clipboard!");
  };

  return (
    <div className="home-container" style={{background: '#f3f4f6', minHeight: '100vh', padding: '20px', paddingBottom: '100px'}}>
      
      {/* Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #f59e0b, #d97706)', 
        borderRadius: '20px', 
        padding: '25px 20px', 
        color: 'white',
        boxShadow: '0 10px 25px rgba(245, 158, 11, 0.4)',
        marginBottom: '25px',
        textAlign: 'center'
      }}>
        <Gift size={40} style={{margin: '0 auto 10px auto'}} />
        <h2 style={{fontSize: '1.6rem', fontWeight: '900', marginBottom: '5px'}}>Invite & Earn!</h2>
        <p style={{fontSize: '1rem', opacity: '0.9', fontWeight: '600'}}>Earn up to 4 generations of commission (5৳, 2৳, 1৳, 1৳) when your friends verify their account!</p>
        <div style={{background: 'rgba(0,0,0,0.2)', padding: '12px', borderRadius: '12px', marginTop: '15px', border: '1px solid rgba(255,255,255,0.3)'}}>
          <p style={{fontSize: '0.85rem', fontWeight: '700', margin: 0, display: 'flex', alignItems: 'flex-start', gap: '8px', textAlign: 'left'}}>
            <AlertCircle size={24} style={{flexShrink: 0, marginTop: '-2px'}}/>
            <span><strong>গুরুত্বপূর্ণ:</strong> আপনার রেফার করা ইউজার যদি একাউন্ট অ্যাক্টিভ (verify) করে, শুধুমাত্র তখনই আপনি কমিশন পাবেন এবং রেফারটি সফল হিসেবে গণ্য হবে। একাউন্ট অ্যাক্টিভ না করলে তা কাউন্ট হবে না।</span>
          </p>
        </div>
      </div>

      {/* Invite Link Box */}
      <div style={{background: 'white', borderRadius: '20px', padding: '20px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', marginBottom: '25px'}}>
        <h3 style={{fontSize: '1.1rem', fontWeight: '700', color: '#374151', marginBottom: '10px'}}>Your Referral Link</h3>
        <div style={{
          display: 'flex', alignItems: 'center', background: '#f3f4f6', padding: '12px', 
          borderRadius: '12px', border: '1px dashed #d1d5db', marginBottom: '15px'
        }}>
          <input 
            type="text" 
            value={referralLink} 
            readOnly 
            style={{flex: 1, background: 'transparent', border: 'none', outline: 'none', color: '#4b5563', fontSize: '0.9rem'}} 
          />
          <button onClick={copyToClipboard} style={{background: '#a855f7', color: 'white', padding: '8px 12px', borderRadius: '8px', marginLeft: '10px', display: 'flex', alignItems: 'center', gap: '5px'}}>
            <Copy size={16} /> Copy
          </button>
        </div>
        <a 
          href={`https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=${encodeURIComponent('Join and earn money!')}`}
          target="_blank"
          rel="noreferrer"
          style={{
            display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px',
            background: '#3b82f6', color: 'white', padding: '12px', borderRadius: '12px', 
            fontWeight: '700', textDecoration: 'none'
          }}
        >
          <Share2 size={20}/> Share to Telegram
        </a>
      </div>

      {/* Stats Box */}
      <div style={{display: 'flex', gap: '15px', marginBottom: '25px'}}>
        <div style={{flex: 1, background: 'white', padding: '20px', borderRadius: '20px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', textAlign: 'center'}}>
          <p style={{color: '#6b7280', fontSize: '0.9rem', fontWeight: '600'}}>Total Invites</p>
          <h2 style={{color: '#3b82f6', fontSize: '2rem', fontWeight: '900'}}>{stats.totalReferrals}</h2>
        </div>
        <div style={{flex: 1, background: 'white', padding: '20px', borderRadius: '20px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', textAlign: 'center'}}>
          <p style={{color: '#6b7280', fontSize: '0.9rem', fontWeight: '600'}}>Total Earned</p>
          <h2 style={{color: '#10b981', fontSize: '2rem', fontWeight: '900'}}>{stats.totalEarned} ৳</h2>
        </div>
      </div>

      {/* Referrals List */}
      <h3 style={{color: '#1f2937', marginBottom: '15px', fontWeight: '800', fontSize: '1.3rem'}}>👥 My Referrals</h3>
      
      {stats.referrals.length === 0 ? (
        <div style={{background: 'white', borderRadius: '20px', padding: '20px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', textAlign: 'center', color: '#6b7280'}}>
          <UsersIcon size={40} style={{margin: '0 auto 10px auto', opacity: 0.5}} />
          <p>No referrals yet. Share your link to start earning!</p>
        </div>
      ) : (
        <div style={{background: 'white', borderRadius: '20px', padding: '10px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)'}}>
          {stats.referrals.map((ref, idx) => (
            <div key={idx} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
              padding: '15px', borderBottom: idx !== stats.referrals.length - 1 ? '1px solid #f3f4f6' : 'none'
            }}>
              <div>
                <p style={{fontWeight: '700', color: '#1f2937', fontSize: '1.05rem'}}>@{ref.username || 'User'}</p>
                <span style={{fontSize: '0.8rem', color: ref.isVerified ? '#10b981' : '#f59e0b', fontWeight: '600'}}>
                  {ref.isVerified ? '✅ Verified (Earned 5৳)' : '⏳ Pending'}
                </span>
              </div>
              <div style={{color: '#6b7280', fontSize: '0.85rem'}}>
                {new Date(ref.createdAt).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};

// Reusable component for the 5 specified jobs
// Helper: Extract YouTube video ID from any YouTube URL format
const getYouTubeId = (input) => {
  if (!input) return '';
  const s = input.trim();
  // Already a plain ID (11 chars)
  if (/^[a-zA-Z0-9_-]{11}$/.test(s)) return s;
  try {
    const url = new URL(s);
    if (url.hostname === 'youtu.be') return url.pathname.slice(1).split('?')[0];
    if (url.hostname.includes('youtube.com')) {
      // Shorts: youtube.com/shorts/VIDEO_ID
      if (url.pathname.includes('/shorts/')) return url.pathname.split('/shorts/')[1].split('?')[0];
      if (url.pathname.includes('/embed/')) return url.pathname.split('/embed/')[1].split('?')[0];
      return url.searchParams.get('v') || '';
    }
  } catch (e) {}
  // Fallback regex — catches youtu.be/ID, watch?v=ID, shorts/ID
  const match = s.match(/(?:v=|youtu\.be\/|embed\/|shorts\/)([a-zA-Z0-9_-]{11})/);
  return match ? match[1] : s;
};

const JobDetailTemplate = ({ job }) => {
  return (
    <div style={{ padding: '20px', paddingBottom: '100px', backgroundColor: '#f3f4f6', minHeight: '100vh' }}>
      
      {/* Title */}
      <h2 style={{ textAlign: 'center', fontWeight: '900', fontSize: '1.8rem', color: '#1f2937', marginBottom: '20px' }}>
        {job.title}
      </h2>

      {/* Account Section */}
      <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '20px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)', marginBottom: '20px' }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#8b5cf6', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '15px' }}>
          <PlayCircle size={24} /> কিভাবে একাউন্ট করবেন 
        </h3>
        <div className="video-wrapper" style={{ borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>
          {getYouTubeId(job.accountVideo) ? (
            <iframe 
              src={`https://www.youtube.com/embed/${getYouTubeId(job.accountVideo)}`} 
              style={{ width: '100%', height: '100%', border: 'none' }} 
              allowFullScreen 
            />
          ) : (
            <div style={{background:'#f3f4f6', padding:'30px', textAlign:'center', color:'#9ca3af', borderRadius:'12px'}}>ভিডিও সেট করা হয়নি</div>
          )}
        </div>
        {job.regLink && (
          <a 
            href={job.regLink} 
            target="_blank" 
            rel="noreferrer"
            style={{
              display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px',
              background: 'linear-gradient(135deg, #3b82f6, #2563eb)', color: 'white',
              padding: '14px', borderRadius: '14px', fontSize: '1.1rem', fontWeight: '700',
              marginTop: '15px', boxShadow: '0 6px 15px rgba(59, 130, 246, 0.3)'
            }}
          >
            রেজিষ্ট্রেশন লিংক <ExternalLink size={20} />
          </a>
        )}
      </div>

      {/* Work Section (If exists) */}
      {job.workVideo && (
        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '20px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '15px' }}>
            <PlayCircle size={24} /> কিভাবে কাজ করবেন
          </h3>
          <div className="video-wrapper" style={{ borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>
            {getYouTubeId(job.workVideo) ? (
              <iframe 
                src={`https://www.youtube.com/embed/${getYouTubeId(job.workVideo)}`} 
                style={{ width: '100%', height: '100%', border: 'none' }} 
                allowFullScreen 
              />
            ) : (
              <div style={{background:'#f3f4f6', padding:'30px', textAlign:'center', color:'#9ca3af', borderRadius:'12px'}}>ভিডিও সেট করা হয়নি</div>
            )}
          </div>
        </div>
      )}

      {/* Withdraw Section */}
      <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '20px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)', marginBottom: '20px' }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#10b981', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '15px' }}>
          <DollarSign size={24} /> কিভাবে উইথড্র করবেন
        </h3>
        <div className="video-wrapper" style={{ borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>
          {getYouTubeId(job.withdrawVideo) ? (
            <iframe 
              src={`https://www.youtube.com/embed/${getYouTubeId(job.withdrawVideo)}`} 
              style={{ width: '100%', height: '100%', border: 'none' }} 
              allowFullScreen 
            />
          ) : (
            <div style={{background:'#f3f4f6', padding:'30px', textAlign:'center', color:'#9ca3af', borderRadius:'12px'}}>ভিডিও সেট করা হয়নি</div>
          )}
        </div>
      </div>

    </div>
  );
};

const TopFollowWork = () => (
  <div>
    <div className="topfollow-pink">
      <div className="tf-title">Top Follow Work</div>
      <div className="tf-subtitle"><span>📲</span> কাজ করার জন্য কিভাবে একাউন্ট করবেন নিচের ভিডিও টি দেখুন !</div>
      <div className="video-wrapper" style={{borderRadius: '12px', border: '1px solid #000'}}>
        <iframe src="https://www.youtube.com/embed/PjN0Xv7Bnp4" style={{width: '100%', height: '100%', border: 'none', borderRadius: '12px'}} allowFullScreen />
      </div>
      <button className="app-link-btn">App Link <Download size={16} /></button>
    </div>
    <div className="topfollow-green">
      <div className="tg-title"><span>💸</span> কিভাবে বেশি ইনকাম করতে পারবেন নিচের ভিডিও টি দেখুন !</div>
      <div className="video-wrapper" style={{borderRadius: '12px', border: '1px solid #000'}}>
        <iframe src="https://www.youtube.com/embed/r9k0tESYuyQ" style={{width: '100%', height: '100%', border: 'none', borderRadius: '12px'}} allowFullScreen />
      </div>
    </div>
  </div>
);



const ContactPage = () => {
  const [links, setLinks] = useState({ supportLink: '', telegramChannel: '', youtubeChannel: '' });
  const [openFaq, setOpenFaq] = useState(null);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/contact`)
      .then(res => res.json())
      .then(data => setLinks(data))
      .catch(err => console.error(err));
  }, []);

  const faqs = [
    {
      q: "কিভাবে একাউন্ট ভেরিফাই করবো?",
      a: "Profile অপশনে গিয়ে ২০ টাকা ফি পাঠিয়ে TrxID সাবমিট করলেই কিছুক্ষণের মধ্যে অ্যাডমিন প্যানেল থেকে আপনার একাউন্ট ভেরিফাই করে দেওয়া হবে।"
    },
    {
      q: "রেফার করে কত টাকা ইনকাম করা যায়?",
      a: "আপনি ৪ জেনারেশন পর্যন্ত রেফার কমিশন পাবেন। অর্থাৎ আপনার রেফার করা ইউজাররা যখন একাউন্ট ভেরিফাই করবে তখন আপনি ৫৳, ২৳, ১৳, এবং ১৳ করে কমিশন পাবেন।"
    },
    {
      q: "আমি কিভাবে টাকা তুলবো?",
      a: "আপনার ব্যালেন্স একটি নির্দিষ্ট পরিমাণ হলে Profile অপশন থেকে সরাসরি বিকাশ, নগদ বা রকেটের মাধ্যমে খুব সহজেই টাকা উইথড্র করতে পারবেন।"
    },
    {
      q: "আমি কাজগুলো কিভাবে শিখবো?",
      a: "হোম পেইজে থাকা যেকোনো কাজে ক্লিক করলে ভিতরে টিউটোরিয়াল ভিডিও দেওয়া আছে। ভিডিওগুলো দেখলে আপনি খুব সহজেই কাজ শিখতে পারবেন।"
    }
  ];

  return (
    <div className="home-container" style={{background: '#f3f4f6', minHeight: '100vh', padding: '20px', paddingBottom: '100px'}}>
      
      {/* Contact Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #3b82f6, #0ea5e9)', 
        borderRadius: '20px', 
        padding: '25px 20px', 
        color: 'white',
        boxShadow: '0 10px 25px rgba(59, 130, 246, 0.4)',
        marginBottom: '25px',
        textAlign: 'center'
      }}>
        <MessageSquare size={40} style={{margin: '0 auto 10px auto'}} />
        <h2 style={{fontSize: '1.6rem', fontWeight: '900', marginBottom: '5px'}}>Contact Support</h2>
        <p style={{fontSize: '1rem', opacity: '0.9', fontWeight: '500'}}>Get in touch with us for any help or inquiries.</p>
      </div>
      
      {/* Contact Links */}
      <div style={{display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '30px'}}>
        <a href={links.supportLink || '#'} target="_blank" rel="noreferrer" style={{background: 'white', padding: '15px 20px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 4px 10px rgba(0,0,0,0.03)', color: '#4f46e5', fontWeight: '700', textDecoration: 'none'}}>
          <div style={{display: 'flex', alignItems: 'center', gap: '15px'}}>
            <div style={{background: '#e0e7ff', padding: '10px', borderRadius: '12px'}}><MessageSquare size={24} /></div>
            <span style={{fontSize: '1.1rem', color: '#1f2937'}}>Admin Support</span>
          </div>
          <ChevronRight size={20} color="#9ca3af" />
        </a>
        <a href={links.telegramChannel || '#'} target="_blank" rel="noreferrer" style={{background: 'white', padding: '15px 20px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 4px 10px rgba(0,0,0,0.03)', color: '#0ea5e9', fontWeight: '700', textDecoration: 'none'}}>
          <div style={{display: 'flex', alignItems: 'center', gap: '15px'}}>
            <div style={{background: '#e0f2fe', padding: '10px', borderRadius: '12px'}}><UsersIcon size={24} /></div>
            <span style={{fontSize: '1.1rem', color: '#1f2937'}}>Join Telegram Channel</span>
          </div>
          <ChevronRight size={20} color="#9ca3af" />
        </a>
        <a href={links.youtubeChannel || '#'} target="_blank" rel="noreferrer" style={{background: 'white', padding: '15px 20px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 4px 10px rgba(0,0,0,0.03)', color: '#ef4444', fontWeight: '700', textDecoration: 'none'}}>
          <div style={{display: 'flex', alignItems: 'center', gap: '15px'}}>
            <div style={{background: '#fee2e2', padding: '10px', borderRadius: '12px'}}><PlayCircle size={24} /></div>
            <span style={{fontSize: '1.1rem', color: '#1f2937'}}>Subscribe YouTube</span>
          </div>
          <ChevronRight size={20} color="#9ca3af" />
        </a>
      </div>

      {/* FAQ Section */}
      <h3 style={{color: '#1f2937', marginBottom: '15px', fontWeight: '800', fontSize: '1.3rem'}}>🤔 Frequently Asked Questions</h3>
      <div style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
        {faqs.map((faq, idx) => (
          <div key={idx} style={{background: 'white', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 10px rgba(0,0,0,0.03)'}}>
            <div 
              onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
              style={{padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', background: openFaq === idx ? '#f8fafc' : 'white'}}
            >
              <h4 style={{fontWeight: '700', color: '#374151', fontSize: '1rem', margin: 0}}>{faq.q}</h4>
              <span style={{color: '#6b7280', transform: openFaq === idx ? 'rotate(90deg)' : 'rotate(0)', transition: 'transform 0.2s'}}>
                <ChevronRight size={20} />
              </span>
            </div>
            {openFaq === idx && (
              <div style={{padding: '15px 20px', color: '#4b5563', fontSize: '0.95rem', borderTop: '1px solid #f3f4f6', background: '#f8fafc', lineHeight: '1.5'}}>
                {faq.a}
              </div>
            )}
          </div>
        ))}
      </div>

    </div>
  );
};

const AdminPanel = () => {
  const [links, setLinks] = useState({ supportLink: '', telegramChannel: '', youtubeChannel: '', bkashNumber: '', nagadNumber: '', rocketNumber: '', activationFee: 20 });
  const [newAdmin, setNewAdmin] = useState('');
  const [stats, setStats] = useState({ totalUsers: 0, pendingVerifications: 0, pendingWithdraws: 0, verifications: [], withdraws: [] });
  const [tasksConfig, setTasksConfig] = useState([]);
  const [coinRequests, setCoinRequests] = useState([]);
  const [fundRequests, setFundRequests] = useState([]);
  const [coins, setCoins] = useState([]);
  const [marketConfig, setMarketConfig] = useState({ marketIsVisible: true });
  
  const [searchId, setSearchId] = useState('');
  const [searchedUser, setSearchedUser] = useState(null);
  const [balanceInput, setBalanceInput] = useState('');

  const [activeTab, setActiveTab] = useState('dashboard'); // dashboard, users, tasks, contact
  const [coinTab, setCoinTab] = useState('requests');
  
  const fetchConfig = () => {
    fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/config`).then(res => res.json()).then(data => setMarketConfig(data));
  };

  const fetchFundRequests = () => {
    fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/admin/fund-requests`).then(res => res.json()).then(data => setFundRequests(Array.isArray(data) ? data : []));
  };

  const fetchCoins = () => {
    fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/coins`).then(res => res.json()).then(data => setCoins(Array.isArray(data) ? data : []));
  };

  const fetchCoinRequests = () => {
    fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/admin/coin-requests`).then(res => res.json()).then(data => setCoinRequests(Array.isArray(data) ? data : []));
  };

  const fetchStats = () => {
    fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/admin/stats`).then(res => res.json()).then(data => {
      if (!data.error && data.verifications) setStats(data);
    }).catch(err => console.error(err));
  };

  const fetchTasks = () => {
    fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/tasks`)
      .then(res => res.json())
      .then(data => {
        const tasksArray = Array.isArray(data) ? data : [];
        const defaultTasks = Object.keys(jobData).map(key => {
          const found = tasksArray.find(t => t.taskId === key);
          return found || { taskId: key, title: jobData[key].title, accountVideo: '', workVideo: '', withdrawVideo: '', regLink: '' };
        });
        setTasksConfig(defaultTasks);
      }).catch(() => {
        const defaultTasks = Object.keys(jobData).map(key => ({
          taskId: key, title: jobData[key].title, accountVideo: '', workVideo: '', withdrawVideo: '', regLink: ''
        }));
        setTasksConfig(defaultTasks);
      });
  };

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/contact`).then(res => res.json()).then(data => setLinks(data)).catch(() => {});
    fetchStats();
    fetchTasks();
    fetchCoinRequests();
    fetchFundRequests();
    fetchCoins();
    fetchConfig();
  }, []);

  const saveContact = () => {
    fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/admin/contact`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(links)
    }).then(() => alert('Settings saved!'));
  };

  const addAdmin = () => {
    fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/admin/add`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ newAdminId: newAdmin })
    }).then(res => res.json()).then(data => { alert(data.message || data.error); setNewAdmin(''); });
  };

  const searchUser = () => {
    fetch(`http://localhost:5000/api/admin/user/${searchId}`)
      .then(res => res.json())
      .then(data => {
        if (data.error) alert(data.error);
        else setSearchedUser(data);
      });
  };

  const toggleBan = () => {
    fetch(`http://localhost:5000/api/admin/user/${searchId}/ban`, { method: 'POST' })
      .then(res => res.json())
      .then(data => setSearchedUser({...searchedUser, isBanned: data.isBanned}));
  };

  const manualVerify = () => {
    if(window.confirm(`Are you sure you want to manually verify @${searchedUser.username || searchedUser.telegramId}?`)) {
      fetch(`http://localhost:5000/api/admin/user/${searchId}/manual-verify`, { method: 'POST' })
        .then(res => res.json())
        .then(data => {
          if (data.error) alert(data.error);
          else {
            alert(data.message);
            setSearchedUser({...searchedUser, isVerified: true});
          }
        });
    }
  };

  const editBalance = (action) => {
    fetch(`http://localhost:5000/api/admin/user/${searchId}/balance`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: balanceInput, action })
    }).then(res => res.json()).then(data => {
      setSearchedUser({...searchedUser, balance: data.balance});
      setBalanceInput('');
    });
  };

  const approveVerify = (uid) => {
    // API logic for approve (will call your existing verify approve endpoint)
    alert("Approved " + uid);
  };

  const saveTask = (task) => {
    fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/admin/tasks`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(task)
    }).then(() => alert(`Saved links for ${task.title}`));
  };

  const updateTaskField = (idx, field, value) => {
    const newTasks = [...tasksConfig];
    newTasks[idx][field] = value;
    setTasksConfig(newTasks);
  };

  const updateCoinRequestStatus = (id, status) => {
    fetch(`http://localhost:5000/api/admin/coin-requests/${id}/status`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    }).then(() => {
      alert(`Request ${status}`);
      fetchCoinRequests();
    });
  };

  const saveSingleCoin = (idx) => {
    fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/admin/coins`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ configs: [coins[idx]] })
    }).then(() => alert(`${coins[idx].label} settings saved successfully!`));
  };

  const toggleMarketVisibility = (checked) => {
    setMarketConfig({ marketIsVisible: checked });
    fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/admin/config`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ marketIsVisible: checked })
    });
  };

  const handleCoinChange = (idx, field, val) => {
    const newCoins = [...coins];
    newCoins[idx][field] = val;
    setCoins(newCoins);
  };

  const pendingVerifications = stats.pendingVerifications || 0;
  const pendingCoinSells = coinRequests.filter(r => r.status === 'Pending').length;
  const pendingAddFunds = fundRequests.filter(r => r.status === 'Pending').length;

  return (
    <div className="home-container" style={{background: '#f3f4f6', minHeight: '100vh', padding: '20px', paddingBottom: '100px'}}>
      <h2 style={{textAlign: 'center', fontWeight: '900', fontSize: '1.8rem', marginBottom: '15px', color: '#1f2937'}}>Admin Dashboard</h2>
      
      <div style={{display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '20px', paddingBottom: '10px', justifyContent: 'center'}}>
        <button onClick={()=>setActiveTab('dashboard')} style={{background: activeTab==='dashboard'?'#3b82f6':'#e5e7eb', color: activeTab==='dashboard'?'white':'#374151', padding: '8px 15px', borderRadius: '20px', fontWeight:'700', border:'none', whiteSpace:'nowrap'}}>
          Dashboard
        </button>
        <button onClick={()=>setActiveTab('users')} style={{position: 'relative', background: activeTab==='users'?'#3b82f6':'#e5e7eb', color: activeTab==='users'?'white':'#374151', padding: '8px 15px', borderRadius: '20px', fontWeight:'700', border:'none', whiteSpace:'nowrap'}}>
          Users
          {pendingVerifications > 0 && <span style={{position:'absolute', top:'-5px', right:'-5px', background:'#ef4444', color:'white', borderRadius:'50%', width:'18px', height:'18px', fontSize:'0.7rem', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:'bold'}}>{pendingVerifications}</span>}
        </button>
        <button onClick={()=>setActiveTab('tasks')} style={{background: activeTab==='tasks'?'#3b82f6':'#e5e7eb', color: activeTab==='tasks'?'white':'#374151', padding: '8px 15px', borderRadius: '20px', fontWeight:'700', border:'none', whiteSpace:'nowrap'}}>
          Tasks
        </button>

        <button onClick={()=>setActiveTab('coinSells')} style={{position: 'relative', background: activeTab==='coinSells'?'#3b82f6':'#e5e7eb', color: activeTab==='coinSells'?'white':'#374151', padding: '8px 15px', borderRadius: '20px', fontWeight:'700', border:'none', whiteSpace:'nowrap'}}>
          Coin Sells
          {pendingCoinSells > 0 && <span style={{position:'absolute', top:'-5px', right:'-5px', background:'#ef4444', color:'white', borderRadius:'50%', width:'18px', height:'18px', fontSize:'0.7rem', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:'bold'}}>{pendingCoinSells}</span>}
        </button>
        <button onClick={()=>setActiveTab('addFunds')} style={{position: 'relative', background: activeTab==='addFunds'?'#3b82f6':'#e5e7eb', color: activeTab==='addFunds'?'white':'#374151', padding: '8px 15px', borderRadius: '20px', fontWeight:'700', border:'none', whiteSpace:'nowrap'}}>
          Add Funds
          {pendingAddFunds > 0 && <span style={{position:'absolute', top:'-5px', right:'-5px', background:'#ef4444', color:'white', borderRadius:'50%', width:'18px', height:'18px', fontSize:'0.7rem', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:'bold'}}>{pendingAddFunds}</span>}
        </button>
        <button onClick={()=>setActiveTab('contact')} style={{background: activeTab==='contact'?'#3b82f6':'#e5e7eb', color: activeTab==='contact'?'white':'#374151', padding: '8px 15px', borderRadius: '20px', fontWeight:'700', border:'none', whiteSpace:'nowrap'}}>
          Settings
        </button>
      </div>

      {activeTab === 'dashboard' && (
        <>
          <div style={{display: 'flex', gap: '15px', marginBottom: '20px'}}>
            <div style={{flex: 1, background: 'white', padding: '15px', borderRadius: '15px', textAlign: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.05)'}}>
              <p style={{color: '#6b7280', fontSize:'0.85rem', fontWeight:'700'}}>Total Users</p>
              <h3 style={{color: '#1f2937', fontSize:'1.5rem'}}>{stats.totalUsers}</h3>
            </div>
            <div style={{flex: 1, background: 'white', padding: '15px', borderRadius: '15px', textAlign: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.05)'}}>
              <p style={{color: '#6b7280', fontSize:'0.85rem', fontWeight:'700'}}>Pending Verify</p>
              <h3 style={{color: '#f59e0b', fontSize:'1.5rem'}}>{stats.pendingVerifications}</h3>
            </div>
            <div style={{flex: 1, background: 'white', padding: '15px', borderRadius: '15px', textAlign: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.05)'}}>
              <p style={{color: '#6b7280', fontSize:'0.85rem', fontWeight:'700'}}>Pending Withdraw</p>
              <h3 style={{color: '#ef4444', fontSize:'1.5rem'}}>{stats.pendingWithdraws}</h3>
            </div>
          </div>

          <div style={{background: 'white', padding: '20px', borderRadius: '16px', marginBottom: '20px'}}>
            <h3 style={{marginBottom: '15px', fontSize: '1.1rem', color: '#374151'}}>Pending Verifications</h3>
            {stats.verifications.length === 0 ? <p style={{color:'#9ca3af', fontSize:'0.9rem'}}>No pending requests</p> : 
              stats.verifications.map((v, i) => (
                <div key={i} style={{display:'flex', justifyContent:'space-between', alignItems:'center', padding:'10px 0', borderBottom:'1px solid #f3f4f6'}}>
                  <div>
                    <p style={{fontWeight:'700', fontSize:'0.95rem'}}>UID: {v.telegramId}</p>
                    <p style={{color:'#6b7280', fontSize:'0.8rem'}}>TrxID: {v.transactionId}</p>
                  </div>
                  <button onClick={() => approveVerify(v.telegramId)} style={{background:'#10b981', color:'white', padding:'6px 12px', borderRadius:'8px', border:'none', fontSize:'0.85rem', fontWeight:'700'}}>Approve</button>
                </div>
              ))
            }
          </div>
        </>
      )}

      {activeTab === 'users' && (
        <div style={{background: 'white', padding: '20px', borderRadius: '16px'}}>
          <h3 style={{marginBottom: '15px', fontSize: '1.1rem', color: '#374151'}}>Search User</h3>
          <div style={{display: 'flex', gap: '10px', marginBottom: '20px'}}>
            <input type="text" placeholder="UID or @username" value={searchId} onChange={(e) => setSearchId(e.target.value)} style={{flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #d1d5db'}} />
            <button onClick={searchUser} style={{background: '#3b82f6', color: 'white', padding: '10px 15px', borderRadius: '8px', border:'none'}}><Search size={20}/></button>
          </div>

          {searchedUser && (
            <div style={{background: '#f9fafb', padding: '15px', borderRadius: '12px'}}>
              <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'15px'}}>
                <h4 style={{fontSize:'1.2rem', fontWeight:'800', color:'#1f2937'}}>@{searchedUser.username || 'NoUsername'}</h4>
                <span style={{background: searchedUser.isBanned ? '#fee2e2' : '#dcfce7', color: searchedUser.isBanned ? '#ef4444' : '#10b981', padding:'4px 8px', borderRadius:'6px', fontSize:'0.8rem', fontWeight:'700'}}>
                  {searchedUser.isBanned ? 'BANNED' : 'ACTIVE'}
                </span>
              </div>
              <p style={{color:'#4b5563', fontSize:'0.9rem', marginBottom:'5px'}}><strong>UID:</strong> {searchedUser.telegramId}</p>
              <p style={{color:'#4b5563', fontSize:'0.9rem', marginBottom:'5px'}}><strong>Joined:</strong> {new Date(searchedUser.createdAt).toLocaleDateString()}</p>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom:'5px'}}>
                <p style={{color:'#4b5563', fontSize:'0.9rem', margin: 0}}><strong>Verified:</strong> {searchedUser.isVerified ? 'Yes' : 'No'}</p>
                {!searchedUser.isVerified && (
                  <button onClick={manualVerify} style={{background: '#10b981', color: 'white', border: 'none', padding: '4px 10px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: '700'}}>Verify Now</button>
                )}
              </div>
              <p style={{color:'#4b5563', fontSize:'0.9rem', marginBottom:'15px'}}><strong>Balance:</strong> <span style={{color:'#10b981', fontWeight:'800', fontSize:'1.1rem'}}>{searchedUser.balance} ৳</span></p>
              
              <div style={{display: 'flex', gap: '10px', marginBottom: '15px'}}>
                <input type="number" placeholder="Amount" value={balanceInput} onChange={(e)=>setBalanceInput(e.target.value)} style={{flex: 1, padding: '8px', borderRadius: '8px', border: '1px solid #d1d5db'}} />
                <button onClick={()=>editBalance('add')} style={{background:'#10b981', color:'white', border:'none', padding:'8px 12px', borderRadius:'8px', fontWeight:'700'}}>+</button>
                <button onClick={()=>editBalance('cut')} style={{background:'#ef4444', color:'white', border:'none', padding:'8px 12px', borderRadius:'8px', fontWeight:'700'}}>-</button>
              </div>

              <button onClick={toggleBan} style={{width:'100%', background: searchedUser.isBanned ? '#3b82f6' : '#ef4444', color:'white', padding:'10px', borderRadius:'8px', border:'none', fontWeight:'700'}}>
                {searchedUser.isBanned ? 'Unban User' : 'Ban User'}
              </button>
            </div>
          )}
        </div>
      )}

      {activeTab === 'tasks' && (
        <div style={{background: 'white', padding: '20px', borderRadius: '16px'}}>
          <h3 style={{marginBottom: '15px', fontSize: '1.2rem', color: '#374151'}}>Manage Task Links</h3>
          {tasksConfig.map((t, idx) => (
            <div key={idx} style={{marginBottom: '20px', padding: '15px', border: '1px solid #e5e7eb', borderRadius: '12px'}}>
              <h4 style={{marginBottom: '10px', color: '#1f2937', fontWeight: '800'}}>{t.title}</h4>
              <input type="text" placeholder="YouTube Account Video ID (e.g. EF_pBnwW9h0)" value={t.accountVideo || ''} onChange={e => updateTaskField(idx, 'accountVideo', e.target.value)} style={{width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '8px', border: '1px solid #d1d5db'}} />
              <input type="text" placeholder="YouTube Work Video ID" value={t.workVideo || ''} onChange={e => updateTaskField(idx, 'workVideo', e.target.value)} style={{width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '8px', border: '1px solid #d1d5db'}} />
              <input type="text" placeholder="YouTube Withdraw Video ID" value={t.withdrawVideo || ''} onChange={e => updateTaskField(idx, 'withdrawVideo', e.target.value)} style={{width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '8px', border: '1px solid #d1d5db'}} />
              <input type="text" placeholder="Registration Link" value={t.regLink || ''} onChange={e => updateTaskField(idx, 'regLink', e.target.value)} style={{width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '8px', border: '1px solid #d1d5db'}} />
              <button onClick={() => saveTask(t)} style={{background: '#10b981', color: 'white', padding: '8px 15px', borderRadius: '8px', fontWeight: '700', width: '100%', border: 'none'}}>Save {t.title}</button>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'contact' && (
        <>
          <div style={{background: 'white', padding: '20px', borderRadius: '16px', marginBottom: '20px'}}>
            <h3 style={{marginBottom: '15px', fontSize: '1.2rem', color: '#374151'}}>Update Contact Links</h3>
            <input type="text" placeholder="Admin Support Link" value={links.supportLink} onChange={(e) => setLinks({...links, supportLink: e.target.value})} style={{width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '8px', border: '1px solid #d1d5db'}} />
            <input type="text" placeholder="Telegram Channel" value={links.telegramChannel} onChange={(e) => setLinks({...links, telegramChannel: e.target.value})} style={{width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '8px', border: '1px solid #d1d5db'}} />
            <input type="text" placeholder="YouTube Channel" value={links.youtubeChannel} onChange={(e) => setLinks({...links, youtubeChannel: e.target.value})} style={{width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '8px', border: '1px solid #d1d5db'}} />
            
            <h4 style={{marginTop:'10px', marginBottom:'10px', color:'#374151'}}>System Settings</h4>
            <input type="number" placeholder="Activation Fee (৳)" value={links.activationFee || ''} onChange={(e) => setLinks({...links, activationFee: Number(e.target.value)})} style={{width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '8px', border: '1px solid #d1d5db'}} />
            <input type="text" placeholder="Bkash Number" value={links.bkashNumber || ''} onChange={(e) => setLinks({...links, bkashNumber: e.target.value})} style={{width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '8px', border: '1px solid #d1d5db'}} />
            <input type="text" placeholder="Nagad Number" value={links.nagadNumber || ''} onChange={(e) => setLinks({...links, nagadNumber: e.target.value})} style={{width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '8px', border: '1px solid #d1d5db'}} />
            <input type="text" placeholder="Rocket Number" value={links.rocketNumber || ''} onChange={(e) => setLinks({...links, rocketNumber: e.target.value})} style={{width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '8px', border: '1px solid #d1d5db'}} />
            
            <button onClick={saveContact} style={{background: '#10b981', color: 'white', padding: '10px 20px', borderRadius: '8px', fontWeight: '700', width:'100%'}}>Save Settings</button>
          </div>

          <div style={{background: 'white', padding: '20px', borderRadius: '16px', marginBottom: '20px'}}>
            <h3 style={{marginBottom: '15px', fontSize: '1.2rem', color: '#374151'}}>Manage Admins</h3>
            <div style={{display: 'flex', gap: '10px'}}>
              <input type="text" placeholder="Telegram UID" value={newAdmin} onChange={(e) => setNewAdmin(e.target.value)} style={{flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #d1d5db'}} />
              <button onClick={addAdmin} style={{background: '#3b82f6', color: 'white', padding: '10px 15px', borderRadius: '8px', border:'none', display: 'flex', alignItems: 'center', gap: '5px'}}>
                <UserPlus size={18}/> Add
              </button>
            </div>
          </div>
        </>
      )}

      {activeTab === 'coinSells' && (
        <div style={{background: 'white', padding: '20px', borderRadius: '16px'}}>
          <div style={{display: 'flex', gap: '10px', marginBottom: '15px', borderBottom: '1px solid #e5e7eb', paddingBottom: '10px'}}>
            <button onClick={() => setCoinTab('requests')} style={{background: coinTab === 'requests' ? '#3b82f6' : 'transparent', color: coinTab === 'requests' ? 'white' : '#4b5563', padding: '6px 12px', borderRadius: '8px', border: 'none', fontWeight: '700'}}>
              Requests {pendingCoinSells > 0 && <span style={{marginLeft:'5px', background:'#ef4444', color:'white', padding:'2px 6px', borderRadius:'10px', fontSize:'0.7rem'}}>{pendingCoinSells}</span>}
            </button>
            <button onClick={() => setCoinTab('settings')} style={{background: coinTab === 'settings' ? '#3b82f6' : 'transparent', color: coinTab === 'settings' ? 'white' : '#4b5563', padding: '6px 12px', borderRadius: '8px', border: 'none', fontWeight: '700'}}>
              Coin Settings
            </button>
          </div>

          {coinTab === 'requests' && (
            <div>
              {coinRequests.length === 0 ? <p style={{color:'#9ca3af'}}>No coin sell requests.</p> : 
                coinRequests.map((req, i) => (
                  <div key={i} style={{marginBottom: '15px', padding: '15px', border: '1px solid #e5e7eb', borderRadius: '12px'}}>
                    <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'10px'}}>
                      <h4 style={{fontWeight: '800', color: '#1f2937', margin:0, textTransform:'uppercase'}}>{req.coinType}</h4>
                      <span style={{background: req.status==='Pending'?'#fef3c7':req.status==='Accepted'?'#dcfce7':'#fee2e2', color: req.status==='Pending'?'#d97706':req.status==='Accepted'?'#10b981':'#ef4444', padding:'4px 8px', borderRadius:'6px', fontSize:'0.8rem', fontWeight:'700'}}>
                        {req.status}
                      </span>
                    </div>
                    <p style={{fontSize:'0.9rem', color:'#4b5563', margin:'0 0 5px 0'}}><strong>UID:</strong> {req.userId}</p>
                    <p style={{fontSize:'0.9rem', color:'#4b5563', margin:'0 0 5px 0'}}><strong>Amount:</strong> {req.amount}</p>
                    <p style={{fontSize:'0.9rem', color:'#4b5563', margin:'0 0 10px 0'}}><strong>Method:</strong> {req.paymentMethod} ({req.paymentNumber})</p>
                    <p style={{fontSize:'0.9rem', color:'#8b5cf6', margin:'0 0 10px 0', fontWeight:'700'}}><strong>Sender App ID:</strong> {req.senderDetails}</p>
                    {req.couponCode && (
                      <p style={{fontSize:'0.9rem', color:'#f59e0b', margin:'0 0 10px 0', fontWeight:'700'}}><strong>Coupon:</strong> {req.couponCode}</p>
                    )}
                    
                    {req.status === 'Pending' && (
                      <div style={{display:'flex', gap:'10px'}}>
                        <button onClick={() => updateCoinRequestStatus(req._id, 'Accepted')} style={{flex:1, background:'#10b981', color:'white', padding:'8px', borderRadius:'8px', border:'none', fontWeight:'700'}}>Accept</button>
                        <button onClick={() => updateCoinRequestStatus(req._id, 'Rejected')} style={{flex:1, background:'#ef4444', color:'white', padding:'8px', borderRadius:'8px', border:'none', fontWeight:'700'}}>Reject</button>
                      </div>
                    )}
                  </div>
                ))
              }
            </div>
          )}

          {coinTab === 'settings' && (
            <div>
              <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', background:'#f8fafc', padding:'15px', borderRadius:'12px', marginBottom:'20px', border:'1px solid #e5e7eb'}}>
                <span style={{fontWeight:'800', color:'#1f2937'}}>Show Full Market Section (Home Page)</span>
                <label style={{display:'flex', alignItems:'center', cursor:'pointer'}}>
                  <input type="checkbox" checked={marketConfig.marketIsVisible} onChange={e => toggleMarketVisibility(e.target.checked)} style={{transform:'scale(1.2)'}} />
                </label>
              </div>
              
              {coins.map((coin, idx) => (
                <div key={idx} style={{marginBottom: '15px', padding: '15px', border: '1px solid #e5e7eb', borderRadius: '12px'}}>
                  <div style={{display:'flex', justifyContent:'space-between', marginBottom:'10px'}}>
                    <span style={{fontWeight:'800', color:'#1f2937'}}>{coin.label}</span>
                    <div style={{display:'flex', gap:'15px'}}>
                      <label style={{display:'flex', alignItems:'center', gap:'5px', fontSize:'0.9rem', cursor:'pointer'}}>
                        <input type="checkbox" checked={coin.isVisible !== false} onChange={e => handleCoinChange(idx, 'isVisible', e.target.checked)} /> Visible
                      </label>
                      <label style={{display:'flex', alignItems:'center', gap:'5px', fontSize:'0.9rem', cursor:'pointer'}}>
                        <input type="checkbox" checked={coin.isActive} onChange={e => handleCoinChange(idx, 'isActive', e.target.checked)} /> Active
                      </label>
                    </div>
                  </div>
                  <div style={{display:'flex', gap:'10px', marginBottom:'10px'}}>
                    <div style={{flex: 1}}>
                      <label style={{fontSize:'0.8rem', fontWeight:'600', color:'#6b7280'}}>Price (৳ / 1000)</label>
                      <input type="number" value={coin.price} onChange={e => handleCoinChange(idx, 'price', Number(e.target.value))} style={{width:'100%', padding:'8px', borderRadius:'8px', border:'1px solid #d1d5db'}} />
                    </div>
                    <div style={{flex: 1}}>
                      <label style={{fontSize:'0.8rem', fontWeight:'600', color:'#6b7280'}}>Min Amount</label>
                      <input type="number" value={coin.minAmount || 1000} onChange={e => handleCoinChange(idx, 'minAmount', Number(e.target.value))} style={{width:'100%', padding:'8px', borderRadius:'8px', border:'1px solid #d1d5db'}} />
                    </div>
                    <div style={{flex: 2}}>
                      <label style={{fontSize:'0.8rem', fontWeight:'600', color:'#6b7280'}}>Target Username / ID</label>
                      <input type="text" value={coin.targetUser} onChange={e => handleCoinChange(idx, 'targetUser', e.target.value)} style={{width:'100%', padding:'8px', borderRadius:'8px', border:'1px solid #d1d5db'}} />
                    </div>
                  </div>
                  <div style={{display:'flex', gap:'10px', marginTop:'10px'}}>
                    <div style={{flex: 1}}>
                      <label style={{fontSize:'0.8rem', fontWeight:'600', color:'#6b7280'}}>Tutorial Video (Optional)</label>
                      <input type="text" value={coin.tutorialVideo || ''} onChange={e => handleCoinChange(idx, 'tutorialVideo', e.target.value)} style={{width:'100%', padding:'8px', borderRadius:'8px', border:'1px solid #d1d5db'}} placeholder="Link e.g. https://youtu.be/..." />
                    </div>
                  </div>
                  <div style={{display:'flex', justifyContent:'flex-end', marginTop:'15px'}}>
                    <button onClick={() => saveSingleCoin(idx)} style={{background: '#10b981', color: 'white', padding: '8px 16px', borderRadius: '8px', fontWeight: '700', border:'none', cursor:'pointer'}}>
                      Save {coin.label}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'addFunds' && (
        <div style={{background: 'white', padding: '20px', borderRadius: '16px'}}>
          <h3 style={{marginBottom: '15px', fontSize: '1.2rem', color: '#374151'}}>Add Fund Requests</h3>
          {fundRequests.length === 0 ? <p style={{color:'#9ca3af'}}>No add fund requests.</p> : 
            fundRequests.map((req, i) => (
              <div key={i} style={{marginBottom: '15px', padding: '15px', border: '1px solid #e5e7eb', borderRadius: '12px'}}>
                <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'10px'}}>
                  <h4 style={{fontWeight: '800', color: '#1f2937', margin:0}}>+{req.amount} ৳</h4>
                  <span style={{background: req.status==='Pending'?'#fef3c7':req.status==='Accepted'?'#dcfce7':'#fee2e2', color: req.status==='Pending'?'#d97706':req.status==='Accepted'?'#10b981':'#ef4444', padding:'4px 8px', borderRadius:'6px', fontSize:'0.8rem', fontWeight:'700'}}>
                    {req.status}
                  </span>
                </div>
                <p style={{fontSize:'0.9rem', color:'#4b5563', margin:'0 0 5px 0'}}><strong>UID:</strong> {req.userId}</p>
                <p style={{fontSize:'0.9rem', color:'#4b5563', margin:'0 0 5px 0'}}><strong>Method:</strong> <span style={{textTransform:'capitalize'}}>{req.paymentMethod}</span></p>
                <p style={{fontSize:'0.9rem', color:'#4b5563', margin:'0 0 5px 0'}}><strong>Sender Number:</strong> {req.senderNumber}</p>
                <p style={{fontSize:'0.9rem', color:'#3b82f6', margin:'0 0 10px 0', fontWeight:'700'}}><strong>TrxID:</strong> {req.transactionId}</p>
                
                {req.status === 'Pending' && (
                  <div style={{display:'flex', gap:'10px'}}>
                    <button onClick={() => {
                      fetch(`http://localhost:5000/api/admin/fund-requests/${req._id}/status`, {
                        method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({status: 'Accepted'})
                      }).then(() => fetchFundRequests());
                    }} style={{flex:1, background:'#10b981', color:'white', padding:'8px', borderRadius:'8px', border:'none', fontWeight:'700'}}>Approve</button>
                    <button onClick={() => {
                      fetch(`http://localhost:5000/api/admin/fund-requests/${req._id}/status`, {
                        method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({status: 'Rejected'})
                      }).then(() => fetchFundRequests());
                    }} style={{flex:1, background:'#ef4444', color:'white', padding:'8px', borderRadius:'8px', border:'none', fontWeight:'700'}}>Reject</button>
                  </div>
                )}
              </div>
            ))
          }
        </div>
      )}
      
    </div>
  );
};

const TaskRenderer = () => {
  const { id } = useParams();
  const taskMeta = tasks.find(t => t.id === id);
  const [dynamicJob, setDynamicJob] = useState(null);

  useEffect(() => {
    if (taskMeta?.type === 'template') {
      fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/tasks`)
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) {
            const found = data.find(t => t.taskId === id);
            setDynamicJob(found || { title: taskMeta.title || 'Task', accountVideo: '', workVideo: '', withdrawVideo: '', regLink: '' });
          } else {
            setDynamicJob({ title: taskMeta.title || 'Task', accountVideo: '', workVideo: '', withdrawVideo: '', regLink: '' });
          }
        }).catch(err => {
          console.error("Task fetch failed", err);
          setDynamicJob({ title: taskMeta.title || 'Task', accountVideo: '', workVideo: '', withdrawVideo: '', regLink: '' });
        });
    }
  }, [id, taskMeta]);

  if (!taskMeta) return <div style={{padding:'20px'}}>Task not found</div>;
  
  if (taskMeta.type === 'custom') {
    if (taskMeta.id === 'top-follow') return <TopFollowWork />;
  }

  const rawHtml = taskHtmlData[taskMeta.dataKey];
  
  if (taskMeta.type === 'template') {
    if (!dynamicJob) return <div style={{padding:'20px', textAlign:'center'}}>Loading...</div>;
    return <JobDetailTemplate job={{...jobData[id], ...dynamicJob}} />;
  }

  return (
    <div style={{ backgroundColor: '#fff', minHeight: '100vh', paddingBottom: '100px' }}>
      <div className="imported-html-content" dangerouslySetInnerHTML={{ __html: rawHtml }} />
    </div>
  );
};

function App() {
  return (
    <Router>
      <div style={{minHeight: '100vh', position: 'relative', paddingBottom: '80px', backgroundColor: '#f3f4f6'}}>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/withdraw" element={<WithdrawPage />} />
          <Route path="/add-fund" element={<AddFundPage />} />
          <Route path="/sell-coin" element={<SellCoinPage />} />
          <Route path="/market" element={<CoinMarketPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/invite" element={<Invite />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/task/:id" element={<TaskRenderer />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
