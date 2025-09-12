import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EditBlog = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [newTag, setNewTag] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: '',
    coverImage: null,
    authorRole: '',
    estimatedReadTime: 5,
    tags: []
  });

  const categories = [
    'Project Ideas',
    'Machine Learning',
    'Web Development',
    'Mobile Development',
    'IoT & Hardware',
    'Data Science',
    'Artificial Intelligence',
    'Blockchain',
    'Game Development',
    'Research',
    'Collaboration',
    'Career',
    'Tutorial',
    'Other'
  ];

  useEffect(() => {
    // Get user data from localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    } else {
      toast.error('Please log in to edit blog posts');
      navigate('/login');
      return;
    }

    // Fetch blog post data
    fetchBlogPost();
  }, [id, navigate]);

  const fetchBlogPost = async () => {
    try {
      const response = await fetch(`http://localhost:8000/blog/posts/${id}/`);
      const data = await response.json();
      
      if (data.success) {
        const blog = data.post;
        
        // Check if user is the author
        const userData = JSON.parse(localStorage.getItem('user'));
        if (userData.email !== blog.authorEmail) {
          toast.error('You can only edit your own blog posts');
          navigate('/blog');
          return;
        }

        // Populate form with existing data
        setFormData({
          title: blog.title,
          content: blog.content,
          category: blog.category,
          coverImage: null, // Will be handled separately
          authorRole: blog.authorRole,
          estimatedReadTime: blog.readTime,
          tags: blog.tags || []
        });
      } else {
        toast.error('Blog post not found');
        navigate('/blog');
      }
    } catch (error) {
      console.error('Error fetching blog post:', error);
      toast.error('Failed to load blog post');
      navigate('/blog');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      const file = e.target.files[0];
      const maxSize = 5 * 1024 * 1024; // 5MB
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
      
      if (file.size > maxSize) {
        toast.error('Image must be less than 5MB');
        return;
      }
      if (!allowedTypes.includes(file.type)) {
        toast.error('Only JPEG, PNG, and WebP images are allowed');
        return;
      }
      
      setFormData(prev => ({
        ...prev,
        coverImage: file
      }));
    }
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.title.trim()) {
        toast.error('Please enter a title');
        return;
    }
    if (!formData.content.trim()) {
        toast.error('Please enter content');
        return;
    }
    if (!formData.category) {
        toast.error('Please select a category');
        return;
    }

    setLoading(true);

    try {
        const submitData = new FormData();
        submitData.append('title', formData.title);
        submitData.append('content', formData.content);
        submitData.append('category', formData.category);
        submitData.append('authorRole', formData.authorRole);
        submitData.append('estimatedReadTime', formData.estimatedReadTime);
        submitData.append('tags', JSON.stringify(formData.tags));
        
        if (formData.coverImage) {
        submitData.append('coverImage', formData.coverImage);
        }

        // Debug: Log what we're sending
        console.log('Sending update request with data:');
        for (let [key, value] of submitData.entries()) {
        console.log(key, value);
        }

        const response = await fetch(`http://localhost:8000/blog/posts/${id}/`, {
        method: 'PUT',
        body: submitData,
        // DO NOT set Content-Type header - let browser set it for FormData
        });

        const responseText = await response.text();
        console.log('Response text:', responseText);
        
        if (!response.ok) {
        throw new Error(responseText);
        }
        
        const data = JSON.parse(responseText);

        if (data.success) {
        setLoading(false);
        toast.success('Blog post updated successfully!');
        setTimeout(() => {
            navigate(`/blog/${id}`);
        }, 2000);
        } else {
        throw new Error(data.error || 'Failed to update blog post');
        }
    } catch (error) {
        setLoading(false);
        console.error('Update error:', error);
        toast.error(error.message || 'Failed to update blog post');
    }
    };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 pt-20">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Edit Blog Post</h1>
          <p className="mt-2 text-gray-600">Update your blog post content and settings</p>
        </div>
      </div>
      
      <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <form onSubmit={handleSubmit}>
              <div className="space-y-8">
                {/* Blog Information */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Blog Information</h3>
                  <div className="space-y-6">
                    {/* Title */}
                    <div>
                      <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                        Title <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Enter an engaging title for your post"
                        required
                      />
                    </div>

                    {/* Category */}
                    <div>
                      <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                        Category <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="category"
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        required
                      >
                        <option value="">Select a category</option>
                        {categories.map((category) => (
                          <option key={category} value={category}>{category}</option>
                        ))}
                      </select>
                    </div>

                    {/* Content */}
                    <div>
                      <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                        Content <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        id="content"
                        name="content"
                        rows={12}
                        value={formData.content}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Write your blog content here..."
                        required
                      />
                    </div>

                    {/* Cover Image */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Update Cover Image <span className="text-gray-500">(Optional)</span>
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="w-full"
                      />
                      {formData.coverImage && (
                        <div className="mt-2">
                          <img
                            src={URL.createObjectURL(formData.coverImage)}
                            alt="Cover preview"
                            className="h-32 w-auto rounded-lg"
                          />
                        </div>
                      )}
                    </div>

                    {/* Tags */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tags <span className="text-gray-500">(Optional)</span>
                      </label>
                      
                      <div className="flex gap-2 mb-3">
                        <input
                          type="text"
                          value={newTag}
                          onChange={(e) => setNewTag(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                          placeholder="Add a tag"
                        />
                        <button
                          type="button"
                          onClick={addTag}
                          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                        >
                          Add
                        </button>
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        {formData.tags.map(tag => (
                          <span 
                            key={tag} 
                            className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800"
                          >
                            {tag}
                            <button
                              type="button"
                              onClick={() => removeTag(tag)}
                              className="ml-2 inline-flex items-center p-0.5 rounded-full text-indigo-400 hover:bg-indigo-200 hover:text-indigo-600"
                            >
                              <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                              </svg>
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Author Information */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Author Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="authorRole" className="block text-sm font-medium text-gray-700 mb-1">
                        Role/Position
                      </label>
                      <input
                        type="text"
                        id="authorRole"
                        name="authorRole"
                        value={formData.authorRole}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="e.g., Final Year Student, Professor"
                      />
                    </div>
                    <div>
                      <label htmlFor="estimatedReadTime" className="block text-sm font-medium text-gray-700 mb-1">
                        Estimated Read Time (minutes)
                      </label>
                      <input
                        type="number"
                        id="estimatedReadTime"
                        name="estimatedReadTime"
                        min="1"
                        max="60"
                        value={formData.estimatedReadTime}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Submit Buttons */}
                <div className="pt-6 flex gap-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                  >
                    {loading ? 'Updating...' : 'Update Blog Post'}
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate(`/blog/${id}`)}
                    className="px-6 py-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
      <ToastContainer position="bottom-right" />
    </div>
  );
};

export default EditBlog;