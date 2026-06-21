import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useParams, useNavigate, useLocation } from 'react-router-dom';
import { Menu, ChevronRight, MessageSquare, Download, User as UserIcon, Home as HomeIcon, Wallet, PlayCircle, ExternalLink, DollarSign, Users as UsersIcon, Copy, Gift, Settings, UserPlus, UserMinus, Share2, Search, CheckCircle, XCircle, AlertCircle, Briefcase, Sun, Moon, Palette } from 'lucide-react';
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
    confirmButtonColor:  'var(--positive-color)',
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
  { id: 'ip-web', title: 'IP Work', subtitle: 'IP ব্যবহার করে অনলাইন কাজ', iconUrl: 'https://img.icons8.com/color/96/internet.png', type: 'template', dataKey: 'ip-web' },
  { id: 'e-task', title: 'E-Task Earn', subtitle: 'সাবস্ক্রাইব/লাইক কমেন্ট করে আয়', iconUrl: 'https://img.icons8.com/color/96/task.png', type: 'template', dataKey: 'e-task' },
  { id: 'trvs-coin', title: 'TRVS COIN', subtitle: 'গেম খেলে কয়েন ইনকাম', iconUrl: 'https://img.icons8.com/color/96/coins.png', type: 'template', dataKey: 'trvs-coin' }
];

const jobData = {
  tiktok: {
    title: 'TikTok Like Follow',
    accountVideo: 'EF_pBnwW9h0',
    regLink: 'https://tiktop-free.com/?ref=mdmahmudsah575',
    workVideo: 'lBJfDuyngFM',
    withdrawVideo: 'JCKlTP0X_YU',
    walletType: 'TRX (Network: Tron)',
    walletAddress: 'THdYuBfDHncZwz1AFmpWEkWi84eNJnVxua'
  },
  vk: {
    title: 'VK Surfing',
    accountVideo: '46ZN7DmNzoE',
    regLink: 'https://vkserfing.ru/?ref=551293767',
    workVideo: '-9YSEYHxx4o',
    withdrawVideo: 'ritzyUqWIx4',
    walletType: 'Wallet (Volet)',
    walletAddress: 'U870740602777'
  },
  gamgala: {
    title: 'Gamgala Earn',
    accountVideo: 'VJeZY6VjC98',
    regLink: 'https://getblock.me/u/29498073',
    withdrawVideo: 'nk_tRRU9IsA',
    walletType: 'USDT (TRC-20)',
    walletAddress: 'TAN7Nad7jHvAcRNfQpgrKAwSPyMFurNrit'
  },
  'ip-web': {
    title: 'IP work',
    accountVideo: 'OCPfczevxIo',
    regLink: 'https://www.ipweb.pro/?mahmudsah',
    withdrawVideo: 'GgkJEtw_Uys',
    walletType: '',
    walletAddress: ''
  },
  'work-cash': {
    title: 'Video Watching',
    accountVideo: 'V62ozu15JIo',
    regLink: 'https://worker.cash/u/1412507',
    withdrawVideo: 'cf3asyi9uhI',
    walletType: '',
    walletAddress: ''
  },
  'typing-job': {
    title: 'Typing Job',
    accountVideo: 'JP56leadK6E',
    regLink: '',
    withdrawVideo: '1hhW_9sZtaE',
    walletType: '',
    walletAddress: ''
  },
  'e-task': {
    title: 'E-Task Earn',
    accountVideo: 'dnaJfUPV1pU',
    regLink: 'https://e-task.net?ref=1434418',
    withdrawVideo: 'CbKMb5ElJUA',
    walletType: '',
    walletAddress: ''
  },
  'trvs-coin': {
    title: 'TRVS COIN',
    accountVideo: '',
    regLink: '',
    withdrawVideo: '',
    walletType: '',
    walletAddress: ''
  }
};

