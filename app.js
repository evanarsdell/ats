/************************************
 * DATA & INITIAL STATE
 ************************************/

// Example jobs
let jobs = [
  {
    id: 101,
    title: "Software Engineer",
    manager: "Alice Johnson",
    level: "Senior",
    compRange: "$120k - $150k",
    notes: "High-priority role. Full-stack focus."
  },
  {
    id: 102,
    title: "Project Manager",
    manager: "Bob Williams",
    level: "Mid",
    compRange: "$90k - $110k",
    notes: "Agile experience needed."
  }
];

// Example candidates
let candidates = [
  {
    id: 1,
    jobId: 101, // belongs to "Software Engineer" job
    name: "Jane Doe",
    email: "jane@example.com",
    position: "Software Engineer",
    notes: "Strong background in React and Node.js",
    stage: "Applied",
    sourceType: "applied",
    archived: false,
    history: [],
    feedback: {
      // "Phone Screen": { rating: "yes", notes: "..." },
      // "On-site": { rating: "strong_yes", notes: "...", interviews: [ { name, rating, notes } ] }
    }
  },
  {
    id: 2,
    jobId: 102, // belongs to "Project Manager" job
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

// Possible pipeline stages
const STAGES = ["Applied", "Phone Screen", "HM Screen", "On-site", "Offer", "Hired"];

// Track which job's pipeline we're viewing
let currentJobId = null;

// We'll store which candidate is about to be archived
let candidateToArchive = null;

/************************************
 * DOM ELEMENTS
 ************************************/
// Top-level
const dropdownBtn = document.getElementById("dropdownBtn");
const dropdownContent = document.getElementById("dropdownContent");
const toggleFormBtn = document.getElementById("toggleFormBtn");
const searchBtn = document.getElementById("searchBtn");
const searchContainer = document.getElementById("searchContainer");
const searchInput = document.getElementById("searchInput");
const viewArchivedBtn = document.getElementById("viewArchivedBtn");

// Views
const jobsView = document.getElementById("jobsView");
const candidatesView = document.getElementById("candidatesView");
const archivedView = document.getElementById("archivedView");

// Jobs
const jobsList = document.getElementById("jobsList");
const addJobForm = document.getElementById("addJobForm");

// Pipeline
const jobHeader = document.getElementById("jobHeader");
const statsBar = document.getElementById("statsBar");
const appliedList = document.getElementById("appliedList");
const phoneScreenList = document.getElementById("phoneScreenList");
const hmScreenList = document.getElementById("hmScreenList");
const onsiteList = document.getElementById("onsiteList");
const offerList = document.getElementById("offerList");
const hiredList = document.getElementById("hiredList");

// Candidate Form
const candidateFormContainer = document.getElementById("candidateFormContainer");
const candidateForm = document.getElementById("candidateForm");
const backToJobsBtn = document.getElementById("backToJobsBtn");

// Archived
const archivedList = document.getElementById("archivedList");
const backToJobsFromArchiveBtn = document.getElementById("backToJobsFromArchiveBtn");

// Edit Candidate Modal
const editCandidateModal = document.getElementById("editCandidateModal");
const closeCandidateModal = document.getElementById("closeCandidateModal");
const editCandidateForm = document.getElementById("editCandidateForm");
const editCandidateId = document.getElementById("editCandidateId");
const editCandidateName = document.getElementById("editCandidateName");
const editCandidateEmail = document.getElementById("editCandidateEmail");
const editCandidatePosition = document.getElementById("editCandidatePosition");
const editCandidateNotes = document.getElementById("editCandidateNotes");

// Edit Job Modal
const editJobModal = document.getElementById("editJobModal");
const closeJobModal = document.getElementById("closeJobModal");
const editJobForm = document.getElementById("editJobForm");
const editJobId = document.getElementById("editJobId");
const editJobTitle = document.getElementById("editJobTitle");
const editJobManager = document.getElementById("editJobManager");
const editJobLevel = document.getElementById("editJobLevel");
const editJobCompRange = document.getElementById("editJobCompRange");
const editJobNotes = document.getElementById("editJobNotes");

// Transfer Candidate Modal
const transferCandidateModal = document.getElementById("transferCandidateModal");
const closeTransferModal = document.getElementById("closeTransferModal");
const transferCandidateForm = document.getElementById("transferCandidateForm");
const transferCandidateId = document.getElementById("transferCandidateId");
const transferJobSelect = document.getElementById("transferJobSelect");

// Feedback Candidate Modal
const feedbackCandidateModal = document.getElementById("feedbackCandidateModal");
const closeFeedbackModal = document.getElementById("closeFeedbackModal");
const feedbackCandidateForm = document.getElementById("feedbackCandidateForm");
const feedbackCandidateId = document.getElementById("feedbackCandidateId");
const feedbackStageSelect = document.getElementById("feedbackStageSelect");
const feedbackRatingSelect = document.getElementById("feedbackRatingSelect");
const feedbackNotes = document.getElementById("feedbackNotes");
const onsiteInterviewersSection = document.getElementById("onsiteInterviewersSection");
const addInterviewerBtn = document.getElementById("addInterviewerBtn");
const onsiteInterviewersList = document.getElementById("onsiteInterviewersList");

// Archive Confirm Modal
const archiveConfirmModal = document.getElementById("archiveConfirmModal");
const closeArchiveModal = document.getElementById("closeArchiveModal");
const archiveYesBtn = document.getElementById("archiveYesBtn");
const archiveNoBtn = document.getElementById("archiveNoBtn");

/************************************
 * EVENT LISTENERS
 ************************************/
// Dropdown menu
dropdownBtn.addEventListener("click", () => {
  dropdownContent.style.display =
    dropdownContent.style.display === "block" ? "none" : "block";
});

// Close dropdown if clicked outside
window.addEventListener("click", (event) => {
  if (!event.target.matches("#dropdownBtn")) {
    dropdownContent.style.display = "none";
  }
});

// Show/hide search bar
searchBtn.addEventListener("click", () => {
  searchContainer.style.display =
    searchContainer.style.display === "none" ? "flex" : "none";
  searchInput.value = "";
  if (currentJobId) {
    renderPipeline();
  }
});

// Search input
searchInput.addEventListener("input", () => {
  if (currentJobId) {
    renderPipeline();
  }
});

// View archived
viewArchivedBtn.addEventListener("click", () => {
  // Show archived view
  jobsView.style.display = "none";
  candidatesView.style.display = "none";
  archivedView.style.display = "block";
  renderArchivedCandidates();
});

// Back from archived to jobs
backToJobsFromArchiveBtn.addEventListener("click", () => {
  archivedView.style.display = "none";
  renderJobs();
});

// Jobs
addJobForm.addEventListener("submit", (e) => {
  e.preventDefault();
  addNewJob();
});

// Candidates
toggleFormBtn.addEventListener("click", () => {
  if (!currentJobId) return;
  candidateFormContainer.style.display =
    candidateFormContainer.style.display === "none" ? "block" : "none";
});
candidateForm.addEventListener("submit", (e) => {
  e.preventDefault();
  addNewCandidate();
});

// Back to jobs
backToJobsBtn.addEventListener("click", () => {
  // Hide pipeline, show jobs
  candidatesView.style.display = "none";
  jobsView.style.display = "block";
  currentJobId = null;
  searchContainer.style.display = "none";
  renderJobs();
});

// Drag & drop on each column
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
      recordHistory(found, "stage_change", `Moved from ${found.stage} to ${newStage}`);
      found.stage = newStage;
      renderPipeline();
    }
  });
});

