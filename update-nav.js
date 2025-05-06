const fs = require('fs');
const path = require('path');

// Function to update navigation in HTML files
function updateNavigation(filePath) {
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error(`Error reading file ${filePath}:`, err);
            return;
        }

        // Check if the file already has the mobile menu
        if (data.includes('mobile-menu-toggle')) {
            console.log(`${filePath} already has mobile menu`);
            return;
        }

        // Replace old navigation with new one
        const newNav = `        <nav>
            <div class="nav-wrapper">
                <div class="logo">404: Solutions Found</div>
                <button class="mobile-menu-toggle" aria-label="Toggle navigation menu">
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
            </div>
            <ul class="nav-menu">`;

        const updatedContent = data.replace(/<nav>[\s\S]*?<ul>/m, newNav);

        // Ensure script.js is included
        if (!updatedContent.includes('script.js')) {
            const scriptTag = '\n    <script src="script.js"></script>\n</body>';
            const finalContent = updatedContent.replace('</body>', scriptTag);

            fs.writeFile(filePath, finalContent, 'utf8', (writeErr) => {
                if (writeErr) {
                    console.error(`Error writing file ${filePath}:`, writeErr);
                    return;
                }
                console.log(`Updated ${filePath}`);
            });
        } else {
            fs.writeFile(filePath, updatedContent, 'utf8', (writeErr) => {
                if (writeErr) {
                    console.error(`Error writing file ${filePath}:`, writeErr);
                    return;
                }
                console.log(`Updated ${filePath}`);
            });
        }
    });
}

// Get all HTML files in the current directory and subdirectories
function updateAllHtmlFiles(dir) {
    fs.readdir(dir, { withFileTypes: true }, (err, files) => {
        if (err) {
            console.error('Error reading directory:', err);
            return;
        }

        files.forEach(file => {
            const fullPath = path.join(dir, file.name);
            if (file.isDirectory()) {
                updateAllHtmlFiles(fullPath);
            } else if (file.name.endsWith('.html')) {
                updateNavigation(fullPath);
            }
        });
    });
}

// Start updating files
updateAllHtmlFiles('.'); 