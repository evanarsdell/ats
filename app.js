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

// Keep track of which job pipeline is open
let currentJobId = null;

// For archiving
let candidateToArchive = null;
let jobToArchive = null;

/************************************
 * DOM
 ************************************/
// HEADERS & MENU
const homeBtn = document.getElementById("homeBtn");
const pipelineAddCandidateBtn = document.getElementById("pipelineAddCandidateBtn");
const dropdownBtn = document.getElementById("dropdownBtn");
const dropdownContent = document.getElementById("dropdownContent");
const searchBtn = document.getElementById("searchBtn");
const searchContainer = document.getElementById("searchContainer");
const searchInput = document.getElementById("searchInput");
const viewArchivedCandidatesBtn = document.getElementById("viewArchivedCandidatesBtn");
const viewArchivedJobsBtn = document.getElementById("viewArchivedJobsBtn");

// VIEWS
const jobsView = document.getElementById("jobsView");
const candidatesView = document.getElementById("candidatesView");
const archivedCandidatesView = document.getElementById("archivedCandidatesView");
const archivedJobsView = document.getElementById("archivedJobsView");

// JOBS
const jobsList = document.getElementById("jobsList");
const addJobForm = document.getElementById("addJobForm");

// HOME candidate form
const homeCandidateForm = document.getElementById("homeCandidateForm");
const homeCandidateName = document.getElementById("homeCandidateName");
const homeCandidateEmail = document.getElementById("homeCandidateEmail");
const homeCandidateJobSelect = document.getElementById("homeCandidateJobSelect");
const homeCandidateNotes = document.getElementById("homeCandidateNotes");

// PIPELINE
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
const backToJobsBtn = document.getElementById("backToJobsBtn");
const backToJobsFromArchiveCandidatesBtn = document.getElementById("backToJobsFromArchiveCandidatesBtn");
const backToJobsFromArchiveJobsBtn = document.getElementById("backToJobsFromArchiveJobsBtn");

// Candidate Detail
const viewCandidateModal = document.getElementById("viewCandidateModal");
const closeCandidateDetailModal = document.getElementById("closeCandidateDetailModal");
const candidateDetailContent = document.getElementById("candidateDetailContent");

// FEEDBACK MODAL
const feedbackCandidateModal = document.getElementById("feedbackCandidateModal");
const closeFeedbackModal = document.getElementById("closeFeedbackModal");
const feedbackCandidateForm = document.getElementById("feedbackCandidateForm");
const feedbackCandidateId = document.getElementById("feedbackCandidateId");
const editingInterviewerIndex = document.getElementById("editingInterviewerIndex");
const feedbackStageSelect = document.getElementById("feedbackStageSelect");
const feedbackRatingSelect = document.getElementById("feedbackRatingSelect");
const feedbackNotes = document.getElementById("feedbackNotes");
const onsiteInterviewersSection = document.getElementById("onsiteInterviewersSection");
const addInterviewerBtn = document.getElementById("addInterviewerBtn");
const onsiteInterviewersList = document.getElementById("onsiteInterviewersList");
const singleFeedbackSection = document.getElementById("singleFeedbackSection");

// EDIT CANDIDATE
const editCandidateModal = document.getElementById("editCandidateModal");
const closeCandidateModal = document.getElementById("closeCandidateModal");
const editCandidateForm = document.getElementById("editCandidateForm");
const editCandidateId = document.getElementById("editCandidateId");
const editCandidateName = document.getElementById("editCandidateName");
const editCandidateEmail = document.getElementById("editCandidateEmail");
const editCandidatePosition = document.getElementById("editCandidatePosition");
const editCandidateNotes = document.getElementById("editCandidateNotes");

// EDIT JOB
const editJobModal = document.getElementById("editJobModal");
const closeJobModal = document.getElementById("closeJobModal");
const editJobForm = document.getElementById("editJobForm");
const editJobId = document.getElementById("editJobId");
const editJobTitle = document.getElementById("editJobTitle");
const editJobManager = document.getElementById("editJobManager");
const editJobLevel = document.getElementById("editJobLevel");
const editJobCompRange = document.getElementById("editJobCompRange");
const editJobNotes = document.getElementById("editJobNotes");