// Close modals
closeCandidateModal.addEventListener("click", () => {
  editCandidateModal.classList.remove("show");
});
closeJobModal.addEventListener("click", () => {
  editJobModal.classList.remove("show");
});
closeTransferModal.addEventListener("click", () => {
  transferCandidateModal.classList.remove("show");
});
closeFeedbackModal.addEventListener("click", () => {
  feedbackCandidateModal.classList.remove("show");
});
closeArchiveModal.addEventListener("click", () => {
  archiveConfirmModal.classList.remove("show");
});

// Archive confirm
archiveYesBtn.addEventListener("click", () => {
  if (!candidateToArchive) return;
  candidateToArchive.archived = true;
  recordHistory(candidateToArchive, "archive", "Candidate archived");
  archiveConfirmModal.classList.remove("show");
  candidateToArchive = null;
  renderPipeline();
});
archiveNoBtn.addEventListener("click", () => {
  archiveConfirmModal.classList.remove("show");
  candidateToArchive = null;
});

// Edit Candidate form
editCandidateForm.addEventListener("submit", (e) => {
  e.preventDefault();
  saveCandidateEdits();
});

// Edit Job form
editJobForm.addEventListener("submit", (e) => {
  e.preventDefault();
  saveJobEdits();
});

// Transfer Candidate form
transferCandidateForm.addEventListener("submit", (e) => {
  e.preventDefault();
  completeTransfer();
});

