'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ isOpen = true, onClose }: SidebarProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const pageParam = searchParams.get('page');
  const { user, logout } = useAuth();

  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({
    bookings: pathname.startsWith('/admin/bookings') || pathname === '/admin/calendar',
    users: pathname.startsWith('/admin/customers') || pathname.startsWith('/admin/drivers'),
    settings:
      pathname.startsWith('/admin/settings') ||
      pathname.startsWith('/admin/locations') ||
      pathname.startsWith('/admin/zones') ||
      pathname.startsWith('/admin/pricing') ||
      pathname.startsWith('/admin/surcharges') ||
      pathname.startsWith('/admin/payments') ||
      pathname.startsWith('/admin/notifications') ||
      pathname.startsWith('/admin/vehicles'),
    kb: pathname.startsWith('/admin/kb') || pathname.startsWith('/admin/user-guide'),
  });

  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);

  useEffect(() => {
    setExpandedMenus((prev) => ({
      ...prev,
      bookings: prev.bookings || pathname.startsWith('/admin/bookings') || pathname === '/admin/calendar',
      users: prev.users || pathname.startsWith('/admin/customers') || pathname.startsWith('/admin/drivers'),
      settings:
        prev.settings ||
        pathname.startsWith('/admin/settings') ||
        pathname.startsWith('/admin/locations') ||
        pathname.startsWith('/admin/zones') ||
        pathname.startsWith('/admin/pricing') ||
        pathname.startsWith('/admin/surcharges') ||
        pathname.startsWith('/admin/payments') ||
        pathname.startsWith('/admin/notifications') ||
        pathname.startsWith('/admin/vehicles'),
    }));
  }, [pathname]);

  const toggleMenu = (key: string) => {
    setExpandedMenus((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const displayName = user?.firstName
    ? `${user.firstName} ${user.lastName || ''}`.trim()
    : user?.email || 'Admin User';
  const avatarLetter = (displayName.charAt(0) || 'A').toUpperCase();
  const tenantName = user?.activeTenantId ? 'RouteOS Fleet' : 'Main Fleet';

  const isLinkActive = (path: string, page?: string) => {
    if (page) {
      return pathname === path && pageParam === page;
    }
    if (path === '/admin/bookings' && !page) {
      return pathname === '/admin/bookings' && !pageParam;
    }
    if (path === '/admin') {
      return pathname === '/admin';
    }
    return pathname.startsWith(path);
  };

  return (
    <>
      <aside className={`routeos-sidebar ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        {/* Header / Logo */}
        <div className="routeos-sidebar-header">
          <Link href="/admin" className="flex items-center gap-2 text-slate-900 font-bold text-lg text-decoration-none">
            <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-sm shadow">
              R
            </div>
            <div className="flex flex-col leading-tight">
              <span className="font-bold text-slate-900 text-base">RouteOS</span>
              <span className="text-[10px] text-blue-600 font-semibold tracking-wider uppercase">Company Edition</span>
            </div>
          </Link>

          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-md text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors md:hidden"
              aria-label="Close Sidebar"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Navigation Items */}
        <ul className="routeos-nav-links">
          {/* Main Category */}
          <li className="routeos-nav-category">Main</li>
          <li className={`routeos-nav-item ${isLinkActive('/admin') ? 'active' : ''}`}>
            <div className="routeos-nav-link-wrapper">
              <Link href="/admin" className="routeos-nav-link-content">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
                Dashboard
              </Link>
            </div>
          </li>

          {/* System Category */}
          <li className="routeos-nav-category">System</li>

          {/* Bookings Accordion */}
          <li className={`routeos-nav-item ${expandedMenus.bookings ? 'expanded' : ''} ${pathname.startsWith('/admin/bookings') || pathname === '/admin/calendar' ? 'active' : ''}`}>
            <div className="routeos-nav-link-wrapper" onClick={() => toggleMenu('bookings')}>
              <div className="routeos-nav-link-content cursor-pointer">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                Bookings
              </div>
              <svg className={`routeos-submenu-arrow transform transition-transform duration-200 ${expandedMenus.bookings ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </div>

            {expandedMenus.bookings && (
              <ul className="routeos-submenu">
                <li className={`routeos-nav-item ${isLinkActive('/admin/bookings', 'next24') ? 'active' : ''}`}>
                  <div className="routeos-nav-link-wrapper">
                    <Link href="/admin/bookings?page=next24" className="routeos-nav-link-content">Next 24 Hours</Link>
                  </div>
                </li>
                <li className={`routeos-nav-item ${isLinkActive('/admin/bookings', 'latest') ? 'active' : ''}`}>
                  <div className="routeos-nav-link-wrapper">
                    <Link href="/admin/bookings?page=latest" className="routeos-nav-link-content">Latest</Link>
                  </div>
                </li>
                <li className={`routeos-nav-item ${isLinkActive('/admin/bookings', 'completed') ? 'active' : ''}`}>
                  <div className="routeos-nav-link-wrapper">
                    <Link href="/admin/bookings?page=completed" className="routeos-nav-link-content">Completed</Link>
                  </div>
                </li>
                <li className={`routeos-nav-item ${isLinkActive('/admin/bookings', 'cancelled') ? 'active' : ''}`}>
                  <div className="routeos-nav-link-wrapper">
                    <Link href="/admin/bookings?page=cancelled" className="routeos-nav-link-content">Cancelled</Link>
                  </div>
                </li>
                <li className={`routeos-nav-item ${isLinkActive('/admin/bookings') ? 'active' : ''}`}>
                  <div className="routeos-nav-link-wrapper">
                    <Link href="/admin/bookings" className="routeos-nav-link-content">All</Link>
                  </div>
                </li>
                <li className={`routeos-nav-item ${isLinkActive('/admin/bookings', 'trash') ? 'active' : ''}`}>
                  <div className="routeos-nav-link-wrapper">
                    <Link href="/admin/bookings?page=trash" className="routeos-nav-link-content">Trash</Link>
                  </div>
                </li>
                <li className={`routeos-nav-item ${isLinkActive('/admin/bookings/create') ? 'active' : ''}`}>
                  <div className="routeos-nav-link-wrapper">
                    <Link href="/admin/bookings/create" className="routeos-nav-link-content">Add New</Link>
                  </div>
                </li>
                <li className={`routeos-nav-item ${isLinkActive('/admin/calendar') ? 'active' : ''}`}>
                  <div className="routeos-nav-link-wrapper">
                    <Link href="/admin/calendar" className="routeos-nav-link-content">Calendar</Link>
                  </div>
                </li>
              </ul>
            )}
          </li>

          {/* Users Accordion */}
          <li className={`routeos-nav-item ${expandedMenus.users ? 'expanded' : ''} ${pathname.startsWith('/admin/customers') || pathname.startsWith('/admin/drivers') ? 'active' : ''}`}>
            <div className="routeos-nav-link-wrapper" onClick={() => toggleMenu('users')}>
              <div className="routeos-nav-link-content cursor-pointer">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                Users
              </div>
              <svg className={`routeos-submenu-arrow transform transition-transform duration-200 ${expandedMenus.users ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </div>

            {expandedMenus.users && (
              <ul className="routeos-submenu">
                <li className={`routeos-nav-item ${isLinkActive('/admin/customers') ? 'active' : ''}`}>
                  <div className="routeos-nav-link-wrapper">
                    <Link href="/admin/customers" className="routeos-nav-link-content">Customers</Link>
                  </div>
                </li>
                <li className={`routeos-nav-item ${isLinkActive('/admin/drivers') ? 'active' : ''}`}>
                  <div className="routeos-nav-link-wrapper">
                    <Link href="/admin/drivers" className="routeos-nav-link-content">Drivers</Link>
                  </div>
                </li>
              </ul>
            )}
          </li>

          {/* Settings Accordion */}
          <li className={`routeos-nav-item ${expandedMenus.settings ? 'expanded' : ''} ${expandedMenus.settings ? 'active' : ''}`}>
            <div className="routeos-nav-link-wrapper" onClick={() => toggleMenu('settings')}>
              <div className="routeos-nav-link-content cursor-pointer">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="3" />
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                </svg>
                Settings
              </div>
              <svg className={`routeos-submenu-arrow transform transition-transform duration-200 ${expandedMenus.settings ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </div>

            {expandedMenus.settings && (
              <ul className="routeos-submenu">
                <li className={`routeos-nav-item ${isLinkActive('/admin/locations') ? 'active' : ''}`}>
                  <div className="routeos-nav-link-wrapper">
                    <Link href="/admin/locations" className="routeos-nav-link-content">Locations</Link>
                  </div>
                </li>
                <li className={`routeos-nav-item ${isLinkActive('/admin/zones') ? 'active' : ''}`}>
                  <div className="routeos-nav-link-wrapper">
                    <Link href="/admin/zones" className="routeos-nav-link-content">Zones</Link>
                  </div>
                </li>
                <li className={`routeos-nav-item ${isLinkActive('/admin/pricing') ? 'active' : ''}`}>
                  <div className="routeos-nav-link-wrapper">
                    <Link href="/admin/pricing" className="routeos-nav-link-content">Pricing & Rates</Link>
                  </div>
                </li>
                <li className={`routeos-nav-item ${isLinkActive('/admin/vehicles') ? 'active' : ''}`}>
                  <div className="routeos-nav-link-wrapper">
                    <Link href="/admin/vehicles" className="routeos-nav-link-content">Vehicles</Link>
                  </div>
                </li>
                <li className={`routeos-nav-item ${isLinkActive('/admin/surcharges') ? 'active' : ''}`}>
                  <div className="routeos-nav-link-wrapper">
                    <Link href="/admin/surcharges" className="routeos-nav-link-content">Surcharges</Link>
                  </div>
                </li>
                <li className={`routeos-nav-item ${isLinkActive('/admin/payments') ? 'active' : ''}`}>
                  <div className="routeos-nav-link-wrapper">
                    <Link href="/admin/payments" className="routeos-nav-link-content">Payment Settings</Link>
                  </div>
                </li>
                <li className={`routeos-nav-item ${isLinkActive('/admin/notifications') ? 'active' : ''}`}>
                  <div className="routeos-nav-link-wrapper">
                    <Link href="/admin/notifications" className="routeos-nav-link-content">Notifications</Link>
                  </div>
                </li>
                <li className={`routeos-nav-item ${isLinkActive('/admin/settings') ? 'active' : ''}`}>
                  <div className="routeos-nav-link-wrapper">
                    <Link href="/admin/settings" className="routeos-nav-link-content">General Settings</Link>
                  </div>
                </li>
              </ul>
            )}
          </li>

          {/* Knowledge Base Category */}
          <li className="routeos-nav-category">Knowledge Base</li>
          <li className={`routeos-nav-item ${expandedMenus.kb ? 'expanded' : ''}`}>
            <div className="routeos-nav-link-wrapper" onClick={() => toggleMenu('kb')}>
              <div className="routeos-nav-link-content cursor-pointer">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                  <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                </svg>
                Knowledge Base
              </div>
              <svg className={`routeos-submenu-arrow transform transition-transform duration-200 ${expandedMenus.kb ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </div>

            {expandedMenus.kb && (
              <ul className="routeos-submenu">
                <li className="routeos-nav-item">
                  <div className="routeos-nav-link-wrapper">
                    <a
                      href="#user-guide"
                      onClick={(e) => {
                        e.preventDefault();
                        alert('RouteOS User Guide & System Documentation');
                      }}
                      className="routeos-nav-link-content"
                    >
                      User Guide
                    </a>
                  </div>
                </li>
              </ul>
            )}
          </li>
        </ul>

        {/* Sidebar Footer / Account Menu */}
        <div className="routeos-sidebar-footer relative">
          {isAccountMenuOpen && (
            <div className="absolute bottom-full left-3 right-3 mb-2 bg-white border border-slate-200 rounded-xl shadow-lg p-2 z-50 animate-in fade-in slide-in-from-bottom-2">
              <Link
                href="/admin/settings"
                onClick={() => setIsAccountMenuOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 rounded-lg text-decoration-none transition-colors"
              >
                <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="3" />
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0-.33-1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                </svg>
                Settings
              </Link>
              <button
                onClick={() => {
                  setIsAccountMenuOpen(false);
                  logout();
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors text-left font-medium border-0 bg-transparent cursor-pointer"
              >
                <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
                Log out
              </button>
            </div>
          )}

          <button
            type="button"
            onClick={() => setIsAccountMenuOpen(!isAccountMenuOpen)}
            className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-slate-100 transition-colors text-left border-0 bg-transparent cursor-pointer"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center font-semibold text-white text-sm shrink-0">
                {avatarLetter}
              </div>
              <div className="min-w-0">
                <h4 className="text-sm font-semibold text-slate-900 truncate leading-tight m-0">{displayName}</h4>
                <p className="text-xs text-slate-500 truncate leading-tight mt-0.5 m-0">{tenantName}</p>
              </div>
            </div>
            <svg
              className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${isAccountMenuOpen ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>
        </div>
      </aside>
    </>
  );
}
