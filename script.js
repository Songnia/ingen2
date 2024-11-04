// script.js

// Variables pour stocker les activités, les dépenses, et les catégories
let activities = JSON.parse(localStorage.getItem('activities')) || [];
let expenses = JSON.parse(localStorage.getItem('expenses')) || [];
let categories = JSON.parse(localStorage.getItem('categories')) || [];

// Elements du DOM
const activityForm = document.getElementById('activityForm');
const expenseForm = document.getElementById('expenseForm');
const activityNameInput = document.getElementById('activityName');
const monthlyIncomeInput = document.getElementById('monthlyIncome');
const monthlySavingsInput = document.getElementById('monthlySavings');
const expenseActivitySelect = document.getElementById('expenseActivity');
const expenseCategorySelect = document.getElementById('expenseCategory');
const expenseAmountInput = document.getElementById('expenseAmount');
const expenseDateInput = document.getElementById('expenseDate');
const addCategoryButton = document.getElementById('addCategoryButton');
const newCategoryInput = document.getElementById('newCategoryInput');
const dataDisplay = document.getElementById('dataDisplay').querySelector('tbody');

// Initialisation
function init() {
    updateActivityOptions();
    updateCategoryOptions();
    displayData();
}

// Ajouter une activité
activityForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const activity = {
        name: activityNameInput.value,
        monthlyIncome: parseFloat(monthlyIncomeInput.value),
        monthlySavings: parseFloat(monthlySavingsInput.value),
    };
    activities.push(activity);
    localStorage.setItem('activities', JSON.stringify(activities));
    activityForm.reset();
    updateActivityOptions(); // Met à jour les activités après chaque ajout
    displayData();
});

// Ajouter une dépense
expenseForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const expense = {
        activity: expenseActivitySelect.value,
        category: expenseCategorySelect.value,
        amount: parseFloat(expenseAmountInput.value),
        date: expenseDateInput.value,
    };
    expenses.push(expense);
    localStorage.setItem('expenses', JSON.stringify(expenses));
    expenseForm.reset();
    displayData();
});

// Afficher le champ pour ajouter une nouvelle catégorie
addCategoryButton.addEventListener('click', () => {
    newCategoryInput.style.display = 'inline';
    newCategoryInput.focus();
});

// Ajouter une nouvelle catégorie
newCategoryInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        const newCategory = newCategoryInput.value.trim();
        if (newCategory && !categories.includes(newCategory)) {
            categories.push(newCategory);
            localStorage.setItem('categories', JSON.stringify(categories));
            updateCategoryOptions(); // Met à jour la liste des catégories
        }
        newCategoryInput.value = '';
        newCategoryInput.style.display = 'none';
    }
});

// Mettre à jour les options de sélection d'activité
function updateActivityOptions() {
    expenseActivitySelect.innerHTML = ''; // Vider la liste pour éviter les doublons
    activities.forEach((activity) => {
        const option = document.createElement('option');
        option.value = activity.name;
        option.textContent = activity.name;
        expenseActivitySelect.appendChild(option);
    });
}

// Mettre à jour les options de sélection de catégorie
function updateCategoryOptions() {
    expenseCategorySelect.innerHTML = ''; // Vider la liste pour éviter les doublons
    categories.forEach((category) => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        expenseCategorySelect.appendChild(option);
    });
}

// Afficher les données dans le tableau
function displayData() {
    dataDisplay.innerHTML = '';
    const currentMonth = new Date().toLocaleString('fr-FR', { month: 'long' });

    activities.forEach((activity) => {
        const activityExpenses = expenses.filter(exp => exp.activity === activity.name);
        const totalExpenses = activityExpenses.reduce((sum, exp) => sum + exp.amount, 0);

        activityExpenses.forEach((expense) => {
            const expenseDate = new Date(expense.date);
            const day = expenseDate.toLocaleString('fr-FR', { weekday: 'long' });
            const row = document.createElement('tr');

            row.innerHTML = `
                <td>${activity.name}</td>
                <td>${currentMonth}</td>
                <td>${activity.monthlyIncome.toFixed(2)} FCFA</td>
                <td>${activity.monthlySavings.toFixed(2)} FCFA</td>
                <td>${expense.category}</td>
                <td>${day}, ${expenseDate.toLocaleDateString('fr-FR')}</td>
                <td>${expense.amount.toFixed(2)} FCFA</td>
                <td>${totalExpenses.toFixed(2)} FCFA</td>
            `;
            dataDisplay.appendChild(row);
        });
    });
}

// Initialisation de l'application
init();
