// Monastery360 - Interactive JavaScript Application
// Government of Sikkim - Digital Heritage Platform

// Global variables
let map = null;
let currentTour = null;
let archiveData = [];
let calendarEvents = [];
let audioPlayer = null;

// Sample data for monasteries (to be replaced with real dataset)
const monasteryData = [
  {
    id: 1,
    name: "Rumtek Monastery",
    lat: 27.2813,
    lng: 88.5492,
    description: "The largest monastery in Sikkim, seat of the Kagyu lineage",
    established: "1966",
    type: "Kagyu",
    status: "Active",
    tourImage: "rumtek_360.jpg"
  },
  {
    id: 2,
    name: "Pemayangtse Monastery",
    lat: 27.2047,
    lng: 88.2442,
    description: "One of the oldest and premier monasteries of Sikkim",
    established: "1705",
    type: "Nyingma",
    status: "Active",
    tourImage: "pemayangtse_360.jpg"
  },
  {
    id: 3,
    name: "Tashiding Monastery",
    lat: 27.2167,
    lng: 88.2167,
    description: "Sacred site with the holy stupa Thong-wa-rang-dhol",
    established: "1641",
    type: "Nyingma",
    status: "Active",
    tourImage: "tashiding_360.jpg"
  },
  {
    id: 4,
    name: "Enchey Monastery",
    lat: 27.3389,
    lng: 88.6069,
    description: "200-year-old monastery belonging to Nyingma order",
    established: "1840",
    type: "Nyingma",
    status: "Active",
    tourImage: "enchey_360.jpg"
  }
];

// Sample archive data
const sampleArchives = [
  {
    id: 1,
    title: "Ancient Manuscript - Buddhist Teachings",
    type: "manuscript",
    monastery: "Pemayangtse",
    date: "18th Century",
    description: "Handwritten Buddhist scriptures in Tibetan script",
    thumbnail: "manuscript1_thumb.jpg",
    fullImage: "manuscript1_full.jpg"
  },
  {
    id: 2,
    title: "Mural Painting - Buddha's Life",
    type: "mural",
    monastery: "Rumtek",
    date: "20th Century",
    description: "Colorful depictions of Buddha's life cycle",
    thumbnail: "mural1_thumb.jpg",
    fullImage: "mural1_full.jpg"
  },
  {
    id: 3,
    title: "Historical Document - Monastery Records",
    type: "document",
    monastery: "Tashiding",
    date: "19th Century",
    description: "Administrative records and ritual schedules",
    thumbnail: "doc1_thumb.jpg",
    fullImage: "doc1_full.jpg"
  }
];

// Sample calendar events
const sampleEvents = [
  {
    id: 1,
    title: "Losar - Tibetan New Year",
    date: "2024-02-10",
    monastery: "All Monasteries",
    description: "Traditional New Year celebrations with mask dances and prayers",
    bookingAvailable: true,
    contact: "tourism@sikkim.gov.in"
  },
  {
    id: 2,
    title: "Buddha Purnima",
    date: "2024-05-23",
    monastery: "Rumtek Monastery",
    description: "Celebration of Lord Buddha's birth, enlightenment, and death",
    bookingAvailable: true,
    contact: "rumtek@monastery.in"
  },
  {
    id: 3,
    title: "Kagyed Dance Festival",
    date: "2024-12-15",
    monastery: "Pemayangtse Monastery",
    description: "Sacred Cham dance performances",
    bookingAvailable: false,
    contact: "pemayangtse@monastery.in"
  }
];

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
  console.log('Monastery360 Platform Initializing...');
  
  // Set current year in footer
  document.getElementById('year').textContent = new Date().getFullYear();
  
  // Initialize all components
  initializeMap();
  initializeVirtualTours();
  initializeArchives();
  initializeCalendar();
  initializeGovernmentFacilities();
  initializeForms();
  initializeAudioGuides();
  
  // Smooth scrolling for navigation
  initializeSmoothScrolling();
  
  console.log('Monastery360 Platform Ready!');
});