// Feedback form
feedbackCandidateForm.addEventListener("submit", (e) => {
  e.preventDefault();
  saveFeedback();
});

// On-site multiple interviewers
addInterviewerBtn.addEventListener("click", () => {
  const block = document.createElement("div");
  block.classList.add("interviewer-block");
  block.innerHTML = `
    <label>Name</label>
    <input type="text" class="interviewer-name" />

    <label>Rating</label>
    <select class="interviewer-rating">
      <option value="strong_no">Strong No</option>
      <option value="no">No</option>
      <option value="yes">Yes</option>
      <option value="strong_yes">Strong Yes</option>
    </select>

    <label>Notes</label>
    <textarea class="interviewer-notes"></textarea>
  `;
  onsiteInterviewersList.appendChild(block);
});

/************************************
 * INIT
 ************************************/
renderJobs(); // Show jobs view by default

/************************************
 * JOBS FUNCTIONS
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
    notes
  };
  jobs.push(newJob);

  // Reset form
  addJobForm.reset();

  // Re-render
  renderJobs();
}

function renderJobs() {
  // Show jobs, hide pipeline & archive
  jobsView.style.display = "block";
  candidatesView.style.display = "none";
  archivedView.style.display = "none";

  // Hide "Add Candidate Form" button on the home page
  toggleFormBtn.style.display = "none";

  jobsList.innerHTML = "";

  jobs.forEach((job) => {
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
        <button class="delete-job-btn">Delete</button>
      </div>
    `;
    jobsList.appendChild(card);

    // Buttons
    const viewBtn = card.querySelector(".view-pipeline-btn");
    const editBtn = card.querySelector(".edit-job-btn");
    const deleteBtn = card.querySelector(".delete-job-btn");

    // View pipeline
    viewBtn.addEventListener("click", () => {
      currentJobId = job.id;
      jobsView.style.display = "none";
      archivedView.style.display = "none";
      candidatesView.style.display = "block";
      candidateFormContainer.style.display = "none";
      toggleFormBtn.style.display = "inline-block"; // show "Add Candidate" button

      renderPipeline();
    });

    // Edit job
    editBtn.addEventListener("click", () => openEditJobModal(job.id));

    // Delete job
    deleteBtn.addEventListener("click", () => {
      // Remove all candidates associated with this job
      candidates = candidates.filter(c => c.jobId !== job.id);
      // Remove the job
      jobs = jobs.filter(j => j.id !== job.id);
      renderJobs();
    });
  });
}

function openEditJobModal(jobId) {
  const job = jobs.find(j => j.id === jobId);
  if (!job) return;

  editJobId.value = job.id;
  editJobTitle.value = job.title;
  editJobManager.value = job.manager;
  editJobLevel.value = job.level;
  editJobCompRange.value = job.compRange;
  editJobNotes.value = job.notes;

  editJobModal.classList.add("show");
}

function saveJobEdits() {
  const id = Number(editJobId.value);
  const job = jobs.find(j => j.id === id);
  if (!job) return;

  job.title = editJobTitle.value;
  job.manager = editJobManager.value;
  job.level = editJobLevel.value;
  job.compRange = editJobCompRange.value;
  job.notes = editJobNotes.value;

  editJobModal.classList.remove("show");
  renderJobs();
}

/************************************
 * PIPELINE / CANDIDATES FUNCTIONS
 ************************************/
