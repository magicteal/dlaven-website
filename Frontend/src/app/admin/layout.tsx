export const metadata = {
  title: "Admin • D’ LAVÉN",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen grid grid-cols-[220px_1fr]">
      <aside className="hidden md:flex flex-col border-r border-black/10 p-4 gap-2">
        <div className="text-xs uppercase tracking-wider text-black/70">Admin</div>
        <a href="/admin/profile" className="text-sm hover:underline">Profile</a>
        <a href="/admin/users" className="text-sm hover:underline">Users</a>
        <a href="/admin/settings" className="text-sm hover:underline">Settings</a>
        {/* Add more admin sections here */}
      </aside>
      <main className="p-4 sm:p-6">{children}</main>
    </div>
  );
}
