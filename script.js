document.addEventListener("DOMContentLoaded", function () {
  loadEmployees();
  loadProjects();
  loadLeaveRequests();
  loadApprovalRequests();

  const addEmployeeForm = document.getElementById("add-employee-form");
  addEmployeeForm.addEventListener("submit", function (event) {
    event.preventDefault();
    addEmployee();
  });

  const editEmployeeForm = document.getElementById("edit-employee-form");
  editEmployeeForm.addEventListener("submit", function (event) {
    event.preventDefault();
    updateEmployee();
  });

  const addProjectForm = document.getElementById("add-project-form");
  addProjectForm.addEventListener("submit", function (event) {
    event.preventDefault();
    addProject();
  });

  const editProjectForm = document.getElementById("edit-project-form");
  editProjectForm.addEventListener("submit", function (event) {
    event.preventDefault();
    updateProject();
  });

  const addLeaveRequestForm = document.getElementById("add-leave-request-form");
  addLeaveRequestForm.addEventListener("submit", function (event) {
    event.preventDefault();
    addLeaveRequest();
  });

  const editLeaveRequestForm = document.getElementById(
    "edit-leave-request-form"
  );
  editLeaveRequestForm.addEventListener("submit", function (event) {
    event.preventDefault();
    updateLeaveRequest();
  });
});

function loadEmployees() {
  fetch("http://localhost:3001/employees")
    .then((response) => response.json())
    .then((data) => {
      const employeesTable = document.getElementById("employees-table");
      let table =
        "<tr><th>ID</th><th>Full Name</th><th>Subdivision</th><th>Position</th><th>Status</th><th>People Partner</th><th>Out of Office Balance</th><th>Photo</th><th>Actions</th></tr>";
      data.forEach((employee) => {
        table += `<tr>
                      <td>${employee.ID}</td>
                      <td>${employee.FullName}</td>
                      <td>${employee.Subdivision}</td>
                      <td>${employee.Position}</td>
                      <td>${employee.Status}</td>
                      <td>${employee.PeoplePartner}</td>
                      <td>${employee.OutOfOfficeBalance}</td>
                      <td>${employee.Photo}</td>
                      <td>
                        <button onclick="editEmployee(${employee.ID})">Edit</button>
                        <button onclick="deleteEmployee(${employee.ID})">Delete</button>
                      </td>
                    </tr>`;
      });
      employeesTable.innerHTML = table;
    })
    .catch((error) => console.error("Error:", error));
}

function addEmployee() {
  const fullName = document.getElementById("full-name").value;
  const subdivision = document.getElementById("subdivision").value;
  const position = document.getElementById("position").value;
  const status = document.getElementById("status").value;
  const peoplePartner = document.getElementById("people-partner").value;
  const outOfOfficeBalance = document.getElementById(
    "out-of-office-balance"
  ).value;
  const photo = document.getElementById("photo").value;

  const newEmployee = {
    fullName,
    subdivision,
    position,
    status,
    peoplePartner: peoplePartner ? peoplePartner : null,
    outOfOfficeBalance,
    photo,
  };

  fetch("http://localhost:3001/employees", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newEmployee),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Success:", data);
      loadEmployees(); // Refresh the employees table
    })
    .catch((error) => console.error("Error:", error));
}

function editEmployee(id) {
  fetch(`http://localhost:3001/employees/${id}`)
    .then((response) => response.json())
    .then((employee) => {
      document.getElementById("edit-employee-id").value = employee.ID;
      document.getElementById("edit-full-name").value = employee.FullName;
      document.getElementById("edit-subdivision").value = employee.Subdivision;
      document.getElementById("edit-position").value = employee.Position;
      document.getElementById("edit-status").value = employee.Status;
      document.getElementById("edit-people-partner").value =
        employee.PeoplePartner;
      document.getElementById("edit-out-of-office-balance").value =
        employee.OutOfOfficeBalance;
      document.getElementById("edit-photo").value = employee.Photo;
      document.getElementById("edit-employee").style.display = "block";
    })
    .catch((error) => console.error("Error:", error));
}