// Initialize Interactive Map
function initializeMap() {
  try {
    if (typeof L !== 'undefined') {
      // Initialize Leaflet map centered on Sikkim
      map = L.map('mapView').setView([27.3333, 88.6167], 9);
      
      // Add OpenStreetMap tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors | Monastery360 Digital Heritage Platform',
        maxZoom: 18
      }).addTo(map);
      
      // Add monastery markers
      monasteryData.forEach(monastery => {
        const marker = L.marker([monastery.lat, monastery.lng])
          .addTo(map)
          .bindPopup(`
            <div class="popup-content">
              <h4>${monastery.name}</h4>
              <p><strong>Established:</strong> ${monastery.established}</p>
              <p><strong>Type:</strong> ${monastery.type}</p>
              <p>${monastery.description}</p>
              <button class="btn small" onclick="openVirtualTour('${monastery.id}')">
                Virtual Tour
              </button>
            </div>
          `);
        
        // Custom monastery icon
        marker.setIcon(L.divIcon({
          className: 'monastery-marker',
          html: '🏛️',
          iconSize: [30, 30]
        }));
      });
      
      console.log('Interactive map initialized successfully');
    } else {
      // Fallback if Leaflet is not loaded
      document.getElementById('mapView').innerHTML = `
        <div style="display: flex; align-items: center; justify-content: center; height: 100%; color: white;">
          <div style="text-align: center;">
            <h3>Interactive Map of Sikkim Monasteries</h3>
            <p>Map loading... Please ensure internet connection.</p>
            <p>Featuring ${monasteryData.length} monasteries across Sikkim</p>
          </div>
        </div>
      `;
    }
  } catch (error) {
    console.error('Map initialization failed:', error);
  }
}

// Initialize Virtual Tours
function initializeVirtualTours() {
  try {
    const tourContainer = document.getElementById('tour-sample');
    if (tourContainer && typeof pannellum !== 'undefined') {
      // Initialize 360° viewer with sample panorama
      currentTour = pannellum.viewer('tour-sample', {
        type: "equirectangular",
        panorama: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 4096 2048'><rect width='4096' height='2048' fill='%23667eea'/><text x='2048' y='1024' text-anchor='middle' font-family='Arial' font-size='200' fill='white'>Sample 360° View</text><text x='2048' y='1300' text-anchor='middle' font-family='Arial' font-size='100' fill='white'>Replace with real monastery panorama</text></svg>",
        autoLoad: true,
        showControls: true,
        showZoomCtrl: true,
        showFullscreenCtrl: true,
        compass: true,
        northOffset: 0
      });
      
      console.log('Virtual tour viewer initialized');
    } else {
      tourContainer.innerHTML = `
        <div style="display: flex; align-items: center; justify-content: center; height: 100%; color: white; text-align: center;">
          <div>
            <h4>360° Virtual Tour</h4>
            <p>Loading panoramic view...</p>
            <p><small>Real monastery panoramas will be loaded here</small></p>
          </div>
        </div>
      `;
    }
  } catch (error) {
    console.error('Virtual tour initialization failed:', error);
  }
}

// Open Virtual Tour for specific monastery
function openVirtualTour(monasteryId) {
  const monastery = monasteryData.find(m => m.id == monasteryId);
  if (monastery) {
    alert(`Opening virtual tour for ${monastery.name}\n\nThis would load the 360° panoramic view. In production, this would:\n- Load high-resolution equirectangular images\n- Include hotspots for navigation\n- Provide multilingual audio narration\n- Show architectural details and cultural information`);
    
    // Scroll to tours section
    document.querySelector('#tours').scrollIntoView({ behavior: 'smooth' });
  }
}

// Initialize Digital Archives
function initializeArchives() {
  archiveData = [...sampleArchives];
  renderArchives();
  
  // Search functionality
  const searchInput = document.getElementById('archiveSearch');
  const filterSelect = document.getElementById('archiveFilter');
  
  if (searchInput) {
    searchInput.addEventListener('input', filterArchives);
  }
  
  if (filterSelect) {
    filterSelect.addEventListener('change', filterArchives);
  }
  
  console.log('Digital archives initialized with', archiveData.length, 'items');
}