// TRANSFER CANDIDATE
const transferCandidateModal = document.getElementById("transferCandidateModal");
const closeTransferModal = document.getElementById("closeTransferModal");
const transferCandidateForm = document.getElementById("transferCandidateForm");
const transferCandidateId = document.getElementById("transferCandidateId");
const transferJobSelect = document.getElementById("transferJobSelect");
const transferStageSelect = document.getElementById("transferStageSelect");

// ARCHIVE CANDIDATE
const archiveConfirmModal = document.getElementById("archiveConfirmModal");
const closeArchiveModal = document.getElementById("closeArchiveModal");
const archiveYesBtn = document.getElementById("archiveYesBtn");
const archiveNoBtn = document.getElementById("archiveNoBtn");

// ARCHIVE JOB
const archiveJobModal = document.getElementById("archiveJobModal");
const closeArchiveJobModal = document.getElementById("closeArchiveJobModal");
const archiveJobYesBtn = document.getElementById("archiveJobYesBtn");
const archiveJobNoBtn = document.getElementById("archiveJobNoBtn");

/************************************
 * EVENT LISTENERS
 ************************************/
// HOME BUTTON
homeBtn.addEventListener("click", () => {
  currentJobId = null;
  candidatesView.style.display = "none";
  archivedCandidatesView.style.display = "none";
  archivedJobsView.style.display = "none";
  searchContainer.style.display = "none";
  renderJobs();
});

// Pipeline "Add Candidate Form" button
pipelineAddCandidateBtn.addEventListener("click", () => {
  if (!currentJobId) return;
  candidateFormContainer.style.display =
    candidateFormContainer.style.display === "none" ? "block" : "none";
});

// DROPDOWN
dropdownBtn.addEventListener("click", () => {
  dropdownContent.style.display =
    dropdownContent.style.display === "block" ? "none" : "block";
});
window.addEventListener("click", (e) => {
  if (!e.target.matches("#dropdownBtn")) {
    dropdownContent.style.display = "none";
  }
});

// SEARCH
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

// VIEW ARCHIVED
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

// ADD JOB FORM
addJobForm.addEventListener("submit", (e) => {
  e.preventDefault();
  addNewJob();
});

// HOME CANDIDATE FORM
homeCandidateForm.addEventListener("submit", (e) => {
  e.preventDefault();
  addCandidateFromHome();
});

// PIPELINE CANDIDATE FORM
candidateForm.addEventListener("submit", (e) => {
  e.preventDefault();
  addCandidateFromPipeline();
});

// BACK FROM PIPELINE
backToJobsBtn.addEventListener("click", () => {
  candidatesView.style.display = "none";
  archivedCandidatesView.style.display = "none";
  archivedJobsView.style.display = "none";
  currentJobId = null;
  searchContainer.style.display = "none";
  renderJobs();
});

// BACK FROM ARCHIVED
backToJobsFromArchiveCandidatesBtn.addEventListener("click", () => {
  archivedCandidatesView.style.display = "none";
  renderJobs();
});
backToJobsFromArchiveJobsBtn.addEventListener("click", () => {
  archivedJobsView.style.display = "none";
  renderJobs();
});

// CLOSE MODALS
closeCandidateDetailModal.addEventListener("click", () => {
  viewCandidateModal.classList.remove("show");
});
closeFeedbackModal.addEventListener("click", () => {
  feedbackCandidateModal.classList.remove("show");
  editingInterviewerIndex.value = "-1";
});
closeCandidateModal.addEventListener("click", () => {
  editCandidateModal.classList.remove("show");
});
closeJobModal.addEventListener("click", () => {
  editJobModal.classList.remove("show");
});
closeTransferModal.addEventListener("click", () => {
  transferCandidateModal.classList.remove("show");
});
closeArchiveModal.addEventListener("click", () => {
  archiveConfirmModal.classList.remove("show");
  candidateToArchive = null;
});
closeArchiveJobModal.addEventListener("click", () => {
  archiveJobModal.classList.remove("show");
  jobToArchive = null;
});

