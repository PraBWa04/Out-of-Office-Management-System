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
  fetch("http://localhost:3001/employees", {
    headers: {
      role: "HR Manager",
    },
  })
    .then((response) => {
      if (!response.ok) throw new Error("Network response was not ok");
      return response.json();
    })
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

  fetch("http://localhost:3001/employees", {
    method: "POST",
    headers: {
      role: "HR Manager",
    },
    body: formData,
  })
    .then((response) => {
      if (!response.ok) throw new Error("Network response was not ok");
      return response.json();
    })
    .then((data) => {
      console.log("Success:", data);
      loadEmployees(); // Refresh the employees table
    })
    .catch((error) => console.error("Error:", error));
}

function editEmployee(id) {
  fetch(`http://localhost:3001/employees/${id}`, {
    headers: {
      role: "HR Manager",
    },
  })
    .then((response) => {
      if (!response.ok) throw new Error("Network response was not ok");
      return response.json();
    })
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
  const id = document.getElementById("edit-employee-id").value;
  const formData = new FormData(document.getElementById("edit-employee-form"));

  fetch(`http://localhost:3001/employees/${id}`, {
    method: "PUT",
    headers: {
      role: "HR Manager",
    },
    body: formData,
  })
    .then((response) => {
      if (!response.ok) throw new Error("Network response was not ok");
      return response.json();
    })
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
    headers: {
      role: "HR Manager",
    },
  })
    .then((response) => {
      if (!response.ok) throw new Error("Network response was not ok");
      loadEmployees(); // Refresh the employees table
    })
    .catch((error) => console.error("Error:", error));
}

function loadProjects() {
  fetch("http://localhost:3001/projects", {
    headers: {
      role: "Project Manager",
    },
  })
    .then((response) => {
      if (!response.ok) throw new Error("Network response was not ok");
      return response.json();
    })
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

  fetch("http://localhost:3001/projects", {
    method: "POST",
    headers: {
      role: "Project Manager",
    },
    body: formData,
  })
    .then((response) => {
      if (!response.ok) throw new Error("Network response was not ok");
      return response.json();
    })
    .then((data) => {
      console.log("Success:", data);
      loadProjects(); // Refresh the projects table
    })
    .catch((error) => console.error("Error:", error));
}

function editProject(id) {
  fetch(`http://localhost:3001/projects/${id}`, {
    headers: {
      role: "Project Manager",
    },
  })
    .then((response) => {
      if (!response.ok) throw new Error("Network response was not ok");
      return response.json();
    })
    .then((project) => {
      document.getElementById("edit-project-id").value = project.ID;
      document.getElementById("edit-project-type").value = project.ProjectType;
      document.getElementById("edit-start-date").value = project.StartDate;
      document.getElementById("edit-end-date").value = project.EndDate;
      document.getElementById("edit-project-manager").value =
        project.ProjectManager;
      document.getElementById("edit-comment").value = project.Comment;
      document.getElementById("edit-status").value = project.Status;
      document.getElementById("edit-project").style.display = "block";
    })
    .catch((error) => console.error("Error:", error));
}

function updateProject() {
  const id = document.getElementById("edit-project-id").value;
  const formData = new FormData(document.getElementById("edit-project-form"));

  fetch(`http://localhost:3001/projects/${id}`, {
    method: "PUT",
    headers: {
      role: "Project Manager",
    },
    body: formData,
  })
    .then((response) => {
      if (!response.ok) throw new Error("Network response was not ok");
      return response.json();
    })
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
    headers: {
      role: "Project Manager",
    },
  })
    .then((response) => {
      if (!response.ok) throw new Error("Network response was not ok");
      loadProjects(); // Refresh the projects table
    })
    .catch((error) => console.error("Error:", error));
}

function loadLeaveRequests() {
  fetch("http://localhost:3001/leave-requests", {
    headers: {
      role: "Employee",
    },
  })
    .then((response) => {
      if (!response.ok) throw new Error("Network response was not ok");
      return response.json();
    })
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
      data.forEach((leaveRequest) => {
        table += `<tr>
                        <td>${leaveRequest.ID}</td>
                        <td>${leaveRequest.EmployeeID}</td>
                        <td>${leaveRequest.AbsenceReason}</td>
                        <td>${leaveRequest.StartDate}</td>
                        <td>${leaveRequest.EndDate}</td>
                        <td>${leaveRequest.Comment}</td>
                        <td>${leaveRequest.Status}</td>
                        <td>
                          <button class="btn btn-sm btn-warning" onclick="editLeaveRequest(${leaveRequest.ID})">Edit</button>
                          <button class="btn btn-sm btn-danger" onclick="deleteLeaveRequest(${leaveRequest.ID})">Delete</button>
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

  fetch("http://localhost:3001/leave-requests", {
    method: "POST",
    headers: {
      role: "Employee",
    },
    body: formData,
  })
    .then((response) => {
      if (!response.ok) throw new Error("Network response was not ok");
      return response.json();
    })
    .then((data) => {
      console.log("Success:", data);
      loadLeaveRequests(); // Refresh the leave requests table
    })
    .catch((error) => console.error("Error:", error));
}

function editLeaveRequest(id) {
  fetch(`http://localhost:3001/leave-requests/${id}`, {
    headers: {
      role: "Employee",
    },
  })
    .then((response) => {
      if (!response.ok) throw new Error("Network response was not ok");
      return response.json();
    })
    .then((leaveRequest) => {
      document.getElementById("edit-leave-request-id").value = leaveRequest.ID;
      document.getElementById("edit-employee").value = leaveRequest.EmployeeID;
      document.getElementById("edit-absence-reason").value =
        leaveRequest.AbsenceReason;
      document.getElementById("edit-start-date").value = leaveRequest.StartDate;
      document.getElementById("edit-end-date").value = leaveRequest.EndDate;
      document.getElementById("edit-comment").value = leaveRequest.Comment;
      document.getElementById("edit-status").value = leaveRequest.Status;
      document.getElementById("edit-leave-request").style.display = "block";
    })
    .catch((error) => console.error("Error:", error));
}

