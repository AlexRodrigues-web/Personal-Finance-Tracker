let transactions = [];
let budgets = [];
let goals = [];
let myChart;
let currentChartType = 'bar'; // Tipo de gráfico inicial

// Função para alternar entre as seções
function showSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        document.querySelectorAll('.content > div').forEach(section => {
            section.style.display = 'none';
        });
        section.style.display = 'block';
    } else {
        console.error("Seção não encontrada: " + sectionId);
    }
}

// Inicializar o gráfico
function initializeChart() {
    const ctx = document.getElementById('myChart').getContext('2d');
    myChart = new Chart(ctx, {
        type: currentChartType,
        data: {
            labels: ['Receita', 'Despesa', 'Investimento', 'Rendimento'],
            datasets: [{
                label: 'Total por Categoria (€)',
                data: [0, 0, 0, 0],
                backgroundColor: [
                    'rgba(75, 192, 192, 0.6)',
                    'rgba(255, 99, 132, 0.6)',
                    'rgba(255, 206, 86, 0.6)',
                    'rgba(153, 102, 255, 0.6)'
                ],
                borderColor: [
                    'rgba(75, 192, 192, 1)',
                    'rgba(255, 99, 132, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(153, 102, 255, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Valor (€)'
                    }
                }
            }
        }
    });
}

// Função para adicionar transação
function addTransaction() {
    const amount = parseFloat(document.getElementById("amount").value);
    const type = document.getElementById("type").value;
    const interest = parseFloat(document.getElementById("interest").value) || 0;
    const description = document.getElementById("description").value || "Sem descrição";

    if (!amount || !type) {
        alert("Por favor, insira valores válidos.");
        return;
    }

    const date = new Date().toLocaleDateString();
    const transaction = {
        date,
        amount,
        type,
        interest,
        description,
        finalAmount: amount + (amount * (interest / 100))
    };

    transactions.push(transaction);
    updateTransactions();
    updateChart();
    clearFields();
}

// Função para limpar campos do formulário
function clearFields() {
    document.getElementById("amount").value = '';
    document.getElementById("type").value = '';
    document.getElementById("interest").value = '';
    document.getElementById("description").value = '';
}

// Função para atualizar a lista de transações
function updateTransactions() {
    const transactionsDiv = document.getElementById("transactions");
    transactionsDiv.innerHTML = "";

    transactions.forEach((transaction, index) => {
        const transactionDiv = document.createElement("div");
        transactionDiv.className = "transaction-item";
        transactionDiv.innerHTML = `
            ${transaction.date} - ${transaction.type}: €${transaction.finalAmount.toFixed(2)} - Juros: ${transaction.interest}%<br>
            ${transaction.description}
        `;
        transactionsDiv.appendChild(transactionDiv);
    });
}

// Função para atualizar o gráfico com os valores das transações
function updateChart() {
    const totalByType = [0, 0, 0, 0];

    transactions.forEach(transaction => {
        const typeIndex = getTypeIndex(transaction.type);
        if (typeIndex !== -1) {
            totalByType[typeIndex] += transaction.finalAmount;
        }
    });

    myChart.data.datasets[0].data = totalByType;
    myChart.update();
}

// Função para mapear tipo de transação para índice
function getTypeIndex(type) {
    const types = ['Receita', 'Despesa', 'Investimento', 'Rendimento'];
    return types.indexOf(type);
}

// Função para mudar o tipo de gráfico
function changeChartType() {
    const chartType = document.getElementById('chartType').value;
    if (chartType !== currentChartType) {
        currentChartType = chartType;
        myChart.destroy();
        initializeChart();
    }
}

// Função para gerar o PDF
function saveAsPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    doc.setFont("Arial", "normal");
    doc.text("Relatório Financeiro", 20, 20);
    let y = 30;
    
    transactions.forEach(transaction => {
        doc.text(`${transaction.date} - ${transaction.type}: €${transaction.finalAmount.toFixed(2)} - Juros: ${transaction.interest}%`, 20, y);
        y += 10;
    });
    
    doc.save("relatorio-financeiro.pdf");
}

// Função para compartilhar por e-mail
function shareEmail() {
    const subject = "Relatório Financeiro";
    const body = encodeURIComponent(transactions.map(transaction => `${transaction.date} - ${transaction.type}: €${transaction.finalAmount.toFixed(2)}\n`).join("\n"));
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
}

// Funções de compartilhamento
function shareFacebook() {
    const url = window.location.href;
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    window.open(facebookUrl, '_blank');
}

function shareTwitter() {
    const url = window.location.href;
    const twitterUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}`;
    window.open(twitterUrl, '_blank');
}

function shareWhatsApp() {
    const url = window.location.href;
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(url)}`;
    window.open(whatsappUrl, '_blank');
}

// Função para adicionar orçamento
function addBudget() {
    const category = document.getElementById('budgetCategory').value;
    const amount = parseFloat(document.getElementById('budgetAmount').value);

    if (!category || isNaN(amount) || amount <= 0) {
        alert("Por favor, preencha todos os campos corretamente.");
        return;
    }

    const budget = {
        category,
        amount
    };
    budgets.push(budget);
    displayBudgets();
    clearBudgetFields();
}

// Função para exibir orçamentos
function displayBudgets() {
    const budgetList = document.getElementById('budget-list');
    budgetList.innerHTML = '';
    
    budgets.forEach((budget, index) => {
        const budgetItem = document.createElement('div');
        budgetItem.classList.add('budget-item');
        budgetItem.innerHTML = `
            <p><strong>${budget.category}</strong>: €${budget.amount.toFixed(2)}</p>
            <button onclick="deleteBudget(${index})">Excluir</button>
        `;
        budgetList.appendChild(budgetItem);
    });
}

// Função para excluir orçamento
function deleteBudget(index) {
    budgets.splice(index, 1);
    displayBudgets();
}

// Função para limpar campos de orçamento
function clearBudgetFields() {
    document.getElementById('budgetCategory').value = '';
    document.getElementById('budgetAmount').value = '';
}

// Função para adicionar meta (adicionada para corrigir o erro)
function addGoal() {
    const goalName = document.getElementById('goalName').value;
    const goalAmount = parseFloat(document.getElementById('goalAmount').value);

    if (!goalName || isNaN(goalAmount) || goalAmount <= 0) {
        alert("Por favor, preencha todos os campos corretamente.");
        return;
    }

    const goal = {
        name: goalName,
        amount: goalAmount
    };
    goals.push(goal);
    displayGoals();
    clearGoalFields();
}

// Função para exibir metas
function displayGoals() {
    const goalsList = document.getElementById('goal-list');
    goalsList.innerHTML = '';
    
    goals.forEach((goal, index) => {
        const goalItem = document.createElement('div');
        goalItem.classList.add('goal-item');
        goalItem.innerHTML = `
            <p><strong>${goal.name}</strong>: €${goal.amount.toFixed(2)}</p>
            <button onclick="deleteGoal(${index})">Excluir</button>
        `;
        goalsList.appendChild(goalItem);
    });
}

// Função para excluir meta
function deleteGoal(index) {
    goals.splice(index, 1);
    displayGoals();
}

// Função para limpar campos de meta
function clearGoalFields() {
    document.getElementById('goalName').value = '';
    document.getElementById('goalAmount').value = '';
}

// Inicializar o gráfico ao carregar a página
window.onload = function() {
    initializeChart();
    document.getElementById('shareEmailButton').addEventListener('click', shareEmail);
};