// ARCHIVE CANDIDATE CONFIRM
archiveYesBtn.addEventListener("click", () => {
  if (!candidateToArchive) return;
  candidateToArchive.archived = true;
  archiveConfirmModal.classList.remove("show");
  candidateToArchive = null;
  if (currentJobId) {
    renderPipeline();
  } else {
    renderJobs();
  }
});
archiveNoBtn.addEventListener("click", () => {
  archiveConfirmModal.classList.remove("show");
  candidateToArchive = null;
});

// ARCHIVE JOB CONFIRM
archiveJobYesBtn.addEventListener("click", () => {
  if (!jobToArchive) return;
  jobToArchive.archived = true;
  archiveJobModal.classList.remove("show");
  jobToArchive = null;
  renderJobs();
});
archiveJobNoBtn.addEventListener("click", () => {
  archiveJobModal.classList.remove("show");
  jobToArchive = null;
});

// FEEDBACK FORM
feedbackCandidateForm.addEventListener("submit", (e) => {
  e.preventDefault();
  saveFeedback();
});
feedbackStageSelect.addEventListener("change", handleFeedbackStageChange);
addInterviewerBtn.addEventListener("click", () => {
  // Add a new interviewer block
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

// EDIT CANDIDATE FORM
editCandidateForm.addEventListener("submit", (e) => {
  e.preventDefault();
  saveCandidateEdits();
});

// EDIT JOB FORM
editJobForm.addEventListener("submit", (e) => {
  e.preventDefault();
  saveJobEdits();
});

// TRANSFER CANDIDATE FORM
transferCandidateForm.addEventListener("submit", (e) => {
  e.preventDefault();
  completeTransfer();
});

// DRAG & DROP: set up each column
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
      found.stage = newStage;
      renderPipeline();
    }
  });
});

/************************************
 * INIT
 ************************************/
renderJobs(); // Show example data on load

/************************************
 * UTILS
 ************************************/
function handleFeedbackStageChange() {
  editingInterviewerIndex.value = "-1";
  if (feedbackStageSelect.value === "On-site") {
    singleFeedbackSection.style.display = "none";
    onsiteInterviewersSection.style.display = "block";
    onsiteInterviewersList.innerHTML = "";
  } else {
    singleFeedbackSection.style.display = "block";
    onsiteInterviewersSection.style.display = "none";
    onsiteInterviewersList.innerHTML = "";
  }
}

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

function renderJobs() {
  jobsView.style.display = "block";
  candidatesView.style.display = "none";
  archivedCandidatesView.style.display = "none";
  archivedJobsView.style.display = "none";
  pipelineAddCandidateBtn.style.display = "none";

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
      archiveJobModal.classList.add("show");
    });
  });
}

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

  renderStats();
  populatePipelineCandidateDropdown();

  const jobCandidates = candidates.filter(c => c.jobId === currentJobId && !c.archived);
  const searchTerm = searchInput.value.toLowerCase();

  jobCandidates.forEach(candidate => {
    if (searchTerm && !candidate.name.toLowerCase().includes(searchTerm)) return;

    const card = document.createElement("div");
    card.className = "candidate-card";
    card.draggable = true;
    card.dataset.id = candidate.id;

    card.innerHTML = `
      <span class="candidate-name">${candidate.name}</span>
      <span class="candidate-position">${candidate.position}</span>
      <span class="candidate-email">${candidate.email}</span>
      <p class="candidate-notes">${candidate.notes}</p>
      <p><span class="candidate-source">${candidate.sourceType}</span></p>

      <!-- FEEDBACK SUMMARY BLOCK -->
      <div class="feedback-summary">
        ${buildFeedbackSummary(candidate)}
      </div>

      <div class="card-actions">
        <button class="edit-btn">Edit</button>
        <button class="archive-btn">Archive</button>
        <button class="transfer-btn">Transfer</button>
        <button class="feedback-btn">Feedback</button>
      </div>
    `;

    // DRAG events
    card.addEventListener("dragstart", handleDragStart);
    card.addEventListener("dragend", handleDragEnd);

    // Expand/hide feedback detail if user clicks "Show Feedback"
    const expandLinks = card.querySelectorAll(".expand-feedback");
    expandLinks.forEach(link => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        const detail = link.closest(".stage-line").querySelector(".feedback-detail");
        if (detail) {
          detail.style.display = detail.style.display === "block" ? "none" : "block";
        }
      });
    });

    // Buttons
    const editBtn = card.querySelector(".edit-btn");
    const archiveBtn = card.querySelector(".archive-btn");
    const transferBtn = card.querySelector(".transfer-btn");
    const feedbackBtn = card.querySelector(".feedback-btn");
    const nameEl = card.querySelector(".candidate-name");

    editBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      openEditCandidateModal(candidate.id);
    });
    archiveBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      candidateToArchive = candidate;
      archiveConfirmModal.classList.add("show");
    });
    transferBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      openTransferModal(candidate.id);
    });
    feedbackBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      openFeedbackModal(candidate.id);
    });
    nameEl.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      openCandidateDetailModal(candidate.id);
    });

    // Place in correct column
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