// Render archive items
function renderArchives(items = archiveData) {
  const container = document.getElementById('archiveResults');
  if (!container) return;
  
  if (items.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 2rem; color: #6b7280;">
        <h4>No archives found</h4>
        <p>Try adjusting your search or filter criteria</p>
      </div>
    `;
    return;
  }
  
  container.innerHTML = items.map(item => `
    <div class="archive-item" onclick="viewArchiveItem(${item.id})">
      <div class="archive-thumb">
        <div class="placeholder-thumb" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); height: 150px; display: flex; align-items: center; justify-content: center; color: white; border-radius: 8px;">
          ${getArchiveTypeIcon(item.type)}
        </div>
      </div>
      <div class="archive-info" style="padding: 1rem;">
        <h4 style="font-size: 1rem; margin-bottom: 0.5rem; color: #1f2937;">${item.title}</h4>
        <p style="font-size: 0.875rem; color: #6b7280; margin-bottom: 0.5rem;">${item.monastery} • ${item.date}</p>
        <p style="font-size: 0.8rem; color: #9ca3af;">${item.description}</p>
        <span class="archive-type" style="display: inline-block; margin-top: 0.5rem; padding: 0.25rem 0.5rem; background: #fef3c7; color: #92400e; border-radius: 4px; font-size: 0.75rem; text-transform: capitalize;">
          ${item.type}
        </span>
      </div>
    </div>
  `).join('');
}

// Get archive type icon
function getArchiveTypeIcon(type) {
  const icons = {
    manuscript: '📜',
    mural: '🎨',
    document: '📄'
  };
  return icons[type] || '📚';
}

// Filter archives
function filterArchives() {
  const searchTerm = document.getElementById('archiveSearch').value.toLowerCase();
  const filterType = document.getElementById('archiveFilter').value;
  
  let filtered = archiveData;
  
  // Apply search filter
  if (searchTerm) {
    filtered = filtered.filter(item => 
      item.title.toLowerCase().includes(searchTerm) ||
      item.description.toLowerCase().includes(searchTerm) ||
      item.monastery.toLowerCase().includes(searchTerm)
    );
  }
  
  // Apply type filter
  if (filterType !== 'all') {
    filtered = filtered.filter(item => item.type === filterType);
  }
  
  renderArchives(filtered);
}

// View archive item
function viewArchiveItem(itemId) {
  const item = archiveData.find(a => a.id === itemId);
  if (item) {
    alert(`Viewing: ${item.title}\n\nFrom: ${item.monastery}\nDate: ${item.date}\n\nDescription: ${item.description}\n\nIn production, this would open a detailed viewer with:\n- High-resolution images\n- Zoom and pan functionality\n- Metadata and scholarly annotations\n- Download options (if permitted)`);
  }
}

// Initialize Cultural Calendar
function initializeCalendar() {
  calendarEvents = [...sampleEvents];
  renderCalendar();
  console.log('Cultural calendar initialized with', calendarEvents.length, 'events');
}

// Render calendar events
function renderCalendar() {
  const container = document.getElementById('calendarList');
  if (!container) return;
  
  if (calendarEvents.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 2rem; color: #6b7280;">
        <h4>No events scheduled</h4>
        <p>Check back later for upcoming cultural events and festivals</p>
      </div>
    `;
    return;
  }
  
  container.innerHTML = calendarEvents.map(event => `
    <div class="calendar-event">
      <div class="event-header" style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1rem;">
        <div>
          <h4 style="color: #1f2937; font-size: 1.25rem; margin-bottom: 0.25rem;">${event.title}</h4>
          <p style="color: #6b7280; font-size: 0.875rem; margin: 0;">
            📅 ${formatDate(event.date)} • 🏛️ ${event.monastery}
          </p>
        </div>
        <span class="event-status" style="padding: 0.25rem 0.75rem; border-radius: 12px; font-size: 0.75rem; font-weight: 600; ${event.bookingAvailable ? 'background: #dcfce7; color: #166534;' : 'background: #fee2e2; color: #dc2626;'}">
          ${event.bookingAvailable ? 'Booking Available' : 'View Only'}
        </span>
      </div>
      <p style="color: #4b5563; margin-bottom: 1rem;">${event.description}</p>
      <div class="event-actions">
        ${event.bookingAvailable ? 
          `<button class="btn small primary" onclick="bookEvent(${event.id})">Book Participation</button>` : 
          `<button class="btn small" onclick="viewEventDetails(${event.id})">View Details</button>`
        }
        <a href="mailto:${event.contact}" class="btn small" style="margin-left: 0.5rem;">Contact</a>
      </div>
    </div>
  `).join('');
}

