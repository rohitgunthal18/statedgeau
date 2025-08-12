"use client";

import { useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Tag,
  FileText,
  Hash,
  TrendingUp
} from 'lucide-react';

// Mock data - In real app, this would come from API
const mockTags: Tag[] = [
  {
    id: '1',
    name: 'AFL Tips',
    slug: 'afl-tips',
    post_count: 8,
    usage_trend: 'increasing' as const
  },
  {
    id: '2',
    name: 'NRL Analysis',
    slug: 'nrl-analysis',
    post_count: 5,
    usage_trend: 'stable' as const
  },
  {
    id: '3',
    name: 'Horse Racing',
    slug: 'horse-racing',
    post_count: 12,
    usage_trend: 'increasing' as const
  },
  {
    id: '4',
    name: 'Multi Bets',
    slug: 'multi-bets',
    post_count: 6,
    usage_trend: 'stable' as const
  },
  {
    id: '5',
    name: 'Live Betting',
    slug: 'live-betting',
    post_count: 3,
    usage_trend: 'decreasing' as const
  },
  {
    id: '6',
    name: 'Player Props',
    slug: 'player-props',
    post_count: 4,
    usage_trend: 'increasing' as const
  },
  {
    id: '7',
    name: 'Same Game Multi',
    slug: 'same-game-multi',
    post_count: 7,
    usage_trend: 'increasing' as const
  },
  {
    id: '8',
    name: 'Futures Betting',
    slug: 'futures-betting',
    post_count: 2,
    usage_trend: 'stable' as const
  }
];

interface Tag {
  id: string;
  name: string;
  slug: string;
  post_count: number;
  usage_trend: 'increasing' | 'stable' | 'decreasing';
}

const trendColors = {
  increasing: 'text-emerald',
  stable: 'text-golden',
  decreasing: 'text-coral'
};

const trendIcons = {
  increasing: TrendingUp,
  stable: Tag,
  decreasing: TrendingUp
};

export default function TagsPage() {
  const [tags, setTags] = useState<Tag[]>(mockTags);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingTag, setEditingTag] = useState<Tag | null>(null);
  const [showForm, setShowForm] = useState(false);

  const filteredTags = tags.filter(tag =>
    tag.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tag.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (tag: Tag) => {
    setEditingTag(tag);
    setShowForm(true);
  };

  const handleDelete = (tagId: string) => {
    if (confirm('Are you sure you want to delete this tag? This action cannot be undone.')) {
      setTags(prev => prev.filter(tag => tag.id !== tagId));
    }
  };

  const handleSave = (tagData: Omit<Tag, 'id' | 'post_count' | 'usage_trend'>) => {
    if (editingTag) {
      // Update existing tag
      setTags(prev => prev.map(tag => 
        tag.id === editingTag.id ? { ...tag, ...tagData } : tag
      ));
    } else {
      // Create new tag
      const newTag: Tag = {
        ...tagData,
        id: Date.now().toString(),
        post_count: 0,
        usage_trend: 'stable'
      };
      setTags(prev => [...prev, newTag]);
    }
    
    setEditingTag(null);
    setShowForm(false);
  };

  const handleCancel = () => {
    setEditingTag(null);
    setShowForm(false);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Tags</h1>
            <p className="text-gray-600">Manage blog tags for better content organization.</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center gap-2 bg-navy text-white px-4 py-2 rounded-lg hover:bg-navy/90 transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Tag
          </button>
        </div>

        {/* Search */}
        <div className="bg-white rounded-xl p-4 lg:p-6 shadow-sm border border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy/20 focus:border-navy transition-colors"
            />
          </div>
        </div>

        {/* Tag Form */}
        {showForm && (
          <TagForm
            tag={editingTag}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        )}

        {/* Tags Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTags.map((tag) => {
            const TrendIcon = trendIcons[tag.usage_trend];
            return (
              <div key={tag.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-navy/10 rounded-lg flex items-center justify-center">
                      <Tag className="w-5 h-5 text-navy" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{tag.name}</h3>
                      <p className="text-sm text-gray-500">{tag.slug}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEdit(tag)}
                      className="p-1 text-gray-400 hover:text-navy transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(tag.id)}
                      className="p-1 text-gray-400 hover:text-coral transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Stats */}
                <div className="flex items-center justify-between text-sm mb-4">
                  <div className="flex items-center gap-2 text-gray-500">
                    <FileText className="w-4 h-4" />
                    <span>{tag.post_count} posts</span>
                  </div>
                  <div className={`flex items-center gap-1 ${trendColors[tag.usage_trend]}`}>
                    <TrendIcon className="w-4 h-4" />
                    <span className="text-xs capitalize">{tag.usage_trend}</span>
                  </div>
                </div>

                {/* Usage Bar */}
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-navy h-2 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min((tag.post_count / 15) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredTags.length === 0 && (
          <div className="text-center py-12">
            <Tag className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No tags found</h3>
            <p className="text-gray-600">Try adjusting your search or create a new tag.</p>
          </div>
        )}

        {/* Tags Summary */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Tags Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-navy">{tags.length}</div>
              <div className="text-sm text-gray-600">Total Tags</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-emerald">
                {tags.filter(tag => tag.usage_trend === 'increasing').length}
              </div>
              <div className="text-sm text-gray-600">Growing</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-golden">
                {tags.reduce((sum, tag) => sum + tag.post_count, 0)}
              </div>
              <div className="text-sm text-gray-600">Total Usage</div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

// Tag Form Component
interface TagFormProps {
  tag?: Tag | null;
  onSave: (tag: Omit<Tag, 'id' | 'post_count' | 'usage_trend'>) => void;
  onCancel: () => void;
}

function TagForm({ tag, onSave, onCancel }: TagFormProps) {
  const [formData, setFormData] = useState({
    name: tag?.name || '',
    slug: tag?.slug || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
      <h2 className="text-lg font-semibold text-gray-900 mb-6">
        {tag ? 'Edit Tag' : 'New Tag'}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tag Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => {
                setFormData(prev => ({
                  ...prev,
                  name: e.target.value,
                  slug: generateSlug(e.target.value)
                }));
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy/20 focus:border-navy transition-colors"
              placeholder="e.g., AFL Tips"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Slug *
            </label>
            <input
              type="text"
              value={formData.slug}
              onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy/20 focus:border-navy transition-colors"
              placeholder="afl-tips"
              required
            />
            <div className="mt-1 text-xs text-gray-500">
              URL: /tags/{formData.slug}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-navy text-white rounded-lg hover:bg-navy/90 transition-colors"
          >
            {tag ? 'Update Tag' : 'Create Tag'}
          </button>
        </div>
      </form>
    </div>
  );
} 