import { useState } from 'react';
import { Outlet, NavLink, useNavigate, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../store/index.tsx';
import { logout, updateUser } from '../pages/User/Login/slice.ts';
import {
  LayoutDashboard,
  Film,
  Building2,
  MapPin,
  Monitor,
  Calendar,
  Popcorn,
  Image,
  LogOut,
  Menu,
  X,
  ChevronDown,
  Home,
  UserRound,
} from 'lucide-react';

// `roles` xác định vai trò nào được phép thấy mục này.
// Admin quản lý toàn bộ hệ thống; Staff chỉ vận hành trong phạm vi một cụm rạp
// (phòng chiếu, lịch chiếu, đồ ăn & combo) nên không thấy các mục cấp hệ thống.
const navItems = [
  { to: '/admin', icon: LayoutDashboard, label: 'Dashboard', end: true, roles: ['admin', 'staff'] },
  { to: '/admin/movies', icon: Film, label: 'Quản lý Phim', roles: ['staff'] },
  { to: '/admin/cinema-systems', icon: Building2, label: 'Hệ thống rạp', roles: ['admin'] },
  { to: '/admin/cinema-complexes', icon: MapPin, label: 'Cụm rạp', roles: ['admin'] },
  { to: '/admin/cinemas', icon: Monitor, label: 'Phòng chiếu', roles: ['staff'] },
  { to: '/admin/showtimes', icon: Calendar, label: 'Lịch chiếu', roles: ['staff'] },
  { to: '/admin/foods', icon: Popcorn, label: 'Đồ ăn & Combo', roles: ['staff'] },
  { to: '/admin/banners', icon: Image, label: 'Banner', roles: ['admin'] },
  { to: '/admin/staff', icon: UserRound, label: 'Quản lý nhân viên', roles: ['admin'] },
];

export default function AdminTemplate() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const user = useSelector((state: RootState) => state.login.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  // Cho phép admin chuyển sang trải nghiệm với vai trò người dùng (user).
  // Lưu lại vai trò gốc vào realRole để có thể quay lại trang quản trị.
  const handleSwitchToUser = () => {
    const original = user?.realRole || user?.role || user?.userType;
    dispatch(updateUser({ role: 'USER', realRole: original }));
    navigate('/');
  };

  // Redirect non-admin/staff users
  const role = user?.role?.toLowerCase() || user?.userType?.toLowerCase() || '';
  if (!user || (role !== 'admin' && role !== 'staff')) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Truy cập bị từ chối</h1>
          <p className="text-gray-600 mb-4">Bạn không có quyền truy cập trang quản trị.</p>
          <button
            onClick={() => navigate('/login')}
            className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors"
          >
            Đăng nhập
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-40 h-screen w-64 bg-white border-r border-gray-200 flex flex-col transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-5 border-b border-gray-100">
          <img src="/mievoh_logo_rounded.svg" alt="Mievoh" className="w-9 h-9" />
          <span className="text-lg font-bold text-violet-700">Mievoh Admin</span>
          <button className="lg:hidden ml-auto p-1" onClick={() => setSidebarOpen(false)}>
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {navItems.filter(item => item.roles.includes(role)).map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${isActive
                  ? 'bg-violet-50 text-violet-700 shadow-sm'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`
              }
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="border-t border-gray-100 p-3 space-y-2">
          {/* Segmented role toggle: Member / Admin */}
          <div className="flex items-center gap-1 p-1 bg-gray-100 rounded-xl">
            <button
              onClick={handleSwitchToUser}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold text-gray-600 hover:bg-white hover:text-violet-700 transition-all"
            >
              <UserRound className="w-4 h-4" />
              <span>Member</span>
            </button>
            <button
              disabled
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold bg-white text-violet-700 shadow-sm cursor-default"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Admin</span>
            </button>
          </div>
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Đăng xuất</span>
          </button>
        </div>
      </aside>

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="sticky top-0 z-20 h-16 bg-white/80 backdrop-blur-md border-b border-gray-200 flex items-center justify-between px-4 lg:px-6">
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-5 h-5 text-gray-700" />
          </button>

          <div className="hidden lg:block" />

          {/* User info */}
          <div className="relative">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-gray-50 transition-colors"
            >
              <img
                src={user?.avatar || '/images/avatar.jpg'}
                alt="Avatar"
                className="w-8 h-8 rounded-full object-cover border-2 border-violet-200"
              />
              <span className="text-sm font-medium text-gray-700 hidden sm:block">
                {user?.fullName || user?.name || user?.username}
              </span>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </button>

            {userMenuOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setUserMenuOpen(false)} />
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-20">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">{user?.fullName || user?.username}</p>
                    <p className="text-xs text-gray-500 capitalize">{role}</p>
                  </div>
                  <Link
                    to="/"
                    onClick={() => setUserMenuOpen(false)}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <Home className="w-4 h-4" />
                    Về trang chủ
                  </Link>
                  <div className="my-1 border-t border-gray-100" />
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Đăng xuất
                  </button>
                </div>
              </>
            )}
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
