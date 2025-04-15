import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import MarkdownViewer from './components/MarkdownViewer';
import PostList from './components/PostList';
import NotFound from './components/NotFound';
import MarkdownEditor from './components/MarkdownEditor';
import { Link } from 'react-router-dom';
import ThemeToggle from './components/ThemeToggle';

function App() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const savedPosts = localStorage.getItem('posts-metadata');
    if (savedPosts) {
      setPosts(JSON.parse(savedPosts));
    } else {
      fetch('/posts/metadata.json')
        .then(res => res.json())
        .then(data => setPosts(data));
    }
  }, []);

  const handleSavePost = async (post, isEdit = false) => {
    try {
      localStorage.setItem(`post-${post.slug}`, post.content);

      const updatedPosts = isEdit 
        ? posts.map(p => p.slug === post.slug ? post : p)
        : [...posts, post];
        
      localStorage.setItem('posts-metadata', JSON.stringify(updatedPosts));
      setPosts(updatedPosts);
      return true;
    } catch (error) {
      console.error('Failed to save post:', error);
      return false;
    }
  };

  const handleDeletePost = async (slug) => {
    try {
      localStorage.removeItem(`post-${slug}`);
      const updatedPosts = posts.filter(p => p.slug !== slug);
      localStorage.setItem('posts-metadata', JSON.stringify(updatedPosts));
      setPosts(updatedPosts);
      return true;
    } catch (error) {
      console.error('Failed to delete post:', error);
      return false;
    }
  };

  return (
    <Router>
      <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <header className="text-center mb-10 pb-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex justify-end mb-4">
              <ThemeToggle />
            </div>
            <h1 className="text-4xl font-bold text-gray-800 dark:text-white">My Blog</h1>
            <nav className="mt-4">
              <Link to="/new" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                Create New Post
              </Link>
            </nav>
          </header>
          <main>
            <Routes>
              <Route path="/" element={<PostList posts={posts} onDelete={handleDeletePost} />} />
              <Route path="/post/:slug" element={
                <MarkdownViewer 
                  posts={posts} 
                  onDelete={handleDeletePost} 
                />
              } />
              <Route path="/new" element={<MarkdownEditor onSave={handleSavePost} />} />
              <Route path="/edit/:slug" element={<MarkdownEditor onSave={handleSavePost} posts={posts} />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;
