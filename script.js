// GLOBAL: Store all items fetched from backend
let allLostItems = [];
let allFoundItems = [];

// Run after DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
  // ====== MOBILE MENU ======
  const navMenu = document.getElementById('navLinks'); // Renamed to navMenu
  document.querySelector('.mobile-menu')?.addEventListener('click', () => {
    navMenu?.classList.toggle('show-menu');
  });

  // ====== DARK MODE TOGGLE ======
  const themeToggle = document.getElementById('themeToggle');
  const themeIcon = themeToggle?.querySelector('i');
  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
    document.body.classList.add('dark-mode');
    themeIcon?.classList.replace('fa-moon', 'fa-sun');
  }

  themeToggle?.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const dark = document.body.classList.contains('dark-mode');
    themeIcon?.classList.replace(dark ? 'fa-moon' : 'fa-sun', dark ? 'fa-sun' : 'fa-moon');
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  });

  // ====== MODAL HANDLING ======
  window.onclick = function (event) {
    const modals = document.getElementsByClassName('modal');
    for (let modal of modals) {
      if (event.target === modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
      }
    }
  };

  // ====== MODAL OPEN/CLOSE ======
  window.openModal = function (id) {
    document.getElementById(id).style.display = 'block';
    document.body.style.overflow = 'hidden';
  };

  window.closeModal = function (id) {
    document.getElementById(id).style.display = 'none';
    document.body.style.overflow = 'auto';
  };

  // ====== SHOW "OTHER LOCATION" FIELDS ======
  document.getElementById('lost-location')?.addEventListener('change', function () {
    const other = document.getElementById('lost-other-location-container');
    const input = document.getElementById('lost-other-location');
    if (this.value === 'other') {
      other.style.display = 'block';
      input.setAttribute('required', true);
    } else {
      other.style.display = 'none';
      input.removeAttribute('required');
    }
  });

  document.getElementById('found-location')?.addEventListener('change', function () {
    const other = document.getElementById('found-other-location-container');
    const input = document.getElementById('found-other-location');
    if (this.value === 'other') {
      other.style.display = 'block';
      input.setAttribute('required', true);
    } else {
      other.style.display = 'none';
      input.removeAttribute('required');
    }
  });

  // ====== SIGNUP / LOGIN FORM SUBMISSION ======
  document.getElementById('signupForm')?.addEventListener('submit', function (e) {
    e.preventDefault();
    signupUser();
  });

  document.getElementById('loginForm')?.addEventListener('submit', function (e) {
    e.preventDefault();
    loginUser();
  });

  // ====== INITIAL UI UPDATE ======
  updateUI();

  // ====== POPULATE DROPDOWNS ======
  async function populateDropdowns() {
    try {
      // Populate lost item form dropdowns
      const lostCategorySelect = document.getElementById('lost-category');
      const lostLocationSelect = document.getElementById('lost-location');
      const foundCategorySelect = document.getElementById('found-category');
      const foundLocationSelect = document.getElementById('found-location');

      // Fetch categories
      const categoryRes = await fetch('http://localhost:5000/api/categories');
      const categories = await categoryRes.json();
      if (lostCategorySelect) {
        categories.forEach(category => {
          const option = document.createElement('option');
          option.value = category.Category_Name; // Use Category_Name
          option.textContent = category.Category_Name;
          lostCategorySelect.appendChild(option);
        });
      }
      if (foundCategorySelect) {
        categories.forEach(category => {
          const option = document.createElement('option');
          option.value = category.Category_Name; // Use Category_Name
          option.textContent = category.Category_Name;
          foundCategorySelect.appendChild(option);
        });
      }

      // Fetch locations
      const locationRes = await fetch('http://localhost:5000/api/locations');
      const locations = await locationRes.json();
      if (lostLocationSelect) {
        locations.forEach(location => {
          const option = document.createElement('option');
          option.value = location.Building_Name; // Use Building_Name
          option.textContent = location.Building_Name;
          lostLocationSelect.appendChild(option);
        });
      }
      if (foundLocationSelect) {
        locations.forEach(location => {
          const option = document.createElement('option');
          option.value = location.Building_Name; // Use Building_Name
          option.textContent = location.Building_Name;
          foundLocationSelect.appendChild(option);
        });
      }
    } catch (err) {
      console.error('Error populating dropdowns:', err);
    }
  }

  populateDropdowns();

  // ====== LOST ITEM FORM SUBMISSION ======
  document.getElementById('lostReportForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      alert('Please log in to report a lost item.');
      return;
    }

    const formData = new FormData();
    formData.append('Reported_By', user.User_ID);
    formData.append('Category_ID', document.getElementById('lost-category').value); // Sends Category_Name
    formData.append('Location_ID', document.getElementById('lost-location').value); // Sends Building_Name
    formData.append('Item_Name', document.getElementById('lost-name').value);
    formData.append('Description', document.getElementById('lost-features').value);
    formData.append('Lost_Date', document.getElementById('lost-date').value);
    formData.append('Lost_Time', document.getElementById('lost-time').value || null);
    formData.append('Color', document.getElementById('lost-color').value);
    formData.append('Features', document.getElementById('lost-features').value);
    formData.append('Photo_Path', document.getElementById('lost-photo').files[0]);
    formData.append('Status', 'Open');

    try {
      const response = await fetch('http://localhost:5000/api/lost-items', {
        method: 'POST',
        body: formData
      });
      const result = await response.json();

      if (response.ok) {
        alert('Lost item reported successfully!');
        document.getElementById('lostReportForm').reset();
      } else {
        alert(`Failed to report lost item: ${result.error}`);
      }
    } catch (err) {
      console.error('Error:', err);
      alert('Something went wrong. Check the console.');
    }
  });

  // ====== FOUND ITEM FORM SUBMISSION ======
  document.getElementById('foundReportForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      alert('Please log in to report a found item.');
      return;
    }

    const formData = new FormData();
    formData.append('Reported_By', user.User_ID);
    formData.append('Category_ID', document.getElementById('found-category').value); // Sends Category_Name
    formData.append('Location_ID', document.getElementById('found-location').value); // Sends Building_Name
    formData.append('Item_Name', document.getElementById('found-name').value);
    formData.append('Description', document.getElementById('found-features').value);
    formData.append('Found_Date', document.getElementById('found-date').value);
    formData.append('Found_Time', document.getElementById('found-time').value || null);
    formData.append('Color', document.getElementById('found-color').value);
    formData.append('Features', document.getElementById('found-features').value);
    formData.append('Photo_Path', document.getElementById('found-photo').files[0]);
    formData.append('Status', 'Unclaimed');

    try {
      const response = await fetch('http://localhost:5000/api/found-items', {
        method: 'POST',
        body: formData
      });
      const result = await response.json();

      if (response.ok) {
        alert('Found item reported successfully!');
        document.getElementById('foundReportForm').reset();
      } else {
        alert(`Failed to report found item: ${result.error}`);
      }
    } catch (err) {
      console.error('Error:', err);
      alert('Something went wrong. Check the console.');
    }
  });

  // ====== SEARCH FORM SUBMISSION ======
  document.querySelector('.search-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const type = document.getElementById('item-type').value;
    const location = document.getElementById('location').value;
    const date = document.getElementById('date').value;
    const status = document.getElementById('status').value;
    const keyword = document.getElementById('keyword').value;

    const queryParams = new URLSearchParams({
      category: type,
      location,
      date,
      status,
      keyword
    });

    try {
      let lostItems = [];
      let foundItems = [];

      // Fetch items based on status
      if (!status || status === 'Open') {
        const lostResponse = await fetch(`http://localhost:5000/api/lost-items?${queryParams}`);
        if (!lostResponse.ok) {
          throw new Error(`Lost items fetch failed: ${lostResponse.status} ${lostResponse.statusText}`);
        }
        lostItems = await lostResponse.json();
      }

      if (!status || status === 'Unclaimed') {
        const foundResponse = await fetch(`http://localhost:5000/api/found-items?${queryParams}`);
        if (!foundResponse.ok) {
          throw new Error(`Found items fetch failed: ${foundResponse.status} ${foundResponse.statusText}`);
        }
        foundItems = await foundResponse.json();
      }

      const lostItemsList = document.getElementById('lost-items-list');
      const foundItemsList = document.getElementById('found-items-list');

      if (lostItemsList) lostItemsList.innerHTML = '';
      if (foundItemsList) foundItemsList.innerHTML = '';

      if (lostItems.length === 0 && foundItems.length === 0) {
        if (lostItemsList) {
          lostItemsList.innerHTML = '<li>No lost items match your search 😔</li>';
        }
        if (foundItemsList) {
          foundItemsList.innerHTML = '<li>No found items match your search 😔</li>';
        }
      } else {
        // Display lost items
        if (lostItemsList && lostItems.length > 0) {
          lostItems.forEach(item => {
            const li = document.createElement('li');
            li.classList.add('lost-item');
            li.innerHTML = `
              <h4>${item.Item_Name} (Category: ${item.Category_Name || 'N/A'})</h4>
              <p><strong>Reported By:</strong> ${item.First_Name || 'Unknown'} ${item.Last_Name || ''}</p>
              <p><strong>Location:</strong> ${item.Building_Name || 'N/A'}</p>
              <p><strong>Description:</strong> ${item.Description || 'N/A'}</p>
              <p><strong>Status:</strong> ${item.Status || 'N/A'}</p>
              <p><strong>Lost Date:</strong> ${item.Lost_Date ? new Date(item.Lost_Date).toLocaleDateString() : 'N/A'}</p>
              <p><strong>Lost Time:</strong> ${item.Lost_Time || 'N/A'}</p>
              <hr>
            `;
            lostItemsList.appendChild(li);
          });
        }

        // Display found items
        if (foundItemsList && foundItems.length > 0) {
          foundItems.forEach(item => {
            const li = document.createElement('li');
            li.classList.add('found-item');
            li.innerHTML = `
              <h4>${item.Item_Name} (Category: ${item.Category_Name || 'N/A'})</h4>
              <p><strong>Reported By:</strong> ${item.First_Name || 'Unknown'} ${item.Last_Name || ''}</p>
              <p><strong>Location:</strong> ${item.Building_Name || 'N/A'}</p>
              <p><strong>Description:</strong> ${item.Description || 'N/A'}</p>
              <p><strong>Status:</strong> ${item.Status || 'N/A'}</p>
              <p><strong>Found Date:</strong> ${item.Found_Date ? new Date(item.Found_Date).toLocaleDateString() : 'N/A'}</p>
              <p><strong>Found Time:</strong> ${item.Found_Time || 'N/A'}</p>
              <hr>
            `;
            foundItemsList.appendChild(li);
          });
        }
      }
    } catch (err) {
      console.error('Error fetching items:', err);
      alert(`Failed to fetch items: ${err.message}`);
    }
  });
});

