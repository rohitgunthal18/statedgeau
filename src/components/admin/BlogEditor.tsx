"use client";

import { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Save, 
  Globe, 
  Eye, 
  Upload, 
  Hash, 
  CheckCircle2, 
  AlertCircle, 
  Clock,
  X,
  Plus,
  Tag
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface BlogPost {
  id?: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  featured_image?: string;
  category_id?: string;
  status: 'draft' | 'published' | 'archived';
  seo_title?: string;
  seo_description?: string;
  tags: string[];
}

interface BlogEditorProps {
  post?: BlogPost;
  categories: Array<{ id: string; name: string; slug: string }>;
  tags: Array<{ id: string; name: string; slug: string }>;
  onSave: (post: BlogPost) => Promise<void>;
  onPreview?: (post: BlogPost) => void;
  className?: string;
}

const initialPost: BlogPost = {
  title: '',
  slug: '',
  content: '',
  excerpt: '',
  featured_image: '',
  category_id: '',
  status: 'draft',
  seo_title: '',
  seo_description: '',
  tags: [],
};

export function BlogEditor({ 
  post = initialPost, 
  categories = [], 
  tags = [], 
  onSave, 
  onPreview,
  className 
}: BlogEditorProps) {
  const [formData, setFormData] = useState<BlogPost>(post);
  const [isSaving, setIsSaving] = useState(false);
  const [autoSaveStatus, setAutoSaveStatus] = useState<'saved' | 'saving' | 'error' | null>(null);
  const [showSEO, setShowSEO] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [characterCount, setCharacterCount] = useState(0);
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout>();
  const editorRef = useRef<any>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Generate slug from title
  const generateSlug = useCallback((title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
      .substring(0, 60);
  }, []);

  // Initialize TinyMCE
  useEffect(() => {
    // Check if TinyMCE is already loaded
    if (typeof window !== 'undefined' && (window as any).tinymce) {
      initializeEditor();
      return;
    }

    // Load TinyMCE script
    const script = document.createElement('script');
    script.src = 'https://cdn.tiny.cloud/1/nqrkv4282pau4c1go84vv3v28wj7ugpmfj5tqavebdr8witn/tinymce/8/tinymce.min.js';
    script.referrerPolicy = 'origin';
    script.crossOrigin = 'anonymous';
    
    script.onload = () => {
      initializeEditor();
    };

    script.onerror = () => {
      console.error('Failed to load TinyMCE script');
    };

    document.head.appendChild(script);

    return () => {
      if (editorRef.current) {
        editorRef.current.destroy();
      }
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  const initializeEditor = () => {
    if (typeof window === 'undefined' || !(window as any).tinymce || !textareaRef.current) {
      return;
    }

    try {
      (window as any).tinymce.init({
        selector: '#content-editor',
        height: 400,
        menubar: false,
        plugins: [
          'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
          'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
          'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
        ],
        toolbar: 'undo redo | blocks | ' +
          'bold italic forecolor | alignleft aligncenter ' +
          'alignright alignjustify | bullist numlist outdent indent | ' +
          'removeformat | table | link image | code | help',
        content_style: 'body { font-family: -apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Oxygen,Ubuntu,Cantarell,Open Sans,Helvetica Neue,sans-serif; font-size: 14px }',
        table_toolbar: 'tableprops tabledelete | tableinsertrowbefore tableinsertrowafter tabledeleterow | tableinsertcolbefore tableinsertcolafter tabledeletecol',
        image_title: true,
        automatic_uploads: false,
        file_picker_types: 'image',
        images_upload_url: false,
        images_upload_handler: false,
        branding: false,
        promotion: false,
        elementpath: false,
        statusbar: false,
        resize: false,
        setup: (editor: any) => {
          editorRef.current = editor;
          editor.on('change', () => {
            const content = editor.getContent();
            handleInputChange('content', content);
          });
          editor.on('keyup', () => {
            const content = editor.getContent();
            handleInputChange('content', content);
          });
        },
        init_instance_callback: (editor: any) => {
          editor.setContent(formData.content);
        }
      });
    } catch (error) {
      console.error('Failed to initialize TinyMCE:', error);
    }
  };

  // Auto-save functionality
  const autoSave = useCallback(async () => {
    if (!formData.title || !formData.content) return;
    
    try {
      setAutoSaveStatus('saving');
      await onSave(formData);
      setAutoSaveStatus('saved');
      setTimeout(() => setAutoSaveStatus(null), 2000);
    } catch (error) {
      setAutoSaveStatus('error');
      setTimeout(() => setAutoSaveStatus(null), 3000);
    }
  }, [formData, onSave]);

  // Setup auto-save timer
  useEffect(() => {
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }
    
    if (formData.title && formData.content) {
      autoSaveTimeoutRef.current = setTimeout(autoSave, 30000); // 30 seconds
    }
    
    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, [formData, autoSave]);

  // Update word and character counts
  useEffect(() => {
    setCharacterCount(formData.title.length);
    setWordCount(formData.content.split(/\s+/).filter(word => word.length > 0).length);
  }, [formData.title, formData.content]);

  // Auto-generate slug when title changes
  useEffect(() => {
    if (formData.title && !formData.slug) {
      setFormData(prev => ({
        ...prev,
        slug: generateSlug(formData.title)
      }));
    }
  }, [formData.title, formData.slug, generateSlug]);

  const handleInputChange = (field: keyof BlogPost, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleTagToggle = (tagId: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.includes(tagId)
        ? prev.tags.filter(id => id !== tagId)
        : [...prev.tags, tagId]
    }));
  };

  const handleSave = async (status?: 'draft' | 'published') => {
    setIsSaving(true);
    try {
      const postToSave = { ...formData, status: status || formData.status };
      await onSave(postToSave);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className={cn("bg-white rounded-xl shadow-sm border border-gray-200", className)}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 lg:p-6 border-b border-gray-200 gap-4">
        <div className="flex items-center gap-4 min-w-0 flex-1">
          <h2 className="text-lg font-semibold text-gray-900 truncate">
            {post.id ? 'Edit Post' : 'Create New Post'}
          </h2>
          {autoSaveStatus && (
            <div className="flex items-center gap-2 text-sm flex-shrink-0">
              {autoSaveStatus === 'saving' && (
                <>
                  <Clock className="w-4 h-4 text-golden animate-spin" />
                  <span className="text-golden">Auto-saving...</span>
                </>
              )}
              {autoSaveStatus === 'saved' && (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald" />
                  <span className="text-emerald">Auto-saved</span>
                </>
              )}
              {autoSaveStatus === 'error' && (
                <>
                  <AlertCircle className="w-4 h-4 text-coral" />
                  <span className="text-coral">Auto-save failed</span>
                </>
              )}
            </div>
          )}
        </div>
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          {onPreview && (
            <button
              onClick={() => onPreview(formData)}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors text-sm"
            >
              <Eye className="w-4 h-4" />
              <span className="hidden sm:inline">Preview</span>
            </button>
          )}
          <button
            onClick={() => handleSave('draft')}
            disabled={isSaving}
            className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 text-sm"
          >
            <Save className="w-4 h-4" />
            <span className="hidden sm:inline">Save Draft</span>
          </button>
          <button
            onClick={() => handleSave('published')}
            disabled={isSaving}
            className="flex items-center gap-2 bg-navy text-white px-3 py-2 rounded-lg hover:bg-navy/90 transition-colors disabled:opacity-50 text-sm"
          >
            <Globe className="w-4 h-4" />
            <span className="hidden sm:inline">{isSaving ? 'Publishing...' : 'Publish'}</span>
          </button>
        </div>
      </div>

      <div className="p-4 lg:p-6 space-y-4 lg:space-y-6">
        {/* Title and Slug */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Post Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              className="w-full px-3 py-2 lg:px-4 lg:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy/20 focus:border-navy transition-colors"
              placeholder="Enter your post title..."
              maxLength={100}
            />
            <div className="mt-1 text-xs text-gray-500">
              {characterCount}/100 characters
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              URL Slug *
            </label>
            <input
              type="text"
              value={formData.slug}
              onChange={(e) => handleInputChange('slug', e.target.value)}
              className="w-full px-3 py-2 lg:px-4 lg:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy/20 focus:border-navy transition-colors"
              placeholder="post-url-slug"
            />
            <div className="mt-1 text-xs text-gray-500">
              URL: /blog/{formData.slug}
            </div>
          </div>
        </div>

        {/* Content Editor */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Content *
          </label>
          <div className="border border-gray-300 rounded-lg overflow-hidden">
            <textarea
              id="content-editor"
              ref={textareaRef}
              value={formData.content}
              onChange={(e) => handleInputChange('content', e.target.value)}
              className="w-full min-h-[400px] px-4 py-3 border-0 focus:ring-0 focus:outline-none resize-none"
              placeholder="Write your content here... (Rich text editor will load automatically)"
            />
          </div>
          <div className="mt-1 text-xs text-gray-500">
            {wordCount} words • Rich text editor will load automatically
          </div>
        </div>

        {/* Excerpt */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Excerpt
          </label>
          <textarea
            value={formData.excerpt}
            onChange={(e) => handleInputChange('excerpt', e.target.value)}
            rows={3}
            className="w-full px-3 py-2 lg:px-4 lg:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy/20 focus:border-navy transition-colors"
            placeholder="Brief description of your post..."
            maxLength={300}
          />
          <div className="mt-1 text-xs text-gray-500">
            {formData.excerpt.length}/300 characters
          </div>
        </div>

        {/* Featured Image */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Featured Image
          </label>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="url"
              value={formData.featured_image || ''}
              onChange={(e) => handleInputChange('featured_image', e.target.value)}
              className="flex-1 px-3 py-2 lg:px-4 lg:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy/20 focus:border-navy transition-colors"
              placeholder="https://example.com/image.jpg"
            />
            <button
              type="button"
              className="flex items-center justify-center gap-2 px-3 py-2 lg:px-4 lg:py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex-shrink-0"
            >
              <Upload className="w-4 h-4" />
              <span className="hidden sm:inline">Upload</span>
            </button>
          </div>
          {formData.featured_image && /^https?:\/\//.test(formData.featured_image) && (
            <div className="mt-3">
              <img
                src={formData.featured_image}
                alt="Featured"
                className="w-32 h-20 object-cover rounded-lg border border-gray-200"
              />
            </div>
          )}
        </div>

        {/* Category and Tags */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              value={formData.category_id || ''}
              onChange={(e) => handleInputChange('category_id', e.target.value)}
              className="w-full px-3 py-2 lg:px-4 lg:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy/20 focus:border-navy transition-colors"
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tags
            </label>
            <div className="max-h-32 overflow-y-auto border border-gray-300 rounded-lg p-3">
              <div className="space-y-2">
                {tags.map((tag) => (
                  <label key={tag.id} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.tags.includes(tag.id)}
                      onChange={() => handleTagToggle(tag.id)}
                      className="w-4 h-4 text-navy border-gray-300 rounded focus:ring-navy/20"
                    />
                    <span className="text-sm text-gray-700">{tag.name}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* SEO Section */}
        <div>
          <button
            onClick={() => setShowSEO(!showSEO)}
            className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
          >
            <Hash className="w-4 h-4" />
            SEO Settings
          </button>
          {showSEO && (
            <div className="mt-4 space-y-4 p-4 bg-gray-50 rounded-lg">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  SEO Title
                </label>
                <input
                  type="text"
                  value={formData.seo_title || ''}
                  onChange={(e) => handleInputChange('seo_title', e.target.value)}
                  className="w-full px-3 py-2 lg:px-4 lg:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy/20 focus:border-navy transition-colors"
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
                  value={formData.seo_description || ''}
                  onChange={(e) => handleInputChange('seo_description', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 lg:px-4 lg:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy/20 focus:border-navy transition-colors"
                  placeholder="SEO description for search engines..."
                  maxLength={160}
                />
                <div className="mt-1 text-xs text-gray-500">
                  {(formData.seo_description || '').length}/160 characters
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 