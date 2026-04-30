const questions = [
    {
        question: "Which type of activity excites you the most?",
        options: [
            "💻 Solving technical or logical problems",
            "🎨 Designing visuals or creative concepts",
            "📈 Managing people or planning strategies",
            "🩺 Helping people with health or guidance",
            "📚 Teaching, research, or academic work"
        ]
    },
    {
        question: "Which subject do you enjoy the most?",
        options: [
            "💻 Math / Computer Science",
            "🩺 Biology / Healthcare",
            "💰 Commerce / Finance",
            "🎨 Arts / Design",
            "⚖️ Social Science / Law"
        ]
    },
    {
        question: "What kind of environment do you prefer?",
        options: [
            "💻 Office / tech workspace",
            "🎨 Creative studio",
            "🩺 Hospital / lab",
            "📚 Classroom / research center",
            "⚖️ Field work / public service"
        ]
    },
    {
        question: "What are people usually impressed by in you?",
        options: [
            "🧠 Problem-solving ability",
            "🎨 Creativity and imagination",
            "📈 Leadership and decision making",
            "🤝 Empathy and communication",
            "🔍 Attention to detail"
        ]
    },
    {
        question: "What motivates you the most?",
        options: [
            "💡 Innovation and building solutions",
            "🎨 Creative expression",
            "❤️ Helping society",
            "💰 Financial growth",
            "📚 Knowledge and research"
        ]
    },
    {
        question: "Which future role sounds most exciting?",
        options: [
            "💻 Engineer / Developer",
            "🎨 Designer / Creator",
            "📈 Manager / Entrepreneur",
            "🩺 Doctor / Psychologist",
            "📚 Teacher / Researcher"
        ]
    },
    {
        question: "What type of career lifestyle do you prefer?",
        options: [
            "💻 Structured technical career",
            "🎨 Creative flexible work",
            "📈 Leadership and management",
            "⚖️ Public service",
            "📚 Research-oriented work"
        ]
    }
];

let currentQuestion = 0;
let answers = [];

const questionText = document.getElementById("questionText");
const questionTitle = document.getElementById("questionTitle");
const optionsGroup = document.getElementById("optionsGroup");
const progressText = document.getElementById("progressText");
const progressFill = document.getElementById("progressFill");
const nextBtn = document.getElementById("nextBtn");
const prevBtn = document.getElementById("prevBtn");
const insightText = document.getElementById("insightText");

function loadQuestion() {
    const q = questions[currentQuestion];

    questionTitle.innerText = `Question ${currentQuestion + 1}`;
    questionText.innerText = q.question;

    progressText.innerText = `Question ${currentQuestion + 1} of ${questions.length}`;
    progressFill.style.width = `${((currentQuestion + 1) / questions.length) * 100}%`;

    insightText.innerText =
        "This question helps AI evaluate your strengths across technology, healthcare, design, business, education, and public service.";

    optionsGroup.innerHTML = "";

    q.options.forEach(option => {
        optionsGroup.innerHTML += `
            <label class="option-item">
                <input type="radio" name="answer" value="${option}">
                ${option}
            </label>
        `;
    });

    if (answers[currentQuestion]) {
        const prevSelected = document.querySelector(
            `input[name="answer"][value="${answers[currentQuestion]}"]`
        );
        if (prevSelected) prevSelected.checked = true;
    }
}


function submitAssessment() {
    const userId = localStorage.getItem("userId");

    if (!userId) {
        alert("No user logged in. Using test userId=1.");
        localStorage.setItem("userId", "1");
    }

    fetch("http://localhost:8080/api/assessment/submit", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            userId: parseInt(localStorage.getItem("userId")),
            answers: answers.join(";")
        })
    })
    .then(response => response.json())
    .then(data => {
        alert("Assessment Completed Successfully!");

        
        localStorage.setItem("recommendedCareer", data.recommendedCareer);
        localStorage.setItem("bestDomain", data.bestDomain);

        localStorage.setItem(
            "careerSuggestions",
            JSON.stringify(data.careerSuggestions || data.topSuggestions || [])
        );

        localStorage.setItem(
            "careerBrief",
            data.careerBrief || ""
        );

        localStorage.setItem(
            "futureScope",
            data.futureScope || ""
        );

        localStorage.setItem(
            "skills",
            JSON.stringify(data.skills || [])
        );

        localStorage.setItem(
            "assessmentAnswers",
            answers.join(";")
        );

        // Redirect
        window.location.href = "assessmentReport.html";
    })
    .catch(error => {
        console.error("Error submitting assessment:", error);
        alert("Failed to submit assessment.");
    });
}



nextBtn.addEventListener("click", function () {
    const selected = document.querySelector('input[name="answer"]:checked');

    if (!selected) {
        alert("Please select an option");
        return;
    }

    answers[currentQuestion] = selected.value;

    if (currentQuestion < questions.length - 1) {
        currentQuestion++;
        loadQuestion();
    } else {
        submitAssessment();
    }
});

prevBtn.addEventListener("click", function () {
    if (currentQuestion > 0) {
        currentQuestion--;
        loadQuestion();
    }
});

loadQuestion();