function buildFeedbackSummary(candidate) {
  if (!candidate.feedback || Object.keys(candidate.feedback).length === 0) {
    return `<div>No feedback yet.</div>`;
  }
  // For each stage in STAGES, if there's feedback, display a line
  let summary = "";
  STAGES.forEach(stage => {
    if (candidate.feedback[stage]) {
      if (stage === "On-site" && candidate.feedback["On-site"].interviewers) {
        // multiple interviewers
        let line = `<div class="stage-line"><strong>On-site:</strong>`;
        candidate.feedback["On-site"].interviewers.forEach((intv, idx) => {
          line += ` <span class="${getRatingClass(intv.rating)}">#${idx+1}:${formatRating(intv.rating)}</span>`;
        });
        line += `
          <span class="expand-feedback">Show Feedback</span>
          <div class="feedback-detail">
        `;
        candidate.feedback["On-site"].interviewers.forEach((intv, idx) => {
          line += `<p>Interviewer #${idx+1} Notes: ${intv.notes || ""}</p>`;
        });
        line += `</div></div>`;
        summary += line;
      } else {
        // single rating
        const f = candidate.feedback[stage];
        const ratingText = f.rating ? formatRating(f.rating) : "No";
        summary += `
          <div class="stage-line">
            <strong>${stage}:</strong> <span class="${getRatingClass(f.rating)}">${ratingText}</span>
            <span class="expand-feedback">Show Feedback</span>
            <div class="feedback-detail">
              <p>Notes: ${f.notes || ""}</p>
            </div>
          </div>
        `;
      }
    }
  });
  return summary;
}

function getRatingClass(r) {
  switch (r) {
    case "yes": return "rating-yes";
    case "no": return "rating-no";
    case "strong_yes": return "rating-strong_yes";
    case "strong_no": return "rating-strong_no";
    default: return "";
  }
}

/************************************
 * ADD CANDIDATE (Home)
 ************************************/
