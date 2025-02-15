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
 * DOM ELEMENTS
 ************************************/
// Header
const homeBtn = document.getElementById("homeBtn");
const dropdownBtn = document.getElementById("dropdownBtn");
const dropdownContent = document.getElementById("dropdownContent");
const toggleFormBtn = document.getElementById("toggleFormBtn");
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

// Pipeline candidate form
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

// Feedback Modal
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

// Archive Candidate Confirm Modal
const archiveConfirmModal = document.getElementById("archiveConfirmModal");
const closeArchiveModal = document.getElementById("closeArchiveModal");
const archiveYesBtn = document.getElementById("archiveYesBtn");
const archiveNoBtn = document.getElementById("archiveNoBtn");

// Archive Job Confirm Modal
const archiveJobModal = document.getElementById("archiveJobModal");
const closeArchiveJobModal = document.getElementById("closeArchiveJobModal");
const archiveJobYesBtn = document.getElementById("archiveJobYesBtn");
const archiveJobNoBtn = document.getElementById("archiveJobNoBtn");

// Candidate Detail Modal
const viewCandidateModal = document.getElementById("viewCandidateModal");
const closeCandidateDetailModal = document.getElementById("closeCandidateDetailModal");
const candidateDetailContent = document.getElementById("candidateDetailContent");

/************************************
 * EVENT LISTENERS
 ************************************/
// Home Button
homeBtn.addEventListener("click", () => {
  currentJobId = null;
  candidatesView.style.display = "none";
  archivedCandidatesView.style.display = "none";
  archivedJobsView.style.display = "none";
  searchContainer.style.display = "none";
  renderJobs();
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

// Show/hide search
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

// View archived
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

// Pipeline add candidate form
candidateForm.addEventListener("submit", (e) => {
  e.preventDefault();
  addCandidateFromPipeline();
});

// Toggle pipeline candidate form
toggleFormBtn.addEventListener("click", () => {
  if (!currentJobId) return;
  candidateFormContainer.style.display =
    candidateFormContainer.style.display === "none" ? "block" : "none";
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
  candidateToArchive = null;
});
closeArchiveJobModal.addEventListener("click", () => {
  archiveJobModal.classList.remove("show");
  jobToArchive = null;
});
closeCandidateDetailModal.addEventListener("click", () => {
  viewCandidateModal.classList.remove("show");
});

// Archive candidate confirm
archiveYesBtn.addEventListener("click", () => {
  if (!candidateToArchive) return;
  candidateToArchive.archived = true;
  recordCandidateHistory(candidateToArchive, "archive", "Candidate archived");
  archiveConfirmModal.classList.remove("show");
  candidateToArchive = null;
  renderPipeline();
});
archiveNoBtn.addEventListener("click", () => {
  archiveConfirmModal.classList.remove("show");
  candidateToArchive = null;
});

// Archive job confirm
archiveJobYesBtn.addEventListener("click", () => {
  if (!jobToArchive) return;
  jobToArchive.archived = true;
  recordJobHistory(jobToArchive, "archive", "Job archived");
  archiveJobModal.classList.remove("show");
  jobToArchive = null;
  renderJobs();
});
archiveJobNoBtn.addEventListener("click", () => {
  archiveJobModal.classList.remove("show");
  jobToArchive = null;
});

// Edit candidate form
editCandidateForm.addEventListener("submit", (e) => {
  e.preventDefault();
  saveCandidateEdits();
});

// Edit job form
editJobForm.addEventListener("submit", (e) => {
  e.preventDefault();
  saveJobEdits();
});

// Transfer candidate form
transferCandidateForm.addEventListener("submit", (e) => {
  e.preventDefault();
  completeTransfer();
});

// Feedback form
feedbackCandidateForm.addEventListener("submit", (e) => {
  e.preventDefault();
  saveFeedback();
});

// On-site interviewers
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

// Drag & Drop pipeline columns
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
      recordCandidateHistory(found, "stage_change", `Moved from ${found.stage} to ${newStage}`);
      found.stage = newStage;
      renderPipeline();
    }
  });
});

/************************************
 * INIT
 ************************************/
renderJobs();

/************************************
 * HELPER: Populate home candidate form
 ************************************/
function populateHomeCandidateDropdown() {
  homeCandidateJobSelect.innerHTML = "";
  // Only unarchived jobs
  jobs.forEach(job => {
    if (!job.archived) {
      let opt = document.createElement("option");
      opt.value = job.id;
      opt.textContent = job.title;
      homeCandidateJobSelect.appendChild(opt);
    }
  });
}

/************************************
 * HELPER: Populate pipeline candidate form
 ************************************/