function renderPipeline() {
  // Find the current job
  const job = jobs.find(j => j.id === currentJobId);
  if (!job) return;

  // Show job header at top of pipeline
  jobHeader.innerHTML = `
    <h2>${job.title}</h2>
    <p class="job-subdetails">Manager: ${job.manager}</p>
    <p class="job-subdetails">Level: ${job.level}</p>
    <p class="job-subdetails">Comp Range: ${job.compRange}</p>
    <p class="job-subdetails">Notes: ${job.notes}</p>
  `;

  // Clear columns
  appliedList.innerHTML = "";
  phoneScreenList.innerHTML = "";
  hmScreenList.innerHTML = "";
  onsiteList.innerHTML = "";
  offerList.innerHTML = "";
  hiredList.innerHTML = "";

  // Stats
  renderStats();

  // Filter for candidates in this job and not archived
  const jobCandidates = candidates.filter(c => c.jobId === currentJobId && !c.archived);
  const searchTerm = searchInput.value.toLowerCase();

  jobCandidates.forEach(candidate => {
    // Filter by search name
    if (!candidate.name.toLowerCase().includes(searchTerm)) {
      return;
    }

    // Create card
    const card = document.createElement("div");
    card.className = "candidate-card";
    card.draggable = true;
    card.dataset.id = candidate.id;

    // Build a feedback summary snippet
    const feedbackSummary = getFeedbackSummary(candidate);

    card.innerHTML = `
      <span class="candidate-name">${candidate.name}</span>
      <span class="candidate-position">${candidate.position}</span>
      <span class="candidate-email">${candidate.email}</span>
      <p class="candidate-notes">${candidate.notes}</p>
      <p><span class="candidate-source">${candidate.sourceType}</span></p>

      ${feedbackSummary}

      <div class="card-actions">
        <button class="edit-btn">Edit</button>
        <button class="archive-btn">Archive</button>
        <button class="transfer-btn">Transfer</button>
        <button class="feedback-btn">Feedback</button>
      </div>
    `;

    // Drag events
    card.addEventListener("dragstart", handleDragStart);
    card.addEventListener("dragend", handleDragEnd);

    // Buttons
    const editBtn = card.querySelector(".edit-btn");
    const archiveBtn = card.querySelector(".archive-btn");
    const transferBtn = card.querySelector(".transfer-btn");
    const feedbackBtn = card.querySelector(".feedback-btn");

    editBtn.addEventListener("click", () => openEditCandidateModal(candidate.id));
    archiveBtn.addEventListener("click", () => openArchiveModal(candidate));
    transferBtn.addEventListener("click", () => openTransferModal(candidate.id));
    feedbackBtn.addEventListener("click", () => openFeedbackModal(candidate.id));

    // Place in correct column
    switch (candidate.stage) {
      case "Applied":
        appliedList.appendChild(card);
        break;
      case "Phone Screen":
        phoneScreenList.appendChild(card);
        break;
      case "HM Screen":
        hmScreenList.appendChild(card);
        break;
      case "On-site":
        onsiteList.appendChild(card);
        break;
      case "Offer":
        offerList.appendChild(card);
        break;
      case "Hired":
        hiredList.appendChild(card);
        break;
      default:
        appliedList.appendChild(card);
        break;
    }
  });
}

function renderStats() {
  statsBar.innerHTML = "";

  STAGES.forEach(stage => {
    const count = candidates.filter(c => c.jobId === currentJobId && !c.archived && c.stage === stage).length;
    const statItem = document.createElement("div");
    statItem.classList.add("stat-item");
    statItem.innerHTML = `${stage}: <span>${count}</span>`;
    statsBar.appendChild(statItem);
  });
}

/** Add new candidate for the current job */
function addNewCandidate() {
  if (!currentJobId) return;

  const name = document.getElementById("candidateName").value;
  const email = document.getElementById("candidateEmail").value;
  const position = document.getElementById("candidatePosition").value;
  const notes = document.getElementById("candidateNotes").value;
  const sourceType = document.querySelector('input[name="candidateSource"]:checked').value;

  const newCandidate = {
    id: Date.now(),
    jobId: currentJobId,
    name,
    email,
    position,
    notes,
    stage: "Applied",
    sourceType,
    archived: false,
    history: [],
    feedback: {}
  };
  candidates.push(newCandidate);

  // Record initial creation
  recordHistory(newCandidate, "create", "Candidate created in job " + currentJobId);

  // Clear form
  candidateForm.reset();
  candidateFormContainer.style.display = "none";
  renderPipeline();
}

