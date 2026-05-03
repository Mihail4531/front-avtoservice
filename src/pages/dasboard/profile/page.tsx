'use client';

import { useState } from 'react';
import { useSessionStore } from '@/entities/session/model/store';
import { SecurityTab } from '@/features/change-me-password/ui/ChangeMePasword';
import { ProfileForm } from '@/features/update-me-profile/ui/EditProfileForm';
import { Button } from '@/shared/ui/button';
import { Modal } from '@/shared/ui/modal';
import { cn } from '@/shared/lib/cn';
import { Edit2, Mail, User as UserIcon, Shield, Calendar } from 'lucide-react';

export const ProfilePage = () => {
    const { user } = useSessionStore();
    const [activeTab, setActiveTab] = useState<'personal' | 'security'>('personal');
    const [isModalOpen, setIsModalOpen] = useState(false);

    if (!user) return null;

    const [firstName, lastName] = user.full_name.split(' ');

    return (
        <div className="p-8 max-w-5xl mx-auto space-y-8">
            {/* Header Card */}
            <div className="bg-background rounded-2xl border border-border p-8 shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-6">
                    <div className="h-20 w-20 rounded-full bg-[var(--red)] flex items-center justify-center text-white text-2xl font-bold shadow-xl shadow-red-100">
                        {user.full_name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">{user.full_name}</h1>
                        <p className="text-muted-foreground text-sm font-medium">{user.email}</p>
                        <div className="flex gap-2 mt-2">
                            <span className="px-2.5 py-0.5 rounded-full bg-red-50 text-[var(--red)] text-[10px] font-bold uppercase border border-red-100">{user.role}</span>
                            <span className="px-2.5 py-0.5 rounded-full bg-green-50 text-green-600 text-[10px] font-bold uppercase border border-green-100">Активен</span>
                        </div>
                    </div>
                </div>

                <Button
                    variant="outline"
                    className="gap-2 font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                    onClick={() => setIsModalOpen(true)}
                >
                    <Edit2 className="w-4 h-4" /> Редактировать
                </Button>
            </div>

            {/* Tabs Navigation */}
            <div className="flex gap-8 border-b border-border px-4">
                {[
                    { id: 'personal', label: 'Личные данные' },
                    { id: 'security', label: 'Безопасность' }
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={cn(
                            "pb-4 text-sm font-bold transition-all relative",
                            activeTab === tab.id ? "text-[var(--red)]" : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        {tab.label}
                        {activeTab === tab.id && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[var(--red)] rounded-full animate-in fade-in zoom-in-95" />}
                    </button>
                ))}
            </div>

            {/* Content Section */}
            <div className="min-h-[400px]">
                {activeTab === 'personal' ? (
                    <div className="bg-background rounded-2xl border border-border shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-2">
                        <div className="p-6 border-b border-border bg-slate-50/50 dark:bg-slate-800/50 font-bold text-foreground">
                            <span>Контактная информация</span>
                        </div>

                        <div className="p-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                                <DataRow label="Имя" value={firstName} icon={UserIcon} />
                                <DataRow label="Фамилия" value={lastName} icon={UserIcon} />
                                <DataRow label="Email адрес" value={user.email} icon={Mail} />
                                <DataRow label="Должность" value={user.role} icon={Shield} />
                                <DataRow label="Дата регистрации" value={new Date(user.created_at).toLocaleDateString('ru-RU')} icon={Calendar} />
                                <DataRow label="Телефон" value="+7 (910) 123-45-67" icon={Mail} />
                            </div>
                        </div>
                    </div>
                ) : (
                    <SecurityTab />
                )}
            </div>

            {/* Модальное окно редактирования профиля */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Редактирование профиля"
            >
                <ProfileForm
                    initialData={{ full_name: user.full_name, email: user.email }}
                    onSuccess={() => setIsModalOpen(false)}
                />
            </Modal>
        </div>
    );
};

const DataRow = ({ label, value, icon: Icon }: { label: string; value: string; icon: any }) => (
    <div className="flex items-start gap-4 group">
        <div className="mt-1 p-2 bg-slate-50 dark:bg-slate-800 rounded-lg group-hover:bg-red-50 dark:group-hover:bg-red-900/20 transition-colors">
            <Icon className="w-4 h-4 text-slate-400 group-hover:text-[var(--red)]" />
        </div>
        <div className="space-y-0.5">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none">{label}</span>
            <p className="text-base font-semibold text-foreground">{value || '—'}</p>
        </div>
    </div>
);