document.addEventListener('DOMContentLoaded', function () {
    displayIssues();
    displayUserInfo();
});

const userRoles = {
    ADMIN: 'admin',
    USER: 'user',
};

let currentUserRole = userRoles.USER;
const userData = {
    user: {
        role: userRoles.USER,
        responsibilities: ['View Issues'],
    },
    admin: {
        role: userRoles.ADMIN,
        responsibilities: ['Create Issues', 'View Issues', 'Update Issues', 'Attach Files', 'Delete Issues'],
    },
};

function setCurrentUserRole(role) {
    currentUserRole = role;
    displayIssues();
    displayUserInfo();
}

function canUpdateOrAttach(issueCreator) {
    return currentUserRole === userRoles.ADMIN || currentUserRole === issueCreator;
}

function createIssue() {
    const title = document.getElementById('title').value;
    const priority = document.getElementById('priority').value;
    const assignedTo = document.getElementById('assignedTo').value;

    if (!title) {
        alert('Please enter an issue title.');
        return;
    }

    const issue = { title, priority, createdBy: currentUserRole };

    // Add the assignedTo property only if a username is provided
    if (assignedTo.trim() !== '') {
        issue.assignedTo = assignedTo;
    }

    const issues = getIssuesFromStorage();
    issues.push(issue);
    localStorage.setItem('issues', JSON.stringify(issues));

    displayIssues();
    clearForm();
}

function updateIssue(index, newTitle, newPriority) {
    const issues = getIssuesFromStorage();

    if (canUpdateOrAttach(issues[index].createdBy)) {
        issues[index].title = newTitle;
        issues[index].priority = newPriority;
        localStorage.setItem('issues', JSON.stringify(issues));
        displayIssues();
    } else {
        alert('Permission denied. You cannot update this issue.');
    }
}

function attachFile(index, file) {
    const issues = getIssuesFromStorage();

    if (canUpdateOrAttach(issues[index].createdBy)) {
        issues[index].file = file;
        localStorage.setItem('issues', JSON.stringify(issues));
        displayIssues();
    } else {
        alert('Permission denied. You cannot attach a file to this issue.');
    }
}

function deleteIssue(index) {
    const issues = getIssuesFromStorage();
    
    if (canUpdateOrAttach(issues[index].createdBy)) {
        issues.splice(index, 1);
        localStorage.setItem('issues', JSON.stringify(issues));
        displayIssues();
    } else {
        alert('Permission denied. You cannot delete this issue.');
    }
}

function clearForm() {
    document.getElementById('title').value = '';
    document.getElementById('priority').value = 'low';
}

function getIssuesFromStorage() {
    return JSON.parse(localStorage.getItem('issues')) || [];
}

function displayIssues() {
    const issues = getIssuesFromStorage();
    const issueList = document.getElementById('issue-list');
    issueList.innerHTML = '';

    issues.forEach(function (issue, index) {
        const issueItem = document.createElement('div');
        issueItem.className = 'issue-item';

        issueItem.innerHTML = `
            <strong>${issue.title}</strong> (Priority: ${issue.priority})
            ${canUpdateOrAttach(issue.createdBy) ?
                `<button onclick="updateIssue(${index}, prompt('Enter new title:'), prompt('Enter new priority:'))">Update</button>` : ''}
            
            ${canUpdateOrAttach(issue.createdBy) ?
                `<input type="file" onchange="attachFile(${index}, this.files[0])">` : ''}
            
            ${canUpdateOrAttach(issue.createdBy) ?
                `<button onclick="deleteIssue(${index})">Delete</button>` : ''}
        `;

        issueList.appendChild(issueItem);
    });
}

function displayUserInfo() {
    const userInfo = document.getElementById('user-details');
    userInfo.innerHTML = '';

    const userDetailItem = document.createElement('div');
    userDetailItem.className = 'user-detail-item';

    userDetailItem.innerHTML = `
        <strong>User Role:</strong> ${userData[currentUserRole].role}<br>
        <strong>Responsibilities:</strong> ${userData[currentUserRole].responsibilities.join(', ')}
    `;

    userInfo.appendChild(userDetailItem);
}
