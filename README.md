# ProjectCanvas

A comprehensive University Project Showcase & Analysis Platform that transforms scattered academic work into a valuable institutional resource.

## Overview

ProjectCanvas is a modern web platform designed for universities to showcase, analyze, and discover student projects across departments. It leverages AI-powered analysis to automatically generate project documentation, identify technology trends, and facilitate collaboration between students and faculty.

## Key Features

###  For Students
- **Automated Project Showcase**: Upload project files and get AI-generated documentation pages
- **Smart Discovery**: Find related projects through intelligent similarity detection
- **Professional Portfolios**: Create impressive project portfolios for potential employers
- **Collaboration Hub**: Connect with peers working on similar technologies
- **Blog Platform**: Share insights, tutorials, and project ideas with the community

### For Faculty & Departments
- **Technology Trend Analysis**: Track popular programming languages and frameworks
- **Project Analytics**: Monitor student collaboration patterns and project themes
- **Institutional Showcase**: Highlight departmental achievements to prospective students
- **Research Insights**: Identify emerging trends in student work

###  AI-Powered Features
- **Automatic Documentation Generation**: Uses Google Gemini AI to analyze project files
- **Technology Tag Extraction**: Automatically identifies programming languages and frameworks
- **Project Similarity Detection**: Finds related projects to encourage collaboration
- **Content Analysis**: Generates comprehensive project descriptions from uploaded documentation

## Technology Stack

### Frontend
- **React 18** with Vite for fast development
- **Tailwind CSS** for modern, responsive styling
- **React Router** for client-side routing
- **React Toastify** for user notifications

### Backend
- **Django 5.2** with Django REST Framework
- **MySQL** database for robust data management
- **Google Gemini AI** for content analysis and generation
- **Pillow** for image processing

### Infrastructure
- **CORS** enabled for cross-origin requests
- **File Upload** support for projects and documentation
- **Email Integration** for user verification and notifications

## 📁 Project Structure

```
ProjectCanvas/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # React components
│   │   │   ├── Home.jsx     # Landing page
│   │   │   ├── Upload.jsx   # Project upload interface
│   │   │   ├── Explore.jsx  # Project discovery
│   │   │   ├── Blog.jsx     # Blog listing
│   │   │   ├── WriteBlog.jsx# Blog creation
│   │   │   └── ...
│   │   └── App.jsx          # Main application component
│   ├── public/              # Static assets
│   └── package.json         # Dependencies and scripts
├── backend/                 # Django backend application
│   ├── projectcanvas/       # Main Django app
│   │   ├── models.py        # Database models
│   │   ├── views.py         # API endpoints
│   │   ├── urls.py          # URL routing
│   │   └── admin.py         # Admin interface
│   ├── backend/             # Django project settings
│   │   ├── settings.py      # Configuration
│   │   └── urls.py          # Main URL configuration
│   ├── media/               # Uploaded files
│   └── manage.py            # Django management script
└── README.md                # Project documentation
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v16 or higher)
- **Python** (v3.8 or higher)
- **MySQL** (v8.0 or higher)
- **Git**

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/tuhin1522/ProjectCanvas.git
   cd ProjectCanvas
   ```

2. **Backend Setup**
   ```bash
   # Navigate to backend directory
   cd backend
   
   # Create virtual environment
   python -m venv venv
   
   # Activate virtual environment
   # On macOS/Linux:
   source venv/bin/activate
   
   # Install dependencies
   pip install django djangorestframework django-cors-headers mysqlclient pillow requests
   
   # Configure database in backend/settings.py
   # Update DATABASES configuration with your MySQL credentials
   
   # Run migrations
   python manage.py makemigrations
   python manage.py migrate
   
   # Create superuser (optional)
   python manage.py createsuperuser
   
   # Start development server
   python manage.py runserver
   ```

3. **Frontend Setup**
   ```bash
   # Open new terminal and navigate to frontend directory
   cd frontend
   
   # Install dependencies
   npm install
   
   # Start development server
   npm run dev
   ```

4. **Environment Configuration**
   
   Create a `.env` file in the backend directory:
   ```env
   GEMINI_API_KEY=your_google_gemini_api_key
   EMAIL_HOST_USER=your_email@gmail.com
   EMAIL_HOST_PASSWORD=your_app_password
   ```

