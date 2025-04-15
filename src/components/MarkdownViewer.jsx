import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { useParams, Link, useNavigate } from 'react-router-dom';

const MarkdownViewer = ({ posts, onDelete }) => {
  const [content, setContent] = useState('');
  const { slug } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    // Try to get content from localStorage first
    const savedContent = localStorage.getItem(`post-${slug}`);
    if (savedContent) {
      setContent(savedContent);
    } else {
      // Fallback to fetching from file
      fetch(`/posts/${slug}.md`)
        .then(res => res.text())
        .then(text => setContent(text));
    }
  }, [slug]);

  const post = posts.find(p => p.slug === slug);
  const readingTime = Math.ceil(content.split(/\s+/).length / 200);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      const success = await onDelete(slug);
      if (success) {
        navigate('/');
      } else {
        alert('Failed to delete post');
      }
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4">
      <div className="flex justify-between items-center mb-6">
        <Link to="/" className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200">
          ← Back to Posts
        </Link>
        {post && (
          <div className="flex gap-2">
            <Link
              to={`/edit/${post.slug}`}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
            >
              Edit
            </Link>
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600"
            >
              Delete
            </button>
          </div>
        )}
      </div>
      {post && (
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">{post.title}</h2>
          <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
            <p>By {post.author}</p>
            <span>•</span>
            <p>{post.date}</p>
            <span>•</span>
            <p>{readingTime} min read</p>
          </div>
          <div className="flex gap-2 mb-6">
            {post.tags.map(tag => (
              <span 
                key={tag}
                className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}
      <div className="prose dark:prose-invert max-w-none">
        <ReactMarkdown>{content}</ReactMarkdown>
      </div>
    </div>
  );
};

export default MarkdownViewer;
