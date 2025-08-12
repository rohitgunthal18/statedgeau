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
  Tag,
  Image as ImageIcon,
  Link,
  BarChart3,
  Target,
  Search,
  Type,
  Calendar,
  Star,
  TrendingUp,
  FileText,
  Settings,
  Lightbulb,
  Zap,
  Shield,
  Globe2,
  Users,
  MousePointer,
  Smartphone,
  Monitor,
  RefreshCw,
  Copy,
  ExternalLink,
  Camera
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface BlogPost {
  id?: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  featured_image?: string;
  featured_image_alt?: string;
  category_id?: string;
  status: 'draft' | 'published' | 'scheduled' | 'archived';
  seo_title?: string;
  seo_description?: string;
  seo_keywords?: string[];
  focus_keyword?: string;
  meta_robots?: string;
  canonical_url?: string;
  og_title?: string;
  og_description?: string;
  og_image?: string;
  twitter_title?: string;
  twitter_description?: string;
  twitter_image?: string;
  schema_type?: string;
  reading_time?: number;
  tags: string[];
  published_at?: string;
  scheduled_at?: string;
}

interface SEOAnalysis {
  score: number;
  issues: string[];
  suggestions: string[];
  keywords: {
    density: number;
    count: number;
    inTitle: boolean;
    inDescription: boolean;
    inHeadings: boolean;
  };
  readability: {
    score: number;
    level: string;
    avgWordsPerSentence: number;
    avgSentencesPerParagraph: number;
  };
  structure: {
    hasH1: boolean;
    hasH2: boolean;
    hasH3: boolean;
    imageCount: number;
    linkCount: number;
    wordCount: number;
  };
}

interface BlogEditorProps {
  post?: BlogPost;
  categories: Array<{ id: string; name: string; slug: string; color?: string }>;
  tags: Array<{ id: string; name: string; slug: string; color?: string; betting_type?: string }>;
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
  featured_image_alt: '',
  category_id: '',
  status: 'draft',
  seo_title: '',
  seo_description: '',
  seo_keywords: [],
  focus_keyword: '',
  meta_robots: 'index, follow',
  canonical_url: '',
  og_title: '',
  og_description: '',
  og_image: '',
  twitter_title: '',
  twitter_description: '',
  twitter_image: '',
  schema_type: 'Article',
  reading_time: 0,
  tags: [],
};

