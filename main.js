const app = {
    data: {
        income: 0,
        items: {}
    },
    
    // ВАШІ КАТЕГОРІЇ (Без оренди, з підписками)
    categories: [
        "Комуналка + Net",
        "Підписки",
        "Продукти",
        "Транспорт",
        "Мобільний",
        "Кафе / Паби",
        "Одяг / Шопінг",
        "Розваги",
        "Скарбничка"
    ],

    init: function() {
        this.renderRows();
        
        const incomeInput = document.getElementById('income');
        if (incomeInput) {
            incomeInput.addEventListener('input', () => this.calculate());
        }

        this.load();
        this.calculate();
    },

    renderRows: function() {
        const container = document.getElementById('rows-container');
        let html = '';

        this.categories.forEach((cat, index) => {
            let id = index; 
            html += `
            <div class="expense-row">
                <div class="cat-name">${cat}</div>
                
                <div>
                    <input type="number" inputmode="decimal" id="plan-${id}" class="mini-input" placeholder="0">
                </div>
                
                <div>
                    <input type="number" inputmode="decimal" id="fact-${id}" class="mini-input" placeholder="0">
                </div>

                <div id="balance-${id}" class="row-balance">0</div>
            </div>`;
        });
        container.innerHTML = html;

        this.categories.forEach((_, index) => {
            document.getElementById(`plan-${index}`).addEventListener('input', () => this.calculate());
            document.getElementById(`fact-${index}`).addEventListener('input', () => this.calculate());
        });
    },

    calculate: function() {
        let incomeVal = document.getElementById('income').value;
        this.data.income = incomeVal === '' ? '' : parseFloat(incomeVal);
        
        let totalSpent = 0;
        let displayIncome = parseFloat(this.data.income) || 0;

        this.categories.forEach((cat, index) => {
            let planEl = document.getElementById(`plan-${index}`);
            let factEl = document.getElementById(`fact-${index}`);
            let balanceEl = document.getElementById(`balance-${index}`);

            let plan = parseFloat(planEl.value) || 0;
            let fact = parseFloat(factEl.value) || 0;
            
            this.data.items[index] = { plan: planEl.value, fact: factEl.value };

            totalSpent += fact;

            // Рахуємо залишок по рядку
            let left = plan - fact;
            balanceEl.innerText = Math.round(left);

            // Колір цифри в рядку
            if (left < 0) {
                balanceEl.style.color = "#FF3B30"; // Червоний
            } else if (left > 0) {
                balanceEl.style.color = "#34C759"; // Зелений
            } else {
                balanceEl.style.color = "var(--text-sec)"; // Сірий
            }
        });

        // Загальні цифри
        document.getElementById('total-spent').innerText = "£" + totalSpent.toLocaleString();
        
        let globalRemaining = displayIncome - totalSpent;
        let globalEl = document.getElementById('global-remaining');
        
        globalEl.innerText = "£" + globalRemaining.toLocaleString();
        
        // --- ВИПРАВЛЕННЯ ВИДИМОСТІ ---
        if (globalRemaining < 0) {
            // Якщо мінус — червоний
            globalEl.style.color = "#FF3B30"; 
        } else {
            // Якщо плюс — скидаємо колір, щоб CSS зробив його білим у темній темі
            globalEl.style.color = ""; 
        }

        this.save();
    },

    save: function() {
        // Змінив ключ збереження, щоб старі дані не ламали нову таблицю
        localStorage.setItem('jarvis_budget_london_v4', JSON.stringify(this.data));
    },

    load: function() {
        let saved = localStorage.getItem('jarvis_budget_london_v4');
        if (saved) {
            this.data = JSON.parse(saved);
            document.getElementById('income').value = this.data.income;
            
            this.categories.forEach((cat, index) => {
                if (this.data.items[index]) {
                    document.getElementById(`plan-${index}`).value = this.data.items[index].plan;
                    document.getElementById(`fact-${index}`).value = this.data.items[index].fact;
                }
            });
        }
    }
};

window.addEventListener('DOMContentLoaded', () => {
    app.init();
});