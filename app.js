/************************************
 * EXAMPLE DATA
 ************************************/
let jobs = [
  {
    id: 101,
    title: "Software Engineer",
    manager: "Alice Johnson",
    level: "Senior",
    compRange: "$120k - $150k",
    notes: "High-priority role. Full-stack focus.",
    archived: false,
    jobHistory: []
  },
  {
    id: 102,
    title: "Project Manager",
    manager: "Bob Williams",
    level: "Mid",
    compRange: "$90k - $110k",
    notes: "Agile experience needed.",
    archived: false,
    jobHistory: []
  }
];

let candidates = [
  {
    id: 1,
    jobId: 101,
    name: "Jane Doe",
    email: "jane@example.com",
    position: "Software Engineer",
    notes: "Strong background in React and Node.js",
    stage: "Applied",
    sourceType: "applied",
    archived: false,
    history: [],
    feedback: {}
  },
  {
    id: 2,
    jobId: 102,
    name: "John Smith",
    email: "john@example.com",
    position: "Project Manager",
    notes: "5 years of Agile PM experience",
    stage: "Phone Screen",
    sourceType: "referral",
    archived: false,
    history: [],
    feedback: {}
  }
];

// Pipeline stages
const STAGES = ["Applied", "Phone Screen", "HM Screen", "On-site", "Offer", "Hired"];

// Track which job's pipeline is open
let currentJobId = null;

// For archiving
let candidateToArchive = null;
let jobToArchive = null;

/************************************
 * DOM
 ************************************/
// Header
const homeBtn = document.getElementById("homeBtn");
const pipelineAddCandidateBtn = document.getElementById("pipelineAddCandidateBtn");
const dropdownBtn = document.getElementById("dropdownBtn");
const dropdownContent = document.getElementById("dropdownContent");
const searchBtn = document.getElementById("searchBtn");
const searchContainer = document.getElementById("searchContainer");
const searchInput = document.getElementById("searchInput");
const viewArchivedCandidatesBtn = document.getElementById("viewArchivedCandidatesBtn");
const viewArchivedJobsBtn = document.getElementById("viewArchivedJobsBtn");

// Views
const jobsView = document.getElementById("jobsView");
const candidatesView = document.getElementById("candidatesView");
const archivedCandidatesView = document.getElementById("archivedCandidatesView");
const archivedJobsView = document.getElementById("archivedJobsView");

// Jobs
const jobsList = document.getElementById("jobsList");
const addJobForm = document.getElementById("addJobForm");

// Home candidate form
const homeCandidateForm = document.getElementById("homeCandidateForm");
const homeCandidateName = document.getElementById("homeCandidateName");
const homeCandidateEmail = document.getElementById("homeCandidateEmail");
const homeCandidateJobSelect = document.getElementById("homeCandidateJobSelect");
const homeCandidateNotes = document.getElementById("homeCandidateNotes");

// Pipeline
const jobHeader = document.getElementById("jobHeader");
const statsBar = document.getElementById("statsBar");
const appliedList = document.getElementById("appliedList");
const phoneScreenList = document.getElementById("phoneScreenList");
const hmScreenList = document.getElementById("hmScreenList");
const onsiteList = document.getElementById("onsiteList");
const offerList = document.getElementById("offerList");
const hiredList = document.getElementById("hiredList");

// Pipeline add candidate
const candidateFormContainer = document.getElementById("candidateFormContainer");
const candidateForm = document.getElementById("candidateForm");
const candidateName = document.getElementById("candidateName");
const candidateEmail = document.getElementById("candidateEmail");
const candidateJobSelect = document.getElementById("candidateJobSelect");
const candidateNotes = document.getElementById("candidateNotes");

// Archived
const archivedList = document.getElementById("archivedList");
const archivedJobsList = document.getElementById("archivedJobsList");

// Buttons
const backToJobsBtn = document.getElementById("backToJobsBtn");
const backToJobsFromArchiveCandidatesBtn = document.getElementById("backToJobsFromArchiveCandidatesBtn");
const backToJobsFromArchiveJobsBtn = document.getElementById("backToJobsFromArchiveJobsBtn");

// Candidate Detail
const viewCandidateModal = document.getElementById("viewCandidateModal");
const closeCandidateDetailModal = document.getElementById("closeCandidateDetailModal");
const candidateDetailContent = document.getElementById("candidateDetailContent");

// (If you have feedback modals, edit candidate/job modals, etc., references go here...)

/************************************
 * EVENT LISTENERS
 ************************************/