function updateLeaveRequest() {
  const id = document.getElementById("edit-leave-request-id").value;
  const formData = new FormData(
    document.getElementById("edit-leave-request-form")
  );

  fetch(`http://localhost:3001/leave-requests/${id}`, {
    method: "PUT",
    headers: {
      role: "Employee",
    },
    body: formData,
  })
    .then((response) => {
      if (!response.ok) throw new Error("Network response was not ok");
      return response.json();
    })
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
    headers: {
      role: "Employee",
    },
  })
    .then((response) => {
      if (!response.ok) throw new Error("Network response was not ok");
      loadLeaveRequests(); // Refresh the leave requests table
    })
    .catch((error) => console.error("Error:", error));
}

function loadApprovalRequests() {
  fetch("http://localhost:3001/approval-requests", {
    headers: {
      role: "HR Manager",
    },
  })
    .then((response) => {
      if (!response.ok) throw new Error("Network response was not ok");
      return response.json();
    })
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
      data.forEach((approvalRequest) => {
        table += `<tr>
                        <td>${approvalRequest.ID}</td>
                        <td>${approvalRequest.ApproverID}</td>
                        <td>${approvalRequest.LeaveRequestID}</td>
                        <td>${approvalRequest.Comment}</td>
                        <td>${approvalRequest.Status}</td>
                        <td>
                          <button class="btn btn-sm btn-warning" onclick="editApprovalRequest(${approvalRequest.ID})">Edit</button>
                          <button class="btn btn-sm btn-danger" onclick="deleteApprovalRequest(${approvalRequest.ID})">Delete</button>
                        </td>
                      </tr>`;
      });
      table += `</tbody>`;
      approvalRequestsTable.innerHTML = table;
    })
    .catch((error) => console.error("Error:", error));
}

function addApprovalRequest() {
  const formData = new FormData(
    document.getElementById("add-approval-request-form")
  );

  fetch("http://localhost:3001/approval-requests", {
    method: "POST",
    headers: {
      role: "HR Manager",
    },
    body: formData,
  })
    .then((response) => {
      if (!response.ok) throw new Error("Network response was not ok");
      return response.json();
    })
    .then((data) => {
      console.log("Success:", data);
      loadApprovalRequests(); // Refresh the approval requests table
    })
    .catch((error) => console.error("Error:", error));
}

function editApprovalRequest(id) {
  fetch(`http://localhost:3001/approval-requests/${id}`, {
    headers: {
      role: "HR Manager",
    },
  })
    .then((response) => {
      if (!response.ok) throw new Error("Network response was not ok");
      return response.json();
    })
    .then((approvalRequest) => {
      document.getElementById("edit-approval-request-id").value =
        approvalRequest.ID;
      document.getElementById("edit-approver").value =
        approvalRequest.ApproverID;
      document.getElementById("edit-leave-request").value =
        approvalRequest.LeaveRequestID;
      document.getElementById("edit-comment").value = approvalRequest.Comment;
      document.getElementById("edit-status").value = approvalRequest.Status;
      document.getElementById("edit-approval-request").style.display = "block";
    })
    .catch((error) => console.error("Error:", error));
}

function updateApprovalRequest() {
  const id = document.getElementById("edit-approval-request-id").value;
  const formData = new FormData(
    document.getElementById("edit-approval-request-form")
  );

  fetch(`http://localhost:3001/approval-requests/${id}`, {
    method: "PUT",
    headers: {
      role: "HR Manager",
    },
    body: formData,
  })
    .then((response) => {
      if (!response.ok) throw new Error("Network response was not ok");
      return response.json();
    })
    .then((data) => {
      console.log("Success:", data);
      loadApprovalRequests(); // Refresh the approval requests table
      document.getElementById("edit-approval-request").style.display = "none";
    })
    .catch((error) => console.error("Error:", error));
}

function deleteApprovalRequest(id) {
  fetch(`http://localhost:3001/approval-requests/${id}`, {
    method: "DELETE",
    headers: {
      role: "HR Manager",
    },
  })
    .then((response) => {
      if (!response.ok) throw new Error("Network response was not ok");
      loadApprovalRequests(); // Refresh the approval requests table
    })
    .catch((error) => console.error("Error:", error));
}