/** Drag & Drop */
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
    draggedCard.style.display = "block";
    draggedCard = null;
  }, 0);
}

/************************************
 * ARCHIVE
 ************************************/
function openArchiveModal(candidate) {
  candidateToArchive = candidate;
  archiveConfirmModal.classList.add("show");
}

/************************************
 * EDIT CANDIDATE
 ************************************/
function openEditCandidateModal(candidateId) {
  const candidate = candidates.find(c => c.id === candidateId);
  if (!candidate) return;

  editCandidateId.value = candidate.id;
  editCandidateName.value = candidate.name;
  editCandidateEmail.value = candidate.email;
  editCandidatePosition.value = candidate.position;
  editCandidateNotes.value = candidate.notes;

  // Source radio
  const sourceRadios = document.getElementsByName("editCandidateSource");
  sourceRadios.forEach(radio => {
    radio.checked = (radio.value === candidate.sourceType);
  });

  editCandidateModal.classList.add("show");
}

function saveCandidateEdits() {
  const id = Number(editCandidateId.value);
  const candidate = candidates.find(c => c.id === id);
  if (!candidate) return;

  candidate.name = editCandidateName.value;
  candidate.email = editCandidateEmail.value;
  candidate.position = editCandidatePosition.value;
  candidate.notes = editCandidateNotes.value;

  const sourceType = document.querySelector('input[name="editCandidateSource"]:checked').value;
  candidate.sourceType = sourceType;

  editCandidateModal.classList.remove("show");
  recordHistory(candidate, "edit", "Candidate info updated");
  renderPipeline();
}

/************************************
 * TRANSFER
 ************************************/
function openTransferModal(candidateId) {
  const candidate = candidates.find(c => c.id === candidateId);
  if (!candidate) return;

  transferCandidateId.value = candidate.id;

  // Populate the job dropdown with all jobs except the current one
  transferJobSelect.innerHTML = "";
  jobs.forEach(job => {
    if (job.id !== candidate.jobId) {
      const option = document.createElement("option");
      option.value = job.id;
      option.textContent = job.title;
      transferJobSelect.appendChild(option);
    }
  });

  transferCandidateModal.classList.add("show");
}

function completeTransfer() {
  const cId = Number(transferCandidateId.value);
  const candidate = candidates.find(c => c.id === cId);
  if (!candidate) return;

  const newJobId = Number(transferJobSelect.value);
  recordHistory(candidate, "job_transfer", `Transferred from job ${candidate.jobId} to job ${newJobId}`);
  candidate.jobId = newJobId;
  candidate.stage = "Applied"; // default them to "Applied" in the new job

  transferCandidateModal.classList.remove("show");
  renderPipeline();
}

/************************************
 * FEEDBACK
 ************************************/
function openFeedbackModal(candidateId) {
  const candidate = candidates.find(c => c.id === candidateId);
  if (!candidate) return;

  feedbackCandidateId.value = candidate.id;

  // Default the stage to Phone Screen
  feedbackStageSelect.value = "Phone Screen";
  feedbackRatingSelect.value = "no";
  feedbackNotes.value = "";
  onsiteInterviewersList.innerHTML = "";

  feedbackCandidateModal.classList.add("show");
  showHideOnsiteInterviewers(); // ensure correct display
}

feedbackStageSelect.addEventListener("change", showHideOnsiteInterviewers);

function showHideOnsiteInterviewers() {
  if (feedbackStageSelect.value === "On-site") {
    onsiteInterviewersSection.style.display = "block";
  } else {
    onsiteInterviewersSection.style.display = "none";
    onsiteInterviewersList.innerHTML = ""; // clear
  }
}

