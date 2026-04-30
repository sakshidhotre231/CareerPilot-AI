const userId = localStorage.getItem("userId");

let roadmapsData = [];
let selectedRoadmap = null;


window.onload = async function () {

    try {
        const response = await fetch(
            `http://localhost:8080/roadmap/user/${userId}`
        );

        roadmapsData = await response.json();

        const dropdown = document.getElementById("roadmapDropdown");
        dropdown.innerHTML = `<option value="">Select a roadmap</option>`;

        roadmapsData.forEach(rm => {
            dropdown.innerHTML += `
                <option value="${rm.id}">
                    ${rm.career} (${rm.generatedDate})
                </option>
            `;
        });

    } catch (error) {
        console.error("Error loading roadmaps:", error);
    }
};



document.getElementById("loadTrackerBtn")
    .addEventListener("click", function () {

        const roadmapId =
            document.getElementById("roadmapDropdown").value;

        if (!roadmapId) {
            alert("Please select a roadmap");
            return;
        }

        selectedRoadmap = roadmapsData.find(rm => rm.id == roadmapId);

        if (!selectedRoadmap) {
            alert("Roadmap not found");
            return;
        }

        document.getElementById("trackerContent").style.display = "block";

        document.getElementById("careerName").innerText =
            selectedRoadmap.career;

        loadTrackerSteps(selectedRoadmap);
    });



async function loadTrackerSteps(roadmap) {

    const container = document.getElementById("stepsContainer");
    container.innerHTML = "";

    let steps = [];

    let roadmapText = roadmap.roadmapDetails;

    if (typeof roadmapText !== "string") {
        roadmapText = JSON.stringify(roadmapText);
    }

    roadmapText.split("\n").forEach(line => {
        line = line.trim();

        if (line.startsWith("*")) {
            let skill = line.replace("*", "").trim();
            if (skill) steps.push(skill);
        }
    });

    steps = [...new Set(steps)].slice(0, 8);

    if (steps.length === 0) {
        container.innerHTML = `<p>No steps found</p>`;
        updateProgress();
        return;
    }

    
    let savedSteps = {};

    try {
        const res = await fetch(
            `http://localhost:8080/api/tracker/roadmap/${roadmap.id}`
        );

        if (res.ok) {
            const data = await res.json();

            // 🔥 FIX: prevent overwrite issues
            let tempMap = new Map();

            data.forEach(item => {
                tempMap.set(item.skillName.trim(), item.completed);
            });

            tempMap.forEach((value, key) => {
                savedSteps[key] = value;
            });
        }

    } catch (err) {
        console.error("Progress load failed:", err);
    }

    
    steps.forEach((step, index) => {

        const cleanStep = step.trim();
        const checked = savedSteps[cleanStep] === true;

        container.innerHTML += `
            <div class="track-step">
                <input 
                    type="checkbox"
                    class="stepCheck"
                    id="step${index}"
                    ${checked ? "checked" : ""}
                    onchange="saveProgress(${roadmap.id}, '${cleanStep}', this)"
                >
                <label for="step${index}">
                    ${cleanStep}
                </label>
            </div>
        `;
    });

    updateProgress();
}



function saveProgress(roadmapId, step, checkbox) {

    fetch("http://localhost:8080/api/tracker/save", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            roadmapId: roadmapId,
            userId: parseInt(userId),
            career: selectedRoadmap.career,
            skillName: step.trim(),
            completed: checkbox.checked
        })
    })
    .then(() => updateProgress())
    .catch(err => console.error("Save error:", err));
}



function updateProgress() {

    const checks = document.querySelectorAll(".stepCheck");
    const checked = document.querySelectorAll(".stepCheck:checked");

    const progress = checks.length === 0
        ? 0
        : Math.round((checked.length / checks.length) * 100);

    document.getElementById("progressText").innerText = progress + "%";
    document.getElementById("progressFill").style.width = progress + "%";

    const messageBox = document.getElementById("completionMessage");

    if (messageBox) {
        messageBox.innerHTML =
            progress === 100
                ? `<div class="completion-box">🎉 Congratulations! You completed this roadmap.</div>`
                : "";
    }
}
