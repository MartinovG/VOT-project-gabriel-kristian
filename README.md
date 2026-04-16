# DevOps Task Manager

## Описание на проекта (Project Description)
**Какъв проблем решава?**
Този проект представлява система за управление на задачи (Task Manager).

## Списък на използваните технологии
* **Програмен език и Фреймуърк:** Node.js (v20), Express.js
* **База данни:** PostgreSQL
* **CI/CD Автоматизация:** Jenkins (Continuous Integration), FluxCD (Continuous Deployment - GitOps)
* **Контейнеризация и Оркестрация:** Docker, Kubernetes
* **Infrastructure as Code (IaC):** Terraform
* **Secrets & Configuration Management:** Bitnami Sealed Secrets
* **Observability (Метрики и Логове):** Kube-Prometheus-Stack (Prometheus, Grafana, Alertmanager), Loki, Promtail
* **Code Quality & Security:** Husky (Pre-commit hooks), ESLint, Secretlint
* **Известия (Alerting):** Discord Webhooks

## Структура на проекта
* `src/` - Изходен код на Node.js Backend приложението (Routes, Database connection).
* `public/` - Изходен код на Frontend частта (HTML/CSS/JS).
* `tests/` - Unit тестове (с помощта на Supertest).
* `k8s/` - Kubernetes манифести, разделени на `app/` (за приложението) и `cluster/` (за GitOps контролерите и инфраструктурните компоненти).
* `terraform/` - Terraform конфигурации за провизиране на базовите Namespaces и Helm чартове (Sealed Secrets).
* `Jenkinsfile` - CI пайплайн за автоматизирано тестване и билдване.
* `Dockerfile` - Multi-stage конфигурация за създаване на image.

## Инструкции за стартиране (Стъпка по стъпка)

### 1. Локално стартиране (без Docker)
```
npm install
npm run dev
```

### 2. Стартиране чрез Docker (Контейнеризирано)
```
docker build -t task-manager-app .
docker run -p 3000:3000 task-manager-app
```

### 3. Пълен цикъл в Kubernetes (IaC + GitOps)

**Стъпка 3.1: Изграждане на базовата инфраструктура (Terraform)**
Чрез Terraform автоматично се създават нужните Namespaces и се инсталира Sealed Secrets контролера:
```
cd terraform
terraform init
terraform apply -auto-approve
```

**Стъпка 3.2: Деплоймънт чрез GitOps (FluxCD)**
Свързване на клъстера с GitHub хранилището. FluxCD автоматично ще започне да следи за промени и да изгражда ресурсите:
```
flux bootstrap github \
  --owner=MartinovG \
  --repository=VOT-project-gabriel-kristian \
  --branch=main \
  --path=./k8s/cluster \
  --personal
```

**Стъпка 3.3: Достъпване на услугите**
След като инфраструктурата се вдигне успешно, достъпете приложението и мониторинга чрез Port-Forward:

*За Web Приложението:*
```
kubectl port-forward svc/vot-express-service 8080:80
```
След това отворете `http://localhost:8080` във вашия браузър.

*За Grafana (Metrics & Logs):*
```
kubectl port-forward svc/monitoring-kube-prometheus-stack-grafana -n monitoring 3000:80
```
След това отворете `http://localhost:3000` (Потребител/Парола според вашите настройки).