export function AdvancedBlogEditor({ 
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
  const [activeTab, setActiveTab] = useState<'content' | 'seo' | 'social' | 'advanced'>('content');
  const [seoAnalysis, setSeoAnalysis] = useState<SEOAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout>();
  const editorRef = useRef<any>(null);
  const featuredImageInputRef = useRef<HTMLInputElement>(null);

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

  // Calculate reading time
  const calculateReadingTime = useCallback((content: string) => {
    const wordsPerMinute = 200;
    const text = content.replace(/<[^>]*>/g, '');
    const wordCount = text.split(/\s+/).filter(word => word.length > 0).length;
    return Math.ceil(wordCount / wordsPerMinute);
  }, []);

  // SEO Analysis function
  const performSEOAnalysis = useCallback(() => {
    if (!formData.content || !formData.title) return;

    setIsAnalyzing(true);
    
    setTimeout(() => {
      const text = formData.content.replace(/<[^>]*>/g, '');
      const wordCount = text.split(/\s+/).filter(word => word.length > 0).length;
      const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
      const paragraphs = formData.content.split('<p>').length - 1;
      
      const focusKeyword = formData.focus_keyword?.toLowerCase() || '';
      const titleHasKeyword = formData.title.toLowerCase().includes(focusKeyword);
      const descriptionHasKeyword = (formData.seo_description || '').toLowerCase().includes(focusKeyword);
      const headingsHaveKeyword = /<h[1-6][^>]*>.*?<\/h[1-6]>/gi.test(formData.content) && 
                                  formData.content.toLowerCase().includes(focusKeyword);
      
      const keywordCount = (text.toLowerCase().match(new RegExp(focusKeyword, 'g')) || []).length;
      const keywordDensity = wordCount > 0 ? (keywordCount / wordCount) * 100 : 0;
      
      const hasH1 = /<h1[^>]*>.*?<\/h1>/i.test(formData.content);
      const hasH2 = /<h2[^>]*>.*?<\/h2>/i.test(formData.content);
      const hasH3 = /<h3[^>]*>.*?<\/h3>/i.test(formData.content);
      const imageCount = (formData.content.match(/<img[^>]*>/g) || []).length;
      const linkCount = (formData.content.match(/<a[^>]*>/g) || []).length;
      
      let score = 0;
      const issues: string[] = [];
      const suggestions: string[] = [];
      
      // Title checks
      if (formData.title.length < 30) {
        issues.push('Title is too short (recommended: 30-60 characters)');
      } else if (formData.title.length > 60) {
        issues.push('Title is too long (recommended: 30-60 characters)');
      } else {
        score += 15;
      }
      
      // SEO description checks
      if (!formData.seo_description) {
        issues.push('Missing SEO meta description');
      } else if (formData.seo_description.length < 120) {
        issues.push('SEO description too short (recommended: 120-160 characters)');
      } else if (formData.seo_description.length > 160) {
        issues.push('SEO description too long (recommended: 120-160 characters)');
      } else {
        score += 15;
      }
      
      // Focus keyword checks
      if (!focusKeyword) {
        issues.push('No focus keyword specified');
      } else {
        if (titleHasKeyword) score += 10;
        else issues.push('Focus keyword not found in title');
        
        if (descriptionHasKeyword) score += 10;
        else issues.push('Focus keyword not found in meta description');
        
        if (headingsHaveKeyword) score += 10;
        else issues.push('Focus keyword not found in headings');
        
        if (keywordDensity < 0.5) {
          suggestions.push('Consider using focus keyword more frequently (current density: ' + keywordDensity.toFixed(1) + '%)');
        } else if (keywordDensity > 3) {
          issues.push('Keyword density too high (' + keywordDensity.toFixed(1) + '%) - may be considered spam');
        } else {
          score += 10;
        }
      }
      
      // Content structure checks
      if (wordCount < 300) {
        issues.push('Content too short (recommended: 800+ words for better SEO)');
      } else if (wordCount >= 800) {
        score += 15;
      } else {
        suggestions.push('Consider expanding content to 800+ words for better SEO');
        score += 5;
      }
      
      if (!hasH1) {
        issues.push('Missing H1 heading');
      } else {
        score += 5;
      }
      
      if (!hasH2) {
        suggestions.push('Consider adding H2 headings to improve content structure');
      } else {
        score += 5;
      }
      
      if (imageCount === 0) {
        suggestions.push('Add images to make content more engaging');
      } else {
        score += 10;
      }
      
      if (!formData.featured_image) {
        issues.push('Missing featured image');
      } else {
        score += 5;
      }
      
      if (!formData.featured_image_alt && formData.featured_image) {
        issues.push('Featured image missing alt text');
      } else if (formData.featured_image_alt) {
        score += 5;
      }

      // Readability analysis
      const avgWordsPerSentence = sentences.length > 0 ? wordCount / sentences.length : 0;
      const avgSentencesPerParagraph = paragraphs > 0 ? sentences.length / paragraphs : 0;
      
      let readabilityScore = 100;
      let readabilityLevel = 'Very Easy';
      
      if (avgWordsPerSentence > 20) {
        readabilityScore -= 20;
        readabilityLevel = 'Difficult';
        suggestions.push('Consider shorter sentences for better readability');
      } else if (avgWordsPerSentence > 15) {
        readabilityScore -= 10;
        readabilityLevel = 'Fairly Difficult';
      } else {
        readabilityLevel = 'Easy';
        score += 5;
      }

      setSeoAnalysis({
        score: Math.min(100, score),
        issues,
        suggestions,
        keywords: {
          density: keywordDensity,
          count: keywordCount,
          inTitle: titleHasKeyword,
          inDescription: descriptionHasKeyword,
          inHeadings: headingsHaveKeyword,
        },
        readability: {
          score: readabilityScore,
          level: readabilityLevel,
          avgWordsPerSentence,
          avgSentencesPerParagraph,
        },
        structure: {
          hasH1,
          hasH2,
          hasH3,
          imageCount,
          linkCount,
          wordCount,
        },
      });
      
      setIsAnalyzing(false);
    }, 1000);
  }, [formData]);

  // Initialize TinyMCE with advanced configuration
  useEffect(() => {
    const initializeEditor = () => {
      if (typeof window === 'undefined' || !(window as any).tinymce) return;

      try {
        (window as any).tinymce.init({
          selector: '#advanced-content-editor',
          height: 500,
          menubar: true,
          plugins: [
            'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
            'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
            'insertdatetime', 'media', 'table', 'help', 'wordcount', 'emoticons',
            'template', 'codesample', 'hr', 'pagebreak', 'nonbreaking', 'toc'
          ],
          toolbar1: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | alignleft aligncenter alignright alignjustify',
          toolbar2: 'bullist numlist outdent indent | forecolor backcolor | link image media table | code codesample | fullscreen preview',
          toolbar3: 'searchreplace | charmap emoticons hr pagebreak | insertdatetime anchor | toc | template | help',
          content_style: `
            body { 
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
              font-size: 16px;
              line-height: 1.6;
              color: #333;
              max-width: 800px;
              margin: 0 auto;
              padding: 20px;
            }
            h1, h2, h3, h4, h5, h6 { 
              color: #1a237e; 
              margin-top: 1.5em;
              margin-bottom: 0.5em;
            }
            p { margin-bottom: 1em; }
            img { max-width: 100%; height: auto; }
            table { border-collapse: collapse; width: 100%; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f5f5f5; }
            blockquote { 
              border-left: 4px solid #ffc107; 
              padding-left: 16px; 
              margin: 1em 0; 
              font-style: italic; 
            }
            .betting-tip {
              background: #e8f5e8;
              border: 1px solid #00c853;
              border-radius: 8px;
              padding: 16px;
              margin: 16px 0;
            }
            .betting-tip::before {
              content: "💡 Betting Tip: ";
              font-weight: bold;
              color: #00c853;
            }
          `,
          templates: [
            {
              title: 'Betting Tip Box',
              description: 'Highlighted betting tip',
              content: '<div class="betting-tip">Your betting tip here...</div>'
            },
            {
              title: 'Match Preview Template',
              description: 'Standard match preview structure',
              content: `
                <h2>Match Overview</h2>
                <p>Brief match overview...</p>
                <h3>Team Form</h3>
                <p>Team A form analysis...</p>
                <p>Team B form analysis...</p>
                <h3>Key Players</h3>
                <p>Key players to watch...</p>
                <h3>Betting Tips</h3>
                <div class="betting-tip">Main betting recommendation...</div>
                <h3>Conclusion</h3>
                <p>Final thoughts and prediction...</p>
              `
            }
          ],
          image_upload_handler: handleImageUpload,
          file_picker_callback: handleFilePicker,
          automatic_uploads: true,
          paste_data_images: true,
          branding: false,
          promotion: false,
          setup: (editor: any) => {
            editorRef.current = editor;
            editor.on('change keyup', () => {
              const content = editor.getContent();
              handleInputChange('content', content);
              
              // Update reading time
              const readingTime = calculateReadingTime(content);
              handleInputChange('reading_time', readingTime);
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

    // Load TinyMCE if not already loaded
    if (typeof window !== 'undefined' && (window as any).tinymce) {
      initializeEditor();
    } else {
      const script = document.createElement('script');
      script.src = 'https://cdn.tiny.cloud/1/nqrkv4282pau4c1go84vv3v28wj7ugpmfj5tqavebdr8witn/tinymce/6/tinymce.min.js';
      script.onload = initializeEditor;
      document.head.appendChild(script);
    }

    return () => {
      if (editorRef.current) {
        try {
          (window as any).tinymce.remove('#advanced-content-editor');
        } catch (error) {
          console.error('Error removing TinyMCE:', error);
        }
      }
    };
  }, []);

  // Handle image upload to Supabase
  const handleImageUpload = async (blobInfo: any, progress: (percent: number) => void): Promise<string> => {
    return new Promise(async (resolve, reject) => {
      try {
        setIsUploading(true);
        const formData = new FormData();
        formData.append('file', blobInfo.blob(), blobInfo.filename());
        formData.append('type', 'content');
        
        const response = await fetch('/api/admin/upload', {
          method: 'POST',
          body: formData,
        });
        
        if (!response.ok) {
          throw new Error('Upload failed');
        }
        
        const data = await response.json();
        setIsUploading(false);
        resolve(data.url);
      } catch (error) {
        setIsUploading(false);
        reject(error);
      }
    });
  };

  // Handle file picker for media library
  const handleFilePicker = (callback: any, value: string, meta: any) => {
    if (meta.filetype === 'image') {
      const input = document.createElement('input');
      input.setAttribute('type', 'file');
      input.setAttribute('accept', 'image/*');
      
      input.addEventListener('change', async (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (file) {
          try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('type', 'content');
            
            const response = await fetch('/api/admin/upload', {
              method: 'POST',
              body: formData,
            });
            
            const data = await response.json();
            callback(data.url, { alt: file.name });
          } catch (error) {
            console.error('Upload failed:', error);
          }
        }
      });
      
      input.click();
    }
  };

  // Handle featured image upload
  const handleFeaturedImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', 'featured');
      
      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Upload failed');
      }
      
      const data = await response.json();
      handleInputChange('featured_image', data.url);
      handleInputChange('featured_image_alt', file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '));
      
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setIsUploading(false);
    }
  };

  // Auto-save functionality
  const autoSave = useCallback(async () => {
    if (!formData.title || !formData.content) return;
    
    try {
      setAutoSaveStatus('saving');
      await onSave({ ...formData, status: 'draft' });
      setAutoSaveStatus('saved');
      setTimeout(() => setAutoSaveStatus(null), 2000);
    } catch (error) {
      setAutoSaveStatus('error');
      setTimeout(() => setAutoSaveStatus(null), 3000);
    }
  }, [formData, onSave]);

  // Auto-save timer
  useEffect(() => {
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }
    
    autoSaveTimeoutRef.current = setTimeout(() => {
      if (formData.title && formData.content && formData.id) {
        autoSave();
      }
    }, 10000); // Auto-save every 10 seconds

    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, [formData, autoSave]);

  // Auto-generate slug when title changes
  useEffect(() => {
    if (formData.title && !post.id) {
      const newSlug = generateSlug(formData.title);
      if (newSlug !== formData.slug) {
        handleInputChange('slug', newSlug);
      }
    }
  }, [formData.title, post.id, generateSlug]);

  // Auto-generate SEO fields if empty
  useEffect(() => {
    if (formData.title && !formData.seo_title) {
      handleInputChange('seo_title', formData.title);
    }
    if (formData.excerpt && !formData.seo_description) {
      handleInputChange('seo_description', formData.excerpt);
    }
    if (formData.title && !formData.og_title) {
      handleInputChange('og_title', formData.title);
    }
    if (formData.excerpt && !formData.og_description) {
      handleInputChange('og_description', formData.excerpt);
    }
  }, [formData.title, formData.excerpt]);

  const handleInputChange = (field: keyof BlogPost, value: any) => {
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

  const handleSave = async (status?: 'draft' | 'published' | 'scheduled') => {
    setIsSaving(true);
    try {
      const postToSave = { 
        ...formData, 
        status: status || formData.status,
        reading_time: calculateReadingTime(formData.content)
      };
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
          
          {/* SEO Score Badge */}
          {seoAnalysis && (
            <div className={cn(
              "flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium",
              seoAnalysis.score >= 80 ? "bg-emerald/10 text-emerald" :
              seoAnalysis.score >= 60 ? "bg-golden/10 text-golden" :
              "bg-coral/10 text-coral"
            )}>
              <Target className="w-4 h-4" />
              SEO: {seoAnalysis.score}%
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          <button
            onClick={performSEOAnalysis}
            disabled={isAnalyzing}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors text-sm disabled:opacity-50"
          >
            <BarChart3 className={cn("w-4 h-4", isAnalyzing && "animate-spin")} />
            <span className="hidden sm:inline">Analyze SEO</span>
          </button>
          
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

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 px-4 lg:px-6">
          {[
            { id: 'content', label: 'Content', icon: FileText },
            { id: 'seo', label: 'SEO', icon: Target },
            { id: 'social', label: 'Social', icon: Users },
            { id: 'advanced', label: 'Advanced', icon: Settings },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                "flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors",
                activeTab === tab.id
                  ? "border-navy text-navy"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              )}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="p-4 lg:p-6">
        {/* Content Tab */}
        {activeTab === 'content' && (
          <div className="space-y-6">
            {/* Title and Slug */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Post Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy/20 focus:border-navy transition-colors"
                  placeholder="Enter your post title..."
                  maxLength={100}
                />
                <div className="mt-1 text-xs text-gray-500">
                  {formData.title.length}/100 characters
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  URL Slug *
                </label>
                <div className="flex">
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => handleInputChange('slug', e.target.value)}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-navy/20 focus:border-navy transition-colors"
                    placeholder="post-url-slug"
                  />
                  <button
                    onClick={() => handleInputChange('slug', generateSlug(formData.title))}
                    className="px-3 border border-l-0 border-gray-300 rounded-r-lg hover:bg-gray-50 transition-colors"
                    title="Generate from title"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                </div>
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
                  id="advanced-content-editor"
                  value={formData.content}
                  onChange={(e) => handleInputChange('content', e.target.value)}
                  className="w-full min-h-[500px] p-4 border-0 focus:ring-0 focus:outline-none resize-none"
                  placeholder="Write your content here... (Rich text editor will load automatically)"
                />
              </div>
              <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
                <span>{seoAnalysis?.structure.wordCount || 0} words • {formData.reading_time || 0} min read</span>
                {isUploading && (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-golden border-t-transparent rounded-full animate-spin" />
                    Uploading image...
                  </span>
                )}
              </div>
            </div>

            {/* Featured Image */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Featured Image *
              </label>
              <div className="space-y-4">
                {formData.featured_image ? (
                  <div className="relative">
                    <img
                      src={formData.featured_image}
                      alt={formData.featured_image_alt || 'Featured image'}
                      className="w-full h-48 object-cover rounded-lg border border-gray-200"
                    />
                    <button
                      onClick={() => {
                        handleInputChange('featured_image', '');
                        handleInputChange('featured_image_alt', '');
                      }}
                      className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div 
                    onClick={() => featuredImageInputRef.current?.click()}
                    className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-navy transition-colors cursor-pointer"
                  >
                    <Camera className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-600 font-medium">Upload Featured Image</p>
                    <p className="text-gray-500 text-sm mt-1">Click to browse or drag and drop</p>
                  </div>
                )}
                
                <input
                  ref={featuredImageInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFeaturedImageUpload}
                  className="hidden"
                />
                
                {formData.featured_image && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Alt Text (SEO Important)
                    </label>
                    <input
                      type="text"
                      value={formData.featured_image_alt || ''}
                      onChange={(e) => handleInputChange('featured_image_alt', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy/20 focus:border-navy transition-colors"
                      placeholder="Describe the image for accessibility and SEO..."
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Excerpt */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Excerpt *
              </label>
              <textarea
                value={formData.excerpt}
                onChange={(e) => handleInputChange('excerpt', e.target.value)}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy/20 focus:border-navy transition-colors"
                placeholder="Brief description of your post for previews and social sharing..."
                maxLength={300}
              />
              <div className="mt-1 text-xs text-gray-500">
                {formData.excerpt.length}/300 characters
              </div>
            </div>

            {/* Category and Tags */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  value={formData.category_id || ''}
                  onChange={(e) => handleInputChange('category_id', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy/20 focus:border-navy transition-colors"
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
                        {tag.betting_type && (
                          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                            {tag.betting_type}
                          </span>
                        )}
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SEO Tab */}
        {activeTab === 'seo' && (
          <div className="space-y-6">
            {/* SEO Analysis Results */}
            {seoAnalysis && (
              <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">SEO Analysis</h3>
                  <div className={cn(
                    "flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium",
                    seoAnalysis.score >= 80 ? "bg-emerald/10 text-emerald" :
                    seoAnalysis.score >= 60 ? "bg-golden/10 text-golden" :
                    "bg-coral/10 text-coral"
                  )}>
                    <Target className="w-4 h-4" />
                    Score: {seoAnalysis.score}%
                  </div>
                </div>
                
                {seoAnalysis.issues.length > 0 && (
                  <div>
                    <h4 className="font-medium text-coral mb-2">Issues to Fix:</h4>
                    <ul className="space-y-1">
                      {seoAnalysis.issues.map((issue, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                          <AlertCircle className="w-4 h-4 text-coral mt-0.5 flex-shrink-0" />
                          {issue}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {seoAnalysis.suggestions.length > 0 && (
                  <div>
                    <h4 className="font-medium text-golden mb-2">Suggestions:</h4>
                    <ul className="space-y-1">
                      {seoAnalysis.suggestions.map((suggestion, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                          <Lightbulb className="w-4 h-4 text-golden mt-0.5 flex-shrink-0" />
                          {suggestion}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Focus Keyword */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Focus Keyword *
              </label>
              <input
                type="text"
                value={formData.focus_keyword || ''}
                onChange={(e) => handleInputChange('focus_keyword', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy/20 focus:border-navy transition-colors"
                placeholder="e.g., AFL betting tips"
              />
              <p className="mt-1 text-xs text-gray-500">
                The main keyword you want to rank for in search engines
              </p>
            </div>

            {/* SEO Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                SEO Title *
              </label>
              <input
                type="text"
                value={formData.seo_title || ''}
                onChange={(e) => handleInputChange('seo_title', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy/20 focus:border-navy transition-colors"
                placeholder="SEO optimized title for search engines..."
                maxLength={60}
              />
              <div className="mt-1 flex justify-between text-xs text-gray-500">
                <span>Optimal length: 30-60 characters</span>
                <span className={cn(
                  (formData.seo_title?.length || 0) > 60 ? "text-coral" : 
                  (formData.seo_title?.length || 0) < 30 ? "text-golden" : 
                  "text-emerald"
                )}>
                  {formData.seo_title?.length || 0}/60
                </span>
              </div>
            </div>

            {/* SEO Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                SEO Meta Description *
              </label>
              <textarea
                value={formData.seo_description || ''}
                onChange={(e) => handleInputChange('seo_description', e.target.value)}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy/20 focus:border-navy transition-colors"
                placeholder="Compelling description that appears in search results..."
                maxLength={160}
              />
              <div className="mt-1 flex justify-between text-xs text-gray-500">
                <span>Optimal length: 120-160 characters</span>
                <span className={cn(
                  (formData.seo_description?.length || 0) > 160 ? "text-coral" : 
                  (formData.seo_description?.length || 0) < 120 ? "text-golden" : 
                  "text-emerald"
                )}>
                  {formData.seo_description?.length || 0}/160
                </span>
              </div>
            </div>

            {/* SEO Keywords */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                SEO Keywords
              </label>
              <input
                type="text"
                value={formData.seo_keywords?.join(', ') || ''}
                onChange={(e) => handleInputChange('seo_keywords', e.target.value.split(', ').filter(k => k.trim()))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy/20 focus:border-navy transition-colors"
                placeholder="keyword1, keyword2, keyword3"
              />
              <p className="mt-1 text-xs text-gray-500">
                Separate keywords with commas. Include variations of your focus keyword.
              </p>
            </div>

            {/* Robots Meta */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Robots Meta
              </label>
              <select
                value={formData.meta_robots || 'index, follow'}
                onChange={(e) => handleInputChange('meta_robots', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy/20 focus:border-navy transition-colors"
              >
                <option value="index, follow">Index, Follow (Default)</option>
                <option value="noindex, follow">No Index, Follow</option>
                <option value="index, nofollow">Index, No Follow</option>
                <option value="noindex, nofollow">No Index, No Follow</option>
              </select>
            </div>

            {/* Canonical URL */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Canonical URL
              </label>
              <input
                type="url"
                value={formData.canonical_url || ''}
                onChange={(e) => handleInputChange('canonical_url', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy/20 focus:border-navy transition-colors"
                placeholder="https://example.com/canonical-url"
              />
              <p className="mt-1 text-xs text-gray-500">
                Leave empty to use the default URL. Used to prevent duplicate content issues.
              </p>
            </div>
          </div>
        )}

        {/* Social Tab */}
        {activeTab === 'social' && (
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-medium text-blue-900 mb-2">Open Graph (Facebook, LinkedIn)</h3>
              <p className="text-blue-700 text-sm">
                Optimize how your content appears when shared on social media platforms.
              </p>
            </div>

            {/* Open Graph Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Open Graph Title
              </label>
              <input
                type="text"
                value={formData.og_title || ''}
                onChange={(e) => handleInputChange('og_title', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy/20 focus:border-navy transition-colors"
                placeholder="Title for social media sharing..."
                maxLength={60}
              />
              <div className="mt-1 text-xs text-gray-500">
                {(formData.og_title?.length || 0)}/60 characters
              </div>
            </div>

            {/* Open Graph Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Open Graph Description
              </label>
              <textarea
                value={formData.og_description || ''}
                onChange={(e) => handleInputChange('og_description', e.target.value)}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy/20 focus:border-navy transition-colors"
                placeholder="Description for social media sharing..."
                maxLength={200}
              />
              <div className="mt-1 text-xs text-gray-500">
                {(formData.og_description?.length || 0)}/200 characters
              </div>
            </div>

            {/* Open Graph Image */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Open Graph Image
              </label>
              <input
                type="url"
                value={formData.og_image || ''}
                onChange={(e) => handleInputChange('og_image', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy/20 focus:border-navy transition-colors"
                placeholder="Image URL for social sharing (1200x630px recommended)"
              />
              <p className="mt-1 text-xs text-gray-500">
                If empty, featured image will be used. Recommended size: 1200x630px
              </p>
            </div>

            <hr className="border-gray-200" />

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-2">Twitter Card</h3>
              <p className="text-gray-700 text-sm">
                Customize how your content appears on Twitter/X.
              </p>
            </div>

            {/* Twitter Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Twitter Title
              </label>
              <input
                type="text"
                value={formData.twitter_title || ''}
                onChange={(e) => handleInputChange('twitter_title', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy/20 focus:border-navy transition-colors"
                placeholder="Title for Twitter sharing..."
                maxLength={70}
              />
              <div className="mt-1 text-xs text-gray-500">
                {(formData.twitter_title?.length || 0)}/70 characters
              </div>
            </div>

            {/* Twitter Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Twitter Description
              </label>
              <textarea
                value={formData.twitter_description || ''}
                onChange={(e) => handleInputChange('twitter_description', e.target.value)}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy/20 focus:border-navy transition-colors"
                placeholder="Description for Twitter sharing..."
                maxLength={200}
              />
              <div className="mt-1 text-xs text-gray-500">
                {(formData.twitter_description?.length || 0)}/200 characters
              </div>
            </div>

            {/* Twitter Image */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Twitter Image
              </label>
              <input
                type="url"
                value={formData.twitter_image || ''}
                onChange={(e) => handleInputChange('twitter_image', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy/20 focus:border-navy transition-colors"
                placeholder="Image URL for Twitter sharing (1024x512px recommended)"
              />
              <p className="mt-1 text-xs text-gray-500">
                If empty, Open Graph image will be used. Recommended size: 1024x512px
              </p>
            </div>
          </div>
        )}

        {/* Advanced Tab */}
        {activeTab === 'advanced' && (
          <div className="space-y-6">
            {/* Schema Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Schema Type
              </label>
              <select
                value={formData.schema_type || 'Article'}
                onChange={(e) => handleInputChange('schema_type', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy/20 focus:border-navy transition-colors"
              >
                <option value="Article">Article</option>
                <option value="NewsArticle">News Article</option>
                <option value="BlogPosting">Blog Posting</option>
                <option value="Review">Review</option>
                <option value="HowTo">How To</option>
              </select>
            </div>

            {/* Publishing Schedule */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Schedule Publication
              </label>
              <input
                type="datetime-local"
                value={formData.scheduled_at || ''}
                onChange={(e) => handleInputChange('scheduled_at', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy/20 focus:border-navy transition-colors"
              />
              <p className="mt-1 text-xs text-gray-500">
                Leave empty to publish immediately
              </p>
            </div>

            {/* Reading Time Override */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reading Time (minutes)
              </label>
              <input
                type="number"
                value={formData.reading_time || ''}
                onChange={(e) => handleInputChange('reading_time', parseInt(e.target.value) || 0)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy/20 focus:border-navy transition-colors"
                placeholder="Auto-calculated"
                min="1"
                max="60"
              />
              <p className="mt-1 text-xs text-gray-500">
                Leave empty for auto-calculation based on content length
              </p>
            </div>

            {/* Post Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Post Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => handleInputChange('status', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy/20 focus:border-navy transition-colors"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="scheduled">Scheduled</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}