import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Blog = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    category: '',
  });
  
  // Fetch blog posts from API
  useEffect(() => {
    fetchBlogPosts();
  }, [filters]);

  const fetchBlogPosts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      if (filters.search) params.append('search', filters.search);
      if (filters.category) params.append('category', filters.category);
      
      const response = await fetch(`http://localhost:8000/blog/posts/?${params}`);
      const data = await response.json();
      
      if (data.success) {
        setArticles(data.posts);
      } else {
        console.error('Failed to fetch blog posts:', data.error);
        // Fall back to mock data if API fails
        setMockData();
      }
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      // Fall back to mock data if API fails
      setMockData();
    } finally {
      setLoading(false);
    }
  };

  // Fallback mock data function
  const setMockData = () => {
    setArticles([
      {
        id: 1,
        title: "How to Structure Your First Machine Learning Project",
        author: "Dr. Sarah Chen",
        authorRole: "Associate Professor",
        category: "Machine Learning",
        date: "2023-09-15T00:00:00Z",
        readTime: 8,
        image: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?ixlib=rb-4.0.3"
      },
      {
        id: 2,
        title: "Building Accessible Web Applications: A Student's Guide",
        author: "James Wilson",
        authorRole: "Final Year Student",
        category: "Web Development",
        date: "2023-08-22T00:00:00Z",
        readTime: 6,
        image: "https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3"
      },
      {
        id: 3,
        title: "From Classroom to Production: Deploying Your First API",
        author: "Miguel Rodriguez",
        authorRole: "Graduate Assistant",
        category: "Backend Development",
        date: "2023-07-30T00:00:00Z",
        readTime: 10,
        image: "https://images.unsplash.com/photo-1573495612937-f978cc14e431?ixlib=rb-4.0.3"
      },
      {
        id: 4,
        title: "Cross-Department Collaboration: Engineering Meets Design",
        author: "Prof. Emily Parker & Prof. David Kim",
        authorRole: "Faculty Members",
        category: "Collaboration",
        date: "2023-06-18T00:00:00Z",
        readTime: 7,
        image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3"
      },
      {
        id: 5,
        title: "Research Paper to Software: Turning Academic Ideas into Working Code",
        author: "Dr. Alan Johnson",
        authorRole: "Research Supervisor",
        category: "Research",
        date: "2023-05-09T00:00:00Z",
        readTime: 12,
        image: "https://images.unsplash.com/photo-1532622785990-d2c36a76f5a6?ixlib=rb-4.0.3"
      },
      {
        id: 6,
        title: "Optimizing Your GitHub Profile for Employers",
        author: "Lisa Zhang",
        authorRole: "Career Advisor",
        category: "Career",
        date: "2023-04-14T00:00:00Z",
        readTime: 5,
        image: "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?ixlib=rb-4.0.3"
      }
    ]);
  };

  // Get unique categories for filter
  const categories = [...new Set(articles.map(article => article.category))];

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value
    });
  };

  // Apply filters to articles (for client-side filtering when needed)
  const filteredArticles = articles.filter(article => {
    return (
      (filters.search === '' || 
        article.title.toLowerCase().includes(filters.search.toLowerCase())) &&
      (filters.category === '' || article.category === filters.category)
    );
  });

  // Format date helper
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-sky-50 pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-indigo-900 mb-4">ProjectCanvas Blog</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Insights, tutorials, and stories from students, faculty, and the wider academic community.
          </p>
        </div>
        
        {/* Filters */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search */}
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                Search Articles
              </label>
              <input
                type="text"
                id="search"
                name="search"
                value={filters.search}
                onChange={handleFilterChange}
                placeholder="Search by title"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-indigo-200 focus:border-indigo-500"
              />
            </div>
            
            {/* Category Filter */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                id="category"
                name="category"
                value={filters.category}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-indigo-200 focus:border-indigo-500"
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
        
        {/* Featured Article */}
        {!loading && articles.length > 0 && (
          <div className="mb-12">
            <Link to={`/blog/${articles[0].id}`} className="block">
              <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all">
                <div className="grid md:grid-cols-2 gap-0">
                  <div className="h-64 md:h-auto overflow-hidden">
                    <img 
                      src={articles[0].image} 
                      alt={articles[0].title} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-8 flex flex-col justify-center">
                    <div className="flex items-center mb-4">
                      <span className="px-3 py-1 bg-indigo-100 text-indigo-800 text-xs font-medium rounded-full">
                        {articles[0].category}
                      </span>
                      <span className="ml-2 text-gray-500 text-sm">
                        {formatDate(articles[0].date)}
                      </span>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">{articles[0].title}</h2>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-indigo-200 flex items-center justify-center text-indigo-700 font-bold text-xl">
                          {articles[0].author.charAt(0)}
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">{articles[0].author}</p>
                          <p className="text-xs text-gray-500">{articles[0].authorRole}</p>
                        </div>
                      </div>
                      <span className="text-sm text-gray-500">{articles[0].readTime} min read</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        )}
        
        {/* Articles Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : articles.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Skip the first article as it's the featured one */}
            {articles.slice(1).map(article => (
              <Link to={`/blog/${article.id}`} key={article.id} className="block">
                <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all h-full flex flex-col">
                  <div className="h-48 overflow-hidden">
                    <img 
                      src={article.image} 
                      alt={article.title} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-6 flex flex-col flex-grow">
                    <div className="flex items-center mb-3">
                      <span className="px-3 py-1 bg-indigo-100 text-indigo-800 text-xs font-medium rounded-full">
                        {article.category}
                      </span>
                      <span className="ml-2 text-gray-500 text-xs">
                        {formatDate(article.date)}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold mb-3 text-gray-900">{article.title}</h3>
                    <div className="flex items-center justify-between mt-auto">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-indigo-200 flex items-center justify-center text-indigo-700 font-bold">
                          {article.author.charAt(0)}
                        </div>
                        <div className="ml-2">
                          <p className="text-xs font-medium text-gray-900">{article.author}</p>
                          <p className="text-xs text-gray-500">{article.authorRole}</p>
                        </div>
                      </div>
                      <span className="text-xs text-gray-500">{article.readTime} min read</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-xl shadow-md">
            <svg 
              className="mx-auto h-12 w-12 text-gray-400" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
              />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900">No articles found</h3>
            <p className="mt-1 text-gray-500">Try adjusting your search criteria or be the first to write an article!</p>
          </div>
        )}
        
        {/* Write Article CTA */}
        <div className="mt-12 bg-indigo-600 rounded-xl p-8 text-center text-white shadow-xl">
          <h3 className="text-2xl font-bold mb-3">Share Your Knowledge</h3>
          <p className="mb-6 max-w-2xl mx-auto">
            Have insights, tutorials, or project ideas to share? Contribute to our community by writing an article.
          </p>
          <Link 
            to="/blog/write"
            className="inline-block px-6 py-3 bg-white text-indigo-700 font-medium rounded-lg hover:bg-indigo-50 transition-all shadow-md"
          >
            Write an Article
          </Link>
        </div>
        
        {/* Statistics Section */}
        {articles.length > 0 && (
          <div className="mt-12 bg-white rounded-xl shadow-md p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">Blog Statistics</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-indigo-600">{articles.length}</div>
                <div className="text-sm text-gray-600">Total Articles</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-indigo-600">{categories.length}</div>
                <div className="text-sm text-gray-600">Categories</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-indigo-600">
                  {Math.round(articles.reduce((sum, article) => sum + article.readTime, 0) / articles.length)}
                </div>
                <div className="text-sm text-gray-600">Avg. Read Time (min)</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Blog;