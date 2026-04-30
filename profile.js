window.onload = function () {

    const userId = localStorage.getItem("userId");

    if (!userId) {
        alert("User not logged in");
        window.location.href = "login.html";
        return;
    }

    fetch(`http://localhost:8080/api/profile/${userId}`)
        .then(response => response.json())
        .then(data => {

            console.log("PROFILE DATA:", data);

            
            document.getElementById("userName").innerText = data.name;
            document.getElementById("userEmail").innerText = data.email;

            
            const assessmentList = document.getElementById("assessmentList");
            assessmentList.innerHTML = "";

            data.assessments.forEach((assessment, index) => {
                const a = document.createElement("a");
                a.innerText = assessment;
                a.href = "#";

                a.onclick = function () {
                    openOldReport(index + 1);
                };

                assessmentList.appendChild(a);
            });

            
            const roadmapList = document.getElementById("roadmapList");
            roadmapList.innerHTML = "";

            data.roadmaps.forEach((roadmap, index) => {
                const a = document.createElement("a");
                a.innerText = roadmap;
                a.href = "#";

                a.onclick = function () {
                    openSavedRoadmap(index + 1);
                };

                roadmapList.appendChild(a);
            });

            
            const trackerList = document.getElementById("trackerList");
            trackerList.innerHTML = "";

            if (data.trackers && data.trackers.length > 0) {

                data.trackers.forEach((tracker) => {

                    const a = document.createElement("a");

                    a.innerHTML = `
                        📊 ${tracker.name}
                        <span style="float:right;color:#4caf50;font-weight:bold;">
                            ${tracker.percent}%
                        </span>
                    `;

                    a.href = "#";

                    a.onclick = function () {
                        openTracker(tracker.id);
                    };

                    trackerList.appendChild(a);
                });

            } else {
                trackerList.innerHTML = `<a href="#">No trackers found</a>`;
            }

        })
        .catch(error => {
            console.error("Error fetching profile:", error);
            alert("Failed to load profile.");
        });
};




function openOldReport(assessmentId) {

    fetch(`http://localhost:8080/api/assessment/result/${assessmentId}`)
        .then(response => response.json())
        .then(data => {

            console.log("Assessment response:", data);

            localStorage.setItem(
                "recommendedCareer",
                data.recommendedCareer || ""
            );

            localStorage.setItem(
                "bestDomain",
                data.bestDomain || ""
            );

            localStorage.setItem(
                "careerBrief",
                data.careerBrief || ""
            );

            localStorage.setItem(
                "skills",
                data.skills || ""
            );

            localStorage.setItem(
                "futureScope",
                data.futureScope || ""
            );

            localStorage.setItem(
                "assessmentAnswers",
                data.answers || ""
            );

            
            localStorage.setItem(
                "careerSuggestions",
                `${data.recommendedCareer || ""}, ${data.bestDomain || ""}, ${data.skills || ""}`
            );

            window.location.href =
                "http://127.0.0.1:5500/assessmentReport.html";
        })
        .catch(error => {
            console.error("Error loading report:", error);
            alert("Failed to open saved assessment.");
        });
}


function openTracker(trackerId) {

    fetch(`http://localhost:8080/tracker/${trackerId}`)
        .then(response => response.json())
        .then(data => {

            console.log("Tracker response:", data);

            
            localStorage.setItem(
                "trackerName",
                data.name || ""
            );

            localStorage.setItem(
                "trackerPercent",
                data.percent || 0
            );

            localStorage.setItem(
                "trackerDetails",
                JSON.stringify(data)
            );

            
            window.location.href = "tracker.html";
        })
        .catch(error => {
            console.error("Error loading tracker:", error);
            alert("Failed to open tracker.");
        });
}




function openSavedRoadmap(roadmapId) {

    fetch(`http://localhost:8080/roadmap/result/${roadmapId}`)
        .then(response => response.json())
        .then(data => {

            console.log("Saved roadmap response:", data);

            // 🔥 Save correct roadmap field from backend
            localStorage.setItem(
                "generatedRoadmap",
                data.roadmapDetails
            );

            localStorage.setItem(
                "roadmapCareer",
                data.career
            );

            
            window.location.href =
                "http://127.0.0.1:5500/roadmap.html";
        })
        .catch(error => {
            console.error("Error loading roadmap:", error);
            alert("Failed to open saved roadmap.");
        });
}





function toggleDropdown(id) {
    let dropdown = document.getElementById(id);

    dropdown.style.display =
        dropdown.style.display === "block" ? "none" : "block";
}



function logoutUser() {
    fetch("http://localhost:8080/user/logout", {
        method: "POST"
    })
    .then(response => response.text())
    .then(data => {
        console.log(data);

        localStorage.clear();
        window.location.href = "index.html";
    });
}
