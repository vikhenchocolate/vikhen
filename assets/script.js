console.log("Скрипт VIKHEN успішно підключено!");

// Змінна для захисту від повторних кліків та дублювання запитів
let isSubmitting = false;

document.getElementById('productionForm').addEventListener('submit', function(e) {
    // 1. Зупиняємо стандартну відправку HTML-форми
    e.preventDefault(); 
    e.stopPropagation();

    // 2. Якщо відправка вже триває — ігноруємо повторні кліки
    if (isSubmitting) return;

    const submitBtn = document.getElementById('submitBtn');
    const messageDiv = document.getElementById('formMessage');

    // 3. Збираємо значення полів та обрізаємо пробіли з боків (.trim())
    const name = document.getElementById('clientName').value.trim();
    const rawPhone = document.getElementById('clientPhone').value.trim();
    const product = document.getElementById('productType').value;
    const color = document.getElementById('productColor').value;
    const quantity = document.getElementById('productQuantity').value || '1';
    const comment = document.getElementById('clientComment').value.trim();

    // 4. ВАЛІДАЦІЯ: Перевіряємо, чи введено ім'я та повний номер (рівно 9 цифр)
    if (!name || rawPhone.length < 9) {
        messageDiv.style.display = 'block';
        messageDiv.style.color = 'red';
        messageDiv.innerText = 'Введіть ім’я та повний номер телефону (9 цифр після +380)!';
        return;
    }

    // 5. Блокуємо відправку та кнопку
    isSubmitting = true;
    submitBtn.innerText = 'Відправка...';
    submitBtn.disabled = true;

    // 6. Формуємо повний номер із префіксом +380
    const fullPhone = '+380' + rawPhone;

    // 7. Створюємо чистий JSON-об'єкт для Make.com
    const formData = {
        name: name,
        phone: fullPhone,
        product: product,
        color: color,
        quantity: quantity,
        comment: comment,
        date: new Date().toLocaleString('uk-UA')
    };

    const webhookUrl = 'https://hook.eu1.make.com/e2wxmv95segkas79vlmrcn7euajgtx2p';

    // 8. Відправка запиту на Webhook
    fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
    })
    .then(response => {
        if (response.ok) {
            messageDiv.style.display = 'block';
            messageDiv.style.color = 'green';
            messageDiv.innerText = 'Заявку успішно відправлено!';
            document.getElementById('productionForm').reset(); // Очищаємо форму
        } else {
            throw new Error('Помилка сервера');
        }
    })
    .catch(error => {
        console.error('Помилка Webhook:', error);
        messageDiv.style.display = 'block';
        messageDiv.style.color = 'red';
        messageDiv.innerText = 'Помилка відправки. Спробуйте пізніше або зв’яжіться в Telegram.';
    })
    .finally(() => {
        // Розблоковуємо кнопку лише через 3 секунди після завершення запиту
        setTimeout(() => {
            submitBtn.innerText = 'Залишити заявку';
            submitBtn.disabled = false;
            isSubmitting = false;
        }, 3000);
    });
});
