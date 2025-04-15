import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { useNavigate, useParams } from 'react-router-dom';

const MarkdownEditor = ({ onSave, posts }) => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const existingPost = slug ? posts?.find(p => p.slug === slug) : null;

  const [title, setTitle] = useState(existingPost?.title || '');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState(existingPost?.tags.join(', ') || '');
  const [preview, setPreview] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (existingPost) {
      const savedContent = localStorage.getItem(`post-${slug}`);
      if (savedContent) {
        setContent(savedContent);
      }
    }
  }, [existingPost, slug]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    const post = {
      title,
      content,
      tags: tags.split(',').map(tag => tag.trim()).filter(Boolean),
      date: existingPost?.date || new Date().toISOString().split('T')[0],
      author: existingPost?.author || 'Your Name',
      slug: existingPost?.slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    };

    try {
      const success = await onSave(post, !!existingPost);
      if (success) {
        navigate(`/post/${post.slug}`);
      } else {
        alert('Failed to save post');
      }
    } catch (error) {
      console.error('Error saving post:', error);
      alert('Failed to save post');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4">
      <div className="flex justify-end mb-4">
        <button
          onClick={() => setPreview(!preview)}
          className="px-4 py-2 bg-gray-800 dark:bg-gray-700 text-white rounded-lg hover:bg-gray-700 dark:hover:bg-gray-600"
        >
          {preview ? 'Edit' : 'Preview'}
        </button>
      </div>

      {!preview ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Post title"
            className="w-full p-2 border rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
          />
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="Tags (comma-separated)"
            className="w-full p-2 border rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
          />
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your post in markdown..."
            className="w-full h-96 p-2 border rounded font-mono bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
          />
          <button
            type="submit"
            disabled={saving || !title.trim() || !content.trim()}
            className={`px-6 py-2 rounded-lg ${
              saving || !title.trim() || !content.trim()
                ? 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600'
            } text-white`}
          >
            {saving ? 'Saving...' : 'Save Post'}
          </button>
        </form>
      ) : (
        <div className="prose dark:prose-invert max-w-none">
          <h1>{title}</h1>
          <div className="flex gap-2 mb-4">
            {tags.split(',').map(tag => tag.trim()).filter(Boolean).map(tag => (
              <span key={tag} className="px-2 py-1 bg-gray-100 rounded-full text-sm">
                {tag}
              </span>
            ))}
          </div>
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>
      )}
    </div>
  );
};

export default MarkdownEditor; 