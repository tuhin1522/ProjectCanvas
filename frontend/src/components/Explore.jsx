import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Explore = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    department: '',
    year: '',
    technology: '',
  });

  // Mock project data - replace with actual API call
  useEffect(() => {
    // Simulating API fetch
    setTimeout(() => {
      setProjects([
        {
          id: 1,
          title: "Smart Traffic Analysis System",
          description: "A machine learning approach to optimize traffic flow in urban environments using camera data.",
          technologies: ["Python", "TensorFlow", "ML"],
          department: "Computer Science & Engineering",
          year: "2023",
          thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3"
        },
        {
          id: 2,
          title: "Virtual Study Group Platform",
          description: "A collaborative learning platform connecting students for virtual study sessions and resources sharing.",
          technologies: ["JavaScript", "React", "Firebase"],
          department: "Computer Science & Engineering",
          year: "2023",
          thumbnail: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?ixlib=rb-4.0.3"
        },
        {
          id: 3,
          title: "Smart Campus Energy Monitor",
          description: "IoT sensors and dashboard for real-time tracking of energy consumption across university buildings.",
          technologies: ["Arduino", "IoT", "C++"],
          department: "Electrical & Electronic Engineering",
          year: "2023",
          thumbnail: "https://images.unsplash.com/photo-1581093458791-9cceeb0bee68?ixlib=rb-4.0.3"
        },
        {
          id: 4,
          title: "Urban Planning Visualization Tool",
          description: "3D visualization system for urban planning that simulates the impact of new constructions on the city landscape.",
          technologies: ["Unity", "C#", "3D Modeling"],
          department: "Architecture",
          year: "2022",
          thumbnail: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3"
        },
        {
          id: 5,
          title: "Student Mental Health Analysis",
          description: "A research study on factors affecting student mental health with data visualization and analysis.",
          technologies: ["R", "Statistics", "Data Visualization"],
          department: "Psychology",
          year: "2022",
          thumbnail: "https://images.unsplash.com/photo-1573497620053-ea5300f94f21?ixlib=rb-4.0.3"
        },
        {
          id: 6,
          title: "Sustainable Building Materials Database",
          description: "A comprehensive database of sustainable building materials with environmental impact analysis.",
          technologies: ["MySQL", "PHP", "Bootstrap"],
          department: "Civil Engineering",
          year: "2021",
          thumbnail: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?ixlib=rb-4.0.3"
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  // Filter departments and years for dropdowns
  const departments = [...new Set(projects.map(project => project.department))];
  const years = [...new Set(projects.map(project => project.year))];
  
  // All technologies across all projects
  const allTechnologies = [...new Set(projects.flatMap(project => project.technologies))];

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value
    });
  };

  // Apply filters to projects
  const filteredProjects = projects.filter(project => {
    return (
      (filters.search === '' || 
        project.title.toLowerCase().includes(filters.search.toLowerCase()) || 
        project.description.toLowerCase().includes(filters.search.toLowerCase())) &&
      (filters.department === '' || project.department === filters.department) &&
      (filters.year === '' || project.year === filters.year) &&
      (filters.technology === '' || project.technologies.includes(filters.technology))
    );
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-sky-50 pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-indigo-900 mb-4">Explore University Projects</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Discover innovative work from students across departments, find inspiration, and connect with like-minded peers.
          </p>
        </div>
        
        {/* Filters */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                Search Projects
              </label>
              <input
                type="text"
                id="search"
                name="search"
                value={filters.search}
                onChange={handleFilterChange}
                placeholder="Search by title or description"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-indigo-200 focus:border-indigo-500"
              />
            </div>
            
            {/* Department Filter */}
            <div>
              <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">
                Department
              </label>
              <select
                id="department"
                name="department"
                value={filters.department}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-indigo-200 focus:border-indigo-500"
              >
                <option value="">All Departments</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
            
            {/* Year Filter */}
            <div>
              <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-1">
                Year
              </label>
              <select
                id="year"
                name="year"
                value={filters.year}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-indigo-200 focus:border-indigo-500"
              >
                <option value="">All Years</option>
                {years.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
            
            {/* Technology Filter */}
            <div>
              <label htmlFor="technology" className="block text-sm font-medium text-gray-700 mb-1">
                Technology
              </label>
              <select
                id="technology"
                name="technology"
                value={filters.technology}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-indigo-200 focus:border-indigo-500"
              >
                <option value="">All Technologies</option>
                {allTechnologies.map(tech => (
                  <option key={tech} value={tech}>{tech}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
        
        {/* Projects Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : filteredProjects.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map(project => (
              <div 
                key={project.id} 
                className="bg-white rounded-xl overflow-hidden shadow-lg border border-gray-100 hover:shadow-xl transition-all"
              >
                <div className="h-48 bg-indigo-100 overflow-hidden">
                  <img 
                    src={project.thumbnail} 
                    alt={project.title} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.technologies.map((tech, index) => {
                      // Generate different colored tags
                      const colors = [
                        "bg-blue-100 text-blue-800", 
                        "bg-green-100 text-green-800",
                        "bg-purple-100 text-purple-800",
                        "bg-yellow-100 text-yellow-800",
                        "bg-red-100 text-red-800",
                        "bg-indigo-100 text-indigo-800"
                      ];
                      const colorClass = colors[index % colors.length];
                      
                      return (
                        <span 
                          key={tech} 
                          className={`px-2 py-1 ${colorClass} text-xs font-medium rounded`}
                        >
                          {tech}
                        </span>
                      );
                    })}
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{project.title}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{project.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">{project.department} • {project.year}</span>
                    <Link 
                      to={`/projects/${project.id}`}
                      className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                    >
                      View Project →
                    </Link>
                  </div>
                </div>
              </div>
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
            <h3 className="mt-2 text-lg font-medium text-gray-900">No projects found</h3>
            <p className="mt-1 text-gray-500">Try adjusting your search or filter criteria.</p>
          </div>
        )}
        
        {/* Pagination (simplified) */}
        {filteredProjects.length > 0 && (
          <div className="mt-8 flex justify-center">
            <nav className="inline-flex rounded-md shadow">
              <button
                className="px-3 py-1 rounded-l-md border border-gray-300 bg-white text-gray-500 hover:bg-gray-50"
              >
                Previous
              </button>
              <button
                className="px-3 py-1 border-t border-b border-gray-300 bg-white text-indigo-600"
              >
                1
              </button>
              <button
                className="px-3 py-1 border-t border-b border-gray-300 bg-white text-gray-500 hover:bg-gray-50"
              >
                2
              </button>
              <button
                className="px-3 py-1 border-t border-b border-gray-300 bg-white text-gray-500 hover:bg-gray-50"
              >
                3
              </button>
              <button
                className="px-3 py-1 rounded-r-md border border-gray-300 bg-white text-gray-500 hover:bg-gray-50"
              >
                Next
              </button>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
};

export default Explore;