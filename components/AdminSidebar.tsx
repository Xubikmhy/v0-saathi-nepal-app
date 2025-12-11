import Link from 'next/link';
import { LayoutDashboard, Users, FileText, Settings, UserCog, LogOut } from 'lucide-react';

const navItems = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/hosts', label: 'Hosts', icon: Users },
    { href: '/admin/blogs', label: 'Blogs', icon: FileText },
    { href: '/admin/settings', label: 'Settings', icon: Settings },
    { href: '/admin/users', label: 'Users', icon: UserCog },
];

export function AdminSidebar() {
    return (
        <aside className="hidden w-64 flex-col border-r bg-card lg:flex">
            <div className="flex h-16 items-center border-b px-6">
                <Link href="/" className="text-xl font-bold text-primary">
                    Admin
                </Link>
            </div>
            <nav className="flex-1 space-y-1 p-4">
                {navItems.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-primary/10 hover:text-primary"
                    >
                        <item.icon className="h-5 w-5" />
                        {item.label}
                    </Link>
                ))}
            </nav>
            <div className="border-t p-4">
                <Link
                    href="/auth/logout"
                    className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-destructive hover:bg-destructive/10"
                >
                    <LogOut className="h-5 w-5" />
                    Sign Out
                </Link>
            </div>
        </aside>
    );
}
