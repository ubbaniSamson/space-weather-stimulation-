    async function adminRegister(event) {
        event.preventDefault();

        const firstName = document.getElementById("firstName").value;
        const lastName = document.getElementById("lastName").value;
        const username = document.getElementById("username").value;
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        if (password !== document.getElementById("confirmPassword").value) {
            alert("Passwords do not match!");
            return;
        }

        try {
            const response = await fetch("http://localhost:5000/api/adminRegister", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ firstName, lastName, username, email, password }),
            });

            const result = await response.json();
            if (response.ok) {
                alert(result.message);
                window.location.href = "adminLogin.html";
            } else {
                alert(result.message || "Registration failed.");
            }
        } catch (error) {
            console.error(error);
            alert("Error connecting to the server.");
        }
    }
    async function adminLogin(event) {
        event.preventDefault();

        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        try {
            const response = await fetch("http://localhost:5000/api/adminLogin", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const result = await response.json();
            if (response.ok) {
                localStorage.setItem("adminFirstName", result.firstName);
                window.location.href = "adminDashboard.html";
            } else {
                alert("Login failed! " + (result.message || "Invalid credentials"));
            }
        } catch (error) {
            console.error("Error connecting to the server:", error);
            alert("Error connecting to the server.");
        }
    }

    function fetchAdminName() {
        const adminFirstName = localStorage.getItem("adminFirstName");
        if (adminFirstName) {
            document.getElementById("welcomeMessage").textContent = `Welcome, ${adminFirstName}`;
        }
    }

    window.onload = fetchAdminName;


    // Load Student IDs
    async function loadStudentIDs() {
        const adminContent = document.getElementById("adminContent");
        adminContent.innerHTML = "<h3>Manage Student IDs</h3><p>Loading...</p>";

        try {
            const response = await fetch("http://localhost:5000/api/getStudentIDs");
            const data = await response.json();

            let html = "<table><tr><th>Student Name</th><th>Student ID</th><th>Actions</th></tr>";
            data.forEach(student => {
                html += `<tr>
                    <td>${student.name}</td>
                    <td>${student.studentID}</td>
                    <td><button onclick="deleteStudentID(${student.id})">Delete</button></td>
                </tr>`;
            });
            html += "</table>";

            html += `
                <h4>Add New Student ID</h4>
                <input type="text" id="newStudentName" placeholder="Enter Student Name" />
                <input type="text" id="newStudentID" placeholder="Enter Student ID" />
                <button onclick="addStudentID()">Add</button>
            `;
            adminContent.innerHTML = html;
        } catch (error) {
            console.error(error);
            adminContent.innerHTML = "<p>Error loading student IDs.</p>";
        }
    }

    // Add Student ID
    async function addStudentID() {
        const newStudentID = document.getElementById("newStudentID").value;
        const newStudentName = document.getElementById("newStudentName").value;

        if (!newStudentID || !newStudentName) {
            alert("Both Student ID and Name are required.");
            return;
        }

        try {
            const response = await fetch("http://localhost:5000/api/addStudentID", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ studentID: newStudentID, name: newStudentName }),
            });

            if (response.ok) {
                alert("Student ID added successfully!");
                loadStudentIDs();
            } else {
                alert("Error adding Student ID.");
            }
        } catch (error) {
            console.error(error);
            alert("Error connecting to the server.");
        }
    }

    // Delete Student ID
    async function deleteStudentID(id) {
        try {
            const response = await fetch(`http://localhost:5000/api/deleteStudentID/${id}`, { method: "DELETE" });

            if (response.ok) {
                alert("Student ID deleted successfully!");
                loadStudentIDs();
            } else {
                alert("Error deleting Student ID.");
            }
        } catch (error) {
            console.error(error);
            alert("Error connecting to the server.");
        }
    }


   
// Function to load Dashboard Overview
async function loadSummary() {
    const adminContent = document.getElementById("adminContent");
    adminContent.innerHTML = "<h3>Loading dashboard overview...</h3>";

    try {
        const response = await fetch("http://localhost:5000/api/dashboardOverview");
        const data = await response.json();

        if (response.ok) {
            adminContent.innerHTML = `
                <h2>Welcome to the Admin Dashboard</h2>
                <div class="dashboard-widgets">
                    <div class="widget">
                        <h3>Total Students</h3>
                        <p>${data.totalStudents}</p>
                    </div>
                    <div class="widget">
                        <h3>Total Quiz Questions</h3>
                        <p>${data.totalQuizQuestions}</p>
                    </div>
                    <div class="widget">
                        <h3>Recent Logins</h3>
                        <p>${data.recentLogins}</p>
                    </div>
                </div>
            `;
        } else {
            adminContent.innerHTML = "<p>Error loading dashboard overview. Please try again later.</p>";
        }
    } catch (error) {
        console.error("Error fetching dashboard overview:", error);
        adminContent.innerHTML = "<p>Error loading dashboard overview. Please try again later.</p>";
    }
}