// ====== SMOOTH SCROLL NAV ======
const scrollLinks = document.querySelectorAll('a[href^="#"]'); // Renamed to scrollLinks
scrollLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const targetId = link.getAttribute('href').slice(1);
    const targetElement = document.getElementById(targetId);
    window.scrollTo({
      top: targetElement.offsetTop - 50,
      behavior: 'smooth'
    });
  });
});

// ====== FEATURE TOGGLE ======
const featureItems = document.querySelectorAll('#features li');
featureItems.forEach(item => {
  item.addEventListener('click', () => {
    item.classList.toggle('active');
    const description = item.querySelector('.description');
    if (description) {
      description.style.display = description.style.display === 'block' ? 'none' : 'block';
    }
  });
});

// ====== SIGNUP FUNCTION ======
function signupUser() {
  const userData = {
    First_Name: document.getElementById('signupFirstName').value,
    Last_Name: document.getElementById('signupLastName').value,
    Email: document.getElementById('signupEmail').value,
    Phone: document.getElementById('signupPhone').value,
    User_Type: document.getElementById('signupUserType').value,
    Department: document.getElementById('signupDepartment').value,
    Password: document.getElementById('signupPassword').value
  };

  fetch('http://localhost:5000/api/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData)
  })
    .then(res => res.json())
    .then(data => {
      if (data.error) {
        alert(data.error);
      } else {
        alert(data.message || 'Signup complete!');
        closeModal('signupModal');
      }
    })
    .catch(err => {
      console.error('Signup error:', err);
      alert('An error occurred during signup.');
    });
}