const Header = ({ theme, toggleTheme }) => {
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
        {/* Theme Toggle Button */}
        <button 
          onClick={toggleTheme} 
          style={{
            background: 'transparent',
            border: 'none',
            outline: 'none',
            cursor: 'pointer',
            padding: '5px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-primary)',
            transition: 'transform 0.2s'
          }}
          onMouseOver={e => e.currentTarget.style.transform = 'scale(1.1)'}
          onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
          title="Toggle Theme"
        >
          {theme === 'gradient' && <Palette size={24} />}
          {theme === 'light' && <Sun size={24} />}
          {theme === 'dark' && <Moon size={24} />}
        </button>

        {isAdmin && <Settings className="menu-icon" size={26} color="var(--text-primary)" onClick={() => navigate('/admin')} style={{cursor: 'pointer'}} />}
        <div style={{position: 'relative'}}>
          <Menu className="menu-icon" size={26} onClick={(e) => { e.stopPropagation(); setMenuOpen(!menuOpen); }} style={{cursor: 'pointer'}} />
          
          {menuOpen && (
            <div style={{
              position: 'absolute', top: '100%', right: 0, marginTop: '10px', background: 'var(--card-bg)',
              backdropFilter: 'blur(20px)', webkitBackdropFilter: 'blur(20px)',
              borderRadius: '16px', boxShadow: 'var(--shadow)', padding: '8px',
              minWidth: '200px', zIndex: 100, border: '1px solid var(--border-color)'
            }} onClick={e => e.stopPropagation()}>
              <div onClick={() => { navigate('/history?tab=coin'); setMenuOpen(false); }} style={{display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 16px', borderRadius: '10px', cursor: 'pointer', transition: 'background 0.2s', background: 'var(--input-bg)', marginBottom: '5px'}}>
                <span style={{fontSize: '1.2rem'}}>💰</span>
                <span style={{fontWeight: '700', color: 'var(--text-primary)', fontSize: '0.9rem'}}>Coin Sell History</span>
              </div>
              <div onClick={() => { navigate('/history?tab=work'); setMenuOpen(false); }} style={{display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 16px', borderRadius: '10px', cursor: 'pointer', transition: 'background 0.2s', background: 'var(--input-bg)', marginBottom: '5px'}}>
                <span style={{fontSize: '1.2rem'}}>💼</span>
                <span style={{fontWeight: '700', color: 'var(--text-primary)', fontSize: '0.9rem'}}>Work History</span>
              </div>
              <div onClick={() => { navigate('/history?tab=fund'); setMenuOpen(false); }} style={{display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 16px', borderRadius: '10px', cursor: 'pointer', transition: 'background 0.2s', background: 'var(--input-bg)', marginBottom: '5px'}}>
                <span style={{fontSize: '1.2rem'}}>💳</span>
                <span style={{fontWeight: '700', color: 'var(--text-primary)', fontSize: '0.9rem'}}>Add Fund History</span>
              </div>
              <div onClick={() => { navigate('/history?tab=withdraw'); setMenuOpen(false); }} style={{display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 16px', borderRadius: '10px', cursor: 'pointer', transition: 'background 0.2s', background: 'var(--input-bg)'}}>
                <span style={{fontSize: '1.2rem'}}>💸</span>
                <span style={{fontWeight: '700', color: 'var(--text-primary)', fontSize: '0.9rem'}}>Withdraw History</span>
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
  const [adsEnabled, setAdsEnabled] = useState(false);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/config`)
      .then(res => res.json())
      .then(data => {
        if (data && data.adsEnabled !== undefined) {
          setAdsEnabled(data.adsEnabled);
        }
      })
      .catch(err => console.error('Footer config fetch error:', err));
  }, []);
  
  return (
    <div className="footer-bar-new">
      <div className="nav-item" onClick={() => navigate('/')} style={{ color: location.pathname === '/' ? '#a855f7' : '#9ca3af' }}>
        <HomeIcon size={24} />
        <span>Home</span>
      </div>
      <div className="nav-item" onClick={() => navigate('/jobs')} style={{ color: location.pathname === '/jobs' ? '#a855f7' : '#9ca3af' }}>
        <Briefcase size={24} />
        <span>Jobs</span>
      </div>
      {adsEnabled && (
        <div className="nav-item" onClick={() => navigate('/watch-ads')} style={{ color: location.pathname === '/watch-ads' ? '#a855f7' : '#9ca3af' }}>
          <PlayCircle size={24} />
          <span>Ads</span>
        </div>
      )}
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
  const [bots, setBots] = useState([]);
  const [marqueeNotice, setMarqueeNotice] = useState('');

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/bots`)
      .then(res => res.json())
      .then(data => setBots(Array.isArray(data) ? data : []))
      .catch(err => console.error('Fetch bots error:', err));

    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/config`)
      .then(res => res.json())
      .then(data => {
        if (data && data.marqueeNotice) {
          setMarqueeNotice(data.marqueeNotice);
        }
      })
      .catch(err => console.error('Fetch config notice error:', err));
  }, []);

  return (
    <div className="home-container" style={{background: 'transparent', minHeight: '100vh', padding: '20px', paddingBottom: '100px'}}>
      
      {/* Marquee Notice Bar */}
      {marqueeNotice && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          background: 'linear-gradient(135deg, #1e1b4b, #311042)',
          borderRadius: '12px',
          overflow: 'hidden',
          border: '1px solid rgba(255,255,255,0.1)',
          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
          marginBottom: '20px'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #ef4444, #dc2626)',
            color: 'white',
            padding: '8px 16px',
            fontWeight: 'bold',
            fontSize: '0.85rem',
            whiteSpace: 'nowrap',
            zIndex: 2,
            boxShadow: '2px 0 8px rgba(0,0,0,0.15)'
          }}>
            নোটিশ
          </div>
          <div style={{ flex: 1, overflow: 'hidden', display: 'flex', alignItems: 'center' }}>
            <marquee 
              behavior="scroll" 
              direction="left" 
              scrollamount="5"
              style={{
                color: 'white',
                fontSize: '0.9rem',
                fontWeight: '600',
                padding: '5px 10px',
                margin: 0
              }}
            >
              {marqueeNotice}
            </marquee>
          </div>
        </div>
      )}

      {/* Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #d60093, #8b00ff)', 
        borderRadius: '20px', 
        padding: '25px 20px', 
        color: 'white',
        boxShadow: '0 10px 25px rgba(139, 0, 255, 0.4)',
        marginBottom: '25px',
        position: 'relative',
        overflow: 'hidden',
        border: '1px solid rgba(255,255,255,0.2)'
      }}>
        <h2 style={{fontSize: '1.8rem', fontWeight: '800', marginBottom: '5px'}}>Start Earning!</h2>
        <p style={{fontSize: '1.1rem', opacity: '0.9'}}>Complete tasks to earn real money daily.</p>
        <div style={{position: 'absolute', right: '-20px', top: '-20px', width: '100px', height: '100px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)'}}></div>
      </div>

      {/* হটাৎ ইনকাম (Extra Earning) Section */}
      <div style={{ marginBottom: '25px' }}>
        <h3 style={{ color: 'var(--text-primary)', marginBottom: '15px', fontWeight: '800', fontSize: '1.4rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>🎁 হটাৎ ইনকাম (Extra Earning)</span>
        </h3>
        {bots.length === 0 ? (
          <div style={{
            background: 'var(--card-bg)',
            border: 'var(--card-border)',
            borderRadius: '16px',
            padding: '20px',
            textAlign: 'center',
            color: 'var(--text-secondary)',
            fontSize: '0.9rem',
            fontWeight: '600',
            backdropFilter: 'blur(10px)',
            webkitBackdropFilter: 'blur(10px)'
          }}>
            বর্তমানে কোন বটের অফার খালি নেই। নতুন রিয়াল বটের খোঁজ পেলে এখানে শেয়ার করা হবে।
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {bots.map((bot, idx) => (
              <div key={idx} style={{
                background: 'var(--card-bg)',
                border: 'var(--card-border)',
                borderRadius: '16px',
                padding: '20px',
                boxShadow: 'var(--shadow)',
                backdropFilter: 'blur(10px)',
                webkitBackdropFilter: 'blur(10px)',
                color: 'var(--text-primary)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <h4 style={{ fontSize: '1.15rem', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>{bot.title}</h4>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    {bot.reward !== undefined && bot.reward > 0 && (
                      <span style={{
                        background: 'rgba(0, 230, 118, 0.15)',
                        color: 'var(--positive-color)',
                        padding: '4px 10px',
                        borderRadius: '20px',
                        fontSize: '0.75rem',
                        fontWeight: '800',
                        border: '1px solid var(--positive-color)'
                      }}>
                        Reward: {bot.reward}৳
                      </span>
                    )}
                    <span style={{
                      background: 'linear-gradient(90deg, #d60093 0%, #8b00ff 100%)',
                      color: 'white',
                      padding: '4px 10px',
                      borderRadius: '20px',
                      fontSize: '0.75rem',
                      fontWeight: '800',
                      boxShadow: '0 2px 10px rgba(214, 0, 147, 0.3)'
                    }}>
                      Real Bot ✅
                    </span>
                  </div>
                </div>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '15px', whiteSpace: 'pre-wrap', lineHeight: '1.4' }}>
                  {bot.description}
                </p>
                <a 
                  href={bot.link} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    background: 'linear-gradient(90deg, #d60093 0%, #8b00ff 100%)',
                    color: 'white',
                    padding: '12px',
                    borderRadius: '12px',
                    fontWeight: '800',
                    fontSize: '0.95rem',
                    textAlign: 'center',
                    textDecoration: 'none',
                    boxShadow: '0 4px 15px rgba(139, 0, 255, 0.3)',
                    transition: 'transform 0.2s'
                  }}
                  onMouseOver={e => e.currentTarget.style.transform = 'scale(1.02)'}
                  onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
                >
                  <ExternalLink size={16} /> রেজিষ্ট্রেশন করুন (Registration Link)
                </a>
              </div>
            ))}
          </div>
        )}
      </div>

      <h3 style={{color: 'var(--text-primary)', marginBottom: '15px', fontWeight: '800', fontSize: '1.4rem'}}>🔥 Available Works</h3>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px' }}>
        
        {/* Coin Sell Card */}
        <div onClick={() => navigate('/market')} style={{
          background: 'linear-gradient(135deg, #0ea5e9, #2563eb)',
          borderRadius: '16px',
          padding: '20px 15px',
          textAlign: 'center',
          boxShadow: '0 8px 30px rgba(14,165,233,0.3)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '10px',
          cursor: 'pointer',
          gridColumn: 'span 2',
          border: '1px solid rgba(255,255,255,0.1)'
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
                Swal.fire({
                  title: 'ভেরিফিকেশন প্রয়োজন',
                  text: 'আপনার অ্যাকাউন্টটি Cambodia/ভেরিফাই করা নেই!',
                  icon: 'warning',
                  showCancelButton: true,
                  confirmButtonColor: 'var(--positive-color)',
                  cancelButtonColor: 'var(--negative-color)',
                  confirmButtonText: 'Profile এ যান',
                  cancelButtonText: 'Cancel',
                  background: '#ffffff',
                  color: '#374151',
                  customClass: {
                    popup: 'swal2-custom-popup',
                    title: 'swal2-custom-title',
                    confirmButton: 'swal2-custom-button',
                    cancelButton: 'swal2-custom-button'
                  }
                }).then((result) => {
                  if (result.isConfirmed) {
                    navigate('/profile');
                  }
                });
              } else {
                navigate(`/task/${task.id}`);
              }
            } catch (err) {
              navigate(`/task/${task.id}`);
            }
          }} style={{
            background: 'var(--card-bg)', borderRadius: '16px', padding: '20px 15px', textAlign: 'center',
            boxShadow: 'var(--shadow)', display: 'flex', flexDirection: 'column',
            alignItems: 'center', gap: '10px', cursor: 'pointer', border: 'var(--card-border)',
            backdropFilter: 'blur(10px)', webkitBackdropFilter: 'blur(10px)', color: 'var(--text-primary)'
          }}>
            <div style={{
              background: '#ffffff', 
              padding: '12px', 
              borderRadius: '16px', 
              marginBottom: '5px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 10px rgba(0, 0, 0, 0.08)'
            }}>
              <img src={task.iconUrl} alt={task.title} style={{width: '40px', height: '40px', objectFit: 'contain'}} />
            </div>
            <div style={{flex: 1}}>
              <h3 style={{fontSize: '1rem', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '4px'}}>{task.title}</h3>
              <p style={{fontSize: '0.8rem', color: 'var(--text-secondary)'}}>{task.subtitle}</p>
            </div>
            <span style={{background: 'linear-gradient(90deg, #d60093 0%, #8b00ff 100%)', color: 'white', padding: '8px 16px', borderRadius: '12px', fontSize: '0.85rem', fontWeight: '800', width: '100%', marginTop: '5px', boxShadow: '0 2px 10px rgba(139, 0, 255, 0.3)'}}>
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
    <div style={{background: 'transparent', minHeight: '100vh', padding: '20px', paddingBottom: '100px'}}>
      {/* Header */}
      <div style={{display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '25px'}}>
        <button onClick={() => navigate('/')} style={{background: 'var(--card-bg)', border: 'var(--card-border)', padding: '8px', borderRadius: '12px', boxShadow: 'var(--shadow)', cursor: 'pointer', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <ChevronRight size={24} color="var(--text-primary)" style={{transform: 'rotate(180deg)'}} />
        </button>
        <div>
          <h2 style={{fontWeight: '900', fontSize: '1.5rem', color: 'var(--text-primary)', margin: 0}}>💰 Coins Sell</h2>
          <p style={{fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0}}>কয়েন সিলেক্ট করুন এবং বিক্রি করুন</p>
        </div>
      </div>

      {!marketConfig.marketIsVisible ? (
        <div style={{background: 'var(--card-bg)', border: 'var(--card-border)', borderRadius: '20px', padding: '40px 20px', textAlign: 'center', boxShadow: 'var(--shadow)'}}>
          <div style={{fontSize: '3rem', marginBottom: '15px'}}>🔒</div>
          <h3 style={{fontWeight: '800', color: 'var(--text-primary)', marginBottom: '8px'}}>মার্কেট বন্ধ আছে</h3>
          <p style={{color: 'var(--text-secondary)', fontSize: '0.9rem'}}>এই মুহূর্তে কয়েন বিক্রি করা যাচ্ছে না। পরে আবার চেষ্টা করুন।</p>
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

          <h3 style={{color: 'var(--text-primary)', fontWeight: '800', fontSize: '1.2rem', marginBottom: '15px'}}>📈 লাইভ মার্কেট রেট</h3>

          <div style={{display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px'}}>
            {coins.filter(c => c.isVisible).map(coin => (
              <div key={coin.coinId} onClick={() => {
                if (!coin.isActive) {
                  Swal.fire({
                    title: 'দুঃখিত!',
                    text: 'বর্তমানে তা কেনা অফ আছে অন হলে সেল করতে পারবেন দয়া করে অপেক্ষা করুন',
                    icon: 'info',
                    confirmButtonText: 'ঠিক আছে',
                    confirmButtonColor: 'var(--primary-color)',
                    background: '#ffffff',
                    color: '#374151',
                    customClass: {
                      popup: 'swal2-custom-popup',
                      title: 'swal2-custom-title',
                      confirmButton: 'swal2-custom-button'
                    }
                  });
                  return;
                }
                navigate(`/sell-coin?type=${coin.coinId}&name=${coin.label}&color=${encodeURIComponent(coin.color)}`);
              }} style={{
                background: 'var(--card-bg)',
                border: 'var(--card-border)',
                borderTop: `4px solid ${coin.color}`,
                padding: '16px',
                borderRadius: '16px',
                boxShadow: 'var(--shadow)',
                cursor: coin.isActive ? 'pointer' : 'not-allowed',
                display: 'flex',
                flexDirection: 'column',
                opacity: coin.isActive ? 1 : 0.5,
                transition: 'transform 0.1s',
              }}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px'}}>
                  <span style={{fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-secondary)', textTransform: 'uppercase'}}>{coin.label}</span>
                  {coin.isActive
                    ? <span style={{fontSize: '0.65rem', fontWeight: '800', color: 'white', background:  'var(--positive-color)', padding: '2px 6px', borderRadius: '4px'}}>Active</span>
                    : <span style={{fontSize: '0.65rem', fontWeight: '800', color: 'white', background:  'var(--negative-color)', padding: '2px 6px', borderRadius: '4px'}}>Stopped</span>
                  }
                </div>
                <div>
                  <h3 style={{fontSize: '1.8rem', fontWeight: '900', color: 'var(--text-primary)', margin: 0, lineHeight: 1}}>{coin.price}<span style={{fontSize: '0.9rem', color: 'var(--text-secondary)', marginLeft: '2px'}}>৳</span></h3>
                  <p style={{fontSize: '0.65rem', fontWeight: '600', color: 'var(--text-secondary)', margin: '4px 0 10px 0'}}>Per 1,000 Coins</p>
                </div>
                <div style={{background: coin.isActive ? coin.color : 'var(--text-secondary)', color: 'white', padding: '7px', borderRadius: '10px', textAlign: 'center', fontWeight: '800', fontSize: '0.8rem'}}>
                  {coin.isActive ? 'Sell Now →' : 'Closed (সেল অফ)'}
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
  const [earningsStats, setEarningsStats] = useState({ daily: 0, yesterday: 0, sevenDays: 0, customDateEarning: 0 });
  const [customDate, setCustomDate] = useState('');
  const [user, setUser] = useState({ username: 'Md Mahmud', telegramId: window.Telegram?.WebApp?.initDataUnsafe?.user?.id?.toString() || "6323700179", balance: 0, isVerified: false });
  const [trxId, setTrxId] = useState('');
  
  // Job posting states
  const [jobTitle, setJobTitle] = useState('');
  const [jobDesc, setJobDesc] = useState('');
  const [jobLink, setJobLink] = useState('');
  const [jobAmount, setJobAmount] = useState('');
  const [jobLimit, setJobLimit] = useState('');
  const [isPosting, setIsPosting] = useState(false);

  // Microjob management states
  const [showManageJobs, setShowManageJobs] = useState(false);
  const [myJobs, setMyJobs] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(false);

  const fetchMyJobs = () => {
    if (!user.telegramId) return;
    setLoadingJobs(true);
    fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/jobs/user/${user.telegramId}`)
      .then(res => res.json())
      .then(data => {
        setMyJobs(Array.isArray(data) ? data : []);
        setLoadingJobs(false);
      })
      .catch(err => {
        console.error('Fetch my jobs error:', err);
        setLoadingJobs(false);
      });
  };

  useEffect(() => {
    if (showManageJobs) {
      fetchMyJobs();
    }
  }, [showManageJobs, user.telegramId]);

  const handlePostJob = (e) => {
    e.preventDefault();
    if(!jobTitle || !jobDesc || !jobLink || !jobAmount) {
      return alert("সবগুলো তথ্য পূরণ করুন!");
    }
    if (Number(jobAmount) <= 0) {
      return alert("কাজের মূল্য সঠিক দিন!");
    }
    
    setIsPosting(true);
    fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/jobs/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: jobTitle,
        description: jobDesc,
        link: jobLink,
        amount: Number(jobAmount),
        postedBy: user.telegramId,
        workerLimit: Number(jobLimit) || 0
      })
    }).then(res => res.json())
      .then(data => {
        setIsPosting(false);
        if(data.success) {
          alert("🎉 Microjob টি সফলভাবে পোস্ট করা হয়েছে!");
          setJobTitle('');
          setJobDesc('');
          setJobLink('');
          setJobAmount('');
          setJobLimit('');
          fetchMyJobs();
        } else {
          alert("পাবলিশ করতে ব্যর্থ হয়েছে।");
        }
      }).catch(err => {
        console.error(err);
        setIsPosting(false);
        alert("সার্ভার এরর!");
      });
  };

  const toggleJobStatus = (jobId) => {
    fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/jobs/${jobId}/toggle-active`, {
      method: 'POST'
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        alert(`Job is now ${data.isActive ? 'Active' : 'Offline'}!`);
        fetchMyJobs();
      } else {
        alert('Failed to change job status.');
      }
    })
    .catch(err => console.error(err));
  };

  const deleteJob = (jobId) => {
    if (window.confirm("আপনি কি নিশ্চিতভাবে এই জবটি ডিলেট করতে চান?")) {
      fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/jobs/${jobId}/delete`, {
        method: 'POST'
      })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          alert("Job successfully deleted!");
          fetchMyJobs();
        } else {
          alert("Failed to delete job.");
        }
      })
      .catch(err => console.error(err));
    }
  };

    useEffect(() => {
    const uid = window.Telegram?.WebApp?.initDataUnsafe?.user?.id?.toString() || '6323700179';
    fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/earnings/stats/${uid}?date=${customDate}`)
      .then(res => res.json())
      .then(data => {
        if (!data.error) setEarningsStats(data);
      })
      .catch(console.error);
  }, [customDate]);

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
    <div className="home-container" style={{background: 'transparent', minHeight: '100vh', padding: '20px', paddingBottom: '100px'}}>
      
      {/* Profile Header Card */}
      {user.isVerified ? (
        <div style={{
          background: 'linear-gradient(135deg, #d60093, #8b00ff)', padding: '30px 20px', borderRadius: '24px',
          color: 'white', boxShadow: '0 10px 25px rgba(139, 0, 255, 0.3)', position: 'relative', overflow: 'hidden',
          marginBottom: '25px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.2)'
        }}>
          <div style={{position: 'absolute', top: 12, right: 15, background: 'rgba(255,255,255,0.25)', padding: '4px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '5px'}}>
            <CheckCircle size={16} /> Verified
          </div>
          <div style={{margin: '0 auto 15px auto', display: 'flex', justifyContent: 'center'}}>
            {window.Telegram?.WebApp?.initDataUnsafe?.user?.photo_url ? (
              <img src={window.Telegram.WebApp.initDataUnsafe.user.photo_url} alt="Profile" style={{width: '90px', height: '90px', borderRadius: '50%', border: '4px solid rgba(255,255,255,0.3)', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', objectFit: 'cover'}} />
            ) : (
              <div style={{width: '90px', height: '90px', borderRadius: '50%', background: 'linear-gradient(135deg, #a855f7, #6366f1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '36px', fontWeight: '900', color: 'white', border: '4px solid rgba(255,255,255,0.3)', boxShadow: '0 4px 15px rgba(0,0,0,0.1)'}}>
                {(user.username || 'U').charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <h2 style={{fontWeight: '900', fontSize: '1.8rem', margin: '0 0 5px 0'}}>{user.username || 'User'}</h2>
          <p style={{opacity: '0.9', margin: 0, fontWeight: '600', fontSize: '0.9rem'}}>UID: {user.telegramId}</p>
        </div>
      ) : (
        <div style={{
          background: 'linear-gradient(135deg, #f97316, #ea580c)', padding: '30px 20px', borderRadius: '24px',
          color: 'white', boxShadow: '0 10px 25px rgba(234, 88, 12, 0.4)', position: 'relative', overflow: 'hidden',
          marginBottom: '25px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.2)'
        }}>
          <div style={{position: 'absolute', top: 12, right: 15, background: 'rgba(255,255,255,0.25)', padding: '4px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '5px'}}>
            <AlertCircle size={16} /> Not Verified
          </div>
          <div style={{margin: '0 auto 15px auto', display: 'flex', justifyContent: 'center'}}>
            {window.Telegram?.WebApp?.initDataUnsafe?.user?.photo_url ? (
              <img src={window.Telegram.WebApp.initDataUnsafe.user.photo_url} alt="Profile" style={{width: '90px', height: '90px', borderRadius: '50%', border: '4px solid rgba(255,255,255,0.3)', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', objectFit: 'cover'}} />
            ) : (
              <div style={{width: '90px', height: '90px', borderRadius: '50%', background: 'linear-gradient(135deg, #f97316, #ea580c)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '36px', fontWeight: '900', color: 'white', border: '4px solid rgba(255,255,255,0.3)', boxShadow: '0 4px 15px rgba(0,0,0,0.1)'}}>
                {(user.username || 'U').charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <h2 style={{fontWeight: '900', fontSize: '1.8rem', margin: '0 0 5px 0'}}>{user.username || 'User'}</h2>
          <p style={{opacity: '0.9', margin: 0, fontWeight: '600', fontSize: '0.9rem'}}>UID: {user.telegramId}</p>
        </div>
      )}

      {/* Balance Card */}
      <div style={{
        background: 'var(--card-bg)', borderRadius: '20px', padding: '20px',
        boxShadow: 'var(--shadow)', marginBottom: '25px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        border: 'var(--card-border)', backdropFilter: 'blur(10px)', webkitBackdropFilter: 'blur(10px)'
      }}>
        <div>
          <p style={{color: 'var(--text-secondary)', fontSize: '1.1rem', marginBottom: '5px', fontWeight: '600'}}>Total Balance</p>
          <h2 style={{color: 'var(--text-primary)', fontSize: '2.2rem', fontWeight: '900'}}>{user.balance.toFixed(2)} ৳</h2>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <button onClick={() => navigate('/withdraw')} style={{
            background: 'linear-gradient(135deg, #00e676, #00b0ff)', color: 'white', border: 'none', 
            padding: '8px 12px', borderRadius: '10px', fontWeight: '700', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer',
            boxShadow: '0 4px 10px rgba(0,230,118,0.2)'
          }}>
            <Wallet size={16} /> Withdraw
          </button>
          <button onClick={() => navigate('/add-fund')} style={{
            background: 'linear-gradient(135deg, #3b82f6, #2563eb)', color: 'white', border: 'none', 
            padding: '8px 12px', borderRadius: '10px', fontWeight: '700', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer',
            boxShadow: '0 4px 10px rgba(37,99,235,0.2)'
          }}>
            <span style={{fontSize: '16px', fontWeight: 'bold'}}>+</span> Add Fund
          </button>
        </div>
      </div>

      {/* Earnings Dashboard */}
      <div style={{ marginBottom: '25px' }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: '800', marginBottom: '15px', color: 'var(--text-primary)' }}>Earnings Dashboard</h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
          {/* Daily Earning */}
          <div style={{
            background: 'linear-gradient(135deg, #FF9A9E 0%, #FECFEF 99%, #FECFEF 100%)',
            padding: '20px', borderRadius: '20px', boxShadow: '0 8px 15px rgba(255, 154, 158, 0.3)',
            color: '#333', display: 'flex', flexDirection: 'column', justifyContent: 'center'
          }}>
            <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: '700', opacity: 0.8 }}>Daily Earning</p>
            <h2 style={{ margin: '5px 0 0 0', fontSize: '1.8rem', fontWeight: '900' }}>{earningsStats.daily.toFixed(2)} ৳</h2>
          </div>

          {/* Yesterday Earning */}
          <div style={{
            background: 'linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)',
            padding: '20px', borderRadius: '20px', boxShadow: '0 8px 15px rgba(161, 196, 253, 0.3)',
            color: '#333', display: 'flex', flexDirection: 'column', justifyContent: 'center'
          }}>
            <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: '700', opacity: 0.8 }}>Yesterday</p>
            <h2 style={{ margin: '5px 0 0 0', fontSize: '1.8rem', fontWeight: '900' }}>{earningsStats.yesterday.toFixed(2)} ৳</h2>
          </div>
        </div>

        {/* 7 Days Earning */}
        <div style={{
          background: 'linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)',
          padding: '20px', borderRadius: '20px', boxShadow: '0 8px 15px rgba(132, 250, 176, 0.3)',
          color: '#333', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px'
        }}>
          <div>
            <p style={{ margin: 0, fontSize: '0.95rem', fontWeight: '700', opacity: 0.8 }}>Last 7 Days</p>
            <h2 style={{ margin: '5px 0 0 0', fontSize: '2rem', fontWeight: '900' }}>{earningsStats.sevenDays.toFixed(2)} ৳</h2>
          </div>
          <div style={{ fontSize: '2.5rem', opacity: 0.5 }}>📅</div>
        </div>

        {/* Custom Date Earning */}
        <div style={{
          background: 'var(--card-bg)', border: '1px solid var(--border-color)',
          padding: '20px', borderRadius: '20px', boxShadow: 'var(--shadow)',
          display: 'flex', flexDirection: 'column', gap: '15px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <p style={{ margin: 0, fontSize: '1rem', fontWeight: '700', color: 'var(--text-primary)' }}>Custom Date Earning</p>
            <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '900', color: 'var(--text-primary)' }}>{earningsStats.customDateEarning.toFixed(2)} ৳</h2>
          </div>
          <input 
            type="date" 
            value={customDate}
            onChange={(e) => setCustomDate(e.target.value)}
            style={{
              padding: '12px 15px', borderRadius: '12px', border: '1px solid var(--border-color)',
              background: 'var(--bg-color)', color: 'var(--text-primary)', outline: 'none',
              fontFamily: 'inherit', fontWeight: '600', width: '100%', boxSizing: 'border-box'
            }}
          />
        </div>
      </div>

      {/* Account Verification Section (Only if not verified) */}
      {!user.isVerified && (
        <div style={{
          background: 'rgba(251, 191, 36, 0.15)', borderRadius: '20px', padding: '20px',
          boxShadow: 'var(--shadow)', marginBottom: '25px', border: '1px solid rgba(253, 211, 77, 0.3)',
          backdropFilter: 'blur(10px)', webkitBackdropFilter: 'blur(10px)'
        }}>
          <h3 style={{fontSize: '1.2rem', fontWeight: '800', color: '#fcd34d', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '5px'}}>
            <AlertCircle size={20} /> Account Not Verified
          </h3>
          <p style={{color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '15px', fontWeight: '600'}}>
            একাউন্ট ভেরিফাই করার জন্য {links.activationFee || 20} টাকা ফি প্রদান করুন। ভেরিফাই করলে আপনি ৪ জেনারেশন (৫+২+১+১) পর্যন্ত রেফার কমিশন পাবেন!
          </p>
          
          <div style={{background: 'var(--input-bg)', padding: '15px', borderRadius: '12px', marginBottom: '15px', border: '1px solid var(--border-color)'}}>
            <p style={{fontWeight: '700', marginBottom: '5px', color: 'var(--text-primary)'}}>Send {links.activationFee || 20} ৳ to any number:</p>
            <ul style={{listStyle: 'none', padding: 0, margin: 0, color: 'var(--text-secondary)', fontSize: '0.95rem'}}>
              <li style={{marginBottom: '5px'}}><strong style={{color: '#ff4081'}}>bKash:</strong> {links.bkashNumber}</li>
              <li style={{marginBottom: '5px'}}><strong style={{color: '#ff6d00'}}>Nagad:</strong> {links.nagadNumber}</li>
              <li><strong style={{color: '#b388ff'}}>Rocket:</strong> {links.rocketNumber}</li>
            </ul>
          </div>

          <input 
            type="text" 
            value={trxId}
            onChange={(e) => setTrxId(e.target.value)}
            placeholder="Enter Transaction ID (TrxID)" 
            style={{
              width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid var(--input-border)',
              background: 'var(--input-bg)', color: 'var(--text-primary)', marginBottom: '10px', fontSize: '1rem', outline: 'none'
            }} 
          />
          <button onClick={submitVerification} style={{
            background: 'linear-gradient(135deg, #d60093, #8b00ff)', color: 'white', 
            padding: '14px', borderRadius: '12px', fontSize: '1.1rem', fontWeight: '800', 
            width: '100%', border: 'none', boxShadow: '0 4px 15px rgba(139, 0, 255, 0.3)'
          }}>
            Submit Verification
          </button>
        </div>
      )}

      {/* Post & Manage Microjobs Expand Toggle */}
      <button 
        onClick={() => setShowManageJobs(!showManageJobs)} 
        style={{
          width: '100%',
          background: 'linear-gradient(135deg, #d60093, #8b00ff)',
          color: 'white',
          padding: '15px',
          borderRadius: '16px',
          fontWeight: '800',
          fontSize: '1.1rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          cursor: 'pointer',
          boxShadow: '0 8px 25px rgba(139, 0, 255, 0.3)',
          border: '1px solid rgba(255,255,255,0.1)'
        }}
      >
        <Briefcase size={20} />
        {showManageJobs ? 'Close Job Manager' : 'Post & Manage Microjobs 💼'}
      </button>

      {showManageJobs && (
        <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Post a Microjob Card */}
          <div style={{
            background: 'var(--card-bg)', borderRadius: '20px', padding: '20px',
            boxShadow: 'var(--shadow)', border: 'var(--card-border)',
            backdropFilter: 'blur(10px)', webkitBackdropFilter: 'blur(10px)', color: 'var(--text-primary)'
          }}>
            <h3 style={{fontSize: '1.2rem', fontWeight: '900', color: 'var(--text-primary)', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '8px'}}>
              💼 Create a Campaign
            </h3>
            <p style={{fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '15px'}}>আপনার যেকোনো কাজের জন্য ক্যাম্পেইন তৈরি করুন এবং অন্যদের দিয়ে কাজ করিয়ে নিন।</p>
            
            <form onSubmit={handlePostJob}>
              <div style={{marginBottom: '12px'}}>
                <label style={{fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-primary)', display: 'block', marginBottom: '5px'}}>কাজের শিরোনাম (Job Title)</label>
                <input type="text" placeholder="e.g. Follow my TikTok handle" value={jobTitle} onChange={e => setJobTitle(e.target.value)} style={{width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--input-border)', background: 'var(--input-bg)', color: 'var(--text-primary)', outline: 'none', fontSize: '0.9rem'}} />
              </div>
              <div style={{marginBottom: '12px'}}>
                <label style={{fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-primary)', display: 'block', marginBottom: '5px'}}>কাজের বিবরণ ও নিয়ম (Instructions)</label>
                <textarea rows={3} placeholder="e.g. Go to the link, follow my profile, and submit your username as proof." value={jobDesc} onChange={e => setJobDesc(e.target.value)} style={{width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--input-border)', background: 'var(--input-bg)', color: 'var(--text-primary)', outline: 'none', fontSize: '0.9rem', resize: 'vertical', fontFamily: 'inherit'}} />
              </div>
              <div style={{marginBottom: '12px'}}>
                <label style={{fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-primary)', display: 'block', marginBottom: '5px'}}>লিংক (Target Link)</label>
                <input type="url" placeholder="e.g. https://tiktok.com/@yourusername" value={jobLink} onChange={e => setJobLink(e.target.value)} style={{width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--input-border)', background: 'var(--input-bg)', color: 'var(--text-primary)', outline: 'none', fontSize: '0.9rem'}} />
              </div>
              <div style={{marginBottom: '15px'}}>
                <label style={{fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-primary)', display: 'block', marginBottom: '5px'}}>কাজের মূল্য (Reward per complete in ৳)</label>
                <input type="number" placeholder="e.g. 5" value={jobAmount} onChange={e => setJobAmount(e.target.value)} style={{width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--input-border)', background: 'var(--input-bg)', color: 'var(--text-primary)', outline: 'none', fontSize: '0.9rem'}} />
              </div>
              <div style={{marginBottom: '15px'}}>
                <label style={{fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-primary)', display: 'block', marginBottom: '5px'}}>সর্বোচ্চ কতজন কাজ করতে পারবে (Worker Limit - ০ মানে আনলিমিটেড)</label>
                <input type="number" placeholder="e.g. 10 (0 for unlimited)" value={jobLimit} onChange={e => setJobLimit(e.target.value)} style={{width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--input-border)', background: 'var(--input-bg)', color: 'var(--text-primary)', outline: 'none', fontSize: '0.9rem'}} />
              </div>
              
              <button type="submit" disabled={isPosting} style={{
                background: 'linear-gradient(90deg, #d60093 0%, #8b00ff 100%)', color: 'white', border: 'none',
                padding: '12px', borderRadius: '10px', fontWeight: '800', width: '100%',
                cursor: 'pointer', transition: 'opacity 0.2s', opacity: isPosting ? 0.7 : 1,
                boxShadow: '0 4px 15px rgba(139, 0, 255, 0.3)'
              }}>
                {isPosting ? 'Posting...' : 'Post Job 🚀'}
              </button>
            </form>
          </div>

          {/* User's Posted Jobs History List */}
          <div style={{
            background: 'var(--card-bg)', borderRadius: '20px', padding: '20px',
            boxShadow: 'var(--shadow)', border: 'var(--card-border)',
            backdropFilter: 'blur(10px)', webkitBackdropFilter: 'blur(10px)', color: 'var(--text-primary)'
          }}>
            <h3 style={{fontSize: '1.2rem', fontWeight: '900', color: 'var(--text-primary)', marginBottom: '15px'}}>
              📋 My Posted Campaigns
            </h3>
            {loadingJobs ? (
              <p style={{color: 'var(--text-secondary)', fontSize: '0.9rem'}}>Loading campaigns...</p>
            ) : myJobs.length === 0 ? (
              <p style={{color: 'var(--text-secondary)', fontSize: '0.9rem'}}>আপনার কোন পোস্ট করা জব ক্যাম্পেইন নেই।</p>
            ) : (
              <div style={{display: 'flex', flexDirection: 'column', gap: '12px'}}>
                {myJobs.map((job) => (
                  <div key={job._id} style={{
                    padding: '15px', 
                    borderRadius: '12px', 
                    border: '1px solid var(--border-color)', 
                    background: 'var(--input-bg)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <div style={{flex: 1, marginRight: '10px'}}>
                      <h4 style={{fontSize: '1rem', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '3px'}}>{job.title}</h4>
                      <p style={{fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '3px'}}>Pay: {job.amount} ৳</p>
                      <p style={{fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '5px'}}>Completed: <span style={{fontWeight: '800', color: 'var(--text-primary)'}}>{job.completedCount || 0}</span> / {job.workerLimit > 0 ? job.workerLimit : 'Unlimited'}</p>
                      <span style={{
                        fontSize: '0.75rem', 
                        fontWeight: '800', 
                        color: job.isActive ? 'var(--positive-color)' : 'var(--negative-color)'
                      }}>
                        {job.isActive ? '● Active (চলমান)' : '● Offline (বন্ধ)'}
                      </span>
                    </div>
                    <div style={{display: 'flex', gap: '8px'}}>
                      <button 
                        onClick={() => toggleJobStatus(job._id)} 
                        style={{
                          background: job.isActive ? '#e53935' : '#31b545',
                          color: 'white', 
                          border: 'none', 
                          padding: '6px 12px', 
                          borderRadius: '8px', 
                          fontSize: '0.8rem', 
                          fontWeight: '700',
                          cursor: 'pointer'
                        }}
                      >
                        {job.isActive ? 'Offline' : 'Active'}
                      </button>
                      <button 
                        onClick={() => deleteJob(job._id)} 
                        style={{
                          background: 'rgba(255,255,255,0.15)', 
                          color: 'var(--negative-color)', 
                          border: '1px solid var(--negative-color)', 
                          padding: '6px 12px', 
                          borderRadius: '8px', 
                          fontSize: '0.8rem', 
                          fontWeight: '700',
                          cursor: 'pointer'
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

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
  const [userBalance, setUserBalance] = useState(0);
  const myTelegramId = window.Telegram?.WebApp?.initDataUnsafe?.user?.id?.toString() || "6323700179";

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/admin/user/${myTelegramId}`)
      .then(res => res.json())
      .then(data => {
        if (data && data.balance !== undefined) {
          setUserBalance(data.balance);
        }
      })
      .catch(console.error);
  }, [myTelegramId]);

  return (
    <div className="home-container" style={{background: 'transparent', minHeight: '100vh', padding: '20px', paddingBottom: '100px'}}>
      <div style={{display: 'flex', alignItems: 'center', marginBottom: '20px', gap: '10px'}}>
        <button onClick={() => navigate('/profile')} style={{background: 'white', border: 'none', padding: '8px', borderRadius: '12px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)'}}>
          <ChevronRight size={24} color="#374151" style={{transform: 'rotate(180deg)'}} />
        </button>
        <h2 style={{fontWeight: '900', fontSize: '1.5rem', color: '#1f2937'}}>Withdraw Funds</h2>
      </div>

      <div style={{background: 'white', borderRadius: '16px', padding: '15px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 4px 10px rgba(0,0,0,0.02)', border: '1px solid #e5e7eb'}}>
        <span style={{color: '#6b7280', fontWeight: '700', fontSize: '0.9rem'}}>Current Balance</span>
        <span style={{color: '#10b981', fontWeight: '950', fontSize: '1.25rem'}}>{userBalance} ৳</span>
      </div>

      <div style={{background: 'white', borderRadius: '20px', padding: '20px', boxShadow: '0 4px 10px rgba(0,0,0,0.03)', marginBottom: '25px'}}>
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '15px'}}>
          <h3 style={{fontSize: '1.2rem', fontWeight: '800', color: '#1f2937'}}>💸 Method</h3>
          <span style={{background: '#fee2e2', color:  'var(--negative-color)', padding: '4px 10px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: '700'}}>Min: 50 ৳</span>
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
                const amount = Number(withdrawAmount);
                if(amount < 50) return Swal.fire({ title: 'Warning', text: 'Minimum withdraw is 50 ৳', icon: 'warning', confirmButtonColor: 'var(--positive-color)' });
                if(amount > userBalance) return Swal.fire({ title: 'Warning', text: 'Insufficient balance!', icon: 'warning', confirmButtonColor: 'var(--negative-color)' });
                if(!withdrawNumber) return Swal.fire({ title: 'Warning', text: 'Please enter your account number', icon: 'warning', confirmButtonColor: 'var(--positive-color)' });

                fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/withdraw/submit`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    telegramId: myTelegramId,
                    amount: amount,
                    method: withdrawMethod,
                    accountNumber: withdrawNumber
                  })
                })
                .then(res => res.json())
                .then(data => {
                  if (data.success) {
                    Swal.fire({
                      title: 'Success!',
                      text: 'Withdraw request submitted successfully!',
                      icon: 'success',
                      confirmButtonText: 'OK',
                      confirmButtonColor: 'var(--positive-color)',
                    }).then((result) => {
                      if (result.isConfirmed) {
                        navigate('/history?tab=withdraw');
                      }
                    });
                    setWithdrawAmount(''); setWithdrawNumber(''); setWithdrawMethod('');
                  } else {
                    Swal.fire({
                      title: 'Error',
                      text: data.error || 'Submission failed.',
                      icon: 'error',
                      confirmButtonColor: 'var(--negative-color)'
                    });
                  }
                })
                .catch(err => {
                  console.error(err);
                  Swal.fire({
                    title: 'Error',
                    text: 'Server error. Please try again.',
                    icon: 'error',
                    confirmButtonColor: 'var(--negative-color)'
                  });
                });
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
      Swal.fire({
        title: 'Success!',
        text: data.message || 'Deposit request submitted successfully!',
        icon: 'success',
        confirmButtonText: 'OK',
        confirmButtonColor: 'var(--positive-color)',
      }).then((result) => {
        if (result.isConfirmed) {
          navigate('/history?tab=fund');
        }
      });
    });
  };

  return (
    <div className="home-container" style={{background: 'transparent', minHeight: '100vh', padding: '20px', paddingBottom: '100px'}}>
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
              <h3 style={{fontSize: '1.4rem', fontWeight: '900', color:  'var(--primary-color)', letterSpacing: '1px'}}>
                {method === 'bkash' ? links.bkashNumber : method === 'nagad' ? links.nagadNumber : links.rocketNumber}
              </h3>
            </div>

            <h3 style={{fontSize: '1.1rem', fontWeight: '800', color: '#1f2937', marginBottom: '15px'}}>2. Submit Details</h3>
            <input type="number" placeholder="Amount Sent (৳)" value={amount} onChange={e => setAmount(e.target.value)} style={{width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #d1d5db', marginBottom: '10px'}} />
            <input type="text" placeholder="Sender Number" value={senderNumber} onChange={e => setSenderNumber(e.target.value)} style={{width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #d1d5db', marginBottom: '10px'}} />
            <input type="text" placeholder="Transaction ID (TrxID)" value={transactionId} onChange={e => setTransactionId(e.target.value)} style={{width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #d1d5db', marginBottom: '20px'}} />
            
            <button onClick={handleAddFund} style={{background:  'var(--primary-color)', color: 'white', padding: '14px', borderRadius: '10px', fontWeight: '800', width: '100%', border: 'none'}}>Submit Request</button>
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
  const coinColor = params.get('color') ||  'var(--primary-color)';
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
    if (coinType === 'topfollows') {
      if (!couponCode) return alert("Coupon code দিন।");
      if (!senderDetails) return alert("Telegram screenshot link দিন।");
      if (!senderDetails.startsWith('http')) return alert("সঠিক screenshot link দিন (উদাঃ https://t.me/...)");
    } else {
      if (!senderDetails) return alert(`আপনার ${coinName} Username দিন — কোন ID থেকে কয়েন পাঠিয়েছেন।`);
    }
    setStep(2);
  };

  const handleSell = () => {
    if (coinType === 'topfollows') {
      if (!couponCode) return alert("Please enter your coupon code.");
      if (!senderDetails) return alert("Please enter your Telegram screenshot link.");
    } else {
      if (!senderDetails) return alert("Please enter your App ID or Sender Username.");
    }
    
    const myTelegramId = window.Telegram?.WebApp?.initDataUnsafe?.user?.id?.toString() || '6323700179';
    const myUsername = window.Telegram?.WebApp?.initDataUnsafe?.user?.username || window.Telegram?.WebApp?.initDataUnsafe?.user?.first_name || 'User';

    fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/coin/sell`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: myTelegramId, username: myUsername,
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
    <div className="home-container" style={{background: 'transparent', minHeight: '100vh', padding: '20px', paddingBottom: '100px'}}>
      <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px'}}>
        <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
          <button onClick={() => { if(step === 2) setStep(1); else navigate('/market'); }} style={{background: 'var(--card-bg)', border: 'var(--card-border)', padding: '8px', borderRadius: '12px', boxShadow: 'var(--shadow)', cursor: 'pointer', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <ChevronRight size={24} color="var(--text-primary)" style={{transform: 'rotate(180deg)'}} />
          </button>
          <h2 style={{fontWeight: '900', fontSize: '1.5rem', color: 'var(--text-primary)'}}>Sell {coinName}</h2>
        </div>
        {tutorialVideo && (
          <a href={tutorialVideo} target="_blank" rel="noopener noreferrer" style={{fontSize:'0.8rem', fontWeight:'700', color:'#ec4899', textDecoration:'none', display:'flex', alignItems:'center', gap:'5px', background:'var(--card-bg)', border: 'var(--card-border)', padding:'6px 12px', borderRadius:'20px', boxShadow:'var(--shadow)'}}>
            <PlayCircle size={16} /> ভিডিও দেখুন
          </a>
        )}
      </div>

      <div style={{background: 'var(--card-bg)', borderRadius: '20px', padding: '20px', boxShadow: 'var(--shadow)', border: 'var(--card-border)', borderTop: `6px solid ${coinColor}`}}>
        
        {step === 1 ? (
          <>
            <div style={{textAlign: 'center', marginBottom: '20px'}}>
              <h3 style={{fontSize: '2rem', fontWeight: '900', color: coinColor}}>{coinPrice} ৳</h3>
              <p style={{fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: '600'}}>Rate per 1,000 Coins</p>
            </div>

            {coinType === 'topfollows' && (
              <div style={{ background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.2)', padding: '15px', borderRadius: '14px', marginBottom: '15px' }}>
                <p style={{ color: '#d97706', fontWeight: '800', fontSize: '0.85rem', marginBottom: '5px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <AlertCircle size={16} /> ATTENTION!
                </p>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', margin: '0 0 5px 0', lineHeight: '1.4', fontWeight: '600' }}>
                  প্রথমে একটি coupon code তৈরি করুন এবং সেটার screenshot নিয়ে নিচের লিংকে submit করুন:
                </p>
                <p style={{ textAlign: 'center', margin: '8px 0' }}>
                  👉 <a href={targetUser || "https://t.me/topfollowproof"} target="_blank" rel="noreferrer" style={{ color: 'var(--primary-color)', fontWeight: '800', textDecoration: 'underline' }}>{targetUser || "https://t.me/topfollowproof"}</a> 👈
                </p>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', margin: 0, lineHeight: '1.4', fontWeight: '600' }}>
                  এরপর টেলিগ্রামে আপলোড করা screenshot-এর লিংকটি কপি করে নিচের বক্সে দিন। সাথে coupon code, amount এবং payment method সিলেক্ট করে ফর্ম submit করুন।
                </p>
              </div>
            )}

            <div style={{marginBottom: '15px'}}>
              <label style={{display: 'block', fontSize: '0.9rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '5px'}}>Coin Amount</label>
              <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder={`Min ${minAmount}`} style={{width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid var(--input-border)', background: 'var(--input-bg)', color: 'var(--text-primary)', fontSize: '1rem', outline: 'none'}} />
            </div>

            <div style={{marginBottom: '15px'}}>
              <label style={{display: 'block', fontSize: '0.9rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '5px'}}>Payment Method</label>
              <div style={{display: 'flex', gap: '10px'}}>
                {/* bKash */}
                <div onClick={() => setPaymentMethod('bkash')} style={{flex: 1, cursor: 'pointer', textAlign: 'center', padding: '10px', borderRadius: '12px', border: paymentMethod === 'bkash' ? `2px solid ${coinColor}` : '1px solid var(--border-color)', background: paymentMethod === 'bkash' ? 'var(--input-bg)' : 'var(--card-bg)'}}>
                  <img src="https://play-lh.googleusercontent.com/ncgi2sk_NS5u8TfsEVmdaqQhRlv6D0c9JIQ-GmHvazUbp9GDU8gxNZxaq98ysy34juOmSA15KlPLjoAgquZ0nQ" alt="bKash" style={{width: '36px', height: '36px', borderRadius: '8px', margin: '0 auto 8px auto', objectFit: 'cover'}} />
                  <span style={{fontSize: '0.8rem', fontWeight: '700', color: paymentMethod === 'bkash' ? coinColor : '#e2136e', display: 'block'}}>bKash</span>
                </div>
                {/* Nagad */}
                <div onClick={() => setPaymentMethod('nagad')} style={{flex: 1, cursor: 'pointer', textAlign: 'center', padding: '10px', borderRadius: '12px', border: paymentMethod === 'nagad' ? `2px solid ${coinColor}` : '1px solid var(--border-color)', background: paymentMethod === 'nagad' ? 'var(--input-bg)' : 'var(--card-bg)'}}>
                  <img src="https://play-lh.googleusercontent.com/tFk8R3Fkav7fZEY8e7VJtMwtRCowaWU2Us-AmWaKnTOWBer427fPjWetoOnhrUM4nWeZb0AOEJ6lnlwJ9HRu" alt="Nagad" style={{width: '36px', height: '36px', borderRadius: '8px', margin: '0 auto 8px auto', objectFit: 'cover'}} />
                  <span style={{fontSize: '0.8rem', fontWeight: '700', color: paymentMethod === 'nagad' ? coinColor : '#ea580c', display: 'block'}}>Nagad</span>
                </div>
                {/* Rocket */}
                <div onClick={() => setPaymentMethod('rocket')} style={{flex: 1, cursor: 'pointer', textAlign: 'center', padding: '10px', borderRadius: '12px', border: paymentMethod === 'rocket' ? `2px solid ${coinColor}` : '1px solid var(--border-color)', background: paymentMethod === 'rocket' ? 'var(--input-bg)' : 'var(--card-bg)'}}>
                  <img src="https://play-lh.googleusercontent.com/hcRpk0BWUTNPwr1bRWzNVKGZd2lbtdtNS9d__2w6glKwAUE_xvTh8FjkipEnzrlbEVCGsQ-75UwA5HRAYzHEdw" alt="Rocket" style={{width: '36px', height: '36px', borderRadius: '8px', margin: '0 auto 8px auto', objectFit: 'cover'}} />
                  <span style={{fontSize: '0.8rem', fontWeight: '700', color: paymentMethod === 'rocket' ? coinColor : '#8b5cf6', display: 'block'}}>Rocket</span>
                </div>
              </div>
            </div>

            <div style={{marginBottom: '20px'}}>
              <label style={{display: 'block', fontSize: '0.9rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '5px'}}>Account Number</label>
              <input type="text" value={paymentNumber} onChange={e => setPaymentNumber(e.target.value)} placeholder="01XXXXXXXXX" style={{width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid var(--input-border)', background: 'var(--input-bg)', color: 'var(--text-primary)', fontSize: '1rem', outline: 'none'}} />
            </div>

            {/* Admin ID to send coins to */}
            {targetUser && coinType !== 'topfollows' && (
              <div style={{background: 'rgba(59, 130, 246, 0.1)', padding: '15px', borderRadius: '14px', marginBottom: '15px', border: `2px solid ${coinColor}`}}>
                <p style={{fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '6px', letterSpacing: '0.05em'}}>📤 এই ID তে কয়েন পাঠান</p>
                <span style={{fontWeight: '900', fontSize: '1.3rem', color: coinColor, userSelect: 'all', wordBreak: 'break-all', display: 'block'}}>{targetUser}</span>
                <p style={{fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px'}}>উপরের ID তে কয়েন পাঠিয়ে নিচে আপনার ID দিন</p>
              </div>
            )}

            {/* Coupon Code Input for topfollows */}
            {coinType === 'topfollows' && (
              <div style={{marginBottom: '15px'}}>
                <label style={{display: 'block', fontSize: '0.9rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '5px'}}>COUPON CODE</label>
                <input type="text" value={couponCode} onChange={e => setCouponCode(e.target.value)} placeholder="Enter coupon code..." style={{width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid var(--input-border)', background: 'var(--input-bg)', color: 'var(--text-primary)', fontSize: '1rem', outline: 'none'}} />
              </div>
            )}

            {/* Sender ID / Screenshot Link field */}
            <div style={{marginBottom: '15px'}}>
              <label style={{display: 'block', fontSize: '0.9rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '5px'}}>
                {coinType === 'topfollows' ? 'SCREENSHOT LINK' : `আপনার যে ${coinName} ID থেকে পাঠিয়েছেন`}
              </label>
              <input 
                type="text" 
                value={senderDetails} 
                onChange={e => setSenderDetails(e.target.value)} 
                placeholder={coinType === 'topfollows' ? "https://t.me/topfollowproof/..." : `আপনার ${coinName} Username / ID`} 
                style={{width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid var(--input-border)', background: 'var(--input-bg)', color: 'var(--text-primary)', fontSize: '1rem', outline: 'none'}} 
              />
              <p style={{fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px'}}>
                {coinType === 'topfollows' 
                  ? 'টেলিগ্রাম থেকে স্ক্রিনশট লিংকটি কপি করে এখানে দিন' 
                  : 'কোন ID থেকে কয়েন পাঠিয়েছেন সেটা লিখুন'}
              </p>
            </div>

            <div style={{background: 'var(--input-bg)', padding: '15px', borderRadius: '12px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
              <span style={{fontWeight: '700', color: 'var(--text-secondary)'}}>You will receive:</span>
              <span style={{fontWeight: '900', color:  'var(--positive-color)', fontSize: '1.2rem'}}>{totalTaka > 0 ? totalTaka.toFixed(2) : '0.00'} ৳</span>
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
            <div style={{background: 'rgba(16, 185, 129, 0.1)', borderRadius: '14px', padding: '16px', marginBottom: '18px', border: '1px solid rgba(16, 185, 129, 0.2)'}}>
              <h3 style={{fontWeight: '800', color: 'var(--positive-color)', marginBottom: '12px', fontSize: '1rem'}}>✅ রিকোয়েস্ট সারাংশ</h3>
              <div style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>
                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                  <span style={{color: 'var(--text-secondary)', fontSize: '0.85rem'}}>কয়েন পরিমাণ</span>
                  <span style={{fontWeight: '800', color: 'var(--text-primary)'}}>{amount} Coins</span>
                </div>
                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                  <span style={{color: 'var(--text-secondary)', fontSize: '0.85rem'}}>পাবেন</span>
                  <span style={{fontWeight: '800', color:  'var(--positive-color)'}}>{totalTaka.toFixed(2)} ৳</span>
                </div>
                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                  <span style={{color: 'var(--text-secondary)', fontSize: '0.85rem'}}>Payment Method</span>
                  <span style={{fontWeight: '800', color: 'var(--text-primary)', textTransform: 'capitalize'}}>{paymentMethod}</span>
                </div>
                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                  <span style={{color: 'var(--text-secondary)', fontSize: '0.85rem'}}>Account No.</span>
                  <span style={{fontWeight: '800', color: 'var(--text-primary)'}}>{paymentNumber}</span>
                </div>
                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                  <span style={{color: 'var(--text-secondary)', fontSize: '0.85rem'}}>
                    {coinType === 'topfollows' ? 'Screenshot Link' : 'পাঠানো ID'}
                  </span>
                  <span style={{fontWeight: '800', color: '#2563eb', wordBreak: 'break-all', textAlign: 'right', maxWidth: '60%'}}>
                    {coinType === 'topfollows' ? (
                      <a href={senderDetails} target="_blank" rel="noreferrer" style={{color: 'var(--primary-color)', textDecoration: 'underline'}}>{senderDetails}</a>
                    ) : (
                      senderDetails
                    )}
                  </span>
                </div>
                {coinType === 'topfollows' && (
                  <div style={{display: 'flex', justifyContent: 'space-between'}}>
                    <span style={{color: 'var(--text-secondary)', fontSize: '0.85rem'}}>Coupon Code</span>
                    <span style={{fontWeight: '800', color: 'var(--text-primary)'}}>{couponCode}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Admin ID reminder */}
            {coinType !== 'topfollows' && (
              <div style={{background: '#eff6ff', padding: '14px', borderRadius: '12px', border: `2px solid ${coinColor}`, marginBottom: '18px', textAlign: 'center'}}>
                <p style={{fontSize: '0.8rem', color: '#6b7280', marginBottom: '4px', fontWeight: '700'}}>📤 আপনি কি এই ID তে কয়েন পাঠিয়েছেন?</p>
                <span style={{fontWeight: '900', fontSize: '1.2rem', color: coinColor, userSelect: 'all'}}>
                  {targetUser || <span style={{color: 'var(--negative-color)'}}>⚠️ Admin ID নেই</span>}
                </span>
              </div>
            )}

            {coinType === 'topfollower' && (
              <div style={{marginBottom: '18px'}}>
                <label style={{display: 'block', fontSize: '0.9rem', fontWeight: '700', color: '#374151', marginBottom: '5px'}}>Coupon Code (Optional)</label>
                <input type="text" value={couponCode} onChange={e => setCouponCode(e.target.value)} placeholder="Enter coupon code if any" style={{width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid #d1d5db', fontSize: '1rem', outline: 'none'}} />
              </div>
            )}

            <button onClick={handleSell} style={{
              background:  'var(--positive-color)', color: 'white', padding: '16px', borderRadius: '12px', fontSize: '1.1rem', fontWeight: '800', width: '100%', border: 'none', boxShadow: '0 4px 10px rgba(16,185,129,0.2)'
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
  
  const [coinHistory, setCoinHistory] = useState([]);
  const [workHistory, setWorkHistory] = useState([]);
  const [fundHistory, setFundHistory] = useState([]);
  const [withdrawHistory, setWithdrawHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const myTelegramId = window.Telegram?.WebApp?.initDataUnsafe?.user?.id?.toString() || "6323700179";

  useEffect(() => {
    setLoading(true);
    const host = import.meta.env.VITE_API_URL || "http://localhost:5000";
    Promise.all([
      fetch(`${host}/api/coin/history/${myTelegramId}`).then(res => res.json()).catch(() => []),
      fetch(`${host}/api/jobs/history/${myTelegramId}`).then(res => res.json()).catch(() => []),
      fetch(`${host}/api/fund/history/${myTelegramId}`).then(res => res.json()).catch(() => []),
      fetch(`${host}/api/withdraw/history/${myTelegramId}`).then(res => res.json()).catch(() => [])
    ]).then(([coinData, workData, fundData, withdrawData]) => {
      setCoinHistory(Array.isArray(coinData) ? coinData : []);
      setWorkHistory(Array.isArray(workData) ? workData : []);
      setFundHistory(Array.isArray(fundData) ? fundData : []);
      setWithdrawHistory(Array.isArray(withdrawData) ? withdrawData : []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [myTelegramId]);

  return (
    <div style={{background: 'transparent', minHeight: '100vh', padding: '20px', paddingBottom: '100px'}}>
      <div style={{display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px'}}>
        <button onClick={() => navigate(-1)} style={{background: 'var(--card-bg)', border: 'var(--card-border)', padding: '8px', borderRadius: '12px', boxShadow: 'var(--shadow)', cursor: 'pointer', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <ChevronRight size={24} color="var(--text-primary)" style={{transform: 'rotate(180deg)'}} />
        </button>
        <h2 style={{fontWeight: '900', fontSize: '1.5rem', color: 'var(--text-primary)', margin: 0}}>History</h2>
      </div>

      <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '20px', background: 'var(--card-bg)', border: 'var(--card-border)', padding: '5px', borderRadius: '14px', boxShadow: 'var(--shadow)'}}>
        <button onClick={() => setActiveTab('coin')} style={{padding: '12px 6px', borderRadius: '10px', border: 'none', background: activeTab === 'coin' ? 'var(--input-bg)' : 'transparent', color: activeTab === 'coin' ? '#2563eb' : 'var(--text-secondary)', fontWeight: '800', cursor: 'pointer', transition: 'all 0.2s', fontSize: '0.85rem'}}>💰 Coin Sell</button>
        <button onClick={() => setActiveTab('work')} style={{padding: '12px 6px', borderRadius: '10px', border: 'none', background: activeTab === 'work' ? 'var(--input-bg)' : 'transparent', color: activeTab === 'work' ? '#8b5cf6' : 'var(--text-secondary)', fontWeight: '800', cursor: 'pointer', transition: 'all 0.2s', fontSize: '0.85rem'}}>💼 Work History</button>
        <button onClick={() => setActiveTab('fund')} style={{padding: '12px 6px', borderRadius: '10px', border: 'none', background: activeTab === 'fund' ? 'var(--input-bg)' : 'transparent', color: activeTab === 'fund' ? '#0d9488' : 'var(--text-secondary)', fontWeight: '800', cursor: 'pointer', transition: 'all 0.2s', fontSize: '0.85rem'}}>💳 Add Fund</button>
        <button onClick={() => setActiveTab('withdraw')} style={{padding: '12px 6px', borderRadius: '10px', border: 'none', background: activeTab === 'withdraw' ? 'var(--input-bg)' : 'transparent', color: activeTab === 'withdraw' ? '#ea580c' : 'var(--text-secondary)', fontWeight: '800', cursor: 'pointer', transition: 'all 0.2s', fontSize: '0.85rem'}}>💸 Withdraw</button>
      </div>

      {loading ? (
        <p style={{textAlign: 'center', color: 'var(--text-secondary)'}}>Loading history...</p>
      ) : (
        <>
          {activeTab === 'coin' && (
            <div>
              {coinHistory.length === 0 ? (
                <div style={{textAlign: 'center', padding: '40px 20px', background: 'var(--card-bg)', border: 'var(--card-border)', borderRadius: '16px', boxShadow: 'var(--shadow)'}}>
                  <div style={{fontSize: '3rem', marginBottom: '10px'}}>📄</div>
                  <h3 style={{color: 'var(--text-primary)', fontWeight: '800'}}>No Coin Sell History</h3>
                  <p style={{color: 'var(--text-secondary)', fontSize: '0.9rem'}}>You haven't sold any coins yet.</p>
                </div>
              ) : (
                coinHistory.map((item, idx) => (
                  <div key={idx} style={{background: 'var(--card-bg)', padding: '15px', borderRadius: '16px', marginBottom: '10px', boxShadow: 'var(--shadow)', border: 'var(--card-border)'}}>
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px'}}>
                      <h4 style={{fontWeight: '800', color: 'var(--text-primary)', margin: 0, textTransform: 'capitalize'}}>{item.coinType}</h4>
                      <span style={{
                        background: item.status === 'Pending' ? '#fef3c7' : item.status === 'Accepted' ? '#dcfce7' : '#fee2e2',
                        color: item.status === 'Pending' ? '#d97706' : item.status === 'Accepted' ? 'var(--positive-color)' : 'var(--negative-color)',
                        padding: '4px 8px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: '700'
                      }}>{item.status}</span>
                    </div>
                    <p style={{fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '0 0 4px 0'}}>Amount: <strong style={{color: 'var(--text-primary)'}}>{item.amount}</strong></p>
                    <p style={{fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '0 0 4px 0'}}>Method: <strong style={{color: 'var(--text-primary)'}}>{item.paymentMethod}</strong> ({item.paymentNumber})</p>
                    <p style={{fontSize: '0.8rem', color: 'var(--text-secondary)', opacity: 0.8, margin: 0}}>{new Date(item.createdAt).toLocaleString()}</p>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'work' && (
            <div>
              {workHistory.length === 0 ? (
                <div style={{textAlign: 'center', padding: '40px 20px', background: 'var(--card-bg)', border: 'var(--card-border)', borderRadius: '16px', boxShadow: 'var(--shadow)'}}>
                  <div style={{fontSize: '3rem', marginBottom: '10px'}}>🛠️</div>
                  <h3 style={{color: 'var(--text-primary)', fontWeight: '800'}}>No Work History</h3>
                  <p style={{color: 'var(--text-secondary)', fontSize: '0.9rem'}}>You haven't completed any tasks yet.</p>
                </div>
              ) : (
                workHistory.map((item, idx) => (
                  <div key={idx} style={{background: 'var(--card-bg)', padding: '15px', borderRadius: '16px', marginBottom: '10px', boxShadow: 'var(--shadow)', border: 'var(--card-border)'}}>
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px'}}>
                      <h4 style={{fontWeight: '800', color: 'var(--text-primary)', margin: 0}}>{item.jobTitle || item.jobId?.title || 'Microjob'}</h4>
                      <span style={{
                        background: item.status === 'pending' ? '#fef3c7' : item.status === 'approved' ? '#dcfce7' : '#fee2e2',
                        color: item.status === 'pending' ? '#d97706' : item.status === 'approved' ? 'var(--positive-color)' : 'var(--negative-color)',
                        padding: '4px 8px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: '700'
                      }}>{item.status.toUpperCase()}</span>
                    </div>
                    <p style={{fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '0 0 4px 0'}}>Proof Submitted: <strong style={{color: 'var(--text-primary)'}}>{item.submittedId}</strong></p>
                    <p style={{fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '0 0 4px 0'}}>Reward: <strong style={{color: 'var(--text-primary)'}}>{item.rewardAmount !== undefined ? item.rewardAmount : (item.jobId?.amount || 0)} ৳</strong></p>
                    <p style={{fontSize: '0.8rem', color: 'var(--text-secondary)', opacity: 0.8, margin: 0}}>{new Date(item.createdAt).toLocaleString()}</p>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'fund' && (
            <div>
              {fundHistory.length === 0 ? (
                <div style={{textAlign: 'center', padding: '40px 20px', background: 'var(--card-bg)', border: 'var(--card-border)', borderRadius: '16px', boxShadow: 'var(--shadow)'}}>
                  <div style={{fontSize: '3rem', marginBottom: '10px'}}>💳</div>
                  <h3 style={{color: 'var(--text-primary)', fontWeight: '800'}}>No Add Fund History</h3>
                  <p style={{color: 'var(--text-secondary)', fontSize: '0.9rem'}}>You haven't requested to add funds yet.</p>
                </div>
              ) : (
                fundHistory.map((item, idx) => (
                  <div key={idx} style={{background: 'var(--card-bg)', padding: '15px', borderRadius: '16px', marginBottom: '10px', boxShadow: 'var(--shadow)', border: 'var(--card-border)'}}>
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px'}}>
                      <h4 style={{fontWeight: '800', color: 'var(--text-primary)', margin: 0, textTransform: 'capitalize'}}>{item.paymentMethod} Deposit</h4>
                      <span style={{
                        background: item.status === 'Pending' ? '#fef3c7' : item.status === 'Accepted' ? '#dcfce7' : '#fee2e2',
                        color: item.status === 'Pending' ? '#d97706' : item.status === 'Accepted' ? 'var(--positive-color)' : 'var(--negative-color)',
                        padding: '4px 8px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: '700'
                      }}>{item.status}</span>
                    </div>
                    <p style={{fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '0 0 4px 0'}}>Amount: <strong style={{color: 'var(--text-primary)'}}>{item.amount} ৳</strong></p>
                    <p style={{fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '0 0 4px 0'}}>Sender: <strong style={{color: 'var(--text-primary)'}}>{item.senderNumber}</strong></p>
                    <p style={{fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '0 0 4px 0'}}>TrxID: <strong style={{color: 'var(--text-primary)'}}>{item.transactionId}</strong></p>
                    <p style={{fontSize: '0.8rem', color: 'var(--text-secondary)', opacity: 0.8, margin: 0}}>{new Date(item.createdAt).toLocaleString()}</p>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'withdraw' && (
            <div>
              {withdrawHistory.length === 0 ? (
                <div style={{textAlign: 'center', padding: '40px 20px', background: 'var(--card-bg)', border: 'var(--card-border)', borderRadius: '16px', boxShadow: 'var(--shadow)'}}>
                  <div style={{fontSize: '3rem', marginBottom: '10px'}}>💸</div>
                  <h3 style={{color: 'var(--text-primary)', fontWeight: '800'}}>No Withdraw History</h3>
                  <p style={{color: 'var(--text-secondary)', fontSize: '0.9rem'}}>You haven't made any withdrawals yet.</p>
                </div>
              ) : (
                withdrawHistory.map((item, idx) => (
                  <div key={idx} style={{background: 'var(--card-bg)', padding: '15px', borderRadius: '16px', marginBottom: '10px', boxShadow: 'var(--shadow)', border: 'var(--card-border)'}}>
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px'}}>
                      <h4 style={{fontWeight: '800', color: 'var(--text-primary)', margin: 0, textTransform: 'capitalize'}}>{item.method} Withdraw</h4>
                      <span style={{
                        background: item.status === 'pending' ? '#fef3c7' : item.status === 'paid' ? '#dcfce7' : '#fee2e2',
                        color: item.status === 'pending' ? '#d97706' : item.status === 'paid' ? 'var(--positive-color)' : 'var(--negative-color)',
                        padding: '4px 8px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: '700'
                      }}>{item.status.toUpperCase()}</span>
                    </div>
                    <p style={{fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '0 0 4px 0'}}>Amount: <strong style={{color: 'var(--text-primary)'}}>{item.amount} ৳</strong></p>
                    <p style={{fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '0 0 4px 0'}}>Account: <strong style={{color: 'var(--text-primary)'}}>{item.accountNumber}</strong></p>
                    <p style={{fontSize: '0.8rem', color: 'var(--text-secondary)', opacity: 0.8, margin: 0}}>{new Date(item.createdAt).toLocaleString()}</p>
                  </div>
                ))
              )}
            </div>
          )}
        </>
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
    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/referrals/${myTelegramId}`)
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
    <div className="home-container" style={{background: 'transparent', minHeight: '100vh', padding: '20px', paddingBottom: '100px'}}>
      
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
      <div style={{
        background: 'var(--card-bg)', borderRadius: '20px', padding: '20px',
        boxShadow: 'var(--shadow)', border: 'var(--card-border)',
        backdropFilter: 'blur(10px)', webkitBackdropFilter: 'blur(10px)', color: 'var(--text-primary)', marginBottom: '25px'
      }}>
        <h3 style={{fontSize: '1.1rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '10px'}}>Your Referral Link</h3>
        <div style={{
          display: 'flex', alignItems: 'center', background: 'var(--input-bg)', padding: '12px', 
          borderRadius: '12px', border: '1px dashed var(--input-border)', marginBottom: '15px'
        }}>
          <input 
            type="text" 
            value={referralLink} 
            readOnly 
            style={{flex: 1, background: 'transparent', border: 'none', outline: 'none', color: 'var(--text-secondary)', fontSize: '0.9rem'}} 
          />
          <button onClick={copyToClipboard} style={{background: '#a855f7', color: 'white', padding: '8px 12px', borderRadius: '8px', marginLeft: '10px', display: 'flex', alignItems: 'center', gap: '5px', border: 'none'}}>
            <Copy size={16} /> Copy
          </button>
        </div>
        <a 
          href={`https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=${encodeURIComponent('Join and earn money!')}`}
          target="_blank"
          rel="noreferrer"
          style={{
            display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px',
            background: 'linear-gradient(90deg, #d60093 0%, #8b00ff 100%)', color: 'white', padding: '12px', borderRadius: '12px', 
            fontWeight: '800', textDecoration: 'none', boxShadow: '0 4px 15px rgba(139, 0, 255, 0.3)'
          }}
        >
          <Share2 size={20}/> Share to Telegram
        </a>
      </div>

      {/* Stats Box */}
      <div style={{display: 'flex', gap: '15px', marginBottom: '25px'}}>
        <div style={{flex: 1, background: 'var(--card-bg)', border: 'var(--card-border)', padding: '20px', borderRadius: '20px', boxShadow: 'var(--shadow)', backdropFilter: 'blur(10px)', webkitBackdropFilter: 'blur(10px)', textAlign: 'center'}}>
          <p style={{color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: '600'}}>Total Invites</p>
          <h2 style={{color:  'var(--text-primary)', fontSize: '2.2rem', fontWeight: '900'}}>{stats.totalReferrals}</h2>
        </div>
        <div style={{flex: 1, background: 'var(--card-bg)', border: 'var(--card-border)', padding: '20px', borderRadius: '20px', boxShadow: 'var(--shadow)', backdropFilter: 'blur(10px)', webkitBackdropFilter: 'blur(10px)', textAlign: 'center'}}>
          <p style={{color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: '600'}}>Total Earned</p>
          <h2 style={{color:  'var(--positive-color)', fontSize: '2.2rem', fontWeight: '900'}}>{stats.totalEarned} ৳</h2>
        </div>
      </div>

      {/* Referrals List */}
      <h3 style={{color: 'var(--text-primary)', marginBottom: '15px', fontWeight: '800', fontSize: '1.3rem'}}>👥 My Referrals</h3>
      
      {stats.referrals.length === 0 ? (
        <div style={{
          background: 'var(--card-bg)', borderRadius: '20px', padding: '30px', 
          boxShadow: 'var(--shadow)', border: 'var(--card-border)',
          backdropFilter: 'blur(10px)', webkitBackdropFilter: 'blur(10px)', textAlign: 'center', color: 'var(--text-secondary)'
        }}>
          <UsersIcon size={40} style={{margin: '0 auto 10px auto', opacity: 0.5}} />
          <p>No referrals yet. Share your link to start earning!</p>
        </div>
      ) : (
        <div style={{
          background: 'var(--card-bg)', borderRadius: '20px', padding: '10px',
          boxShadow: 'var(--shadow)', border: 'var(--card-border)',
          backdropFilter: 'blur(10px)', webkitBackdropFilter: 'blur(10px)', color: 'var(--text-primary)'
        }}>
          {stats.referrals.map((ref, idx) => (
            <div key={idx} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
              padding: '15px', borderBottom: idx !== stats.referrals.length - 1 ? '1px solid var(--border-color)' : 'none'
            }}>
              <div>
                <p style={{fontWeight: '700', color: 'var(--text-primary)', fontSize: '1.05rem'}}>@{ref.username || 'User'}</p>
                <span style={{fontSize: '0.8rem', color: ref.isVerified ?  'var(--positive-color)' : '#f59e0b', fontWeight: '600'}}>
                  {ref.isVerified ? '✅ Verified (Earned 5৳)' : '⏳ Pending'}
                </span>
              </div>
              <div style={{color: 'var(--text-secondary)', fontSize: '0.85rem'}}>
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
  const navigate = useNavigate();
  return (
    <div style={{ padding: '20px', paddingBottom: '100px', background: 'transparent', minHeight: '100vh' }}>
      
      {/* Header with Back Button */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '25px' }}>
        <button onClick={() => navigate('/')} style={{ background: 'var(--card-bg)', border: 'var(--card-border)', padding: '8px', borderRadius: '12px', boxShadow: 'var(--shadow)', cursor: 'pointer', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <ChevronRight size={24} color="var(--text-primary)" style={{ transform: 'rotate(180deg)' }} />
        </button>
        <div>
          <h2 style={{ fontWeight: '900', fontSize: '1.5rem', color: 'var(--text-primary)', margin: 0 }}>{job.title}</h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>কাজ করার সম্পূর্ণ গাইড</p>
        </div>
      </div>

      {/* Account Section */}
      <div style={{ backgroundColor: 'var(--card-bg)', border: 'var(--card-border)', backdropFilter: 'blur(10px)', webkitBackdropFilter: 'blur(10px)', padding: '20px', borderRadius: '20px', boxShadow: 'var(--shadow)', marginBottom: '20px' }}>
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
            <div style={{ background: 'var(--input-bg)', padding: '30px', textAlign: 'center', color: 'var(--text-secondary)', borderRadius: '12px' }}>ভিডিও সেট করা হয়নি</div>
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
              marginTop: '15px', boxShadow: '0 6px 15px rgba(59, 130, 246, 0.3)', textDecoration: 'none'
            }}
          >
            রেজিষ্ট্রেশন লিংক <ExternalLink size={20} />
          </a>
        )}
      </div>

      {/* Work Section (If exists) */}
      {job.workVideo && (
        <div style={{ backgroundColor: 'var(--card-bg)', border: 'var(--card-border)', backdropFilter: 'blur(10px)', webkitBackdropFilter: 'blur(10px)', padding: '20px', borderRadius: '20px', boxShadow: 'var(--shadow)', marginBottom: '20px' }}>
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
              <div style={{ background: 'var(--input-bg)', padding: '30px', textAlign: 'center', color: 'var(--text-secondary)', borderRadius: '12px' }}>ভিডিও সেট করা হয়নি</div>
            )}
          </div>
        </div>
      )}

      {/* Withdraw Section */}
      <div style={{ backgroundColor: 'var(--card-bg)', border: 'var(--card-border)', backdropFilter: 'blur(10px)', webkitBackdropFilter: 'blur(10px)', padding: '20px', borderRadius: '20px', boxShadow: 'var(--shadow)', marginBottom: '20px' }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--positive-color)', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '15px' }}>
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
            <div style={{ background: 'var(--input-bg)', padding: '30px', textAlign: 'center', color: 'var(--text-secondary)', borderRadius: '12px' }}>ভিডিও সেট করা হয়নি</div>
          )}
        </div>
      </div>

      {/* Admin Wallet Details Section */}
      {(job.walletAddress || job.walletType) && (
        <div style={{ backgroundColor: 'var(--card-bg)', border: 'var(--card-border)', backdropFilter: 'blur(10px)', webkitBackdropFilter: 'blur(10px)', padding: '20px', borderRadius: '20px', boxShadow: 'var(--shadow)', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#10b981', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '15px' }}>
            <Wallet size={24} /> {job.walletType || 'Admin Wallet Details'}
          </h3>
          
          <div style={{ 
            display: 'flex', alignItems: 'center', background: 'var(--input-bg)', padding: '15px', 
            borderRadius: '12px', border: '1px dashed var(--input-border)', gap: '10px'
          }}>
            <span style={{ 
              flex: 1, color: 'var(--text-primary)', fontSize: '1rem', fontWeight: '800', 
              wordBreak: 'break-all', fontFamily: 'monospace', letterSpacing: '0.5px' 
            }}>
              {job.walletAddress}
            </span>
            {job.walletAddress && (
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(job.walletAddress);
                  Swal.fire({
                    title: 'Copied!',
                    text: 'Wallet address has been copied to your clipboard.',
                    icon: 'success',
                    timer: 2000,
                    showConfirmButton: false,
                    background: '#ffffff',
                    color: '#374151'
                  });
                }} 
                style={{ 
                  background: 'var(--primary-color)', color: 'white', border: 'none', 
                  padding: '8px 15px', borderRadius: '8px', cursor: 'pointer', 
                  fontWeight: '700', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '5px' 
                }}
              >
                <Copy size={16} /> Copy
              </button>
            )}
          </div>
        </div>
      )}

    </div>
  );
};

const AdminPanel = () => {
  const [config, setConfig] = useState({
    supportLink: '',
    telegramChannel: '',
    youtubeChannel: '',
    bkashNumber: '',
    nagadNumber: '',
    rocketNumber: '',
    activationFee: 20,
  });
  const [newAdminId, setNewAdminId] = useState('');
  const [adminsList, setAdminsList] = useState([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    pendingVerifications: 0,
    pendingWithdraws: 0,
    verifications: [],
    withdraws: [],
  });
  const [taskLinks, setTaskLinks] = useState([]);
  const [coinRequests, setCoinRequests] = useState([]);
  const [addFundRequests, setAddFundRequests] = useState([]);
  const [coins, setCoins] = useState([]);
  const [marketConfig, setMarketConfig] = useState({ marketIsVisible: true });
  const [jobSubmissions, setJobSubmissions] = useState([]);
  const [bots, setBots] = useState([]);
  const [allJobs, setAllJobs] = useState([]);
  const [editingBot, setEditingBot] = useState(null);

  // User search/manage states
  const [searchId, setSearchId] = useState('');
  const [searchedUser, setSearchedUser] = useState(null);
  const [balanceAmount, setBalanceAmount] = useState('');

  // Tab states
  const [activeTab, setActiveTab] = useState('dashboard');
  const [coinTab, setCoinTab] = useState('requests');

  const myTelegramId = window.Telegram?.WebApp?.initDataUnsafe?.user?.id?.toString() || "6323700179";
  const currentAdmin = adminsList.find(a => a.telegramId === myTelegramId);
  const isMaster = currentAdmin ? currentAdmin.isMasterAdmin : (myTelegramId === "6323700179");

  const fetchBots = () => {
    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/admin/bots`)
      .then(res => res.json())
      .then(data => setBots(Array.isArray(data) ? data : []))
      .catch(console.error);
  };

  const saveBot = (botData) => {
    const formattedData = {
      ...botData,
      reward: Number(botData.reward) || 0
    };
    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/admin/bots/save`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formattedData),
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          alert('Bot saved successfully!');
          setEditingBot(null);
          fetchBots();
        } else {
          alert('Failed to save bot: ' + data.error);
        }
      })
      .catch(console.error);
  };

  const deleteBot = (id) => {
    if (window.confirm('Are you sure you want to delete this bot?')) {
      fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/admin/bots/delete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      })
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            alert('Bot deleted successfully!');
            fetchBots();
          } else {
            alert('Failed to delete bot: ' + data.error);
          }
        })
        .catch(console.error);
    }
  };

  const fetchMarketConfig = () => {
    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/config`)
      .then(res => res.json())
      .then(data => setMarketConfig(data))
      .catch(console.error);
  };

  const fetchAddFundRequests = () => {
    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/admin/fund-requests`)
      .then(res => res.json())
      .then(data => setAddFundRequests(Array.isArray(data) ? data : []))
      .catch(console.error);
  };

  const fetchCoins = () => {
    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/coins`)
      .then(res => res.json())
      .then(data => setCoins(Array.isArray(data) ? data : []))
      .catch(console.error);
  };

  const fetchCoinRequests = () => {
    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/admin/coin-requests`)
      .then(res => res.json())
      .then(data => setCoinRequests(Array.isArray(data) ? data : []))
      .catch(console.error);
  };

  const fetchStats = () => {
    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/admin/stats`)
      .then(res => res.json())
      .then(data => {
        if (!data.error && data.verifications) {
          setStats(data);
        }
      })
      .catch(console.error);
  };

  const fetchTasks = () => {
    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/tasks`)
      .then(res => res.json())
      .then(data => {
        const fetchedList = Array.isArray(data) ? data : [];
        const mergedList = Object.keys(jobData).map(taskId => {
          const found = fetchedList.find(t => t.taskId === taskId);
          return found || {
            taskId,
            title: jobData[taskId].title || taskId,
            accountVideo: '',
            workVideo: '',
            withdrawVideo: '',
            regLink: '',
            walletAddress: '',
            walletType: ''
          };
        });
        setTaskLinks(mergedList);
      })
      .catch(() => {
        const fallbackList = Object.keys(jobData).map(taskId => ({
          taskId,
          title: jobData[taskId].title || taskId,
          accountVideo: '',
          workVideo: '',
          withdrawVideo: '',
          regLink: '',
          walletAddress: '',
          walletType: ''
        }));
        setTaskLinks(fallbackList);
      });
  };

  const fetchJobSubmissions = () => {
    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/admin/job-submissions`)
      .then(res => res.json())
      .then(data => setJobSubmissions(Array.isArray(data) ? data : []))
      .catch(console.error);
  };

  const approveJobSubmission = (id) => {
    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/jobs/approve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ submissionId: id }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          alert(data.error);
        } else {
          alert('Job submission approved!');
          fetchJobSubmissions();
          fetchStats();
        }
      });
  };

  const rejectJobSubmission = (id) => {
    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/jobs/reject`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ submissionId: id }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          alert(data.error);
        } else {
          alert('Job submission rejected!');
          fetchJobSubmissions();
        }
      });
  };

  const fetchAllJobs = () => {
    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/admin/jobs`)
      .then(res => res.json())
      .then(data => setAllJobs(Array.isArray(data) ? data : []))
      .catch(console.error);
  };

  const deleteJobByAdmin = (jobId) => {
    if (window.confirm('Are you sure you want to delete this microjob?')) {
      fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/jobs/${jobId}/delete`, {
        method: 'POST',
      })
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            alert('Microjob deleted successfully!');
            fetchAllJobs();
            fetchJobSubmissions();
          } else {
            alert('Failed to delete job: ' + (data.error || 'Server error'));
          }
        })
        .catch(console.error);
    }
  };

  const getTelegramChatUrl = (telegramId, username) => {
    if (username) {
      const cleanUsername = username.replace('@', '');
      return `https://t.me/${cleanUsername}`;
    }
    return `tg://user?id=${telegramId}`;
  };

  const fetchAdminsList = () => {
    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/admin/list`)
      .then(res => res.json())
      .then(data => setAdminsList(Array.isArray(data) ? data : []))
      .catch(console.error);
  };

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/contact`)
      .then(res => res.json())
      .then(data => setConfig(data))
      .catch(console.error);
    fetchStats();
    fetchTasks();
    fetchCoinRequests();
    fetchAddFundRequests();
    fetchCoins();
    fetchMarketConfig();
    fetchJobSubmissions();
    fetchBots();
    fetchAdminsList();
    fetchAllJobs();
  }, []);

  const saveContactSettings = () => {
    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/admin/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(config),
    }).then(() => alert('Settings saved!'));
  };

  const addAdmin = () => {
    if (!newAdminId) return alert('Telegram UID দিন!');
    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/admin/add`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ newAdminId, callerId: myTelegramId }),
    })
      .then(res => res.json())
      .then(data => {
        alert(data.message || data.error);
        setNewAdminId('');
        fetchAdminsList();
      });
  };

  const promoteToMaster = (adminId) => {
    if (window.confirm('Are you sure you want to promote this admin to Master Admin?')) {
      fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/admin/promote-master`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetAdminId: adminId, callerId: myTelegramId }),
      })
        .then(res => res.json())
        .then(data => {
          alert(data.message || data.error);
          fetchAdminsList();
        })
        .catch(console.error);
    }
  };

  const removeAdmin = (adminId) => {
    const isSelf = adminId === myTelegramId;
    const confirmMsg = isSelf 
      ? 'Are you sure you want to resign/leave your admin role?' 
      : 'Are you sure you want to remove this admin?';

    if (window.confirm(confirmMsg)) {
      fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/admin/remove`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ removeAdminId: adminId, callerId: myTelegramId }),
      })
        .then(res => res.json())
        .then(data => {
          alert(data.message || data.error);
          fetchAdminsList();
          if (isSelf && data.success) {
            window.location.href = '/';
          }
        });
    }
  };

  const searchUser = () => {
    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/admin/user/${searchId}`)
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          alert(data.error);
        } else {
          setSearchedUser(data);
        }
      });
  };

  const toggleBanUser = () => {
    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/admin/user/${searchId}/ban`, { method: 'POST' })
      .then(res => res.json())
      .then(data => setSearchedUser({ ...searchedUser, isBanned: data.isBanned }));
  };

  const verifyUserNow = () => {
    if (window.confirm(`Are you sure you want to manually verify @${searchedUser.username || searchedUser.telegramId}?`)) {
      fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/admin/user/${searchId}/manual-verify`, { method: 'POST' })
        .then(res => res.json())
        .then(data => {
          if (data.error) {
            alert(data.error);
          } else {
            alert(data.message);
            setSearchedUser({ ...searchedUser, isVerified: true });
          }
        });
    }
  };

  const adjustBalance = (action) => {
    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/admin/user/${searchId}/balance`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: balanceAmount, action }),
    })
      .then(res => res.json())
      .then(data => {
        setSearchedUser({ ...searchedUser, balance: data.balance });
        setBalanceAmount('');
      });
  };

  const approveVerificationRequest = (requestId) => {
    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/admin/verify/approve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ requestId }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          alert(data.error);
        } else {
          alert('Verification request approved!');
          fetchStats();
        }
      });
  };

  const rejectVerificationRequest = (requestId) => {
    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/admin/verify/reject`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ requestId }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          alert(data.error);
        } else {
          alert('Verification request rejected!');
          fetchStats();
        }
      });
  };

  const approveWithdrawRequest = (id) => {
    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/admin/withdraw/approve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          alert(data.error);
        } else {
          alert('Withdraw request marked as paid!');
          fetchStats();
        }
      });
  };

  const saveTaskLinks = (task) => {
    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/admin/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(task),
    }).then(() => alert(`Saved links for ${task.title}`));
  };

  const handleTaskLinkChange = (index, key, val) => {
    const updated = [...taskLinks];
    updated[index][key] = val;
    setTaskLinks(updated);
  };

  const handleCoinRequestStatus = (id, status) => {
    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/admin/coin-requests/${id}/status`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    }).then(() => {
      alert(`Request ${status}`);
      fetchCoinRequests();
    });
  };

  const handleCoinRequestDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this request from history?')) {
      fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/admin/coin-requests/${id}/delete`, {
        method: 'POST',
      }).then(() => {
        alert('Request deleted successfully');
        fetchCoinRequests();
      }).catch(console.error);
    }
  };

  const saveCoinSettings = (index) => {
    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/admin/coins`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ configs: [coins[index]] }),
    }).then(() => alert(`${coins[index].label} settings saved successfully!`));
  };

  const saveMarketConfigVisibility = (visible) => {
    setMarketConfig({ marketIsVisible: visible });
    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/admin/config`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ marketIsVisible: visible }),
    });
  };

  const handleCoinConfigChange = (index, key, val) => {
    const updated = [...coins];
    updated[index][key] = val;
    setCoins(updated);
  };

  const pendingVerifyCount = stats.pendingVerifications || 0;
  const pendingCoinSellCount = coinRequests.filter(c => c.status === 'Pending').length;
  const pendingAddFundCount = addFundRequests.filter(f => f.status === 'Pending').length;
  const pendingJobProofCount = jobSubmissions.filter(j => j.status === 'pending').length;

  return (
    <div className="home-container" style={{ background: 'transparent', minHeight: '100vh', padding: '20px', paddingBottom: '100px' }}>
      <h2 style={{ textAlign: 'center', fontWeight: '900', fontSize: '1.8rem', marginBottom: '15px', color: 'var(--text-primary)' }}>Admin Dashboard</h2>
      
      {/* Tab Navigation */}
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '20px', paddingBottom: '10px', justifyContent: 'center' }}>
        <button onClick={() => setActiveTab('dashboard')} style={{ position: 'relative', background: activeTab === 'dashboard' ? 'var(--primary-color)' : 'var(--card-bg)', color: activeTab === 'dashboard' ? '#ffffff' : 'var(--text-primary)', border: 'var(--card-border)', padding: '8px 15px', borderRadius: '20px', fontWeight: '700', whiteSpace: 'nowrap', cursor: 'pointer' }}>
          Dashboard
          {pendingVerifyCount > 0 && (
            <span style={{ position: 'absolute', top: '-5px', right: '-5px', background: 'var(--negative-color)', color: 'white', borderRadius: '50%', width: '18px', height: '18px', fontSize: '0.7rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>{pendingVerifyCount}</span>
          )}
        </button>
        
        <button onClick={() => setActiveTab('users')} style={{ background: activeTab === 'users' ? 'var(--primary-color)' : 'var(--card-bg)', color: activeTab === 'users' ? '#ffffff' : 'var(--text-primary)', border: 'var(--card-border)', padding: '8px 15px', borderRadius: '20px', fontWeight: '700', whiteSpace: 'nowrap', cursor: 'pointer' }}>
          Users
        </button>

        <button onClick={() => setActiveTab('tasks')} style={{ background: activeTab === 'tasks' ? 'var(--primary-color)' : 'var(--card-bg)', color: activeTab === 'tasks' ? '#ffffff' : 'var(--text-primary)', border: 'var(--card-border)', padding: '8px 15px', borderRadius: '20px', fontWeight: '700', whiteSpace: 'nowrap', cursor: 'pointer' }}>Tasks</button>
        
        <button onClick={() => setActiveTab('coinSells')} style={{ position: 'relative', background: activeTab === 'coinSells' ? 'var(--primary-color)' : 'var(--card-bg)', color: activeTab === 'coinSells' ? '#ffffff' : 'var(--text-primary)', border: 'var(--card-border)', padding: '8px 15px', borderRadius: '20px', fontWeight: '700', whiteSpace: 'nowrap', cursor: 'pointer' }}>
          Coin Sells
          {pendingCoinSellCount > 0 && (
            <span style={{ position: 'absolute', top: '-5px', right: '-5px', background: 'var(--negative-color)', color: 'white', borderRadius: '50%', width: '18px', height: '18px', fontSize: '0.7rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>{pendingCoinSellCount}</span>
          )}
        </button>

        <button onClick={() => setActiveTab('addFunds')} style={{ position: 'relative', background: activeTab === 'addFunds' ? 'var(--primary-color)' : 'var(--card-bg)', color: activeTab === 'addFunds' ? '#ffffff' : 'var(--text-primary)', border: 'var(--card-border)', padding: '8px 15px', borderRadius: '20px', fontWeight: '700', whiteSpace: 'nowrap', cursor: 'pointer' }}>
          Add Funds
          {pendingAddFundCount > 0 && (
            <span style={{ position: 'absolute', top: '-5px', right: '-5px', background: 'var(--negative-color)', color: 'white', borderRadius: '50%', width: '18px', height: '18px', fontSize: '0.7rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>{pendingAddFundCount}</span>
          )}
        </button>

        <button onClick={() => setActiveTab('jobProofs')} style={{ position: 'relative', background: activeTab === 'jobProofs' ? 'var(--primary-color)' : 'var(--card-bg)', color: activeTab === 'jobProofs' ? '#ffffff' : 'var(--text-primary)', border: 'var(--card-border)', padding: '8px 15px', borderRadius: '20px', fontWeight: '700', whiteSpace: 'nowrap', cursor: 'pointer' }}>
          Job Proofs
          {pendingJobProofCount > 0 && (
            <span style={{ position: 'absolute', top: '-5px', right: '-5px', background: 'var(--negative-color)', color: 'white', borderRadius: '50%', width: '18px', height: '18px', fontSize: '0.7rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>{pendingJobProofCount}</span>
          )}
        </button>

        <button onClick={() => setActiveTab('manageJobs')} style={{ background: activeTab === 'manageJobs' ? 'var(--primary-color)' : 'var(--card-bg)', color: activeTab === 'manageJobs' ? '#ffffff' : 'var(--text-primary)', border: 'var(--card-border)', padding: '8px 15px', borderRadius: '20px', fontWeight: '700', whiteSpace: 'nowrap', cursor: 'pointer' }}>
          Microjobs
        </button>

        <button onClick={() => setActiveTab('bots')} style={{ background: activeTab === 'bots' ? 'var(--primary-color)' : 'var(--card-bg)', color: activeTab === 'bots' ? '#ffffff' : 'var(--text-primary)', border: 'var(--card-border)', padding: '8px 15px', borderRadius: '20px', fontWeight: '700', whiteSpace: 'nowrap', cursor: 'pointer' }}>Manage Bots</button>
        <button onClick={() => setActiveTab('contact')} style={{ background: activeTab === 'contact' ? 'var(--primary-color)' : 'var(--card-bg)', color: activeTab === 'contact' ? '#ffffff' : 'var(--text-primary)', border: 'var(--card-border)', padding: '8px 15px', borderRadius: '20px', fontWeight: '700', whiteSpace: 'nowrap', cursor: 'pointer' }}>Settings</button>
      </div>

      {/* DASHBOARD TAB */}
      {activeTab === 'dashboard' && (
        <>
          <div style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
            <div style={{ flex: 1, background: 'var(--card-bg)', border: 'var(--card-border)', padding: '15px', borderRadius: '15px', textAlign: 'center', boxShadow: 'var(--shadow)' }}>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: '700' }}>Total Users</p>
              <h3 style={{ color: 'var(--text-primary)', fontSize: '1.5rem' }}>{stats.totalUsers}</h3>
            </div>
            <div style={{ flex: 1, background: 'var(--card-bg)', border: 'var(--card-border)', padding: '15px', borderRadius: '15px', textAlign: 'center', boxShadow: 'var(--shadow)' }}>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: '700' }}>Pending Verify</p>
              <h3 style={{ color: '#f59e0b', fontSize: '1.5rem' }}>{stats.pendingVerifications}</h3>
            </div>
            <div style={{ flex: 1, background: 'var(--card-bg)', border: 'var(--card-border)', padding: '15px', borderRadius: '15px', textAlign: 'center', boxShadow: 'var(--shadow)' }}>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: '700' }}>Pending Withdraw</p>
              <h3 style={{ color: 'var(--negative-color)', fontSize: '1.5rem' }}>{stats.pendingWithdraws}</h3>
            </div>
          </div>

          {/* Pending Verification Requests List */}
          <div style={{ background: 'var(--card-bg)', border: 'var(--card-border)', padding: '20px', borderRadius: '16px', marginBottom: '20px' }}>
            <h3 style={{ marginBottom: '15px', fontSize: '1.1rem', color: 'var(--text-primary)' }}>Pending Account Activation Requests</h3>
            {stats.verifications.length === 0 ? (
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>No pending activation requests</p>
            ) : (
              stats.verifications.map((y, idx) => (
                <div key={y._id || idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--border-color)' }}>
                  <div>
                    <p style={{ fontWeight: '700', fontSize: '0.95rem', color: 'var(--text-primary)', margin: 0 }}>
                      UID: {y.userTelegramId}
                      {y.user && y.user.username && (
                        <span 
                          onClick={() => window.open(`https://t.me/${y.user.username}`, '_blank')}
                          style={{ marginLeft: '6px', textDecoration: 'underline', color: 'var(--primary-color)', cursor: 'pointer', fontWeight: '800' }}
                          title="Open Telegram Chat"
                        >
                          ({y.user.firstName || y.user.username})
                        </span>
                      )}
                    </p>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: '4px 0 0 0' }}>
                      Method: <span style={{ fontWeight: '800', color: 'var(--primary-color)' }}>{y.paymentMethod || 'Bkash'}</span> | TrxID: <span style={{ fontWeight: '800', color: 'var(--text-primary)' }}>{y.transactionId}</span>
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={() => approveVerificationRequest(y._id)} style={{ background: 'var(--positive-color)', color: 'white', padding: '6px 12px', borderRadius: '8px', border: 'none', fontSize: '0.85rem', fontWeight: '700', cursor: 'pointer' }}>Approve</button>
                    <button onClick={() => rejectVerificationRequest(y._id)} style={{ background: 'var(--negative-color)', color: 'white', padding: '6px 12px', borderRadius: '8px', border: 'none', fontSize: '0.85rem', fontWeight: '700', cursor: 'pointer' }}>Reject</button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Pending Withdrawal Requests List */}
          <div style={{ background: 'var(--card-bg)', border: 'var(--card-border)', padding: '20px', borderRadius: '16px', marginBottom: '20px' }}>
            <h3 style={{ marginBottom: '15px', fontSize: '1.1rem', color: 'var(--text-primary)' }}>Pending Withdrawal Requests</h3>
            {!stats.withdraws || stats.withdraws.length === 0 ? (
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>No pending withdrawal requests</p>
            ) : (
              stats.withdraws.map((y, idx) => (
                <div key={y._id || idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--border-color)' }}>
                  <div>
                    <p style={{ fontWeight: '700', fontSize: '0.95rem', color: 'var(--text-primary)', margin: 0 }}>
                      UID: {y.telegramId}
                      {y.user && y.user.username && (
                        <span 
                          onClick={() => window.open(`https://t.me/${y.user.username}`, '_blank')}
                          style={{ marginLeft: '6px', textDecoration: 'underline', color: 'var(--primary-color)', cursor: 'pointer', fontWeight: '800' }}
                          title="Open Telegram Chat"
                        >
                          ({y.user.firstName || y.user.username})
                        </span>
                      )}
                    </p>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: '4px 0 0 0' }}>
                      Method: <span style={{ fontWeight: '800', color: 'var(--primary-color)' }}>{y.method}</span> | Account: <span style={{ fontWeight: '800', color: 'var(--text-primary)' }}>{y.accountNumber}</span> | Amount: <span style={{ fontWeight: '800', color: 'var(--positive-color)' }}>{y.amount} ৳</span>
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={() => approveWithdrawRequest(y._id)} style={{ background: 'var(--positive-color)', color: 'white', padding: '6px 12px', borderRadius: '8px', border: 'none', fontSize: '0.85rem', fontWeight: '700', cursor: 'pointer' }}>Approve (Paid)</button>
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}

      {/* USERS TAB */}
      {activeTab === 'users' && (
        <div style={{ background: 'var(--card-bg)', border: 'var(--card-border)', padding: '20px', borderRadius: '16px' }}>
          <h3 style={{ marginBottom: '15px', fontSize: '1.1rem', color: 'var(--text-primary)' }}>Search User</h3>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
            <input type="text" placeholder="UID or @username" value={searchId} onChange={(e) => setSearchId(e.target.value)} style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid var(--input-border)', background: 'var(--input-bg)', color: 'var(--text-primary)' }} />
            <button onClick={searchUser} style={{ background: 'var(--primary-color)', color: 'white', padding: '10px 15px', borderRadius: '8px', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Search size={20} />
            </button>
          </div>
          
          {searchedUser && (
            <div style={{ background: 'var(--input-bg)', border: '1px solid var(--input-border)', padding: '15px', borderRadius: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <h4 style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>@{searchedUser.username || 'NoUsername'}</h4>
                <span style={{ background: searchedUser.isBanned ? 'rgba(239, 68, 68, 0.15)' : 'rgba(0, 230, 118, 0.15)', color: searchedUser.isBanned ? 'var(--negative-color)' : 'var(--positive-color)', padding: '4px 8px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: '700' }}>
                  {searchedUser.isBanned ? 'BANNED' : 'ACTIVE'}
                </span>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '5px' }}><strong>UID:</strong> {searchedUser.telegramId}</p>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '5px' }}><strong>Name:</strong> {searchedUser.firstName || 'N/A'}</p>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '5px' }}><strong>Joined:</strong> {new Date(searchedUser.createdAt).toLocaleDateString()}</p>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0 }}><strong>Verified:</strong> {searchedUser.isVerified ? 'Yes' : 'No'}</p>
                {!searchedUser.isVerified && (
                  <button onClick={verifyUserNow} style={{ background: 'var(--positive-color)', color: 'white', border: 'none', padding: '4px 10px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: '700', cursor: 'pointer' }}>Verify Now</button>
                )}
              </div>
              
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '15px' }}><strong>Balance:</strong> <span style={{ color: 'var(--positive-color)', fontWeight: '800', fontSize: '1.1rem' }}>{searchedUser.balance} ৳</span></p>
              
              <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                <input type="number" placeholder="Amount" value={balanceAmount} onChange={(e) => setBalanceAmount(e.target.value)} style={{ flex: 1, padding: '8px', borderRadius: '8px', border: '1px solid var(--input-border)', background: 'var(--input-bg)', color: 'var(--text-primary)' }} />
                <button onClick={() => adjustBalance('add')} style={{ background: 'var(--positive-color)', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '8px', fontWeight: '700', cursor: 'pointer' }}>+</button>
                <button onClick={() => adjustBalance('cut')} style={{ background: 'var(--negative-color)', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '8px', fontWeight: '700', cursor: 'pointer' }}>-</button>
              </div>
              
              <button onClick={toggleBanUser} style={{ width: '100%', background: searchedUser.isBanned ? 'var(--primary-color)' : 'var(--negative-color)', color: 'white', padding: '10px', borderRadius: '8px', border: 'none', fontWeight: '700', cursor: 'pointer' }}>
                {searchedUser.isBanned ? 'Unban User' : 'Ban User'}
              </button>
            </div>
          )}
        </div>
      )}

      {/* TASKS TAB */}
      {activeTab === 'tasks' && (
        <div style={{ background: 'var(--card-bg)', border: 'var(--card-border)', padding: '20px', borderRadius: '16px' }}>
          <h3 style={{ marginBottom: '15px', fontSize: '1.2rem', color: 'var(--text-primary)' }}>Manage Task Configurations</h3>
          {taskLinks.map((y, idx) => (
            <div key={y.taskId || idx} style={{ marginBottom: '20px', padding: '15px', border: '1px solid var(--border-color)', borderRadius: '12px' }}>
              <h4 style={{ marginBottom: '10px', color: 'var(--text-primary)', fontWeight: '800' }}>{y.title}</h4>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: '600' }}>YouTube Account Video ID (e.g. EF_pBnwW9h0)</label>
                  <input type="text" value={y.accountVideo || ''} onChange={(e) => handleTaskLinkChange(idx, 'accountVideo', e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--input-border)', background: 'var(--input-bg)', color: 'var(--text-primary)' }} />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: '600' }}>YouTube Work Video ID</label>
                  <input type="text" value={y.workVideo || ''} onChange={(e) => handleTaskLinkChange(idx, 'workVideo', e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--input-border)', background: 'var(--input-bg)', color: 'var(--text-primary)' }} />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: '600' }}>YouTube Withdraw Video ID</label>
                  <input type="text" value={y.withdrawVideo || ''} onChange={(e) => handleTaskLinkChange(idx, 'withdrawVideo', e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--input-border)', background: 'var(--input-bg)', color: 'var(--text-primary)' }} />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: '600' }}>Registration Link</label>
                  <input type="text" value={y.regLink || ''} onChange={(e) => handleTaskLinkChange(idx, 'regLink', e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--input-border)', background: 'var(--input-bg)', color: 'var(--text-primary)' }} />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: '600' }}>Admin Wallet Type (e.g. TRON Wallet Address / Bkash Agent)</label>
                  <input type="text" placeholder="TRON (TRX) Wallet Address / TRC20" value={y.walletType || ''} onChange={(e) => handleTaskLinkChange(idx, 'walletType', e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--input-border)', background: 'var(--input-bg)', color: 'var(--text-primary)' }} />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: '600' }}>Admin Wallet Address</label>
                  <input type="text" placeholder="Enter wallet address" value={y.walletAddress || ''} onChange={(e) => handleTaskLinkChange(idx, 'walletAddress', e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--input-border)', background: 'var(--input-bg)', color: 'var(--text-primary)' }} />
                </div>
              </div>

              <button onClick={() => saveTaskLinks(y)} style={{ background: 'var(--positive-color)', color: 'white', padding: '8px 15px', borderRadius: '8px', fontWeight: '700', width: '100%', border: 'none', marginTop: '12px', cursor: 'pointer' }}>Save {y.title}</button>
            </div>
          ))}
        </div>
      )}

      {/* COIN SELLS TAB */}
      {activeTab === 'coinSells' && (
        <div style={{ background: 'var(--card-bg)', border: 'var(--card-border)', padding: '20px', borderRadius: '16px' }}>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '15px', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
            <button onClick={() => setCoinTab('requests')} style={{ background: coinTab === 'requests' ? 'var(--primary-color)' : 'transparent', color: coinTab === 'requests' ? '#ffffff' : 'var(--text-secondary)', padding: '6px 12px', borderRadius: '8px', border: 'none', fontWeight: '700', cursor: 'pointer' }}>Requests {pendingCoinSellCount > 0 && <span style={{ marginLeft: '5px', background: 'var(--negative-color)', color: 'white', padding: '2px 6px', borderRadius: '10px', fontSize: '0.7rem' }}>{pendingCoinSellCount}</span>}</button>
            <button onClick={() => setCoinTab('settings')} style={{ background: coinTab === 'settings' ? 'var(--primary-color)' : 'transparent', color: coinTab === 'settings' ? '#ffffff' : 'var(--text-secondary)', padding: '6px 12px', borderRadius: '8px', border: 'none', fontWeight: '700', cursor: 'pointer' }}>Coin Settings</button>
          </div>

          {coinTab === 'requests' && (
            <div>
              {coinRequests.length === 0 ? (
                <p style={{ color: 'var(--text-secondary)' }}>No coin sell requests.</p>
              ) : (
                coinRequests.map((y, idx) => (
                  <div key={y._id || idx} style={{ marginBottom: '15px', padding: '15px', border: '1px solid var(--border-color)', borderRadius: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                      <h4 style={{ fontWeight: '800', color: 'var(--text-primary)', margin: 0, textTransform: 'uppercase' }}>{y.coinType}</h4>
                      <span style={{ background: y.status === 'Pending' ? 'rgba(217, 119, 6, 0.15)' : y.status === 'Accepted' ? 'rgba(0, 230, 118, 0.15)' : 'rgba(255, 23, 68, 0.15)', color: y.status === 'Pending' ? '#d97706' : y.status === 'Accepted' ? 'var(--positive-color)' : 'var(--negative-color)', padding: '4px 8px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: '700' }}>{y.status}</span>
                    </div>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', margin: '0 0 5px 0' }}><strong>UID:</strong> {y.userId}</p>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', margin: '0 0 5px 0' }}><strong>Amount:</strong> {y.amount}</p>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', margin: '0 0 10px 0' }}><strong>Method:</strong> {y.paymentMethod} ({y.paymentNumber})</p>
                    {y.coinType === 'topfollows' ? (
                      <p style={{ fontSize: '0.9rem', color: '#8b5cf6', margin: '0 0 10px 0', fontWeight: '700' }}>
                        <strong>Screenshot Link:</strong>{' '}
                        <a href={y.senderDetails} target="_blank" rel="noreferrer" style={{ color: 'var(--primary-color)', textDecoration: 'underline' }}>
                          {y.senderDetails}
                        </a>
                      </p>
                    ) : (
                      <p style={{ fontSize: '0.9rem', color: '#8b5cf6', margin: '0 0 10px 0', fontWeight: '700' }}>
                        <strong>Sender App ID:</strong> {y.senderDetails}
                      </p>
                    )}
                    {y.couponCode && <p style={{ fontSize: '0.9rem', color: '#f59e0b', margin: '0 0 10px 0', fontWeight: '700' }}><strong>Coupon:</strong> {y.couponCode}</p>}
                    
                    {y.status === 'Pending' ? (
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <button onClick={() => handleCoinRequestStatus(y._id, 'Accepted')} style={{ flex: 1, background: 'var(--positive-color)', color: 'white', padding: '8px', borderRadius: '8px', border: 'none', fontWeight: '700', cursor: 'pointer' }}>Accept</button>
                        <button onClick={() => handleCoinRequestStatus(y._id, 'Rejected')} style={{ flex: 1, background: 'var(--negative-color)', color: 'white', padding: '8px', borderRadius: '8px', border: 'none', fontWeight: '700', cursor: 'pointer' }}>Reject</button>
                        <button onClick={() => handleCoinRequestDelete(y._id)} style={{ flex: 1, background: '#4b5563', color: 'white', padding: '8px', borderRadius: '8px', border: 'none', fontWeight: '700', cursor: 'pointer' }}>Delete</button>
                      </div>
                    ) : (
                      <div style={{ marginTop: '10px' }}>
                        <button onClick={() => handleCoinRequestDelete(y._id)} style={{ width: '100%', background: '#4b5563', color: 'white', padding: '8px', borderRadius: '8px', border: 'none', fontWeight: '700', cursor: 'pointer' }}>Delete Request</button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}

          {coinTab === 'settings' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--input-bg)', padding: '15px', borderRadius: '12px', marginBottom: '20px', border: '1px solid var(--border-color)' }}>
                <span style={{ fontWeight: '800', color: 'var(--text-primary)' }}>Show Full Market Section (Home Page)</span>
                <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                  <input type="checkbox" checked={marketConfig.marketIsVisible} onChange={(e) => saveMarketConfigVisibility(e.target.checked)} style={{ transform: 'scale(1.2)' }} />
                </label>
              </div>

              {coins.map((y, idx) => (
                <div key={y._id || idx} style={{ marginBottom: '15px', padding: '15px', border: '1px solid var(--border-color)', borderRadius: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <span style={{ fontWeight: '800', color: 'var(--text-primary)' }}>{y.label}</span>
                    <div style={{ display: 'flex', gap: '15px' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.9rem', cursor: 'pointer', color: 'var(--text-secondary)' }}>
                        <input type="checkbox" checked={y.isVisible !== false} onChange={(e) => handleCoinConfigChange(idx, 'isVisible', e.target.checked)} /> Visible
                      </label>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.9rem', cursor: 'pointer', color: 'var(--text-secondary)' }}>
                        <input type="checkbox" checked={y.isActive} onChange={(e) => handleCoinConfigChange(idx, 'isActive', e.target.checked)} /> Active
                      </label>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                    <div style={{ flex: 1 }}>
                      <label style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-secondary)' }}>Price (৳ / 1000)</label>
                      <input type="number" value={y.price} onChange={(e) => handleCoinConfigChange(idx, 'price', Number(e.target.value))} style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid var(--input-border)', background: 'var(--input-bg)', color: 'var(--text-primary)' }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <label style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-secondary)' }}>Min Amount</label>
                      <input type="number" value={y.minAmount || 1000} onChange={(e) => handleCoinConfigChange(idx, 'minAmount', Number(e.target.value))} style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid var(--input-border)', background: 'var(--input-bg)', color: 'var(--text-primary)' }} />
                    </div>
                    <div style={{ flex: 2 }}>
                      <label style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-secondary)' }}>
                        {y.coinId === 'topfollows' ? 'Screenshot Submit Link (Telegram)' : 'Target Username / ID'}
                      </label>
                      <input type="text" value={y.targetUser} onChange={(e) => handleCoinConfigChange(idx, 'targetUser', e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid var(--input-border)', background: 'var(--input-bg)', color: 'var(--text-primary)' }} />
                    </div>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-secondary)' }}>Tutorial Video (Optional)</label>
                    <input type="text" value={y.tutorialVideo || ''} onChange={(e) => handleCoinConfigChange(idx, 'tutorialVideo', e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid var(--input-border)', background: 'var(--input-bg)', color: 'var(--text-primary)' }} placeholder="Link e.g. https://youtu.be/..." />
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '15px' }}>
                    <button onClick={() => saveCoinSettings(idx)} style={{ background: 'var(--positive-color)', color: 'white', padding: '8px 16px', borderRadius: '8px', fontWeight: '700', border: 'none', cursor: 'pointer' }}>Save {y.label}</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ADD FUNDS TAB */}
      {activeTab === 'addFunds' && (
        <div style={{ background: 'var(--card-bg)', border: 'var(--card-border)', padding: '20px', borderRadius: '16px' }}>
          <h3 style={{ marginBottom: '15px', fontSize: '1.2rem', color: 'var(--text-primary)' }}>Add Fund Requests</h3>
          {addFundRequests.length === 0 ? (
            <p style={{ color: 'var(--text-secondary)' }}>No add fund requests.</p>
          ) : (
            addFundRequests.map((y, idx) => (
              <div key={y._id || idx} style={{ marginBottom: '15px', padding: '15px', border: '1px solid var(--border-color)', borderRadius: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <h4 style={{ fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>+{y.amount} ৳</h4>
                  <span style={{ background: y.status === 'Pending' ? 'rgba(217, 119, 6, 0.15)' : y.status === 'Accepted' ? 'rgba(0, 230, 118, 0.15)' : 'rgba(255, 23, 68, 0.15)', color: y.status === 'Pending' ? '#d97706' : y.status === 'Accepted' ? 'var(--positive-color)' : 'var(--negative-color)', padding: '4px 8px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: '700' }}>{y.status}</span>
                </div>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', margin: '0 0 5px 0' }}><strong>UID:</strong> {y.userId}</p>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', margin: '0 0 5px 0' }}><strong>Method:</strong> <span style={{ textTransform: 'capitalize' }}>{y.paymentMethod}</span></p>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', margin: '0 0 5px 0' }}><strong>Sender Number:</strong> {y.senderNumber}</p>
                <p style={{ fontSize: '0.9rem', color: 'var(--primary-color)', margin: '0 0 10px 0', fontWeight: '700' }}><strong>TrxID:</strong> {y.transactionId}</p>

                {y.status === 'Pending' && (
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button onClick={() => {
                      fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/admin/fund-requests/${y._id}/status`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ status: 'Accepted' }),
                      }).then(() => fetchAddFundRequests());
                    }} style={{ flex: 1, background: 'var(--positive-color)', color: 'white', padding: '8px', borderRadius: '8px', border: 'none', fontWeight: '700', cursor: 'pointer' }}>Approve</button>
                    
                    <button onClick={() => {
                      fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/admin/fund-requests/${y._id}/status`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ status: 'Rejected' }),
                      }).then(() => fetchAddFundRequests());
                    }} style={{ flex: 1, background: 'var(--negative-color)', color: 'white', padding: '8px', borderRadius: '8px', border: 'none', fontWeight: '700', cursor: 'pointer' }}>Reject</button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* JOB PROOFS TAB */}
      {activeTab === 'jobProofs' && (
        <div style={{ background: 'var(--card-bg)', border: 'var(--card-border)', padding: '20px', borderRadius: '16px' }}>
          <h3 style={{ marginBottom: '15px', fontSize: '1.2rem', color: 'var(--text-primary)' }}>Job Proof Submissions</h3>
          {jobSubmissions.length === 0 ? (
            <p style={{ color: 'var(--text-secondary)' }}>No job submissions.</p>
          ) : (
            jobSubmissions.map((y, idx) => {
              const isSystemAdmin = y.jobId?.postedBy === 'admin';
              const posterUsername = y.jobPoster?.username || '';
              const posterFirstName = y.jobPoster?.firstName || '';
              const posterId = y.jobId?.postedBy;

              const displayPoster = isSystemAdmin
                ? 'System Admin'
                : (posterUsername ? `@${posterUsername.replace('@', '')}` : (posterFirstName || `UID: ${posterId}`));

              return (
                <div key={y._id || idx} style={{ marginBottom: '15px', padding: '15px', border: '1px solid var(--border-color)', borderRadius: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <h4 style={{ fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>{y.jobId?.title || 'Unknown Job'}</h4>
                    <span style={{ background: y.status === 'pending' ? 'rgba(217, 119, 6, 0.15)' : y.status === 'approved' ? 'rgba(0, 230, 118, 0.15)' : 'rgba(255, 23, 68, 0.15)', color: y.status === 'pending' ? '#d97706' : y.status === 'approved' ? 'var(--positive-color)' : 'var(--negative-color)', padding: '4px 8px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: '700' }}>{y.status.toUpperCase()}</span>
                  </div>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', margin: '0 0 5px 0' }}><strong>Worker UID:</strong> {y.userTelegramId}</p>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', margin: '0 0 5px 0' }}><strong>Job Pay:</strong> {y.jobId?.amount || 0} ৳</p>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', margin: '0 0 5px 0' }}>
                    <strong>Job Posted By:</strong>{' '}
                    {isSystemAdmin ? (
                      <span style={{ fontWeight: '700' }}>System Admin</span>
                    ) : posterId ? (
                      <a 
                        href={getTelegramChatUrl(posterId, posterUsername)} 
                        target="_blank" 
                        rel="noreferrer" 
                        style={{ color: 'var(--primary-color)', fontWeight: '700', textDecoration: 'underline' }}
                      >
                        {displayPoster}
                      </a>
                    ) : (
                      'Unknown'
                    )}
                  </p>
                  <p style={{ fontSize: '0.9rem', color: 'var(--primary-color)', margin: '0 0 10px 0', fontWeight: '700' }}><strong>Submitted Proof:</strong> {y.submittedId}</p>

                  {y.status === 'pending' && (
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button onClick={() => approveJobSubmission(y._id)} style={{ flex: 1, background: 'var(--positive-color)', color: 'white', padding: '8px', borderRadius: '8px', border: 'none', fontWeight: '700', cursor: 'pointer' }}>Approve</button>
                      <button onClick={() => rejectJobSubmission(y._id)} style={{ flex: 1, background: 'var(--negative-color)', color: 'white', padding: '8px', borderRadius: '8px', border: 'none', fontWeight: '700', cursor: 'pointer' }}>Reject</button>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}

      {/* MANAGE MICROJOBS TAB */}
      {activeTab === 'manageJobs' && (
        <div style={{ background: 'var(--card-bg)', border: 'var(--card-border)', padding: '20px', borderRadius: '16px' }}>
          <h3 style={{ marginBottom: '15px', fontSize: '1.2rem', color: 'var(--text-primary)' }}>Manage Microjobs</h3>
          {allJobs.length === 0 ? (
            <p style={{ color: 'var(--text-secondary)' }}>No microjobs found.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {allJobs.map((job) => {
                const isSystemAdmin = job.postedBy === 'admin';
                const creatorUsername = job.user?.username || '';
                const creatorFirstName = job.user?.firstName || '';
                const creatorId = job.postedBy;

                const displayName = isSystemAdmin 
                  ? 'System Admin' 
                  : (creatorUsername ? `@${creatorUsername.replace('@', '')}` : (creatorFirstName || `UID: ${creatorId}`));

                return (
                  <div key={job._id} style={{ padding: '15px', border: '1px solid var(--border-color)', borderRadius: '12px', background: 'var(--input-bg)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                      <div>
                        <h4 style={{ fontWeight: '800', color: 'var(--text-primary)', margin: '0 0 5px 0' }}>{job.title}</h4>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>{job.description}</p>
                      </div>
                      <span style={{ background: job.isActive ? 'rgba(0, 230, 118, 0.15)' : 'rgba(255, 23, 68, 0.15)', color: job.isActive ? 'var(--positive-color)' : 'var(--negative-color)', padding: '4px 8px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '700' }}>
                        {job.isActive ? 'ACTIVE' : 'INACTIVE'}
                      </span>
                    </div>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                      <p style={{ margin: 0 }}><strong>Pay Rate:</strong> {job.amount} ৳</p>
                      <p style={{ margin: 0 }}><strong>Limit:</strong> {job.completedCount} / {job.workerLimit === 0 ? 'Unlimited' : job.workerLimit}</p>
                      <p style={{ margin: 0 }}><strong>Link:</strong> <a href={job.link} target="_blank" rel="noreferrer" style={{ color: 'var(--primary-color)', textDecoration: 'underline' }}>View Task Link <ExternalLink size={12} style={{ display: 'inline', marginLeft: '2px' }} /></a></p>
                      <p style={{ margin: 0 }}>
                        <strong>Posted By:</strong>{' '}
                        {isSystemAdmin ? (
                          <span style={{ fontWeight: '700' }}>System Admin</span>
                        ) : (
                          <a 
                            href={getTelegramChatUrl(creatorId, creatorUsername)} 
                            target="_blank" 
                            rel="noreferrer" 
                            style={{ color: 'var(--primary-color)', fontWeight: '700', textDecoration: 'underline' }}
                          >
                            {displayName}
                          </a>
                        )}
                      </p>
                    </div>

                    <button 
                      onClick={() => deleteJobByAdmin(job._id)} 
                      style={{ 
                        background: 'var(--negative-color)', 
                        color: 'white', 
                        border: 'none', 
                        padding: '8px 16px', 
                        borderRadius: '8px', 
                        fontSize: '0.85rem', 
                        fontWeight: '700', 
                        cursor: 'pointer',
                        width: '100%'
                      }}
                    >
                      Delete Microjob
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* MANAGE BOTS TAB */}
      {activeTab === 'bots' && (
        <div style={{ background: 'var(--card-bg)', padding: '20px', borderRadius: '16px', border: 'var(--card-border)', color: 'var(--text-primary)' }}>
          <h3 style={{ marginBottom: '15px', fontSize: '1.2rem', color: 'var(--text-primary)' }}>Manage Telegram Bots (হটাৎ ইনকাম)</h3>
          
          <div style={{ background: 'var(--input-bg)', padding: '15px', borderRadius: '12px', marginBottom: '20px', border: '1px solid var(--input-border)' }}>
            <h4 style={{ marginBottom: '12px', fontWeight: '800', color: 'var(--text-primary)' }}>{editingBot?.id ? 'Edit Bot' : 'Add New Bot'}</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <input type="text" placeholder="Bot Title (বটের নাম)" value={editingBot?.title || ''} onChange={(e) => setEditingBot({ ...editingBot, title: e.target.value })} style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--input-border)', background: 'var(--input-bg)', color: 'var(--text-primary)', outline: 'none' }} />
              <textarea placeholder="Bot Description (বটের কাজ ও বিস্তারিত)" value={editingBot?.description || ''} onChange={(e) => setEditingBot({ ...editingBot, description: e.target.value })} style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--input-border)', background: 'var(--input-bg)', color: 'var(--text-primary)', outline: 'none', minHeight: '80px', fontFamily: 'inherit' }} />
              <input type="text" placeholder="Registration Link (রেজিষ্ট্রেশন লিংক)" value={editingBot?.link || ''} onChange={(e) => setEditingBot({ ...editingBot, link: e.target.value })} style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--input-border)', background: 'var(--input-bg)', color: 'var(--text-primary)', outline: 'none' }} />
              <input type="number" step="any" placeholder="Reward Bonus Amount (৳)" value={editingBot?.reward !== undefined && editingBot?.reward !== null ? editingBot.reward : ''} onChange={(e) => setEditingBot({ ...editingBot, reward: e.target.value })} style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--input-border)', background: 'var(--input-bg)', color: 'var(--text-primary)', outline: 'none' }} />
              
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.9rem', fontWeight: '600', color: 'var(--text-secondary)' }}>
                <input type="checkbox" checked={editingBot?.isActive !== false} onChange={(e) => setEditingBot({ ...editingBot, isActive: e.target.checked })} /> Active (সক্রিয়)
              </label>

              <div style={{ display: 'flex', gap: '10px', marginTop: '5px' }}>
                <button onClick={() => {
                  if (!editingBot?.title || !editingBot?.description || !editingBot?.link) return alert('সবগুলো ঘর পূরণ করুন!');
                  saveBot(editingBot);
                }} style={{ flex: 1, background: 'var(--positive-color)', color: 'white', padding: '10px', borderRadius: '8px', border: 'none', fontWeight: '700', cursor: 'pointer' }}>Save Bot</button>
                {editingBot && (
                  <button onClick={() => setEditingBot(null)} style={{ background: '#6b7280', color: 'white', padding: '10px 15px', borderRadius: '8px', border: 'none', fontWeight: '700', cursor: 'pointer' }}>Cancel</button>
                )}
              </div>
            </div>
          </div>

          <h4 style={{ marginBottom: '12px', fontWeight: '800', color: 'var(--text-primary)' }}>Current Bots ({bots.length}/5)</h4>
          {bots.length === 0 ? (
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>কোন বট এড করা নেই।</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {bots.map((y, idx) => (
                <div key={y._id || idx} style={{ padding: '15px', border: '1px solid var(--border-color)', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', background: y.isActive ? 'var(--input-bg)' : 'rgba(239, 68, 68, 0.08)' }}>
                  <div style={{ flex: 1, marginRight: '10px' }}>
                    <h5 style={{ fontWeight: '800', color: 'var(--text-primary)', fontSize: '1rem', marginBottom: '4px' }}>{y.title}</h5>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '6px', whiteSpace: 'pre-wrap' }}>{y.description}</p>
                    <a href={y.link} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.85rem', color: 'var(--positive-color)', fontWeight: '700', textDecoration: 'underline' }}>Link: {y.link}</a>
                    <span style={{ display: 'block', fontSize: '0.85rem', color: 'var(--positive-color)', fontWeight: '700', marginTop: '5px' }}>Reward: {y.reward || 0} ৳</span>
                    <span style={{ display: 'block', fontSize: '0.75rem', color: y.isActive ? 'var(--positive-color)' : 'var(--negative-color)', fontWeight: '700', marginTop: '5px' }}>{y.isActive ? '● Active' : '● Inactive'}</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <button onClick={() => setEditingBot({ id: y._id, title: y.title, description: y.description, link: y.link, isActive: y.isActive, reward: y.reward })} style={{ background: 'linear-gradient(90deg, #d60093 0%, #8b00ff 100%)', color: 'white', padding: '6px 12px', borderRadius: '6px', border: 'none', fontSize: '0.8rem', fontWeight: '700', cursor: 'pointer' }}>Edit</button>
                    <button onClick={() => deleteBot(y._id)} style={{ background: 'transparent', color: 'var(--negative-color)', border: '1px solid var(--negative-color)', padding: '6px 12px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: '700', cursor: 'pointer' }}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* SETTINGS TAB */}
      {activeTab === 'contact' && (
        <>
          <div style={{ background: 'var(--card-bg)', border: 'var(--card-border)', padding: '20px', borderRadius: '16px', marginBottom: '20px' }}>
            <h3 style={{ marginBottom: '15px', fontSize: '1.2rem', color: 'var(--text-primary)' }}>Update Contact Links</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Admin Support Link</label>
                <input type="text" value={config.supportLink} onChange={(e) => setConfig({ ...config, supportLink: e.target.value })} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--input-border)', background: 'var(--input-bg)', color: 'var(--text-primary)' }} />
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Telegram Channel</label>
                <input type="text" value={config.telegramChannel} onChange={(e) => setConfig({ ...config, telegramChannel: e.target.value })} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--input-border)', background: 'var(--input-bg)', color: 'var(--text-primary)' }} />
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>YouTube Channel</label>
                <input type="text" value={config.youtubeChannel} onChange={(e) => setConfig({ ...config, youtubeChannel: e.target.value })} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--input-border)', background: 'var(--input-bg)', color: 'var(--text-primary)' }} />
              </div>
              
              <h4 style={{ marginTop: '10px', marginBottom: '5px', color: 'var(--text-primary)' }}>System Settings</h4>
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Activation Fee (৳)</label>
                <input type="number" value={config.activationFee || ''} onChange={(e) => setConfig({ ...config, activationFee: Number(e.target.value) })} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--input-border)', background: 'var(--input-bg)', color: 'var(--text-primary)' }} />
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Bkash Agent / Personal Number</label>
                <input type="text" value={config.bkashNumber || ''} onChange={(e) => setConfig({ ...config, bkashNumber: e.target.value })} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--input-border)', background: 'var(--input-bg)', color: 'var(--text-primary)' }} />
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Nagad Personal Number</label>
                <input type="text" value={config.nagadNumber || ''} onChange={(e) => setConfig({ ...config, nagadNumber: e.target.value })} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--input-border)', background: 'var(--input-bg)', color: 'var(--text-primary)' }} />
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Rocket Personal Number</label>
                <input type="text" value={config.rocketNumber || ''} onChange={(e) => setConfig({ ...config, rocketNumber: e.target.value })} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--input-border)', background: 'var(--input-bg)', color: 'var(--text-primary)' }} />
              </div>

              <button onClick={saveContactSettings} style={{ background: 'var(--positive-color)', color: 'white', padding: '10px 20px', borderRadius: '8px', fontWeight: '700', width: '100%', cursor: 'pointer', border: 'none', marginTop: '10px' }}>Save Settings</button>
            </div>
          </div>

          {/* Monetag Ads Settings */}
          <div style={{ background: 'var(--card-bg)', border: 'var(--card-border)', padding: '20px', borderRadius: '16px', marginBottom: '20px' }}>
            <h3 style={{ marginBottom: '15px', fontSize: '1.2rem', color: 'var(--text-primary)' }}>Monetag Ads Settings</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--input-bg)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <span style={{ fontWeight: '700', color: 'var(--text-primary)', fontSize: '0.9rem' }}>Enable Monetag Ads</span>
                <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                  <input type="checkbox" checked={marketConfig.adsEnabled || false} onChange={(e) => {
                    const checked = e.target.checked;
                    setMarketConfig({ ...marketConfig, adsEnabled: checked });
                    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/admin/config`, {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ adsEnabled: checked }),
                    });
                  }} style={{ transform: 'scale(1.2)' }} />
                </label>
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Monetag Direct Link URL</label>
                <input type="text" value={marketConfig.monetagDirectLink || ''} onChange={(e) => setMarketConfig({ ...marketConfig, monetagDirectLink: e.target.value })} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--input-border)', background: 'var(--input-bg)', color: 'var(--text-primary)' }} />
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Reward Amount per View (৳)</label>
                <input type="number" step="0.01" value={marketConfig.monetagReward || ''} onChange={(e) => setMarketConfig({ ...marketConfig, monetagReward: Number(e.target.value) })} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--input-border)', background: 'var(--input-bg)', color: 'var(--text-primary)' }} />
              </div>
              <button onClick={() => {
                fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/admin/config`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    monetagDirectLink: marketConfig.monetagDirectLink,
                    monetagReward: Number(marketConfig.monetagReward)
                  }),
                }).then(() => alert('Monetag settings saved successfully!'));
              }} style={{ background: 'var(--primary-color)', color: 'white', padding: '10px 20px', borderRadius: '8px', fontWeight: '700', width: '100%', cursor: 'pointer', border: 'none', marginTop: '5px' }}>Save Monetag Settings</button>
            </div>
          </div>

          {/* Marquee Notice Settings */}
          <div style={{ background: 'var(--card-bg)', border: 'var(--card-border)', padding: '20px', borderRadius: '16px', marginBottom: '20px' }}>
            <h3 style={{ marginBottom: '15px', fontSize: '1.2rem', color: 'var(--text-primary)' }}>Marquee Notice Settings</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Notice Message</label>
                <textarea 
                  rows="3"
                  value={marketConfig.marqueeNotice || ''} 
                  onChange={(e) => setMarketConfig({ ...marketConfig, marqueeNotice: e.target.value })} 
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--input-border)', background: 'var(--input-bg)', color: 'var(--text-primary)', outline: 'none', resize: 'vertical' }} 
                />
              </div>
              <button onClick={() => {
                fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/admin/config`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    marqueeNotice: marketConfig.marqueeNotice
                  }),
                }).then(() => alert('Notice settings saved successfully!'));
              }} style={{ background: 'var(--primary-color)', color: 'white', padding: '10px 20px', borderRadius: '8px', fontWeight: '700', width: '100%', cursor: 'pointer', border: 'none', marginTop: '5px' }}>Save Notice Settings</button>
            </div>
          </div>

          {/* Manage Admins List / Form */}
          <div style={{ background: 'var(--card-bg)', border: 'var(--card-border)', padding: '20px', borderRadius: '16px', marginBottom: '20px' }}>
            <h3 style={{ marginBottom: '15px', fontSize: '1.2rem', color: 'var(--text-primary)' }}>Manage Admins</h3>
            
            {/* Add Admin */}
            {isMaster ? (
              <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                <input type="text" placeholder="Telegram UID" value={newAdminId} onChange={(e) => setNewAdminId(e.target.value)} style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid var(--input-border)', background: 'var(--input-bg)', color: 'var(--text-primary)' }} />
                <button onClick={addAdmin} style={{ background: 'var(--primary-color)', color: 'white', padding: '10px 15px', borderRadius: '8px', border: 'none', display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer', fontWeight: '700' }}>
                  Add Admin
                </button>
              </div>
            ) : (
              <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '10px 15px', borderRadius: '8px', marginBottom: '20px', color: 'var(--negative-color)', fontSize: '0.85rem', fontWeight: '600' }}>
                Only Master Admins can add, remove, or promote admin members.
              </div>
            )}

            {/* List Admins */}
            <h4 style={{ marginBottom: '10px', color: 'var(--text-primary)', fontWeight: '800' }}>Active Admins List</h4>
            {adminsList.length === 0 ? (
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>No admin users found.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {adminsList.map((admin, idx) => (
                  <div key={admin.telegramId || idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', borderRadius: '8px', background: 'var(--input-bg)', border: '1px solid var(--border-color)' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <p style={{ margin: 0, fontWeight: '700', color: 'var(--text-primary)' }}>@{admin.username || 'NoUsername'}</p>
                        {admin.isMasterAdmin && (
                          <span style={{ fontSize: '0.65rem', background: 'var(--primary-color)', color: 'white', padding: '2px 6px', borderRadius: '4px', fontWeight: '700' }}>Master</span>
                        )}
                      </div>
                      <p style={{ margin: '3px 0 0 0', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>UID: {admin.telegramId}</p>
                    </div>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      {/* Promote Button */}
                      {isMaster && !admin.isMasterAdmin && (
                        <button onClick={() => promoteToMaster(admin.telegramId)} style={{ background: 'var(--primary-color)', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: '700', cursor: 'pointer' }}>Make Master</button>
                      )}
                      
                      {/* Remove / Leave Button */}
                      {admin.telegramId !== '6323700179' ? (
                        admin.telegramId === myTelegramId ? (
                          <button onClick={() => removeAdmin(admin.telegramId)} style={{ background: '#eab308', color: 'black', border: 'none', padding: '6px 12px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: '700', cursor: 'pointer' }}>Leave Role</button>
                        ) : isMaster ? (
                          <button onClick={() => removeAdmin(admin.telegramId)} style={{ background: 'var(--negative-color)', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: '700', cursor: 'pointer' }}>Remove</button>
                        ) : null
                      ) : (
                        <span style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--primary-color)' }}>Original Master</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

const TopFollowWork = () => {
  const navigate = useNavigate();
  return (
    <div style={{ padding: '20px', paddingBottom: '100px', background: 'transparent', minHeight: '100vh' }}>
      
      {/* Header with Back Button */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '25px' }}>
        <button onClick={() => navigate('/')} style={{ background: 'var(--card-bg)', border: 'var(--card-border)', padding: '8px', borderRadius: '12px', boxShadow: 'var(--shadow)', cursor: 'pointer', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <ChevronRight size={24} color="var(--text-primary)" style={{ transform: 'rotate(180deg)' }} />
        </button>
        <div>
          <h2 style={{ fontWeight: '900', fontSize: '1.5rem', color: 'var(--text-primary)', margin: 0 }}>Top Follow Work</h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>কাজ করার সম্পূর্ণ গাইড</p>
        </div>
      </div>

      <div style={{ backgroundColor: 'var(--card-bg)', border: 'var(--card-border)', backdropFilter: 'blur(10px)', webkitBackdropFilter: 'blur(10px)', padding: '20px', borderRadius: '20px', boxShadow: 'var(--shadow)', marginBottom: '20px' }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#d60093', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '15px' }}>
          <PlayCircle size={24} /> কিভাবে একাউন্ট করবেন
        </h3>
        <div className="video-wrapper" style={{ borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>
          <iframe src="https://www.youtube.com/embed/PjN0Xv7Bnp4" style={{ width: '100%', height: '100%', border: 'none' }} allowFullScreen />
        </div>
        <a 
          href="https://topfollow.app" 
          target="_blank" 
          rel="noreferrer"
          style={{
            display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px',
            background: 'linear-gradient(135deg, #d60093, #8b00ff)', color: 'white',
            padding: '14px', borderRadius: '14px', fontSize: '1.1rem', fontWeight: '700',
            marginTop: '15px', boxShadow: '0 6px 15px rgba(214, 0, 147, 0.3)', textDecoration: 'none'
          }}
        >
          App Link <Download size={20} />
        </a>
      </div>

    </div>
  );
};

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
    <div className="home-container" style={{background: 'transparent', minHeight: '100vh', padding: '20px', paddingBottom: '100px'}}>
      
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
        <a href={links.supportLink || '#'} target="_blank" rel="noreferrer" style={{background: 'var(--card-bg)', padding: '15px 20px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: 'var(--shadow)', border: 'var(--card-border)', backdropFilter: 'blur(10px)', color: 'var(--text-primary)', fontWeight: '700', textDecoration: 'none'}}>
          <div style={{display: 'flex', alignItems: 'center', gap: '15px'}}>
            <div style={{background: 'var(--input-bg)', padding: '10px', borderRadius: '12px'}}><MessageSquare size={24} style={{color: 'var(--text-primary)'}} /></div>
            <span style={{fontSize: '1.1rem', color: 'var(--text-primary)'}}>Admin Support</span>
          </div>
          <ChevronRight size={20} color="var(--text-secondary)" />
        </a>
        <a href={links.telegramChannel || '#'} target="_blank" rel="noreferrer" style={{background: 'var(--card-bg)', padding: '15px 20px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: 'var(--shadow)', border: 'var(--card-border)', backdropFilter: 'blur(10px)', color: 'var(--text-primary)', fontWeight: '700', textDecoration: 'none'}}>
          <div style={{display: 'flex', alignItems: 'center', gap: '15px'}}>
            <div style={{background: 'var(--input-bg)', padding: '10px', borderRadius: '12px'}}><UsersIcon size={24} style={{color: 'var(--text-primary)'}} /></div>
            <span style={{fontSize: '1.1rem', color: 'var(--text-primary)'}}>Join Telegram Channel</span>
          </div>
          <ChevronRight size={20} color="var(--text-secondary)" />
        </a>
        <a href={links.youtubeChannel || '#'} target="_blank" rel="noreferrer" style={{background: 'var(--card-bg)', padding: '15px 20px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: 'var(--shadow)', border: 'var(--card-border)', backdropFilter: 'blur(10px)', color: 'var(--text-primary)', fontWeight: '700', textDecoration: 'none'}}>
          <div style={{display: 'flex', alignItems: 'center', gap: '15px'}}>
            <div style={{background: 'var(--input-bg)', padding: '10px', borderRadius: '12px'}}><PlayCircle size={24} style={{color: 'var(--text-primary)'}} /></div>
            <span style={{fontSize: '1.1rem', color: 'var(--text-primary)'}}>Subscribe YouTube</span>
          </div>
          <ChevronRight size={20} color="var(--text-secondary)" />
        </a>
      </div>

      {/* FAQ Section */}
      <div style={{background: 'var(--card-bg)', border: 'var(--card-border)', padding: '20px', borderRadius: '20px', boxShadow: 'var(--shadow)'}}>
        <h3 style={{fontSize: '1.3rem', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '20px', textAlign: 'center'}}>💡 Frequently Asked Questions</h3>
        <div style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
          {faqs.map((faq, index) => (
            <div key={index} style={{borderBottom: index !== faqs.length - 1 ? '1px solid var(--border-color)' : 'none', paddingBottom: '10px', paddingTop: '10px'}}>
              <div 
                onClick={() => setOpenFaq(openFaq === index ? null : index)} 
                style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', fontWeight: '700', color: 'var(--text-primary)', fontSize: '0.95rem'}}
              >
                <span>{faq.q}</span>
                <ChevronRight size={18} style={{transform: openFaq === index ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.2s'}} />
              </div>
              {openFaq === index && (
                <p style={{marginTop: '10px', color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: '1.5', whiteSpace: 'pre-line'}}>
                  {faq.a}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Developer Promotion / Credit */}
      <div style={{
        marginTop: '25px',
        textAlign: 'center',
        padding: '12px',
        borderRadius: '12px',
        background: 'rgba(255, 255, 255, 0.02)',
        border: '1px dashed var(--border-color)',
      }}>
        <span style={{
          fontSize: '0.8rem',
          color: 'var(--text-secondary)',
          fontWeight: '600'
        }}>
          Want to build your own site? 
        </span>{' '}
        <a 
          href="https://t.me/developer1100" 
          target="_blank" 
          rel="noopener noreferrer"
          style={{
            color: '#38bdf8',
            textDecoration: 'none',
            fontWeight: '800',
            fontSize: '0.85rem',
            marginLeft: '5px'
          }}
        >
          Contact Developer
        </a>
      </div>

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
          const defaultData = jobData[id] || { title: taskMeta.title || 'Task', accountVideo: '', workVideo: '', withdrawVideo: '', regLink: '' };
          if (Array.isArray(data)) {
            const found = data.find(t => t.taskId === id);
            setDynamicJob(found || { taskId: id, ...defaultData });
          } else {
            setDynamicJob({ taskId: id, ...defaultData });
          }
        }).catch(err => {
          console.error("Task fetch failed", err);
          const defaultData = jobData[id] || { title: taskMeta.title || 'Task', accountVideo: '', workVideo: '', withdrawVideo: '', regLink: '' };
          setDynamicJob({ taskId: id, ...defaultData });
        });
    }
  }, [id, taskMeta]);

  if (!taskMeta) return <div style={{padding:'20px', color: 'var(--text-primary)'}}>Task not found</div>;
  
  if (taskMeta.type === 'custom') {
    if (taskMeta.id === 'top-follow') return <TopFollowWork />;
  }

  if (taskMeta.type === 'template') {
    if (!dynamicJob) {
      return (
        <div style={{ padding: '40px 20px', textAlign: 'center', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <p style={{ color: 'var(--text-secondary)' }}>লোড হচ্ছে...</p>
        </div>
      );
    }
    return <JobDetailTemplate job={dynamicJob} />;
  }

  const rawHtml = taskHtmlData[taskMeta.dataKey];
  return (
    <div style={{ backgroundColor: '#fff', minHeight: '100vh', paddingBottom: '100px' }}>
      <div className="imported-html-content" dangerouslySetInnerHTML={{ __html: rawHtml }} />
    </div>
  );
};

// ---- Microjobs Center Page (Normal Users) ----
const JobsPage = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState(null);
  const [proofInput, setProofInput] = useState('');
  const myTelegramId = window.Telegram?.WebApp?.initDataUnsafe?.user?.id?.toString() || "6323700179";

  const fetchJobs = () => {
    setLoading(true);
    fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/jobs`)
      .then(res => res.json())
      .then(data => {
        setJobs(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleSubmitProof = (e) => {
    e.preventDefault();
    if(!proofInput) return alert("প্রমাণ হিসেবে আপনার Username/ID দিন!");

    fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/jobs/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jobId: selectedJob._id,
        userTelegramId: myTelegramId,
        submittedId: proofInput
      })
    }).then(res => res.json())
      .then(data => {
        alert("প্রমাণ জমা দেওয়া হয়েছে! অ্যাডমিন যাচাই করে ব্যালেন্স যোগ করে দিবে।");
        setSelectedJob(null);
        setProofInput('');
      }).catch(err => {
        console.error(err);
        alert("জমা দিতে ব্যর্থ হয়েছে।");
      });
  };

  return (
    <div className="home-container" style={{background: 'transparent', minHeight: '100vh', padding: '20px', paddingBottom: '100px'}}>
      
      {/* Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #10b981, #0ea5e9)', 
        borderRadius: '20px', 
        padding: '25px 20px', 
        color: 'white', 
        marginBottom: '25px',
        boxShadow: '0 8px 20px rgba(16, 185, 129, 0.2)',
        border: '1px solid rgba(255,255,255,0.1)'
      }}>
        <h2 style={{fontSize: '1.6rem', fontWeight: '900', marginBottom: '5px'}}>Microjobs Center 💼</h2>
        <p style={{fontSize: '0.95rem', opacity: '0.9', fontWeight: '600'}}>সহজ কাজ সম্পন্ন করে সরাসরি পেমেন্ট নিন! প্রতি কাজের জন্য নির্দিষ্ট পরিমাণ টাকা বোনাস দেওয়া হবে।</p>
      </div>

      <h3 style={{fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '15px'}}>Available Jobs</h3>

      {loading ? (
        <p style={{textAlign: 'center', color: 'var(--text-secondary)'}}>Loading jobs...</p>
      ) : jobs.length === 0 ? (
        <div style={{
          textAlign: 'center', padding: '40px 20px', 
          background: 'var(--card-bg)', 
          border: 'var(--card-border)',
          borderRadius: '16px', color: 'var(--text-secondary)',
          backdropFilter: 'blur(10px)'
        }}>
          <p>No active jobs available at the moment.</p>
        </div>
      ) : (
        <div style={{display: 'flex', flexDirection: 'column', gap: '15px'}}>
          {jobs.map((job) => (
            <div key={job._id} style={{
              background: 'var(--card-bg)', borderRadius: '16px', padding: '15px',
              boxShadow: 'var(--shadow)', 
              border: 'var(--card-border)',
              backdropFilter: 'blur(10px)',
              color: 'var(--text-primary)'
            }}>
               <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px'}}>
                <div>
                  <h4 style={{fontSize: '1.1rem', fontWeight: '800', color: 'var(--text-primary)'}}>{job.title}</h4>
                  <span style={{fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: '700', display: 'block', marginTop: '4px'}}>
                    👥 Limit: <span style={{color: 'var(--text-primary)', fontWeight: '800'}}>{job.completedCount || 0}</span> / {job.workerLimit > 0 ? job.workerLimit : 'Unlimited'} completed
                  </span>
                </div>
                <span style={{background: 'var(--input-bg)', color: 'var(--positive-color)', padding: '4px 10px', borderRadius: '10px', fontSize: '0.85rem', fontWeight: '800', border: '1px solid var(--border-color)'}}>
                  +{job.amount} ৳
                </span>
              </div>
              <p style={{fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '15px', whiteSpace: 'pre-line'}}>{job.description}</p>
              
              <div style={{display: 'flex', gap: '10px'}}>
                <a href={job.link} target="_blank" rel="noreferrer" style={{
                  flex: 1, background: 'linear-gradient(90deg, #d60093 0%, #8b00ff 100%)', color: 'white', textDecoration: 'none',
                  padding: '10px', borderRadius: '10px', textAlign: 'center', fontSize: '0.85rem', fontWeight: '700',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px',
                  boxShadow: '0 4px 12px rgba(139, 0, 255, 0.2)'
                }}>
                  <ExternalLink size={16}/> Go to Link
                </a>
                <button onClick={() => setSelectedJob(job)} style={{
                  flex: 1, background: '#00e676', color: 'white', border: 'none',
                  padding: '10px', borderRadius: '10px', fontSize: '0.85rem', fontWeight: '700', cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(0,230,118,0.2)'
                }}>
                  Submit Proof
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Proof Submission Dialog / Modal */}
      {selectedJob && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.6)', zIndex: 1000, display: 'flex',
          alignItems: 'center', justifyContent: 'center', padding: '20px',
          backdropFilter: 'blur(5px)', webkitBackdropFilter: 'blur(5px)'
        }}>
          <div style={{
            background: 'var(--card-bg)', borderRadius: '24px', padding: '25px',
            width: '100%', maxWidth: '400px', boxShadow: 'var(--shadow)', border: 'var(--card-border)',
            backdropFilter: 'blur(30px)', webkitBackdropFilter: 'blur(30px)', color: 'var(--text-primary)'
          }}>
            <h3 style={{fontSize: '1.25rem', fontWeight: '900', color: 'var(--text-primary)', marginBottom: '10px'}}>Submit Job Proof</h3>
            <p style={{fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '20px'}}>
              <strong>Job:</strong> {selectedJob.title}<br/>
              <strong>Reward:</strong> {selectedJob.amount} ৳
            </p>
            
            <form onSubmit={handleSubmitProof}>
              <label style={{fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-primary)', display: 'block', marginBottom: '8px'}}>
                Proof (e.g. Username / Channel ID / Email used):
              </label>
              <input type="text" placeholder="Enter proof text" value={proofInput} onChange={e => setProofInput(e.target.value)} style={{
                width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid var(--input-border)',
                background: 'var(--input-bg)', color: 'var(--text-primary)', fontSize: '0.9rem', marginBottom: '20px', outline: 'none'
              }} />
              
              <div style={{display: 'flex', gap: '10px'}}>
                <button type="button" onClick={() => setSelectedJob(null)} style={{
                  flex: 1, background: 'var(--input-bg)', color: 'var(--text-secondary)', border: '1px solid var(--border-color)',
                  padding: '12px', borderRadius: '10px', fontWeight: '700', cursor: 'pointer'
                }}>
                  Cancel
                </button>
                <button type="submit" style={{
                  flex: 1, background: 'var(--positive-color)', color: 'white', border: 'none',
                  padding: '12px', borderRadius: '10px', fontWeight: '700', cursor: 'pointer'
                }}>
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

const WatchAdsPage = () => {
  const navigate = useNavigate();
  const [config, setConfig] = useState({ monetagDirectLink: '', monetagReward: 0.1 });
  const [userBalance, setUserBalance] = useState(0);
  const [isWatching, setIsWatching] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const myTelegramId = window.Telegram?.WebApp?.initDataUnsafe?.user?.id?.toString() || "6323700179";

  useEffect(() => {
    // Fetch config
    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/config`)
      .then(res => res.json())
      .then(data => {
        if (data) {
          setConfig({
            monetagDirectLink: data.monetagDirectLink || '',
            monetagReward: data.monetagReward || 0.1
          });
        }
      })
      .catch(console.error);

    // Fetch user balance
    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/admin/user/${myTelegramId}`)
      .then(res => res.json())
      .then(data => {
        if (data && data.balance !== undefined) {
          setUserBalance(data.balance);
        }
      })
      .catch(console.error);
  }, [myTelegramId]);

  useEffect(() => {
    let timer;
    if (isWatching && countdown > 0) {
      timer = setTimeout(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
    } else if (isWatching && countdown === 0) {
      setIsWatching(false);
      // Claim reward
      fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/ads/claim`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: myTelegramId })
      })
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setUserBalance(data.balance);
            Swal.fire({
              title: 'Success!',
              text: `🎉 Reward Claimed! You have successfully earned ${data.reward} ৳.`,
              icon: 'success',
              confirmButtonText: 'Great!',
              confirmButtonColor: 'var(--positive-color)',
            });
          } else {
            Swal.fire({
              title: 'Error',
              text: data.error || 'Failed to claim reward.',
              icon: 'error',
              confirmButtonColor: 'var(--negative-color)'
            });
          }
        })
        .catch(err => {
          console.error(err);
          Swal.fire({
            title: 'Error',
            text: 'Server error. Please try again.',
            icon: 'error',
            confirmButtonColor: 'var(--negative-color)'
          });
        });
    }
    return () => clearTimeout(timer);
  }, [isWatching, countdown]);

  const handleWatchAd = () => {
    if (!config.monetagDirectLink) {
      return Swal.fire({
        title: 'Error',
        text: 'Ad system is not fully set up by the admin yet.',
        icon: 'warning',
        confirmButtonColor: 'var(--negative-color)'
      });
    }
    
    window.open(config.monetagDirectLink, '_blank');
    
    setIsWatching(true);
    setCountdown(5);
  };

  return (
    <div className="home-container" style={{background: 'transparent', minHeight: '100vh', padding: '20px', paddingBottom: '100px'}}>
      <div style={{display: 'flex', alignItems: 'center', marginBottom: '20px', gap: '10px'}}>
        <button onClick={() => navigate(-1)} style={{background: 'white', border: 'none', padding: '8px', borderRadius: '12px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)'}}>
          <ChevronRight size={24} color="#374151" style={{transform: 'rotate(180deg)'}} />
        </button>
        <h2 style={{fontWeight: '900', fontSize: '1.5rem', color: '#1f2937'}}>Watch Ads & Earn</h2>
      </div>

      <div style={{
        background: 'linear-gradient(135deg, #1e1b4b, #311042)', 
        borderRadius: '20px', 
        padding: '20px', 
        color: 'white',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
        marginBottom: '25px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        border: '1px solid rgba(255,255,255,0.1)'
      }}>
        <div>
          <p style={{color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', fontWeight: '700', margin: '0 0 5px 0'}}>Total Balance</p>
          <h3 style={{fontSize: '1.8rem', fontWeight: '900', margin: 0}}>{userBalance.toFixed(2)} ৳</h3>
        </div>
        <div style={{background: 'rgba(255,255,255,0.1)', padding: '12px', borderRadius: '16px'}}>
          <DollarSign size={28} color="#a855f7" />
        </div>
      </div>

      <div style={{
        background: 'white', 
        borderRadius: '24px', 
        padding: '30px 20px', 
        boxShadow: '0 8px 30px rgba(0,0,0,0.05)', 
        textAlign: 'center',
        border: '1px solid rgba(0,0,0,0.02)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{position: 'absolute', top: '-50px', right: '-50px', width: '150px', height: '150px', borderRadius: '50%', background: 'rgba(168, 85, 247, 0.05)', filter: 'blur(30px)'}}></div>
        <div style={{position: 'absolute', bottom: '-50px', left: '-50px', width: '150px', height: '150px', borderRadius: '50%', background: 'rgba(59, 130, 246, 0.05)', filter: 'blur(30px)'}}></div>

        <div style={{
          display: 'inline-flex',
          background: 'linear-gradient(135deg, #f5f3ff, #ede9fe)',
          padding: '20px',
          borderRadius: '50%',
          marginBottom: '20px',
          boxShadow: '0 8px 20px rgba(139, 92, 246, 0.1)',
          animation: isWatching ? 'pulse 1.5s infinite' : 'none'
        }}>
          <PlayCircle size={48} color="#8b5cf6" />
        </div>

        <h3 style={{fontSize: '1.4rem', fontWeight: '900', color: '#1f2937', marginBottom: '10px'}}>Premium Video Ads</h3>
        <p style={{color: '#6b7280', fontSize: '0.9rem', lineHeight: '1.6', maxWidth: '300px', margin: '0 auto 25px auto'}}>
          Watch ads to earn rewards directly in your wallet balance. Tap start, watch the ad content, and return to collect your reward.
        </p>

        <div style={{
          background: '#f3f4f6', 
          borderRadius: '16px', 
          padding: '12px 20px', 
          display: 'inline-flex', 
          alignItems: 'center', 
          gap: '8px',
          marginBottom: '30px',
          border: '1px solid #e5e7eb'
        }}>
          <Gift size={20} color="#a855f7" />
          <span style={{color: '#374151', fontWeight: '800', fontSize: '0.95rem'}}>Reward: <span style={{color: '#8b5cf6'}}>{config.monetagReward} ৳</span> per view</span>
        </div>

        {isWatching ? (
          <div style={{
            background: 'linear-gradient(135deg, #a855f7, #7c3aed)',
            color: 'white',
            padding: '16px 30px',
            borderRadius: '16px',
            fontWeight: '800',
            fontSize: '1.1rem',
            boxShadow: '0 8px 20px rgba(139, 92, 246, 0.3)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px',
            border: 'none',
            width: '100%',
            justifyContent: 'center'
          }}>
            <span className="spinner" style={{
              width: '18px',
              height: '18px',
              border: '3px solid rgba(255,255,255,0.3)',
              borderTopColor: 'white',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              display: 'inline-block'
            }}></span>
            <span>Verifying Ad View... ({countdown}s)</span>
          </div>
        ) : (
          <button 
            onClick={handleWatchAd}
            style={{
              background: 'linear-gradient(135deg, #8b5cf6, #3b82f6)',
              color: 'white',
              padding: '16px 30px',
              borderRadius: '16px',
              fontWeight: '800',
              fontSize: '1.1rem',
              width: '100%',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 8px 20px rgba(59, 130, 246, 0.3)',
              transition: 'transform 0.2s, box-shadow 0.2s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px'
            }}
            onMouseOver={e => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 12px 25px rgba(59, 130, 246, 0.4)';
            }}
            onMouseOut={e => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 8px 20px rgba(59, 130, 246, 0.3)';
            }}
          >
            <PlayCircle size={22} />
            <span>Start Watching Ad</span>
          </button>
        )}
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(139, 92, 246, 0.4); }
          70% { transform: scale(1.05); box-shadow: 0 0 0 10px rgba(139, 92, 246, 0); }
          100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(139, 92, 246, 0); }
        }
      `}</style>
    </div>
  );
};

function App() {
  const [theme, setTheme] = useState(localStorage.getItem('app-theme') || 'gradient');

  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    const nextTheme = theme === 'gradient' ? 'light' : theme === 'light' ? 'dark' : 'gradient';
    setTheme(nextTheme);
    localStorage.setItem('app-theme', nextTheme);
  };

  return (
    <Router>
      <div style={{minHeight: '100vh', position: 'relative', paddingBottom: '80px', backgroundColor: 'transparent'}}>
        <Header theme={theme} toggleTheme={toggleTheme} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/jobs" element={<JobsPage />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/withdraw" element={<WithdrawPage />} />
          <Route path="/add-fund" element={<AddFundPage />} />
          <Route path="/sell-coin" element={<SellCoinPage />} />
          <Route path="/market" element={<CoinMarketPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/invite" element={<Invite />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/watch-ads" element={<WatchAdsPage />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/task/:id" element={<TaskRenderer />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
