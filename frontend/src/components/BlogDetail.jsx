import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const BlogDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Get logged-in user data
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }

    // Fetch blog post
    fetchBlogPost();
  }, [id]);

  const fetchBlogPost = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:8000/blog/posts/${id}/`);
      const data = await response.json();
      
      if (data.success) {
        setBlog(data.post);
      } else {
        toast.error('Blog post not found');
        navigate('/blog');
      }
    } catch (error) {
      console.error('Error fetching blog post:', error);
      toast.error('Failed to load blog post');
      navigate('/blog');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const isAuthor = user && blog && user.email === blog.authorEmail;

  const handleEdit = () => {
    navigate(`/blog/edit/${id}`);
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this blog post?')) {
      try {
        const response = await fetch(`http://localhost:8000/blog/posts/${id}/`, {
          method: 'DELETE',
        });
        
        if (response.ok) {
          toast.success('Blog post deleted successfully');
          navigate('/blog');
        } else {
          toast.error('Failed to delete blog post');
        }
      } catch (error) {
        console.error('Error deleting blog post:', error);
        toast.error('Failed to delete blog post');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-sky-50 pt-20 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-sky-50 pt-20 flex justify-center items-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Blog post not found</h2>
          <Link to="/blog" className="text-indigo-600 hover:text-indigo-800">
            ← Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-sky-50 pt-20 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link 
            to="/blog" 
            className="inline-flex items-center text-indigo-600 hover:text-indigo-800 font-medium"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Blog
          </Link>
        </div>

        {/* Blog Post */}
        <article className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Cover Image */}
          {blog.image && (
            <div className="h-64 md:h-96 overflow-hidden">
              <img 
                src={blog.image} 
                alt={blog.title} 
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="p-8">
            {/* Header */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <span className="px-3 py-1 bg-indigo-100 text-indigo-800 text-sm font-medium rounded-full">
                    {blog.category}
                  </span>
                  <span className="text-gray-500 text-sm">
                    {blog.readTime} min read
                  </span>
                </div>
                
                {/* Edit/Delete buttons for author */}
                {isAuthor && (
                  <div className="flex space-x-2">
                    <button
                      onClick={handleEdit}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={handleDelete}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>

              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {blog.title}
              </h1>

              {/* Author Info */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="h-12 w-12 rounded-full bg-indigo-200 flex items-center justify-center text-indigo-700 font-bold text-lg">
                    {blog.author.charAt(0)}
                  </div>
                  <div className="ml-3">
                    <p className="text-lg font-medium text-gray-900">{blog.author}</p>
                    <p className="text-sm text-gray-500">{blog.authorRole}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Published</p>
                  <p className="text-sm font-medium text-gray-700">
                    {formatDate(blog.date)}
                  </p>
                </div>
              </div>
            </div>

            {/* Tags */}
            {blog.tags && blog.tags.length > 0 && (
              <div className="mb-6">
                <div className="flex flex-wrap gap-2">
                  {blog.tags.map((tag, index) => (
                    <span 
                      key={index}
                      className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Content */}
            <div className="prose prose-lg max-w-none">
              <div className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                {blog.content}
              </div>
            </div>

            {/* Footer */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  Last updated: {formatDate(blog.date)}
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-500">Share:</span>
                  <button 
                    onClick={() => navigator.clipboard.writeText(window.location.href)}
                    className="text-indigo-600 hover:text-indigo-800 text-sm"
                  >
                    Copy Link
                  </button>
                </div>
              </div>
            </div>
          </div>
        </article>

        {/* Related Articles or CTA */}
        <div className="mt-12 bg-indigo-600 rounded-xl p-8 text-center text-white">
          <h3 className="text-2xl font-bold mb-3">Want to Share Your Knowledge?</h3>
          <p className="mb-6">
            Join our community of writers and share your insights with fellow students and faculty.
          </p>
          <Link 
            to="/blog/write"
            className="inline-block px-6 py-3 bg-white text-indigo-700 font-medium rounded-lg hover:bg-indigo-50 transition-all"
          >
            Write an Article
          </Link>
        </div>
      </div>
      <ToastContainer position="bottom-right" />
    </div>
  );
};

export default BlogDetail;