### Database Configuration

Update `backend/backend/settings.py` with your MySQL database credentials:

```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'projectcanvas',
        'USER': 'your_mysql_username',
        'PASSWORD': 'your_mysql_password',
        'HOST': 'localhost',
        'PORT': '3306',
    }
}
```

## 🔧 Usage

### Uploading Projects

1. Navigate to `/upload` in the frontend
2. Fill out project details (title, description, author information)
3. Upload project files (ZIP/TAR.GZ format)
4. Optionally upload documentation (PDF/DOCX/MD)
5. Add screenshots and repository links
6. Submit for AI analysis and showcase generation

### Exploring Projects

1. Visit `/explore` to browse all projects
2. Use filters to search by:
   - Department
   - Academic year
   - Technology/Programming language
   - Keywords
3. Click on projects to view detailed showcase pages

### Blog Platform

1. Visit `/blog` to read community articles
2. Click "Write an Article" to create new content
3. Share project ideas, tutorials, and insights
4. Filter articles by category and search terms

### Project Analysis

The platform automatically:
- Analyzes uploaded project files
- Extracts technology tags
- Generates comprehensive documentation
- Identifies similar projects
- Creates professional showcase pages

## Key Features Explained

### AI-Powered Project Analysis

ProjectCanvas uses Google Gemini AI to analyze project documentation and generate:
- **Project summaries** with clear problem statements
- **Technical documentation** with implementation details
- **Technology identification** and tagging
- **Architecture explanations** and workflow descriptions
- **Future scope** and improvement suggestions

### Smart Project Discovery

The similarity detection system helps users:
- Find projects using similar technologies
- Discover collaboration opportunities
- Learn from related work
- Build upon existing knowledge

### Department Analytics

Faculty and administrators can:
- Track technology adoption trends
- Monitor student collaboration patterns
- Showcase departmental achievements
- Identify emerging research areas

## Security Features

- **Email verification** for user registration
- **CSRF protection** for form submissions
- **File upload validation** with size and type restrictions
- **SQL injection protection** through Django ORM
- **Cross-origin request** handling with CORS

## Responsive Design

ProjectCanvas is fully responsive and works seamlessly across:
- Desktop computers
- Tablets
- Mobile devices
- Various screen sizes and orientations

## Development

### Running Tests

```bash
# Backend tests
cd backend
python manage.py test

# Frontend tests
cd frontend
npm run test
```


### Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## API Endpoints

### Project Management
- `POST /upload-project/` - Upload new project
- `GET /projects/<id>/` - Get project details
- `POST /api/projects/<id>/generate/` - Generate project page
- `POST /api/projects/<id>/publish/` - Publish project

### Blog System
- `GET /blog/posts/` - List all blog posts
- `POST /blog/create/` - Create new blog post
- `GET /blog/posts/<id>/` - Get specific blog post

### User Management
- `POST /signup/` - User registration
- `POST /login/` - User authentication
- `POST /verify-email/<token>/` - Email verification
- `POST /forgot-password/` - Password reset request

## Deployment


### Recommended Hosting

- **Frontend**: Vercel, Netlify, or AWS S3 + CloudFront
- **Backend**: AWS EC2, Google Cloud Run, or DigitalOcean
- **Database**: AWS RDS, Google Cloud SQL, or managed MySQL

## Support

For support and questions:
- **Issues**: [GitHub Issues](https://github.com/tuhin1522/ProjectCanvas/issues)
- **Documentation**: Check this README and code comments
- **Email**: mdtuhin1499@gmail.com & pranticpaulshimul@gmail.com

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- **Google Gemini AI** for intelligent content analysis
- **Django Community** for the robust web framework
- **React Team** for the frontend library
- **Tailwind CSS** for the utility-first CSS framework
- **University Faculty** for feedback and requirements

## Future Enhancements

- **Real-time collaboration** features
- **Advanced analytics** dashboard
- **Mobile application** for iOS and Android
- **Integration** with university information systems
- **Machine learning** for better project recommendations
- **Video upload** and streaming capabilities
- **Advanced search** with natural language processing

---

**ProjectCanvas** - Transforming University Projects into Institutional Value ✨

For more information, visit our [documentation](docs/) or [contact us](mailto:pranticpaulshimul@gmail.com).