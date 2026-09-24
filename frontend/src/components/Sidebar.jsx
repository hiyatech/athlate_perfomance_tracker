import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LayoutDashboard, Sparkles, Activity, TrendingUp, User, LogOut } from 'lucide-react';

export default function Sidebar() {
  const { user, logout } = useContext(AuthContext);

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/intelligence', label: 'Goal & Training Plan', icon: Sparkles },
    { path: '/training', label: "Today's Workout", icon: Activity },
    { path: '/performance', label: 'Performance', icon: TrendingUp },
  ];

  return (
    <aside className="w-64 bg-white border-r border-brand-border h-screen flex flex-col justify-between p-4 sticky top-0">
      <div>
        {/* App Title Header */}
        <div className="flex items-center gap-3 px-2 py-3 mb-6">
          <div className="w-9 h-9 rounded-xl bg-brand-accent flex items-center justify-center text-white font-bold text-lg shadow-sm">
            AP
          </div>
          <div>
            <h1 className="font-bold text-brand-charcoal text-base leading-tight">Athlete Tracker</h1>
            <p className="text-xs text-brand-muted font-medium">Performance Engine</p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-colors ${
                    isActive
                      ? 'bg-brand-accent-light text-brand-accent font-semibold'
                      : 'text-brand-muted hover:bg-stone-100 hover:text-brand-charcoal'
                  }`
                }
              >
                <Icon size={18} />
                {item.label}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Footer Area: Profile Link & Logout */}
      <div className="border-t border-brand-border pt-4 mt-auto space-y-2">
        <NavLink
          to="/profile"
          className={({ isActive }) =>
            `flex items-center justify-between p-2 rounded-xl transition-colors ${
              isActive ? 'bg-brand-accent-light border border-brand-accent/30' : 'hover:bg-stone-50'
            }`
          }
        >
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-8 h-8 rounded-full bg-brand-accent-light text-brand-accent font-bold flex items-center justify-center text-xs overflow-hidden border border-brand-accent/30 shrink-0">
              {user?.photoUrl ? (
                <img src={user.photoUrl} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <span>{user?.name ? user.name.charAt(0).toUpperCase() : 'A'}</span>
              )}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-semibold text-brand-charcoal truncate">{user?.name || 'Athlete'}</p>
              <p className="text-[10px] text-brand-muted truncate">Edit Profile</p>
            </div>
          </div>
          <User size={16} className="text-brand-muted" />
        </NavLink>

        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-stone-600 hover:text-red-600 hover:bg-red-50 border border-brand-border transition-colors"
        >
          <LogOut size={14} /> Log Out
        </button>
      </div>
    </aside>
  );
}
