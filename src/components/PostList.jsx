import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const PostList = ({ posts }) => {
  const [selectedTag, setSelectedTag] = useState(null);
  
  const allTags = [...new Set(posts.flatMap(post => post.tags))];
  const filteredPosts = selectedTag 
    ? posts.filter(post => post.tags.includes(selectedTag))
    : posts;

  return (
    <div className="max-w-3xl mx-auto px-4">
      <h2 className="text-3xl font-semibold text-gray-800 dark:text-gray-100 mb-8">Blog Posts</h2>
      
      <div className="flex gap-2 mb-8">
        {allTags.map(tag => (
          <button
            key={tag}
            onClick={() => setSelectedTag(tag === selectedTag ? null : tag)}
            className={`px-3 py-1 rounded-full text-sm transition-colors ${
              tag === selectedTag
                ? 'bg-gray-800 text-white dark:bg-gray-100 dark:text-gray-900'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      <ul className="space-y-6">
        {filteredPosts.map(post => (
          <li key={post.slug} className="border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-shadow bg-white dark:bg-gray-800">
            <Link to={`/post/${post.slug}`} className="block p-6">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">{post.title}</h3>
              <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-3">
                <p>By {post.author}</p>
                <span>•</span>
                <p>{post.date}</p>
              </div>
              <div className="flex gap-2">
                {post.tags.map(tag => (
                  <span 
                    key={tag}
                    className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-xs"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PostList; 