// Format date for display
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
}

// Book event
function bookEvent(eventId) {
  const event = calendarEvents.find(e => e.id === eventId);
  if (event) {
    alert(`Booking participation for: ${event.title}\n\nDate: ${formatDate(event.date)}\nLocation: ${event.monastery}\n\nIn production, this would:\n- Open a booking form\n- Integrate with government tourism portal\n- Handle payment processing\n- Send confirmation emails\n- Provide travel permits if needed`);
  }
}

// View event details
function viewEventDetails(eventId) {
  const event = calendarEvents.find(e => e.id === eventId);
  if (event) {
    alert(`${event.title}\n\nDate: ${formatDate(event.date)}\nLocation: ${event.monastery}\n\nDetails: ${event.description}\n\nContact: ${event.contact}\n\nNote: This event is view-only. Contact the monastery directly for more information.`);
  }
}

// Initialize Government Facilities
function initializeGovernmentFacilities() {
  console.log('Government facilities section initialized');
  
  // Apply permit button
  const applyPermitBtn = document.getElementById('applyPermit');
  if (applyPermitBtn) {
    applyPermitBtn.addEventListener('click', function(e) {
      e.preventDefault();
      handlePermitApplication();
    });
  }
  
  // Grievance button
  const grievanceBtn = document.getElementById('openGrievance');
  if (grievanceBtn) {
    grievanceBtn.addEventListener('click', handleGrievanceForm);
  }
}

// Handle permit application
function handlePermitApplication() {
  alert(`Tourist Permit Application\n\nThis would redirect to the official Sikkim Government portal for:\n\n• Protected Area Permit (PAP)\n• Inner Line Permit (ILP)\n• Restricted Area Permit (RAP)\n\nRequired documents:\n• Valid photo ID\n• Passport-size photographs\n• Travel itinerary\n• Accommodation details\n\nProcessing time: 2-5 working days\n\nIn production: Direct integration with e-District portal`);
}

// Handle grievance form
function handleGrievanceForm() {
  const grievanceForm = `
    <div style="background: white; padding: 2rem; border-radius: 12px; box-shadow: 0 4px 25px rgba(0,0,0,0.1); max-width: 500px; margin: 2rem auto;">
      <h3>Submit Grievance</h3>
      <p>Report issues to the Department of Tourism & Higher Technical Education</p>
      <br>
      <p><strong>Categories:</strong></p>
      <ul>
        <li>Tourist facility issues</li>
        <li>Monastery access problems</li>
        <li>Transport connectivity</li>
        <li>Platform technical issues</li>
        <li>General feedback</li>
      </ul>
      <br>
      <p>In production, this would open a detailed grievance form with:</p>
      <ul>
        <li>Dropdown for issue categories</li>
        <li>Priority levels</li>
        <li>File upload for evidence</li>
        <li>Tracking number generation</li>
        <li>SMS/Email notifications</li>
      </ul>
    </div>
  `;
  
  // In a real implementation, this would open a modal or redirect
  alert("Grievance Redressal System\n\nThis would open the official grievance portal integrated with the state's citizen services platform.");
}