// ====== LOGIN FUNCTION ======
function loginUser() {
  const credentials = {
    Email: document.getElementById('loginEmail').value,
    Password: document.getElementById('loginPassword').value
  };

  fetch('http://localhost:5000/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials)
  })
    .then(res => res.json())
    .then(data => {
      if (data.user) {
        localStorage.setItem('user', JSON.stringify(data.user));
        alert('Welcome back, ' + data.user.First_Name + '!');
        closeModal('loginModal');
        updateUI();
      } else {
        alert(data.error || 'Login failed.');
      }
    })
    .catch(err => {
      console.error('Login error:', err);
      alert('An error occurred during login.');
    });
}

// ====== LOGOUT FUNCTION ======
function logoutUser() {
  localStorage.removeItem('user');
  alert('You have been logged out.');
  updateUI();
}

// ====== UI UPDATE FUNCTION ======
function updateUI() {
  const user = JSON.parse(localStorage.getItem('user'));
  const authButtons = document.querySelector('.auth-buttons');

  if (user) {
    authButtons.innerHTML = `
      <div class="theme-toggle" id="themeToggle">
        <i class="fas fa-moon"></i>
      </div>
      <span>Welcome, ${user.First_Name}</span>
      <button class="logout-btn" onclick="logoutUser()">Logout</button>
    `;
  } else {
    authButtons.innerHTML = `
      <div class="theme-toggle" id="themeToggle">
        <i class="fas fa-moon"></i>
      </div>
      <button class="login-btn" onclick="openModal('loginModal')">Login</button>
      <button class="signup-btn" onclick="openModal('signupModal')">Sign Up</button>
    `;
  }

  // Reattach theme toggle listener
  const themeToggle = document.getElementById('themeToggle');
  const themeIcon = themeToggle?.querySelector('i');
  themeToggle?.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const dark = document.body.classList.contains('dark-mode');
    themeIcon?.classList.replace(dark ? 'fa-moon' : 'fa-sun', dark ? 'fa-sun' : 'fa-moon');
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  });
}

// Show the button when scrolling down
window.addEventListener('scroll', () => {
  const btn = document.getElementById('scrollToTopBtn');
  if (document.body.scrollTop > 200 || document.documentElement.scrollTop > 200) {
    btn.style.display = 'block';
  } else {
    btn.style.display = 'none';
  }
});

// Scroll to top on click
document.getElementById('scrollToTopBtn')?.addEventListener('click', () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
});