// Home button
homeBtn.addEventListener("click", () => {
  currentJobId = null;
  candidatesView.style.display = "none";
  archivedCandidatesView.style.display = "none";
  archivedJobsView.style.display = "none";
  searchContainer.style.display = "none";
  renderJobs();
});

// Pipeline add candidate button
pipelineAddCandidateBtn.addEventListener("click", () => {
  if (!currentJobId) return;
  candidateFormContainer.style.display =
    candidateFormContainer.style.display === "none" ? "block" : "none";
});

// Dropdown
dropdownBtn.addEventListener("click", () => {
  dropdownContent.style.display =
    dropdownContent.style.display === "block" ? "none" : "block";
});
window.addEventListener("click", (e) => {
  if (!e.target.matches("#dropdownBtn")) {
    dropdownContent.style.display = "none";
  }
});

// Search
searchBtn.addEventListener("click", () => {
  searchContainer.style.display =
    searchContainer.style.display === "none" ? "flex" : "none";
  searchInput.value = "";
  if (currentJobId) {
    renderPipeline();
  }
});
searchInput.addEventListener("input", () => {
  if (currentJobId) {
    renderPipeline();
  }
});

// Archived
viewArchivedCandidatesBtn.addEventListener("click", () => {
  jobsView.style.display = "none";
  candidatesView.style.display = "none";
  archivedJobsView.style.display = "none";
  archivedCandidatesView.style.display = "block";
  renderArchivedCandidates();
});
viewArchivedJobsBtn.addEventListener("click", () => {
  jobsView.style.display = "none";
  candidatesView.style.display = "none";
  archivedCandidatesView.style.display = "none";
  archivedJobsView.style.display = "block";
  renderArchivedJobs();
});

// Add job form
addJobForm.addEventListener("submit", (e) => {
  e.preventDefault();
  addNewJob();
});

// Home candidate form
homeCandidateForm.addEventListener("submit", (e) => {
  e.preventDefault();
  addCandidateFromHome();
});

// Pipeline candidate form
candidateForm.addEventListener("submit", (e) => {
  e.preventDefault();
  addCandidateFromPipeline();
});

// Back from pipeline
backToJobsBtn.addEventListener("click", () => {
  candidatesView.style.display = "none";
  archivedCandidatesView.style.display = "none";
  archivedJobsView.style.display = "none";
  currentJobId = null;
  searchContainer.style.display = "none";
  renderJobs();
});

// Back from archived
backToJobsFromArchiveCandidatesBtn.addEventListener("click", () => {
  archivedCandidatesView.style.display = "none";
  renderJobs();
});
backToJobsFromArchiveJobsBtn.addEventListener("click", () => {
  archivedJobsView.style.display = "none";
  renderJobs();
});

// DRAG & DROP columns
document.querySelectorAll(".column-content").forEach((col) => {
  col.addEventListener("dragover", (e) => {
    e.preventDefault();
    col.classList.add("drag-over");
  });
  col.addEventListener("dragleave", () => {
    col.classList.remove("drag-over");
  });
  col.addEventListener("drop", (e) => {
    e.preventDefault();
    col.classList.remove("drag-over");
    const candidateId = e.dataTransfer.getData("text/plain");
    const found = candidates.find((c) => c.id.toString() === candidateId);
    if (found) {
      const newStage = col.parentNode.getAttribute("data-stage");
      // Move candidate
      found.stage = newStage;
      // Optionally record history, etc.
      renderPipeline();
    }
  });
});

/************************************
 * INITIAL RENDER
 ************************************/
renderJobs();

/************************************
 * UTILS
 ************************************/
function populateHomeCandidateDropdown() {
  homeCandidateJobSelect.innerHTML = "";
  jobs.forEach(job => {
    if (!job.archived) {
      const opt = document.createElement("option");
      opt.value = job.id;
      opt.textContent = job.title;
      homeCandidateJobSelect.appendChild(opt);
    }
  });
}
function populatePipelineCandidateDropdown() {
  candidateJobSelect.innerHTML = "";
  jobs.forEach(job => {
    if (!job.archived) {
      const opt = document.createElement("option");
      opt.value = job.id;
      opt.textContent = job.title;
      candidateJobSelect.appendChild(opt);
    }
  });
  if (currentJobId) {
    candidateJobSelect.value = currentJobId.toString();
  }
}

/************************************
 * ADD NEW JOB
 ************************************/