// Initialize Forms
function initializeForms() {
  const contributeForm = document.getElementById('contributeForm');
  if (contributeForm) {
    contributeForm.addEventListener('submit', handleContributeForm);
  }
  
  console.log('Forms initialized');
}

// Handle contribute form submission
function handleContributeForm(e) {
  e.preventDefault();
  
  const formData = new FormData(e.target);
  const data = Object.fromEntries(formData.entries());
  
  // Show loading state
  const submitBtn = e.target.querySelector('button[type="submit"]');
  const originalText = submitBtn.textContent;
  submitBtn.textContent = 'Submitting...';
  submitBtn.classList.add('loading');
  submitBtn.disabled = true;
  
  // Simulate form submission
  setTimeout(() => {
    alert(`Thank you for your contribution!\n\nSubmission Details:\nName: ${data.name}\nEmail: ${data.email}\nAffiliation: ${data.affiliation || 'Not specified'}\n\nYour content will be reviewed by our heritage preservation team and the respective monastery authorities. You will receive a confirmation email shortly.\n\nIn production, this would:\n• Upload files to secure storage\n• Generate submission reference number\n• Send confirmation emails\n• Route to appropriate monastery/department\n• Track review status`);
    
    // Reset form and button
    e.target.reset();
    submitBtn.textContent = originalText;
    submitBtn.classList.remove('loading');
    submitBtn.disabled = false;
  }, 2000);
}

// Initialize Audio Guides
function initializeAudioGuides() {
  // Audio guide buttons
  const audioButtons = document.querySelectorAll('[data-play-audio]');
  audioButtons.forEach(button => {
    button.addEventListener('click', function() {
      const monasteryId = this.getAttribute('data-play-audio');
      playAudioGuide(monasteryId);
    });
  });
  
  console.log('Audio guide system initialized');
}

// Play audio guide
function playAudioGuide(monasteryId) {
  const monastery = monasteryData.find(m => m.name.toLowerCase().includes(monasteryId));
  const monasteryName = monastery ? monastery.name : monasteryId;
  
  // Stop current audio if playing
  if (audioPlayer && !audioPlayer.paused) {
    audioPlayer.pause();
    audioPlayer.currentTime = 0;
  }
  
  alert(`🎧 Audio Guide: ${monasteryName}\n\nNow playing narration in English...\n\nIn production, this would:\n• Stream high-quality audio narration\n• Support multiple languages (English, Hindi, Nepali, Bhutia, Lepcha)\n• Use GPS/Bluetooth beacons for location triggers\n• Work offline with preloaded content\n• Adjust playback speed\n• Include background monastery sounds\n\nLanguages available:\n🇬🇧 English\n🇮🇳 Hindi\n🇳🇵 Nepali\n📿 Bhutia\n🏔️ Lepcha`);
}

// Initialize smooth scrolling
function initializeSmoothScrolling() {
  // Smooth scroll for navigation links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
  
  console.log('Smooth scrolling initialized');
}

// Utility Functions

// Check if element is in viewport (for lazy loading)
function isInViewport(element) {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

// Debounce function for search
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Error handling for external resources
window.addEventListener('error', function(e) {
  console.warn('Resource loading failed:', e.filename, e.message);
  
  // Graceful degradation for missing images
  if (e.target && e.target.tagName === 'IMG') {
    e.target.style.display = 'none';
  }
});

// PWA Service Worker Registration (for offline functionality)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('/sw.js')
      .then(function(registration) {
        console.log('ServiceWorker registration successful');
      })
      .catch(function(err) {
        console.log('ServiceWorker registration failed: ', err);
      });
  });
}

// Export functions for global access
window.Monastery360 = {
  openVirtualTour,
  viewArchiveItem,
  bookEvent,
  viewEventDetails,
  playAudioGuide,
  handlePermitApplication,
  handleGrievanceForm
};

console.log('Monastery360 JavaScript module loaded successfully');