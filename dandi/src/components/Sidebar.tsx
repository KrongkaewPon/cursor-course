import Link from 'next/link';
import {
  LayoutDashboard,
  Bot,
  FileText,
  Code,
  CreditCard,
  FileQuestion,
  ExternalLink,
  User2,
} from 'lucide-react';

const menuItems = [
  { icon: <LayoutDashboard size={20} />, name: 'Overview', href: '/dashboard', active: true },
  { icon: <Bot size={20} />, name: 'Research Assistant', href: '#' },
  { icon: <FileText size={20} />, name: 'Research Reports', href: '#' },
  { icon: <Code size={20} />, name: 'API Playground', href: '/playground' },
  { icon: <CreditCard size={20} />, name: 'Invoices', href: '#' },
];

const helpItems = [
  { icon: <FileQuestion size={20} />, name: 'Documentation', href: '#', external: true },
];

export function Sidebar() {
  return (
    <aside className="w-64 flex-shrink-0 bg-white border-r border-gray-200 flex flex-col min-h-screen">
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-gray-200">
        <span className="text-2xl font-bold tracking-tight">Dandi <span className="font-normal">AI</span></span>
      </div>
      {/* Menu */}
      <nav className="flex-1 px-4 py-4 space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={`flex items-center gap-3 px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors ${
              item.active ? 'bg-gray-100 font-semibold' : ''
            }`}
          >
            {item.icon}
            <span>{item.name}</span>
          </Link>
        ))}
        <div className="pt-4 mt-4 border-t border-gray-200">
          {helpItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="flex items-center gap-3 px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100"
              target={item.external ? '_blank' : undefined}
              rel={item.external ? 'noopener noreferrer' : undefined}
            >
              {item.icon}
              <span>{item.name}</span>
              {item.external && <ExternalLink size={16} className="ml-auto" />}
            </Link>
          ))}
        </div>
      </nav>
      {/* User Profile */}
      <div className="mt-auto px-6 py-4 border-t border-gray-200 flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center">
          <User2 size={22} className="text-gray-500" />
        </div>
        <div className="flex-1">
          <div className="font-medium text-gray-900 text-sm leading-tight">Eden Marco</div>
        </div>
        <button className="text-gray-400 hover:text-gray-600">
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="1.5"/><circle cx="19.5" cy="12" r="1.5"/><circle cx="4.5" cy="12" r="1.5"/></svg>
        </button>
      </div>
    </aside>
  );
} 