function addNewJob() {
  const title = document.getElementById("jobTitle").value;
  const manager = document.getElementById("jobManager").value;
  const level = document.getElementById("jobLevel").value;
  const compRange = document.getElementById("jobCompRange").value;
  const notes = document.getElementById("jobNotes").value;

  const newJob = {
    id: Date.now(),
    title,
    manager,
    level,
    compRange,
    notes,
    archived: false,
    jobHistory: []
  };
  jobs.push(newJob);

  addJobForm.reset();
  renderJobs();
}

/************************************
 * RENDER JOBS (Home)
 ************************************/
function renderJobs() {
  // Show home, hide pipeline & archived
  jobsView.style.display = "block";
  candidatesView.style.display = "none";
  archivedCandidatesView.style.display = "none";
  archivedJobsView.style.display = "none";

  // Hide pipelineAddCandidateBtn on home
  pipelineAddCandidateBtn.style.display = "none";

  // Populate home candidate dropdown
  populateHomeCandidateDropdown();

  jobsList.innerHTML = "";
  const activeJobs = jobs.filter(j => !j.archived);

  activeJobs.forEach(job => {
    const card = document.createElement("div");
    card.classList.add("job-card");
    card.innerHTML = `
      <h4>${job.title}</h4>
      <p><strong>Manager:</strong> ${job.manager}</p>
      <p><strong>Level:</strong> ${job.level || ""}</p>
      <p><strong>Comp Range:</strong> ${job.compRange || ""}</p>
      <p><strong>Notes:</strong> ${job.notes || ""}</p>
      <div class="job-actions">
        <button class="view-pipeline-btn">View Pipeline</button>
        <button class="edit-job-btn">Edit</button>
        <button class="archive-job-btn">Archive</button>
      </div>
    `;
    jobsList.appendChild(card);

    const viewBtn = card.querySelector(".view-pipeline-btn");
    const editBtn = card.querySelector(".edit-job-btn");
    const archiveBtn = card.querySelector(".archive-job-btn");

    viewBtn.addEventListener("click", () => {
      currentJobId = job.id;
      jobsView.style.display = "none";
      archivedCandidatesView.style.display = "none";
      archivedJobsView.style.display = "none";
      candidatesView.style.display = "block";
      pipelineAddCandidateBtn.style.display = "inline-block";
      candidateFormContainer.style.display = "none";
      renderPipeline();
    });

    editBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      openEditJobModal(job.id);
    });

    archiveBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      jobToArchive = job;
      // show archive job modal...
    });
  });
}

/************************************
 * RENDER PIPELINE
 ************************************/
function renderPipeline() {
  const job = jobs.find(j => j.id === currentJobId);
  if (!job) return;

  jobHeader.innerHTML = `
    <h2>${job.title}</h2>
    <p class="job-subdetails">Manager: ${job.manager}</p>
    <p class="job-subdetails">Level: ${job.level}</p>
    <p class="job-subdetails">Comp Range: ${job.compRange}</p>
    <p class="job-subdetails">Notes: ${job.notes}</p>
  `;

  appliedList.innerHTML = "";
  phoneScreenList.innerHTML = "";
  hmScreenList.innerHTML = "";
  onsiteList.innerHTML = "";
  offerList.innerHTML = "";
  hiredList.innerHTML = "";

  // Could do stats...
  populatePipelineCandidateDropdown();

  const jobCandidates = candidates.filter(c => c.jobId === currentJobId && !c.archived);
  const searchTerm = searchInput.value.toLowerCase();

  jobCandidates.forEach(candidate => {
    if (searchTerm && !candidate.name.toLowerCase().includes(searchTerm)) {
      return;
    }

    const card = document.createElement("div");
    card.className = "candidate-card";
    // draggable
    card.draggable = true;
    card.dataset.id = candidate.id;

    card.innerHTML = `
      <span class="candidate-name">${candidate.name}</span>
      <span class="candidate-position">${candidate.position}</span>
      <span class="candidate-email">${candidate.email}</span>
      <p class="candidate-notes">${candidate.notes}</p>
      <p><span class="candidate-source">${candidate.sourceType}</span></p>
      <div class="card-actions">
        <button class="edit-btn">Edit</button>
        <button class="archive-btn">Archive</button>
        <button class="transfer-btn">Transfer</button>
        <button class="feedback-btn">Feedback</button>
      </div>
    `;

    // DRAG events on the entire card
    card.addEventListener("dragstart", handleDragStart);
    card.addEventListener("dragend", handleDragEnd);

    // Buttons
    const editBtn = card.querySelector(".edit-btn");
    const archiveBtn = card.querySelector(".archive-btn");
    const transferBtn = card.querySelector(".transfer-btn");
    const feedbackBtn = card.querySelector(".feedback-btn");
    const nameEl = card.querySelector(".candidate-name");

    // **Key fix**: e.preventDefault & e.stopPropagation
    editBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      openEditCandidateModal(candidate.id);
    });
    archiveBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      candidateToArchive = candidate;
      // show archiveConfirmModal...
    });
    transferBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      openTransferModal(candidate.id);
    });
    feedbackBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      // open feedback modal...
    });

    nameEl.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      openCandidateDetailModal(candidate.id);
    });

    // place in correct column
    switch (candidate.stage) {
      case "Applied": appliedList.appendChild(card); break;
      case "Phone Screen": phoneScreenList.appendChild(card); break;
      case "HM Screen": hmScreenList.appendChild(card); break;
      case "On-site": onsiteList.appendChild(card); break;
      case "Offer": offerList.appendChild(card); break;
      case "Hired": hiredList.appendChild(card); break;
      default: appliedList.appendChild(card); break;
    }
  });
}

