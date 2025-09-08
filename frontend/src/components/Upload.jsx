import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Upload = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [projectType, setProjectType] = useState('');
  const [projectFile, setProjectFile] = useState(null);
  const [reportFile, setReportFile] = useState(null);
  const [githubRepo, setGithubRepo] = useState('');
  const [screenshots, setScreenshots] = useState([]);
  const [isOpenSource, setIsOpenSource] = useState(true);
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
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
    
    // Validate each file
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

  const handleOpenSourceChange = (e) => {
    setIsOpenSource(e.target.checked);
  };

  const nextStep = () => {
    if (currentStep === 1) {
      if (!projectFile) {
        toast.error('Project file is required');
        return;
      }
      if (!projectType) {
        toast.error('Please select a project type');
        return;
      }
      
      handleSubmit();
    }
  };

  const handleSubmit = (e) => {
    if (e) {
      e.preventDefault();
    }
    
    if (!projectFile) {
      toast.error("Please upload a project file");
      return;
    }
    
    if (!projectType) {
      toast.error("Please select a project type");
      return;
    }
    
    setLoading(true);
    
    const formData = new FormData();
    formData.append('project_type', projectType);
    formData.append('project_file', projectFile);
    formData.append('is_open_source', isOpenSource);
    
    if (reportFile) {
      formData.append('documentation_file', reportFile);
    }
    
    if (githubRepo) {
      formData.append('github_link', githubRepo);
    }
    
    screenshots.forEach((screenshot, index) => {
      formData.append(`screenshot_${index}`, screenshot);
    });
    
    fetch('http://localhost:8000/api/upload-project/', {
      method: 'POST',
      body: formData,
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      if (data.project_id) {
        setLoading(false);
        toast.success("Project uploaded successfully!");
        navigate('/edit-project-page', { 
          state: { 
            projectId: data.project_id,
            projectType,
            projectName: projectFile.name,
            isOpenSource,
            screenshots: screenshots.map(file => URL.createObjectURL(file))
          } 
        });
      } else {
        throw new Error(data.error || 'Upload failed');
      }
    })
    .catch(error => {
      setLoading(false);
      toast.error(error.message || 'Upload failed');
      console.error('Upload error:', error);
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Upload Your Project</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 sm:px-0 mb-8">
          <div className="relative">
            <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
              <div 
                style={{ width: `${currentStep === 1 ? '50%' : '100%'}` }} 
                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-600 transition-all duration-500"
              ></div>
            </div>
            <div className="flex justify-between text-sm">
              <div className="text-indigo-600 font-medium">
                Upload Files
              </div>
              <div className={`${loading ? 'text-indigo-600 font-medium' : 'text-gray-500'}`}>
                Generating Page
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                <h2 className="text-xl font-medium text-gray-900">Upload Project Files</h2>
                <p className="text-sm text-gray-500">Upload your project files and documentation.</p>
                
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

                  {/* Project Type */}
                  <div>
                    <label htmlFor="project-type" className="block text-sm font-medium text-gray-700 mb-1">
                      Project Type <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="project-type"
                      className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      value={projectType}
                      onChange={(e) => setProjectType(e.target.value)}
                      required
                    >
                      <option value="">Select a project type</option>
                      {projectTypes.map((type) => (
                        <option key={type.id} value={type.id}>{type.name}</option>
                      ))}
                    </select>
                  </div>
                  
                  {/* Open Source Status */}
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="open-source"
                        name="open-source"
                        type="checkbox"
                        className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                        checked={isOpenSource}
                        onChange={handleOpenSourceChange}
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="open-source" className="font-medium text-gray-700">Open Source Project</label>
                      <p className="text-gray-500">Mark this project as open source, allowing others to contribute or fork</p>
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
                  
                  {/* GitHub Repository */}
                  <div>
                    <label htmlFor="github-repo" className="block text-sm font-medium text-gray-700 mb-1">
                      GitHub Repository <span className="text-gray-500">(Optional)</span>
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                          <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <input
                        type="url"
                        id="github-repo"
                        name="github-repo"
                        className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                        placeholder="https://github.com/username/repo"
                        value={githubRepo}
                        onChange={(e) => setGithubRepo(e.target.value)}
                      />
                    </div>
                    <p className="mt-1 text-xs text-gray-500">
                      Link to your GitHub repository (if available)
                    </p>
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
              
              {/* Navigation Buttons */}
              <div className="mt-8 flex justify-end">
                <button
                  type="button"
                  onClick={nextStep}
                  disabled={loading}
                  className="inline-flex items-center px-6 py-3 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Uploading Project...
                    </>
                  ) : (
                    <>
                      Generate Project Page
                      <svg className="ml-2 -mr-1 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
                      </svg>
                    </>
                  )}
                </button>
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