function populatePipelineCandidateDropdown() {
  candidateJobSelect.innerHTML = "";
  jobs.forEach(job => {
    if (!job.archived) {
      let opt = document.createElement("option");
      opt.value = job.id;
      opt.textContent = job.title;
      candidateJobSelect.appendChild(opt);
    }
  });
  // If we have a current job, default to it
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
  recordJobHistory(newJob, "create", "Job created");

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
  toggleFormBtn.style.display = "none";

  // Populate home candidate dropdown
  populateHomeCandidateDropdown();

  jobsList.innerHTML = "";
  // Show only unarchived jobs
  const activeJobs = jobs.filter(j => !j.archived);

  activeJobs.forEach((job) => {
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

    // Buttons
    const viewBtn = card.querySelector(".view-pipeline-btn");
    const editBtn = card.querySelector(".edit-job-btn");
    const archiveBtn = card.querySelector(".archive-job-btn");

    // View pipeline
    viewBtn.addEventListener("click", () => {
      currentJobId = job.id;
      jobsView.style.display = "none";
      archivedCandidatesView.style.display = "none";
      archivedJobsView.style.display = "none";
      candidatesView.style.display = "block";
      candidateFormContainer.style.display = "none";
      toggleFormBtn.style.display = "inline-block";
      renderPipeline();
    });

    // Edit
    editBtn.addEventListener("click", () => openEditJobModal(job.id));

    // Archive job
    archiveBtn.addEventListener("click", () => {
      jobToArchive = job;
      archiveJobModal.classList.add("show");
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

  renderStats();
  populatePipelineCandidateDropdown();

  const jobCandidates = candidates.filter(c => c.jobId === currentJobId && !c.archived);
  const searchTerm = searchInput.value.toLowerCase();

  jobCandidates.forEach(candidate => {
    if (!candidate.name.toLowerCase().includes(searchTerm)) return;

    const card = document.createElement("div");
    card.className = "candidate-card";
    card.draggable = true;
    card.dataset.id = candidate.id;

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

    card.addEventListener("dragstart", handleDragStart);
    card.addEventListener("dragend", handleDragEnd);

    // Buttons
    const editBtn = card.querySelector(".edit-btn");
    const archiveBtn = card.querySelector(".archive-btn");
    const transferBtn = card.querySelector(".transfer-btn");
    const feedbackBtn = card.querySelector(".feedback-btn");
    const nameEl = card.querySelector(".candidate-name");

    editBtn.addEventListener("click", () => openEditCandidateModal(candidate.id));
    archiveBtn.addEventListener("click", () => {
      candidateToArchive = candidate;
      archiveConfirmModal.classList.add("show");
    });
    transferBtn.addEventListener("click", () => openTransferModal(candidate.id));
    feedbackBtn.addEventListener("click", () => openFeedbackModal(candidate.id));

    // Name => detail
    nameEl.addEventListener("click", () => openCandidateDetailModal(candidate.id));

    // Feedback lines clickable
    const summaryContainer = card.querySelector(".candidate-feedback-summary");
    if (summaryContainer) {
      summaryContainer.querySelectorAll("li").forEach(li => {
        li.addEventListener("click", () => {
          const stg = li.getAttribute("data-stage");
          openFeedbackModal(candidate.id, stg);
        });
      });
    }

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
  recordCandidateHistory(newCandidate, "create", `Candidate created for job ${selectedJobId}`);

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
  recordCandidateHistory(newCandidate, "create", `Candidate created for job ${selectedJobId}`);

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
    const card = document.createElement("div");
    card.classList.add("archived-card");
    const job = jobs.find(j => j.id === c.jobId);
    const jobTitle = job ? job.title : "Unknown Job";

    card.innerHTML = `
      <h4>${c.name} (${c.position})</h4>
      <p><strong>Last Job:</strong> ${jobTitle}</p>
      <p><strong>Stage:</strong> ${c.stage}</p>
      <p><strong>Email:</strong> ${c.email}</p>
      <p><strong>Notes:</strong> ${c.notes}</p>
      <div class="card-actions" style="margin-top:10px;">
        <button class="unarchive-btn">Unarchive</button>
      </div>
      <hr/>
      <p><strong>History:</strong></p>
    `;

    const historyContainer = document.createElement("div");
    if (c.history && c.history.length > 0) {
      c.history.forEach(h => {
        const block = document.createElement("div");
        block.classList.add("history-item");
        block.innerHTML = `
          <strong>${new Date(h.date).toLocaleString()}</strong><br/>
          <em>Action:</em> ${h.action}<br/>
          <em>Desc:</em> ${h.description}<br/>
          <em>Job ID:</em> ${h.jobId}, <em>Stage:</em> ${h.stage}
        `;
        historyContainer.appendChild(block);
      });
    } else {
      historyContainer.innerHTML = `<p>No history recorded.</p>`;
    }
    card.appendChild(historyContainer);

    // Name => detail
    const nameHeader = card.querySelector("h4");
    nameHeader.addEventListener("click", () => openCandidateDetailModal(c.id));

    // Unarchive
    const unarchiveBtn = card.querySelector(".unarchive-btn");
    unarchiveBtn.addEventListener("click", () => {
      c.archived = false;
      recordCandidateHistory(c, "unarchive", "Candidate unarchived");
      renderArchivedCandidates();
    });

    archivedList.appendChild(card);
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
      <div class="card-actions" style="margin-top:10px;">
        <button class="unarchive-btn">Unarchive</button>
      </div>
      <hr/>
      <p><strong>History:</strong></p>
    `;

    const historyContainer = document.createElement("div");
    if (jb.jobHistory && jb.jobHistory.length > 0) {
      jb.jobHistory.forEach(h => {
        const block = document.createElement("div");
        block.classList.add("history-item");
        block.innerHTML = `
          <strong>${new Date(h.date).toLocaleString()}</strong><br/>
          <em>Action:</em> ${h.action}<br/>
          <em>Desc:</em> ${h.description}
        `;
        historyContainer.appendChild(block);
      });
    } else {
      historyContainer.innerHTML = `<p>No job history recorded.</p>`;
    }
    card.appendChild(historyContainer);

    // Unarchive
    const unarchiveBtn = card.querySelector(".unarchive-btn");
    unarchiveBtn.addEventListener("click", () => {
      jb.archived = false;
      recordJobHistory(jb, "unarchive", "Job unarchived");
      renderArchivedJobs();
    });

    archivedJobsList.appendChild(card);
  });
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
  recordCandidateHistory(candidate, "edit", "Candidate info updated");
  renderPipeline();
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
  recordJobHistory(job, "edit", "Job info updated");
  renderJobs();
}

/************************************
 * TRANSFER CANDIDATE
 ************************************/
function openTransferModal(candidateId) {
  const candidate = candidates.find(c => c.id === candidateId);
  if (!candidate) return;

  transferCandidateId.value = candidate.id;

  // Populate job dropdown with unarchived jobs (excluding candidate's current job)
  transferJobSelect.innerHTML = "";
  jobs.forEach(job => {
    if (!job.archived && job.id !== candidate.jobId) {
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
  recordCandidateHistory(candidate, "job_transfer", `Transferred from job ${candidate.jobId} to job ${newJobId}`);
  candidate.jobId = newJobId;
  candidate.stage = "Applied";

  transferCandidateModal.classList.remove("show");
  renderPipeline();
}

/************************************
 * FEEDBACK
 ************************************/
feedbackStageSelect.addEventListener("change", showHideOnsiteInterviewers);

function openFeedbackModal(candidateId, stage = null) {
  const candidate = candidates.find(c => c.id === candidateId);
  if (!candidate) return;

  feedbackCandidateId.value = candidate.id;

  if (stage) {
    feedbackStageSelect.value = stage;
    if (candidate.feedback[stage]) {
      const f = candidate.feedback[stage];
      feedbackRatingSelect.value = f.rating || "no";
      feedbackNotes.value = f.notes || "";
      if (stage === "On-site") {
        onsiteInterviewersList.innerHTML = "";
        onsiteInterviewersSection.style.display = "block";
        if (f.interviews && Array.isArray(f.interviews)) {
          f.interviews.forEach(intv => {
            const block = document.createElement("div");
            block.classList.add("interviewer-block");
            block.innerHTML = `
              <label>Name</label>
              <input type="text" class="interviewer-name" value="${intv.name || ""}" />
              <label>Rating</label>
              <select class="interviewer-rating">
                <option value="strong_no">Strong No</option>
                <option value="no">No</option>
                <option value="yes">Yes</option>
                <option value="strong_yes">Strong Yes</option>
              </select>
              <label>Notes</label>
              <textarea class="interviewer-notes">${intv.notes || ""}</textarea>
            `;
            onsiteInterviewersList.appendChild(block);
            const ratingSel = block.querySelector(".interviewer-rating");
            if (ratingSel) ratingSel.value = intv.rating || "no";
          });
        }
      } else {
        onsiteInterviewersList.innerHTML = "";
        onsiteInterviewersSection.style.display = "none";
      }
    } else {
      // No existing feedback
      feedbackRatingSelect.value = "no";
      feedbackNotes.value = "";
      onsiteInterviewersList.innerHTML = "";
      onsiteInterviewersSection.style.display = (stage === "On-site") ? "block" : "none";
    }
  } else {
    // default
    feedbackStageSelect.value = "Phone Screen";
    feedbackRatingSelect.value = "no";
    feedbackNotes.value = "";
    onsiteInterviewersList.innerHTML = "";
    onsiteInterviewersSection.style.display = "none";
  }

  feedbackCandidateModal.classList.add("show");
}

function showHideOnsiteInterviewers() {
  if (feedbackStageSelect.value === "On-site") {
    onsiteInterviewersSection.style.display = "block";
  } else {
    onsiteInterviewersSection.style.display = "none";
    onsiteInterviewersList.innerHTML = "";
  }
}

function saveFeedback() {
  const cId = Number(feedbackCandidateId.value);
  const candidate = candidates.find(c => c.id === cId);
  if (!candidate) return;

  if (!candidate.feedback) candidate.feedback = {};

  const stage = feedbackStageSelect.value;
  const rating = feedbackRatingSelect.value;
  const notesVal = feedbackNotes.value;

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
    candidate.feedback[stage] = { rating, notes: notesVal, interviews: interviewsArr };
  } else {
    candidate.feedback[stage] = { rating, notes: notesVal };
  }

  recordCandidateHistory(candidate, "feedback", `Feedback saved for ${stage}`);
  feedbackCandidateModal.classList.remove("show");
  renderPipeline();
}

/************************************
 * FEEDBACK SUMMARY
 ************************************/
function getFeedbackSummary(candidate) {
  const stagesToShow = ["Phone Screen", "HM Screen", "On-site", "Offer"];
  let html = `<div class="candidate-feedback-summary">
    <p style="margin-bottom:2px;">Feedback:</p>
    <ul>`;
  stagesToShow.forEach(stg => {
    if (candidate.feedback[stg]) {
      const f = candidate.feedback[stg];
      const r = f.rating;
      const ratingClass = `rating-${r}`;
      html += `
        <li data-stage="${stg}">
          <strong>${stg}:</strong> 
          <span class="${ratingClass}">${formatRating(r)}</span>
        </li>
      `;
    } else {
      html += `
        <li data-stage="${stg}">
          <strong>${stg}:</strong>
          <span class="rating-none">None</span>
        </li>
      `;
    }
  });
  html += `</ul></div>`;
  return html;
}

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
 * HISTORY RECORDING
 ************************************/
function recordCandidateHistory(candidate, actionType, desc) {
  candidate.history.push({
    date: new Date().toISOString(),
    action: actionType,
    description: desc,
    jobId: candidate.jobId,
    stage: candidate.stage
  });
}
function recordJobHistory(job, actionType, desc) {
  job.jobHistory.push({
    date: new Date().toISOString(),
    action: actionType,
    description: desc
  });
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
    draggedCard.style.display = "block";
    draggedCard = null;
  }, 0);
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

  // Feedback
  html += `<h3>Feedback</h3>`;
  if (!candidate.feedback || Object.keys(candidate.feedback).length === 0) {
    html += `<p>No feedback yet.</p>`;
  } else {
    STAGES.forEach(stg => {
      if (candidate.feedback[stg]) {
        const f = candidate.feedback[stg];
        if (stg === "On-site" && f.interviews) {
          html += `<div class="feedback-stage"><strong>${stg}:</strong> ${formatRating(f.rating)}<br/>
            <em>Notes:</em> ${f.notes || ""}</div>`;
          f.interviews.forEach((intv, idx) => {
            html += `<div class="feedback-stage" style="margin-left:20px;">
              <strong>Interviewer #${idx + 1}:</strong> ${intv.name || ""}<br/>
              <strong>Rating:</strong> ${formatRating(intv.rating)}<br/>
              <em>Notes:</em> ${intv.notes || ""}
            </div>`;
          });
        } else {
          html += `<div class="feedback-stage"><strong>${stg}:</strong> ${formatRating(f.rating)}<br/>
            <em>Notes:</em> ${f.notes || ""}</div>`;
        }
      }
    });
  }

  // History
  html += `<h3>History</h3>`;
  if (!candidate.history || candidate.history.length === 0) {
    html += `<p>No history recorded.</p>`;
  } else {
    candidate.history.forEach(h => {
      html += `<div class="history-block">
        <strong>${new Date(h.date).toLocaleString()}</strong><br/>
        <em>Action:</em> ${h.action}<br/>
        <em>Description:</em> ${h.description}<br/>
        <em>Job ID:</em> ${h.jobId}, <em>Stage:</em> ${h.stage}
      </div>`;
    });
  }

  candidateDetailContent.innerHTML = html;
  viewCandidateModal.classList.add("show");
}