function updateEmployee() {
  const id = document.getElementById("edit-employee-id").value;
  const fullName = document.getElementById("edit-full-name").value;
  const subdivision = document.getElementById("edit-subdivision").value;
  const position = document.getElementById("edit-position").value;
  const status = document.getElementById("edit-status").value;
  const peoplePartner = document.getElementById("edit-people-partner").value;
  const outOfOfficeBalance = document.getElementById(
    "edit-out-of-office-balance"
  ).value;
  const photo = document.getElementById("edit-photo").value;

  const updatedEmployee = {
    fullName,
    subdivision,
    position,
    status,
    peoplePartner: peoplePartner ? peoplePartner : null,
    outOfOfficeBalance,
    photo,
  };

  fetch(`http://localhost:3001/employees/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedEmployee),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Success:", data);
      loadEmployees(); // Refresh the employees table
      document.getElementById("edit-employee").style.display = "none";
    })
    .catch((error) => console.error("Error:", error));
}

function deleteEmployee(id) {
  fetch(`http://localhost:3001/employees/${id}`, {
    method: "DELETE",
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Success:", data);
      loadEmployees(); // Refresh the employees table
    })
    .catch((error) => console.error("Error:", error));
}

function loadProjects() {
  fetch("http://localhost:3001/projects")
    .then((response) => response.json())
    .then((data) => {
      const projectsTable = document.getElementById("projects-table");
      let table =
        "<tr><th>ID</th><th>Project Type</th><th>Start Date</th><th>End Date</th><th>Project Manager</th><th>Comment</th><th>Status</th><th>Actions</th></tr>";
      data.forEach((project) => {
        table += `<tr>
                      <td>${project.ID}</td>
                      <td>${project.ProjectType}</td>
                      <td>${project.StartDate}</td>
                      <td>${project.EndDate}</td>
                      <td>${project.ProjectManager}</td>
                      <td>${project.Comment}</td>
                      <td>${project.Status}</td>
                      <td>
                        <button onclick="editProject(${project.ID})">Edit</button>
                        <button onclick="deleteProject(${project.ID})">Delete</button>
                      </td>
                    </tr>`;
      });
      projectsTable.innerHTML = table;
    })
    .catch((error) => console.error("Error:", error));
}

function addProject() {
  const projectType = document.getElementById("project-type").value;
  const startDate = document.getElementById("start-date").value;
  const endDate = document.getElementById("end-date").value;
  const projectManager = document.getElementById("project-manager").value;
  const comment = document.getElementById("comment").value;
  const status = document.getElementById("project-status").value;

  const newProject = {
    projectType,
    startDate,
    endDate,
    projectManager,
    comment,
    status,
  };

  fetch("http://localhost:3001/projects", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newProject),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Success:", data);
      loadProjects(); // Refresh the projects table
    })
    .catch((error) => console.error("Error:", error));
}

function editProject(id) {
  fetch(`http://localhost:3001/projects/${id}`)
    .then((response) => response.json())
    .then((project) => {
      document.getElementById("edit-project-id").value = project.ID;
      document.getElementById("edit-project-type").value = project.ProjectType;
      document.getElementById("edit-start-date").value = project.StartDate;
      document.getElementById("edit-end-date").value = project.EndDate;
      document.getElementById("edit-project-manager").value =
        project.ProjectManager;
      document.getElementById("edit-comment").value = project.Comment;
      document.getElementById("edit-project-status").value = project.Status;
      document.getElementById("edit-project").style.display = "block";
    })
    .catch((error) => console.error("Error:", error));
}

function updateProject() {
  const id = document.getElementById("edit-project-id").value;
  const projectType = document.getElementById("edit-project-type").value;
  const startDate = document.getElementById("edit-start-date").value;
  const endDate = document.getElementById("edit-end-date").value;
  const projectManager = document.getElementById("edit-project-manager").value;
  const comment = document.getElementById("edit-comment").value;
  const status = document.getElementById("edit-project-status").value;

  const updatedProject = {
    projectType,
    startDate,
    endDate,
    projectManager,
    comment,
    status,
  };

  fetch(`http://localhost:3001/projects/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedProject),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Success:", data);
      loadProjects(); // Refresh the projects table
      document.getElementById("edit-project").style.display = "none";
    })
    .catch((error) => console.error("Error:", error));
}

function deleteProject(id) {
  fetch(`http://localhost:3001/projects/${id}`, {
    method: "DELETE",
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Success:", data);
      loadProjects(); // Refresh the projects table
    })
    .catch((error) => console.error("Error:", error));
}

