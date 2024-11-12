// Inicializa o gráfico
const ctx = document.getElementById('myChart').getContext('2d');
let myChart;
let currentChartType = 'bar'; // Tipo de gráfico inicial

// Inicializar o gráfico
function initializeChart() {
    myChart = new Chart(ctx, {
        type: currentChartType,
        data: {
            labels: ['Receita', 'Despesa', 'Investimento', 'Rendimento'],
            datasets: [{
                label: 'Total por Categoria (€)',
                data: [0, 0, 0, 0, 0],
                backgroundColor: [
                    'rgba(75, 192, 192, 0.6)',   // Receita
                    'rgba(255, 99, 132, 0.6)',   // Despesa
                    'rgba(255, 206, 86, 0.6)',   // Investimento
                    'rgba(153, 102, 255, 0.6)',  // Rendimento
                    
                ],
                borderColor: [
                    'rgba(75, 192, 192, 1)',
                    'rgba(255, 99, 132, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(153, 102, 255, 1)',
                    
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

// Atualizar o gráfico com dados das transações
function updateChart() {
    const amounts = { Receita: 0, Despesa: 0, Investimento: 0, Rendimento: 0, Rendimentos: 0 };

    // Soma os valores de cada categoria
    transactions.forEach(transaction => {
        amounts[transaction.type] += transaction.finalAmount;
    });

    // Atualiza os dados do gráfico com as somas calculadas
    myChart.data.datasets[0].data = [
        amounts.Receita,
        amounts.Despesa,
        amounts.Investimento,
        amounts.Rendimento,  // Alterado para Rendimento
        amounts.Rendimentos
    ];

    myChart.update();
}

// Alterar tipo do gráfico
function changeChartType() {
    const selectedType = document.getElementById('chartType').value;
    
    // Se o tipo selecionado for diferente do tipo atual, atualize o gráfico
    if (selectedType !== currentChartType) {
        currentChartType = selectedType;  // Atualiza o tipo de gráfico selecionado
        myChart.destroy();  // Remove o gráfico anterior
        initializeChart();  // Recria o gráfico com o novo tipo
    }
}

// Inicializa o gráfico ao carregar a página
initializeChart();
