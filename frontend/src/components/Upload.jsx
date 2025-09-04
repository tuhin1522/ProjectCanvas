import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Upload = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    department: '',
    year: '',
    collaborators: '',
    githubLink: '',
    projectUrl: '',
  });
  
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [previewTech, setPreviewTech] = useState([]);
  const [manualTech, setManualTech] = useState('');
  const [tags, setTags] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  // GitHub Repository Data
  const [fetchingRepo, setFetchingRepo] = useState(false);
  const [repoData, setRepoData] = useState(null);
  const [readmeContent, setReadmeContent] = useState('');
  const [showReadmeEditor, setShowReadmeEditor] = useState(false);
  const [uploadMethod, setUploadMethod] = useState('file'); // 'file' or 'github'

  // Department options (same as in Signup.jsx)
  const departments = [
    'Computer Science & Engineering',
    'Electrical & Electronic Engineering',
    'Civil Engineering',
    'Mechanical Engineering',
    'Architecture',
    'Physics',
    'Mathematics',
    'Chemistry',
    'Business Administration',
    'English',
    'Other',
  ];

  // Year/session options (last 10 years)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => `${currentYear - i}`);

  // Common technologies for auto-suggestions
  const commonTechnologies = [
    'React', 'Angular', 'Vue', 'Node.js', 'Express', 'Django', 'Flask', 
    'Python', 'JavaScript', 'TypeScript', 'Java', 'C#', 'C++', 'PHP', 
    'MySQL', 'MongoDB', 'PostgreSQL', 'Firebase', 'AWS', 'Docker',
    'TensorFlow', 'PyTorch', 'Scikit-learn', 'R', 'MATLAB', 'Arduino',
    'Raspberry Pi', 'IoT', 'Unity', 'Unreal Engine'
  ];

  // Check if GitHub link is valid
  const isValidGithubUrl = (url) => {
    const githubRegex = /^https?:\/\/github\.com\/[a-zA-Z0-9-]+\/[a-zA-Z0-9._-]+\/?$/;
    return githubRegex.test(url);
  };

  // Extract owner and repo name from GitHub URL
  const extractRepoInfo = (url) => {
    const match = url.match(/github\.com\/([^\/]+)\/([^\/]+)/);
    if (match) {
      return { owner: match[1], repo: match[2] };
    }
    return null;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    
    // Clear the error for this field when user starts typing again
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
  };

  const handleUploadMethodChange = (method) => {
    setUploadMethod(method);
    
    // Clear any file-related errors when switching methods
    if (method === 'github' && errors.file) {
      setErrors({
        ...errors,
        file: '',
      });
    }

    // Clear GitHub-related errors when switching to file upload
    if (method === 'file' && errors.githubLink) {
      setErrors({
        ...errors,
        githubLink: '',
      });
    }
  };

  const fetchGithubRepository = async () => {
    if (!formData.githubLink) {
      setErrors({
        ...errors,
        githubLink: 'Please enter a GitHub repository URL',
      });
      return;
    }

    if (!isValidGithubUrl(formData.githubLink)) {
      setErrors({
        ...errors,
        githubLink: 'Please enter a valid GitHub repository URL',
      });
      return;
    }

    setFetchingRepo(true);
    const repoInfo = extractRepoInfo(formData.githubLink);
    
    try {
      // Fetch repository information
      const repoResponse = await fetch(`https://api.github.com/repos/${repoInfo.owner}/${repoInfo.repo}`);
      
      if (!repoResponse.ok) {
        throw new Error('Repository not found or not accessible');
      }
      
      const repoData = await repoResponse.json();
      setRepoData(repoData);
      
      // Auto-fill project title if empty
      if (!formData.title.trim()) {
        setFormData({
          ...formData,
          title: repoData.name,
        });
      }
      
      // Auto-fill project description if empty
      if (!formData.description.trim() && repoData.description) {
        setFormData({
          ...formData,
          description: repoData.description,
        });
      }

      // Fetch languages used in the repository
      const languagesResponse = await fetch(repoData.languages_url);
      if (languagesResponse.ok) {
        const languages = await languagesResponse.json();
        const detectedTechnologies = Object.keys(languages);
        setPreviewTech(detectedTechnologies);
      }

      // Try to fetch the README.md file
      const readmeResponse = await fetch(`https://api.github.com/repos/${repoInfo.owner}/${repoInfo.repo}/contents/README.md`);
      
      if (readmeResponse.ok) {
        const readmeData = await readmeResponse.json();
        const content = atob(readmeData.content); // Base64 decode
        setReadmeContent(content);
        setShowReadmeEditor(true);
      } else {
        // If no README.md found, create a template
        const defaultReadme = `# ${repoData.name}\n\n${repoData.description || ''}\n\n## Overview\n\nThis project was imported from GitHub: ${formData.githubLink}\n\n## Technologies Used\n\n${previewTech.map(tech => `- ${tech}`).join('\n')}\n\n## Installation\n\n\`\`\`\ngit clone ${formData.githubLink}\ncd ${repoData.name}\n# Add installation steps here\n\`\`\`\n\n## Features\n\n- Feature 1\n- Feature 2\n- Feature 3\n\n## Contributors\n\n- ${repoData.owner?.login || 'Project Owner'}\n`;
        
        setReadmeContent(defaultReadme);
        setShowReadmeEditor(true);
      }

      toast.success('Repository information fetched successfully!');
    } catch (error) {
      console.error('Error fetching GitHub repository:', error);
      setErrors({
        ...errors,
        githubLink: error.message || 'Failed to fetch repository information',
      });
    } finally {
      setFetchingRepo(false);
    }
  };

  const handleFileDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (uploadedFile) => {
    if (uploadedFile.size > 50 * 1024 * 1024) { // 50MB limit
      setErrors({
        ...errors,
        file: 'File size exceeds 50MB limit'
      });
      return;
    }
    
    setFile(uploadedFile);
    
    // Mock auto-detecting technologies based on file extension
    const fileName = uploadedFile.name.toLowerCase();
    let detectedTech = [];
    
    if (fileName.endsWith('.zip') || fileName.endsWith('.rar')) {
      // Simulate technology detection from compressed file
      // In a real implementation, this would analyze file contents
      const randomTech = [
        ['React', 'JavaScript', 'Node.js'],
        ['Python', 'Django', 'PostgreSQL'],
        ['Java', 'Spring Boot', 'MySQL'],
        ['Angular', 'TypeScript', 'Express'],
        ['Flutter', 'Dart', 'Firebase']
      ];
      
      detectedTech = randomTech[Math.floor(Math.random() * randomTech.length)];
    } else if (fileName.endsWith('.py')) {
      detectedTech = ['Python'];
      if (Math.random() > 0.5) detectedTech.push('Django');
      if (Math.random() > 0.5) detectedTech.push('Flask');
      if (Math.random() > 0.7) detectedTech.push('TensorFlow');
    } else if (fileName.endsWith('.js')) {
      detectedTech = ['JavaScript'];
      if (Math.random() > 0.5) detectedTech.push('Node.js');
      if (Math.random() > 0.5) detectedTech.push('React');
    } else if (fileName.endsWith('.java')) {
      detectedTech = ['Java'];
      if (Math.random() > 0.5) detectedTech.push('Spring');
    } else if (fileName.endsWith('.cpp') || fileName.endsWith('.c')) {
      detectedTech = ['C++'];
      if (Math.random() > 0.5) detectedTech.push('OpenGL');
    }
    
    setPreviewTech(detectedTech);
    
    // Clear any file error
    if (errors.file) {
      setErrors({
        ...errors,
        file: '',
      });
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const addTag = () => {
    if (manualTech.trim() !== '' && !tags.includes(manualTech.trim()) && !previewTech.includes(manualTech.trim())) {
      setTags([...tags, manualTech.trim()]);
      setManualTech('');
    }
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const removePreviewTech = (techToRemove) => {
    setPreviewTech(previewTech.filter(tech => tech !== techToRemove));
  };

  const handleTagKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  const addSuggestedTech = (tech) => {
    if (!tags.includes(tech) && !previewTech.includes(tech)) {
      setTags([...tags, tech]);
    }
  };

  const validate = () => {
    const newErrors = {};
    
    // Title validation
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    // Description validation
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length < 30) {
      newErrors.description = 'Description should be at least 30 characters';
    }
    
    // Department validation
    if (!formData.department) {
      newErrors.department = 'Department is required';
    }
    
    // Year validation
    if (!formData.year) {
      newErrors.year = 'Year is required';
    }
    
    // Upload method validation
    if (uploadMethod === 'file') {
      // File validation
      if (!file) {
        newErrors.file = 'Please upload a project file';
      }
    } else {
      // GitHub validation
      if (!formData.githubLink) {
        newErrors.githubLink = 'Please enter a GitHub repository URL';
      } else if (!isValidGithubUrl(formData.githubLink)) {
        newErrors.githubLink = 'Please enter a valid GitHub repository URL';
      }

      if (!repoData) {
        newErrors.githubLink = 'Please fetch repository data before submitting';
      }
    }
    
    // Technologies/tags validation
    if (tags.length === 0 && previewTech.length === 0) {
      newErrors.tags = 'Please add at least one technology tag';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const simulateUpload = () => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 10;
      if (progress > 100) {
        progress = 100;
        clearInterval(interval);
        setTimeout(() => {
          setLoading(false);
          toast.success('Project uploaded successfully!');
          setTimeout(() => {
            navigate('/explore');
          }, 2000);
        }, 500);
      }
      setUploadProgress(Math.round(progress));
    }, 300);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) {
      toast.error('Please fix the errors in the form');
      return;
    }
    
    setLoading(true);
    
    // Combine detected and manually added technologies
    const allTechnologies = [...new Set([...previewTech, ...tags])];
    
    try {
      // In a real implementation, this would be a form submission with file upload
      // For now, we'll just simulate the upload process
      simulateUpload();
      
      // Example of what the real API call might look like:
      /*
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('department', formData.department);
      formDataToSend.append('year', formData.year);
      formDataToSend.append('collaborators', formData.collaborators);
      formDataToSend.append('githubLink', formData.githubLink);
      formDataToSend.append('projectUrl', formData.projectUrl);
      formDataToSend.append('technologies', JSON.stringify(allTechnologies));
      formDataToSend.append('readme', readmeContent);
      
      if (uploadMethod === 'file') {
        formDataToSend.append('file', file);
      } else {
        formDataToSend.append('repo_owner', repoData.owner.login);
        formDataToSend.append('repo_name', repoData.name);
        formDataToSend.append('repo_url', formData.githubLink);
        formDataToSend.append('repo_stars', repoData.stargazers_count);
        formDataToSend.append('repo_forks', repoData.forks_count);
      }
      
      const response = await fetch('http://localhost:8000/api/projects/upload/', {
        method: 'POST',
        body: formDataToSend,
      });
      
      const data = await response.json();
      
      if (response.ok) {
        toast.success('Project uploaded successfully!');
        setTimeout(() => {
          navigate(`/projects/${data.id}`);
        }, 2000);
      } else {
        toast.error(data.error || 'Failed to upload project');
        setLoading(false);
      }
      */
      
    } catch (error) {
      toast.error('Network error. Please try again later.');
      console.error('Error:', error);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-sky-50 pt-20 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-indigo-600 py-6 px-8">
            <h2 className="text-2xl font-bold text-white">Upload Your Project</h2>
            <p className="text-indigo-100 mt-1">Share your work with the academic community</p>
          </div>
          
          {/* Form */}
          <form onSubmit={handleSubmit} className="py-8 px-8">
            {/* Upload Method Selector */}
            <div className="mb-8">
              <div className="flex justify-center space-x-4">
                <button
                  type="button"
                  onClick={() => handleUploadMethodChange('file')}
                  className={`px-6 py-3 rounded-lg flex items-center ${
                    uploadMethod === 'file' 
                      ? 'bg-indigo-100 border-2 border-indigo-500 text-indigo-700' 
                      : 'bg-gray-100 border-2 border-gray-200 text-gray-700 hover:bg-gray-200'
                  } transition-all`}
                >
                  <svg className="w-6 h-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  Upload Project Files
                </button>
                
                <button
                  type="button"
                  onClick={() => handleUploadMethodChange('github')}
                  className={`px-6 py-3 rounded-lg flex items-center ${
                    uploadMethod === 'github' 
                      ? 'bg-indigo-100 border-2 border-indigo-500 text-indigo-700' 
                      : 'bg-gray-100 border-2 border-gray-200 text-gray-700 hover:bg-gray-200'
                  } transition-all`}
                >
                  <svg className="w-6 h-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                  Import from GitHub
                </button>
              </div>
            </div>

            {/* Project Details Section */}
            <div className="mb-10">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 pb-2 border-b border-gray-200">
                Project Details
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Title */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="title">
                    Project Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:ring focus:ring-indigo-200 focus:border-indigo-500 ${
                      errors.title ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="E.g. Smart Traffic Analysis System"
                  />
                  {errors.title && (
                    <p className="mt-1 text-sm text-red-600">{errors.title}</p>
                  )}
                </div>
                
                {/* Description */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="description">
                    Project Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="4"
                    className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:ring focus:ring-indigo-200 focus:border-indigo-500 ${
                      errors.description ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Describe your project, its purpose, and key features..."
                  />
                  {errors.description && (
                    <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                  )}
                  <p className="mt-1 text-xs text-gray-500">
                    Minimum 30 characters. A good description helps others understand your project.
                  </p>
                </div>
                
                {/* Department */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="department">
                    Department <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="department"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:ring focus:ring-indigo-200 focus:border-indigo-500 ${
                      errors.department ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select Department</option>
                    {departments.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                  {errors.department && (
                    <p className="mt-1 text-sm text-red-600">{errors.department}</p>
                  )}
                </div>
                
                {/* Year */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="year">
                    Project Year <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="year"
                    name="year"
                    value={formData.year}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:ring focus:ring-indigo-200 focus:border-indigo-500 ${
                      errors.year ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select Year</option>
                    {years.map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                  {errors.year && (
                    <p className="mt-1 text-sm text-red-600">{errors.year}</p>
                  )}
                </div>
                
                {/* Collaborators */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="collaborators">
                    Collaborators <span className="text-gray-500 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    id="collaborators"
                    name="collaborators"
                    value={formData.collaborators}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-indigo-200 focus:border-indigo-500"
                    placeholder="E.g. John Doe, Jane Smith"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Separate multiple names with commas
                  </p>
                </div>
              </div>
            </div>
            
            {/* Links Section */}
            <div className="mb-10">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 pb-2 border-b border-gray-200">
                External Links <span className="text-gray-500 font-normal text-sm">(Optional)</span>
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* GitHub Link */}
                <div className={uploadMethod === 'github' ? 'md:col-span-2' : ''}>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-sm font-medium text-gray-700" htmlFor="githubLink">
                      GitHub Repository {uploadMethod === 'github' && <span className="text-red-500">*</span>}
                    </label>
                    {uploadMethod === 'github' && (
                      <span className="text-xs text-indigo-600 font-medium">Required for GitHub import</span>
                    )}
                  </div>
                  <div className="flex">
                    <input
                      type="url"
                      id="githubLink"
                      name="githubLink"
                      value={formData.githubLink}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 border rounded-lg ${
                        uploadMethod === 'github' ? 'rounded-r-none' : ''
                      } shadow-sm focus:ring focus:ring-indigo-200 focus:border-indigo-500 ${
                        errors.githubLink ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="https://github.com/username/project"
                    />
                    {uploadMethod === 'github' && (
                      <button
                        type="button"
                        onClick={fetchGithubRepository}
                        disabled={fetchingRepo}
                        className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-r-lg hover:bg-indigo-700 disabled:bg-indigo-400"
                      >
                        {fetchingRepo ? (
                          <div className="flex items-center">
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Fetching...
                          </div>
                        ) : (
                          'Fetch Repo'
                        )}
                      </button>
                    )}
                  </div>
                  {errors.githubLink && (
                    <p className="mt-1 text-sm text-red-600">{errors.githubLink}</p>
                  )}
                  {uploadMethod === 'github' && !errors.githubLink && (
                    <p className="mt-1 text-xs text-gray-500">
                      Enter a valid GitHub repository URL and click "Fetch Repo" to import its details
                    </p>
                  )}
                </div>
                
                {/* Project URL */}
                <div className={uploadMethod === 'github' ? 'hidden' : ''}>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="projectUrl">
                    Live Project URL
                  </label>
                  <input
                    type="url"
                    id="projectUrl"
                    name="projectUrl"
                    value={formData.projectUrl}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-indigo-200 focus:border-indigo-500"
                    placeholder="https://your-project.example.com"
                  />
                </div>
              </div>
            </div>
            
            {/* GitHub Repository Info (only shown when repo is fetched) */}
            {uploadMethod === 'github' && repoData && (
              <div className="mb-10">
                <h3 className="text-lg font-semibold text-gray-900 mb-6 pb-2 border-b border-gray-200">
                  GitHub Repository Information
                </h3>
                
                <div className="bg-indigo-50 rounded-xl p-4 mb-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 bg-indigo-100 rounded-lg p-3">
                      <svg className="h-8 w-8 text-indigo-700" fill="currentColor" viewBox="0 0 24 24">
                        <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <h4 className="text-lg font-medium text-gray-900">{repoData.name}</h4>
                      <div className="mt-2 flex items-center text-sm">
                        <span className="flex items-center mr-4 text-gray-600">
                          <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
                            <path fillRule="evenodd" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c5.51 0 10-4.48 10-10S17.51 2 12 2zm6.605 4.61a8.502 8.502 0 011.93 5.314c-.281-.054-3.101-.629-5.943-.271-.065-.141-.12-.293-.184-.445a25.416 25.416 0 00-.564-1.236c3.145-1.28 4.577-3.124 4.761-3.362zM12 3.475c2.17 0 4.154.813 5.662 2.148-.152.216-1.443 1.941-4.48 3.08-1.399-2.57-2.95-4.675-3.189-5A8.687 8.687 0 0112 3.475zm-3.633.803a53.896 53.896 0 013.167 4.935c-3.992 1.063-7.517 1.04-7.896 1.04a8.581 8.581 0 014.729-5.975zM3.453 12.01v-.26c.37.01 4.512.065 8.775-1.215.25.477.477.965.694 1.453-.109.033-.228.065-.336.098-4.404 1.42-6.747 5.303-6.942 5.629a8.522 8.522 0 01-2.19-5.705zM12 20.547a8.482 8.482 0 01-5.239-1.8c.152-.315 1.888-3.656 6.703-5.337.022-.01.033-.01.054-.022a35.32 35.32 0 011.823 6.475 8.4 8.4 0 01-3.341.684zm4.761-1.465c-.086-.52-.542-3.015-1.659-6.084 2.679-.423 5.022.271 5.314.369a8.468 8.468 0 01-3.655 5.715z" clipRule="evenodd" />
                          </svg>
                          {repoData.owner?.login}
                        </span>
                        <span className="flex items-center mr-4 text-gray-600">
                          <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                          </svg>
                          {repoData.stargazers_count} stars
                        </span>
                        <span className="flex items-center text-gray-600">
                          <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
                            <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                          </svg>
                          {repoData.forks_count} forks
                        </span>
                      </div>
                      {repoData.homepage && (
                        <div className="mt-1 text-sm">
                          <span className="font-medium">Homepage:</span> 
                          <a href={repoData.homepage} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-800 ml-1">
                            {repoData.homepage}
                          </a>
                        </div>
                      )}
                      <div className="mt-2 text-sm text-gray-500">
                        Last updated: {new Date(repoData.updated_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* File Upload Section - Only show when uploadMethod is 'file' */}
            {uploadMethod === 'file' && (
              <div className="mb-10">
                <h3 className="text-lg font-semibold text-gray-900 mb-6 pb-2 border-b border-gray-200">
                  Project Files <span className="text-red-500">*</span>
                </h3>
                
                <div className="mb-6">
                  <div 
                    className={`border-2 border-dashed rounded-lg p-6 text-center ${
                      dragActive 
                        ? 'border-indigo-500 bg-indigo-50' 
                        : errors.file 
                        ? 'border-red-300 bg-red-50' 
                        : 'border-gray-300 hover:border-indigo-400 hover:bg-indigo-50'
                    } transition-all`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleFileDrop}
                  >
                    <input
                      type="file"
                      id="fileUpload"
                      name="file"
                      onChange={(e) => handleFileChange(e.target.files[0])}
                      className="hidden"
                    />
                    
                    {file ? (
                      <div className="py-3">
                        <div className="flex items-center justify-center mb-3">
                          <svg className="w-8 h-8 text-indigo-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          <div className="text-left">
                            <p className="font-medium text-gray-900">{file.name}</p>
                            <p className="text-sm text-gray-500">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                          </div>
                        </div>
                        <div className="flex justify-center">
                          <button
                            type="button"
                            onClick={() => setFile(null)}
                            className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded hover:bg-gray-200"
                          >
                            Change file
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        <p className="mt-2 text-sm font-medium text-gray-900">
                          Drag and drop your file here, or{' '}
                          <label htmlFor="fileUpload" className="text-indigo-600 hover:text-indigo-500 cursor-pointer">
                            browse
                          </label>
                        </p>
                        <p className="mt-1 text-xs text-gray-500">
                          ZIP, RAR up to 50MB
                        </p>
                      </div>
                    )}
                  </div>
                  {errors.file && (
                    <p className="mt-1 text-sm text-red-600">{errors.file}</p>
                  )}
                </div>
                
                <div className="bg-blue-50 rounded-lg p-4 mb-2">
                  <div className="flex items-start">
                    <svg className="flex-shrink-0 h-5 w-5 text-blue-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div className="ml-3">
                      <p className="text-sm text-blue-700">
                        We recommend uploading a compressed file (ZIP/RAR) containing your entire project.
                        Include source code, documentation, and any other relevant files.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* README.md Editor - Show when repo is fetched or when a README is detected */}
            {uploadMethod === 'github' && showReadmeEditor && (
              <div className="mb-10">
                <h3 className="text-lg font-semibold text-gray-900 mb-6 pb-2 border-b border-gray-200">
                  Project README.md
                </h3>
                
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-2">
                    The README.md file provides essential information about your project. You can edit it below:
                  </p>
                  <textarea
                    value={readmeContent}
                    onChange={(e) => setReadmeContent(e.target.value)}
                    rows="10"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm font-mono text-sm focus:ring focus:ring-indigo-200 focus:border-indigo-500"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    This README.md file will be displayed on your project page. Supports Markdown formatting.
                  </p>
                </div>
              </div>
            )}
            
            {/* Technologies Section */}
            <div className="mb-10">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 pb-2 border-b border-gray-200">
                Technologies <span className="text-red-500">*</span>
              </h3>
              
              {/* Auto-detected technologies */}
              {previewTech.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">
                    Detected Technologies
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {previewTech.map(tech => (
                      <span 
                        key={tech}
                        className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full flex items-center"
                      >
                        <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {tech}
                        <button
                          type="button"
                          onClick={() => removePreviewTech(tech)}
                          className="ml-1 text-green-600 hover:text-green-800 focus:outline-none"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </span>
                    ))}
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    Technologies automatically detected from your {uploadMethod === 'file' ? 'uploaded file' : 'GitHub repository'}
                  </p>
                </div>
              )}
              
              {/* Manually add technologies */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="manualTech">
                  Add Technologies
                </label>
                <div className="flex">
                  <input
                    type="text"
                    id="manualTech"
                    name="manualTech"
                    value={manualTech}
                    onChange={(e) => setManualTech(e.target.value)}
                    onKeyDown={handleTagKeyDown}
                    className={`w-full px-3 py-2 border rounded-l-lg shadow-sm focus:ring focus:ring-indigo-200 focus:border-indigo-500 ${
                      errors.tags ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="E.g. React, Python, TensorFlow"
                  />
                  <button
                    type="button"
                    onClick={addTag}
                    className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-r-lg hover:bg-indigo-700"
                  >
                    Add
                  </button>
                </div>
                {errors.tags && (
                  <p className="mt-1 text-sm text-red-600">{errors.tags}</p>
                )}
                
                {/* Display added tags */}
                {tags.length > 0 && (
                  <div className="mt-3">
                    <div className="flex flex-wrap gap-2">
                      {tags.map(tag => (
                        <span 
                          key={tag}
                          className="px-3 py-1 bg-indigo-100 text-indigo-800 text-sm font-medium rounded-full flex items-center"
                        >
                          {tag}
                          <button
                            type="button"
                            onClick={() => removeTag(tag)}
                            className="ml-1 text-indigo-600 hover:text-indigo-800 focus:outline-none"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              {/* Technology suggestions */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  Suggested Technologies
                </h4>
                <div className="flex flex-wrap gap-2">
                  {commonTechnologies.slice(0, 12).map(tech => (
                    <button
                      key={tech}
                      type="button"
                      onClick={() => addSuggestedTech(tech)}
                      className={`px-3 py-1 border border-gray-300 text-sm font-medium rounded-full hover:bg-indigo-50 hover:border-indigo-300 transition-colors ${
                        (tags.includes(tech) || previewTech.includes(tech)) 
                          ? 'bg-indigo-50 border-indigo-300 text-indigo-700' 
                          : 'bg-white text-gray-700'
                      }`}
                      disabled={tags.includes(tech) || previewTech.includes(tech)}
                    >
                      {tech}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Submit Section */}
            <div>
              {loading ? (
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Uploading Project...</h4>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-indigo-600 h-2.5 rounded-full transition-all duration-300 ease-in-out" 
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                  <p className="mt-2 text-sm text-gray-600 text-center">{uploadProgress}%</p>
                </div>
              ) : (
                <button
                  type="submit"
                  className="w-full px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition-colors"
                >
                  Upload Project
                </button>
              )}
            </div>
          </form>
        </div>
        
        {/* FAQ Section */}
        <div className="mt-8 bg-white rounded-xl p-6 shadow-md">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Frequently Asked Questions</h3>
          
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-gray-900">What's the difference between file upload and GitHub import?</h4>
              <p className="text-gray-600 text-sm mt-1">
                File upload allows you to directly upload project files from your device, while GitHub import fetches your project directly from a GitHub repository, automatically extracting technologies and README.
              </p>
            </div>

            <div>
              <h4 className="font-medium text-gray-900">What file formats are supported?</h4>
              <p className="text-gray-600 text-sm mt-1">
                We recommend uploading ZIP or RAR archives containing your complete project. Individual source code files are also accepted.
              </p>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900">Is there a file size limit?</h4>
              <p className="text-gray-600 text-sm mt-1">
                Yes, the maximum file size is 50MB. If your project is larger, consider removing unnecessary files like node_modules or using Git LFS.
              </p>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900">How are technologies auto-detected?</h4>
              <p className="text-gray-600 text-sm mt-1">
                Our system analyzes file types, package managers (package.json, requirements.txt), and source code to identify technologies used in your project. When importing from GitHub, we also check the languages used in the repository.
              </p>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900">Can I edit my project after uploading?</h4>
              <p className="text-gray-600 text-sm mt-1">
                Yes, you can edit project details or upload a new version from your project dashboard after submission.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <ToastContainer position="bottom-right" />
    </div>
  );
};

export default Upload;