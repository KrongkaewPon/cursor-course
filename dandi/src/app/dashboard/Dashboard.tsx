'use client';

import { useState } from 'react';
import { Plus, Info, Eye, Copy, Edit, Trash2, Github, Twitter, Mail, Moon, Check } from 'lucide-react';
import { Toast } from '@/components/Toast';
import { useApiKeys, ApiKey } from '@/hooks/useApiKeys';

export default function Dashboard() {
  const {
    apiKeys,
    loading,
    createApiKey,
    updateApiKey,
    deleteApiKey,
  } = useApiKeys();

  const [revealedKey, setRevealedKey] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [limitUsage, setLimitUsage] = useState(false);
  const [usageLimit, setUsageLimit] = useState('1000');

  // State for editing
  const [editingKey, setEditingKey] = useState<ApiKey | null>(null);
  const [editKeyName, setEditKeyName] = useState('');
  const [editLimitUsage, setEditLimitUsage] = useState(false);
  const [editUsageLimit, setEditUsageLimit] = useState('');

  // State for deleting
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<ApiKey | null>(null);

  // State for copying and toast
  const [copiedKeyId, setCopiedKeyId] = useState<string | null>(null);
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');

  const handleReveal = (id: string) => {
    setRevealedKey(revealedKey === id ? null : id);
  };

  const handleCopyKey = async (apiKey: ApiKey) => {
    try {
      await navigator.clipboard.writeText(apiKey.api_key);
      setCopiedKeyId(apiKey.id);
      setToastMessage('Copied API Key to clipboard');
      setToastType('success');
      setToastOpen(true);
      setTimeout(() => {
        setCopiedKeyId(null);
        setToastOpen(false);
      }, 1500);
    } catch (err) {
      alert('Failed to copy!');
    }
  };

  const handleCreateKey = async () => {
    if (!newKeyName.trim()) return;
    const data = await createApiKey(newKeyName, limitUsage ? parseInt(usageLimit, 10) : undefined);
    if (data) {
      setShowCreateModal(false);
      setNewKeyName('');
      setLimitUsage(false);
      setUsageLimit('1000');
      setToastMessage('API Key created successfully');
      setToastType('success');
      setToastOpen(true);
    }
  };

  const handleStartEdit = (key: ApiKey) => {
    setEditingKey(key);
    setEditKeyName(key.name);
    setEditLimitUsage(!!key.limit);
    setEditUsageLimit(key.limit ? String(key.limit) : '1000');
  };

  const handleUpdateKey = async () => {
    if (!editingKey || !editKeyName.trim()) return;
    const data = await updateApiKey(editingKey.id, editKeyName, editLimitUsage ? parseInt(editUsageLimit, 10) : undefined);
    if (data) {
      setEditingKey(null);
      setToastMessage('API Key updated successfully');
      setToastType('success');
      setToastOpen(true);
    }
  };

  const handleDeleteKey = async () => {
    if (!showDeleteConfirm) return;
    const ok = await deleteApiKey(showDeleteConfirm.id);
    if (ok) {
      setShowDeleteConfirm(null);
      setToastMessage('API Key deleted successfully');
      setToastType('error');
      setToastOpen(true);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div>
      <Toast message={toastMessage} open={toastOpen} onClose={() => setToastOpen(false)} type={toastType} />
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <p className="text-gray-500 text-sm">Pages / Overview</p>
          <h2 className="text-3xl font-bold">Overview</h2>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-full px-3 py-1 text-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            Operational
          </div>
          <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-full p-2">
            <a href="#" className="text-gray-500 hover:text-gray-800"><Github size={16} /></a>
            <a href="#" className="text-gray-500 hover:text-gray-800"><Twitter size={16} /></a>
            <a href="#" className="text-gray-500 hover:text-gray-800"><Mail size={16} /></a>
          </div>
          <button className="bg-white border border-gray-200 rounded-full p-2 text-gray-500 hover:text-gray-800">
            <Moon size={16} />
          </button>
        </div>
      </div>

      {/* Current Plan Card */}
      <div className="bg-gradient-to-br from-purple-600 to-pink-500 text-white p-8 rounded-2xl mb-8">
        <div className="flex justify-between items-center mb-4">
          <span className="bg-black/20 text-xs font-semibold px-2 py-1 rounded-full">CURRENT PLAN</span>
          <button className="bg-white/20 hover:bg-white/30 text-sm font-semibold px-4 py-2 rounded-lg flex items-center gap-2">
            Manage Plan
          </button>
        </div>
        <h3 className="text-4xl font-bold mb-4">Researcher</h3>
        <div className="flex items-center gap-2 text-sm mb-2">
          <span>API Limit</span>
          <Info size={14} />
        </div>
        <div className="w-full bg-white/30 rounded-full h-2.5">
          <div className="bg-white h-2.5 rounded-full" style={{ width: '2.4%' }}></div>
        </div>
        <p className="text-sm mt-2">24 / 1,000 Requests</p>
      </div>

      {/* API Keys Section */}
      <div className="bg-white p-8 rounded-2xl border border-gray-200">
        <div className="flex items-center gap-2 mb-2">
          <h3 className="text-xl font-bold">API Keys</h3>
          <button 
            onClick={() => setShowCreateModal(true)}
            className="bg-gray-100 hover:bg-gray-200 rounded-full p-1.5"
          >
            <Plus size={16} />
          </button>
        </div>
        <p className="text-gray-500 text-sm mb-6">
          The key is used to authenticate your requests to the <a href="#" className="text-purple-600 underline">Research API</a>. To learn more, see the <a href="#" className="text-purple-600 underline">documentation page</a>.
        </p>
        <div>
          <div className="grid grid-cols-[3fr_1fr_4fr_2fr] gap-4 text-xs text-gray-400 uppercase font-semibold px-4 mb-4">
            <span>Name</span>
            <span>Usage</span>
            <span>Key</span>
            <span>Options</span>
          </div>
          <div className="space-y-2">
            {apiKeys.map(apiKey => (
              <div key={apiKey.id} className="grid grid-cols-[3fr_1fr_4fr_2fr] gap-4 items-center bg-gray-50/50 hover:bg-gray-100/80 px-4 py-3 rounded-lg border border-gray-100">
                <span className="font-mono text-sm">{apiKey.name}</span>
                <span className="font-mono text-sm">{apiKey.usage}</span>
                <div className="font-mono text-sm bg-gray-200/60 px-2 py-1 rounded w-full truncate">
                  {revealedKey === apiKey.id ? apiKey.api_key : 'tvly-********************'}
                </div>
                <div className="flex items-center gap-3 text-gray-500">
                  <button onClick={() => handleReveal(apiKey.id)} className="hover:text-gray-800">
                    <Eye size={16} />
                  </button>
                  <button onClick={() => handleCopyKey(apiKey)} className={copiedKeyId === apiKey.id ? 'text-green-600' : 'hover:text-gray-800'}>
                    {copiedKeyId === apiKey.id ? <Check size={16} /> : <Copy size={16} />}
                  </button>
                  <button onClick={() => handleStartEdit(apiKey)} className="hover:text-gray-800">
                    <Edit size={16} />
                  </button>
                  <button onClick={() => setShowDeleteConfirm(apiKey)} className="hover:text-red-500">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Create API Key Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
            <h2 className="text-2xl font-bold mb-2">Create a new API key</h2>
            <p className="text-gray-500 mb-6">Enter a name and limit for the new API key.</p>
            <div className="space-y-4">
              <div>
                <label htmlFor="keyName" className="block text-sm font-medium text-gray-700">
                  Key Name — <span className="text-gray-500">A unique name to identify this key</span>
                </label>
                <input
                  type="text"
                  id="keyName"
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                  placeholder="Key Name"
                  className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={limitUsage}
                    onChange={(e) => setLimitUsage(e.target.checked)}
                    className="h-4 w-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Limit monthly usage*</span>
                </label>
                <input
                  type="number"
                  value={usageLimit}
                  onChange={(e) => setUsageLimit(e.target.value)}
                  disabled={!limitUsage}
                  className="mt-2 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm disabled:bg-gray-50 disabled:text-gray-500 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                />
              </div>
              <p className="text-xs text-gray-500">
                *If the combined usage of all your keys exceeds your plan's limit, all requests will be rejected.
              </p>
            </div>
            <div className="flex justify-end gap-4 mt-8">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateKey}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                disabled={!newKeyName.trim()}
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit API Key Modal */}
      {editingKey && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
            <h2 className="text-2xl font-bold mb-2">Edit API key</h2>
            <p className="text-gray-500 mb-6">Update the name and usage limit for your key.</p>
            <div className="space-y-4">
              <div>
                <label htmlFor="editKeyName" className="block text-sm font-medium text-gray-700">
                  Key Name
                </label>
                <input
                  type="text"
                  id="editKeyName"
                  value={editKeyName}
                  onChange={(e) => setEditKeyName(e.target.value)}
                  placeholder="Key Name"
                  className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={editLimitUsage}
                    onChange={(e) => setEditLimitUsage(e.target.checked)}
                    className="h-4 w-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Limit monthly usage*</span>
                </label>
                <input
                  type="number"
                  value={editUsageLimit}
                  onChange={(e) => setEditUsageLimit(e.target.value)}
                  disabled={!editLimitUsage}
                  className="mt-2 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm disabled:bg-gray-50 disabled:text-gray-500 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                />
              </div>
            </div>
            <div className="flex justify-end gap-4 mt-8">
              <button
                onClick={() => setEditingKey(null)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateKey}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                disabled={!editKeyName.trim()}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
            <h2 className="text-2xl font-bold mb-2">Delete API Key</h2>
            <p className="text-gray-500 mb-6">
              Are you sure you want to delete the key "{showDeleteConfirm.name}"? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-4 mt-8">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteKey}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 