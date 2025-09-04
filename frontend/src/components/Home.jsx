import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-sky-50 pt-16">
      {/* Hero Section */}
      <section className="pt-20 pb-12 md:pt-32 md:pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-indigo-900 leading-tight">
              Showcase University Projects <br className="hidden md:block" />
              <span className="text-blue-600">With Intelligent Analysis</span>
            </h1>
            <p className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto">
              ProjectCanvas brings academic innovation to light. Upload, analyze, and discover 
              university projects in one centralized platform.
            </p>
            <div className="mt-10 flex flex-col md:flex-row justify-center gap-4">
              <Link 
                to="/signup"
                className="px-8 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Join ProjectCanvas
              </Link>
              <Link 
                to="/explore"
                className="px-8 py-3 border border-indigo-300 bg-white text-indigo-700 font-medium rounded-lg hover:bg-indigo-50 transition-all"
              >
                Explore Projects
              </Link>
            </div>
          </div>
          
          {/* Hero Image */}
          <div className="mt-12 md:mt-16 flex justify-center">
            <div className="rounded-xl shadow-2xl bg-white p-2 w-full max-w-5xl">
              <img
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1200&q=80"
                alt="Students collaborating on projects"
                className="w-full h-auto rounded-lg object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Empowering Academic Innovation
            </h2>
            <p className="mt-4 text-xl text-gray-600">
              Turning scattered project work into a valuable institutional resource
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-indigo-50 rounded-xl p-8 shadow-md hover:shadow-lg transition-all">
              <div className="w-12 h-12 bg-indigo-600 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Project Showcase</h3>
              <p className="text-gray-600">
                Upload project files and get an automatically generated showcase page with tech tags, documentation, and interactive previews.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-blue-50 rounded-xl p-8 shadow-md hover:shadow-lg transition-all">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Similarity Analysis</h3>
              <p className="text-gray-600">
                Discover related projects through our intelligent similarity detection system that analyzes code structure and documentation.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-emerald-50 rounded-xl p-8 shadow-md hover:shadow-lg transition-all">
              <div className="w-12 h-12 bg-emerald-600 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Department Analytics</h3>
              <p className="text-gray-600">
                Track technology trends, popular project themes, and student collaboration patterns across the department.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              How ProjectCanvas Works
            </h2>
            <p className="mt-4 text-xl text-gray-600">
              A simple process to showcase and discover academic excellence
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {/* Step 1 */}
            <div className="relative">
              <div className="bg-white rounded-xl p-8 shadow-md relative z-10">
                <div className="w-12 h-12 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center mb-6 text-xl font-bold">
                  1
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Upload Project</h3>
                <p className="text-gray-600">
                  Submit your project files through our simple upload interface
                </p>
              </div>
              {/* Connector */}
              <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-indigo-300"></div>
            </div>

            {/* Step 2 */}
            <div className="relative">
              <div className="bg-white rounded-xl p-8 shadow-md relative z-10">
                <div className="w-12 h-12 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center mb-6 text-xl font-bold">
                  2
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Automatic Analysis</h3>
                <p className="text-gray-600">
                  Our system analyzes your code, extracts tech tags and creates documentation
                </p>
              </div>
              {/* Connector */}
              <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-indigo-300"></div>
            </div>

            {/* Step 3 */}
            <div className="relative">
              <div className="bg-white rounded-xl p-8 shadow-md relative z-10">
                <div className="w-12 h-12 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center mb-6 text-xl font-bold">
                  3
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Project Showcase</h3>
                <p className="text-gray-600">
                  Get a beautiful project page with interactive features and similarity metrics
                </p>
              </div>
              {/* Connector */}
              <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-indigo-300"></div>
            </div>

            {/* Step 4 */}
            <div>
              <div className="bg-white rounded-xl p-8 shadow-md">
                <div className="w-12 h-12 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center mb-6 text-xl font-bold">
                  4
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Discover & Collaborate</h3>
                <p className="text-gray-600">
                  Find related projects, connect with peers, and build on existing knowledge
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Project Showcase Preview */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Featured University Projects
            </h2>
            <p className="mt-4 text-xl text-gray-600">
              Discover innovative work from across departments
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Project Card 1 */}
            <div className="bg-white rounded-xl overflow-hidden shadow-lg border border-gray-100 hover:shadow-xl transition-all">
              <div className="h-48 bg-indigo-100 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3" 
                  alt="Machine Learning Project" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <div className="flex gap-2 mb-4">
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">Python</span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">TensorFlow</span>
                  <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded">ML</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">Smart Traffic Analysis System</h3>
                <p className="text-gray-600 text-sm mb-4">A machine learning approach to optimize traffic flow in urban environments using camera data.</p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Computer Science • 2023</span>
                  <Link to="/projects/1" className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">View Project →</Link>
                </div>
              </div>
            </div>

            {/* Project Card 2 */}
            <div className="bg-white rounded-xl overflow-hidden shadow-lg border border-gray-100 hover:shadow-xl transition-all">
              <div className="h-48 bg-blue-100 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1515879218367-8466d910aaa4?ixlib=rb-4.0.3" 
                  alt="Web Development Project" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <div className="flex gap-2 mb-4">
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded">JavaScript</span>
                  <span className="px-2 py-1 bg-cyan-100 text-cyan-800 text-xs font-medium rounded">React</span>
                  <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded">Firebase</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">Virtual Study Group Platform</h3>
                <p className="text-gray-600 text-sm mb-4">A collaborative learning platform connecting students for virtual study sessions and resources sharing.</p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Web Development • 2023</span>
                  <Link to="/projects/2" className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">View Project →</Link>
                </div>
              </div>
            </div>

            {/* Project Card 3 */}
            <div className="bg-white rounded-xl overflow-hidden shadow-lg border border-gray-100 hover:shadow-xl transition-all">
              <div className="h-48 bg-green-100 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1581093458791-9cceeb0bee68?ixlib=rb-4.0.3" 
                  alt="IoT Project" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <div className="flex gap-2 mb-4">
                  <span className="px-2 py-1 bg-emerald-100 text-emerald-800 text-xs font-medium rounded">Arduino</span>
                  <span className="px-2 py-1 bg-indigo-100 text-indigo-800 text-xs font-medium rounded">IoT</span>
                  <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs font-medium rounded">C++</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">Smart Campus Energy Monitor</h3>
                <p className="text-gray-600 text-sm mb-4">IoT sensors and dashboard for real-time tracking of energy consumption across university buildings.</p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Electrical Engineering • 2023</span>
                  <Link to="/projects/3" className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">View Project →</Link>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-12 text-center">
            <Link 
              to="/explore"
              className="px-8 py-3 bg-indigo-50 text-indigo-700 font-medium rounded-lg hover:bg-indigo-100 transition-all"
            >
              Explore All Projects
            </Link>
          </div>
        </div>
      </section>

      {/* Faculty & Department Benefits */}
      <section className="py-20 bg-gradient-to-r from-indigo-600 to-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Transforming Academic Output into Institutional Value
              </h2>
              <p className="text-xl text-indigo-100 mb-8">
                ProjectCanvas helps departments showcase student excellence while providing valuable analytics on academic trends.
              </p>
              
              <ul className="space-y-4">
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-indigo-200 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Track technology adoption trends across departments</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-indigo-200 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Identify similar projects to encourage collaboration</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-indigo-200 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Showcase departmental achievements to prospective students</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-indigo-200 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Provide students with professional portfolios for employers</span>
                </li>
              </ul>
            </div>
            
            <div className="flex justify-center">
              <img 
                src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3" 
                alt="Faculty reviewing projects" 
                className="rounded-lg shadow-2xl max-w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Join Call to Action */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Ready to Showcase Your Academic Projects?
          </h2>
          <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto">
            Join ProjectCanvas today to share your work, find inspiration, and collaborate with peers across departments.
          </p>
          <div className="flex flex-col md:flex-row justify-center gap-4">
            <Link
              to="/signup"
              className="px-8 py-4 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-all shadow-lg hover:shadow-xl"
            >
              Sign Up Now
            </Link>
            <Link
              to="/about"
              className="px-8 py-4 border border-indigo-300 text-indigo-700 font-medium rounded-lg hover:bg-indigo-50 transition-all"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">ProjectCanvas</h3>
              <p className="text-gray-400">
                A platform for showcasing and analyzing university projects across departments.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/explore" className="hover:text-white transition-colors">Explore Projects</Link></li>
                <li><Link to="/upload" className="hover:text-white transition-colors">Upload Project</Link></li>
                <li><Link to="/analytics" className="hover:text-white transition-colors">Department Analytics</Link></li>
                <li><Link to="/faculty" className="hover:text-white transition-colors">Faculty Dashboard</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/blog" className="hover:text-white transition-colors">Blog</Link></li>
                <li><Link to="/documentation" className="hover:text-white transition-colors">Documentation</Link></li>
                <li><Link to="/guides" className="hover:text-white transition-colors">User Guides</Link></li>
                <li><Link to="/faq" className="hover:text-white transition-colors">FAQs</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">University</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/departments" className="hover:text-white transition-colors">Departments</Link></li>
                <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
                <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
                <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-400">
            <p>© {new Date().getFullYear()} ProjectCanvas - A University Project Showcase & Analysis Platform</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;