/**
 * PulseHR Enterprise — Client Controller & Interactive Application Engine
 * Handles State, RBAC Rendering, SVG Visualizations, CRUD Operations, and Modals
 */

document.addEventListener('DOMContentLoaded', () => {
  const store = window.PULSEHR_DATA;
  if (!store) return;

  // Initialize UI Components
  initNavigation();
  initRoleSwitcher();
  initKPIsAndCharts();
  initEmployeesTable();
  initLeavesModule();
  initAttendanceModule();
  initTasksModule();
  initModals();
  updateRBACUI();

  /* ========================================================================
     1. Navigation & Tab Switching
     ======================================================================== */
  function initNavigation() {
    const tabBtns = document.querySelectorAll('.nav-tab-btn');
    const panels = document.querySelectorAll('.tab-panel');
    const pageTitle = document.getElementById('page-title');
    const mobileBtn = document.getElementById('mobile-toggle');
    const sidebar = document.getElementById('app-sidebar');

    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetTab = btn.getAttribute('data-tab');
        tabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        panels.forEach(p => {
          p.classList.toggle('active', p.id === `tab-${targetTab}`);
        });

        if (pageTitle) {
          pageTitle.textContent = btn.querySelector('.tab-label').textContent;
        }

        if (sidebar && window.innerWidth <= 768) {
          sidebar.classList.remove('show');
        }
      });
    });

    if (mobileBtn && sidebar) {
      mobileBtn.addEventListener('click', () => {
        sidebar.classList.toggle('show');
      });
    }
  }

  /* ========================================================================
     2. 1-Click Role Switcher (Admin, HR, Manager, Employee)
     ======================================================================== */
  function initRoleSwitcher() {
    const roleBtns = document.querySelectorAll('.role-btn');
    roleBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const role = btn.getAttribute('data-role');
        roleBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        switchRole(role);
      });
    });
  }

  function switchRole(roleKey) {
    const profile = store.demoRoles[roleKey];
    if (!profile) return;

    store.currentUser = {
      ...profile,
      token: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.pulsehr.${roleKey}.2026.token`
    };

    // Update Sidebar Profile
    const sidebarName = document.getElementById('sidebar-user-name');
    const sidebarRole = document.getElementById('sidebar-user-role');
    const sidebarAvatar = document.getElementById('sidebar-user-avatar');
    const jwtBadge = document.getElementById('jwt-pill-badge');

    if (sidebarName) sidebarName.textContent = profile.name;
    if (sidebarRole) sidebarRole.textContent = `${profile.role.toUpperCase()} &bull; ${profile.department}`;
    if (sidebarAvatar) sidebarAvatar.src = profile.avatar;
    if (jwtBadge) jwtBadge.innerHTML = `● JWT ACTIVE (${profile.role.toUpperCase()})`;

    updateRBACUI();
    showToast(`Switched active session to: ${profile.name} (${profile.role.toUpperCase()})`);
  }

  function updateRBACUI() {
    const role = store.currentUser.role;
    const adminOnlyElements = document.querySelectorAll('.rbac-admin');
    const hrAdminElements = document.querySelectorAll('.rbac-hr-admin');
    const managerElements = document.querySelectorAll('.rbac-manager');

    // Admin Only
    adminOnlyElements.forEach(el => {
      el.style.display = role === 'admin' ? '' : 'none';
    });

    // HR or Admin
    hrAdminElements.forEach(el => {
      el.style.display = (role === 'admin' || role === 'hr') ? '' : 'none';
    });

    // Manager, HR, or Admin
    managerElements.forEach(el => {
      el.style.display = (role === 'admin' || role === 'hr' || role === 'manager') ? '' : 'none';
    });
  }

  /* ========================================================================
     3. KPI Metrics & SVG Charts
     ======================================================================== */
  function initKPIsAndCharts() {
    // 4 KPI Cards
    const totalEl = document.getElementById('kpi-total-emp');
    const presentEl = document.getElementById('kpi-present');
    const leaveEl = document.getElementById('kpi-on-leave');
    const pendingEl = document.getElementById('kpi-pending-req');

    if (totalEl) totalEl.textContent = store.metrics.totalEmployees;
    if (presentEl) presentEl.textContent = store.metrics.presentToday;
    if (leaveEl) leaveEl.textContent = store.metrics.onLeave;
    if (pendingEl) pendingEl.textContent = store.metrics.pendingRequests;

    renderGrowthSVGChart();
    renderDepartmentBars();
  }

  function renderGrowthSVGChart() {
    const svg = document.getElementById('growth-svg');
    if (!svg) return;

    const data = store.growthTrajectory;
    const width = 640;
    const height = 200;
    const paddingX = 40;
    const paddingY = 30;

    const minVal = 160;
    const maxVal = 260;

    const getX = (idx) => paddingX + (idx / (data.length - 1)) * (width - 2 * paddingX);
    const getY = (val) => height - paddingY - ((val - minVal) / (maxVal - minVal)) * (height - 2 * paddingY);

    let pathD = '';
    let areaD = `M ${getX(0)} ${height - paddingY}`;
    let pointsHtml = '';
    let labelsHtml = '';

    data.forEach((pt, i) => {
      const cx = getX(i);
      const cy = getY(pt.count);

      if (i === 0) {
        pathD += `M ${cx} ${cy}`;
      } else {
        const prevX = getX(i - 1);
        const prevY = getY(data[i - 1].count);
        const cpx1 = prevX + (cx - prevX) / 2;
        const cpy1 = prevY;
        const cpx2 = prevX + (cx - prevX) / 2;
        const cpy2 = cy;
        pathD += ` C ${cpx1} ${cpy1}, ${cpx2} ${cpy2}, ${cx} ${cy}`;
      }

      areaD += ` L ${cx} ${cy}`;

      pointsHtml += `
        <circle cx="${cx}" cy="${cy}" r="4.5" class="svg-point" data-month="${pt.month}" data-val="${pt.count}">
          <title>${pt.month}: ${pt.count} Employees</title>
        </circle>
      `;

      labelsHtml += `
        <text x="${cx}" y="${height - 8}" class="svg-text">${pt.month}</text>
      `;
    });

    areaD += ` L ${getX(data.length - 1)} ${height - paddingY} Z`;

    svg.innerHTML = `
      <defs>
        <linearGradient id="growthGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#2563EB" stop-opacity="0.35"/>
          <stop offset="100%" stop-color="#2563EB" stop-opacity="0.0"/>
        </linearGradient>
      </defs>
      <line x1="${paddingX}" y1="${getY(240)}" x2="${width - paddingX}" y2="${getY(240)}" class="svg-grid-line" />
      <line x1="${paddingX}" y1="${getY(200)}" x2="${width - paddingX}" y2="${getY(200)}" class="svg-grid-line" />
      <line x1="${paddingX}" y1="${getY(180)}" x2="${width - paddingX}" y2="${getY(180)}" class="svg-grid-line" />
      <path d="${areaD}" class="svg-area-path" />
      <path d="${pathD}" class="svg-line-path" />
      ${pointsHtml}
      ${labelsHtml}
    `;
  }

  function renderDepartmentBars() {
    const container = document.getElementById('dept-bars-list');
    if (!container) return;

    container.innerHTML = store.departments.map(d => `
      <div class="dept-bar-row">
        <div class="dept-bar-meta">
          <span>${d.name} (${d.lead})</span>
          <span style="font-family: var(--font-mono); color: ${d.color};">${d.count} (${d.percentage}%)</span>
        </div>
        <div class="dept-progress-track">
          <div class="dept-progress-fill" style="width: ${d.percentage}%; background-color: ${d.color};"></div>
        </div>
      </div>
    `).join('');
  }

  /* ========================================================================
     4. Employees Directory Module
     ======================================================================== */
  function initEmployeesTable() {
    const tableBody = document.getElementById('employees-table-body');
    const searchInput = document.getElementById('emp-search-input');
    const deptFilter = document.getElementById('emp-dept-filter');
    const addEmpBtn = document.getElementById('add-emp-btn');

    function renderTable() {
      if (!tableBody) return;
      const q = (searchInput ? searchInput.value.toLowerCase().trim() : '');
      const d = (deptFilter ? deptFilter.value : 'All');

      const filtered = store.employees.filter(emp => {
        const matchDept = (d === 'All' || emp.department === d);
        const matchSearch = (!q || 
          emp.name.toLowerCase().includes(q) ||
          emp.email.toLowerCase().includes(q) ||
          emp.id.toLowerCase().includes(q) ||
          emp.designation.toLowerCase().includes(q)
        );
        return matchDept && matchSearch;
      });

      if (filtered.length === 0) {
        tableBody.innerHTML = `
          <tr>
            <td colspan="6" style="text-align: center; padding: 36px; color: var(--text-muted);">
              No employees match the search filter.
            </td>
          </tr>
        `;
        return;
      }

      tableBody.innerHTML = filtered.map(emp => `
        <tr>
          <td>
            <div class="user-cell">
              <img src="${emp.avatar}" alt="${emp.name}" class="user-avatar-sm">
              <div>
                <div style="font-weight: 700; color: var(--text-main);">${emp.name}</div>
                <div style="font-size: 0.78rem; color: var(--text-muted); font-family: var(--font-mono);">${emp.id}</div>
              </div>
            </div>
          </td>
          <td>
            <div style="font-weight: 600;">${emp.designation}</div>
            <div style="font-size: 0.78rem; color: var(--text-muted);">${emp.email}</div>
          </td>
          <td>
            <span class="badge-active" style="padding: 2px 8px; border-radius: 4px; font-weight: 600; font-size: 0.8rem;">
              ${emp.department}
            </span>
          </td>
          <td>${emp.manager}</td>
          <td>
            <span class="status-badge ${emp.status === 'Active' ? 'badge-active' : 'badge-onleave'}">
              ● ${emp.status}
            </span>
          </td>
          <td>
            <button class="btn btn-secondary btn-sm delete-emp-btn rbac-admin" data-id="${emp.id}" title="Remove Employee">
              🗑️ Delete
            </button>
          </td>
        </tr>
      `).join('');

      // Bind delete handlers
      tableBody.querySelectorAll('.delete-emp-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const empId = btn.getAttribute('data-id');
          if (confirm(`Remove employee ${empId} from company database?`)) {
            store.employees = store.employees.filter(e => e.id !== empId);
            store.metrics.totalEmployees--;
            initKPIsAndCharts();
            renderTable();
            showToast(`Employee ${empId} removed from records.`);
          }
        });
      });

      updateRBACUI();
    }

    if (searchInput) searchInput.addEventListener('input', renderTable);
    if (deptFilter) deptFilter.addEventListener('change', renderTable);

    renderTable();
  }

  /* ========================================================================
     5. Leave Management Module (Approve / Reject Workflow)
     ======================================================================== */
  function initLeavesModule() {
    const tableBody = document.getElementById('leaves-table-body');
    const applyBtn = document.getElementById('apply-leave-btn');

    function renderLeaves() {
      if (!tableBody) return;
      tableBody.innerHTML = store.leaves.map(lv => `
        <tr>
          <td>
            <div style="font-weight: 700;">${lv.employeeName}</div>
            <div style="font-size: 0.78rem; color: var(--text-muted);">${lv.department}</div>
          </td>
          <td><strong>${lv.leaveType}</strong></td>
          <td>
            <span style="font-family: var(--font-mono); font-size: 0.82rem;">${lv.startDate} → ${lv.endDate}</span>
            <span style="font-size: 0.78rem; color: var(--text-muted);">(${lv.days} Days)</span>
          </td>
          <td style="max-width: 240px; font-size: 0.82rem; color: var(--text-secondary);">${lv.reason}</td>
          <td>
            <span class="status-badge ${lv.status === 'Approved' ? 'badge-active' : lv.status === 'Rejected' ? 'badge-rejected' : 'badge-pending'}">
              ● ${lv.status}
            </span>
          </td>
          <td>
            ${lv.status === 'Pending' ? `
              <div style="display: flex; gap: 6px;" class="rbac-manager">
                <button class="btn btn-primary btn-sm approve-leave-btn" data-id="${lv.id}">✓ Approve</button>
                <button class="btn btn-secondary btn-sm reject-leave-btn" data-id="${lv.id}">✕ Reject</button>
              </div>
            ` : `<span style="font-size: 0.8rem; color: var(--text-dim);">Processed</span>`}
          </td>
        </tr>
      `).join('');

      tableBody.querySelectorAll('.approve-leave-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const id = btn.getAttribute('data-id');
          const item = store.leaves.find(l => l.id === id);
          if (item) {
            item.status = 'Approved';
            store.metrics.pendingRequests = Math.max(0, store.metrics.pendingRequests - 1);
            store.metrics.onLeave++;
            initKPIsAndCharts();
            renderLeaves();
            showToast(`Leave request #${id} approved!`);
          }
        });
      });

      tableBody.querySelectorAll('.reject-leave-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const id = btn.getAttribute('data-id');
          const item = store.leaves.find(l => l.id === id);
          if (item) {
            item.status = 'Rejected';
            store.metrics.pendingRequests = Math.max(0, store.metrics.pendingRequests - 1);
            initKPIsAndCharts();
            renderLeaves();
            showToast(`Leave request #${id} rejected.`);
          }
        });
      });

      updateRBACUI();
    }

    renderLeaves();
  }

  /* ========================================================================
     6. Attendance & 1-Click Clock-In
     ======================================================================== */
  function initAttendanceModule() {
    const clockBtn = document.getElementById('clock-in-widget-btn');
    const attBody = document.getElementById('attendance-table-body');
    let isClockedIn = false;

    if (clockBtn) {
      clockBtn.addEventListener('click', () => {
        const timeNow = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        if (!isClockedIn) {
          isClockedIn = true;
          clockBtn.innerHTML = `⏱️ Clock Out (${timeNow})`;
          clockBtn.style.background = '#FEF2F2';
          clockBtn.style.color = '#B91C1C';
          clockBtn.style.borderColor = '#FECACA';

          store.attendanceLogs.unshift({
            name: store.currentUser.name,
            id: "CURRENT",
            timeIn: timeNow,
            timeOut: "--",
            status: "Present"
          });
          store.metrics.presentToday++;
          initKPIsAndCharts();
          renderAttendance();
          showToast(`Clocked IN at ${timeNow}! Attendance verified.`);
        } else {
          isClockedIn = false;
          clockBtn.innerHTML = `⏱️ Clock In`;
          clockBtn.style.background = '';
          clockBtn.style.color = '';
          clockBtn.style.borderColor = '';

          if (store.attendanceLogs[0]) {
            store.attendanceLogs[0].timeOut = timeNow;
          }
          renderAttendance();
          showToast(`Clocked OUT at ${timeNow}! Shift logged.`);
        }
      });
    }

    function renderAttendance() {
      if (!attBody) return;
      attBody.innerHTML = store.attendanceLogs.map(log => `
        <tr>
          <td><strong>${log.name}</strong></td>
          <td style="font-family: var(--font-mono);">${log.id}</td>
          <td style="font-family: var(--font-mono); color: #059669;">${log.timeIn}</td>
          <td style="font-family: var(--font-mono);">${log.timeOut}</td>
          <td>
            <span class="status-badge ${log.status === 'Present' ? 'badge-active' : 'badge-onleave'}">
              ● ${log.status}
            </span>
          </td>
        </tr>
      `).join('');
    }

    renderAttendance();
  }

  /* ========================================================================
     7. Tasks Management Module
     ======================================================================== */
  function initTasksModule() {
    const taskContainer = document.getElementById('tasks-list-container');

    function renderTasks() {
      if (!taskContainer) return;
      taskContainer.innerHTML = store.tasks.map(tsk => `
        <div style="background: #FFFFFF; border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 18px; margin-bottom: 12px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px;">
          <div>
            <div style="display: flex; gap: 8px; align-items: center; margin-bottom: 4px;">
              <span style="font-family: var(--font-mono); font-size: 0.72rem; font-weight: 700; background: var(--bg-subtle); padding: 2px 6px; border-radius: 4px;">${tsk.id}</span>
              <span class="status-badge ${tsk.priority === 'Critical' ? 'badge-rejected' : tsk.priority === 'High' ? 'badge-onleave' : 'badge-pending'}">
                ${tsk.priority} Priority
              </span>
              <span style="font-size: 0.78rem; color: var(--text-muted);">Due: ${tsk.dueDate}</span>
            </div>
            <div style="font-size: 1rem; font-weight: 700; color: var(--text-main);">${tsk.title}</div>
            <div style="font-size: 0.82rem; color: var(--text-muted); margin-top: 4px;">
              Assigned to: <strong>${tsk.assignedTo}</strong> &bull; By: ${tsk.assignedBy} (${tsk.department})
            </div>
          </div>
          <div style="display: flex; gap: 8px; align-items: center;">
            <select class="form-select task-status-select btn-sm" data-id="${tsk.id}">
              <option value="Pending" ${tsk.status === 'Pending' ? 'selected' : ''}>Pending</option>
              <option value="In Progress" ${tsk.status === 'In Progress' ? 'selected' : ''}>In Progress</option>
              <option value="Completed" ${tsk.status === 'Completed' ? 'selected' : ''}>Completed</option>
            </select>
          </div>
        </div>
      `).join('');

      taskContainer.querySelectorAll('.task-status-select').forEach(sel => {
        sel.addEventListener('change', () => {
          const id = sel.getAttribute('data-id');
          const tsk = store.tasks.find(t => t.id === id);
          if (tsk) {
            tsk.status = sel.value;
            showToast(`Task ${id} updated to ${sel.value}!`);
          }
        });
      });
    }

    renderTasks();
  }

  /* ========================================================================
     8. Modals (Add Employee, Apply Leave, Auth Modal)
     ======================================================================== */
  function initModals() {
    // Add Employee Modal
    const addEmpModal = document.getElementById('add-employee-modal');
    const openAddEmpBtn = document.getElementById('open-add-emp-btn');
    const closeAddEmpBtn = document.getElementById('close-add-emp-btn');
    const addEmpForm = document.getElementById('add-employee-form');

    if (openAddEmpBtn && addEmpModal) {
      openAddEmpBtn.addEventListener('click', () => addEmpModal.classList.add('show'));
    }
    if (closeAddEmpBtn && addEmpModal) {
      closeAddEmpBtn.addEventListener('click', () => addEmpModal.classList.remove('show'));
    }

    if (addEmpForm) {
      addEmpForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('new-emp-name').value;
        const email = document.getElementById('new-emp-email').value;
        const dept = document.getElementById('new-emp-dept').value;
        const desig = document.getElementById('new-emp-desig').value;

        const newId = `EMP-${store.employees.length + 1001}`;
        store.employees.unshift({
          id: newId,
          name,
          email,
          role: "employee",
          designation: desig,
          department: dept,
          manager: "Vikram Sengupta",
          status: "Active",
          phone: "+91 98301 99999",
          location: "Kolkata, IN",
          joiningDate: new Date().toISOString().split('T')[0],
          avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150"
        });

        store.metrics.totalEmployees++;
        initKPIsAndCharts();
        initEmployeesTable();
        addEmpModal.classList.remove('show');
        addEmpForm.reset();
        showToast(`Employee ${name} successfully added and provisioned!`);
      });
    }

    // Apply Leave Modal
    const leaveModal = document.getElementById('apply-leave-modal');
    const openLeaveBtn = document.getElementById('open-apply-leave-btn');
    const closeLeaveBtn = document.getElementById('close-apply-leave-btn');
    const leaveForm = document.getElementById('apply-leave-form');

    if (openLeaveBtn && leaveModal) {
      openLeaveBtn.addEventListener('click', () => leaveModal.classList.add('show'));
    }
    if (closeLeaveBtn && leaveModal) {
      closeLeaveBtn.addEventListener('click', () => leaveModal.classList.remove('show'));
    }

    if (leaveForm) {
      leaveForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const type = document.getElementById('leave-type-select').value;
        const start = document.getElementById('leave-start-date').value;
        const end = document.getElementById('leave-end-date').value;
        const reason = document.getElementById('leave-reason-text').value;

        store.leaves.unshift({
          id: `LV-2026-${Math.floor(100 + Math.random() * 900)}`,
          employeeName: store.currentUser.name,
          department: store.currentUser.department,
          leaveType: type,
          startDate: start,
          endDate: end,
          days: 2,
          reason,
          status: "Pending",
          appliedAt: new Date().toISOString().split('T')[0]
        });

        store.metrics.pendingRequests++;
        initKPIsAndCharts();
        initLeavesModule();
        leaveModal.classList.remove('show');
        leaveForm.reset();
        showToast(`Leave application submitted for managerial approval!`);
      });
    }
  }

  /* ========================================================================
     9. Toast Notification System
     ======================================================================== */
  function showToast(msg) {
    let toast = document.getElementById('toast-notification');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'toast-notification';
      toast.className = 'toast-box';
      document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3200);
  }
});