function addCandidateFromHome() {
  const name = homeCandidateName.value;
  const email = homeCandidateEmail.value;
  const notes = homeCandidateNotes.value;
  const source = document.querySelector('input[name="homeCandidateSource"]:checked').value;
  const selectedJobId = Number(homeCandidateJobSelect.value);

  const jobObj = jobs.find(j => j.id === selectedJobId);
  const jobTitle = jobObj ? jobObj.title : "Unknown";

  const newCandidate = {
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
  const name = candidateName.value;
  const email = candidateEmail.value;
  const notes = candidateNotes.value;
  const source = document.querySelector('input[name="candidateSource"]:checked').value;
  const selectedJobId = Number(candidateJobSelect.value);

  const jobObj = jobs.find(j => j.id === selectedJobId);
  const jobTitle = jobObj ? jobObj.title : "Unknown";

  const newCandidate = {
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

  archCands.forEach(c => {
    const job = jobs.find(j => j.id === c.jobId);
    const jobTitle = job ? job.title : "Unknown Job";

    const card = document.createElement("div");
    card.classList.add("archived-card");
    card.innerHTML = `
      <h4>${c.name} (${c.position})</h4>
      <p><strong>Last Job:</strong> ${jobTitle}</p>
      <p><strong>Stage:</strong> ${c.stage}</p>
      <p><strong>Email:</strong> ${c.email}</p>
      <p><strong>Notes:</strong> ${c.notes}</p>
      <button class="unarchive-candidate-btn">Unarchive</button>
    `;
    archivedList.appendChild(card);

    const unarchiveBtn = card.querySelector(".unarchive-candidate-btn");
    unarchiveBtn.addEventListener("click", () => {
      c.archived = false;
      renderArchivedCandidates();
    });
  });
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

  archJobs.forEach(jb => {
    const card = document.createElement("div");
    card.classList.add("archived-card");
    card.innerHTML = `
      <h4>${jb.title}</h4>
      <p><strong>Manager:</strong> ${jb.manager}</p>
      <p><strong>Level:</strong> ${jb.level || ""}</p>
      <p><strong>Comp Range:</strong> ${jb.compRange || ""}</p>
      <p><strong>Notes:</strong> ${jb.notes || ""}</p>
      <button class="unarchive-job-btn">Unarchive</button>
    `;
    archivedJobsList.appendChild(card);

    const unarchiveBtn = card.querySelector(".unarchive-job-btn");
    unarchiveBtn.addEventListener("click", () => {
      jb.archived = false;
      renderArchivedJobs();
    });
  });
}

/************************************
 * FEEDBACK
 ************************************/
function openFeedbackModal(candidateId, interviewerIndex = -1) {
  const candidate = candidates.find(c => c.id === candidateId);
  if (!candidate) return;

  feedbackCandidateId.value = candidate.id;
  editingInterviewerIndex.value = interviewerIndex.toString();

  feedbackStageSelect.value = "Phone Screen";
  singleFeedbackSection.style.display = "block";
  onsiteInterviewersSection.style.display = "none";
  onsiteInterviewersList.innerHTML = "";
  feedbackRatingSelect.value = "no";
  feedbackNotes.value = "";
  feedbackCandidateModal.classList.add("show");
}

function saveFeedback() {
  const cId = Number(feedbackCandidateId.value);
  const candidate = candidates.find(c => c.id === cId);
  if (!candidate) return;

  const stage = feedbackStageSelect.value;
  let idx = Number(editingInterviewerIndex.value);

  if (stage === "On-site") {
    if (!candidate.feedback[stage]) {
      candidate.feedback[stage] = { interviewers: [] };
    }
    const interviewBlocks = onsiteInterviewersList.querySelectorAll(".interviewer-block");
    if (idx >= 0 && candidate.feedback["On-site"].interviewers) {
      // Overwrite that single index with the new block's data
      const block = interviewBlocks[0];
      if (block) {
        const nameEl = block.querySelector(".interviewer-name");
        const ratingEl = block.querySelector(".interviewer-rating");
        const notesEl = block.querySelector(".interviewer-notes");
        candidate.feedback["On-site"].interviewers[idx] = {
          name: nameEl.value,
          rating: ratingEl.value,
          notes: notesEl.value
        };
      }
    } else {
      // Merge newly added interviewers with existing
      const existing = candidate.feedback["On-site"].interviewers || [];
      const newInterviewers = [];
      interviewBlocks.forEach(block => {
        const nameEl = block.querySelector(".interviewer-name");
        const ratingEl = block.querySelector(".interviewer-rating");
        const notesEl = block.querySelector(".interviewer-notes");
        newInterviewers.push({
          name: nameEl.value,
          rating: ratingEl.value,
          notes: notesEl.value
        });
      });
      candidate.feedback["On-site"].interviewers = existing.concat(newInterviewers);
    }
  } else {
    if (!candidate.feedback[stage]) {
      candidate.feedback[stage] = {};
    }
    candidate.feedback[stage].rating = feedbackRatingSelect.value;
    candidate.feedback[stage].notes = feedbackNotes.value;
  }

  feedbackCandidateModal.classList.remove("show");
  editingInterviewerIndex.value = "-1";
  if (currentJobId) renderPipeline();
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

  // Mark the correct source as checked
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

  const srcRadio = document.querySelector('input[name="editCandidateSource"]:checked');
  candidate.sourceType = srcRadio ? srcRadio.value : "applied";

  editCandidateModal.classList.remove("show");
  if (currentJobId) renderPipeline();
}

/************************************
 * EDIT JOB
 ************************************/
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
 * TRANSFER
 ************************************/
function openTransferModal(candidateId) {
  const candidate = candidates.find(c => c.id === candidateId);
  if (!candidate) return;

  transferCandidateId.value = candidate.id;

  // Populate job dropdown
  transferJobSelect.innerHTML = "";
  jobs.forEach(job => {
    if (!job.archived && job.id !== candidate.jobId) {
      const opt = document.createElement("option");
      opt.value = job.id;
      opt.textContent = job.title;
      transferJobSelect.appendChild(opt);
    }
  });

  // Default stage is "Applied"
  transferStageSelect.value = "Applied";

  transferCandidateModal.classList.add("show");
}
function completeTransfer() {
  const cId = Number(transferCandidateId.value);
  const candidate = candidates.find(c => c.id === cId);
  if (!candidate) return;

  const newJobId = Number(transferJobSelect.value);
  candidate.jobId = newJobId;

  // Use the selected stage from the dropdown
  const selectedStage = transferStageSelect.value;
  candidate.stage = selectedStage;

  transferCandidateModal.classList.remove("show");
  if (currentJobId) renderPipeline();
}

/************************************
 * CANDIDATE DETAIL MODAL
 ************************************/
function openCandidateDetailModal(candidateId) {
  const candidate = candidates.find(c => c.id === candidateId);
  if (!candidate) return;

  const job = jobs.find(j => j.id === candidate.jobId);
  const jobTitle = job ? job.title : "Unknown";

  let html = `
    <h3>Basic Info</h3>
    <p><strong>Name:</strong> ${candidate.name}</p>
    <p><strong>Email:</strong> ${candidate.email}</p>
    <p><strong>Position:</strong> ${candidate.position}</p>
    <p><strong>Job:</strong> ${jobTitle}</p>
    <p><strong>Stage:</strong> ${candidate.stage}</p>
    <p><strong>Archived:</strong> ${candidate.archived ? "Yes" : "No"}</p>
    <p><strong>Notes:</strong> ${candidate.notes}</p>
    <p><strong>Source:</strong> ${candidate.sourceType}</p>
  `;

  // Show feedback
  html += `<h3>Feedback</h3>`;
  if (!candidate.feedback || Object.keys(candidate.feedback).length === 0) {
    html += `<p>No feedback yet.</p>`;
  } else {
    STAGES.forEach(stage => {
      if (candidate.feedback[stage]) {
        if (stage === "On-site" && candidate.feedback["On-site"].interviewers) {
          // multiple interviewers
          const onSiteObj = candidate.feedback["On-site"];
          html += `<div class="feedback-stage"><strong>On-site:</strong></div>`;
          onSiteObj.interviewers.forEach((intv, idx) => {
            html += `
              <div style="margin-left:20px; margin-bottom:8px;">
                <strong>Interviewer #${idx+1}:</strong> ${formatRating(intv.rating)}<br/>
                <em>Notes:</em> ${intv.notes || ""}
                <br/>
              </div>
            `;
          });
        } else {
          // single rating
          const f = candidate.feedback[stage];
          const ratingText = f.rating ? formatRating(f.rating) : "No";
          html += `<div class="feedback-stage">
            <strong>${stage}:</strong> ${ratingText}<br/>
            <em>Notes:</em> ${f.notes || ""}
          </div>`;
        }
      }
    });
  }

  candidateDetailContent.innerHTML = html;
  viewCandidateModal.classList.add("show");
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

/************************************
 * HELPERS
 ************************************/
function formatRating(r) {
  switch (r) {
    case "strong_no": return "Strong No";
    case "no": return "No";
    case "yes": return "Yes";
    case "strong_yes": return "Strong Yes";
    default: return r;
  }
}
