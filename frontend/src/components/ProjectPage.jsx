import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const ProjectPage = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await fetch(`http://localhost:8000/projects/${id}/`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setProject(data);
        
        // Parse analysis JSON
        if (data.analysis_text) {
          try {
            const analysisData = JSON.parse(data.analysis_text);
            setAnalysis(analysisData);
          } catch (e) {
            console.error("Error parsing analysis JSON:", e);
            setAnalysis({
              title: data.title,
              summary: "",
              tags: [],
              html: `<p>Error parsing project analysis: ${e.message}</p><pre>${data.analysis_text}</pre>`
            });
          }
        } else {
          setAnalysis({
            title: data.title,
            summary: "",
            tags: [],
            html: "<p>No analysis available for this project.</p>"
          });
        }
        setLoading(false);
      } catch (e) {
        console.error("Error fetching project:", e);
        setError(e.message);
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
          <p>Error: {error}</p>
          <p>Please try again later or contact support.</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <p>Project not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        {/* Project header */}
        <div className="bg-gradient-to-r from-indigo-600 to-blue-500 text-white p-6">
          <h1 className="text-3xl font-bold mb-2">{analysis?.title || project.title}</h1>
          {analysis?.summary && (
            <p className="text-indigo-100 text-lg">{analysis.summary}</p>
          )}
        </div>

        {/* Tags */}
        {analysis?.tags && analysis.tags.length > 0 && (
          <div className="bg-gray-50 px-6 py-3 flex flex-wrap gap-2">
            {analysis.tags.map((tag, index) => (
              <span 
                key={index} 
                className="px-3 py-1 bg-indigo-100 text-indigo-800 text-xs font-medium rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
        
        {/* Project details */}
        <div className="p-6">
          <div className="prose max-w-none">
            {analysis?.html ? (
              <div dangerouslySetInnerHTML={{ __html: analysis.html }} />
            ) : (
              <div className="bg-yellow-50 border border-yellow-100 text-yellow-700 p-4 rounded-lg">
                <p>This project doesn't have any detailed analysis yet.</p>
              </div>
            )}
          </div>

          {/* Download links */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Project Resources</h3>
            <div className="flex flex-col gap-3">
              {project.project_file_url && (
                <a 
                  href={project.project_file_url} 
                  className="text-indigo-600 hover:text-indigo-800 inline-flex items-center"
                  target="_blank"
                  rel="noreferrer"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                  </svg>
                  Download Project Files
                </a>
              )}
              {project.documentation_file_url && (
                <a 
                  href={project.documentation_file_url} 
                  className="text-indigo-600 hover:text-indigo-800 inline-flex items-center"
                  target="_blank"
                  rel="noreferrer"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  View Documentation
                </a>
              )}
              {project.github_link && (
                <a 
                  href={project.github_link} 
                  className="text-indigo-600 hover:text-indigo-800 inline-flex items-center"
                  target="_blank"
                  rel="noreferrer"
                >
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                  GitHub Repository
                </a>
              )}
            </div>
          </div>

          {/* Screenshots */}
          {project.screenshots && project.screenshots.length > 0 && (
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Project Screenshots</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {project.screenshots.map((screenshot, index) => (
                  <div key={index} className="bg-gray-100 rounded-lg overflow-hidden">
                    <img 
                      src={screenshot} 
                      alt={`Screenshot ${index + 1}`} 
                      className="w-full h-auto object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectPage;