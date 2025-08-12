"use client";

import { useState, useRef } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { 
  Plus, 
  Search, 
  Upload, 
  Image as ImageIcon,
  FileText,
  Trash2,
  Download,
  Eye,
  Grid3X3,
  List,
  Filter,
  Calendar,
  HardDrive
} from 'lucide-react';

// Mock data - In real app, this would come from API
const mockMedia = [
  {
    id: '1',
    filename: 'afl-match-preview.jpg',
    original_name: 'AFL Match Preview.jpg',
    url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=400&fit=crop',
    alt_text: 'AFL match preview with players in action',
    file_size: 245760, // 240KB
    mime_type: 'image/jpeg',
    width: 800,
    height: 400,
    created_at: '2024-08-15T10:00:00Z'
  },
  {
    id: '2',
    filename: 'nrl-finals-analysis.png',
    original_name: 'NRL Finals Analysis.png',
    url: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=800&h=400&fit=crop',
    alt_text: 'NRL finals analysis with team statistics',
    file_size: 512000, // 500KB
    mime_type: 'image/png',
    width: 800,
    height: 400,
    created_at: '2024-08-14T14:30:00Z'
  },
  {
    id: '3',
    filename: 'melbourne-cup-2024.jpg',
    original_name: 'Melbourne Cup 2024.jpg',
    url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=400&fit=crop',
    alt_text: 'Melbourne Cup 2024 horse racing event',
    file_size: 1024000, // 1MB
    mime_type: 'image/jpeg',
    width: 800,
    height: 400,
    created_at: '2024-08-13T09:15:00Z'
  },
  {
    id: '4',
    filename: 'cricket-bbl-preview.jpg',
    original_name: 'Cricket BBL Preview.jpg',
    url: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=800&h=400&fit=crop',
    alt_text: 'Big Bash League cricket preview',
    file_size: 307200, // 300KB
    mime_type: 'image/jpeg',
    width: 800,
    height: 400,
    created_at: '2024-08-12T16:45:00Z'
  }
];

interface MediaFile {
  id: string;
  filename: string;
  original_name: string;
  url: string;
  alt_text: string;
  file_size: number;
  mime_type: string;
  width?: number;
  height?: number;
  created_at: string;
}

