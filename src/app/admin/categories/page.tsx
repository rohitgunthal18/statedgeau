"use client";

import { useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  FolderOpen,
  Eye,
  FileText,
  Palette,
  Hash
} from 'lucide-react';

// Mock data - In real app, this would come from API
const mockCategories = [
  {
    id: '1',
    name: 'AFL Betting',
    slug: 'afl-betting',
    description: 'Expert AFL betting tips, analysis, and predictions for all matches and markets.',
    sport_type: 'afl',
    color: '#ff6b35',
    icon: '🏈',
    post_count: 12,
    seo_title: 'AFL Betting Tips and Analysis',
    seo_description: 'Get expert AFL betting tips, match analysis, and predictions for all AFL matches and betting markets.'
  },
  {
    id: '2',
    name: 'NRL Betting',
    slug: 'nrl-betting',
    description: 'Comprehensive NRL betting analysis, tips, and weekly previews.',
    sport_type: 'nrl',
    color: '#1976d2',
    icon: '🏈',
    post_count: 8,
    seo_title: 'NRL Betting Analysis and Tips',
    seo_description: 'Complete NRL betting analysis with weekly previews, tips, and expert predictions.'
  },
  {
    id: '3',
    name: 'Horse Racing',
    slug: 'horse-racing',
    description: 'Horse racing tips, form analysis, and major race previews.',
    sport_type: 'racing',
    color: '#00c853',
    icon: '🏇',
    post_count: 15,
    seo_title: 'Horse Racing Tips and Form Analysis',
    seo_description: 'Expert horse racing tips, form analysis, and previews for major races including Melbourne Cup.'
  },
  {
    id: '4',
    name: 'Cricket Betting',
    slug: 'cricket-betting',
    description: 'Cricket betting insights for BBL, international matches, and more.',
    sport_type: 'cricket',
    color: '#388e3c',
    icon: '🏏',
    post_count: 6,
    seo_title: 'Cricket Betting Tips and Analysis',
    seo_description: 'Cricket betting insights for BBL, international matches, and comprehensive analysis.'
  }
];

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  sport_type: string;
  color: string;
  icon: string;
  post_count: number;
  seo_title?: string;
  seo_description?: string;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>(mockCategories);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [showForm, setShowForm] = useState(false);

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setShowForm(true);
  };

  const handleDelete = (categoryId: string) => {
    if (confirm('Are you sure you want to delete this category? This action cannot be undone.')) {
      setCategories(prev => prev.filter(cat => cat.id !== categoryId));
    }
  };

  const handleSave = (categoryData: Category) => {
    if (editingCategory) {
      // Update existing category
      setCategories(prev => prev.map(cat => 
        cat.id === editingCategory.id ? { ...categoryData, id: cat.id } : cat
      ));
    } else {
      // Create new category
      const newCategory = {
        ...categoryData,
        id: Date.now().toString(),
        post_count: 0
      };
      setCategories(prev => [...prev, newCategory]);
    }
    
    setEditingCategory(null);
    setShowForm(false);
  };

  const handleCancel = () => {
    setEditingCategory(null);
    setShowForm(false);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
            <p className="text-gray-600">Manage blog categories and their SEO settings.</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center gap-2 bg-navy text-white px-4 py-2 rounded-lg hover:bg-navy/90 transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Category
          </button>
        </div>

        {/* Search */}
        <div className="bg-white rounded-xl p-4 lg:p-6 shadow-sm border border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy/20 focus:border-navy transition-colors"
            />
          </div>
        </div>

        {/* Category Form */}
        {showForm && (
          <CategoryForm
            category={editingCategory}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        )}

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCategories.map((category) => (
            <div key={category.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl"
                    style={{ backgroundColor: category.color + '20' }}
                  >
                    {category.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{category.name}</h3>
                    <p className="text-sm text-gray-500">{category.sport_type}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleEdit(category)}
                    className="p-1 text-gray-400 hover:text-navy transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(category.id)}
                    className="p-1 text-gray-400 hover:text-coral transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Description */}
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {category.description}
              </p>

              {/* Stats */}
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-gray-500">
                  <FileText className="w-4 h-4" />
                  <span>{category.post_count} posts</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">Slug:</span>
                  <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                    {category.slug}
                  </code>
                </div>
              </div>

              {/* SEO Info */}
              {category.seo_title && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                    <Hash className="w-3 h-3" />
                    <span>SEO Title</span>
                  </div>
                  <p className="text-xs text-gray-700 line-clamp-1">
                    {category.seo_title}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {filteredCategories.length === 0 && (
          <div className="text-center py-12">
            <FolderOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No categories found</h3>
            <p className="text-gray-600">Try adjusting your search or create a new category.</p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

// Category Form Component
interface CategoryFormProps {
  category?: Category | null;
  onSave: (category: Category) => void;
  onCancel: () => void;
}

function CategoryForm({ category, onSave, onCancel }: CategoryFormProps) {
  const [formData, setFormData] = useState<Category>({
    id: '',
    name: category?.name || '',
    slug: category?.slug || '',
    description: category?.description || '',
    sport_type: category?.sport_type || '',
    color: category?.color || '#3b82f6',
    icon: category?.icon || '🏈',
    post_count: category?.post_count || 0,
    seo_title: category?.seo_title || '',
    seo_description: category?.seo_description || ''
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
        {category ? 'Edit Category' : 'New Category'}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category Name *
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
                placeholder="e.g., AFL Betting"
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
                placeholder="afl"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sport Type *
              </label>
              <select
                value={formData.sport_type}
                onChange={(e) => setFormData(prev => ({ ...prev, sport_type: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy/20 focus:border-navy transition-colors"
                required
              >
                <option value="">Select sport type</option>
                <option value="afl">AFL</option>
                <option value="nrl">NRL</option>
                <option value="racing">Horse Racing</option>
                <option value="cricket">Cricket</option>
                <option value="soccer">Soccer</option>
                <option value="tennis">Tennis</option>
                <option value="basketball">Basketball</option>
                <option value="multi">Multi-Sport</option>
              </select>
            </div>
          </div>

          {/* Visual Settings */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Color *
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={formData.color}
                  onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                  className="w-12 h-10 border border-gray-300 rounded-lg cursor-pointer"
                />
                <input
                  type="text"
                  value={formData.color}
                  onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy/20 focus:border-navy transition-colors"
                  placeholder="#3b82f6"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Icon *
              </label>
              <input
                type="text"
                value={formData.icon}
                onChange={(e) => setFormData(prev => ({ ...prev, icon: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy/20 focus:border-navy transition-colors"
                placeholder="🏈"
                maxLength={2}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy/20 focus:border-navy transition-colors"
                placeholder="Brief description of this category..."
              />
            </div>
          </div>
        </div>

        {/* SEO Settings */}
        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-md font-medium text-gray-900 mb-4">SEO Settings</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                SEO Title
              </label>
              <input
                type="text"
                value={formData.seo_title}
                onChange={(e) => setFormData(prev => ({ ...prev, seo_title: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy/20 focus:border-navy transition-colors"
                placeholder="SEO optimized title..."
                maxLength={60}
              />
              <div className="mt-1 text-xs text-gray-500">
                {(formData.seo_title || '').length}/60 characters
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                SEO Description
              </label>
              <textarea
                value={formData.seo_description}
                onChange={(e) => setFormData(prev => ({ ...prev, seo_description: e.target.value }))}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy/20 focus:border-navy transition-colors"
                placeholder="SEO description for search engines..."
                maxLength={160}
              />
              <div className="mt-1 text-xs text-gray-500">
                {(formData.seo_description || '').length}/160 characters
              </div>
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
            {category ? 'Update Category' : 'Create Category'}
          </button>
        </div>
      </form>
    </div>
  );
} 