// Manage Content for Levels
function loadContent() {
    const adminContent = document.getElementById("adminContent");
    adminContent.innerHTML = `
        <h3>Manage Content</h3>
        <textarea id="level1" placeholder="Edit Level 1 Content"></textarea>
        <textarea id="level2" placeholder="Edit Level 2 Content"></textarea>
        <textarea id="level3" placeholder="Edit Level 3 Content"></textarea>
        <button class="btn-primary" onclick="saveContent()">Save Changes</button>
    `;
}

function saveContent() {
    const level1 = document.getElementById("level1").value;
    const level2 = document.getElementById("level2").value;
    const level3 = document.getElementById("level3").value;

    console.log("Content Saved", { level1, level2, level3 });
    alert("Content saved successfully!");
}

// View Student Details
async function loadStudentDetails() {
    const adminContent = document.getElementById("adminContent");
    adminContent.innerHTML = "<h3>Student Details</h3><p>Loading...</p>";

    try {
        const response = await fetch("http://localhost:5000/api/getStudents");
        const students = await response.json();

        let html = "<table><tr><th>Name</th><th>ID</th></tr>";
        students.forEach(student => {
            html += `<tr><td>${student.name}</td><td>${student.studentID}</td></tr>`;
        });
        html += "</table>";

        adminContent.innerHTML = html;
    } catch (error) {
        console.error("Error fetching student details:", error);
        adminContent.innerHTML = "<p>Error loading student details.</p>";
    }
}


    // Load Student Progress
    async function loadStudentProgress() {
        const adminContent = document.getElementById("adminContent");
        adminContent.innerHTML = "<h3>Student Progress</h3><p>Loading...</p>";

        try {
            const response = await fetch("http://localhost:5000/api/getStudentProgress");
            const data = await response.json();

            let html = "<table><tr><th>Student Name</th><th>Student ID</th><th>Progress (%)</th></tr>";
            data.forEach(student => {
                html += `<tr>
                    <td>${student.name}</td>
                    <td>${student.studentID}</td>
                    <td>${student.progress}</td>
                </tr>`;
            });
            html += "</table>";

            adminContent.innerHTML = html;
        } catch (error) {
            console.error(error);
            adminContent.innerHTML = "<p>Error loading student progress.</p>";
        }
    }

    async function studentLogin(event) {
        event.preventDefault();
        const studentName = document.getElementById("studentName").value;
        const studentID = document.getElementById("studentID").value;

        try {
            const response = await fetch("http://localhost:5000/api/studentLogin", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ studentName, studentID }),
            });

            const result = await response.json();
            if (response.ok) {
                alert("Login successful!");
                playWelcomeVideo();
            } else {
                alert(result.message || "Login failed!");
            }
        } catch (error) {
            console.error("Error during student login:", error);
            alert("Error connecting to the server.");
        }
    }

    function playWelcomeVideo() {
        const video = document.createElement("video");
        video.src = "./media/welcome_video.mp4"; // Correct relative path
        video.controls = false;
        video.autoplay = true;
        video.style.position = "fixed";
        video.style.top = "0";
        video.style.left = "0";
        video.style.width = "100%";
        video.style.height = "100%";
        video.style.zIndex = "9999";
        video.onended = () => (window.location.href = "studentDashboard.html");
        document.body.innerHTML = "";
        document.body.appendChild(video);
    }
    

    // Level Content Functions
    function showLevel1() {
        const content = document.getElementById("levelContent");
        content.innerHTML = "<h2>Level 1: Introduction to Neural Networks</h2><p>This is the introduction content for Level 1.</p>";
    }

    function showLevel2() {
        const content = document.getElementById("levelContent");
        content.innerHTML = "<h2>Level 2: How Neural Networks Work in Space</h2><p>This is the introduction content for Level 2.</p>";
    }

    function showLevel3() {
        const content = document.getElementById("levelContent");
        content.innerHTML = "<h2>Level 3: Quiz</h2><p>This is the quiz content for Level 3.</p>";
    }

    // Logout Function
    function logout() {
        // Clear admin data from localStorage
        localStorage.removeItem("adminFirstName");

        // Redirect to the login page
        window.location.href = "adminLogin.html";
    }
    function showLevel2() {
        const content = document.getElementById("levelContent");

        content.innerHTML = `
            <h2>Emergency Management Tutorial</h2>
            <p class="subtitle">Explore the fascinating world of space weather events, their impacts on Earth, and the emergency measures we use to stay safe. Learn how scientists and emergency teams work together to protect us from cosmic phenomena!</p>
            
            <img src="/media/space_weather1.jpg" alt="Space Weather" class="tutorial-image">
            
            <h3>Solar Storms</h3>
            
            <p>Our Sun is not just a giant ball of light and heat—it’s also full of exciting activity! Sometimes, the Sun releases bursts of energy and charged particles into space. These are called solar storms, and they can cause amazing effects both in space and on Earth.</p>
                <img src="/media/solar_storm.jpg" alt="Solar Storm" class="section-image">
            <h4>What causes a solar storm?</h4>
            <p>The Sun creates a tangled mess of magnetic fields. These magnetic fields get twisted up as the Sun rotates, and solar storms typically begin when these fields snap and reconnect, releasing energy.</p>

            <h4>Types of Solar Events</h4>
            <ul>
                <li><strong>Solar Flares:</strong> Sudden flashes of brightness on the Sun.</li>
                <li><strong>Coronal Mass Ejections (CMEs):</strong> Huge bubbles of gas and magnetic fields ejected from the Sun’s corona.</li>
                <li><strong>High-Speed Solar Wind Streams:</strong> Streams of charged particles released from the Sun.</li>
            </ul>

            <h3>Emergency Responses to Space Weather Events</h3>
            <h4>1. Geomagnetic Storms</h4>
            <p>Geomagnetic storms are disturbances in Earth's magnetic field caused by solar winds interacting with Earth's magnetosphere.</p>
            <p><strong>Effects:</strong> Disruption of satellites, power grid fluctuations, auroras.</p>
            <p><strong>Emergency Responses:</strong> Grid protection protocols, satellite orbit adjustments.</p>

            <h4>2. Solar Radiation Storms</h4>
            <p>Solar radiation storms occur when the Sun emits high-energy particles during solar flares or CMEs.</p>
            <p><strong>Effects:</strong> Increased radiation for astronauts, damage to satellite electronics.</p>
            <p><strong>Emergency Responses:</strong> Rerouting flights, sheltering astronauts, shutting down sensitive systems.</p>

            <h4>3. Radio Blackouts</h4>
            <p>Radio blackouts happen when solar flares emit X-rays that ionize the Earth's upper atmosphere.</p>
            <p><strong>Effects:</strong> Loss of communication, GPS disruptions.</p>
            <p><strong>Emergency Responses:</strong> Alternative communication channels, recalibration of systems.</p>

            <h3>Interactive Section</h3>
            <p>Select a space weather event to explore:</p>
            <div class="interactive-section">
                <button onclick="showDetails('Geomagnetic Storms')">Geomagnetic Storms</button>
                <button onclick="showDetails('Solar Radiation Storms')">Solar Radiation Storms</button>
                <button onclick="showDetails('Radio Blackouts')">Radio Blackouts</button>
            </div>
            <div id="eventDetails" class="event-details">
                <!-- Event details will load dynamically -->
            </div>
        `;
    }

    function showDetails(event) {
        const eventDetails = document.getElementById("eventDetails");

        if (event === "Geomagnetic Storms") {
            eventDetails.innerHTML = `
                <h4>Geomagnetic Storms</h4>
                <p>Disturbances in Earth's magnetic field caused by solar winds interacting with Earth's magnetosphere.</p>
                <p><strong>Effects:</strong> Satellite disruptions, power grid fluctuations, auroras.</p>
                <p><strong>Response:</strong> Grid protection protocols, satellite orbit adjustments.</p>
            `;
        } else if (event === "Solar Radiation Storms") {
            eventDetails.innerHTML = `
                <h4>Solar Radiation Storms</h4>
                <p>High-energy particles emitted during solar flares or CMEs.</p>
                <p><strong>Effects:</strong> Increased radiation, satellite damage.</p>
                <p><strong>Response:</strong> Rerouting flights, sheltering astronauts.</p>
            `;
        } else if (event === "Radio Blackouts") {
            eventDetails.innerHTML = `
                <h4>Radio Blackouts</h4>
                <p>Disruptions caused by solar flares emitting X-rays that ionize Earth's upper atmosphere.</p>
                <p><strong>Effects:</strong> Loss of communication, GPS disruptions.</p>
                <p><strong>Response:</strong> Alternative communication channels, recalibration of systems.</p>
            `;
        }
    }
