document.addEventListener('DOMContentLoaded', function() {
    function setupFormToggle() {
        document.querySelectorAll('.toggleFormButton').forEach(button => {
            button.addEventListener('click', function() {
                const formContainer = button.closest('.kanban-column').querySelector('.formContainer');
                if (formContainer) {
                    formContainer.classList.toggle('hidden');
                }
            });
        });
    }

    function setupCancelButton() {
        document.querySelectorAll('.cancelButton').forEach(button => {
            button.addEventListener('click', function() {
                const formContainer = button.closest('.formContainer');
                if (formContainer) {
                    formContainer.classList.add('hidden');
                }
            });
        });
    }

    function setupFormSubmission() {
        document.querySelectorAll('form').forEach(form => {
            form.addEventListener('submit', function(event) {
                event.preventDefault(); // Prevent the default form submission

                const formData = new FormData(form);
                const jsonData = {};
                formData.forEach((value, key) => {
                    jsonData[key] = value;
                });
                jsonData['status'] = form.closest('.kanban-column').querySelector('.kanban-column-header').innerText;

                fetch('/add_task/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFToken': getCookie('csrftoken')
                    },
                    body: JSON.stringify(jsonData)
                })
                .then(response => response.json())
                .then(data => {
                    if (data.status === 'success') {
                        const infoBlock = document.createElement('div');
                        infoBlock.className = 'infoBlock';
                        infoBlock.setAttribute('draggable', true);
                        infoBlock.id = 'info-' + data.task_id;
                        const content = document.createElement('span');
                        content.textContent = `${jsonData.name}, ${jsonData.deal}, ${jsonData.amountCurrency}`;
                        infoBlock.appendChild(content);
                        const deleteButton = document.createElement('button');
                        deleteButton.textContent = 'Delete';
                        deleteButton.className = 'deleteButton';
                        deleteButton.onclick = function() {
                            deleteTask(data.task_id);
                        };
                        infoBlock.appendChild(deleteButton);
                        enableDraggable(infoBlock);
                        const column = form.closest('.kanban-column');
                        const tasksContainer = column.querySelector('.kanban-column-content');
                        tasksContainer.appendChild(infoBlock);
                        form.closest('.formContainer').classList.add('hidden');
                        form.reset();
                    } else {
                        alert('Failed to save task.');
                    }
                });
            });
        });
    }

    function deleteTask(taskId) {
        fetch(`/delete_task/${taskId}/`, {
            method: 'POST',
            headers: {
                'X-CSRFToken': getCookie('csrftoken')
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                const taskElement = document.getElementById('info-' + taskId);
                if (taskElement) {
                    taskElement.remove();
                }
            } else {
                alert('Failed to delete task.');
            }
        });
    }

    function attachDeleteButtons() {
        document.querySelectorAll('.deleteButton').forEach(button => {
            const taskId = button.closest('.infoBlock').id.replace('info-', '');
            button.onclick = function() {
                deleteTask(taskId);
            };
        });
    }

    function enableDraggable(element) {
        element.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', e.target.id);
        });
    }

    function setupDropZones() {
        document.querySelectorAll('.kanban-column-content').forEach(zone => {
            zone.addEventListener('dragover', e => {
                e.preventDefault(); // Allows us to drop
                zone.classList.add('highlight');
            });

            zone.addEventListener('dragenter', e => {
                e.preventDefault();
                zone.classList.add('highlight');
            });

            zone.addEventListener('dragleave', () => {
                zone.classList.remove('highlight');
            });

            zone.addEventListener('drop', e => {
                e.preventDefault();
                const id = e.dataTransfer.getData('text/plain');
                const draggable = document.getElementById(id);
                const newStatus = zone.closest('.kanban-column').querySelector('.kanban-column-header').innerText;
                zone.appendChild(draggable);
                zone.classList.remove('highlight');
                updateTaskStatus(id.replace('info-', ''), newStatus);
            });
        });
    }

    function updateTaskStatus(taskId, newStatus) {
        fetch(`/update_task_status/${taskId}/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken')
            },
            body: JSON.stringify({ status: newStatus })
        })
        .then(response => response.json())
        .then(data => {
            if (data.status !== 'success') {
                alert('Failed to update task status.');
            }
        });
    }

    function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }

    // Initialize the functionality
    setupFormToggle();
    setupCancelButton();
    setupFormSubmission();
    setupDropZones();
    attachDeleteButtons();

    // Make deleteTask function available globally
    window.deleteTask = deleteTask;
});
