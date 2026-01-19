// Function to parse markdown and extract projects
async function loadProjects() {
    try {
        const response = await fetch('projects.md');
        const markdown = await response.text();
        
        const projects = parseProjects(markdown);
        displayProjects(projects);
    } catch (error) {
        console.error('Error loading projects:', error);
        document.getElementById('projects-container').innerHTML = 
            '<p style="color: red;">Error loading projects. Please check that projects.md exists.</p>';
    }
}

// Parse markdown to extract project information
function parseProjects(markdown) {
    const projects = [];
    const lines = markdown.split('\n');
    
    let currentProject = null;
    
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        
        // Project title (## heading)
        if (line.startsWith('## ')) {
            if (currentProject) {
                projects.push(currentProject);
            }
            currentProject = {
                title: line.substring(3).trim(),
                duration: '',
                description: ''
            };
        }
        // Duration line
        else if (line.startsWith('**Duration:**')) {
            if (currentProject) {
                currentProject.duration = line.replace('**Duration:**', '').trim();
            }
        }
        // Description (non-empty lines that aren't headers or duration)
        else if (line && currentProject && !line.startsWith('#') && !line.startsWith('**Duration:**')) {
            if (currentProject.description) {
                currentProject.description += ' ';
            }
            currentProject.description += line;
        }
    }
    
    // Add the last project
    if (currentProject) {
        projects.push(currentProject);
    }
    
    return projects;
}

// Display projects in the DOM
function displayProjects(projects) {
    const container = document.getElementById('projects-container');
    
    if (projects.length === 0) {
        container.innerHTML = '<p class="loading">No projects found. Add projects to projects.md file.</p>';
        return;
    }
    
    container.innerHTML = projects.map(project => `
        <div class="project-item">
            <h3>${escapeHtml(project.title)}</h3>
            <span class="duration">${escapeHtml(project.duration)}</span>
            <p>${escapeHtml(project.description)}</p>
        </div>
    `).join('');
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Load projects when page loads
document.addEventListener('DOMContentLoaded', loadProjects);
