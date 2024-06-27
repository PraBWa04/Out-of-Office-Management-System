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
  fetch("/employees")
    .then((response) => response.json())
    .then((data) => {
      const employeesTable = document.getElementById("employees-table");
      let table = `
          <thead class="thead-dark">
              <tr>
                  <th>ID</th>
                  <th>Full Name</th>
                  <th>Subdivision</th>
                  <th>Position</th>
                  <th>Status</th>
                  <th>People Partner</th>
                  <th>Out of Office Balance</th>
                  <th>Photo</th>
                  <th>Actions</th>
              </tr>
          </thead>
          <tbody>`;
      data.forEach((employee) => {
        table += `<tr>
                        <td>${employee.ID}</td>
                        <td>${employee.FullName}</td>
                        <td>${employee.Subdivision}</td>
                        <td>${employee.Position}</td>
                        <td>${employee.Status}</td>
                        <td>${employee.PeoplePartner}</td>
                        <td>${employee.OutOfOfficeBalance}</td>
                        <td><img src="${employee.Photo}" alt="Employee Photo" class="img-thumbnail" style="max-width: 50px;"></td>
                        <td>
                          <button class="btn btn-sm btn-warning" onclick="editEmployee(${employee.ID})">Edit</button>
                          <button class="btn btn-sm btn-danger" onclick="deleteEmployee(${employee.ID})">Delete</button>
                        </td>
                      </tr>`;
      });
      table += `</tbody>`;
      employeesTable.innerHTML = table;
    })
    .catch((error) => console.error("Error:", error));
}

function addEmployee() {
  const formData = new FormData(document.getElementById("add-employee-form"));

  fetch("/employees", {
    method: "POST",
    body: formData,
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Success:", data);
      loadEmployees(); // Refresh the employees table
    })
    .catch((error) => console.error("Error:", error));
}

function editEmployee(id) {
  fetch(`/employees/${id}`)
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
      document.getElementById("edit-employee").style.display = "block";
    })
    .catch((error) => console.error("Error:", error));
}

function updateEmployee() {
  const formData = new FormData(document.getElementById("edit-employee-form"));
  const id = document.getElementById("edit-employee-id").value;

  fetch(`/employees/${id}`, {
    method: "PUT",
    body: formData,
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
  fetch(`/employees/${id}`, {
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
  fetch("/projects")
    .then((response) => response.json())
    .then((data) => {
      const projectsTable = document.getElementById("projects-table");
      let table = `
          <thead class="thead-dark">
              <tr>
                  <th>ID</th>
                  <th>Project Type</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Project Manager</th>
                  <th>Comment</th>
                  <th>Status</th>
                  <th>Actions</th>
              </tr>
          </thead>
          <tbody>`;
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
                          <button class="btn btn-sm btn-warning" onclick="editProject(${project.ID})">Edit</button>
                          <button class="btn btn-sm btn-danger" onclick="deleteProject(${project.ID})">Delete</button>
                        </td>
                      </tr>`;
      });
      table += `</tbody>`;
      projectsTable.innerHTML = table;
    })
    .catch((error) => console.error("Error:", error));
}

function addProject() {
  const formData = new FormData(document.getElementById("add-project-form"));

  fetch("/projects", {
    method: "POST",
    body: formData,
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Success:", data);
      loadProjects(); // Refresh the projects table
    })
    .catch((error) => console.error("Error:", error));
}

function editProject(id) {
  fetch(`/projects/${id}`)
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
  const formData = new FormData(document.getElementById("edit-project-form"));
  const id = document.getElementById("edit-project-id").value;

  fetch(`/projects/${id}`, {
    method: "PUT",
    body: formData,
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
  fetch(`/projects/${id}`, {
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
  fetch("/leave-requests")
    .then((response) => response.json())
    .then((data) => {
      const leaveRequestsTable = document.getElementById(
        "leave-requests-table"
      );
      let table = `
          <thead class="thead-dark">
              <tr>
                  <th>ID</th>
                  <th>Employee</th>
                  <th>Absence Reason</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Comment</th>
                  <th>Status</th>
                  <th>Actions</th>
              </tr>
          </thead>
          <tbody>`;
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
                          <button class="btn btn-sm btn-warning" onclick="editLeaveRequest(${request.ID})">Edit</button>
                          <button class="btn btn-sm btn-danger" onclick="deleteLeaveRequest(${request.ID})">Delete</button>
                        </td>
                      </tr>`;
      });
      table += `</tbody>`;
      leaveRequestsTable.innerHTML = table;
    })
    .catch((error) => console.error("Error:", error));
}

function addLeaveRequest() {
  const formData = new FormData(
    document.getElementById("add-leave-request-form")
  );

  fetch("/leave-requests", {
    method: "POST",
    body: formData,
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Success:", data);
      loadLeaveRequests(); // Refresh the leave requests table
    })
    .catch((error) => console.error("Error:", error));
}

function editLeaveRequest(id) {
  fetch(`/leave-requests/${id}`)
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
  const formData = new FormData(
    document.getElementById("edit-leave-request-form")
  );
  const id = document.getElementById("edit-leave-request-id").value;

  fetch(`/leave-requests/${id}`, {
    method: "PUT",
    body: formData,
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
  fetch(`/leave-requests/${id}`, {
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
  fetch("/approval-requests")
    .then((response) => response.json())
    .then((data) => {
      const approvalRequestsTable = document.getElementById(
        "approval-requests-table"
      );
      let table = `
          <thead class="thead-dark">
              <tr>
                  <th>ID</th>
                  <th>Approver</th>
                  <th>Leave Request</th>
                  <th>Comment</th>
                  <th>Status</th>
                  <th>Actions</th>
              </tr>
          </thead>
          <tbody>`;
      data.forEach((request) => {
        table += `<tr>
                        <td>${request.ID}</td>
                        <td>${request.Approver}</td>
                        <td>${request.LeaveRequest}</td>
                        <td>${request.Comment}</td>
                        <td>${request.Status}</td>
                        <td>
                          <button class="btn btn-sm btn-success" onclick="approveRequest(${request.ID})">Approve</button>
                          <button class="btn btn-sm btn-danger" onclick="rejectRequest(${request.ID})">Reject</button>
                        </td>
                      </tr>`;
      });
      table += `</tbody>`;
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
  fetch(`/approval-requests/${id}`, {
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
