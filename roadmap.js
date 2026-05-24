window.onload = function () {

    const savedRoadmap = localStorage.getItem("generatedRoadmap");
    const savedCareer = localStorage.getItem("roadmapCareer");

    if (savedRoadmap) {

        const display = document.getElementById("roadmapDisplay");
        display.innerHTML = "";

        // 🔥 Use existing display function
        displayRoadmap(
            savedRoadmap,
            savedCareer || "Career Roadmap",
            "Saved Roadmap"
        );

        return; // stop normal flow
    }

};


// Fetch and display previous roadmaps
async function loadPreviousRoadmaps() {
    const userId = localStorage.getItem("userId") || 1;

    try {
        const response = await fetch(`http://localhost:8080/roadmap/user/${userId}`);
        if (!response.ok) throw new Error("Failed to fetch previous roadmaps");

        const roadmaps = await response.json();
        const display = document.getElementById("roadmapDisplay");
        display.innerHTML = ""; // clear

        roadmaps.forEach(rm => {
            let roadmapData;
            try {
                roadmapData = typeof rm.roadmapDetails === "string" 
                    ? JSON.parse(rm.roadmapDetails) 
                    : rm.roadmapDetails;
            } catch (e) {
                console.error("Failed to parse roadmapDetails:", e, rm.roadmapDetails);
                // fallback to empty structure
                roadmapData = { phases: [], totalDuration: "N/A" };
            }

            displayRoadmap(roadmapData, rm.career, rm.generatedDate);
        });

    } catch (err) {
        console.error("Error loading previous roadmaps:", err);
    }
}

// Display roadmap
function displayRoadmap(roadmapData, careerName, generatedDate) {
    const display = document.getElementById("roadmapDisplay");

    const header = document.createElement("h2");
    header.innerText = `${careerName} Roadmap (Generated: ${generatedDate})`;
    header.style.marginTop = "30px";
    display.appendChild(header);

    // OLD JSON format support
    if (roadmapData.phases && Array.isArray(roadmapData.phases)) {
        roadmapData.phases.forEach((phase) => {
            const phaseCard = document.createElement("div");
            phaseCard.classList.add("phase-card");

            const title = document.createElement("h3");
            title.innerText = phase.phase;

            const details = document.createElement("p");
            details.innerText = `Skills: ${phase.skills.join(", ")} | Duration: ${phase.duration}`;

            phaseCard.appendChild(title);
            phaseCard.appendChild(details);
            display.appendChild(phaseCard);
        });

        const total = document.createElement("p");
        total.id = "totalDuration";
        total.innerText = `Total Duration: ${roadmapData.totalDuration}`;
        display.appendChild(total);
    }

    // NEW Hugging Face text format support
    else {

    roadmapData = roadmapData
        .replace(/\*\*/g, "")
        .replace(/\*/g, "")
        .replace(/#+/g, "");

    const phases = roadmapData.split(/(?=Phase \d+:)/);

    phases.forEach((phase) => {

        if (phase.trim() !== "") {

            const phaseCard = document.createElement("div");
            phaseCard.classList.add("phase-card");

            const lines = phase.trim().split("\n");

            const title = lines.shift();

            const heading = document.createElement("h3");
            heading.innerText = title;

            const list = document.createElement("ul");

            lines.forEach(line => {

                if (line.trim() !== "") {

                    const li = document.createElement("li");
                    li.innerText = line.trim();

                    list.appendChild(li);
                }
            });

            phaseCard.appendChild(heading);
            phaseCard.appendChild(list);

            display.appendChild(phaseCard);
        }
    });
}
}


// Generate new roadmap
document.getElementById("generateRoadmapBtn").addEventListener("click", async function() {
    const careerInputEl = document.getElementById("careerInput");
    if (!careerInputEl) {
        alert("Career input field is missing in HTML!");
        return;
    }

    const career = careerInputEl.value.trim();
    if (!career) {
        alert("Please enter a career name.");
        return;
    }

    const userId = localStorage.getItem("userId") || 1;

    try {
        const response = await fetch(`http://localhost:8080/roadmap/generate?userId=${userId}&career=${encodeURIComponent(career)}`, {
            method: "POST"
        });

        if (!response.ok) {
            const text = await response.text();
            throw new Error(`Failed to generate roadmap. Server response: ${text}`);
        }

        const roadmap = await response.json();
        let roadmapData = roadmap.roadmapDetails;


        const display = document.getElementById("roadmapDisplay");
        display.innerHTML = ""; // clear
        displayRoadmap(roadmapData, roadmap.career, roadmap.generatedDate);

        

    } catch (err) {
        console.error("Error generating roadmap:", err);
        alert("Error generating roadmap. Check console for details.");
    }
});

