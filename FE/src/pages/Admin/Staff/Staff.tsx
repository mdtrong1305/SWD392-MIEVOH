import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { UserRound, Plus, Pencil, Trash2, MapPin, Search, Phone } from 'lucide-react';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import {
    getStaffApi,
    createStaffApi,
    updateStaffApi,
    deleteStaffApi,
    getCinemaComplexesApi,
    type Staff as StaffType,
    type CinemaComplex,
} from '../../../axios/admin';

interface StaffForm {
    email: string;
    fullName: string;
    phoneNumber: string;
    password: string;
    cinemaComplexId: string;
}

const emptyForm: StaffForm = {
    email: '',
    fullName: '',
    phoneNumber: '',
    password: '',
    cinemaComplexId: '',
};

export default function Staff() {
    const [staffList, setStaffList] = useState<StaffType[]>([]);
    const [complexes, setComplexes] = useState<CinemaComplex[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState<StaffType | null>(null);
    const [form, setForm] = useState<StaffForm>(emptyForm);
    const [saving, setSaving] = useState(false);

    const [confirmOpen, setConfirmOpen] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState<StaffType | null>(null);
    const [deleting, setDeleting] = useState(false);

    const loadComplexes = async () => {
        try {
            const res = await getCinemaComplexesApi();
            setComplexes(res.data || []);
        } catch {
            toast.error('Không tải được danh sách cụm rạp');
        }
    };

    const loadStaff = async () => {
        setLoading(true);
        try {
            const res = await getStaffApi();
            setStaffList(res.data || []);
        } catch {
            toast.error('Không tải được danh sách nhân viên');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadComplexes();
        loadStaff();
    }, []);

    const openCreate = () => {
        setEditing(null);
        setForm({ ...emptyForm, cinemaComplexId: complexes[0]?.cinemaComplexId || '' });
        setModalOpen(true);
    };

    const openEdit = (item: StaffType) => {
        setEditing(item);
        setForm({
            email: item.email || '',
            fullName: item.fullName || '',
            phoneNumber: item.phoneNumber || '',
            password: '',
            cinemaComplexId: item.cinemaComplexId || '',
        });
        setModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editing && !form.email.trim()) {
            toast.error('Vui lòng nhập email đăng nhập');
            return;
        }
        if (!form.fullName.trim()) {
            toast.error('Vui lòng nhập họ tên nhân viên');
            return;
        }
        if (!editing && form.password.length < 6) {
            toast.error('Mật khẩu phải có ít nhất 6 ký tự');
            return;
        }
        if (form.password && form.password.length < 6) {
            toast.error('Mật khẩu phải có ít nhất 6 ký tự');
            return;
        }
        if (!form.cinemaComplexId) {
            toast.error('Vui lòng chọn cụm rạp phụ trách');
            return;
        }
        setSaving(true);
        try {
            if (editing) {
                await updateStaffApi(editing.email, {
                    fullName: form.fullName.trim(),
                    phoneNumber: form.phoneNumber.trim() || undefined,
                    password: form.password ? form.password : undefined,
                    cinemaComplexId: form.cinemaComplexId,
                });
                toast.success('Cập nhật nhân viên thành công');
            } else {
                await createStaffApi({
                    email: form.email.trim(),
                    fullName: form.fullName.trim(),
                    phoneNumber: form.phoneNumber.trim() || undefined,
                    password: form.password,
                    cinemaComplexId: form.cinemaComplexId,
                });
                toast.success('Thêm nhân viên thành công');
            }
            setModalOpen(false);
            loadStaff();
        } catch (err: any) {
            toast.error(err?.response?.data?.message || 'Lưu nhân viên thất bại');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!deleteTarget) return;
        setDeleting(true);
        try {
            await deleteStaffApi(deleteTarget.email);
            toast.success('Đã xóa nhân viên');
            setConfirmOpen(false);
            setDeleteTarget(null);
            loadStaff();
        } catch {
            toast.error('Xóa nhân viên thất bại');
        } finally {
            setDeleting(false);
        }
    };

    const complexName = (id: string | null) =>
        complexes.find((c) => c.cinemaComplexId === id)?.name || '—';

    const filtered = staffList.filter(
        (s) =>
            !search.trim() ||
            (s.email || '').toLowerCase().includes(search.toLowerCase()) ||
            (s.fullName || '').toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div>
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Quản lý nhân viên</h1>
                    <p className="text-sm text-gray-500 mt-1">Tạo và phân công nhân viên (staff) cho từng cụm rạp</p>
                </div>
                <button
                    onClick={openCreate}
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-violet-600 text-white text-sm font-medium rounded-lg hover:bg-violet-700 transition-colors shadow-sm shadow-violet-300"
                >
                    <Plus className="w-4 h-4" />
                    Thêm nhân viên
                </button>
            </div>

            {/* Filters */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center mb-5">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Tìm theo email hoặc họ tên..."
                        className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                    />
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                {loading ? (
                    <div className="p-12 text-center text-gray-400">Đang tải...</div>
                ) : filtered.length === 0 ? (
                    <div className="p-12 text-center">
                        <UserRound className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500">Chưa có nhân viên nào</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="text-left text-gray-500 border-b border-gray-100 bg-gray-50/50">
                                    <th className="px-6 py-3 font-medium">Email đăng nhập</th>
                                    <th className="px-6 py-3 font-medium">Họ tên</th>
                                    <th className="px-6 py-3 font-medium">Số điện thoại</th>
                                    <th className="px-6 py-3 font-medium">Cụm rạp phụ trách</th>
                                    <th className="px-6 py-3 font-medium text-right">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {filtered.map((item) => (
                                    <tr key={item.email} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-3 font-medium text-gray-900">{item.email}</td>
                                        <td className="px-6 py-3 text-gray-700">{item.fullName || '—'}</td>
                                        <td className="px-6 py-3 text-gray-600">
                                            <div className="flex flex-col gap-0.5">
                                                {item.phoneNumber && (
                                                    <span className="inline-flex items-center gap-1.5">
                                                        <Phone className="w-3.5 h-3.5 text-gray-400" />
                                                        {item.phoneNumber}
                                                    </span>
                                                )}
                                                {!item.phoneNumber && '—'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-3">
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-violet-50 text-violet-700 text-xs font-medium">
                                                <MapPin className="w-3 h-3" />
                                                {complexName(item.cinemaComplexId)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-3">
                                            <div className="flex items-center justify-end gap-1">
                                                <button
                                                    onClick={() => openEdit(item)}
                                                    className="p-2 rounded-lg text-gray-400 hover:bg-violet-50 hover:text-violet-600 transition-colors"
                                                    title="Sửa"
                                                >
                                                    <Pencil className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setDeleteTarget(item);
                                                        setConfirmOpen(true);
                                                    }}
                                                    className="p-2 rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                                                    title="Xóa"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Create/Edit Modal */}
            <Modal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                title={editing ? 'Chỉnh sửa nhân viên' : 'Thêm nhân viên'}
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            Email đăng nhập <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="email"
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                            disabled={!!editing}
                            placeholder="VD: staff01@cinema.com"
                            className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent disabled:bg-gray-100 disabled:text-gray-500"
                        />
                        {editing && (
                            <p className="text-xs text-gray-400 mt-1">Không thể thay đổi email đăng nhập.</p>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            Họ tên <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={form.fullName}
                            onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                            placeholder="VD: Nguyễn Văn A"
                            className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Số điện thoại</label>
                        <input
                            type="text"
                            value={form.phoneNumber}
                            onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })}
                            placeholder="VD: 0901234567"
                            className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            Mật khẩu {editing ? '' : <span className="text-red-500">*</span>}
                        </label>
                        <input
                            type="password"
                            value={form.password}
                            onChange={(e) => setForm({ ...form, password: e.target.value })}
                            placeholder={editing ? 'Để trống nếu không đổi mật khẩu' : 'Tối thiểu 6 ký tự'}
                            className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            Cụm rạp phụ trách <span className="text-red-500">*</span>
                        </label>
                        <select
                            value={form.cinemaComplexId}
                            onChange={(e) => setForm({ ...form, cinemaComplexId: e.target.value })}
                            className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent bg-white"
                        >
                            <option value="">-- Chọn cụm rạp --</option>
                            {complexes.map((c) => (
                                <option key={c.cinemaComplexId} value={c.cinemaComplexId}>
                                    {c.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="flex items-center justify-end gap-3 pt-2">
                        <button
                            type="button"
                            onClick={() => setModalOpen(false)}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            disabled={saving}
                            className="px-4 py-2 text-sm font-medium text-white bg-violet-600 rounded-lg hover:bg-violet-700 transition-colors disabled:opacity-50"
                        >
                            {saving ? 'Đang lưu...' : editing ? 'Cập nhật' : 'Thêm mới'}
                        </button>
                    </div>
                </form>
            </Modal>

            <ConfirmDialog
                isOpen={confirmOpen}
                onClose={() => setConfirmOpen(false)}
                onConfirm={handleDelete}
                title="Xóa nhân viên"
                message={`Bạn có chắc muốn xóa nhân viên "${deleteTarget?.fullName || deleteTarget?.email}"? Hành động này không thể hoàn tác.`}
                confirmText="Xóa"
                loading={deleting}
            />
        </div>
    );
}
