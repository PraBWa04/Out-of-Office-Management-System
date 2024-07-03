document.addEventListener("DOMContentLoaded", function () {
  loadEmployees();
  loadProjects();
  loadLeaveRequests();
  loadApprovalRequests();

  const addEmployeeForm = document.getElementById("add-employee-form");
  if (addEmployeeForm) {
    addEmployeeForm.addEventListener("submit", function (event) {
      event.preventDefault();
      addEmployee();
    });
  }

  const editEmployeeForm = document.getElementById("edit-employee-form");
  if (editEmployeeForm) {
    editEmployeeForm.addEventListener("submit", function (event) {
      event.preventDefault();
      updateEmployee();
    });
  }

  const addProjectForm = document.getElementById("add-project-form");
  if (addProjectForm) {
    addProjectForm.addEventListener("submit", function (event) {
      event.preventDefault();
      addProject();
    });
  }

  const editProjectForm = document.getElementById("edit-project-form");
  if (editProjectForm) {
    editProjectForm.addEventListener("submit", function (event) {
      event.preventDefault();
      updateProject();
    });
  }

  const addLeaveRequestForm = document.getElementById("add-leave-request-form");
  if (addLeaveRequestForm) {
    addLeaveRequestForm.addEventListener("submit", function (event) {
      event.preventDefault();
      addLeaveRequest();
    });
  }

  const editLeaveRequestForm = document.getElementById(
    "edit-leave-request-form"
  );
  if (editLeaveRequestForm) {
    editLeaveRequestForm.addEventListener("submit", function (event) {
      event.preventDefault();
      updateLeaveRequest();
    });
  }

  const addApprovalRequestForm = document.getElementById(
    "add-approval-request-form"
  );
  if (addApprovalRequestForm) {
    addApprovalRequestForm.addEventListener("submit", function (event) {
      event.preventDefault();
      addApprovalRequest();
    });
  }

  const editApprovalRequestForm = document.getElementById(
    "edit-approval-request-form"
  );
  if (editApprovalRequestForm) {
    editApprovalRequestForm.addEventListener("submit", function (event) {
      event.preventDefault();
      updateApprovalRequest();
    });
  }
});

function loadEmployees() {
  console.log("Fetching URL: http://localhost:3001/employees");
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
      renderEmployeesTable(data);
    })
    .catch((error) => console.error("Error:", error));
}

function renderEmployeesTable(data) {
  const employeesTable = document.getElementById("employees-table");
  let table = `<thead class="thead-dark">
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
  if (Array.isArray(data)) {
    data.forEach((employee) => {
      const photo = employee.Photo
        ? employee.Photo
        : "public/uploads/photo_user.png";
      table += `<tr>
                      <td>${employee.ID}</td>
                      <td>${employee.FullName}</td>
                      <td>${employee.Subdivision}</td>
                      <td>${employee.Position}</td>
                      <td>${employee.Status}</td>
                      <td>${employee.PeoplePartner}</td>
                      <td>${employee.OutOfOfficeBalance}</td>
                      <td><img src="${photo}" alt="Employee Photo" class="img-thumbnail" style="max-width: 50px;"></td>
                      <td>
                        <button class="btn btn-sm btn-warning" onclick="editEmployee(${employee.ID})">Edit</button>
                        <button class="btn btn-sm btn-danger" onclick="deleteEmployee(${employee.ID})">Delete</button>
                      </td>
                    </tr>`;
    });
  }
  table += `</tbody>`;
  employeesTable.innerHTML = table;
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
      loadEmployees();
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
      const {
        ID,
        FullName,
        Subdivision,
        Position,
        Status,
        PeoplePartner,
        OutOfOfficeBalance,
      } = employee;
      document.getElementById("edit-employee-id").value = ID;
      document.getElementById("edit-full-name").value = FullName;
      document.getElementById("edit-subdivision").value = Subdivision;
      document.getElementById("edit-position").value = Position;
      document.getElementById("edit-status").value = Status;
      document.getElementById("edit-people-partner").value = PeoplePartner;
      document.getElementById("edit-out-of-office-balance").value =
        OutOfOfficeBalance;
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
      loadEmployees();
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
    .then(() => {
      loadEmployees();
    })
    .catch((error) => console.error("Error:", error));
}

function loadProjects() {
  console.log("Fetching URL: http://localhost:3001/projects");
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
      renderProjectsTable(data);
    })
    .catch((error) => console.error("Error:", error));
}

function renderProjectsTable(data) {
  const projectsTable = document.getElementById("projects-table");
  let table = `<thead class="thead-dark">
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
  if (Array.isArray(data)) {
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
  }
  table += `</tbody>`;
  projectsTable.innerHTML = table;
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
      loadProjects();
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
      const {
        ID,
        ProjectType,
        StartDate,
        EndDate,
        ProjectManager,
        Comment,
        Status,
      } = project;
      document.getElementById("edit-project-id").value = ID;
      document.getElementById("edit-project-type").value = ProjectType;
      document.getElementById("edit-start-date").value = StartDate;
      document.getElementById("edit-end-date").value = EndDate;
      document.getElementById("edit-project-manager").value = ProjectManager;
      document.getElementById("edit-comment").value = Comment;
      document.getElementById("edit-status").value = Status;
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
      loadProjects();
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
    .then(() => {
      loadProjects();
    })
    .catch((error) => console.error("Error:", error));
}

function loadLeaveRequests() {
  console.log("Fetching URL: http://localhost:3001/leave-requests");
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
      renderLeaveRequestsTable(data);
    })
    .catch((error) => console.error("Error:", error));
}

function renderLeaveRequestsTable(data) {
  const leaveRequestsTable = document.getElementById("leave-requests-table");
  let table = `<thead class="thead-dark">
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
  if (Array.isArray(data)) {
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
  }
  table += `</tbody>`;
  leaveRequestsTable.innerHTML = table;
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
      loadLeaveRequests();
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
      const { ID, EmployeeID, AbsenceReason, StartDate, EndDate, Comment } =
        leaveRequest;
      document.getElementById("edit-leave-request-id").value = ID;
      document.getElementById("edit-leave-employee").value = EmployeeID;
      document.getElementById("edit-absence-reason").value = AbsenceReason;
      document.getElementById("edit-leave-start-date").value = StartDate;
      document.getElementById("edit-leave-end-date").value = EndDate;
      document.getElementById("edit-comment").value = Comment;
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
      loadLeaveRequests();
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
    .then(() => {
      loadLeaveRequests();
    })
    .catch((error) => console.error("Error:", error));
}

function loadApprovalRequests() {
  console.log("Fetching URL: http://localhost:3001/approval-requests");
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
      renderApprovalRequestsTable(data);
    })
    .catch((error) => console.error("Error:", error));
}

function renderApprovalRequestsTable(data) {
  const approvalRequestsTable = document.getElementById(
    "approval-requests-table"
  );
  let table = `<thead class="thead-dark">
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
  if (Array.isArray(data)) {
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
  }
  table += `</tbody>`;
  approvalRequestsTable.innerHTML = table;
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
      loadApprovalRequests();
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
      const { ID, ApproverID, LeaveRequestID, Comment, Status } =
        approvalRequest;
      document.getElementById("edit-approval-request-id").value = ID;
      document.getElementById("edit-approval-approver").value = ApproverID;
      document.getElementById("edit-approval-leave-request").value =
        LeaveRequestID;
      document.getElementById("edit-approval-comment").value = Comment;
      document.getElementById("edit-approval-status").value = Status;
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
      loadApprovalRequests();
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
    .then(() => {
      loadApprovalRequests();
    })
    .catch((error) => console.error("Error:", error));
}