/************************************
 * ADD CANDIDATE (Home)
 ************************************/
function addCandidateFromHome() {
  let name = homeCandidateName.value;
  let email = homeCandidateEmail.value;
  let notes = homeCandidateNotes.value;
  let source = document.querySelector('input[name="homeCandidateSource"]:checked').value;
  let selectedJobId = Number(homeCandidateJobSelect.value);

  let jobObj = jobs.find(j => j.id === selectedJobId);
  let jobTitle = jobObj ? jobObj.title : "Unknown";

  let newCandidate = {
    id: Date.now(),
    jobId: selectedJobId,
    name,
    email,
    position: jobTitle,
    notes,
    stage: "Applied",
    sourceType: source,
    archived: false,
    history: [],
    feedback: {}
  };
  candidates.push(newCandidate);

  homeCandidateForm.reset();
  renderJobs();
}

/************************************
 * ADD CANDIDATE (Pipeline)
 ************************************/
function addCandidateFromPipeline() {
  let name = candidateName.value;
  let email = candidateEmail.value;
  let notes = candidateNotes.value;
  let source = document.querySelector('input[name="candidateSource"]:checked').value;
  let selectedJobId = Number(candidateJobSelect.value);

  let jobObj = jobs.find(j => j.id === selectedJobId);
  let jobTitle = jobObj ? jobObj.title : "Unknown";

  let newCandidate = {
    id: Date.now(),
    jobId: selectedJobId,
    name,
    email,
    position: jobTitle,
    notes,
    stage: "Applied",
    sourceType: source,
    archived: false,
    history: [],
    feedback: {}
  };
  candidates.push(newCandidate);

  candidateForm.reset();
  candidateFormContainer.style.display = "none";
  renderPipeline();
}

/************************************
 * ARCHIVED CANDIDATES
 ************************************/
function renderArchivedCandidates() {
  archivedCandidatesView.style.display = "block";
  archivedList.innerHTML = "";

  const archCands = candidates.filter(c => c.archived);
  if (archCands.length === 0) {
    archivedList.innerHTML = `<p>No archived candidates found.</p>`;
    return;
  }
  // ... same logic to display archived candidates ...
}

/************************************
 * ARCHIVED JOBS
 ************************************/
function renderArchivedJobs() {
  archivedJobsView.style.display = "block";
  archivedJobsList.innerHTML = "";

  const archJobs = jobs.filter(j => j.archived);
  if (archJobs.length === 0) {
    archivedJobsList.innerHTML = `<p>No archived jobs found.</p>`;
    return;
  }
  // ... same logic to display archived jobs ...
}

/************************************
 * EDIT CANDIDATE
 ************************************/
function openEditCandidateModal(candidateId) {
  // ...
}
function saveCandidateEdits() {
  // ...
}

/************************************
 * EDIT JOB
 ************************************/
function openEditJobModal(jobId) {
  // ...
}
function saveJobEdits() {
  // ...
}

/************************************
 * TRANSFER
 ************************************/
function openTransferModal(candidateId) {
  // ...
}
function completeTransfer() {
  // ...
}

/************************************
 * CANDIDATE DETAIL MODAL
 ************************************/
function openCandidateDetailModal(candidateId) {
  // ...
}

/************************************
 * DRAG & DROP
 ************************************/
let draggedCard = null;
function handleDragStart(e) {
  draggedCard = e.target;
  e.dataTransfer.setData("text/plain", e.target.dataset.id);
  setTimeout(() => {
    e.target.style.display = "none";
  }, 0);
}
function handleDragEnd(e) {
  setTimeout(() => {
    if (draggedCard) {
      draggedCard.style.display = "block";
      draggedCard = null;
    }
  }, 0);
}
