<h2>UniFind: University Lost and Found Network</h2>

UniFind is a web-based platform designed to assist university students, faculty, and staff in reporting and recovering lost and found items on campus. It provides an intuitive interface for reporting lost or found items, searching for items, and accessing information about the platform.

<h2>Table of Contents</h2>

Features<br>
Technologies Used<br>
Project Structure<br>
Installation<br>
Usage<br>
API Endpoints<br>
Database Schema<br>
Contributing<br>
License<br>
Contact<br>


<h2>Features</h2>

Report Lost/Found Items: Submit details and photos for lost or found items.
Search Items: Filter items by category, location, date, or status.
Admin Dashboard: Manage reported items and claims (accessible via admin.html).
How It Works: Guide on using the platform (working.html).
About Us: Information about the project and team (about.html).
Responsive Design: Accessible on desktop and mobile devices.


<h2>Technologies Used</h2>
<h3>Frontend:</h3>
HTML: Page structure (home.html, report.html, search.html, etc.)<br>
CSS: Styling (styles.css)<br>
JavaScript: Interactivity (script.js)<br>

<h3>Backend:</h3>
Node.js: Server-side runtime (server.js)<br>
Express.js: Web framework for API development<br>

<h3>Database:</h3>
MySQL: Relational database (Lost_and_Found.sql)

<h3>Other:</h3>
Multer: For handling photo uploads (stored in uploads/)


UniFind/
├── Back-End/
│   ├── .vscode/                    # VSCode settings
│   ├── node_modules/               # Node.js dependencies
│   ├── uploads/                    # Directory for uploaded item photos
│   ├── Lost_and_Found.sql          # Database schema
│   ├── package-lock.json           # Dependency lock file
│   ├── package.json                # Project dependencies and scripts
│   └── server.js                   # Main server file
├── Front-End/
│   ├── .vscode/                    # VSCode settings
│   ├── Anant LinkedIn profile pic_square.JPG  # Image asset
│   ├── Profile pic_square.JPG      # Image asset
│   ├── about.html                  # About Us page
│   ├── admin.html                  # Admin dashboard
│   ├── home.html                   # Home page
│   ├── logo.png                    # Project logo
│   ├── report.html                 # Report lost/found items
│   ├── script.js                   # JavaScript for interactivity
│   ├── search.html                 # Search items page
│   ├── styles.css                  # CSS styles
│   ├── working.html                # How It Works page
│   ├── Lost_and_Found.sql          # Duplicate database schema
│   ├── UniFind_Phase_02_Report.pdf # Project report
│   ├── University Lost and Found System_Phase_01_ER.mwb  # ER diagram
│   └── University Lost and Found System_  # Additional documentation
└── README.md                       # Project documentation
