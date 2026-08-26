console.log("Скрипт успішно підключено!");
         document.getElementById('productionForm').addEventListener('submit', function(e) {
            
            e.preventDefault(); 
            
            const submitBtn = document.getElementById('submitBtn');
            const messageDiv = document.getElementById('formMessage');
            submitBtn.innerText = 'Відправка...';
            submitBtn.disabled = true;

            // JS збирає дані з кожного поля за їхніми id
            const formData = {
                name: document.getElementById('clientName').value,
                phone: document.getElementById('clientPhone').value,
                product: document.getElementById('productType').value,
                color: document.getElementById('productColor').value,
                quantity: document.getElementById('productQuantity').value,
                comment: document.getElementById('clientComment').value
            };

            const webhookUrl = 'https://hook.eu1.make.com/e2wxmv95segkas79vlmrcn7euajgtx2p';

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
                    this.reset(); // Очищаємо поля форми
                }
            })
            .catch(error => {
                messageDiv.style.display = 'block';
                messageDiv.style.color = 'red';
                messageDiv.innerText = 'Помилка відправки.';
            })
            .finally(() => {
                submitBtn.innerText = 'Відправити заявку';
                submitBtn.disabled = false;
            });
        });
