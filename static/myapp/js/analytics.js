



// analytics.js
document.addEventListener('DOMContentLoaded', function() {
    fetch('/api/analytics_data/')
        .then(response => response.json())
        .then(data => {
            console.log(data);
            const ctx = document.getElementById('analyticsChart').getContext('2d');
            new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: ['Total Deals'],
                    datasets: [{
                        label: 'Amount',
                        data: [data.total_amount],
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    }]
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
        })
        .catch(error => console.error('Error loading the data:', error));
});

















/*document.addEventListener('DOMContentLoaded', function() {
    const salesFunnelChartCtx = document.getElementById('salesFunnelChart').getContext('2d');
    const dealsAmountEl = document.getElementById('dealsAmount');
    const wonDealsAmountEl = document.getElementById('wonDealsAmount');
    const userStatsTbody = document.getElementById('userStats');

    let salesFunnelChart = new Chart(salesFunnelChartCtx, {
        type: 'bar',
        data: {
            labels: ['Deals', 'Stage 1', 'Stage 2', 'Stage 3', 'Stage 4', 'Won deals'],
            datasets: [{
                label: 'Sales Funnel',
                data: [],
                backgroundColor: ['#3498db', '#1abc9c', '#00c3ff', '#00e7d4', '#ffab00', '#ff5a5f', '#2ecc71'],
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: { label: function(context) { return `${context.dataset.label}: ${context.raw}`; }}
                }
            },
            scales: {
                y: { beginAtZero: true, ticks: { stepSize: 1 } },
                x: { grid: { display: false } }
            }
        }
    });

    function updateData() {
        fetch('/api/analytics_data/')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log(data);
            
            // Update chart
            salesFunnelChart.data.datasets[0].data = [
                data.total_deals, data.total_deals * 0.8, data.total_deals * 0.6, data.total_deals * 0.4, data.total_deals * 0.2, data.won_deals
            ];
            salesFunnelChart.update();

            // Update deals amounts
            dealsAmountEl.textContent = data.total_amount;
            wonDealsAmountEl.textContent = data.won_amount;

            // Update user stats in the table
            userStatsTbody.innerHTML = '';
            data.user_stats.forEach(user => {
                const row = `<tr>
                    <td>${user.username}</td>
                    <td>${user.total_deals}</td>
                    <td>${user.lost_deals}</td>
                    <td>$${user.total_amount}</td>
                    <td>${user.won_deals}</td>
                    <td>$${user.won_amount}</td>
                    <td>${user.conversion_rate}%</td>
                </tr>`;
                userStatsTbody.insertAdjacentHTML('beforeend', row);
            });
        })
        .catch(error => console.error('Error fetching data:', error));
    }

    updateData(); // Initial data fetch
});*/
