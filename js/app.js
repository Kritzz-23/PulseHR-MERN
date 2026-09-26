/**
 * PulseHR Enterprise — Client Controller & Interactive Application Engine
 * Handles State, RBAC Rendering, SVG Visualizations, CRUD Operations, Payroll,
 * Document Vault, Notifications, CSV Exports, and Modals
 */

document.addEventListener('DOMContentLoaded', () => {
  const store = window.PULSEHR_DATA;
  if (!store) return;

  // Initialize UI Modules
  initNavigation();
  initRoleSwitcher();
  initQuickGuideTour();
  initNotifications();
  initGlobalSearch();
  initKPIsAndCharts();
  initEmployeesTable();
  initLeavesModule();
  initAttendanceModule();
  initTasksModule();
  initPayrollModule();
  initPerformanceModule();
  initDocumentsModule();
  initCSVExports();
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

    // Update active button state
    document.querySelectorAll('.role-btn').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-role') === roleKey);
    });

    // Update Sidebar Profile
    const sidebarName = document.getElementById('sidebar-user-name');
    const sidebarRole = document.getElementById('sidebar-user-role');
    const sidebarAvatar = document.getElementById('sidebar-user-avatar');
    const jwtBadge = document.getElementById('jwt-pill-badge');

    if (sidebarName) sidebarName.textContent = profile.name;
    if (sidebarRole) sidebarRole.textContent = `${profile.role.toUpperCase()} • ${profile.department}`;
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
     3. Quick Interactive Guide Tour Buttons
     ======================================================================== */
  function initQuickGuideTour() {
    const guideAdminBtn = document.getElementById('guide-admin-btn');
    const guideEmpBtn = document.getElementById('guide-employee-btn');

    if (guideAdminBtn) {
      guideAdminBtn.addEventListener('click', () => {
        switchRole('admin');
        showToast('👑 Admin Mode active: Full provisioning, analytics, and delete permissions enabled.');
      });
    }

    if (guideEmpBtn) {
      guideEmpBtn.addEventListener('click', () => {
        switchRole('employee');
        showToast('👤 Employee Mode active: Restricted to personal view, applying leaves, and clocking in.');
      });
    }
  }

  /* ========================================================================
     4. Notifications Center Dropdown
     ======================================================================== */
  function initNotifications() {
    const btn = document.getElementById('notification-btn');
    const dropdown = document.getElementById('notification-dropdown');
    const list = document.getElementById('notification-list');
    const badge = document.getElementById('notif-badge');
    const markReadBtn = document.getElementById('mark-notifs-read-btn');

    function renderNotifications() {
      if (!list) return;
      const unreadCount = store.notifications.filter(n => !n.read).length;

      if (badge) {
        badge.textContent = unreadCount;
        badge.style.display = unreadCount > 0 ? 'flex' : 'none';
      }

      list.innerHTML = store.notifications.map(n => `
        <div class="notification-item ${n.read ? '' : 'unread'}">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2px;">
            <strong style="color: ${n.read ? 'var(--text-main)' : 'var(--primary)'};">${n.title}</strong>
            <span style="font-size: 0.72rem; color: var(--text-muted);">${n.time}</span>
          </div>
          <p style="margin: 0; color: var(--text-secondary);">${n.desc}</p>
        </div>
      `).join('');
    }

    if (btn && dropdown) {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        dropdown.classList.toggle('show');
      });

      document.addEventListener('click', (e) => {
        if (!dropdown.contains(e.target) && e.target !== btn) {
          dropdown.classList.remove('show');
        }
      });
    }

    if (markReadBtn) {
      markReadBtn.addEventListener('click', () => {
        store.notifications.forEach(n => n.read = true);
        renderNotifications();
        showToast('All notifications marked as read.');
      });
    }

    renderNotifications();
  }

  /* ========================================================================
     5. Global Quick Search
     ======================================================================== */
  function initGlobalSearch() {
    const searchInput = document.getElementById('global-search-input');
    if (!searchInput) return;

    searchInput.addEventListener('input', (e) => {
      const q = e.target.value.toLowerCase().trim();
      if (!q) return;

      // Filter employees table if open, or switch to it if searching specifically
      const empSearch = document.getElementById('emp-search-input');
      if (empSearch) {
        empSearch.value = q;
        initEmployeesTable();
      }
    });

    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const q = searchInput.value.toLowerCase().trim();
        if (!q) return;
        // Switch to employees tab to show match
        const empTabBtn = document.querySelector('[data-tab=employees]');
        if (empTabBtn) empTabBtn.click();
        showToast(`Filtered directory for "${q}"`);
      }
    });
  }

  /* ========================================================================
     6. KPI Metrics & SVG Charts
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
     7. Employees Directory Module
     ======================================================================== */
  function initEmployeesTable() {
    const tableBody = document.getElementById('employees-table-body');
    const searchInput = document.getElementById('emp-search-input');
    const deptFilter = document.getElementById('emp-dept-filter');

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
     8. Leave Management Module (Approve / Reject Workflow)
     ======================================================================== */
  function initLeavesModule() {
    const tableBody = document.getElementById('leaves-table-body');

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
     9. Attendance & 1-Click Clock-In
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
            id: "EMP-ACTIVE",
            timeIn: timeNow,
            timeOut: "--",
            status: "Present"
          });
          store.metrics.presentToday++;
          initKPIsAndCharts();
          renderAttendance();
          showToast(`Clocked IN at ${timeNow}! Real-time ingress recorded.`);
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
          showToast(`Clocked OUT at ${timeNow}! Shift archived.`);
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
     10. Tasks Management Module
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
     11. Payroll & Payslips Module
     ======================================================================== */
  function initPayrollModule() {
    const tableBody = document.getElementById('payroll-table-body');
    const payslipModal = document.getElementById('payslip-view-modal');
    const modalContent = document.getElementById('payslip-modal-content');
    const printBtn = document.getElementById('print-payslip-btn');

    function renderPayroll() {
      if (!tableBody || !store.payroll || !store.payroll.payslips) return;

      tableBody.innerHTML = store.payroll.payslips.map(slip => `
        <tr>
          <td>
            <div style="font-weight: 700;">${slip.name}</div>
            <div style="font-family: var(--font-mono); font-size: 0.76rem; color: var(--text-muted);">${slip.employeeId}</div>
          </td>
          <td>
            <div>${slip.designation}</div>
            <small style="color: var(--text-muted);">${slip.department}</small>
          </td>
          <td><strong>${slip.month}</strong></td>
          <td style="font-family: var(--font-mono); font-weight: 600;">₹${slip.gross.toLocaleString('en-IN')}</td>
          <td style="font-family: var(--font-mono); color: #DC2626;">- ₹${(slip.pfDeduction + slip.profTax).toLocaleString('en-IN')}</td>
          <td style="font-family: var(--font-mono); font-weight: 700; color: #059669; font-size: 0.95rem;">
            ₹${slip.netPay.toLocaleString('en-IN')}
          </td>
          <td>
            <span class="status-badge ${slip.status === 'Paid' ? 'badge-active' : 'badge-pending'}">
              ● ${slip.status}
            </span>
          </td>
          <td>
            <button class="btn btn-secondary btn-sm view-slip-btn" data-id="${slip.id}">
              👁️ View Payslip
            </button>
          </td>
        </tr>
      `).join('');

      tableBody.querySelectorAll('.view-slip-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const id = btn.getAttribute('data-id');
          const slip = store.payroll.payslips.find(s => s.id === id);
          if (slip && modalContent) {
            modalContent.innerHTML = `
              <div class="payslip-voucher">
                <div class="voucher-header">
                  <div>
                    <h2 style="font-family: var(--font-heading); font-size: 1.25rem; font-weight: 800; color: #1E3A8A; margin: 0;">
                      PulseHR Technologies Pvt. Ltd.
                    </h2>
                    <p style="font-size: 0.8rem; color: var(--text-muted); margin-top: 2px;">
                      DLF CyberCity, Tower 4, Sector 24 &bull; Reg: CIN-U72200WB2026PTC098
                    </p>
                  </div>
                  <div style="text-align: right;">
                    <span class="brand-badge" style="font-size: 0.72rem;">OFFICIAL PAY VOUCHER</span>
                    <div style="font-family: var(--font-mono); font-size: 0.82rem; font-weight: 700; margin-top: 4px;">
                      ${slip.id}
                    </div>
                    <div style="font-size: 0.76rem; color: var(--text-muted);">${slip.month}</div>
                  </div>
                </div>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 16px; font-size: 0.84rem;">
                  <div>
                    <div style="color: var(--text-muted);">Employee Name:</div>
                    <strong>${slip.name}</strong>
                  </div>
                  <div>
                    <div style="color: var(--text-muted);">Employee ID &amp; Dept:</div>
                    <strong>${slip.employeeId} &bull; ${slip.department}</strong>
                  </div>
                  <div>
                    <div style="color: var(--text-muted);">Designation:</div>
                    <strong>${slip.designation}</strong>
                  </div>
                  <div>
                    <div style="color: var(--text-muted);">Disbursement Mode:</div>
                    <strong>HDFC Bank NEFT (Processed)</strong>
                  </div>
                </div>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                  <div>
                    <h4 style="font-size: 0.85rem; font-weight: 700; color: #059669; border-bottom: 1px solid var(--border-subtle); padding-bottom: 4px;">
                      EARNINGS
                    </h4>
                    <table class="voucher-table">
                      <tr><td>Basic Salary</td><td style="text-align: right; font-family: var(--font-mono);">₹${slip.basic.toLocaleString('en-IN')}</td></tr>
                      <tr><td>House Rent Allowance (HRA)</td><td style="text-align: right; font-family: var(--font-mono);">₹${slip.hra.toLocaleString('en-IN')}</td></tr>
                      <tr><td>Special Allowances</td><td style="text-align: right; font-family: var(--font-mono);">₹${slip.allowances.toLocaleString('en-IN')}</td></tr>
                      <tr style="font-weight: 700; border-top: 1px solid var(--border-subtle);">
                        <td>Gross Earnings</td>
                        <td style="text-align: right; font-family: var(--font-mono);">₹${slip.gross.toLocaleString('en-IN')}</td>
                      </tr>
                    </table>
                  </div>

                  <div>
                    <h4 style="font-size: 0.85rem; font-weight: 700; color: #DC2626; border-bottom: 1px solid var(--border-subtle); padding-bottom: 4px;">
                      DEDUCTIONS
                    </h4>
                    <table class="voucher-table">
                      <tr><td>Provident Fund (EPF 12%)</td><td style="text-align: right; font-family: var(--font-mono); color: #DC2626;">₹${slip.pfDeduction.toLocaleString('en-IN')}</td></tr>
                      <tr><td>Professional Tax (PT)</td><td style="text-align: right; font-family: var(--font-mono); color: #DC2626;">₹${slip.profTax.toLocaleString('en-IN')}</td></tr>
                      <tr><td>Income Tax (TDS)</td><td style="text-align: right; font-family: var(--font-mono); color: #DC2626;">₹0</td></tr>
                      <tr style="font-weight: 700; border-top: 1px solid var(--border-subtle);">
                        <td>Total Deductions</td>
                        <td style="text-align: right; font-family: var(--font-mono); color: #DC2626;">₹${(slip.pfDeduction + slip.profTax).toLocaleString('en-IN')}</td>
                      </tr>
                    </table>
                  </div>
                </div>

                <div class="voucher-total-bar" style="margin-top: 16px;">
                  <div>
                    <div style="font-size: 0.74rem; text-transform: uppercase; letter-spacing: 0.5px; color: var(--text-muted);">
                      Net Take-Home Pay
                    </div>
                    <div style="font-size: 0.8rem; font-weight: normal; color: var(--text-secondary);">
                      Credited to registered account on ${slip.paidOn}
                    </div>
                  </div>
                  <div style="font-size: 1.4rem; color: #059669; font-family: var(--font-mono);">
                    ₹${slip.netPay.toLocaleString('en-IN')}
                  </div>
                </div>
              </div>
            `;
            payslipModal.classList.add('show');
          }
        });
      });
    }

    if (printBtn) {
      printBtn.addEventListener('click', () => {
        window.print();
      });
    }

    renderPayroll();
  }

  /* ========================================================================
     12. Performance Reviews & OKRs Module
     ======================================================================== */
  function initPerformanceModule() {
    const grid = document.getElementById('reviews-grid-container');
    if (!grid || !store.performance) return;

    grid.innerHTML = store.performance.map(rev => `
      <div class="review-card">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 10px;">
          <div>
            <h4 style="font-weight: 800; font-size: 1.05rem; margin: 0; color: var(--text-main);">${rev.name}</h4>
            <div style="font-size: 0.8rem; color: var(--text-muted); margin-top: 2px;">
              ${rev.department} &bull; Reviewer: ${rev.reviewer}
            </div>
          </div>
          <div style="background: #FEF3C7; color: #B45309; padding: 4px 10px; border-radius: var(--radius-full); font-weight: 800; font-size: 0.85rem; display: flex; align-items: center; gap: 4px;">
            ⭐ ${rev.rating} / 5.0
          </div>
        </div>

        <div style="background: var(--bg-subtle); padding: 10px 12px; border-radius: var(--radius-sm); border-left: 3px solid var(--primary);">
          <div style="font-size: 0.74rem; font-weight: 700; text-transform: uppercase; color: var(--primary);">
            OKR Milestone Achievement
          </div>
          <div style="font-size: 0.84rem; color: var(--text-main); margin-top: 3px; font-weight: 600;">
            ${rev.okrSummary}
          </div>
        </div>

        <p style="font-size: 0.84rem; color: var(--text-secondary); font-style: italic; line-height: 1.45; margin: 0;">
          "${rev.feedback}"
        </p>

        <div style="display: flex; justify-content: space-between; align-items: center; padding-top: 8px; border-top: 1px solid var(--border-subtle);">
          <span class="brand-badge" style="font-size: 0.72rem; background: #ECFDF5; color: #059669; border-color: #A7F3D0;">
            🏆 ${rev.badge}
          </span>
          <span style="font-family: var(--font-mono); font-size: 0.78rem; color: var(--text-muted);">${rev.period}</span>
        </div>
      </div>
    `).join('');
  }

  /* ========================================================================
     13. Document Vault Module
     ======================================================================== */
  function initDocumentsModule() {
    const grid = document.getElementById('documents-grid-container');
    const openUploadBtn = document.getElementById('open-upload-doc-btn');
    const uploadModal = document.getElementById('upload-doc-modal');
    const uploadForm = document.getElementById('upload-doc-form');

    function renderDocs() {
      if (!grid || !store.documents) return;

      grid.innerHTML = store.documents.map(doc => `
        <div class="doc-card">
          <div style="display: flex; align-items: flex-start; gap: 12px;">
            <div style="font-size: 1.8rem; background: #EFF6FF; padding: 10px; border-radius: var(--radius-md); border: 1px solid #DBEAFE;">
              📄
            </div>
            <div>
              <div style="font-weight: 700; font-size: 0.92rem; color: var(--text-main); line-height: 1.35;">
                ${doc.title}
              </div>
              <div style="font-size: 0.78rem; color: var(--text-muted); margin-top: 4px;">
                Belongs to: <strong>${doc.employeeName}</strong>
              </div>
            </div>
          </div>

          <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.78rem; color: var(--text-muted); padding-top: 8px; border-top: 1px solid var(--border-subtle);">
            <span style="font-family: var(--font-mono);">${doc.fileSize}</span>
            <span class="status-badge badge-active">✓ ${doc.status}</span>
          </div>

          <div style="display: flex; gap: 8px;">
            <button class="btn btn-secondary btn-sm preview-doc-btn" style="flex: 1;" data-title="${doc.title}">
              👁️ Preview
            </button>
            <button class="btn btn-primary btn-sm download-doc-btn" style="flex: 1;" data-title="${doc.title}">
              ⬇️ Download
            </button>
          </div>
        </div>
      `).join('');

      grid.querySelectorAll('.preview-doc-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const t = btn.getAttribute('data-title');
          showToast(`Displaying verified preview for "${t}"`);
        });
      });

      grid.querySelectorAll('.download-doc-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const t = btn.getAttribute('data-title');
          showToast(`Downloading encrypted copy of "${t}"...`);
        });
      });
    }

    if (openUploadBtn && uploadModal) {
      openUploadBtn.addEventListener('click', () => uploadModal.classList.add('show'));
    }

    if (uploadForm) {
      uploadForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const title = document.getElementById('doc-title-input').value;
        const type = document.getElementById('doc-type-select').value;

        store.documents.unshift({
          id: `DOC-${Math.floor(800 + Math.random() * 200)}`,
          employeeName: store.currentUser.name,
          title,
          type,
          fileSize: "1.4 MB PDF",
          uploadedAt: new Date().toISOString().split('T')[0],
          status: "Verified",
          cdnUrl: "https://res.cloudinary.com/pulsehr/raw/upload/v1/user/document.pdf"
        });

        renderDocs();
        uploadModal.classList.remove('show');
        uploadForm.reset();
        showToast(`Document "${title}" encrypted and uploaded to Cloudinary Vault!`);
      });
    }

    renderDocs();
  }

  /* ========================================================================
     14. CSV Exports (Employees & Attendance)
     ======================================================================== */
  function initCSVExports() {
    const exportEmpBtn = document.getElementById('export-employees-csv-btn');
    const exportAttBtn = document.getElementById('export-attendance-csv-btn');

    if (exportEmpBtn) {
      exportEmpBtn.addEventListener('click', () => {
        const headers = ["Employee ID", "Full Name", "Email", "Department", "Designation", "Reports To", "Status", "Phone", "Location", "Joining Date"];
        const rows = store.employees.map(e => [
          `"${e.id}"`,
          `"${e.name}"`,
          `"${e.email}"`,
          `"${e.department}"`,
          `"${e.designation}"`,
          `"${e.manager}"`,
          `"${e.status}"`,
          `"${e.phone}"`,
          `"${e.location}"`,
          `"${e.joiningDate}"`
        ]);

        const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
        downloadCSVBlob(csvContent, 'PulseHR_Employees_Directory_2026.csv');
        showToast('Exported complete Employee Roster to CSV!');
      });
    }

    if (exportAttBtn) {
      exportAttBtn.addEventListener('click', () => {
        const headers = ["Employee Name", "Employee ID", "Clock In", "Clock Out", "Status", "Date"];
        const today = new Date().toISOString().split('T')[0];
        const rows = store.attendanceLogs.map(a => [
          `"${a.name}"`,
          `"${a.id}"`,
          `"${a.timeIn}"`,
          `"${a.timeOut}"`,
          `"${a.status}"`,
          `"${today}"`
        ]);

        const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
        downloadCSVBlob(csvContent, 'PulseHR_Daily_Attendance_Audit_2026.csv');
        showToast('Exported Daily Attendance Audit to CSV!');
      });
    }
  }

  function downloadCSVBlob(csvText, filename) {
    const blob = new Blob([csvText], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  /* ========================================================================
     15. Modals (Add Employee, Apply Leave)
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
        showToast(`Employee ${name} provisioned in company directory!`);
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
     16. Toast Notification System
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