export default function MediaPage() {
  const [media, setMedia] = useState<MediaFile[]>(mockMedia);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [showUpload, setShowUpload] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredMedia = media.filter(file =>
    file.filename.toLowerCase().includes(searchTerm.toLowerCase()) ||
    file.original_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    file.alt_text.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      const newMedia: MediaFile = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        filename: file.name,
        original_name: file.name,
        url: URL.createObjectURL(file),
        alt_text: '',
        file_size: file.size,
        mime_type: file.type,
        created_at: new Date().toISOString()
      };
      setMedia(prev => [newMedia, ...prev]);
    });

    setShowUpload(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDelete = (fileId: string) => {
    if (confirm('Are you sure you want to delete this file? This action cannot be undone.')) {
      setMedia(prev => prev.filter(file => file.id !== fileId));
    }
  };

  const handleBulkDelete = () => {
    if (confirm(`Are you sure you want to delete ${selectedFiles.length} files? This action cannot be undone.`)) {
      setMedia(prev => prev.filter(file => !selectedFiles.includes(file.id)));
      setSelectedFiles([]);
    }
  };

  const handleSelectAll = () => {
    if (selectedFiles.length === filteredMedia.length) {
      setSelectedFiles([]);
    } else {
      setSelectedFiles(filteredMedia.map(file => file.id));
    }
  };

  const handleSelectFile = (fileId: string) => {
    setSelectedFiles(prev => 
      prev.includes(fileId) 
        ? prev.filter(id => id !== fileId)
        : [...prev, fileId]
    );
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Media Library</h1>
            <p className="text-gray-600">Manage uploaded images and files.</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
              className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              {viewMode === 'grid' ? <List className="w-4 h-4" /> : <Grid3X3 className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setShowUpload(true)}
              className="inline-flex items-center gap-2 bg-navy text-white px-4 py-2 rounded-lg hover:bg-navy/90 transition-colors"
            >
              <Upload className="w-4 h-4" />
              Upload Files
            </button>
          </div>
        </div>

        {/* Upload Area */}
        {showUpload && (
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Upload Files</h3>
              <p className="text-gray-600 mb-4">Drag and drop files here, or click to select files</p>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="bg-navy text-white px-6 py-2 rounded-lg hover:bg-navy/90 transition-colors"
              >
                Select Files
              </button>
            </div>
          </div>
        )}

        {/* Search and Filters */}
        <div className="bg-white rounded-xl p-4 lg:p-6 shadow-sm border border-gray-200">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search media files..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy/20 focus:border-navy transition-colors"
                />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <Filter className="w-4 h-4" />
                Filter
              </button>
            </div>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedFiles.length > 0 && (
          <div className="bg-navy/5 border border-navy/20 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-navy">
                {selectedFiles.length} file{selectedFiles.length !== 1 ? 's' : ''} selected
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleBulkDelete}
                  className="px-3 py-1 bg-coral text-white text-sm rounded-lg hover:bg-coral/90 transition-colors"
                >
                  Delete Selected
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Media Grid/List */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredMedia.map((file) => (
              <div key={file.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                {/* Image */}
                <div className="relative aspect-video bg-gray-100">
                  <img
                    src={file.url}
                    alt={file.alt_text}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2 flex items-center gap-1">
                    <input
                      type="checkbox"
                      checked={selectedFiles.includes(file.id)}
                      onChange={() => handleSelectFile(file.id)}
                      className="w-4 h-4 text-navy border-gray-300 rounded focus:ring-navy/20"
                    />
                  </div>
                </div>

                {/* Info */}
                <div className="p-4">
                  <h3 className="font-medium text-gray-900 text-sm line-clamp-1 mb-1">
                    {file.original_name}
                  </h3>
                  <p className="text-xs text-gray-500 mb-2 line-clamp-2">
                    {file.alt_text || 'No alt text'}
                  </p>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{formatFileSize(file.file_size)}</span>
                    <span>{file.width}×{file.height}</span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
                    <button className="p-1 text-gray-400 hover:text-navy transition-colors">
                      <Eye className="w-3 h-3" />
                    </button>
                    <button className="p-1 text-gray-400 hover:text-emerald transition-colors">
                      <Download className="w-3 h-3" />
                    </button>
                    <button 
                      onClick={() => handleDelete(file.id)}
                      className="p-1 text-gray-400 hover:text-coral transition-colors ml-auto"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left">
                      <input
                        type="checkbox"
                        checked={selectedFiles.length === filteredMedia.length && filteredMedia.length > 0}
                        onChange={handleSelectAll}
                        className="w-4 h-4 text-navy border-gray-300 rounded focus:ring-navy/20"
                      />
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">File</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Size</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Dimensions</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Date</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredMedia.map((file) => (
                    <tr key={file.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={selectedFiles.includes(file.id)}
                          onChange={() => handleSelectFile(file.id)}
                          className="w-4 h-4 text-navy border-gray-300 rounded focus:ring-navy/20"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={file.url}
                            alt={file.alt_text}
                            className="w-12 h-12 object-cover rounded border border-gray-200"
                          />
                          <div>
                            <div className="font-medium text-gray-900 text-sm">{file.original_name}</div>
                            <div className="text-xs text-gray-500">{file.alt_text || 'No alt text'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {formatFileSize(file.file_size)}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {file.width}×{file.height}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {new Date(file.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button className="p-1 text-gray-400 hover:text-navy transition-colors">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="p-1 text-gray-400 hover:text-emerald transition-colors">
                            <Download className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDelete(file.id)}
                            className="p-1 text-gray-400 hover:text-coral transition-colors"
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
          </div>
        )}

        {filteredMedia.length === 0 && (
          <div className="text-center py-12">
            <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No media files found</h3>
            <p className="text-gray-600">Try adjusting your search or upload new files.</p>
          </div>
        )}

        {/* Storage Summary */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Storage Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-navy">{media.length}</div>
              <div className="text-sm text-gray-600">Total Files</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-emerald">
                {formatFileSize(media.reduce((sum, file) => sum + file.file_size, 0))}
              </div>
              <div className="text-sm text-gray-600">Total Size</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-golden">
                {media.filter(file => file.mime_type.startsWith('image/')).length}
              </div>
              <div className="text-sm text-gray-600">Images</div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
} 