function saveFeedback() {
  const cId = Number(feedbackCandidateId.value);
  const candidate = candidates.find(c => c.id === cId);
  if (!candidate) return;

  if (!candidate.feedback) candidate.feedback = {};

  const stage = feedbackStageSelect.value;
  const rating = feedbackRatingSelect.value; // "strong_no", "no", "yes", "strong_yes"
  const notesVal = feedbackNotes.value;

  // If On-site, gather multiple interviewers
  if (stage === "On-site") {
    const interviewBlocks = onsiteInterviewersList.querySelectorAll(".interviewer-block");
    const interviewsArr = [];
    interviewBlocks.forEach(block => {
      const nameEl = block.querySelector(".interviewer-name");
      const ratingEl = block.querySelector(".interviewer-rating");
      const notesEl = block.querySelector(".interviewer-notes");

      interviewsArr.push({
        name: nameEl.value,
        rating: ratingEl.value,
        notes: notesEl.value
      });
    });

    candidate.feedback[stage] = {
      rating, // overall rating
      notes: notesVal,
      interviews: interviewsArr
    };
  } else {
    candidate.feedback[stage] = {
      rating,
      notes: notesVal
    };
  }

  recordHistory(candidate, "feedback", `Feedback saved for ${stage}`);
  feedbackCandidateModal.classList.remove("show");
  renderPipeline();
}

/**
 * Summarize feedback in the candidate card, with clickable items
 */
function getFeedbackSummary(candidate) {
  const stagesToShow = ["Phone Screen", "HM Screen", "On-site", "Offer"];

  let html = `<div class="candidate-feedback-summary">
    <p style="margin-bottom:2px;">Feedback:</p>
    <ul>`;

  stagesToShow.forEach(stg => {
    if (candidate.feedback && candidate.feedback[stg]) {
      const f = candidate.feedback[stg];
      const r = f.rating;
      const ratingClass = `rating-${r}`;
      html += `
        <li data-stage="${stg}" data-candidateid="${candidate.id}">
          <strong>${stg}:</strong> 
          <span class="${ratingClass}">${formatRating(r)}</span>
        </li>
      `;
    } else {
      html += `
        <li data-stage="${stg}" data-candidateid="${candidate.id}">
          <strong>${stg}:</strong>
          <span class="rating-none">None</span>
        </li>
      `;
    }
  });

  html += `</ul></div>`;
  return html;
}

/** Convert rating codes to readable text: "strong_no" -> "Strong No" */
function formatRating(r) {
  switch (r) {
    case "strong_no": return "Strong No";
    case "no": return "No";
    case "yes": return "Yes";
    case "strong_yes": return "Strong Yes";
    default: return r;
  }
}

/************************************
 * HISTORY
 ************************************/
function recordHistory(candidate, actionType, desc) {
  if (!candidate.history) candidate.history = [];
  candidate.history.push({
    date: new Date().toISOString(),
    action: actionType,
    description: desc,
    jobId: candidate.jobId,
    stage: candidate.stage
  });
}

/************************************
 * ARCHIVED CANDIDATES
 ************************************/
function renderArchivedCandidates() {
  archivedList.innerHTML = "";

  const archivedCandidates = candidates.filter(c => c.archived);

  if (archivedCandidates.length === 0) {
    archivedList.innerHTML = `<p>No archived candidates found.</p>`;
    return;
  }

  archivedCandidates.forEach(c => {
    const card = document.createElement("div");
    card.classList.add("archived-card");
    const job = jobs.find(j => j.id === c.jobId);
    const jobTitle = job ? job.title : "Unknown Job";

    let historyHTML = "";
    if (c.history && c.history.length > 0) {
      c.history.forEach(h => {
        historyHTML += `
          <div class="history-item">
            <strong>${new Date(h.date).toLocaleString()}</strong><br/>
            <em>Action:</em> ${h.action}<br/>
            <em>Desc:</em> ${h.description}<br/>
            <em>Job ID:</em> ${h.jobId}, <em>Stage:</em> ${h.stage}
          </div>
        `;
      });
    } else {
      historyHTML = `<p>No history recorded.</p>`;
    }

    card.innerHTML = `
      <h4>${c.name} (${c.position})</h4>
      <p><strong>Last Job:</strong> ${jobTitle}</p>
      <p><strong>Stage:</strong> ${c.stage}</p>
      <p><strong>Email:</strong> ${c.email}</p>
      <p><strong>Notes:</strong> ${c.notes}</p>
      <hr/>
      <p><strong>History:</strong></p>
      ${historyHTML}
    `;
    archivedList.appendChild(card);
  });
}