function loadLeaveRequests() {
  fetch("http://localhost:3001/leave-requests")
    .then((response) => response.json())
    .then((data) => {
      const leaveRequestsTable = document.getElementById(
        "leave-requests-table"
      );
      let table =
        "<tr><th>ID</th><th>Employee</th><th>Absence Reason</th><th>Start Date</th><th>End Date</th><th>Comment</th><th>Status</th><th>Actions</th></tr>";
      data.forEach((request) => {
        table += `<tr>
                      <td>${request.ID}</td>
                      <td>${request.Employee}</td>
                      <td>${request.AbsenceReason}</td>
                      <td>${request.StartDate}</td>
                      <td>${request.EndDate}</td>
                      <td>${request.Comment}</td>
                      <td>${request.Status}</td>
                      <td>
                        <button onclick="editLeaveRequest(${request.ID})">Edit</button>
                        <button onclick="deleteLeaveRequest(${request.ID})">Delete</button>
                      </td>
                    </tr>`;
      });
      leaveRequestsTable.innerHTML = table;
    })
    .catch((error) => console.error("Error:", error));
}

function addLeaveRequest() {
  const employee = document.getElementById("leave-employee").value;
  const absenceReason = document.getElementById("absence-reason").value;
  const startDate = document.getElementById("leave-start-date").value;
  const endDate = document.getElementById("leave-end-date").value;
  const comment = document.getElementById("leave-comment").value;

  const newLeaveRequest = {
    employee,
    absenceReason,
    startDate,
    endDate,
    comment,
    status: "New",
  };

  fetch("http://localhost:3001/leave-requests", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newLeaveRequest),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Success:", data);
      loadLeaveRequests(); // Refresh the leave requests table
    })
    .catch((error) => console.error("Error:", error));
}

function editLeaveRequest(id) {
  fetch(`http://localhost:3001/leave-requests/${id}`)
    .then((response) => response.json())
    .then((request) => {
      document.getElementById("edit-leave-request-id").value = request.ID;
      document.getElementById("edit-leave-employee").value = request.Employee;
      document.getElementById("edit-absence-reason").value =
        request.AbsenceReason;
      document.getElementById("edit-leave-start-date").value =
        request.StartDate;
      document.getElementById("edit-leave-end-date").value = request.EndDate;
      document.getElementById("edit-leave-comment").value = request.Comment;
      document.getElementById("edit-leave-request").style.display = "block";
    })
    .catch((error) => console.error("Error:", error));
}

function updateLeaveRequest() {
  const id = document.getElementById("edit-leave-request-id").value;
  const employee = document.getElementById("edit-leave-employee").value;
  const absenceReason = document.getElementById("edit-absence-reason").value;
  const startDate = document.getElementById("edit-leave-start-date").value;
  const endDate = document.getElementById("edit-leave-end-date").value;
  const comment = document.getElementById("edit-leave-comment").value;

  const updatedLeaveRequest = {
    employee,
    absenceReason,
    startDate,
    endDate,
    comment,
    status: "New",
  };

  fetch(`http://localhost:3001/leave-requests/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedLeaveRequest),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Success:", data);
      loadLeaveRequests(); // Refresh the leave requests table
      document.getElementById("edit-leave-request").style.display = "none";
    })
    .catch((error) => console.error("Error:", error));
}

function deleteLeaveRequest(id) {
  fetch(`http://localhost:3001/leave-requests/${id}`, {
    method: "DELETE",
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Success:", data);
      loadLeaveRequests(); // Refresh the leave requests table
    })
    .catch((error) => console.error("Error:", error));
}

function loadApprovalRequests() {
  fetch("http://localhost:3001/approval-requests")
    .then((response) => response.json())
    .then((data) => {
      const approvalRequestsTable = document.getElementById(
        "approval-requests-table"
      );
      let table =
        "<tr><th>ID</th><th>Approver</th><th>Leave Request</th><th>Comment</th><th>Status</th><th>Actions</th></tr>";
      data.forEach((request) => {
        table += `<tr>
                      <td>${request.ID}</td>
                      <td>${request.Approver}</td>
                      <td>${request.LeaveRequest}</td>
                      <td>${request.Comment}</td>
                      <td>${request.Status}</td>
                      <td>
                        <button onclick="approveRequest(${request.ID})">Approve</button>
                        <button onclick="rejectRequest(${request.ID})">Reject</button>
                      </td>
                    </tr>`;
      });
      approvalRequestsTable.innerHTML = table;
    })
    .catch((error) => console.error("Error:", error));
}

function approveRequest(id) {
  updateApprovalRequestStatus(id, "Approved");
}

function rejectRequest(id) {
  updateApprovalRequestStatus(id, "Rejected");
}

function updateApprovalRequestStatus(id, status) {
  fetch(`http://localhost:3001/approval-requests/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Success:", data);
      loadApprovalRequests(); // Refresh the approval requests table
    })
    .catch((error) => console.error("Error:", error));
}
