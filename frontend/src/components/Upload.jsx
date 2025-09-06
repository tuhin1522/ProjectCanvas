import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Upload = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  
  // Form state
  const [projectTitle, setProjectTitle] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [authorEmail, setAuthorEmail] = useState('');
  const [department, setDepartment] = useState('');
  const [academicYear, setAcademicYear] = useState('');
  const [supervisor, setSupervisor] = useState('');
  const [projectType, setProjectType] = useState('');
  const [technologiesUsed, setTechnologiesUsed] = useState([]);
  const [projectFile, setProjectFile] = useState(null);
  const [reportFile, setReportFile] = useState(null);
  const [githubRepo, setGithubRepo] = useState('');
  const [liveDemoLink, setLiveDemoLink] = useState('');
  const [screenshots, setScreenshots] = useState([]);
  const [isOpenSource, setIsOpenSource] = useState(true);
  const [loading, setLoading] = useState(false);
  
  // Drag and drop state
  const [dragActive, setDragActive] = useState({
    project: false,
    report: false,
    screenshots: false
  });

  const projectTypes = [
    { id: 'web', name: 'Web Development' },
    { id: 'mobile', name: 'Mobile App' },
    { id: 'ml', name: 'Machine Learning' },
    { id: 'ai', name: 'Artificial Intelligence' },
    { id: 'iot', name: 'Internet of Things' },
    { id: 'game', name: 'Game Development' },
    { id: 'blockchain', name: 'Blockchain' },
    { id: 'desktop', name: 'Desktop Application' },
    { id: 'other', name: 'Other' }
  ];

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

  const availableTechnologies = [
    'JavaScript', 'Python', 'Java', 'C++', 'React', 'Node.js', 'Django', 
    'Flask', 'Spring Boot', 'TensorFlow', 'PyTorch', 'MongoDB', 'MySQL', 
    'PostgreSQL', 'Firebase', 'AWS', 'Docker', 'Git', 'HTML', 'CSS', 
    'Vue.js', 'Angular', 'PHP', 'Ruby', 'Go', 'Swift', 'Kotlin', 'Flutter'
  ];

  // File handlers
  const handleProjectFileChange = (e) => {
    if (e.target.files[0]) {
      const file = e.target.files[0];
      const maxSize = 50 * 1024 * 1024; // 50MB
      
      if (file.size > maxSize) {
        toast.error('Project file must be under 50MB');
        return;
      }
      
      const allowedTypes = ['.zip', '.tar.gz'];
      const fileExtension = file.name.toLowerCase();
      const isAllowed = allowedTypes.some(type => fileExtension.endsWith(type));
      
      if (!isAllowed) {
        toast.error('Only ZIP and TAR.GZ files are allowed');
        return;
      }
      
      setProjectFile(file);
    }
  };

  const handleReportFileChange = (e) => {
    if (e.target.files[0]) {
      const file = e.target.files[0];
      const maxSize = 10 * 1024 * 1024; // 10MB
      
      if (file.size > maxSize) {
        toast.error('Documentation file must be under 10MB');
        return;
      }
      
      const allowedTypes = ['.pdf', '.docx', '.md'];
      const fileExtension = file.name.toLowerCase();
      const isAllowed = allowedTypes.some(type => fileExtension.endsWith(type));
      
      if (!isAllowed) {
        toast.error('Only PDF, DOCX, and MD files are allowed');
        return;
      }
      
      setReportFile(file);
    }
  };

  const handleScreenshotsChange = (e) => {
    const newFiles = Array.from(e.target.files);
    const maxFileSize = 5 * 1024 * 1024; // 5MB per image
    
    const validFiles = newFiles.filter(file => {
      if (file.size > maxFileSize) {
        toast.error(`${file.name} is too large. Max size is 5MB per image.`);
        return false;
      }
      
      const allowedTypes = ['image/png', 'image/jpg', 'image/jpeg'];
      if (!allowedTypes.includes(file.type)) {
        toast.error(`${file.name} is not a valid image type. Only PNG, JPG, JPEG allowed.`);
        return false;
      }
      
      return true;
    });
    
    if (screenshots.length + validFiles.length > 10) {
      toast.warning('Maximum 10 screenshots allowed');
      return;
    }
    
    setScreenshots([...screenshots, ...validFiles]);
  };

  // Technology selection
  const handleTechnologyAdd = (tech) => {
    if (!technologiesUsed.includes(tech)) {
      setTechnologiesUsed([...technologiesUsed, tech]);
    }
  };

  const handleTechnologyRemove = (tech) => {
    setTechnologiesUsed(technologiesUsed.filter(t => t !== tech));
  };

  // Drag and drop handlers
  const handleDrag = (e, field) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive({
        ...dragActive,
        [field]: true
      });
    } else if (e.type === 'dragleave') {
      setDragActive({
        ...dragActive,
        [field]: false
      });
    }
  };

  const handleDrop = (e, field) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive({
      ...dragActive,
      [field]: false
    });
    
    if (field === 'screenshots') {
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        const newFiles = Array.from(e.dataTransfer.files);
        const maxFileSize = 5 * 1024 * 1024;
        
        const validFiles = newFiles.filter(file => {
          if (file.size > maxFileSize) {
            toast.error(`${file.name} is too large. Max size is 5MB per image.`);
            return false;
          }
          
          const allowedTypes = ['image/png', 'image/jpg', 'image/jpeg'];
          if (!allowedTypes.includes(file.type)) {
            toast.error(`${file.name} is not a valid image type.`);
            return false;
          }
          
          return true;
        });
        
        if (screenshots.length + validFiles.length > 10) {
          toast.warning('Maximum 10 screenshots allowed');
          return;
        }
        setScreenshots([...screenshots, ...validFiles]);
      }
    } else if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      if (field === 'project') {
        const file = e.dataTransfer.files[0];
        const maxSize = 50 * 1024 * 1024;
        
        if (file.size > maxSize) {
          toast.error('Project file must be under 50MB');
          return;
        }
        
        const allowedTypes = ['.zip', '.tar.gz'];
        const fileExtension = file.name.toLowerCase();
        const isAllowed = allowedTypes.some(type => fileExtension.endsWith(type));
        
        if (!isAllowed) {
          toast.error('Only ZIP and TAR.GZ files are allowed');
          return;
        }
        
        setProjectFile(file);
      } else if (field === 'report') {
        const file = e.dataTransfer.files[0];
        const maxSize = 10 * 1024 * 1024;
        
        if (file.size > maxSize) {
          toast.error('Documentation file must be under 10MB');
          return;
        }
        
        const allowedTypes = ['.pdf', '.docx', '.md'];
        const fileExtension = file.name.toLowerCase();
        const isAllowed = allowedTypes.some(type => fileExtension.endsWith(type));
        
        if (!isAllowed) {
          toast.error('Only PDF, DOCX, and MD files are allowed');
          return;
        }
        
        setReportFile(file);
      }
    }
  };

  const removeScreenshot = (idx) => {
    setScreenshots(screenshots.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!projectFile) {
      toast.error("Please upload a project file");
      return;
    }
    
    if (!projectType) {
      toast.error("Please select a project type");
      return;
    }

    if (!projectTitle.trim()) {
      toast.error("Please enter a project title");
      return;
    }
    
    setLoading(true);
    
    const formData = new FormData();
    
    // Basic project info
    formData.append('title', projectTitle);
    formData.append('description', projectDescription);
    formData.append('author_name', authorName);
    formData.append('author_email', authorEmail);
    formData.append('department', department);
    formData.append('academic_year', academicYear);
    formData.append('supervisor', supervisor);
    formData.append('project_type', projectType);
    formData.append('is_open_source', isOpenSource ? 'true' : 'false');
    formData.append('technologies_used', JSON.stringify(technologiesUsed));
    
    // Files
    formData.append('project_file', projectFile);
    if (reportFile) {
      formData.append('documentation_file', reportFile);
    }
    
    // Links
    if (githubRepo) {
      formData.append('github_link', githubRepo);
    }
    if (liveDemoLink) {
      formData.append('live_demo_link', liveDemoLink);
    }
    
    // Screenshots
    screenshots.forEach((screenshot, index) => {
      formData.append(`screenshot_${index}`, screenshot);
    });
    
    try {
      // Fix the URL - remove /api/ prefix
      const response = await fetch('http://localhost:8000/upload-project/', {
        method: 'POST',
        body: formData,
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        
        let errorMessage = `HTTP error! status: ${response.status}`;
        try {
          const parsed = JSON.parse(errorText);
          errorMessage = parsed.error || JSON.stringify(parsed);
        } catch (parseError) {
          console.error('Failed to parse error response:', parseError);
          errorMessage = errorText || errorMessage;
        }
        throw new Error(errorMessage);
      }

      const responseText = await response.text();
      console.log('Success response:', responseText);
      
      const data = responseText ? JSON.parse(responseText) : {};
      
      if (data.project_id) {
        setLoading(false);
        toast.success("Project saved as draft!");
        // For now, just show success - we'll implement edit page later
        console.log('Project saved with ID:', data.project_id);
        // navigate(`/projects/${data.project_id}/edit`);
      } else {
        throw new Error(data.error || 'Upload failed - no project ID returned');
      }
    } catch (error) {
      console.error('Upload error details:', error);
      setLoading(false);
      toast.error(error.message || 'Upload failed');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Upload Your Project</h1>
          <p className="mt-2 text-gray-600">Share your academic work with the university community</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <form onSubmit={handleSubmit}>
              <div className="space-y-8">
                
                {/* Project Information Section */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Project Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    {/* Project Title */}
                    <div className="md:col-span-2">
                      <label htmlFor="project-title" className="block text-sm font-medium text-gray-700 mb-1">
                        Project Title <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="project-title"
                        value={projectTitle}
                        onChange={(e) => setProjectTitle(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Enter your project title"
                        required
                      />
                    </div>

                    {/* Project Description */}
                    <div className="md:col-span-2">
                      <label htmlFor="project-description" className="block text-sm font-medium text-gray-700 mb-1">
                        Project Description
                      </label>
                      <textarea
                        id="project-description"
                        rows={4}
                        value={projectDescription}
                        onChange={(e) => setProjectDescription(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Brief description of your project"
                      />
                    </div>

                    {/* Author Details */}
                    <div>
                      <label htmlFor="author-name" className="block text-sm font-medium text-gray-700 mb-1">
                        Author Name
                      </label>
                      <input
                        type="text"
                        id="author-name"
                        value={authorName}
                        onChange={(e) => setAuthorName(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Your full name"
                      />
                    </div>

                    <div>
                      <label htmlFor="author-email" className="block text-sm font-medium text-gray-700 mb-1">
                        Author Email
                      </label>
                      <input
                        type="email"
                        id="author-email"
                        value={authorEmail}
                        onChange={(e) => setAuthorEmail(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="your.email@university.edu"
                      />
                    </div>

                    {/* Academic Details */}
                    <div>
                      <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">
                        Department
                      </label>
                      <select
                        id="department"
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                      >
                        <option value="">Select Department</option>
                        {departments.map(dept => (
                          <option key={dept} value={dept}>{dept}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label htmlFor="academic-year" className="block text-sm font-medium text-gray-700 mb-1">
                        Academic Year
                      </label>
                      <input
                        type="text"
                        id="academic-year"
                        value={academicYear}
                        onChange={(e) => setAcademicYear(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="e.g., 2023-2024"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label htmlFor="supervisor" className="block text-sm font-medium text-gray-700 mb-1">
                        Project Supervisor
                      </label>
                      <input
                        type="text"
                        id="supervisor"
                        value={supervisor}
                        onChange={(e) => setSupervisor(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Dr. Jane Smith"
                      />
                    </div>
                  </div>
                </div>

                {/* Project Type and Technologies */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Project Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    {/* Project Type */}
                    <div>
                      <label htmlFor="project-type" className="block text-sm font-medium text-gray-700 mb-1">
                        Project Type <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="project-type"
                        value={projectType}
                        onChange={(e) => setProjectType(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        required
                      >
                        <option value="">Select a project type</option>
                        {projectTypes.map((type) => (
                          <option key={type.id} value={type.id}>{type.name}</option>
                        ))}
                      </select>
                    </div>

                    {/* Open Source Status */}
                    <div className="flex items-center mt-6">
                      <input
                        id="open-source"
                        name="open-source"
                        type="checkbox"
                        className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                        checked={isOpenSource}
                        onChange={(e) => setIsOpenSource(e.target.checked)}
                      />
                      <label htmlFor="open-source" className="ml-2 block text-sm text-gray-700">
                        Open Source Project
                      </label>
                    </div>
                  </div>

                  {/* Technologies Used */}
                  <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Technologies Used
                    </label>
                    <div className="border border-gray-300 rounded-md p-3 min-h-[80px] bg-gray-50">
                      {/* Selected Technologies */}
                      <div className="flex flex-wrap gap-2 mb-3">
                        {technologiesUsed.map(tech => (
                          <span 
                            key={tech} 
                            className="inline-flex items-center px-2 py-1 rounded-md text-sm font-medium bg-indigo-100 text-indigo-800"
                          >
                            {tech}
                            <button
                              type="button"
                              onClick={() => handleTechnologyRemove(tech)}
                              className="ml-1 inline-flex items-center p-0.5 rounded-full text-indigo-400 hover:bg-indigo-200 hover:text-indigo-600"
                            >
                              <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                              </svg>
                            </button>
                          </span>
                        ))}
                      </div>
                      
                      {/* Available Technologies */}
                      <div className="flex flex-wrap gap-1">
                        {availableTechnologies
                          .filter(tech => !technologiesUsed.includes(tech))
                          .map(tech => (
                            <button
                              key={tech}
                              type="button"
                              onClick={() => handleTechnologyAdd(tech)}
                              className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-white text-gray-700 border border-gray-300 hover:bg-gray-100"
                            >
                              {tech}
                            </button>
                          ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* File Upload Section */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Project Files</h3>
                  <div className="space-y-6">
                    
                    {/* Project File */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Project File <span className="text-red-500">*</span>
                      </label>
                      <div 
                        className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md ${
                          dragActive.project 
                            ? 'border-indigo-500 bg-indigo-50' 
                            : 'border-gray-300 hover:border-indigo-500'
                        }`}
                        onDragEnter={(e) => handleDrag(e, 'project')}
                        onDragLeave={(e) => handleDrag(e, 'project')}
                        onDragOver={(e) => handleDrag(e, 'project')}
                        onDrop={(e) => handleDrop(e, 'project')}
                      >
                        <div className="space-y-1 text-center">
                          {projectFile ? (
                            <div className="text-indigo-600">
                              <svg className="mx-auto h-12 w-12" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M18 22a2 2 0 002-2V8l-6-6H6a2 2 0 00-2 2v16a2 2 0 002 2h12zM13 4l5 5h-5V4zM8 14h8v2H8v-2zm0-4h8v2H8v-2z" />
                              </svg>
                              <p className="text-sm font-medium">{projectFile.name}</p>
                              <p className="text-xs text-gray-500">
                                {(projectFile.size / (1024 * 1024)).toFixed(2)} MB
                              </p>
                              <button 
                                type="button" 
                                className="mt-2 text-xs text-red-600 hover:text-red-800"
                                onClick={() => setProjectFile(null)}
                              >
                                Remove
                              </button>
                            </div>
                          ) : (
                            <>
                              <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                              <div className="flex text-sm text-gray-600">
                                <label htmlFor="project-file" className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500">
                                  <span>Upload a file</span>
                                  <input 
                                    id="project-file" 
                                    name="project-file" 
                                    type="file" 
                                    className="sr-only" 
                                    accept=".zip,.tar.gz"
                                    onChange={handleProjectFileChange}
                                  />
                                </label>
                                <p className="pl-1">or drag and drop</p>
                              </div>
                              <p className="text-xs text-gray-500">
                                ZIP or TAR.GZ up to 50MB
                              </p>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Documentation */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Documentation / Report <span className="text-gray-500">(Optional)</span>
                      </label>
                      <div 
                        className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md ${
                          dragActive.report 
                            ? 'border-indigo-500 bg-indigo-50' 
                            : 'border-gray-300 hover:border-indigo-500'
                        }`}
                        onDragEnter={(e) => handleDrag(e, 'report')}
                        onDragLeave={(e) => handleDrag(e, 'report')}
                        onDragOver={(e) => handleDrag(e, 'report')}
                        onDrop={(e) => handleDrop(e, 'report')}
                      >
                        <div className="space-y-1 text-center">
                          {reportFile ? (
                            <div className="text-indigo-600">
                              <svg className="mx-auto h-12 w-12" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zm-1 2l5 5h-5V4zM8 18h8v-2H8v2zm0-4h8v-2H8v2z" />
                              </svg>
                              <p className="text-sm font-medium">{reportFile.name}</p>
                              <p className="text-xs text-gray-500">
                                {(reportFile.size / (1024 * 1024)).toFixed(2)} MB
                              </p>
                              <button 
                                type="button" 
                                className="mt-2 text-xs text-red-600 hover:text-red-800"
                                onClick={() => setReportFile(null)}
                              >
                                Remove
                              </button>
                            </div>
                          ) : (
                            <>
                              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                              <div className="flex text-sm text-gray-600">
                                <label htmlFor="report-file" className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500">
                                  <span>Upload a file</span>
                                  <input 
                                    id="report-file" 
                                    name="report-file" 
                                    type="file" 
                                    className="sr-only" 
                                    accept=".pdf,.docx,.md"
                                    onChange={handleReportFileChange}
                                  />
                                </label>
                                <p className="pl-1">or drag and drop</p>
                              </div>
                              <p className="text-xs text-gray-500">
                                PDF, DOCX, or MD up to 10MB
                              </p>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Screenshots */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Project Screenshots <span className="text-gray-500">(Optional - Max 10)</span>
                      </label>
                      <div 
                        className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md ${
                          dragActive.screenshots 
                            ? 'border-indigo-500 bg-indigo-50' 
                            : 'border-gray-300 hover:border-indigo-500'
                        }`}
                        onDragEnter={(e) => handleDrag(e, 'screenshots')}
                        onDragLeave={(e) => handleDrag(e, 'screenshots')}
                        onDragOver={(e) => handleDrag(e, 'screenshots')}
                        onDrop={(e) => handleDrop(e, 'screenshots')}
                      >
                        <div className="space-y-1 text-center">
                          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <div className="flex text-sm text-gray-600">
                            <label htmlFor="screenshots-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500">
                              <span>Upload images</span>
                              <input 
                                id="screenshots-upload" 
                                name="screenshots-upload" 
                                type="file" 
                                className="sr-only" 
                                multiple
                                accept="image/png,image/jpg,image/jpeg"
                                onChange={handleScreenshotsChange}
                              />
                            </label>
                            <p className="pl-1">or drag and drop</p>
                          </div>
                          <p className="text-xs text-gray-500">
                            PNG, JPG, JPEG up to 5MB each (maximum 10 images)
                          </p>
                        </div>
                      </div>
                      
                      {/* Screenshot previews */}
                      {screenshots.length > 0 && (
                        <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3">
                          {screenshots.map((file, idx) => (
                            <div key={idx} className="relative group">
                              <div className="aspect-w-16 aspect-h-9 overflow-hidden rounded-md border border-gray-300">
                                <img 
                                  src={URL.createObjectURL(file)} 
                                  alt={`Screenshot ${idx + 1}`}
                                  className="object-cover w-full h-full"
                                />
                              </div>
                              <button
                                type="button"
                                onClick={() => removeScreenshot(idx)}
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                ×
                              </button>
                              <p className="mt-1 text-xs text-gray-500 truncate">{file.name}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Links Section */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Project Links</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    {/* GitHub Repository */}
                    <div>
                      <label htmlFor="github-repo" className="block text-sm font-medium text-gray-700 mb-1">
                        GitHub Repository <span className="text-gray-500">(Optional)</span>
                      </label>
                      <input
                        type="url"
                        id="github-repo"
                        value={githubRepo}
                        onChange={(e) => setGithubRepo(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="https://github.com/username/repo"
                      />
                    </div>

                    {/* Live Demo Link */}
                    <div>
                      <label htmlFor="live-demo" className="block text-sm font-medium text-gray-700 mb-1">
                        Live Demo <span className="text-gray-500">(Optional)</span>
                      </label>
                      <input
                        type="url"
                        id="live-demo"
                        value={liveDemoLink}
                        onChange={(e) => setLiveDemoLink(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="https://your-project-demo.com"
                      />
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-6">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Saving Project...
                      </>
                    ) : (
                      'Save as Draft'
                    )}
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

export default Upload;