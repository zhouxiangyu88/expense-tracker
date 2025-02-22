// 初始化本地存储
let records = JSON.parse(localStorage.getItem('expenseRecords')) || [];

// 添加记录
function addRecord() {
  const type = document.getElementById('type').value;
  const amount = parseFloat(document.getElementById('amount').value);
  const category = document.getElementById('category').value;
  const date = document.getElementById('date').value;

  if (!amount || isNaN(amount)) {
    alert('请输入有效金额');
    return;
  }

  const record = {
    id: Date.now(),
    type,
    amount: type === 'expense' ? -Math.abs(amount) : Math.abs(amount),
    category,
    date
  };

  records.push(record);
  updateStorage();
  renderRecords();
  calculateStats();
  
  // 清空输入
  document.getElementById('amount').value = '';
}

// 渲染记录列表
function renderRecords() {
  const recordsDiv = document.getElementById('records');
  recordsDiv.innerHTML = records
    .map(record => `
      <div class="record-item ${record.type}">
        <span>${new Date(record.date).toLocaleDateString()}</span>
        <span>${getCategoryName(record.category)}</span>
        <span>${record.amount > 0 ? '+' : ''}${record.amount.toFixed(2)}</span>
      </div>
    `)
    .join('');
}

// 统计计算
function calculateStats() {
  const totalIncome = records
    .filter(r => r.type === 'income')
    .reduce((sum, r) => sum + r.amount, 0);

  const totalExpense = records
    .filter(r => r.type === 'expense')
    .reduce((sum, r) => sum + r.amount, 0);

  document.getElementById('total-income').textContent = totalIncome.toFixed(2);
  document.getElementById('total-expense').textContent = Math.abs(totalExpense).toFixed(2);
  document.getElementById('balance').textContent = (totalIncome + totalExpense).toFixed(2);
}

// 分类名称映射
function getCategoryName(category) {
  const categories = {
    food: '餐饮',
    transport: '交通',
    shopping: '购物',
    salary: '工资'
  };
  return categories[category] || '其他';
}

// 更新本地存储
function updateStorage() {
  localStorage.setItem('expenseRecords', JSON.stringify(records));
}

// 初始化渲染
renderRecords();
calculateStats();
